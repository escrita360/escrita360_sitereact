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
import { useState } from 'react'

function Contato() {
  const formRef = useScrollAnimation()
  const contactRef = useScrollAnimation()
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    perfil: '',
    instituicao: '',
    assunto: '',
    mensagem: '',
    aceito: false
  })
  const [feedback, setFeedback] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('https://escrita360-n8n.nnjeij.easypanel.host/webhook/chatbot/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: formData.nome,
          email: formData.email,
          telefone: formData.telefone
        }),
      })
      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('chatSession', JSON.stringify(data))
        alert('Mensagem enviada com sucesso! O chatbot foi iniciado.')
        setFormData({
          nome: '',
          email: '',
          telefone: '',
          perfil: '',
          instituicao: '',
          assunto: '',
          mensagem: '',
          aceito: false
        })
      } else {
        alert('Erro ao enviar mensagem.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Erro ao enviar mensagem.')
    }
  }
  
  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (feedback.trim()) {
      alert('Obrigado pelo seu feedback! Ele foi enviado com sucesso.');
      setFeedback('');
    } else {
      alert('Por favor, escreva seu feedback antes de enviar.');
    }
  }
  
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
            <Card className="p-6 shadow-lg hover-lift animate-fade-in-left">
              <CardHeader>
                <CardTitle className="text-2xl text-slate-900 animate-fade-in-up">Envie sua mensagem</CardTitle>
                <p className="text-slate-600 animate-fade-in-up delay-100">Preencha o formulário abaixo e retornaremos em até 24 horas</p>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome completo *</Label>
                      <Input id="nome" placeholder="Seu nome" value={formData.nome} onChange={(e) => setFormData({...formData, nome: e.target.value})} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail *</Label>
                      <Input id="email" type="email" placeholder="seu@email.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="telefone">Telefone/WhatsApp *</Label>
                      <Input id="telefone" type="tel" placeholder="(00) 00000-0000" value={formData.telefone} onChange={(e) => setFormData({...formData, telefone: e.target.value})} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="perfil">Você é: *</Label>
                      <Select value={formData.perfil} onValueChange={(value) => setFormData({...formData, perfil: value})} required>
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
                    <Input id="instituicao" placeholder="Nome da sua escola, cursinho ou universidade" value={formData.instituicao} onChange={(e) => setFormData({...formData, instituicao: e.target.value})} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="assunto">Assunto *</Label>
                    <Select value={formData.assunto} onValueChange={(value) => setFormData({...formData, assunto: value})} required>
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
                      value={formData.mensagem}
                      onChange={(e) => setFormData({...formData, mensagem: e.target.value})}
                      required
                    />
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox id="aceito" checked={formData.aceito} onCheckedChange={(checked) => setFormData({...formData, aceito: checked})} required />
                    <Label htmlFor="aceito" className="text-sm leading-relaxed">
                      Aceito receber comunicações da Escrita360 e concordo com a{' '}
                      <a href="#" className="text-brand-primary hover:underline">Política de Privacidade</a>
                    </Label>
                  </div>

                  <Button type="submit" className="w-full bg-[#4A90E2] hover:bg-[#357ABD] text-white transition-all duration-300 hover:scale-105">
                    <Send className="w-4 h-4 mr-2 animate-float" />
                    Enviar Mensagem
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="space-y-6 animate-fade-in-right">
              {/* Contact Methods */}
              <Card className="p-4 shadow-lg hover-lift animate-scale-in delay-200 aspect-square flex flex-col">
                <CardHeader className="text-center">
                  <CardTitle className="text-lg text-slate-900">Outras formas de contato</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 flex-1 flex flex-col justify-center">
                  <div className="flex items-start gap-2 mb-2">
                    <div className="w-8 h-8 bg-brand-light rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-brand-primary animate-pulse-glow" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">E-mail</h4>
                      <p className="text-slate-600">contato@escrita360.com.br</p>
                      <p className="text-sm text-slate-500">Respondemos em até 24h</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 mb-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-4 h-4 text-green-600 animate-pulse-glow" />
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

                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 bg-brand-light rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4 text-brand-primary animate-pulse-glow" />
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
              <Card className="p-4 shadow-lg hover-lift animate-scale-in delay-300 aspect-square flex flex-col">
                <CardHeader className="text-center">
                  <CardTitle className="text-lg text-slate-900">Siga-nos nas redes sociais</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-center">
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
              <Card className="p-4 shadow-lg hover-lift animate-scale-in delay-400 aspect-square flex flex-col">
                <CardHeader className="text-center">
                  <CardTitle className="text-lg text-slate-900">Ações rápidas</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-center">
                  <div className="grid grid-cols-2 gap-1">
                    <Button variant="default" className="h-auto p-2 flex flex-col items-center gap-1 transition-all hover:scale-105 bg-[#4A90E2] hover:bg-[#357ABD] text-white">
                      <Rocket className="w-3 h-3 text-white animate-float" />
                      <span className="text-xs">Começar</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-2 flex flex-col items-center gap-1 transition-all hover:scale-105 border-[#4A90E2] text-[#4A90E2] hover:bg-[#4A90E2] hover:text-white">
                      <BookOpen className="w-3 h-3 animate-float" style={{animationDelay: '200ms'}} />
                      <span className="text-xs">Recursos</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-2 flex flex-col items-center gap-1 transition-all hover:scale-105 border-[#4A90E2] text-[#4A90E2] hover:bg-[#4A90E2] hover:text-white">
                      <HelpCircle className="w-3 h-3 animate-float" style={{animationDelay: '400ms'}} />
                      <span className="text-xs">Ajuda</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-2 flex flex-col items-center gap-1 transition-all hover:scale-105 border-[#4A90E2] text-[#4A90E2] hover:bg-[#4A90E2] hover:text-white">
                      <CalendarDays className="w-3 h-3 animate-float" style={{animationDelay: '600ms'}} />
                      <span className="text-xs">Demo</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <section ref={contactRef} className="py-16 bg-white animate-on-scroll">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4 animate-fade-in-up">Deixe seu Feedback</h2>
            <p className="text-xl text-slate-600 animate-fade-in-up delay-200">Sua opinião é importante para nós. Compartilhe suas sugestões e experiências.</p>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card className="shadow-lg hover-lift animate-fade-in-up">
              <CardHeader>
                <CardTitle className="text-center" style={{ color: '#1A5B94' }}>Envie seu Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFeedbackSubmit}>
                  <Textarea
                    placeholder="Escreva seu feedback aqui..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="mb-4"
                    rows={8}
                  />
                  <Button type="submit" className="w-full" style={{ backgroundColor: '#1A5B94', color: 'white' }}>
                    Enviar Feedback
                  </Button>
                </form>
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
