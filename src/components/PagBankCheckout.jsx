import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { CreditCard, Smartphone, FileText, Loader2, CheckCircle2, AlertCircle, Copy } from 'lucide-react'
import { paymentService } from '@/services/payment'
import { toast } from 'sonner'

const PaymentMethodCard = ({ icon: Icon, title, description, isSelected, onClick, isDisabled = false }) => ( // eslint-disable-line no-unused-vars
  <Card 
    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
      isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
    } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    onClick={!isDisabled ? onClick : undefined}
  >
    <CardContent className="flex items-center p-4">
      <Icon className={`w-6 h-6 mr-3 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
      <div className="flex-1">
        <h3 className={`font-medium ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
          {title}
        </h3>
        <p className={`text-sm ${isSelected ? 'text-blue-700' : 'text-gray-600'}`}>
          {description}
        </p>
      </div>
      {isSelected && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
    </CardContent>
  </Card>
)

const PixPayment = ({ paymentData, onError, onSuccess }) => {
  const [pixData, setPixData] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [timeLeft, setTimeLeft] = useState(86400) // 24 horas (86400 segundos)
  const [hasValidData, setHasValidData] = useState(false)
  const [isCheckingPayment, setIsCheckingPayment] = useState(false)

  // Verificar se os dados necessários estão preenchidos
  const checkValidData = useCallback(() => {
    const { customerData } = paymentData
    const isValid = customerData.name && 
                   customerData.email && 
                   customerData.cpf && 
                   customerData.phone &&
                   customerData.name.trim().length > 0 &&
                   customerData.email.includes('@') &&
                   customerData.cpf.replace(/\D/g, '').length >= 11 &&
                   customerData.phone.replace(/\D/g, '').length >= 10
    
    setHasValidData(isValid)
    return isValid
  }, [paymentData])

  const generatePix = useCallback(async () => {
    if (!checkValidData()) {
      onError('Por favor, preencha todos os dados pessoais antes de gerar o PIX')
      return
    }

    setIsGenerating(true)
    try {
      console.log('🔄 Gerando PIX com PagBank...')
      const result = await paymentService.createPagBankPixPayment(paymentData)

      console.log('📦 Resposta do PagBank:', result)

      // A resposta agora tem qr_codes em vez de charges
      if (result.qr_codes && result.qr_codes[0]) {
        setPixData(result)
        
        // Calcular tempo de expiração real baseado na resposta da API
        const expirationDate = new Date(result.qr_codes[0].expiration_date)
        const now = new Date()
        const timeUntilExpiry = Math.max(0, Math.floor((expirationDate - now) / 1000))
        setTimeLeft(timeUntilExpiry)
        
        const pixCode = result.qr_codes[0].text
        console.log('✅ PIX gerado:', {
          id: result.qr_codes[0].id,
          text: pixCode ? 'Código PIX OK' : 'Código PIX ausente',
          code_length: pixCode ? pixCode.length : 0,
          code_preview: pixCode ? `${pixCode.substring(0, 50)}...` : 'N/A',
          image_url: result.qr_codes[0].links?.find(l => l.media === 'image/png')?.href || 'Imagem não encontrada',
          expires_in: `${Math.floor(timeUntilExpiry / 60)}min`
        })
        
        // Validar formato básico do código PIX
        if (pixCode && pixCode.length > 100 && pixCode.startsWith('00020101')) {
          console.log('✅ Código PIX parece válido (formato EMV)')
        } else {
          console.warn('⚠️ Código PIX pode estar em formato não padrão')
        }
        
        toast.success('Código PIX gerado com sucesso!')
      } else {
        throw new Error('Dados do PIX não retornados pela API')
      }
    } catch (error) {
      console.error('❌ Erro ao gerar PIX:', error)
      toast.error('Erro ao gerar PIX: ' + error.message)
      onError('Erro ao gerar PIX: ' + error.message)
    } finally {
      setIsGenerating(false)
    }
  }, [paymentData, onError, checkValidData])

  useEffect(() => {
    checkValidData()
  }, [paymentData.customerData, checkValidData])

  useEffect(() => {
    if (pixData && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft, pixData])

  // Polling para verificar status do pagamento PIX
  useEffect(() => {
    if (!pixData || isCheckingPayment) return

    const checkPaymentStatus = async () => {
      try {
        setIsCheckingPayment(true)
        console.log('🔍 Verificando status do pagamento PIX...')

        const statusResponse = await paymentService.getPagBankPaymentStatus(pixData.id)
        console.log('📊 Status do PIX:', statusResponse)

        // Verificar se o pagamento foi aprovado
        const charge = statusResponse.charges?.[0]
        if (charge && charge.status === 'PAID') {
          console.log('✅ Pagamento PIX aprovado!')
          toast.success('Pagamento PIX confirmado!')

          // Chamar callback de sucesso
          if (onSuccess) {
            onSuccess({
              transaction_id: pixData.id,
              amount: paymentData.planData.price,
              payment_method: 'pix',
              status: 'paid'
            })
          }

          return true // Pagamento confirmado
        } else if (charge && charge.status === 'CANCELLED') {
          console.log('❌ Pagamento PIX cancelado')
          toast.error('Pagamento PIX foi cancelado')
          return false
        }
      } catch (error) {
        console.error('❌ Erro ao verificar status do PIX:', error)
        // Não mostrar erro para o usuário, apenas log
      } finally {
        setIsCheckingPayment(false)
      }
      return false
    }

    // Verificar status a cada 5 segundos nos primeiros 2 minutos, depois a cada 10 segundos
    const interval = timeLeft > 7080 ? 5000 : 10000 // 7080 = 2 horas - 2 minutos

    const statusTimer = setInterval(checkPaymentStatus, interval)

    // Verificar imediatamente na primeira vez
    checkPaymentStatus()

    return () => clearInterval(statusTimer)
  }, [pixData, timeLeft, isCheckingPayment, paymentData.planData.price, onSuccess])

  const copyPixCode = () => {
    if (pixData?.qr_codes?.[0]?.text) {
      // Limpar o código PIX removendo possíveis espaços ou quebras de linha
      const cleanPixCode = pixData.qr_codes[0].text.replace(/\s+/g, '').trim()
      navigator.clipboard.writeText(cleanPixCode)
      toast.success('Código PIX copiado e limpo!')
      
      // Log para debug
      console.log('📋 Código PIX copiado:', {
        original_length: pixData.qr_codes[0].text.length,
        cleaned_length: cleanPixCode.length,
        preview: `${cleanPixCode.substring(0, 50)}...`
      })
    }
  }

  const validatePixCode = (pixCode) => {
    if (!pixCode) return { valid: false, message: 'Código ausente' }
    
    // Validações básicas do formato EMV QR Code para PIX
    if (pixCode.length < 100) {
      return { valid: false, message: 'Código muito curto' }
    }
    
    if (!pixCode.startsWith('0002')) {
      return { valid: false, message: 'Formato inválido - deve começar com 0002' }
    }
    
    if (!pixCode.includes('br.gov.bcb.pix')) {
      return { valid: false, message: 'Não é um código PIX válido' }
    }
    
    return { valid: true, message: 'Código válido' }
  }

  const generateNewPix = () => {
    setPixData(null)
    setTimeLeft(7200) // Reset to 2 hours
    generatePix()
  }

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}h${mins.toString().padStart(2, '0')}m`
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Se os dados não estão válidos, mostrar mensagem
  if (!hasValidData) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-8">
          <AlertCircle className="w-8 h-8 text-yellow-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Dados Necessários</h3>
          <p className="text-gray-600 text-center mb-4">
            Preencha todos os dados pessoais acima antes de gerar o PIX:
          </p>
          <ul className="text-sm text-gray-600 text-left space-y-1">
            <li>• Nome completo</li>
            <li>• E-mail válido</li>
            <li>• CPF completo</li>
            <li>• Telefone com DDD</li>
          </ul>
        </CardContent>
      </Card>
    )
  }

  if (isGenerating) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-8">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-600">Gerando código PIX...</p>
        </CardContent>
      </Card>
    )
  }

  if (!pixData) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-8">
          <AlertCircle className="w-8 h-8 text-blue-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Gerar PIX</h3>
          <p className="text-gray-600 text-center mb-4">
            Clique no botão abaixo para gerar seu código PIX
          </p>
          <Button onClick={generatePix} className="w-full">
            Gerar Código PIX
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Smartphone className="w-5 h-5 mr-2" />
            Pagamento PIX
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {timeLeft <= 0 ? (
            // PIX Expirado
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-red-700">PIX Expirado</h3>
              <p className="text-gray-600 mb-4">
                O código PIX expirou. Clique no botão abaixo para gerar um novo código.
              </p>
              <Button onClick={generateNewPix} className="w-full">
                Gerar Novo PIX
              </Button>
            </div>
          ) : (
            // PIX Ativo
            <div className="text-center">
              <Badge 
                variant="outline" 
                className={`mb-4 ${timeLeft < 300 ? 'border-red-300 text-red-700' : ''}`}
              >
                {timeLeft < 300 && '⚠️ '} Expira em {formatTime(timeLeft)}
              </Badge>
              
              {/* QR Code real do PagBank */}
              <div className="w-64 h-64 mx-auto mb-4 flex items-center justify-center">
                {pixData.qr_codes?.[0]?.links?.find(l => l.media === 'image/png')?.href ? (
                  <img 
                    src={pixData.qr_codes[0].links.find(l => l.media === 'image/png').href} 
                    alt="QR Code PIX" 
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      console.error('Erro ao carregar imagem QR Code:', e)
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                ) : null}
                <div className="w-full h-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center" 
                     style={{ display: pixData.qr_codes?.[0]?.links?.find(l => l.media === 'image/png')?.href ? 'none' : 'flex' }}>
                  <div className="text-center">
                    <p className="text-gray-500 text-sm mb-2">QR Code PIX</p>
                    <p className="text-xs text-gray-400">Use o código abaixo</p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                Escaneie o QR Code com o app do seu banco ou copie o código PIX
              </p>              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-xs text-blue-800 font-semibold mb-1">💡 Como usar:</p>
                <p className="text-xs text-blue-700">
                  • <strong>Pelo app:</strong> Escaneie o QR Code acima<br/>
                  • <strong>Por código:</strong> Copie o código abaixo e cole no seu app bancário<br/>
                  • <strong>Problemas?</strong> Certifique-se de copiar todo o código sem espaços extras
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600 mb-2">Código PIX:</p>
                <div className="flex items-start justify-between bg-white p-3 rounded border">
                  <div className="flex-1 mr-2">
                    <p className="text-xs font-mono break-all leading-relaxed">
                      {pixData.qr_codes?.[0]?.text || 'Código não disponível'}
                    </p>
                    {pixData.qr_codes?.[0]?.text && (() => {
                      const validation = validatePixCode(pixData.qr_codes[0].text)
                      return (
                        <p className={`text-xs mt-2 ${validation.valid ? 'text-green-600' : 'text-red-600'}`}>
                          {validation.valid ? '✅' : '❌'} {validation.message} ({pixData.qr_codes[0].text.length} caracteres)
                        </p>
                      )
                    })()}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={copyPixCode}
                      className="shrink-0"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        const validation = validatePixCode(pixData.qr_codes[0].text)
                        toast.info(`Validação: ${validation.message}`)
                      }}
                      className="shrink-0 text-xs"
                      title="Validar código PIX"
                    >
                      🔍
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {timeLeft > 0 && (
            <>
              <Separator />
              <div className="text-center text-sm text-gray-600">
                <p>Após o pagamento, você receberá uma confirmação por email.</p>
                <p className="mt-2">
                  <strong>Valor:</strong> R$ {paymentData.planData.price.toFixed(2)}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

const BoletoPayment = ({ paymentData, onError }) => {
  const [boletoData, setBoletoData] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const generateBoleto = useCallback(async () => {
    setIsGenerating(true)
    try {
      // TODO: Implementar geração de boleto via PagBank
      // const result = await paymentService.createPagBankBoletoPayment(paymentData)
      // setBoletoData(result)
      
      // Placeholder temporário
      setTimeout(() => {
        setBoletoData({
          boleto_url: '#',
          due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')
        })
        setIsGenerating(false)
      }, 2000)
    } catch (error) {
      onError('Erro ao gerar boleto: ' + error.message)
      setIsGenerating(false)
    }
  }, [onError])

  useEffect(() => {
    generateBoleto()
  }, [generateBoleto])

  if (isGenerating) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-8">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-600">Gerando boleto...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          Boleto Bancário
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-800">Instruções do Boleto</h4>
              <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                <li>• Vencimento: {boletoData?.due_date}</li>
                <li>• Pagamento em qualquer banco, casa lotérica ou internet banking</li>
                <li>• Aprovação em até 2 dias úteis após o pagamento</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Button 
            onClick={() => window.open(boletoData?.boleto_url, '_blank')}
            className="w-full"
            disabled={!boletoData?.boleto_url}
          >
            <FileText className="w-4 h-4 mr-2" />
            Baixar Boleto
          </Button>
        </div>

        <Separator />

        <div className="text-center text-sm text-gray-600">
          <p>
            <strong>Valor:</strong> R$ {paymentData.planData.price.toFixed(2)}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

const RecurringPayment = ({ paymentData, onSuccess, onError, validateBeforeSubmit }) => {
  const [isCreating, setIsCreating] = useState(false)
  const [subscriptionData, setSubscriptionData] = useState(null)

  const createRecurringPayment = async () => {
    // Validar formulário antes de prosseguir
    if (validateBeforeSubmit && !validateBeforeSubmit()) {
      toast.error('Por favor, preencha todos os campos obrigatórios corretamente')
      return
    }

    setIsCreating(true)
    try {
      console.log('🔄 Criando assinatura recorrente com PagBank...')
      console.log('📦 Dados enviados:', {
        planData: paymentData.planData,
        customerData: { ...paymentData.customerData, cpf: '***' },
        hasCardData: !!paymentData.cardData
      })
      
      const result = await paymentService.createPagBankSubscription({
        planData: paymentData.planData,
        customerData: paymentData.customerData,
        cardData: paymentData.cardData,
        paymentMethod: 'CREDIT_CARD' // Usar cartão de crédito para recorrência
      })

      console.log('✅ Assinatura criada:', result)
      setSubscriptionData(result)
      
      toast.success('Assinatura criada com sucesso!')
      onSuccess(result)
    } catch (error) {
      console.error('❌ Erro ao criar assinatura:', error)
      
      let errorMessage = 'Erro ao criar assinatura'
      
      // Tratar diferentes tipos de erro
      if (error.response) {
        // Erro da API
        const status = error.response.status
        const data = error.response.data
        
        if (status === 500 || status === 502 || status === 503) {
          errorMessage = 'Erro no servidor. Por favor, verifique se o backend está rodando.'
        } else if (status === 403) {
          errorMessage = 'Token PagBank não autorizado. Verifique a configuração do backend.'
        } else if (status === 404) {
          errorMessage = 'Endpoint não encontrado. Verifique se o backend está atualizado.'
        } else if (data?.details?.error_messages) {
          // Tratar erros específicos do PagBank
          const pagbankError = data.details.error_messages[0]
          if (pagbankError?.parameter_name === 'email' && pagbankError?.description?.includes('merchant')) {
            errorMessage = 'O email informado não pode ser o mesmo email da conta PagBank do comerciante. Use um email diferente.'
          } else if (pagbankError?.parameter_name === 'tax_id') {
            errorMessage = 'CPF inválido. Por favor, verifique os dígitos do CPF.'
          } else if (pagbankError?.description) {
            errorMessage = `Erro PagBank: ${pagbankError.description}`
          } else {
            errorMessage = data.error || `Erro ${status}: ${error.message}`
          }
        } else if (data?.error) {
          errorMessage = data.error
        } else {
          errorMessage = `Erro ${status}: ${error.message}`
        }
        
        console.error('📋 Detalhes do erro da API:', {
          status,
          data,
          message: error.message
        })
      } else if (error.request) {
        // Requisição enviada mas sem resposta
        errorMessage = 'Sem resposta do servidor. Verifique se o backend está rodando em http://localhost:5000'
        console.error('📋 Backend não respondeu. Verifique se está rodando.')
      } else {
        // Erro na configuração da requisição
        errorMessage = error.message || 'Erro desconhecido ao processar requisição'
      }
      
      toast.error(errorMessage, { duration: 10000 })
      onError(errorMessage)
    } finally {
      setIsCreating(false)
    }
  }

  if (!subscriptionData) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-8">
          <CreditCard className="w-12 h-12 text-blue-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Pagamento Recorrente</h3>
          <p className="text-gray-600 text-center mb-6">
            Crie sua assinatura recorrente do plano {paymentData.planData.name}. 
            A cobrança será automática todos os meses.
          </p>
          <Button onClick={createRecurringPayment} disabled={isCreating} className="w-full">
            {isCreating ? (
              <><Loader2 className="w-4 h-4 animate-spin mr-2" />Criando Assinatura...</>
            ) : (
              <><CreditCard className="w-4 h-4 mr-2" />Criar Assinatura Recorrente</>
            )}
          </Button>
          <p className="text-xs text-gray-500 mt-4 text-center">
            Após criar a assinatura, você receberá o boleto para o primeiro pagamento por email.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CheckCircle2 className="w-5 h-5 mr-2 text-green-600" />
          Assinatura Criada com Sucesso
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
          <div className="flex items-start">
            <CheckCircle2 className="w-6 h-6 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-bold text-green-900 text-lg">✅ Assinatura Criada com Sucesso!</h4>
              <p className="text-sm text-green-700 mt-2">
                Sua assinatura foi ativada e você receberá os detalhes por email.
              </p>
              {subscriptionData.subscription?.id && (
                <div className="mt-3 bg-green-100 rounded p-2">
                  <p className="text-xs text-green-700">ID da Assinatura:</p>
                  <p className="text-xs font-mono text-green-800 font-semibold mt-1">
                    {subscriptionData.subscription.id}
                  </p>
                </div>
              )}
              {subscriptionData.plan?.id && (
                <div className="mt-2 bg-green-100 rounded p-2">
                  <p className="text-xs text-green-700">ID do Plano:</p>
                  <p className="text-xs font-mono text-green-800 font-semibold mt-1">
                    {subscriptionData.plan.id}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <Separator />

        <div className="text-center text-sm text-gray-600">
          <p>
            <strong>Plano:</strong> {paymentData.planData.name}
          </p>
          <p className="mt-1">
            <strong>Valor mensal:</strong> R$ {paymentData.planData.price.toFixed(2)}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export function PagBankCheckout({ planData, customerData, cardData, isYearly, onSuccess, onError, validateBeforeSubmit }) {
  const [selectedMethod, setSelectedMethod] = useState(isYearly ? 'card' : 'recurring')

  const paymentMethods = [
    {
      id: 'recurring',
      icon: CreditCard,
      title: 'Assinatura Recorrente',
      description: 'Cobrança automática mensal (Recomendado)',
      component: RecurringPayment
    },
    {
      id: 'pix',
      icon: Smartphone,
      title: 'PIX (Pagamento Único)',
      description: 'Aprovação imediata, pagamento único',
      component: PixPayment
    },
    {
      id: 'boleto',
      icon: FileText,
      title: 'Boleto (Pagamento Único)',
      description: 'Aprovação em até 2 dias úteis',
      component: BoletoPayment
    }
  ]

  const handleMethodSelect = (methodId) => {
    setSelectedMethod(methodId)
  }

  const renderPaymentForm = () => {
    const method = paymentMethods.find(m => m.id === selectedMethod)
    
    if (method?.component) {
      const PaymentComponent = method.component
      return (
        <PaymentComponent
          paymentData={{ planData, customerData, cardData }}
          onSuccess={onSuccess}
          onError={onError}
          validateBeforeSubmit={validateBeforeSubmit}
        />
      )
    }

    return null
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Escolha a forma de pagamento</h3>
        <div className="grid gap-3">
          {paymentMethods.map((method) => (
            <PaymentMethodCard
              key={method.id}
              icon={method.icon}
              title={method.title}
              description={method.description}
              isSelected={selectedMethod === method.id}
              onClick={() => handleMethodSelect(method.id)}
            />
          ))}
        </div>
      </div>

      <div>
        {renderPaymentForm()}
      </div>
    </div>
  )
}

export default PagBankCheckout