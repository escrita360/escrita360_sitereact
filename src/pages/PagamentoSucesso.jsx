import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent } from '@/components/ui/card.jsx'
import { CheckCircle2, Home, Receipt } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

function PagamentoSucesso() {
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

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="container max-w-2xl">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-16 h-16 text-green-600" />
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-5xl font-bold text-slate-900">Pagamento Confirmado!</h1>
            <p className="text-xl text-slate-600">
              Sua assinatura foi ativada com sucesso
            </p>
          </div>

          <Card className="shadow-xl">
            <CardContent className="p-8 space-y-6">
              <div className="bg-green-50 p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  <p className="text-lg font-semibold text-green-900">
                    Assinatura Ativa
                  </p>
                </div>
                <p className="text-sm text-green-700">
                  Enviamos um email de confirmação com todos os detalhes da sua assinatura.
                </p>
              </div>

              {sessionId && (
                <div className="text-left space-y-2">
                  <p className="text-sm font-medium text-slate-600">ID da Sessão:</p>
                  <p className="text-xs font-mono bg-slate-100 p-3 rounded border break-all">
                    {sessionId}
                  </p>
                </div>
              )}

              <div className="space-y-3 text-left text-sm text-slate-600">
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  Acesso imediato a todos os recursos do plano
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  Renovação automática (cancele quando quiser)
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  Suporte prioritário incluído
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              size="lg"
              className="bg-brand-primary hover:bg-brand-secondary"
              onClick={() => navigate('/dashboard')}
            >
              <Home className="w-5 h-5 mr-2" />
              Ir para o Dashboard
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/precos')}
            >
              <Receipt className="w-5 h-5 mr-2" />
              Ver Planos
            </Button>
          </div>

          <p className="text-sm text-slate-500 pt-4">
            Precisa de ajuda? Entre em contato com nosso suporte
          </p>
        </div>
      </div>
    </div>
  )
}

export default PagamentoSucesso
