import React, { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { User, Mail, Calendar, CreditCard, LogOut, Plus, CreditCardIcon, Smartphone, Banknote, Eye, EyeOff, Trash2, Star, Key, Copy, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { firebasePaymentService, getFirebaseForPlan } from '@/services/firebase'
import { updateDoc, doc } from 'firebase/firestore'
import { toast } from 'sonner'

const Perfil = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  // Estados para edição de perfil
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileForm, setProfileForm] = useState({
    name: '',
    cpf: ''
  })

  // Estados para métodos de pagamento
  const [paymentMethods, setPaymentMethods] = useState([])
  const [transactionHistory, setTransactionHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  // Estados para mostrar/ocultar e copiar senha do app
  const [showAppPassword, setShowAppPassword] = useState(false)
  const [copiedPassword, setCopiedPassword] = useState(false)

  // Estados para modal de adicionar cartão
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedPaymentType, setSelectedPaymentType] = useState('')
  const [cardForm, setCardForm] = useState({
    number: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    holderName: '',
    brand: ''
  })
  const [expiryFormatted, setExpiryFormatted] = useState('')
  const [boletoForm, setBoletoForm] = useState({
    name: '',
    cpf: '',
    email: ''
  })

  const loadPaymentMethods = useCallback(async () => {
    try {
      setLoading(true)
      const methods = await firebasePaymentService.getPaymentMethods(user.uid, user.tipoPlano === 'professor' ? 'professores' : 'estudantes')
      setPaymentMethods(methods.filter(method => !method.deleted))
    } catch (error) {
      console.error('Erro ao carregar métodos de pagamento:', error)
      toast.error('Erro ao carregar métodos de pagamento')
    } finally {
      setLoading(false)
    }
  }, [user?.uid, user?.tipoPlano])

  // Carregar métodos de pagamento ao montar o componente
  useEffect(() => {
    if (user?.uid) {
      loadPaymentMethods()
    }
  }, [user, loadPaymentMethods])

  // Inicializar formulário de perfil
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.nome || '',
        cpf: user.cpf || ''
      })
    }
  }, [user])

  const loadTransactionHistory = async () => {
    try {
      setLoading(true)
      const history = await firebasePaymentService.getTransactionHistory(user.uid, { limit: 10 }, user.tipoPlano === 'professor' ? 'professores' : 'estudantes')
      setTransactionHistory(history)
      setShowHistory(true)
    } catch (error) {
      console.error('Erro ao carregar histórico:', error)
      toast.error('Erro ao carregar histórico de pagamentos')
    } finally {
      setLoading(false)
    }
  }

  const handleAddPaymentMethod = (paymentType) => {
    setSelectedPaymentType(paymentType)
    setShowAddForm(true)
  }

  const handleSetDefaultPaymentMethod = async (paymentMethodId) => {
    try {
      setLoading(true)
      await firebasePaymentService.setDefaultPaymentMethod(user.uid, paymentMethodId, user.tipoPlano === 'professor' ? 'professores' : 'estudantes')
      await loadPaymentMethods() // Recarregar lista
      toast.success('Método de pagamento padrão atualizado')
    } catch (error) {
      console.error('Erro ao definir método padrão:', error)
      toast.error('Erro ao atualizar método padrão')
    } finally {
      setLoading(false)
    }
  }

  const handleRemovePaymentMethod = async (paymentMethodId) => {
    try {
      setLoading(true)
      await firebasePaymentService.removePaymentMethod(user.uid, paymentMethodId, user.tipoPlano === 'professor' ? 'professores' : 'estudantes')
      await loadPaymentMethods() // Recarregar lista
      toast.success('Método de pagamento removido')
    } catch (error) {
      console.error('Erro ao remover método de pagamento:', error)
      toast.error('Erro ao remover método de pagamento')
    } finally {
      setLoading(false)
    }
  }

  const handleSavePaymentMethod = async () => {
    try {
      setLoading(true)
      let paymentData = {}

      if (selectedPaymentType === 'card') {
        // Validar dados do cartão
        if (!cardForm.number || !cardForm.expiryMonth || !cardForm.expiryYear || !cardForm.cvv || !cardForm.holderName) {
          toast.error('Preencha todos os campos do cartão')
          return
        }

        // Detectar bandeira do cartão
        const cardNumber = cardForm.number.replace(/\s/g, '')
        let brand = 'unknown'
        if (cardNumber.startsWith('4')) brand = 'visa'
        else if (cardNumber.startsWith('5') || cardNumber.startsWith('2')) brand = 'mastercard'
        else if (cardNumber.startsWith('3')) brand = 'amex'

        paymentData = {
          type: 'card',
          card: {
            number: cardNumber,
            expiryMonth: parseInt(cardForm.expiryMonth),
            expiryYear: parseInt(cardForm.expiryYear),
            cvv: cardForm.cvv,
            holderName: cardForm.holderName,
            brand: brand
          }
        }
      } else if (selectedPaymentType === 'boleto') {
        if (!boletoForm.name || !boletoForm.cpf || !boletoForm.email) {
          toast.error('Preencha todos os campos do boleto')
          return
        }

        paymentData = {
          type: 'boleto',
          boleto: {
            name: boletoForm.name,
            cpf: boletoForm.cpf,
            email: boletoForm.email
          }
        }
      }

      await firebasePaymentService.addPaymentMethod(user.uid, paymentData, user.tipoPlano === 'professor' ? 'professores' : 'estudantes')

      // Limpar formulários e fechar modal
      resetForms()
      setShowAddForm(false)
      await loadPaymentMethods() // Recarregar lista

      toast.success('Método de pagamento adicionado com sucesso')
    } catch (error) {
      console.error('Erro ao salvar método de pagamento:', error)
      toast.error('Erro ao adicionar método de pagamento')
    } finally {
      setLoading(false)
    }
  }

  const resetForms = () => {
    setCardForm({
      number: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      holderName: '',
      brand: ''
    })
    setExpiryFormatted('')
    setBoletoForm({
      name: '',
      cpf: '',
      email: ''
    })
  }

  const handleCancelAdd = () => {
    resetForms()
    setShowAddForm(false)
    setSelectedPaymentType('')
  }

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const handleSaveProfile = async () => {
    try {
      setLoading(true)
      const db = getFirebaseForPlan(user.tipoPlano === 'professor' ? 'professor' : 'aluno')
      const userDocRef = doc(db, 'users', user.uid)
      await updateDoc(userDocRef, {
        nome: profileForm.name,
        cpf: profileForm.cpf
      })
      toast.success('Perfil atualizado com sucesso')
      setIsEditingProfile(false)
      // Atualizar o contexto do usuário se necessário
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      toast.error('Erro ao atualizar perfil')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  // Verificar se usuário está logado
  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  // Não renderizar se usuário não estiver logado
  if (!user) {
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
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Informações Pessoais
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsEditingProfile(!isEditingProfile)}
                    >
                      {isEditingProfile ? 'Cancelar' : 'Editar'}
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Suas informações básicas de cadastro
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditingProfile ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="profileName">Nome completo</Label>
                        <Input
                          id="profileName"
                          value={profileForm.name}
                          onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                          placeholder="Seu nome completo"
                        />
                      </div>
                      <div>
                        <Label htmlFor="profileCpf">CPF</Label>
                        <Input
                          id="profileCpf"
                          value={profileForm.cpf}
                          onChange={(e) => setProfileForm({ ...profileForm, cpf: e.target.value.replace(/[^0-9]/g, '') })}
                          placeholder="000.000.000-00"
                          maxLength={11}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleSaveProfile} disabled={loading}>
                          {loading ? 'Salvando...' : 'Salvar'}
                        </Button>
                        <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <User className="w-4 h-4 text-slate-500" />
                        <div>
                          <p className="font-medium">{user.nome || 'Nome não informado'}</p>
                          <p className="text-sm text-slate-500">Nome completo</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <User className="w-4 h-4 text-slate-500" />
                        <div>
                          <p className="font-medium">{user.cpf || 'CPF não informado'}</p>
                          <p className="text-sm text-slate-500">CPF</p>
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
                    </>
                  )}
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
                    <Button size="sm" variant="outline" onClick={() => handleAddPaymentMethod('card')}>
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

                    {paymentMethods.length === 0 ? (
                      <div className="text-center py-4 text-slate-500">
                        <CreditCardIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Nenhum cartão salvo</p>
                        <p className="text-xs">Adicione um cartão para pagamentos mais rápidos</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {paymentMethods.map((method) => (
                          <div key={method.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                            <div className="flex items-center gap-3">
                              {method.type === 'card' && <CreditCardIcon className="w-5 h-5 text-blue-600" />}
                              {method.type === 'pix' && <Smartphone className="w-5 h-5 text-green-600" />}
                              {method.type === 'boleto' && <Banknote className="w-5 h-5 text-purple-600" />}

                              <div>
                                {method.type === 'card' && method.card && (
                                  <>
                                    <p className="font-medium text-sm">
                                      •••• •••• •••• {method.card.last4}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                      {method.card.brand} • Expira {method.card.expiryMonth}/{method.card.expiryYear}
                                    </p>
                                  </>
                                )}
                                {method.type === 'pix' && (
                                  <>
                                    <p className="font-medium text-sm">PIX</p>
                                    <p className="text-xs text-slate-500">Pagamento instantâneo</p>
                                  </>
                                )}
                                {method.type === 'boleto' && (
                                  <>
                                    <p className="font-medium text-sm">Boleto</p>
                                    <p className="text-xs text-slate-500">Pagamento à vista</p>
                                  </>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {method.isDefault && (
                                <Badge variant="default" className="text-xs">
                                  <Star className="w-3 h-3 mr-1" />
                                  Padrão
                                </Badge>
                              )}

                              {!method.isDefault && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleSetDefaultPaymentMethod(method.id)}
                                  disabled={loading}
                                  className="text-xs"
                                >
                                  Tornar Padrão
                                </Button>
                              )}

                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleRemovePaymentMethod(method.id)}
                                disabled={loading}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Métodos de Pagamento Disponíveis */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-slate-700">Métodos Disponíveis</h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div
                        className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                        onClick={() => handleAddPaymentMethod('card')}
                      >
                        <CreditCardIcon className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-medium text-sm">Cartão de Crédito</p>
                          <p className="text-xs text-slate-500">Visa, Mastercard, etc.</p>
                        </div>
                      </div>

                      <div
                        className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                        onClick={() => handleAddPaymentMethod('boleto')}
                      >
                        <Banknote className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="font-medium text-sm">Boleto</p>
                          <p className="text-xs text-slate-500">Pagamento à vista</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Formulário para adicionar método de pagamento */}
                  {showAddForm && (
                    <div className="mt-6 p-6 border border-slate-200 rounded-lg bg-slate-50">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">
                          {selectedPaymentType === 'card' && 'Adicionar Cartão de Crédito'}
                          {selectedPaymentType === 'boleto' && 'Adicionar Dados para Boleto'}
                        </h3>
                        <Button variant="ghost" size="sm" onClick={handleCancelAdd}>
                          ✕
                        </Button>
                      </div>

                      <div className="space-y-4">
                        {selectedPaymentType === 'card' && (
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="cardNumber">Número do Cartão</Label>
                              <Input
                                id="cardNumber"
                                placeholder="1234 5678 9012 3456"
                                value={cardForm.number}
                                onChange={(e) => setCardForm({ ...cardForm, number: formatCardNumber(e.target.value) })}
                                maxLength={19}
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="expiry">Validade</Label>
                                <Input
                                  id="expiry"
                                  placeholder="MM/AA"
                                  value={expiryFormatted}
                                  onChange={(e) => {
                                    const formatted = formatExpiryDate(e.target.value)
                                    setExpiryFormatted(formatted)
                                    const parts = formatted.split('/')
                                    setCardForm({
                                      ...cardForm,
                                      expiryMonth: parts[0] || '',
                                      expiryYear: parts[1] || ''
                                    })
                                  }}
                                  maxLength={5}
                                />
                              </div>
                              <div>
                                <Label htmlFor="cvv">CVV</Label>
                                <Input
                                  id="cvv"
                                  placeholder="123"
                                  value={cardForm.cvv}
                                  onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value.replace(/[^0-9]/g, '') })}
                                  maxLength={4}
                                />
                              </div>
                            </div>

                            <div>
                              <Label htmlFor="holderName">Nome do Titular</Label>
                              <Input
                                id="holderName"
                                placeholder="Nome como aparece no cartão"
                                value={cardForm.holderName}
                                onChange={(e) => setCardForm({ ...cardForm, holderName: e.target.value })}
                              />
                            </div>
                          </div>
                        )}

                        {selectedPaymentType === 'boleto' && (
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="boletoName">Nome Completo</Label>
                              <Input
                                id="boletoName"
                                placeholder="Nome como no documento"
                                value={boletoForm.name}
                                onChange={(e) => setBoletoForm({ ...boletoForm, name: e.target.value })}
                              />
                            </div>

                            <div>
                              <Label htmlFor="boletoCpf">CPF</Label>
                              <Input
                                id="boletoCpf"
                                placeholder="000.000.000-00"
                                value={boletoForm.cpf}
                                onChange={(e) => setBoletoForm({ ...boletoForm, cpf: e.target.value.replace(/[^0-9]/g, '') })}
                                maxLength={11}
                              />
                            </div>

                            <div>
                              <Label htmlFor="boletoEmail">E-mail</Label>
                              <Input
                                id="boletoEmail"
                                type="email"
                                placeholder="seu@email.com"
                                value={boletoForm.email}
                                onChange={(e) => setBoletoForm({ ...boletoForm, email: e.target.value })}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-3 mt-6">
                        <Button variant="outline" onClick={handleCancelAdd}>
                          Cancelar
                        </Button>
                        <Button onClick={handleSavePaymentMethod} disabled={loading}>
                          {loading ? 'Salvando...' : 'Adicionar Método'}
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Histórico de Pagamentos */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-slate-700">Últimos Pagamentos</h4>

                    {!showHistory ? (
                      <>
                        <div className="text-center py-4 text-slate-500">
                          <CreditCard className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">Histórico não carregado</p>
                          <p className="text-xs">Clique para ver seus pagamentos</p>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full text-slate-600"
                          onClick={loadTransactionHistory}
                          disabled={loading}
                        >
                          {loading ? 'Carregando...' : 'Ver histórico completo'}
                        </Button>
                      </>
                    ) : (
                      <>
                        {transactionHistory.length === 0 ? (
                          <div className="text-center py-4 text-slate-500">
                            <CreditCard className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Nenhum pagamento encontrado</p>
                            <p className="text-xs">Seus pagamentos aparecerão aqui</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {transactionHistory.slice(0, 5).map((transaction) => (
                              <div key={transaction.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                                <div className="flex items-center gap-3">
                                  {transaction.paymentMethodType === 'card' && <CreditCardIcon className="w-4 h-4 text-blue-600" />}
                                  {transaction.paymentMethodType === 'pix' && <Smartphone className="w-4 h-4 text-green-600" />}
                                  {transaction.paymentMethodType === 'boleto' && <Banknote className="w-4 h-4 text-purple-600" />}

                                  <div>
                                    <p className="font-medium text-sm">
                                      R$ {(transaction.amount / 100).toFixed(2).replace('.', ',')}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                      {transaction.description || 'Pagamento'}
                                    </p>
                                  </div>
                                </div>

                                <div className="text-right">
                                  <Badge
                                    variant={
                                      transaction.status === 'completed' ? 'default' :
                                        transaction.status === 'pending' ? 'secondary' :
                                          transaction.status === 'failed' ? 'destructive' : 'outline'
                                    }
                                    className="text-xs"
                                  >
                                    {transaction.status === 'completed' ? 'Concluído' :
                                      transaction.status === 'pending' ? 'Pendente' :
                                        transaction.status === 'failed' ? 'Falhou' : transaction.status}
                                  </Badge>
                                  <p className="text-xs text-slate-500 mt-1">
                                    {transaction.createdAt?.toDate?.()?.toLocaleDateString('pt-BR') || 'Data não disponível'}
                                  </p>
                                </div>
                              </div>
                            ))}

                            {transactionHistory.length > 5 && (
                              <Button variant="ghost" size="sm" className="w-full text-slate-600">
                                <Eye className="w-4 h-4 mr-2" />
                                Ver todos ({transactionHistory.length})
                              </Button>
                            )}
                          </div>
                        )}
                      </>
                    )}
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

              {/* Senha do App - exibida apenas se o usuário tiver senhaApp salva */}
              {user.senhaApp && (
                <Card className="border-blue-200 bg-blue-50/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Key className="w-4 h-4 text-blue-600" />
                      Senha do App
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Use esta senha para fazer login no aplicativo
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 relative">
                          <Input
                            type={showAppPassword ? "text" : "password"}
                            value={user.senhaApp}
                            readOnly
                            className="pr-20 font-mono bg-white"
                          />
                          <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0"
                              onClick={() => setShowAppPassword(!showAppPassword)}
                            >
                              {showAppPassword ? (
                                <EyeOff className="w-4 h-4 text-slate-500" />
                              ) : (
                                <Eye className="w-4 h-4 text-slate-500" />
                              )}
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0"
                              onClick={() => {
                                navigator.clipboard.writeText(user.senhaApp)
                                setCopiedPassword(true)
                                toast.success('Senha copiada!')
                                setTimeout(() => setCopiedPassword(false), 2000)
                              }}
                            >
                              {copiedPassword ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <Copy className="w-4 h-4 text-slate-500" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500">
                        Esta é a senha gerada quando você adquiriu seu plano. Guarde-a em local seguro.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Perfil