import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent } from '@/components/ui/card.jsx'
import { XCircle, ArrowLeft, HelpCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function PagamentoCancelado() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="container max-w-2xl">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center">
              <XCircle className="w-16 h-16 text-orange-600" />
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl font-bold text-slate-900">Pagamento Cancelado</h1>
            <p className="text-lg text-slate-600">
              Você cancelou o processo de pagamento
            </p>
          </div>

          <Card className="shadow-xl">
            <CardContent className="p-8 space-y-6">
              <div className="bg-orange-50 p-6 rounded-lg text-left">
                <div className="flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-base font-medium text-orange-900 mb-2">
                      O que aconteceu?
                    </p>
                    <p className="text-sm text-orange-700">
                      Você decidiu não concluir a assinatura neste momento. 
                      Nenhuma cobrança foi realizada no seu cartão.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-left">
                <p className="font-medium text-slate-900">
                  Ainda está interessado?
                </p>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-brand-primary mt-1">•</span>
                    <span>Seus dados não foram perdidos, você pode tentar novamente</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-primary mt-1">•</span>
                    <span>Se tiver dúvidas sobre os planos, entre em contato</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-primary mt-1">•</span>
                    <span>Oferecemos garantia de 30 dias em todos os planos</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              size="lg"
              className="bg-brand-primary hover:bg-brand-secondary"
              onClick={() => navigate('/precos')}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Voltar para Planos
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/contato')}
            >
              <HelpCircle className="w-5 h-5 mr-2" />
              Falar com Suporte
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

export default PagamentoCancelado
