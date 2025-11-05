import React, { useState, useEffect } from 'react'
import { Eye, EyeOff, Mail, Lock, Shield, User, X, AlertCircle } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { authService } from '@/services/auth'
import { cn } from '@/lib/utils'

const LOGIN_USER_TYPE = {
  ADMIN: 'admin',
  ALUNO: 'aluno'
}

// Simulação do SavedLoginsService
const savedLoginsService = {
  getSavedLogins: () => {
    const saved = localStorage.getItem('savedLogins')
    return saved ? JSON.parse(saved) : []
  },
  
  saveLogin: (loginData) => {
    const savedLogins = savedLoginsService.getSavedLogins()
    const existingIndex = savedLogins.findIndex(login => login.email === loginData.email)
    
    if (existingIndex >= 0) {
      savedLogins[existingIndex] = loginData
    } else {
      savedLogins.push(loginData)
    }
    
    localStorage.setItem('savedLogins', JSON.stringify(savedLogins))
  },
  
  removeSavedLogin: (email) => {
    const savedLogins = savedLoginsService.getSavedLogins()
    const filtered = savedLogins.filter(login => login.email !== email)
    localStorage.setItem('savedLogins', JSON.stringify(filtered))
  }
}

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  
  // Determina o tipo de usuário baseado na URL ou query params
  const userType = location.pathname.includes('admin') || location.search.includes('type=admin') 
    ? LOGIN_USER_TYPE.ADMIN 
    : LOGIN_USER_TYPE.ALUNO

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  
  const [obscurePassword, setObscurePassword] = useState(true)
  const [rememberLogin, setRememberLogin] = useState(false)
  const [savedLogins, setSavedLogins] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [loadingLoginEmail, setLoadingLoginEmail] = useState(null)
  const [error, setError] = useState('')
  const [showRemoveDialog, setShowRemoveDialog] = useState(null)

  useEffect(() => {
    if (userType !== LOGIN_USER_TYPE.ADMIN) {
      loadSavedLogins()
    }
  }, [userType])

  const loadSavedLogins = async () => {
    try {
      const logins = await savedLoginsService.getSavedLogins()
      setSavedLogins(logins)
    } catch (error) {
      console.error('Erro ao carregar logins salvos:', error)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (error) setError('')
  }

  const validateForm = () => {
    if (!formData.email) {
      setError('Por favor, insira seu email')
      return false
    }
    
    if (!formData.email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      setError('Por favor, insira um email válido')
      return false
    }
    
    if (!formData.password) {
      setError('Por favor, insira sua senha')
      return false
    }
    
    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      return false
    }
    
    return true
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    setError('')

    try {
      const result = await authService.login(formData.email.trim(), formData.password)
      
      if (result.success !== false) {
        // Salva o login se a opção estiver marcada e não for admin
        if (rememberLogin && userType !== LOGIN_USER_TYPE.ADMIN) {
          const loginData = {
            email: formData.email,
            displayName: result.user?.name || formData.email.split('@')[0],
            initials: (result.user?.name || formData.email).substring(0, 2).toUpperCase(),
            userType: result.user?.userType || 'aluno',
            typeDisplayName: result.user?.userType === 'admin' ? 'Administrador' : 'Aluno',
            lastLogin: new Date().toISOString()
          }
          savedLoginsService.saveLogin(loginData)
          await loadSavedLogins()
        }

        // Navega baseado no tipo de usuário
        const userTypeResult = result.user?.userType || userType
        if (userTypeResult === 'admin') {
          navigate('/admin-dashboard')
        } else {
          navigate('/aluno')
        }
      } else {
        setError(result.message || 'Erro no login')
      }
    } catch (error) {
      console.error('Erro no login:', error)
      setError(error.message || 'Erro no login. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithSavedUser = async (login) => {
    setLoadingLoginEmail(login.email)
    setError('')

    try {
      // Simula tentativa de auto-login
      const result = await authService.verifyToken()
      
      if (result.success !== false && result.user?.email === login.email) {
        // Auto-login bem-sucedido
        const userTypeResult = result.user?.userType
        if (userTypeResult === 'admin') {
          navigate('/admin-dashboard')
        } else {
          navigate('/aluno')
        }
      } else {
        // Auto-login falhou - preenche o email
        setFormData(prev => ({
          ...prev,
          email: login.email,
          password: ''
        }))
        setError('Login expirado. Digite sua senha para continuar.')
      }
    } catch (error) {
      // Em caso de erro, preenche o email
      setFormData(prev => ({
        ...prev,
        email: login.email,
        password: ''
      }))
      setError('Erro no login automático. Digite sua senha.')
    } finally {
      setLoadingLoginEmail(null)
    }
  }

  const removeSavedLogin = async (email) => {
    try {
      await savedLoginsService.removeSavedLogin(email)
      await loadSavedLogins()
      setShowRemoveDialog(null)
    } catch (error) {
      console.error('Erro ao remover login salvo:', error)
    }
  }

  const isAdmin = userType === LOGIN_USER_TYPE.ADMIN
  const title = isAdmin ? 'Escrita360 Admin' : 'Escrita360 Aluno'
  const subtitle = isAdmin 
    ? 'Faça login para acessar o painel administrativo'
    : 'Faça login para acessar o painel Aluno'

  return (
    <div className="min-h-screen bg-blue-600 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card className="shadow-xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              {isAdmin ? (
                <Shield className="w-10 h-10 text-blue-600" />
              ) : (
                <User className="w-10 h-10 text-blue-600" />
              )}
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-blue-600">
                {title}
              </CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                {subtitle}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type={obscurePassword ? "password" : "text"}
                    name="password"
                    placeholder="Senha"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setObscurePassword(!obscurePassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {obscurePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {!isAdmin && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberLogin}
                    onCheckedChange={setRememberLogin}
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm text-gray-700 font-medium cursor-pointer"
                  >
                    Lembrar meu login para acessos futuros
                  </label>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Entrando...</span>
                  </div>
                ) : (
                  'Entrar'
                )}
              </Button>
            </form>

            {/* Saved Logins Section */}
            {savedLogins.length > 0 && !isAdmin && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-gray-500">Logins Salvos</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {savedLogins.map((login) => (
                    <SavedLoginCard
                      key={login.email}
                      login={login}
                      isLoading={loadingLoginEmail === login.email}
                      onLogin={() => loginWithSavedUser(login)}
                      onRemove={() => setShowRemoveDialog(login)}
                    />
                  ))}
                </div>
              </>
            )}

            <div className="text-center pt-4">
              <p className="text-sm text-gray-500">
                Escrita360 © 2025
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Remove Dialog */}
        {showRemoveDialog && (
          <RemoveDialog
            login={showRemoveDialog}
            onConfirm={() => removeSavedLogin(showRemoveDialog.email)}
            onCancel={() => setShowRemoveDialog(null)}
          />
        )}
      </div>
    </div>
  )
}

const SavedLoginCard = ({ login, isLoading, onLogin, onRemove }) => {
  return (
    <div className={cn(
      "p-4 border rounded-lg transition-all cursor-pointer hover:bg-gray-50",
      isLoading && "bg-blue-50 border-blue-200"
    )}>
      <div className="flex items-center space-x-3" onClick={onLogin}>
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-blue-600 font-semibold text-sm">
            {login.initials}
          </span>
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {login.displayName}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {login.email}
          </p>
          <Badge variant="secondary" className="text-xs mt-1">
            {login.typeDisplayName}
          </Badge>
        </div>

        <div className="flex-shrink-0">
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onRemove()
              }}
              className="w-8 h-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

const RemoveDialog = ({ login, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-orange-500" />
            <span>Remover Login Salvo</span>
          </CardTitle>
          <CardDescription>
            Deseja remover o login salvo de {login.displayName}?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Cancelar
            </Button>
            <Button variant="destructive" onClick={onConfirm} className="flex-1">
              Remover
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login
