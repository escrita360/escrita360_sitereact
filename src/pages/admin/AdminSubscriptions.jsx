import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminService } from '@/services/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function AdminSubscriptions() {
  const navigate = useNavigate()
  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)

  useEffect(() => {
    if (!adminService.isAdmin()) {
      navigate('/login')
      return
    }

    loadSubscriptions()
  }, [navigate])

  const loadSubscriptions = async () => {
    try {
      setLoading(true)
      const data = await adminService.listSubscriptions(100)
      setSubscriptions(data.subscriptions || [])
    } catch (err) {
      console.error('Erro ao carregar assinaturas:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (subscriptionId, newStatus) => {
    try {
      setUpdating(subscriptionId)
      await adminService.updateSubscriptionStatus(subscriptionId, newStatus)
      alert('Status atualizado com sucesso!')
      loadSubscriptions()
    } catch (err) {
      alert('Erro ao atualizar status')
      console.error(err)
    } finally {
      setUpdating(null)
    }
  }

  const getStatusBadge = (status) => {
    const variants = {
      'active': 'bg-green-500',
      'ACTIVE': 'bg-green-500',
      'pending': 'bg-yellow-500',
      'PENDING': 'bg-yellow-500',
      'cancelled': 'bg-red-500',
      'CANCELLED': 'bg-red-500',
      'expired': 'bg-gray-500',
      'EXPIRED': 'bg-gray-500'
    }

    return (
      <Badge className={variants[status] || 'bg-gray-500'}>
        {status}
      </Badge>
    )
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      // Pode ser timestamp Firestore ou string ISO
      let date
      if (dateString.seconds) {
        date = new Date(dateString.seconds * 1000)
      } else {
        date = new Date(dateString)
      }
      return date.toLocaleDateString('pt-BR')
    } catch {
      return 'Data inválida'
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando assinaturas...</p>
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gerenciar Assinaturas</h1>
        <p className="text-gray-600">Total: {subscriptions.length} assinaturas</p>
      </div>

      {/* Lista de assinaturas */}
      <div className="space-y-4">
        {subscriptions.map((subscription) => (
          <Card key={subscription.id}>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    {subscription.planName || 'Plano sem nome'}
                  </h3>
                  <div className="space-y-1 text-sm">
                    <p><strong>ID:</strong> {subscription.id}</p>
                    <p><strong>Usuário ID:</strong> {subscription.userId || 'N/A'}</p>
                    {subscription.planId && (
                      <p><strong>Plano ID:</strong> {subscription.planId}</p>
                    )}
                    {subscription.amount && (
                      <p><strong>Valor:</strong> R$ {(subscription.amount / 100).toFixed(2)}</p>
                    )}
                    {subscription.interval && (
                      <p><strong>Intervalo:</strong> {subscription.interval}</p>
                    )}
                  </div>
                </div>

                <div>
                  <div className="mb-3">
                    <span className="text-sm font-semibold mr-2">Status:</span>
                    {getStatusBadge(subscription.status)}
                  </div>

                  <div className="space-y-1 text-sm mb-4">
                    <p><strong>Criado em:</strong> {formatDate(subscription.createdAt)}</p>
                    {subscription.nextBillingDate && (
                      <p><strong>Próx. cobrança:</strong> {formatDate(subscription.nextBillingDate)}</p>
                    )}
                    {subscription.updatedAt && (
                      <p><strong>Atualizado em:</strong> {formatDate(subscription.updatedAt)}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Alterar Status:</label>
                    <div className="flex gap-2">
                      <Select
                        onValueChange={(value) => handleUpdateStatus(subscription.id, value)}
                        disabled={updating === subscription.id}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Ativa</SelectItem>
                          <SelectItem value="pending">Pendente</SelectItem>
                          <SelectItem value="cancelled">Cancelada</SelectItem>
                          <SelectItem value="expired">Expirada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              {subscription.metadata && (
                <div className="mt-4 pt-4 border-t">
                  <details>
                    <summary className="cursor-pointer text-sm font-semibold">
                      Metadados
                    </summary>
                    <pre className="mt-2 text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                      {JSON.stringify(subscription.metadata, null, 2)}
                    </pre>
                  </details>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {subscriptions.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">Nenhuma assinatura encontrada</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
