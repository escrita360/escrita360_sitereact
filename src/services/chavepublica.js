/**
 * Serviço para gerenciar chaves públicas PagBank
 * Usado para criptografia de dados sensíveis no frontend
 * Documentação: https://dev.pagbank.uol.com.br/reference/chaves-publicas
 */

class ChavePublicaService {
  constructor() {
    // Suporte para Node.js (scripts) e Vite (frontend)
    const isNode = typeof process !== 'undefined' && process.env
    const env = isNode ? process.env : import.meta.env
    
    this.environment = env.VITE_PAGBANK_ENV || 'sandbox'
    this.baseUrl = this.environment === 'sandbox' 
      ? 'https://sandbox.api.pagseguro.com'
      : 'https://api.pagseguro.com'
    
    this.token = env.VITE_PAGBANK_TOKEN
    this.publicKey = null
    this.publicKeyExpiry = null
  }

  /**
   * Obtém a chave pública do PagBank para criptografia
   * A chave pública tem validade de 24 horas
   */
  async getPublicKey() {
    // Verifica se já tem uma chave válida em cache
    if (this.publicKey && this.publicKeyExpiry && new Date() < this.publicKeyExpiry) {
      return this.publicKey
    }

    try {
      const response = await fetch(`${this.baseUrl}/public-keys/card`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Erro ao obter chave pública: ${response.status}`)
      }

      const data = await response.json()
      
      // Armazena a chave e define expiração para 23 horas (margem de segurança)
      this.publicKey = data.public_key
      this.publicKeyExpiry = new Date(Date.now() + 23 * 60 * 60 * 1000)
      
      return this.publicKey
    } catch (error) {
      console.error('Erro ao obter chave pública PagBank:', error)
      throw error
    }
  }

  /**
   * Criptografa dados do cartão usando a chave pública
   * Requer biblioteca JSEncrypt ou similar
   */
  async encryptCardData(cardData) {
    try {
      const publicKey = await this.getPublicKey()
      
      // Importa JSEncrypt dinamicamente
      const { default: JSEncrypt } = await import('jsencrypt')
      const encrypt = new JSEncrypt()
      encrypt.setPublicKey(publicKey)

      const encryptedData = {
        number: encrypt.encrypt(cardData.number),
        security_code: encrypt.encrypt(cardData.security_code),
        exp_month: cardData.exp_month,
        exp_year: cardData.exp_year,
        holder: {
          name: cardData.holder.name
        }
      }

      return encryptedData
    } catch (error) {
      console.error('Erro ao criptografar dados do cartão:', error)
      throw error
    }
  }

  /**
   * Valida se os dados do cartão estão no formato correto
   */
  validateCardData(cardData) {
    const errors = []

    if (!cardData.number || cardData.number.length < 13) {
      errors.push('Número do cartão inválido')
    }

    if (!cardData.security_code || cardData.security_code.length < 3) {
      errors.push('CVV inválido')
    }

    if (!cardData.exp_month || cardData.exp_month < 1 || cardData.exp_month > 12) {
      errors.push('Mês de expiração inválido')
    }

    if (!cardData.exp_year || cardData.exp_year < new Date().getFullYear()) {
      errors.push('Ano de expiração inválido')
    }

    if (!cardData.holder?.name || cardData.holder.name.length < 3) {
      errors.push('Nome do portador inválido')
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  /**
   * Limpa a chave pública do cache
   */
  clearCache() {
    this.publicKey = null
    this.publicKeyExpiry = null
  }

  /**
   * Verifica se o serviço está configurado corretamente
   */
  isConfigured() {
    return !!(this.token && this.baseUrl)
  }
}

export const chavePublicaService = new ChavePublicaService()
export default chavePublicaService
