import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Switch } from '@/components/ui/switch.jsx'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion.jsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.jsx'
import { Check, X, Quote, Star } from 'lucide-react'
import React, { useState } from 'react'
import { useScrollAnimation } from '@/hooks/use-scroll-animation.js'
import PagamentoDialog from './Pagamento.jsx'

function Precos() {
  const [isYearly, setIsYearly] = useState(false)
  const [isPagamentoOpen, setIsPagamentoOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const heroRef = useScrollAnimation()
  const plansRef = useScrollAnimation()
  const comparisonRef = useScrollAnimation()

  const handleOpenPagamento = (plan) => {
    setSelectedPlan(plan)
    setIsPagamentoOpen(true)
  }

  const plans = [
    {
      name: 'Gratuito',
      badge: 'Ideal para começar',
      monthlyPrice: 0,
      yearlyPrice: 0,
      description: 'Perfeito para experimentar nossa metodologia de escrita autorregulada',
      features: [
        { text: '3 correções por mês', included: true },
        { text: 'Processo completo de escrita', included: true },
        { text: 'Análise das 5 competências', included: true },
        { text: 'Banco de temas limitado', included: true },
        { text: 'Relatórios básicos', included: true },
        { text: 'Painel de sentimentos', included: true },
        { text: 'Estratégias autorreguladas', included: true }
      ],
      buttonText: 'Assinar',
      buttonVariant: 'default'
    },
    {
      name: 'Professor',
      badge: 'Solução completa',
      monthlyPrice: 47,
      yearlyPrice: 33,
      description: 'Ideal para professores independentes e pequenas turmas',
      popular: true,
      features: [
        { text: 'Até 30 alunos', included: true },
        { text: 'Correções ilimitadas', included: true },
        { text: 'Dashboard completo', included: true },
        { text: 'Relatórios detalhados', included: true },
        { text: 'Banco completo de temas', included: true },
        { text: 'Suporte prioritário', included: true },
        { text: 'Treinamento incluído', included: true },
        { text: 'Gestão de turmas', included: true },
        { text: 'Habilidades BNCC', included: true },
        { text: 'Acompanhamento em tempo real', included: true }
      ],
      buttonText: 'Assinar',
      buttonVariant: 'default'
    },
    {
      name: 'Escola',
      badge: 'Máximo resultado',
      monthlyPrice: 197,
      yearlyPrice: 138,
      description: 'Solução completa para instituições de ensino de todos os tamanhos',
      features: [
        { text: 'Usuários ilimitados', included: true },
        { text: 'Múltiplos professores', included: true },
        { text: 'Dashboards administrativos', included: true },
        { text: 'Relatórios institucionais', included: true },
        { text: 'White-label disponível', included: true },
        { text: 'Integração com LMS', included: true },
        { text: 'Suporte dedicado 24/7', included: true },
        { text: 'Consultoria pedagógica', included: true },
        { text: 'Gerente de conta exclusivo', included: true },
        { text: 'Treinamento personalizado', included: true },
        { text: 'API completa', included: true },
        { text: 'SLA garantido', included: true }
      ],
      buttonText: 'Assinar',
      buttonVariant: 'default'
    }
  ]

  const comparisonData = [
    { feature: 'Correções por mês', free: '3', professor: 'Ilimitadas', escola: 'Ilimitadas' },
    { feature: 'Número de alunos', free: '1', professor: 'Até 30', escola: 'Ilimitados' },
    { feature: 'Processo de escrita autorregulada', free: true, professor: true, escola: true },
    { feature: 'Análise das 5 competências ENEM', free: true, professor: true, escola: true },
    { feature: 'Painel de sentimentos', free: true, professor: true, escola: true },
    { feature: 'Banco de temas', free: 'Limitado', professor: 'Completo', escola: 'Completo + Personalizado' },
    { feature: 'Dashboard de acompanhamento', free: 'Básico', professor: 'Completo', escola: 'Administrativo Avançado' },
    { feature: 'Relatórios', free: 'Básicos', professor: 'Detalhados', escola: 'Institucionais Completos' },
    { feature: 'Gestão de turmas', free: false, professor: true, escola: true },
    { feature: 'Suporte prioritário', free: false, professor: true, escola: true },
    { feature: 'Integração com LMS', free: false, professor: false, escola: true },
    { feature: 'API completa', free: false, professor: false, escola: true }
  ]

  const successStories = [
    {
      quote: "O Escrita360 foi fundamental na minha aprovação em Medicina na USP. Melhorei minha nota de redação de 680 para 920 pontos em apenas 4 meses. A metodologia de autorregulação me ensinou a revisar meus textos de forma crítica e independente.",
      author: "Ana Carolina Silva",
      role: "Estudante de Medicina",
      avatar: "/placeholder-avatar-1.jpg"
    },
    {
      quote: "Como professor, economizo horas de correção e consigo acompanhar o desenvolvimento de cada aluno individualmente. Os relatórios detalhados facilitam muito a identificação de dificuldades específicas e o planejamento de intervenções pedagógicas.",
      author: "Prof. Roberto Santos",
      role: "Professor de Língua Portuguesa",
      avatar: "/placeholder-avatar-2.jpg"
    },
    {
      quote: "Nossa escola implementou a plataforma e os resultados são impressionantes. A média das notas de redação dos nossos alunos aumentou 35% no primeiro ano. O acompanhamento em tempo real nos permite intervir rapidamente quando necessário.",
      author: "Dra. Maria Fernandes",
      role: "Diretora Pedagógica",
      avatar: "/placeholder-avatar-3.jpg"
    }
  ]

  const faqs = [
    {
      question: "Posso experimentar gratuitamente?",
      answer: "Sim! O plano gratuito permite que você experimente toda a metodologia de escrita autorregulada com 3 correções por mês. Não é necessário cartão de crédito."
    },
    {
      question: "Como funciona o plano anual?",
      answer: "Ao optar pelo plano anual, você economiza 30% e faz um único pagamento no início do período. É possível parcelar em até 12x sem juros."
    },
    {
      question: "Posso cancelar a qualquer momento?",
      answer: "Sim, você pode cancelar sua assinatura a qualquer momento. No plano mensal, a cobrança é interrompida imediatamente. No anual, você continua usando até o fim do período contratado."
    },
    {
      question: "Posso fazer upgrade do meu plano?",
      answer: "No plano Professor, você pode fazer upgrade a qualquer momento. Também oferecemos planos customizados para professores que precisam de mais vagas."
    },
    {
      question: "O plano Escola inclui treinamento?",
      answer: "Sim! O plano Escola inclui treinamento personalizado para toda a equipe pedagógica, além de consultoria contínua e material de apoio."
    },
    {
      question: "A plataforma integra com outros sistemas?",
      answer: "Nossa API permite integração com principais plataformas de gestão de aprendizagem (Moodle, Canvas, Google Classroom, etc). Nossa equipe técnica auxilia na implementação."
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section ref={heroRef} className="bg-white py-12 md:py-16 lg:py-20 animate-on-scroll">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-slate-900 animate-fade-in-up">
            Planos que se adaptam à sua necessidade
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto animate-fade-in-up delay-200">
            Escolha o plano ideal para transformar o processo de escrita e alcance resultados extraordinários
          </p>
        </div>
      </section>

      {/* Pricing Toggle */}
      <section className="py-8 bg-slate-50 border-b">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-center gap-4 animate-fade-in-up">
            <span className={`text-lg ${!isYearly ? 'font-bold text-brand-primary' : 'text-gray-600'}`}>
              Mensal
            </span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className="data-[state=checked]:bg-brand-primary"
            />
            <span className={`text-lg ${isYearly ? 'font-bold text-brand-primary' : 'text-gray-600'}`}>
              Anual <small className="text-green-600 font-medium">(Economize 30%)</small>
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Grid */}
      <section ref={plansRef} className="py-8 md:py-12 lg:py-16 bg-white animate-on-scroll">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative hover-lift animate-scale-in delay-${index * 200} ${plan.popular ? 'border-2 border-brand-primary shadow-xl' : 'hover:shadow-xl'} transition-all flex flex-col`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 animate-float">
                    <Badge className="bg-brand-primary text-white px-4 py-1">
                      Mais Escolhido
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <div className="mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {plan.badge}
                    </Badge>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">{plan.name}</h3>
                  <div className="my-4">
                    <span className="text-4xl font-bold text-brand-primary">R$</span>
                    <span className="text-5xl font-bold text-brand-primary">
                      {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                    </span>
                    <span className="text-slate-600">
                      /{isYearly ? 'mês' : 'mês'}
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm">{plan.description}</p>
                </CardHeader>
                <CardContent className="flex flex-col h-full">
                  <ul className="space-y-3 mb-8 flex-grow">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700 text-sm">{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full transition-all duration-300 hover:scale-105 mt-auto"
                    variant={plan.buttonVariant}
                    size="lg"
                    onClick={() => handleOpenPagamento(plan)}
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section ref={comparisonRef} className="py-8 md:py-12 lg:py-16 bg-gradient-to-b from-slate-50 to-white animate-on-scroll">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Comparação Detalhada de Planos
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Veja todas as funcionalidades e escolha o plano ideal para suas necessidades
            </p>
          </div>
          
          {/* Desktop View */}
          <div className="hidden lg:block max-w-7xl mx-auto animate-fade-in-up delay-200">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
              {/* Header */}
              <div className="grid grid-cols-4 gap-0 border-b border-slate-200 bg-slate-50">
                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-900">Recursos</h3>
                </div>
                <div className="p-6 text-center border-l border-slate-200">
                  <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-slate-100 mb-2">
                    <span className="text-sm font-semibold text-slate-700">Gratuito</span>
                  </div>
                </div>
                <div className="p-6 text-center border-l border-slate-200 bg-gradient-to-br from-blue-50 to-cyan-50 relative">
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-brand-primary text-white text-xs">Popular</Badge>
                  </div>
                  <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-brand-primary text-white mb-2">
                    <span className="text-sm font-semibold">Professor</span>
                  </div>
                </div>
                <div className="p-6 text-center border-l border-slate-200">
                  <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-slate-900 text-white mb-2">
                    <span className="text-sm font-semibold">Escola</span>
                  </div>
                </div>
              </div>

              {/* Rows */}
              {comparisonData.map((row, index) => (
                <div 
                  key={index} 
                  className={`grid grid-cols-4 gap-0 hover:bg-slate-50 transition-colors duration-200 ${
                    index !== comparisonData.length - 1 ? 'border-b border-slate-100' : ''
                  }`}
                >
                  <div className="p-5 flex items-center">
                    <span className="text-sm font-medium text-slate-700">{row.feature}</span>
                  </div>
                  <div className="p-5 flex items-center justify-center border-l border-slate-100">
                    {typeof row.free === 'boolean' ? (
                      row.free ? (
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100">
                          <Check className="w-5 h-5 text-green-600" />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100">
                          <X className="w-5 h-5 text-slate-400" />
                        </div>
                      )
                    ) : (
                      <span className="text-sm text-slate-600 font-medium">{row.free}</span>
                    )}
                  </div>
                  <div className="p-5 flex items-center justify-center border-l border-slate-100 bg-gradient-to-br from-blue-50/30 to-cyan-50/30">
                    {typeof row.professor === 'boolean' ? (
                      row.professor ? (
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100">
                          <Check className="w-5 h-5 text-green-600" />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100">
                          <X className="w-5 h-5 text-slate-400" />
                        </div>
                      )
                    ) : (
                      <span className="text-sm text-slate-700 font-medium">{row.professor}</span>
                    )}
                  </div>
                  <div className="p-5 flex items-center justify-center border-l border-slate-100">
                    {typeof row.escola === 'boolean' ? (
                      row.escola ? (
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100">
                          <Check className="w-5 h-5 text-green-600" />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100">
                          <X className="w-5 h-5 text-slate-400" />
                        </div>
                      )
                    ) : (
                      <span className="text-sm text-slate-600 font-medium">{row.escola}</span>
                    )}
                  </div>
                </div>
              ))}

              {/* Footer CTAs */}
              <div className="grid grid-cols-4 gap-0 bg-slate-50 p-6 border-t border-slate-200">
                <div className="p-2"></div>
                <div className="p-2 text-center">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full hover:bg-slate-900 hover:text-white transition-colors"
                    onClick={() => handleOpenPagamento(plans[0])}
                  >
                    Assinar Plano
                  </Button>
                </div>
                <div className="p-2 text-center">
                  <Button 
                    size="sm" 
                    className="w-full bg-brand-primary hover:bg-brand-secondary text-white transition-all hover:scale-105 shadow-md"
                    onClick={() => handleOpenPagamento(plans[1])}
                  >
                    Assinar Plano
                  </Button>
                </div>
                <div className="p-2 text-center">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full hover:bg-slate-900 hover:text-white transition-colors"
                    onClick={() => handleOpenPagamento(plans[2])}
                  >
                    Assinar Plano
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile View */}
          <div className="lg:hidden space-y-6 animate-fade-in-up delay-200">
            {plans.map((plan, planIndex) => (
              <Card key={planIndex} className={`overflow-hidden ${plan.popular ? 'border-2 border-brand-primary shadow-lg' : 'border border-slate-200'}`}>
                <CardHeader className={`${plan.popular ? 'bg-gradient-to-br from-blue-50 to-cyan-50' : 'bg-slate-50'} p-6`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                    {plan.popular && (
                      <Badge className="bg-brand-primary text-white">Popular</Badge>
                    )}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-brand-primary">
                      R$ {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                    </span>
                    <span className="text-slate-600">/mês</span>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {comparisonData.map((row, rowIndex) => {
                      const value = planIndex === 0 ? row.free : planIndex === 1 ? row.professor : row.escola
                      return (
                        <div key={rowIndex} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                          <span className="text-sm text-slate-700 flex-1">{row.feature}</span>
                          <div className="ml-4">
                            {typeof value === 'boolean' ? (
                              value ? (
                                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100">
                                  <Check className="w-4 h-4 text-green-600" />
                                </div>
                              ) : (
                                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100">
                                  <X className="w-4 h-4 text-slate-400" />
                                </div>
                              )
                            ) : (
                              <span className="text-sm text-slate-600 font-medium">{value}</span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <Button 
                    className={`w-full mt-6 transition-all ${
                      plan.popular 
                        ? 'bg-brand-primary hover:bg-brand-secondary text-white shadow-md hover:scale-105' 
                        : 'hover:bg-slate-900 hover:text-white'
                    }`}
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={() => handleOpenPagamento(plan)}
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Info Footer */}
          <div className="mt-8 text-center animate-fade-in-up delay-300">
            <p className="text-sm text-slate-500">
              Todos os planos incluem atualizações gratuitas e acesso às novas funcionalidades
            </p>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-8 md:py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-slate-900 mb-4 animate-fade-in-up">
            Histórias de Sucesso
          </h2>
          <p className="text-lg md:text-xl text-center text-slate-600 mb-8 md:mb-12 max-w-2xl mx-auto animate-fade-in-up delay-200">
            Veja como nossos usuários transformaram sua escrita e alcançaram seus objetivos
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {successStories.map((story, index) => (
              <Card key={index} className={`hover-lift animate-fade-in-up delay-${index * 200}`}>
                <CardContent className="p-6">
                  <Quote className="w-8 h-8 text-brand-primary mb-4 animate-pulse-glow" />
                  <p className="text-slate-700 mb-6 italic">"{story.quote}"</p>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={story.avatar} alt={story.author} />
                      <AvatarFallback>{story.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-slate-900">{story.author}</p>
                      <p className="text-sm text-slate-600">{story.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-8 md:py-12 lg:py-16 bg-slate-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-slate-900 mb-4 animate-fade-in-up">
            Perguntas Frequentes
          </h2>
          <p className="text-lg md:text-xl text-center text-slate-600 mb-8 md:mb-12 max-w-2xl mx-auto animate-fade-in-up delay-200">
            Tire suas dúvidas sobre nossos planos e funcionalidades
          </p>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4 animate-fade-in-up delay-300">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="bg-white rounded-lg border hover-lift">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <span className="text-left font-medium">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <p className="text-slate-600">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 md:py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 text-slate-900 animate-fade-in-up">
            Pronto para revolucionar a escrita?
          </h2>
          <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto animate-fade-in-up delay-200">
            Comece gratuitamente e veja a diferença que a autorregulação faz no desenvolvimento da escrita.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-300">
            <Button 
              size="lg" 
              variant="secondary" 
              className="bg-brand-primary text-white hover:bg-brand-secondary transition-all duration-300 hover:scale-105"
              onClick={() => handleOpenPagamento(plans[1])}
            >
              Assinar
            </Button>
            <Button size="lg" variant="outline" className="border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all duration-300 hover:scale-105 [&:hover]:!text-white">
              Falar com Especialista
            </Button>
          </div>
        </div>
      </section>

      {/* Modal de Pagamento */}
      <PagamentoDialog
        isOpen={isPagamentoOpen}
        onClose={() => setIsPagamentoOpen(false)}
        selectedPlan={selectedPlan}
        isYearly={isYearly}
      />
    </div>
  )
}

export default Precos
