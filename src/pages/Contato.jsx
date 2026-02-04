import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Checkbox } from '@/components/ui/checkbox.jsx'
import { useScrollAnimation } from '@/hooks/use-scroll-animation.js'
import { PageHero } from '@/components/PageHero.jsx'
import { Send } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { contractSignatureService } from '@/services/firebase'

function Contato() {
  const formRef = useScrollAnimation()
  
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('https://Escrita 360-n8n.nnjeij.easypanel.host/webhook/chatbot/start', {
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
        
        // Registrar assinatura de contrato se o usuário aceitou os termos
        if (formData.aceito) {
          try {
            await registerContactFormContractSignature()
          } catch (contractError) {
            console.warn('⚠️ Erro ao registrar assinatura de contrato:', contractError)
            // Não falhar o envio do formulário por causa disso
          }
        }
        
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

  // Função para registrar assinatura de contrato no formulário de contato
  const registerContactFormContractSignature = async () => {
    try {
      console.log('📝 Registrando assinatura de contrato do formulário de contato...')
      
      const contractData = {
        userName: formData.nome,
        userEmail: formData.email,
        userPhone: formData.telefone.replace(/\D/g, ''),
        contractType: 'terms_and_conditions',
        contractVersion: '1.0',
        signatureContext: 'contact_form',
        planType: '', // Não há plano específico no formulário de contato
        planId: '',
        metadata: {
          perfil: formData.perfil,
          instituicao: formData.instituicao,
          assunto: formData.assunto,
          mensagem: formData.mensagem,
          timestamp: new Date().toISOString()
        }
      }

      // Determinar audience baseado no perfil
      const audience = formData.perfil === 'professor' ? 'professores' : 'alunos'

      const result = await contractSignatureService.registerContractAcceptance(
        formData.email, // Usar email como identificador
        contractData,
        audience
      )

      console.log('✅ Assinatura de contrato do formulário registrada:', result.signatureId)
      return result
      
    } catch (error) {
      console.error('❌ Erro ao registrar assinatura de contrato do formulário:', error)
      throw error
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
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="max-w-2xl mx-auto">
            {/* Contact Form */}
            <Card className="p-6 shadow-lg hover-lift animate-fade-in-up">
              <CardHeader>
                <CardTitle className="text-2xl text-slate-900 animate-fade-in-up text-center">Envie sua mensagem</CardTitle>
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
                    <Label htmlFor="aceito" className="text-sm leading-relaxed">Concordo com os{' '}<Link to="/termos-servico" className="text-brand-primary hover:underline">Termos e Condições gerais de uso</Link> e{' '}<Link to="/politica-privacidade" className="text-brand-primary hover:underline">Política de Privacidade</Link></Label>
                  </div>

                  <Button type="submit" className="w-full bg-[#4A90E2] hover:bg-[#357ABD] text-white transition-all duration-300 hover:scale-105">
                    <Send className="w-4 h-4 mr-2 animate-float" />
                    Enviar Mensagem
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

    </div>
  )
}

export default Contato
