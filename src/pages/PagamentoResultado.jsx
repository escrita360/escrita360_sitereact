import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent } from '@/components/ui/card.jsx'
import { CheckCircle2, XCircle, Home, Receipt, ArrowLeft, HelpCircle } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

function PagamentoResultado({ status = 'success' }) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simula verificação do pagamento
    setTimeout(() => {
      setLoading(false)
    }, 1500)
  }, [sessionId])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand-primary mx-auto mb-4"></div>
          <p className="text-lg text-slate-600">Confirmando seu pagamento...</p>
        </div>
      </div>
    )
  }

  const isSuccess = status === 'success'

  const config = {
    success: {
      icon: CheckCircle2,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      title: 'Pagamento Confirmado!',
      subtitle: 'Sua assinatura foi ativada com sucesso',
      cardBg: 'bg-green-50',
      cardTitle: 'Assinatura Ativa',
      cardText: 'Enviamos um email de confirmação com todos os detalhes da sua assinatura.',
      features: [
        'Acesso imediato a todos os recursos do plano',
        'Renovação automática (cancele quando quiser)',
        'Suporte prioritário incluído'
      ],
      primaryButton: {
        text: 'Ir para o Dashboard',
        icon: Home,
        action: () => navigate('/dashboard')
      },
      secondaryButton: {
        text: 'Ver Planos',
        icon: Receipt,
        action: () => navigate('/precos')
      }
    },
    cancelled: {
      icon: XCircle,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      title: 'Pagamento Cancelado',
      subtitle: 'Você cancelou o processo de pagamento',
      cardBg: 'bg-orange-50',
      cardTitle: 'O que aconteceu?',
      cardText: 'Você decidiu não concluir a assinatura neste momento. Nenhuma cobrança foi realizada no seu cartão.',
      features: [
        'Seus dados não foram perdidos, você pode tentar novamente',
        'Se tiver dúvidas sobre os planos, entre em contato',
        'Oferecemos garantia de 30 dias em todos os planos'
      ],
      primaryButton: {
        text: 'Voltar para Planos',
        icon: ArrowLeft,
        action: () => navigate('/precos')
      },
      secondaryButton: {
        text: 'Falar com Suporte',
        icon: HelpCircle,
        action: () => navigate('/contato')
      }
    }
  }

  const currentConfig = config[isSuccess ? 'success' : 'cancelled']
  const IconComponent = currentConfig.icon

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="container max-w-2xl">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className={`w-24 h-24 ${currentConfig.iconBg} rounded-full flex items-center justify-center ${isSuccess ? 'animate-bounce' : ''}`}>
              <IconComponent className={`w-16 h-16 ${currentConfig.iconColor}`} />
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-5xl font-bold text-slate-900">{currentConfig.title}</h1>
            <p className="text-xl text-slate-600">
              {currentConfig.subtitle}
            </p>
          </div>

          <Card className="shadow-xl">
            <CardContent className="p-6 space-y-4">
              <div className={`${currentConfig.cardBg} p-6 rounded-lg`}>
                <div className="flex items-center gap-3 mb-3">
                  <IconComponent className={`w-6 h-6 ${currentConfig.iconColor}`} />
                  <p className="text-lg font-semibold text-slate-900">
                    {currentConfig.cardTitle}
                  </p>
                </div>
                <p className="text-sm text-slate-700">
                  {currentConfig.cardText}
                </p>
              </div>

              {isSuccess && sessionId && (
                <div className="text-left space-y-2">
                  <p className="text-sm font-medium text-slate-600">ID da Sessão:</p>
                  <p className="text-xs font-mono bg-slate-100 p-3 rounded border break-all">
                    {sessionId}
                  </p>
                </div>
              )}

              <div className="space-y-3 text-left text-sm text-slate-600">
                {currentConfig.features.map((feature, index) => (
                  <p key={index} className="flex items-center gap-2">
                    {isSuccess ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : (
                      <span className="text-brand-primary mt-1">•</span>
                    )}
                    <span>{feature}</span>
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              size="lg"
              className="bg-brand-primary hover:bg-brand-secondary"
              onClick={currentConfig.primaryButton.action}
            >
              <currentConfig.primaryButton.icon className="w-5 h-5 mr-2" />
              {currentConfig.primaryButton.text}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={currentConfig.secondaryButton.action}
            >
              <currentConfig.secondaryButton.icon className="w-5 h-5 mr-2" />
              {currentConfig.secondaryButton.text}
            </Button>
          </div>

          <div className="pt-6 space-y-2">
            <p className="text-sm text-slate-600">
              <strong>Dúvidas frequentes:</strong>
            </p>
            <div className="text-sm text-slate-500 space-y-1">
              <p>• Todos os planos incluem suporte e podem ser cancelados a qualquer momento</p>
              <p>• Aceitamos todas as formas de pagamento através do Stripe</p>
              <p>• Seus dados são protegidos com criptografia de nível bancário</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PagamentoResultado