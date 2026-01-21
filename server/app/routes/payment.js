const express = require('express');
const router = express.Router();

// Instâncias dos serviços - inicialização lazy
let pagbankSubscriptionsService;
let pagbankRecurrenceService;
let pagbankOrdersService;

function getPagBankSubscriptionsService() {
    if (!pagbankSubscriptionsService) {
        const PagBankSubscriptionsService = require('../services/pagbank_subscriptions_service');
        pagbankSubscriptionsService = new PagBankSubscriptionsService();
    }
    return pagbankSubscriptionsService;
}

function getPagBankOrdersService() {
    if (!pagbankOrdersService) {
        const PagBankOrdersService = require('../services/pagbank_orders_service');
        pagbankOrdersService = new PagBankOrdersService();
    }
    return pagbankOrdersService;
}

router.post('/create-pagbank-subscription', async (req, res) => {
    try {
        console.log('📥 Recebendo dados para criar assinatura:', JSON.stringify(req.body, null, 2));
        const data = req.body;

        const result = await getPagBankSubscriptionsService().createCompleteSubscription({
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
        await pagbankRecurrenceService.suspendSubscription(preApprovalCode);
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
        await pagbankRecurrenceService.reactivateSubscription(preApprovalCode);
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
        await pagbankRecurrenceService.cancelSubscription(preApprovalCode);
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
        await pagbankRecurrenceService.updatePlanAmount(
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
        await pagbankRecurrenceService.applyDiscount(preApprovalCode, type, value);
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
        await pagbankRecurrenceService.changePaymentMethod(preApprovalCode, req.body);
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

// =========================
// ROTAS DE PAGAMENTO ÚNICO (CRÉDITOS)
// =========================

/**
 * Criar Pedido com Pagamento Único (Cartão de Crédito)
 * POST /api/payment/pagbank/create-order
 */
router.post('/pagbank/create-order', async (req, res) => {
    try {
        console.log('📥 Criando pedido de pagamento único:', JSON.stringify(req.body, null, 2));
        
        const result = await pagbankOrdersService.createOrderWithCard(req.body);
        
        console.log('✅ Pedido criado com sucesso:', result.id);
        res.status(201).json(result);
    } catch (error) {
        console.error('❌ Erro ao criar pedido:', error.message);
        res.status(400).json({ 
            error: error.message, 
            details: error.response?.data || error.stack 
        });
    }
});

/**
 * Criar Pedido com PIX
 * POST /api/payment/pagbank/create-pix-order
 */
router.post('/pagbank/create-pix-order', async (req, res) => {
    try {
        console.log('📥 Criando pedido PIX:', JSON.stringify(req.body, null, 2));
        
        const result = await getPagBankOrdersService().createOrderWithPix(req.body);
        
        console.log('✅ QR Code PIX gerado:', result.id);
        res.status(201).json(result);
    } catch (error) {
        console.error('❌ Erro ao criar PIX:', error.message);
        console.error('📋 Stack trace:', error.stack);
        
        // Tentar extrair erro detalhado do PagBank
        let errorMessage = error.message;
        let errorDetails = null;
        
        if (error.response) {
            console.error('📋 Response status:', error.response.status);
            console.error('📋 Response data:', error.response.data);
            
            if (error.response.data?.error_messages) {
                const pagbankErrors = error.response.data.error_messages;
                errorMessage = pagbankErrors.map(e => `${e.parameter_name}: ${e.description}`).join(', ');
                errorDetails = pagbankErrors;
            } else if (error.response.data?.error) {
                errorMessage = error.response.data.error;
                errorDetails = error.response.data;
            }
        }
        
        res.status(400).json({ 
            success: false,
            error: errorMessage, 
            details: errorDetails || error.response?.data,
            timestamp: new Date().toISOString()
        });
    }
});

/**
 * Consultar Status do Pedido
 * GET /api/payment/pagbank/order/:orderId
 */
router.get('/pagbank/order/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        console.log('📥 Consultando pedido:', orderId);
        
        const result = await pagbankOrdersService.getOrder(orderId);
        
        console.log('✅ Status do pedido:', result.charges?.[0]?.status || 'N/A');
        res.status(200).json(result);
    } catch (error) {
        console.error('❌ Erro ao consultar pedido:', error.message);
        res.status(400).json({ 
            error: error.message,
            details: error.response?.data || error.stack
        });
    }
});

/**
 * Criar Pedido com Boleto
 * POST /api/payment/pagbank/create-boleto-order
 */
router.post('/pagbank/create-boleto-order', async (req, res) => {
    try {
        console.log('📥 Criando pedido com Boleto:', JSON.stringify(req.body, null, 2));
        
        const result = await pagbankOrdersService.createOrderWithBoleto(req.body);
        
        console.log('✅ Boleto gerado:', result.id);
        res.status(201).json(result);
    } catch (error) {
        console.error('❌ Erro ao criar Boleto:', error.message);
        res.status(400).json({ 
            error: error.message, 
            details: error.response?.data || error.stack 
        });
    }
});

/**
 * Buscar Planos Disponíveis
 * GET /api/payment/plans?audience=estudantes|professores|escolas
 */
router.get('/plans', async (req, res) => {
    try {
        const { audience = 'estudantes' } = req.query;
        console.log('📥 Buscando planos para audience:', audience);

        // Planos para estudantes
        const studentPlans = [
            {
                id: 'basico_estudante',
                name: 'Plano Básico',
                badge: 'Preço promocional de lançamento',
                monthlyPrice: 49,
                yearlyPrice: 588,
                subDescription: '',
                credits: 10,
                popular: true,
                buttonText: 'Escolher Plano',
                buttonVariant: 'default',
                audience: 'estudantes'
            }
        ];

        // Planos solo para professores
        const teacherPlansSolo = [
            {
                id: 'professor_solo',
                name: 'Plano Professor solo',
                badge: 'Preço promocional de lançamento',
                monthlyPrice: 120,
                yearlyPrice: 1440,
                subDescription: '',
                credits: 60,
                popular: true,
                buttonText: 'Escolher Plano',
                buttonVariant: 'default',
                audience: 'professores'
            },
            {
                id: 'progressivo_professor',
                name: 'Plano Progressivo',
                badge: 'Melhor investimento',
                monthlyPrice: 570,
                yearlyPrice: 3420,
                description: 'Professores (Individual)',
                subDescription: 'Plano com maior quantidade de correções e acesso estendido',
                credits: 300,
                popular: true,
                features: [
                    { text: 'Criação e gerenciamento de Turmas', included: true },
                    { text: 'Banco de rubricas para facilitar a avaliação', included: true },
                    { text: 'Correção via foto ou texto direto na plataforma', included: true },
                    { text: 'Relatórios de desempenho com notas (ENEM e texto dissertativo-argumentativo)', included: true },
                    { text: 'Correção com IA (ENEM e texto dissertativo-argumentativo)', included: true, highlighted: true },
                    { text: 'Relatórios consolidados (Habilidades BNCC X ENEM)', included: true },
                    { text: 'Acesso por 6 meses', included: true }
                ],
                buttonText: 'Escolher Plano',
                buttonVariant: 'default',
                audience: 'professores'
            }
        ];

        // Planos híbridos para professores
        const teacherPlansHibrido = [
            {
                id: 'basico_professor_hibrido',
                name: 'Plano Básico',
                badge: 'Não tem esse mês',
                monthlyPrice: 49,
                yearlyPrice: 588,
                subDescription: '',
                credits: 10,
                popular: true,
                buttonText: 'Escolher Plano',
                buttonVariant: 'default',
                audience: 'professores'
            },
            {
                id: 'professor_solo_hibrido',
                name: 'Plano Professor solo',
                badge: 'Preço promocional de lançamento',
                monthlyPrice: 120,
                yearlyPrice: 1440,
                subDescription: '',
                credits: 60,
                buttonText: 'Escolher Plano',
                buttonVariant: 'default',
                audience: 'professores'
            }
        ];

        // Planos para escolas - Semestrais
        const schoolPlansSemestral = [
            {
                id: 'semestral_500',
                name: 'Plano Semestral',
                badge: 'Institucional',
                monthlyPrice: 1200,
                description: 'Plano Híbrido (Uso da plataforma + créditos de IA)',
                credits: 500,
                planType: 'semestral',
                features: [
                    { text: 'Módulo de escrita digital autorregulada', included: true },
                    { text: 'Banco de estratégias para escrita', included: true },
                    { text: 'Sugestão de temas', included: true },
                    { text: 'Recursos de apoio autorregulatório', included: true },
                    { text: 'Insights para melhoria da escrita', included: true },
                    { text: 'Revisor integrado com recursos de análise ilimitada', included: true },
                    { text: 'Rubricas qualitativas para avaliação', included: true },
                    { text: 'Correção por foto ou digitada (OCR)', included: true },
                    { text: 'Relatórios automáticos (autoavaliação, sentimentos, IA)', included: true },
                    { text: 'O acesso permanece ativo durante a vigência da assinatura', included: true, highlighted: true }
                ],
                buttonText: 'Escolher Plano',
                buttonVariant: 'default',
                audience: 'escolas'
            },
            {
                id: 'semestral_1000',
                name: 'Plano Semestral',
                badge: 'Institucional',
                monthlyPrice: 2400,
                description: 'Plano Híbrido (Uso da plataforma + créditos de IA)',
                credits: 1000,
                planType: 'semestral',
                popular: true,
                features: [
                    { text: 'Módulo de escrita digital autorregulada', included: true },
                    { text: 'Banco de estratégias para escrita', included: true },
                    { text: 'Sugestão de temas', included: true },
                    { text: 'Recursos de apoio autorregulatório', included: true },
                    { text: 'Insights para melhoria da escrita', included: true },
                    { text: 'Revisor integrado com recursos de análise ilimitada', included: true },
                    { text: 'Rubricas qualitativas para avaliação', included: true },
                    { text: 'Correção por foto ou digitada (OCR)', included: true },
                    { text: 'Relatórios automáticos (autoavaliação, sentimentos, IA)', included: true },
                    { text: 'O acesso permanece ativo durante a vigência da assinatura', included: true, highlighted: true }
                ],
                buttonText: 'Escolher Plano',
                buttonVariant: 'default',
                audience: 'escolas'
            },
            {
                id: 'semestral_2000',
                name: 'Plano Semestral',
                badge: 'Institucional',
                monthlyPrice: 4800,
                description: 'Plano Híbrido (Uso da plataforma + créditos de IA)',
                credits: 2000,
                planType: 'semestral',
                features: [
                    { text: 'Módulo de escrita digital autorregulada', included: true },
                    { text: 'Banco de estratégias para escrita', included: true },
                    { text: 'Sugestão de temas', included: true },
                    { text: 'Recursos de apoio autorregulatório', included: true },
                    { text: 'Insights para melhoria da escrita', included: true },
                    { text: 'Revisor integrado com recursos de análise ilimitada', included: true },
                    { text: 'Rubricas qualitativas para avaliação', included: true },
                    { text: 'Correção por foto ou digitada (OCR)', included: true },
                    { text: 'Relatórios automáticos (autoavaliação, sentimentos, IA)', included: true },
                    { text: 'O acesso permanece ativo durante a vigência da assinatura', included: true, highlighted: true }
                ],
                buttonText: 'Escolher Plano',
                buttonVariant: 'default',
                audience: 'escolas'
            }
        ];

        // Planos para escolas - Anuais
        const schoolPlansAnual = [
            {
                id: 'anual_1000',
                name: 'Escola Plano Institucional (Anual)',
                badge: 'Anual Institucional',
                monthlyPrice: 2350,
                description: 'Plano Híbrido (Uso da plataforma + créditos de IA)',
                credits: 1000,
                planType: 'anual',
                features: [
                    { text: 'Módulo de escrita digital autorregulada', included: true },
                    { text: 'Banco de estratégias para escrita', included: true },
                    { text: 'Sugestão de temas', included: true },
                    { text: 'Recursos de apoio autorregulatório', included: true },
                    { text: 'Insights para melhoria da escrita', included: true },
                    { text: 'Revisor integrado com recursos de análise ilimitada', included: true },
                    { text: 'Rubricas qualitativas para avaliação', included: true },
                    { text: 'Correção por foto ou digitada (OCR)', included: true },
                    { text: 'Relatórios automáticos (autoavaliação, sentimentos, IA)', included: true },
                    { text: 'O acesso permanece ativo durante a vigência da assinatura', included: true, highlighted: true }
                ],
                buttonText: 'Escolher Plano',
                buttonVariant: 'default',
                audience: 'escolas'
            },
            {
                id: 'anual_1000_hibrido',
                name: 'Escola Plano Híbrido 360 (Anual)',
                badge: 'Anual',
                monthlyPrice: 2150,
                description: 'Plano Híbrido (Uso da plataforma + créditos de IA)',
                credits: 1000,
                planType: 'anual',
                features: [
                    { text: 'Módulo de escrita digital autorregulada', included: true },
                    { text: 'Banco de estratégias para escrita', included: true },
                    { text: 'Sugestão de temas', included: true },
                    { text: 'Recursos de apoio autorregulatório', included: true },
                    { text: 'Insights para melhoria da escrita', included: true },
                    { text: 'Revisor integrado com recursos de análise ilimitada', included: true },
                    { text: 'Rubricas qualitativas para avaliação', included: true },
                    { text: 'Correção por foto ou digitada (OCR)', included: true },
                    { text: 'Relatórios automáticos (autoavaliação, sentimentos, IA)', included: true },
                    { text: 'O acesso permanece ativo durante a vigência da assinatura', included: true, highlighted: true }
                ],
                buttonText: 'Escolher Plano',
                buttonVariant: 'default',
                audience: 'escolas'
            },
            {
                id: 'anual_2000',
                name: 'Escola Plano Híbrido 360 (Anual)',
                badge: 'Anual',
                monthlyPrice: 4300,
                description: 'Plano Híbrido (Uso da plataforma + créditos de IA)',
                credits: 2000,
                planType: 'anual',
                popular: true,
                features: [
                    { text: 'Módulo de escrita digital autorregulada', included: true },
                    { text: 'Banco de estratégias para escrita', included: true },
                    { text: 'Sugestão de temas', included: true },
                    { text: 'Recursos de apoio autorregulatório', included: true },
                    { text: 'Insights para melhoria da escrita', included: true },
                    { text: 'Revisor integrado com recursos de análise ilimitada', included: true },
                    { text: 'Rubricas qualitativas para avaliação', included: true },
                    { text: 'Correção por foto ou digitada (OCR)', included: true },
                    { text: 'Relatórios automáticos (autoavaliação, sentimentos, IA)', included: true },
                    { text: 'O acesso permanece ativo durante a vigência da assinatura', included: true, highlighted: true }
                ],
                buttonText: 'Escolher Plano',
                buttonVariant: 'default',
                audience: 'escolas'
            },
            {
                id: 'anual_5000',
                name: 'Escola Plano Híbrido 360 (Anual)',
                badge: 'Anual',
                monthlyPrice: 10750,
                description: 'Plano Híbrido (Uso da plataforma + créditos de IA)',
                credits: 5000,
                planType: 'anual',
                features: [
                    { text: 'Módulo de escrita digital autorregulada', included: true },
                    { text: 'Banco de estratégias para escrita', included: true },
                    { text: 'Sugestão de temas', included: true },
                    { text: 'Recursos de apoio autorregulatório', included: true },
                    { text: 'Insights para melhoria da escrita', included: true },
                    { text: 'Revisor integrado com recursos de análise ilimitada', included: true },
                    { text: 'Rubricas qualitativas para avaliação', included: true },
                    { text: 'Correção por foto ou digitada (OCR)', included: true },
                    { text: 'Relatórios automáticos (autoavaliação, sentimentos, IA)', included: true },
                    { text: 'O acesso permanece ativo durante a vigência da assinatura', included: true, highlighted: true }
                ],
                buttonText: 'Escolher Plano',
                buttonVariant: 'default',
                audience: 'escolas'
            }
        ];

        let plans = [];

        switch (audience) {
            case 'estudantes':
                plans = studentPlans;
                break;
            case 'professores':
                // Para professores, incluir ambos os tipos (solo e híbrido)
                plans = [...teacherPlansSolo, ...teacherPlansHibrido];
                break;
            case 'escolas':
                plans = [...schoolPlansSemestral, ...schoolPlansAnual];
                break;
            default:
                plans = studentPlans;
        }

        console.log(`✅ ${plans.length} planos encontrados para ${audience}`);
        res.status(200).json({
            success: true,
            audience,
            plans,
            total: plans.length
        });

    } catch (error) {
        console.error('❌ Erro ao buscar planos:', error.message);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor',
            details: error.message
        });
    }
});

module.exports = router;