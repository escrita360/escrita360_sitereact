import React from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { User, Mail, Calendar, CreditCard, LogOut, Plus, CreditCardIcon, Smartphone, Banknote } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Perfil = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  if (!user) {
    navigate('/login')
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Meu Perfil</h1>
            <p className="text-slate-600">Gerencie suas informações pessoais e configurações da conta</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Informações do Perfil */}
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Informações Pessoais
                  </CardTitle>
                  <CardDescription>
                    Suas informações básicas de cadastro
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="font-medium">{user.nome || 'Nome não informado'}</p>
                      <p className="text-sm text-slate-500">Nome completo</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="font-medium">{user.email}</p>
                      <p className="text-sm text-slate-500">Email</p>
                    </div>
                  </div>

                  {user.criadoEm && (
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-slate-500" />
                      <div>
                        <p className="font-medium">
                          {new Date(user.criadoEm.seconds * 1000).toLocaleDateString('pt-BR')}
                        </p>
                        <p className="text-sm text-slate-500">Membro desde</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <Badge variant={user.emailVerificado ? "default" : "secondary"}>
                      {user.emailVerificado ? "Verificado" : "Não verificado"}
                    </Badge>
                    <span className="text-sm text-slate-500">Status do email</span>
                  </div>
                </CardContent>
              </Card>

              {/* Formas de Pagamento */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Formas de Pagamento
                    </div>
                    <Button size="sm" variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Gerencie seus métodos de pagamento e cartões salvos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Cartões Salvos */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-slate-700">Cartões Salvos</h4>
                    
                    <div className="text-center py-4 text-slate-500">
                      <CreditCardIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Nenhum cartão salvo</p>
                      <p className="text-xs">Adicione um cartão para pagamentos mais rápidos</p>
                    </div>
                  </div>

                  {/* Métodos de Pagamento Disponíveis */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-slate-700">Métodos Disponíveis</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                        <CreditCardIcon className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-medium text-sm">Cartão de Crédito</p>
                          <p className="text-xs text-slate-500">Visa, Mastercard, etc.</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                        <Smartphone className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="font-medium text-sm">PIX</p>
                          <p className="text-xs text-slate-500">Pagamento instantâneo</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                        <Banknote className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="font-medium text-sm">Boleto</p>
                          <p className="text-xs text-slate-500">Pagamento à vista</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Histórico de Pagamentos */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-slate-700">Últimos Pagamentos</h4>
                    
                    <div className="text-center py-4 text-slate-500">
                      <CreditCard className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Nenhum pagamento encontrado</p>
                      <p className="text-xs">Seus pagamentos aparecerão aqui</p>
                    </div>

                    <Button variant="ghost" size="sm" className="w-full text-slate-600">
                      Ver histórico completo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Ações Rápidas */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={() => navigate('/precos')}
                    className="w-full"
                    variant="outline"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Ver Planos
                  </Button>

                  <Button
                    onClick={() => navigate('/comprar-creditos')}
                    className="w-full"
                    variant="outline"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Comprar Créditos
                  </Button>

                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair da Conta
                  </Button>
                </CardContent>
              </Card>

              {/* Status da Conta */}
              <Card>
                <CardHeader>
                  <CardTitle>Status da Conta</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Tipo de conta:</span>
                      <Badge variant="outline">
                        {user.tipoPlano === 'professor' ? 'Professor' : 'Aluno'}
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm">Status:</span>
                      <Badge variant={user.ativa !== false ? "default" : "secondary"}>
                        {user.ativa !== false ? 'Ativa' : 'Inativa'}
                      </Badge>
                    </div>

                    {user.tokens && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Créditos:</span>
                        <Badge variant="outline">{user.tokens}</Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Perfil