import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent } from '@/components/ui/card.jsx'
import { Check } from 'lucide-react'

function Precos() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center text-slate-900 mb-12">
          Planos e Preços
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Plano Básico */}
          <Card className="p-8 hover:shadow-xl transition-shadow">
            <CardContent className="pt-6">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Estudante</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-blue-600">R$ 29</span>
                <span className="text-slate-600">/mês</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-slate-700">Acesso completo à plataforma</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-slate-700">Redações ilimitadas</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-slate-700">Feedback IA</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-slate-700">Relatórios de progresso</span>
                </li>
              </ul>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Começar Agora
              </Button>
            </CardContent>
          </Card>

          {/* Plano Profissional */}
          <Card className="p-8 border-2 border-blue-600 hover:shadow-xl transition-shadow relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                Mais Popular
              </span>
            </div>
            <CardContent className="pt-6">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Professor</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-blue-600">R$ 99</span>
                <span className="text-slate-600">/mês</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-slate-700">Tudo do plano Estudante</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-slate-700">Gestão de até 100 alunos</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-slate-700">Dashboards avançados</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-slate-700">Atividades personalizadas</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-slate-700">Suporte prioritário</span>
                </li>
              </ul>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Começar Agora
              </Button>
            </CardContent>
          </Card>

          {/* Plano Empresarial */}
          <Card className="p-8 hover:shadow-xl transition-shadow">
            <CardContent className="pt-6">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Escola</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-blue-600">R$ 299</span>
                <span className="text-slate-600">/mês</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-slate-700">Tudo do plano Professor</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-slate-700">Alunos ilimitados</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-slate-700">Relatórios institucionais</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-slate-700">API de integração</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-slate-700">Consultoria especializada</span>
                </li>
              </ul>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Fale Conosco
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

export default Precos