import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Card, CardContent } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { CreditCard, Lock, Calendar, User, Shield, CheckCircle2, ArrowLeft, AlertCircle, Eye, EyeOff } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import PagBankCheckout from '@/components/PagBankCheckout.jsx'
import { firebaseAuthService, firebaseSubscriptionService, firebasePaymentService } from '@/services/firebase.js'

function Pagamento() {
  const navigate = useNavigate()
  const location = useLocation()
  
  // Tentar obter do location.state primeiro, depois do sessionStorage
  const stateData = location.state || {
    selectedPlan: sessionStorage.getItem('selectedPlan') ? JSON.parse(sessionStorage.getItem('selectedPlan')) : null,
    audience: sessionStorage.getItem('selectedAudience')
  }
  const { selectedPlan, isYearly, audience } = stateData
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [paymentError, setPaymentError] = useState('')
  const [transactionData, setTransactionData] = useState(null)
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    cpf: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    paymentMethod: 'recurring' // 'recurring', 'card', 'pix', 'boleto'
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Aguardar um momento para o estado se estabilizar
    const timer = setTimeout(() => {
      if (!selectedPlan) {
        console.error('❌ Pagamento acessado sem plano selecionado')
        console.log('🔍 location:', location)
        console.log('🔍 location.state:', location.state)
        navigate('/precos', { replace: true })
      } else {
        setIsLoading(false)
      }
    }, 100)
    
    return () => clearTimeout(timer)
  }, [selectedPlan, navigate, location])

  // Limpar sessionStorage quando componente desmontar
  useEffect(() => {
    return () => {
      sessionStorage.removeItem('selectedPlan')
      sessionStorage.removeItem('selectedAudience')
    }
  }, [])

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Carregando...</div>
  }

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, '')
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned
    return formatted.slice(0, 19)
  }

  const formatExpiryDate = (value) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 6)
    }
    return cleaned
  }

  const formatCPF = (value) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length <= 11) {
      return cleaned
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    }
    return value
  }

  const formatPhone = (value) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length <= 11) {
      return cleaned
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
    }
    return value
  }

  const handleInputChange = (field, value) => {
    let formattedValue = value
    if (field === 'cardNumber') formattedValue = formatCardNumber(value)
    else if (field === 'expiryDate') formattedValue = formatExpiryDate(value)
    else if (field === 'cvv') formattedValue = value.replace(/\D/g, '').slice(0, 4)
    else if (field === 'cpf') formattedValue = formatCPF(value)
    else if (field === 'phone') formattedValue = formatPhone(value)
    else if (field === 'cardName') formattedValue = value.toUpperCase()
    
    setFormData(prev => ({ ...prev, [field]: formattedValue }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  // Validação de CPF usando algoritmo oficial (dígitos verificadores)
  const validateCPF = (cpf) => {
    const cleaned = cpf.replace(/\D/g, '')
    
    if (cleaned.length !== 11) return false
    
    // Verifica se todos os dígitos são iguais (ex: 111.111.111-11)
    if (/^(\d)\1{10}$/.test(cleaned)) return false
    
    // Validação do primeiro dígito verificador
    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleaned.charAt(i)) * (10 - i)
    }
    let remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== parseInt(cleaned.charAt(9))) return false
    
    // Validação do segundo dígito verificador
    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleaned.charAt(i)) * (11 - i)
    }
    remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== parseInt(cleaned.charAt(10))) return false
    
    return true
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email válido é obrigatório'
    }
    if (!formData.cpf || !validateCPF(formData.cpf)) {
      newErrors.cpf = 'CPF inválido. Verifique os dígitos.'
    }
    if (!formData.phone || formData.phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = 'Telefone válido é obrigatório'
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Senha deve ter no mínimo 6 caracteres'
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem'
    }
    if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length < 13) {
      newErrors.cardNumber = 'Número do cartão é obrigatório'
    }
    if (!formData.cardName || formData.cardName.trim().length < 2) {
      newErrors.cardName = 'Nome no cartão é obrigatório'
    }
    if (!formData.expiryDate || !/^\d{2}\/\d{4}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Data de validade é obrigatória (MM/AAAA)'
    }
    if (!formData.cvv || formData.cvv.length < 3) {
      newErrors.cvv = 'CVV é obrigatório'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const createUserAccount = async () => {
    try {
      console.log(`🔐 Iniciando criação de conta Firebase... (audience: ${audience || 'estudantes'})`)
      
      // Criar conta com email e senha no Firebase (projeto baseado no audience)
      const userData = await firebaseAuthService.register(
        formData.email,
        formData.password,
        {
          name: formData.cardName || formData.email.split('@')[0],
          cpf: formData.cpf,
          phone: formData.phone
        },
        audience || 'estudantes' // Passa o audience para selecionar o projeto Firebase correto
      )
      
      console.log(`✅ Conta Firebase criada com sucesso no projeto: ${userData.projectId}`, userData)
      return userData
    } catch (error) {
      console.error('❌ Erro ao criar conta Firebase:', error)
      throw new Error(error.message || 'Não foi possível criar sua conta. Por favor, tente novamente.')
    }
  }

  const createSubscriptionRecord = async (userId, paymentData) => {
    try {
      console.log(`📝 Criando registro de assinatura... (audience: ${audience || 'estudantes'})`)
      
      // Criar assinatura no Firestore (projeto baseado no audience)
      const subscriptionResult = await firebaseSubscriptionService.createSubscription(
        userId,
        {
          plan: selectedPlan,
          isYearly: isYearly,
          paymentData: {
            name: formData.cardName,
            email: formData.email,
            transactionId: paymentData?.transaction_id,
            ...paymentData
          }
        },
        audience || 'estudantes' // Passa o audience para selecionar o projeto Firebase correto
      )
      
      // Registrar pagamento
      await firebasePaymentService.recordPayment(userId, {
        email: formData.email,
        amount: total,
        status: 'paid',
        paymentMethod: 'card',
        transactionId: paymentData?.transaction_id,
        plan: selectedPlan.name,
        isYearly: isYearly
      }, audience || 'estudantes')
      
      console.log(`✅ Assinatura e pagamento registrados no projeto: ${subscriptionResult.projectId}`, subscriptionResult)
      return subscriptionResult
    } catch (error) {
      console.error('❌ Erro ao criar assinatura:', error)
      throw error
    }
  }

  const handleGoBack = () => navigate('/precos')

  if (!selectedPlan) return null
  
  const price = isYearly ? selectedPlan.yearlyPrice : selectedPlan.monthlyPrice
  const total = price
  const installments = isYearly ? 12 : 1
  const installmentValue = isYearly ? (price / installments).toFixed(2) : price
  
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="py-4 flex items-center justify-between">
            <Button variant="ghost" onClick={handleGoBack} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Voltar para Planos
            </Button>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium">Pagamento Seguro</span>
            </div>
          </div>
        </div>
      </div>

      {!paymentSuccess ? (
        <div className="container mx-auto px-4 max-w-7xl py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <CreditCard className="w-8 h-8 text-brand-primary" />
              Finalizar Assinatura
            </h1>
            <p className="text-lg text-slate-600">
              Complete os dados do plano <span className="font-semibold text-brand-primary">{selectedPlan.name}</span>
            </p>
          </div>

          {paymentError && (
            <div className="mb-6 max-w-4xl mx-auto">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-900">Erro no Pagamento</p>
                  <p className="text-sm text-red-700 mt-1">{paymentError}</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <User className="w-5 h-5 text-brand-primary" />
                        Dados Pessoais
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <Label htmlFor="email">E-mail *</Label>
                          <Input id="email" type="email" placeholder="seu@email.com" 
                            value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)}
                            className={errors.email ? 'border-red-500' : ''} />
                          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                          <p className="text-xs text-slate-500 mt-1">Use seu email pessoal para receber o acesso</p>
                        </div>
                        <div>
                          <Label htmlFor="cpf">CPF *</Label>
                          <Input id="cpf" placeholder="000.000.000-00" 
                            value={formData.cpf} onChange={(e) => handleInputChange('cpf', e.target.value)}
                            className={errors.cpf ? 'border-red-500' : ''} />
                          {errors.cpf && <p className="text-xs text-red-500 mt-1">{errors.cpf}</p>}
                        </div>
                        <div>
                          <Label htmlFor="phone">Telefone *</Label>
                          <Input id="phone" placeholder="(00) 00000-0000" 
                            value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)}
                            className={errors.phone ? 'border-red-500' : ''} />
                          {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <Label htmlFor="password">Senha *</Label>
                          <div className="relative">
                            <Input 
                              id="password" 
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Mínimo 6 caracteres"
                              value={formData.password} 
                              onChange={(e) => handleInputChange('password', e.target.value)}
                              className={errors.password ? 'border-red-500 pr-10' : 'pr-10'} 
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                          {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                        </div>
                        <div>
                          <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
                          <div className="relative">
                            <Input 
                              id="confirmPassword" 
                              type={showConfirmPassword ? 'text' : 'password'}
                              placeholder="Repita a senha"
                              value={formData.confirmPassword} 
                              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                              className={errors.confirmPassword ? 'border-red-500 pr-10' : 'pr-10'} 
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                          {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 mt-2">
                        Esta senha será usada para acessar sua conta no site
                      </p>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Dados do Cartão *</h3>
                      <p className="text-sm text-slate-600">Preencha os dados do cartão de crédito para o pagamento</p>
                      
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="cardNumber">Número do Cartão</Label>
                          <div className="relative">
                            <Input id="cardNumber" placeholder="0000 0000 0000 0000" maxLength={19}
                              value={formData.cardNumber} onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                              className={`pl-10 ${errors.cardNumber ? 'border-red-500' : ''}`} />
                            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                          </div>
                          {errors.cardNumber && <p className="text-xs text-red-500 mt-1">{errors.cardNumber}</p>}
                        </div>
                        <div>
                          <Label htmlFor="cardName">Nome no Cartão</Label>
                          <Input id="cardName" placeholder="NOME COMO ESTÁ NO CARTÃO" 
                            value={formData.cardName} onChange={(e) => handleInputChange('cardName', e.target.value)}
                            className={errors.cardName ? 'border-red-500' : ''} />
                          {errors.cardName && <p className="text-xs text-red-500 mt-1">{errors.cardName}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiryDate">Validade</Label>
                            <div className="relative">
                              <Input id="expiryDate" placeholder="MM/AAAA" maxLength={7}
                                value={formData.expiryDate} onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                                className={`pl-10 ${errors.expiryDate ? 'border-red-500' : ''}`} />
                              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                            </div>
                            {errors.expiryDate && <p className="text-xs text-red-500 mt-1">{errors.expiryDate}</p>}
                          </div>
                          <div>
                            <Label htmlFor="cvv">CVV</Label>
                            <div className="relative">
                              <Input id="cvv" type="password" placeholder="000" maxLength={4}
                                value={formData.cvv} onChange={(e) => handleInputChange('cvv', e.target.value)}
                                className={`pl-10 ${errors.cvv ? 'border-red-500' : ''}`} />
                              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                            </div>
                            {errors.cvv && <p className="text-xs text-red-500 mt-1">{errors.cvv}</p>}
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Método de Pagamento</h3>
                      
                      <PagBankCheckout
                        planData={{
                          planId: selectedPlan.name.toLowerCase(),
                          name: selectedPlan.name,
                          price: price,
                          audience: audience || 'estudantes' // Passa qual tipo de público
                        }}
                        customerData={{
                          name: formData.cardName || formData.email.split('@')[0],
                          email: formData.email,
                          cpf: formData.cpf,
                          phone: formData.phone,
                          password: formData.password // Inclui a senha para criar conta
                        }}
                        cardData={{
                          number: formData.cardNumber.replace(/\s/g, ''),
                          expiryMonth: formData.expiryDate.split('/')[0],
                          expiryYear: formData.expiryDate.split('/')[1], // Já vem como AAAA (ex: 2026)
                          cvv: formData.cvv,
                          holderName: formData.cardName
                        }}
                        isYearly={isYearly}
                        audience={audience || 'estudantes'}
                        onSuccess={async (data) => {
                          try {
                            console.log('💳 Pagamento aprovado! Iniciando criação de conta...')
                            
                            // 1. Criar conta do usuário no Firebase
                            const userResult = await createUserAccount()
                            console.log('✅ Conta criada - UID:', userResult.uid)
                            
                            // 2. Criar assinatura e registrar pagamento no Firestore
                            await createSubscriptionRecord(userResult.uid, data)
                            console.log('✅ Assinatura ativada!')
                            
                            // 3. Marcar como sucesso
                            setPaymentSuccess(true)
                            setTransactionData(data)
                            
                            console.log('🎉 Processo completo! Usuário pode fazer login no app Flutter com as mesmas credenciais.')
                          } catch (error) {
                            setPaymentError(error.message || 'Pagamento aprovado, mas houve um erro ao criar sua conta. Entre em contato com o suporte.')
                            console.error('❌ Erro ao processar sucesso do pagamento:', error)
                          }
                        }}
                        onError={(error) => {
                          setPaymentError(error)
                        }}
                        validateBeforeSubmit={validateForm}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card className="sticky top-24 shadow-lg">
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Resumo do Pedido</h3>
                    <Separator className="mb-4" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">Plano {selectedPlan.name}</p>
                        <p className="text-sm text-slate-600">{isYearly ? 'Cobrança Anual' : 'Cobrança Mensal'}</p>
                      </div>
                      <Badge className="bg-brand-primary text-white">{selectedPlan.badge}</Badge>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Subtotal</span>
                        <span className="font-medium">R$ {price.toFixed(2)}</span>
                      </div>
                      {isYearly && (
                        <div className="flex justify-between text-sm">
                          <span className="text-green-600 font-medium">Desconto (30%)</span>
                          <span className="text-green-600 font-medium">- R$ {((selectedPlan.monthlyPrice * 12 - price * 12) / 12).toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                    <Separator />
                    <div className="flex justify-between items-baseline">
                      <span className="text-lg font-bold">Total</span>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-brand-primary">R$ {total.toFixed(2)}</p>
                        <p className="text-xs text-slate-600">por mês</p>
                      </div>
                    </div>
                    {isYearly && (
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-sm text-green-800 font-medium">{installments}x de R$ {installmentValue}</p>
                        <p className="text-xs text-green-600 mt-1">Parcelas sem juros</p>
                      </div>
                    )}
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Incluso no plano:</p>
                    <ul className="space-y-2">
                      {(selectedPlan.features || []).slice(0, 5).map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-600">{feature.text}</span>
                        </li>
                      ))}
                      {(!selectedPlan.features || selectedPlan.features.length === 0) && (
                        <li className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-600">{selectedPlan.credits} correções detalhadas com IA</span>
                        </li>
                      )}
                    </ul>
                  </div>
                  <Separator />
                  <div className="space-y-2 text-xs text-slate-500">
                    <p>• Renovação automática</p>
                    <p>• Cancele quando quiser</p>
                    <p>• Suporte incluído</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 max-w-4xl py-20">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-16 h-16 text-green-600" />
              </div>
            </div>
            <div className="space-y-3">
              <h2 className="text-5xl font-bold">Pagamento Confirmado!</h2>
              <p className="text-xl text-slate-600">Sua assinatura foi ativada e sua conta criada com sucesso</p>
            </div>
            <Card className="max-w-2xl mx-auto shadow-xl">
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-slate-600">Plano Ativado</p>
                  <p className="text-2xl font-bold text-brand-primary">{selectedPlan.name}</p>
                </div>
                <Separator />
                <div className="space-y-3 text-left">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Valor</span>
                    <span className="font-medium text-lg">R$ {total.toFixed(2)}/mês</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Próxima cobrança</span>
                    <span className="font-medium">{new Date(Date.now() + (isYearly ? 365 : 30) * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">E-mail</span>
                    <span className="font-medium">{formData.email}</span>
                  </div>
                  {transactionData?.transaction_id && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">ID da Transação</span>
                      <span className="font-mono text-xs">{transactionData.transaction_id}</span>
                    </div>
                  )}
                </div>
                <Separator />
                <div className="bg-green-50 p-5 rounded-lg text-left">
                  <p className="text-base font-medium text-green-900 mb-3">✅ Sua Conta Foi Criada!</p>
                  <div className="space-y-2">
                    <p className="text-sm text-green-700">
                      <strong>E-mail:</strong> {formData.email}
                    </p>
                    <p className="text-sm text-green-700">
                      <strong>Senha:</strong> ••••••• (use a senha que você cadastrou)
                    </p>
                    <p className="text-sm text-green-700">
                      <strong>Plataforma:</strong> {audience === 'professores' ? 'Escrita360 Professor' : 'Escrita360 Aluno'}
                    </p>
                  </div>
                  <p className="text-sm text-green-600 mt-3">
                    {audience === 'professores' 
                      ? 'Faça login no app Escrita360 Professor com essas credenciais!' 
                      : 'Faça login no app Escrita360 Aluno com essas credenciais!'}
                  </p>
                </div>
                <Separator />
                <div className="bg-blue-50 p-5 rounded-lg text-left">
                  <p className="text-base font-medium text-blue-900 mb-2">📧 Confirmação Enviada</p>
                  <p className="text-sm text-blue-700">Enviamos todos os detalhes para {formData.email}</p>
                </div>
              </CardContent>
            </Card>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button size="lg" className="bg-brand-primary hover:bg-brand-secondary" onClick={() => navigate('/dashboard')}>
                Ir para o Dashboard
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/login')}>
                Fazer Login Agora
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Pagamento
