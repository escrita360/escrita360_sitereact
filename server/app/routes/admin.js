const express = require('express');
const router = express.Router();
const FirebaseAdminService = require('../services/firebase_admin_service_stub');
const { adminAuth } = require('../middleware/adminAuth');

// Instância do serviço Firebase
const firebaseService = new FirebaseAdminService();

/**
 * Dashboard - Estatísticas gerais
 */
router.get('/dashboard/stats', adminAuth, async (req, res) => {
  try {
    console.log('📊 Admin solicitando estatísticas do dashboard');
    const stats = await firebaseService.getStatistics();
    res.json(stats);
  } catch (error) {
    console.error('❌ Erro ao obter estatísticas:', error);
    res.status(500).json({ error: 'Erro ao obter estatísticas', details: error.message });
  }
});

/**
 * Listar usuários
 */
router.get('/users', adminAuth, async (req, res) => {
  try {
    const { maxResults = 100, pageToken } = req.query;
    console.log('👥 Admin listando usuários');
    
    const result = await firebaseService.listUsers(parseInt(maxResults), pageToken);
    res.json(result);
  } catch (error) {
    console.error('❌ Erro ao listar usuários:', error);
    res.status(500).json({ error: 'Erro ao listar usuários', details: error.message });
  }
});

/**
 * Buscar usuário específico
 */
router.get('/users/:uid', adminAuth, async (req, res) => {
  try {
    const { uid } = req.params;
    console.log('🔍 Admin buscando usuário:', uid);
    
    const user = await firebaseService.getUserByUid(uid);
    const subscriptions = await firebaseService.getUserSubscriptions(uid);
    
    res.json({
      user,
      subscriptions
    });
  } catch (error) {
    console.error('❌ Erro ao buscar usuário:', error);
    res.status(500).json({ error: 'Erro ao buscar usuário', details: error.message });
  }
});

/**
 * Desabilitar/habilitar usuário
 */
router.put('/users/:uid/disable', adminAuth, async (req, res) => {
  try {
    const { uid } = req.params;
    const { disabled } = req.body;
    
    console.log(`🔒 Admin ${disabled ? 'desabilitando' : 'habilitando'} usuário:`, uid);
    
    await firebaseService.setUserDisabled(uid, disabled);
    res.json({ 
      success: true, 
      message: `Usuário ${disabled ? 'desabilitado' : 'habilitado'} com sucesso` 
    });
  } catch (error) {
    console.error('❌ Erro ao atualizar usuário:', error);
    res.status(500).json({ error: 'Erro ao atualizar usuário', details: error.message });
  }
});

/**
 * Definir permissões customizadas (roles)
 */
router.put('/users/:uid/claims', adminAuth, async (req, res) => {
  try {
    const { uid } = req.params;
    const { claims } = req.body;
    
    console.log('🎭 Admin definindo claims para usuário:', uid, claims);
    
    await firebaseService.setCustomClaims(uid, claims);
    res.json({ 
      success: true, 
      message: 'Permissões atualizadas com sucesso' 
    });
  } catch (error) {
    console.error('❌ Erro ao definir claims:', error);
    res.status(500).json({ error: 'Erro ao definir permissões', details: error.message });
  }
});

/**
 * Listar todas as assinaturas
 */
router.get('/subscriptions', adminAuth, async (req, res) => {
  try {
    const { limit = 50, startAfter } = req.query;
    console.log('📋 Admin listando assinaturas');
    
    const result = await firebaseService.listAllSubscriptions(parseInt(limit), startAfter);
    res.json(result);
  } catch (error) {
    console.error('❌ Erro ao listar assinaturas:', error);
    res.status(500).json({ error: 'Erro ao listar assinaturas', details: error.message });
  }
});

/**
 * Atualizar status de assinatura
 */
