/**
 * Serviço de integração com APIs PagBank
 * Baseado na documentação oficial: https://dev.pagbank.uol.com.br/
 */

// Configurações do PagBank
const PAGBANK_CONFIG = {
  sandbox: {
    baseUrl: 'https://ws.sandbox.pagseguro.uol.com.br',
    authUrl: 'https://sandbox.pagseguro.uol.com.br/connect/oauth2/authorize',
    tokenUrl: 'https://ws.sandbox.pagseguro.uol.com.br/connect/oauth2/token',
    subscriptionsUrl: 'https://sandbox.api.assinaturas.pagseguro.com'
  },
  production: {
    baseUrl: 'https://ws.pagseguro.uol.com.br',
    authUrl: 'https://pagseguro.uol.com.br/connect/oauth2/authorize',
    tokenUrl: 'https://ws.pagseguro.uol.com.br/connect/oauth2/token',
    subscriptionsUrl: 'https://api.assinaturas.pagseguro.com'
  }
}

class PagBankService {
  constructor() {
    this.environment = import.meta.env.VITE_PAGBANK_ENV || 'sandbox'
    this.config = PAGBANK_CONFIG[this.environment]
    this.token = import.meta.env.VITE_PAGBANK_TOKEN
    this.appId = import.meta.env.VITE_PAGBANK_APP_ID
    this.clientId = import.meta.env.VITE_PAGBANK_CLIENT_ID
    this.clientSecret = import.meta.env.VITE_PAGBANK_CLIENT_SECRET
  }

