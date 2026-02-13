/**
 * @deprecated NÃO USAR - Este serviço expõe o token PagBank no frontend.
 * Use paymentService de '@/services/payment.js' que roteia tudo pelo backend.
 * 
 * Serviço de integração com APIs PagBank
 * Baseado na documentação oficial: https://dev.pagbank.uol.com.br/
 * 
 * SEGURANÇA: NÃO use VITE_PAGBANK_TOKEN no frontend - variáveis VITE_ são
 * incluídas no bundle JS e ficam visíveis para qualquer usuário.
 */

// Configurações do PagBank
const PAGBANK_CONFIG = {
  sandbox: {
    baseUrl: 'https://ws.sandbox.pagseguro.uol.com.br',
    authUrl: 'https://sandbox.pagseguro.uol.com.br/connect/oauth2/authorize',
    tokenUrl: 'https://ws.sandbox.pagseguro.uol.com.br/connect/oauth2/token',
    subscriptionsUrl: 'https://sandbox.api.pagseguro.com',
    publicKeysUrl: 'https://sandbox.api.pagseguro.com',
    paymentsUrl: 'https://sandbox.api.pagseguro.com'
  },
  production: {
    baseUrl: 'https://ws.pagseguro.uol.com.br',
    authUrl: 'https://pagseguro.uol.com.br/connect/oauth2/authorize',
    tokenUrl: 'https://ws.pagseguro.uol.com.br/connect/oauth2/token',
    subscriptionsUrl: 'https://api.pagseguro.com',
    publicKeysUrl: 'https://api.pagseguro.com',
    paymentsUrl: 'https://api.pagseguro.com'
  }
}

class PagBankService {
  constructor() {
    console.warn('⚠️ PagBankService está DEPRECADO. Use paymentService de payment.js que roteia pelo backend.')
    // Suporte para Node.js (scripts) e Vite (frontend)
     
    const isNode = typeof process !== 'undefined' && process.env
     
    const env = isNode ? process.env : import.meta.env
    
    this.environment = env.VITE_PAGBANK_ENV || 'sandbox'
    this.config = PAGBANK_CONFIG[this.environment]
    // SEGURANÇA: Token removido do frontend - usar backend como proxy
    this.token = null
    this.appId = null
    this.clientId = null
    this.clientSecret = null
  }

