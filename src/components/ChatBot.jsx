import { useState } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { ScrollArea } from '@/components/ui/scroll-area.jsx'
import robo from '@/assets/robo.svg'

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { id: 1, text: 'Olá! Como posso ajudá-lo hoje?', sender: 'bot' }
  ])
  const [inputMessage, setInputMessage] = useState('')

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!inputMessage.trim()) return

    // Adiciona mensagem do usuário
    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user'
    }
    setMessages([...messages, userMessage])

    // Simula resposta do bot
    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        text: 'Obrigado pela sua mensagem! Nossa equipe entrará em contato em breve.',
        sender: 'bot'
      }
      setMessages(prev => [...prev, botMessage])
    }, 1000)

    setInputMessage('')
  }

  return (
    <>
      {/* Botão Flutuante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-28 h-28 rounded-full bg-brand-primary hover:bg-brand-secondary text-white shadow-lg transition-all duration-300 flex items-center justify-center group hover:scale-110"
        aria-label="Abrir chat"
      >
        {isOpen ? (
          <X className="w-12 h-12" />
        ) : (
          <img src={robo} alt="Chat Bot" className="w-48 h-48 group-hover:animate-bounce" style={{ filter: 'brightness(0) invert(1)' }} />
        )}
      </button>

      {/* Janela do Chat */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[350px] h-[500px] animate-fade-in-up">
          <Card className="h-full flex flex-col shadow-2xl bg-white">
            <CardHeader className="bg-blue-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
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
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-900'
                        }`}
                      >
                        {message.text}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Área de Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Digite sua mensagem..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon" className="bg-blue-600 hover:bg-blue-700">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}

export default ChatBot
