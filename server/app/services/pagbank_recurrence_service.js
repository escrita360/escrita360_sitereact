const axios = require('axios');
require('dotenv').config();

/**
 * Serviço completo para integração com a API de Recorrência do PagBank
 * Baseado na documentação oficial: https://dev.pagbank.uol.com.br/
 * 
 * Endpoints implementados:
 * - Criação de Plano
 * - Geração de Sessão
 * - Adesão ao Plano
 * - Cobrança de Plano
 * - Suspensão/Reativação
 * - Cancelamento de Adesão
 * - Edição de Valor e Planos
 * - Desconto no Pagamento
 * - Mudança de Meio de Pagamento
 * - Retentativa de Pagamento
 * - Consultas (ordens de pagamento, adesões, notificações)
 */
class PagBankRecurrenceService {
    constructor() {
        this.environment = process.env.PAGBANK_ENV || 'sandbox';
        this.email = process.env.PAGBANK_EMAIL;
        this.token = process.env.PAGBANK_TOKEN;
        this.mockMode = process.env.PAGBANK_MOCK_MODE === 'true';

        // URLs base conforme documentação
        if (this.environment === 'sandbox') {
            this.baseUrl = 'https://ws.sandbox.pagseguro.uol.com.br';
        } else {
            this.baseUrl = 'https://ws.pagseguro.uol.com.br';
        }

        // Headers padrão conforme documentação
        this.headers = {
            'Accept': 'application/vnd.pagseguro.com.br.v3+json;charset=ISO-8859-1',
            'Content-Type': 'application/json;charset=ISO-8859-1'
        };

        if (this.mockMode) {
            console.log('⚠️ MODO SIMULAÇÃO ATIVADO - Recorrência PagBank');
        }

        if (!this.email || !this.token) {
            console.warn('⚠️ PAGBANK_EMAIL ou PAGBANK_TOKEN não configurados');
        }
    }

    /**
     * Monta URL com email e token
     */
    buildUrl(path, additionalParams = {}) {
        const params = new URLSearchParams({
            email: this.email,
            token: this.token,
            ...additionalParams
        });
        return `${this.baseUrl}${path}?${params.toString()}`;
    }

    /**
     * Faz requisição HTTP
     */
    async makeRequest(endpoint, method = 'GET', data = null, additionalParams = {}) {
        const url = this.buildUrl(endpoint, additionalParams);

        try {
            const config = {
                method,
                url,
                headers: this.headers,
            };

            if (data && (method === 'POST' || method === 'PUT')) {
                config.data = data;
                console.log(`🔄 ${method} ${endpoint}`);
                console.log('📦 Payload:', JSON.stringify(data, null, 2));
            }

            const response = await axios(config);
            console.log(`✅ ${method} ${endpoint} - Status: ${response.status}`);
            return response.data;
        } catch (error) {
            console.error(`❌ Erro na requisição PagBank Recorrência:`);
            console.error(`Endpoint: ${endpoint}`);
            console.error(`Método: ${method}`);
            if (error.response) {
                console.error(`Status: ${error.response.status}`);
                console.error(`Dados do erro:`, JSON.stringify(error.response.data, null, 2));
                throw new Error(JSON.stringify(error.response.data));
            } else {
                console.error(`Mensagem: ${error.message}`);
                throw error;
            }
        }
    }

    // =========================
    // FLUXO BÁSICO
    // =========================

    /**
     * 1. Criar Plano
     * POST /pre-approvals/request/?email={email}&token={token}
     */
    async createPlan(planData) {
        if (this.mockMode) {
            return this._mockCreatePlan(planData);
        }

        const payload = {
            redirectURL: planData.redirectURL || `${process.env.FRONTEND_URL}/pagamento-sucesso`,
            reference: planData.reference || `plan_${Date.now()}`,
            preApproval: {
                name: planData.name,
                charge: planData.charge || 'AUTO',
                period: planData.period || 'MONTHLY',
                amountPerPayment: planData.amountPerPayment,
                membershipFee: planData.membershipFee || '0.00',
                trialPeriodDuration: planData.trialPeriodDuration || 0,
                expiration: planData.expiration,
                details: planData.details || planData.name,
                maxUses: planData.maxUses || 10000,
                reviewURL: planData.reviewURL || `${process.env.FRONTEND_URL}/revisar-plano`
            }
        };

        // Adicionar receiver se fornecido
        if (planData.receiver) {
            payload.preApproval.receiver = {
                email: planData.receiver.email || this.email
            };
        }

        return this.makeRequest('/pre-approvals/request/', 'POST', payload);
    }

    /**
     * 2. Gerar Sessão
     * POST /v2/sessions?email={email}&token={token}
     */
    async createSession() {
        if (this.mockMode) {
            return this._mockCreateSession();
        }

        return this.makeRequest('/v2/sessions', 'POST');
    }

