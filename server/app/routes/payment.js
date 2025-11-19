const express = require('express');
const router = express.Router();
const PagBankSubscriptionsService = require('../services/pagbank_subscriptions_service');
const PagBankRecurrenceService = require('../services/pagbank_recurrence_service');

// Instâncias dos serviços
const pagbankSubscriptionsService = new PagBankSubscriptionsService();
const pagbankRecurrenceService = new PagBankRecurrenceService();

router.post('/create-pagbank-subscription', async (req, res) => {
    try {
        console.log('📥 Recebendo dados para criar assinatura:', JSON.stringify(req.body, null, 2));
        const data = req.body;

        const result = await pagbankSubscriptionsService.createCompleteSubscription({
            plan_name: data.plan_name,
            plan_description: data.plan_description,
            amount: data.amount,
            interval_unit: data.interval_unit,
            interval_value: data.interval_value,
            customer: data.customer,
            payment_method: data.payment_method || 'CREDIT_CARD',
            cardData: data.cardData
        });

        console.log('✅ Assinatura criada com sucesso:', result);
        res.status(201).json(result);
    } catch (error) {
        console.error('❌ Erro ao criar assinatura:', error.message);
        
        if (error.response) {
            console.error('Detalhes do erro:', JSON.stringify(error.response.data, null, 2));
            res.status(error.response.status || 400).json({ 
                error: error.message,
                details: error.response.data 
            });
        } else {
            res.status(400).json({ error: error.message });
        }
    }
});

