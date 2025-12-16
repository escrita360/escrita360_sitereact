/**
 * Serviço PagBank Digital Certificate (mTLS)
 * 
 * Gerencia certificados digitais mTLS para comunicação segura com PagBank.
 * Certificados são necessários para:
 * - API de Transferências (obrigatório)
 * - Outras APIs (opcional, mas recomendado)
 * 
 * Validade: 2 anos
 * Tipo: mTLS (Mutual Transport Layer Security)
 * 
 * Documentação: https://developer.pagbank.com.br/docs/certificado-digital
 */

const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
require('dotenv').config();

class PagBankCertificateService {
    constructor() {
        this.environment = process.env.PAGBANK_ENV || 'sandbox';
        
        this.baseUrl = this.environment === 'sandbox'
            ? 'https://sandbox.api.pagseguro.com'
            : 'https://api.pagseguro.com';

        this.token = process.env.PAGBANK_TOKEN;
        
        // Diretório para armazenar certificados
        this.certDir = path.join(__dirname, '..', '..', 'certificates');
    }

    /**
     * Headers padrão
     */
    getHeaders(challenge = null) {
        const headers = {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        if (challenge) {
            headers['X_CHALLENGE'] = challenge;
        }

        return headers;
    }

    // =========================
    // CONNECT CHALLENGE
    // =========================

    /**
     * Solicitar Challenge (Passo 1 para criar certificado)
     * 
     * Requer processo Connect para obter access_token com scope certificate.create
     * Documentação: https://developer.pagbank.com.br/docs/connect-challenge
     * 
     * @param {string} accessToken - Token com scope certificate.create
     * @returns {Object} Challenge encriptado
     */
    async requestChallenge(accessToken) {
        try {
            console.log('🔐 Solicitando challenge para certificado...');

            const response = await axios.post(
                `${this.baseUrl}/oauth2/challenge`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                }
            );

            console.log('✅ Challenge obtido');
            return response.data;
        } catch (error) {
            console.error('❌ Erro ao solicitar challenge:', error.response?.data || error.message);
            throw error;
        }
    }

    /**
     * Decriptar Challenge (Passo 2)
     * 
     * O challenge vem encriptado e deve ser decriptado usando o token
     */
    decryptChallenge(encryptedChallenge, privateKey) {
        try {
            console.log('🔓 Decriptando challenge...');
            
            // Decripta usando a chave privada
            const decrypted = crypto.privateDecrypt(
                {
                    key: privateKey,
                    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
                },
                Buffer.from(encryptedChallenge, 'base64')
            );

            const decryptedChallenge = decrypted.toString('utf8');
            console.log('✅ Challenge decriptado');
            
            return decryptedChallenge;
        } catch (error) {
            console.error('❌ Erro ao decriptar challenge:', error.message);
            throw error;
        }
    }

    // =========================
    // GERENCIAMENTO DE CERTIFICADO
    // =========================

