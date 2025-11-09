import { useState, useEffect } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
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
      const response = await chatService.sendMessage(message, sessionId)
      const botMessage = {
        id: messages.length + 2,
        text: response.response,
        sender: 'bot',
        buttons: response.buttons
      }
      setMessages(prev => [...prev, botMessage])
      if (!sessionId && response.session_id) {
        setSessionId(response.session_id)
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      const errorMessage = {
        id: messages.length + 2,
        text: 'Desculpe, houve um erro. Tente novamente mais tarde.',
        sender: 'bot'
      }
      setMessages(prev => [...prev, errorMessage])
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
        <div className="fixed bottom-24 right-6 z-50 w-[450px] h-[600px] animate-fade-in-up">
          <Card className="h-full flex flex-col shadow-2xl bg-white">
            <CardHeader className="bg-brand-primary text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <img src={robo} alt="Chat Bot" className="w-20 h-20" style={{ filter: 'brightness(0) invert(1)' }} />
                Chat de Suporte
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
              {/* Área de Mensagens */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          message.sender === 'user'
                            ? 'bg-brand-primary text-white'
                            : 'bg-slate-100 text-slate-900'
                        }`}
                      >
                        {message.text}
                        {message.buttons && message.buttons.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {message.buttons.map((button) => (
                              <Button
                                key={button.id}
                                variant="outline"
                                size="sm"
                                onClick={() => handleSendMessage(button.id)}
                                className="text-xs"
                              >
                                {button.text}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Área de Input */}
              <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Digite sua mensagem..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button type="submit" size="icon" className="bg-brand-primary hover:bg-brand-secondary text-white" disabled={isLoading}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default ChatBot
