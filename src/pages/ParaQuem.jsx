import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent } from '@/components/ui/card.jsx'
import { GraduationCap, BookOpen, Users, School } from 'lucide-react'

function ParaQuem() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Platforms Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center text-slate-900 mb-12">
          Conheça nossas Plataformas
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Estudantes */}
          <Card className="p-8 hover:shadow-xl transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                    <GraduationCap className="w-10 h-10 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-blue-600 mb-4">Estudantes</h3>
                  <p className="text-slate-700 mb-6">
                    Os estudantes desenvolvem autonomia na escrita de forma estruturada e personalizada, vivenciando todo o
                    processo de planejamento, escrita, autoavaliação e reescrita com recursos que promovem autorregulação e
                    senso crítico.
                  </p>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Acesse a Plataforma
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professores */}
          <Card className="p-8 hover:shadow-xl transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                    <BookOpen className="w-10 h-10 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-blue-600 mb-4">Professores</h3>
                  <p className="text-slate-700 mb-6">
                    Professores ganham tempo com recursos valiosos para a gestão de turmas, criação de atividades personalizadas e
                    acompanhamento individual, baseadas nas competências do ENEM e alinhadas à BNCC.
                  </p>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Acesse a Plataforma
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Famílias */}
          <Card className="p-8 hover:shadow-xl transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-10 h-10 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-blue-600 mb-4">Famílias</h3>
                  <p className="text-slate-700 mb-6">
                    As famílias acompanham o desempenho dos estudantes, a proficiência de aprendizagem e o engajamento em tempo real
                    através de dashboards intuitivos e relatórios detalhados.
                  </p>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Acesse a Plataforma
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Escolas e Gestores */}
          <Card className="p-8 hover:shadow-xl transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                    <School className="w-10 h-10 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-blue-600 mb-4">Escolas e Gestores</h3>
                  <p className="text-slate-700 mb-6">
                    A plataforma dos gestores oferece flexibilização curricular e relatórios em tempo real, para uma gestão eficaz do
                    engajamento e aprendizagem dos seus estudantes, turmas e escolas.
                  </p>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Acesso Exclusivo - Consulte seu Login
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

export default ParaQuem