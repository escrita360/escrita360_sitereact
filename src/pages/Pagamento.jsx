import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Card, CardContent } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { CreditCard, Lock, Calendar, User, Building2, Shield, CheckCircle2 } from 'lucide-react'
import React, { useState } from 'react'

export function PagamentoDialog({ isOpen, onClose, selectedPlan, isYearly }) {
  const [step, setStep] = useState(1) // 1: Dados do Cartão, 2: Confirmação
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    cpf: '',
    email: '',
    phone: ''
  })

  const [errors, setErrors] = useState({})

  // Função para formatar número do cartão
  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, '')
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned
    return formatted.slice(0, 19) // 16 dígitos + 3 espaços
  }

  // Função para formatar data de expiração
  const formatExpiryDate = (value) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4)
    }
    return cleaned
  }

  // Função para formatar CPF
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

  // Função para formatar telefone
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

    if (field === 'cardNumber') {
      formattedValue = formatCardNumber(value)
    } else if (field === 'expiryDate') {
      formattedValue = formatExpiryDate(value)
    } else if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4)
    } else if (field === 'cpf') {
      formattedValue = formatCPF(value)
    } else if (field === 'phone') {
      formattedValue = formatPhone(value)
    } else if (field === 'cardName') {
      formattedValue = value.toUpperCase()
    }

    setFormData(prev => ({ ...prev, [field]: formattedValue }))
    
    // Limpa o erro quando o usuário começa a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Validação do número do cartão
    const cardNumberClean = formData.cardNumber.replace(/\s/g, '')
    if (!cardNumberClean) {
      newErrors.cardNumber = 'Número do cartão é obrigatório'
    } else if (cardNumberClean.length < 16) {
      newErrors.cardNumber = 'Número do cartão inválido'
    }

    // Validação do nome
    if (!formData.cardName.trim()) {
      newErrors.cardName = 'Nome no cartão é obrigatório'
    } else if (formData.cardName.trim().split(' ').length < 2) {
      newErrors.cardName = 'Digite o nome completo'
    }

    // Validação da data de expiração
    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Data de validade é obrigatória'
    } else {
      const [month, year] = formData.expiryDate.split('/')
      const currentYear = new Date().getFullYear() % 100
      const currentMonth = new Date().getMonth() + 1
      
      if (parseInt(month) < 1 || parseInt(month) > 12) {
        newErrors.expiryDate = 'Mês inválido'
      } else if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        newErrors.expiryDate = 'Cartão vencido'
      }
    }

    // Validação do CVV
    if (!formData.cvv) {
      newErrors.cvv = 'CVV é obrigatório'
    } else if (formData.cvv.length < 3) {
      newErrors.cvv = 'CVV inválido'
    }

    // Validação do CPF
    const cpfClean = formData.cpf.replace(/\D/g, '')
    if (!cpfClean) {
      newErrors.cpf = 'CPF é obrigatório'
    } else if (cpfClean.length !== 11) {
      newErrors.cpf = 'CPF inválido'
    }

    // Validação do e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email) {
      newErrors.email = 'E-mail é obrigatório'
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'E-mail inválido'
    }

    // Validação do telefone
    const phoneClean = formData.phone.replace(/\D/g, '')
    if (!phoneClean) {
      newErrors.phone = 'Telefone é obrigatório'
    } else if (phoneClean.length < 10) {
      newErrors.phone = 'Telefone inválido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsProcessing(true)

    // Simula processamento de pagamento
    setTimeout(() => {
      setIsProcessing(false)
      setPaymentSuccess(true)
    }, 2000)
  }

  const handleClose = () => {
    setStep(1)
    setPaymentSuccess(false)
    setFormData({
      cardNumber: '',
      cardName: '',
      expiryDate: '',
      cvv: '',
      cpf: '',
      email: '',
      phone: ''
    })
    setErrors({})
    onClose()
  }

  if (!selectedPlan) return null

  const price = isYearly ? selectedPlan.yearlyPrice : selectedPlan.monthlyPrice
  const total = price
  const installments = isYearly ? 12 : 1
  const installmentValue = isYearly ? (price / installments).toFixed(2) : price

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {!paymentSuccess ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-brand-primary" />
                Finalizar Assinatura
              </DialogTitle>
              <DialogDescription>
                Complete os dados para finalizar sua assinatura do plano {selectedPlan.name}
              </DialogDescription>
            </DialogHeader>

            <div className="grid md:grid-cols-5 gap-6 mt-4">
              {/* Coluna Esquerda - Formulário */}
              <div className="md:col-span-3 space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Dados Pessoais */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <User className="w-5 h-5 text-brand-primary" />
                      Dados Pessoais
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <Label htmlFor="email">E-mail *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="seu@email.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className={errors.email ? 'border-red-500' : ''}
                        />
                        {errors.email && (
                          <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="cpf">CPF *</Label>
                        <Input
                          id="cpf"
                          placeholder="000.000.000-00"
                          value={formData.cpf}
                          onChange={(e) => handleInputChange('cpf', e.target.value)}
                          className={errors.cpf ? 'border-red-500' : ''}
                        />
                        {errors.cpf && (
                          <p className="text-xs text-red-500 mt-1">{errors.cpf}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="phone">Telefone *</Label>
                        <Input
                          id="phone"
                          placeholder="(00) 00000-0000"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className={errors.phone ? 'border-red-500' : ''}
                        />
                        {errors.phone && (
                          <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Dados do Cartão */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-brand-primary" />
                      Dados do Cartão
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="cardNumber">Número do Cartão *</Label>
                        <div className="relative">
                          <Input
                            id="cardNumber"
                            placeholder="0000 0000 0000 0000"
                            value={formData.cardNumber}
                            onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                            className={`pl-10 ${errors.cardNumber ? 'border-red-500' : ''}`}
                            maxLength={19}
                          />
                          <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        </div>
                        {errors.cardNumber && (
                          <p className="text-xs text-red-500 mt-1">{errors.cardNumber}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="cardName">Nome no Cartão *</Label>
                        <Input
                          id="cardName"
                          placeholder="NOME COMO ESTÁ NO CARTÃO"
                          value={formData.cardName}
                          onChange={(e) => handleInputChange('cardName', e.target.value)}
                          className={errors.cardName ? 'border-red-500' : ''}
                        />
                        {errors.cardName && (
                          <p className="text-xs text-red-500 mt-1">{errors.cardName}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiryDate">Validade *</Label>
                          <div className="relative">
                            <Input
                              id="expiryDate"
                              placeholder="MM/AA"
                              value={formData.expiryDate}
                              onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                              className={`pl-10 ${errors.expiryDate ? 'border-red-500' : ''}`}
                              maxLength={5}
                            />
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                          </div>
                          {errors.expiryDate && (
                            <p className="text-xs text-red-500 mt-1">{errors.expiryDate}</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="cvv">CVV *</Label>
                          <div className="relative">
                            <Input
                              id="cvv"
                              type="password"
                              placeholder="000"
                              value={formData.cvv}
                              onChange={(e) => handleInputChange('cvv', e.target.value)}
                              className={`pl-10 ${errors.cvv ? 'border-red-500' : ''}`}
                              maxLength={4}
                            />
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                          </div>
                          {errors.cvv && (
                            <p className="text-xs text-red-500 mt-1">{errors.cvv}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Segurança */}
                  <div className="bg-slate-50 p-4 rounded-lg flex items-start gap-3">
                    <Shield className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        Pagamento 100% Seguro
                      </p>
                      <p className="text-xs text-slate-600 mt-1">
                        Seus dados são criptografados e protegidos. Não armazenamos informações do cartão.
                      </p>
                    </div>
                  </div>

                  {/* Botão de Submissão */}
                  <Button
                    type="submit"
                    className="w-full bg-brand-primary hover:bg-brand-secondary text-white h-12 text-base font-semibold"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                        Processando...
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5 mr-2" />
                        Confirmar Pagamento
                      </>
                    )}
                  </Button>
                </form>
              </div>

              {/* Coluna Direita - Resumo */}
              <div className="md:col-span-2">
                <Card className="sticky top-4">
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Resumo do Pedido</h3>
                      <Separator className="mb-4" />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-slate-900">Plano {selectedPlan.name}</p>
                          <p className="text-sm text-slate-600">
                            {isYearly ? 'Cobrança Anual' : 'Cobrança Mensal'}
                          </p>
                        </div>
                        <Badge className="bg-brand-primary text-white">
                          {selectedPlan.badge}
                        </Badge>
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
                            <span className="text-green-600 font-medium">
                              - R$ {((selectedPlan.monthlyPrice * 12 - price * 12) / 12).toFixed(2)}
                            </span>
                          </div>
                        )}
                      </div>

                      <Separator />

                      <div className="flex justify-between items-baseline">
                        <span className="text-lg font-bold">Total</span>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-brand-primary">
                            R$ {total.toFixed(2)}
                          </p>
                          <p className="text-xs text-slate-600">por mês</p>
                        </div>
                      </div>

                      {isYearly && (
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="text-sm text-green-800 font-medium">
                            {installments}x de R$ {installmentValue}
                          </p>
                          <p className="text-xs text-green-600 mt-1">
                            Parcelas sem juros
                          </p>
                        </div>
                      )}
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-slate-900">Incluso no plano:</p>
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
          </>
        ) : (
          // Tela de Sucesso
          <div className="py-8 text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-scale-in">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-slate-900">
                Pagamento Confirmado!
              </h2>
              <p className="text-lg text-slate-600">
                Sua assinatura foi ativada com sucesso
              </p>
            </div>

            <Card className="max-w-md mx-auto">
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-slate-600">Plano Ativado</p>
                  <p className="text-xl font-bold text-brand-primary">
                    {selectedPlan.name}
                  </p>
                </div>

                <Separator />

                <div className="space-y-2 text-left">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Valor</span>
                    <span className="font-medium">R$ {total.toFixed(2)}/mês</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Próxima cobrança</span>
                    <span className="font-medium">
                      {new Date(Date.now() + (isYearly ? 365 : 30) * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">E-mail</span>
                    <span className="font-medium">{formData.email}</span>
                  </div>
                </div>

                <Separator />

                <div className="bg-blue-50 p-4 rounded-lg text-left">
                  <p className="text-sm font-medium text-blue-900 mb-2">
                    📧 Confirmação Enviada
                  </p>
                  <p className="text-xs text-blue-700">
                    Enviamos todos os detalhes da sua assinatura para {formData.email}
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Button
                className="bg-brand-primary hover:bg-brand-secondary text-white"
                onClick={handleClose}
              >
                Ir para o Dashboard
              </Button>
              <Button
                variant="outline"
                onClick={handleClose}
              >
                Voltar para Planos
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default PagamentoDialog
