import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Switch } from '@/components/ui/switch.jsx'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion.jsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.jsx'
import { Check, X, Quote, Star } from 'lucide-react'
import React, { useState } from 'react'

function Precos() {
  const [isYearly, setIsYearly] = useState(false)

  const plans = [
    {
      name: 'Gratuito',
      badge: 'Ideal para começar',
      monthlyPrice: 0,
      yearlyPrice: 0,
      description: 'Perfeito para experimentar nossa metodologia de escrita autorregulada',
      features: [
        { text: '3 correções por mês', included: true },
        { text: 'Processo completo de escrita', included: true },
        { text: 'Análise das 5 competências', included: true },
        { text: 'Banco de temas limitado', included: true },
        { text: 'Relatórios básicos', included: true },
        { text: 'Painel de sentimentos', included: true },
        { text: 'Estratégias autorreguladas', included: true }
      ],
      buttonText: 'Começar Grátis',
      buttonVariant: 'outline'
    },
    {
      name: 'Professor',
      badge: 'Solução completa',
      monthlyPrice: 47,
      yearlyPrice: 33,
      description: 'Ideal para professores independentes e pequenas turmas',
      popular: true,
      features: [
        { text: 'Até 30 alunos', included: true },
        { text: 'Correções ilimitadas', included: true },
        { text: 'Dashboard completo', included: true },
        { text: 'Relatórios detalhados', included: true },
        { text: 'Banco completo de temas', included: true },
        { text: 'Suporte prioritário', included: true },
        { text: 'Treinamento incluído', included: true },
        { text: 'Gestão de turmas', included: true },
        { text: 'Habilidades BNCC', included: true },
        { text: 'Acompanhamento em tempo real', included: true }
      ],
      buttonText: 'Escolher Professor',
      buttonVariant: 'default'
    },
    {
      name: 'Escola',
      badge: 'Máximo resultado',
      monthlyPrice: 197,
      yearlyPrice: 138,
      description: 'Solução completa para instituições de ensino de todos os tamanhos',
      features: [
        { text: 'Usuários ilimitados', included: true },
        { text: 'Múltiplos professores', included: true },
        { text: 'Dashboards administrativos', included: true },
        { text: 'Relatórios institucionais', included: true },
        { text: 'White-label disponível', included: true },
        { text: 'Integração com LMS', included: true },
        { text: 'Suporte dedicado 24/7', included: true },
        { text: 'Consultoria pedagógica', included: true },
        { text: 'Gerente de conta exclusivo', included: true },
        { text: 'Treinamento personalizado', included: true },
        { text: 'API completa', included: true },
        { text: 'SLA garantido', included: true }
      ],
      buttonText: 'Agendar Demonstração',
      buttonVariant: 'outline'
    }
  ]

  const comparisonData = [
    { feature: 'Correções por mês', free: '3', professor: 'Ilimitadas', escola: 'Ilimitadas' },
    { feature: 'Número de alunos', free: '1', professor: 'Até 30', escola: 'Ilimitados' },
    { feature: 'Processo de escrita autorregulada', free: true, professor: true, escola: true },
    { feature: 'Análise das 5 competências ENEM', free: true, professor: true, escola: true },
    { feature: 'Painel de sentimentos', free: true, professor: true, escola: true },
    { feature: 'Banco de temas', free: 'Limitado', professor: 'Completo', escola: 'Completo + Personalizado' },
    { feature: 'Dashboard de acompanhamento', free: 'Básico', professor: 'Completo', escola: 'Administrativo Avançado' },
    { feature: 'Relatórios', free: 'Básicos', professor: 'Detalhados', escola: 'Institucionais Completos' },
    { feature: 'Gestão de turmas', free: false, professor: true, escola: true },
    { feature: 'Suporte prioritário', free: false, professor: true, escola: true },
    { feature: 'Integração com LMS', free: false, professor: false, escola: true },
    { feature: 'API completa', free: false, professor: false, escola: true }
  ]

  const successStories = [
    {
      quote: "O Escrita360 foi fundamental na minha aprovação em Medicina na USP. Melhorei minha nota de redação de 680 para 920 pontos em apenas 4 meses. A metodologia de autorregulação me ensinou a revisar meus textos de forma crítica e independente.",
      author: "Ana Carolina Silva",
      role: "Estudante de Medicina",
      avatar: "/placeholder-avatar-1.jpg"
    },
    {
      quote: "Como professor, economizo horas de correção e consigo acompanhar o desenvolvimento de cada aluno individualmente. Os relatórios detalhados facilitam muito a identificação de dificuldades específicas e o planejamento de intervenções pedagógicas.",
      author: "Prof. Roberto Santos",
      role: "Professor de Língua Portuguesa",
      avatar: "/placeholder-avatar-2.jpg"
    },
    {
      quote: "Nossa escola implementou a plataforma e os resultados são impressionantes. A média das notas de redação dos nossos alunos aumentou 35% no primeiro ano. O acompanhamento em tempo real nos permite intervir rapidamente quando necessário.",
      author: "Dra. Maria Fernandes",
      role: "Diretora Pedagógica",
      avatar: "/placeholder-avatar-3.jpg"
    }
  ]

  const faqs = [
    {
      question: "Posso experimentar gratuitamente?",
      answer: "Sim! O plano gratuito permite que você experimente toda a metodologia de escrita autorregulada com 3 correções por mês. Não é necessário cartão de crédito."
    },
    {
      question: "Como funciona o plano anual?",
      answer: "Ao optar pelo plano anual, você economiza 30% e faz um único pagamento no início do período. É possível parcelar em até 12x sem juros."
    },
    {
      question: "Posso cancelar a qualquer momento?",
      answer: "Sim, você pode cancelar sua assinatura a qualquer momento. No plano mensal, a cobrança é interrompida imediatamente. No anual, você continua usando até o fim do período contratado."
    },
    {
      question: "Posso fazer upgrade do meu plano?",
      answer: "No plano Professor, você pode fazer upgrade a qualquer momento. Também oferecemos planos customizados para professores que precisam de mais vagas."
    },
    {
      question: "O plano Escola inclui treinamento?",
      answer: "Sim! O plano Escola inclui treinamento personalizado para toda a equipe pedagógica, além de consultoria contínua e material de apoio."
    },
    {
      question: "A plataforma integra com outros sistemas?",
      answer: "Nossa API permite integração com principais plataformas de gestão de aprendizagem (Moodle, Canvas, Google Classroom, etc). Nossa equipe técnica auxilia na implementação."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Planos que se adaptam à sua necessidade
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
            Escolha o plano ideal para transformar o processo de escrita e alcance resultados extraordinários
          </p>
        </div>
      </section>

      {/* Pricing Toggle */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-4">
            <span className={`text-lg ${!isYearly ? 'font-bold text-blue-600' : 'text-gray-600'}`}>
              Mensal
            </span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className="data-[state=checked]:bg-blue-600"
            />
            <span className={`text-lg ${isYearly ? 'font-bold text-blue-600' : 'text-gray-600'}`}>
              Anual <small className="text-green-600 font-medium">(Economize 30%)</small>
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Grid */}
      <section className="py-8 md:py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'border-2 border-blue-600 shadow-xl' : 'hover:shadow-xl'} transition-shadow`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white px-4 py-1">
                      Mais Escolhido
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <div className="mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {plan.badge}
                    </Badge>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">{plan.name}</h3>
                  <div className="my-4">
                    <span className="text-4xl font-bold text-blue-600">R$</span>
                    <span className="text-5xl font-bold text-blue-600">
                      {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                    </span>
                    <span className="text-slate-600">
                      /{isYearly ? 'mês' : 'mês'}
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm">{plan.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700 text-sm">{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={plan.buttonVariant}
                    size="lg"
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-8 md:py-12 lg:py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-slate-900 mb-4">
            Comparação Detalhada de Planos
          </h2>
          <div className="max-w-6xl mx-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/3">Recursos</TableHead>
                  <TableHead className="text-center">Gratuito</TableHead>
                  <TableHead className="text-center bg-blue-50">Professor</TableHead>
                  <TableHead className="text-center">Escola</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparisonData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{row.feature}</TableCell>
                    <TableCell className="text-center">
                      {typeof row.free === 'boolean' ? (
                        row.free ? <Check className="w-5 h-5 text-green-600 mx-auto" /> : <X className="w-5 h-5 text-gray-400 mx-auto" />
                      ) : (
                        row.free
                      )}
                    </TableCell>
                    <TableCell className="text-center bg-blue-50">
                      {typeof row.professor === 'boolean' ? (
                        row.professor ? <Check className="w-5 h-5 text-green-600 mx-auto" /> : <X className="w-5 h-5 text-gray-400 mx-auto" />
                      ) : (
                        row.professor
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {typeof row.escola === 'boolean' ? (
                        row.escola ? <Check className="w-5 h-5 text-green-600 mx-auto" /> : <X className="w-5 h-5 text-gray-400 mx-auto" />
                      ) : (
                        row.escola
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-8 md:py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-slate-900 mb-4">
            Histórias de Sucesso
          </h2>
          <p className="text-lg md:text-xl text-center text-slate-600 mb-8 md:mb-12 max-w-2xl mx-auto">
            Veja como nossos usuários transformaram sua escrita e alcançaram seus objetivos
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {successStories.map((story, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <Quote className="w-8 h-8 text-blue-600 mb-4" />
                  <p className="text-slate-700 mb-6 italic">"{story.quote}"</p>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={story.avatar} alt={story.author} />
                      <AvatarFallback>{story.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-slate-900">{story.author}</p>
                      <p className="text-sm text-slate-600">{story.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-8 md:py-12 lg:py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-slate-900 mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-lg md:text-xl text-center text-slate-600 mb-8 md:mb-12 max-w-2xl mx-auto">
            Tire suas dúvidas sobre nossos planos e funcionalidades
          </p>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="bg-white rounded-lg border">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <span className="text-left font-medium">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <p className="text-slate-600">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 md:py-12 lg:py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6">
            Pronto para revolucionar a escrita?
          </h2>
          <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Comece gratuitamente e veja a diferença que a autorregulação faz no desenvolvimento da escrita.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
              Começar Grátis
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              Falar com Especialista
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Precos