    /**
     * 3. Adesão ao Plano
     * POST /pre-approvals?email={email}&token={token}
     */
    async createSubscription(subscriptionData) {
        if (this.mockMode) {
            return this._mockCreateSubscription(subscriptionData);
        }

        const payload = {
            plan: subscriptionData.plan,
            reference: subscriptionData.reference || `subscription_${Date.now()}`,
            sender: {
                name: subscriptionData.sender.name,
                email: subscriptionData.sender.email,
                phone: {
                    areaCode: subscriptionData.sender.phone.areaCode,
                    number: subscriptionData.sender.phone.number
                },
                address: {
                    street: subscriptionData.sender.address.street,
                    number: subscriptionData.sender.address.number,
                    complement: subscriptionData.sender.address.complement || '',
                    district: subscriptionData.sender.address.district,
                    city: subscriptionData.sender.address.city,
                    state: subscriptionData.sender.address.state,
                    country: 'BRA',
                    postalCode: subscriptionData.sender.address.postalCode
                },
                documents: [{
                    type: 'CPF',
                    value: subscriptionData.sender.cpf
                }]
            },
            paymentMethod: {
                type: subscriptionData.paymentMethod.type || 'CREDITCARD'
            }
        };

        // Adicionar dados do cartão se for CREDITCARD
        if (subscriptionData.paymentMethod.type === 'CREDITCARD') {
            payload.paymentMethod.creditCard = {
                token: subscriptionData.paymentMethod.creditCard.token,
                holder: {
                    name: subscriptionData.paymentMethod.creditCard.holder.name,
                    birthDate: subscriptionData.paymentMethod.creditCard.holder.birthDate,
                    documents: [{
                        type: 'CPF',
                        value: subscriptionData.paymentMethod.creditCard.holder.cpf
                    }],
                    billingAddress: subscriptionData.paymentMethod.creditCard.holder.billingAddress || subscriptionData.sender.address
                }
            };
        }

        return this.makeRequest('/pre-approvals', 'POST', payload);
    }

    /**
     * 4. Cobrar Plano
     * POST /pre-approvals/payment?email={email}&token={token}
     */
    async chargeSubscription(chargeData) {
        if (this.mockMode) {
            return this._mockChargeSubscription(chargeData);
        }

        const payload = {
            preApprovalCode: chargeData.preApprovalCode,
            reference: chargeData.reference || `charge_${Date.now()}`,
            items: chargeData.items.map(item => ({
                id: item.id,
                description: item.description,
                amount: item.amount,
                quantity: item.quantity
            }))
        };

        // Adicionar hash ou IP conforme documentação
        if (chargeData.senderHash) {
            payload.senderHash = chargeData.senderHash;
        } else if (chargeData.senderIp) {
            payload.senderIp = chargeData.senderIp;
        }

        return this.makeRequest('/pre-approvals/payment', 'POST', payload);
    }

    /**
     * 5. Retentativa de Pagamento
     * POST /pre-approvals/{preApprovalCode}/payment-orders/{paymentOrderCode}/payment?email={email}&token={token}
     */
    async retryPayment(preApprovalCode, paymentOrderCode) {
        if (this.mockMode) {
            return this._mockRetryPayment(preApprovalCode, paymentOrderCode);
        }

        return this.makeRequest(
            `/pre-approvals/${preApprovalCode}/payment-orders/${paymentOrderCode}/payment`,
            'POST'
        );
    }

    // =========================
    // GERENCIAMENTO (SUSPENSÃO/CANCELAMENTO)
    // =========================

    /**
     * Suspender Plano
     * PUT /pre-approvals/{preApprovalCode}/status?email={email}&token={token}
     */
    async suspendSubscription(preApprovalCode) {
        if (this.mockMode) {
            return this._mockUpdateStatus(preApprovalCode, 'SUSPENDED');
        }

        return this.makeRequest(
            `/pre-approvals/${preApprovalCode}/status`,
            'PUT',
            { status: 'SUSPENDED' }
        );
    }

    /**
     * Reativar Plano
     * PUT /pre-approvals/{preApprovalCode}/status?email={email}&token={token}
     */
    async reactivateSubscription(preApprovalCode) {
        if (this.mockMode) {
            return this._mockUpdateStatus(preApprovalCode, 'ACTIVE');
        }

        return this.makeRequest(
            `/pre-approvals/${preApprovalCode}/status`,
            'PUT',
            { status: 'ACTIVE' }
        );
    }

