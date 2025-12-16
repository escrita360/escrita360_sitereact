/**
 * Serviço PagBank Connect - Gerenciamento de OAuth 2.0 e Aplicações
 * 
 * Este serviço implementa o fluxo completo do PagBank Connect:
 * 1. Criação de aplicação
 * 2. Solicitação de autorização do usuário (Connect Authorization ou SMS)
 * 3. Obtenção de access_token
 * 4. Renovação de access_token
 * 5. Revogação de access_token
 * 
 * Documentação: https://developer.pagbank.com.br/docs/connect
 */

const axios = require('axios');
require('dotenv').config();

class PagBankConnectService {
    constructor() {
        this.environment = process.env.PAGBANK_ENV || 'sandbox';
        
        // URLs conforme documentação
        this.baseUrl = this.environment === 'sandbox'
            ? 'https://sandbox.api.pagseguro.com'
            : 'https://api.pagseguro.com';

        // URLs de autorização
        this.authUrl = this.environment === 'sandbox'
            ? 'https://sandbox.pagseguro.uol.com.br'
            : 'https://pagseguro.uol.com.br';

        this.token = process.env.PAGBANK_TOKEN;
        this.clientId = process.env.PAGBANK_CLIENT_ID;
        this.clientSecret = process.env.PAGBANK_CLIENT_SECRET;
        this.redirectUri = process.env.PAGBANK_REDIRECT_URI;

        if (!this.token) {
            console.warn('⚠️ PAGBANK_TOKEN não configurado');
        }
    }

