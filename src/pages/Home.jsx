import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent } from '@/components/ui/card.jsx'
import { Check, X, PenTool, Brain, TrendingUp, GraduationCap, School, Edit, FileText, CheckCircle, Bot, RotateCcw, Trophy, Heart, Target, BarChart, Users, UserCheck, BookOpen, Award, Cloud, Clock } from 'lucide-react'
import { useScrollAnimation } from '@/hooks/use-scroll-animation.js'
import notebook from '@/assets/notebook.svg'
import card1 from '@/assets/card1.0.svg'
import card2 from '@/assets/card2.0.svg'
import card3 from '@/assets/card3.0.svg'
import card4 from '@/assets/card4.0.svg'
import card5 from '@/assets/card5.0.svg'
import card6 from '@/assets/card6.0.svg'

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
              <h1 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl mb-4 leading-none text-center">
                <span style={{ color: '#2b7475', fontWeight: 'normal' }}>Inovamos para oferecer a plataforma mais completa </span>
                <span style={{ color: '#569e9d', fontWeight: 'bold' }}>para o desenvolvimento da escrita, </span>
                <span style={{ color: '#569e9d', fontWeight: 'normal' }}>unindo </span>
                <span style={{ color: '#659bb3', fontWeight: 'normal' }}>autorregulação e inteligência artificial.</span>
              </h1>
              <p className="hero-description text-lg md:text-xl text-slate-600 mb-2 leading-relaxed text-center">
                Revisão como apoio, não como atalho, respeitando o processo de aprendizagem. A correção complementar com Inteligência Artificial valoriza o processo de reescrita e garante que o aprendizado esteja no centro da experiência.
              </p>
              <div className="hero-stats flex gap-8 justify-center mt-8">
                <div className="stat text-center">
                  <strong className="block font-bold" style={{ color: '#2b7475' }}>Processo</strong>
                  <span className="text-slate-600">Autorregulado</span>
                </div>
                <div className="stat text-center">
                  <strong className="block font-bold" style={{ color: '#2b7475' }}>IA</strong>
                  <span className="text-slate-600">Complementar</span>
                </div>
                <div className="stat text-center">
                  <strong className="block font-bold" style={{ color: '#2b7475' }}>Foco</strong>
                  <span className="text-slate-600">Aprendizagem</span>
                </div>
              </div>
            </div>
            <div className="hero-image flex justify-center">
                <img 
                  src={notebook} 
                  alt="Plataforma Escrita360" 
                  className="w-full h-auto"
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
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 hover-lift border-brand-accent/30 animate-fade-in-up delay-100 aspect-square flex flex-col">
              <CardContent className="pt-4 text-center flex flex-col justify-center h-full">
                <GraduationCap className="w-12 h-12 text-brand-primary mx-auto mb-4 animate-pulse-glow" />
                <h3 className="text-xl font-bold text-slate-900 mb-3">Estudantes</h3>
                <p className="text-slate-700 leading-relaxed mb-4">
                  <strong style={{ color: '#2b7475' }}>Ideal para quem quer desenvolver habilidades de escrita exigidas pela escola, pelo ENEM e pelas competências do século XXI.</strong> Aqui, o aluno vivencia uma imersão autorregulada, em que pode escrever, reescrever e analisar, com análises ilimitadas e insights inteligentes. A IA atua como assistente de escrita, ajudando a aprimorar argumentos, estrutura e linguagem.
                </p>
                <p className="text-slate-700 font-bold">
                  Mais do que corrigir, é aprender a escrever.
                </p>
              </CardContent>
            </Card>
            
            <Card className="p-6 hover-lift border-brand-accent/30 animate-fade-in-up delay-200 aspect-square flex flex-col">
              <CardContent className="pt-4 text-center flex flex-col justify-center h-full">
                <Users className="w-12 h-12 text-brand-primary mx-auto mb-4 animate-pulse-glow" />
                <h3 className="text-xl font-bold text-slate-900 mb-3">Professores</h3>
                <p className="text-slate-700 leading-relaxed mb-4">
                  <strong style={{ color: '#2b7475' }}>Pensado para educadores que atuam em cursos preparatórios ou plataformas online, o Escrita360 otimiza o tempo de correção e amplia o alcance do ensino de redação.</strong> Com relatórios automáticos e acompanhamento por versão, o professor foca no que importa: orientar o aprendizado.
                </p>
                <p className="text-slate-700 font-bold">
                  Mais produtividade para o professor, mais aprendizado para o aluno.
                </p>
              </CardContent>
            </Card>
            
            <Card className="p-6 hover-lift border-brand-accent/30 animate-fade-in-up delay-300 aspect-square flex flex-col">
              <CardContent className="pt-4 text-center flex flex-col justify-center h-full">
                <School className="w-12 h-12 text-brand-primary mx-auto mb-4 animate-pulse-glow" />
                <h3 className="text-xl font-bold text-slate-900 mb-3">Escolas</h3>
                <p className="text-slate-700 leading-relaxed mb-3" style={{ marginTop: '24px' }}>
                  <strong style={{ color: '#2b7475' }}>Plataforma completa para integrar a escrita autoral ao currículo, desenvolvendo autonomia e autorregulação nos alunos.</strong> Permite acompanhar turmas em tempo real, gerar relatórios personalizados e promover práticas de escrita formativas em larga escala.
                </p>
                <p className="text-slate-700 font-bold">
                  Ideal para redações escolares e preparatórios para o ENEM.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-12">
            <Button 
              size="lg" 
              variant="default"
              className="bg-[#4A90E2] hover:bg-[#357ABD] text-white px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              Saiba Mais para Estudantes
            </Button>
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
                <img src={card2} alt="Escrita Autorregulada" className="w-full max-w-md h-auto" />
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
                <img src={card3} alt="Análise Integrada" className="w-full max-w-md h-auto" />
              </div>
            </div>

            {/* Painel de Sentimentos */}
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="flex items-center justify-center">
                <img src={card4} alt="Painel de Sentimentos" className="w-full max-w-md h-auto" />
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
                <img src={card5} alt="Rubricas e Evolução" className="w-full max-w-md h-auto" />
              </div>
            </div>

            {/* IA como Assistente */}
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="flex items-center justify-center">
                <img src={card6} alt="IA como Assistente" className="w-full max-w-md h-auto" />
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