import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent } from '@/components/ui/card.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import {
  GraduationCap,
  BookOpen,
  School,
  Trophy,
  Clock,
  TrendingUp,
  Medal,
  CheckCircle,
  Users,
  Shield,
  Award,
  FileText
} from 'lucide-react'

function ParaQuem() {
  const audiences = [
    {
      id: 'estudantes',
      icon: GraduationCap,
      title: 'Para Estudantes',
      subtitle: 'Desenvolva autonomia e excelência na escrita',
      description: 'Para redações escolares e preparação para o ENEM, desenvolvendo autonomia na escrita e melhorando notas através da autorregulação. A plataforma acompanha você em cada etapa do processo de escrita.',
      features: [
        'Aprenda no seu próprio ritmo',
        'Feedback detalhado ENEM',
        'Desenvolva metacognição',
        'Acompanhe sua evolução',
        'Banco de temas atualizados',
        'Melhore suas notas'
      ],
      tags: ['Preparação ENEM', 'Vestibulares', 'Redações Escolares', 'Ensino Médio'],
      cta: 'Começar Grátis',
      ctaLink: '/precos'
    },
    {
      id: 'professores',
      icon: BookOpen,
      title: 'Para Professores',
      subtitle: 'Otimize seu tempo e potencialize o aprendizado',
      description: 'Reduza sua carga de trabalho com ferramentas de correção assistida e acompanhamento automatizado. Foque no que realmente importa: o desenvolvimento dos seus alunos.',
      stats: [
        { number: '70%', label: 'Redução no tempo' },
        { number: '30+', label: 'Alunos gerenciados' },
        { number: '100%', label: 'Automatizado' }
      ],
      features: [
        'Economize até 70% do tempo',
        'Acompanhe 30 alunos facilmente',
        'Dashboards completos',
        'Relatórios automáticos',
        'Integração com BNCC',
        'Banco de comentários'
      ],
      tags: ['Professores Independentes', 'Tutores', 'Ensino Remoto'],
      cta: 'Ver Plano Professor',
      ctaLink: '/precos'
    },
    {
      id: 'escolas',
      icon: School,
      title: 'Para Escolas',
      subtitle: 'Transforme a cultura de escrita na sua instituição',
      description: 'Instituições que querem oferecer uma imersão completa no processo de escrita autoral, com foco na autorregulação da aprendizagem e dashboards gerenciais completos. Solução escalável para toda a instituição.',
      gridFeatures: [
        { icon: TrendingUp, title: 'Gestão Completa', desc: 'Visão 360° do desempenho' },
        { icon: Users, title: 'Escalabilidade', desc: 'Cresce com sua instituição' },
        { icon: Shield, title: 'Segurança LGPD', desc: 'Dados totalmente protegidos' },
        { icon: Award, title: 'Alinhamento BNCC', desc: 'Conforme diretrizes nacionais' }
      ],
      features: [
        'Usuários ilimitados',
        'Dashboards administrativos',
        'Relatórios institucionais',
        'Integração com LMS',
        'White-label disponível',
        'Suporte dedicado',
        'Treinamento completo',
        'Gerente de conta exclusivo'
      ],
      tags: ['Escolas Particulares', 'Redes de Ensino', 'Escolas Públicas'],
      cta: 'Agendar Demonstração',
      ctaLink: '/contato',
      featured: true
    },
    {
      id: 'cursos-prep',
      icon: FileText,
      title: 'Para Cursos Preparatórios',
      subtitle: 'Maximize resultados e aprove mais alunos',
      description: 'Presencial ou online, oferecendo cursos preparatórios para ENEM com otimização do tempo dos professores e relatórios detalhados. Aumente suas taxas de aprovação com metodologia comprovada.',
      stats: [
        { number: '+25%', label: 'Melhoria nas notas' },
        { number: '80%', label: 'Satisfação' },
        { number: '3x', label: 'Mais prática' }
      ],
      features: [
        'Foco total na preparação ENEM',
        'Relatórios para alunos e pais',
        'Simulados integrados',
        'Otimização do tempo de correção',
        'Acompanhamento em escala',
        'Material constantemente atualizado'
      ],
      tags: ['Cursinhos Presenciais', 'Cursos Online', 'Preparatórios ENEM'],
      cta: 'Solicitar Proposta',
      ctaLink: '/contato'
    }
  ]

  const successStories = [
    {
      icon: Trophy,
      title: 'Estudante conquistou nota 980',
      description: 'De 640 para 980 em apenas 6 meses de prática autorregulada na plataforma.',
      tag: 'Estudante'
    },
    {
      icon: Clock,
      title: 'Professor economizou 15h por semana',
      description: 'Conseguiu gerenciar 30 alunos com o mesmo tempo que gastava com 10.',
      tag: 'Professor'
    },
    {
      icon: TrendingUp,
      title: 'Escola aumentou média em 30%',
      description: 'Após 1 ano usando a plataforma, todas as turmas melhoraram significativamente.',
      tag: 'Escola'
    },
    {
      icon: Medal,
      title: 'Cursinho bateu recorde de aprovações',
      description: '92% de aprovação em universidades públicas, melhor resultado da história.',
      tag: 'Cursinho'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Uma solução para todo o ecossistema educacional
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Atendemos diferentes públicos com recursos específicos para cada necessidade no processo de desenvolvimento da escrita
            </p>
          </div>
        </div>
      </section>

      {/* Target Audience Tabs Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="estudantes" className="w-full">
            {/* Navigation Tabs */}
            <TabsList className="grid w-full grid-cols-4 mb-12 bg-slate-100 p-2 rounded-xl">
              {audiences.map((audience) => {
                const IconComponent = audience.icon
                return (
                  <TabsTrigger
                    key={audience.id}
                    value={audience.id}
                    className="flex flex-col items-center gap-2 py-4 px-6 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md transition-all"
                  >
                    <IconComponent className="w-6 h-6" />
                    <span className="text-sm font-medium">{audience.title.split(' ')[1]}</span>
                    {audience.id === 'escolas' && (
                      <Badge variant="secondary" className="text-xs">Popular</Badge>
                    )}
                  </TabsTrigger>
                )
              })}
            </TabsList>

            {/* Tab Contents */}
            {audiences.map((audience) => {
              const IconComponent = audience.icon
              return (
                <TabsContent key={audience.id} value={audience.id} className="mt-8">
                  <Card className={`p-8 ${audience.featured ? 'border-blue-200 bg-gradient-to-br from-blue-50 to-white' : ''}`}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-8">
                        <div className="flex-shrink-0">
                          <div className={`w-20 h-20 rounded-full flex items-center justify-center ${audience.featured ? 'bg-blue-100' : 'bg-blue-50'}`}>
                            <IconComponent className={`w-10 h-10 ${audience.featured ? 'text-blue-600' : 'text-blue-600'}`} />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h2 className="text-3xl font-bold text-slate-900 mb-2">{audience.title}</h2>
                          <p className="text-lg text-blue-600 mb-6">{audience.subtitle}</p>

                          <p className="text-slate-700 text-lg mb-8 leading-relaxed">
                            {audience.description}
                          </p>

                          {/* Stats for Professores and Cursos Prep */}
                          {audience.stats && (
                            <div className="grid grid-cols-3 gap-6 mb-8">
                              {audience.stats.map((stat, index) => (
                                <div key={index} className="text-center">
                                  <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
                                  <div className="text-slate-600">{stat.label}</div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Grid Features for Escolas */}
                          {audience.gridFeatures && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                              {audience.gridFeatures.map((feature, index) => {
                                const FeatureIcon = feature.icon
                                return (
                                  <div key={index} className="text-center">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                      <FeatureIcon className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <h4 className="font-semibold text-slate-900 mb-1">{feature.title}</h4>
                                    <p className="text-sm text-slate-600">{feature.desc}</p>
                                  </div>
                                )
                              })}
                            </div>
                          )}

                          {/* Features */}
                          <div className="grid md:grid-cols-2 gap-6 mb-8">
                            {audience.features.map((feature, index) => (
                              <div key={index} className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                <span className="text-slate-700">{feature}</span>
                              </div>
                            ))}
                          </div>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mb-8">
                            {audience.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-blue-600 border-blue-200">
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          {/* CTA */}
                          <Button
                            size="lg"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                          >
                            {audience.cta}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )
            })}
          </Tabs>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-slate-900 mb-8 md:mb-12">
            Histórias de Sucesso
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {successStories.map((story, index) => {
              const StoryIcon = story.icon
              return (
                <Card key={index} className="p-6 hover:shadow-xl transition-shadow">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <StoryIcon className="w-8 h-8 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3">{story.title}</h3>
                      <p className="text-slate-600 mb-4">{story.description}</p>
                      <Badge variant="secondary">{story.tag}</Badge>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6">
            Encontre a solução perfeita para você
          </h2>
          <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Seja estudante, professor, escola ou curso preparatório, temos o plano ideal para transformar o aprendizado da escrita.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-slate-50 px-8 py-3 text-lg">
              Ver Planos e Preços
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg">
              Falar com Especialista
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ParaQuem