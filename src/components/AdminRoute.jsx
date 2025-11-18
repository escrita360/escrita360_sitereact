import { Navigate } from 'react-router-dom'
import { adminService } from '@/services/admin'
import { authService } from '@/services/auth'

/**
 * Componente de proteção de rotas administrativas
 * Redireciona para login se não autenticado ou não é admin
 */
export default function AdminRoute({ children }) {
  const isAuthenticated = authService.isAuthenticated()
  const isAdmin = adminService.isAdmin()

  if (!isAuthenticated) {
    // Não autenticado - redireciona para login
    return <Navigate to="/login" replace />
  }

  if (!isAdmin) {
    // Autenticado mas não é admin - redireciona para home
    return <Navigate to="/" replace />
  }

  // Admin autenticado - renderiza a página
  return children
}
