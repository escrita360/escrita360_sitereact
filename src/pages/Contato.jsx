import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Checkbox } from '@/components/ui/checkbox.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { useScrollAnimation } from '@/hooks/use-scroll-animation.js'
import { PageHero } from '@/components/PageHero.jsx'
import { Mail, Phone, MapPin, MessageSquare, Clock, Calendar, Gift, Handshake, GraduationCap, Headphones, Send, Facebook, Instagram, MessageCircle, Rocket, BookOpen, HelpCircle, CalendarDays } from 'lucide-react'

function Contato() {
  const heroRef = useScrollAnimation()
  const formRef = useScrollAnimation()
  const contactRef = useScrollAnimation()
  
  const getHeroContent = () => {
    return {
      title: 'Vamos',
      titleHighlight: 'Conversar?',
      subtitle: 'Estamos prontos para ajudar você a transformar o processo de escrita. Entre em contato conosco e tire suas dúvidas!'
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

      {/* Contact Main Section */}
      <section ref={formRef} className="py-16 bg-slate-50 animate-on-scroll">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
            {/* Contact Form */}
            <Card className="p-8 shadow-lg hover-lift animate-fade-in-left">
              <CardHeader>
                <CardTitle className="text-2xl text-slate-900 animate-fade-in-up">Envie sua mensagem</CardTitle>
                <p className="text-slate-600 animate-fade-in-up delay-100">Preencha o formulário abaixo e retornaremos em até 24 horas</p>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome completo *</Label>
                      <Input id="nome" placeholder="Seu nome" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail *</Label>
                      <Input id="email" type="email" placeholder="seu@email.com" required />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="telefone">Telefone/WhatsApp *</Label>
                      <Input id="telefone" type="tel" placeholder="(00) 00000-0000" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="perfil">Você é: *</Label>
                      <Select required>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="estudante">Estudante</SelectItem>
                          <SelectItem value="professor">Professor</SelectItem>
                          <SelectItem value="escola">Representante de Escola</SelectItem>
                          <SelectItem value="cursinho">Curso Preparatório</SelectItem>
                          <SelectItem value="outro">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="instituicao">Instituição (opcional)</Label>
                    <Input id="instituicao" placeholder="Nome da sua escola, cursinho ou universidade" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="assunto">Assunto *</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="demonstracao">Solicitar Demonstração</SelectItem>
                        <SelectItem value="duvidas">Dúvidas sobre a Plataforma</SelectItem>
                        <SelectItem value="planos">Informações sobre Planos</SelectItem>
                        <SelectItem value="suporte">Suporte Técnico</SelectItem>
                        <SelectItem value="parceria">Proposta de Parceria</SelectItem>
                        <SelectItem value="outro">Outro Assunto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mensagem">Mensagem *</Label>
                    <Textarea
                      id="mensagem"
                      placeholder="Conte-nos como podemos ajudar..."
                      rows={6}
                      required
                    />
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox id="aceito" required />
                    <Label htmlFor="aceito" className="text-sm leading-relaxed">
                      Aceito receber comunicações da Escrita360 e concordo com a{' '}
                      <a href="#" className="text-brand-primary hover:underline">Política de Privacidade</a>
                    </Label>
                  </div>

                  <Button className="w-full bg-brand-primary hover:bg-brand-secondary text-white transition-all duration-300 hover:scale-105">
                    <Send className="w-4 h-4 mr-2 animate-float" />
                    Enviar Mensagem
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="space-y-6 animate-fade-in-right">
              {/* Contact Methods */}
              <Card className="p-6 shadow-lg hover-lift animate-scale-in delay-200">
                <CardHeader>
                  <CardTitle className="text-xl text-slate-900">Outras formas de contato</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-brand-light rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-brand-primary animate-pulse-glow" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">E-mail</h4>
                      <p className="text-slate-600">contato@escrita360.com.br</p>
                      <p className="text-sm text-slate-500">Respondemos em até 24h</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-6 h-6 text-green-600 animate-pulse-glow" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">WhatsApp</h4>
                      <p className="text-slate-600">(11) 99999-9999</p>
                      <p className="text-sm text-slate-500">Atendimento: Seg-Sex, 9h-18h</p>
                      <Button variant="outline" size="sm" className="mt-2 transition-all hover:scale-105">
                        Iniciar Conversa
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-brand-light rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-brand-primary animate-pulse-glow" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Telefone</h4>
                      <p className="text-slate-600">(11) 3000-0000</p>
                      <p className="text-sm text-slate-500">Atendimento: Seg-Sex, 9h-18h</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Media */}
              <Card className="p-6 shadow-lg hover-lift animate-scale-in delay-300">
                <CardHeader>
                  <CardTitle className="text-xl text-slate-900">Siga-nos nas redes sociais</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <Button variant="outline" size="icon" className="w-12 h-12 transition-all hover:scale-110 hover:rotate-6">
                      <Facebook className="w-5 h-5 text-brand-primary" />
                    </Button>
                    <Button variant="outline" size="icon" className="w-12 h-12 transition-all hover:scale-110 hover:rotate-6">
                      <Instagram className="w-5 h-5 text-brand-primary" />
                    </Button>
                    <Button variant="outline" size="icon" className="w-12 h-12 transition-all hover:scale-110 hover:rotate-6">
                      <MessageCircle className="w-5 h-5 text-brand-primary" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="p-6 shadow-lg hover-lift animate-scale-in delay-400">
                <CardHeader>
                  <CardTitle className="text-xl text-slate-900">Ações rápidas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 transition-all hover:scale-105">
                      <Rocket className="w-5 h-5 text-brand-primary animate-float" />
                      <span className="text-sm">Começar Grátis</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 transition-all hover:scale-105">
                      <BookOpen className="w-5 h-5 text-brand-primary animate-float" style={{animationDelay: '200ms'}} />
                      <span className="text-sm">Ver Recursos</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 transition-all hover:scale-105">
                      <HelpCircle className="w-5 h-5 text-brand-primary animate-float" style={{animationDelay: '400ms'}} />
                      <span className="text-sm">Central de Ajuda</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 transition-all hover:scale-105">
                      <CalendarDays className="w-5 h-5 text-brand-primary animate-float" style={{animationDelay: '600ms'}} />
                      <span className="text-sm">Agendar Demo</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section ref={contactRef} className="py-16 bg-white animate-on-scroll">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4 animate-fade-in-up">Perguntas Frequentes</h2>
            <p className="text-xl text-slate-600 animate-fade-in-up delay-200">Encontre respostas rápidas antes de entrar em contato</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="p-6 shadow-lg hover-lift animate-fade-in-up delay-100">
              <CardContent className="pt-0">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-light rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-brand-primary animate-pulse-glow" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Qual o tempo de resposta?</h3>
                    <p className="text-slate-600 text-sm">Respondemos todas as mensagens em até 24 horas úteis. Para urgências, utilize o WhatsApp.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 shadow-lg hover-lift animate-fade-in-up delay-200">
              <CardContent className="pt-0">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-light rounded-full flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-brand-primary animate-pulse-glow" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Como agendar uma demonstração?</h3>
                    <p className="text-slate-600 text-sm">Preencha o formulário selecionando "Solicitar Demonstração" ou clique no botão "Agendar Demo".</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 shadow-lg hover-lift animate-fade-in-up delay-300">
              <CardContent className="pt-0">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Gift className="w-6 h-6 text-green-600 animate-pulse-glow" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">O teste é realmente grátis?</h3>
                    <p className="text-slate-600 text-sm">Sim! Não solicitamos cartão de crédito e você pode usar gratuitamente para sempre com o plano básico.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 shadow-lg hover-lift animate-fade-in-up delay-400">
              <CardContent className="pt-0">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-light rounded-full flex items-center justify-center flex-shrink-0">
                    <Handshake className="w-6 h-6 text-brand-primary animate-pulse-glow" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Oferecem consultoria?</h3>
                    <p className="text-slate-600 text-sm">Sim! Planos para escolas incluem consultoria pedagógica personalizada.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 shadow-lg hover-lift animate-fade-in-up delay-500">
              <CardContent className="pt-0">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-light rounded-full flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-6 h-6 text-brand-primary animate-pulse-glow" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Há treinamento disponível?</h3>
                    <p className="text-slate-600 text-sm">Todos os planos pagos incluem treinamento. Escolas recebem treinamento personalizado completo.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 shadow-lg hover-lift animate-fade-in-up delay-600">
              <CardContent className="pt-0">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-light rounded-full flex items-center justify-center flex-shrink-0">
                    <Headphones className="w-6 h-6 text-brand-primary animate-pulse-glow" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Como funciona o suporte?</h3>
                    <p className="text-slate-600 text-sm">Oferecemos suporte por e-mail, WhatsApp e telefone. Planos superiores têm suporte prioritário.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 text-slate-900 animate-fade-in-up">Prefere começar por conta própria?</h2>
            <p className="text-xl text-slate-600 mb-8 animate-fade-in-up delay-200">
              Crie sua conta gratuita agora e comece a transformar sua escrita imediatamente.
            </p>
            <Button size="lg" className="bg-brand-primary text-white hover:bg-brand-secondary transition-all duration-300 hover:scale-105 animate-fade-in-up delay-300">
              Criar Conta Grátis
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contato
