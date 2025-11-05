import React, { useState, useEffect } from 'react'
import { Eye, EyeOff, Mail, Lock, Shield, User, X, AlertCircle, UserPlus, LogIn } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { authService } from '@/services/auth'
import { cn } from '@/lib/utils'

const LOGIN_USER_TYPE = {
  ADMIN: 'admin',
  ALUNO: 'aluno'
}

// Esquema de cores do site
const BRAND_COLORS = {
  primary: '#4070B7',
  secondary: '#61C2D3',
  accent: '#39A1DB',
  light: '#F5F9FC'
}

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  
  const userType = location.pathname.includes('admin') || location.search.includes('type=admin') 
    ? LOGIN_USER_TYPE.ADMIN 
    : LOGIN_USER_TYPE.ALUNO

  const [activeTab, setActiveTab] = useState('login')
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  })
  
  const [obscurePassword, setObscurePassword] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (error) setError('')
  }

  const handleRegisterInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setRegisterData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    if (error) setError('')
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password) {
      setError('Por favor, preencha todos os campos')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const result = await authService.login(formData.email.trim(), formData.password)
      
      if (result.success !== false) {
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

  const handleRegister = async (e) => {
    e.preventDefault()
    
    if (!registerData.name || !registerData.email || !registerData.password) {
      setError('Por favor, preencha todos os campos obrigatórios')
      return
    }
    
    if (registerData.password !== registerData.confirmPassword) {
      setError('As senhas não coincidem')
      return
    }
    
    if (!registerData.acceptTerms) {
      setError('Você deve aceitar os termos de uso')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const result = await authService.register({
        name: registerData.name,
        email: registerData.email.trim(),
        password: registerData.password,
        userType: 'aluno'
      })
      
      if (result.success !== false) {
        navigate('/aluno')
      } else {
        setError(result.message || 'Erro no cadastro')
      }
    } catch (error) {
      console.error('Erro no cadastro:', error)
      setError(error.message || 'Erro no cadastro. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const isAdmin = userType === LOGIN_USER_TYPE.ADMIN
  const title = isAdmin ? 'Escrita360 Admin' : 'Escrita360'
  const subtitle = isAdmin ? 'Acesso ao painel administrativo' : 'Plataforma de desenvolvimento da escrita'

  return (
    <div style={{ backgroundColor: BRAND_COLORS.light }} className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <Card className="shadow-xl border-0 overflow-hidden">
          <CardHeader className="text-center space-y-6 pb-6" style={{ background: `linear-gradient(135deg, ${BRAND_COLORS.primary} 0%, ${BRAND_COLORS.accent} 100%)` }}>
            <div className="mx-auto w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
              {isAdmin ? (
                <Shield className="w-12 h-12 text-white" />
              ) : (
                <User className="w-12 h-12 text-white" />
              )}
            </div>
            <div>
              <CardTitle className="text-3xl font-bold text-white">{title}</CardTitle>
              <CardDescription className="text-white/90 mt-2 text-base">{subtitle}</CardDescription>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="login" className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Entrar
                </TabsTrigger>
                <TabsTrigger value="register" className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Cadastrar
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-6">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: BRAND_COLORS.primary }} />
                    <Input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10 h-12 border-2"
                      style={{ borderColor: BRAND_COLORS.primary + '40' }}
                      autoComplete="email"
                    />
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: BRAND_COLORS.primary }} />
                    <Input
                      type={obscurePassword ? "password" : "text"}
                      name="password"
                      placeholder="Senha"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-10 pr-10 h-12 border-2"
                      style={{ borderColor: BRAND_COLORS.primary + '40' }}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setObscurePassword(!obscurePassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      style={{ color: BRAND_COLORS.primary }}
                    >
                      {obscurePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 text-white font-semibold"
                    style={{ backgroundColor: BRAND_COLORS.primary }}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Entrando...' : 'Entrar'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="space-y-6">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: BRAND_COLORS.primary }} />
                    <Input
                      type="text"
                      name="name"
                      placeholder="Nome completo"
                      value={registerData.name}
                      onChange={handleRegisterInputChange}
                      className="pl-10 h-12 border-2"
                      style={{ borderColor: BRAND_COLORS.primary + '40' }}
                    />
                  </div>

                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: BRAND_COLORS.primary }} />
                    <Input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={registerData.email}
                      onChange={handleRegisterInputChange}
                      className="pl-10 h-12 border-2"
                      style={{ borderColor: BRAND_COLORS.primary + '40' }}
                    />
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: BRAND_COLORS.primary }} />
                    <Input
                      type="password"
                      name="password"
                      placeholder="Senha"
                      value={registerData.password}
                      onChange={handleRegisterInputChange}
                      className="pl-10 h-12 border-2"
                      style={{ borderColor: BRAND_COLORS.primary + '40' }}
                    />
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: BRAND_COLORS.primary }} />
                    <Input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirmar senha"
                      value={registerData.confirmPassword}
                      onChange={handleRegisterInputChange}
                      className="pl-10 h-12 border-2"
                      style={{ borderColor: BRAND_COLORS.primary + '40' }}
                    />
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="acceptTerms"
                      name="acceptTerms"
                      checked={registerData.acceptTerms}
                      onCheckedChange={(checked) => setRegisterData(prev => ({ ...prev, acceptTerms: checked }))}
                      className="mt-1"
                    />
                    <label htmlFor="acceptTerms" className="text-sm leading-relaxed cursor-pointer">
                      Aceito os{' '}
                      <a href="#" className="underline" style={{ color: BRAND_COLORS.primary }}>
                        termos de uso
                      </a>{' '}
                      e{' '}
                      <a href="#" className="underline" style={{ color: BRAND_COLORS.primary }}>
                        política de privacidade
                      </a>
                    </label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 text-white font-semibold"
                    style={{ backgroundColor: BRAND_COLORS.secondary }}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Cadastrando...' : 'Criar Conta'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="text-center pt-6 border-t border-gray-100 mt-8">
              <p className="text-sm text-slate-500">
                Escrita360 © 2025 - Transformando a escrita através da tecnologia
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Login