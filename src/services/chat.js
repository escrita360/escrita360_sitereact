import axios from 'axios'

// Use VITE_CHATBOT_URL if provided, otherwise fallback to VITE_API_URL
const CHATBOT_URL = import.meta.env.VITE_CHATBOT_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000'

const client = axios.create({
  baseURL: import.meta.env.DEV ? '/webhook' : CHATBOT_URL,
  headers: { 'Content-Type': 'application/json' },
})

export const chatService = {
  /**
   * Inicia uma nova conversa (POST /chatbot/start)
   * @param {{nome:string,email:string,telefone:string}} data
   */
  async startConversation(data) {
    const res = await client.post('/chatbot/start', data)
    return res.data
  },

  /**
   * Envia a escolha do usuário (POST /chatbot/message)
   * @param {string} sessionId
   * @param {string} choice - id do botão (não o texto)
   */
  async sendChoice(sessionId, choice) {
    const payload = { session_id: sessionId, choice }
    const res = await client.post('/chatbot/message', payload)
    return res.data
  },

  /**
   * Finaliza a conversa e cria lead (POST /chatbot/finalize)
   * @param {string} sessionId
   */
  async finalizeConversation(sessionId) {
    const res = await client.post('/chatbot/finalize', { session_id: sessionId })
    return res.data
  },
}