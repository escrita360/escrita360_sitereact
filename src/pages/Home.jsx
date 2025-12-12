import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent } from '@/components/ui/card.jsx'
import { Check, X, PenTool, Brain, TrendingUp, GraduationCap, School, Edit, FileText, CheckCircle, Bot, RotateCcw, Trophy, Heart, Target, BarChart, Users, UserCheck, BookOpen, Award, Cloud, Clock } from 'lucide-react'
import { useScrollAnimation } from '@/hooks/use-scroll-animation.js'
import Pessoas from '@/assets/Cards/cardpessoas_colorido.svg'
import card1 from '@/assets/Cards/card1.0.svg'
import escritaAutoregulada from '@/assets/Cards/escrita_autoregulada.png'
import imersaoTotal from '@/assets/Cards/imersao_total.png'
import painelSentimentos from '@/assets/Cards/painel_sentimentos.png'
import usoRubricas from '@/assets/Cards/card5.1.svg'
import iaAssistente from '@/assets/Cards/ia_assistente.png'

function Home() {
  const heroRef = useScrollAnimation()
  const statsRef = useScrollAnimation()
  const aboutRef = useScrollAnimation()

  return (
    <div>
      {/* Hero Section */}
      <section ref={heroRef} className="hero bg-white animate-on-scroll min-h-screen flex items-center -mt-20 pt-20">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid lg:grid-cols-2 items-center gap-8">
            <div className="hero-content animate-fade-in-left text-center lg:text-left">
              <h1 className="text-lg md:text-xl lg:text-2xl xl:text-3xl mb-4 leading-none text-center bg-gradient-to-r from-[#1d5a91] to-[#3b82f6] bg-clip-text text-transparent">
                <span className="font-normal">Inovamos para oferecer a plataforma mais completa </span>
                <span className="font-bold">para o desenvolvimento da escrita, </span>
                <span className="font-normal">unindo </span>
                <span className="font-normal">autorregulação e inteligência artificial.</span>
              </h1>
              <p className="hero-description text-base md:text-lg text-slate-600 mb-2 leading-relaxed text-center">
                Revisão como apoio, não como atalho, respeitando o processo de aprendizagem. A correção complementar com Inteligência Artificial valoriza o processo de reescrita e garante que o aprendizado esteja no centro da experiência.
              </p>
              <div className="hero-stats flex flex-wrap gap-4 justify-center mt-8">
                <div className="stat bg-white rounded-xl shadow-md border border-slate-100 px-6 py-4 text-center hover:shadow-lg hover:border-[#2b7475]/20 transition-all duration-300">
                  <strong className="block font-bold text-base mb-2" style={{ color: '#2b7475' }}>Processo</strong>
                  <span className="text-slate-900 text-xs">Autorregulado</span>
                </div>
                <div className="stat bg-white rounded-xl shadow-md border border-slate-100 px-6 py-4 text-center hover:shadow-lg hover:border-[#2b7475]/20 transition-all duration-300">
                  <strong className="block font-bold text-base mb-2" style={{ color: '#2b7475' }}>IA</strong>
                  <span className="text-slate-900 text-xs">Complementar</span>
                </div>
                <div className="stat bg-white rounded-xl shadow-md border border-slate-100 px-6 py-4 text-center hover:shadow-lg hover:border-[#2b7475]/20 transition-all duration-300">
                  <strong className="block font-bold text-base mb-2" style={{ color: '#2b7475' }}>Foco</strong>
                  <span className="text-slate-900 text-xs">Aprendizagem</span>
                </div>
              </div>
            </div>
            <div className="hero-image flex justify-center">
                <img 
                  src={Pessoas} 
                  alt="Plataforma Escrita360" 
                  className="w-full h-auto lg:scale-105"
                />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="stats bg-slate-50 py-8 md:py-12 lg:py-16 animate-on-scroll">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="section-title text-2xl md:text-3xl lg:text-4xl font-bold text-center text-slate-900 mb-8 md:mb-12 animate-fade-in-up">
            Para Quem é o Escrita360?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            <Card className="p-6 hover-lift border-brand-accent/30 animate-fade-in-up delay-100 flex flex-col h-full">
              <CardContent className="pt-4 text-center flex flex-col justify-between h-full">
                <div>
                  <GraduationCap className="w-12 h-12 text-brand-primary mx-auto mb-4 animate-pulse-glow" />
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Estudantes</h3>
                  <p className="text-slate-700 leading-relaxed mb-4 text-sm">
                    <strong style={{ color: '#2b7475' }}>Ideal para quem quer desenvolver habilidades de escrita exigidas pela escola, pelo ENEM e pelas competências do século XXI.</strong> Aqui, o aluno vivencia uma imersão autorregulada, em que pode escrever, reescrever e analisar, com análises ilimitadas e insights inteligentes. A IA atua como assistente de escrita, ajudando a aprimorar argumentos, estrutura e linguagem.
                  </p>
                </div>
                <p className="text-slate-700 font-bold text-sm mt-auto">
                  Mais do que corrigir, é aprender a escrever.
                </p>
              </CardContent>
            </Card>
            
            <Card className="p-6 hover-lift border-brand-accent/30 animate-fade-in-up delay-200 flex flex-col h-full">
              <CardContent className="pt-4 text-center flex flex-col justify-between h-full">
                <div>
                  <Users className="w-12 h-12 text-brand-primary mx-auto mb-4 animate-pulse-glow" />
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Professores</h3>
                  <p className="text-slate-700 leading-relaxed mb-4 text-sm">
                    <strong style={{ color: '#2b7475' }}>Pensado para educadores que atuam em cursos preparatórios ou plataformas online, o Escrita360 otimiza o tempo de correção e amplia o alcance do ensino de redação.</strong> Com relatórios automáticos e acompanhamento por versão, o professor foca no que importa: orientar o aprendizado.
                  </p>
                </div>
                <p className="text-slate-700 font-bold text-sm mt-auto">
                  Mais produtividade para o professor, mais aprendizado para o aluno.
                </p>
              </CardContent>
            </Card>
            
            <Card className="p-6 hover-lift border-brand-accent/30 animate-fade-in-up delay-300 flex flex-col h-full">
              <CardContent className="pt-4 text-center flex flex-col justify-between h-full">
                <div>
                  <School className="w-12 h-12 text-brand-primary mx-auto mb-4 animate-pulse-glow" />
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Escolas</h3>
                  <p className="text-slate-700 leading-relaxed mb-4 text-sm">
                    <strong style={{ color: '#2b7475' }}>Plataforma completa para integrar a escrita autoral ao currículo, desenvolvendo autonomia e autorregulação nos alunos.</strong> Permite acompanhar turmas em tempo real, gerar relatórios personalizados e promover práticas de escrita formativas em larga escala.
                  </p>
                </div>
                <p className="text-slate-700 font-bold text-sm mt-auto">
                  Ideal para redações escolares e preparatórios para o ENEM.
                </p>
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
            O <span className="font-bold text-brand-primary">Escrita360</span> é uma plataforma completa de escrita autorregulada e (auto)avaliação com Inteligência Artificial. Desenvolvida para estudantes, professores e escolas, ela potencializa o desenvolvimento da escrita em todas as etapas do processo.
Com soluções inovadoras, o Escrita360 engaja os estudantes na construção consciente do texto e oferece aos professores recursos inteligentes para orientar, acompanhar e avaliar as produções de forma criteriosa, eficiente e personalizada.

          </p>
          </div>
        </div>
      </section>

      {/* Differential Section */}
      <section className="differential bg-white py-8 md:py-12 lg:py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="section-header text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-4" style={{ marginTop: '20px' }}>Conheça os nossos benefícios</h2>
            <p className="text-lg md:text-xl text-slate-600 font-bold">Por que levar a Plataforma Escrita360 para a sua escola?</p>
          </div>
          <div className="differential-content space-y-8">
            {/* Plataforma Escrita360 */}
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="order-2 lg:order-1">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Plataforma Escrita360</h3>
                <p className="text-lg text-slate-700 leading-relaxed">
                  A plataforma Escrita360 é um laboratório virtual, que transforma o aprendizado da escrita em uma experiência autorregulada e formativa. Permite ao usuário escrever, revisar, reescrever e analisar seus textos, por meio de recursos inteligentes de análise e geração de insights que favorecem a melhoria contínua e o desenvolvimento de competências linguísticas, argumentativas, críticas e criativas dos estudantes.
                </p>
              </div>
              <div className="order-1 lg:order-2 flex items-center justify-center">
                <img src={card1} alt="Plataforma Escrita360" className="w-full max-w-md h-auto" />
              </div>
            </div>

            {/* Escrita Autorregulada no Centro */}
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="flex items-center justify-center">
                <img src={escritaAutoregulada} alt="Escrita Autorregulada no Centro" className="w-full max-w-md h-auto rounded-lg" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Escrita Autorregulada no Centro</h3>
                <p className="text-lg text-slate-700 leading-relaxed">
                  Diferente de plataformas que apenas corrigem textos prontos, a Escrita360 coloca a autorregulação como eixo principal. O estudante vivencia todo o processo de escrita, do planejamento à autoavaliação, em uma experiência imersiva, construída por meio de rascunhos, revisões e reescritas, que transforma a redação em um percurso formativo e contínuo.
                </p>
              </div>
            </div>

            {/* Imersão total com Análise Integrada */}
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="order-2 lg:order-1">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Imersão total com Análise Integrada em Tempo Real</h3>
                <p className="text-lg text-slate-700 leading-relaxed">
                  O módulo de escrita imersivo introduz o uso de parágrafo-padrão como ponto de partida para organizar ideias, estruturar argumentos e escrever com clareza e segurança. A plataforma oferece recursos essenciais para análises automáticas e ilimitadas (estrutura, fluidez, coesão textual -referencial e sequencial), frequência de palavras, equilíbrio entre tamanhos de frases e parágrafos e consistência geral do texto. Essa prática busca estimular o aluno a escrever, analisar e reescrever, a fim de desenvolver a autonomia e a consciência sobre o próprio processo de escrita.
                </p>
              </div>
              <div className="order-1 lg:order-2 flex items-center justify-center">
                <img src={imersaoTotal} alt="Imersão total com Análise Integrada em Tempo Real" className="w-full max-w-md h-auto rounded-lg" />
              </div>
            </div>

            {/* Painel de Sentimentos */}
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="flex items-center justify-center">
                <img src={painelSentimentos} alt="Painel de Sentimentos" className="w-full max-w-md h-auto rounded-lg" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Painel de Sentimentos</h3>
                <p className="text-lg text-slate-700 leading-relaxed">
                  Recurso voltado ao desenvolvimento integral do aluno, estimulando a autorregulação emocional durante o processo de escrita. Ele auxilia o estudante a compreender e gerenciar suas emoções, crenças e atitudes diante da produção textual, fortalecendo a confiança e o engajamento. Ao refletir sobre como se sente ao escrever, o aluno aprende a lidar com desafios, aprimora o foco e desenvolve autonomia, pensamento crítico, criatividade e autoconfiança, pilares essenciais para a escola, o ENEM e as demandas do século XXI.
                </p>
              </div>
            </div>

            {/* Uso de rubricas e evolução por níveis */}
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="order-2 lg:order-1">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Uso de rubricas e evolução por níveis</h3>
                <p className="text-lg text-slate-700 leading-relaxed">
                  Oferece rubricas autoavaliativas e monitoramento contínuo do desempenho, com gráficos e dados qualitativos alinhados às habilidades da BNCC e às competências do ENEM, auxiliando o estudante a identificar dificuldades e acompanhar sua evolução na escrita.
                </p>
              </div>
              <div className="order-1 lg:order-2 flex items-center justify-center">
                <img src={usoRubricas} alt="Uso de rubricas e evolução por níveis" className="w-full max-w-md h-auto rounded-lg" />
              </div>
            </div>

            {/* IA como Assistente */}
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="flex items-center justify-center">
                <img src={iaAssistente} alt="IA como Assistente" className="w-full max-w-md h-auto rounded-lg" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">IA como Assistente</h3>
                <p className="text-lg text-slate-700 leading-relaxed">
                  A tecnologia atua como uma camada complementar após a autoavaliação realizada pelo estudante, oferecendo feedback ao final do processo, para potencializar reescritas, sem comprometer a autonomia do estudante e o papel mediador do professor.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works bg-white py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <h3 className="text-center mb-20 text-2xl md:text-3xl text-slate-900">
            O Escrita360 surge como uma solução inovadora que transforma a redação em uma jornada formativa. Aqui, você aprende a escrever de verdade.
          </h3>
          <h3 className="text-center mb-20 text-2xl md:text-3xl text-brand-primary font-bold">
            Escreva. Reescreva. Evolua.
          </h3>
          <div className="process-emphasis">
            <h4 className="text-center mb-20 font-bold text-xl md:text-2xl text-slate-900">
              Escrita360: inteligência e autoria caminhando juntas.
            </h4>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home