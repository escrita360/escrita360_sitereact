const express = require('express');
const router = express.Router();
const PagBankSubscriptionsService = require('../services/pagbank_subscriptions_service');

// Instâncias dos serviços
const pagbankSubscriptionsService = new PagBankSubscriptionsService();

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
            payment_method: data.payment_method || 'BOLETO',
            card_token: data.card_token,
            card_security_code: data.card_security_code
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

module.exports = router;