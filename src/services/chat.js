import api from './api'

export const chatService = {
  /**
   * Envia uma mensagem para o chatbot e recebe a resposta
   * @param {string} message - Mensagem do usuário
   * @returns {Promise<Object>} - Resposta do bot { response: string }
   */
  async sendMessage(message) {
    const response = await api.post('/chat/message', {
      message,
    })
    return response.data
  },
}