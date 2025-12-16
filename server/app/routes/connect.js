const express = require('express');
const router = express.Router();
const PagBankConnectService = require('../services/pagbank_connect_service');

const connectService = new PagBankConnectService();

/**
 * Verificar configuração do Connect
 * GET /api/connect/status
 */
router.get('/status', (req, res) => {
    try {
        const status = connectService.getEnvironmentInfo();
        res.status(200).json({
            ...status,
            message: status.configured 
                ? 'PagBank Connect configurado corretamente' 
                : 'PagBank Connect não configurado completamente'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Criar Aplicação PagBank Connect
 * POST /api/connect/application
 */
router.post('/application', async (req, res) => {
    try {
        console.log('📝 Recebendo solicitação para criar aplicação...');
        
        const application = await connectService.createApplication(req.body);
        
        res.status(201).json({
            message: 'Aplicação criada com sucesso',
            application
        });
    } catch (error) {
        console.error('❌ Erro ao criar aplicação:', error.message);
        res.status(error.response?.status || 400).json({ 
            error: error.message,
            details: error.response?.data 
        });
    }
});

/**
 * Consultar Aplicação
 * GET /api/connect/application
 */
router.get('/application', async (req, res) => {
    try {
        console.log('🔍 Consultando aplicação...');
        
        const application = await connectService.getApplication();
        
        res.status(200).json(application);
    } catch (error) {
        console.error('❌ Erro ao consultar aplicação:', error.message);
        res.status(error.response?.status || 400).json({ 
            error: error.message,
            details: error.response?.data 
        });
    }
});

/**
 * Obter URL de Autorização (Connect Authorization)
 * GET /api/connect/authorize-url?scope=payments.read+payments.create
 */
router.get('/authorize-url', (req, res) => {
    try {
        const scope = req.query.scope || 'payments.read payments.create';
        const authUrl = connectService.getAuthorizationUrl(scope);
        
        res.status(200).json({
            authorization_url: authUrl,
            instructions: 'Redirecione o usuário para esta URL para autorização'
        });
    } catch (error) {
        console.error('❌ Erro ao gerar URL de autorização:', error.message);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Solicitar Autorização via SMS
 * POST /api/connect/authorize-sms
 * Body: { email, phone }
 */
router.post('/authorize-sms', async (req, res) => {
    try {
        const { email, phone } = req.body;
        
        if (!email || !phone) {
            return res.status(400).json({ 
                error: 'Email e telefone são obrigatórios' 
            });
        }
        
        const result = await connectService.requestAuthorizationViaSMS(email, phone);
        
        res.status(200).json({
            message: 'Código SMS enviado com sucesso',
            ...result
        });
    } catch (error) {
        console.error('❌ Erro ao solicitar autorização via SMS:', error.message);
        res.status(error.response?.status || 400).json({ 
            error: error.message,
            details: error.response?.data 
        });
    }
});

/**
 * Obter Access Token (trocar código por token)
 * POST /api/connect/token
 * Body: { grant_type, code?, sms_code?, code_verifier? }
 */
router.post('/token', async (req, res) => {
    try {
        const tokenData = req.body;
        
        if (!tokenData.grant_type) {
            return res.status(400).json({ 
                error: 'grant_type é obrigatório (authorization_code, sms ou challenge)' 
            });
        }
        
        const token = await connectService.getAccessToken(tokenData);
        
        res.status(200).json({
            message: 'Access token obtido com sucesso',
            ...token
        });
    } catch (error) {
        console.error('❌ Erro ao obter access token:', error.message);
        res.status(error.response?.status || 400).json({ 
            error: error.message,
            details: error.response?.data 
        });
    }
});

/**
 * Renovar Access Token
 * POST /api/connect/token/refresh
 * Body: { refresh_token }
 */
router.post('/token/refresh', async (req, res) => {
    try {
        const { refresh_token } = req.body;
        
        if (!refresh_token) {
            return res.status(400).json({ 
                error: 'refresh_token é obrigatório' 
            });
        }
        
        const token = await connectService.refreshAccessToken(refresh_token);
        
        res.status(200).json({
            message: 'Access token renovado com sucesso',
            ...token
        });
    } catch (error) {
        console.error('❌ Erro ao renovar access token:', error.message);
        res.status(error.response?.status || 400).json({ 
            error: error.message,
            details: error.response?.data 
        });
    }
});

/**
 * Revogar Access Token
 * POST /api/connect/token/revoke
 * Body: { access_token }
 */
router.post('/token/revoke', async (req, res) => {
    try {
        const { access_token } = req.body;
        
        if (!access_token) {
            return res.status(400).json({ 
                error: 'access_token é obrigatório' 
            });
        }
        
        await connectService.revokeAccessToken(access_token);
        
        res.status(200).json({
            message: 'Access token revogado com sucesso'
        });
    } catch (error) {
        console.error('❌ Erro ao revogar access token:', error.message);
        res.status(error.response?.status || 400).json({ 
            error: error.message,
            details: error.response?.data 
        });
    }
});

/**
 * Callback de Autorização (Connect Authorization)
 * GET /api/connect/callback?code=...
 * 
 * Esta rota recebe o código de autorização após o usuário aprovar
 */
router.get('/callback', async (req, res) => {
    try {
        const { code, error } = req.query;
        
        if (error) {
            console.error('❌ Erro na autorização:', error);
            return res.status(400).json({ 
                error: 'Autorização negada pelo usuário',
                details: error 
            });
        }
        
        if (!code) {
            return res.status(400).json({ 
                error: 'Código de autorização não fornecido' 
            });
        }
        
        // Troca o código por access_token
        const token = await connectService.getAccessToken({
            grant_type: 'authorization_code',
            code: code
        });
        
        // Aqui você deve salvar o token no banco de dados
        // associado ao usuário/vendedor
        
        // Por enquanto, apenas retorna o token
        res.status(200).json({
            message: 'Autorização concedida com sucesso',
            ...token,
            instructions: 'Salve o access_token e refresh_token no banco de dados'
        });
    } catch (error) {
        console.error('❌ Erro no callback:', error.message);
        res.status(error.response?.status || 500).json({ 
            error: error.message,
            details: error.response?.data 
        });
    }
});

module.exports = router;
