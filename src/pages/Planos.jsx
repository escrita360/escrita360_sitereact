import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion.jsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx'
import { Check, X, Star } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { useScrollAnimation } from '@/hooks/use-scroll-animation.js'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { PageHero } from '@/components/PageHero.jsx'

function Precos() {
  const [searchParams] = useSearchParams()
  const audienceFromUrl = searchParams.get('audience') || 'estudantes'
  const [selectedAudience, setSelectedAudience] = useState(audienceFromUrl)
  const navigate = useNavigate()
  const plansRef = useScrollAnimation()

  // Atualizar quando a URL mudar
  useEffect(() => {
    const urlAudience = searchParams.get('audience')
    if (urlAudience && urlAudience !== selectedAudience) {
      setSelectedAudience(urlAudience)
    }
  }, [searchParams, selectedAudience])

  // Scroll to top when audience changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [selectedAudience])

  const handleOpenPagamento = (plan) => {
    navigate('/pagamento', { state: { selectedPlan: plan, audience: selectedAudience } })
  }

  // Planos para estudantes
  const studentPlans = [
    {
      name: 'Plano Mensal',
      badge: 'Acesso imediato',
      monthlyPrice: 49,
      yearlyPrice: 588,
      description: 'Plano Híbrido (Uso da plataforma + créditos de IA)',
      credits: 10,
      features: [
        { text: 'Módulo de escrita digital autorregulada', included: true },
        { text: 'Banco de estratégias para escrita', included: true },
        { text: 'Sugestão de temas', included: true },
        { text: 'Recursos de apoio autorregulatório', included: true },
        { text: 'Insights para melhoria da escrita', included: true },
        { text: 'Revisor integrado com recursos de análise ilimitada', included: true },
        { text: 'Rubricas qualitativas para (auto)avaliação', included: true },
        { text: "10 análises detalhadas de redações do ENEM por IA", included: true, highlighted: true },
        { text: 'Acesso por 30 dias', included: true }
      ],
      buttonText: 'Escolher Mensal',
      buttonVariant: 'default'
    },
    {
      name: 'Plano Trimestral',
      badge: 'Melhor custo-benefício',
      monthlyPrice: 120,
      yearlyPrice: 480,
      description: 'Plano Híbrido (Uso da plataforma + créditos de IA)',
      credits: 50,
      popular: true,
      features: [
        { text: 'Módulo de escrita digital autorregulada', included: true },
        { text: 'Banco de estratégias para escrita', included: true },
        { text: 'Sugestão de temas', included: true },
        { text: 'Recursos de apoio autorregulatório', included: true },
        { text: 'Insights para melhoria da escrita', included: true },
        { text: 'Revisor integrado com recursos de análise ilimitada', included: true },
        { text: 'Rubricas qualitativas para (auto)avaliação', included: true },
        { text: '50 análises detalhadas de redações do ENEM por IA', included: true, highlighted: true },
        { text: 'Acesso por 90 dias', included: true }
      ],
      buttonText: 'Escolher Trimestral',
      buttonVariant: 'default'
    }
  ]

  // Planos para professores
  const teacherPlans = [
    {
      name: 'Plano 1 Mensal',
      badge: 'Para começar',
      monthlyPrice: 49,
      yearlyPrice: 588,
      description: 'Plano Híbrido (Plataforma + créditos de IA)',
      credits: 10,
      features: [
        { text: 'Módulo de escrita digital autorregulada', included: true },
        { text: 'Banco de estratégias para escrita', included: true },
        { text: 'Sugestão de temas', included: true },
        { text: 'Recursos de apoio autorregulatório', included: true },
        { text: 'Insights para melhoria da escrita', included: true },
        { text: 'Revisor integrado com recursos de análise ilimitada', included: true },
        { text: 'Rubricas qualitativas para (auto)avaliação', included: true },
        { text: '10 análises detalhadas de redações por IA', included: true, highlighted: true },
        { text: 'Correção por foto ou digitada', included: true },
        { text: 'Acesso por 30 dias', included: true }
      ],
      buttonText: 'Escolher Plano 1',
      buttonVariant: 'default'
    },
    {
      name: 'Plano 2 Mensal',
      badge: 'Mais escolhido',
      monthlyPrice: 130,
      yearlyPrice: 1560,
      description: 'Plano Híbrido (Plataforma + créditos de IA)',
      credits: 100,
      popular: true,
      features: [
        { text: 'Módulo de escrita digital autorregulada', included: true },
        { text: 'Banco de estratégias para escrita', included: true },
        { text: 'Sugestão de temas', included: true },
        { text: 'Recursos de apoio autorregulatório', included: true },
        { text: 'Insights para melhoria da escrita', included: true },
        { text: 'Revisor integrado com recursos de análise ilimitada', included: true },
        { text: 'Rubricas qualitativas para (auto)avaliação', included: true },
        { text: '100 análises detalhadas de redações por IA', included: true, highlighted: true },
        { text: 'Correção por foto ou digitada', included: true },
        { text: 'Acesso por 30 dias', included: true }
      ],
      buttonText: 'Escolher Plano 2',
      buttonVariant: 'default'
    },
    {
      name: 'Plano Trimestral',
      badge: 'Economia garantida',
      monthlyPrice: 320,
      yearlyPrice: 1280,
      description: 'Plano Híbrido (Plataforma + créditos de IA)',
      credits: 200,
      features: [
        { text: 'Módulo de escrita digital autorregulada', included: true },
        { text: 'Banco de estratégias para escrita', included: true },
        { text: 'Sugestão de temas', included: true },
        { text: 'Recursos de apoio autorregulatório', included: true },
        { text: 'Insights para melhoria da escrita', included: true },
        { text: 'Revisor integrado com recursos de análise ilimitada', included: true },
        { text: 'Rubricas qualitativas para (auto)avaliação', included: true },
        { text: '200 análises detalhadas de redações por IA', included: true, highlighted: true },
        { text: 'Correção por foto ou digitada', included: true },
        { text: 'Acesso por 90 dias', included: true }
      ],
      buttonText: 'Escolher Trimestral',
      buttonVariant: 'default'
    },
    {
      name: 'Plano Semestral',
      badge: 'Melhor investimento',
      monthlyPrice: 465,
      yearlyPrice: 930,
      description: 'Plano Híbrido (Plataforma + créditos de IA)',
      credits: 300,
      features: [
        { text: 'Módulo de escrita digital autorregulada', included: true },
        { text: 'Banco de estratégias para escrita', included: true },
        { text: 'Sugestão de temas', included: true },
        { text: 'Recursos de apoio autorregulatório', included: true },
        { text: 'Insights para melhoria da escrita', included: true },
        { text: 'Revisor integrado com recursos de análise ilimitada', included: true },
        { text: 'Rubricas qualitativas para (auto)avaliação', included: true },
        { text: '300 análises detalhadas de redações por IA', included: true, highlighted: true },
        { text: 'Correção por foto ou digitada', included: true },
        { text: 'Acesso por 180 dias', included: true }
      ],
      buttonText: 'Escolher Semestral',
      buttonVariant: 'default'
    }
  ]

  // Planos para escolas
  const schoolPlans = [
    {
      name: 'Plano Híbrido 360',
      badge: 'Institucional completo',
      monthlyPrice: 295,
      yearlyPrice: 3540,
      description: 'Integração total entre os módulos Professor e Aluno',
      features: [
        { text: 'Módulo de escrita digital autorregulada', included: true },
        { text: 'Banco de estratégias para escrita', included: true },
        { text: 'Sugestão de temas', included: true },
        { text: 'Recursos de apoio autorregulatório', included: true },
        { text: 'Insights para melhoria da escrita', included: true },
        { text: 'Revisor integrado com recursos de análise ilimitada', included: true },
        { text: 'Rubricas qualitativas para (auto)avaliação', included: true },
        { text: 'Correção por foto ou digitada', included: true },
        { text: 'Dashboard institucional completo', included: true },
        { text: 'Integração Professor-Aluno total', included: true },
        { text: 'Relatórios automáticos (autoavaliação, sentimentos, IA)', included: true },
        { text: 'O acesso permanece ativo durante o período letivo', included: true, highlighted: true }
      ],
      buttonText: 'Escolher Híbrido 360',
      buttonVariant: 'default'
    }
  ]

  // Pacotes de créditos para estudantes
  const studentCreditPackages = [
    {
      name: 'Pacote 1',
      credits: 5,
      price: 20,
      description: '',
      features: ['Análises detalhadas por IA', 'Validade de 30 dias', 'Suporte incluído']
    },
    {
      name: 'Pacote 2',
      credits: 15,
      price: 45,
      description: '',
      features: ['Análises detalhadas por IA', 'Validade de 30 dias', 'Suporte incluído']
    },
    {
      name: 'Pacote 3',
      credits: 30,
      price: 60,
      description: '',
      popular: true,
      features: ['Análises detalhadas por IA', 'Validade de 30 dias', 'Suporte incluído', 'Melhor custo-benefício']
    }
  ]

  // Pacotes de créditos para professores
  const teacherCreditPackages = [
    {
      name: 'Pacote 1',
      credits: 100,
      price: 155,
      description: '',
      features: ['Análises detalhadas por IA', 'Validade de 30 dias', 'Suporte incluído']
    },
    {
      name: 'Pacote 2',
      credits: 200,
      price: 300,
      description: '',
      popular: true,
      features: ['Análises detalhadas por IA', 'Validade de 30 dias', 'Suporte incluído', 'Melhor custo-benefício']
    }
  ]

  // Pacotes de créditos para escolas
  const schoolCreditPackages = [
    {
      name: 'Pacote Escolar 1',
      credits: 3000,
      price: 6300,
      description: '',
      features: ['Análises detalhadas por IA', 'Validade de 90 dias', 'Suporte prioritário', 'Relatórios institucionais']
    },
    {
      name: 'Pacote Escolar 2',
      credits: 5000,
      price: 10200,
      description: '',
      popular: true,
      features: ['Análises detalhadas por IA', 'Validade de 90 dias', 'Suporte prioritário', 'Relatórios institucionais', 'Melhor custo-benefício']
    }
  ]

  // Selecionar pacotes de créditos baseado no público alvo
  const getCurrentCreditPackages = () => {
    switch (selectedAudience) {
      case 'estudantes':
        return studentCreditPackages
      case 'professores':
        return teacherCreditPackages
      case 'escolas':
        return schoolCreditPackages
      default:
        return studentCreditPackages
    }
  }

  const creditPackages = getCurrentCreditPackages()

  // Modelos de assinatura para escolas
  const schoolModels = [
    {
      title: 'Assinatura Institucional',
      focus: 'Facilitar o trabalho dos professores e otimizar a correção das redações realizadas em sala de aula e das provas de redação realizadas na escola.',
      description: 'A escola adquire Planos Híbridos (plataforma + créditos de IA), disponíveis nas versões mensal, semestral ou anual, para os professores de Língua Portuguesa ou demais docentes envolvidos na produção e correção de redações e adquire pacotes adicionais de créditos, conforme a demanda de correções dos estudantes.',
      number: 1
    },
    {
      title: 'Assinatura Compartilhada (Escola + Família)',
      focus: 'Implementar o uso da plataforma de forma completa, fomentar a autorregulação da aprendizagem, otimizar o processo de correção das redações e acompanhar o desenvolvimento das habilidades de escrita dos estudantes por meio de métricas e dados de desempenho.',
      description: 'Nesse modelo, os pais adquirem a assinatura da plataforma e a escola adquire o Plano Híbrido 360 (integração total entre os módulos Professor e Aluno) e os créditos de IA necessários para as correções das atividades e provas de redação realizadas na escola. A instituição tem acesso a todos os recursos da Plataforma e um Dashboard institucional que centraliza o acompanhamento pedagógico.',
      benefits: 'Esse modelo fortalece o engajamento entre escola e família, permitindo que os pais acompanhem de forma contínua a evolução das habilidades de escrita dos estudantes.',
      consultation: true,
      number: 2,
      highlighted: true
    }
  ]

  // Selecionar planos baseado no público alvo
  const getCurrentPlans = () => {
    switch (selectedAudience) {
      case 'estudantes':
        return studentPlans
      case 'professores':
        return teacherPlans
      case 'escolas':
        return schoolPlans
      default:
        return studentPlans
    }
  }

  const currentPlans = getCurrentPlans()

  // Conteúdo do hero baseado no público selecionado
  const getHeroContent = () => {
    if (selectedAudience === 'estudantes') {
      return {
        title: 'Planos para',
        titleHighlight: 'Estudantes',
        subtitle: 'Desenvolva suas habilidades de escrita para o ENEM e vestibulares. Aprenda no seu ritmo com nossa metodologia autorregulada.'
      }
    } else if (selectedAudience === 'professores') {
      return {
        title: 'Planos para',
        titleHighlight: 'Professores',
        subtitle: 'Escolha o plano que acompanha seu fluxo de redações, com correções ilimitadas na própria plataforma e créditos de IA.'
      }
    } else {
      return {
        title: 'Planos para',
        titleHighlight: 'Escolas',
        subtitle: 'Escolha o plano de adesão que melhor se adapta às necessidades de produção e correção de sua instituição.'
      }
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

      {/* Pricing Grid */}
      <section ref={plansRef} className="pt-12 pb-8 md:pt-16 md:pb-12 lg:pt-20 lg:pb-16 bg-white animate-on-scroll">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className={`grid gap-8 mx-auto mt-6 ${
            selectedAudience === 'escolas' ? 'max-w-2xl' :
            selectedAudience === 'professores' ? 'md:grid-cols-2 lg:grid-cols-2 max-w-6xl' : 
            'md:grid-cols-2 max-w-5xl'
          }`}>
            {currentPlans.map((plan, index) => (
              <Card key={index} className={`relative hover-lift animate-scale-in delay-${index * 200} ${plan.popular ? 'border-2 border-brand-primary shadow-xl' : 'hover:shadow-xl'} transition-all flex flex-col pt-4 aspect-square`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 animate-float">
                    <Badge className="bg-brand-primary text-white px-4 py-1">
                      {plan.badge}
                    </Badge>
                  </div>
                )}
                {plan.credits && (
                  <div className="absolute -top-4 right-4 animate-float">
                    <Badge className="bg-yellow-500 text-white px-3 py-1">
                      {plan.credits} créditos IA
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-2">
                  <div className="mb-1">
                    {!plan.popular && <Badge variant="secondary" className="text-xs">
                      {plan.badge}
                    </Badge>}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                  <div className="my-3">
                    {plan.consultation ? (
                      <div className="text-center">
                        <span className="text-lg text-slate-600">Valor sob consulta</span>
                        <p className="text-sm text-slate-500 mt-1">Definido conforme número de alunos e turmas</p>
                      </div>
                    ) : (
                      <>
                        <span className="text-3xl font-bold text-brand-primary">R$</span>
                        <span className="text-4xl font-bold text-brand-primary">
                          {plan.monthlyPrice}
                        </span>
                        <span className="text-slate-600">
                          {plan.name.includes('Trimestral') ? '/3 meses' : 
                           plan.name.includes('Semestral') ? '/6 meses' : '/mês'}
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-slate-600 text-sm">{plan.description}</p>
                </CardHeader>
                <CardContent className="flex flex-col h-full">
                  <ul className="space-y-2 mb-6 flex-grow">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className={`flex items-start gap-2 ${feature.highlighted ? 'font-semibold text-brand-primary' : ''}`}>
                        <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700 text-sm">{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full transition-all duration-300 hover:scale-105 mt-auto bg-[#4A90E2] hover:bg-[#357ABD] text-white"
                    variant="default"
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

      {/* School Models Section - Only for schools */}
      {selectedAudience === 'escolas' && (
        <section className="py-8 md:py-12 lg:py-16 bg-slate-50">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Modelos de Assinatura</h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Com foco em flexibilidade e integração pedagógica, oferecemos dois modelos de assinatura para instituições de ensino
              </p>
            </div>
            
            <div className="space-y-8 max-w-5xl mx-auto">
              {schoolModels.map((model, index) => (
                <Card key={index} className={`overflow-hidden hover-lift ${model.highlighted ? 'border-2 border-green-500 shadow-xl' : 'border border-slate-200'}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-6">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0 ${
                        model.highlighted ? 'bg-green-500 text-white' : 'bg-brand-primary text-white'
                      }`}>
                        {model.number}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-slate-900 mb-3">{model.title}</h3>
                        <div className="mb-4">
                          <strong className="text-slate-700">Foco:</strong> {model.focus}
                        </div>
                        <p className="text-slate-600 mb-4 leading-relaxed">{model.description}</p>
                        {model.benefits && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                            <p className="text-green-800 font-medium">{model.benefits}</p>
                          </div>
                        )}
                        {model.consultation && (
                          <div className="bg-brand-light rounded-lg p-4 text-center">
                            <p className="text-brand-primary font-semibold">
                              Valor definido conforme número de alunos e turmas. Entre em contato para receber uma proposta personalizada.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Credit Packages Section - For all audiences */}
      {(selectedAudience === 'estudantes' || selectedAudience === 'professores' || selectedAudience === 'escolas') && (
        <section className="pt-12 pb-8 md:pt-16 md:pb-12 lg:pt-20 lg:pb-16 bg-white">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                {selectedAudience === 'escolas' ? 'Pacotes de Créditos para Escolas' : 'Pacotes de Créditos'}
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                {selectedAudience === 'estudantes' 
                  ? 'Para quem já tem acesso à plataforma e precisa de mais análises com IA'
                  : selectedAudience === 'professores'
                  ? 'Para professores que precisam de mais análises além do plano contratado'
                  : 'Créditos de IA para análises detalhadas das redações dos estudantes'
                }
              </p>
            </div>
            
            <div className={`grid gap-8 mx-auto justify-items-center mt-6 ${
              selectedAudience === 'escolas' ? 'md:grid-cols-2 max-w-3xl gap-x-8 gap-y-12' : 
              selectedAudience === 'professores' ? 'md:grid-cols-2 max-w-4xl gap-x-8 gap-y-12' :
              'md:grid-cols-3 max-w-5xl gap-x-6 gap-y-12'
            }`}>
              {creditPackages.map((pkg, index) => (
                <Card key={index} className={`relative hover-lift ${pkg.popular ? 'border-2 border-green-500 shadow-xl' : 'hover:shadow-xl'} transition-all flex flex-col pt-4 aspect-square`}>
                  {pkg.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-green-500 text-white px-4 py-1">Melhor Custo-Benefício</Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-2">
                    <h3 className="text-lg font-bold text-slate-900">{pkg.name}</h3>
                    <div className="my-2">
                      <span className="text-2xl font-bold text-brand-primary">
                        R$ {selectedAudience === 'escolas' ? pkg.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : pkg.price}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm">
                      <strong>{pkg.credits} créditos</strong>
                    </p>
                    <p className="text-slate-600 text-xs mt-1">{pkg.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1 mb-4">
                      {pkg.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-2">
                          <Check className="w-3 h-3 text-green-600 flex-shrink-0" />
                          <span className="text-slate-700 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="w-full bg-[#4A90E2] hover:bg-[#357ABD] text-white" 
                      variant="default"
                      onClick={() => navigate('/pagamento-creditos', { state: { selectedPackage: pkg, audience: selectedAudience } })}
                    >
                      Adquirir Pacote
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-12 text-center max-w-3xl mx-auto">
              <Card className="bg-slate-50 border-slate-200">
                <CardContent className="p-6">
                  <h4 className="text-lg font-bold text-slate-900 mb-3">Como funcionam os créditos?</h4>
                  <p className="text-slate-600 mb-4">
                    {selectedAudience === 'escolas' 
                      ? 'Cada crédito equivale a uma análise completa e detalhada da redação de um estudante pela nossa IA especializada. Os créditos têm validade de 90 dias a partir da data de compra e podem ser compartilhados entre os professores da instituição.'
                      : 'Cada crédito equivale a uma análise completa e detalhada da sua redação pela nossa IA especializada. Os créditos têm validade de 30 dias a partir da data de compra.'
                    }
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-brand-primary rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-white font-bold">1</span>
                      </div>
                      <p className="text-sm text-slate-700">Envie sua redação</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-brand-primary rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-white font-bold">2</span>
                      </div>
                      <p className="text-sm text-slate-700">IA analisa detalhadamente</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-brand-primary rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-white font-bold">3</span>
                      </div>
                      <p className="text-sm text-slate-700">Receba feedback completo</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* How It Works Section */}
      <section className="pt-12 pb-8 md:pt-16 md:pb-12 lg:pt-20 lg:pb-16 bg-slate-50">
        <div className="container mx-auto px-4 max-w-7xl">
    <div className="text-center mb-12">
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Como Funciona o Escrita360</h2>
    </div>          <div className="max-w-4xl mx-auto mb-12">
            <Card className="bg-gradient-to-br from-brand-light to-white border-2 border-brand-primary/20 shadow-lg">
              <CardContent className="p-6">
                <p className="text-lg text-slate-700 leading-relaxed text-center">
                  A plataforma prioriza o processo formativo de escrever e reescrever, a correção automática com IA só aparece no final, como suporte complementar. <br /><strong className="text-brand-primary">IA como última etapa: revisão que fortalece o aprendizado.</strong>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Precos
