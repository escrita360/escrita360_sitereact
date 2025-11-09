import api from './api'

export const chatService = {
  /**
   * Envia uma mensagem para o chatbot e recebe a resposta
   * @param {string} message - Mensagem do usuário
   * @param {string} sessionId - ID da sessão do chat
   * @returns {Promise<Object>} - Resposta do bot { response: string, buttons?: array }
   */
  async sendMessage(message, sessionId = null) {
    const payload = { message }
    if (sessionId) payload.session_id = sessionId
    const response = await api.post('/chat/message', payload)
    return response.data
  },
}