    /**
     * Cancelar Adesão
     * PUT /pre-approvals/{preApprovalCode}/cancel?email={email}&token={token}
     */
    async cancelSubscription(preApprovalCode) {
        if (this.mockMode) {
            return this._mockCancelSubscription(preApprovalCode);
        }

        return this.makeRequest(
            `/pre-approvals/${preApprovalCode}/cancel`,
            'PUT'
        );
    }

    // =========================
    // ALTERAÇÕES
    // =========================

    /**
     * Editar Valor e Planos
     * PUT /pre-approvals/request/{preApprovalRequestCode}/payment?email={email}&token={token}
     */
    async updatePlanAmount(preApprovalRequestCode, amountPerPayment, updateSubscriptions = false) {
        if (this.mockMode) {
            return this._mockUpdatePlanAmount(preApprovalRequestCode, amountPerPayment);
        }

        return this.makeRequest(
            `/pre-approvals/request/${preApprovalRequestCode}/payment`,
            'PUT',
            {
                amountPerPayment: amountPerPayment.toFixed(2),
                updateSubscriptions
            }
        );
    }

    /**
     * Incluir Desconto no Pagamento
     * PUT /pre-approvals/{preApprovalCode}/discount?email={email}&token={token}
     */
    async applyDiscount(preApprovalCode, discountType, discountValue) {
        if (this.mockMode) {
            return this._mockApplyDiscount(preApprovalCode, discountType, discountValue);
        }

        return this.makeRequest(
            `/pre-approvals/${preApprovalCode}/discount`,
            'PUT',
            {
                type: discountType, // 'DISCOUNT_PERCENT' ou 'DISCOUNT_AMOUNT'
                value: discountValue.toFixed(2)
            }
        );
    }

    /**
     * Mudar Meio de Pagamento
     * PUT /pre-approvals/{preApprovalCode}/payment-method?email={email}&token={token}
     */
    async changePaymentMethod(preApprovalCode, paymentMethodData) {
        if (this.mockMode) {
            return this._mockChangePaymentMethod(preApprovalCode);
        }

        const payload = {
            type: 'CREDITCARD',
            sender: {
                hash: paymentMethodData.senderHash
            },
            creditCard: {
                token: paymentMethodData.creditCard.token,
                holder: {
                    name: paymentMethodData.creditCard.holder.name,
                    birthDate: paymentMethodData.creditCard.holder.birthDate,
                    documents: [{
                        type: 'CPF',
                        value: paymentMethodData.creditCard.holder.cpf
                    }],
                    billingAddress: paymentMethodData.creditCard.holder.billingAddress
                }
            }
        };

        return this.makeRequest(
            `/pre-approvals/${preApprovalCode}/payment-method`,
            'PUT',
            payload
        );
    }

    // =========================
    // CONSULTAS
    // =========================

    /**
     * Listar Ordens de Pagamento
     * GET /pre-approvals/{preApprovalCode}/payment-orders?email={email}&token={token}
     */
    async listPaymentOrders(preApprovalCode) {
        if (this.mockMode) {
            return this._mockListPaymentOrders(preApprovalCode);
        }

        return this.makeRequest(`/pre-approvals/${preApprovalCode}/payment-orders`, 'GET');
    }

    /**
     * Consultar pelo Código da Adesão
     * GET /pre-approvals/{preApprovalCode}?email={email}&token={token}
     */
    async getSubscription(preApprovalCode) {
        if (this.mockMode) {
            return this._mockGetSubscription(preApprovalCode);
        }

        return this.makeRequest(`/pre-approvals/${preApprovalCode}`, 'GET');
    }

    /**
     * Consultar por Intervalo de Datas
     * GET /pre-approvals/?email={email}&token={token}&initialDate={date}&finalDate={date}
     */
    async listSubscriptionsByDate(initialDate, finalDate) {
        if (this.mockMode) {
            return this._mockListSubscriptionsByDate(initialDate, finalDate);
        }

        return this.makeRequest('/pre-approvals/', 'GET', null, {
            initialDate: initialDate, // formato: 2019-08-09T01:00
            finalDate: finalDate
        });
    }

    /**
     * Consultar pelo Código de Notificação
     * GET /pre-approvals/notifications/{notificationCode}?email={email}&token={token}
     */
    async getSubscriptionByNotification(notificationCode) {
        if (this.mockMode) {
            return this._mockGetSubscription(notificationCode);
        }

        return this.makeRequest(`/pre-approvals/notifications/${notificationCode}`, 'GET');
    }

    // =========================
    // MÉTODOS DE SIMULAÇÃO (MOCK)
    // =========================

    _mockCreatePlan(planData) {
        console.log('🎭 SIMULAÇÃO: Criando plano...');
        const mockPlan = {
            code: `PLAN_${Date.now()}`,
            date: new Date().toISOString(),
            reference: planData.reference || `plan_${Date.now()}`
        };
        console.log('✅ SIMULAÇÃO: Plano criado:', mockPlan);
        return mockPlan;
    }

