const express = require('express');
const router = express.Router();
const PagBankCertificateService = require('../services/pagbank_certificate_service');

const certificateService = new PagBankCertificateService();

/**
 * Verificar informações do ambiente
 * GET /api/certificate/info
 */
router.get('/info', (req, res) => {
    try {
        const info = certificateService.getEnvironmentInfo();
        res.status(200).json(info);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Solicitar Challenge para criar certificado
 * POST /api/certificate/challenge
 * Body: { access_token }
 */
router.post('/challenge', async (req, res) => {
    try {
        const { access_token } = req.body;
        
        if (!access_token) {
            return res.status(400).json({ 
                error: 'access_token é obrigatório',
                help: 'Obtenha via Connect Challenge com scope certificate.create'
            });
        }
        
        const challenge = await certificateService.requestChallenge(access_token);
        
        res.status(200).json({
            message: 'Challenge obtido com sucesso',
            challenge: challenge,
            next_step: 'Decripte o challenge e use na criação do certificado'
        });
    } catch (error) {
        console.error('❌ Erro ao solicitar challenge:', error.message);
        res.status(error.response?.status || 400).json({ 
            error: error.message,
            details: error.response?.data 
        });
    }
});

/**
 * Criar Certificado Digital
 * POST /api/certificate/create
 * Body: { access_token, decrypted_challenge }
 */
router.post('/create', async (req, res) => {
    try {
        const { access_token, decrypted_challenge } = req.body;
        
        if (!access_token || !decrypted_challenge) {
            return res.status(400).json({ 
                error: 'access_token e decrypted_challenge são obrigatórios' 
            });
        }
        
        const certificate = await certificateService.createCertificate(
            access_token,
            decrypted_challenge
        );
        
        // Salvar em arquivos
        const paths = await certificateService.saveCertificateToFiles(certificate);
        
        res.status(201).json({
            message: 'Certificado criado e salvo com sucesso',
            certificate: {
                created_at: certificate.created_at,
                validity: '2 anos'
            },
            paths: {
                key: paths.keyPath,
                pem: paths.pemPath
            },
            warning: 'Mantenha a chave privada segura! Não compartilhe ou commite no Git!'
        });
    } catch (error) {
        console.error('❌ Erro ao criar certificado:', error.message);
        res.status(error.response?.status || 400).json({ 
            error: error.message,
            details: error.response?.data 
        });
    }
});

/**
 * Consultar Certificado Atual
 * GET /api/certificate
 */
router.get('/', async (req, res) => {
    try {
        const certificate = await certificateService.getCertificate();
        
        res.status(200).json(certificate);
    } catch (error) {
        console.error('❌ Erro ao consultar certificado:', error.message);
        res.status(error.response?.status || 400).json({ 
            error: error.message,
            details: error.response?.data 
        });
    }
});

/**
 * Listar Certificados
 * GET /api/certificate/list
 */
router.get('/list', async (req, res) => {
    try {
        const certificates = await certificateService.listCertificates();
        
        res.status(200).json({
            count: certificates.length,
            certificates
        });
    } catch (error) {
        console.error('❌ Erro ao listar certificados:', error.message);
        res.status(error.response?.status || 400).json({ 
            error: error.message,
            details: error.response?.data 
        });
    }
});

/**
 * Verificar Validade do Certificado
 * GET /api/certificate/validity
 */
router.get('/validity', async (req, res) => {
    try {
        const validity = await certificateService.checkCertificateValidity();
        
        const warning = validity.days_until_expiry < 30 
            ? 'ATENÇÃO: Certificado expira em menos de 30 dias! Renove o quanto antes.'
            : null;
        
        res.status(200).json({
            ...validity,
            warning
        });
    } catch (error) {
        console.error('❌ Erro ao verificar validade:', error.message);
        res.status(error.response?.status || 400).json({ 
            error: error.message,
            details: error.response?.data 
        });
    }
});

/**
 * Carregar Certificado dos Arquivos
 * GET /api/certificate/load
 */
router.get('/load', async (req, res) => {
    try {
        const certificate = await certificateService.loadCertificateFromFiles();
        
        res.status(200).json({
            message: 'Certificado carregado com sucesso',
            paths: {
                key: certificate.keyPath,
                pem: certificate.pemPath
            },
            certificate_preview: {
                key_length: certificate.key.length,
                pem_length: certificate.pem.length
            }
        });
    } catch (error) {
        console.error('❌ Erro ao carregar certificado:', error.message);
        res.status(500).json({ 
            error: error.message,
            help: 'Verifique se o certificado foi criado e salvo corretamente'
        });
    }
});

module.exports = router;
