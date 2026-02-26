import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, ArrowLeft, CheckCircle, AlertCircle, Key } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { cn } from '@/lib/utils'
import api from '@/services/api'
import Escrita360Logo from '@/assets/Logo/Escrita360.png'

// Esquema de cores do site
const BRAND_COLORS = {
  primary: '#4070B7',
  secondary: '#61C2D3',
  accent: '#39A1DB',
  light: '#F5F9FC'
}

const ResetarSenha = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  // Estados
  const [step, setStep] = useState(token ? 'reset' : 'request') // 'request' | 'reset' | 'success'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [obscurePassword, setObscurePassword] = useState(true)
  const [obscureConfirmPassword, setObscureConfirmPassword] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [focusedField, setFocusedField] = useState('')
  const [tokenValid, setTokenValid] = useState(null)
  const [tokenEmail, setTokenEmail] = useState('')

  // Valida o token ao carregar se presente na URL
  const validateToken = useCallback(async () => {
    try {
      const response = await api.get('/auth/validate-reset-token', {
        params: { token }
      })
      setTokenValid(true)
      setTokenEmail(response.data.email)
    } catch (error) {
      console.error('Token inválido:', error)
      setTokenValid(false)
      setError('Este link é inválido ou expirou. Solicite um novo link de recuperação.')
    }
  }, [token])

  useEffect(() => {
    if (token) {
      validateToken()
    }
  }, [token, validateToken])

  const handleRequestReset = async (e) => {
    e.preventDefault()

    if (!email) {
      setError('Por favor, informe seu email')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      await api.post('/auth/forgot-password', { email: email.trim() })
      setSuccessMessage('Se o email estiver cadastrado, você receberá um link de recuperação em breve.')
      setStep('success')
    } catch (error) {
      console.error('Erro ao solicitar recuperação:', error)
      // Mesmo em caso de erro, mostramos mensagem genérica por segurança
      setSuccessMessage('Se o email estiver cadastrado, você receberá um link de recuperação em breve.')
      setStep('success')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()

    if (!password || !confirmPassword) {
      setError('Por favor, preencha todos os campos')
      return
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      return
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      await api.post('/auth/reset-password', {
        token,
        newPassword: password
      })
      setSuccessMessage('Sua senha foi alterada com sucesso!')
      setStep('success')
    } catch (error) {
      console.error('Erro ao resetar senha:', error)
      setError(error.response?.data?.error || 'Erro ao alterar senha. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const renderRequestForm = () => (
    <form onSubmit={handleRequestReset} className="space-y-4">
      <p className="text-slate-600 text-sm mb-6">
        Informe seu email cadastrado e enviaremos um link para você criar uma nova senha.
      </p>

      <div className={cn(
        "relative transition-all duration-300 ease-in-out rounded-lg p-3",
        focusedField === 'email' ? 'bg-blue-50 border border-blue-200 shadow-sm' : ''
      )}>
        <Mail className="absolute left-6 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: BRAND_COLORS.primary }} />
        <Input
          type="email"
          placeholder="Seu email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError('') }}
          onFocus={() => setFocusedField('email')}
          onBlur={() => setFocusedField('')}
          className={cn(
            "pl-10 h-12 border-2 transition-all duration-300 ease-in-out",
            focusedField === 'email' ? 'border-blue-300 shadow-md' : ''
          )}
          style={{
            borderColor: focusedField === 'email' ? BRAND_COLORS.accent : BRAND_COLORS.primary + '40',
            boxShadow: focusedField === 'email' ? `0 0 0 3px ${BRAND_COLORS.accent}20` : ''
          }}
          autoComplete="email"
        />
      </div>

      <Button
        type="submit"
        className="w-full h-12 text-white font-semibold transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-105"
        style={{ backgroundColor: BRAND_COLORS.primary }}
        disabled={isLoading}
      >
        {isLoading ? 'Enviando...' : 'Enviar link de recuperação'}
      </Button>
    </form>
  )

  const renderResetForm = () => {
    if (tokenValid === false) {
      return (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-slate-600">{error}</p>
          <Button
            onClick={() => { setStep('request'); setError(''); setTokenValid(null) }}
            className="text-white font-semibold"
            style={{ backgroundColor: BRAND_COLORS.primary }}
          >
            Solicitar novo link
          </Button>
        </div>
      )
    }

    if (tokenValid === null) {
      return (
        <div className="text-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-slate-600 mt-4">Validando link...</p>
        </div>
      )
    }

    return (
      <form onSubmit={handleResetPassword} className="space-y-4">
        <p className="text-slate-600 text-sm mb-6">
          Crie uma nova senha para sua conta: <strong>{tokenEmail}</strong>
        </p>

        <div className={cn(
          "relative transition-all duration-300 ease-in-out rounded-lg p-3",
          focusedField === 'password' ? 'bg-blue-50 border border-blue-200 shadow-sm' : ''
        )}>
          <Lock className="absolute left-6 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: BRAND_COLORS.primary }} />
          <Input
            type={obscurePassword ? "password" : "text"}
            placeholder="Nova senha"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError('') }}
            onFocus={() => setFocusedField('password')}
            onBlur={() => setFocusedField('')}
            className={cn(
              "pl-10 pr-10 h-12 border-2 transition-all duration-300 ease-in-out",
              focusedField === 'password' ? 'border-blue-300 shadow-md' : ''
            )}
            style={{
              borderColor: focusedField === 'password' ? BRAND_COLORS.accent : BRAND_COLORS.primary + '40',
              boxShadow: focusedField === 'password' ? `0 0 0 3px ${BRAND_COLORS.accent}20` : ''
            }}
            autoComplete="new-password"
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

        <div className={cn(
          "relative transition-all duration-300 ease-in-out rounded-lg p-3",
          focusedField === 'confirmPassword' ? 'bg-blue-50 border border-blue-200 shadow-sm' : ''
        )}>
          <Lock className="absolute left-6 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: BRAND_COLORS.primary }} />
          <Input
            type={obscureConfirmPassword ? "password" : "text"}
            placeholder="Confirmar nova senha"
            value={confirmPassword}
            onChange={(e) => { setConfirmPassword(e.target.value); setError('') }}
            onFocus={() => setFocusedField('confirmPassword')}
            onBlur={() => setFocusedField('')}
            className={cn(
              "pl-10 pr-10 h-12 border-2 transition-all duration-300 ease-in-out",
              focusedField === 'confirmPassword' ? 'border-blue-300 shadow-md' : ''
            )}
            style={{
              borderColor: focusedField === 'confirmPassword' ? BRAND_COLORS.accent : BRAND_COLORS.primary + '40',
              boxShadow: focusedField === 'confirmPassword' ? `0 0 0 3px ${BRAND_COLORS.accent}20` : ''
            }}
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setObscureConfirmPassword(!obscureConfirmPassword)}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 transition-colors duration-200 hover:opacity-75"
            style={{ color: BRAND_COLORS.primary }}
          >
            {obscureConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <Button
          type="submit"
          className="w-full h-12 text-white font-semibold transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-105"
          style={{ backgroundColor: BRAND_COLORS.primary }}
          disabled={isLoading}
        >
          {isLoading ? 'Alterando senha...' : 'Alterar senha'}
        </Button>
      </form>
    )
  }

  const renderSuccess = () => (
    <div className="text-center space-y-4">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="w-8 h-8 text-green-500" />
      </div>
      <p className="text-slate-600">{successMessage}</p>
      {step === 'success' && token && (
        <Button
          onClick={() => navigate('/login')}
          className="text-white font-semibold"
          style={{ backgroundColor: BRAND_COLORS.primary }}
        >
          Ir para o login
        </Button>
      )}
    </div>
  )

  const getTitle = () => {
    if (step === 'success') return token ? 'Senha Alterada!' : 'Email Enviado!'
    if (step === 'reset') return 'Nova Senha'
    return 'Recuperar Senha'
  }

  const getIcon = () => {
    if (step === 'success') return <CheckCircle className="w-6 h-6" />
    return <Key className="w-6 h-6" />
  }

  return (
    <div style={{ backgroundColor: BRAND_COLORS.light }} className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0 overflow-hidden">
          <CardHeader className="text-center space-y-4 pb-4 bg-white">
            <div className="flex justify-center mb-2">
              <img
                src={Escrita360Logo}
                alt="Escrita 360"
                className="h-10 object-contain"
              />
            </div>
            <div className="flex items-center justify-center gap-2" style={{ color: BRAND_COLORS.primary }}>
              {getIcon()}
              <CardTitle className="text-xl font-bold">{getTitle()}</CardTitle>
            </div>
            <CardDescription className="text-slate-600">
              {step === 'request' && 'Esqueceu sua senha? Não se preocupe!'}
              {step === 'reset' && 'Crie uma nova senha segura'}
              {step === 'success' && ''}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6">
            {error && step !== 'success' && tokenValid !== false && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {step === 'request' && renderRequestForm()}
            {step === 'reset' && renderResetForm()}
            {step === 'success' && renderSuccess()}

            {step !== 'success' && (
              <div className="mt-6 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm transition-colors hover:opacity-75"
                  style={{ color: BRAND_COLORS.primary }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar para o login
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ResetarSenha
