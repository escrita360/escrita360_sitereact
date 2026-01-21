const axios = require('axios');
const pagbankLogger = require('./pagbank_logger_service');

/**
 * Serviço para integração com API de Orders do PagBank
 * Documentação: https://dev.pagbank.uol.com.br/reference/orders-api-overview
 */
class PagBankOrdersService {
    constructor() {
        this.token = process.env.PAGBANK_TOKEN;
        this.environment = process.env.PAGBANK_ENV || 'production';
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

            // Log do request antes de enviar
            pagbankLogger.logRequest('CREDIT_CARD', {
                url: `${this.baseUrl}/orders`,
                method: 'POST',
                body: payload
            }, this.environment);

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

            // Log completo da transação
            pagbankLogger.logTransaction('CREDIT_CARD', {
                url: `${this.baseUrl}/orders`,
                method: 'POST',
                body: payload
            }, response, this.environment);

            console.log('✅ Pedido criado com sucesso:', response.data.id);
            return response.data;

        } catch (error) {
            // Log do erro
            pagbankLogger.logTransaction('CREDIT_CARD_ERROR', {
                url: `${this.baseUrl}/orders`,
                method: 'POST',
                body: orderData
            }, { error: error.response?.data || error.message }, this.environment);

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
            
            // URL de webhook baseada no ambiente
            const webhookUrl = process.env.PAGBANK_WEBHOOK_URL || 
                              (this.environment === 'production' 
                                  ? 'https://escrita360.com/api/webhook/pagbank' 
                                  : 'http://localhost:5000/api/webhook/pagbank');
            
            // Calcular o valor total dos itens
            const totalAmount = orderData.items.reduce((sum, item) => sum + (item.unit_amount * item.quantity), 0);
            
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
                        value: totalAmount
                    },
                    expiration_date: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString().replace(/\.\d{3}Z$/, '-03:00')
                }],
                shipping: {
                    address: {
                        street: "Rua Exemplo",
                        number: "123",
                        locality: "Centro",
                        city: "São Paulo",
                        region_code: "SP",
                        country: "BRA",
                        postal_code: "01234567"
                    }
                }
            };

            // Incluir notification_urls para produção
            if (webhookUrl && webhookUrl.startsWith('https://')) {
                payload.notification_urls = [webhookUrl];
            }

            // Log do request antes de enviar
            pagbankLogger.logRequest('PIX', {
                url: `${this.baseUrl}/orders`,
                method: 'POST',
                body: payload
            }, this.environment);

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

            // Log completo da transação
            pagbankLogger.logTransaction('PIX_PRODUCTION', {
                url: `${this.baseUrl}/orders`,
                method: 'POST',
                body: payload
            }, response, this.environment);

            console.log('✅ QR Code PIX gerado em PRODUÇÃO:', response.data.id);
            console.log('💰 Valor:', (response.data.qr_codes?.[0]?.amount?.value / 100).toFixed(2), 'BRL');
            if (payload.notification_urls) {
                console.log('📞 Webhook configurado:', payload.notification_urls[0]);
            } else {
                console.log('📞 Webhook não configurado');
            }
            console.log('⏰ Expira em:', response.data.qr_codes?.[0]?.expiration_date);
            
            return response.data;

        } catch (error) {
            // Log do erro
            pagbankLogger.logTransaction('PIX_ERROR', {
                url: `${this.baseUrl}/orders`,
                method: 'POST',
                body: orderData
            }, { error: error.response?.data || error.message }, this.environment);

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
                            holder: {
                                name: orderData.charges[0].payment_method.boleto.holder.name,
                                tax_id: orderData.charges[0].payment_method.boleto.holder.tax_id,
                                email: orderData.charges[0].payment_method.boleto.holder.email,
                                address: {
                                    street: orderData.charges[0].payment_method.boleto.holder.address?.street || 'Rua Principal',
                                    number: orderData.charges[0].payment_method.boleto.holder.address?.number || '123',
                                    locality: orderData.charges[0].payment_method.boleto.holder.address?.locality || 'Centro',
                                    city: orderData.charges[0].payment_method.boleto.holder.address?.city || 'São Paulo',
                                    region: orderData.charges[0].payment_method.boleto.holder.address?.region || 'SP',
                                    region_code: orderData.charges[0].payment_method.boleto.holder.address?.region_code || 'SP',
                                    country: orderData.charges[0].payment_method.boleto.holder.address?.country || 'BRA',
                                    postal_code: orderData.charges[0].payment_method.boleto.holder.address?.postal_code || '01000000'
                                }
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
            
            // Tratamento específico para diferentes códigos de erro
            if (error.response) {
                const statusCode = error.response.status;
                const errorData = error.response.data;
                
                console.error('📋 Status code:', statusCode);
                console.error('📋 Error data:', JSON.stringify(errorData, null, 2));
                
                // Código 2054 pode indicar pedido não encontrado ou expirado
                if (statusCode === 404) {
                    throw new Error('Pedido não encontrado ou expirado');
                } else if (statusCode === 401) {
                    throw new Error('Token de autenticação inválido');
                } else if (statusCode === 403) {
                    throw new Error('Acesso negado à API');
                } else if (statusCode === 429) {
                    throw new Error('Limite de requisições excedido');
                } else if (statusCode === 2054) {
                    // Código específico 2054 - pode indicar status específico
                    console.warn('⚠️ Código 2054 detectado - possível status especial do PagBank');
                    throw new Error('Status especial do PagBank (2054) - verifique documentação');
                } else if (errorData?.error_messages) {
                    const pagbankError = errorData.error_messages[0];
                    throw new Error(`PagBank: ${pagbankError.description} (${pagbankError.parameter_name})`);
                }
            }
            
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

    /**
     * Consulta um pedido/order
     * https://dev.pagbank.uol.com.br/reference/consultar-pedido
     */
    async getOrder(orderId) {
        try {
            console.log('🔍 Consultando pedido:', orderId);

            const response = await axios.get(
                `${this.baseUrl}/orders/${orderId}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.token}`
                    }
                }
            );

            console.log('✅ Pedido consultado:', response.data.id);
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
}

module.exports = PagBankOrdersService;
