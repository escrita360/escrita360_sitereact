const axios = require('axios');

require('dotenv').config();

class PagBankSubscriptionsService {
    constructor() {
        this.environment = process.env.PAGBANK_ENV || 'sandbox';
        this.token = process.env.PAGBANK_TOKEN;
        this.demoMode = process.env.PAGBANK_MOCK_MODE === 'true';
        
        // URLs da API v4 do PagBank (Connect)
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
            'Accept': 'application/json',
            'User-Agent': 'Escrita360/1.0 (Node.js)',
            'x-api-version': '4.0'
        };

        // Validar token apenas se não estiver em modo simulação
        if (!this.demoMode && (!this.token || this.token.includes('your_pagbank_token'))) {
            console.error('❌ PAGBANK_TOKEN não configurado!');
            console.error('📋 Variáveis de ambiente disponíveis:');
            console.error(`   NODE_ENV: ${process.env.NODE_ENV}`);
            console.error(`   PORT: ${process.env.PORT}`);
            console.error(`   PAGBANK_ENV: ${process.env.PAGBANK_ENV}`);
            console.error(`   PAGBANK_EMAIL: ${process.env.PAGBANK_EMAIL}`);
            console.error(`   PAGBANK_TOKEN presente: ${!!process.env.PAGBANK_TOKEN}`);
            throw new Error('PAGBANK_TOKEN não configurado! Configure as variáveis de ambiente no Easypanel (veja EASYPANEL_ENV_VARS.md)');
        }

