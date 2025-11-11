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

const PixPayment = ({ paymentData, onError }) => {
  const [pixData, setPixData] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [timeLeft, setTimeLeft] = useState(1800) // 30 minutos

  useEffect(() => {
    generatePix()
  }, [generatePix])

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft])

  const generatePix = useCallback(async () => {
    setIsGenerating(true)
    try {
      const result = await paymentService.createPagBankPixPayment(paymentData)

      // A resposta agora tem qr_codes em vez de charges
      if (result.qr_codes && result.qr_codes[0]) {
        setPixData(result)
      } else {
        throw new Error('Dados do PIX não retornados pela API')
      }
    } catch (error) {
      onError('Erro ao gerar PIX: ' + error.message)
    } finally {
      setIsGenerating(false)
    }
  }, [paymentData, onError])

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
          <AlertCircle className="w-8 h-8 text-red-500 mb-4" />
          <p className="text-gray-600">Erro ao gerar PIX</p>
          <Button onClick={generatePix} className="mt-4">
            Tentar Novamente
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

const BoletoPayment = ({ paymentData, onError }) => {
  const [boletoData, setBoletoData] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    generateBoleto()
  }, [generateBoleto])

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

export function PagBankCheckout({ planData, customerData, onSuccess, onError }) {
  const [selectedMethod, setSelectedMethod] = useState('credit_card')

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

  const renderPaymentForm = () => {
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

    // Para cartão de crédito, retorna null pois o formulário já existe na página
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

      {selectedMethod !== 'credit_card' && (
        <div>
          {renderPaymentForm()}
        </div>
      )}
    </div>
  )
}

export default PagBankCheckout