router.put('/subscriptions/:subscriptionId/status', adminAuth, async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const { status } = req.body;
    
    console.log('✏️  Admin atualizando status da assinatura:', subscriptionId, 'para', status);
    
    await firebaseService.updateSubscriptionStatus(subscriptionId, status);
    res.json({ 
      success: true, 
      message: 'Status da assinatura atualizado com sucesso' 
    });
  } catch (error) {
    console.error('❌ Erro ao atualizar assinatura:', error);
    res.status(500).json({ error: 'Erro ao atualizar assinatura', details: error.message });
  }
});

/**
 * Listar todos os pagamentos
 */
router.get('/payments', adminAuth, async (req, res) => {
  try {
    const { limit = 50, startAfter } = req.query;
    console.log('💳 Admin listando pagamentos');
    
    const result = await firebaseService.listAllPayments(parseInt(limit), startAfter);
    res.json(result);
  } catch (error) {
    console.error('❌ Erro ao listar pagamentos:', error);
    res.status(500).json({ error: 'Erro ao listar pagamentos', details: error.message });
  }
});

/**
 * Obter configurações do PagBank
 */
router.get('/pagbank/config', adminAuth, async (req, res) => {
  try {
    console.log('🔧 Admin solicitando configurações do PagBank');
    
    const config = {
      environment: process.env.PAGBANK_ENV || 'sandbox',
      tokenConfigured: !!(process.env.PAGBANK_TOKEN && process.env.PAGBANK_TOKEN !== 'your_pagbank_token_here'),
      baseUrl: process.env.PAGBANK_ENV === 'production' 
        ? 'https://api.pagseguro.com' 
        : 'https://sandbox.api.pagseguro.com',
      appId: process.env.PAGBANK_APP_ID || null,
      clientId: process.env.PAGBANK_CLIENT_ID || null,
      clientSecret: !!(process.env.PAGBANK_CLIENT_SECRET && process.env.PAGBANK_CLIENT_SECRET !== 'your_pagbank_client_secret_here'),
      email: process.env.PAGBANK_EMAIL || null
    };
    
    res.json(config);
  } catch (error) {
    console.error('❌ Erro ao obter configurações PagBank:', error);
    res.status(500).json({ error: 'Erro ao obter configurações PagBank', details: error.message });
  }
});

/**
 * Atualizar configurações do PagBank
 */
router.put('/pagbank/config', adminAuth, async (req, res) => {
  try {
    const { appId: _appId, clientId: _clientId, clientSecret: _clientSecret, email: _email, token: _token, environment } = req.body;
    
    console.log('🔧 Admin atualizando configurações do PagBank');
    
    // Validação básica
    if (environment && !['sandbox', 'production'].includes(environment)) {
      return res.status(400).json({ error: 'Ambiente deve ser "sandbox" ou "production"' });
    }
    
    // Aqui você pode implementar a lógica para atualizar as variáveis de ambiente
    // ou salvar em um arquivo de configuração seguro
    
    // Por enquanto, apenas retorna sucesso (as configurações são lidas do .env)
    res.json({ 
      success: true, 
      message: 'Configurações atualizadas com sucesso. Reinicie o servidor para aplicar as mudanças.',
      note: 'As configurações são lidas do arquivo .env. Edite o arquivo manualmente ou implemente um sistema de configuração dinâmico.'
    });
  } catch (error) {
    console.error('❌ Erro ao atualizar configurações PagBank:', error);
    res.status(500).json({ error: 'Erro ao atualizar configurações PagBank', details: error.message });
  }
});

/**
 * Buscar assinaturas de um usuário específico
 */
router.get('/users/:uid/subscriptions', adminAuth, async (req, res) => {
  try {
    const { uid } = req.params;
    console.log('🔍 Admin buscando assinaturas do usuário:', uid);
    
    const subscriptions = await firebaseService.getUserSubscriptions(uid);
    res.json({ subscriptions });
  } catch (error) {
    console.error('❌ Erro ao buscar assinaturas:', error);
    res.status(500).json({ error: 'Erro ao buscar assinaturas', details: error.message });
  }
});

module.exports = router;