  /**
   * Faz requisições autenticadas para a API do PagBank (Orders/Charges)
   * Usa sempre a URL da API moderna de Pagamentos
   */
  async makeRequest(endpoint, options = {}) {
    // IMPORTANTE: Usa sempre a API de pagamentos moderna
    const url = `${this.config.paymentsUrl}${endpoint}`
    
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
   * Cria um novo pedido (Order) - API Real do PagBank
   * Conforme documentação: https://developer.pagbank.com.br/reference/criar-pedido
   */
  async createOrder(orderData) {
    console.log('🔗 PagBank: Criando pedido na API real...')

    try {
      // Formatar dados conforme documentação oficial
      const payload = {
        reference_id: orderData.reference_id,
        customer: {
          name: orderData.customer.name,
          email: orderData.customer.email,
          tax_id: this.formatTaxId(orderData.customer.tax_id || orderData.customer.cpf),
          phones: Array.isArray(orderData.customer.phones)
            ? orderData.customer.phones
            : [{
                country: '55',
                area: (orderData.customer.phone?.area || orderData.customer.phone?.slice(1, 3) || '11'),
                number: (orderData.customer.phone?.number || orderData.customer.phone?.slice(4).replace(/\D/g, '') || '999999999'),
                type: 'MOBILE'
              }]
        },
        items: orderData.items.map(item => ({
          reference_id: item.reference_id || item.id,
          name: item.name,
          quantity: item.quantity,
          unit_amount: item.unit_amount || Math.round(item.price * 100)
        })),
        notification_urls: orderData.notification_urls || []
      }

      // Adicionar qr_codes se for PIX
      if (orderData.qr_codes) {
        payload.qr_codes = orderData.qr_codes
      }

      // Adicionar charges se for cartão de crédito
      if (orderData.charges) {
        payload.charges = orderData.charges.map(charge => ({
          reference_id: charge.reference_id,
          description: charge.description,
          amount: {
            value: charge.amount.value || Math.round(charge.amount * 100),
            currency: 'BRL'
          },
          payment_method: charge.payment_method
        }))
      }

      console.log('📦 Payload formatado:', JSON.stringify(payload, null, 2))

      const response = await this.makeRequest('/orders', {
        method: 'POST',
        body: JSON.stringify(payload)
      })

      console.log('✅ PagBank: Pedido criado com sucesso!', response)
      return response

    } catch (error) {
      console.error('❌ PagBank: Erro ao criar pedido:', error)
      throw error
    }
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
   * Conforme documentação: https://developer.pagbank.com.br/reference/criar-pedido
   */
  async processCardPayment(paymentData) {
    const {
      customer,
      card,
      amount,
      installments = 1,
      description = 'Pagamento Escrita360'
    } = paymentData

    // Formatar telefone
    let phoneFormatted = customer.phone
    if (typeof customer.phone === 'string') {
      const cleaned = customer.phone.replace(/\D/g, '')
      phoneFormatted = {
        country: '55',
        area: cleaned.slice(0, 2),
        number: cleaned.slice(2)
      }
    }

    // Estrutura correta conforme documentação
    const payload = {
      reference_id: `escrita360_${Date.now()}`,
      customer: {
        name: customer.name,
        email: customer.email,
        tax_id: this.formatTaxId(customer.cpf || customer.tax_id),
        phones: [phoneFormatted]
      },
      items: [{
        reference_id: 'item_001',
        name: description,
        quantity: 1,
        unit_amount: this.toCents(amount)
      }],
      charges: [{
        reference_id: `charge_${Date.now()}`,
        description,
        amount: {
          value: this.toCents(amount),
          currency: 'BRL'
        },
        payment_method: {
          type: 'CREDIT_CARD',
          installments,
          capture: true,
          card: {
            encrypted: card.encrypted,
            security_code: card.cvv,
            holder: {
              name: card.holderName,
              tax_id: this.formatTaxId(customer.cpf || customer.tax_id)
            }
          }
        }
      }]
    }

    return await this.makeRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  }

  /**
   * Gera chave PIX para pagamento
   * Conforme documentação: https://developer.pagbank.com.br/reference/criar-pedido
   */
  async createPixPayment(paymentData) {
    const {
      customer,
      amount,
      description = 'Pagamento Escrita360',
      expirationMinutes = 30
    } = paymentData

    // Formatar telefone corretamente
    let phoneFormatted = customer.phone
    if (typeof customer.phone === 'string') {
      const cleaned = customer.phone.replace(/\D/g, '')
      phoneFormatted = {
        country: '55',
        area: cleaned.slice(0, 2),
        number: cleaned.slice(2)
      }
    }

    // Estrutura correta conforme documentação oficial do PagBank
    const payload = {
      reference_id: `escrita360_${Date.now()}`,
      customer: {
        name: customer.name,
        email: customer.email,
        tax_id: this.formatTaxId(customer.cpf || customer.tax_id),
        phones: [phoneFormatted]
      },
      items: [{
        reference_id: 'item_001',
        name: description,
        quantity: 1,
        unit_amount: this.toCents(amount)
      }],
      qr_codes: [{
        amount: {
          value: this.toCents(amount)
        },
        expiration_date: new Date(Date.now() + expirationMinutes * 60 * 1000).toISOString()
      }],
      notification_urls: [
        `${window.location.origin}/api/webhooks/pagbank`
      ]
    }

    return await this.makeRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
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
   * Cria um novo cliente (API de Pagamentos - Orders API)
   */
  async createCustomer(customerData) {
    // Customers are created via the Orders API, not Subscriptions API
    // We'll create a minimal order to register the customer
    const testOrder = {
      reference_id: `customer_registration_${Date.now()}`,
      customer: {
        name: customerData.name,
        email: customerData.email,
        tax_id: this.formatTaxId(customerData.tax_id || customerData.cpf),
        phones: Array.isArray(customerData.phones)
          ? customerData.phones
          : [{
              country: '55',
              area: '11',
              number: '999999999',
              type: 'MOBILE'
            }]
      },
      items: [{
        reference_id: 'customer_registration',
        name: 'Registro de Cliente',
        quantity: 1,
        unit_amount: 1 // R$ 0,01
      }],
      charges: [{
        reference_id: `charge_customer_${Date.now()}`,
        description: 'Registro de cliente Escrita360',
        amount: {
          value: 1,
          currency: 'BRL'
        },
        payment_method: {
          type: 'BOLETO'
        }
      }]
    }

    try {
      const order = await this.createOrder(testOrder)
      // Return customer data from the order
      return {
        id: order.customer.id,
        name: order.customer.name,
        email: order.customer.email,
        tax_id: order.customer.tax_id,
        created_at: order.created_at
      }
    } catch (error) {
      // Customer registration failed
      console.error('Customer registration failed:', error.message)
      throw error
    }
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
      // Verificar se estamos em ambiente Node.js
       
      if (typeof process !== 'undefined' && process.versions && process.versions.node) {
         
        const crypto = require('crypto')
        const expectedSignature = crypto
          .createHmac('sha256', publicKey)
          .update(payload)
          .digest('hex')
        
        return signature === expectedSignature
      } else {
        // Em ambiente browser, implementar validação básica ou delegar para backend
        console.warn('Validação de webhook não disponível em ambiente browser')
        return true // Temporário - em produção, validar no backend
      }
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

// Instância singleton lazy
let _pagBankService = null
export const pagBankService = (() => {
  if (!_pagBankService) {
    _pagBankService = new PagBankService()
  }
  return _pagBankService
})()

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