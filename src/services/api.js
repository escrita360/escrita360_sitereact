import axios from 'axios'

// Compatibilidade com Node.js e navegador
const getApiUrl = () => {
  // Em produção, usar a URL do mesmo host (backend e frontend no mesmo domínio)
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return `${window.location.protocol}//${window.location.hostname}/api`
  }
  // Em desenvolvimento
  return (globalThis.import?.meta?.env?.VITE_API_URL) ||
         (globalThis?.process?.env?.VITE_API_URL) ||
         'http://localhost:5000/api'
}

const API_URL = getApiUrl()

// Mock para testes
const isTestEnvironment = globalThis?.process?.env?.NODE_ENV === 'test'

const mockApi = {
  post: async (endpoint, data) => {
    console.log(`   🔗 API Call: ${endpoint}`, JSON.stringify(data, null, 2).substring(0, 200) + '...')

    if (endpoint === '/payment/create-pagbank-checkout') {
      return {
        data: {
          id: `checkout_mock_${Date.now()}`,
          payment_url: 'https://sandbox.pagbank.com/checkout/mock',
          qr_code: null,
          status: 'pending'
        }
      }
    }

    if (endpoint === '/payment/process-pagbank-card-payment') {
      return {
        data: {
          id: `tx_mock_${Date.now()}`,
          status: 'PAID',
          amount: data.amount,
          payment_method: 'CREDIT_CARD',
          installments: data.installments,
          created_at: new Date().toISOString()
        }
      }
    }

    throw new Error(`Endpoint não mockado: ${endpoint}`)
  },
  interceptors: {
    request: {
      use: () => {}
    },
    response: {
      use: () => {}
    }
  }
}

const realApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

const api = isTestEnvironment ? mockApi : realApi

// Interceptor para adicionar token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido ou expirado
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
