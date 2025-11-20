const axios = require('axios');

/**
 * Serviço para integração com API de Orders do PagBank
 * Documentação: https://dev.pagbank.uol.com.br/reference/orders-api-overview
 */
class PagBankOrdersService {
    constructor() {
        this.token = process.env.PAGBANK_TOKEN;
        this.environment = process.env.PAGBANK_ENV || 'sandbox';
        this.baseUrl = this.environment === 'production' 
            ? 'https://api.pagseguro.com'
            : 'https://sandbox.api.pagseguro.com';
        
        if (!this.token) {
            throw new Error('PAGBANK_TOKEN não configurado no .env');
        }
    }

    /**
     * Cria um pedido com pagamento por cartão de crédito
     * https://dev.pagbank.uol.com.br/reference/criar-pedido
     */
    async createOrderWithCard(orderData) {
        try {
            console.log('📦 Criando pedido com cartão no PagBank...');
            
            const payload = {
                reference_id: orderData.reference_id,
                customer: {
                    name: orderData.customer.name,
                    email: orderData.customer.email,
                    tax_id: orderData.customer.tax_id,
                    phones: orderData.customer.phones
                },
                items: orderData.items.map(item => ({
                    reference_id: item.reference_id,
                    name: item.name,
                    quantity: item.quantity,
                    unit_amount: item.unit_amount
                })),
                charges: [{
                    reference_id: orderData.charges[0].reference_id,
                    description: orderData.charges[0].description,
                    amount: {
                        value: orderData.charges[0].amount.value,
                        currency: 'BRL'
                    },
                    payment_method: {
                        type: 'CREDIT_CARD',
                        installments: orderData.charges[0].payment_method.installments || 1,
                        capture: orderData.charges[0].payment_method.capture !== false,
                        card: {
                            number: orderData.charges[0].payment_method.card.number,
                            exp_month: parseInt(orderData.charges[0].payment_method.card.exp_month),
                            exp_year: parseInt(orderData.charges[0].payment_method.card.exp_year),
                            security_code: orderData.charges[0].payment_method.card.security_code,
                            holder: {
                                name: orderData.charges[0].payment_method.card.holder.name
                            }
                        }
                    }
                }],
                notification_urls: orderData.notification_urls || []
            };

            console.log('📤 Enviando para PagBank:', JSON.stringify(payload, null, 2));

            const response = await axios.post(
                `${this.baseUrl}/orders`,
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.token}`
                    }
                }
            );

            console.log('✅ Pedido criado com sucesso:', response.data.id);
            return response.data;

        } catch (error) {
            console.error('❌ Erro ao criar pedido:', error.response?.data || error.message);
            throw new Error(
                error.response?.data?.error_messages?.[0]?.description || 
                error.message || 
                'Erro ao processar pagamento'
            );
        }
    }

    /**
     * Cria um pedido com QR Code PIX
     * https://dev.pagbank.uol.com.br/reference/criar-qr-code-pix
     */
    async createOrderWithPix(orderData) {
        try {
            console.log('📦 Criando pedido PIX no PagBank...');
            
            const payload = {
                reference_id: orderData.reference_id,
                customer: {
                    name: orderData.customer.name,
                    email: orderData.customer.email,
                    tax_id: orderData.customer.tax_id,
                    phones: orderData.customer.phones
                },
                items: orderData.items.map(item => ({
                    reference_id: item.reference_id,
                    name: item.name,
                    quantity: item.quantity,
                    unit_amount: item.unit_amount
                })),
                qr_codes: [{
                    amount: {
                        value: orderData.qr_codes[0].amount.value
                    },
                    expiration_date: orderData.qr_codes[0].expiration_date
                }],
                notification_urls: orderData.notification_urls || []
            };

            console.log('📤 Enviando para PagBank (PIX):', JSON.stringify(payload, null, 2));

            const response = await axios.post(
                `${this.baseUrl}/orders`,
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.token}`
                    }
                }
            );

            console.log('✅ QR Code PIX gerado:', response.data.id);
            return response.data;

        } catch (error) {
            console.error('❌ Erro ao criar PIX:', error.response?.data || error.message);
            throw new Error(
                error.response?.data?.error_messages?.[0]?.description || 
                error.message || 
                'Erro ao gerar QR Code PIX'
            );
        }
    }

    /**
     * Cria um pedido com Boleto
     * https://dev.pagbank.uol.com.br/reference/criar-pedido
     */
    async createOrderWithBoleto(orderData) {
        try {
            console.log('📦 Criando pedido com Boleto no PagBank...');
            
            const payload = {
                reference_id: orderData.reference_id,
                customer: {
                    name: orderData.customer.name,
                    email: orderData.customer.email,
                    tax_id: orderData.customer.tax_id,
                    phones: orderData.customer.phones
                },
                items: orderData.items.map(item => ({
                    reference_id: item.reference_id,
                    name: item.name,
                    quantity: item.quantity,
                    unit_amount: item.unit_amount
                })),
                charges: [{
                    reference_id: orderData.charges[0].reference_id,
                    description: orderData.charges[0].description,
                    amount: {
                        value: orderData.charges[0].amount.value,
                        currency: 'BRL'
                    },
                    payment_method: {
                        type: 'BOLETO',
                        boleto: {
                            due_date: orderData.charges[0].payment_method.boleto.due_date,
                            instruction_lines: orderData.charges[0].payment_method.boleto.instruction_lines,
                            holder: {
                                name: orderData.charges[0].payment_method.boleto.holder.name,
                                tax_id: orderData.charges[0].payment_method.boleto.holder.tax_id,
                                email: orderData.charges[0].payment_method.boleto.holder.email
                            }
                        }
                    }
                }],
                notification_urls: orderData.notification_urls || []
            };

            console.log('📤 Enviando para PagBank (Boleto):', JSON.stringify(payload, null, 2));

            const response = await axios.post(
                `${this.baseUrl}/orders`,
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.token}`
                    }
                }
            );

            console.log('✅ Boleto gerado:', response.data.id);
            return response.data;

        } catch (error) {
            console.error('❌ Erro ao criar Boleto:', error.response?.data || error.message);
            throw new Error(
                error.response?.data?.error_messages?.[0]?.description || 
                error.message || 
                'Erro ao gerar Boleto'
            );
        }
    }

    /**
     * Consulta um pedido pelo ID
     * https://dev.pagbank.uol.com.br/reference/consultar-pedido
     */
    async getOrder(orderId) {
        try {
            console.log('🔍 Consultando pedido:', orderId);

            const response = await axios.get(
                `${this.baseUrl}/orders/${orderId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                }
            );

            console.log('✅ Pedido encontrado:', response.data.id);
            return response.data;

        } catch (error) {
            console.error('❌ Erro ao consultar pedido:', error.response?.data || error.message);
            throw new Error(
                error.response?.data?.error_messages?.[0]?.description || 
                error.message || 
                'Erro ao consultar pedido'
            );
        }
    }

    /**
     * Cancela um pagamento (estorno)
     * https://dev.pagbank.uol.com.br/reference/cancelar-pagamento
     */
    async cancelCharge(chargeId, amount = null) {
        try {
            console.log('🔙 Cancelando cobrança:', chargeId);

            const payload = amount ? { amount: { value: amount } } : {};

            const response = await axios.post(
                `${this.baseUrl}/charges/${chargeId}/cancel`,
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.token}`
                    }
                }
            );

            console.log('✅ Cobrança cancelada');
            return response.data;

        } catch (error) {
            console.error('❌ Erro ao cancelar cobrança:', error.response?.data || error.message);
            throw new Error(
                error.response?.data?.error_messages?.[0]?.description || 
                error.message || 
                'Erro ao cancelar pagamento'
            );
        }
    }

    /**
     * Captura um pagamento pré-autorizado
     * https://dev.pagbank.uol.com.br/reference/capturar-pagamento
     */
    async captureCharge(chargeId, amount = null) {
        try {
            console.log('💰 Capturando cobrança:', chargeId);

            const payload = amount ? { amount: { value: amount } } : {};

            const response = await axios.post(
                `${this.baseUrl}/charges/${chargeId}/capture`,
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.token}`
                    }
                }
            );

            console.log('✅ Cobrança capturada');
            return response.data;

        } catch (error) {
            console.error('❌ Erro ao capturar cobrança:', error.response?.data || error.message);
            throw new Error(
                error.response?.data?.error_messages?.[0]?.description || 
                error.message || 
                'Erro ao capturar pagamento'
            );
        }
    }
}

module.exports = PagBankOrdersService;
