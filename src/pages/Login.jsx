import React, { useState } from 'react'
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
import escrita360Logo from '@/assets/Escrita360.png'
import robo from '@/assets/robo.svg'

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
  
  // Estilos para animações customizadas
  const customStyles = `
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }
    
    @keyframes glow {
      0% { opacity: 0.2; transform: scale(1); }
      100% { opacity: 0.4; transform: scale(1.1); }
    }
    
    @keyframes fadeIn {
      0% { opacity: 0; transform: translateY(10px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes slideInLeft {
      0% { opacity: 0; transform: translateX(-20px); }
      100% { opacity: 1; transform: translateX(0); }
    }
    
    @keyframes slideInRight {
      0% { opacity: 0; transform: translateX(20px); }
      100% { opacity: 1; transform: translateX(0); }
    }
    
    .robot-container {
      animation: float 3s ease-in-out infinite;
    }
    
    .robot-glow {
      animation: glow 2s ease-in-out infinite alternate;
    }
    
    .tab-content-enter {
      animation: fadeIn 0.5s ease-in-out;
    }
    
    .tab-register {
      animation: slideInLeft 0.4s ease-out;
    }
    
    .tab-login {
      animation: slideInRight 0.4s ease-out;
    }
  `
  
  const userType = location.pathname.includes('admin') || location.search.includes('type=admin') 
    ? LOGIN_USER_TYPE.ADMIN 
    : LOGIN_USER_TYPE.ALUNO

  const [activeTab, setActiveTab] = useState('register')
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
  const [focusedField, setFocusedField] = useState('')
  const [isTermsAnimated, setIsTermsAnimated] = useState(false)

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
    
    // Anima os termos quando o checkbox é marcado
    if (name === 'acceptTerms' && checked) {
      setIsTermsAnimated(true)
      setTimeout(() => setIsTermsAnimated(false), 600)
    }
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
  const subtitle = isAdmin ? 'Acesso ao painel administrativo' : 'Plataforma de desenvolvimento da escrita'

  return (
    <>
      <style>{customStyles}</style>
      <div style={{ backgroundColor: BRAND_COLORS.light }} className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Coluna da Esquerda - Formulário de Login/Cadastro */}
        <div className="w-full max-w-lg mx-auto">
          <Card className="shadow-xl border-0 overflow-hidden">
            <CardHeader className="text-center space-y-6 pb-6 bg-white">
              <div>
                <div className="flex justify-center mb-2">
                  <img 
                    src={escrita360Logo} 
                    alt={isAdmin ? "Escrita360 Admin" : "Escrita360"} 
                    className="h-12 object-contain"
                  />
                  {isAdmin && (
                    <span className="ml-2 text-3xl font-bold self-end" style={{ color: BRAND_COLORS.primary }}>
                      Admin
                    </span>
                  )}
                </div>
                <CardDescription className="mt-2 text-base text-slate-600">
                  {subtitle}
                </CardDescription>
              </div>
            </CardHeader>

          <CardContent className="p-6">
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-slate-100 p-1 rounded-lg">
                <TabsTrigger 
                  value="register" 
                  className={cn(
                    "flex items-center gap-2 transition-all duration-500 ease-in-out",
                    "data-[state=active]:bg-white data-[state=active]:shadow-md",
                    "data-[state=active]:scale-105 data-[state=active]:transform",
                    "hover:bg-white/50 hover:scale-102"
                  )}
                  style={{ 
                    color: activeTab === 'register' ? BRAND_COLORS.primary : '#64748b',
                    transform: activeTab === 'register' ? 'scale(1.05)' : 'scale(1)'
                  }}
                >
                  <UserPlus className={cn(
                    "w-4 h-4 transition-all duration-300",
                    activeTab === 'register' ? 'animate-pulse' : ''
                  )} />
                  Cadastrar
                </TabsTrigger>
                <TabsTrigger 
                  value="login" 
                  className={cn(
                    "flex items-center gap-2 transition-all duration-500 ease-in-out",
                    "data-[state=active]:bg-white data-[state=active]:shadow-md",
                    "data-[state=active]:scale-105 data-[state=active]:transform",
                    "hover:bg-white/50 hover:scale-102"
                  )}
                  style={{ 
                    color: activeTab === 'login' ? BRAND_COLORS.primary : '#64748b',
                    transform: activeTab === 'login' ? 'scale(1.05)' : 'scale(1)'
                  }}
                >
                  <LogIn className={cn(
                    "w-4 h-4 transition-all duration-300",
                    activeTab === 'login' ? 'animate-pulse' : ''
                  )} />
                  Entrar
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className={cn("space-y-6 tab-content-enter", activeTab === 'login' ? 'tab-login' : '')}>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className={cn(
                    "relative transition-all duration-300 ease-in-out rounded-lg p-3",
                    focusedField === 'login-email' ? 'bg-blue-50 border border-blue-200 shadow-sm' : ''
                  )}>
                    <Mail className="absolute left-6 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: BRAND_COLORS.primary }} />
                    <Input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('login-email')}
                      onBlur={() => setFocusedField('')}
                      className={cn(
                        "pl-10 h-12 border-2 transition-all duration-300 ease-in-out",
                        focusedField === 'login-email' ? 'border-blue-300 shadow-md' : ''
                      )}
                      style={{ 
                        borderColor: focusedField === 'login-email' ? BRAND_COLORS.accent : BRAND_COLORS.primary + '40',
                        boxShadow: focusedField === 'login-email' ? `0 0 0 3px ${BRAND_COLORS.accent}20` : ''
                      }}
                      autoComplete="email"
                    />
                  </div>

                  <div className={cn(
                    "relative transition-all duration-300 ease-in-out rounded-lg p-3",
                    focusedField === 'login-password' ? 'bg-blue-50 border border-blue-200 shadow-sm' : ''
                  )}>
                    <Lock className="absolute left-6 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: BRAND_COLORS.primary }} />
                    <Input
                      type={obscurePassword ? "password" : "text"}
                      name="password"
                      placeholder="Senha"
                      value={formData.password}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('login-password')}
                      onBlur={() => setFocusedField('')}
                      className={cn(
                        "pl-10 pr-10 h-12 border-2 transition-all duration-300 ease-in-out",
                        focusedField === 'login-password' ? 'border-blue-300 shadow-md' : ''
                      )}
                      style={{ 
                        borderColor: focusedField === 'login-password' ? BRAND_COLORS.accent : BRAND_COLORS.primary + '40',
                        boxShadow: focusedField === 'login-password' ? `0 0 0 3px ${BRAND_COLORS.accent}20` : ''
                      }}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setObscurePassword(!obscurePassword)}
                      className="absolute right-6 top-1/2 transform -translate-y-1/2 transition-colors duration-200 hover:opacity-75"
                      style={{ color: BRAND_COLORS.primary }}
                    >
                      {obscurePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 text-white font-semibold transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-105"
                    style={{ backgroundColor: BRAND_COLORS.primary }}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Entrando...' : 'Entrar'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className={cn("space-y-6 tab-content-enter", activeTab === 'register' ? 'tab-register' : '')}>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className={cn(
                    "relative transition-all duration-300 ease-in-out rounded-lg p-3",
                    focusedField === 'register-name' ? 'bg-blue-50 border border-blue-200 shadow-sm' : ''
                  )}>
                    <User className="absolute left-6 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: BRAND_COLORS.primary }} />
                    <Input
                      type="text"
                      name="name"
                      placeholder="Nome completo"
                      value={registerData.name}
                      onChange={handleRegisterInputChange}
                      onFocus={() => setFocusedField('register-name')}
                      onBlur={() => setFocusedField('')}
                      className={cn(
                        "pl-10 h-12 border-2 transition-all duration-300 ease-in-out",
                        focusedField === 'register-name' ? 'border-blue-300 shadow-md' : ''
                      )}
                      style={{ 
                        borderColor: focusedField === 'register-name' ? BRAND_COLORS.accent : BRAND_COLORS.primary + '40',
                        boxShadow: focusedField === 'register-name' ? `0 0 0 3px ${BRAND_COLORS.accent}20` : ''
                      }}
                    />
                  </div>

                  <div className={cn(
                    "relative transition-all duration-300 ease-in-out rounded-lg p-3",
                    focusedField === 'register-email' ? 'bg-blue-50 border border-blue-200 shadow-sm' : ''
                  )}>
                    <Mail className="absolute left-6 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: BRAND_COLORS.primary }} />
                    <Input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={registerData.email}
                      onChange={handleRegisterInputChange}
                      onFocus={() => setFocusedField('register-email')}
                      onBlur={() => setFocusedField('')}
                      className={cn(
                        "pl-10 h-12 border-2 transition-all duration-300 ease-in-out",
                        focusedField === 'register-email' ? 'border-blue-300 shadow-md' : ''
                      )}
                      style={{ 
                        borderColor: focusedField === 'register-email' ? BRAND_COLORS.accent : BRAND_COLORS.primary + '40',
                        boxShadow: focusedField === 'register-email' ? `0 0 0 3px ${BRAND_COLORS.accent}20` : ''
                      }}
                    />
                  </div>

                  <div className={cn(
                    "relative transition-all duration-300 ease-in-out rounded-lg p-3",
                    focusedField === 'register-password' ? 'bg-blue-50 border border-blue-200 shadow-sm' : ''
                  )}>
                    <Lock className="absolute left-6 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: BRAND_COLORS.primary }} />
                    <Input
                      type="password"
                      name="password"
                      placeholder="Senha"
                      value={registerData.password}
                      onChange={handleRegisterInputChange}
                      onFocus={() => setFocusedField('register-password')}
                      onBlur={() => setFocusedField('')}
                      className={cn(
                        "pl-10 h-12 border-2 transition-all duration-300 ease-in-out",
                        focusedField === 'register-password' ? 'border-blue-300 shadow-md' : ''
                      )}
                      style={{ 
                        borderColor: focusedField === 'register-password' ? BRAND_COLORS.accent : BRAND_COLORS.primary + '40',
                        boxShadow: focusedField === 'register-password' ? `0 0 0 3px ${BRAND_COLORS.accent}20` : ''
                      }}
                    />
                  </div>

                  <div className={cn(
                    "relative transition-all duration-300 ease-in-out rounded-lg p-3",
                    focusedField === 'register-confirmPassword' ? 'bg-blue-50 border border-blue-200 shadow-sm' : ''
                  )}>
                    <Lock className="absolute left-6 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: BRAND_COLORS.primary }} />
                    <Input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirmar senha"
                      value={registerData.confirmPassword}
                      onChange={handleRegisterInputChange}
                      onFocus={() => setFocusedField('register-confirmPassword')}
                      onBlur={() => setFocusedField('')}
                      className={cn(
                        "pl-10 h-12 border-2 transition-all duration-300 ease-in-out",
                        focusedField === 'register-confirmPassword' ? 'border-blue-300 shadow-md' : ''
                      )}
                      style={{ 
                        borderColor: focusedField === 'register-confirmPassword' ? BRAND_COLORS.accent : BRAND_COLORS.primary + '40',
                        boxShadow: focusedField === 'register-confirmPassword' ? `0 0 0 3px ${BRAND_COLORS.accent}20` : ''
                      }}
                    />
                  </div>

                  <div className={cn(
                    "flex items-start space-x-3 p-4 rounded-lg transition-all duration-500 ease-in-out",
                    isTermsAnimated ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 shadow-sm scale-105' : 'hover:bg-gray-50',
                    registerData.acceptTerms ? 'border-green-200 bg-green-50' : ''
                  )}>
                    <Checkbox
                      id="acceptTerms"
                      name="acceptTerms"
                      checked={registerData.acceptTerms}
                      onCheckedChange={(checked) => {
                        setRegisterData(prev => ({ ...prev, acceptTerms: checked }))
                        if (checked) {
                          setIsTermsAnimated(true)
                          setTimeout(() => setIsTermsAnimated(false), 2000)
                        }
                      }}
                      className={cn(
                        "mt-1 transition-all duration-300 ease-in-out",
                        registerData.acceptTerms ? 'scale-110' : 'hover:scale-105'
                      )}
                      style={{ 
                        borderColor: registerData.acceptTerms ? BRAND_COLORS.secondary : BRAND_COLORS.primary 
                      }}
                    />
                    <label 
                      htmlFor="acceptTerms" 
                      className={cn(
                        "text-sm leading-relaxed cursor-pointer transition-all duration-300 ease-in-out",
                        registerData.acceptTerms ? 'font-medium' : '',
                        isTermsAnimated ? 'text-blue-700' : ''
                      )}
                    >
                      Aceito os{' '}
                      <a 
                        href="#" 
                        className={cn(
                          "underline transition-colors duration-300 hover:opacity-80",
                          isTermsAnimated ? 'text-blue-600 font-semibold' : ''
                        )}
                        style={{ color: BRAND_COLORS.primary }}
                      >
                        termos de uso
                      </a>{' '}
                      e{' '}
                      <a 
                        href="#" 
                        className={cn(
                          "underline transition-colors duration-300 hover:opacity-80",
                          isTermsAnimated ? 'text-blue-600 font-semibold' : ''
                        )}
                        style={{ color: BRAND_COLORS.primary }}
                      >
                        política de privacidade
                      </a>
                      {registerData.acceptTerms && (
                        <span className="ml-2 text-green-600 font-medium animate-fade-in">
                          ✓ Aceito
                        </span>
                      )}
                    </label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 text-white font-semibold transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-105"
                    style={{ backgroundColor: BRAND_COLORS.primary }}
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
        
        {/* Coluna da Direita - Robô Animado */}
        <div className="hidden lg:flex justify-center items-center h-screen">
          <div className="w-full h-full flex justify-center items-center">
            <div className="relative w-full h-full flex justify-center items-center robot-container">
              <img 
                src={robo} 
                alt="Robô Escrita360" 
                className="w-full h-full max-w-none object-contain hover:animate-pulse transition-all duration-500 ease-in-out hover:scale-105 cursor-pointer"
                style={{ 
                  filter: 'drop-shadow(0 15px 25px rgba(64, 112, 183, 0.4))',
                  minHeight: '600px',
                  minWidth: '400px'
                }}
              />
              {/* Efeito de brilho animado */}
              <div 
                className="absolute inset-0 rounded-full robot-glow pointer-events-none"
                style={{ 
                  background: `radial-gradient(circle, ${BRAND_COLORS.primary}30 0%, ${BRAND_COLORS.accent}20 50%, transparent 70%)`
                }}
              />
              {/* Círculos animados de fundo */}
              <div 
                className="absolute inset-0 rounded-full animate-ping opacity-10 pointer-events-none"
                style={{ 
                  background: `radial-gradient(circle, ${BRAND_COLORS.secondary}40 0%, transparent 60%)`,
                  animationDuration: '3s',
                  animationDelay: '0.5s'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default Login