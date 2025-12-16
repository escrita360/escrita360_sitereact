/**
 * Script de Teste - Certificado Digital PagBank
 * 
 * Testa o fluxo de gerenciamento de certificados:
 * 1. Verificar ambiente
 * 2. Verificar validade do certificado
 * 3. Carregar certificado dos arquivos
 * 
 * Execute: node test-certificate.js
 */

require('dotenv').config();
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

const API_URL = process.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('🧪 Testando Certificado Digital PagBank\n');

async function testCertificateInfo() {
    console.log('📊 1. Verificando informações do ambiente...');
    try {
        const response = await axios.get(`${API_URL}/certificate/info`);
        console.log('✅ Informações:', response.data);
        return true;
    } catch (error) {
        console.error('❌ Erro:', error.response?.data || error.message);
        return false;
    }
}

async function testCertificateExists() {
    console.log('\n🔍 2. Verificando se certificado existe...');
    try {
        const certDir = path.join(__dirname, 'server', 'certificates');
        const env = process.env.PAGBANK_ENV || 'sandbox';
        const keyPath = path.join(certDir, `pagbank_${env}.key`);
        const pemPath = path.join(certDir, `pagbank_${env}.pem`);

        const keyExists = await fs.access(keyPath).then(() => true).catch(() => false);
        const pemExists = await fs.access(pemPath).then(() => true).catch(() => false);

        if (keyExists && pemExists) {
            console.log('✅ Certificado encontrado:');
            console.log('   - Key:', keyPath);
            console.log('   - Pem:', pemPath);
            return true;
        } else {
            console.log('ℹ️  Certificado não encontrado no diretório local');
            console.log('   Crie um certificado seguindo: docs/PAGBANK_CERTIFICATE.md');
            return false;
        }
    } catch (error) {
        console.error('❌ Erro ao verificar certificado:', error.message);
        return false;
    }
}

async function testLoadCertificate() {
    console.log('\n📂 3. Carregando certificado dos arquivos...');
    try {
        const response = await axios.get(`${API_URL}/certificate/load`);
        console.log('✅ Certificado carregado:');
        console.log('   - Key length:', response.data.certificate_preview.key_length);
        console.log('   - Pem length:', response.data.certificate_preview.pem_length);
        return true;
    } catch (error) {
        console.error('❌ Erro:', error.response?.data || error.message);
        return false;
    }
}

async function testCertificateValidity() {
    console.log('\n📅 4. Verificando validade do certificado...');
    try {
        const response = await axios.get(`${API_URL}/certificate/validity`);
        console.log('✅ Validade:');
        console.log('   - Expira em:', new Date(response.data.expires_at).toLocaleDateString());
        console.log('   - Dias restantes:', response.data.days_until_expiry);
        
        if (response.data.warning) {
            console.warn('   ⚠️ ', response.data.warning);
        }
        
        return true;
    } catch (error) {
        console.error('❌ Erro:', error.response?.data || error.message);
        return false;
    }
}

async function testListCertificates() {
    console.log('\n📋 5. Listando certificados...');
    try {
        const response = await axios.get(`${API_URL}/certificate/list`);
        console.log(`✅ ${response.data.count} certificado(s) encontrado(s)`);
        
        if (response.data.certificates && response.data.certificates.length > 0) {
            response.data.certificates.forEach((cert, index) => {
                console.log(`   ${index + 1}. Expira em:`, new Date(cert.expires_at).toLocaleDateString());
            });
        }
        
        return true;
    } catch (error) {
        console.error('❌ Erro:', error.response?.data || error.message);
        return false;
    }
}

async function showInstructions() {
    console.log('\n' + '═'.repeat(60));
    console.log('📚 COMO CRIAR UM CERTIFICADO DIGITAL');
    console.log('═'.repeat(60));
    console.log('\nPara criar um novo certificado, siga estes passos:\n');
    console.log('1. Obter Token com Scope certificate.create:');
    console.log('   - Use Connect Challenge (OAuth 2.0)');
    console.log('   - Documentação: docs/PAGBANK_CONNECT.md\n');
    console.log('2. Solicitar Challenge:');
    console.log('   curl -X POST http://localhost:5000/api/certificate/challenge \\');
    console.log('     -H "Content-Type: application/json" \\');
    console.log('     -d \'{"access_token": "TOKEN_COM_SCOPE"}\'\n');
    console.log('3. Decriptar Challenge:');
    console.log('   - Use chave privada RSA para decriptar\n');
    console.log('4. Criar Certificado:');
    console.log('   curl -X POST http://localhost:5000/api/certificate/create \\');
    console.log('     -H "Content-Type: application/json" \\');
    console.log('     -d \'{"access_token": "TOKEN", "decrypted_challenge": "CHALLENGE"}\'\n');
    console.log('📖 Guia completo: docs/PAGBANK_CERTIFICATE.md\n');
}

async function runAllTests() {
    console.log('═'.repeat(60));
    console.log('🚀 TESTE DO CERTIFICADO DIGITAL PAGBANK');
    console.log('═'.repeat(60));
    
    // 1. Verificar ambiente
    await testCertificateInfo();
    
    // 2. Verificar se certificado existe localmente
    const certExists = await testCertificateExists();
    
    if (!certExists) {
        await showInstructions();
        return;
    }
    
    // 3. Carregar certificado
    const loaded = await testLoadCertificate();
    
    if (!loaded) {
        console.log('\n⚠️  Certificado local existe mas não pôde ser carregado');
        console.log('   Verifique as permissões dos arquivos');
        return;
    }
    
    // 4. Verificar validade (requer API PagBank)
    await testCertificateValidity();
    
    // 5. Listar certificados (requer API PagBank)
    await testListCertificates();
    
    console.log('\n' + '═'.repeat(60));
    console.log('✅ TESTES CONCLUÍDOS');
    console.log('═'.repeat(60));
    console.log('\n📋 Próximos passos:');
    console.log('   1. Use o certificado em requisições mTLS');
    console.log('   2. Monitore a validade (renove 30 dias antes)');
    console.log('   3. Configure backup seguro');
    console.log('   4. Leia docs/PAGBANK_CERTIFICATE.md para mais detalhes\n');
}

// Executar testes
runAllTests().catch(console.error);
