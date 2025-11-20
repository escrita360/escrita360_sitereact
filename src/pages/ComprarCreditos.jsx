import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { 
  CreditCard, 
  Lock, 
  Calendar, 
  Shield, 
  CheckCircle2, 
  ArrowLeft, 
  AlertCircle, 
  Coins,
  Sparkles,
  Zap
} from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PagBankCheckout from '@/components/PagBankCheckout.jsx'
import { firebaseCreditService, firebaseAuthService, firebaseSubscriptionService } from '@/services/firebase.js'

// Pacotes de créditos disponíveis
const CREDIT_PACKAGES = [
  {
    id: 'pack_10',
    name: '10 Créditos',
    quantity: 10,
    price: 9.90,
    pricePerCredit: 0.99,
    badge: 'Básico',
    popular: false,
    icon: Coins,
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'pack_25',
    name: '25 Créditos',
    quantity: 25,
    price: 19.90,
    pricePerCredit: 0.80,
    badge: 'Mais Vendido',
    popular: true,
    icon: Sparkles,
    color: 'from-purple-500 to-purple-600',
    discount: 20
  },
  {
    id: 'pack_50',
    name: '50 Créditos',
    quantity: 50,
    price: 34.90,
    pricePerCredit: 0.70,
    badge: 'Melhor Valor',
    popular: false,
    icon: Zap,
    color: 'from-green-500 to-green-600',
    discount: 30
  }
]

