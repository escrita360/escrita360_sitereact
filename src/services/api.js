import axios from 'axios'

// Compatibilidade com Node.js e navegador
const API_URL = (globalThis.import?.meta?.env?.VITE_API_URL) ||
                (typeof process !== 'undefined' ? process.env?.VITE_API_URL : undefined) ||
                'http://localhost:5000/api'

// Mock para testes
const isTestEnvironment = typeof process !== 'undefined' && process.env?.NODE_ENV === 'test'

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
