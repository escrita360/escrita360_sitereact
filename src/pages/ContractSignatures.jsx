import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { contractSignatureService } from '@/services/firebase'
import { FileText, Search, Calendar, User, Mail, Phone, CheckCircle } from 'lucide-react'

function ContractSignatures() {
  const [signatures, setSignatures] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchUserId, setSearchUserId] = useState('')
  const [searchEmail] = useState('')
  const [audience, setAudience] = useState('alunos')

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A'
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleString('pt-BR')
  }

  const handleSearch = async () => {
    if (!searchUserId && !searchEmail) {
      alert('Digite um ID de usuário ou email para buscar')
      return
    }

    setLoading(true)
    try {
      const userId = searchUserId || searchEmail
      const result = await contractSignatureService.getUserContractSignatures(userId, audience)
      setSignatures(result)
    } catch (error) {
      console.error('Erro ao buscar assinaturas:', error)
      alert('Erro ao buscar assinaturas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-2">
            <FileText className="w-8 h-8 text-brand-primary" />
            Assinaturas de Contratos
          </h1>
          <p className="text-slate-600">
            Visualize e gerencie as assinaturas de termos e condições dos usuários
          </p>
        </div>

        {/* Formulário de Busca */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Buscar Assinaturas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="searchUserId">ID do Usuário</Label>
                <Input
                  id="searchUserId"
                  value={searchUserId}
                  onChange={(e) => setSearchUserId(e.target.value)}
                  placeholder="UID ou email..."
                />
              </div>
              <div>
                <Label htmlFor="audience">Audiência</Label>
                <select
                  id="audience"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md"
                >
                  <option value="alunos">Alunos</option>
                  <option value="professores">Professores</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button onClick={handleSearch} disabled={loading} className="w-full">
                  {loading ? 'Buscando...' : 'Buscar'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Assinaturas */}
        {signatures.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900">
              {signatures.length} assinatura(s) encontrada(s)
            </h2>
            
            {signatures.map((signature) => (
              <Card key={signature.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      {signature.contractType === 'terms_and_conditions' 
                        ? 'Termos e Condições' 
                        : signature.contractType}
                    </CardTitle>
                    <div className="text-sm text-slate-500">
                      ID: {signature.id}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Informações do Usuário */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-slate-700 flex items-center gap-1">
                        <User className="w-4 h-4" />
                        Usuário
                      </h4>
                      <div className="text-sm space-y-1">
                        <p><strong>Nome:</strong> {signature.userName || 'N/A'}</p>
                        <p><strong>Email:</strong> {signature.userEmail || 'N/A'}</p>
                        <p><strong>Telefone:</strong> {signature.userPhone || 'N/A'}</p>
                        {signature.userCpf && (
                          <p><strong>CPF:</strong> {signature.userCpf}</p>
                        )}
                      </div>
                    </div>

                    {/* Informações do Contrato */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-slate-700 flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        Contrato
                      </h4>
                      <div className="text-sm space-y-1">
                        <p><strong>Versão:</strong> {signature.contractVersion || 'N/A'}</p>
                        <p><strong>Contexto:</strong> {signature.signatureContext || 'N/A'}</p>
                        <p><strong>Status:</strong> 
                          <span className="ml-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            {signature.status}
                          </span>
                        </p>
                        {signature.planType && (
                          <p><strong>Plano:</strong> {signature.planType}</p>
                        )}
                      </div>
                    </div>

                    {/* Informações da Assinatura */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-slate-700 flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Assinatura
                      </h4>
                      <div className="text-sm space-y-1">
                        <p><strong>Data:</strong> {formatDate(signature.acceptedAt)}</p>
                        <p><strong>Criado em:</strong> {formatDate(signature.createdAt)}</p>
                        {signature.ipAddress && (
                          <p><strong>IP:</strong> {signature.ipAddress}</p>
                        )}
                        {signature.userAgent && (
                          <p><strong>User Agent:</strong> 
                            <span className="block text-xs text-slate-500 mt-1">
                              {signature.userAgent.substring(0, 100)}...
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Metadata */}
                  {signature.metadata && Object.keys(signature.metadata).length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="font-semibold text-slate-700 mb-2">Metadados</h4>
                      <div className="bg-slate-100 p-3 rounded-md">
                        <pre className="text-xs text-slate-600 overflow-x-auto">
                          {JSON.stringify(signature.metadata, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {signatures.length === 0 && !loading && (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">
                Faça uma busca para visualizar as assinaturas de contratos
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default ContractSignatures