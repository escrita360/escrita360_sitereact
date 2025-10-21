import api from './api'

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
}
