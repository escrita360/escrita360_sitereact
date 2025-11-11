/**
 * Serviço de Assinaturas (Pagamentos Recorrentes) PagBank
 * Documentação: https://developer.pagbank.com.br/docs/pagamentos-recorrentes
 * API Reference: https://developer.pagbank.com.br/reference/criar-assinatura
 */

// Configurações da API de Assinaturas
const SUBSCRIPTIONS_CONFIG = {
  sandbox: {
    baseUrl: 'https://sandbox.api.assinaturas.pagseguro.com',
    dashboardUrl: 'https://sandbox.assinaturas.pagseguro.uol.com.br/login'
  },
  production: {
    baseUrl: 'https://api.assinaturas.pagseguro.com',
    dashboardUrl: 'https://assinaturas.pagseguro.uol.com.br/login'
  }
}

class PagBankSubscriptionsService {
  constructor() {
    const isNode = typeof process !== 'undefined' && process.env
    const env = isNode ? process.env : import.meta.env
    
    this.environment = env.VITE_PAGBANK_ENV || 'sandbox'
    this.config = SUBSCRIPTIONS_CONFIG[this.environment]
    this.token = env.VITE_PAGBANK_TOKEN
  }

  /**
   * Faz requisições autenticadas para a API de Assinaturas
   */
  async makeRequest(endpoint, options = {}) {
    const url = `${this.config.baseUrl}${endpoint}`
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`,
      'Accept': 'application/json'
    }

    const requestOptions = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers
      }
    }

    try {
      console.log('📤 PagBank Subscriptions Request:', {
        url,
        method: options.method || 'GET',
        body: options.body ? JSON.parse(options.body) : null
      })

      const response = await fetch(url, requestOptions)
      
      const responseData = await response.json().catch(() => ({}))

      if (!response.ok) {
        console.error('❌ PagBank API Error:', responseData)
        throw new Error(responseData.message || `HTTP Error: ${response.status}`)
      }

      console.log('✅ PagBank Subscriptions Response:', responseData)
      return responseData
    } catch (error) {
      console.error('❌ PagBank Subscriptions Error:', error)
      throw error
    }
  }

  /**
   * Cria um novo plano de assinatura
   * Documentação: https://developer.pagbank.com.br/reference/criar-plano
   */
  async createPlan(planData) {
    const {
      name,
      description,
      amount,
      intervalUnit = 'MONTH', // MONTH, YEAR, etc
      intervalValue = 1,
      trial = null
    } = planData

    const payload = {
      reference_id: `plan_${Date.now()}`,
      name,
      description: description || `Plano ${name} - Escrita360`,
      amount: {
        value: Math.round(amount * 100), // Converter para centavos
        currency: 'BRL'
      },
      interval: {
        unit: intervalUnit,
        value: intervalValue
      },
      ...(trial && {
        trial: {
          enabled: true,
          hold_setup_fee: false,
          days: trial
        }
      })
    }

    return await this.makeRequest('/plans', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  }

  /**
   * Lista todos os planos
   * Documentação: https://developer.pagbank.com.br/reference/listar-planos
   */
  async listPlans(filters = {}) {
    const queryParams = new URLSearchParams()
    
    if (filters.status) queryParams.append('status', filters.status)
    if (filters.offset) queryParams.append('offset', filters.offset)
    if (filters.limit) queryParams.append('limit', filters.limit)

    const endpoint = `/plans${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    return await this.makeRequest(endpoint)
  }

  /**
   * Consulta um plano específico
   * Documentação: https://developer.pagbank.com.br/reference/consultar-por-id
   */
  async getPlan(planId) {
    return await this.makeRequest(`/plans/${planId}`)
  }

  /**
   * Cria um novo assinante (subscriber)
   * Documentação: https://developer.pagbank.com.br/reference/criar-assinante
   */
  async createSubscriber(subscriberData) {
    const {
      name,
      email,
      tax_id, // CPF ou CNPJ
      phone
    } = subscriberData

    // Formatar telefone
    const phoneClean = phone.replace(/\D/g, '')
    const phoneFormatted = {
      country: '55',
      area: phoneClean.slice(0, 2),
      number: phoneClean.slice(2),
      type: 'MOBILE'
    }

    const payload = {
      reference_id: `customer_${Date.now()}`,
      name,
      email,
      tax_id: tax_id.replace(/\D/g, ''),
      phones: [phoneFormatted]
    }

    return await this.makeRequest('/customers', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  }

  /**
   * Cria uma nova assinatura (subscription)
   * Documentação: https://developer.pagbank.com.br/reference/criar-assinatura
   * 
   * Este é o método principal para criar cobranças recorrentes
   */
  async createSubscription(subscriptionData) {
    const {
      planId, // ID do plano criado anteriormente
      customer, // Dados do cliente
      paymentMethod = 'CREDIT_CARD', // CREDIT_CARD, BOLETO
      cardToken = null, // Token do cartão (se usar cartão)
      cardSecurityCode = null, // CVV (se usar cartão)
      amount = null, // Sobrescrever valor do plano (opcional)
      proRata = false,
      bestInvoiceDay = null // Melhor dia para cobrança
    } = subscriptionData

    const payload = {
      reference_id: `subscription_${Date.now()}`,
      plan: {
        id: planId
      },
      customer: {},
      payment_method: []
    }

    // Se o cliente já existe, apenas enviar o ID
    if (customer.id) {
      payload.customer = {
        id: customer.id
      }
    } else {
      // Criar novo cliente junto com a assinatura
      const phoneClean = customer.phone.replace(/\D/g, '')
      
      payload.customer = {
        reference_id: `customer_${Date.now()}`,
        name: customer.name,
        email: customer.email,
        tax_id: customer.cpf.replace(/\D/g, ''),
        phones: [{
          country: '55',
          area: phoneClean.slice(0, 2),
          number: phoneClean.slice(2),
          type: 'MOBILE'
        }]
      }
      
      // Se for Boleto, endereço é obrigatório
      if (paymentMethod === 'BOLETO') {
        payload.customer.address = customer.address || {
          street: 'Rua Exemplo',
          number: '123',
          complement: 'Apto 1',
          locality: 'Centro',
          city: 'São Paulo',
          region_code: 'SP',
          country: 'BRA',
          postal_code: '01310100'
        }
      }

      // Se usar cartão, adicionar billing_info
      if (paymentMethod === 'CREDIT_CARD' && cardToken) {
        payload.customer.billing_info = [{
          type: 'CREDIT_CARD',
          card: {
            token: cardToken,
            security_code: cardSecurityCode
          }
        }]
      }
    }

    // Método de pagamento
    if (paymentMethod === 'CREDIT_CARD') {
      payload.payment_method.push({
        type: 'CREDIT_CARD',
        card: {
          security_code: cardSecurityCode
        }
      })
    } else if (paymentMethod === 'BOLETO') {
      payload.payment_method.push({
        type: 'BOLETO'
      })
    }

    // Sobrescrever valor do plano (se necessário)
    if (amount) {
      payload.amount = {
        value: Math.round(amount * 100),
        currency: 'BRL'
      }
    }

    // Configurar pro-rata
    if (proRata && bestInvoiceDay) {
      payload.pro_rata = true
      payload.best_invoice_date = {
        day: bestInvoiceDay
      }
    }

    return await this.makeRequest('/subscriptions', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  }

  /**
   * Lista todas as assinaturas
   * Documentação: https://developer.pagbank.com.br/reference/listar-assinaturas
   */
  async listSubscriptions(filters = {}) {
    const queryParams = new URLSearchParams()
    
    if (filters.status) queryParams.append('status', filters.status)
    if (filters.offset) queryParams.append('offset', filters.offset)
    if (filters.limit) queryParams.append('limit', filters.limit)

    const endpoint = `/subscriptions${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    return await this.makeRequest(endpoint)
  }

  /**
   * Consulta uma assinatura específica
   * Documentação: https://developer.pagbank.com.br/reference/consultar-assinatura
   */
  async getSubscription(subscriptionId) {
    return await this.makeRequest(`/subscriptions/${subscriptionId}`)
  }

  /**
   * Cancela uma assinatura
   * Documentação: https://developer.pagbank.com.br/reference/cancelar-assinatura
   */
  async cancelSubscription(subscriptionId) {
    return await this.makeRequest(`/subscriptions/${subscriptionId}/cancel`, {
      method: 'PUT'
    })
  }

  /**
   * Suspende uma assinatura temporariamente
   * Documentação: https://developer.pagbank.com.br/reference/suspender-assinatura
   */
  async suspendSubscription(subscriptionId) {
    return await this.makeRequest(`/subscriptions/${subscriptionId}/suspend`, {
      method: 'PUT'
    })
  }

  /**
   * Reativa uma assinatura suspensa
   * Documentação: https://developer.pagbank.com.br/reference/ativar-assinatura
   */
  async activateSubscription(subscriptionId) {
    return await this.makeRequest(`/subscriptions/${subscriptionId}/activate`, {
      method: 'PUT'
    })
  }

  /**
   * Lista as faturas (invoices) de uma assinatura
   * Documentação: https://developer.pagbank.com.br/reference/listar-faturas-de-assinatura
   */
  async listSubscriptionInvoices(subscriptionId, filters = {}) {
    const queryParams = new URLSearchParams()
    
    if (filters.status) queryParams.append('status', filters.status)
    if (filters.offset) queryParams.append('offset', filters.offset)
    if (filters.limit) queryParams.append('limit', filters.limit)

    const endpoint = `/subscriptions/${subscriptionId}/invoices${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    return await this.makeRequest(endpoint)
  }

  /**
   * Métodos utilitários
   */
  
  toCents(value) {
    return Math.round(parseFloat(value) * 100)
  }

  fromCents(cents) {
    return parseFloat(cents) / 100
  }

  formatTaxId(taxId) {
    return taxId.replace(/\D/g, '')
  }

  formatPhone(phone) {
    const cleaned = phone.replace(/\D/g, '')
    return {
      country: '55',
      area: cleaned.slice(0, 2),
      number: cleaned.slice(2),
      type: 'MOBILE'
    }
  }

  /**
   * Fluxo completo: Criar plano + assinatura
   * Para facilitar a integração
   */
  async createCompleteSubscription(data) {
    const {
      planName,
      planDescription,
      amount,
      intervalUnit,
      intervalValue,
      customer,
      paymentMethod,
      cardToken,
      cardSecurityCode
    } = data

    try {
      // 1. Criar o plano
      console.log('📋 Criando plano...')
      const plan = await this.createPlan({
        name: planName,
        description: planDescription,
        amount,
        intervalUnit,
        intervalValue
      })

      console.log('✅ Plano criado:', plan.id)

      // 2. Criar a assinatura
      console.log('📝 Criando assinatura...')
      const subscription = await this.createSubscription({
        planId: plan.id,
        customer,
        paymentMethod,
        cardToken,
        cardSecurityCode
      })

      console.log('✅ Assinatura criada:', subscription.id)

      return {
        plan,
        subscription
      }
    } catch (error) {
      console.error('❌ Erro no fluxo completo:', error)
      throw error
    }
  }
}

// Instância singleton
let _subscriptionsService = null
export const pagBankSubscriptionsService = (() => {
  if (!_subscriptionsService) {
    _subscriptionsService = new PagBankSubscriptionsService()
  }
  return _subscriptionsService
})()

export { PagBankSubscriptionsService }

// Status das assinaturas
export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'ACTIVE',
  OVERDUE: 'OVERDUE',
  PENDING_ACTION: 'PENDING_ACTION',
  CANCELED: 'CANCELED',
  EXPIRED: 'EXPIRED',
  PENDING: 'PENDING',
  SUSPENDED: 'SUSPENDED',
  TRIAL: 'TRIAL'
}

// Status dos planos
export const PLAN_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE'
}
