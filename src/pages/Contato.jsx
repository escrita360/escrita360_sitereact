import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Checkbox } from '@/components/ui/checkbox.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { Mail, Phone, MapPin, MessageSquare, Clock, Calendar, Gift, Handshake, GraduationCap, Headphones, Send, Facebook, Instagram, MessageCircle, Rocket, BookOpen, HelpCircle, CalendarDays } from 'lucide-react'

function Contato() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Vamos conversar?</h1>
            <p className="text-xl opacity-90">
              Estamos prontos para ajudar você a transformar o processo de escrita. Entre em contato conosco!
            </p>
          </div>
        </div>
      </section>

      {/* Contact Main Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
            {/* Contact Form */}
            <Card className="p-8 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-slate-900">Envie sua mensagem</CardTitle>
                <p className="text-slate-600">Preencha o formulário abaixo e retornaremos em até 24 horas</p>
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
                        <SelectItem value="precos">Informações sobre Preços</SelectItem>
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
                      <a href="#" className="text-blue-600 hover:underline">Política de Privacidade</a>
                    </Label>
                  </div>

                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    <Send className="w-4 h-4 mr-2" />
                    Enviar Mensagem
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="space-y-6">
              {/* Contact Methods */}
              <Card className="p-6 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-slate-900">Outras formas de contato</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">E-mail</h4>
                      <p className="text-slate-600">contato@escrita360.com.br</p>
                      <p className="text-sm text-slate-500">Respondemos em até 24h</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">WhatsApp</h4>
                      <p className="text-slate-600">(11) 99999-9999</p>
                      <p className="text-sm text-slate-500">Atendimento: Seg-Sex, 9h-18h</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Iniciar Conversa
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-blue-600" />
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
              <Card className="p-6 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-slate-900">Siga-nos nas redes sociais</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <Button variant="outline" size="icon" className="w-12 h-12">
                      <Facebook className="w-5 h-5" />
                    </Button>
                    <Button variant="outline" size="icon" className="w-12 h-12">
                      <Instagram className="w-5 h-5" />
                    </Button>
                    <Button variant="outline" size="icon" className="w-12 h-12">
                      <MessageCircle className="w-5 h-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="p-6 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-slate-900">Ações rápidas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                      <Rocket className="w-5 h-5" />
                      <span className="text-sm">Começar Grátis</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      <span className="text-sm">Ver Recursos</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                      <HelpCircle className="w-5 h-5" />
                      <span className="text-sm">Central de Ajuda</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                      <CalendarDays className="w-5 h-5" />
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
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Perguntas Frequentes</h2>
            <p className="text-xl text-slate-600">Encontre respostas rápidas antes de entrar em contato</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-0">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Qual o tempo de resposta?</h3>
                    <p className="text-slate-600 text-sm">Respondemos todas as mensagens em até 24 horas úteis. Para urgências, utilize o WhatsApp.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-0">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Como agendar uma demonstração?</h3>
                    <p className="text-slate-600 text-sm">Preencha o formulário selecionando "Solicitar Demonstração" ou clique no botão "Agendar Demo".</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-0">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Gift className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">O teste é realmente grátis?</h3>
                    <p className="text-slate-600 text-sm">Sim! Não solicitamos cartão de crédito e você pode usar gratuitamente para sempre com o plano básico.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-0">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Handshake className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Oferecem consultoria?</h3>
                    <p className="text-slate-600 text-sm">Sim! Planos para escolas incluem consultoria pedagógica personalizada.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-0">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Há treinamento disponível?</h3>
                    <p className="text-slate-600 text-sm">Todos os planos pagos incluem treinamento. Escolas recebem treinamento personalizado completo.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-0">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Headphones className="w-6 h-6 text-blue-600" />
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

      {/* Locations Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Nossos Escritórios</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow text-center">
              <CardContent className="pt-0">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">São Paulo - SP</h3>
                <p className="text-slate-600">Av. Paulista, 1000 - Sala 500</p>
                <p className="text-slate-600">Bela Vista, São Paulo - SP</p>
                <p className="text-slate-600">CEP: 01310-100</p>
              </CardContent>
            </Card>

            <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow text-center">
              <CardContent className="pt-0">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Rio de Janeiro - RJ</h3>
                <p className="text-slate-600">Av. Rio Branco, 200 - Sala 300</p>
                <p className="text-slate-600">Centro, Rio de Janeiro - RJ</p>
                <p className="text-slate-600">CEP: 20040-000</p>
              </CardContent>
            </Card>

            <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow text-center">
              <CardContent className="pt-0">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Brasília - DF</h3>
                <p className="text-slate-600">SCS Q. 01, Bloco A - Sala 100</p>
                <p className="text-slate-600">Asa Sul, Brasília - DF</p>
                <p className="text-slate-600">CEP: 70300-000</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Prefere começar por conta própria?</h2>
            <p className="text-xl opacity-90 mb-8">
              Crie sua conta gratuita agora e comece a transformar sua escrita imediatamente.
            </p>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-slate-100">
              Criar Conta Grátis
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contato