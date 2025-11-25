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
  Building2
} from 'lucide-react'

function ParaQuem() {
  const tabsRef = useScrollAnimation()
  
  const audiences = [
    {
      id: 'estudantes',
      icon: UserCircle,
      title: 'Estudantes',
      description: 'Ideal para quem quer desenvolver habilidades de escrita exigidas pela escola, pelo ENEM e pelas competências do século XXI. Aqui, o aluno vivencia uma imersão autorregulada, em que pode escrever, reescrever e analisar, com análises ilimitadas e insights inteligentes. A IA atua como assistente de escrita, ajudando a aprimorar argumentos, estrutura e linguagem.',
      cta: 'Saiba Mais para Estudantes',
      ctaLink: '/recursos'
    },
    {
      id: 'professores',
      icon: Presentation,
      title: 'Professores',
      description: 'Pensado para educadores que atuam em cursos preparatórios ou plataformas online, o Escrita360 otimiza o tempo de correção e amplia o alcance do ensino de redação. Com relatórios automáticos e acompanhamento por versão, o professor foca no que importa: orientar o aprendizado.',
      subtitle: 'Mais produtividade para o professor, mais aprendizado para o aluno.',
      cta: 'Conheça os Recursos',
      ctaLink: '/recursos'
    },
    {
      id: 'escolas',
      icon: Building2,
      title: 'Escolas',
      description: 'Plataforma completa para integrar a escrita autoral ao currículo, desenvolvendo autonomia e autorregulação nos alunos. Permite acompanhar turmas em tempo real, gerar relatórios personalizados e promover práticas de escrita formativas em larga escala.',
      subtitle: 'Ideal para redações escolares e preparatórios para o ENEM.',
      cta: 'Agendar Demonstração',
      ctaLink: '/recursos',
      featured: true
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
                    <Card className={`p-6 hover-lift animate-scale-in ${audience.featured ? 'border-brand-accent bg-slate-50' : ''}`}>
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-6">
                          <div className="flex-shrink-0">
                            <div className="w-16 h-16 bg-brand-light rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110">
                              <IconComponent className="w-8 h-8 text-brand-primary drop-shadow-md" strokeWidth={1.5} />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h2 className="text-2xl font-bold text-slate-900 animate-fade-in-right">{audience.title}</h2>
                              {audience.featured && (
                                <Badge variant="secondary" className="text-xs bg-brand-accent text-white">Popular</Badge>
                              )}
                            </div>

                            <p className="text-slate-700 text-base mb-4 leading-relaxed animate-fade-in-right delay-100">
                              {audience.description}
                            </p>

                            <p className="text-base text-brand-primary font-medium mb-6 animate-fade-in-right delay-200">
                              {audience.subtitle}
                            </p>
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
    </div>
  )
}

export default ParaQuem
