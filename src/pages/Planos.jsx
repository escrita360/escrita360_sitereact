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
import { plansService } from '@/services/plans.js'
import { formatPrice } from '@/lib/utils.js'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'

function Precos() {
  // Force HMR update
  const [searchParams] = useSearchParams()

  const normalizeAudience = (value) => {
    const raw = (value || '').toString().trim().toLowerCase()

    if (['estudantes', 'estudante', 'aluno', 'alunos'].includes(raw)) return 'estudantes'
    if (['professores', 'professor', 'docente', 'docentes', 'prof'].includes(raw)) return 'professores'
    if (['escolas', 'escola', 'instituicao', 'instituições', 'instituicoes', 'institucional'].includes(raw)) return 'escolas'

    return 'estudantes'
  }

  const rawAudienceFromUrl = searchParams.get('audience')
  const audienceFromUrl = rawAudienceFromUrl ? normalizeAudience(rawAudienceFromUrl) : 'estudantes'

  const [selectedAudience, setSelectedAudience] = useState(audienceFromUrl)
  const [schoolPlanType, setSchoolPlanType] = useState('correcao') // 'correcao' ou 'hibrido'
  const navigate = useNavigate()
  const plansRef = useScrollAnimation()

  // Estado para os planos
  const [plansData, setPlansData] = useState(null)

  // Atualizar quando a URL mudar
  useEffect(() => {
    const urlAudienceRaw = searchParams.get('audience')
    if (!urlAudienceRaw) return

    const urlAudience = normalizeAudience(urlAudienceRaw)
    if (urlAudience !== selectedAudience) {
      setSelectedAudience(urlAudience)
    }
  }, [searchParams, selectedAudience])

  // Buscar planos da API
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        console.log('🔄 Buscando planos para audience:', selectedAudience)
        const data = await plansService.getPlans(selectedAudience)
        setPlansData(data)
        console.log('✅ Planos carregados:', data.plans?.length || 0, 'planos')
      } catch (error) {
        console.error('❌ Erro ao buscar planos:', error)
      }
    }

    fetchPlans()
  }, [selectedAudience])

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

  const handleConsultSpecialists = () => {
    navigate('/contato')
  }

  // Planos vêm da API agora
  const studentPlans = plansData?.plans?.filter(plan => plan.audience === 'estudantes') || []
  const teacherPlans = plansData?.plans?.filter(plan => plan.audience === 'professores') || []
  const schoolPlansSemestral = plansData?.plans?.filter(plan => plan.audience === 'escolas' && plan.planType === 'semestral') || []
  const schoolPlansAnual = plansData?.plans?.filter(plan => plan.audience === 'escolas' && plan.planType === 'anual') || []

  // Combinar planos de escolas
  const schoolPlans = [...schoolPlansSemestral, ...schoolPlansAnual]

  // Pacotes de análises detalhadas para estudantes
  const studentCreditPackages = [
    {
      name: 'Pacote 1',
      credits: 5,
      price: 20,
      description: '',
      features: ['Análises detalhadas com IA']
    },
    {
      name: 'Pacote 2',
      credits: 15,
      price: 45,
      description: '',
      features: ['Análises detalhadas com IA']
    },
    {
      name: 'Pacote 3',
      credits: 30,
      price: 60,
      description: '',
      popular: true,
      features: ['Análises detalhadas com IA']
    }
  ]

  // Pacotes de análises detalhadas para professores
  const teacherCreditPackages = [
    {
      name: 'Pacote 1',
      credits: 100,
      price: 200,
      description: '',
      features: ['Análises detalhadas com IA']
    },
    {
      name: 'Pacote 2',
      credits: 150,
      price: 300,
      description: '',
      popular: true,
      features: ['Análises detalhadas com IA']
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
      title: 'Modelo Institucional',
      description: 'A escola adquire planos e pacotes para otimizar a correção dos textos produzidos em sala de aula e provas de redação.',
      number: 1
    },
    {
      title: 'Modelo híbrido 360',
      description: 'Combina aquisição de planos para estudantes, adquiridos pelas famílias (ou com custos compartilhados com a escola, conforme a política de cada instituição) e a contratação de planos e pacotes de créditos pela escola.',
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
        title: '',
        titleHighlight: 'Estudante',
        titleHighlightClass: 'bg-gradient-to-r from-[#1d5a91] to-[#3b82f6] bg-clip-text text-transparent',
        subtitle: 'Projetado para uso individual, com foco em escrita, reescrita e feedback. '
      }
    } else if (selectedAudience === 'professores') {
      return {
        title: '',
        titleHighlight: 'Professor',
        titleHighlightClass: 'bg-gradient-to-r from-[#1d5a91] to-[#3b82f6] bg-clip-text text-transparent',
        subtitle: 'Para professores autônomos, cursinhos ou projetos pessoais'
      }
    } else {
      return {
        title: '',
        titleHighlight: 'Escolas',
        titleHighlightClass: 'bg-gradient-to-r from-[#1d5a91] to-[#3b82f6] bg-clip-text text-transparent',
        subtitle: 'Com foco em flexibilidade e integração pedagógica, oferecemos dois modelos. Escolha o que melhor se adapta às necessidades de sua instituição. '
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

  // Features específicas para o modelo híbrido
  const studentFeatures = [
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

  const teacherFeatures = [
    'Criação e gerenciamento de Turmas',
    'Banco de rubricas para facilitar a avaliação',
    'Correção via foto ou texto direto na plataforma',
    'Relatórios de desempenho com notas (ENEM e texto dissertativo-argumentativo)',
    'Correção com IA (ENEM e texto dissertativo-argumentativo)',
    'Relatórios consolidados (Habilidades BNCC X ENEM)'
  ]

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
              {selectedAudience === 'estudantes' ? 'Recursos disponíveis na Plataforma' : selectedAudience === 'professores' ? 'Recursos disponíveis na Plataforma' : 'Escolha o modelo que atende suas necessidades:'}
            </h2>
          </div>
          
          {/* Quadro único para todos os casos */}
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
      </section>
      )}

      {/* School Models Section - Only for schools - FIRST */}
      {selectedAudience === 'escolas' && (
        <section className="py-8 md:py-12 lg:py-16 bg-slate-50">
          <div className="container mx-auto px-4 max-w-7xl">
            
            {/* Platform Features Section - For schools */}
            <div className="mt-12 mb-12">
              <div className="text-center mb-8">
                <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 mb-3">
                  Escolha o modelo que atende suas necessidades:
                </h3>
              </div>
              
              {/* Cards compactos de seleção de modelo */}
              <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto mb-8">
                <div 
                  className={`bg-white rounded-xl shadow-sm p-5 border cursor-pointer transition-all ${
                    schoolPlanType === 'correcao' 
                      ? 'border-brand-primary bg-blue-50 shadow-md' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  onClick={() => setSchoolPlanType('correcao')}
                >
                  <h4 className="text-base font-bold text-slate-900 mb-1">{schoolModels[0].title}</h4>
                  <p className="text-slate-500 text-sm">{schoolModels[0].description}</p>
                </div>
                
                <div 
                  className={`bg-white rounded-xl shadow-sm p-5 border cursor-pointer transition-all ${
                    schoolPlanType === 'hibrido' 
                      ? 'border-brand-primary bg-blue-50 shadow-md' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  onClick={() => {
                    setSchoolPlanType('hibrido')
                  }}
                >
                  <h4 className="text-base font-bold text-slate-900 mb-1">{schoolModels[1].title}</h4>
                  <p className="text-slate-500 text-sm">{schoolModels[1].description}</p>
                </div>
              </div>
            </div>

            {/* Quadro de Funções Híbrido - Professor + Aluno */}
            {schoolPlanType === 'hibrido' && selectedAudience === 'escolas' && (
              <div className="mt-12 mb-8">
                <div className="flex items-center justify-center gap-8 max-w-6xl mx-auto">
                  {/* Recursos disponíveis na Plataforma */}
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 flex-1 max-w-md">
                    <h4 className="text-lg font-bold text-slate-900 mb-4 text-center">Recursos disponíveis na Plataforma</h4>
                    <div className="space-y-3">
                      {teacherFeatures.map((feature, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-2.5 h-2.5 text-green-600" />
                          </div>
                          <span className="text-slate-700 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Símbolo + */}
                  <div className="flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-brand-primary flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">+</span>
                    </div>
                  </div>

                  {/* Recursos disponíveis na Plataforma */}
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 flex-1 max-w-md">
                    <h4 className="text-lg font-bold text-slate-900 mb-4 text-center">Recursos disponíveis na Plataforma</h4>
                    <div className="space-y-3">
                      {studentFeatures.map((feature, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-2.5 h-2.5 text-green-600" />
                          </div>
                          <span className="text-slate-700 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tabela de Funções - Após Cards de Preço */}
            {selectedAudience === 'escolas' && schoolPlanType !== 'hibrido' && (
              <div className="mt-12 mb-8">
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 md:p-8 max-w-md mx-auto">
                  <h4 className="text-lg font-bold text-slate-900 mb-4 text-center">Recursos disponíveis na Plataforma</h4>
                  <div className="space-y-3 md:space-y-4">
                    {teacherFeatures.map((feature, index) => (
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
            )}

            <div className="mt-12 flex justify-center">
              <Button
                className="w-full max-w-md bg-[#4A90E2] hover:bg-[#357ABD] text-white"
                variant="default"
                size="lg"
                onClick={handleConsultSpecialists}
              >
                Consulte nossos especialistas
              </Button>
            </div>

            {/* Cards de planos/pacotes removidos conforme solicitado */}
          </div>
        </section>
      )}

      {/* Pricing Grid - Only for students and teachers */}
      {(selectedAudience === 'estudantes' || selectedAudience === 'professores') && (
        <section ref={plansRef} className="pt-12 pb-8 md:pt-16 md:pb-12 lg:pt-20 lg:pb-16 bg-white animate-on-scroll">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className={`grid gap-8 mx-auto mt-6 justify-center ${currentPlans.length > 1 ? 'grid-cols-1 md:grid-cols-2 max-w-4xl' : 'grid-cols-1 max-w-md'}`}>
              {currentPlans.map((plan, index) => (
                <Card key={index} className={`relative hover-lift animate-scale-in delay-${index * 200} ${plan.popular ? 'border-2 border-brand-primary shadow-xl' : 'hover:shadow-xl'} transition-all flex flex-col pt-6 w-full`}>
                  <CardHeader className="text-center pb-4">
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
                        {plan.credits} {selectedAudience === 'estudantes' ? 'correções detalhadas com IA' : 'correções detalhadas com IA'}
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
                  ? 'Necessita de mais créditos para análises das redações?'
                  : 'Necessita de mais créditos para correções das redações?'
                }
              </p>
            </div>
            
            <div className={`grid gap-6 mx-auto justify-items-center mt-6 ${
              selectedAudience === 'professores' ? 'md:grid-cols-2 max-w-2xl' :
              'md:grid-cols-3 max-w-4xl'
            }`}>
              {creditPackages.map((pkg, index) => (
                <Card key={index} className={`relative hover-lift ${pkg.popular ? 'border-2 border-green-500 shadow-xl' : 'hover:shadow-xl'} transition-all flex flex-col pt-4 w-full max-w-xs`}>
                  <CardHeader className="text-center pb-2">
                    <h3 className="text-lg font-bold text-slate-900">{pkg.name}</h3>
                    <div className="my-2">
                      <span className="text-2xl font-bold text-brand-primary">
                        {formatPrice(pkg.price)}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm">
                      <strong>{pkg.credits} análises detalhadas com IA</strong>
                    </p>
                    <p className="text-slate-600 text-xs mt-1">{pkg.description}</p>
                  </CardHeader>
                  <CardContent>
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

    </div>
  )   
}

export default Precos

