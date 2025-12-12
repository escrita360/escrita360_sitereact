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
      badge: 'Preço promocional de lançamento',
      monthlyPrice: 49,
      yearlyPrice: 588,
      description: 'Projetado para uso individual e motivacional',
      subDescription: 'Aproveite o preço promocional de lançamento da Plataforma Escrita360',
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
        { text: 'Acesso por 30 dias', included: true }
      ],
      buttonText: 'Escolher Plano',
      buttonVariant: 'default'
    }
  ]

  // Planos para professores
  const teacherPlans = [
    {
      name: 'Plano 1 Mensal',
      badge: 'Preço promocional de lançamento',
      monthlyPrice: 49,
      yearlyPrice: 588,
      description: 'Plano Híbrido (Plataforma + créditos de IA)',
      subDescription: 'Aproveite o preço promocional de lançamento da Plataforma Escrita360',
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
      badge: 'Preço promocional de lançamento',
      monthlyPrice: 120,
      yearlyPrice: 1440,
      description: 'Plano Híbrido (Plataforma + créditos de IA)',
      subDescription: 'Aproveite o preço promocional de lançamento da Plataforma Escrita360',
      credits: 60,
      popular: true,
      features: [
        { text: 'Módulo de escrita digital autorregulada', included: true },
        { text: 'Banco de estratégias para escrita', included: true },
        { text: 'Sugestão de temas', included: true },
        { text: 'Recursos de apoio autorregulatório', included: true },
        { text: 'Insights para melhoria da escrita', included: true },
        { text: 'Revisor integrado com recursos de análise ilimitada', included: true },
        { text: 'Rubricas qualitativas para (auto)avaliação', included: true },
        { text: '60 análises detalhadas de redações por IA', included: true, highlighted: true },
        { text: 'Correção por foto ou digitada', included: true },
        { text: 'Acesso por 30 dias', included: true }
      ],
      buttonText: 'Escolher Plano 2',
      buttonVariant: 'default'
    },
    {
      name: 'Plano Trimestral',
      badge: 'Economia garantida',
      monthlyPrice: 390,
      yearlyPrice: 1560,
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
      monthlyPrice: 570,
      yearlyPrice: 1140,
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

  // Planos para escolas - Semestrais
  const schoolPlansSemestral = [
    {
      name: 'Plano Semestral',
      badge: 'Institucional',
      monthlyPrice: 1200,
      description: 'Plano Híbrido (Uso da plataforma + créditos de IA)',
      credits: 500,
      planType: 'semestral',
      features: [
        { text: 'Módulo de escrita digital autorregulada', included: true },
        { text: 'Banco de estratégias para escrita', included: true },
        { text: 'Sugestão de temas', included: true },
        { text: 'Recursos de apoio autorregulatório', included: true },
        { text: 'Insights para melhoria da escrita', included: true },
        { text: 'Revisor integrado com recursos de análise ilimitada', included: true },
        { text: 'Rubricas qualitativas para avaliação', included: true },
        { text: 'Correção por foto ou digitada (OCR)', included: true },
        { text: 'Relatórios automáticos (autoavaliação, sentimentos, IA)', included: true },
        { text: 'O acesso permanece ativo durante a vigência da assinatura', included: true, highlighted: true }
      ],
      buttonText: 'Escolher Plano',
      buttonVariant: 'default'
    },
    {
      name: 'Plano Semestral',
      badge: 'Institucional',
      monthlyPrice: 2400,
      description: 'Plano Híbrido (Uso da plataforma + créditos de IA)',
      credits: 1000,
      planType: 'semestral',
      popular: true,
      features: [
        { text: 'Módulo de escrita digital autorregulada', included: true },
        { text: 'Banco de estratégias para escrita', included: true },
        { text: 'Sugestão de temas', included: true },
        { text: 'Recursos de apoio autorregulatório', included: true },
        { text: 'Insights para melhoria da escrita', included: true },
        { text: 'Revisor integrado com recursos de análise ilimitada', included: true },
        { text: 'Rubricas qualitativas para avaliação', included: true },
        { text: 'Correção por foto ou digitada (OCR)', included: true },
        { text: 'Relatórios automáticos (autoavaliação, sentimentos, IA)', included: true },
        { text: 'O acesso permanece ativo durante a vigência da assinatura', included: true, highlighted: true }
      ],
      buttonText: 'Escolher Plano',
      buttonVariant: 'default'
    },
    {
      name: 'Plano Semestral',
      badge: 'Institucional',
      monthlyPrice: 4800,
      description: 'Plano Híbrido (Uso da plataforma + créditos de IA)',
      credits: 2000,
      planType: 'semestral',
      features: [
        { text: 'Módulo de escrita digital autorregulada', included: true },
        { text: 'Banco de estratégias para escrita', included: true },
        { text: 'Sugestão de temas', included: true },
        { text: 'Recursos de apoio autorregulatório', included: true },
        { text: 'Insights para melhoria da escrita', included: true },
        { text: 'Revisor integrado com recursos de análise ilimitada', included: true },
        { text: 'Rubricas qualitativas para avaliação', included: true },
        { text: 'Correção por foto ou digitada (OCR)', included: true },
        { text: 'Relatórios automáticos (autoavaliação, sentimentos, IA)', included: true },
        { text: 'O acesso permanece ativo durante a vigência da assinatura', included: true, highlighted: true }
      ],
      buttonText: 'Escolher Plano',
      buttonVariant: 'default'
    }
  ]

  // Planos para escolas - Anuais
  const schoolPlansAnual = [
    {
      name: 'Escola Plano Institucional (Anual)',
      badge: 'Anual Institucional',
      monthlyPrice: 2350,
      description: 'Plano Híbrido (Uso da plataforma + créditos de IA)',
      credits: 1000,
      planType: 'anual',
      features: [
        { text: 'Módulo de escrita digital autorregulada', included: true },
        { text: 'Banco de estratégias para escrita', included: true },
        { text: 'Sugestão de temas', included: true },
        { text: 'Recursos de apoio autorregulatório', included: true },
        { text: 'Insights para melhoria da escrita', included: true },
        { text: 'Revisor integrado com recursos de análise ilimitada', included: true },
        { text: 'Rubricas qualitativas para avaliação', included: true },
        { text: 'Correção por foto ou digitada (OCR)', included: true },
        { text: 'Relatórios automáticos (autoavaliação, sentimentos, IA)', included: true },
        { text: 'O acesso permanece ativo durante a vigência da assinatura', included: true, highlighted: true }
      ],
      buttonText: 'Escolher Plano',
      buttonVariant: 'default'
    },
    {
      name: 'Escola Plano Híbrido 360 (Anual)',
      badge: 'Anual',
      monthlyPrice: 2150,
      description: 'Plano Híbrido (Uso da plataforma + créditos de IA)',
      credits: 1000,
      planType: 'anual',
      features: [
        { text: 'Módulo de escrita digital autorregulada', included: true },
        { text: 'Banco de estratégias para escrita', included: true },
        { text: 'Sugestão de temas', included: true },
        { text: 'Recursos de apoio autorregulatório', included: true },
        { text: 'Insights para melhoria da escrita', included: true },
        { text: 'Revisor integrado com recursos de análise ilimitada', included: true },
        { text: 'Rubricas qualitativas para avaliação', included: true },
        { text: 'Correção por foto ou digitada (OCR)', included: true },
        { text: 'Relatórios automáticos (autoavaliação, sentimentos, IA)', included: true },
        { text: 'O acesso permanece ativo durante a vigência da assinatura', included: true, highlighted: true }
      ],
      buttonText: 'Escolher Plano',
      buttonVariant: 'default'
    },
    {
      name: 'Escola Plano Híbrido 360 (Anual)',
      badge: 'Anual',
      monthlyPrice: 4300,
      description: 'Plano Híbrido (Uso da plataforma + créditos de IA)',
      credits: 2000,
      planType: 'anual',
      popular: true,
      features: [
        { text: 'Módulo de escrita digital autorregulada', included: true },
        { text: 'Banco de estratégias para escrita', included: true },
        { text: 'Sugestão de temas', included: true },
        { text: 'Recursos de apoio autorregulatório', included: true },
        { text: 'Insights para melhoria da escrita', included: true },
        { text: 'Revisor integrado com recursos de análise ilimitada', included: true },
        { text: 'Rubricas qualitativas para avaliação', included: true },
        { text: 'Correção por foto ou digitada (OCR)', included: true },
        { text: 'Relatórios automáticos (autoavaliação, sentimentos, IA)', included: true },
        { text: 'O acesso permanece ativo durante a vigência da assinatura', included: true, highlighted: true }
      ],
      buttonText: 'Escolher Plano',
      buttonVariant: 'default'
    },
    {
      name: 'Escola Plano Híbrido 360 (Anual)',
      badge: 'Anual',
      monthlyPrice: 10750,
      description: 'Plano Híbrido (Uso da plataforma + créditos de IA)',
      credits: 5000,
      planType: 'anual',
      features: [
        { text: 'Módulo de escrita digital autorregulada', included: true },
        { text: 'Banco de estratégias para escrita', included: true },
        { text: 'Sugestão de temas', included: true },
        { text: 'Recursos de apoio autorregulatório', included: true },
        { text: 'Insights para melhoria da escrita', included: true },
        { text: 'Revisor integrado com recursos de análise ilimitada', included: true },
        { text: 'Rubricas qualitativas para avaliação', included: true },
        { text: 'Correção por foto ou digitada (OCR)', included: true },
        { text: 'Relatórios automáticos (autoavaliação, sentimentos, IA)', included: true },
        { text: 'O acesso permanece ativo durante a vigência da assinatura', included: true, highlighted: true }
      ],
      buttonText: 'Escolher Plano',
      buttonVariant: 'default'
    }
  ]

  // Combinar planos de escolas
  const schoolPlans = [...schoolPlansSemestral, ...schoolPlansAnual]

  // Pacotes de créditos para estudantes
  const studentCreditPackages = [
    {
      name: 'Pacote 1',
      credits: 5,
      price: 20,
      description: '',
      features: ['Análises detalhadas por IA', 'Validade de 30 dias']
    },
    {
      name: 'Pacote 2',
      credits: 15,
      price: 45,
      description: '',
      features: ['Análises detalhadas por IA', 'Validade de 30 dias']
    },
    {
      name: 'Pacote 3',
      credits: 30,
      price: 60,
      description: '',
      popular: true,
      features: ['Análises detalhadas por IA', 'Validade de 30 dias', 'Melhor custo-benefício']
    }
  ]

  // Pacotes de créditos para professores
  const teacherCreditPackages = [
    {
      name: 'Pacote 1',
      credits: 100,
      price: 200,
      description: '',
      features: ['Análises detalhadas por IA', 'Validade de 30 dias']
    },
    {
      name: 'Pacote 2',
      credits: 150,
      price: 300,
      description: '',
      popular: true,
      features: ['Análises detalhadas por IA', 'Validade de 30 dias', 'Melhor custo-benefício']
    }
  ]

  // Selecionar pacotes de créditos baseado no público alvo
  const getCurrentCreditPackages = () => {
    switch (selectedAudience) {
      case 'estudantes':
        return studentCreditPackages
      case 'professores':
        return teacherCreditPackages
      default:
        return studentCreditPackages
    }
  }

  const creditPackages = getCurrentCreditPackages()

  // Modelos de assinatura para escolas
  const schoolModels = [
    {
      title: 'Assinatura Institucional',
      focus: 'Facilitar o trabalho docente e otimizar a correção de textos produzidos em sala de aula e avaliações oficiais da escola (provas de redação).',
      description: 'A escola adquire Planos Híbridos (plataforma + créditos de IA), disponíveis nas versões semestral e anual para os professores envolvidos na produção e correção de redações e pode adquirir pacotes adicionais de créditos, conforme a demanda de correções da escola.',
      number: 1
    },
    {
      title: 'Assinatura Compartilhada - Plano Híbrido 360',
      focus: 'Ampliar a adesão e possibilitar o uso contínuo da plataforma e controle pedagógico à gestão.',
      description: 'O modelo híbrido combina a aquisição de assinaturas individuais, adquiridas pelas famílias (responsáveis) e assinaturas para os professores, adquiridas pela escola. Além das assinaturas, a escola adquire pacotes de créditos de IA, utilizados conforme a necessidade pedagógica. Esse modelo busca ampliar a adesão e possibilitar o uso contínuo da plataforma e controle pedagógico à gestão.',
      additionalInfo: 'Os créditos de IA podem ser utilizados para correção de textos produzidos pelos estudantes e provas de redação. As modalidades de contratação podem ser semestrais ou anuais. Alunos e professores têm acesso a todos os recursos da plataforma.',
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
        subtitle: 'Projetado para uso individual e motivacional. Aproveite o preço promocional de lançamento da Plataforma Escrita360.'
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

  // Features da plataforma por público
  const getPlatformFeatures = () => {
    if (selectedAudience === 'estudantes') {
      return [
        'Módulo de escrita digital autorregulada',
        'Banco de estratégias para escrita',
        'Sugestão de temas',
        'Recursos de apoio autorregulatório',
        'Insights para melhoria da escrita',
        'Revisor integrado com recursos de análise ilimitada',
        'Rubricas qualitativas para (auto)avaliação'
      ]
    } else if (selectedAudience === 'professores') {
      return [
        'Módulo de escrita digital autorregulada',
        'Banco de estratégias para escrita',
        'Sugestão de temas',
        'Recursos de apoio autorregulatório',
        'Insights para melhoria da escrita',
        'Revisor integrado com recursos de análise ilimitada',
        'Rubricas qualitativas para (auto)avaliação',
        'Correção por foto ou digitada'
      ]
    } else {
      return [
        'Módulo de escrita digital autorregulada',
        'Banco de estratégias para escrita',
        'Sugestão de temas',
        'Recursos de apoio autorregulatório',
        'Insights para melhoria da escrita',
        'Revisor integrado com recursos de análise ilimitada',
        'Rubricas qualitativas para avaliação',
        'Correção por foto ou digitada (OCR)',
        'Relatórios automáticos (autoavaliação, sentimentos, IA)'
      ]
    }
  }

  const platformFeatures = getPlatformFeatures()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <PageHero 
        title={heroContent.title}
        titleHighlight={heroContent.titleHighlight}
        subtitle={heroContent.subtitle}
      />

      {/* Platform Features Section - For all audiences */}
      <section className="py-8 md:py-12 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 mb-3">
              O que está incluso na plataforma
            </h2>
            <p className="text-slate-600">
              Todos os planos incluem acesso completo aos recursos da Escrita360
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 md:p-8">
            <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
              {platformFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-slate-700 text-sm md:text-base">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* School Models Section - Only for schools - FIRST */}
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
                        {model.additionalInfo && (
                          <p className="text-slate-600 mb-4 leading-relaxed">{model.additionalInfo}</p>
                        )}
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

      {/* Pricing Grid - Only for students and teachers */}
      {(selectedAudience === 'estudantes' || selectedAudience === 'professores') && (
        <section ref={plansRef} className="pt-12 pb-8 md:pt-16 md:pb-12 lg:pt-20 lg:pb-16 bg-white animate-on-scroll">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className={`grid gap-8 mx-auto mt-6 justify-center ${
              selectedAudience === 'professores' ? 'md:grid-cols-2 lg:grid-cols-2 max-w-5xl' : 
              'grid-cols-1 max-w-md'
            }`}>
              {currentPlans.map((plan, index) => (
                <Card key={index} className={`relative hover-lift animate-scale-in delay-${index * 200} ${plan.popular ? 'border-2 border-brand-primary shadow-xl' : 'hover:shadow-xl'} transition-all flex flex-col pt-6 w-full`}>
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 flex gap-2 animate-float">
                    {plan.popular && (
                      <Badge className="bg-brand-primary text-white px-3 py-1 text-xs whitespace-nowrap">
                        {plan.badge}
                      </Badge>
                    )}
                    {plan.credits && (
                      <Badge className="bg-yellow-500 text-white px-3 py-1 text-xs whitespace-nowrap">
                        {plan.credits} créditos IA
                      </Badge>
                    )}
                  </div>
                  <CardHeader className="text-center pb-4">
                    <div className="mb-1">
                      {!plan.popular && <Badge variant="secondary" className="text-xs">
                        {plan.badge}
                      </Badge>}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                    <div className="my-4">
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
                    {plan.subDescription && (
                      <p className="text-brand-primary text-xs mt-1 font-medium">{plan.subDescription}</p>
                    )}
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <p className="text-sm text-brand-primary font-semibold">
                        {plan.credits} análises detalhadas de redações {selectedAudience === 'estudantes' ? 'do ENEM ' : ''}por IA
                      </p>
                      {selectedAudience === 'professores' && (
                        <p className="text-xs text-slate-600 mt-1">Correção por foto ou digitada</p>
                      )}
                      <p className="text-xs text-slate-500 mt-1">
                        Acesso por {plan.name.includes('Trimestral') ? '90' : plan.name.includes('Semestral') ? '180' : '30'} dias
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col">
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
      )}

      {/* Credit Packages Section - Only for students and teachers */}
      {(selectedAudience === 'estudantes' || selectedAudience === 'professores') && (
        <section className="pt-12 pb-8 md:pt-16 md:pb-12 lg:pt-20 lg:pb-16 bg-slate-50">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                Pacotes de Créditos
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                {selectedAudience === 'estudantes' 
                  ? 'Precisa escrever mais este mês?'
                  : 'Turma com muitas redações esta semana?'
                }
              </p>
            </div>
            
            <div className={`grid gap-6 mx-auto justify-items-center mt-6 ${
              selectedAudience === 'professores' ? 'md:grid-cols-2 max-w-2xl' :
              'md:grid-cols-3 max-w-4xl'
            }`}>
              {creditPackages.map((pkg, index) => (
                <Card key={index} className={`relative hover-lift ${pkg.popular ? 'border-2 border-green-500 shadow-xl' : 'hover:shadow-xl'} transition-all flex flex-col pt-4 w-full max-w-xs`}>
                  {pkg.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-green-500 text-white px-4 py-1">Melhor Custo-Benefício</Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-2">
                    <h3 className="text-lg font-bold text-slate-900">{pkg.name}</h3>
                    <div className="my-2">
                      <span className="text-2xl font-bold text-brand-primary">
                        R$ {pkg.price}
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
              <Card className="bg-white border-slate-200">
                <CardContent className="p-6">
                  <h4 className="text-lg font-bold text-slate-900 mb-3">Como funcionam os créditos?</h4>
                  <p className="text-slate-600 mb-4">
                    Cada crédito equivale a uma análise completa e detalhada da sua redação pela nossa IA especializada. Os créditos têm validade de 30 dias a partir da data de compra.
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

      {/* Contact Section */}
      <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="bg-white border-slate-200 shadow-xl overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <div className="text-center">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                  Ficou com dúvidas?
                </h2>
                <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
                  {selectedAudience === 'escolas' 
                    ? 'Entre em contato conosco para uma proposta personalizada para sua instituição. Nossa equipe está pronta para ajudar a encontrar a melhor solução para suas necessidades.'
                    : 'Entre em contato conosco e tire suas dúvidas. Nossa equipe está pronta para ajudar você a escolher o melhor plano para suas necessidades.'
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    className="bg-[#4A90E2] hover:bg-[#357ABD] text-white px-8 py-3 text-lg"
                    size="lg"
                    onClick={() => navigate('/contato')}
                  >
                    Fale Conosco
                  </Button>
                  <Button
                    variant="outline"
                    className="border-brand-primary text-brand-primary hover:bg-brand-light px-8 py-3 text-lg"
                    size="lg"
                    onClick={() => window.open('https://wa.me/5511999999999', '_blank')}
                  >
                    WhatsApp
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

export default Precos