function ComprarCreditos() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false)
  const [checkingSubscription, setCheckingSubscription] = useState(true)
  const [selectedPackage, setSelectedPackage] = useState(CREDIT_PACKAGES[1]) // Padrão: 25 créditos
  const [purchaseSuccess, setPurchaseSuccess] = useState(false)
  const [purchaseError, setPurchaseError] = useState('')
  const [transactionData, setTransactionData] = useState(null)
  const [currentCredits, setCurrentCredits] = useState(0)
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    // Verificar se usuário está logado E tem assinatura ativa
    const checkAuthAndSubscription = async () => {
      const currentUser = firebaseAuthService.getCurrentUser()
      
      if (!currentUser) {
        // Não está logado, redirecionar para login
        navigate('/login?redirect=/comprar-creditos')
        return
      }
      
      // Buscar dados completos do usuário
      const userData = localStorage.getItem('user')
      if (userData) {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        
        // VERIFICAR ASSINATURA ATIVA (OBRIGATÓRIO)
        try {
          const hasActive = await firebaseSubscriptionService.hasActiveSubscription(parsedUser.uid)
          setHasActiveSubscription(hasActive)
          
          if (hasActive) {
            // Buscar créditos atuais apenas se tiver assinatura
            const credits = await firebaseCreditService.getTotalCredits(parsedUser.uid)
            setCurrentCredits(credits.total)
          }
        } catch (error) {
          console.error('Erro ao verificar assinatura:', error)
          setHasActiveSubscription(false)
        } finally {
          setCheckingSubscription(false)
        }
      }
    }
    
    checkAuthAndSubscription()
  }, [navigate])

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, '')
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned
    return formatted.slice(0, 19)
  }

  const formatExpiryDate = (value) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4)
    }
    return cleaned
  }

  const handleInputChange = (field, value) => {
    let formattedValue = value
    if (field === 'cardNumber') formattedValue = formatCardNumber(value)
    else if (field === 'expiryDate') formattedValue = formatExpiryDate(value)
    else if (field === 'cvv') formattedValue = value.replace(/\D/g, '').slice(0, 4)
    else if (field === 'cardName') formattedValue = value.toUpperCase()
    
    setFormData(prev => ({ ...prev, [field]: formattedValue }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length < 13) {
      newErrors.cardNumber = 'Número do cartão é obrigatório'
    }
    if (!formData.cardName || formData.cardName.trim().length < 2) {
      newErrors.cardName = 'Nome no cartão é obrigatório'
    }
    if (!formData.expiryDate || !/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Data de validade é obrigatória (MM/AA)'
    }
    if (!formData.cvv || formData.cvv.length < 3) {
      newErrors.cvv = 'CVV é obrigatório'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePurchaseCredits = async (paymentData) => {
    try {
      console.log('💳 Processando compra de créditos...')
      
      // Registrar compra de créditos no Firebase
      const result = await firebaseCreditService.purchaseCredits(
        user.uid,
        {
          quantity: selectedPackage.quantity,
          amount: selectedPackage.price,
          paymentData: {
            email: user.email,
            transactionId: paymentData?.transaction_id,
            paymentMethod: 'card'
          }
        }
      )
      
      console.log('✅ Créditos comprados com sucesso!', result)
      
      // Atualizar créditos na tela
      setCurrentCredits(result.novoTotal)
      
      // Mostrar sucesso
      setPurchaseSuccess(true)
      setTransactionData({
        ...paymentData,
        quantity: selectedPackage.quantity,
        newTotal: result.novoTotal
      })
      
    } catch (error) {
      console.error('❌ Erro ao processar compra de créditos:', error)
      throw error
    }
  }

  const handleGoBack = () => navigate('/')

  if (!user || checkingSubscription) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"></div>
          <p className="text-slate-600">
            {!user ? 'Verificando autenticação...' : 'Verificando assinatura...'}
          </p>
        </div>
      </div>
    )
  }

  // Bloquear acesso se não tiver assinatura ativa
  if (!hasActiveSubscription) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 max-w-4xl py-20">
          <Card className="shadow-xl border-red-200">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-12 h-12 text-red-600" />
              </div>
              <div>
                <CardTitle className="text-3xl text-red-900">Assinatura Necessária</CardTitle>
                <CardDescription className="text-lg text-red-700 mt-3">
                  Você precisa ter uma assinatura ativa para comprar créditos adicionais
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                <h3 className="font-semibold text-red-900 mb-3 text-lg">🔒 Por que preciso de assinatura?</h3>
                <p className="text-red-800 mb-4">
                  O aplicativo Escrita360 <strong>só libera o acesso para usuários com assinatura ativa</strong>. 
                  Os créditos adicionais são complementares à sua assinatura.
                </p>
                <p className="text-red-700 text-sm">
                  Sem uma assinatura válida, não será possível usar os créditos comprados no aplicativo.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg border">
                <h3 className="font-semibold text-slate-900 mb-4 text-lg">✨ Como funciona</h3>
                <div className="space-y-3 text-slate-700">
                  <div className="flex gap-3">
                    <span className="font-bold text-brand-primary">1.</span>
                    <p>Adquira uma assinatura (Básico, Intermediário ou Avançado)</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="font-bold text-brand-primary">2.</span>
                    <p>Receba <strong>10 tokens mensais</strong> inclusos na assinatura</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="font-bold text-brand-primary">3.</span>
                    <p>Compre créditos adicionais quando precisar de mais tokens</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="font-bold text-brand-primary">4.</span>
                    <p>Use no site e no app Flutter automaticamente</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-900">
                  💡 <strong>Dica:</strong> Com uma assinatura ativa, você pode comprar quantos créditos precisar 
                  e eles serão sincronizados automaticamente com o aplicativo!
                </p>
              </div>
            </CardContent>
            <div className="p-6 flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-brand-primary hover:bg-brand-secondary"
                onClick={() => navigate('/precos')}
              >
                Ver Planos de Assinatura
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate('/')}
              >
                Voltar para Início
              </Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  if (purchaseSuccess) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 max-w-4xl py-20">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-16 h-16 text-green-600" />
              </div>
            </div>
            <div className="space-y-3">
              <h2 className="text-5xl font-bold">Compra Confirmada!</h2>
              <p className="text-xl text-slate-600">Seus créditos foram adicionados com sucesso</p>
            </div>
            <Card className="max-w-2xl mx-auto shadow-xl">
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-slate-600">Créditos Adquiridos</p>
                  <p className="text-4xl font-bold text-brand-primary">{transactionData?.quantity}</p>
                </div>
                <Separator />
                <div className="space-y-3 text-left">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Valor Pago</span>
                    <span className="font-medium text-lg">R$ {selectedPackage.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Créditos Anteriores</span>
                    <span className="font-medium">{currentCredits - transactionData?.quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Novos Créditos</span>
                    <span className="font-medium text-green-600">+{transactionData?.quantity}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold">Total de Créditos</span>
                    <span className="font-bold text-brand-primary">{transactionData?.newTotal}</span>
                  </div>
                </div>
                <Separator />
                <div className="bg-blue-50 p-5 rounded-lg text-left">
                  <p className="text-base font-medium text-blue-900 mb-2">📱 Sincronizado com o App</p>
                  <p className="text-sm text-blue-700">
                    Seus créditos já estão disponíveis no aplicativo Escrita360!
                  </p>
                  <p className="text-sm text-blue-600 mt-2">
                    Abra o app Flutter e veja seus novos créditos.
                  </p>
                </div>
              </CardContent>
            </Card>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button size="lg" className="bg-brand-primary hover:bg-brand-secondary" onClick={() => navigate('/')}>
                Voltar ao Início
              </Button>
              <Button size="lg" variant="outline" onClick={() => setPurchaseSuccess(false)}>
                Comprar Mais Créditos
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="py-4 flex items-center justify-between">
            <Button variant="ghost" onClick={handleGoBack} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-slate-600">Créditos Disponíveis</p>
                <p className="text-xl font-bold text-brand-primary">{currentCredits}</p>
              </div>
              <Shield className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl py-12">
        {/* Header da Página */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-3">
            <Coins className="w-8 h-8 text-brand-primary" />
            Comprar Créditos
          </h1>
          <p className="text-lg text-slate-600">
            Escolha um pacote e adicione créditos à sua conta
          </p>
        </div>

        {purchaseError && (
          <div className="mb-6 max-w-4xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-900">Erro no Pagamento</p>
                <p className="text-sm text-red-700 mt-1">{purchaseError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Seleção de Pacotes */}
        <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto">
          {CREDIT_PACKAGES.map((pkg) => {
            const Icon = pkg.icon
            const isSelected = selectedPackage.id === pkg.id
            
            return (
              <Card 
                key={pkg.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-xl ${
                  isSelected ? 'ring-2 ring-brand-primary shadow-xl scale-105' : ''
                } ${pkg.popular ? 'border-purple-500 border-2' : ''}`}
                onClick={() => setSelectedPackage(pkg)}
              >
                {pkg.popular && (
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white text-center py-2 font-semibold">
                    ⭐ Mais Vendido
                  </div>
                )}
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${pkg.color} flex items-center justify-center`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                  <CardDescription className="text-lg font-semibold text-brand-primary mt-2">
                    R$ {pkg.price.toFixed(2)}
                  </CardDescription>
                  {pkg.discount && (
                    <Badge className="mt-2 bg-green-100 text-green-800">
                      {pkg.discount}% OFF
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="text-center space-y-3">
                  <div className="space-y-2">
                    <p className="text-3xl font-bold">{pkg.quantity}</p>
                    <p className="text-sm text-slate-600">créditos</p>
                  </div>
                  <Separator />
                  <p className="text-xs text-slate-500">
                    R$ {pkg.pricePerCredit.toFixed(2)} por crédito
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Formulário de Pagamento */}
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-brand-primary" />
                Pagamento
              </CardTitle>
              <CardDescription>
                Preencha os dados do cartão para finalizar a compra
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Resumo */}
              <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span>Pacote Selecionado:</span>
                  <span className="font-semibold">{selectedPackage.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Quantidade:</span>
                  <span className="font-semibold">{selectedPackage.quantity} créditos</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg">
                  <span className="font-bold">Total:</span>
                  <span className="font-bold text-brand-primary">R$ {selectedPackage.price.toFixed(2)}</span>
                </div>
              </div>

              {/* Dados do Cartão */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber">Número do Cartão</Label>
                  <div className="relative">
                    <Input 
                      id="cardNumber" 
                      placeholder="0000 0000 0000 0000" 
                      maxLength={19}
                      value={formData.cardNumber} 
                      onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                      className={`pl-10 ${errors.cardNumber ? 'border-red-500' : ''}`} 
                    />
                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  </div>
                  {errors.cardNumber && <p className="text-xs text-red-500 mt-1">{errors.cardNumber}</p>}
                </div>

                <div>
                  <Label htmlFor="cardName">Nome no Cartão</Label>
                  <Input 
                    id="cardName" 
                    placeholder="NOME COMO ESTÁ NO CARTÃO" 
                    value={formData.cardName} 
                    onChange={(e) => handleInputChange('cardName', e.target.value)}
                    className={errors.cardName ? 'border-red-500' : ''} 
                  />
                  {errors.cardName && <p className="text-xs text-red-500 mt-1">{errors.cardName}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiryDate">Validade</Label>
                    <div className="relative">
                      <Input 
                        id="expiryDate" 
                        placeholder="MM/AA" 
                        maxLength={5}
                        value={formData.expiryDate} 
                        onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                        className={`pl-10 ${errors.expiryDate ? 'border-red-500' : ''}`} 
                      />
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    </div>
                    {errors.expiryDate && <p className="text-xs text-red-500 mt-1">{errors.expiryDate}</p>}
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <div className="relative">
                      <Input 
                        id="cvv" 
                        type="password" 
                        placeholder="000" 
                        maxLength={4}
                        value={formData.cvv} 
                        onChange={(e) => handleInputChange('cvv', e.target.value)}
                        className={`pl-10 ${errors.cvv ? 'border-red-500' : ''}`} 
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    </div>
                    {errors.cvv && <p className="text-xs text-red-500 mt-1">{errors.cvv}</p>}
                  </div>
                </div>
              </div>

              {/* Botão de Pagamento */}
              <PagBankCheckout
                planData={{
                  planId: selectedPackage.id,
                  name: selectedPackage.name,
                  price: selectedPackage.price
                }}
                customerData={{
                  name: user.nome || user.email.split('@')[0],
                  email: user.email,
                  cpf: user.cpf || '',
                  phone: user.telefone || ''
                }}
                cardData={{
                  number: formData.cardNumber.replace(/\s/g, ''),
                  expiryMonth: formData.expiryDate.split('/')[0],
                  expiryYear: '20' + formData.expiryDate.split('/')[1],
                  cvv: formData.cvv,
                  holderName: formData.cardName
                }}
                isYearly={false}
                onSuccess={async (data) => {
                  try {
                    await handlePurchaseCredits(data)
                  } catch (error) {
                    setPurchaseError(error.message || 'Erro ao processar compra')
                  }
                }}
                onError={(error) => {
                  setPurchaseError(error)
                }}
                validateBeforeSubmit={validateForm}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ComprarCreditos
