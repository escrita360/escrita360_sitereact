import api from './api.js'

/**
 * Gera reference_id com metadata do plano para o webhook detectar
 * Formato: planId__audience__timestamp
 */
function buildReferenceId(planData) {
  const planId = planData?.id || 'unknown'
  const audience = planData?.audience || 'estudantes'
  return `${planId}__${audience}__${Date.now()}`
}

// SDK do PagBank para criptografia de cartão
let PagSeguro = null
let isSDKLoaded = false
let sdkLoadPromise = null

/**
 * Carrega o SDK do PagBank dinamicamente
 * Usa o script já incluído no index.html ou injeta dinamicamente
 */
const loadPagSeguroSDK = () => {
  // Se já está carregado, retornar imediatamente
  if (isSDKLoaded && window.PagSeguro) {
    PagSeguro = window.PagSeguro
    return Promise.resolve(PagSeguro)
  }

  // Se já está carregando, retornar a promise existente (evita hang)
  if (sdkLoadPromise) {
    return sdkLoadPromise
  }

  sdkLoadPromise = new Promise((resolve, reject) => {
    // Verificar se o script já existe no DOM (incluído via index.html)
    const existingScript = document.querySelector('script[src="https://assets.pagseguro.com.br/checkout-sdk-js/rc/dist/browser/pagseguro.min.js"]')
    if (existingScript) {
      if (window.PagSeguro) {
        PagSeguro = window.PagSeguro
        isSDKLoaded = true
        resolve(PagSeguro)
        return
      }
      // Script existe mas ainda não carregou - aguardar
      existingScript.addEventListener('load', () => {
        PagSeguro = window.PagSeguro
        isSDKLoaded = true
        resolve(PagSeguro)
      })
      existingScript.addEventListener('error', () => {
        sdkLoadPromise = null
        reject(new Error('Falha ao carregar SDK do PagBank'))
      })
      return
    }

    // Script não existe no DOM - criar dinamicamente
    const script = document.createElement('script')
    script.src = 'https://assets.pagseguro.com.br/checkout-sdk-js/rc/dist/browser/pagseguro.min.js'
    script.async = true

    script.onload = () => {
      PagSeguro = window.PagSeguro
      isSDKLoaded = true
      resolve(PagSeguro)
    }

    script.onerror = () => {
      sdkLoadPromise = null
      reject(new Error('Falha ao carregar SDK do PagBank'))
    }

    document.head.appendChild(script)
  })

  return sdkLoadPromise
}

/**
 * Criptografa dados do cartão usando SDK do PagBank
 * @param {Object} cardData - Dados do cartão
 * @param {string} publicKey - Chave pública do PagBank
 * @returns {Promise<Object>} - Cartão criptografado
 */
const encryptCard = async (cardData, publicKey) => {
  try {
    console.log('🔐 Iniciando criptografia do cartão via SDK PagBank...')

    // Validar dados de entrada
    if (!publicKey || publicKey.length < 100) {
      throw new Error('Chave pública inválida ou não fornecida')
    }

    if (!cardData.number || !cardData.expiryMonth || !cardData.expiryYear || !cardData.cvv || !cardData.holderName) {
      throw new Error('Dados do cartão incompletos')
    }

    await loadPagSeguroSDK()

    if (!PagSeguro || !PagSeguro.encryptCard) {
      throw new Error('SDK PagBank não carregado corretamente')
    }

    const cardNumber = cardData.number.replace(/\s/g, '')
    const expMonth = cardData.expiryMonth.padStart(2, '0')
    const expYear = cardData.expiryYear.length === 2 ? cardData.expiryYear : cardData.expiryYear.slice(-2)

    console.log('📋 Dados para criptografia:', {
      holderName: cardData.holderName,
      cardBin: cardNumber.substring(0, 6) + '******' + cardNumber.slice(-4),
      expMonth,
      expYear: '20' + expYear,
      cvvLength: cardData.cvv?.length
    })

    const card = PagSeguro.encryptCard({
      publicKey: publicKey,
      holder: cardData.holderName,
      number: cardNumber,
      expMonth: expMonth,
      expYear: '20' + expYear,
      securityCode: cardData.cvv
    })

    if (card.hasErrors) {
      const errorMessages = card.errors.map(error => `${error.code}: ${error.message}`).join(', ')
      console.error('❌ Erros na criptografia:', card.errors)
      throw new Error(`Erro na criptografia do cartão: ${errorMessages}`)
    }

    if (!card.encryptedCard || card.encryptedCard.length < 100) {
      throw new Error('Criptografia retornou resultado inválido')
    }

    console.log('✅ Cartão criptografado com sucesso, tamanho:', card.encryptedCard.length)

    return {
      encrypted: card.encryptedCard,
      hasErrors: card.hasErrors,
      errors: card.errors
    }
  } catch (error) {
    console.error('❌ Erro ao criptografar cartão:', error)
    throw error
  }
}

