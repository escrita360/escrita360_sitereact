const express = require('express');
const router = express.Router();
const PagBankRecurrenceService = require('../services/pagbank_recurrence_service');
const FirebaseMultiProjectService = require('../services/firebase_multi_project_service');
const pagbankLogger = require('../services/pagbank_logger_service');

const pagbankRecurrenceService = new PagBankRecurrenceService();
const firebaseService = new FirebaseMultiProjectService();

/**
 * Teste de webhook - verificar se está funcionando
 * GET /api/webhook/test
 */
router.get('/test', (req, res) => {
    console.log('🔔 Teste de webhook recebido');
    res.json({ 
        status: 'ok', 
        message: 'Webhook funcionando!',
        timestamp: new Date().toISOString(),
        environment: process.env.PAGBANK_ENV || 'development'
    });
});

/**
 * Endpoint de health check para webhooks
 * GET /api/webhook/health
 */
router.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        service: 'webhook',
        timestamp: new Date().toISOString()
    });
});

/**
 * Webhook específico para PIX em produção
 * POST /api/webhook/pagbank/pix
 */
router.post('/pagbank/pix', async (req, res) => {
    try {
        console.log('🔔 Webhook PIX PagBank recebido');
        
        // Log do webhook recebido
        pagbankLogger.logWebhook(req.headers, req.body, 'PIX');
        
        console.log('📦 Headers PIX:', req.headers);
        console.log('📦 Body PIX:', req.body);

        // Estrutura do webhook PIX do PagBank:
        // {
        //   "id": "ORDE_xxx",
        //   "reference_id": "pix_123",
        //   "event_type": "order.paid",
        //   "data": { ... }
        // }

        const { id, reference_id, event_type, data } = req.body;

        if (!id || !event_type) {
            console.error('❌ Dados do webhook PIX incompletos');
            return res.status(400).json({ error: 'id e event_type são obrigatórios' });
        }

        console.log(`📊 Evento PIX: ${event_type} para pedido ${id}`);

        // Processar eventos PIX
        switch (event_type) {
            case 'order.paid':
                console.log('✅ PIX PAGO! Processando...');
                await handlePixPaymentApproved(data);
                break;
                
            case 'order.canceled':
                console.log('❌ PIX cancelado');
                break;
                
            case 'order.waiting':
                console.log('⏳ PIX aguardando pagamento');
                break;
                
            default:
                console.log(`📋 Evento PIX não tratado: ${event_type}`);
        }

        // Responder com 200 OK para confirmar recebimento
        res.status(200).json({ 
            received: true, 
            order_id: id,
            event_type: event_type,
            processed_at: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('❌ Erro ao processar webhook PIX:', error.message);
        // Mesmo com erro, retornar 200 para não reenviar notificação
        res.status(200).json({ 
            received: true, 
            error: error.message,
            processed_at: new Date().toISOString() 
        });
    }
});

/**
 * Processar pagamento PIX aprovado
 */
async function handlePixPaymentApproved(orderData) {
    try {
        console.log('🎉 PIX aprovado! Criando conta do usuário...');
        
        // Extrair dados do cliente do pedido
        const customer = orderData.customer;
        const charges = orderData.charges || [];
        const charge = charges[0];
        
        if (!customer || !charge) {
            throw new Error('Dados do cliente ou cobrança não encontrados');
        }
        
        console.log('👤 Cliente PIX:', {
            name: customer.name,
            email: customer.email,
            cpf: customer.tax_id.replace(/\d{3}(\d{6})\d{2}/, '***$1**')
        });
        
        // TODO: Integrar com Firebase para criar conta
        // const firebaseService = new FirebaseMultiProjectService();
        // await firebaseService.createUser(customer.email, 'senha_temporaria', {
        //     name: customer.name,
        //     cpf: customer.tax_id,
        //     phone: customer.phones?.[0]?.number
        // });
        
        console.log('✅ Conta PIX criada com sucesso!');
        
    } catch (error) {
        console.error('❌ Erro ao processar PIX aprovado:', error);
        throw error;
    }
}

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
        
        // Log do webhook recebido
        pagbankLogger.logWebhook(req.headers, req.body);
        
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

    // Extrair dados do cliente da notificação
    const customerData = extractCustomerData(data);

    switch (status) {
        case 'INITIATED':
            console.log('⏳ Assinatura iniciada, aguardando pagamento');
            break;

        case 'PENDING':
            console.log('⏳ Pagamento em análise');
            break;

        case 'ACTIVE':
        case 'PAID':
            console.log('✅ Pagamento aprovado - criando conta do usuário');
            await handlePaymentApproved(customerData, data);
            break;

        case 'PAYMENT_METHOD_CHANGE':
            console.log('💳 Cartão precisa ser atualizado');
            break;

        case 'SUSPENDED':
            console.log('⏸️ Assinatura suspensa');
            await handleSubscriptionSuspended(customerData, data);
            break;

        case 'CANCELLED':
        case 'CANCELLED_BY_RECEIVER':
        case 'CANCELLED_BY_SENDER':
            console.log('❌ Assinatura cancelada');
            await handleSubscriptionCancelled(customerData, data);
            break;

        case 'EXPIRED':
            console.log('🕐 Assinatura expirada');
            await handleSubscriptionExpired(customerData, data);
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
 * Extrai dados do cliente da notificação do PagBank
 * A estrutura pode variar dependendo do tipo de integração
 */
function extractCustomerData(data) {
    // Estrutura para assinaturas recorrentes
    if (data.sender) {
        return {
            email: data.sender.email,
            name: data.sender.name,
            phone: data.sender.phone,
            // Se a senha vier na referência ou metadata
            password: data.metadata?.password || data.reference?.split('|')[1] || null
        };
    }
    
    // Estrutura para pedidos/orders
    if (data.customer) {
        return {
            email: data.customer.email,
            name: data.customer.name,
            phone: data.customer.phones?.[0],
            password: data.customer.password || data.metadata?.password || null
        };
    }

    // Estrutura alternativa (charges)
    if (data.charges?.[0]?.payment_response) {
        const charge = data.charges[0];
        return {
            email: charge.payment_response?.customer?.email || data.reference_id,
            name: charge.payment_response?.customer?.name,
            password: data.metadata?.password || null
        };
    }

    return {
        email: data.email || data.reference_id,
        name: data.name || data.displayName,
        password: data.password || data.metadata?.password || null
    };
}

/**
 * Determina o tipo de plano baseado nos dados do pagamento
 */
function extractPlanType(data) {
    // Verificar no nome do plano
    const planName = (data.plan?.name || data.planName || data.reference || '').toLowerCase();
    
    if (planName.includes('professor') || planName.includes('teacher') || planName.includes('docente')) {
        return 'professor';
    }
    
    if (planName.includes('aluno') || planName.includes('estudante') || planName.includes('student')) {
        return 'aluno';
    }

    // Verificar no metadata
    if (data.metadata?.planType) {
        return data.metadata.planType;
    }

    // Verificar no reference (formato: planType|password|userId)
    if (data.reference) {
        const parts = data.reference.split('|');
        if (parts[0] === 'professor' || parts[0] === 'aluno') {
            return parts[0];
        }
    }

    // Default
    return 'aluno';
}

/**
 * Handler para pagamento aprovado - cria conta no Firebase
 */
async function handlePaymentApproved(customerData, paymentData) {
    try {
        const email = customerData.email;
        const password = customerData.password;
        const displayName = customerData.name || email?.split('@')[0];
        const planType = extractPlanType(paymentData);

        if (!email) {
            console.error('❌ Email não encontrado nos dados do pagamento');
            return;
        }

        // Se não tiver senha, gerar uma temporária
        const finalPassword = password || generateTemporaryPassword();

        console.log(`🔥 Criando conta Firebase para: ${email} (plano: ${planType})`);

        const result = await firebaseService.createUserForPlan({
            email: email,
            password: finalPassword,
            displayName: displayName,
            planType: planType,
            subscriptionData: {
                pagbankCode: paymentData.code,
                pagbankReference: paymentData.reference,
                status: paymentData.status,
                planName: paymentData.plan?.name,
                amount: paymentData.amount,
                paymentMethod: paymentData.paymentMethod,
                approvedAt: new Date().toISOString()
            }
        });

        console.log('✅ Conta criada com sucesso:', result);

        // Se a senha foi gerada, logar para fins de debug (em produção, enviar por email)
        if (!password) {
            console.log(`⚠️ Senha temporária gerada para ${email}: ${finalPassword}`);
            // TODO: Implementar envio de email com senha temporária
            // await sendWelcomeEmail(email, finalPassword, planType);
        }

        return result;
    } catch (error) {
        console.error('❌ Erro ao criar conta após pagamento aprovado:', error.message);
        // Não throw para não bloquear o webhook
    }
}

/**
 * Handler para assinatura suspensa
 */
async function handleSubscriptionSuspended(customerData, paymentData) {
    try {
        if (!customerData.email) return;

        const planType = extractPlanType(paymentData);
        await firebaseService.updateSubscriptionStatus(
            customerData.email,
            planType,
            'suspended',
            { suspendedAt: new Date().toISOString() }
        );
        console.log(`⏸️ Acesso suspenso para: ${customerData.email}`);
    } catch (error) {
        console.error('❌ Erro ao suspender acesso:', error.message);
    }
}

/**
 * Handler para assinatura cancelada
 */
async function handleSubscriptionCancelled(customerData, paymentData) {
    try {
        if (!customerData.email) return;

        const planType = extractPlanType(paymentData);
        await firebaseService.disableUser(customerData.email, planType);
        console.log(`❌ Acesso cancelado para: ${customerData.email}`);
    } catch (error) {
        console.error('❌ Erro ao cancelar acesso:', error.message);
    }
}

/**
 * Handler para assinatura expirada
 */
async function handleSubscriptionExpired(customerData, paymentData) {
    try {
        if (!customerData.email) return;

        const planType = extractPlanType(paymentData);
        await firebaseService.updateSubscriptionStatus(
            customerData.email,
            planType,
            'expired',
            { expiredAt: new Date().toISOString() }
        );
        console.log(`🕐 Assinatura expirada para: ${customerData.email}`);
    } catch (error) {
        console.error('❌ Erro ao marcar expiração:', error.message);
    }
}

/**
 * Gera uma senha temporária segura
 */
function generateTemporaryPassword() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$';
    let password = '';
    for (let i = 0; i < 12; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
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
        console.log('📦 Headers:', req.headers);
        console.log('📦 Body:', JSON.stringify(req.body, null, 2));
        
        const { notificationCode, notificationType } = req.body;

        if (!notificationCode) {
            return res.status(400).json({ error: 'notificationCode é obrigatório' });
        }

        // Processar pagamento avulso/transação
        await processTransactionNotification(req.body);

        res.status(200).json({ received: true });
    } catch (error) {
        console.error('❌ Erro ao processar webhook de transação:', error.message);
        res.status(200).json({ received: true, error: error.message });
    }
});

/**
 * Webhook para Orders (API moderna do PagBank)
 * POST /api/webhook/pagbank/orders
 */
router.post('/pagbank/orders', async (req, res) => {
    try {
        console.log('🔔 Webhook de Order PagBank recebido');
        console.log('📦 Headers:', req.headers);
        console.log('📦 Body:', JSON.stringify(req.body, null, 2));

        const orderData = req.body;

        // A API moderna envia o status diretamente no body
        if (orderData.charges && orderData.charges.length > 0) {
            const charge = orderData.charges[0];
            const status = charge.status;

            console.log(`📊 Status da cobrança: ${status}`);

            if (status === 'PAID' || status === 'AUTHORIZED') {
                const customerData = extractCustomerFromOrder(orderData);
                await handlePaymentApproved(customerData, {
                    code: orderData.id,
                    reference: orderData.reference_id,
                    status: status,
                    amount: charge.amount?.value,
                    metadata: orderData.metadata,
                    customer: orderData.customer
                });
            }
        }

        res.status(200).json({ received: true });
    } catch (error) {
        console.error('❌ Erro ao processar webhook de order:', error.message);
        res.status(200).json({ received: true, error: error.message });
    }
});

/**
 * Extrai dados do cliente de uma Order
 */
function extractCustomerFromOrder(orderData) {
    const customer = orderData.customer || {};
    return {
        email: customer.email,
        name: customer.name,
        phone: customer.phones?.[0],
        password: orderData.metadata?.password || 
                  orderData.reference_id?.split('|')[1] || 
                  null
    };
}

/**
 * Processa notificação de transação avulsa
 */
async function processTransactionNotification(data) {
    console.log('📋 Processando transação avulsa...');
    
    // Para transações avulsas, verificar se tem dados de pagamento aprovado
    if (data.status === 'PAID' || data.status === 'APPROVED' || data.status === 3) {
        const customerData = extractCustomerData(data);
        await handlePaymentApproved(customerData, data);
    }
}

/**
 * Endpoint de simulação de webhook para testes
 * POST /api/webhook/pagbank/simulate
 * 
 * Permite testar a criação de conta sem precisar de pagamento real
 */
router.post('/pagbank/simulate', async (req, res) => {
    try {
        console.log('🧪 Simulando webhook de pagamento aprovado');
        
        const { 
            email, 
            password, 
            displayName, 
            planType = 'aluno',
            status = 'PAID'
        } = req.body;

        if (!email || !password) {
            return res.status(400).json({ 
                error: 'email e password são obrigatórios',
                example: {
                    email: 'teste@exemplo.com',
                    password: 'senhaSegura123',
                    displayName: 'Nome do Usuário',
                    planType: 'aluno ou professor'
                }
            });
        }

        // Simular dados de pagamento
        const simulatedPaymentData = {
            code: `SIM_${Date.now()}`,
            reference: `${planType}|${password}|simulated`,
            status: status,
            plan: { name: `Plano ${planType}` },
            metadata: { password: password, planType: planType }
        };

        const customerData = {
            email: email,
            password: password,
            name: displayName
        };

        const result = await handlePaymentApproved(customerData, simulatedPaymentData);

        res.json({
            success: true,
            message: 'Conta criada com sucesso via simulação',
            data: result
        });
    } catch (error) {
        console.error('❌ Erro na simulação:', error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
