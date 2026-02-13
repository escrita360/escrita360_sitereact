/**
 * Hook personalizado para integração com PagBank
 * Facilita o uso das funcionalidades de pagamento criptografado e consultas avançadas
 */

import { useState } from 'react'
import { paymentService } from '../services/payment.js'

export const usePagBank = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  /**
   * Processa pagamento com cartão (tenta múltiplas estratégias)
   */
  const processCardPayment = async (paymentData, options = {}) => {
    setIsLoading(true)
    setError(null)

    const { encryptionMethod = 'frontend' } = options // 'frontend', 'backend', 'complete'

    try {
      let result
      
      if (encryptionMethod === 'complete') {
        // Estratégia 1: Criptografia completa no backend
        console.log('🔐 Tentando pagamento com criptografia completa no backend...')
        try {
          result = await paymentService.processPagBankCompleteBackendEncryption(paymentData)
          console.log('✅ Pagamento com criptografia completa realizado com sucesso')
        } catch (completeError) {
          console.warn('⚠️ Criptografia completa falhou, tentando criptografia backend:', completeError.message)
          encryptionMethod = 'backend'
        }
      }

      if (encryptionMethod === 'backend') {
        // Estratégia 2: Criptografia no backend
        console.log('🔐 Tentando pagamento com criptografia no backend...')
        try {
          result = await paymentService.processPagBankBackendEncryptedCardPayment(paymentData)
          console.log('✅ Pagamento com criptografia backend realizado com sucesso')
        } catch (backendError) {
          console.warn('⚠️ Criptografia backend falhou, usando método frontend:', backendError.message)
          encryptionMethod = 'frontend'
        }
      }

      if (encryptionMethod === 'frontend') {
        // Estratégia 3: Criptografia no frontend (padrão)
        console.log('🔐 Tentando pagamento com criptografia no frontend...')
        try {
          const publicKey = await paymentService.getPublicKey()
          result = await paymentService.processPagBankEncryptedCardPayment(paymentData, publicKey)
          console.log('✅ Pagamento com criptografia frontend realizado com sucesso')
        } catch (encryptedError) {
          console.warn('⚠️ Pagamento criptografado falhou, usando método PCI:', encryptedError.message)
          
          // Fallback para criptografia no backend (nunca envia cartão bruto)
          result = await paymentService.processPagBankCompleteBackendEncryption(paymentData)
        }
      }

      return result
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Obtém taxas de parcelamento com dados detalhados
   */
  const getInstallmentFees = async (value, maxInstallments = 12, maxInstallmentsNoInterest = 0, cardBin = null) => {
    setIsLoading(true)
    setError(null)

    try {
      const feesData = await paymentService.getInstallmentFees(
        value,
        maxInstallments,
        maxInstallmentsNoInterest,
        cardBin
      )

      // Converter para formato padronizado
      const options = []
      
      if (feesData.payment_methods?.credit_card) {
        const brands = Object.keys(feesData.payment_methods.credit_card)
        
        if (brands.length > 0) {
          const brandData = feesData.payment_methods.credit_card[brands[0]]
          
          brandData.installment_plans?.forEach(plan => {
            options.push({
              quantity: plan.installments,
              amount: Number(plan.installment_value) / 100,
              total: Number(plan.amount.total) / 100,
              interest_free: plan.amount.fees === 0,
              fees: Number(plan.amount.fees) / 100,
              interestRate: plan.interest_rate || 0
            })
          })
        }
      }
      
      // Fallback
      if (options.length === 0) {
        options.push({ 
          quantity: 1, 
          amount: Number(value), 
          total: Number(value), 
          interest_free: true,
          fees: 0,
          interestRate: 0
        })
      }

      return options
    } catch (error) {
      setError(error.message)
      console.error('Erro ao obter taxas:', error)
      
      // Retornar fallback em caso de erro
      return [{ 
        quantity: 1, 
        amount: Number(value), 
        total: Number(value), 
        interest_free: true,
        fees: 0,
        interestRate: 0
      }]
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Consulta status de um pedido
   */
  const getOrderStatus = async (orderId) => {
    setIsLoading(true)
    setError(null)

    try {
      const order = await paymentService.getOrder(orderId)
      return {
        id: order.id,
        status: order.charges?.[0]?.status || 'PENDING',
        amount: order.charges?.[0]?.amount?.value / 100,
        paymentMethod: order.charges?.[0]?.payment_method?.type,
        createdAt: order.created_at,
        paidAt: order.charges?.[0]?.paid_at
      }
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Lista pedidos do usuário
   */
  const getUserOrders = async (filters = {}) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await paymentService.getOrders({
        limit: 10,
        ...filters
      })

      return response.orders?.map(order => ({
        id: order.id,
        referenceId: order.reference_id,
        status: order.charges?.[0]?.status || 'PENDING',
        amount: order.charges?.[0]?.amount?.value / 100,
        paymentMethod: order.charges?.[0]?.payment_method?.type,
        createdAt: order.created_at,
        description: order.charges?.[0]?.description
      })) || []
    } catch (error) {
      setError(error.message)
      return []
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Determina a bandeira do cartão baseado no número
   */
  const getCardBrand = (cardNumber) => {
    return paymentService.getCardBrand(cardNumber)
  }

  /**
   * Valida dados do cartão
   */
  const validateCard = (cardData) => {
    return paymentService.validateCardData(cardData)
  }

  return {
    // Estados
    isLoading,
    error,

    // Métodos
    processCardPayment,
    getInstallmentFees,
    getOrderStatus,
    getUserOrders,
    getCardBrand,
    validateCard,

    // Limpar erro
    clearError: () => setError(null)
  }
}

export default usePagBank