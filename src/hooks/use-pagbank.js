import { useState, useCallback } from 'react'
import { paymentService } from '@/services/payment'
import { pagBankService, PAGBANK_CONSTANTS } from '@/services/pagbank'

/**
 * Hook para gerenciar pagamentos PagBank
 * Fornece uma interface simplificada para os diferentes tipos de pagamento
 */
export const usePagBank = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [paymentData, setPaymentData] = useState(null)

  // Limpa erros
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Cria checkout link
  const createCheckoutLink = useCallback(async (planData, customerData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await paymentService.createPagBankCheckout(planData, customerData)
      setPaymentData(result)
      return result
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Processa pagamento com cartão
  const processCardPayment = useCallback(async (paymentData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await paymentService.processPagBankCardPayment(paymentData)
      setPaymentData(result)
      return result
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Cria pagamento PIX
  const createPixPayment = useCallback(async (paymentData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await paymentService.createPagBankPixPayment(paymentData)
      setPaymentData(result)
      return result
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Consulta status de pagamento
  const checkPaymentStatus = useCallback(async (orderId) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await paymentService.getPagBankPaymentStatus(orderId)
      return result
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Lista pagamentos
  const listPayments = useCallback(async (filters = {}) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await paymentService.listPagBankPayments(filters)
      return result
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Cancela pagamento
  const cancelPayment = useCallback(async (orderId) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await paymentService.cancelPagBankPayment(orderId)
      return result
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Valida dados de cartão
  const validateCard = useCallback((cardData) => {
    return paymentService.validateCardData(cardData)
  }, [])

  // Obtém bandeira do cartão
  const getCardBrand = useCallback((cardNumber) => {
    return paymentService.getCardBrand(cardNumber)
  }, [])

  // Formata valores monetários
  const formatCurrency = useCallback((value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }, [])

  // Formata CPF
  const formatCPF = useCallback((cpf) => {
    return pagBankService.formatTaxId(cpf)
  }, [])

  // Converte para centavos
  const toCents = useCallback((value) => {
    return pagBankService.toCents(value)
  }, [])

  // Converte de centavos
  const fromCents = useCallback((cents) => {
    return pagBankService.fromCents(cents)
  }, [])

  // Verifica se o ambiente é sandbox
  const isSandbox = useCallback(() => {
    return import.meta.env.VITE_PAGBANK_ENV === 'sandbox'
  }, [])

  // Obtém configuração do ambiente
  const getEnvironmentConfig = useCallback(() => {
    return {
      environment: import.meta.env.VITE_PAGBANK_ENV || 'sandbox',
      isSandbox: isSandbox(),
      hasCredentials: !!(
        import.meta.env.VITE_PAGBANK_TOKEN &&
        import.meta.env.VITE_PAGBANK_APP_ID
      )
    }
  }, [isSandbox])

  return {
    // Estados
    isLoading,
    error,
    paymentData,

    // Ações
    clearError,
    createCheckoutLink,
    processCardPayment,
    createPixPayment,
    checkPaymentStatus,
    listPayments,
    cancelPayment,

    // Utilitários
    validateCard,
    getCardBrand,
    formatCurrency,
    formatCPF,
    toCents,
    fromCents,
    isSandbox,
    getEnvironmentConfig,

    // Constantes
    PAYMENT_METHODS: PAGBANK_CONSTANTS.PAYMENT_METHODS,
    ORDER_STATUS: PAGBANK_CONSTANTS.ORDER_STATUS,
    CHARGE_STATUS: PAGBANK_CONSTANTS.CHARGE_STATUS
  }
}

export default usePagBank