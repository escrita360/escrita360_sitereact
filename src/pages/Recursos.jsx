import { Card, CardContent } from '@/components/ui/card.jsx'
import { Brain, TrendingUp, PenTool, BarChart3, FileText, Settings } from 'lucide-react'

function Recursos() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center text-slate-900 mb-12">
          Recursos da Plataforma
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <Brain className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-3">Escrita Autorregulada no Centro</h3>
              <p className="text-slate-700">
                Diferente de plataformas que apenas corrigem textos prontos, colocamos a autorregulação como eixo principal.
                O estudante vivencia todo o processo de escrita.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <TrendingUp className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-3">Painel de Sentimentos</h3>
              <p className="text-slate-700">
                Recurso voltado ao acompanhamento das competências socioemocionais no processo de escrita.
                Auxilia na regulação de crenças cognitivas.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <PenTool className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-3">Imersão Total no Processo de Escrita</h3>
              <p className="text-slate-700">
                Imersão total no processo de escrita com análises automatizadas: introduz o uso do parágrafo-padrão,
                ajudando a organizar ideias.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <BarChart3 className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-3">Análise Integrada em Tempo Real</h3>
              <p className="text-slate-700">
                Conta com feedbacks e análises mediadas por diferentes recursos de análise textual,
                de forma rápida e consistente.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <FileText className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-3">Uso de rubricas e evolução por níveis</h3>
              <p className="text-slate-700">
                Oferece rubricas autoavaliativas e monitoramento contínuo do desempenho, com gráficos e dados qualitativos
                alinhados às habilidades da BNCC.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <Settings className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-3">IA como Assistente</h3>
              <p className="text-slate-700">
                A tecnologia atua como uma camada complementar após a autoavaliação realizada pelo estudante,
                oferecendo feedback ao final do processo.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

export default Recursos