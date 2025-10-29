import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent } from '@/components/ui/card.jsx'
import { Check, X, PenTool, Brain, TrendingUp, GraduationCap, School, Edit, FileText, CheckCircle, Bot, RotateCcw, Trophy, Heart, Target, BarChart, Users, UserCheck, BookOpen, Award } from 'lucide-react'
import { useScrollAnimation } from '@/hooks/use-scroll-animation.js'
import logo from '@/assets/logo2.svg'
import robo from '@/assets/robo.svg'

function Home() {
  const heroRef = useScrollAnimation()
  const statsRef = useScrollAnimation()
  const aboutRef = useScrollAnimation()

  return (
    <div>
      {/* Hero Section */}
      <section ref={heroRef} className="hero bg-white animate-on-scroll -mt-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 items-center gap-8">
            <div className="hero-content animate-fade-in-left text-center lg:text-left">
              <div className="hero-badge mb-4">
                <span className="inline-block bg-brand-light text-brand-primary px-4 py-2 rounded-full text-sm font-medium">
                  Escrita360 — Muito além da correção automática para o Enem.
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 leading-tight">
                <span style={{ color: '#2b7475' }}>Inovamos para oferecer a plataforma mais completa </span>
                <span style={{ color: '#569e9d' }}>para o desenvolvimento da escrita, unindo </span>
                <span style={{ color: '#659bb3' }}>autorregulação e inteligência artificial.</span>
              </h1>
              <p className="hero-description text-lg md:text-xl text-slate-600 mb-8 leading-relaxed">
                Revisão como apoio, não como atalho, respeitando o processo de aprendizagem. A correção complementar com Inteligência Artificial valoriza o processo de reescrita e garante que o aprendizado esteja no centro da experiência.
              </p>
              <div className="hero-stats flex gap-8 justify-center lg:justify-start mt-8">
                <div className="stat text-center">
                  <strong className="block text-slate-900 font-bold">Processo</strong>
                  <span className="text-slate-600">Autorregulado</span>
                </div>
                <div className="stat text-center">
                  <strong className="block text-slate-900 font-bold">IA</strong>
                  <span className="text-slate-600">Complementar</span>
                </div>
                <div className="stat text-center">
                  <strong className="block text-slate-900 font-bold">Foco</strong>
                  <span className="text-slate-600">Aprendizagem</span>
                </div>
              </div>
            </div>
            <div className="hero-image flex justify-center animate-fade-in-right delay-200">
                <img 
                  src={robo} 
                  alt="Robô Escrita360" 
                  className="w-190 h-190 animate-float hover:scale-110 transition-transform duration-500"
                />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="stats bg-slate-50 py-8 md:py-12 lg:py-16 animate-on-scroll">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="section-title text-2xl md:text-3xl lg:text-4xl font-bold text-center text-slate-900 mb-8 md:mb-12 animate-fade-in-up">
            Eficiência educacional na prática
          </h2>
          <div className="stats-grid grid md:grid-cols-4 gap-8">
            <Card className="stat-item text-center p-6 hover-lift border-brand-accent/30 animate-fade-in-up delay-100">
              <CardContent className="pt-6">
                <Edit className="w-12 h-12 text-brand-primary mx-auto mb-4 animate-pulse-glow" />
                <div className="stat-number text-4xl font-bold text-brand-primary mb-2 counter" data-target="50">50</div>
                <div className="stat-label text-sm text-slate-600 mb-2">Mil+</div>
                <p className="stat-description text-slate-700">Redações corrigidas com autorregulação</p>
              </CardContent>
            </Card>
            <Card className="stat-item text-center p-6 hover-lift border-brand-accent/30 animate-fade-in-up delay-200">
              <CardContent className="pt-6">
                <School className="w-12 h-12 text-brand-secondary mx-auto mb-4 animate-pulse-glow" />
                <div className="stat-number text-4xl font-bold text-brand-secondary mb-2 counter" data-target="200">200</div>
                <div className="stat-label text-sm text-slate-600 mb-2">+</div>
                <p className="stat-description text-slate-700">Instituições públicas e privadas</p>
              </CardContent>
            </Card>
            <Card className="stat-item text-center p-6 hover-lift border-brand-accent/30 animate-fade-in-up delay-300">
              <CardContent className="pt-6">
                <GraduationCap className="w-12 h-12 text-brand-primary mx-auto mb-4 animate-pulse-glow" />
                <div className="stat-number text-4xl font-bold text-brand-primary mb-2 counter" data-target="15">15</div>
                <div className="stat-label text-sm text-slate-600 mb-2">Mil+</div>
                <p className="stat-description text-slate-700">Estudantes desenvolvendo autonomia</p>
              </CardContent>
            </Card>
            <Card className="stat-item text-center p-6 hover-lift border-brand-accent/30 animate-fade-in-up delay-400">
              <CardContent className="pt-6">
                <TrendingUp className="w-12 h-12 text-brand-secondary mx-auto mb-4 animate-pulse-glow" />
                <div className="stat-number text-4xl font-bold text-brand-secondary mb-2">+25%</div>
                <div className="stat-label text-sm text-slate-600 mb-2"></div>
                <p className="stat-description text-slate-700">De melhoria na escrita em poucos meses</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section ref={aboutRef} className="about-platform bg-white py-8 md:py-12 lg:py-16 animate-on-scroll">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center animate-fade-in-up">
            <p className="about-text text-lg text-slate-700 leading-relaxed">
            O <span className="font-bold text-brand-primary">Escrita360</span> é a plataforma mais completa de escrita autorregulada e avaliação inteligente,
            projetada para levar estudantes, professores e escolas para o próximo nível com Inteligência Artificial.
            Com soluções inovadoras e tecnologia de ponta, oferecemos uma experiência educacional única, que engaja
            os estudantes na jornada completa de desenvolvimento da escrita, empodera professores com dados valiosos
            e oferece às escolas dashboards completos para gestão pedagógica, promovendo a aprendizagem significativa
            que impulsiona o sucesso acadêmico.
          </p>
          </div>
        </div>
      </section>

      {/* Differential Section */}
      <section className="differential bg-slate-50 py-8 md:py-12 lg:py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="section-header text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">O Diferencial do Escrita360</h2>
            <p className="text-lg md:text-xl text-slate-600">Uma abordagem revolucionária para o aprendizado da escrita</p>
          </div>
          <div className="differential-content space-y-6">
            <div className="differential-text">
              <p className="text-lg text-slate-700 leading-relaxed mb-6">
                Diferente de outras plataformas que apenas corrigem textos prontos, o <strong>Escrita360</strong> coloca a escrita autorregulada no centro do processo. Proporciona uma experiência completa de imersão na escrita da redação, desde o planejamento até a autoavaliação, transformando essa prática de escrita em um percurso iterativo e formativo, construído por meio de rascunhos, revisões e reescritas.
              </p>
              
              <div className="focus-points bg-white p-6 rounded-lg shadow-sm mb-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4">O foco é:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="w-6 h-6 text-brand-primary mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Otimizar o tempo dos professores diante do alto volume de correções</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-6 h-6 text-brand-primary mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Desenvolver a habilidade escrita dos estudantes, com autonomia, autorregulação e compreensão das próprias dificuldades na escrita</span>
                  </li>
                </ul>
              </div>
              
              <div className="ai-approach bg-brand-light p-6 rounded-lg">
                <p className="text-lg text-slate-800 leading-relaxed">
                  <strong>Aqui, a Inteligência Artificial entra nesse processo no momento certo: ela não corrige por você, corrige com você!</strong> Não se trata só do texto final, porque a IA garante qualidade. O que importa é a jornada de escrever e reescrever.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Differences Section */}
      <section className="platform-differences bg-white py-8 md:py-12 lg:py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="section-header text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Qual a Diferença das Demais Plataformas</h2>
            <p className="text-lg md:text-xl text-slate-600">Oferece mais que correção, uma jornada autorregulada de escrita</p>
          </div>
          <div className="differences-grid grid md:grid-cols-3 gap-8">
            <Card className="difference-card p-6 hover-lift border-brand-accent/30 animate-scale-in delay-100">
              <div className="difference-icon w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mb-4 mx-auto">
                <Edit className="w-8 h-8 text-brand-primary animate-pulse-glow" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 text-center">Módulo de Escrita Completo</h3>
              <p className="text-slate-700 text-center">
                Oferece módulo de escrita com recursos que orientam a escrita desde o início, otimizando o tempo dos professores e potencializando o desempenho dos alunos.
              </p>
            </Card>
            <Card className="difference-card p-6 hover-lift border-brand-accent/30 animate-scale-in delay-200">
              <div className="difference-icon w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mb-4 mx-auto">
                <TrendingUp className="w-8 h-8 text-brand-secondary animate-pulse-glow" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 text-center">Análise Integrada Durante a Elaboração</h3>
              <p className="text-slate-700 text-center">
                Diferentes tipos de análise integrada durante a elaboração da redação, acompanhando o progresso de cada aluno com acesso às redações produzidas.
              </p>
            </Card>
            <Card className="difference-card p-6 hover-lift border-brand-accent/30 animate-scale-in delay-300">
              <div className="difference-icon w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mb-4 mx-auto">
                <BarChart className="w-8 h-8 text-brand-primary animate-pulse-glow" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 text-center">Evolução por Níveis de Desempenho</h3>
              <p className="text-slate-700 text-center">
                Acompanhamento do progresso através de gráficos e dados qualitativos, com acesso à evolução dos alunos baseada nos critérios de avaliação das habilidades da BNCC e competências do ENEM.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Platforms Section */}
      <section className="platforms-section bg-slate-50 py-8 md:py-12 lg:py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="section-title text-2xl md:text-3xl lg:text-4xl font-bold text-center text-slate-900 mb-8 md:mb-12 animate-fade-in-up">
            Conheça nossas Plataformas
          </h2>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <Card className="platform-card platform-left p-6 md:p-8 hover-lift border-brand-accent/30 animate-fade-in-left delay-100">
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 mb-6">
                <div className="platform-image w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mx-auto md:mx-0">
                  <UserCheck className="w-8 h-8 text-brand-primary animate-pulse-glow" />
                </div>
                <div className="platform-content text-center md:text-left">
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">Estudantes</h3>
                  <p className="text-slate-700 text-sm md:text-base">
                    Os estudantes desenvolvem autonomia na escrita de forma estruturada e personalizada,
                    vivenciando todo o processo de planejamento, escrita, autoavaliação e reescrita com
                    recursos que promovem autorregulação e senso crítico.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="platform-card platform-right p-6 md:p-8 hover-lift animate-fade-in-right delay-200">
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 mb-6">
                <div className="platform-content text-center md:text-left">
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">Professores</h3>
                  <p className="text-slate-700 text-sm md:text-base">
                    Professores ganham tempo com recursos valiosos para a gestão de turmas, criação de
                    atividades personalizadas e acompanhamento individual, baseadas nas competências do ENEM
                    e alinhadas à BNCC.
                  </p>
                </div>
                <div className="platform-image w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mx-auto md:mx-0">
                  <UserCheck className="w-8 h-8 text-brand-secondary animate-pulse-glow" />
                </div>
              </div>
            </Card>

            <Card className="platform-card platform-left p-6 md:p-8 hover-lift border-brand-accent/30 animate-fade-in-left delay-300">
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 mb-6">
                <div className="platform-image w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mx-auto md:mx-0">
                  <Users className="w-8 h-8 text-brand-primary animate-pulse-glow" />
                </div>
                <div className="platform-content text-center md:text-left">
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">Famílias</h3>
                  <p className="text-slate-700 text-sm md:text-base">
                    As famílias acompanham o desempenho dos estudantes, a proficiência de aprendizagem
                    e o engajamento em tempo real através de dashboards intuitivos e relatórios detalhados.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="platform-card platform-right p-6 md:p-8 hover-lift border-brand-accent/30 animate-fade-in-right delay-400">
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 mb-6">
                <div className="platform-content text-center md:text-left">
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">Escolas e Gestores</h3>
                  <p className="text-slate-700 text-sm md:text-base">
                    A plataforma dos gestores oferece flexibilização curricular e relatórios em tempo real,
                    para uma gestão eficaz do engajamento e aprendizagem dos seus estudantes, turmas e escolas.
                  </p>
                </div>
                <div className="platform-image w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mx-auto md:mx-0">
                  <School className="w-8 h-8 text-brand-secondary animate-pulse-glow" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Diferencial Section */}
      <section className="diferencial bg-white py-8 md:py-12 lg:py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-slate-900 mb-8 md:mb-12 animate-fade-in-up">O que nos torna únicos</h2>
          <div className="diferencial-grid grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="diferencial-item p-6 hover-lift border-brand-accent/20 animate-scale-in delay-100">
              <div className="diferencial-icon w-12 h-12 bg-brand-light rounded-full flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-brand-primary animate-pulse-glow" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Escrita Autorregulada no Centro</h3>
              <p className="text-slate-700">
                Diferente de plataformas que apenas corrigem textos prontos, colocamos a autorregulação como eixo principal.
                O estudante vivencia todo o processo de escrita.
              </p>
            </Card>

            <Card className="diferencial-item p-6 hover-lift border-brand-accent/20 animate-scale-in delay-200">
              <div className="diferencial-icon w-12 h-12 bg-brand-light rounded-full flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-brand-secondary animate-pulse-glow" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Painel de Sentimentos</h3>
              <p className="text-slate-700">
                Recurso voltado ao acompanhamento das competências socioemocionais no processo de escrita.
                Auxilia na regulação de crenças cognitivas.
              </p>
            </Card>

            <Card className="diferencial-item p-6 hover-lift border-brand-accent/20 animate-scale-in delay-300">
              <div className="diferencial-icon w-12 h-12 bg-brand-light rounded-full flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-brand-primary animate-pulse-glow" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Imersão Total no Processo de Escrita</h3>
              <p className="text-slate-700">
                Imersão total no processo de escrita com análises automatizadas: introduz o uso do parágrafo-padrão,
                ajudando a organizar ideias.
              </p>
            </Card>

            <Card className="diferencial-item p-6 hover-lift border-brand-accent/20 animate-scale-in delay-400">
              <div className="diferencial-icon w-12 h-12 bg-brand-light rounded-full flex items-center justify-center mb-4">
                <BarChart className="w-6 h-6 text-brand-secondary animate-pulse-glow" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Análise Integrada em Tempo Real</h3>
              <p className="text-slate-700">
                Conta com feedbacks e análises mediadas por diferentes recursos de análise textual,
                de forma rápida e consistente.
              </p>
            </Card>

            <Card className="diferencial-item p-6 hover-lift border-brand-accent/20 animate-scale-in delay-500">
              <div className="diferencial-icon w-12 h-12 bg-brand-light rounded-full flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-brand-primary animate-pulse-glow" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Uso de rubricas e evolução por níveis</h3>
              <p className="text-slate-700">
                Oferece rubricas autoavaliativas e monitoramento contínuo do desempenho, com gráficos e dados
                qualitativos alinhados às habilidades da BNCC.
              </p>
            </Card>

            <Card className="diferencial-item p-6 hover-lift border-brand-accent/20 animate-scale-in delay-600">
              <div className="diferencial-icon w-12 h-12 bg-brand-light rounded-full flex items-center justify-center mb-4">
                <Bot className="w-6 h-6 text-brand-secondary animate-pulse-glow" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">IA como Assistente</h3>
              <p className="text-slate-700">
                A tecnologia atua como uma camada complementar após a autoavaliação realizada pelo estudante,
                oferecendo feedback ao final do processo.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section bg-slate-50 py-8 md:py-12 lg:py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="section-title text-2xl md:text-3xl lg:text-4xl font-bold text-center text-slate-900 mb-4 animate-fade-in-up">
            Recursos que Transformam o Aprendizado
          </h2>
          <p className="section-subtitle text-lg md:text-xl text-center text-slate-600 mb-8 md:mb-12 animate-fade-in-up delay-200">
            Ferramentas desenvolvidas com base em pesquisas pedagógicas e tecnologia de ponta
          </p>
          <div className="features-grid grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="feature-card p-6 hover-lift border-brand-accent/20 animate-scale-in delay-100">
              <div className="feature-icon-wrapper w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mb-4 mx-auto">
                <Edit className="w-8 h-8 text-brand-primary animate-pulse-glow" />
              </div>
              <h3 className="text-xl font-bold text-center text-slate-900 mb-2">Editor Inteligente</h3>
              <p className="text-slate-700 text-center mb-4">
                Escreva com recursos de formatação profissional e sugestões em tempo real que respeitam seu processo criativo.
              </p>
                <a href="#" className="feature-link text-brand-primary hover:text-brand-secondary font-medium flex items-center justify-center gap-2 transition-all hover:scale-105">
                  Saiba mais <TrendingUp className="w-4 h-4" />
                </a>
              </Card>

            <Card className="feature-card p-6 hover-lift border-brand-accent/20 animate-scale-in delay-200">
              <div className="feature-icon-wrapper w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mb-4 mx-auto">
                <FileText className="w-8 h-8 text-brand-secondary animate-pulse-glow" />
              </div>
              <h3 className="text-xl font-bold text-center text-slate-900 mb-2">Rubricas Personalizadas</h3>
              <p className="text-slate-700 text-center mb-4">
                Avalie seu texto com critérios claros e objetivos baseados nas competências do ENEM e vestibulares.
              </p>
                <a href="#" className="feature-link text-brand-primary hover:text-brand-secondary font-medium flex items-center justify-center gap-2 transition-all hover:scale-105">
                  Saiba mais <TrendingUp className="w-4 h-4" />
                </a>
              </Card>

            <Card className="feature-card p-6 hover-lift border-brand-accent/20 animate-scale-in delay-300">
              <div className="feature-icon-wrapper w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mb-4 mx-auto">
                <BarChart className="w-8 h-8 text-brand-primary animate-pulse-glow" />
              </div>
              <h3 className="text-xl font-bold text-center text-slate-900 mb-2">Dashboard Completo</h3>
              <p className="text-slate-700 text-center mb-4">
                Acompanhe sua evolução com gráficos detalhados e relatórios de desempenho por competência.
              </p>
                <a href="#" className="feature-link text-brand-primary hover:text-brand-secondary font-medium flex items-center justify-center gap-2 transition-all hover:scale-105">
                  Saiba mais <TrendingUp className="w-4 h-4" />
                </a>
              </Card>

            <Card className="feature-card p-6 hover-lift border-brand-accent/20 animate-scale-in delay-400">
              <div className="feature-icon-wrapper w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mb-4 mx-auto">
                <Users className="w-8 h-8 text-brand-secondary animate-pulse-glow" />
              </div>
              <h3 className="text-xl font-bold text-center text-slate-900 mb-2">Gestão Escolar</h3>
              <p className="text-slate-700 text-center mb-4">
                Ferramentas completas para professores acompanharem turmas e instituições gerenciarem dados educacionais.
              </p>
              <a href="#" className="feature-link text-brand-primary hover:text-brand-secondary font-medium flex items-center justify-center gap-2 transition-all hover:scale-105">
                Saiba mais <TrendingUp className="w-4 h-4" />
              </a>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works bg-white py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="section-title text-4xl font-bold text-center text-slate-900 mb-4 animate-fade-in-up">
            Como Funciona o Escrita360
          </h2>
          <p className="section-subtitle text-xl text-center text-slate-600 mb-12 animate-fade-in-up delay-200">
            Um processo simples que respeita sua autonomia
          </p>
          <div className="steps-grid grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="step-item p-6 text-center hover-lift animate-scale-in delay-100">
              <div className="step-number w-12 h-12 bg-brand-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto animate-float">1</div>
              <div className="step-icon w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mb-4 mx-auto">
                <PenTool className="w-8 h-8 text-brand-primary animate-pulse-glow" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Planejamento</h3>
              <p className="text-slate-700">
                Organize suas ideias e estruture seu texto com ferramentas de planejamento que facilitam o processo criativo.
              </p>
            </Card>

            <Card className="step-item p-6 text-center hover:shadow-lg transition-shadow">
              <div className="step-number w-12 h-12 bg-brand-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">2</div>
              <div className="step-icon w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mb-4 mx-auto">
                <Edit className="w-8 h-8 text-brand-primary" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Escrita</h3>
              <p className="text-slate-700">
                Escreva seu texto no editor inteligente com suporte ao parágrafo-padrão e recursos de formatação profissional.
              </p>
            </Card>

            <Card className="step-item p-6 text-center hover:shadow-lg transition-shadow">
              <div className="step-number w-12 h-12 bg-brand-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">3</div>
              <div className="step-icon w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mb-4 mx-auto">
                <CheckCircle className="w-8 h-8 text-brand-primary" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Autoavaliação</h3>
              <p className="text-slate-700">
                Revise seu texto usando rubricas estruturadas e desenvolva senso crítico sobre sua própria escrita.
              </p>
            </Card>

            <Card className="step-item p-6 text-center hover:shadow-lg transition-shadow">
              <div className="step-number w-12 h-12 bg-brand-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">4</div>
              <div className="step-icon w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mb-4 mx-auto">
                <Bot className="w-8 h-8 text-brand-primary" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Feedback IA</h3>
              <p className="text-slate-700">
                Receba análise complementar da inteligência artificial com sugestões de melhoria específicas e construtivas.
              </p>
            </Card>

            <Card className="step-item p-6 text-center hover:shadow-lg transition-shadow">
              <div className="step-number w-12 h-12 bg-brand-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">5</div>
              <div className="step-icon w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mb-4 mx-auto">
                <RotateCcw className="w-8 h-8 text-brand-primary" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Reescrita</h3>
              <p className="text-slate-700">
                Aplique as melhorias identificadas e desenvolva autonomia no processo de revisão e aperfeiçoamento textual.
              </p>
            </Card>

            <Card className="step-item p-6 text-center hover:shadow-lg transition-shadow">
              <div className="step-number w-12 h-12 bg-brand-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">6</div>
              <div className="step-icon w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mb-4 mx-auto">
                <Trophy className="w-8 h-8 text-brand-primary" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Evolução</h3>
              <p className="text-slate-700">
                Acompanhe seu progresso ao longo do tempo e veja sua escrita evoluir com dados concretos e mensuráveis.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="partners-section bg-slate-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-4xl font-bold text-center text-slate-900 mb-12">
            Quem já transforma a educação com a gente
          </h2>
          <div className="partners-grid grid md:grid-cols-5 gap-8">
            <Card className="partner-logo p-6 text-center hover:shadow-lg transition-shadow">
              <School className="w-12 h-12 text-brand-primary mx-auto mb-2" />
              <span className="text-slate-700 font-medium">Colégio Exemplo</span>
            </Card>
            <Card className="partner-logo p-6 text-center hover:shadow-lg transition-shadow">
              <GraduationCap className="w-12 h-12 text-brand-primary mx-auto mb-2" />
              <span className="text-slate-700 font-medium">Escola Nacional</span>
            </Card>
            <Card className="partner-logo p-6 text-center hover:shadow-lg transition-shadow">
              <BookOpen className="w-12 h-12 text-brand-primary mx-auto mb-2" />
              <span className="text-slate-700 font-medium">Instituto Educacional</span>
            </Card>
            <Card className="partner-logo p-6 text-center hover:shadow-lg transition-shadow">
              <Users className="w-12 h-12 text-brand-primary mx-auto mb-2" />
              <span className="text-slate-700 font-medium">Colégio Avançado</span>
            </Card>
            <Card className="partner-logo p-6 text-center hover:shadow-lg transition-shadow">
              <School className="w-12 h-12 text-brand-primary mx-auto mb-2" />
              <span className="text-slate-700 font-medium">Rede de Ensino</span>
            </Card>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="comparison-section bg-white py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="section-title text-4xl font-bold text-center text-slate-900 mb-4">
            Por que escolher o Escrita360?
          </h2>
          <p className="section-subtitle text-xl text-center text-slate-600 mb-12">
            Veja como nos diferenciamos de outras plataformas de redação
          </p>
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="comparison-table w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4 font-bold text-slate-900">Recursos</th>
                        <th className="text-center p-4">
                          <img src={logo} alt="Escrita360" className="h-8 mx-auto" />
                        </th>
                        <th className="text-center p-4 font-bold text-slate-600">Outras Plataformas</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        'Escrita Autorregulada',
                        'Painel de Sentimentos',
                        'Rubricas Autoavaliativas',
                        'Processo Completo de Escrita',
                        'IA como Apoio (não substituição)',
                        'Dashboard para Escolas',
                        'Alinhamento com BNCC'
                      ].map((feature, index) => (
                        <tr key={index} className="border-b last:border-b-0 hover:bg-slate-50">
                          <td className="p-4 text-slate-700">{feature}</td>
                          <td className="p-4 text-center">
                            <Check className="w-6 h-6 text-green-600 mx-auto" />
                          </td>
                          <td className="p-4 text-center">
                            {index === 2 || index === 5 ? (
                              <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center mx-auto">
                                <span className="text-white text-xs">-</span>
                              </div>
                            ) : (
                              <X className="w-6 h-6 text-red-500 mx-auto" />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Platform Summary Section */}
      <section className="platform-summary bg-brand-light py-8 md:py-12 lg:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="summary-content text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-6">O Escrita360 oferece muito mais que uma correção</h2>
            <p className="text-lg md:text-xl text-slate-700 leading-relaxed">
              É uma jornada completa de escrita autorregulada, que garante ao aluno autonomia e evolução. Ao professor, recursos para otimizar o tempo, avaliar com clareza e acompanhar o progresso de cada estudante. À escola, Dashboards personalizados que auxiliam no acompanhamento do desenvolvimento da produção escrita dos alunos e preparação para a redação do ENEM.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta bg-slate-900 py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="cta-content text-center max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Transforme o Ensino de Redação em sua Escola</h2>
            <p className="text-lg md:text-xl mb-8 leading-relaxed text-slate-200">
              Junte-se a mais de 500 professores que já revolucionaram suas aulas com nossa metodologia
            </p>
            <div className="cta-benefits flex flex-wrap justify-center gap-6 mb-8">
              <div className="cta-benefit flex items-center gap-2 text-white">
                <Trophy className="w-6 h-6 text-brand-primary" />
                <span>Implementação em 24h</span>
              </div>
              <div className="cta-benefit flex items-center gap-2 text-white">
                <Users className="w-6 h-6 text-brand-primary" />
                <span>Treinamento incluído</span>
              </div>
              <div className="cta-benefit flex items-center gap-2 text-white">
                <Heart className="w-6 h-6 text-brand-primary" />
                <span>Suporte pedagógico</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home