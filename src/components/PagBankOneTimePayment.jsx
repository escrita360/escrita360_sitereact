import React, { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Loader2 } from 'lucide-react'

/**
 * Componente para pagamento único via PagBank
 * Usado para compra de pacotes de créditos (não recorrente)
 */
function PagBankOneTimePayment({ 
  packageData, 
  customerData, 
  cardData, 
  paymentMethod = 'card',
  onSuccess, 
  onError, 
  validateBeforeSubmit 
}) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [pixQrCode, setPixQrCode] = useState(null)
  const [boletoUrl, setBoletoUrl] = useState(null)

  const handlePayment = async () => {
    // Validar formulário antes de processar
    if (validateBeforeSubmit && !validateBeforeSubmit()) {
      return
    }

    setIsProcessing(true)

    try {
      // Remove trailing slash se existir
      const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '')
      
      // Preparar dados do pedido baseado no método de pagamento
      let orderData = {
        reference_id: `CREDITOS_${packageData.packageId}_${Date.now()}`,
        customer: {
          name: customerData.name,
          email: customerData.email,
          tax_id: customerData.cpf.replace(/\D/g, ''),
          phones: [{
            country: '55',
            area: customerData.phone.replace(/\D/g, '').substring(0, 2),
            number: customerData.phone.replace(/\D/g, '').substring(2),
            type: 'MOBILE'
          }]
        },
        items: [{
          reference_id: packageData.packageId,
          name: packageData.name,
          quantity: 1,
          unit_amount: Math.round(packageData.price * 100) // Converter para centavos
        }],
        // notification_urls removidas - sandbox requer URLs públicas (HTTPS)
        // Em produção, adicionar: notification_urls: ['https://seudominio.com/api/webhook/pagbank']
      }

      let endpoint = '/payment/pagbank/create-order' // Padrão para cartão
      
      // Adicionar dados específicos do método de pagamento
      if (paymentMethod === 'card' && cardData) {
        // Pagamento com cartão de crédito
        orderData.charges = [{
          reference_id: `CHARGE_${Date.now()}`,
          description: `Compra de ${packageData.name}`,
          amount: {
            value: Math.round(packageData.price * 100),
            currency: 'BRL'
          },
          payment_method: {
            type: 'CREDIT_CARD',
            installments: 1,
            capture: true,
            card: {
              number: cardData.number,
              exp_month: cardData.expiryMonth,
              exp_year: cardData.expiryYear,
              security_code: cardData.cvv,
              holder: {
                name: cardData.holderName
              }
            }
          }
        }]
      } else if (paymentMethod === 'pix') {
        // Pagamento com PIX
        orderData.qr_codes = [{
          amount: {
            value: Math.round(packageData.price * 100)
          },
          expiration_date: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutos
        }]
        endpoint = '/payment/pagbank/create-pix-order'
      } else if (paymentMethod === 'boleto') {
        // Pagamento com Boleto
        endpoint = '/payment/pagbank/create-boleto-order'
        orderData.charges = [{
          reference_id: `CHARGE_${Date.now()}`,
          description: `Compra de ${packageData.name}`,
          amount: {
            value: Math.round(packageData.price * 100),
            currency: 'BRL'
          },
          payment_method: {
            type: 'BOLETO',
            boleto: {
              due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 dias
              instruction_lines: {
                line_1: `Pagamento de ${packageData.name}`,
                line_2: `${packageData.credits} créditos de IA`
              },
              holder: {
                name: customerData.name,
                tax_id: customerData.cpf.replace(/\D/g, ''),
                email: customerData.email
              }
            }
          }
        }]
      }

      // Enviar requisição para o backend
      console.log('Enviando para:', `${apiUrl}${endpoint}`)
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao processar pagamento')
      }

      // Processar resposta baseado no método de pagamento
      if (paymentMethod === 'card') {
        // Pagamento com cartão - verificar se foi aprovado
        const charge = data.charges?.[0]
        if (charge?.status === 'PAID' || charge?.status === 'AUTHORIZED') {
          onSuccess({
            transaction_id: data.id,
            order_id: data.id,
            status: charge.status,
            payment_method: 'CREDIT_CARD'
          })
        } else {
          throw new Error(charge?.payment_response?.message || 'Pagamento não autorizado')
        }
      } else if (paymentMethod === 'pix') {
        // PIX - mostrar QR Code
        const qrCode = data.qr_codes?.[0]
        if (qrCode) {
          setPixQrCode({
            text: qrCode.text,
            image: qrCode.links?.find(l => l.media === 'image/png')?.href,
            orderId: data.id
          })
          // Iniciar polling para verificar pagamento
          startPixPolling(data.id)
        } else {
          throw new Error('QR Code PIX não gerado')
        }
      } else if (paymentMethod === 'boleto') {
        // Boleto - mostrar URL para impressão
        const charge = data.charges?.[0]
        const boletoLink = charge?.links?.find(l => l.rel === 'BOLETO')
        if (boletoLink) {
          setBoletoUrl(boletoLink.href)
          onSuccess({
            transaction_id: data.id,
            order_id: data.id,
            status: 'WAITING',
            payment_method: 'BOLETO',
            boleto_url: boletoLink.href
          })
        } else {
          throw new Error('Boleto não gerado')
        }
      }

    } catch (error) {
      console.error('Erro no pagamento:', error)
      onError(error.message || 'Erro ao processar pagamento. Tente novamente.')
    } finally {
      setIsProcessing(false)
    }
  }

  // Polling para verificar pagamento PIX
  const startPixPolling = (orderId) => {
    const pollInterval = setInterval(async () => {
      try {
        const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '')
        const response = await fetch(`${apiUrl}/payment/pagbank/order/${orderId}`)
        const data = await response.json()
        
        const charge = data.charges?.[0]
        if (charge?.status === 'PAID') {
          clearInterval(pollInterval)
          setPixQrCode(null)
          onSuccess({
            transaction_id: data.id,
            order_id: data.id,
            status: 'PAID',
            payment_method: 'PIX'
          })
        }
      } catch (error) {
        console.error('Erro ao verificar pagamento PIX:', error)
      }
    }, 5000) // Verificar a cada 5 segundos

    // Parar polling após 15 minutos
    setTimeout(() => {
      clearInterval(pollInterval)
    }, 15 * 60 * 1000)
  }

  // Renderizar QR Code PIX
  if (pixQrCode) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Pague com PIX</h3>
          <p className="text-sm text-slate-600 mb-4">
            Escaneie o QR Code ou copie o código PIX abaixo
          </p>
        </div>
        
        {pixQrCode.image && (
          <div className="flex justify-center">
            <img src={pixQrCode.image} alt="QR Code PIX" className="w-64 h-64" />
          </div>
        )}
        
        <div className="bg-slate-50 p-4 rounded-lg">
          <p className="text-xs text-slate-600 mb-2">Código PIX (Copia e Cola):</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={pixQrCode.text}
              readOnly
              className="flex-1 px-3 py-2 text-sm border rounded font-mono"
            />
            <Button
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(pixQrCode.text)
                alert('Código PIX copiado!')
              }}
            >
              Copiar
            </Button>
          </div>
        </div>
        
        <div className="text-center text-sm text-slate-600">
          <p>Aguardando pagamento...</p>
          <p className="text-xs mt-1">Esta página será atualizada automaticamente quando o pagamento for confirmado</p>
        </div>
      </div>
    )
  }

  // Renderizar link do Boleto
  if (boletoUrl) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Boleto Gerado</h3>
          <p className="text-sm text-slate-600 mb-4">
            Clique no botão abaixo para visualizar e imprimir seu boleto
          </p>
        </div>
        
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={() => window.open(boletoUrl, '_blank')}
            className="bg-brand-primary hover:bg-brand-secondary"
          >
            Ver Boleto
          </Button>
        </div>
        
        <div className="text-center text-sm text-slate-600">
          <p>O boleto tem validade de 3 dias úteis</p>
          <p className="text-xs mt-1">Após o pagamento, os créditos serão liberados em até 2 dias úteis</p>
        </div>
      </div>
    )
  }

  // Renderizar botão de pagamento padrão
  return (
    <Button
      className="w-full bg-brand-primary hover:bg-brand-secondary text-white"
      size="lg"
      onClick={handlePayment}
      disabled={isProcessing}
    >
      {isProcessing ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Processando...
        </>
      ) : (
        <>
          {paymentMethod === 'card' && 'Finalizar Pagamento'}
          {paymentMethod === 'pix' && 'Gerar QR Code PIX'}
          {paymentMethod === 'boleto' && 'Gerar Boleto'}
        </>
      )}
    </Button>
  )
}

export default PagBankOneTimePayment
