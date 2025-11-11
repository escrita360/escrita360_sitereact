import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { CreditCard, Smartphone, FileText, Loader2, CheckCircle2, AlertCircle, Copy } from 'lucide-react'
import { paymentService } from '@/services/payment'
import { toast } from 'sonner'

const PaymentMethodCard = ({ icon: Icon, title, description, isSelected, onClick, isDisabled = false }) => {
  const IconComponent = Icon // Usar IconComponent para evitar warning
  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
      } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={!isDisabled ? onClick : undefined}
    >
      <CardContent className="flex items-center p-4">
        <IconComponent className={`w-6 h-6 mr-3 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
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
}

const PixPayment = ({ paymentData, onSuccess, onError }) => {
  const [pixData, setPixData] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [timeLeft, setTimeLeft] = useState(1800) // 30 minutos
  const [hasGenerated, setHasGenerated] = useState(false)

  useEffect(() => {
    if (hasGenerated && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft, hasGenerated])

  const generatePix = useCallback(async () => {
    setIsGenerating(true)
    try {
      const result = await paymentService.createPagBankPixPayment(paymentData)

      // A resposta agora tem qr_codes em vez de charges
      if (result.qr_codes && result.qr_codes[0]) {
        setPixData(result)
        setHasGenerated(true)
        onSuccess({ method: 'pix', data: result })
      } else {
        throw new Error('Dados do PIX não retornados pela API')
      }
    } catch (error) {
      console.error('Erro ao gerar PIX:', error)
      onError('Erro ao gerar PIX: ' + error.message)
    } finally {
      setIsGenerating(false)
    }
  }, [paymentData, onSuccess, onError])

  const copyPixCode = () => {
    if (pixData?.qr_codes?.[0]?.text) {
      navigator.clipboard.writeText(pixData.qr_codes[0].text)
      toast.success('Código PIX copiado!')
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (!hasGenerated) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-8">
          <Smartphone className="w-12 h-12 text-blue-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Pagamento PIX</h3>
          <p className="text-gray-600 text-center mb-6">
            Gere seu código PIX para pagamento instantâneo. Aprovação imediata.
          </p>
          <Button onClick={generatePix} disabled={isGenerating} className="w-full">
            {isGenerating ? (
              <><Loader2 className="w-4 h-4 animate-spin mr-2" />Gerando PIX...</>
            ) : (
              <><Smartphone className="w-4 h-4 mr-2" />Gerar Código PIX</>
            )}
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
          <div className="text-center">
            <Badge variant="outline" className="mb-4">
              Expira em {formatTime(timeLeft)}
            </Badge>
            
            {/* QR Code placeholder - em produção, usar biblioteca de QR Code */}
            <div className="w-48 h-48 mx-auto bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center mb-4">
              <p className="text-gray-500 text-sm">QR Code PIX</p>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Escaneie o QR Code com o app do seu banco ou copie o código PIX
            </p>

            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-600 mb-2">Código PIX:</p>
              <div className="flex items-center justify-between bg-white p-2 rounded border">
                <p className="text-xs font-mono break-all flex-1">
                  {pixData.qr_codes?.[0]?.text || 'Código não disponível'}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={copyPixCode}
                  className="ml-2"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          <div className="text-center text-sm text-gray-600">
            <p>Após o pagamento, você receberá uma confirmação por email.</p>
            <p className="mt-2">
              <strong>Valor:</strong> R$ {paymentData.planData.price.toFixed(2)}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const BoletoPayment = ({ paymentData, onSuccess, onError }) => {
  const [boletoData, setBoletoData] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [hasGenerated, setHasGenerated] = useState(false)

  const generateBoleto = useCallback(async () => {
    setIsGenerating(true)
    try {
      // TODO: Implementar geração de boleto via PagBank
      // const result = await paymentService.createPagBankBoletoPayment(paymentData)
      // setBoletoData(result)
      
      // Placeholder temporário
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const mockBoleto = {
        boleto_url: '#',
        due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
        barcode: '12345678901234567890123456789012345678901234'
      }
      
      setBoletoData(mockBoleto)
      setHasGenerated(true)
      onSuccess({ method: 'boleto', data: mockBoleto })
    } catch (error) {
      onError('Erro ao gerar boleto: ' + error.message)
      setIsGenerating(false)
    }
  }, [paymentData, onSuccess, onError])

  if (!hasGenerated) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-8">
          <FileText className="w-12 h-12 text-blue-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Pagamento por Boleto</h3>
          <p className="text-gray-600 text-center mb-6">
            Gere seu boleto bancário para pagamento. A aprovação pode levar até 2 dias úteis.
          </p>
          <Button onClick={generateBoleto} disabled={isGenerating} className="w-full">
            {isGenerating ? (
              <><Loader2 className="w-4 h-4 animate-spin mr-2" />Gerando Boleto...</>
            ) : (
              <><FileText className="w-4 h-4 mr-2" />Gerar Boleto</>
            )}
          </Button>
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

export function PagBankCheckout({ planData, customerData, onSuccess, onError }) {
  const [selectedMethod, setSelectedMethod] = useState('credit_card')
  const [isProcessing, setIsProcessing] = useState(false)
  const [configError, setConfigError] = useState('')

  // Verificar configuração na inicialização
  useEffect(() => {
    const token = import.meta.env.VITE_PAGBANK_TOKEN
    if (!token) {
      setConfigError('Token PagBank não configurado. Configure VITE_PAGBANK_TOKEN no arquivo .env')
    }
  }, [])

  const paymentMethods = [
    {
      id: 'credit_card',
      icon: CreditCard,
      title: 'Cartão de Crédito',
      description: 'Aprovação imediata em até 12x',
      component: null // Será o formulário de cartão existente
    },
    {
      id: 'pix',
      icon: Smartphone,
      title: 'PIX',
      description: 'Aprovação imediata, disponível 24h',
      component: PixPayment
    },
    {
      id: 'boleto',
      icon: FileText,
      title: 'Boleto Bancário',
      description: 'Aprovação em até 2 dias úteis',
      component: BoletoPayment
    }
  ]

  const handleMethodSelect = (methodId) => {
    setSelectedMethod(methodId)
  }

  const handlePayment = async () => {
    if (!selectedMethod) return

    setIsProcessing(true)
    try {
      if (selectedMethod === 'credit_card') {
        // Para cartão de crédito, seria necessário implementar o formulário
        // Por enquanto, mostrar erro
        throw new Error('Pagamento com cartão via PagBank ainda não implementado. Use PIX ou Boleto.')
      } else if (selectedMethod === 'pix') {
        // O PIX já foi gerado quando o método foi selecionado
        // Aqui poderíamos redirecionar ou mostrar instruções
        onSuccess({ method: 'pix', message: 'PIX gerado com sucesso' })
      } else if (selectedMethod === 'boleto') {
        // O boleto já foi gerado quando o método foi selecionado
        onSuccess({ method: 'boleto', message: 'Boleto gerado com sucesso' })
      }
    } catch (error) {
      onError(error.message)
    } finally {
      setIsProcessing(false)
    }
  }

  const renderPaymentForm = () => {
    // Mostrar erro de configuração se houver
    if (configError) {
      return (
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-800">Configuração PagBank</h4>
                <p className="text-sm text-red-700 mt-2">
                  {configError}
                </p>
                <p className="text-sm text-red-600 mt-2">
                  Para testar o PagBank, configure suas credenciais no arquivo .env seguindo o exemplo em .env.sandbox.pagbank
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    }

    const method = paymentMethods.find(m => m.id === selectedMethod)
    
    if (method?.component) {
      const PaymentComponent = method.component
      return (
        <PaymentComponent
          paymentData={{ planData, customerData }}
          onSuccess={onSuccess}
          onError={onError}
        />
      )
    }

    // Para cartão de crédito, mostrar mensagem
    return (
      <div className="space-y-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-800">Cartão de Crédito - Em Desenvolvimento</h4>
              <p className="text-sm text-yellow-700 mt-2">
                O pagamento com cartão de crédito via PagBank ainda não está implementado.
                Use PIX ou Boleto para concluir seu pagamento.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
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

      {/* Botão de pagamento apenas para cartão de crédito por enquanto */}
      {selectedMethod === 'credit_card' && (
        <Button 
          onClick={handlePayment} 
          className="w-full bg-brand-primary hover:bg-brand-secondary text-white h-12"
          disabled={isProcessing}
        >
          {isProcessing ? (
            <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />Processando...</>
          ) : (
            <><Lock className="w-5 h-5 mr-2" />Pagar com PagBank</>
          )}
        </Button>
      )}
    </div>
  )
}

export default PagBankCheckout