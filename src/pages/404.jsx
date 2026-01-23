import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent } from '@/components/ui/card.jsx'
import { Home, ArrowRight, Search } from 'lucide-react'

// Função para calcular a distância de Levenshtein
function levenshteinDistance(str1, str2) {
  const len1 = str1.length
  const len2 = str2.length
  const matrix = []

  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i]
  }

  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      )
    }
  }

  return matrix[len1][len2]
}

export default function NotFound() {
  const navigate = useNavigate()
  const location = useLocation()
  const [suggestedRoutes, setSuggestedRoutes] = useState([])

  // Lista de todas as rotas disponíveis
  const availableRoutes = [
    { path: '/', name: 'Home', description: 'Página inicial' },
    { path: '/para-quem', name: 'Para Quem', description: 'Conheça nossos públicos' },
    { path: '/recursos', name: 'Recursos', description: 'Funcionalidades da plataforma' },
    { path: '/precos', name: 'Preços', description: 'Planos e valores' },
    { path: '/contato', name: 'Contato', description: 'Fale conosco' },
    { path: '/faq', name: 'FAQ', description: 'Perguntas frequentes' },
    { path: '/sobre-nos', name: 'Sobre Nós', description: 'Nossa história' },
    { path: '/login', name: 'Login', description: 'Acesse sua conta' },
    { path: '/perfil', name: 'Perfil', description: 'Seu perfil' },
    { path: '/comprar-creditos', name: 'Comprar Créditos', description: 'Adquira créditos' },
  ]

  useEffect(() => {
    const currentPath = location.pathname.toLowerCase()
    
    // Calcula similaridade para cada rota
    const routesWithSimilarity = availableRoutes.map(route => ({
      ...route,
      similarity: levenshteinDistance(currentPath, route.path.toLowerCase())
    }))

    // Ordena por similaridade e pega as 3 melhores sugestões
    const topSuggestions = routesWithSimilarity
      .sort((a, b) => a.similarity - b.similarity)
      .slice(0, 3)

    setSuggestedRoutes(topSuggestions)
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 py-12">
      <Card className="max-w-2xl w-full shadow-2xl border-0">
        <CardContent className="p-8 md:p-12 text-center">
          {/* Número 404 estilizado */}
          <div className="mb-8">
            <h1 className="text-9xl font-bold bg-gradient-to-r from-[#1d5a91] to-[#3b82f6] bg-clip-text text-transparent">
              404
            </h1>
            <div className="flex items-center justify-center gap-2 mt-4">
              <Search className="w-6 h-6 text-gray-400" />
              <p className="text-2xl font-semibold text-gray-700">
                Página não encontrada
              </p>
            </div>
          </div>

          {/* Mensagem principal */}
          <p className="text-gray-600 mb-8 text-lg">
            Ops! A página que você está procurando não existe ou foi movida.
          </p>

          {/* Sugestões de rotas similares */}
          {suggestedRoutes.length > 0 && (
            <div className="mb-8">
              <p className="text-sm font-medium text-gray-700 mb-4">
                Você quis dizer:
              </p>
              <div className="space-y-3">
                {suggestedRoutes.map((route, index) => (
                  <button
                    key={index}
                    onClick={() => navigate(route.path)}
                    className="w-full p-4 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-lg transition-all duration-200 border border-blue-100 hover:border-blue-300 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <p className="font-semibold text-[#1d5a91] group-hover:text-[#3b82f6] transition-colors">
                          {route.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {route.description}
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-[#1d5a91] group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Botão para home */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-[#1d5a91] to-[#3b82f6] hover:from-[#164a7a] hover:to-[#2563eb] text-white px-8 py-6 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Home className="w-5 h-5 mr-2" />
              Voltar para Home
            </Button>
          </div>

          {/* Mensagem de ajuda */}
          <p className="text-sm text-gray-500 mt-8">
            Precisa de ajuda? Entre em contato através da nossa{' '}
            <button
              onClick={() => navigate('/contato')}
              className="text-[#1d5a91] hover:text-[#3b82f6] font-semibold underline transition-colors"
            >
              página de contato
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
