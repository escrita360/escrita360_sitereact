import api from './api'

export const adminService = {
  /**
   * Obtém estatísticas do dashboard
   */
  async getDashboardStats() {
    const response = await api.get('/admin/dashboard/stats')
    return response.data
  },

  /**
   * Lista usuários
   */
  async listUsers(maxResults = 100, pageToken = null) {
    const params = { maxResults }
    if (pageToken) params.pageToken = pageToken
    
    const response = await api.get('/admin/users', { params })
    return response.data
  },

  /**
   * Busca usuário específico
   */
  async getUser(uid) {
    const response = await api.get(`/admin/users/${uid}`)
    return response.data
  },

  /**
   * Desabilita/habilita usuário
   */
  async setUserDisabled(uid, disabled) {
    const response = await api.put(`/admin/users/${uid}/disable`, { disabled })
    return response.data
  },

  /**
   * Define permissões customizadas
   */
  async setUserClaims(uid, claims) {
    const response = await api.put(`/admin/users/${uid}/claims`, { claims })
    return response.data
  },

  /**
   * Lista todas as assinaturas
   */
  async listSubscriptions(limit = 50, startAfter = null) {
    const params = { limit }
    if (startAfter) params.startAfter = startAfter
    
    const response = await api.get('/admin/subscriptions', { params })
    return response.data
  },

  /**
   * Atualiza status de assinatura
   */
  async updateSubscriptionStatus(subscriptionId, status) {
    const response = await api.put(`/admin/subscriptions/${subscriptionId}/status`, { status })
    return response.data
  },

  /**
   * Lista todos os pagamentos
   */
  async listPayments(limit = 50, startAfter = null) {
    const params = { limit }
    if (startAfter) params.startAfter = startAfter
    
    const response = await api.get('/admin/payments', { params })
    return response.data
  },

  /**
   * Obter configurações do PagBank
   */
  async getPagBankConfig() {
    const response = await api.get('/admin/pagbank/config')
    return response.data
  },

  /**
   * Atualizar configurações do PagBank
   */
  async updatePagBankConfig(config) {
    const response = await api.put('/admin/pagbank/config', config)
    return response.data
  },

  /**
   * Busca assinaturas de um usuário
   */
  async getUserSubscriptions(uid) {
    const response = await api.get(`/admin/users/${uid}/subscriptions`)
    return response.data
  },

  /**
   * Verifica se usuário atual é admin
   */
  isAdmin() {
    const user = localStorage.getItem('user')
    if (!user) return false
    
    const userData = JSON.parse(user)
    const adminEmails = ['admin@escrita360.com', 'suporte@escrita360.com']
    return adminEmails.includes(userData.email)
  }
}