router.post('/create-pagbank-checkout', async (req, res) => {
    try {
        const data = req.body;

        // Simulação - em produção, implementaria o checkout real
        const result = {
            id: `checkout_${data.plan_id}`,
            payment_url: `https://sandbox.pagbank.com/checkout/${data.plan_id}`,
            status: 'pending'
        };

        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/create-pagbank-pix-payment', async (req, res) => {
    try {
        console.log('📥 Recebendo dados para criar pagamento PIX:', JSON.stringify(req.body, null, 2));
        const data = req.body;

        // Por enquanto, simulação do PIX - em produção, implementar a API real
        const result = {
            id: `pix_${data.plan_name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`,
            qr_codes: [{
                text: '00020101021126890014br.gov.bcb.pix0117+55119999999995204000053039865802BR5913ESCrita3606009SAO PAULO62070503***6304ABCD',
                expiration_date: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
                amount: {
                    value: Math.round(data.amount * 100)
                }
            }],
            status: 'WAITING',
            customer: data.customer
        };

        console.log('✅ PIX gerado:', result);
        res.status(201).json(result);
    } catch (error) {
        console.error('❌ Erro ao criar PIX:', error.message);
        res.status(400).json({ error: error.message });
    }
});

router.get('/pagbank-status/:order_id', async (req, res) => {
    try {
        const { order_id } = req.params;

        // Simulação - em produção, consultaria a API real
        const result = {
            id: order_id,
            status: 'PAID',
            amount: 2990,
            created_at: '2025-11-18T10:00:00Z'
        };
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/pagbank-payments', async (req, res) => {
    try {
        // Simulação - em produção, listaria pagamentos reais
        const result = {
            orders: [{
                id: 'order_123',
                status: 'PAID',
                amount: 2990,
                created_at: '2025-11-18T10:00:00Z'
            }]
        };
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// =========================
// ROTAS DE RECORRÊNCIA PAGBANK
// =========================

/**
 * Criar Plano de Recorrência
 * POST /api/payment/pagbank/plan
 */
router.post('/pagbank/plan', async (req, res) => {
    try {
        console.log('📥 Criando plano de recorrência:', req.body);
        const result = await pagbankRecurrenceService.createPlan(req.body);
        console.log('✅ Plano criado:', result);
        res.status(201).json(result);
    } catch (error) {
        console.error('❌ Erro ao criar plano:', error.message);
        res.status(400).json({ error: error.message });
    }
});

/**
 * Gerar Sessão para Adesão
 * POST /api/payment/pagbank/session
 */
router.post('/pagbank/session', async (req, res) => {
    try {
        console.log('📥 Gerando sessão...');
        const result = await pagbankRecurrenceService.createSession();
        console.log('✅ Sessão criada:', result);
        res.status(200).json(result);
    } catch (error) {
        console.error('❌ Erro ao criar sessão:', error.message);
        res.status(400).json({ error: error.message });
    }
});

/**
 * Criar Adesão ao Plano
 * POST /api/payment/pagbank/subscription
 */
router.post('/pagbank/subscription', async (req, res) => {
    try {
        console.log('📥 Criando adesão ao plano:', req.body);
        const result = await pagbankRecurrenceService.createSubscription(req.body);
        console.log('✅ Adesão criada:', result);
        res.status(201).json(result);
    } catch (error) {
        console.error('❌ Erro ao criar adesão:', error.message);
        res.status(400).json({ error: error.message });
    }
});

/**
 * Cobrar Plano
 * POST /api/payment/pagbank/charge
 */
router.post('/pagbank/charge', async (req, res) => {
    try {
        console.log('📥 Cobrando plano:', req.body);
        const result = await pagbankRecurrenceService.chargeSubscription(req.body);
        console.log('✅ Cobrança realizada:', result);
        res.status(200).json(result);
    } catch (error) {
        console.error('❌ Erro ao cobrar plano:', error.message);
        res.status(400).json({ error: error.message });
    }
});

/**
 * Retentativa de Pagamento
 * POST /api/payment/pagbank/retry/:preApprovalCode/:paymentOrderCode
 */
router.post('/pagbank/retry/:preApprovalCode/:paymentOrderCode', async (req, res) => {
    try {
        const { preApprovalCode, paymentOrderCode } = req.params;
        console.log('📥 Retentando pagamento:', preApprovalCode, paymentOrderCode);
        const result = await pagbankRecurrenceService.retryPayment(preApprovalCode, paymentOrderCode);
        console.log('✅ Retentativa iniciada:', result);
        res.status(200).json(result);
    } catch (error) {
        console.error('❌ Erro na retentativa:', error.message);
        res.status(400).json({ error: error.message });
    }
});

/**
 * Suspender Assinatura
 * PUT /api/payment/pagbank/subscription/:preApprovalCode/suspend
 */
router.put('/pagbank/subscription/:preApprovalCode/suspend', async (req, res) => {
    try {
        const { preApprovalCode } = req.params;
        console.log('📥 Suspendendo assinatura:', preApprovalCode);
        const result = await pagbankRecurrenceService.suspendSubscription(preApprovalCode);
        console.log('✅ Assinatura suspensa');
        res.status(204).send();
    } catch (error) {
        console.error('❌ Erro ao suspender:', error.message);
        res.status(400).json({ error: error.message });
    }
});

/**
 * Reativar Assinatura
 * PUT /api/payment/pagbank/subscription/:preApprovalCode/reactivate
 */
router.put('/pagbank/subscription/:preApprovalCode/reactivate', async (req, res) => {
    try {
        const { preApprovalCode } = req.params;
        console.log('📥 Reativando assinatura:', preApprovalCode);
        const result = await pagbankRecurrenceService.reactivateSubscription(preApprovalCode);
        console.log('✅ Assinatura reativada');
        res.status(204).send();
    } catch (error) {
        console.error('❌ Erro ao reativar:', error.message);
        res.status(400).json({ error: error.message });
    }
});

/**
 * Cancelar Assinatura
 * PUT /api/payment/pagbank/subscription/:preApprovalCode/cancel
 */
router.put('/pagbank/subscription/:preApprovalCode/cancel', async (req, res) => {
    try {
        const { preApprovalCode } = req.params;
        console.log('📥 Cancelando assinatura:', preApprovalCode);
        const result = await pagbankRecurrenceService.cancelSubscription(preApprovalCode);
        console.log('✅ Assinatura cancelada');
        res.status(204).send();
    } catch (error) {
        console.error('❌ Erro ao cancelar:', error.message);
        res.status(400).json({ error: error.message });
    }
});

/**
 * Atualizar Valor do Plano
 * PUT /api/payment/pagbank/plan/:preApprovalRequestCode/amount
 */
router.put('/pagbank/plan/:preApprovalRequestCode/amount', async (req, res) => {
    try {
        const { preApprovalRequestCode } = req.params;
        const { amountPerPayment, updateSubscriptions } = req.body;
        console.log('📥 Atualizando valor do plano:', preApprovalRequestCode, amountPerPayment);
        const result = await pagbankRecurrenceService.updatePlanAmount(
            preApprovalRequestCode,
            amountPerPayment,
            updateSubscriptions
        );
        console.log('✅ Valor atualizado');
        res.status(204).send();
    } catch (error) {
        console.error('❌ Erro ao atualizar valor:', error.message);
        res.status(400).json({ error: error.message });
    }
});

/**
 * Aplicar Desconto
 * PUT /api/payment/pagbank/subscription/:preApprovalCode/discount
 */
router.put('/pagbank/subscription/:preApprovalCode/discount', async (req, res) => {
    try {
        const { preApprovalCode } = req.params;
        const { type, value } = req.body;
        console.log('📥 Aplicando desconto:', preApprovalCode, type, value);
        const result = await pagbankRecurrenceService.applyDiscount(preApprovalCode, type, value);
        console.log('✅ Desconto aplicado');
        res.status(204).send();
    } catch (error) {
        console.error('❌ Erro ao aplicar desconto:', error.message);
        res.status(400).json({ error: error.message });
    }
});

/**
 * Alterar Meio de Pagamento
 * PUT /api/payment/pagbank/subscription/:preApprovalCode/payment-method
 */
router.put('/pagbank/subscription/:preApprovalCode/payment-method', async (req, res) => {
    try {
        const { preApprovalCode } = req.params;
        console.log('📥 Alterando meio de pagamento:', preApprovalCode);
        const result = await pagbankRecurrenceService.changePaymentMethod(preApprovalCode, req.body);
        console.log('✅ Meio de pagamento alterado');
        res.status(204).send();
    } catch (error) {
        console.error('❌ Erro ao alterar meio de pagamento:', error.message);
        res.status(400).json({ error: error.message });
    }
});

/**
 * Listar Ordens de Pagamento
 * GET /api/payment/pagbank/subscription/:preApprovalCode/payment-orders
 */
router.get('/pagbank/subscription/:preApprovalCode/payment-orders', async (req, res) => {
    try {
        const { preApprovalCode } = req.params;
        console.log('📥 Listando ordens de pagamento:', preApprovalCode);
        const result = await pagbankRecurrenceService.listPaymentOrders(preApprovalCode);
        console.log('✅ Ordens listadas');
        res.status(200).json(result);
    } catch (error) {
        console.error('❌ Erro ao listar ordens:', error.message);
        res.status(400).json({ error: error.message });
    }
});

/**
 * Consultar Assinatura pelo Código
 * GET /api/payment/pagbank/subscription/:preApprovalCode
 */
router.get('/pagbank/subscription/:preApprovalCode', async (req, res) => {
    try {
        const { preApprovalCode } = req.params;
        console.log('📥 Consultando assinatura:', preApprovalCode);
        const result = await pagbankRecurrenceService.getSubscription(preApprovalCode);
        console.log('✅ Assinatura encontrada');
        res.status(200).json(result);
    } catch (error) {
        console.error('❌ Erro ao consultar assinatura:', error.message);
        res.status(400).json({ error: error.message });
    }
});

/**
 * Listar Assinaturas por Data
 * GET /api/payment/pagbank/subscriptions?initialDate=...&finalDate=...
 */
router.get('/pagbank/subscriptions', async (req, res) => {
    try {
        const { initialDate, finalDate } = req.query;
        console.log('📥 Listando assinaturas por data:', initialDate, finalDate);
        const result = await pagbankRecurrenceService.listSubscriptionsByDate(initialDate, finalDate);
        console.log('✅ Assinaturas listadas');
        res.status(200).json(result);
    } catch (error) {
        console.error('❌ Erro ao listar assinaturas:', error.message);
        res.status(400).json({ error: error.message });
    }
});

/**
 * Consultar por Notificação
 * GET /api/payment/pagbank/notification/:notificationCode
 */
router.get('/pagbank/notification/:notificationCode', async (req, res) => {
    try {
        const { notificationCode } = req.params;
        console.log('📥 Consultando notificação:', notificationCode);
        const result = await pagbankRecurrenceService.getSubscriptionByNotification(notificationCode);
        console.log('✅ Notificação processada');
        res.status(200).json(result);
    } catch (error) {
        console.error('❌ Erro ao processar notificação:', error.message);
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;