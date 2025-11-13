import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Card, CardContent } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { CreditCard, Lock, Calendar, User, Shield, CheckCircle2, ArrowLeft, AlertCircle } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import PagBankCheckout from '@/components/PagBankCheckout.jsx'

function Pagamento() {
  const navigate = useNavigate()
  const location = useLocation()
  const { selectedPlan, isYearly } = location.state || {}
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
    paymentMethod: 'recurring' // 'recurring', 'card', 'pix', 'boleto'
  })
  const [errors, setErrors] = useState({})
  
  useEffect(() => {
    if (!selectedPlan) {
      navigate('/precos')
    }
  }, [selectedPlan, navigate])

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
                <CardContent className="p-8">
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
                      <h3 className="text-lg font-semibold">Dados do Cartão (Opcional)</h3>
                      <p className="text-sm text-slate-600">Preencha apenas se quiser pagar com cartão de crédito</p>
                      
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
                              <Input id="expiryDate" placeholder="MM/AA" maxLength={5}
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
                          price: price
                        }}
                        customerData={{
                          name: formData.cardName || formData.email.split('@')[0],
                          email: formData.email,
                          cpf: formData.cpf,
                          phone: formData.phone
                        }}
                        cardData={formData.cardNumber ? {
                          number: formData.cardNumber.replace(/\s/g, ''),
                          expiryMonth: formData.expiryDate.split('/')[0],
                          expiryYear: '20' + formData.expiryDate.split('/')[1],
                          cvv: formData.cvv,
                          holderName: formData.cardName
                        } : null}
                        onSuccess={(data) => {
                          setPaymentSuccess(true)
                          setTransactionData(data)
                        }}
                        onError={(error) => {
                          setPaymentError(error)
                        }}
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
                      {selectedPlan.features.slice(0, 5).map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-600">{feature.text}</span>
                        </li>
                      ))}
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
              <p className="text-xl text-slate-600">Sua assinatura foi ativada com sucesso</p>
            </div>
            <Card className="max-w-2xl mx-auto shadow-xl">
              <CardContent className="p-8 space-y-6">
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
              <Button size="lg" variant="outline" onClick={handleGoBack}>
                Voltar para Planos
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Pagamento
