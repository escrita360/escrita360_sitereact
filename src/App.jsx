import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent } from '@/components/ui/card.jsx'
import { Check, X, PenTool, Brain, TrendingUp, GraduationCap, Users, School, BookOpen, BarChart3, FileText, Settings } from 'lucide-react'
import Banner from '../banner/banner.jsx'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <PenTool className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900">Escrita360</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#home" className="text-slate-700 hover:text-blue-600 transition-colors">Home</a>
            <a href="#para-quem" className="text-slate-700 hover:text-blue-600 transition-colors">Para Quem</a>
            <a href="#recursos" className="text-slate-700 hover:text-blue-600 transition-colors">Recursos</a>
            <a href="#precos" className="text-slate-700 hover:text-blue-600 transition-colors">Preços</a>
            <a href="#contato" className="text-slate-700 hover:text-blue-600 transition-colors">Contato</a>
          </div>
        </nav>
      </header>

      {/* Banners Section */}
      <section className="container mx-auto px-4 py-8">
        <Banner />
      </section>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              A Inteligência Artificial e Inovação potencializando o Aprendizado da Escrita
            </h1>
            <p className="text-xl text-slate-600 mb-8">
              Plataforma adaptativa de escrita autorregulada e avaliação inteligente
            </p>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg">
              Entre em contato
            </Button>
          </div>
          <div className="flex justify-center">
            <Card className="p-8 shadow-2xl">
              <div className="flex gap-8 items-center justify-center">
                <PenTool className="w-16 h-16 text-blue-600" />
                <Brain className="w-16 h-16 text-blue-600" />
                <TrendingUp className="w-16 h-16 text-blue-600" />
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-slate-900 mb-12">
            Eficiência educacional na prática
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <PenTool className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <div className="text-4xl font-bold text-blue-600 mb-2">37</div>
                <div className="text-sm text-slate-600 mb-2">Mil+</div>
                <p className="text-slate-700">Redações corrigidas com autorregulação</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <School className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <div className="text-4xl font-bold text-blue-600 mb-2">148</div>
                <div className="text-sm text-slate-600 mb-2">+</div>
                <p className="text-slate-700">Instituições públicas e privadas</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <GraduationCap className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <div className="text-4xl font-bold text-blue-600 mb-2">11</div>
                <div className="text-sm text-slate-600 mb-2">Mil+</div>
                <p className="text-slate-700">Estudantes desenvolvendo autonomia</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <TrendingUp className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <div className="text-4xl font-bold text-blue-600 mb-2">+25%</div>
                <div className="text-sm text-slate-600 mb-2"></div>
                <p className="text-slate-700">De melhoria na escrita em poucos meses</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg text-slate-700 leading-relaxed">
            O <span className="font-bold text-blue-600">Escrita360</span> é a plataforma mais completa de escrita autorregulada e avaliação inteligente,
            projetada para levar estudantes, professores e escolas para o próximo nível com Inteligência
            Artificial. Com soluções inovadoras e tecnologia de ponta, oferecemos uma experiência
            educacional única, que engaja os estudantes na jornada completa de desenvolvimento da
            escrita, empodera professores com dados valiosos e oferece às escolas dashboards completos
            para gestão pedagógica, promovendo a aprendizagem significativa que impulsiona o sucesso
            acadêmico.
          </p>
        </div>
      </section>

      {/* Platforms Section */}
      <section id="para-quem" className="bg-slate-50 py-16">
        <div className="container mx-auto px-4">
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
        </div>
      </section>

      {/* Features Section */}
      <section id="recursos" className="container mx-auto px-4 py-16">
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

      {/* Process Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-white mb-12">
            Processo de Escrita
          </h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { num: 1, title: 'Planejamento', desc: 'Organize suas ideias e estruture seu texto com ferramentas de planejamento que facilitam o processo criativo.' },
              { num: 2, title: 'Escrita', desc: 'Escreva seu texto no editor inteligente com suporte ao parágrafo-padrão e recursos de formatação profissional.' },
              { num: 3, title: 'Autoavaliação', desc: 'Revise seu texto usando rubricas estruturadas e desenvolva senso crítico sobre sua própria escrita.' },
              { num: 4, title: 'Feedback IA', desc: 'Receba análise complementar da inteligência artificial com sugestões de melhoria específicas e construtivas.' },
              { num: 5, title: 'Reescrita', desc: 'Aplique as melhorias identificadas e desenvolva autonomia no processo de revisão e aperfeiçoamento textual.' },
              { num: 6, title: 'Evolução', desc: 'Acompanhe seu progresso ao longo do tempo e veja sua escrita evoluir com dados concretos e mensuráveis.' }
            ].map((step) => (
              <Card key={step.num} className="p-6 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 mx-auto">
                    <span className="text-2xl font-bold text-blue-600">{step.num}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 text-center">{step.title}</h3>
                  <p className="text-white/90 text-sm text-center">{step.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center text-slate-900 mb-12">
          O que dizem nossos usuários
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-6">
            <CardContent className="pt-6">
              <div className="mb-4">
                <h4 className="font-bold text-lg text-slate-900">Maria Silva</h4>
                <p className="text-sm text-slate-600">Estudante - Aprovada em Medicina</p>
              </div>
              <p className="text-slate-700 italic">
                "O Escrita360 foi fundamental na minha aprovação. Melhorei minha nota de redação de 680 para 920 pontos em apenas 4 meses.
                A metodologia de autorregulação me ensinou a revisar meus textos de forma crítica."
              </p>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="pt-6">
              <div className="mb-4">
                <h4 className="font-bold text-lg text-slate-900">Prof. João Santos</h4>
                <p className="text-sm text-slate-600">Professor de Redação - Colégio Exemplo</p>
              </div>
              <p className="text-slate-700 italic">
                "Como professor, economizo horas de correção e consigo acompanhar o desenvolvimento de cada aluno de forma individual.
                Os dashboards facilitam muito meu trabalho e a identificação de dificuldades específicas."
              </p>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="pt-6">
              <div className="mb-4">
                <h4 className="font-bold text-lg text-slate-900">Dra. Carla Mendes</h4>
                <p className="text-sm text-slate-600">Coordenadora Pedagógica</p>
              </div>
              <p className="text-slate-700 italic">
                "Implementamos o Escrita360 em nossa escola e os resultados são impressionantes. A plataforma oferece dados valiosos
                para tomada de decisões pedagógicas e nossos alunos estão mais engajados com a escrita."
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="bg-slate-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-slate-900 mb-12">
            Por que escolher o Escrita360?
          </h2>
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardContent className="p-0">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-bold text-slate-900">Recursos</th>
                      <th className="text-center p-4 font-bold text-blue-600">Escrita360</th>
                      <th className="text-center p-4 font-bold text-slate-600">Outras Plataformas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      'Escrita Autorregulada',
                      'Painel de Sentimentos',
                      'Rubricas Autoavaliativas',
                      'Processo Completo de Escrita',
                      'IA como Apoio (não substituição)',
                      'Dashboard para Escolas',
                      'Alinhamento com BNCC'
                    ].map((feature, index) => (
                      <tr key={index} className="border-b last:border-b-0 hover:bg-slate-50">
                        <td className="p-4 text-slate-700">{feature}</td>
                        <td className="p-4 text-center">
                          <Check className="w-6 h-6 text-green-600 mx-auto" />
                        </td>
                        <td className="p-4 text-center">
                          <X className="w-6 h-6 text-red-500 mx-auto" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <PenTool className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">Escrita360</span>
              </div>
              <p className="text-slate-400">
                A plataforma mais completa para o desenvolvimento da escrita
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Plataformas</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Estudantes</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Professores</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Famílias</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Escolas</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Recursos</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Editor Inteligente</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Rubricas</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Dashboard</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Gestão Escolar</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Contato</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Suporte</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Sobre</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
            <p>&copy; 2025 Escrita360. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App

