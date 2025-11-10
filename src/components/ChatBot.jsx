import { useState, useEffect, useRef } from 'react'
import { X, Send } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { ScrollArea } from '@/components/ui/scroll-area.jsx'
import robo from '@/assets/robo.svg'
import { chatService } from '@/services/chat.js'

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { id: 1, text: 'Olá! Como posso ajudá-lo hoje?', sender: 'bot' }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState(null)
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [formErrors, setFormErrors] = useState({})
  const messagesEndRef = useRef(null)
  const scrollAreaRef = useRef(null)

  // Função para scroll automático
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Scroll quando mensagens mudam
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const sessionData = localStorage.getItem('chatSession')
    if (sessionData) {
      const data = JSON.parse(sessionData)
      setSessionId(data.session_id)
      setMessages([
        { id: 1, text: data.message, sender: 'bot', buttons: data.buttons }
      ])
      setIsOpen(true)
      localStorage.removeItem('chatSession')
    }
  }, [])

  // Helper: add bot message
  const pushBotMessage = (text, buttons) => {
    const botMessage = {
      id: messages.length + 1,
      text,
      sender: 'bot',
      buttons: buttons || []
    }
    setMessages(prev => [...prev, botMessage])
  }

  const validateForm = () => {
    const errors = {}
    if (!nome.trim()) errors.nome = 'Nome é obrigatório'
    if (!email.trim()) errors.email = 'Email é obrigatório'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Email inválido'
    if (!telefone.trim()) errors.telefone = 'Telefone é obrigatório'
    else if (!/^\d{10,11}$/.test(telefone.replace(/\D/g, ''))) errors.telefone = 'Telefone deve ter 10-11 dígitos'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSendMessage = async (message = inputMessage.trim()) => {
    if (!message || isLoading) return

    // Adiciona mensagem do usuário
    const userMessage = {
      id: messages.length + 1,
      text: message,
      sender: 'user'
    }
    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      // Se a escolha for 'comprar', chamar finalize
      if (message === 'comprar') {
        const fin = await chatService.finalizeConversation(sessionId)
        pushBotMessage(fin.message)
        setIsLoading(false)
        return
      }

      // Enviar escolha/texto para o chatbot
      const response = await chatService.sendChoice(sessionId, message)

      // Resposta pode ter message e buttons
      if (response.message) {
        pushBotMessage(response.message, response.buttons)
      }

      // Se não havia sessionId e veio uma session_id no retorno, guardar
      if (!sessionId && response.session_id) {
        setSessionId(response.session_id)
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      pushBotMessage('Desculpe, houve um erro. Tente novamente mais tarde.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleNomeChange = (e) => {
    setNome(e.target.value)
    if (formErrors.nome) setFormErrors(prev => ({ ...prev, nome: '' }))
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
    if (formErrors.email) setFormErrors(prev => ({ ...prev, email: '' }))
  }

  const handleTelefoneChange = (e) => {
    setTelefone(e.target.value)
    if (formErrors.telefone) setFormErrors(prev => ({ ...prev, telefone: '' }))
  }

  const handleStartConversation = async (e) => {
    e && e.preventDefault()
    if (!validateForm()) return
    setIsLoading(true)
    try {
      const res = await chatService.startConversation({ nome, email, telefone })
      if (res.session_id) setSessionId(res.session_id)
      // Limpa mensagens e adiciona a resposta inicial do bot
      setMessages([{ id: 1, text: res.message, sender: 'bot', buttons: res.buttons }])
    } catch (error) {
      console.error('Erro ao iniciar conversa:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao iniciar conversa. Tente novamente mais tarde.'
      pushBotMessage(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      {/* Botão Flutuante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-20 h-20 rounded-full bg-brand-primary hover:bg-brand-secondary text-white shadow-lg transition-all duration-300 flex items-center justify-center group hover:scale-110"
        aria-label="Abrir chat"
      >
        {isOpen ? (
          <X className="w-8 h-8" />
        ) : (
          <img src={robo} alt="Chat Bot" className="w-20 h-20 group-hover:animate-bounce" style={{ filter: 'brightness(0) invert(1)' }} />
        )}
      </button>

      {/* Janela do Chat */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[450px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-8rem)] animate-fade-in-up">
          <Card className="h-full flex flex-col shadow-2xl bg-white">
            <CardHeader className="bg-brand-primary text-white rounded-t-lg py-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <img src={robo} alt="Chat Bot" className="w-12 h-12" style={{ filter: 'brightness(0) invert(1)' }} />
                Chat de Suporte
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
              {/* Área de Mensagens */}
              <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                <div className="space-y-4 pb-2">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 break-words overflow-wrap-anywhere ${
                          message.sender === 'user'
                            ? 'bg-brand-primary text-white'
                            : 'bg-slate-100 text-slate-900'
                        }`}
                        style={{ wordBreak: 'break-word', overflowWrap: 'anywhere', hyphens: 'auto' }}
                      >
                        <p className="whitespace-pre-wrap">{message.text}</p>
                        {message.buttons && message.buttons.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {message.buttons.map((button) => (
                              <Button
                                key={button.id}
                                variant="outline"
                                size="sm"
                                onClick={() => handleSendMessage(button.id)}
                                className="text-xs bg-white hover:bg-slate-50"
                              >
                                {button.text}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Área de Input / Formulário inicial */}
              <div className="p-4 border-t bg-white">
                {!sessionId ? (
                  <form onSubmit={handleStartConversation} className="space-y-3">
                    <div>
                      <Label htmlFor="nome" className="text-sm">Nome completo</Label>
                      <Input
                        id="nome"
                        type="text"
                        value={nome}
                        onChange={handleNomeChange}
                        disabled={isLoading}
                        className={`text-sm ${formErrors.nome ? 'border-red-500' : ''}`}
                        placeholder="Digite seu nome"
                      />
                      {formErrors.nome && <p className="text-red-500 text-xs mt-1">{formErrors.nome}</p>}
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-sm">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        disabled={isLoading}
                        className={`text-sm ${formErrors.email ? 'border-red-500' : ''}`}
                        placeholder="seu@email.com"
                      />
                      {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                    </div>
                    <div>
                      <Label htmlFor="telefone" className="text-sm">Telefone</Label>
                      <Input
                        id="telefone"
                        type="text"
                        value={telefone}
                        onChange={handleTelefoneChange}
                        disabled={isLoading}
                        className={`text-sm ${formErrors.telefone ? 'border-red-500' : ''}`}
                        placeholder="(00) 00000-0000"
                      />
                      {formErrors.telefone && <p className="text-red-500 text-xs mt-1">{formErrors.telefone}</p>}
                    </div>
                    <div className="flex justify-end pt-2">
                      <Button type="submit" disabled={isLoading} className="bg-brand-primary text-white hover:bg-brand-secondary">
                        {isLoading ? 'Iniciando...' : 'Começar Conversa'}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Digite sua mensagem..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      className="flex-1 text-sm"
                      disabled={isLoading}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                    />
                    <Button 
                      type="submit" 
                      size="icon" 
                      className="bg-brand-primary hover:bg-brand-secondary text-white shrink-0" 
                      disabled={isLoading || !inputMessage.trim()}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default ChatBot
