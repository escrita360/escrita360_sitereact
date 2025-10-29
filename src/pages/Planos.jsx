import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion.jsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.jsx'
import { Check, X, Quote, Star, ChevronDown } from 'lucide-react'
import React, { useState, useRef, useEffect } from 'react'
import { useScrollAnimation } from '@/hooks/use-scroll-animation.js'
import { useNavigate } from 'react-router-dom'

function Precos() {
  const [selectedAudience, setSelectedAudience] = useState('estudantes') // estudantes, professores, escolas
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()
  const heroRef = useScrollAnimation()
  const plansRef = useScrollAnimation()
  const comparisonRef = useScrollAnimation()

  const audiences = [
    { key: 'estudantes', label: 'Estudantes', icon: '🎓' },
    { key: 'professores', label: 'Professores Independentes', icon: '👨‍🏫' },
    { key: 'escolas', label: 'Escolas', icon: '🏫' }
  ]

  const selectedAudienceData = audiences.find(a => a.key === selectedAudience)

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
      name: 'Plano Básico',
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
      name: 'Plano Profissional',
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
      consultation: true, // preço sob consulta
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
      buttonText: 'Solicitar Proposta Personalizada',
      buttonVariant: 'default'
    }
  ]

  // Pacotes de créditos
  const creditPackages = [
    {
      name: 'Pacote 1',
      credits: 5,
      price: 20,
      description: '5 créditos para usar em até 30 dias',
      features: ['Análises detalhadas por IA', 'Validade de 30 dias', 'Suporte incluído']
    },
    {
      name: 'Pacote 2',
      credits: 10,
      price: 35,
      description: '10 créditos para usar em até 30 dias',
      features: ['Análises detalhadas por IA', 'Validade de 30 dias', 'Suporte incluído']
    },
    {
      name: 'Pacote 3',
      credits: 25,
      price: 80,
      description: '25 créditos para usar em até 30 dias',
      popular: true,
      features: ['Análises detalhadas por IA', 'Validade de 30 dias', 'Suporte incluído', 'Melhor custo-benefício']
    }
  ]

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
    { feature: 'Módulo de escrita autorregulada', basico: true, profissional: true },
    { feature: 'Banco de estratégias para escrita', basico: true, profissional: true },
    { feature: 'Sugestão de temas', basico: true, profissional: true },
    { feature: 'Recursos de apoio autorregulatório', basico: true, profissional: true },
    { feature: 'Revisor integrado ilimitado', basico: true, profissional: true },
    { feature: 'Rubricas qualitativas', basico: true, profissional: true },
    { feature: 'Correção por foto/digitada', basico: true, profissional: true },
    { feature: 'Análises por IA', basico: '20 créditos', profissional: '100 créditos' },
    { feature: 'Período de acesso', basico: '30 dias', profissional: '30 dias' }
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

  return (
    <div className="min-h-screen">
      {/* Audience Selection Dropdown */}
      <section className="py-6 bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex justify-center items-center gap-4">
            {/* Dropdown Menu */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 px-6 py-3 bg-white border-2 border-slate-300 rounded-lg hover:border-brand-primary transition-all duration-200 shadow-sm hover:shadow-md min-w-[280px] justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{selectedAudienceData?.icon}</span>
                  <span className="font-semibold text-slate-700 text-lg">
                    {selectedAudienceData?.label}
                  </span>
                </div>
                <ChevronDown 
                  className={`w-5 h-5 text-slate-600 transition-transform duration-200 ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  {audiences.map((audience) => (
                    <button
                      key={audience.key}
                      onClick={() => {
                        setSelectedAudience(audience.key)
                        setIsDropdownOpen(false)
                      }}
                      className={`w-full flex items-center gap-3 px-6 py-4 hover:bg-slate-50 transition-colors ${
                        selectedAudience === audience.key
                          ? 'bg-blue-50 border-l-4 border-brand-primary'
                          : 'border-l-4 border-transparent'
                      }`}
                    >
                      <span className="text-2xl">{audience.icon}</span>
                      <span className={`font-medium text-left ${
                        selectedAudience === audience.key
                          ? 'text-brand-primary'
                          : 'text-slate-700'
                      }`}>
                        {audience.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* FAQ Link */}
            <a 
              href="#faq" 
              className="px-6 py-3 font-semibold text-slate-700 hover:text-brand-primary transition-colors text-lg"
            >
              FAQ
            </a>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section ref={heroRef} className="bg-white py-12 md:py-16 lg:py-20 animate-on-scroll">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-slate-900 animate-fade-in-up">
            {selectedAudience === 'estudantes' && 'Planos para Estudantes'}
            {selectedAudience === 'professores' && 'Planos para Professores Independentes'}
            {selectedAudience === 'escolas' && 'Planos para Escolas'}
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto animate-fade-in-up delay-200">
            {selectedAudience === 'estudantes' && 'Desenvolva suas habilidades de escrita para o ENEM e vestibulares. Aprenda no seu ritmo com nossa metodologia autorregulada.'}
            {selectedAudience === 'professores' && 'Escolha o plano que acompanha seu fluxo de redações, com correções ilimitadas na própria plataforma e créditos de IA.'}
            {selectedAudience === 'escolas' && 'Escolha o plano de adesão que melhor se adapta às necessidades de produção e correção de sua instituição.'}
          </p>
        </div>
      </section>

      {/* Pricing Grid */}
      <section ref={plansRef} className="py-8 md:py-12 lg:py-16 bg-white animate-on-scroll">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className={`grid gap-8 max-w-6xl mx-auto ${
            selectedAudience === 'professores' ? 'md:grid-cols-2 max-w-5xl' : 
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
                          {plan.name.includes('Trimestral') ? '/3 meses' : '/mês'}
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

      {/* Credit Packages Section - For students and teachers */}
      {(selectedAudience === 'estudantes' || selectedAudience === 'professores') && (
        <section className="py-8 md:py-12 lg:py-16 bg-white">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Pacotes de Créditos</h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                {selectedAudience === 'estudantes' 
                  ? 'Para quem já tem acesso à plataforma e precisa de mais análises com IA'
                  : 'Para professores que precisam de mais análises além do plano contratado'
                }
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {creditPackages.map((pkg, index) => (
                <Card key={index} className={`hover-lift ${pkg.popular ? 'border-2 border-green-500 shadow-xl' : 'hover:shadow-xl'} transition-all`}>
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
                    <p className="text-slate-600 text-sm">{pkg.credits} créditos • {pkg.description}</p>
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
                    Cada crédito equivale a uma análise completa e detalhada da sua redação pela nossa IA especializada. 
                    Os créditos têm validade de 30 dias a partir da data de compra.
                  </p>
                  <div className="grid md:grid-cols-3 gap-4 text-left">
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
              <Card className="overflow-hidden shadow-xl">
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
            <div className="max-w-4xl mx-auto">
              <Card className="overflow-hidden shadow-xl">
                <div className="grid grid-cols-3 gap-0 bg-slate-50 border-b border-slate-200">
                  <div className="p-4 text-center">
                    <h3 className="font-bold text-slate-900">Recursos</h3>
                  </div>
                  <div className="p-4 text-center border-l border-slate-200">
                    <h3 className="font-bold text-slate-900">Plano Básico</h3>
                    <p className="text-sm text-slate-600">R$ 49/mês</p>
                  </div>
                  <div className="p-4 text-center border-l border-slate-200 bg-gradient-to-br from-blue-50 to-cyan-50">
                    <div className="flex items-center justify-center mb-1">
                      <Badge className="bg-brand-primary text-white text-xs mr-2">Popular</Badge>
                    </div>
                    <h3 className="font-bold text-slate-900">Plano Profissional</h3>
                    <p className="text-sm text-slate-600">R$ 130/mês</p>
                  </div>
                </div>
                {teacherComparisonData.map((row, index) => (
                  <div key={index} className={`grid grid-cols-3 gap-0 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-slate-100 transition-colors`}>
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
