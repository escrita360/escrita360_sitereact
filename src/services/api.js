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

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

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
