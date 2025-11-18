import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminService } from '@/services/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, UserX, UserCheck, Shield, Eye } from 'lucide-react'

export default function AdminUsers() {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)

  useEffect(() => {
    if (!adminService.isAdmin()) {
      navigate('/login')
      return
    }

    loadUsers()
  }, [navigate])

  useEffect(() => {
    // Filtrar usuários baseado no termo de busca
    if (searchTerm) {
      const filtered = users.filter(user => 
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.uid.includes(searchTerm)
      )
      setFilteredUsers(filtered)
    } else {
      setFilteredUsers(users)
    }
  }, [searchTerm, users])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const data = await adminService.listUsers(100)
      setUsers(data.users || [])
      setFilteredUsers(data.users || [])
    } catch (err) {
      console.error('Erro ao carregar usuários:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDisableUser = async (uid, disabled) => {
    try {
      await adminService.setUserDisabled(uid, disabled)
      alert(`Usuário ${disabled ? 'desabilitado' : 'habilitado'} com sucesso!`)
      loadUsers()
    } catch (err) {
      alert('Erro ao atualizar usuário')
      console.error(err)
    }
  }

  const handleViewDetails = async (uid) => {
    try {
      const data = await adminService.getUser(uid)
      setSelectedUser(data)
    } catch (err) {
      alert('Erro ao carregar detalhes do usuário')
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando usuários...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="outline" onClick={() => navigate('/admin')}>
          ← Voltar ao Dashboard
        </Button>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gerenciar Usuários</h1>
        <p className="text-gray-600">Total: {users.length} usuários</p>
      </div>

      {/* Busca */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar por email, nome ou UID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Lista de usuários */}
      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <Card key={user.uid}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">
                      {user.displayName || 'Sem nome'}
                    </h3>
                    {user.disabled && (
                      <Badge variant="destructive">Desabilitado</Badge>
                    )}
                    {user.emailVerified && (
                      <Badge variant="success" className="bg-green-500">Verificado</Badge>
                    )}
                  </div>
                  <p className="text-gray-600 mb-1">{user.email}</p>
                  <p className="text-sm text-gray-500">UID: {user.uid}</p>
                  <div className="flex gap-4 mt-2 text-sm text-gray-500">
                    <span>Criado: {new Date(user.creationTime).toLocaleDateString('pt-BR')}</span>
                    {user.lastSignInTime && (
                      <span>Último acesso: {new Date(user.lastSignInTime).toLocaleDateString('pt-BR')}</span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(user.uid)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Detalhes
                  </Button>
                  
                  <Button
                    variant={user.disabled ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleDisableUser(user.uid, !user.disabled)}
                  >
                    {user.disabled ? (
                      <>
                        <UserCheck className="h-4 w-4 mr-1" />
                        Habilitar
                      </>
                    ) : (
                      <>
                        <UserX className="h-4 w-4 mr-1" />
                        Desabilitar
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredUsers.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">Nenhum usuário encontrado</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modal de detalhes do usuário */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Detalhes do Usuário</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Informações Básicas</h4>
                  <div className="bg-gray-50 p-4 rounded space-y-2">
                    <p><strong>Nome:</strong> {selectedUser.user.displayName || 'N/A'}</p>
                    <p><strong>Email:</strong> {selectedUser.user.email}</p>
                    <p><strong>UID:</strong> {selectedUser.user.uid}</p>
                    <p><strong>Status:</strong> {selectedUser.user.disabled ? 'Desabilitado' : 'Ativo'}</p>
                    <p><strong>Email verificado:</strong> {selectedUser.user.emailVerified ? 'Sim' : 'Não'}</p>
                  </div>
                </div>

                {selectedUser.subscriptions && selectedUser.subscriptions.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Assinaturas ({selectedUser.subscriptions.length})</h4>
                    <div className="space-y-2">
                      {selectedUser.subscriptions.map((sub, idx) => (
                        <div key={idx} className="bg-gray-50 p-3 rounded">
                          <div className="flex justify-between items-center">
                            <span>ID: {sub.id}</span>
                            <Badge>{sub.status || 'N/A'}</Badge>
                          </div>
                          {sub.planName && <p className="text-sm mt-1">Plano: {sub.planName}</p>}
                          {sub.amount && <p className="text-sm">Valor: R$ {(sub.amount / 100).toFixed(2)}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Button 
                  className="w-full" 
                  onClick={() => setSelectedUser(null)}
                >
                  Fechar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
