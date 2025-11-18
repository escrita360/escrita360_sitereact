const express = require('express');
const router = express.Router();
const PagBankRecurrenceService = require('../services/pagbank_recurrence_service');

const pagbankRecurrenceService = new PagBankRecurrenceService();

/**
 * Webhook do PagBank para Notificações de Recorrência
 * POST /api/webhook/pagbank
 * 
 * O PagBank envia notificações para este endpoint quando eventos ocorrem:
 * - Mudança de status de assinatura
 * - Pagamento efetuado
 * - Pagamento falhou
 * - Assinatura cancelada
 * - etc.
 * 
 * Documentação: https://dev.pagbank.uol.com.br/reference/retorno-das-notificacoes
 */
router.post('/pagbank', async (req, res) => {
    try {
        console.log('🔔 Webhook PagBank recebido');
        console.log('📦 Headers:', req.headers);
        console.log('📦 Body:', req.body);

        // O PagBank envia notificationCode no body
        const { notificationCode, notificationType } = req.body;

        if (!notificationCode) {
            console.error('❌ notificationCode não encontrado');
            return res.status(400).json({ error: 'notificationCode é obrigatório' });
        }

        // Consultar detalhes da notificação na API do PagBank
        const notificationData = await pagbankRecurrenceService.getSubscriptionByNotification(notificationCode);
        
        console.log('📋 Dados da notificação:', notificationData);

        // Processar a notificação baseado no tipo
        await processNotification(notificationData, notificationType);

        // Responder com 200 OK para confirmar recebimento
        res.status(200).json({ received: true });
    } catch (error) {
        console.error('❌ Erro ao processar webhook:', error.message);
        // Mesmo com erro, retornar 200 para não reenviar notificação
        res.status(200).json({ received: true, error: error.message });
    }
});

/**
 * Processar notificação baseado no status
 */
async function processNotification(data, notificationType) {
    console.log(`📊 Processando notificação tipo: ${notificationType}`);
    
    const status = data.status;
    const code = data.code;
    const reference = data.reference;

    switch (status) {
        case 'INITIATED':
            console.log('⏳ Assinatura iniciada, aguardando pagamento');
            // TODO: Atualizar banco de dados
            break;

        case 'PENDING':
            console.log('⏳ Pagamento em análise');
            // TODO: Atualizar banco de dados
            break;

        case 'ACTIVE':
            console.log('✅ Assinatura ativa e paga');
            // TODO: Atualizar banco de dados, ativar acesso do usuário
            break;

        case 'PAYMENT_METHOD_CHANGE':
            console.log('💳 Cartão precisa ser atualizado');
            // TODO: Notificar usuário para atualizar cartão
            break;

        case 'SUSPENDED':
            console.log('⏸️ Assinatura suspensa');
            // TODO: Suspender acesso do usuário
            break;

        case 'CANCELLED':
        case 'CANCELLED_BY_RECEIVER':
        case 'CANCELLED_BY_SENDER':
            console.log('❌ Assinatura cancelada');
            // TODO: Cancelar acesso do usuário
            break;

        case 'EXPIRED':
            console.log('🕐 Assinatura expirada');
            // TODO: Remover acesso do usuário
            break;

        default:
            console.log(`ℹ️ Status desconhecido: ${status}`);
    }

    // Armazenar histórico de notificações
    await storeNotificationHistory({
        code,
        reference,
        status,
        notificationType,
        data,
        receivedAt: new Date()
    });
}

/**
 * Armazenar histórico de notificações (exemplo)
 * TODO: Implementar com banco de dados real
 */
async function storeNotificationHistory(notificationRecord) {
    console.log('💾 Armazenando histórico de notificação:', notificationRecord);
    // Implementar storage (banco de dados, arquivo, etc.)
}

/**
 * Endpoint de teste do webhook
 * GET /api/webhook/pagbank/test
 */
router.get('/pagbank/test', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Webhook PagBank está funcionando',
        endpoint: '/api/webhook/pagbank',
        method: 'POST',
        expectedBody: {
            notificationCode: 'string',
            notificationType: 'preApproval'
        }
    });
});

/**
 * Webhook para transações (pagamentos avulsos)
 * POST /api/webhook/pagbank/transaction
 */
router.post('/pagbank/transaction', async (req, res) => {
    try {
        console.log('🔔 Webhook de transação PagBank recebido');
        const { notificationCode, notificationType } = req.body;

        if (!notificationCode) {
            return res.status(400).json({ error: 'notificationCode é obrigatório' });
        }

        // TODO: Implementar lógica para transações avulsas
        console.log('📋 Notificação de transação:', notificationCode, notificationType);

        res.status(200).json({ received: true });
    } catch (error) {
        console.error('❌ Erro ao processar webhook de transação:', error.message);
        res.status(200).json({ received: true, error: error.message });
    }
});

module.exports = router;