    /**
     * Headers padrão para requisições
     */
    getHeaders() {
        return {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
    }

    // =========================
    // GERENCIAMENTO DE APLICAÇÃO
    // =========================

    /**
     * Criar Aplicação PagBank Connect
     * POST /oauth2/application
     * 
     * @param {Object} appData - Dados da aplicação
     * @param {string} appData.name - Nome da aplicação (obrigatório)
     * @param {string} appData.description - Descrição
     * @param {string} appData.site - URL do site
     * @param {string} appData.redirect_uri - URL de redirecionamento (obrigatório para Connect Authorization)
     * @param {string} appData.logo - URL do logo (220x80 mínimo, 440x160 ideal)
     * @returns {Object} Dados da aplicação criada (client_id, account_id)
     */
    async createApplication(appData) {
        try {
            console.log('📝 Criando aplicação PagBank Connect...');

            const response = await axios.post(
                `${this.baseUrl}/oauth2/application`,
                {
                    name: appData.name,
                    description: appData.description || '',
                    site: appData.site || '',
                    redirect_uri: appData.redirect_uri || this.redirectUri,
                    logo: appData.logo || ''
                },
                { headers: this.getHeaders() }
            );

            console.log('✅ Aplicação criada:', {
                client_id: response.data.client_id,
                account_id: response.data.account_id
            });

            return response.data;
        } catch (error) {
            console.error('❌ Erro ao criar aplicação:', error.response?.data || error.message);
            throw error;
        }
    }

    /**
     * Consultar Aplicação
     * GET /oauth2/application
     * 
     * @returns {Object} Dados da aplicação
     */
    async getApplication() {
        try {
            console.log('🔍 Consultando aplicação...');

            const response = await axios.get(
                `${this.baseUrl}/oauth2/application`,
                { headers: this.getHeaders() }
            );

            console.log('✅ Aplicação encontrada:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Erro ao consultar aplicação:', error.response?.data || error.message);
            throw error;
        }
    }

    // =========================
    // AUTORIZAÇÃO DO USUÁRIO
    // =========================

    /**
     * Gerar URL de Autorização (Connect Authorization)
     * 
     * Redireciona o usuário para a página de autorização do PagBank.
     * Após aprovação, o usuário é redirecionado para redirect_uri com o código de autorização.
     * 
     * @param {string} scope - Escopo de permissões (ex: 'payments.read payments.create')
     * @returns {string} URL para redirecionar o usuário
     */
    getAuthorizationUrl(scope = 'payments.read payments.create') {
        const params = new URLSearchParams({
            response_type: 'code',
            client_id: this.clientId,
            redirect_uri: this.redirectUri,
            scope: scope
        });

        const authUrl = `${this.authUrl}/v2/oauth2/authorize?${params.toString()}`;
        console.log('🔗 URL de autorização:', authUrl);
        
        return authUrl;
    }

    /**
     * Solicitar Autorização via SMS
     * POST /oauth2/authorization-request
     * 
     * @param {string} email - Email do usuário
     * @param {string} phone - Telefone do usuário
     * @returns {Object} Dados da solicitação (sms_code será enviado por SMS)
     */
    async requestAuthorizationViaSMS(email, phone) {
        try {
            console.log('📱 Solicitando autorização via SMS...');

            const response = await axios.post(
                `${this.baseUrl}/oauth2/authorization-request`,
                {
                    email: email,
                    phone: phone
                },
                { headers: this.getHeaders() }
            );

            console.log('✅ SMS enviado para', phone);
            return response.data;
        } catch (error) {
            console.error('❌ Erro ao solicitar autorização via SMS:', error.response?.data || error.message);
            throw error;
        }
    }

    // =========================
    // GERENCIAMENTO DE TOKEN
    // =========================

    /**
     * Obter Access Token
     * POST /oauth2/token
     * 
     * Troca o código de autorização por um access_token
     * 
     * @param {Object} tokenData
     * @param {string} tokenData.grant_type - 'authorization_code', 'sms' ou 'challenge'
     * @param {string} tokenData.code - Código de autorização (para authorization_code)
     * @param {string} tokenData.sms_code - Código SMS (para sms)
     * @param {string} tokenData.code_verifier - Verificador (para challenge)
     * @returns {Object} Token data (access_token, refresh_token, expires_in)
     */
    async getAccessToken(tokenData) {
        try {
            console.log('🔑 Obtendo access_token...');

            const payload = {
                grant_type: tokenData.grant_type,
                client_id: this.clientId,
                client_secret: this.clientSecret
            };

            // Adiciona parâmetros específicos do tipo de grant
            if (tokenData.grant_type === 'authorization_code') {
                payload.code = tokenData.code;
                payload.redirect_uri = this.redirectUri;
            } else if (tokenData.grant_type === 'sms') {
                payload.sms_code = tokenData.sms_code;
            } else if (tokenData.grant_type === 'challenge') {
                payload.code_verifier = tokenData.code_verifier;
            }

            const response = await axios.post(
                `${this.baseUrl}/oauth2/token`,
                payload,
                { headers: this.getHeaders() }
            );

            console.log('✅ Access token obtido com sucesso');
            
            return {
                access_token: response.data.access_token,
                refresh_token: response.data.refresh_token,
                expires_in: response.data.expires_in,
                token_type: response.data.token_type,
                scope: response.data.scope
            };
        } catch (error) {
            console.error('❌ Erro ao obter access token:', error.response?.data || error.message);
            throw error;
        }
    }

    /**
     * Renovar Access Token
     * POST /oauth2/token
     * 
     * @param {string} refreshToken - Refresh token atual
     * @returns {Object} Novo access_token e refresh_token
     */
    async refreshAccessToken(refreshToken) {
        try {
            console.log('🔄 Renovando access_token...');

            const response = await axios.post(
                `${this.baseUrl}/oauth2/token`,
                {
                    grant_type: 'refresh_token',
                    refresh_token: refreshToken,
                    client_id: this.clientId,
                    client_secret: this.clientSecret
                },
                { headers: this.getHeaders() }
            );

            console.log('✅ Access token renovado com sucesso');
            
            return {
                access_token: response.data.access_token,
                refresh_token: response.data.refresh_token,
                expires_in: response.data.expires_in
            };
        } catch (error) {
            console.error('❌ Erro ao renovar access token:', error.response?.data || error.message);
            throw error;
        }
    }

    /**
     * Revogar Access Token
     * POST /oauth2/revoke
     * 
     * @param {string} accessToken - Token a ser revogado
     */
    async revokeAccessToken(accessToken) {
        try {
            console.log('🚫 Revogando access_token...');

            await axios.post(
                `${this.baseUrl}/oauth2/revoke`,
                {
                    token: accessToken,
                    client_id: this.clientId,
                    client_secret: this.clientSecret
                },
                { headers: this.getHeaders() }
            );

            console.log('✅ Access token revogado com sucesso');
        } catch (error) {
            console.error('❌ Erro ao revogar access token:', error.response?.data || error.message);
            throw error;
        }
    }

    // =========================
    // UTILITÁRIOS
    // =========================

    /**
     * Valida se o Connect está configurado corretamente
     */
    isConfigured() {
        const configured = !!(
            this.token &&
            this.clientId &&
            this.clientSecret &&
            this.redirectUri
        );

        if (!configured) {
            console.warn('⚠️ PagBank Connect não está completamente configurado:', {
                token: !!this.token,
                clientId: !!this.clientId,
                clientSecret: !!this.clientSecret,
                redirectUri: !!this.redirectUri
            });
        }

        return configured;
    }

    /**
     * Informações do ambiente
     */
    getEnvironmentInfo() {
        return {
            environment: this.environment,
            baseUrl: this.baseUrl,
            authUrl: this.authUrl,
            configured: this.isConfigured()
        };
    }
}

module.exports = PagBankConnectService;