    _mockCreateSession() {
        console.log('🎭 SIMULAÇÃO: Criando sessão...');
        const mockSession = {
            session: {
                id: `SESSION_${Date.now()}`
            }
        };
        console.log('✅ SIMULAÇÃO: Sessão criada:', mockSession);
        return mockSession;
    }

    _mockCreateSubscription(subscriptionData) {
        console.log('🎭 SIMULAÇÃO: Criando adesão ao plano...');
        const mockSubscription = {
            code: `SUB_${Date.now()}`,
            date: new Date().toISOString(),
            reference: subscriptionData.reference,
            plan: subscriptionData.plan,
            status: 'ACTIVE'
        };
        console.log('✅ SIMULAÇÃO: Adesão criada:', mockSubscription);
        return mockSubscription;
    }

    _mockChargeSubscription(chargeData) {
        console.log('🎭 SIMULAÇÃO: Cobrando plano...');
        const mockCharge = {
            transactionCode: `TRANS_${Date.now()}`,
            date: new Date().toISOString(),
            reference: chargeData.reference,
            status: 'PAID'
        };
        console.log('✅ SIMULAÇÃO: Cobrança realizada:', mockCharge);
        return mockCharge;
    }

    _mockRetryPayment(preApprovalCode, paymentOrderCode) {
        console.log('🎭 SIMULAÇÃO: Retentando pagamento...');
        const mockRetry = {
            paymentOrderCode,
            status: 'PROCESSING',
            date: new Date().toISOString()
        };
        console.log('✅ SIMULAÇÃO: Retentativa iniciada:', mockRetry);
        return mockRetry;
    }

    _mockUpdateStatus(preApprovalCode, status) {
        console.log(`🎭 SIMULAÇÃO: Atualizando status para ${status}...`);
        return { status: 204 };
    }

    _mockCancelSubscription(preApprovalCode) {
        console.log('🎭 SIMULAÇÃO: Cancelando assinatura...');
        return { status: 204 };
    }

    _mockUpdatePlanAmount(preApprovalRequestCode, amountPerPayment) {
        console.log('🎭 SIMULAÇÃO: Atualizando valor do plano...');
        return { status: 204 };
    }

    _mockApplyDiscount(preApprovalCode, discountType, discountValue) {
        console.log('🎭 SIMULAÇÃO: Aplicando desconto...');
        return { status: 204 };
    }

    _mockChangePaymentMethod(preApprovalCode) {
        console.log('🎭 SIMULAÇÃO: Alterando meio de pagamento...');
        return { status: 204 };
    }

    _mockListPaymentOrders(preApprovalCode) {
        console.log('🎭 SIMULAÇÃO: Listando ordens de pagamento...');
        return {
            paymentOrders: [
                {
                    code: `ORDER_${Date.now()}`,
                    status: 'PAID',
                    amount: 29.90,
                    schedulingDate: new Date().toISOString()
                }
            ]
        };
    }

    _mockGetSubscription(preApprovalCode) {
        console.log('🎭 SIMULAÇÃO: Consultando assinatura...');
        return {
            code: preApprovalCode,
            name: 'Plano Mensal',
            status: 'ACTIVE',
            reference: `ref_${preApprovalCode}`,
            lastEventDate: new Date().toISOString(),
            charge: 'AUTO',
            sender: {
                name: 'Cliente Teste',
                email: 'cliente@example.com'
            }
        };
    }

    _mockListSubscriptionsByDate(initialDate, finalDate) {
        console.log('🎭 SIMULAÇÃO: Listando assinaturas por data...');
        return {
            preApprovals: [
                {
                    code: `SUB_${Date.now()}`,
                    name: 'Plano Mensal',
                    status: 'ACTIVE',
                    date: new Date().toISOString()
                }
            ]
        };
    }

    // =========================
    // UTILITÁRIOS
    // =========================

    /**
     * Formata valor para o padrão PagBank (ex: 29.90)
     */
    formatAmount(amount) {
        return parseFloat(amount).toFixed(2);
    }

    /**
     * Formata CPF removendo caracteres especiais
     */
    formatCPF(cpf) {
        return cpf.replace(/\D/g, '');
    }

    /**
     * Formata CEP removendo caracteres especiais
     */
    formatCEP(cep) {
        return cep.replace(/\D/g, '');
    }

    /**
     * Valida status da adesão
     */
    isActiveSubscription(status) {
        return status === 'ACTIVE';
    }

    /**
     * Valida status do pagamento
     */
    isPaidPayment(status) {
        return ['PAID', 'ACTIVE'].includes(status);
    }
}

module.exports = PagBankRecurrenceService;