    /**
     * Criar Certificado Digital (Passo 3)
     * POST /certificate/create
     * 
     * @param {string} accessToken - Token com scope certificate.create
     * @param {string} decryptedChallenge - Challenge decriptado
     * @returns {Object} Certificado (key e pem)
     */
    async createCertificate(accessToken, decryptedChallenge) {
        try {
            console.log('📜 Criando certificado digital...');

            const response = await axios.post(
                `${this.baseUrl}/certificate/create`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'X_CHALLENGE': decryptedChallenge,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                }
            );

            console.log('✅ Certificado criado com sucesso');
            console.log('   - Validade: 2 anos');
            console.log('   - Tipo: mTLS');
            
            return {
                key: response.data.key,       // Chave privada (base64)
                pem: response.data.pem,       // Certificado (base64)
                created_at: new Date().toISOString()
            };
        } catch (error) {
            console.error('❌ Erro ao criar certificado:', error.response?.data || error.message);
            throw error;
        }
    }

    /**
     * Consultar Certificado
     * GET /certificate
     */
    async getCertificate() {
        try {
            console.log('🔍 Consultando certificado...');

            const response = await axios.get(
                `${this.baseUrl}/certificate`,
                { headers: this.getHeaders() }
            );

            console.log('✅ Certificado encontrado');
            console.log('   - Expira em:', response.data.expires_at);
            
            return response.data;
        } catch (error) {
            console.error('❌ Erro ao consultar certificado:', error.response?.data || error.message);
            throw error;
        }
    }

    /**
     * Listar Certificados
     * GET /certificates
     */
    async listCertificates() {
        try {
            console.log('📋 Listando certificados...');

            const response = await axios.get(
                `${this.baseUrl}/certificates`,
                { headers: this.getHeaders() }
            );

            console.log(`✅ ${response.data.length || 0} certificado(s) encontrado(s)`);
            return response.data;
        } catch (error) {
            console.error('❌ Erro ao listar certificados:', error.response?.data || error.message);
            throw error;
        }
    }

    // =========================
    // ARMAZENAMENTO DE CERTIFICADO
    // =========================

    /**
     * Salvar Certificado em Arquivos
     * 
     * ⚠️ IMPORTANTE: Armazene em local seguro!
     * - Use criptografia para key
     * - Restrinja permissões de acesso
     * - Não commite no Git
     */
    async saveCertificateToFiles(certificate, filename = 'pagbank') {
        try {
            // Criar diretório se não existir
            await fs.mkdir(this.certDir, { recursive: true });

            const keyPath = path.join(this.certDir, `${filename}_${this.environment}.key`);
            const pemPath = path.join(this.certDir, `${filename}_${this.environment}.pem`);

            // Decodificar base64 e salvar
            await fs.writeFile(keyPath, Buffer.from(certificate.key, 'base64'));
            await fs.writeFile(pemPath, Buffer.from(certificate.pem, 'base64'));

            // Restringir permissões (Unix/Linux)
            if (process.platform !== 'win32') {
                await fs.chmod(keyPath, 0o600); // Apenas owner pode ler/escrever
                await fs.chmod(pemPath, 0o644); // Owner: rw, outros: r
            }

            console.log('✅ Certificado salvo com sucesso:');
            console.log('   - Chave privada:', keyPath);
            console.log('   - Certificado:', pemPath);
            console.log('\n⚠️  ATENÇÃO:');
            console.log('   - Mantenha a chave privada segura!');
            console.log('   - Não compartilhe ou commite no Git!');
            console.log('   - Adicione ao .gitignore: certificates/');

            return { keyPath, pemPath };
        } catch (error) {
            console.error('❌ Erro ao salvar certificado:', error.message);
            throw error;
        }
    }

    /**
     * Carregar Certificado dos Arquivos
     */
    async loadCertificateFromFiles(filename = 'pagbank') {
        try {
            const keyPath = path.join(this.certDir, `${filename}_${this.environment}.key`);
            const pemPath = path.join(this.certDir, `${filename}_${this.environment}.pem`);

            const key = await fs.readFile(keyPath, 'utf8');
            const pem = await fs.readFile(pemPath, 'utf8');

            console.log('✅ Certificado carregado dos arquivos');
            return { key, pem, keyPath, pemPath };
        } catch (error) {
            console.error('❌ Erro ao carregar certificado:', error.message);
            throw error;
        }
    }

    // =========================
    // FLUXO COMPLETO
    // =========================

    /**
     * Fluxo Completo: Criar e Salvar Certificado
     * 
     * Requer:
     * 1. Access token com scope certificate.create (via Connect Challenge)
     * 2. Chave privada para decriptar challenge
     * 
     * @param {string} accessToken - Token com scope certificate.create
     * @param {string} privateKey - Chave privada para decriptar challenge
     */
    async createAndSaveCertificate(accessToken, privateKey) {
        try {
            console.log('🚀 Iniciando criação de certificado digital...\n');

            // 1. Solicitar challenge
            const challengeData = await this.requestChallenge(accessToken);
            
            // 2. Decriptar challenge
            const decryptedChallenge = this.decryptChallenge(
                challengeData.encrypted_challenge,
                privateKey
            );

            // 3. Criar certificado
            const certificate = await this.createCertificate(
                accessToken,
                decryptedChallenge
            );

            // 4. Salvar em arquivos
            const paths = await this.saveCertificateToFiles(certificate);

            console.log('\n✅ Certificado criado e salvo com sucesso!');
            console.log('📋 Próximos passos:');
            console.log('   1. Configure PAGBANK_CERT_KEY_PATH no .env');
            console.log('   2. Configure PAGBANK_CERT_PEM_PATH no .env');
            console.log('   3. Use o certificado nas requisições mTLS');
            console.log('   4. Renove antes de expirar (2 anos)');

            return { certificate, paths };
        } catch (error) {
            console.error('\n❌ Falha ao criar certificado:', error.message);
            throw error;
        }
    }

    /**
     * Verificar Validade do Certificado
     */
    async checkCertificateValidity() {
        try {
            const cert = await this.getCertificate();
            const expiresAt = new Date(cert.expires_at);
            const now = new Date();
            const daysUntilExpiry = Math.floor((expiresAt - now) / (1000 * 60 * 60 * 24));

            console.log('📅 Validade do certificado:');
            console.log('   - Expira em:', expiresAt.toLocaleDateString());
            console.log('   - Dias restantes:', daysUntilExpiry);

            if (daysUntilExpiry < 30) {
                console.warn('⚠️  ATENÇÃO: Certificado expira em menos de 30 dias!');
                console.warn('   - Renove o certificado o quanto antes');
            }

            return { expires_at: expiresAt, days_until_expiry: daysUntilExpiry };
        } catch (error) {
            console.error('❌ Erro ao verificar validade:', error.message);
            throw error;
        }
    }

    // =========================
    // UTILITÁRIOS
    // =========================

    /**
     * Carregar Certificado para Requisições Axios
     */
    async getAxiosConfig() {
        try {
            const cert = await this.loadCertificateFromFiles();
            
            return {
                httpsAgent: new (require('https').Agent)({
                    cert: cert.pem,
                    key: cert.key,
                    rejectUnauthorized: this.environment === 'production'
                })
            };
        } catch (error) {
            console.error('❌ Erro ao configurar axios com certificado:', error.message);
            throw error;
        }
    }

    /**
     * Informações do ambiente
     */
    getEnvironmentInfo() {
        return {
            environment: this.environment,
            baseUrl: this.baseUrl,
            certDir: this.certDir,
            tokenConfigured: !!this.token
        };
    }
}

module.exports = PagBankCertificateService;
