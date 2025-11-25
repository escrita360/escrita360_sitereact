import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card } from '@/components/ui/card.jsx'
import { X, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [showPdfModal, setShowPdfModal] = useState(false)
  const [selectedPdf, setSelectedPdf] = useState('')
  const [preferences, setPreferences] = useState({
    necessary: true, // sempre habilitado
    analytics: false,
    marketing: false
  })

  useEffect(() => {
    // Sempre mostrar o banner para teste - remova esta linha em produção
    setShowBanner(true)
    
    // Código original comentado:
    // const consent = localStorage.getItem('cookieConsent')
    // if (!consent) {
    //   setShowBanner(true)
    // }
  }, [])

  const acceptAll = () => {
    const newPreferences = {
      necessary: true,
      analytics: true,
      marketing: true
    }
    setPreferences(newPreferences)
    localStorage.setItem('cookieConsent', JSON.stringify(newPreferences))
    setShowBanner(false)
    setShowPreferences(false)
  }

  const rejectAll = () => {
    const newPreferences = {
      necessary: true,
      analytics: false,
      marketing: false
    }
    setPreferences(newPreferences)
    localStorage.setItem('cookieConsent', JSON.stringify(newPreferences))
    setShowBanner(false)
    setShowPreferences(false)
  }

  const savePreferences = () => {
    localStorage.setItem('cookieConsent', JSON.stringify(preferences))
    setShowBanner(false)
    setShowPreferences(false)
  }

  const openPreferences = () => {
    setShowPreferences(true)
  }

  const closePreferences = () => {
    setShowPreferences(false)
  }

  const openPdf = (pdfPath) => {
    setSelectedPdf(pdfPath)
    setShowPdfModal(true)
  }

  const closePdfModal = () => {
    setShowPdfModal(false)
    setSelectedPdf('')
  }

  if (!showBanner && !showPreferences) return null

  return (
    <>
      {/* Banner Principal */}
      {showBanner && !showPreferences && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-lg p-4">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex-1">
                <p className="text-slate-700 text-sm md:text-base">
                  Clicando em "Aceito todos os Cookies", você concorda com o armazenamento de
                  cookies no seu dispositivo para melhorar a experiência e navegação no site.
                </p>
                <p className="text-slate-500 text-xs mt-1">
                  Aviso de Privacidade / Termos de Uso / Requisição de Titular
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button 
                  onClick={openPreferences}
                  variant="outline"
                  className="bg-[#61C2D3] hover:bg-[#39A1DB] text-white border-[#61C2D3]"
                >
                  Preferências
                </Button>
                <Button 
                  onClick={acceptAll}
                  className="bg-[#4070B7] hover:bg-[#1A5B94] text-white"
                >
                  Aceitar todos
                </Button>
                <Button 
                  onClick={rejectAll}
                  variant="outline"
                  className="bg-[#39A1DB] hover:bg-[#1A5B94] text-white border-[#39A1DB]"
                >
                  Rejeitar todos
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Preferências */}
      {showPreferences && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Configurações de privacidade</h2>
                <Button 
                  onClick={closePreferences}
                  variant="ghost" 
                  size="icon"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Descrição */}
              <p className="text-slate-600 mb-8 leading-relaxed">
                Decida quais os cookies que deseja permitir. O utilizador pode alterar estas configurações em qualquer momento. No entanto, por vezes pode obter visualizações ou resultados indisponíveis. Para obter informações sobre como excluir os cookies, consulte a função de ajuda do seu navegador.
              </p>

              {/* Tipos de Cookies */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {/* Cookies Necessários */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <span className="text-slate-600 text-xl">✓</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-3">Cookies Necessários</h3>
                  <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                    Estes cookies são aqueles necessários para o site funcionar e não podem ser desligados em nossos sistemas. Eles geralmente são definidos apenas em resposta às ações feitas por você, como por exemplo, definir suas preferências de privacidade, fazer login ou preencher formulários. Caso queira, pode configurar seu navegador para bloqueá-lo ou alertá-lo sobre esses cookies, mas algumas partes do site podem não funcionar de forma adequada.
                  </p>
                  <div className="flex items-center justify-center">
                    <div className="w-12 h-6 bg-slate-300 rounded-full flex items-center cursor-not-allowed">
                      <div className="w-5 h-5 bg-slate-500 rounded-full ml-1 transition-transform"></div>
                    </div>
                  </div>
                </div>

                {/* Cookies Analíticos */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <div className="flex space-x-1">
                        <div className="w-1 h-4 bg-slate-600"></div>
                        <div className="w-1 h-6 bg-slate-600"></div>
                        <div className="w-1 h-3 bg-slate-600"></div>
                        <div className="w-1 h-5 bg-slate-600"></div>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-3">Cookies Analíticos</h3>
                  <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                    Os cookies analíticos fornecem informações sobre como este site está sendo usado para que possamos melhorar a experiência do usuário. Os dados capturados são agregados e anonimizados.
                  </p>
                  <div className="flex items-center justify-center">
                    <button
                      onClick={() => setPreferences(prev => ({...prev, analytics: !prev.analytics}))}
                      className={cn(
                        "w-12 h-6 rounded-full flex items-center transition-colors",
                        preferences.analytics ? "bg-[#61C2D3]" : "bg-slate-300"
                      )}
                    >
                      <div className={cn(
                        "w-5 h-5 bg-white rounded-full transition-transform",
                        preferences.analytics ? "translate-x-6 ml-1" : "ml-1"
                      )}></div>
                    </button>
                  </div>
                </div>

                {/* Cookies de Marketing */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <span className="text-slate-600 text-xl">📢</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-3">Cookies De Marketing</h3>
                  <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                    Os cookies de marketing fornecem informações sobre a interação do usuário com o conteúdo do nosso site, ajudando-nos a entender melhor a eficácia do nosso conteúdo de e-mail e website.
                  </p>
                  <div className="flex items-center justify-center">
                    <button
                      onClick={() => setPreferences(prev => ({...prev, marketing: !prev.marketing}))}
                      className={cn(
                        "w-12 h-6 rounded-full flex items-center transition-colors",
                        preferences.marketing ? "bg-[#61C2D3]" : "bg-slate-300"
                      )}
                    >
                      <div className={cn(
                        "w-5 h-5 bg-white rounded-full transition-transform",
                        preferences.marketing ? "translate-x-6 ml-1" : "ml-1"
                      )}></div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                <Button 
                  onClick={() => window.open('/lista-cookies', '_blank')}
                  className="bg-[#39A1DB] hover:bg-[#1A5B94] text-white"
                >
                  Lista de cookies
                </Button>
                <Button 
                  onClick={() => openPdf('/docs/politica-privacidade.pdf')}
                  className="bg-[#39A1DB] hover:bg-[#1A5B94] text-white"
                >
                  Aviso de Privacidade
                </Button>
                <Button 
                  onClick={() => openPdf('/docs/termos-uso.pdf')}
                  className="bg-[#39A1DB] hover:bg-[#1A5B94] text-white"
                >
                  Termos de Uso
                </Button>
                <Button 
                  onClick={() => window.open('/requisicao-titular', '_blank')}
                  className="bg-[#39A1DB] hover:bg-[#1A5B94] text-white"
                >
                  Requisição de Titular
                </Button>
              </div>

              {/* Botão Principal */}
              <div className="text-center">
                <Button 
                  onClick={savePreferences}
                  className="bg-[#4070B7] hover:bg-[#1A5B94] text-white px-8 py-2"
                >
                  Salvar & Fechar
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Modal PDF */}
      {showPdfModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-5xl max-h-[90vh] overflow-hidden bg-white">
            <div className="p-4 flex items-center justify-between border-b">
              <h2 className="text-xl font-bold text-slate-900">Documento</h2>
              <Button 
                onClick={closePdfModal}
                variant="ghost" 
                size="icon"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="p-4">
              <iframe 
                src={selectedPdf} 
                width="100%" 
                height="600px" 
                style={{ border: 'none' }}
                title="Documento PDF"
              />
            </div>
          </Card>
        </div>
      )}
    </>
  )
}

export default CookieConsent