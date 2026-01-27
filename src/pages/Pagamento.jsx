import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Card, CardContent } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { CreditCard, Lock, Calendar, User, Shield, CheckCircle2, ArrowLeft, AlertCircle, Eye, EyeOff, QrCode, DollarSign, Plus, Copy, Clock, FileText, RefreshCw } from 'lucide-react'
import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { firebasePaymentService } from '@/services/firebase'
import { paymentService } from '@/services/payment'

function Pagamento() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  
  // Tentar obter do location.state primeiro, depois do sessionStorage
  const stateData = location.state || {
    selectedPlan: sessionStorage.getItem('selectedPlan') ? JSON.parse(sessionStorage.getItem('selectedPlan')) : null,
    audience: sessionStorage.getItem('selectedAudience')
  }
  const { selectedPlan, isYearly, audience } = stateData
  // eslint-disable-next-line no-unused-vars
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  // eslint-disable-next-line no-unused-vars
  const [paymentError, setPaymentError] = useState('')
  // eslint-disable-next-line no-unused-vars
  const [transactionData, setTransactionData] = useState(null)
  // Estado para aguardar pagamento PIX/Boleto
  const [awaitingPayment, setAwaitingPayment] = useState(false)
  const [pixData, setPixData] = useState(null)
  const [boletoData, setBoletoData] = useState(null)
  const [copiedToClipboard, setCopiedToClipboard] = useState(false)
  const [checkingPayment, setCheckingPayment] = useState(false)
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
    fullName: '', // Nome completo para PIX/Boleto
    paymentMethod: 'card' // 'card', 'pix', 'pay_later'
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [isLoading, setIsLoading] = useState(true)
  const [savedPaymentMethods, setSavedPaymentMethods] = useState([])
  const [selectedSavedCard, setSelectedSavedCard] = useState(null)
  const [installmentOptions, setInstallmentOptions] = useState([])
  const [selectedInstallments, setSelectedInstallments] = useState(1)

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

  // Carregar opções de parcelamento quando o plano estiver disponível
  useEffect(() => {
    if (selectedPlan) {
      loadInstallmentOptions()
    }
  }, [selectedPlan, isYearly])

  // Limpar sessionStorage quando componente desmontar
  useEffect(() => {
    return () => {
      sessionStorage.removeItem('selectedPlan')
      sessionStorage.removeItem('selectedAudience')
    }
  }, [])

  // Preencher dados automaticamente se usuário estiver logado
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.nome || prev.fullName,
        email: user.email || prev.email,
        cpf: user.cpf || prev.cpf,
        phone: user.telefone || prev.phone
      }))
      
      // Carregar métodos de pagamento salvos
      loadSavedPaymentMethods()
    }
  }, [user])

  const loadSavedPaymentMethods = async () => {
    if (!user) return
    
    try {
      const methods = await firebasePaymentService.getPaymentMethods(
        user.uid, 
        user.tipoPlano === 'professor' ? 'professores' : 'estudantes'
      )
      const activeMethods = methods.filter(method => !method.deleted)
      setSavedPaymentMethods(activeMethods)
      
      // Selecionar automaticamente o cartão padrão se existir
      const defaultCard = activeMethods.find(method => method.isDefault && method.type === 'card')
      if (defaultCard) {
        setSelectedSavedCard(defaultCard)
        handleSelectSavedCard(defaultCard)
      }
    } catch (error) {
      console.error('Erro ao carregar métodos de pagamento:', error)
    }
  }

  const loadInstallmentOptions = () => {
    if (!selectedPlan) return
    
    const price = isYearly ? selectedPlan.yearlyPrice : selectedPlan.monthlyPrice
    
    let maxInstallments = 1
    if (price <= 120) {
      maxInstallments = 1
    } else if (price <= 290) {
      maxInstallments = 2
    } else {
      maxInstallments = 3
    }
    
    const options = []
    for (let i = 1; i <= maxInstallments; i++) {
      options.push({
        quantity: i,
        amount: price / i,
        total: price,
        interest_free: true
      })
    }
    setInstallmentOptions(options)
  }

  const handleSelectSavedCard = (cardMethod) => {
    setSelectedSavedCard(cardMethod)
    setFormData(prev => ({
      ...prev,
      paymentMethod: 'card',
      cardNumber: `**** **** **** ${cardMethod.card.last4}`,
      cardName: cardMethod.card.holderName || '',
      expiryDate: `${cardMethod.card.expiryMonth}/${cardMethod.card.expiryYear}`,
      cvv: '' // CVV não é salvo por segurança
    }))
  }

  const handleUseNewCard = () => {
    setSelectedSavedCard(null)
    setFormData(prev => ({
      ...prev,
      cardNumber: '',
      cardName: '',
      expiryDate: '',
      cvv: ''
    }))
  }

  const handlePaymentSubmit = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    setPaymentError('')

    try {
      console.log('💳 Iniciando processamento de pagamento...')
      console.log('📋 Método selecionado:', formData.paymentMethod)

      // Preparar dados do cliente
      const customerData = {
        name: user ? (user.nome || formData.fullName) : formData.fullName,
        email: user ? user.email : formData.email,
        cpf: (user ? (user.cpf || formData.cpf) : formData.cpf).replace(/\D/g, ''),
        phone: (user ? (user.telefone || formData.phone) : formData.phone).replace(/\D/g, ''),
        ...(user ? {} : { password: formData.password })
      }

      console.log('👤 Dados do cliente preparados:', {
        ...customerData,
        cpf: customerData.cpf ? '***' + customerData.cpf.slice(-3) : 'VAZIO'
      })

      // Preparar dados do plano
      const planData = {
        ...selectedPlan,
        price: total,
        audience: audience
      }

      let result

      if (formData.paymentMethod === 'card') {
        // Pagamento com cartão de crédito
        console.log('💳 Processando pagamento com cartão...')

        const cardData = selectedSavedCard ? {
          number: selectedSavedCard.card.last4, // Para cartão salvo, usar apenas o último 4 dígitos
          expiryMonth: selectedSavedCard.card.expiryMonth,
          expiryYear: selectedSavedCard.card.expiryYear,
          cvv: formData.cvv,
          holderName: selectedSavedCard.card.holderName
        } : {
          number: formData.cardNumber.replace(/\s/g, ''),
          expiryMonth: parseInt(formData.expiryDate.split('/')[0]),
          expiryYear: parseInt(formData.expiryDate.split('/')[1]),
          cvv: formData.cvv,
          holderName: formData.cardName
        }

        const paymentData = {
          planData,
          customerData,
          cardData,
          installments: selectedInstallments
        }

        // Para pagamentos únicos com cartão, usar a rota de orders
        result = await paymentService.createPagBankCardOrder(paymentData)

      } else if (formData.paymentMethod === 'pix') {
        // Pagamento PIX
        console.log('📱 Gerando PIX...')

        const paymentData = {
          planData,
          customerData
        }

        result = await paymentService.createPagBankPixPayment(paymentData)

      } else if (formData.paymentMethod === 'pay_later') {
        // Boleto
        console.log('📄 Gerando boleto...')

        const paymentData = {
          planData,
          customerData
        }

        result = await paymentService.createPagBankBoletoPayment(paymentData)
      }

      console.log('✅ Pagamento processado com sucesso:', result)

      // Salvar dados da transação
      setTransactionData(result)

      // Para PIX e Boleto, mostrar dados de pagamento e aguardar confirmação
      if (formData.paymentMethod === 'pix') {
        console.log('📱 PIX gerado, aguardando pagamento...')
        // Extrair dados do QR Code da resposta
        const qrCodeData = result.qr_codes?.[0] || result.charges?.[0]?.payment_method?.qr_codes?.[0]
        if (qrCodeData) {
          setPixData({
            qrCode: qrCodeData.links?.find(l => l.media === 'image/png')?.href || qrCodeData.text,
            qrCodeText: qrCodeData.text,
            expirationDate: qrCodeData.expiration_date,
            orderId: result.id
          })
        } else {
          // Fallback: tentar extrair de outra estrutura
          setPixData({
            qrCodeText: result.pix_code || result.qr_code,
            orderId: result.id
          })
        }
        setAwaitingPayment(true)
        return
      } else if (formData.paymentMethod === 'pay_later') {
        console.log('📄 Boleto gerado, aguardando pagamento...')
        // Extrair dados do boleto da resposta
        const boletoInfo = result.charges?.[0]?.payment_method?.boleto || result.boleto
        const boletoLinks = result.charges?.[0]?.links || result.links || []
        setBoletoData({
          barcode: boletoInfo?.barcode || result.barcode,
          formattedBarcode: boletoInfo?.formatted_barcode || result.formatted_barcode,
          dueDate: boletoInfo?.due_date || result.due_date,
          pdfLink: boletoLinks.find(l => l.media === 'application/pdf')?.href || result.pdf_url,
          orderId: result.id
        })
        setAwaitingPayment(true)
        return
      }

      // Para cartão, marcar como sucesso imediatamente
      setPaymentSuccess(true)

      // Se for usuário novo, criar conta
      if (!user) {
        console.log('👤 Criando conta para novo usuário...')
        // A criação da conta será feita pelo webhook quando o pagamento for confirmado
      }

    } catch (error) {
      console.error('❌ Erro no processamento do pagamento:', error)
      setPaymentError(error.message || 'Erro ao processar pagamento. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  // Função para copiar código PIX para clipboard
  const copyPixCode = async () => {
    if (pixData?.qrCodeText) {
      try {
        await navigator.clipboard.writeText(pixData.qrCodeText)
        setCopiedToClipboard(true)
        setTimeout(() => setCopiedToClipboard(false), 3000)
      } catch (err) {
        console.error('Erro ao copiar:', err)
      }
    }
  }

  // Função para copiar código de barras do boleto
  const copyBoletoCode = async () => {
    if (boletoData?.barcode || boletoData?.formattedBarcode) {
      try {
        await navigator.clipboard.writeText(boletoData.formattedBarcode || boletoData.barcode)
        setCopiedToClipboard(true)
        setTimeout(() => setCopiedToClipboard(false), 3000)
      } catch (err) {
        console.error('Erro ao copiar:', err)
      }
    }
  }

  // Função para verificar status do pagamento
  const checkPaymentStatus = useCallback(async () => {
    const orderId = pixData?.orderId || boletoData?.orderId
    if (!orderId) return

    setCheckingPayment(true)
    try {
      const status = await paymentService.checkOrderStatus(orderId)
      console.log('📊 Status do pagamento:', status)
      
      // Verificar se pagamento foi confirmado
      const chargeStatus = status.charges?.[0]?.status
      if (chargeStatus === 'PAID' || chargeStatus === 'AUTHORIZED') {
        setPaymentSuccess(true)
        setAwaitingPayment(false)
      }
    } catch (error) {
      console.error('Erro ao verificar status:', error)
    } finally {
      setCheckingPayment(false)
    }
  }, [pixData?.orderId, boletoData?.orderId])

  // Polling para verificar pagamento a cada 10 segundos
  useEffect(() => {
    if (awaitingPayment && (pixData || boletoData)) {
      const interval = setInterval(() => {
        checkPaymentStatus()
      }, 10000) // Verificar a cada 10 segundos
      
      return () => clearInterval(interval)
    }
  }, [awaitingPayment, pixData, boletoData, checkPaymentStatus])

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
    
    // Log quando método de pagamento mudar
    if (field === 'paymentMethod') {
      console.log('💳 Método de pagamento alterado para:', value)
    }
    
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
    console.log('🔍 Validando formulário:', {
      fullName: formData.fullName,
      email: formData.email,
      cpf: formData.cpf,
      phone: formData.phone,
      paymentMethod: formData.paymentMethod,
      cardNumber: formData.cardNumber,
      cardName: formData.cardName
    })
    
    const newErrors = {}
    
    // Validações gerais (sempre obrigatórias, exceto se usuário estiver logado)
    if (!user && (!formData.fullName || formData.fullName.trim().length < 2)) {
      newErrors.fullName = 'Nome completo é obrigatório'
    }
    if (!user && (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))) {
      newErrors.email = 'Email válido é obrigatório'
    }
    
    // CPF e Telefone são SEMPRE obrigatórios para PagBank (qualquer método de pagamento)
    const cpfToValidate = user ? (user.cpf || formData.cpf) : formData.cpf
    if (!cpfToValidate || !validateCPF(cpfToValidate)) {
      newErrors.cpf = 'CPF válido é obrigatório para pagamentos'
    }
    
    const phoneToValidate = user ? (user.telefone || formData.phone) : formData.phone
    if (!phoneToValidate || phoneToValidate.replace(/\D/g, '').length < 10) {
      newErrors.phone = 'Telefone válido com DDD é obrigatório para pagamentos'
    }
    
    if (!user && (!formData.password || formData.password.length < 6)) {
      newErrors.password = 'Senha deve ter no mínimo 6 caracteres'
    }
    if (!user && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem'
    }
    
    // Validações específicas para cartão de crédito
    if (formData.paymentMethod === 'card') {
      // Se não há cartão salvo selecionado, validar campos do novo cartão
      if (!selectedSavedCard) {
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
      // Se há cartão salvo selecionado, apenas validar CVV
      else {
        if (!formData.cvv || formData.cvv.length < 3) {
          newErrors.cvv = 'CVV é obrigatório para confirmar o pagamento'
        }
      }
    }
    
    console.log('🔍 Erros encontrados:', newErrors)
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleGoBack = () => navigate('/precos')

  if (!selectedPlan) return null
  
  const basePrice = isYearly ? selectedPlan.yearlyPrice : selectedPlan.monthlyPrice
  const price = basePrice
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

      {/* Tela de aguardar pagamento PIX */}
      {awaitingPayment && pixData && (
        <div className="container mx-auto px-4 max-w-4xl py-20">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                <QrCode className="w-16 h-16 text-green-600" />
              </div>
            </div>
            <div className="space-y-3">
              <h2 className="text-4xl font-bold">Pague com PIX</h2>
              <p className="text-xl text-slate-600">Escaneie o QR Code ou copie o código para pagar</p>
            </div>
            <Card className="max-w-2xl mx-auto shadow-xl">
              <CardContent className="p-6 space-y-6">
                {/* QR Code */}
                <div className="flex justify-center">
                  {pixData.qrCode ? (
                    <img 
                      src={pixData.qrCode} 
                      alt="QR Code PIX" 
                      className="w-64 h-64 border-4 border-slate-200 rounded-lg"
                    />
                  ) : (
                    <div className="w-64 h-64 bg-slate-100 rounded-lg flex items-center justify-center">
                      <QrCode className="w-32 h-32 text-slate-400" />
                    </div>
                  )}
                </div>

                {/* Código PIX para copiar */}
                {pixData.qrCodeText && (
                  <div className="space-y-2">
                    <Label>Código PIX (Copia e Cola)</Label>
                    <div className="flex gap-2">
                      <Input 
                        value={pixData.qrCodeText} 
                        readOnly 
                        className="font-mono text-xs"
                      />
                      <Button onClick={copyPixCode} variant="outline" className="flex-shrink-0">
                        {copiedToClipboard ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    {copiedToClipboard && (
                      <p className="text-sm text-green-600">✓ Código copiado!</p>
                    )}
                  </div>
                )}

                <Separator />

                {/* Informações do pedido */}
                <div className="space-y-3 text-left">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Plano</span>
                    <span className="font-medium">{selectedPlan.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Valor</span>
                    <span className="font-bold text-lg text-green-600">R$ {total.toFixed(2)}</span>
                  </div>
                  {pixData.expirationDate && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Válido até</span>
                      <span className="font-medium">{new Date(pixData.expirationDate).toLocaleString('pt-BR')}</span>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Status de verificação */}
                <div className="bg-yellow-50 p-4 rounded-lg flex items-center gap-3">
                  <Clock className="w-5 h-5 text-yellow-600 animate-pulse" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-yellow-900">Aguardando pagamento...</p>
                    <p className="text-xs text-yellow-700">O pagamento será confirmado automaticamente</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={checkPaymentStatus}
                    disabled={checkingPayment}
                    className="ml-auto"
                  >
                    <RefreshCw className={`w-4 h-4 ${checkingPayment ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </CardContent>
            </Card>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button variant="outline" onClick={() => { setAwaitingPayment(false); setPixData(null); }}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar e escolher outro método
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Tela de aguardar pagamento Boleto */}
      {awaitingPayment && boletoData && (
        <div className="container mx-auto px-4 max-w-4xl py-20">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="w-16 h-16 text-blue-600" />
              </div>
            </div>
            <div className="space-y-3">
              <h2 className="text-4xl font-bold">Boleto Gerado!</h2>
              <p className="text-xl text-slate-600">Copie o código de barras ou baixe o PDF para pagar</p>
            </div>
            <Card className="max-w-2xl mx-auto shadow-xl">
              <CardContent className="p-6 space-y-6">
                {/* Código de barras */}
                {(boletoData.formattedBarcode || boletoData.barcode) && (
                  <div className="space-y-2">
                    <Label>Código de Barras</Label>
                    <div className="flex gap-2">
                      <Input 
                        value={boletoData.formattedBarcode || boletoData.barcode} 
                        readOnly 
                        className="font-mono text-sm"
                      />
                      <Button onClick={copyBoletoCode} variant="outline" className="flex-shrink-0">
                        {copiedToClipboard ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    {copiedToClipboard && (
                      <p className="text-sm text-green-600">✓ Código copiado!</p>
                    )}
                  </div>
                )}

                {/* Botão para baixar PDF */}
                {boletoData.pdfLink && (
                  <Button 
                    className="w-full" 
                    onClick={() => window.open(boletoData.pdfLink, '_blank')}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Baixar Boleto em PDF
                  </Button>
                )}

                <Separator />

                {/* Informações do pedido */}
                <div className="space-y-3 text-left">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Plano</span>
                    <span className="font-medium">{selectedPlan.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Valor</span>
                    <span className="font-bold text-lg text-blue-600">R$ {total.toFixed(2)}</span>
                  </div>
                  {boletoData.dueDate && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Vencimento</span>
                      <span className="font-medium">{new Date(boletoData.dueDate + 'T00:00:00').toLocaleDateString('pt-BR')}</span>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Status de verificação */}
                <div className="bg-yellow-50 p-4 rounded-lg flex items-center gap-3">
                  <Clock className="w-5 h-5 text-yellow-600 animate-pulse" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-yellow-900">Aguardando pagamento...</p>
                    <p className="text-xs text-yellow-700">O pagamento será confirmado em até 3 dias úteis após o pagamento</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={checkPaymentStatus}
                    disabled={checkingPayment}
                    className="ml-auto"
                  >
                    <RefreshCw className={`w-4 h-4 ${checkingPayment ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </CardContent>
            </Card>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button variant="outline" onClick={() => { setAwaitingPayment(false); setBoletoData(null); }}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar e escolher outro método
              </Button>
            </div>
          </div>
        </div>
      )}

      {!paymentSuccess && !awaitingPayment ? (
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
                    {/* CPF e Telefone obrigatórios para TODOS os métodos de pagamento (PagBank exige) */}
                    {user && (
                      <>
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            <User className="w-5 h-5 text-brand-primary" />
                            Dados para Pagamento
                          </h3>
                          <p className="text-sm text-slate-600">CPF e telefone são obrigatórios para processar o pagamento</p>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="cpf">CPF *</Label>
                              <Input id="cpf" placeholder="000.000.000-00" 
                                value={formData.cpf || (user?.cpf || '')} 
                                onChange={(e) => handleInputChange('cpf', e.target.value)}
                                className={errors.cpf ? 'border-red-500' : ''} />
                              {errors.cpf && <p className="text-xs text-red-500 mt-1">{errors.cpf}</p>}
                            </div>
                            <div>
                              <Label htmlFor="phone">Telefone *</Label>
                              <Input id="phone" placeholder="(00) 00000-0000" 
                                value={formData.phone || (user?.telefone || '')} 
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                className={errors.phone ? 'border-red-500' : ''} />
                              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                            </div>
                          </div>
                        </div>
                        <Separator />
                      </>
                    )}

                    {!user && (
                      <>
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            <User className="w-5 h-5 text-brand-primary" />
                            Dados Pessoais
                          </h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                              <Label htmlFor="fullName">Nome Completo *</Label>
                              <Input id="fullName" placeholder="Seu nome completo" 
                                value={formData.fullName} onChange={(e) => handleInputChange('fullName', e.target.value)}
                                className={errors.fullName ? 'border-red-500' : ''} />
                              {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
                            </div>
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
                      </>
                    )}

                    {/* Cartões Salvos - só mostrar se usuário estiver logado e tiver cartões */}
                    {user && savedPaymentMethods.filter(method => method.type === 'card').length > 0 && (
                      <>
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-brand-primary" />
                            Cartões Salvos
                          </h3>
                          <p className="text-sm text-slate-600">Selecione um cartão salvo ou use um novo</p>
                          
                          <div className="space-y-3">
                            {savedPaymentMethods
                              .filter(method => method.type === 'card')
                              .map((method) => (
                                <div 
                                  key={method.id}
                                  className={`relative cursor-pointer border-2 rounded-lg p-4 transition-all hover:border-brand-primary ${
                                    selectedSavedCard?.id === method.id 
                                      ? 'border-brand-primary bg-brand-primary/5' 
                                      : 'border-gray-200'
                                  }`}
                                  onClick={() => handleSelectSavedCard(method)}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <CreditCard className="w-5 h-5 text-blue-600" />
                                      </div>
                                      <div>
                                        <p className="font-medium text-sm">
                                          •••• •••• •••• {method.card.last4}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                          {method.card.brand} • Expira {method.card.expiryMonth}/{method.card.expiryYear}
                                        </p>
                                      </div>
                                    </div>
                                    {method.isDefault && (
                                      <Badge variant="default" className="text-xs">
                                        Padrão
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              ))}
                            
                            <div 
                              className={`relative cursor-pointer border-2 rounded-lg p-4 transition-all hover:border-brand-primary ${
                                !selectedSavedCard && formData.paymentMethod === 'card'
                                  ? 'border-brand-primary bg-brand-primary/5' 
                                  : 'border-gray-200 border-dashed'
                              }`}
                              onClick={handleUseNewCard}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                  <Plus className="w-5 h-5 text-gray-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-sm">Usar novo cartão</p>
                                  <p className="text-xs text-slate-500">Adicionar dados de um cartão diferente</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <Separator />
                      </>
                    )}

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">SELECIONE A FORMA DE PAGAMENTO</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Cartão de Crédito */}
                        <div 
                          className={`relative cursor-pointer border-2 rounded-lg p-4 transition-all hover:border-brand-primary ${
                            formData.paymentMethod === 'card' 
                              ? 'border-brand-primary bg-brand-primary/5' 
                              : 'border-gray-200'
                          }`}
                          onClick={() => handleInputChange('paymentMethod', 'card')}
                        >
                          <div className="flex flex-col items-center text-center space-y-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                              <CreditCard className="w-6 h-6 text-gray-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">Cartão</p>
                              <p className="text-sm text-gray-600">de crédito</p>
                            </div>
                          </div>
                        </div>

                        {/* PIX */}
                        <div 
                          className={`relative cursor-pointer border-2 rounded-lg p-4 transition-all hover:border-brand-primary ${
                            formData.paymentMethod === 'pix' 
                              ? 'border-brand-primary bg-brand-primary/5' 
                              : 'border-gray-200'
                          }`}
                          onClick={() => handleInputChange('paymentMethod', 'pix')}
                        >
                          <div className="flex flex-col items-center text-center space-y-3">
                            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                              <svg className="w-8 h-8 text-teal-600" viewBox="0 0 32 32" fill="currentColor">
                                <path d="M11.4 4h9.2A7.4 7.4 0 0 1 28 11.4v9.2a7.4 7.4 0 0 1-7.4 7.4h-9.2A7.4 7.4 0 0 1 4 20.6v-9.2A7.4 7.4 0 0 1 11.4 4zm0 1.6A5.8 5.8 0 0 0 5.6 11.4v9.2a5.8 5.8 0 0 0 5.8 5.8h9.2a5.8 5.8 0 0 0 5.8-5.8v-9.2a5.8 5.8 0 0 0-5.8-5.8h-9.2z"/>
                                <path d="M21.9 11.8c0 .9-.7 1.6-1.6 1.6s-1.6-.7-1.6-1.6.7-1.6 1.6-1.6 1.6.7 1.6 1.6zM13.3 11.8c0 .9-.7 1.6-1.6 1.6s-1.6-.7-1.6-1.6.7-1.6 1.6-1.6 1.6.7 1.6 1.6z"/>
                                <path d="M10.1 16h11.8c.4 0 .8.4.8.8s-.4.8-.8.8H10.1c-.4 0-.8-.4-.8-.8s.4-.8.8-.8z"/>
                                <path d="M13.3 20.2c0 .9-.7 1.6-1.6 1.6s-1.6-.7-1.6-1.6.7-1.6 1.6-1.6 1.6.7 1.6 1.6zM21.9 20.2c0 .9-.7 1.6-1.6 1.6s-1.6-.7-1.6-1.6.7-1.6 1.6-1.6 1.6.7 1.6 1.6z"/>
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 text-lg">PIX</p>
                            </div>
                          </div>
                        </div>

                        {/* Boleto */}
                        <div 
                          className={`relative cursor-pointer border-2 rounded-lg p-4 transition-all hover:border-brand-primary ${
                            formData.paymentMethod === 'pay_later' 
                              ? 'border-brand-primary bg-brand-primary/5' 
                              : 'border-gray-200'
                          }`}
                          onClick={() => handleInputChange('paymentMethod', 'pay_later')}
                        >
                          <div className="flex flex-col items-center text-center space-y-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Calendar className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">Boleto</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Informações do método selecionado */}
                      {formData.paymentMethod === 'pix' && (
                        <div className="mt-6 p-4 bg-teal-50 border border-teal-200 rounded-lg">
                          <div className="flex items-start gap-3">
                            <QrCode className="w-5 h-5 text-teal-600 mt-0.5" />
                            <div>
                              <p className="font-medium text-teal-900">Pagamento via PIX</p>
                              <p className="text-sm text-teal-700 mt-1">
                                Após confirmar os dados, você receberá o QR Code para pagamento instantâneo.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {formData.paymentMethod === 'pay_later' && (
                        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-start gap-3">
                            <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div>
                              <p className="font-medium text-blue-900">Boleto</p>
                              <p className="text-sm text-blue-700 mt-1">
                                Pagamento através de boleto bancário. Seu acesso será liberado após a confirmação do pagamento.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Dados do Cartão - só mostrar se cartão estiver selecionado */}
                    {formData.paymentMethod === 'card' && (
                      <>
                        <Separator />

                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">Dados do Cartão *</h3>
                          {selectedSavedCard ? (
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                              <div className="flex items-center gap-3 mb-3">
                                <CreditCard className="w-5 h-5 text-blue-600" />
                                <div>
                                  <p className="font-medium text-sm text-blue-900">
                                    Cartão selecionado: •••• •••• •••• {selectedSavedCard.card.last4}
                                  </p>
                                  <p className="text-xs text-blue-700">
                                    {selectedSavedCard.card.brand} • Expira {selectedSavedCard.card.expiryMonth}/{selectedSavedCard.card.expiryYear}
                                  </p>
                                </div>
                              </div>
                              <p className="text-sm text-blue-700">Digite apenas o CVV para confirmar o pagamento</p>
                            </div>
                          ) : (
                            <p className="text-sm text-slate-600">Preencha os dados do cartão de crédito para o pagamento</p>
                          )}
                          
                          <div className="space-y-4">
                            {!selectedSavedCard && (
                              <>
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
                              </>
                            )}
                            
                            {selectedSavedCard && (
                              <div className="grid grid-cols-2 gap-4">
                                <div className="max-w-xs">
                                  <Label htmlFor="cvv">CVV</Label>
                                  <div className="relative">
                                    <Input id="cvv" type="password" placeholder="000" maxLength={4}
                                      value={formData.cvv} onChange={(e) => handleInputChange('cvv', e.target.value)}
                                      className={`pl-10 ${errors.cvv ? 'border-red-500' : ''}`} />
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                                  </div>
                                  {errors.cvv && <p className="text-xs text-red-500 mt-1">{errors.cvv}</p>}
                                </div>
                                <div>
                                  <Label htmlFor="installments">Parcelas</Label>
                                  <Select value={selectedInstallments.toString()} onValueChange={(value) => setSelectedInstallments(parseInt(value))}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Selecione as parcelas" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {installmentOptions.map((option) => (
                                        <SelectItem key={option.quantity} value={option.quantity.toString()}>
                                          {option.quantity}x de R$ {option.amount.toFixed(2)} 
                                          {option.quantity > 1 && ` (Total: R$ ${option.total.toFixed(2)})`}
                                          {!option.interest_free && ' com juros'}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            )}

                            {/* Seletor de Parcelas */}
                            {!selectedSavedCard && (
                              <div>
                                <Label htmlFor="installments">Parcelas</Label>
                                <Select value={selectedInstallments.toString()} onValueChange={(value) => setSelectedInstallments(parseInt(value))}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione as parcelas" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {installmentOptions.map((option) => (
                                      <SelectItem key={option.quantity} value={option.quantity.toString()}>
                                        {option.quantity}x de R$ {option.amount.toFixed(2)} 
                                        {option.quantity > 1 && ` (Total: R$ ${option.total.toFixed(2)})`}
                                        {!option.interest_free && ' com juros'}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}

                    <Separator />

                    <div className="space-y-4">
                      <Button 
                        size="lg" 
                        className="w-full bg-brand-primary hover:bg-brand-secondary text-white py-4 text-lg font-semibold"
                        onClick={handlePaymentSubmit}
                        disabled={isLoading}
                      >
                        {isLoading ? 'Processando...' : (
                          <>
                            {formData.paymentMethod === 'pix' && 'Gerar PIX'}
                            {formData.paymentMethod === 'pay_later' && 'Gerar Boleto'}
                            {formData.paymentMethod === 'card' && 'Finalizar Pagamento'}
                          </>
                        )}
                      </Button>
                      <p className="text-xs text-slate-500 text-center">
                        Ao finalizar, você concorda com os termos de uso e política de privacidade
                      </p>
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
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Subtotal</span>
                        <span className="font-medium">R$ {basePrice.toFixed(2)}</span>
                      </div>
                      {isYearly && (
                        <div className="flex justify-between text-sm">
                          <span className="text-green-600 font-medium">Desconto Anual (30%)</span>
                          <span className="text-green-600 font-medium">- R$ {((selectedPlan.monthlyPrice * 12 - basePrice * 12) / 12).toFixed(2)}</span>
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
                    {formData.paymentMethod === 'card' && selectedInstallments > 1 && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-blue-800 font-medium">
                          {selectedInstallments}x de R$ {installmentOptions.find(opt => opt.quantity === selectedInstallments)?.amount.toFixed(2) || '0.00'}
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                          Total: R$ {installmentOptions.find(opt => opt.quantity === selectedInstallments)?.total.toFixed(2) || '0.00'}
                          {installmentOptions.find(opt => opt.quantity === selectedInstallments)?.interest_free ? ' (sem juros)' : ' (com juros)'}
                        </p>
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
      ) : null}

      {/* Tela de sucesso do pagamento */}
      {paymentSuccess && (
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
