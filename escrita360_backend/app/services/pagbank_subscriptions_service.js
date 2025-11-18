const axios = require('axios');

require('dotenv').config();

class PagBankSubscriptionsService {
    constructor() {
        this.environment = process.env.PAGBANK_ENV || 'sandbox';
        this.token = process.env.PAGBANK_TOKEN;

        if (this.environment === 'sandbox') {
            this.baseUrl = 'https://sandbox.api.assinaturas.pagseguro.com';
        } else {
            this.baseUrl = 'https://api.assinaturas.pagseguro.com';
        }

        this.headers = {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
    }

    async makeRequest(endpoint, method = 'GET', data = null) {
        const url = `${this.baseUrl}${endpoint}`;

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
            console.error(`❌ Erro na requisição PagBank Subscriptions:`);
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
        return taxId.replace(/\D/g, '');
    }

    formatPhone(phone) {
        const cleanPhone = phone.replace(/\D/g, '');

        if (cleanPhone.length >= 10) {
            return {
                country: '55',
                area: cleanPhone.substring(0, 2),
                number: cleanPhone.substring(2),
                type: 'MOBILE'
            };
        } else {
            throw new Error('Telefone inválido');
        }
    }

    async createPlan(planData) {
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

    async createSubscriber(subscriberData) {
        const payload = {
            reference_id: `customer_${Date.now()}`,
            name: subscriberData.name,
            email: subscriberData.email,
            tax_id: this.formatTaxId(subscriberData.tax_id),
            phones: [this.formatPhone(subscriberData.phone)]
        };

        if (subscriberData.address) {
            payload.address = subscriberData.address;
        }

        return this.makeRequest('/customers', 'POST', payload);
    }

    async createSubscription(subscriptionData) {
        const customerData = subscriptionData.customer;
        const paymentMethod = subscriptionData.payment_method || 'BOLETO';

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
                tax_id: this.formatTaxId(customerData.cpf),
                phones: [this.formatPhone(customerData.phone)]
            };

            if (paymentMethod === 'BOLETO') {
                payload.customer.address = customerData.address || {
                    street: 'Rua Exemplo',
                    number: '123',
                    complement: 'Apto 1',
                    locality: 'Centro',
                    city: 'São Paulo',
                    region_code: 'SP',
                    country: 'BRA',
                    postal_code: '01310100'
                };
            }
        }

        if (paymentMethod === 'BOLETO') {
            payload.payment_method.push({
                type: 'BOLETO'
            });
        }

        if (subscriptionData.amount) {
            payload.amount = {
                value: Math.round(subscriptionData.amount * 100),
                currency: 'BRL'
            };
        }

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
                amount: data.amount
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