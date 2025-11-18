import api from './api.js'

export const paymentService = {
  // ============ MÉTODOS PAGBANK ============

  /**
   * Cria checkout via PagBank (através do backend)
   * @param {Object} planData - Dados do plano selecionado
   * @param {Object} customerData - Dados do cliente
   * @returns {Promise<Object>} - Link de checkout
   */
  async createPagBankCheckout(planData, customerData) {
    const data = {
      plan_id: planData.planId,
      plan_name: planData.name,
      amount: planData.price,
      customer: {
        name: customerData.name,
        email: customerData.email,
        cpf: customerData.cpf,
        phone: customerData.phone
      }
    }

    const response = await api.post('/payment/create-pagbank-checkout', data)
    return response.data
  },

  /**
   * Processa pagamento direto com cartão via PagBank (através do backend)
   * @param {Object} paymentData - Dados do pagamento
   * @returns {Promise<Object>} - Resultado do pagamento
   */
  async processPagBankCardPayment(paymentData) {
    const { planData, customerData, cardData, installments } = paymentData

    const data = {
      plan_name: planData.name,
      amount: planData.price,
      installments: installments || 1,
      customer: {
        name: customerData.name,
        email: customerData.email,
        cpf: customerData.cpf,
        phone: customerData.phone
      },
      card: {
        number: cardData.number,
        expiry_month: cardData.expiryMonth,
        expiry_year: cardData.expiryYear,
        cvv: cardData.cvv,
        holder_name: cardData.holderName
      }
    }

    const response = await api.post('/payment/process-pagbank-card-payment', data)
    return response.data
  },

  /**
   * Cria pagamento PIX via PagBank (através do backend)
   * @param {Object} paymentData - Dados do pagamento
   * @returns {Promise<Object>} - QR Code e dados do PIX
   */
  async createPagBankPixPayment(paymentData) {
    const { planData, customerData } = paymentData

    const data = {
      plan_name: planData.name,
      amount: planData.price,
      customer: {
        name: customerData.name,
        email: customerData.email,
        cpf: customerData.cpf,
        phone: customerData.phone
      },
      expiration_minutes: 30
    }

    const response = await api.post('/payment/create-pagbank-pix-payment', data)
    return response.data
  },

  /**
   * Cria assinatura recorrente via PagBank (através do backend)
   * @param {Object} subscriptionData - Dados da assinatura
   * @returns {Promise<Object>} - Dados da assinatura criada
   */
  async createPagBankSubscription(subscriptionData) {
    const { planData, customerData, cardData, paymentMethod = 'BOLETO' } = subscriptionData

    // Mapear nome do plano para configuração
    const planConfig = {
      'Básico': { intervalUnit: 'MONTH', intervalValue: 1 },
      'Profissional': { intervalUnit: 'MONTH', intervalValue: 1 },
      'Premium': { intervalUnit: 'MONTH', intervalValue: 1 },
      'Empresarial': { intervalUnit: 'MONTH', intervalValue: 1 }
    }

    const config = planConfig[planData.name] || { intervalUnit: 'MONTH', intervalValue: 1 }

    const data = {
      plan_name: planData.name,
      plan_description: `Plano ${planData.name} - Escrita360`,
      amount: planData.price,
      interval_unit: config.intervalUnit,
      interval_value: config.intervalValue,
      customer: {
        name: customerData.name,
        email: customerData.email,
        cpf: customerData.cpf,
        phone: customerData.phone
      },
      payment_method: paymentMethod,
      cardData: cardData
    }

    const response = await api.post('/payment/create-pagbank-subscription', data)
    return response.data
  },

  /**
   * Consulta status de pagamento PagBank (através do backend)
   * @param {string} orderId - ID do pedido
   * @returns {Promise<Object>} - Status do pagamento
   */
  async getPagBankPaymentStatus(orderId) {
    const response = await api.get(`/payment/pagbank-status/${orderId}`)
    return response.data
  },

  /**
   * Lista pagamentos PagBank (através do backend)
   * @param {Object} filters - Filtros para busca
   * @returns {Promise<Array>} - Lista de pagamentos
   */
  async listPagBankPayments(filters = {}) {
    const response = await api.get('/payment/pagbank-payments', { params: filters })
    return response.data
  },

  /**
   * Cancela pagamento PagBank (através do backend)
   * @param {string} orderId - ID do pedido
   * @returns {Promise<Object>} - Resultado do cancelamento
   */
  async cancelPagBankPayment(orderId) {
    const response = await api.post(`/payment/cancel-pagbank-payment/${orderId}`)
    return response.data
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
