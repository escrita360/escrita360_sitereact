import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Card, CardContent } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { CreditCard, Lock, Calendar, User, Shield, CheckCircle2, ArrowLeft, AlertCircle, Eye, EyeOff, Coins } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import PagBankOneTimePayment from '@/components/PagBankOneTimePayment.jsx'

function PagamentoCreditos() {
  const navigate = useNavigate()
  const location = useLocation()
  const { selectedPackage, audience } = location.state || {}
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
    paymentMethod: 'card' // 'card', 'pix', 'boleto'
  })
  const [errors, setErrors] = useState({})
  
  useEffect(() => {
    if (!selectedPackage) {
      navigate('/planos')
    }
  }, [selectedPackage, navigate])

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

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email válido é obrigatório'
    }
    if (!formData.cpf || formData.cpf.replace(/\D/g, '').length !== 11) {
      newErrors.cpf = 'CPF válido é obrigatório'
    }
    if (!formData.phone || formData.phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = 'Telefone válido é obrigatório'
    }
    
    // Validações específicas para cartão
    if (formData.paymentMethod === 'card') {
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
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleGoBack = () => navigate('/planos', { state: { audience } })

  if (!selectedPackage) return null
  
  const price = selectedPackage.price
  const total = price
  
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
              <Coins className="w-8 h-8 text-brand-primary" />
              Comprar Pacote de Créditos
            </h1>
            <p className="text-lg text-slate-600">
              Complete os dados para adquirir o <span className="font-semibold text-brand-primary">{selectedPackage.name}</span>
            </p>
          </div>

          {/* Banner de ambiente de teste */}
          <div className="mb-6 max-w-4xl mx-auto">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">Ambiente de Teste - Use o cartão abaixo</p>
                <p className="text-sm text-blue-700 mt-1">
                  Cartão: <span className="font-mono font-semibold">5555 6666 7777 8884</span> | 
                  Validade: <span className="font-mono">12/26</span> | 
                  CVV: <span className="font-mono">123</span> | 
                  Nome: <span className="font-mono">TESTE PAGBANK</span>
                </p>
              </div>
            </div>
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
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Método de Pagamento</h3>
                      <div className="grid grid-cols-3 gap-3">
                        <Button
                          variant={formData.paymentMethod === 'card' ? 'default' : 'outline'}
                          onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'card' }))}
                          className="flex flex-col gap-2 h-auto py-4"
                        >
                          <CreditCard className="w-6 h-6" />
                          <span className="text-xs">Cartão</span>
                        </Button>
                        <Button
                          variant={formData.paymentMethod === 'pix' ? 'default' : 'outline'}
                          onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'pix' }))}
                          className="flex flex-col gap-2 h-auto py-4"
                        >
                          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                          </svg>
                          <span className="text-xs">PIX</span>
                        </Button>
                        <Button
                          variant={formData.paymentMethod === 'boleto' ? 'default' : 'outline'}
                          onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'boleto' }))}
                          className="flex flex-col gap-2 h-auto py-4"
                        >
                          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <rect x="3" y="4" width="18" height="16" rx="2"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                          </svg>
                          <span className="text-xs">Boleto</span>
                        </Button>
                      </div>
                    </div>

                    {formData.paymentMethod === 'card' && (
                      <>
                        <Separator />
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">Dados do Cartão *</h3>
                          
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
                      </>
                    )}

                    <Separator />

                    <div className="space-y-4">
                      <PagBankOneTimePayment
                        packageData={{
                          packageId: selectedPackage.name.toLowerCase().replace(/\s/g, '-'),
                          name: selectedPackage.name,
                          price: price,
                          credits: selectedPackage.credits
                        }}
                        customerData={{
                          name: formData.cardName || formData.email.split('@')[0],
                          email: formData.email,
                          cpf: formData.cpf,
                          phone: formData.phone
                        }}
                        cardData={formData.paymentMethod === 'card' ? {
                          number: formData.cardNumber.replace(/\s/g, ''),
                          expiryMonth: formData.expiryDate.split('/')[0],
                          expiryYear: '20' + formData.expiryDate.split('/')[1],
                          cvv: formData.cvv,
                          holderName: formData.cardName
                        } : null}
                        paymentMethod={formData.paymentMethod}
                        onSuccess={(data) => {
                          setPaymentSuccess(true)
                          setTransactionData(data)
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
                        <p className="font-medium">{selectedPackage.name}</p>
                        <p className="text-sm text-slate-600">Pacote de Créditos</p>
                      </div>
                      {selectedPackage.popular && (
                        <Badge className="bg-green-500 text-white">Melhor Custo-Benefício</Badge>
                      )}
                    </div>
                    <Separator />
                    <div className="bg-brand-light p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Créditos de IA</span>
                        <span className="text-2xl font-bold text-brand-primary">{selectedPackage.credits}</span>
                      </div>
                      <p className="text-xs text-slate-600">
                        Cada crédito = 1 análise completa por IA
                      </p>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Subtotal</span>
                        <span className="font-medium">
                          R$ {typeof price === 'number' ? price.toFixed(2) : price}
                        </span>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-baseline">
                      <span className="text-lg font-bold">Total</span>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-brand-primary">
                          R$ {typeof total === 'number' ? total.toFixed(2) : total}
                        </p>
                        <p className="text-xs text-slate-600">pagamento único</p>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Incluso no pacote:</p>
                    <ul className="space-y-2">
                      {selectedPackage.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Separator />
                  <div className="space-y-2 text-xs text-slate-500">
                    <p>• Créditos válidos por 30 dias</p>
                    <p>• Ativação imediata após pagamento</p>
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
              <p className="text-xl text-slate-600">Seus créditos foram adicionados à sua conta</p>
            </div>
            <Card className="max-w-2xl mx-auto shadow-xl">
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-slate-600">Pacote Adquirido</p>
                  <p className="text-2xl font-bold text-brand-primary">{selectedPackage.name}</p>
                </div>
                <Separator />
                <div className="bg-green-50 p-6 rounded-lg">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <Coins className="w-8 h-8 text-green-600" />
                    <span className="text-4xl font-bold text-green-900">{selectedPackage.credits}</span>
                  </div>
                  <p className="text-center text-green-700 font-medium">créditos adicionados</p>
                </div>
                <Separator />
                <div className="space-y-3 text-left">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Valor Pago</span>
                    <span className="font-medium text-lg">
                      R$ {typeof total === 'number' ? total.toFixed(2) : total}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Validade dos Créditos</span>
                    <span className="font-medium">{new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')}</span>
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
                <div className="bg-blue-50 p-5 rounded-lg text-left">
                  <p className="text-base font-medium text-blue-900 mb-2">📧 Confirmação Enviada</p>
                  <p className="text-sm text-blue-700">Enviamos o recibo e os detalhes da compra para {formData.email}</p>
                </div>
              </CardContent>
            </Card>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button size="lg" className="bg-brand-primary hover:bg-brand-secondary" onClick={() => navigate('/dashboard')}>
                Ir para o Dashboard
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/planos')}>
                Ver Mais Pacotes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PagamentoCreditos
