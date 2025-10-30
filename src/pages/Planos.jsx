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
  const heroRef = useScrollAnimation()
  const plansRef = useScrollAnimation()
  const comparisonRef = useScrollAnimation()

  // Atualizar quando a URL mudar
  useEffect(() => {
    const urlAudience = searchParams.get('audience')
    if (urlAudience && urlAudience !== selectedAudience) {
      setSelectedAudience(urlAudience)
    }
  }, [searchParams])

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
      yearlyPrice: 49,
      description: 'Plano Híbrido (Uso da plataforma + créditos de IA)',
      credits: 20,
      features: [
        { text: 'Módulo de escrita digital autorregulada', included: true },
        { text: 'Banco de estratégias para escrita', included: true },
        { text: 'Sugestão de temas', included: true },
        { text: 'Recursos de apoio autorregulatório', included: true },
        { text: 'Insights para melhoria da escrita', included: true },
        { text: 'Revisor integrado com recursos de análise ilimitada', included: true },
        { text: 'Rubricas qualitativas para (auto)avaliação', included: true },
        { text: '20 análises detalhadas de redações do ENEM por IA', included: true, highlighted: true },
        { text: 'Acesso por 30 dias', included: true }
      ],
      buttonText: 'Escolher Mensal',
      buttonVariant: 'default'
    },
    {
      name: 'Plano Trimestral',
      badge: 'Melhor custo-benefício',
      monthlyPrice: 120,
      yearlyPrice: 120,
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
      name: 'Plano Básico Mensal',
      badge: 'Para começar',
      monthlyPrice: 49,
      yearlyPrice: 49,
      description: 'Plano Híbrido (Plataforma + créditos de IA)',
      credits: 20,
      features: [
        { text: 'Módulo de escrita digital autorregulada', included: true },
        { text: 'Banco de estratégias para escrita', included: true },
        { text: 'Sugestão de temas', included: true },
        { text: 'Recursos de apoio autorregulatório', included: true },
        { text: 'Insights para melhoria da escrita', included: true },
        { text: 'Revisor integrado com recursos de análise ilimitada', included: true },
        { text: 'Rubricas qualitativas para (auto)avaliação', included: true },
        { text: '20 análises detalhadas de redações por IA', included: true, highlighted: true },
        { text: 'Correção por foto ou digitada', included: true },
        { text: 'Acesso por 30 dias', included: true }
      ],
      buttonText: 'Escolher Básico',
      buttonVariant: 'default'
    },
    {
      name: 'Plano Profissional Mensal',
      badge: 'Mais escolhido',
      monthlyPrice: 130,
      yearlyPrice: 130,
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
      buttonText: 'Escolher Profissional',
      buttonVariant: 'default'
    },
    {
      name: 'Plano Trimestral',
      badge: 'Economia garantida',
      monthlyPrice: 340,
      yearlyPrice: 340,
      description: 'Plano Híbrido (Plataforma + créditos de IA)',
      credits: 250,
      features: [
        { text: 'Módulo de escrita digital autorregulada', included: true },
        { text: 'Banco de estratégias para escrita', included: true },
        { text: 'Sugestão de temas', included: true },
        { text: 'Recursos de apoio autorregulatório', included: true },
        { text: 'Insights para melhoria da escrita', included: true },
        { text: 'Revisor integrado com recursos de análise ilimitada', included: true },
        { text: 'Rubricas qualitativas para (auto)avaliação', included: true },
        { text: '250 análises detalhadas de redações por IA', included: true, highlighted: true },
        { text: 'Correção por foto ou digitada', included: true },
        { text: 'Acesso por 90 dias', included: true }
      ],
      buttonText: 'Escolher Trimestral',
      buttonVariant: 'default'
    },
    {
      name: 'Plano Semestral',
      badge: 'Melhor investimento',
      monthlyPrice: 620,
      yearlyPrice: 620,
      description: 'Plano Híbrido (Plataforma + créditos de IA)',
      credits: 500,
      features: [
        { text: 'Módulo de escrita digital autorregulada', included: true },
        { text: 'Banco de estratégias para escrita', included: true },
        { text: 'Sugestão de temas', included: true },
        { text: 'Recursos de apoio autorregulatório', included: true },
        { text: 'Insights para melhoria da escrita', included: true },
        { text: 'Revisor integrado com recursos de análise ilimitada', included: true },
        { text: 'Rubricas qualitativas para (auto)avaliação', included: true },
        { text: '500 análises detalhadas de redações por IA', included: true, highlighted: true },
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
      yearlyPrice: 295,
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
      description: '5 créditos para usar em até 30 dias',
      features: ['Análises detalhadas por IA', 'Validade de 30 dias', 'Suporte incluído']
    },
    {
      name: 'Pacote 2',
      credits: 15,
      price: 45,
      description: '15 créditos para usar em até 30 dias',
      features: ['Análises detalhadas por IA', 'Validade de 30 dias', 'Suporte incluído']
    },
    {
      name: 'Pacote 3',
      credits: 30,
      price: 60,
      description: '30 créditos para usar em até 30 dias',
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
      description: '100 créditos para usar em até 30 dias',
      features: ['Análises detalhadas por IA', 'Validade de 30 dias', 'Suporte incluído']
    },
    {
      name: 'Pacote 2',
      credits: 200,
      price: 300,
      description: '200 créditos para usar em até 30 dias',
      popular: true,
      features: ['Análises detalhadas por IA', 'Validade de 30 dias', 'Suporte incluído', 'Melhor custo-benefício']
    }
  ]

  // Pacotes de créditos para escolas
  const schoolCreditPackages = [
    {
      name: 'Pacote Escolar 1',
      credits: 3000,
      price: 3300,
      description: '3.000 créditos para usar em até 90 dias',
      features: ['Análises detalhadas por IA', 'Validade de 90 dias', 'Suporte prioritário', 'Relatórios institucionais']
    },
    {
      name: 'Pacote Escolar 2',
      credits: 5000,
      price: 10200,
      description: '5.000 créditos para usar em até 90 dias',
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

  // Dados de comparação específicos para estudantes
  const studentComparisonData = [
    { feature: 'Módulo de escrita autorregulada', mensal: true, trimestral: true },
    { feature: 'Banco de estratégias para escrita', mensal: true, trimestral: true },
    { feature: 'Sugestão de temas', mensal: true, trimestral: true },
    { feature: 'Recursos de apoio autorregulatório', mensal: true, trimestral: true },
    { feature: 'Revisor integrado ilimitado', mensal: true, trimestral: true },
    { feature: 'Rubricas qualitativas', mensal: true, trimestral: true },
    { feature: 'Análises por IA', mensal: '20 créditos', trimestral: '50 créditos' },
    { feature: 'Período de acesso', mensal: '30 dias', trimestral: '90 dias' }
  ]

  // Dados de comparação específicos para professores
  const teacherComparisonData = [
    { feature: 'Módulo de escrita autorregulada', basico: true, profissional: true, trimestral: true, semestral: true },
    { feature: 'Banco de estratégias para escrita', basico: true, profissional: true, trimestral: true, semestral: true },
    { feature: 'Sugestão de temas', basico: true, profissional: true, trimestral: true, semestral: true },
    { feature: 'Recursos de apoio autorregulatório', basico: true, profissional: true, trimestral: true, semestral: true },
    { feature: 'Revisor integrado ilimitado', basico: true, profissional: true, trimestral: true, semestral: true },
    { feature: 'Rubricas qualitativas', basico: true, profissional: true, trimestral: true, semestral: true },
    { feature: 'Correção por foto/digitada', basico: true, profissional: true, trimestral: true, semestral: true },
    { feature: 'Análises por IA', basico: '20 créditos', profissional: '100 créditos', trimestral: '250 créditos', semestral: '500 créditos' },
    { feature: 'Período de acesso', basico: '30 dias', profissional: '30 dias', trimestral: '90 dias', semestral: '180 dias' }
  ]

  const faqs = [
    {
      question: "Como funciona a análise automática das redações?",
      answer: "Nossa IA analisa sua redação seguindo exatamente os critérios do ENEM. Ela avalia cada uma das 5 competências, identifica erros gramaticais, problemas de estrutura e oferece sugestões específicas de melhoria com exemplos práticos."
    },
    {
      question: "Quantas redações posso corrigir por mês?",
      answer: "No plano Estudante você tem apenas o modo de autocorreção. O plano Professor oferece análises ilimitadas para você e seus alunos. Já o plano Escola não possui limites de uso para toda a instituição."
    },
    {
      question: "Posso usar para outros vestibulares além do ENEM?",
      answer: "Sim! Embora nosso foco principal seja o ENEM, os critérios de avaliação servem para a maioria dos vestibulares brasileiros. A plataforma ajuda a desenvolver habilidades fundamentais de escrita argumentativa."
    },
    {
      question: "O que significa \"histórico é local\" no plano Estudante?",
      answer: "No plano Estudante, suas redações e histórico ficam salvos apenas no seu dispositivo (navegador). Para backup na nuvem, sincronização entre dispositivos e relatórios avançados, recomendamos os planos pagos."
    },
    {
      question: "Como funciona o dashboard para professores?",
      answer: "Professores podem criar turmas, acompanhar o progresso individual de cada aluno, visualizar estatísticas da turma, identificar dificuldades comuns e gerar relatórios detalhados para reuniões pedagógicas."
    },
    {
      question: "Meus dados e redações ficam seguros?",
      answer: "Sim! Utilizamos criptografia de ponta para proteger todas as suas redações e dados pessoais. Seus textos nunca são compartilhados com terceiros e você tem controle total sobre suas informações."
    },
    {
      question: "Posso cancelar minha assinatura a qualquer momento?",
      answer: "Claro! Você pode cancelar sua assinatura a qualquer momento sem taxas. Após o cancelamento, você continuará tendo acesso até o fim do período já pago, incluindo seu histórico de redações."
    },
    {
      question: "Como escolas podem integrar a plataforma em suas aulas?",
      answer: "Oferecemos suporte completo para implementação em escolas, incluindo treinamento para professores, integração com sistemas existentes e relatórios administrativos. Nossa equipe pedagógica ajuda no planejamento da implementação."
    }
  ]

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
      <section ref={plansRef} className="py-8 md:py-12 lg:py-16 bg-white animate-on-scroll">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className={`grid gap-8 mx-auto ${
            selectedAudience === 'escolas' ? 'max-w-2xl' :
            selectedAudience === 'professores' ? 'md:grid-cols-2 lg:grid-cols-2 max-w-6xl' : 
            'md:grid-cols-2 max-w-5xl'
          }`}>
            {currentPlans.map((plan, index) => (
              <Card key={index} className={`relative hover-lift animate-scale-in delay-${index * 200} ${plan.popular ? 'border-2 border-brand-primary shadow-xl' : 'hover:shadow-xl'} transition-all flex flex-col`}>
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
                <CardHeader className="text-center pb-4">
                  <div className="mb-2">
                    {!plan.popular && <Badge variant="secondary" className="text-xs">
                      {plan.badge}
                    </Badge>}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">{plan.name}</h3>
                  <div className="my-4">
                    {plan.consultation ? (
                      <div className="text-center">
                        <span className="text-lg text-slate-600">Valor sob consulta</span>
                        <p className="text-sm text-slate-500 mt-1">Definido conforme número de alunos e turmas</p>
                      </div>
                    ) : (
                      <>
                        <span className="text-4xl font-bold text-brand-primary">R$</span>
                        <span className="text-5xl font-bold text-brand-primary">
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
                  <ul className="space-y-3 mb-8 flex-grow">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className={`flex items-start gap-2 ${feature.highlighted ? 'font-semibold text-brand-primary' : ''}`}>
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
                  <CardContent className="p-8">
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
        <section className="py-8 md:py-12 lg:py-16 bg-white">
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
            
            <div className={`grid gap-8 mx-auto justify-items-center ${
              selectedAudience === 'escolas' ? 'md:grid-cols-2 max-w-4xl' : 
              selectedAudience === 'professores' ? 'md:grid-cols-2 max-w-4xl' :
              'md:grid-cols-3 max-w-5xl'
            }`}>
              {creditPackages.map((pkg, index) => (
                <Card key={index} className={`relative hover-lift ${pkg.popular ? 'border-2 border-green-500 shadow-xl' : 'hover:shadow-xl'} transition-all`}>
                  {pkg.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-green-500 text-white px-4 py-1">Melhor Custo-Benefício</Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-4">
                    <h3 className="text-xl font-bold text-slate-900">{pkg.name}</h3>
                    <div className="my-4">
                      <span className="text-3xl font-bold text-brand-primary">R$ {pkg.price}</span>
                    </div>
                    <p className="text-slate-600 text-sm">
                      <strong>{pkg.credits} créditos</strong>
                    </p>
                    <p className="text-slate-600 text-xs mt-1">{pkg.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {pkg.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span className="text-slate-700 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full" variant="outline">
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
      <section className="py-8 md:py-12 lg:py-16 bg-slate-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Como Funciona o Escrita360</h2>
            <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">A plataforma prioriza o processo formativo de escrever e reescrever</p>
          </div>
          
          <div className="max-w-4xl mx-auto mb-12">
            <Card className="bg-gradient-to-br from-brand-light to-white border-2 border-brand-primary/20 shadow-lg">
              <CardContent className="p-8">
                <p className="text-lg text-slate-700 leading-relaxed text-center">
                  A plataforma prioriza o processo formativo de escrever e reescrever, a correção automática com IA só aparece no final, como suporte complementar. <strong className="text-brand-primary">IA como última etapa: revisão que fortalece o aprendizado.</strong>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section ref={comparisonRef} className="py-8 md:py-12 lg:py-16 bg-gradient-to-b from-slate-50 to-white animate-on-scroll">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              {selectedAudience === 'estudantes' && 'Comparação: Planos para Estudantes'}
              {selectedAudience === 'professores' && 'Comparação: Planos para Professores'}
              {selectedAudience === 'escolas' && 'Comparação: Recursos Disponíveis'}
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {(selectedAudience === 'estudantes' || selectedAudience === 'professores') && 'Compare os recursos incluídos em cada plano'}
              {selectedAudience === 'escolas' && 'Recursos disponíveis no Plano Híbrido 360'}
            </p>
          </div>
          


          {/* Student Comparison */}
          {selectedAudience === 'estudantes' && (
            <div className="max-w-4xl mx-auto">
              <Card className="overflow-hidden shadow-xl mx-auto">
                <div className="grid grid-cols-3 gap-0 bg-slate-50 border-b border-slate-200">
                  <div className="p-4 text-center">
                    <h3 className="font-bold text-slate-900">Recursos</h3>
                  </div>
                  <div className="p-4 text-center border-l border-slate-200">
                    <h3 className="font-bold text-slate-900">Plano Mensal</h3>
                    <p className="text-sm text-slate-600">R$ 49/mês</p>
                  </div>
                  <div className="p-4 text-center border-l border-slate-200 bg-gradient-to-br from-blue-50 to-cyan-50">
                    <div className="flex items-center justify-center mb-1">
                      <Badge className="bg-green-500 text-white text-xs mr-2">Popular</Badge>
                    </div>
                    <h3 className="font-bold text-slate-900">Plano Trimestral</h3>
                    <p className="text-sm text-slate-600">R$ 120/3 meses</p>
                  </div>
                </div>
                {studentComparisonData.map((row, index) => (
                  <div key={index} className={`grid grid-cols-3 gap-0 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-slate-100 transition-colors`}>
                    <div className="p-4 flex items-center">
                      <span className="text-sm font-medium text-slate-700">{row.feature}</span>
                    </div>
                    <div className="p-4 flex items-center justify-center border-l border-slate-100">
                      {typeof row.mensal === 'boolean' ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <span className="text-sm text-slate-600 font-medium">{row.mensal}</span>
                      )}
                    </div>
                    <div className="p-4 flex items-center justify-center border-l border-slate-100 bg-gradient-to-br from-blue-50/30 to-cyan-50/30">
                      {typeof row.trimestral === 'boolean' ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <span className="text-sm text-slate-700 font-medium">{row.trimestral}</span>
                      )}
                    </div>
                  </div>
                ))}
              </Card>
            </div>
          )}

          {/* Teacher Comparison */}
          {selectedAudience === 'professores' && (
            <div className="max-w-6xl mx-auto overflow-x-auto">
              <Card className="overflow-hidden shadow-xl mx-auto">
                <div className="grid grid-cols-5 gap-0 bg-slate-50 border-b border-slate-200">
                  <div className="p-4 text-center">
                    <h3 className="font-bold text-slate-900">Recursos</h3>
                  </div>
                  <div className="p-4 text-center border-l border-slate-200">
                    <h3 className="font-bold text-slate-900">Básico</h3>
                    <p className="text-sm text-slate-600">R$ 49/mês</p>
                  </div>
                  <div className="p-4 text-center border-l border-slate-200 bg-gradient-to-br from-blue-50 to-cyan-50">
                    <div className="flex items-center justify-center mb-1">
                      <Badge className="bg-brand-primary text-white text-xs mr-2">Popular</Badge>
                    </div>
                    <h3 className="font-bold text-slate-900">Profissional</h3>
                    <p className="text-sm text-slate-600">R$ 130/mês</p>
                  </div>
                  <div className="p-4 text-center border-l border-slate-200">
                    <h3 className="font-bold text-slate-900">Trimestral</h3>
                    <p className="text-sm text-slate-600">R$ 340/3 meses</p>
                  </div>
                  <div className="p-4 text-center border-l border-slate-200">
                    <h3 className="font-bold text-slate-900">Semestral</h3>
                    <p className="text-sm text-slate-600">R$ 620/6 meses</p>
                  </div>
                </div>
                {teacherComparisonData.map((row, index) => (
                  <div key={index} className={`grid grid-cols-5 gap-0 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-slate-100 transition-colors`}>
                    <div className="p-4 flex items-center">
                      <span className="text-sm font-medium text-slate-700">{row.feature}</span>
                    </div>
                    <div className="p-4 flex items-center justify-center border-l border-slate-100">
                      {typeof row.basico === 'boolean' ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <span className="text-sm text-slate-600 font-medium">{row.basico}</span>
                      )}
                    </div>
                    <div className="p-4 flex items-center justify-center border-l border-slate-100 bg-gradient-to-br from-blue-50/30 to-cyan-50/30">
                      {typeof row.profissional === 'boolean' ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <span className="text-sm text-slate-700 font-medium">{row.profissional}</span>
                      )}
                    </div>
                    <div className="p-4 flex items-center justify-center border-l border-slate-100">
                      {typeof row.trimestral === 'boolean' ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <span className="text-sm text-slate-600 font-medium">{row.trimestral}</span>
                      )}
                    </div>
                    <div className="p-4 flex items-center justify-center border-l border-slate-100">
                      {typeof row.semestral === 'boolean' ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <span className="text-sm text-slate-600 font-medium">{row.semestral}</span>
                      )}
                    </div>
                  </div>
                ))}
              </Card>
            </div>
          )}



          {/* Info Footer */}
          <div className="mt-8 text-center animate-fade-in-up delay-300">
            <p className="text-sm text-slate-500">
              Todos os planos incluem atualizações gratuitas e acesso às novas funcionalidades
            </p>
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
            Tire suas dúvidas sobre o Escrita360
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
              onClick={() => handleOpenPagamento(currentPlans.find(plan => plan.popular) || currentPlans[0])}
            >
              Assinar
            </Button>
            <Button size="lg" variant="outline" className="border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all duration-300 hover:scale-105 [&:hover]:!text-white">
              Falar com Especialista
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Precos