        console.log(`🔧 PagBank Subscriptions Service inicializado`);
        console.log(`   Ambiente: ${this.environment}`);
        console.log(`   Email: ${process.env.PAGBANK_EMAIL || 'não configurado'}`);
        console.log(`   Token: ${this.token ? this.token.substring(0, 20) + '...' + this.token.substring(this.token.length - 10) : 'MODO SIMULAÇÃO'}`);
        console.log(`   Base URL: ${this.subscriptionsBaseUrl}`);
        if (this.demoMode) {
            console.log(`⚠️  MODO SIMULAÇÃO ATIVADO - Nenhuma chamada real será feita à API do PagBank`);
        }
    }

    async makeRequest(endpoint, method = 'GET', data = null, usePaymentsApi = false) {
        // Modo simulação - retorna dados mockados
        if (this.demoMode) {
            console.log(`🎭 [MOCK] ${method} ${endpoint} - Retornando dados simulados`);
            return this.getMockResponse(endpoint, method, data);
        }

        const baseUrl = usePaymentsApi ? this.paymentsBaseUrl : this.subscriptionsBaseUrl;
        const url = `${baseUrl}${endpoint}`;

        try {
            const config = {
                method,
                url,
                headers: {
                    ...this.headers,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            };

            if (data && (method === 'POST' || method === 'PUT')) {
                config.data = data;
                console.log(`🔄 ${method} ${url}`);
                console.log('📦 Payload:', JSON.stringify(data, null, 2));
                console.log('📋 Headers:', JSON.stringify(config.headers, null, 2));
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
                console.error(`Headers da resposta:`, error.response.headers);
                console.error(`Dados do erro:`, JSON.stringify(error.response.data, null, 2));
                
                // Mensagens específicas por tipo de erro
                if (error.response.status === 403) {
                    console.error('');
                    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                    console.error('⚠️  ERRO 403: Token não autorizado');
                    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                    console.error('');
                    console.error('O token configurado não tem permissão para esta operação.');
                    console.error('');
                    console.error('Possíveis causas:');
                    console.error('1. Token de API v3 sendo usado na API v4');
                    console.error('2. Token sem permissões de criação de planos/assinaturas');
                    console.error('3. Token expirado ou inválido');
                    console.error('');
                    console.error('Solução:');
                    console.error('1. Acesse: https://painel.pagseguro.uol.com.br/');
                    console.error('2. Vá em Integrações > API');
                    console.error('3. Gere um novo token com permissões completas');
                    console.error('4. Configure no .env: PAGBANK_TOKEN=novo_token');
                    console.error('');
                    console.error('Modo DEMO será ativado automaticamente.');
                    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                    console.error('');
                    
                    // Ativar modo demo automaticamente
                    this.demoMode = true;
                }
            } else {
                console.error(`Mensagem: ${error.message}`);
            }
            throw error;
        }
    }

    getMockResponse(endpoint, method, data) {
        const mockId = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        if (endpoint === '/plans' && method === 'GET') {
            // Mock para listPlans
            return {
                plans: [{
                    id: `plan_${mockId}`,
                    name: data?.plan_name || 'Plano Básico',
                    description: data?.plan_description || 'Plano de teste',
                    amount: { value: data?.amount || 2990, currency: 'BRL' },
                    interval: { unit: data?.interval_unit || 'MONTH', value: data?.interval_value || 1 },
                    created_at: new Date().toISOString(),
                    status: 'ACTIVE'
                }]
            };
        }
        
        if (endpoint.startsWith('/plans') && method === 'POST') {
            // Mock para createPlan
            return {
                id: `plan_${mockId}`,
                name: data.name,
                description: data.description,
                amount: data.amount,
                interval: { unit: data.interval_unit, value: data.interval_value },
                created_at: new Date().toISOString(),
                status: 'ACTIVE'
            };
        }
        
        if (endpoint === '/subscriptions' && method === 'POST') {
            // Mock para createSubscription
            return {
                id: `sub_${mockId}`,
                reference_id: data.reference_id,
                plan: data.plan,
                customer: data.customer,
                payment_method: data.payment_method,
                status: 'ACTIVE',
                created_at: new Date().toISOString(),
                next_charge_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            };
        }
        
        // Fallback mock
        return {
            id: mockId,
            status: 'SUCCESS',
            message: 'Operação simulada com sucesso',
            created_at: new Date().toISOString()
        };
    }

    formatTaxId(taxId) {
        if (!taxId) return null;
        const cleaned = taxId.replace(/\D/g, '');
        if (cleaned.length !== 11 && cleaned.length !== 14) {
            throw new Error(`CPF/CNPJ inválido: deve ter 11 (CPF) ou 14 (CNPJ) dígitos, recebido ${cleaned.length}`);
        }
        return cleaned;
    }

    formatPhone(phone) {
        if (!phone) return null;

        // Se já for um objeto formatado, retorna como está
        if (typeof phone === 'object' && phone.area_code && phone.number) {
            return {
                country: '55',
                area: phone.area_code,
                number: phone.number,
                type: phone.number.length >= 9 ? 'MOBILE' : 'BUSINESS'
            };
        }

        // Se for string, processa normalmente
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length < 10) {
            throw new Error(`Telefone inválido: deve ter pelo menos 10 dígitos (DDD + número), recebido ${cleaned.length}`);
        }
        const areaCode = cleaned.substring(0, 2);
        const number = cleaned.substring(2);
        return {
            country: '55',
            area: areaCode,
            number: number,
            type: number.length >= 9 ? 'MOBILE' : 'BUSINESS'
        };
    }

    async createPlan(planData) {
        // Validações
        if (!planData.name) {
            throw new Error('Nome do plano é obrigatório');
        }
        if (!planData.amount || planData.amount <= 0) {
            throw new Error('Valor do plano deve ser maior que zero');
        }

        // Payload conforme documentação PagBank API v4
        const payload = {
            reference_id: `plan_${Date.now()}`,
            name: planData.name.substring(0, 100),
            description: (planData.description || `Plano ${planData.name}`).substring(0, 255),
            amount: {
                value: Math.round(planData.amount * 100), // Centavos
                currency: 'BRL'
            },
            interval: {
                unit: (planData.interval_unit || 'MONTH').toUpperCase(),
                length: parseInt(planData.interval_value || 1)
            },
            payment_method: Array.isArray(planData.payment_methods) 
                ? planData.payment_methods 
                : ['CREDIT_CARD', 'BOLETO']
        };

        // Trial period (opcional)
        if (planData.trial && planData.trial > 0) {
            payload.trial = {
                enabled: true,
                hold_setup_fee: false,
                days: parseInt(planData.trial)
            };
        }

        console.log('📤 Payload do plano para PagBank:', JSON.stringify(payload, null, 2));
        return this.makeRequest('/plans', 'POST', payload);
    }

    async tokenizeCard(cardData) {
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
        const paymentMethod = subscriptionData.payment_method || 'CREDIT_CARD';

        // Validar dados obrigatórios
        if (!customerData.name || !customerData.email) {
            throw new Error('Nome e email do cliente são obrigatórios');
        }

        const payload = {
            reference_id: `subscription_${Date.now()}`,
            plan: {
                id: subscriptionData.plan_id
            },
            customer: {},
            payment_method: {}
        };

        // Incluir amount se fornecido (obrigatório para cartão de crédito)
        if (subscriptionData.amount) {
            payload.amount = {
                value: subscriptionData.amount,
                currency: 'BRL'
            };
        }

        if (customerData.id) {
            payload.customer = {
                id: customerData.id
            };
        } else {
            // Dados básicos do cliente
            payload.customer = {
                reference_id: `customer_${Date.now()}`,
                name: customerData.name,
                email: customerData.email
            };

            // CPF/CNPJ (opcional no sandbox, mas recomendado)
            if (customerData.cpf || customerData.tax_id) {
                try {
                    payload.customer.tax_id = this.formatTaxId(customerData.cpf || customerData.tax_id);
                } catch (error) {
                    console.warn('⚠️ CPF/CNPJ inválido, continuando sem:', error.message);
                }
            }

            // Telefone (opcional no sandbox)
            if (customerData.phone) {
                try {
                    payload.customer.phones = [this.formatPhone(customerData.phone)];
                } catch (error) {
                    console.warn('⚠️ Telefone inválido, continuando sem:', error.message);
                }
            }
        }

        // Configurar método de pagamento baseado no tipo
        if (paymentMethod === 'BOLETO') {
            // Para boleto, apenas indicar o tipo
            payload.payment_method = [{
                type: 'BOLETO'
            }];
        } else if (paymentMethod === 'CREDIT_CARD') {
            if (!subscriptionData.cardData) {
                throw new Error('Dados do cartão são obrigatórios para pagamento com cartão de crédito');
            }

            // Para cartão, o PagBank exige:
            // 1. Dados do cartão no customer.billing_info (para associar ao cliente)
            // 2. Dados do cartão no payment_method (para cobrança)

            // Adicionar billing_info ao customer
            payload.customer.billing_info = [{
                type: 'CREDIT_CARD',
                card: {
                    number: subscriptionData.cardData.number.replace(/\s/g, ''),
                    exp_month: String(subscriptionData.cardData.expiryMonth).padStart(2, '0'),
                    exp_year: String(subscriptionData.cardData.expiryYear),
                    security_code: String(subscriptionData.cardData.cvv),
                    holder: {
                        name: subscriptionData.cardData.holderName
                    }
                }
            }];

            // Incluir dados do cartão no payment_method
            payload.payment_method = [{
                type: 'CREDIT_CARD',
                card: {
                    number: subscriptionData.cardData.number.replace(/\s/g, ''),
                    exp_month: String(subscriptionData.cardData.expiryMonth).padStart(2, '0'),
                    exp_year: String(subscriptionData.cardData.expiryYear),
                    security_code: String(subscriptionData.cardData.cvv),
                    holder: {
                        name: subscriptionData.cardData.holderName
                    }
                }
            }];
        }        console.log('📤 Enviando payload para PagBank:', JSON.stringify(payload, null, 2));
        return this.makeRequest('/subscriptions', 'POST', payload);
    }

    async createCompleteSubscription(data) {
        try {
            console.log('🔄 Iniciando fluxo completo de assinatura...');
            
            // Passo 1: Verificar se o plano já existe
            console.log('📋 Verificando se plano já existe...');
            let plan;
            try {
                const existingPlans = await this.listPlans();
                // Procurar plano com o mesmo nome
                const existingPlan = existingPlans.plans?.find(p => p.name === data.plan_name);
                if (existingPlan) {
                    console.log('✅ Plano existente encontrado:', existingPlan.id);
                    plan = existingPlan;
                } else {
                    throw new Error('Plano não encontrado');
                }
            } catch {
                console.log('📋 Plano não encontrado, criando novo...');
                // Se não encontrou ou erro na busca, criar novo plano
                plan = await this.createPlan({
                    name: data.plan_name,
                    description: data.plan_description,
                    amount: data.amount,
                    interval_unit: data.interval_unit,
                    interval_value: data.interval_value,
                    payment_methods: ['CREDIT_CARD', 'BOLETO']
                });
                console.log('✅ Plano criado:', plan.id);
            }

            // Passo 2: Criar a assinatura
            console.log('📝 Criando assinatura...');
            const subscription = await this.createSubscription({
                plan_id: plan.id,
                customer: data.customer,
                payment_method: data.payment_method || 'BOLETO',
                cardData: data.cardData,
                amount: data.amount // Passar o amount para a assinatura
            });
            console.log('✅ Assinatura criada:', subscription.id);

            return {
                plan,
                subscription
            };
        } catch (error) {
            console.error('❌ Erro no fluxo completo de assinatura:');
            console.error('Mensagem:', error.message);
            if (error.response?.data) {
                console.error('Detalhes da API:', JSON.stringify(error.response.data, null, 2));
            }
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