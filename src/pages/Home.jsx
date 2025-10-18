import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent } from '@/components/ui/card.jsx'
import { Check, X, PenTool, Brain, TrendingUp, GraduationCap, School, Edit, FileText, CheckCircle, Bot, RotateCcw, Trophy, Heart, Target, BarChart, Users, UserCheck, BookOpen, Award } from 'lucide-react'

function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero bg-gradient-to-br from-brand-lighter to-white py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="hero-content">
              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                A Inteligência Artificial e Inovação potencializando o Aprendizado da Escrita
              </h1>
              <h2 className="hero-subtitle text-lg md:text-xl text-slate-600 mb-8">
                Plataforma adaptativa de escrita autorregulada e avaliação inteligente
              </h2>
              <div className="hero-buttons">
                <Button size="lg" className="bg-brand-primary hover:bg-brand-secondary text-white px-6 md:px-8 py-4 md:py-6 text-base md:text-lg shadow-lg hover:shadow-xl transition-all">
                  Entre em contato
                </Button>
              </div>
            </div>
            <div className="hero-image flex justify-center">
              <Card className="p-8 shadow-2xl bg-white/80 backdrop-blur-sm border-brand-accent">
                <div className="flex gap-8 items-center justify-center">
                  <Edit className="w-16 h-16 text-brand-primary" />
                  <Brain className="w-16 h-16 text-brand-secondary" />
                  <TrendingUp className="w-16 h-16 text-brand-accent" />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats bg-brand-light py-8 md:py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-2xl md:text-3xl lg:text-4xl font-bold text-center text-slate-900 mb-8 md:mb-12">
            Eficiência educacional na prática
          </h2>
          <div className="stats-grid grid md:grid-cols-4 gap-8">
            <Card className="stat-item text-center p-6 hover:shadow-lg transition-all hover:-translate-y-1 border-brand-accent/30">
              <CardContent className="pt-6">
                <Edit className="w-12 h-12 text-brand-primary mx-auto mb-4" />
                <div className="stat-number text-4xl font-bold text-brand-primary mb-2 counter" data-target="50">0</div>
                <div className="stat-label text-sm text-slate-600 mb-2">Mil+</div>
                <p className="stat-description text-slate-700">Redações corrigidas com autorregulação</p>
              </CardContent>
            </Card>
            <Card className="stat-item text-center p-6 hover:shadow-lg transition-all hover:-translate-y-1 border-brand-accent/30">
              <CardContent className="pt-6">
                <School className="w-12 h-12 text-brand-secondary mx-auto mb-4" />
                <div className="stat-number text-4xl font-bold text-brand-secondary mb-2 counter" data-target="200">0</div>
                <div className="stat-label text-sm text-slate-600 mb-2">+</div>
                <p className="stat-description text-slate-700">Instituições públicas e privadas</p>
              </CardContent>
            </Card>
            <Card className="stat-item text-center p-6 hover:shadow-lg transition-all hover:-translate-y-1 border-brand-accent/30">
              <CardContent className="pt-6">
                <GraduationCap className="w-12 h-12 text-brand-primary mx-auto mb-4" />
                <div className="stat-number text-4xl font-bold text-brand-primary mb-2 counter" data-target="15">0</div>
                <div className="stat-label text-sm text-slate-600 mb-2">Mil+</div>
                <p className="stat-description text-slate-700">Estudantes desenvolvendo autonomia</p>
              </CardContent>
            </Card>
            <Card className="stat-item text-center p-6 hover:shadow-lg transition-all hover:-translate-y-1 border-brand-accent/30">
              <CardContent className="pt-6">
                <TrendingUp className="w-12 h-12 text-brand-secondary mx-auto mb-4" />
                <div className="stat-number text-4xl font-bold text-brand-secondary mb-2">+25%</div>
                <div className="stat-label text-sm text-slate-600 mb-2"></div>
                <p className="stat-description text-slate-700">De melhoria na escrita em poucos meses</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-platform container mx-auto px-4 py-8 md:py-12 lg:py-16">
        <div className="max-w-4xl mx-auto text-center">
          <p className="about-text text-lg text-slate-700 leading-relaxed">
            O <span className="font-bold text-brand-primary">Escrita360</span> é a plataforma mais completa de escrita autorregulada e avaliação inteligente,
            projetada para levar estudantes, professores e escolas para o próximo nível com Inteligência Artificial.
            Com soluções inovadoras e tecnologia de ponta, oferecemos uma experiência educacional única, que engaja
            os estudantes na jornada completa de desenvolvimento da escrita, empodera professores com dados valiosos
            e oferece às escolas dashboards completos para gestão pedagógica, promovendo a aprendizagem significativa
            que impulsiona o sucesso acadêmico.
          </p>
        </div>
      </section>

      {/* Platforms Section */}
      <section className="platforms-section bg-brand-lighter py-8 md:py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-2xl md:text-3xl lg:text-4xl font-bold text-center text-slate-900 mb-8 md:mb-12">
            Conheça nossas Plataformas
          </h2>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <Card className="platform-card platform-left p-6 md:p-8 hover:shadow-lg transition-all hover:-translate-y-1 border-brand-accent/30">
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 mb-6">
                <div className="platform-image w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mx-auto md:mx-0">
                  <UserCheck className="w-8 h-8 text-brand-primary" />
                </div>
                <div className="platform-content text-center md:text-left">
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">Estudantes</h3>
                  <p className="text-slate-700 text-sm md:text-base">
                    Os estudantes desenvolvem autonomia na escrita de forma estruturada e personalizada,
                    vivenciando todo o processo de planejamento, escrita, autoavaliação e reescrita com
                    recursos que promovem autorregulação e senso crítico.
                  </p>
                  <Button variant="outline" className="mt-4">Acesse a Plataforma</Button>
                </div>
              </div>
            </Card>

            <Card className="platform-card platform-right p-6 md:p-8 hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 mb-6">
                <div className="platform-content text-center md:text-left">
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">Professores</h3>
                  <p className="text-slate-700 text-sm md:text-base">
                    Professores ganham tempo com recursos valiosos para a gestão de turmas, criação de
                    atividades personalizadas e acompanhamento individual, baseadas nas competências do ENEM
                    e alinhadas à BNCC.
                  </p>
                  <Button variant="outline" className="mt-4">Acesse a Plataforma</Button>
                </div>
                <div className="platform-image w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mx-auto md:mx-0">
                  <UserCheck className="w-8 h-8 text-brand-secondary" />
                </div>
              </div>
            </Card>

            <Card className="platform-card platform-left p-6 md:p-8 hover:shadow-lg transition-all hover:-translate-y-1 border-brand-accent/30">
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 mb-6">
                <div className="platform-image w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mx-auto md:mx-0">
                  <Users className="w-8 h-8 text-brand-primary" />
                </div>
                <div className="platform-content text-center md:text-left">
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">Famílias</h3>
                  <p className="text-slate-700 text-sm md:text-base">
                    As famílias acompanham o desempenho dos estudantes, a proficiência de aprendizagem
                    e o engajamento em tempo real através de dashboards intuitivos e relatórios detalhados.
                  </p>
                  <Button variant="outline" className="mt-4 border-brand-primary text-brand-primary hover:bg-brand-light">Acesse a Plataforma</Button>
                </div>
              </div>
            </Card>

            <Card className="platform-card platform-right p-6 md:p-8 hover:shadow-lg transition-all hover:-translate-y-1 border-brand-accent/30">
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 mb-6">
                <div className="platform-content text-center md:text-left">
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">Escolas e Gestores</h3>
                  <p className="text-slate-700 text-sm md:text-base">
                    A plataforma dos gestores oferece flexibilização curricular e relatórios em tempo real,
                    para uma gestão eficaz do engajamento e aprendizagem dos seus estudantes, turmas e escolas.
                  </p>
                  <Button variant="outline" className="mt-4 border-brand-primary text-brand-primary hover:bg-brand-light">Acesso Exclusivo - Consulte seu Login</Button>
                </div>
                <div className="platform-image w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mx-auto md:mx-0">
                  <School className="w-8 h-8 text-brand-secondary" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Diferencial Section */}
      <section className="diferencial py-8 md:py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-slate-900 mb-8 md:mb-12">O que nos torna únicos</h2>
          <div className="diferencial-grid grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="diferencial-item p-6 hover:shadow-lg transition-all hover:-translate-y-1 border-brand-accent/20">
              <div className="diferencial-icon w-12 h-12 bg-brand-light rounded-full flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-brand-primary" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Escrita Autorregulada no Centro</h3>
              <p className="text-slate-700">
                Diferente de plataformas que apenas corrigem textos prontos, colocamos a autorregulação como eixo principal.
                O estudante vivencia todo o processo de escrita.
              </p>
            </Card>

            <Card className="diferencial-item p-6 hover:shadow-lg transition-all hover:-translate-y-1 border-brand-accent/20">
              <div className="diferencial-icon w-12 h-12 bg-brand-light rounded-full flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-brand-secondary" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Painel de Sentimentos</h3>
              <p className="text-slate-700">
                Recurso voltado ao acompanhamento das competências socioemocionais no processo de escrita.
                Auxilia na regulação de crenças cognitivas.
              </p>
            </Card>

            <Card className="diferencial-item p-6 hover:shadow-lg transition-all hover:-translate-y-1 border-brand-accent/20">
              <div className="diferencial-icon w-12 h-12 bg-brand-light rounded-full flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-brand-primary" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Imersão Total no Processo de Escrita</h3>
              <p className="text-slate-700">
                Imersão total no processo de escrita com análises automatizadas: introduz o uso do parágrafo-padrão,
                ajudando a organizar ideias.
              </p>
            </Card>

            <Card className="diferencial-item p-6 hover:shadow-lg transition-all hover:-translate-y-1 border-brand-accent/20">
              <div className="diferencial-icon w-12 h-12 bg-brand-light rounded-full flex items-center justify-center mb-4">
                <BarChart className="w-6 h-6 text-brand-secondary" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Análise Integrada em Tempo Real</h3>
              <p className="text-slate-700">
                Conta com feedbacks e análises mediadas por diferentes recursos de análise textual,
                de forma rápida e consistente.
              </p>
            </Card>

            <Card className="diferencial-item p-6 hover:shadow-lg transition-all hover:-translate-y-1 border-brand-accent/20">
              <div className="diferencial-icon w-12 h-12 bg-brand-light rounded-full flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-brand-primary" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Uso de rubricas e evolução por níveis</h3>
              <p className="text-slate-700">
                Oferece rubricas autoavaliativas e monitoramento contínuo do desempenho, com gráficos e dados
                qualitativos alinhados às habilidades da BNCC.
              </p>
            </Card>

            <Card className="diferencial-item p-6 hover:shadow-lg transition-all hover:-translate-y-1 border-brand-accent/20">
              <div className="diferencial-icon w-12 h-12 bg-brand-light rounded-full flex items-center justify-center mb-4">
                <Bot className="w-6 h-6 text-brand-secondary" />
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
      <section className="features-section bg-brand-light py-8 md:py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-2xl md:text-3xl lg:text-4xl font-bold text-center text-slate-900 mb-4">
            Recursos que Transformam o Aprendizado
          </h2>
          <p className="section-subtitle text-lg md:text-xl text-center text-slate-600 mb-8 md:mb-12">
            Ferramentas desenvolvidas com base em pesquisas pedagógicas e tecnologia de ponta
          </p>
          <div className="features-grid grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="feature-card p-6 hover:shadow-lg transition-all hover:-translate-y-1 border-brand-accent/20">
              <div className="feature-icon-wrapper w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mb-4 mx-auto">
                <Edit className="w-8 h-8 text-brand-primary" />
              </div>
              <h3 className="text-xl font-bold text-center text-slate-900 mb-2">Editor Inteligente</h3>
              <p className="text-slate-700 text-center mb-4">
                Escreva com recursos de formatação profissional e sugestões em tempo real que respeitam seu processo criativo.
              </p>
              <a href="#" className="feature-link text-brand-primary hover:text-brand-secondary font-medium flex items-center justify-center gap-2">
                Saiba mais <TrendingUp className="w-4 h-4" />
              </a>
            </Card>

            <Card className="feature-card p-6 hover:shadow-lg transition-all hover:-translate-y-1 border-brand-accent/20">
              <div className="feature-icon-wrapper w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mb-4 mx-auto">
                <FileText className="w-8 h-8 text-brand-secondary" />
              </div>
              <h3 className="text-xl font-bold text-center text-slate-900 mb-2">Rubricas Personalizadas</h3>
              <p className="text-slate-700 text-center mb-4">
                Avalie seu texto com critérios claros e objetivos baseados nas competências do ENEM e vestibulares.
              </p>
              <a href="#" className="feature-link text-brand-primary hover:text-brand-secondary font-medium flex items-center justify-center gap-2">
                Saiba mais <TrendingUp className="w-4 h-4" />
              </a>
            </Card>

            <Card className="feature-card p-6 hover:shadow-lg transition-all hover:-translate-y-1 border-brand-accent/20">
              <div className="feature-icon-wrapper w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mb-4 mx-auto">
                <BarChart className="w-8 h-8 text-brand-primary" />
              </div>
              <h3 className="text-xl font-bold text-center text-slate-900 mb-2">Dashboard Completo</h3>
              <p className="text-slate-700 text-center mb-4">
                Acompanhe sua evolução com gráficos detalhados e relatórios de desempenho por competência.
              </p>
              <a href="#" className="feature-link text-brand-primary hover:text-brand-secondary font-medium flex items-center justify-center gap-2">
                Saiba mais <TrendingUp className="w-4 h-4" />
              </a>
            </Card>

            <Card className="feature-card p-6 hover:shadow-lg transition-all hover:-translate-y-1 border-brand-accent/20">
              <div className="feature-icon-wrapper w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mb-4 mx-auto">
                <Users className="w-8 h-8 text-brand-secondary" />
              </div>
              <h3 className="text-xl font-bold text-center text-slate-900 mb-2">Gestão Escolar</h3>
              <p className="text-slate-700 text-center mb-4">
                Ferramentas completas para professores acompanharem turmas e instituições gerenciarem dados educacionais.
              </p>
              <a href="#" className="feature-link text-brand-primary hover:text-brand-secondary font-medium flex items-center justify-center gap-2">
                Saiba mais <TrendingUp className="w-4 h-4" />
              </a>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works py-16">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-4xl font-bold text-center text-slate-900 mb-4">
            Como Funciona o Escrita360
          </h2>
          <p className="section-subtitle text-xl text-center text-slate-600 mb-12">
            Um processo simples que respeita sua autonomia
          </p>
          <div className="steps-grid grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="step-item p-6 text-center hover:shadow-lg transition-shadow">
              <div className="step-number w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">1</div>
              <div className="step-icon w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <PenTool className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Planejamento</h3>
              <p className="text-slate-700">
                Organize suas ideias e estruture seu texto com ferramentas de planejamento que facilitam o processo criativo.
              </p>
            </Card>

            <Card className="step-item p-6 text-center hover:shadow-lg transition-shadow">
              <div className="step-number w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">2</div>
              <div className="step-icon w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Edit className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Escrita</h3>
              <p className="text-slate-700">
                Escreva seu texto no editor inteligente com suporte ao parágrafo-padrão e recursos de formatação profissional.
              </p>
            </Card>

            <Card className="step-item p-6 text-center hover:shadow-lg transition-shadow">
              <div className="step-number w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">3</div>
              <div className="step-icon w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Autoavaliação</h3>
              <p className="text-slate-700">
                Revise seu texto usando rubricas estruturadas e desenvolva senso crítico sobre sua própria escrita.
              </p>
            </Card>

            <Card className="step-item p-6 text-center hover:shadow-lg transition-shadow">
              <div className="step-number w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">4</div>
              <div className="step-icon w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Bot className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Feedback IA</h3>
              <p className="text-slate-700">
                Receba análise complementar da inteligência artificial com sugestões de melhoria específicas e construtivas.
              </p>
            </Card>

            <Card className="step-item p-6 text-center hover:shadow-lg transition-shadow">
              <div className="step-number w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">5</div>
              <div className="step-icon w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <RotateCcw className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Reescrita</h3>
              <p className="text-slate-700">
                Aplique as melhorias identificadas e desenvolva autonomia no processo de revisão e aperfeiçoamento textual.
              </p>
            </Card>

            <Card className="step-item p-6 text-center hover:shadow-lg transition-shadow">
              <div className="step-number w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">6</div>
              <div className="step-icon w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Trophy className="w-8 h-8 text-blue-600" />
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
              <School className="w-12 h-12 text-blue-600 mx-auto mb-2" />
              <span className="text-slate-700 font-medium">Colégio Exemplo</span>
            </Card>
            <Card className="partner-logo p-6 text-center hover:shadow-lg transition-shadow">
              <GraduationCap className="w-12 h-12 text-blue-600 mx-auto mb-2" />
              <span className="text-slate-700 font-medium">Escola Nacional</span>
            </Card>
            <Card className="partner-logo p-6 text-center hover:shadow-lg transition-shadow">
              <BookOpen className="w-12 h-12 text-blue-600 mx-auto mb-2" />
              <span className="text-slate-700 font-medium">Instituto Educacional</span>
            </Card>
            <Card className="partner-logo p-6 text-center hover:shadow-lg transition-shadow">
              <Users className="w-12 h-12 text-blue-600 mx-auto mb-2" />
              <span className="text-slate-700 font-medium">Colégio Avançado</span>
            </Card>
            <Card className="partner-logo p-6 text-center hover:shadow-lg transition-shadow">
              <School className="w-12 h-12 text-blue-600 mx-auto mb-2" />
              <span className="text-slate-700 font-medium">Rede de Ensino</span>
            </Card>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="comparison-section py-16">
        <div className="container mx-auto px-4">
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
                        <th className="text-center p-4 font-bold text-blue-600">Escrita360</th>
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

      {/* CTA Section */}
      <section className="cta bg-gradient-to-r from-blue-600 to-blue-800 py-16">
        <div className="container mx-auto px-4">
          <div className="cta-content text-center text-white max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">Escrita360: muito além da correção automática</h2>
            <p className="text-xl mb-6 leading-relaxed">
              Uma jornada completa de escrita autorregulada que garante autonomia e evolução ao aluno, oferece recursos que otimizam o tempo do professor e disponibiliza dashboards personalizados para a escola, alinhados à preparação para o ENEM.
            </p>
            <p className="text-lg mb-8 leading-relaxed">
              A plataforma valoriza o processo formativo de escrever, revisar e reescrever. A IA atua apenas na etapa final, como suporte complementar, fortalecendo o aprendizado e não substituindo o percurso formativo.
            </p>
            <div className="cta-buttons">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-slate-100 px-8 py-6 text-lg font-semibold">
                Agendar Demonstração
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home