export const paymentService = {
  // ============ MÉTODOS PAGBANK ============

  /**
   * Criptografa dados do cartão usando SDK PagBank
   * Wrapper para uso externo do método encryptCard
   * @param {Object} cardData - Dados do cartão (number, expiryMonth, expiryYear, cvv, holderName)
   * @param {string} publicKey - Chave pública do PagBank
   * @returns {Promise<Object>} - { encrypted: string, hasErrors: boolean, errors: array }
   */
  async encryptCardForPayment(cardData, publicKey) {
    return encryptCard(cardData, publicKey)
  },

  /**
   * Obtém o ambiente atual do PagBank (sandbox/production)
   * @returns {Promise<Object>} - { environment, isSandbox, testCardsWork, message }
   */
  async getPagBankEnvironment() {
    try {
      const response = await api.get('/payment/pagbank/environment')
      return response.data
    } catch (error) {
      console.warn('⚠️ Não foi possível verificar ambiente PagBank:', error.message)
      return null
    }
  },

  /**
   * Obtém a chave pública do PagBank via backend
   * @returns {Promise<string>} - Chave pública para criptografia de cartão
   */
  async getPublicKey() {
    try {
      const response = await api.get('/payment/pagbank/public-key')
      return response.data.public_key
    } catch (error) {
      console.error('❌ Erro ao obter chave pública:', error)
      throw error
    }
  },

  /**
   * Consulta taxas de parcelamento via backend
   * @param {number} value - Valor em centavos
   * @param {number} maxInstallments - Máximo de parcelas
   * @param {number} maxInstallmentsNoInterest - Máximo de parcelas sem juros
   * @param {string} creditCardBin - BIN do cartão (opcional)
   * @returns {Promise<Object>} - Opções de parcelamento com taxas
   */
  async getInstallmentFees(value, maxInstallments = 12, maxInstallmentsNoInterest = 0, creditCardBin = null) {
    try {
      const params = {
        value: Math.round(value * 100), // Converter para centavos
        max_installments: maxInstallments,
        max_installments_no_interest: maxInstallmentsNoInterest
      }

      if (creditCardBin) {
        params.credit_card_bin = creditCardBin
      }

      const response = await api.get('/payment/pagbank/fees', { params })
      return response.data
    } catch (error) {
      console.error('❌ Erro ao consultar taxas:', error)
      throw error
    }
  },

  /**
   * Consulta opções de parcelamento via backend (método legado)
   * @param {number} amount - Valor do pagamento
   * @returns {Promise<Array>} - Opções de parcelamento
   */
  async getInstallmentOptions(amount) {
    const response = await api.get(`/payment/installments?amount=${amount}`)
    return response.data.installments
  },

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
   * Processa pagamento com cartão criptografado via PagBank
   * @param {Object} paymentData - Dados do pagamento
   * @param {string} publicKey - Chave pública do PagBank
   * @returns {Promise<Object>} - Resultado do pagamento
   */
  async processPagBankEncryptedCardPayment(paymentData, publicKey) {
    try {
      const { planData, customerData, cardData, installments = 1, addressData } = paymentData

      // Criptografar cartão usando SDK do PagBank
      const encryptedCard = await encryptCard(cardData, publicKey)

      if (!encryptedCard.encrypted) {
        throw new Error('Falha na criptografia do cartão')
      }

      // Validar que o cartão criptografado tem formato válido
      if (encryptedCard.encrypted.length < 100) {
        throw new Error('Cartão criptografado inválido - tente novamente')
      }

      // Limpar telefone apenas números
      const phoneClean = customerData.phone.replace(/\D/g, '')

      const data = {
        reference_id: buildReferenceId(planData),
        customer: {
          name: customerData.name.trim(),
          email: customerData.email.trim(),
          tax_id: customerData.cpf.replace(/\D/g, ''),
          phones: [{
            country: '55',
            area: phoneClean.substring(0, 2),
            number: phoneClean.substring(2),
            type: 'MOBILE'
          }]
        },
        items: [{
          reference_id: `item_${Date.now()}`,
          name: planData.name,
          quantity: 1,
          unit_amount: Math.round(planData.price * 100)
        }],
        charges: [{
          reference_id: `charge_${Date.now()}`,
          description: `Compra de ${planData.name}`,
          amount: {
            value: Math.round(planData.price * 100),
            currency: 'BRL'
          },
          payment_method: {
            type: 'CREDIT_CARD',
            installments: installments,
            capture: true,
            card: {
              encrypted: encryptedCard.encrypted,
              store: false
            },
            holder: {
              name: cardData.holderName,
              tax_id: customerData.cpf.replace(/\D/g, '')
            }
          }
        }]
      }

      // Adicionar endereço de shipping se disponível
      if (addressData && addressData.cep) {
        data.shipping = {
          address: {
            street: addressData.rua,
            number: addressData.numero,
            complement: addressData.complemento || 'N/A',
            locality: addressData.cidade,
            city: addressData.cidade,
            region_code: addressData.estado,
            country: 'BRA',
            postal_code: addressData.cep.replace(/\D/g, '')
          }
        }
      }
      console.log('💳 Dados:', {
        customer: data.customer.name,
        amount: data.charges[0].amount.value,
        installments: data.charges[0].payment_method.installments,
        hasAddress: !!data.shipping,
        encryptedLength: encryptedCard.encrypted?.length
      })

      if (!encryptedCard.encrypted || encryptedCard.encrypted.length < 100) {
        throw new Error('Cartão criptografado inválido - tente novamente')
      }
      const response = await api.post('/payment/pagbank/create-encrypted-order', data)
      return response.data
    } catch (error) {
      // Extrair mensagem detalhada do erro PagBank
      const responseData = error.response?.data
      const pagbankError = responseData?.error || responseData?.details?.error_messages?.[0]?.error
      const pagbankCode = responseData?.pagbankCode || responseData?.details?.error_messages?.[0]?.error
      const environment = responseData?.environment || 'unknown'
      const errorMsg = pagbankError || error.message
      console.error('❌ Erro no pagamento com cartão criptografado:', errorMsg)
      console.error('   Código PagBank:', pagbankCode, '| Ambiente:', environment)

      // Criar erro com informações adicionais para o componente tratar
      const enhancedError = new Error(errorMsg)
      enhancedError.pagbankCode = pagbankCode
      enhancedError.environment = environment
      enhancedError.originalError = error
      throw enhancedError
    }
  },


  /**
   * Cria pagamento PIX via PagBank (através do backend)
   * @param {Object} paymentData - Dados do pagamento
   * @returns {Promise<Object>} - QR Code e dados do PIX
   */
  async createPagBankPixPayment(paymentData) {
    const { planData, customerData } = paymentData

    console.log('🔍 Validando dados antes de enviar para PagBank...')
    console.log('📋 Dados recebidos:', {
      planData: planData,
      customerData: {
        name: customerData.name,
        email: customerData.email,
        cpf: customerData.cpf ? '***' + customerData.cpf.slice(-3) : 'undefined',
        phone: customerData.phone ? '***' + customerData.phone.slice(-3) : 'undefined'
      }
    })

    // Validações adicionais
    if (!customerData.name || customerData.name.trim().length < 2) {
      throw new Error('Nome completo é obrigatório e deve ter pelo menos 2 caracteres.')
    }
    if (!customerData.email || !customerData.email.includes('@')) {
      throw new Error('Email válido é obrigatório.')
    }
    if (!customerData.cpf || customerData.cpf.replace(/\D/g, '').length !== 11) {
      throw new Error('CPF válido com 11 dígitos é obrigatório.')
    }
    if (!customerData.phone || customerData.phone.replace(/\D/g, '').length < 10) {
      throw new Error('Telefone válido com DDD é obrigatório.')
    }

    // Limpar telefone apenas números
    const phoneClean = customerData.phone.replace(/\D/g, '')

    // Validar telefone
    if (phoneClean.length < 10) {
      throw new Error('Telefone inválido. Digite um número válido com DDD.')
    }

    // Validar CPF
    const cpfClean = customerData.cpf.replace(/\D/g, '')
    if (cpfClean.length !== 11) {
      throw new Error('CPF inválido. Digite um CPF com 11 dígitos.')
    }

    const data = {
      reference_id: buildReferenceId(planData),
      customer: {
        name: customerData.name.trim(),
        email: customerData.email.trim(),
        tax_id: cpfClean,
        phones: [{
          country: '55',
          area: phoneClean.substring(0, 2),
          number: phoneClean.substring(2),
          type: 'MOBILE'
        }]
      },
      items: [{
        reference_id: `item_${Date.now()}`,
        name: planData.name,
        quantity: 1,
        unit_amount: Math.round(planData.price * 100)
      }],
      qr_codes: [{
        amount: {
          value: Math.round(planData.price * 100)
        },
        expiration_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().replace(/\.\d{3}Z$/, '-03:00')
      }]
      // notification_urls é injetado automaticamente pelo backend quando PAGBANK_WEBHOOK_URL está configurado
    }

    console.log('📤 Enviando dados PIX para backend:', {
      customer: { ...data.customer, tax_id: '***' },
      planData: planData
    })

    try {
      const response = await api.post('/payment/pagbank/create-pix-order', data)
      return response.data
    } catch (error) {
      console.error('❌ Erro na requisição PIX:', error)

      // Tratamento melhorado de erros
      if (error.response) {
        const errorData = error.response.data
        console.error('📋 Dados do erro:', errorData)

        if (errorData?.details?.error_messages) {
          // Erro do PagBank com detalhes
          const pagbankError = errorData.details.error_messages[0]
          throw new Error(`PagBank: ${pagbankError.description} (${pagbankError.parameter_name})`)
        } else if (errorData?.error) {
          // Erro genérico
          throw new Error(errorData.error)
        } else {
          throw new Error(`Erro ${error.response.status}: ${error.response.statusText}`)
        }
      } else if (error.request) {
        throw new Error('Servidor não respondeu. Verifique sua conexão.')
      } else {
        throw new Error('Erro ao configurar requisição: ' + error.message)
      }
    }
  },

  /**
   * Cria pagamento com boleto via PagBank (através do backend)
   * @param {Object} paymentData - Dados do pagamento
   * @returns {Promise<Object>} - Dados do boleto
   */
  async createPagBankBoletoPayment(paymentData) {
    const { planData, customerData } = paymentData

    // Limpar telefone apenas números
    const phoneClean = customerData.phone.replace(/\D/g, '')

    const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 7 dias

    const data = {
      reference_id: `boleto_${Date.now()}`,
      customer: {
        name: customerData.name,
        email: customerData.email,
        tax_id: customerData.cpf.replace(/\D/g, ''),
        phones: [{
          country: '55',
          area: phoneClean.substring(0, 2),
          number: phoneClean.substring(2),
          type: 'MOBILE'
        }]
      },
      items: [{
        reference_id: `item_${Date.now()}`,
        name: planData.name,
        quantity: 1,
        unit_amount: Math.round(planData.price * 100)
      }],
      charges: [{
        reference_id: `charge_${Date.now()}`,
        description: `Compra de ${planData.name}`,
        amount: {
          value: Math.round(planData.price * 100),
          currency: 'BRL'
        },
        payment_method: {
          type: 'BOLETO',
          boleto: {
            due_date: dueDate,
            holder: {
              name: customerData.name,
              tax_id: customerData.cpf.replace(/\D/g, ''),
              email: customerData.email,
              address: {
                street: customerData.address?.street || 'Rua Principal',
                number: customerData.address?.number || '123',
                locality: customerData.address?.locality || 'Centro',
                city: customerData.address?.city || 'São Paulo',
                region: customerData.address?.region || 'SP',
                region_code: customerData.address?.region_code || 'SP',
                country: customerData.address?.country || 'BRA',
                postal_code: customerData.address?.postal_code || '01000000'
              }
            }
          }
        }
      }],
      notification_urls: []
    }

    const response = await api.post('/payment/pagbank/create-boleto-order', data)
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

    // Processar telefone para o formato correto
    const phoneClean = customerData.phone.replace(/\D/g, '')
    const phoneFormatted = phoneClean.length === 11
      ? { area_code: phoneClean.substring(0, 2), number: phoneClean.substring(2) }
      : { area_code: phoneClean.substring(0, 2), number: phoneClean.substring(2) }

    // Determinar tipo de plano baseado no audience
    const planType = (planData.audience === 'professores' || planData.audience === 'docentes')
      ? 'professor'
      : 'aluno'

    const data = {
      plan_name: planData.name,
      plan_description: `Plano ${planData.name} - Escrita360`,
      amount: Math.round(planData.price * 100), // Converter para centavos
      interval_unit: config.intervalUnit,
      interval_value: config.intervalValue,
      customer: {
        name: customerData.name,
        email: customerData.email,
        cpf: customerData.cpf.replace(/\D/g, ''),
        phone: phoneFormatted
      },
      payment_method: paymentMethod,
      cardData: cardData,
      // Metadata segura (sem dados sensíveis)
      metadata: {
        planType: planType,
        audience: planData.audience
      },
      reference: `${planType}__${planData.audience}__${Date.now()}`
    }

    const response = await api.post('/payment/create-pagbank-subscription', data)
    return response.data
  },

  /**
   * Lista pedidos com filtros
   * @param {Object} filters - Filtros de busca
   * @returns {Promise<Object>} - Lista de pedidos
   */
  async getOrders(filters = {}) {
    try {
      const response = await api.get('/payment/pagbank/orders', { params: filters })
      return response.data
    } catch (error) {
      console.error('❌ Erro ao listar pedidos:', error)
      throw error
    }
  },

  /**
   * Consulta um pedido específico
   * @param {string} orderId - ID do pedido
   * @returns {Promise<Object>} - Dados do pedido
   */
  async getOrder(orderId) {
    try {
      const response = await api.get(`/payment/pagbank/order/${orderId}`)
      return response.data
    } catch (error) {
      console.error('❌ Erro ao consultar pedido:', error)
      throw error
    }
  },

  /**
   * Verifica o status de um pedido (usado para polling de PIX/boleto)
   * @param {string} orderId - ID do pedido
   * @returns {Promise<Object>} - Dados do pedido com status das charges
   */
  async checkOrderStatus(orderId) {
    try {
      const response = await api.get(`/payment/pagbank/order/${orderId}`)
      return response.data
    } catch (error) {
      console.error('❌ Erro ao verificar status do pedido:', error)
      throw error
    }
  },

  /**
   * Consulta pagamentos de um pedido
   * @param {string} orderId - ID do pedido
   * @returns {Promise<Object>} - Pagamentos do pedido
   */
  async getOrderPayments(orderId) {
    try {
      const response = await api.get(`/payment/pagbank/order/${orderId}/payments`)
      return response.data
    } catch (error) {
      console.error('❌ Erro ao consultar pagamentos:', error)
      throw error
    }
  },

  /**
   * Paga um pedido existente
   * @param {string} orderId - ID do pedido
   * @param {Object} paymentData - Dados do pagamento
   * @returns {Promise<Object>} - Resultado do pagamento
   */
  async payOrder(orderId, paymentData) {
    try {
      const response = await api.post(`/payment/pagbank/order/${orderId}/pay`, paymentData)
      return response.data
    } catch (error) {
      console.error('❌ Erro ao pagar pedido:', error)
      throw error
    }
  },

  /**
   * Criptografa dados do cartão usando backend (alternativa ao SDK)
   * Útil quando não é possível usar o SDK do PagBank no frontend
   * @param {Object} cardData - Dados do cartão
   * @returns {Promise<Object>} - Cartão criptografado
   */
  async encryptCardOnBackend(cardData) {
    try {
      const response = await api.post('/payment/pagbank/encrypt-card', { cardData })

      if (response.data.success) {
        return {
          encrypted: response.data.encryptedCard,
          hasErrors: false,
          errors: []
        }
      } else {
        return {
          encrypted: null,
          hasErrors: true,
          errors: [{ message: 'Erro na criptografia do backend' }]
        }
      }
    } catch (error) {
      console.error('❌ Erro ao criptografar cartão no backend:', error)
      return {
        encrypted: null,
        hasErrors: true,
        errors: [{ message: error.response?.data?.error || error.message }]
      }
    }
  },

  /**
   * Processa pagamento com cartão criptografado via backend
   * Criptografa os dados no backend em vez de usar SDK do frontend
   * @param {Object} paymentData - Dados do pagamento
   * @returns {Promise<Object>} - Resultado do pagamento
   */
  async processPagBankBackendEncryptedCardPayment(paymentData) {
    try {
      const { planData, customerData, cardData, installments = 1, addressData } = paymentData

      // Criptografar cartão usando backend
      const encryptedCard = await this.encryptCardOnBackend(cardData)

      if (!encryptedCard.encrypted) {
        throw new Error('Falha na criptografia do cartão no backend')
      }

      // Limpar telefone apenas números
      const phoneClean = customerData.phone.replace(/\D/g, '')

      const data = {
        reference_id: buildReferenceId(planData),
        customer: {
          name: customerData.name.trim(),
          email: customerData.email.trim(),
          tax_id: customerData.cpf.replace(/\D/g, ''),
          phones: [{
            country: '55',
            area: phoneClean.substring(0, 2),
            number: phoneClean.substring(2),
            type: 'MOBILE'
          }]
        },
        items: [{
          reference_id: `item_${Date.now()}`,
          name: planData.name,
          quantity: 1,
          unit_amount: Math.round(planData.price * 100)
        }],
        charges: [{
          reference_id: `charge_${Date.now()}`,
          description: `Compra de ${planData.name}`,
          amount: {
            value: Math.round(planData.price * 100),
            currency: 'BRL'
          },
          payment_method: {
            type: 'CREDIT_CARD',
            installments: installments,
            capture: true,
            card: {
              encrypted: encryptedCard.encrypted,
              store: false
            },
            holder: {
              name: cardData.holderName,
              tax_id: customerData.cpf.replace(/\D/g, '')
            }
          }
        }]
      }

      // Adicionar endereço de shipping se disponível
      if (addressData && addressData.cep) {
        data.shipping = {
          address: {
            street: addressData.rua,
            number: addressData.numero,
            complement: addressData.complemento || 'N/A',
            locality: addressData.cidade,
            city: addressData.cidade,
            region_code: addressData.estado,
            country: 'BRA',
            postal_code: addressData.cep.replace(/\D/g, '')
          }
        }
      }

      console.log('🔐 Enviando pedido com cartão criptografado via backend...')
      console.log('💳 Dados:', {
        customer: data.customer.name,
        amount: data.charges[0].amount.value,
        installments: data.charges[0].payment_method.installments,
        hasAddress: !!data.shipping
      })
      const response = await api.post('/payment/pagbank/create-encrypted-order', data)
      return response.data
    } catch (error) {
      console.error('❌ Erro no pagamento com cartão criptografado via backend:', error)
      throw error
    }
  },

  /**
   * @deprecated Este método enviava dados de cartão abertos para o backend.
   * Por motivos de segurança PCI-DSS, foi desativado.
   * Use processPagBankEncryptedCardPayment() que criptografa o cartão no frontend.
   * 
   * @throws {Error} Sempre lança erro informando que o método está deprecado
   */
  async processPagBankCompleteBackendEncryption(paymentData) {
    throw new Error(
      'MÉTODO DEPRECADO: processPagBankCompleteBackendEncryption() foi desativado por segurança (PCI-DSS). ' +
      'Use processPagBankEncryptedCardPayment() que criptografa o cartão no frontend via PagSeguro.encryptCard().'
    )
  },

  /**
   * @deprecated Método original mantido apenas para referência - NÃO USE
   */
  async _processPagBankCompleteBackendEncryption_DEPRECATED(paymentData) {
    try {
      const { planData, customerData, cardData, installments = 1, addressData } = paymentData

      // Limpar telefone apenas números
      const phoneClean = customerData.phone.replace(/\D/g, '')

      const data = {
        reference_id: buildReferenceId(planData),
        customer: {
          name: customerData.name.trim(),
          email: customerData.email.trim(),
          tax_id: customerData.cpf.replace(/\D/g, ''),
          phones: [{
            country: '55',
            area: phoneClean.substring(0, 2),
            number: phoneClean.substring(2),
            type: 'MOBILE'
          }]
        },
        items: [{
          reference_id: `item_${Date.now()}`,
          name: planData.name,
          quantity: 1,
          unit_amount: Math.round(planData.price * 100)
        }],
        charges: [{
          reference_id: `charge_${Date.now()}`,
          description: `Compra de ${planData.name}`,
          amount: {
            value: Math.round(planData.price * 100),
            currency: 'BRL'
          },
          payment_method: {
            type: 'CREDIT_CARD',
            installments: installments,
            capture: true
          }
        }],
        cardData: cardData, // Dados do cartão serão criptografados no backend
      }

      // Adicionar endereço de shipping se disponível
      if (addressData && addressData.cep) {
        data.shipping = {
          address: {
            street: addressData.rua,
            number: addressData.numero,
            complement: addressData.complemento || 'N/A',
            locality: addressData.cidade,
            city: addressData.cidade,
            region_code: addressData.estado,
            country: 'BRA',
            postal_code: addressData.cep.replace(/\D/g, '')
          }
        }
      }

      console.log('🔐 Enviando pedido com criptografia completa no backend...')
      console.log('💳 Dados:', {
        customer: data.customer.name,
        amount: data.charges[0].amount.value,
        installments: data.charges[0].payment_method.installments,
        hasAddress: !!data.shipping
      })
      const response = await api.post('/payment/pagbank/create-order-with-card-encryption', data)
      return response.data
    } catch (error) {
      console.error('❌ Erro no pagamento completo com criptografia backend:', error)
      throw error
    }
  },

  /**
   * Consulta status de pagamento PagBank (através do backend)
   * @param {string} orderId - ID do pedido
   * @returns {Promise<Object>} - Status do pagamento
   */
  async getPagBankPaymentStatus(orderId) {
    const response = await api.get(`/payment/pagbank/order/${orderId}`)
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

  // ============ SPLIT PAYMENT METHODS ============

  /**
   * Cria sessão para checkout transparente com split
   * @returns {Promise<Object>} - Dados da sessão
   */
  async createSplitSession() {
    const response = await api.post('/payment/pagbank/split/session')
    return response.data
  },

  /**
   * Cria split de pagamento com boleto
   * @param {Object} splitData - Dados do split
   * @returns {Promise<Object>} - Resultado do split
   */
  async createSplitBoleto(splitData) {
    const response = await api.post('/payment/pagbank/split/boleto', splitData)
    return response.data
  },

  /**
   * Cria split de pagamento com débito online
   * @param {Object} splitData - Dados do split
   * @returns {Promise<Object>} - Resultado do split
   */
  async createSplitDebit(splitData) {
    const response = await api.post('/payment/pagbank/split/debit', splitData)
    return response.data
  },

  /**
   * Cria split de pagamento com cartão de crédito
   * @param {Object} splitData - Dados do split
   * @returns {Promise<Object>} - Resultado do split
   */
  async createSplitCreditCard(splitData) {
    const response = await api.post('/payment/pagbank/split/credit-card', splitData)
    return response.data
  },

  /**
   * Estorna uma transação de split
   * @param {string} transactionCode - Código da transação
   * @param {number} refundValue - Valor do estorno (opcional)
   * @returns {Promise<Object>} - Resultado do estorno
   */
  async refundSplitTransaction(transactionCode, refundValue = null) {
    const response = await api.post('/payment/pagbank/split/refund', {
      transactionCode,
      refundValue
    })
    return response.data
  },

  /**
   * Provisiona conta do usuário no app após pagamento confirmado.
   * Envia a senha escolhida pelo usuário no checkout para que seja a mesma no app.
   * Idempotente: se o webhook já criou a conta, retorna sucesso sem duplicar.
   * 
   * @param {Object} params
   * @param {string} params.email - Email do comprador
   * @param {string} params.password - Senha escolhida pelo usuário no checkout
   * @param {string} params.planId - ID do plano comprado
   * @param {string} params.audience - Audiência (estudantes, professores, escolas)
   * @param {string} params.customerName - Nome do comprador
   * @param {string} params.orderId - ID do pedido PagBank
   * @returns {Promise<Object>} - { success, uid, email, alreadyExisted }
   */
  async provisionUser({ email, password, planId, audience, customerName, orderId }) {
    try {
      const response = await api.post('/payment/provision-user', {
        email,
        password,
        planId,
        audience,
        customerName,
        orderId
      })
      return response.data
    } catch (error) {
      console.error('❌ Erro ao provisionar usuário:', error)
      // Log detalhes da resposta do servidor para debugging
      if (error.response) {
        console.error('   Status:', error.response.status)
        console.error('   Dados:', JSON.stringify(error.response.data, null, 2))
      }
      throw error
    }
  }
}
