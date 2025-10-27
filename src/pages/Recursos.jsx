import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { useScrollAnimation } from '@/hooks/use-scroll-animation.js'
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
      title: 'Lista de Acrônimos Inteligentes',
      description: 'Sistema completo de acrônimos específicos para cada fase do processo de escrita: planejamento, produção e autoavaliação. Ajuda a memorizar e aplicar estratégias eficazes.',
      features: [
        'Acrônimos para planejamento',
        'Técnicas de produção',
        'Guias de autoavaliação',
        'Lembretes contextuais'
      ]
    },
    {
      icon: <Target className="w-8 h-8 text-brand-primary animate-pulse-glow" />,
      title: 'Planejamento de Metas Estruturado',
      description: 'Organize seu processo de escrita com um sistema avançado de metas e prazos, permitindo acompanhar seu progresso de forma visual e motivadora.',
      features: [
        'Definição de objetivos claros',
        'Cronograma personalizado',
        'Acompanhamento visual',
        'Notificações inteligentes'
      ]
    },
    {
      icon: <Settings className="w-8 h-8 text-brand-primary animate-pulse-glow" />,
      title: 'Estratégias Autorreguladas',
      description: 'Aplique estratégias comprovadas de autorregulação em cada fase da escrita, com técnicas de curto, médio e longo prazo adaptadas ao seu ritmo.',
      features: [
        'Estratégias de planejamento',
        'Técnicas de monitoramento',
        'Reflexão guiada',
        'Autoavaliação contínua'
      ]
    },
    {
      icon: <Smile className="w-8 h-8 text-brand-primary animate-pulse-glow" />,
      title: 'Painel de Sentimentos',
      description: 'Recurso exclusivo para acompanhamento das competências socioemocionais durante o processo de escrita, auxiliando na regulação de crenças e motivação.',
      features: [
        'Registro de emoções',
        'Análise de motivação',
        'Confiança progressiva',
        'Insights personalizados'
      ]
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-brand-primary animate-pulse-glow" />,
      title: 'Autoavaliação Estruturada',
      description: 'Sistema de rubricas detalhadas alinhadas às habilidades da BNCC e competências do ENEM, permitindo que você avalie seu próprio trabalho com critérios objetivos.',
      features: [
        'Rubricas BNCC e ENEM',
        'Critérios objetivos',
        'Feedback imediato',
        'Evolução documentada'
      ]
    },
    {
      icon: <Edit className="w-8 h-8 text-brand-primary animate-pulse-glow" />,
      title: 'Módulo de Escrita Completo',
      description: 'Ambiente de escrita com acompanhamento desde o parágrafo-padrão até a redação completa, com ferramentas de análise textual e sugestões contextuais.',
      features: [
        'Editor inteligente',
        'Análise estrutural',
        'Banco de temas',
        'Histórico de versões'
      ]
    }
  ]

  const recursosProfessores = [
    {
      icon: <Cloud className="w-8 h-8 text-brand-primary animate-pulse-glow" />,
      title: 'Plataforma 100% Online',
      description: 'Ambiente totalmente automatizado na nuvem com acesso a todos os recursos estudantis, permitindo acompanhamento em tempo real de qualquer lugar.',
      features: [
        'Acesso multiplataforma',
        'Sincronização automática',
        'Backup contínuo',
        'Sem instalação'
      ]
    },
    {
      icon: <BookOpen className="w-8 h-8 text-brand-primary animate-pulse-glow" />,
      title: 'Habilidades da BNCC',
      description: 'Lista completa de habilidades da BNCC integrada à plataforma, facilitando o planejamento pedagógico e alinhamento curricular.',
      features: [
        'Biblioteca de habilidades',
        'Alinhamento automático',
        'Relatórios por habilidade',
        'Sugestões pedagógicas'
      ]
    },
    {
      icon: <Eye className="w-8 h-8 text-brand-primary animate-pulse-glow" />,
      title: 'Acompanhamento em Tempo Real',
      description: 'Monitore o progresso individual e coletivo das turmas com dashboards dinâmicos que atualizam automaticamente.',
      features: [
        'Dashboard ao vivo',
        'Alertas automáticos',
        'Métricas detalhadas',
        'Comparativos'
      ]
    },
    {
      icon: <ClipboardCheck className="w-8 h-8 text-brand-primary animate-pulse-glow" />,
      title: 'Sistema de Avaliação Docente',
      description: 'Ferramenta estruturada de avaliação alinhada à BNCC e competências ENEM, com critérios personalizáveis e feedback eficiente.',
      features: [
        'Critérios personalizáveis',
        'Correção assistida',
        'Banco de comentários',
        'Exportação de notas'
      ]
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-brand-primary animate-pulse-glow" />,
      title: 'Relatórios Detalhados',
      description: 'Geração automática de relatórios individuais e coletivos com análises estatísticas e insights sobre o desenvolvimento das turmas.',
      features: [
        'Relatórios individuais',
        'Análises de turma',
        'Gráficos interativos',
        'Exportação PDF/Excel'
      ]
    },
    {
      icon: <Users className="w-8 h-8 text-brand-primary animate-pulse-glow" />,
      title: 'Gestão de Turmas',
      description: 'Organize e gerencie múltiplas turmas com facilidade, atribua tarefas, acompanhe entregas e mantenha comunicação eficiente.',
      features: [
        'Criação de turmas',
        'Atribuição de tarefas',
        'Controle de prazos',
        'Comunicação integrada'
      ]
    }
  ]

  const recursosEscolas = [
    {
      icon: <HandHeart className="w-8 h-8 text-brand-primary animate-pulse-glow" />,
      title: 'Suporte Completo para Professores',
      description: 'Redução significativa da carga de trabalho docente com automação inteligente e ferramentas de apoio pedagógico.',
      features: [
        'Correção automatizada',
        'Biblioteca de recursos',
        'Treinamento contínuo',
        'Suporte dedicado'
      ]
    },
    {
      icon: <PieChart className="w-8 h-8 text-brand-primary animate-pulse-glow" />,
      title: 'Dashboards Administrativos',
      description: 'Painéis gerenciais personalizados com visualização de redações produzidas, habilidades trabalhadas e métricas institucionais.',
      features: [
        'Visão institucional',
        'KPIs educacionais',
        'Análise comparativa',
        'Tendências e padrões'
      ]
    },
    {
      icon: <Users className="w-8 h-8 text-brand-primary animate-pulse-glow" />,
      title: 'Desenvolvimento da Autorregulação',
      description: 'Plataforma focada no desenvolvimento autônomo dos estudantes, promovendo habilidades para toda a vida.',
      features: [
        'Metodologia validada',
        'Habilidades socioemocionais',
        'Pensamento crítico',
        'Autonomia progressiva'
      ]
    },
    {
      icon: <Link className="w-8 h-8 text-brand-primary animate-pulse-glow" />,
      title: 'Integração com LMS',
      description: 'Integração perfeita com sistemas de gestão de aprendizagem existentes, mantendo todos os dados sincronizados.',
      features: [
        'Integração Moodle',
        'API aberta',
        'Sincronização automática',
        'Dados centralizados'
      ]
    },
    {
      icon: <Palette className="w-8 h-8 text-brand-primary animate-pulse-glow" />,
      title: 'White-Label Disponível',
      description: 'Personalize a plataforma com a identidade visual da sua instituição, criando uma experiência única para seus alunos.',
      features: [
        'Logo personalizado',
        'Cores institucionais',
        'Domínio próprio',
        'Branding completo'
      ]
    },
    {
      icon: <Headphones className="w-8 h-8 text-brand-primary animate-pulse-glow" />,
      title: 'Suporte Dedicado 24/7',
      description: 'Equipe especializada disponível em tempo integral para garantir o sucesso da implementação e uso contínuo da plataforma.',
      features: [
        'Suporte técnico',
        'Consultoria pedagógica',
        'Treinamentos',
        'Acompanhamento contínuo'
      ]
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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section ref={heroRef} className="bg-white text-slate-900 py-20 animate-on-scroll">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in-up">
            Principais Recursos da Plataforma
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto animate-fade-in-up delay-200">
            Veja os principais recursos disponíveis na plataforma
          </p>
        </div>
      </section>

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
                  <ul className="space-y-3">
                    {recurso.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3 animate-fade-in-left" style={{ animationDelay: `${(index * 100) + (featureIndex * 50)}ms` }}>
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-slate-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
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
