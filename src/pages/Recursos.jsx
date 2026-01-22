import { Card, CardContent } from '@/components/ui/card.jsx'
import { useScrollAnimation } from '@/hooks/use-scroll-animation.js'
import { PageHero } from '@/components/PageHero.jsx'
import {
  CheckCircle
} from 'lucide-react'

function Recursos() {
  const resourcesRef = useScrollAnimation()

  const recursosProfessor = [
    'Criação e gerenciamento de Turmas',
    'Banco de rubricas para facilitar a avaliação',
    'Correção via foto ou texto direto na plataforma',
    'Relatórios de desempenho com notas (ENEM e texto dissertativo-argumentativo)',
    'Correção com IA (ENEM e texto dissertativo-argumentativo)',
    'Relatórios consolidados (Habilidades BNCC X ENEM)'
  ]



  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <PageHero 
        title="Recursos"
        titleHighlight="Disponíveis"
        subtitle="Conheça as funcionalidades disponíveis para professores independentes."
      />

      {/* Resources Section */}
      <section ref={resourcesRef} className="py-16 bg-slate-50 animate-on-scroll">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Model Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Modelo Independente */}
            <Card className="p-6 border-2 border-brand-primary bg-white shadow-lg">
              <CardContent className="pt-0">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Modelo Independente
                </h3>
                <p className="text-slate-600 mb-6">
                  Para professores independentes que querem gerenciar suas próprias turmas
                </p>
              </CardContent>
            </Card>

            {/* Modelo Híbrido - Grayed out */}
            <Card className="p-6 border-2 border-slate-200 bg-slate-50 shadow-lg opacity-60">
              <CardContent className="pt-0">
                <h3 className="text-2xl font-bold text-slate-400 mb-4">
                  Modelo Híbrido (Professor + Aluno)
                </h3>
                <p className="text-slate-400 mb-6">
                  Integração completa entre módulos de professor e aluno
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Features List */}
          <div className="max-w-2xl mx-auto">
            <div className="space-y-4">
              {recursosProfessor.map((recurso, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <span className="text-slate-700 text-lg leading-relaxed">
                    {recurso}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Recursos
