import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel.jsx"
import { useScrollAnimation } from '@/hooks/use-scroll-animation.js'
import { PageHero } from '@/components/PageHero.jsx'
import {
  UserCircle,
  Presentation,
  Building2,
  TrendingUp,
  CheckCircle,
  Users,
  Shield,
  Award,
  BookMarked
} from 'lucide-react'

function ParaQuem() {
  const heroRef = useScrollAnimation()
  const tabsRef = useScrollAnimation()
  
  const audiences = [
    {
      id: 'estudantes',
      icon: UserCircle,
      title: 'Estudantes',
      subtitle: 'Desenvolva autonomia e excelência na escrita',
      description: 'Para redações escolares e para se preparar para o Enem, ajudando alunos a melhorarem suas notas no Enem.',
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
      id: 'escolas',
      icon: Building2,
      title: 'Escolas',
      subtitle: 'Transforme a cultura de escrita na sua instituição',
      description: 'Instituições que querem oferecer uma imersão completa no processo de escrita autoral, com foco na autorregulação da aprendizagem.',
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
      icon: BookMarked,
      title: 'Cursos Preparatórios',
      subtitle: 'Maximize resultados e aprove mais alunos',
      description: 'Presencial ou com plataforma de ensino online que oferece cursos preparatórios para Enem, otimizando o tempo dos professores e potencializando o desempenho dos alunos.',
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

  const getHeroContent = () => {
    return {
      title: 'Para Quem é o',
      titleHighlight: 'Escrita360?',
      subtitle: 'Descubra como nossa plataforma pode transformar o aprendizado de escrita para estudantes, professores, escolas e cursos preparatórios.'
    }
  }

  const heroContent = getHeroContent()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <PageHero 
        title={heroContent.title}
        titleHighlight={heroContent.titleHighlight}
        subtitle={heroContent.subtitle}
      />

      {/* Target Audience Carousel Section */}
      <section ref={tabsRef} className="py-20 bg-slate-50 animate-on-scroll">
        <div className="container mx-auto px-4 max-w-7xl">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {audiences.map((audience) => {
                const IconComponent = audience.icon
                return (
                  <CarouselItem key={audience.id}>
                    <Card className={`p-8 hover-lift animate-scale-in ${audience.featured ? 'border-brand-accent bg-slate-50' : ''}`}>
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-8">
                          <div className="flex-shrink-0">
                            <div className="w-20 h-20 bg-brand-light rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110">
                              <IconComponent className="w-10 h-10 text-brand-primary drop-shadow-md" strokeWidth={1.5} />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h2 className="text-3xl font-bold text-slate-900 animate-fade-in-right">{audience.title}</h2>
                              {audience.id === 'escolas' && (
                                <Badge variant="secondary" className="text-xs bg-brand-accent text-white">Popular</Badge>
                              )}
                            </div>
                            <p className="text-lg text-brand-primary mb-6 animate-fade-in-right delay-100">{audience.subtitle}</p>

                            <p className="text-slate-700 text-lg mb-8 leading-relaxed animate-fade-in-right delay-200">
                              {audience.description}
                            </p>

                            {/* Stats for Professores and Cursos Prep */}
                            {audience.stats && (
                              <div className="grid grid-cols-3 gap-6 mb-8">
                                {audience.stats.map((stat, index) => (
                                  <div key={index} className="text-center">
                                    <div className="text-3xl font-bold text-brand-primary mb-2">{stat.number}</div>
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
                                    <div key={index} className="text-center group">
                                      <div className="w-14 h-14 bg-brand-light rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                                        <FeatureIcon className="w-7 h-7 text-brand-primary" strokeWidth={1.5} />
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
                                  <CheckCircle className="w-5 h-5 text-brand-secondary flex-shrink-0" />
                                  <span className="text-slate-700">{feature}</span>
                                </div>
                              ))}
                            </div>
                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-8">
                              {audience.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-brand-primary border-brand-accent">
                                  {tag}
                                </Badge>
                              ))}
                            </div>

                            {/* CTA */}
                            <Button
                              size="lg"
                              className="bg-brand-primary hover:bg-brand-secondary text-white px-8 py-3 text-lg"
                            >
                              {audience.cta}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                )
              })}
            </CarouselContent>
            <CarouselPrevious className="left-4 border-brand-primary text-brand-primary hover:bg-brand-light hover:text-brand-primary" />
            <CarouselNext className="right-4 border-brand-primary text-brand-primary hover:bg-brand-light hover:text-brand-primary" />
          </Carousel>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-8 bg-slate-50">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 text-slate-900 animate-fade-in-up">
            Encontre a solução perfeita para você
          </h2>
          <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto animate-fade-in-up delay-200">
            Seja estudante, professor, escola ou curso preparatório, temos o plano ideal para transformar o aprendizado da escrita.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-300">
            <Button size="lg" variant="secondary" className="bg-brand-primary text-white hover:bg-brand-secondary px-8 py-3 text-lg transition-all hover:scale-105">
              Ver Planos 
            </Button>
            <Button size="lg" variant="outline" className="border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white hover:border-brand-primary px-8 py-3 text-lg transition-all hover:scale-105 [&:hover]:!text-white">
              Falar com Especialista
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ParaQuem
