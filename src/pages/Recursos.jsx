import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { useScrollAnimation } from '@/hooks/use-scroll-animation.js'
import { PageHero } from '@/components/PageHero.jsx'
import {
  List,
  Target,
  Settings,
  Smile,
  CheckCircle,
  Edit,
  Cloud,
  BookOpen,
  Eye,
  ClipboardCheck,
  BarChart3,
  Users,
  HandHeart,
  PieChart,
  Link,
  Palette,
  Headphones,
  GraduationCap,
  Presentation,
  Building2
} from 'lucide-react'

function Recursos() {
  const [activeTab, setActiveTab] = useState('estudantes')
  const navigate = useNavigate()
  const heroRef = useScrollAnimation()
  const tabsRef = useScrollAnimation()

  const tabs = [
    { id: 'estudantes', label: 'Para Estudantes', icon: <GraduationCap className="w-5 h-5" /> },
    { id: 'professores', label: 'Para Professores', icon: <Presentation className="w-5 h-5" /> },
    { id: 'escolas', label: 'Para Escolas', icon: <Building2 className="w-5 h-5" /> }
  ]

  const recursosEstudantes = [
    {
      icon: <List className="w-8 h-8 text-brand-primary animate-pulse-glow" />,
      title: 'Lista de Acrônimos',
      description: 'Lista de Acrônimos específicos para cada uma das fases (planejamento, produção, autoavaliação).'
    },
    {
      icon: <Target className="w-8 h-8 text-brand-primary animate-pulse-glow" />,
      title: 'Planejamento de Metas',
      description: 'Planejamento de metas e prazos para organizar o processo de escrita.'
    },
    {
      icon: <Settings className="w-8 h-8 text-brand-primary animate-pulse-glow" />,
      title: 'Estratégias Autorreguladas',
      description: 'Estratégias autorreguladas de curto, médio e longo prazo, aplicadas em cada fase (planejamento, produção, autoavaliação).'
    },
    {
      icon: <Smile className="w-8 h-8 text-brand-primary animate-pulse-glow" />,
      title: 'Painel de Sentimentos',
      description: 'Painel de Sentimentos para monitorar motivação, confiança e emoções ligadas à escrita.'
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-brand-primary animate-pulse-glow" />,
      title: 'Autoavaliação Estruturada',
      description: 'Autoavaliação estruturada, com rubricas alinhadas às habilidades da BNCC e às competências do Enem.'
    },
    {
      icon: <Edit className="w-8 h-8 text-brand-primary animate-pulse-glow" />,
      title: 'Módulo de Escrita',
      description: 'Módulo de Escrita: acompanhamento desde a construção do parágrafo-padrão até a redação final.'
    },
    {
      icon: <Eye className="w-8 h-8 text-brand-primary animate-pulse-glow" />,
      title: 'Correções Detalhadas',
      description: 'Correções ilimitadas e detalhadas, na fase inicial da escrita incluindo análise de: Estrutura do parágrafo, Frequência de palavras, Uso de sinônimos e Coesão textual.'
    },
    {
      icon: <Cloud className="w-8 h-8 text-brand-primary animate-pulse-glow" />,
      title: 'Feedback com IA',
      description: 'Feedback com IA no final do processo — não para substituir, mas para complementar a revisão.'
    }
  ]

  const recursosProfessores = [
    {
      icon: <Cloud className="w-8 h-8 text-brand-primary animate-pulse-glow" />,
      title: 'Plataforma 100% Online',
      description: 'Plataforma 100% online e automatizada com acesso aos recursos disponíveis para os estudantes para criar, enviar e avaliar as redações.'
    },
    {
      icon: <BookOpen className="w-8 h-8 text-brand-primary animate-pulse-glow" />,
      title: 'Habilidades da BNCC',
      description: 'Lista de habilidades da BNCC a serem trabalhadas.'
    },
    {
      icon: <Eye className="w-8 h-8 text-brand-primary animate-pulse-glow" />,
      title: 'Acompanhamento em Tempo Real',
      description: 'Acompanhamento em tempo real do progresso de cada aluno e turma.'
    },
    {
      icon: <ClipboardCheck className="w-8 h-8 text-brand-primary animate-pulse-glow" />,
      title: 'Avaliação Docente Estruturada',
      description: 'Avaliação docente estruturada, com rubricas alinhadas às habilidades da BNCC e às competências do Enem.'
    },
    {
      icon: <Users className="w-8 h-8 text-brand-primary animate-pulse-glow" />,
      title: 'Dados de Autoavaliação',
      description: 'Acesso aos dados da autoavaliação dos alunos (permitindo avaliação por pares e novos formatos avaliativos).'
    },
    {
      icon: <Settings className="w-8 h-8 text-brand-primary animate-pulse-glow" />,
      title: 'Correções com IA',
      description: 'Correções detalhadas com IA (como elemento de revisão adicional para feedbacks personalizados).'
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-brand-primary animate-pulse-glow" />,
      title: 'Relatórios Completos',
      description: 'Relatórios completos de desempenho, com dados qualitativos, gráficos de evolução por habilidade e notas.'
    },
    {
      icon: <Target className="w-8 h-8 text-brand-primary animate-pulse-glow" />,
      title: 'Redução de Carga',
      description: 'Redução da carga de trabalho, com correções apoiadas em critérios qualitativos claros, compartilhados e previamente selecionados.'
    }
  ]

  const recursosEscolas = [
    {
      icon: <HandHeart className="w-8 h-8 text-brand-primary animate-pulse-glow" />,
      title: 'Suporte para Professores',
      description: 'Suporte para professores com redução de carga de trabalho.'
    },
    {
      icon: <Users className="w-8 h-8 text-brand-primary animate-pulse-glow" />,
      title: 'Desenvolvimento da Autorregulação',
      description: 'Plataforma que permite o desenvolvimento da autorregulação dos alunos, a produção escrita e os resultados gerais de aprovação.'
    },
    {
      icon: <PieChart className="w-8 h-8 text-brand-primary animate-pulse-glow" />,
      title: 'Dashboards Personalizados',
      description: 'Dashboards personalizados, mostrando: Quantitativo de redações produzidas, Habilidades da BNCC trabalhadas, Níveis de desempenho por aluno, turma ou escola.'
    }
  ]

  const getCurrentResources = () => {
    switch (activeTab) {
      case 'estudantes':
        return recursosEstudantes
      case 'professores':
        return recursosProfessores
      case 'escolas':
        return recursosEscolas
      default:
        return recursosEstudantes
    }
  }

  const getCurrentTitle = () => {
    switch (activeTab) {
      case 'estudantes':
        return 'Recursos para Estudantes'
      case 'professores':
        return 'Recursos para Professores'
      case 'escolas':
        return 'Recursos para Escolas'
      default:
        return 'Recursos para Estudantes'
    }
  }

  const getCurrentDescription = () => {
    switch (activeTab) {
      case 'estudantes':
        return 'Desenvolva sua escrita de forma autônoma com ferramentas que guiam cada etapa do processo'
      case 'professores':
        return 'Otimize seu tempo e potencialize o aprendizado dos alunos com ferramentas de gestão e acompanhamento'
      case 'escolas':
        return 'Solução institucional completa para transformar a cultura de escrita na sua escola'
      default:
        return 'Desenvolva sua escrita de forma autônoma com ferramentas que guiam cada etapa do processo'
    }
  }

  const getHeroContent = () => {
    return {
      title: 'Recursos da',
      titleHighlight: 'Plataforma',
      subtitle: 'Descubra todas as ferramentas e funcionalidades que vão transformar o processo de escrita e aprendizagem.'
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

      {/* Resource Categories Tabs */}
      <section ref={tabsRef} className="py-16 bg-slate-50 animate-on-scroll">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12 sticky top-20 z-40 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-sm animate-fade-in-down">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 animate-fade-in-up ${
                  activeTab === tab.id
                    ? 'bg-brand-primary text-white shadow-lg scale-105'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-brand-accent hover:shadow-md'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="animate-float" style={{ animationDelay: `${index * 150}ms` }}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Category Content */}
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              {getCurrentTitle()}
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              {getCurrentDescription()}
            </p>
          </div>

          {/* Resources Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {getCurrentResources().map((recurso, index) => (
              <Card 
                key={index} 
                className={`p-6 hover-lift border-0 shadow-lg animate-scale-in delay-${Math.min(index * 100, 800)}`}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center w-16 h-16 bg-brand-light rounded-lg mb-6 mx-auto transition-transform duration-500 hover:rotate-12 hover:scale-110 animate-float" style={{ animationDelay: `${index * 100}ms` }}>
                    {recurso.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4 text-center">
                    {recurso.title}
                  </h3>
                  <p className="text-slate-700 mb-6 text-center leading-relaxed">
                    {recurso.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white py-16 animate-fade-in-up">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">
            Pronto para transformar a escrita na sua instituição?
          </h2>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Experimente gratuitamente todos os recursos e veja o impacto na autonomia e qualidade da escrita dos seus alunos.
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/precos')}
            className="bg-brand-primary hover:bg-brand-secondary text-white px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-110 hover:shadow-xl"
          >
            Começar Agora
          </Button>
        </div>
      </section>
    </div>
  )
}

export default Recursos