  /**
   * Faz requisições autenticadas para a API do PagBank
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
      const response = await fetch(url, requestOptions)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP Error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('PagBank API Error:', error)
      throw error
    }
  }

  /**
   * Faz requisições autenticadas para a API de Assinaturas do PagBank
   */
  async makeSubscriptionsRequest(endpoint, options = {}) {
    const url = `${this.config.subscriptionsUrl}${endpoint}`
    
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
      const response = await fetch(url, requestOptions)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP Error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('PagBank Subscriptions API Error:', error)
      throw error
    }
  }

  /**
   * Cria um novo pedido (Order)
   * Referência: API de Pedidos e Pagamentos
   */
  async createOrder(orderData) {
    const {
      customerId,
      items,
      shipping,
      charges,
      notificationUrls = []
    } = orderData

    const payload = {
      reference_id: `escrita360_${Date.now()}`,
      customer: {
        name: orderData.customer.name,
        email: orderData.customer.email,
        tax_id: orderData.customer.cpf,
        phone: {
          country: '+55',
          area: orderData.customer.phone.slice(1, 3),
          number: orderData.customer.phone.slice(4).replace(/\D/g, '')
        }
      },
      items: items.map(item => ({
        reference_id: item.id,
        name: item.name,
        quantity: item.quantity,
        unit_amount: Math.round(item.price * 100) // Converter para centavos
      })),
      charges: [{
        reference_id: `charge_${Date.now()}`,
        description: charges[0].description,
        amount: {
          value: Math.round(charges[0].amount * 100),
          currency: 'BRL'
        },
        payment_method: {
          type: charges[0].paymentMethod.type,
          installments: charges[0].paymentMethod.installments || 1,
          capture: true,
          card: charges[0].paymentMethod.card
        }
      }],
      notification_urls: notificationUrls
    }

    return await this.makeRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  }

  /**
   * Cria um checkout link de pagamento
   */
  async createCheckoutLink(checkoutData) {
    const {
      items,
      customer,
      expiresAt,
      redirectUrl,
      notificationUrls = []
    } = checkoutData

    const payload = {
      reference_id: `checkout_${Date.now()}`,
      description: `Pagamento Escrita360 - ${items[0].name}`,
      amount: {
        value: Math.round(items.reduce((total, item) => total + (item.price * item.quantity), 0) * 100),
        currency: 'BRL'
      },
      items: items.map(item => ({
        reference_id: item.id,
        name: item.name,
        quantity: item.quantity,
        unit_amount: Math.round(item.price * 100)
      })),
      customer: {
        name: customer.name,
        email: customer.email,
        tax_id: customer.cpf,
        phone: {
          country: '+55',
          area: customer.phone.slice(1, 3),
          number: customer.phone.slice(4).replace(/\D/g, '')
        }
      },
      expires_at: expiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      redirect_url: redirectUrl,
      notification_urls: notificationUrls,
      payment_methods: {
        credit_card: {
          installments: [
            { quantity: 1, interest_free: true },
            { quantity: 2, interest_free: true },
            { quantity: 3, interest_free: true },
            { quantity: 6, interest_free: false },
            { quantity: 12, interest_free: false }
          ]
        },
        pix: {
          expiration_date: new Date(Date.now() + 30 * 60 * 1000).toISOString()
        },
        boleto: {
          due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
        }
      }
    }

    return await this.makeRequest('/checkout-links', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  }

  /**
   * Processa pagamento com cartão de crédito diretamente
   */
  async processCardPayment(paymentData) {
    const {
      customer,
      card,
      amount,
      installments = 1,
      description = 'Pagamento Escrita360'
    } = paymentData

    // Primeiro, cria o pedido
    const orderData = {
      customer,
      items: [{
        id: 'subscription',
        name: description,
        quantity: 1,
        price: amount
      }],
      charges: [{
        description,
        amount,
        paymentMethod: {
          type: 'CREDIT_CARD',
          installments,
          card: {
            encrypted: card.encrypted,
            security_code: card.cvv,
            holder: {
              name: card.holderName,
              tax_id: customer.cpf
            }
          }
        }
      }]
    }

    return await this.createOrder(orderData)
  }

  /**
   * Gera chave PIX para pagamento
   */
  async createPixPayment(paymentData) {
    const {
      customer,
      amount,
      description = 'Pagamento Escrita360',
      expirationMinutes = 30
    } = paymentData

    const orderData = {
      customer,
      items: [{
        id: 'subscription',
        name: description,
        quantity: 1,
        price: amount
      }],
      charges: [{
        description,
        amount,
        paymentMethod: {
          type: 'PIX',
          pix: {
            expires_in: expirationMinutes * 60
          }
        }
      }]
    }

    return await this.createOrder(orderData)
  }

  /**
   * Consulta status de um pedido
   */
  async getOrderStatus(orderId) {
    return await this.makeRequest(`/orders/${orderId}`)
  }

  /**
   * Consulta status de um pagamento
   */
  async getChargeStatus(chargeId) {
    return await this.makeRequest(`/charges/${chargeId}`)
  }

  /**
   * Lista pedidos com filtros
   */
  async listOrders(filters = {}) {
    const queryParams = new URLSearchParams()
    
    if (filters.reference_id) queryParams.append('reference_id', filters.reference_id)
    if (filters.created_at_gte) queryParams.append('created_at[gte]', filters.created_at_gte)
    if (filters.created_at_lte) queryParams.append('created_at[lte]', filters.created_at_lte)
    if (filters.status) queryParams.append('status', filters.status)

    const endpoint = `/orders${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    return await this.makeRequest(endpoint)
  }

  /**
   * Cancela um pedido
   */
  async cancelOrder(orderId) {
    return await this.makeRequest(`/orders/${orderId}/cancel`, {
      method: 'POST'
    })
  }

  /**
   * Consulta cliente por ID (API de Assinaturas)
   */
  async getCustomer(customerId) {
    return await this.makeSubscriptionsRequest(`/customers/${customerId}`)
  }

  /**
   * Cria um novo cliente (API de Assinaturas)
   */
  async createCustomer(customerData) {
    const {
      name,
      email,
      tax_id,
      phone
    } = customerData

    const payload = {
      name,
      email,
      tax_id: this.formatTaxId(tax_id),
      phone: this.formatPhone(phone)
    }

    return await this.makeSubscriptionsRequest('/customers', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  }

  /**
   * Verifica chaves públicas (para validação de webhooks)
   */
  async getPublicKeys() {
    return await this.makeRequest('/public-keys')
  }

  /**
   * Valida webhook do PagBank
   */
  validateWebhook(payload, signature, publicKey) {
    // Implementar validação de assinatura conforme documentação
    // Esta é uma implementação básica - em produção, usar crypto apropriado
    try {
      const crypto = require('crypto')
      const expectedSignature = crypto
        .createHmac('sha256', publicKey)
        .update(payload)
        .digest('hex')
      
      return signature === expectedSignature
    } catch (error) {
      console.error('Erro na validação do webhook:', error)
      return false
    }
  }

  /**
   * Métodos utilitários
   */
  
  /**
   * Converte valor em reais para centavos
   */
  toCents(value) {
    return Math.round(parseFloat(value) * 100)
  }

  /**
   * Converte centavos para reais
   */
  fromCents(cents) {
    return parseFloat(cents) / 100
  }

  /**
   * Formata CPF/CNPJ para API
   */
  formatTaxId(taxId) {
    return taxId.replace(/\D/g, '')
  }

  /**
   * Formata telefone para API
   */
  formatPhone(phone) {
    const cleaned = phone.replace(/\D/g, '')
    return {
      country: '+55',
      area: cleaned.slice(0, 2),
      number: cleaned.slice(2)
    }
  }
}

// Instância singleton
export const pagBankService = new PagBankService()

// Exporta também a classe para testes
export { PagBankService }

// Configurações e constantes úteis
export const PAGBANK_CONSTANTS = {
  PAYMENT_METHODS: {
    CREDIT_CARD: 'CREDIT_CARD',
    DEBIT_CARD: 'DEBIT_CARD',
    PIX: 'PIX',
    BOLETO: 'BOLETO'
  },
  ORDER_STATUS: {
    PAID: 'PAID',
    WAITING: 'WAITING',
    DECLINED: 'DECLINED',
    CANCELED: 'CANCELED',
    AUTHORIZED: 'AUTHORIZED'
  },
  CHARGE_STATUS: {
    PAID: 'PAID',
    WAITING: 'WAITING',
    DECLINED: 'DECLINED',
    CANCELED: 'CANCELED'
  }
}