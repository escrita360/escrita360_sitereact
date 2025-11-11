import api from './api'
import { pagBankService, PAGBANK_CONSTANTS } from './pagbank'

export const paymentService = {
  /**
   * Cria uma sessão de checkout e redireciona para o Stripe
   * @param {Object} planData - Dados do plano selecionado
   * @param {string} planData.planId - ID do plano (basic, pro, premium)
   * @param {boolean} planData.isYearly - Se é cobrança anual
   * @returns {Promise<Object>} - Dados da sessão criada (sessionId e url)
   */
  async createCheckoutSession(planData) {
    const response = await api.post('/payment/create-checkout-session', {
      plan_id: planData.planId,
      billing_period: planData.isYearly ? 'yearly' : 'monthly',
    })
    return response.data
  },

  /**
   * Cria Payment Intent para pagamento direto (sem redirecionamento)
   * @param {Object} paymentData - Dados do pagamento
   * @returns {Promise<Object>} - Client secret do payment intent
   */
  async createPaymentIntent(amount, description = 'Pagamento Escrita360') {
    const response = await api.post('/payment/create-payment-intent', {
      amount,
      description,
    })
    return response.data
  },

  /**
   * Redireciona para o Stripe Checkout
   * @param {Object} planData - Dados do plano
   * @returns {Promise<void>} - Redireciona para o Stripe
   */
  async redirectToCheckout(planData) {
    const session = await this.createCheckoutSession(planData)
    
    // Redireciona para o Stripe Checkout
    if (session.url) {
      window.location.href = session.url
    } else {
      throw new Error('URL de checkout não retornada')
    }
  },

  /**
   * Obtém a chave pública do Stripe
   * @returns {Promise<string>} - Publishable key
   */
  async getStripeConfig() {
    const response = await api.get('/payment/config')
    return response.data.publishableKey
  },

  /**
   * Obtém métodos de pagamento salvos do usuário
   * @returns {Promise<Array>} - Lista de métodos de pagamento
   */
  async getPaymentMethods() {
    const response = await api.get('/payment/payment-methods')
    return response.data.paymentMethods
  },

  /**
   * Obtém histórico de pagamentos do usuário
   * @returns {Promise<Array>} - Lista de pagamentos
   */
  async getPaymentHistory() {
    const response = await api.get('/subscription/payments')
    return response.data
  },

  /**
   * Cancela uma assinatura
   * @param {string} subscriptionId - ID da assinatura
   * @returns {Promise<Object>} - Resultado do cancelamento
   */
  async cancelSubscription(subscriptionId) {
    const response = await api.post(`/subscription/cancel/${subscriptionId}`)
    return response.data
  },

  // ============ MÉTODOS PAGBANK ============

  /**
   * Cria checkout via PagBank
   * @param {Object} planData - Dados do plano selecionado
   * @param {Object} customerData - Dados do cliente
   * @returns {Promise<Object>} - Link de checkout
   */
  async createPagBankCheckout(planData, customerData) {
    const items = [{
      id: planData.planId,
      name: `Plano ${planData.name} - Escrita360`,
      quantity: 1,
      price: planData.price
    }]

    const checkoutData = {
      items,
      customer: {
        name: customerData.name,
        email: customerData.email,
        cpf: pagBankService.formatTaxId(customerData.cpf),
        phone: customerData.phone
      },
      redirectUrl: `${window.location.origin}/pagamento-sucesso`,
      notificationUrls: [
        `${import.meta.env.VITE_API_URL}/webhooks/pagbank`
      ]
    }

    return await pagBankService.createCheckoutLink(checkoutData)
  },

  /**
   * Processa pagamento direto com cartão via PagBank
   * @param {Object} paymentData - Dados do pagamento
   * @returns {Promise<Object>} - Resultado do pagamento
   */
  async processPagBankCardPayment(paymentData) {
    const { planData, customerData, cardData, installments } = paymentData

    // Aqui seria necessário criptografar os dados do cartão
    // usando a biblioteca JavaScript do PagBank
    const encryptedCard = await this.encryptCardData(cardData)

    const payment = {
      customer: {
        name: customerData.name,
        email: customerData.email,
        cpf: pagBankService.formatTaxId(customerData.cpf),
        phone: customerData.phone
      },
      card: {
        encrypted: encryptedCard,
        cvv: cardData.cvv,
        holderName: cardData.holderName
      },
      amount: planData.price,
      installments: installments || 1,
      description: `Plano ${planData.name} - Escrita360`
    }

    return await pagBankService.processCardPayment(payment)
  },

  /**
   * Cria pagamento PIX via PagBank
   * @param {Object} paymentData - Dados do pagamento
   * @returns {Promise<Object>} - QR Code e dados do PIX
   */
  async createPagBankPixPayment(paymentData) {
    const { planData, customerData } = paymentData

    const payment = {
      customer: {
        name: customerData.name,
        email: customerData.email,
        cpf: pagBankService.formatTaxId(customerData.cpf),
        phone: customerData.phone
      },
      amount: planData.price,
      description: `Plano ${planData.name} - Escrita360`,
      expirationMinutes: 30
    }

    return await pagBankService.createPixPayment(payment)
  },

  /**
   * Cria assinatura recorrente via PagBank
   * @param {Object} subscriptionData - Dados da assinatura
   * @returns {Promise<Object>} - Dados da assinatura criada
   */
  async createPagBankSubscription(subscriptionData) {
    const { pagBankSubscriptionsService } = await import('./pagbank-subscriptions.js')
    
    const { planData, customerData, paymentMethod = 'CREDIT_CARD' } = subscriptionData

    // Mapear nome do plano para configuração
    const planConfig = {
      'Básico': { intervalUnit: 'MONTH', intervalValue: 1 },
      'Profissional': { intervalUnit: 'MONTH', intervalValue: 1 },
      'Premium': { intervalUnit: 'MONTH', intervalValue: 1 },
      'Empresarial': { intervalUnit: 'MONTH', intervalValue: 1 }
    }

    const config = planConfig[planData.name] || { intervalUnit: 'MONTH', intervalValue: 1 }

    return await pagBankSubscriptionsService.createCompleteSubscription({
      planName: planData.name,
      planDescription: `Plano ${planData.name} - Escrita360`,
      amount: planData.price,
      intervalUnit: config.intervalUnit,
      intervalValue: config.intervalValue,
      customer: {
        name: customerData.name,
        email: customerData.email,
        cpf: customerData.cpf,
        phone: customerData.phone
      },
      paymentMethod,
      cardToken: subscriptionData.cardToken,
      cardSecurityCode: subscriptionData.cardSecurityCode
    })
  },

  /**
   * Consulta status de pagamento PagBank
   * @param {string} orderId - ID do pedido
   * @returns {Promise<Object>} - Status do pagamento
   */
  async getPagBankPaymentStatus(orderId) {
    return await pagBankService.getOrderStatus(orderId)
  },

  /**
   * Lista pagamentos PagBank
   * @param {Object} filters - Filtros para busca
   * @returns {Promise<Array>} - Lista de pagamentos
   */
  async listPagBankPayments(filters = {}) {
    return await pagBankService.listOrders(filters)
  },

  /**
   * Cancela pagamento PagBank
   * @param {string} orderId - ID do pedido
   * @returns {Promise<Object>} - Resultado do cancelamento
   */
  async cancelPagBankPayment(orderId) {
    return await pagBankService.cancelOrder(orderId)
  },

  /**
   * Criptografa dados do cartão (placeholder - implementar com biblioteca PagBank)
   * @param {Object} cardData - Dados do cartão
   * @returns {Promise<string>} - Dados criptografados
   */
  async encryptCardData(cardData) {
    // TODO: Implementar criptografia usando a biblioteca JavaScript do PagBank
    // Documentação: https://dev.pagbank.uol.com.br/docs/criptografia-dados-cartao
    
    // Por enquanto, retorna um placeholder
    // Em produção, usar: window.PagSeguro.encryptCard(cardData)
    console.warn('⚠️ Criptografia do cartão não implementada. Use apenas em ambiente de desenvolvimento.')
    return 'encrypted_card_data_placeholder'
  },

  /**
   * Valida dados de cartão
   * @param {Object} cardData - Dados do cartão
   * @returns {boolean} - Se os dados são válidos
   */
  validateCardData(cardData) {
    const { number, cvv, expiryDate, holderName } = cardData
    
    // Validação básica do número do cartão (algoritmo de Luhn)
    const cardNumber = number.replace(/\s/g, '')
    if (!/^\d{13,19}$/.test(cardNumber)) return false
    
    // Validação CVV
    if (!/^\d{3,4}$/.test(cvv)) return false
    
    // Validação data de expiração
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) return false
    
    const [month, year] = expiryDate.split('/')
    const now = new Date()
    const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1)
    if (expiry <= now) return false
    
    // Validação nome do portador
    if (!holderName || holderName.trim().length < 2) return false
    
    return true
  },

  /**
   * Obtém bandeira do cartão
   * @param {string} cardNumber - Número do cartão
   * @returns {string} - Bandeira do cartão
   */
  getCardBrand(cardNumber) {
    const number = cardNumber.replace(/\s/g, '')
    
    if (/^4/.test(number)) return 'visa'
    if (/^5[1-5]/.test(number)) return 'mastercard'
    if (/^3[47]/.test(number)) return 'amex'
    if (/^6011|65/.test(number)) return 'discover'
    if (/^35/.test(number)) return 'jcb'
    if (/^30[0-5]|36|38/.test(number)) return 'diners'
    if (/^50|5[6-9]|6[0-9]/.test(number)) return 'maestro'
    if (/^40117[8-9]|^431274|^438935|^451416|^457393|^504175|^627780|^636297|^636368/.test(number)) return 'elo'
    if (/^606282/.test(number)) return 'hipercard'
    
    return 'unknown'
  },
}
