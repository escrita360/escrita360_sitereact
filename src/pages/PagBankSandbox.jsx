import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  CreditCard, 
  QrCode, 
  Receipt, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Play,
  Loader2
} from 'lucide-react'
import { pagBankSandbox } from '@/services/pagbank-sandbox'

export default function PagBankSandboxPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [testResults, setTestResults] = useState(null)
  const [logs, setLogs] = useState([])
  const [activeTest, setActiveTest] = useState(null)

  const runFullTests = async () => {
    setIsLoading(true)
    setTestResults(null)
    setLogs([])
    
    try {
      const { results, logs: testLogs } = await pagBankSandbox.runAllTests()
      setTestResults(results)
      setLogs(testLogs)
    } catch (error) {
      console.error('Erro nos testes:', error)
      setLogs([{ 
        type: 'error', 
        message: error.message, 
        timestamp: new Date().toISOString() 
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const runSpecificTest = async (testType) => {
    setActiveTest(testType)
    setIsLoading(true)
    
    try {
      let result
      switch (testType) {
        case 'config':
          result = await pagBankSandbox.testConfiguration()
          break
        case 'customer':
          result = await pagBankSandbox.testCreateCustomer()
          break
        case 'card-approved':
          result = await pagBankSandbox.testCreditCardPayment('approved')
          break
        case 'card-declined':
          result = await pagBankSandbox.testCreditCardPayment('declined')
          break
        case 'pix':
          result = await pagBankSandbox.testPixPayment()
          break
        case 'boleto':
          result = await pagBankSandbox.testBoletoPayment()
          break
      }
      
      setTestResults({ [testType]: result })
      setLogs(pagBankSandbox.getLogs())
    } catch (error) {
      console.error('Erro no teste:', error)
      setLogs([{ 
        type: 'error', 
        message: error.message, 
        timestamp: new Date().toISOString() 
      }])
    } finally {
      setIsLoading(false)
      setActiveTest(null)
    }
  }

  const getStatusIcon = (success) => {
    if (success === true) return <CheckCircle className="w-4 h-4 text-green-500" />
    if (success === false) return <XCircle className="w-4 h-4 text-red-500" />
    return <AlertCircle className="w-4 h-4 text-yellow-500" />
  }

  const getLogIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />
      default: return <AlertCircle className="w-4 h-4 text-blue-500" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🧪 PagBank Sandbox - Ambiente de Testes
          </h1>
          <p className="text-gray-600">
            Teste todas as funcionalidades de pagamento PagBank em ambiente controlado
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="tests">Testes Individuais</TabsTrigger>
            <TabsTrigger value="results">Resultados</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Configuração */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <AlertCircle className="w-5 h-5" />
                    Configuração
                  </CardTitle>
                  <CardDescription>
                    Verifica tokens e variáveis de ambiente
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => runSpecificTest('config')}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading && activeTest === 'config' ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Play className="w-4 h-4 mr-2" />
                    )}
                    Testar Configuração
                  </Button>
                </CardContent>
              </Card>

              {/* Cartão de Crédito */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CreditCard className="w-5 h-5" />
                    Cartão de Crédito
                  </CardTitle>
                  <CardDescription>
                    Testa pagamentos aprovados e negados
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    onClick={() => runSpecificTest('card-approved')}
                    disabled={isLoading}
                    variant="outline"
                    className="w-full"
                  >
                    {isLoading && activeTest === 'card-approved' ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    )}
                    Cartão Aprovado
                  </Button>
                  <Button 
                    onClick={() => runSpecificTest('card-declined')}
                    disabled={isLoading}
                    variant="outline"
                    className="w-full"
                  >
                    {isLoading && activeTest === 'card-declined' ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <XCircle className="w-4 h-4 mr-2" />
                    )}
                    Cartão Negado
                  </Button>
                </CardContent>
              </Card>

              {/* PIX */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <QrCode className="w-5 h-5" />
                    PIX
                  </CardTitle>
                  <CardDescription>
                    Testa pagamento via PIX com QR Code
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => runSpecificTest('pix')}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading && activeTest === 'pix' ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Play className="w-4 h-4 mr-2" />
                    )}
                    Testar PIX
                  </Button>
                </CardContent>
              </Card>

              {/* Boleto */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Receipt className="w-5 h-5" />
                    Boleto Bancário
                  </CardTitle>
                  <CardDescription>
                    Testa geração de boleto bancário
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => runSpecificTest('boleto')}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading && activeTest === 'boleto' ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Play className="w-4 h-4 mr-2" />
                    )}
                    Testar Boleto
                  </Button>
                </CardContent>
              </Card>

              {/* Cliente */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    👤 Cliente
                  </CardTitle>
                  <CardDescription>
                    Testa criação de cliente no PagBank
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => runSpecificTest('customer')}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading && activeTest === 'customer' ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Play className="w-4 h-4 mr-2" />
                    )}
                    Testar Cliente
                  </Button>
                </CardContent>
              </Card>

              {/* Teste Completo */}
              <Card className="md:col-span-2 lg:col-span-1">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    🚀 Teste Completo
                  </CardTitle>
                  <CardDescription>
                    Executa todos os testes em sequência
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={runFullTests}
                    disabled={isLoading}
                    className="w-full"
                    size="lg"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Play className="w-4 h-4 mr-2" />
                    )}
                    Executar Todos os Testes
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Informações do Ambiente */}
            <Card>
              <CardHeader>
                <CardTitle>ℹ️ Informações do Ambiente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Ambiente</p>
                    <Badge variant="outline" className="mt-1">
                      {import.meta.env.VITE_PAGBANK_ENV || 'sandbox'}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Token</p>
                    <Badge variant={import.meta.env.VITE_PAGBANK_TOKEN ? 'default' : 'destructive'} className="mt-1">
                      {import.meta.env.VITE_PAGBANK_TOKEN ? 'Configurado' : 'Não configurado'}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Client ID</p>
                    <Badge variant={import.meta.env.VITE_PAGBANK_CLIENT_ID ? 'default' : 'destructive'} className="mt-1">
                      {import.meta.env.VITE_PAGBANK_CLIENT_ID ? 'Configurado' : 'Não configurado'}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Status</p>
                    <Badge variant="default" className="mt-1">
                      Pronto para testes
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            {testResults ? (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">📊 Resultados dos Testes</h3>
                
                <div className="grid gap-4">
                  {Object.entries(testResults).map(([test, result]) => (
                    <Card key={test}>
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center justify-between">
                          <span className="capitalize">{test.replace(/([A-Z])/g, ' $1').trim()}</span>
                          {getStatusIcon(result?.success)}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                          {JSON.stringify(result, null, 2)}
                        </pre>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <p className="text-gray-500">Execute um teste para ver os resultados aqui</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="logs" className="space-y-6">
            {logs.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    📝 Logs dos Testes
                    <Button 
                      onClick={() => {
                        setLogs([])
                        pagBankSandbox.clearLogs()
                      }}
                      variant="outline"
                      size="sm"
                    >
                      Limpar Logs
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-2">
                      {logs.map((log, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 rounded border">
                          {getLogIcon(log.type)}
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{log.message}</span>
                              <span className="text-xs text-gray-500">
                                {new Date(log.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                            {log.data && (
                              <pre className="mt-2 text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                                {JSON.stringify(log.data, null, 2)}
                              </pre>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <p className="text-gray-500">Execute um teste para ver os logs aqui</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}