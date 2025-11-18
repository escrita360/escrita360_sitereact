const axios = require('axios');

require('dotenv').config();

class PagBankSubscriptionsService {
    constructor() {
        this.environment = process.env.PAGBANK_ENV || 'sandbox';
        this.token = process.env.PAGBANK_TOKEN;
        this.mockMode = process.env.PAGBANK_MOCK_MODE === 'true';

        if (this.environment === 'sandbox') {
            this.subscriptionsBaseUrl = 'https://sandbox.api.assinaturas.pagseguro.com';
            this.paymentsBaseUrl = 'https://sandbox.api.pagseguro.com';
        } else {
            this.subscriptionsBaseUrl = 'https://api.assinaturas.pagseguro.com';
            this.paymentsBaseUrl = 'https://api.pagseguro.com';
        }

        this.headers = {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        if (this.mockMode) {
            console.log('⚠️ MODO SIMULAÇÃO ATIVADO - Nenhuma chamada real será feita à API do PagBank');
        }
    }

    async makeRequest(endpoint, method = 'GET', data = null, usePaymentsApi = false) {
        const baseUrl = usePaymentsApi ? this.paymentsBaseUrl : this.subscriptionsBaseUrl;
        const url = `${baseUrl}${endpoint}`;

        try {
            const config = {
                method,
                url,
                headers: this.headers,
            };

            if (data && (method === 'POST' || method === 'PUT')) {
                config.data = data;
                console.log(`🔄 ${method} ${url}`);
                console.log('📦 Payload:', JSON.stringify(data, null, 2));
            }

            const response = await axios(config);
            console.log(`✅ ${method} ${url} - Status: ${response.status}`);
            return response.data;
        } catch (error) {
            console.error(`❌ Erro na requisição PagBank ${usePaymentsApi ? 'Payments' : 'Subscriptions'}:`);
            console.error(`URL: ${url}`);
            console.error(`Método: ${method}`);
            if (error.response) {
                console.error(`Status: ${error.response.status}`);
                console.error(`Dados do erro:`, JSON.stringify(error.response.data, null, 2));
            } else {
                console.error(`Mensagem: ${error.message}`);
            }
            throw error;
        }
    }

    formatTaxId(taxId) {
        const cleaned = taxId.replace(/\D/g, '');
        if (cleaned.length !== 11 && cleaned.length !== 14) {
            throw new Error('CPF/CNPJ inválido');
        }
        return cleaned;
    }

    formatPhone(phone) {
        const cleanPhone = phone.replace(/\D/g, '');

        if (cleanPhone.length >= 10) {
            const areaCode = cleanPhone.substring(0, 2);
            const number = cleanPhone.substring(2);
            return {
                country: '55',
                area: areaCode,
                number: number,
                type: number.length >= 9 ? 'MOBILE' : 'BUSINESS'
            };
        } else {
            throw new Error('Telefone deve ter pelo menos 10 dígitos (DDD + número)');
        }
    }

    async createPlan(planData) {
        // Modo simulação
        if (this.mockMode) {
            console.log('🎭 SIMULAÇÃO: Criando plano...');
            const mockPlan = {
                id: `PLAN_${Date.now()}`,
                reference_id: `plan_${Date.now()}`,
                name: planData.name,
                description: planData.description || `Plano ${planData.name}`,
                amount: {
                    value: Math.round(planData.amount * 100),
                    currency: 'BRL'
                },
                interval: {
                    unit: planData.interval_unit || 'MONTH',
                    length: planData.interval_value || 1
                },
                payment_methods: planData.payment_methods || ['CREDIT_CARD', 'BOLETO'],
                status: 'ACTIVE',
                created_at: new Date().toISOString()
            };
            console.log('✅ SIMULAÇÃO: Plano criado:', mockPlan);
            return mockPlan;
        }

        const payload = {
            reference_id: `plan_${Date.now()}`,
            name: planData.name,
            description: planData.description || `Plano ${planData.name}`,
            amount: {
                value: Math.round(planData.amount * 100),
                currency: 'BRL'
            },
            interval: {
                unit: planData.interval_unit || 'MONTH',
                length: planData.interval_value || 1
            },
            payment_methods: planData.payment_methods || ['CREDIT_CARD', 'BOLETO']
        };

        if (planData.trial) {
            payload.trial = {
                enabled: true,
                hold_setup_fee: false,
                days: planData.trial
            };
        }

        return this.makeRequest('/plans', 'POST', payload);
    }

    async tokenizeCard(cardData) {
        // Modo simulação
        if (this.mockMode) {
            console.log('🎭 SIMULAÇÃO: Tokenizando cartão...');
            const mockToken = {
                id: `TOKEN_${Date.now()}`,
                type: 'CARD',
                card: {
                    brand: 'visa',
                    first_digits: cardData.number.substring(0, 6),
                    last_digits: cardData.number.substring(cardData.number.length - 4),
                    holder_name: cardData.holderName,
                    exp_month: cardData.expiryMonth,
                    exp_year: cardData.expiryYear
                },
                created_at: new Date().toISOString()
            };
            console.log('✅ SIMULAÇÃO: Cartão tokenizado:', mockToken);
            return mockToken;
        }

        const payload = {
            type: 'CARD',
            card: {
                number: cardData.number,
                exp_month: cardData.expiryMonth,
                exp_year: cardData.expiryYear,
                security_code: cardData.cvv,
                holder: {
                    name: cardData.holderName
                }
            }
        };

        return this.makeRequest('/tokens', 'POST', payload, true);
    }

    async createSubscription(subscriptionData) {
        const customerData = subscriptionData.customer;
        const paymentMethod = subscriptionData.payment_method || 'BOLETO';

        // Modo simulação
        if (this.mockMode) {
            console.log('🎭 SIMULAÇÃO: Criando assinatura...');
            const mockSubscription = {
                id: `SUBS_${Date.now()}`,
                reference_id: `subscription_${Date.now()}`,
                plan: {
                    id: subscriptionData.plan_id,
                    name: 'Plano Simulado'
                },
                customer: {
                    id: `CUST_${Date.now()}`,
                    reference_id: `customer_${Date.now()}`,
                    name: customerData.name,
                    email: customerData.email,
                    tax_id: this.formatTaxId(customerData.cpf || customerData.tax_id)
                },
                status: 'ACTIVE',
                payment_method: {
                    type: paymentMethod
                },
                amount: subscriptionData.amount ? {
                    value: Math.round(subscriptionData.amount * 100),
                    currency: 'BRL'
                } : undefined,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            if (paymentMethod === 'CREDIT_CARD' && subscriptionData.cardData) {
                mockSubscription.payment_method.card = {
                    number: subscriptionData.cardData.number.replace(/\d(?=\d{4})/g, '*'),
                    holder: { name: subscriptionData.cardData.holderName }
                };
            }
            console.log('✅ SIMULAÇÃO: Assinatura criada:', mockSubscription);
            return mockSubscription;
        }

        const payload = {
            reference_id: `subscription_${Date.now()}`,
            plan: {
                id: subscriptionData.plan_id
            },
            customer: {},
            payment_method: []
        };

        if (customerData.id) {
            payload.customer = {
                id: customerData.id
            };
        } else {
            payload.customer = {
                reference_id: `customer_${Date.now()}`,
                name: customerData.name,
                email: customerData.email,
                tax_id: this.formatTaxId(customerData.cpf || customerData.tax_id),
                phones: [this.formatPhone(customerData.phone)]
            };

            // Endereço pode ser obrigatório para cartão também
            payload.customer.address = {
                street: customerData.address?.street || 'Rua Exemplo',
                number: customerData.address?.number || '123',
                complement: customerData.address?.complement || '',
                locality: customerData.address?.locality || 'Centro',
                city: customerData.address?.city || 'São Paulo',
                region_code: customerData.address?.region_code || 'SP',
                country: 'BRA',
                postal_code: customerData.address?.postal_code?.replace(/\D/g, '') || '01310100'
            };
        }

        if (paymentMethod === 'BOLETO') {
            payload.payment_method = {
                type: 'BOLETO'
            };
        } else if (paymentMethod === 'CREDIT_CARD') {
            if (!subscriptionData.cardData) {
                throw new Error('Dados do cartão são obrigatórios para pagamento com cartão de crédito');
            }
            payload.payment_method = {
                type: 'CREDIT_CARD',
                card: {
                    number: subscriptionData.cardData.number,
                    exp_month: subscriptionData.cardData.expiryMonth,
                    exp_year: subscriptionData.cardData.expiryYear,
                    security_code: subscriptionData.cardData.cvv,
                    holder: {
                        name: subscriptionData.cardData.holderName
                    }
                }
            };
        }

        // Remover o amount, já que o plano já define o valor
        // if (subscriptionData.amount) {
        //     payload.amount = {
        //         value: Math.round(subscriptionData.amount * 100),
        //         currency: 'BRL'
        //     };
        // }

        return this.makeRequest('/subscriptions', 'POST', payload);
    }

    async createCompleteSubscription(data) {
        try {
            const plan = await this.createPlan({
                name: data.plan_name,
                description: data.plan_description,
                amount: data.amount,
                interval_unit: data.interval_unit,
                interval_value: data.interval_value,
                payment_methods: ['CREDIT_CARD', 'BOLETO']
            });

            const subscription = await this.createSubscription({
                plan_id: plan.id,
                customer: data.customer,
                payment_method: data.payment_method || 'BOLETO',
                amount: data.amount,
                cardData: data.cardData
            });

            return {
                plan,
                subscription
            };
        } catch (error) {
            console.error(`Erro no fluxo completo: ${error}`);
            throw error;
        }
    }

    async listPlans(filters = {}) {
        const queryString = new URLSearchParams(filters).toString();
        const endpoint = `/plans${queryString ? '?' + queryString : ''}`;
        return this.makeRequest(endpoint);
    }

    async getPlan(planId) {
        return this.makeRequest(`/plans/${planId}`);
    }

    async listSubscriptions(filters = {}) {
        const queryString = new URLSearchParams(filters).toString();
        const endpoint = `/subscriptions${queryString ? '?' + queryString : ''}`;
        return this.makeRequest(endpoint);
    }

    async getSubscription(subscriptionId) {
        return this.makeRequest(`/subscriptions/${subscriptionId}`);
    }

    async cancelSubscription(subscriptionId) {
        return this.makeRequest(`/subscriptions/${subscriptionId}/cancel`, 'PUT');
    }
}

module.exports = PagBankSubscriptionsService;