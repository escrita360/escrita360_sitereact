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
import TestButton from '@/components/TestButton.jsx'

function Precos() {
  // Force HMR update
  const [searchParams] = useSearchParams()
  const audienceFromUrl = searchParams.get('audience') || 'estudantes'
  const [selectedAudience, setSelectedAudience] = useState(audienceFromUrl)
  const [teacherPlanType, setTeacherPlanType] = useState('hibrido') // 'solo' ou 'hibrido'
  const [schoolPlanType, setSchoolPlanType] = useState('correcao') // 'correcao' ou 'hibrido'
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
    console.log('� FUNÇÃO CHAMADA! Plano:', plan.name)
    console.log('🔥 NAVEGANDO PARA PAGAMENTO...')
    
    // Salvar no sessionStorage como backup
    sessionStorage.setItem('selectedPlan', JSON.stringify(plan))
    sessionStorage.setItem('selectedAudience', selectedAudience)
    
    try {
      navigate('/pagamento', { 
        state: { 
          selectedPlan: plan, 
          audience: selectedAudience 
        } 
      })
      console.log('🔥 NAVIGATE EXECUTADO COM SUCESSO')
    } catch (error) {
      console.error('🔥 ERRO NO NAVIGATE:', error)
    }
  }

  // Planos para estudantes
  const studentPlans = [
    {
      name: 'Plano Básico',
      badge: 'Preço promocional de lançamento',
      monthlyPrice: 49,
      yearlyPrice: 588,
      subDescription: '',
      credits: 10,
      popular: true,
      buttonText: 'Escolher Plano',
      buttonVariant: 'default'
    }
  ]

  // Planos solo para professores
  const teacherPlansSolo = [
    {
      name: 'Plano Professor solo',
      badge: 'Preço promocional de lançamento',
      monthlyPrice: 120,
      yearlyPrice: 1440,
      subDescription: '',
      credits: 60,
      popular: true,
      buttonText: 'Escolher Plano',
      buttonVariant: 'default'
    },
    {
      name: 'Plano Progressivo',
      badge: 'Melhor investimento',
      monthlyPrice: 570,
      yearlyPrice: 3420,
      description: 'Professores (Individual)',
      subDescription: 'Plano com maior quantidade de correções e acesso estendido',
      credits: 300,
      popular: true,
      features: [
        { text: 'Criação e gerenciamento de Turmas', included: true },
        { text: 'Banco de rubricas para facilitar a avaliação', included: true },
        { text: 'Correção via foto ou texto direto na plataforma', included: true },
        { text: 'Relatórios de desempenho com notas (ENEM e texto dissertativo-argumentativo)', included: true },
        { text: 'Correção com IA (ENEM e texto dissertativo-argumentativo)', included: true, highlighted: true },
        { text: 'Relatórios consolidados (Habilidades BNCC X ENEM)', included: true },
        { text: 'Acesso por 6 meses', included: true }
      ],
      buttonText: 'Escolher Plano',
      buttonVariant: 'default'
    }
  ]

  // Planos híbridos para professores
  const teacherPlansHibrido = [
    {
      name: 'Plano Básico',
      badge: 'Não tem esse mês',
      monthlyPrice: 49,
      yearlyPrice: 588,
      subDescription: '',
      credits: 10,
      popular: true,
      buttonText: 'Escolher Plano',
      buttonVariant: 'default'
    },
    {
      name: 'Plano Professor solo',
      badge: 'Preço promocional de lançamento',
      monthlyPrice: 120,
      yearlyPrice: 1440,
      subDescription: '',
      credits: 60,
      buttonText: 'Escolher Plano',
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

  // Pacotes de análises detalhadas para estudantes
  const studentCreditPackages = [
    {
      name: 'Pacote 1',
      credits: 5,
      price: 20,
      description: '',
      features: ['Análises detalhadas por IA']
    },
    {
      name: 'Pacote 2',
      credits: 15,
      price: 45,
      description: '',
      features: ['Análises detalhadas por IA']
    },
    {
      name: 'Pacote 3',
      credits: 30,
      price: 60,
      description: '',
      popular: true,
      features: ['Análises detalhadas por IA', 'Melhor custo-benefício']
    }
  ]

  // Pacotes de análises detalhadas para professores
  const teacherCreditPackages = [
    {
      name: 'Pacote 1',
      credits: 100,
      price: 200,
      description: '',
      features: ['Análises detalhadas por IA']
    },
    {
      name: 'Pacote 2',
      credits: 150,
      price: 300,
      description: '',
      popular: true,
      features: ['Análises detalhadas por IA', 'Melhor custo-benefício']
    }
  ]

  // Selecionar pacotes de análises detalhadas baseado no público alvo
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

  // Programa Escolas / Institucional para escolas
  const schoolModels = [
    {
      title: 'Modelo correção inteligente',
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
        return teacherPlanType === 'solo' ? teacherPlansSolo : teacherPlansHibrido
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
        title: '(Individual)',
        titleHighlight: 'Estudante',
        subtitle: 'Projetado para uso individual, com foco em escrita, reescrita e feedback. Aproveite o preço promocional de lançamento da Plataforma Escrita360.'
      }
    } else if (selectedAudience === 'professores') {
      return {
        title: 'Independente',
        titleHighlight: 'Professor ',
        subtitle: 'Para professores autônomos, cursinhos ou projetos pessoais',
        titleHighlightClass: 'bg-gradient-to-r from-blue-600 to-black bg-clip-text text-transparent',
        highlightFirst: true
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
        'Rubricas qualitativas para (auto)avaliação',
        'Correção via foto ou texto direto na plataforma',
        'Avaliação com auxílio de IA'
      ]
    } else if (selectedAudience === 'professores') {
      return [
        'Criação e gerenciamento de Turmas',
        'Banco de rubricas para facilitar a avaliação',
        'Correção via foto ou texto direto na plataforma',
        'Relatórios de desempenho com notas (ENEM e texto dissertativo-argumentativo)',
        'Correção com IA (ENEM e texto dissertativo-argumentativo)',
        'Relatórios consolidados (Habilidades BNCC X ENEM)'
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
        titleHighlightClass={heroContent.titleHighlightClass || 'text-brand-primary'}
        highlightFirst={heroContent.highlightFirst || selectedAudience === 'estudantes'}
      />

      {/* Platform Features Section - For students and teachers only */}
      {selectedAudience !== 'escolas' && (
      <section className="py-8 md:py-12 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 mb-3">
              Escolha o modelo que atende suas necessidades:
            </h2>
          </div>
          
          {selectedAudience === 'professores' && (
            <>
              {/* Título da seção institucional */}
              <div className="text-center mb-8">
                <h3 className="text-xl md:text-2xl font-bold mb-2">
                  <span className="bg-gradient-to-r from-blue-600 to-black bg-clip-text text-transparent">Professor</span>{' '}
                  <span className="text-slate-900">Independente</span>
                </h3>
              </div>

              {/* Cards de seleção de modelo - estilo compacto */}
              <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto mb-8">
                <button
                  onClick={() => setTeacherPlanType('solo')}
                  className={`bg-white rounded-xl shadow-sm p-5 text-left transition-all duration-300 hover:shadow-md ${
                    teacherPlanType === 'solo'
                      ? 'border-2 border-brand-primary'
                      : 'border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <h4 className="text-base font-bold text-slate-900 mb-1">
                    {teacherPlanType === 'hibrido' ? 'Módulo Aluno' : 'Modelo Professor Independente'}
                  </h4>
                  <p className="text-slate-500 text-sm">
                    {teacherPlanType === 'hibrido' 
                      ? 'Recursos para escrita autorregulada e desenvolvimento do aluno'
                      : 'Para professores independentes que querem gerenciar suas próprias turmas'
                    }
                  </p>
                </button>
                
                <button
                  onClick={() => setTeacherPlanType('hibrido')}
                  className={`bg-white rounded-xl shadow-sm p-5 text-left transition-all duration-300 hover:shadow-md ${
                    teacherPlanType === 'hibrido'
                      ? 'border-2 border-brand-primary'
                      : 'border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <h4 className="text-base font-bold text-slate-900 mb-1">
                    {teacherPlanType === 'hibrido' ? 'Módulo Professor Solo' : 'Modelo Híbrido (Professor + Aluno)'}
                  </h4>
                  <p className="text-slate-500 text-sm">
                    {teacherPlanType === 'hibrido'
                      ? 'Ferramentas para gestão de turmas e correção de redações'
                      : 'Integração completa entre módulos de professor e aluno'
                    }
                  </p>
                </button>
              </div>
            </>
          )}
          
          {/* Quadros lado a lado para Modelo Híbrido - apenas para professores */}
          {selectedAudience === 'professores' && teacherPlanType === 'hibrido' && (
            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-8">
              {/* Quadro Professor */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                <div className="text-center mb-4">
                  <h4 className="text-lg font-bold text-slate-900 mb-2">Módulo Professor</h4>
                  <p className="text-slate-600 text-sm">Ferramentas para gestão e correção</p>
                </div>
                <div className="space-y-3">
                  {[
                    'Criação e gerenciamento de Turmas',
                    'Banco de rubricas para facilitar a avaliação',
                    'Correção via foto ou texto direto na plataforma',
                    'Relatórios de desempenho com notas (ENEM e texto dissertativo-argumentativo)',
                    'Correção com IA (ENEM e texto dissertativo-argumentativo)',
                    'Relatórios consolidados (Habilidades BNCC X ENEM)'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-blue-600" />
                      </div>
                      <span className="text-slate-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quadro Aluno */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                <div className="text-center mb-4">
                  <h4 className="text-lg font-bold text-slate-900 mb-2">Módulo Aluno</h4>
                  <p className="text-slate-600 text-sm">Recursos para escrita autorregulada</p>
                </div>
                <div className="space-y-3">
                  {[
                    'Módulo de escrita digital autorregulada',
                    'Banco de estratégias para escrita',
                    'Sugestão de temas',
                    'Recursos de apoio autorregulatório',
                    'Insights para melhoria da escrita',
                    'Revisor integrado com recursos de análise ilimitada',
                    'Rubricas qualitativas para (auto)avaliação',
                    'Correção via foto ou texto direto na plataforma',
                    'Avaliação com auxílio de IA'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="text-slate-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Quadro único para outros casos */}
          {!(selectedAudience === 'professores' && teacherPlanType === 'hibrido') && (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 md:p-8 max-w-md mx-auto">
            <div className="space-y-3 md:space-y-4">
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
          )}
        </div>
      </section>
      )}

      {/* School Models Section - Only for schools - FIRST */}
      {selectedAudience === 'escolas' && (
        <section className="py-8 md:py-12 lg:py-16 bg-slate-50">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">PROGRAMA ESCOLAS / INSTITUCIONAL</h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Com foco em flexibilidade e integração pedagógica, oferecemos dois modelos voltados à gestão pedagógica, escala e padronização.
              </p>
            </div>
            
            {/* Cards compactos de seleção de modelo - UPDATED */}
            <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto mb-8">
              <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200">
                <h4 className="text-base font-bold text-slate-900 mb-1">{schoolModels[0].title}</h4>
                <p className="text-slate-500 text-sm">
                  {schoolModels[0].focus}
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200">
                <h4 className="text-base font-bold text-slate-900 mb-1">{schoolModels[1].title}</h4>
                <p className="text-slate-500 text-sm">
                  {schoolModels[1].focus}
                </p>
              </div>
            </div>

            {/* Platform Features Section - For schools */}
            <div className="mt-12 mb-12">
              <div className="text-center mb-8">
                <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 mb-3">
                  Escolha o modelo que atende suas necessidades:
                </h3>
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 md:p-8 max-w-md mx-auto">
                <div className="space-y-3 md:space-y-4">
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

            {/* Planos para Escolas */}
            <div className="mt-12 space-y-6">
              {/* Switch para Planos de Escolas - Correção Inteligente vs Híbrido */}
              <div className="flex justify-center mb-8">
                <div className="bg-slate-100 rounded-lg p-1 inline-flex">
                  <button
                    onClick={() => setSchoolPlanType('correcao')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      schoolPlanType === 'correcao'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Modelo correção inteligente
                  </button>
                  <button
                    onClick={() => setSchoolPlanType('hibrido')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      schoolPlanType === 'hibrido'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Híbrido
                  </button>
                </div>
              </div>

              {/* Planos Modelo Correção Inteligente */}
              {schoolPlanType === 'correcao' && (
                <div className="grid gap-8 mx-auto mt-6 justify-center md:grid-cols-2 lg:grid-cols-2 max-w-5xl">
                  {/* Plano Básico */}
                  <Card className="relative hover-lift animate-scale-in hover:shadow-xl transition-all flex flex-col pt-6 w-full">
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 flex gap-2 animate-float">
                      <Badge variant="secondary" className="text-xs whitespace-nowrap">
                        Plano Inicial
                      </Badge>
                      <Badge className="bg-yellow-500 text-white px-3 py-1 text-xs whitespace-nowrap">
                        60 análises detalhadas IA
                      </Badge>
                    </div>
                    <CardHeader className="text-center pb-4">
                      <h3 className="text-xl font-bold text-slate-900">Básico</h3>
                      <div className="my-4">
                        <span className="text-3xl font-bold text-brand-primary">R$</span>
                        <span className="text-4xl font-bold text-brand-primary">120,00</span>
                      </div>
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <p className="text-sm text-slate-600 font-semibold">
                          {selectedAudience === 'professores' ? '60 correções detalhadas com IA' : '60 correções detalhadas com IA'}
                        </p>
                        <p className="text-xs text-slate-600 mt-1">
                          Acesso por 30 dias
                        </p>
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-col">
                      <Button
                        className="w-full transition-all duration-300 hover:scale-105 mt-auto bg-[#4A90E2] hover:bg-[#357ABD] text-white"
                        variant="default"
                        size="lg"
                        onClick={() => handleOpenPagamento({
                          name: 'Básico',
                          monthlyPrice: 120,
                          yearlyPrice: 120,
                          credits: 60,
                          duration: '1 mês',
                          buttonText: 'Contratar Plano'
                        })}
                      >
                        Contratar Plano
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Plano Progressivo */}
                  <Card className="relative hover-lift animate-scale-in delay-200 border-2 border-brand-primary shadow-xl transition-all flex flex-col pt-6 w-full">
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 flex gap-2 animate-float">
                      <Badge className="bg-brand-primary text-white px-3 py-1 text-xs whitespace-nowrap">
                        Popular
                      </Badge>
                      <Badge className="bg-yellow-500 text-white px-3 py-1 text-xs whitespace-nowrap">
                        300 análises detalhadas IA
                      </Badge>
                    </div>
                    <CardHeader className="text-center pb-4">
                      <h3 className="text-xl font-bold text-slate-900">Plano Progressivo</h3>
                      <div className="my-4">
                        <span className="text-3xl font-bold text-brand-primary">R$</span>
                        <span className="text-4xl font-bold text-brand-primary">570,00</span>
                      </div>
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <p className="text-sm text-slate-600 font-semibold">
                          {selectedAudience === 'professores' ? '300 correções detalhadas com IA' : '300 correções detalhadas com IA'}
                        </p>
                        <p className="text-xs text-slate-600 mt-1">
                          Acesso por 180 dias
                        </p>
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-col">
                      <Button
                        className="w-full transition-all duration-300 hover:scale-105 mt-auto bg-[#4A90E2] hover:bg-[#357ABD] text-white"
                        variant="default"
                        size="lg"
                        onClick={() => handleOpenPagamento({
                          name: 'Plano Progressivo',
                          monthlyPrice: 570,
                          yearlyPrice: 570,
                          credits: 300,
                          duration: '6 meses',
                          buttonText: 'Contratar Plano'
                        })}
                      >
                        Contratar Plano
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Plano Híbrido */}
              {schoolPlanType === 'hibrido' && (
                <div className="grid gap-8 mx-auto mt-6 justify-center grid-cols-1 max-w-md">
                  {/* Plano Essencial */}
                  <Card className="relative hover-lift animate-scale-in border-2 border-brand-primary shadow-xl transition-all flex flex-col pt-6 w-full">
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 flex gap-2 animate-float">
                      <Badge className="bg-brand-primary text-white px-3 py-1 text-xs whitespace-nowrap">
                        Recomendado
                      </Badge>
                      <Badge className="bg-yellow-500 text-white px-3 py-1 text-xs whitespace-nowrap">
                        500 análises detalhadas IA
                      </Badge>
                    </div>
                    <CardHeader className="text-center pb-4">
                      <h3 className="text-xl font-bold text-slate-900">Plano Essencial</h3>
                      <div className="my-4">
                        <span className="text-3xl font-bold text-brand-primary">R$</span>
                        <span className="text-4xl font-bold text-brand-primary">1.200,00</span>
                      </div>
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <p className="text-sm text-slate-600 font-semibold">
                          {selectedAudience === 'professores' ? '500 análises detalhadas de redações do ENEM por IA' : '500 correções detalhadas com IA'}
                        </p>
                        <p className="text-xs text-slate-600 mt-1">
                          Acesso por 365 dias
                        </p>
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-col">
                      <Button
                        className="w-full transition-all duration-300 hover:scale-105 mt-auto bg-[#4A90E2] hover:bg-[#357ABD] text-white"
                        variant="default"
                        size="lg"
                        onClick={() => handleOpenPagamento({
                          name: 'Plano Essencial',
                          monthlyPrice: 1200,
                          yearlyPrice: 1200,
                          credits: 500,
                          duration: '12 meses',
                          buttonText: 'Contratar Plano'
                        })}
                      >
                        Contratar Plano
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>

            {/* Pacotes de Análises Detalhadas para Escolas */}
            <div className="mt-16 space-y-6">
              <h3 className="text-3xl font-bold text-center text-slate-900 mb-4">Pacotes de Créditos</h3>
              <p className="text-lg text-slate-600 text-center max-w-3xl mx-auto mb-8">
                Turmas com muitas redações? Adquira pacotes extras de análises detalhadas para sua instituição.
              </p>
              
              <div className="grid gap-6 mx-auto justify-items-center md:grid-cols-2 max-w-2xl">
                {/* Pacote 1 */}
                <Card className="relative hover-lift hover:shadow-xl transition-all flex flex-col pt-4 w-full max-w-xs">
                  <CardHeader className="text-center pb-2">
                    <h3 className="text-lg font-bold text-slate-900">Pacote 1</h3>
                    <div className="my-2">
                      <span className="text-2xl font-bold text-brand-primary">
                        R$ 1.200,00
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm">
                      <strong>500 análises detalhadas</strong>
                    </p>
                    <p className="text-slate-500 text-xs mt-1">As análises detalhadas extras são utilizadas durante a vigência do plano.</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1 mb-4">
                      <li className="flex items-center gap-2">
                        <Check className="w-3 h-3 text-green-600 flex-shrink-0" />
                        <span className="text-slate-700 text-sm">500 correções detalhadas com IA</span>
                      </li>
                    </ul>
                    <Button 
                      className="w-full bg-[#4A90E2] hover:bg-[#357ABD] text-white" 
                      variant="default"
                      onClick={() => navigate('/pagamento-creditos', { state: { selectedPackage: { name: 'Pacote 1', credits: 500, price: 1200, features: ['Análises detalhadas por IA'] }, audience: 'escolas' } })}
                    >
                      Adquirir Pacote
                    </Button>
                  </CardContent>
                </Card>

                {/* Pacote 2 */}
                <Card className="relative hover-lift border-2 border-green-500 shadow-xl transition-all flex flex-col pt-4 w-full max-w-xs">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-green-500 text-white px-4 py-1">Melhor Custo-Benefício</Badge>
                  </div>
                  <CardHeader className="text-center pb-2">
                    <h3 className="text-lg font-bold text-slate-900">Pacote 2</h3>
                    <div className="my-2">
                      <span className="text-2xl font-bold text-brand-primary">
                        R$ 2.400,00
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm">
                      <strong>1000 análises detalhadas</strong>
                    </p>
                    <p className="text-slate-500 text-xs mt-1">As análises detalhadas extras são utilizadas durante a vigência do plano.</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1 mb-4">
                      <li className="flex items-center gap-2">
                        <Check className="w-3 h-3 text-green-600 flex-shrink-0" />
                        <span className="text-slate-700 text-sm">1000 correções detalhadas com IA</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3 h-3 text-green-600 flex-shrink-0" />
                        <span className="text-slate-700 text-sm">Melhor custo-benefício</span>
                      </li>
                    </ul>
                    <Button 
                      className="w-full bg-[#4A90E2] hover:bg-[#357ABD] text-white" 
                      variant="default"
                      onClick={() => navigate('/pagamento-creditos', { state: { selectedPackage: { name: 'Pacote 2', credits: 1000, price: 2400, popular: true, features: ['Análises detalhadas por IA', 'Melhor custo-benefício'] }, audience: 'escolas' } })}
                    >
                      Adquirir Pacote
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Pricing Grid - Only for students and teachers */}
      {(selectedAudience === 'estudantes' || selectedAudience === 'professores') && (
        <section ref={plansRef} className="pt-12 pb-8 md:pt-16 md:pb-12 lg:pt-20 lg:pb-16 bg-white animate-on-scroll">
          <div className="container mx-auto px-4 max-w-7xl">
            
            {/* Switch para Planos de Professor - Solo vs Híbrido */}
            {selectedAudience === 'professores' && (
              <div className="flex justify-center mb-8">
                <div className="bg-slate-100 rounded-lg p-1 inline-flex">
                  <button
                    onClick={() => setTeacherPlanType('solo')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      teacherPlanType === 'solo'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Planos Solo
                  </button>
                  <button
                    onClick={() => setTeacherPlanType('hibrido')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      teacherPlanType === 'hibrido'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Planos Híbridos
                  </button>
                </div>
              </div>
            )}

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
                            {plan.monthlyPrice.toFixed(2).replace('.', ',')}
                          </span>
                        </>
                      )}
                    </div>
                    <p className="text-slate-600 text-sm">{plan.description}</p>
                    {plan.subDescription && (
                      <p className="text-brand-primary text-xs mt-1 font-medium">{plan.subDescription}</p>
                    )}
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <p className="text-sm text-slate-600 font-semibold">
                        {plan.credits} {selectedAudience === 'estudantes' ? 'correções detalhadas com IA' : 'análises detalhadas de redações do ENEM por IA'}
                      </p>
                      <p className="text-xs text-slate-600 mt-1">
                        Acesso por {plan.name.includes('Trimestral') ? '90' : 
                                   plan.name.includes('Semestral') ? '180' : 
                                   plan.name.includes('Progressivo') ? '180' : '30'} dias
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
                      <strong>{pkg.credits} análises detalhadas</strong>
                    </p>
                    <p className="text-slate-600 text-xs mt-1">{pkg.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1 mb-4">
                      {pkg.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-2">
                          <Check className="w-3 h-3 text-green-600 flex-shrink-0" />
                          <span className="text-slate-700 text-sm">
                            {featureIndex === 0 ? `${pkg.credits} correções detalhadas com IA` : feature}
                          </span>
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

