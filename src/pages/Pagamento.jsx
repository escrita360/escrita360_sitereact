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
import { firebasePaymentService, contractSignatureService, pendingAccountService } from '@/services/firebase'
import { paymentService } from '@/services/payment'
import CardBrandIcon from '@/components/CardBrandIcon'

function Pagamento() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  // Estados e cidades do Brasil
  const estadosCidades = {
    'AC': ['Rio Branco', 'Cruzeiro do Sul', 'Sena Madureira', 'Tarauacá', 'Feijó'],
    'AL': ['Maceió', 'Arapiraca', 'Palmeira dos Índios', 'Rio Largo', 'Penedo'],
    'AP': ['Macapá', 'Santana', 'Laranjal do Jari', 'Oiapoque', 'Mazagão'],
    'AM': ['Manaus', 'Parintins', 'Itacoatiara', 'Manacapuru', 'Coari'],
    'BA': ['Salvador', 'Feira de Santana', 'Vitória da Conquista', 'Camaçari', 'Itabuna', 'Juazeiro', 'Lauro de Freitas', 'Ilhéus'],
    'CE': ['Fortaleza', 'Caucaia', 'Juazeiro do Norte', 'Maracanaú', 'Sobral', 'Crato', 'Itapipoca'],
    'DF': ['Brasília', 'Taguatinga', 'Ceilândia', 'Gama', 'Sobradinho'],
    'ES': ['Vitória', 'Vila Velha', 'Serra', 'Cariacica', 'Linhares', 'Cachoeiro de Itapemirim'],
    'GO': ['Goiânia', 'Aparecida de Goiânia', 'Anápolis', 'Rio Verde', 'Luziânia', 'Águas Lindas de Goiás'],
    'MA': ['São Luís', 'Imperatriz', 'São José de Ribamar', 'Timon', 'Caxias', 'Codó'],
    'MT': ['Cuiabá', 'Várzea Grande', 'Rondonópolis', 'Sinop', 'Tangará da Serra', 'Cáceres'],
    'MS': ['Campo Grande', 'Dourados', 'Três Lagoas', 'Corumbá', 'Ponta Porã', 'Naviraí'],
    'MG': ['Belo Horizonte', 'Uberlândia', 'Contagem', 'Juiz de Fora', 'Betim', 'Montes Claros', 'Ribeirão das Neves', 'Uberaba', 'Governador Valadares', 'Ipatinga'],
    'PA': ['Belém', 'Ananindeua', 'Santarém', 'Marabá', 'Parauapebas', 'Castanhal', 'Abaetetuba'],
    'PB': ['João Pessoa', 'Campina Grande', 'Santa Rita', 'Patos', 'Bayeux', 'Sousa'],
    'PR': ['Curitiba', 'Londrina', 'Maringá', 'Ponta Grossa', 'Cascavel', 'São José dos Pinhais', 'Foz do Iguaçu'],
    'PE': ['Recife', 'Jaboatão dos Guararapes', 'Olinda', 'Bandeiras', 'Caruaru', 'Petrolina', 'Paulista'],
    'PI': ['Teresina', 'Parnaíba', 'Picos', 'Piripiri', 'Floriano', 'Campo Maior'],
    'RJ': ['Rio de Janeiro', 'São Gonçalo', 'Duque de Caxias', 'Nova Iguaçu', 'Niterói', 'Belford Roxo', 'São João de Meriti', 'Campos dos Goytacazes', 'Petrópolis', 'Volta Redonda'],
    'RN': ['Natal', 'Mossoró', 'Parnamirim', 'São Gonçalo do Amarante', 'Macaíba', 'Ceará-Mirim'],
    'RS': ['Porto Alegre', 'Caxias do Sul', 'Pelotas', 'Canoas', 'Santa Maria', 'Gravataí', 'Viamão', 'Novo Hamburgo', 'São Leopoldo'],
    'RO': ['Porto Velho', 'Ji-Paraná', 'Ariquemes', 'Vilhena', 'Cacoal', 'Rolim de Moura'],
    'RR': ['Boa Vista', 'Rorainópolis', 'Caracaraí', 'Alto Alegre', 'Mucajaí'],
    'SC': ['Florianópolis', 'Joinville', 'Blumenau', 'São José', 'Criciúma', 'Chapecó', 'Itajaí', 'Lages'],
    'SP': ['São Paulo', 'Guarulhos', 'Campinas', 'São Bernardo do Campo', 'Santo André', 'Osasco', 'Ribeirão Preto', 'Sorocaba', 'Mauá', 'São José dos Campos', 'Mogi das Cruzes', 'Diadema', 'Jundiaí', 'Piracicaba', 'Carapicuíba', 'Bauru', 'São Vicente', 'Franca', 'Guarujá', 'Taubaté'],
    'SE': ['Aracaju', 'Nossa Senhora do Socorro', 'Lagarto', 'Itabaiana', 'São Cristóvão', 'Estância'],
    'TO': ['Palmas', 'Araguaína', 'Gurupi', 'Porto Nacional', 'Paraíso do Tocantins', 'Tocantinópolis']
  }

  // Tentar obter do location.state primeiro, depois do sessionStorage
  const stateData = location.state || {
    selectedPlan: sessionStorage.getItem('selectedPlan') ? JSON.parse(sessionStorage.getItem('selectedPlan')) : null,
    audience: sessionStorage.getItem('selectedAudience')
  }
  const { selectedPlan, isYearly, audience } = stateData

  const [paymentSuccess, setPaymentSuccess] = useState(false)

  const [paymentError, setPaymentError] = useState('')

  const [transactionData, setTransactionData] = useState(null)
  // Estado para aguardar pagamento PIX/Boleto
  const [awaitingPayment, setAwaitingPayment] = useState(false)
  const [pixData, setPixData] = useState(null)
  // const [boletoData, setBoletoData] = useState(null)
  const [copiedToClipboard, setCopiedToClipboard] = useState(false)
  const [checkingPayment, setCheckingPayment] = useState(false)
  const [pagbankEnvironment, setPagbankEnvironment] = useState(null)
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
    paymentMethod: 'card', // 'card', 'pix', 'pay_later'
    // Dados de endereço
    cep: '',
    rua: '',
    numero: '',
    complemento: '',
    estado: '',
    cidade: ''
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [isLoading, setIsLoading] = useState(true)
  const [savedPaymentMethods, setSavedPaymentMethods] = useState([])
  const [selectedSavedCard, setSelectedSavedCard] = useState(null)
  const [installmentOptions, setInstallmentOptions] = useState([])
  const [selectedInstallments, setSelectedInstallments] = useState(1)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [cardBrand, setCardBrand] = useState('')
  const [loadingInstallments, setLoadingInstallments] = useState(false)

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

  // Verificar ambiente PagBank (sandbox vs produção)
  useEffect(() => {
    const checkEnvironment = async () => {
      try {
        const response = await paymentService.getPagBankEnvironment()
        setPagbankEnvironment(response)
        if (response?.isSandbox) {
          console.log('🧪 PagBank em modo SANDBOX — use cartões de teste')
        } else {
          console.log('🏭 PagBank em modo PRODUÇÃO — use cartões reais')
        }
      } catch (e) {
        console.warn('⚠️ Não foi possível verificar ambiente PagBank:', e.message)
      }
    }
    checkEnvironment()
  }, [])

  // Carregar opções de parcelamento quando o plano estiver disponível
  useEffect(() => {
    if (selectedPlan) {
      setSelectedInstallments(1) // Reset to 1 when plan changes
      loadInstallmentOptions()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlan, isYearly])

  // Recarregar taxas quando cartão mudar para obter BIN específico
  useEffect(() => {
    if (formData.cardNumber && formData.cardNumber.replace(/\s/g, '').length >= 6) {
      loadInstallmentOptions()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.cardNumber])

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const loadSavedPaymentMethods = async () => {
    if (!user) return

    try {
      const methods = await firebasePaymentService.getPaymentMethods(
        user.uid,
        user.tipoPlano === 'professor' ? 'professores' : 'estudantes'
      )
      // Filtrar apenas métodos que tenham token (cartões legados sem token não funcionam)
      const activeMethods = methods.filter(method => !method.deleted && method.token)
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

  // Função para determinar número máximo de parcelas baseado no valor
  const getMaxInstallments = (value) => {
    console.log('💳 Calculando parcelas para valor:', value)

    if (value >= 49 && value <= 120) {
      console.log('💳 Faixa R$49-R$120: máximo 1x')
      return 1 // R$49,00 - R$120,00: até 1x
    } else if (value >= 290 && value < 570) {
      console.log('💳 Faixa R$290: máximo 2x')
      return 2 // R$290,00: até 2x
    } else if (value >= 570 && value <= 1200) {
      console.log('💳 Faixa R$570-R$1200: máximo 3x')
      return 3 // R$570,00 - R$1200: até 3x
    } else if (value > 1200) {
      const maxParcelas = Math.min(12, Math.floor(value / 100))
      console.log('💳 Valor acima R$1200: máximo', maxParcelas + 'x')
      return maxParcelas // Valores maiores: máximo baseado no valor
    }
    console.log('💳 Valor fora das faixas: máximo 1x')
    return 1 // Valores fora das faixas definidas: apenas 1x
  }

  // Função para determinar parcelas sem juros baseado no valor
  const getMaxInstallmentsNoInterest = (value) => {
    if (value >= 49 && value <= 120) {
      return 1 // R$49-R$120: apenas 1x sem juros
    } else if (value >= 290 && value < 570) {
      return 2 // R$290: até 2x sem juros
    } else if (value >= 570 && value <= 1200) {
      return 3 // R$570-R$1200: até 3x sem juros
    }
    return 1 // Demais valores: apenas 1x sem juros
  }

  const loadInstallmentOptions = async () => {
    if (!selectedPlan) {
      console.log('⚠️ Não há plano selecionado')
      return
    }

    // Declare price outside try so it is accessible in the catch block
    const price = isYearly ? selectedPlan.yearlyPrice : selectedPlan.monthlyPrice

    try {
      setLoadingInstallments(true)

      // Determinar número máximo de parcelas baseado no valor
      const maxInstallments = getMaxInstallments(price)
      const maxInstallmentsNoInterest = getMaxInstallmentsNoInterest(price)

      console.log('💳 =================================')
      console.log('💳 Carregando opções de parcelamento')
      console.log('💳 Plano selecionado:', selectedPlan.name)
      console.log('💳 Preço:', price)
      console.log('💳 É anual:', isYearly)
      console.log('💳 Máximo de parcelas permitido:', maxInstallments)
      console.log('💳 Máximo sem juros:', maxInstallmentsNoInterest)
      console.log('💳 BIN do cartão:', formData.cardNumber ? formData.cardNumber.replace(/\s/g, '').substring(0, 6) : 'N/A')
      console.log('💳 =================================')

      let feesData = null

      // Consultar taxas diretamente da API do PagBank
      try {
        console.log('💳 Consultando taxas de parcelamento na API do PagBank...')
        feesData = await paymentService.getInstallmentFees(
          price, // valor em reais
          maxInstallments, // máximo de parcelas baseado no valor
          maxInstallmentsNoInterest, // sem juros baseado na regra
          formData.cardNumber && formData.cardNumber.replace(/\s/g, '').length >= 6
            ? formData.cardNumber.replace(/\s/g, '').substring(0, 6)
            : null // BIN do cartão se disponível
        )
        console.log('✅ Taxas consultadas com sucesso:', feesData)
      } catch (hookError) {
        console.error('❌ Erro ao consultar taxas na API:', hookError)
        throw new Error(`Não foi possível consultar as taxas de parcelamento: ${hookError.message}`)
      }

      console.log('💳 Resposta da API de taxas (tipo):', typeof feesData)
      console.log('💳 Resposta da API de taxas (conteúdo):', feesData)

      // Processar dados da API do PagBank
      const options = []

      if (feesData && Array.isArray(feesData) && feesData.length > 0) {
        // Se retornou o formato já processado pelo hook
        console.log('💳 Usando dados processados pelo hook')
        options.push(...feesData.filter(option => option.quantity <= maxInstallments))
      } else if (feesData?.payment_methods?.credit_card) {
        console.log('💳 Processando dados brutos do PagBank')
        const brands = Object.keys(feesData.payment_methods.credit_card)

        if (brands.length > 0) {
          const brandData = feesData.payment_methods.credit_card[brands[0]]
          console.log('💳 Dados da primeira bandeira:', brandData)

          brandData.installment_plans?.forEach(plan => {
            if (plan.installments <= maxInstallments) {
              options.push({
                quantity: plan.installments,
                amount: Number(plan.installment_value) / 100, // converter de centavos
                total: Number(plan.amount.total) / 100, // converter de centavos
                interest_free: plan.amount.fees === 0,
                fees: Number(plan.amount.fees) / 100 // taxas em reais
              })
            }
          })
        }
      }

      // Se não conseguiu processar nenhuma opção da API, erro
      if (options.length === 0) {
        console.error('❌ Nenhuma opção de parcelamento retornada pela API')
        throw new Error('Não foi possível obter opções de parcelamento da API')
      }

      // Garantir que não excedemos o limite máximo de parcelas
      const filteredOptions = options.filter(option => option.quantity <= maxInstallments)

      console.log('💳 Opções processadas da API:', filteredOptions.length)
      console.log('💳 Opções finais:', filteredOptions)
      setInstallmentOptions(filteredOptions)

      // Ensure selected installments is valid
      if (!filteredOptions.some(opt => opt.quantity === selectedInstallments)) {
        setSelectedInstallments(1)
      }

      console.log('✅ Opções de parcelamento carregadas da API com sucesso')

    } catch (error) {
      console.error('❌ Erro ao carregar opções de parcelamento:', error)
      console.error('❌ Stack trace:', error.stack)

      // Mostrar erro para o usuário
      setPaymentError(`Erro ao consultar taxas de parcelamento: ${error.message}`)

      // Opção mínima: apenas 1x sem juros
      const emergencyOption = [{
        quantity: 1,
        amount: Number(price),
        total: Number(price),
        interest_free: true,
        fees: 0
      }]

      console.log('⚠️ Usando opção de emergência (1x):', emergencyOption)
      setInstallmentOptions(emergencyOption)
      setSelectedInstallments(1)
    } finally {
      setLoadingInstallments(false)
    }
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

  // Função para registrar assinatura de contrato/termos
  const registerContractSignature = async (customerData, planData, transactionResult) => {
    try {
      console.log('📝 Registrando assinatura de contrato...')

      const contractData = {
        userName: customerData.name,
        userEmail: customerData.email,
        userCpf: customerData.cpf,
        userPhone: customerData.phone,
        contractType: 'terms_and_conditions',
        contractVersion: '1.0',
        signatureContext: 'payment_process',
        planType: planData.audience || audience,
        planId: planData.id || 'plan_' + planData.name,
        ipAddress: '', // Pode ser obtido via serviço externo se necessário
        metadata: {
          transactionId: transactionResult.id,
          paymentMethod: formData.paymentMethod,
          planName: planData.name,
          planPrice: planData.price,
          timestamp: new Date().toISOString()
        }
      }

      const result = await contractSignatureService.registerContractAcceptance(
        user?.uid || customerData.email, // Usar UID do usuário ou email como fallback
        contractData,
        planData.audience || audience
      )

      console.log('✅ Assinatura de contrato registrada:', result.signatureId)
      return result

    } catch (error) {
      console.error('❌ Erro ao registrar assinatura de contrato:', error)
      throw error
    }
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
          expiryMonth: formData.expiryDate.split('/')[0],
          expiryYear: formData.expiryDate.split('/')[1].length === 2 ? '20' + formData.expiryDate.split('/')[1] : formData.expiryDate.split('/')[1],
          cvv: formData.cvv,
          holderName: formData.cardName
        }

        // Dados de endereço para envio ao PagBank
        const addressData = {
          cep: formData.cep,
          rua: formData.rua,
          numero: formData.numero,
          complemento: formData.complemento,
          estado: formData.estado,
          cidade: formData.cidade
        }

        const paymentData = {
          planData,
          customerData,
          cardData,
          installments: selectedInstallments,
          addressData
        }

        try {
          // Pagamento com cartão criptografado via SDK PagBank (único método permitido)
          console.log('🔐 Processando pagamento com cartão criptografado via SDK...')
          const publicKey = await paymentService.getPublicKey()

          if (!publicKey) {
            throw new Error('Não foi possível obter a chave pública do PagBank. Tente novamente.')
          }

          result = await paymentService.processPagBankEncryptedCardPayment(paymentData, publicKey)
          console.log('✅ Pagamento criptografado realizado com sucesso')

        } catch (encryptedError) {
          console.error('❌ Erro no pagamento com cartão criptografado:', encryptedError.message)

          // Não usar fallback PCI - mostrar erro ao usuário
          let errorMessage = encryptedError.message || 'Erro ao processar pagamento'

          // Melhorar mensagens de erro específicas baseadas no código PagBank
          if (encryptedError.pagbankCode === 'BRAND_NOT_FOUND' || errorMessage.includes('BRAND_NOT_FOUND')) {
            if (pagbankEnvironment && !pagbankEnvironment.isSandbox) {
              errorMessage = 'Bandeira do cartão não reconhecida. Verifique se o número do cartão está correto. Cartões de teste não funcionam em produção.'
            } else {
              errorMessage = 'Bandeira do cartão não reconhecida. Verifique o número do cartão ou use um dos cartões de teste válidos.'
            }
          } else if (errorMessage.includes('criptografia') || errorMessage.includes('encrypt')) {
            errorMessage = 'Erro na criptografia do cartão. Verifique se os dados estão corretos e tente novamente.'
          } else if (errorMessage.includes('DECLINED') || errorMessage.includes('recusado')) {
            errorMessage = 'Pagamento recusado pela operadora. Verifique os dados do cartão ou tente outro cartão.'
          } else if (errorMessage.includes('network') || errorMessage.includes('timeout')) {
            errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.'
          }

          throw new Error(errorMessage)
        }

      } else if (formData.paymentMethod === 'pix') {
        // Pagamento PIX
        console.log('📱 Gerando PIX...')

        const paymentData = {
          planData,
          customerData
        }

        result = await paymentService.createPagBankPixPayment(paymentData)

      } /* else if (formData.paymentMethod === 'pay_later') {
        // Boleto
        console.log('📄 Gerando boleto...')

        const paymentData = {
          planData,
          customerData
        }

        result = await paymentService.createPagBankBoletoPayment(paymentData)
      } */

      console.log('✅ Resposta do pagamento recebida:', result)

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
      } /* else if (formData.paymentMethod === 'pay_later') {
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
      } */

      // Para cartão, verificar status do pagamento antes de marcar como sucesso
      const chargeStatus = result.charges?.[0]?.status
      const paymentCode = result.charges?.[0]?.payment_response?.code
      const paymentMessage = result.charges?.[0]?.payment_response?.message

      console.log('💳 Status do pagamento:', { chargeStatus, paymentCode, paymentMessage })

      // Verificar se o pagamento foi realmente aprovado
      if (chargeStatus === 'PAID' || chargeStatus === 'AUTHORIZED') {
        console.log('✅ Pagamento aprovado com status:', chargeStatus)
        setPaymentSuccess(true)
      } else if (chargeStatus === 'DECLINED') {
        // Pagamento recusado
        const declineReason = paymentMessage || 'Pagamento recusado pela operadora do cartão'
        console.error('❌ Pagamento recusado:', declineReason)
        throw new Error(`Pagamento recusado: ${declineReason}. Por favor, verifique os dados do cartão ou tente outro cartão.`)
      } else if (chargeStatus === 'IN_ANALYSIS') {
        // Pagamento em análise de fraude
        console.log('🔍 Pagamento em análise')
        setPaymentSuccess(true)
        // Informar ao usuário que está em análise
      } else if (chargeStatus === 'CANCELED') {
        throw new Error('Pagamento cancelado. Por favor, tente novamente.')
      } else {
        // Status desconhecido ou não retornado - verificar se há erro
        console.warn('⚠️ Status não reconhecido:', chargeStatus, 'Resposta completa:', result)
        // Se não conseguimos determinar o status, verificar se a ordem foi criada
        if (result.id && result.charges?.length > 0) {
          // Ordem foi criada, mas status incerto - mostrar mensagem mais cautelosa
          setPaymentSuccess(true)
        } else {
          throw new Error('Não foi possível processar o pagamento. Por favor, tente novamente.')
        }
      }

      // Registrar assinatura de contrato/termos
      try {
        await registerContractSignature(customerData, planData, result)
      } catch (contractError) {
        console.warn('⚠️ Erro ao registrar assinatura de contrato:', contractError)
        // Não falhar o pagamento por causa disso
      }

      // Salvar conta pendente no Firestore como backup
      console.log('📝 Salvando conta pendente como backup...')
      try {
        const chargeStatus = result.charges?.[0]?.status || 'PAID'
        const pendingResult = await pendingAccountService.savePendingAccount({
          email: formData.email,
          password: formData.password,
          customerName: customerData.name,
          cpf: formData.cpf,
          phone: formData.phone,
          planId: selectedPlan?.id || 'plan_' + selectedPlan?.name,
          planName: selectedPlan?.name || '',
          planPrice: planData.price,
          audience: audience,
          orderId: result?.id || '',
          chargeStatus
        })
        console.log('✅ Conta pendente salva:', pendingResult)
      } catch (pendingError) {
        console.warn('⚠️ Erro ao salvar conta pendente:', pendingError.message)
      }

      // Criar conta Firebase automaticamente via backend
      console.log('🔑 Criando conta Firebase via backend...')
      try {
        const provisionResult = await paymentService.provisionUser({
          email: formData.email,
          password: formData.password,
          planId: selectedPlan?.id || 'plan_' + selectedPlan?.name,
          audience: audience,
          customerName: customerData.name,
          orderId: result?.id || ''
        })
        console.log('✅ Conta Firebase criada:', provisionResult)
      } catch (provisionError) {
        console.warn('⚠️ Erro ao criar conta Firebase automaticamente:', provisionError.message)
        // Log detalhes do erro para debugging
        if (provisionError.response?.data) {
          console.warn('   Detalhes:', JSON.stringify(provisionError.response.data))
        }
        // Não falhar o pagamento — a conta pendente já foi salva para o admin criar manualmente
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
  /* const copyBoletoCode = async () => {
    if (boletoData?.barcode || boletoData?.formattedBarcode) {
      try {
        await navigator.clipboard.writeText(boletoData.formattedBarcode || boletoData.barcode)
        setCopiedToClipboard(true)
        setTimeout(() => setCopiedToClipboard(false), 3000)
      } catch (err) {
        console.error('Erro ao copiar:', err)
      }
    }
  } */

  // Função para verificar status do pagamento
  const checkPaymentStatus = useCallback(async () => {
    const orderId = pixData?.orderId
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

        // Se for usuário novo, criar conta automaticamente
        if (!user && formData.email && formData.password) {
          // Salvar conta pendente como backup
          try {
            console.log('👤 PIX confirmado — salvando conta pendente...')
            await pendingAccountService.savePendingAccount({
              email: formData.email,
              password: formData.password,
              customerName: formData.fullName,
              cpf: formData.cpf,
              phone: formData.phone,
              planId: selectedPlan?.id || 'plan_' + selectedPlan?.name,
              planName: selectedPlan?.name || '',
              planPrice: planData?.price,
              audience: audience,
              orderId: pixData?.orderId || '',
              chargeStatus: chargeStatus
            })
            console.log('✅ Conta pendente salva após PIX')
          } catch (pendingError) {
            console.warn('⚠️ Erro ao salvar conta pendente após PIX:', pendingError.message)
          }

          // Criar conta Firebase automaticamente via backend
          try {
            console.log('🔑 Criando conta Firebase após PIX via backend...')
            const provisionResult = await paymentService.provisionUser({
              email: formData.email,
              password: formData.password,
              planId: selectedPlan?.id || 'plan_' + selectedPlan?.name,
              audience: audience,
              customerName: formData.fullName,
              orderId: pixData?.orderId || ''
            })
            console.log('✅ Conta Firebase criada após PIX:', provisionResult)
          } catch (provisionError) {
            console.warn('⚠️ Erro ao criar conta Firebase após PIX:', provisionError.message)
            // Log detalhes do erro para debugging
            if (provisionError.response?.data) {
              console.warn('   Detalhes:', JSON.stringify(provisionError.response.data))
            }
          }
        }
      }
    } catch (error) {
      console.error('Erro ao verificar status:', error)
    } finally {
      setCheckingPayment(false)
    }
  }, [pixData?.orderId])

  // Polling para verificar pagamento a cada 10 segundos
  useEffect(() => {
    if (awaitingPayment && pixData) {
      const interval = setInterval(() => {
        checkPaymentStatus()
      }, 10000) // Verificar a cada 10 segundos

      return () => clearInterval(interval)
    }
  }, [awaitingPayment, pixData, checkPaymentStatus])

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

  const formatCEP = (value) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length <= 8) {
      return cleaned.replace(/(\d{5})(\d)/, '$1-$2')
    }
    return value
  }

  // Função fallback para detecção de bandeira se hook falhar
  const detectCardBrandFallback = (cardNumber) => {
    const number = cardNumber.replace(/\s/g, '')

    if (/^4/.test(number)) return 'visa'
    if (/^5[1-5]/.test(number)) return 'mastercard'
    if (/^3[47]/.test(number)) return 'amex'
    if (/^6011|65/.test(number)) return 'discover'
    if (/^35/.test(number)) return 'jcb'
    if (/^30[0-5]|36|38/.test(number)) return 'diners'
    if (/^50|5[6-9]|6[0-9]/.test(number)) return 'maestro'
    if (/^40117[8-9]|^431274|^438935|^451416|^457393|^504175|^627780|^636297|^636368/.test(number)) return 'elo'
    if (/^606282/.test(number)) return 'hipercard'

    return 'unknown'
  }

  const handleInputChange = (field, value) => {
    let formattedValue = value
    if (field === 'cardNumber') {
      formattedValue = formatCardNumber(value)

      console.log('💳 ========= DETECÇÃO DE BANDEIRA =========')
      console.log('💳 Valor original:', value)
      console.log('💳 Valor formatado:', formattedValue)
      // Detectar bandeira do cartão
      let brand = 'unknown'

      try {
        brand = paymentService.getCardBrand(formattedValue)
        console.log('💳 Bandeira detectada:', brand)
      } catch (error) {
        console.warn('⚠️ Erro ao detectar bandeira, usando fallback:', error)
        brand = detectCardBrandFallback(formattedValue)
        console.log('💳 Bandeira detectada via fallback:', brand)
      }

      setCardBrand(brand)
      console.log('💳 Bandeira final definida:', brand)
      console.log('💳 ==========================================')
    }
    else if (field === 'expiryDate') formattedValue = formatExpiryDate(value)
    else if (field === 'cvv') formattedValue = value.replace(/\D/g, '').slice(0, 4)
    else if (field === 'cpf') formattedValue = formatCPF(value)
    else if (field === 'phone') formattedValue = formatPhone(value)
    else if (field === 'cep') formattedValue = formatCEP(value)
    else if (field === 'cardName') formattedValue = value.toUpperCase()

    // Log quando método de pagamento mudar
    if (field === 'paymentMethod') {
      console.log('💳 Método de pagamento alterado para:', value)
    }

    // Limpar cidade quando estado mudar
    if (field === 'estado') {
      setFormData(prev => ({ ...prev, [field]: formattedValue, cidade: '' }))
    } else {
      setFormData(prev => ({ ...prev, [field]: formattedValue }))
    }
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

    // Validações de endereço (sempre obrigatórias se usuário não estiver logado)
    if (!user) {
      if (!formData.cep || formData.cep.replace(/\D/g, '').length !== 8) {
        newErrors.cep = 'CEP válido é obrigatório'
      }
      if (!formData.rua || formData.rua.trim().length < 3) {
        newErrors.rua = 'Rua é obrigatória'
      }
      if (!formData.numero || formData.numero.trim().length < 1) {
        newErrors.numero = 'Número é obrigatório'
      }
      if (!formData.estado) {
        newErrors.estado = 'Estado é obrigatório'
      }
      if (!formData.cidade || formData.cidade.trim().length < 2) {
        newErrors.cidade = 'Cidade é obrigatória'
      }
    }

    // Validações específicas para cartão de crédito
    if (formData.paymentMethod === 'card') {
      // Se não há cartão salvo selecionado, validar campos do novo cartão
      if (!selectedSavedCard) {
        if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length < 13) {
          newErrors.cardNumber = 'Número do cartão é obrigatório'
        }
        if (!formData.cardName || formData.cardName.trim().length < 2) {
          newErrors.cardName = 'Nome do titular é obrigatório'
        }
        if (!formData.expiryDate || !/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
          newErrors.expiryDate = 'Data de validade é obrigatória (MM/AA)'
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

    // Validação dos termos
    if (!acceptTerms) {
      newErrors.acceptTerms = 'Você deve aceitar os termos de uso e política de privacidade para continuar'
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

      {/* Tela de aguardar pagamento Boleto - COMENTADA */}

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
                  {pagbankEnvironment && !pagbankEnvironment.isSandbox && paymentError.includes('Bandeira') && (
                    <p className="text-xs text-red-500 mt-2">
                      Dica: O sistema está em modo <strong>produção</strong>. Cartões de teste (sandbox) não são aceitos. Use um cartão real ou altere para modo sandbox no backend.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {pagbankEnvironment?.isSandbox && (
            <div className="mb-6 max-w-4xl mx-auto">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                <p className="text-sm text-yellow-800">
                  <strong>Modo Sandbox (Testes)</strong> — Use cartões de teste da documentação PagBank. Pagamentos não serão cobrados.
                </p>
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

                        <div className="space-y-4 mt-6">
                          <h4 className="text-md font-medium text-slate-700">Endereço de Cobrança</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="cep">CEP *</Label>
                              <Input id="cep" placeholder="00000-000"
                                value={formData.cep} onChange={(e) => handleInputChange('cep', e.target.value)}
                                className={errors.cep ? 'border-red-500' : ''} />
                              {errors.cep && <p className="text-xs text-red-500 mt-1">{errors.cep}</p>}
                            </div>
                            <div>
                              <Label htmlFor="numero">Número *</Label>
                              <Input id="numero" placeholder="0000"
                                value={formData.numero} onChange={(e) => handleInputChange('numero', e.target.value)}
                                className={errors.numero ? 'border-red-500' : ''} />
                              {errors.numero && <p className="text-xs text-red-500 mt-1">{errors.numero}</p>}
                            </div>
                            <div className="col-span-2">
                              <Label htmlFor="rua">Rua *</Label>
                              <Input id="rua" placeholder="Ex: Rua João Pessoa"
                                value={formData.rua} onChange={(e) => handleInputChange('rua', e.target.value)}
                                className={errors.rua ? 'border-red-500' : ''} />
                              {errors.rua && <p className="text-xs text-red-500 mt-1">{errors.rua}</p>}
                            </div>
                            <div className="col-span-2">
                              <Label htmlFor="complemento">Complemento</Label>
                              <Input id="complemento" placeholder="Ex: Casa 3"
                                value={formData.complemento} onChange={(e) => handleInputChange('complemento', e.target.value)}
                                className={errors.complemento ? 'border-red-500' : ''} />
                              {errors.complemento && <p className="text-xs text-red-500 mt-1">{errors.complemento}</p>}
                            </div>
                            <div>
                              <Label htmlFor="estado">Estado *</Label>
                              <select
                                id="estado"
                                value={formData.estado}
                                onChange={(e) => handleInputChange('estado', e.target.value)}
                                className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.estado ? 'border-red-500' : ''}`}
                              >
                                <option value="">-- Selecione o estado --</option>
                                <option value="AC">Acre</option>
                                <option value="AL">Alagoas</option>
                                <option value="AP">Amapá</option>
                                <option value="AM">Amazonas</option>
                                <option value="BA">Bahia</option>
                                <option value="CE">Ceará</option>
                                <option value="DF">Distrito Federal</option>
                                <option value="ES">Espírito Santo</option>
                                <option value="GO">Goiás</option>
                                <option value="MA">Maranhão</option>
                                <option value="MT">Mato Grosso</option>
                                <option value="MS">Mato Grosso do Sul</option>
                                <option value="MG">Minas Gerais</option>
                                <option value="PA">Pará</option>
                                <option value="PB">Paraíba</option>
                                <option value="PR">Paraná</option>
                                <option value="PE">Pernambuco</option>
                                <option value="PI">Piauí</option>
                                <option value="RJ">Rio de Janeiro</option>
                                <option value="RN">Rio Grande do Norte</option>
                                <option value="RS">Rio Grande do Sul</option>
                                <option value="RO">Rondônia</option>
                                <option value="RR">Roraima</option>
                                <option value="SC">Santa Catarina</option>
                                <option value="SP">São Paulo</option>
                                <option value="SE">Sergipe</option>
                                <option value="TO">Tocantins</option>
                              </select>
                              {errors.estado && <p className="text-xs text-red-500 mt-1">{errors.estado}</p>}
                            </div>
                            <div>
                              <Label htmlFor="cidade">Cidade *</Label>
                              <select
                                id="cidade"
                                value={formData.cidade}
                                onChange={(e) => handleInputChange('cidade', e.target.value)}
                                className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.cidade ? 'border-red-500' : ''}`}
                                disabled={!formData.estado}
                              >
                                <option value="">-- Selecione a cidade --</option>
                                {formData.estado && estadosCidades[formData.estado]?.map(cidade => (
                                  <option key={cidade} value={cidade}>{cidade}</option>
                                ))}
                              </select>
                              {errors.cidade && <p className="text-xs text-red-500 mt-1">{errors.cidade}</p>}
                            </div>
                          </div>
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
                                  className={`relative cursor-pointer border-2 rounded-lg p-4 transition-all hover:border-brand-primary ${selectedSavedCard?.id === method.id
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
                              className={`relative cursor-pointer border-2 rounded-lg p-4 transition-all hover:border-brand-primary ${!selectedSavedCard && formData.paymentMethod === 'card'
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
                          className={`relative cursor-pointer border-2 rounded-lg p-4 transition-all hover:border-brand-primary ${formData.paymentMethod === 'card'
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
                          className={`relative cursor-pointer border-2 rounded-lg p-4 transition-all hover:border-brand-primary ${formData.paymentMethod === 'pix'
                            ? 'border-brand-primary bg-brand-primary/5'
                            : 'border-gray-200'
                            }`}
                          onClick={() => handleInputChange('paymentMethod', 'pix')}
                        >
                          <div className="flex flex-col items-center text-center space-y-3">
                            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                              <svg className="w-8 h-8 text-teal-600" viewBox="0 0 32 32" fill="currentColor">
                                <path d="M11.4 4h9.2A7.4 7.4 0 0 1 28 11.4v9.2a7.4 7.4 0 0 1-7.4 7.4h-9.2A7.4 7.4 0 0 1 4 20.6v-9.2A7.4 7.4 0 0 1 11.4 4zm0 1.6A5.8 5.8 0 0 0 5.6 11.4v9.2a5.8 5.8 0 0 0 5.8 5.8h9.2a5.8 5.8 0 0 0 5.8-5.8v-9.2a5.8 5.8 0 0 0-5.8-5.8h-9.2z" />
                                <path d="M21.9 11.8c0 .9-.7 1.6-1.6 1.6s-1.6-.7-1.6-1.6.7-1.6 1.6-1.6 1.6.7 1.6 1.6zM13.3 11.8c0 .9-.7 1.6-1.6 1.6s-1.6-.7-1.6-1.6.7-1.6 1.6-1.6 1.6.7 1.6 1.6z" />
                                <path d="M10.1 16h11.8c.4 0 .8.4.8.8s-.4.8-.8.8H10.1c-.4 0-.8-.4-.8-.8s.4-.8.8-.8z" />
                                <path d="M13.3 20.2c0 .9-.7 1.6-1.6 1.6s-1.6-.7-1.6-1.6.7-1.6 1.6-1.6 1.6.7 1.6 1.6zM21.9 20.2c0 .9-.7 1.6-1.6 1.6s-1.6-.7-1.6-1.6.7-1.6 1.6-1.6 1.6.7 1.6 1.6z" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 text-lg">PIX</p>
                            </div>
                          </div>
                        </div>

                        {/* Boleto */}
                        {/* <div
                          className={`relative cursor-pointer border-2 rounded-lg p-4 transition-all hover:border-brand-primary ${formData.paymentMethod === 'pay_later'
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
                        </div> */}
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

                      {/* {formData.paymentMethod === 'pay_later' && (
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
                      )} */}
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
                                  <Label htmlFor="cardNumber">Número do Cartão *</Label>
                                  <div className="relative">
                                    <Input id="cardNumber" placeholder="0000 0000 0000 0000" maxLength={19}
                                      value={formData.cardNumber} onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                                      className={`pl-10 pr-20 ${errors.cardNumber ? 'border-red-500' : ''}`} />
                                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    {cardBrand && cardBrand !== 'unknown' && (
                                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                        <CardBrandIcon brand={cardBrand} className="text-xs" />
                                      </div>
                                    )}
                                  </div>
                                  {errors.cardNumber && <p className="text-xs text-red-500 mt-1">{errors.cardNumber}</p>}
                                  {cardBrand && cardBrand !== 'unknown' && (
                                    <p className="text-xs text-green-600 mt-1">✓ Bandeira detectada: {cardBrand.toUpperCase()}</p>
                                  )}
                                </div>
                                <div>
                                  <Label htmlFor="cardName">Nome do Titular *</Label>
                                  <Input id="cardName" placeholder="NOME DO TITULAR"
                                    value={formData.cardName} onChange={(e) => handleInputChange('cardName', e.target.value)}
                                    className={errors.cardName ? 'border-red-500' : ''} />
                                  {errors.cardName && <p className="text-xs text-red-500 mt-1">{errors.cardName}</p>}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="expiryDate">Validade *</Label>
                                    <div className="relative">
                                      <Input id="expiryDate" placeholder="MM/AA" maxLength={5}
                                        value={formData.expiryDate} onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                                        className={`pl-10 ${errors.expiryDate ? 'border-red-500' : ''}`} />
                                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    </div>
                                    {errors.expiryDate && <p className="text-xs text-red-500 mt-1">{errors.expiryDate}</p>}
                                  </div>
                                  <div>
                                    <Label htmlFor="cvv">CVV *</Label>
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
                                  <Label htmlFor="cvv">CVV *</Label>
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
                                    <SelectContent className="bg-white">
                                      {installmentOptions.map((option) => (
                                        <SelectItem key={option.quantity} value={option.quantity.toString()}>
                                          {option.quantity}x de R$ {option.amount.toFixed(2)}
                                          {option.quantity > 1 && option.total > 0 && ` (Total: R$ ${option.total.toFixed(2)})`}
                                          {!option.interest_free && option.fees?.buyer_interest ? ` (+R$ ${option.fees.buyer_interest.toFixed(2)} juros)` : ''}
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
                                {loadingInstallments ? (
                                  <div className="border rounded-md p-3 bg-gray-50">
                                    <div className="flex items-center gap-2 text-gray-500">
                                      <RefreshCw className="w-4 h-4 animate-spin" />
                                      <span className="text-sm">Carregando opções de parcelamento...</span>
                                    </div>
                                  </div>
                                ) : (
                                  <Select value={selectedInstallments.toString()} onValueChange={(value) => setSelectedInstallments(parseInt(value))}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Selecione as parcelas" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white">
                                      {installmentOptions.length > 0 ? (
                                        installmentOptions.map((option) => (
                                          <SelectItem key={option.quantity} value={option.quantity.toString()}>
                                            {option.quantity}x de R$ {(Number(option.amount) || 0).toFixed(2)}
                                            {option.quantity > 1 && (Number(option.total) || 0) > 0 && ` (Total: R$ ${(Number(option.total) || 0).toFixed(2)})`}
                                            {!option.interest_free && option.fees?.buyer_interest ? ` (+R$ ${(Number(option.fees.buyer_interest) || 0).toFixed(2)} juros)` : ''}
                                          </SelectItem>
                                        ))
                                      ) : (
                                        <SelectItem value="1" disabled>
                                          Nenhuma opção disponível
                                        </SelectItem>
                                      )}
                                    </SelectContent>
                                  </Select>
                                )}
                                {installmentOptions.length === 0 && !loadingInstallments && (
                                  <p className="text-xs text-red-500 mt-1">Erro ao consultar taxas de parcelamento na API</p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}

                    <Separator />

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <input
                            type="checkbox"
                            id="acceptTerms"
                            checked={acceptTerms}
                            onChange={(e) => setAcceptTerms(e.target.checked)}
                            className="mt-1"
                          />
                          <label htmlFor="acceptTerms" className="text-sm text-slate-600">
                            Eu aceito os <a href="/termos-servico" target="_blank" rel="noopener noreferrer" className="text-brand-primary underline">termos de uso</a> e <a href="/politica-privacidade" target="_blank" rel="noopener noreferrer" className="text-brand-primary underline">política de privacidade</a> *
                          </label>
                        </div>
                        {errors.acceptTerms && <p className="text-xs text-red-500">{errors.acceptTerms}</p>}
                      </div>
                      <Button
                        size="lg"
                        className="w-full bg-brand-primary hover:bg-brand-secondary text-white py-4 text-lg font-semibold"
                        onClick={handlePaymentSubmit}
                        disabled={isLoading || !acceptTerms}
                      >
                        {isLoading ? 'Processando...' : (
                          <>
                            {formData.paymentMethod === 'pix' && 'Gerar PIX'}
                            {/* {formData.paymentMethod === 'pay_later' && 'Gerar Boleto'} */}
                            {formData.paymentMethod === 'card' && 'Finalizar Pagamento'}
                          </>
                        )}
                      </Button>
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
                        <p className="font-medium">{selectedPlan.name}</p>
                        {isYearly && <p className="text-sm text-slate-600">Cobrança Anual</p>}
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
                      </div>
                    </div>
                    {isYearly && (
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-sm text-green-800 font-medium">{installments}x de R$ {installmentValue}</p>
                      </div>
                    )}
                    {formData.paymentMethod === 'card' && selectedInstallments > 1 && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-blue-800 font-medium">
                          {selectedInstallments}x de R$ {(Number(installmentOptions.find(opt => opt.quantity === selectedInstallments)?.amount) || 0).toFixed(2)}
                        </p>
                        {(() => {
                          const selectedOption = installmentOptions.find(opt => opt.quantity === selectedInstallments);
                          const total = Number(selectedOption?.total) || 0;
                          if (total > 0) {
                            return (
                              <p className="text-xs text-blue-600 mt-1">
                                Total: R$ {total.toFixed(2)}
                                {!selectedOption?.interest_free && selectedOption?.fees?.buyer_interest ? ` (+R$ ${(Number(selectedOption.fees.buyer_interest) || 0).toFixed(2)} juros)` : ''}
                              </p>
                            );
                          }
                          return null;
                        })()}
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
                  <p className="text-sm text-slate-600">Pagamento efetuado com sucesso!</p>
                  <p className="text-2xl font-bold text-brand-primary">{selectedPlan.name}</p>
                </div>
                <Separator />
                <div className="space-y-3 text-left">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Valor</span>
                    <span className="font-medium text-lg">R$ {total.toFixed(2)}</span>
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

              </CardContent>
            </Card>
            <div className="flex justify-center pt-8">
              <Button size="lg" className="bg-brand-primary hover:bg-brand-secondary" onClick={() => navigate('/')}>
                Retornar à home
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Pagamento
