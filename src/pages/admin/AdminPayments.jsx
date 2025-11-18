import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminService } from '@/services/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DollarSign, Calendar, CreditCard } from 'lucide-react'

export default function AdminPayments() {
  const navigate = useNavigate()
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!adminService.isAdmin()) {
      navigate('/login')
      return
    }

    loadPayments()
  }, [navigate])

  const loadPayments = async () => {
    try {
      setLoading(true)
      const data = await adminService.listPayments(100)
      setPayments(data.payments || [])
    } catch (err) {
      console.error('Erro ao carregar pagamentos:', err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      'paid': { label: 'Pago', color: 'bg-green-500' },
      'PAID': { label: 'Pago', color: 'bg-green-500' },
      'pending': { label: 'Pendente', color: 'bg-yellow-500' },
      'PENDING': { label: 'Pendente', color: 'bg-yellow-500' },
      'waiting': { label: 'Aguardando', color: 'bg-blue-500' },
      'WAITING': { label: 'Aguardando', color: 'bg-blue-500' },
      'failed': { label: 'Falhou', color: 'bg-red-500' },
      'FAILED': { label: 'Falhou', color: 'bg-red-500' },
      'cancelled': { label: 'Cancelado', color: 'bg-gray-500' },
      'CANCELLED': { label: 'Cancelado', color: 'bg-gray-500' },
      'refunded': { label: 'Reembolsado', color: 'bg-purple-500' },
      'REFUNDED': { label: 'Reembolsado', color: 'bg-purple-500' }
    }

    const info = statusMap[status] || { label: status, color: 'bg-gray-500' }
    return <Badge className={info.color}>{info.label}</Badge>
  }

  const getPaymentMethod = (method) => {
    const methods = {
      'credit_card': 'Cartão de Crédito',
      'CREDIT_CARD': 'Cartão de Crédito',
      'boleto': 'Boleto',
      'BOLETO': 'Boleto',
      'pix': 'PIX',
      'PIX': 'PIX',
      'debit_card': 'Cartão de Débito',
      'DEBIT_CARD': 'Cartão de Débito'
    }
    return methods[method] || method || 'N/A'
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      let date
      if (dateString.seconds) {
        date = new Date(dateString.seconds * 1000)
      } else {
        date = new Date(dateString)
      }
      return date.toLocaleString('pt-BR')
    } catch {
      return 'Data inválida'
    }
  }

  const formatCurrency = (value) => {
    if (!value) return 'R$ 0,00'
    // Se o valor já estiver em centavos, dividir por 100
    const amount = typeof value === 'number' ? value / 100 : parseFloat(value)
    return `R$ ${amount.toFixed(2)}`
  }

  const calculateTotalRevenue = () => {
    return payments
      .filter(p => p.status === 'paid' || p.status === 'PAID')
      .reduce((sum, p) => sum + (p.amount || 0), 0) / 100
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando pagamentos...</p>
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Histórico de Pagamentos</h1>
        <p className="text-gray-600">Total: {payments.length} transações</p>
      </div>

      {/* Resumo financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Transações</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payments.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagamentos Aprovados</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {payments.filter(p => p.status === 'paid' || p.status === 'PAID').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {calculateTotalRevenue().toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de pagamentos */}
      <div className="space-y-4">
        {payments.map((payment) => (
          <Card key={payment.id}>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="font-semibold text-lg">
                      {formatCurrency(payment.amount)}
                    </h3>
                    {getStatusBadge(payment.status)}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-500">ID da Transação:</p>
                      <p className="font-mono text-xs">{payment.id}</p>
                    </div>

                    {payment.userId && (
                      <div>
                        <p className="text-gray-500">Usuário ID:</p>
                        <p className="font-mono text-xs">{payment.userId}</p>
                      </div>
                    )}

                    {payment.subscriptionId && (
                      <div>
                        <p className="text-gray-500">Assinatura ID:</p>
                        <p className="font-mono text-xs">{payment.subscriptionId}</p>
                      </div>
                    )}

                    <div>
                      <p className="text-gray-500">Método de Pagamento:</p>
                      <p>{getPaymentMethod(payment.paymentMethod)}</p>
                    </div>

                    <div>
                      <p className="text-gray-500">Data da Transação:</p>
                      <p>{formatDate(payment.createdAt)}</p>
                    </div>

                    {payment.paidAt && (
                      <div>
                        <p className="text-gray-500">Data do Pagamento:</p>
                        <p>{formatDate(payment.paidAt)}</p>
                      </div>
                    )}
                  </div>

                  {payment.description && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-500">Descrição:</p>
                      <p className="text-sm">{payment.description}</p>
                    </div>
                  )}
                </div>

                {payment.metadata && (
                  <div className="md:w-64">
                    <details className="text-sm">
                      <summary className="cursor-pointer font-semibold">
                        Ver detalhes
                      </summary>
                      <pre className="mt-2 text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                        {JSON.stringify(payment.metadata, null, 2)}
                      </pre>
                    </details>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {payments.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">Nenhum pagamento encontrado</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
