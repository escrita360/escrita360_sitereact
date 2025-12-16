/**
 * Serviço para gerenciar chaves públicas PagBank
 * Usado para criptografia de dados sensíveis no frontend
 * Documentação: https://developer.pagbank.com.br/reference/criar-chave-publica
 * 
 * A chave pública é usada para:
 * - Criptografar dados de cartão de crédito
 * - Autenticação 3DS
 * - Proteção de dados sensíveis antes de enviar ao backend
 * 
 * IMPORTANTE:
 * - A chave pública tem validade de 24 horas
 * - Deve ser criada via POST /public-keys antes de consultar
 * - Para produção, use VITE_PAGBANK_ENV=production
 */

class ChavePublicaService {
  constructor() {
    // Suporte para Node.js (scripts) e Vite (frontend)
    const isNode = typeof process !== 'undefined' && process.env
    const env = isNode ? process.env : import.meta.env
    
    this.environment = env.VITE_PAGBANK_ENV || 'sandbox'
    
    // URLs da API conforme documentação oficial
    // Sandbox: https://sandbox.api.pagseguro.com
    // Produção: https://api.pagseguro.com
    this.baseUrl = this.environment === 'sandbox' 
      ? 'https://sandbox.api.pagseguro.com'
      : 'https://api.pagseguro.com'
    
    this.token = env.VITE_PAGBANK_TOKEN
    this.publicKey = null
    this.publicKeyExpiry = null
    
    // Log de inicialização (apenas em desenvolvimento)
    if (this.environment === 'sandbox' && isNode === false) {
      console.log('🔑 ChavePublicaService inicializado:', {
        environment: this.environment,
        baseUrl: this.baseUrl,
        tokenConfigured: !!this.token
      })
    }
  }

  /**
   * Cria uma nova chave pública no PagBank
   * POST /public-keys
   * 
   * Esta operação deve ser feita antes de obter a chave pública
   * A chave criada tem validade de 24 horas
   */
  async createPublicKey() {
    try {
      const response = await fetch(`${this.baseUrl}/public-keys`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          type: 'card' // Tipo de recurso: 'card' para criptografia de cartão
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`Erro ao criar chave pública: ${response.status} - ${JSON.stringify(errorData)}`)
      }

      const data = await response.json()
      
      // Armazena a chave e define expiração para 23 horas (margem de segurança)
      this.publicKey = data.public_key
      this.publicKeyExpiry = new Date(Date.now() + 23 * 60 * 60 * 1000)
      
      if (this.environment === 'sandbox') {
        console.log('✅ Chave pública criada com sucesso')
      }
      
      return this.publicKey
    } catch (error) {
      console.error('❌ Erro ao criar chave pública PagBank:', error)
      throw error
    }
  }

  /**
   * Obtém a chave pública do PagBank para criptografia
   * GET /public-keys/card
   * 
   * A chave pública tem validade de 24 horas
   * Se não existir cache válido, cria uma nova chave automaticamente
   */
  async getPublicKey() {
    // Verifica se já tem uma chave válida em cache
    if (this.publicKey && this.publicKeyExpiry && new Date() < this.publicKeyExpiry) {
      return this.publicKey
    }

    try {
      // Tenta obter a chave pública existente
      const response = await fetch(`${this.baseUrl}/public-keys/card`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })

      if (!response.ok) {
        // Se não encontrar chave existente, cria uma nova
        if (response.status === 404 || response.status === 401) {
          console.log('📝 Chave pública não encontrada, criando nova...')
          return await this.createPublicKey()
        }
        
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`Erro ao obter chave pública: ${response.status} - ${JSON.stringify(errorData)}`)
      }

      const data = await response.json()
      
      // Armazena a chave e define expiração para 23 horas (margem de segurança)
      this.publicKey = data.public_key
      this.publicKeyExpiry = new Date(Date.now() + 23 * 60 * 60 * 1000)
      
      return this.publicKey
    } catch (error) {
      console.error('❌ Erro ao obter chave pública PagBank:', error)
      throw error
    }
  }

  /**
   * Criptografa dados do cartão usando a chave pública
   * Requer biblioteca JSEncrypt ou similar
   * 
   * @param {Object} cardData - Dados do cartão
   * @param {string} cardData.number - Número do cartão
   * @param {string} cardData.security_code - CVV do cartão
   * @param {number} cardData.exp_month - Mês de expiração
   * @param {number} cardData.exp_year - Ano de expiração
   * @param {Object} cardData.holder - Dados do portador
   * @param {string} cardData.holder.name - Nome do portador
   * @returns {Object} Dados criptografados
   */
  async encryptCardData(cardData) {
    try {
      const publicKey = await this.getPublicKey()
      
      // Importa JSEncrypt dinamicamente
      const { default: JSEncrypt } = await import('jsencrypt')
      const encrypt = new JSEncrypt()
      encrypt.setPublicKey(publicKey)

      // Criptografa apenas dados sensíveis (número e CVV)
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
      console.error('❌ Erro ao criptografar dados do cartão:', error)
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
   * Útil para forçar renovação da chave
   */
  clearCache() {
    this.publicKey = null
    this.publicKeyExpiry = null
    
    if (this.environment === 'sandbox') {
      console.log('🗑️ Cache de chave pública limpo')
    }
  }

  /**
   * Verifica se o serviço está configurado corretamente
   * @returns {boolean} true se configurado corretamente
   */
  isConfigured() {
    const configured = !!(this.token && this.baseUrl)
    
    if (!configured) {
      console.warn('⚠️ ChavePublicaService não está configurado corretamente:', {
        tokenConfigured: !!this.token,
        baseUrlConfigured: !!this.baseUrl,
        environment: this.environment
      })
    }
    
    return configured
  }

  /**
   * Retorna informações sobre o ambiente atual
   * Útil para debugging e logs
   */
  getEnvironmentInfo() {
    return {
      environment: this.environment,
      baseUrl: this.baseUrl,
      tokenConfigured: !!this.token,
      hasCachedKey: !!this.publicKey,
      keyExpiry: this.publicKeyExpiry ? this.publicKeyExpiry.toISOString() : null
    }
  }
}

export const chavePublicaService = new ChavePublicaService()
export default chavePublicaService
