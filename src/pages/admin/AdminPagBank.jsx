import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminService } from '@/services/admin'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  CreditCard,
  DollarSign,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Settings,
  TrendingUp,
  Calendar,
  Zap
} from 'lucide-react'

export default function AdminPagBank() {
  const navigate = useNavigate()
  const [pagBankInfo, setPagBankInfo] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [editingConfig, setEditingConfig] = useState(false)
  const [configForm, setConfigForm] = useState({
    appId: '',
    clientId: '',
    clientSecret: '',
    email: '',
    token: '',
    environment: 'sandbox'
  })

  const loadPaymentsFromBackend = useCallback(async () => {
    try {
      // Carregar pagamentos através do adminService
      const paymentsData = await adminService.listPayments(100)
      const payments = paymentsData.payments || []

      // Filtrar apenas pagamentos PagBank (baseado no método ou referência)
      const pagBankPayments = payments.filter(p =>
        p.paymentMethod?.includes('pagbank') ||
        p.paymentMethod?.includes('PagBank') ||
        p.reference_id?.includes('pagbank') ||
        p.id?.startsWith('ORDE_') ||
        p.id?.startsWith('CHAR_')
      )

      // Converter para o formato esperado
      const ordersData = pagBankPayments.map(payment => ({
        id: payment.id,
        reference_id: payment.reference_id || payment.id,
        customer: {
          name: payment.customerName || 'Cliente',
          email: payment.customerEmail || 'cliente@exemplo.com'
        },
        amount: payment.amount || 0,
        status: payment.status || 'UNKNOWN',
        payment_method: payment.paymentMethod || 'UNKNOWN',
        created_at: payment.createdAt || payment.created_at,
        paid_at: payment.paidAt || payment.paid_at,
        description: payment.description || 'Pagamento Escrita360'
      }))

      setOrders(ordersData)
    } catch (err) {
      console.error('Erro ao carregar pagamentos:', err)
      // Em caso de erro, manter lista vazia
      setOrders([])
    }
  }, [])

  const loadPagBankInfo = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Carregar configurações do PagBank através do backend
      const config = await adminService.getPagBankConfig()
      setPagBankInfo(config)

      // Carregar pagamentos através do adminService (que usa o backend)
      await loadPaymentsFromBackend()

    } catch (err) {
      console.error('Erro ao carregar informações PagBank:', err)
      setError('Erro ao carregar informações do PagBank. Verifique sua conexão.')
    } finally {
      setLoading(false)
    }
  }, [loadPaymentsFromBackend])

  const refreshData = async () => {
    setRefreshing(true)
    await loadPagBankInfo()
    setRefreshing(false)
  }

  const startEditingConfig = () => {
    setConfigForm({
      appId: pagBankInfo?.appId || '',
      clientId: pagBankInfo?.clientId || '',
      clientSecret: '',
      email: pagBankInfo?.email || '',
      token: '',
      environment: pagBankInfo?.environment || 'sandbox'
    })
    setEditingConfig(true)
  }

  const cancelEditingConfig = () => {
    setEditingConfig(false)
    setConfigForm({
      appId: '',
      clientId: '',
      clientSecret: '',
      email: '',
      token: '',
      environment: 'sandbox'
    })
  }

  const saveConfig = async () => {
    try {
      setLoading(true)
      await adminService.updatePagBankConfig(configForm)
      setEditingConfig(false)
      await loadPagBankInfo() // Recarregar as configurações
    } catch (err) {
      console.error('Erro ao salvar configurações:', err)
      setError('Erro ao salvar configurações do PagBank.')
    } finally {
      setLoading(false)
    }
  }

  const handleConfigChange = (field, value) => {
    setConfigForm(prev => ({ ...prev, [field]: value }))
  }

  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case 'PAID':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'WAITING':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'DECLINED':
      case 'FAILED':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      'PAID': { label: 'Pago', color: 'bg-green-500' },
      'WAITING': { label: 'Aguardando', color: 'bg-yellow-500' },
      'DECLINED': { label: 'Recusado', color: 'bg-red-500' },
      'FAILED': { label: 'Falhou', color: 'bg-red-500' },
      'AUTHORIZED': { label: 'Autorizado', color: 'bg-blue-500' },
      'CANCELLED': { label: 'Cancelado', color: 'bg-gray-500' }
    }

    const info = statusMap[status] || { label: status || 'Desconhecido', color: 'bg-gray-500' }
    return <Badge className={info.color}>{info.label}</Badge>
  }

  const getPaymentMethodBadge = (method) => {
    const methodMap = {
      'CREDIT_CARD': { label: 'Cartão de Crédito', color: 'bg-blue-500' },
      'DEBIT_CARD': { label: 'Cartão de Débito', color: 'bg-purple-500' },
      'PIX': { label: 'PIX', color: 'bg-green-500' },
      'BOLETO': { label: 'Boleto', color: 'bg-orange-500' }
    }

    const info = methodMap[method] || { label: method || 'Desconhecido', color: 'bg-gray-500' }
    return <Badge className={info.color}>{info.label}</Badge>
  }

  const formatCurrency = (value) => {
    if (!value) return 'R$ 0,00'
    return `R$ ${(value / 100).toFixed(2)}`
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      return date.toLocaleString('pt-BR')
    } catch {
      return 'Data inválida'
    }
  }

  const calculateStats = () => {
    const totalOrders = orders.length
    const paidOrders = orders.filter(o => o.status === 'PAID').length
    const totalRevenue = orders
      .filter(o => o.status === 'PAID')
      .reduce((sum, o) => sum + o.amount, 0)

    return {
      totalOrders,
      paidOrders,
      totalRevenue,
      successRate: totalOrders > 0 ? ((paidOrders / totalOrders) * 100).toFixed(1) : 0
    }
  }

  useEffect(() => {
    if (!adminService.isAdmin()) {
      navigate('/login')
      return
    }

    loadPagBankInfo()
  }, [navigate, loadPagBankInfo])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando informações do PagBank...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-4">
          {error}
        </div>
        <Button onClick={loadPagBankInfo}>Tentar Novamente</Button>
      </div>
    )
  }

  const stats = calculateStats()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="outline" onClick={() => navigate('/admin')}>
          ← Voltar ao Dashboard
        </Button>
      </div>

      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">PagBank - Informações do Gateway</h1>
          <p className="text-gray-600">Monitoramento e controle da integração PagBank</p>
        </div>
        <Button onClick={refreshData} disabled={refreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Atualizando...' : 'Atualizar'}
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="orders">Pedidos</TabsTrigger>
          <TabsTrigger value="config">Configuração</TabsTrigger>
          <TabsTrigger value="stats">Estatísticas</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Status da Conexão */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Status da Conexão
              </CardTitle>
              <CardDescription>
                Informações sobre a configuração atual do PagBank
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${pagBankInfo?.environment === 'sandbox' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                  <div>
                    <p className="font-medium">Ambiente</p>
                    <p className="text-sm text-gray-600 capitalize">{pagBankInfo?.environment}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${pagBankInfo?.tokenConfigured ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <div>
                    <p className="font-medium">Token de Acesso</p>
                    <p className="text-sm text-gray-600">
                      {pagBankInfo?.tokenConfigured ? 'Configurado' : 'Não configurado'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${pagBankInfo?.baseUrl ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <div>
                    <p className="font-medium">API URL</p>
                    <p className="text-sm text-gray-600 font-mono text-xs">{pagBankInfo?.baseUrl}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estatísticas Rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Pedidos</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalOrders}</div>
                <p className="text-xs text-muted-foreground">Pedidos monitorados</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pagamentos Aprovados</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.paidOrders}</div>
                <p className="text-xs text-muted-foreground">Transações bem-sucedidas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.successRate}%</div>
                <p className="text-xs text-muted-foreground">Pedidos aprovados</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(stats.totalRevenue)}
                </div>
                <p className="text-xs text-muted-foreground">Valor processado</p>
              </CardContent>
            </Card>
          </div>

          {/* Métodos de Pagamento Disponíveis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Métodos de Pagamento Disponíveis
              </CardTitle>
              <CardDescription>
                Formas de pagamento suportadas pela integração PagBank
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <CreditCard className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <p className="font-medium">Cartão de Crédito</p>
                  <p className="text-sm text-gray-600">Visa, Mastercard, etc.</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <CreditCard className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <p className="font-medium">Cartão de Débito</p>
                  <p className="text-sm text-gray-600">Débito instantâneo</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <p className="font-medium">PIX</p>
                  <p className="text-sm text-gray-600">Pagamento instantâneo</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Calendar className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                  <p className="font-medium">Boleto</p>
                  <p className="text-sm text-gray-600">Pagamento à vista</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pedidos Recentes</CardTitle>
              <CardDescription>
                Lista dos pedidos consultados na API do PagBank
              </CardDescription>
            </CardHeader>
            <CardContent>
              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(order.status)}
                          <h3 className="font-semibold">{formatCurrency(order.amount)}</h3>
                          {getStatusBadge(order.status)}
                          {getPaymentMethodBadge(order.payment_method)}
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatDate(order.created_at)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">ID do Pedido:</p>
                          <p className="font-mono text-xs">{order.id}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Referência:</p>
                          <p className="font-mono text-xs">{order.reference_id}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Cliente:</p>
                          <p>{order.customer?.name} ({order.customer?.email})</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Descrição:</p>
                          <p>{order.description}</p>
                        </div>
                        {order.paid_at && (
                          <div>
                            <p className="text-gray-500">Pago em:</p>
                            <p>{formatDate(order.paid_at)}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Nenhum pedido encontrado</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Os pedidos são consultados diretamente da API do PagBank
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Configurações Atuais</CardTitle>
                  <CardDescription>
                    Detalhes da configuração do PagBank no ambiente atual
                  </CardDescription>
                </div>
                {!editingConfig ? (
                  <Button onClick={startEditingConfig} variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Editar Configurações
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={saveConfig} disabled={loading}>
                      Salvar
                    </Button>
                    <Button onClick={cancelEditingConfig} variant="outline" disabled={loading}>
                      Cancelar
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ambiente</label>
                    {editingConfig ? (
                      <select
                        value={configForm.environment}
                        onChange={(e) => handleConfigChange('environment', e.target.value)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="sandbox">Sandbox</option>
                        <option value="production">Produção</option>
                      </select>
                    ) : (
                      <p className="mt-1 p-2 bg-gray-50 rounded capitalize">{pagBankInfo?.environment}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Token de Acesso</label>
                    {editingConfig ? (
                      <input
                        type="password"
                        value={configForm.token}
                        onChange={(e) => handleConfigChange('token', e.target.value)}
                        placeholder="Digite o token do PagBank"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="mt-1 p-2 bg-gray-50 rounded font-mono text-xs">
                        {pagBankInfo?.tokenConfigured ? '••••••••••••••••' : 'Não configurado'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">URL da API</label>
                    <p className="mt-1 p-2 bg-gray-50 rounded font-mono text-xs">{pagBankInfo?.baseUrl}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">App ID</label>
                    {editingConfig ? (
                      <input
                        type="text"
                        value={configForm.appId}
                        onChange={(e) => handleConfigChange('appId', e.target.value)}
                        placeholder="Digite o App ID"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="mt-1 p-2 bg-gray-50 rounded">
                        {pagBankInfo?.appId || 'Não configurado'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Client ID</label>
                    {editingConfig ? (
                      <input
                        type="text"
                        value={configForm.clientId}
                        onChange={(e) => handleConfigChange('clientId', e.target.value)}
                        placeholder="Digite o Client ID"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="mt-1 p-2 bg-gray-50 rounded">
                        {pagBankInfo?.clientId || 'Não configurado'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Client Secret</label>
                    {editingConfig ? (
                      <input
                        type="password"
                        value={configForm.clientSecret}
                        onChange={(e) => handleConfigChange('clientSecret', e.target.value)}
                        placeholder="Digite o Client Secret"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="mt-1 p-2 bg-gray-50 rounded">
                        {pagBankInfo?.clientSecret ? '••••••••' : 'Não configurado'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email da Conta</label>
                    {editingConfig ? (
                      <input
                        type="email"
                        value={configForm.email}
                        onChange={(e) => handleConfigChange('email', e.target.value)}
                        placeholder="Digite o email da conta PagBank"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="mt-1 p-2 bg-gray-50 rounded">
                        {pagBankInfo?.email || 'Não configurado'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Modo Simulação</label>
                    <p className="mt-1 p-2 bg-gray-50 rounded">
                      {pagBankInfo?.mockMode ? 'Ativado' : 'Desativado'}
                    </p>
                  </div>
                </div>

                {editingConfig && (
                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-medium text-yellow-900 mb-2">⚠️ Importante</h4>
                    <p className="text-sm text-yellow-800">
                      As configurações são salvas no arquivo <code>.env</code> do servidor. 
                      Após salvar, será necessário reiniciar o servidor para que as mudanças entrem em vigor.
                    </p>
                  </div>
                )}

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">URLs dos Endpoints</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Pagamentos:</span>
                      <span className="font-mono ml-2">{pagBankInfo?.baseUrl}/orders</span>
                    </div>
                    <div>
                      <span className="font-medium">Assinaturas:</span>
                      <span className="font-mono ml-2">https://sandbox.api.pagseguro.com/subscriptions</span>
                    </div>
                    <div>
                      <span className="font-medium">Chaves Públicas:</span>
                      <span className="font-mono ml-2">{pagBankInfo?.baseUrl}/public-keys</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas Detalhadas</CardTitle>
              <CardDescription>
                Análise detalhada dos pagamentos processados pelo PagBank
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-4">Distribuição por Status</h4>
                  <div className="space-y-2">
                    {Object.entries(
                      orders.reduce((acc, order) => {
                        acc[order.status] = (acc[order.status] || 0) + 1
                        return acc
                      }, {})
                    ).map(([status, count]) => (
                      <div key={status} className="flex justify-between">
                        <span className="flex items-center gap-2">
                          {getStatusIcon(status)}
                          {status}
                        </span>
                        <span className="font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-4">Distribuição por Método</h4>
                  <div className="space-y-2">
                    {Object.entries(
                      orders.reduce((acc, order) => {
                        acc[order.payment_method] = (acc[order.payment_method] || 0) + 1
                        return acc
                      }, {})
                    ).map(([method, count]) => (
                      <div key={method} className="flex justify-between">
                        <span>{method}</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium mb-4">Resumo Financeiro</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(stats.totalRevenue)}
                    </p>
                    <p className="text-sm text-green-700">Receita Total</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(
                        orders.reduce((sum, o) => sum + o.amount, 0)
                      )}
                    </p>
                    <p className="text-sm text-blue-700">Volume Total</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">
                      {stats.successRate}%
                    </p>
                    <p className="text-sm text-purple-700">Taxa de Aprovação</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}