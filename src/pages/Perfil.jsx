import React, { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  User, Mail, Calendar, CreditCard, LogOut, Plus, CreditCardIcon,
  Smartphone, Banknote, Eye, EyeOff, Trash2, Star, Key, Copy, Check,
  MapPin, Phone, Shield, Save, X, Pencil, FileText, ChevronRight, Hash
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { firebasePaymentService, firebaseProfileService } from '@/services/firebase'
import { toast } from 'sonner'

// ── Helpers de formatação ──────────────────────────────────────────

const formatCPF = (v) => {
  const d = v.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 3) return d
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`
}

const formatPhone = (v) => {
  const d = v.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 2) return d.length ? `(${d}` : ''
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

const formatCEP = (v) => {
  const d = v.replace(/\D/g, '').slice(0, 8)
  if (d.length <= 5) return d
  return `${d.slice(0, 5)}-${d.slice(5)}`
}

const formatDate = (v) => {
  const d = v.replace(/\D/g, '').slice(0, 8)
  if (d.length <= 2) return d
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`
}

const formatCardNumber = (v) => {
  const d = v.replace(/\D/g, '').slice(0, 16)
  return d.replace(/(.{4})/g, '$1 ').trim()
}

const formatExpiryDate = (v) => {
  const d = v.replace(/\D/g, '').slice(0, 4)
  if (d.length <= 2) return d
  return `${d.slice(0, 2)}/${d.slice(2)}`
}

const parseDateToBR = (dateStr) => {
  if (!dateStr) return ''
  if (dateStr.includes('/')) return dateStr
  const parts = dateStr.split('-')
  if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`
  return dateStr
}

const parseDateToISO = (dateStr) => {
  if (!dateStr) return ''
  const d = dateStr.replace(/\D/g, '')
  if (d.length !== 8) return dateStr
  return `${d.slice(4, 8)}-${d.slice(2, 4)}-${d.slice(0, 2)}`
}

const ESTADOS_BR = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS',
  'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC',
  'SP', 'SE', 'TO'
]

// ── Componente de campo de exibição ────────────────────────────────

const ProfileField = ({ icon: FieldIcon, label, value, displayValue, emptyText = 'Não informado' }) => (
  <div className="flex items-start gap-3 py-3">
    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
      <FieldIcon className="h-4 w-4" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-slate-800">
        {displayValue || value || <span className="text-slate-400 italic">{emptyText}</span>}
      </p>
    </div>
  </div>
)

// ── Seção: informações pessoais ────────────────────────────────────

const PersonalInfoSection = ({ user, audience, onSaved }) => {
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    nome: '', cpf: '', telefone: '', dataNascimento: '', genero: ''
  })

  useEffect(() => {
    if (user) {
      setForm({
        nome: user.nome || '',
        cpf: user.cpf ? formatCPF(user.cpf) : '',
        telefone: user.telefone ? formatPhone(user.telefone) : '',
        dataNascimento: parseDateToBR(user.dataNascimento || ''),
        genero: user.genero || ''
      })
    }
  }, [user])

  const handleSave = async () => {
    try {
      setSaving(true)
      await firebaseProfileService.updatePersonalInfo(user.uid, {
        nome: form.nome.trim(),
        cpf: form.cpf,
        telefone: form.telefone.replace(/\D/g, ''),
        dataNascimento: parseDateToISO(form.dataNascimento),
        genero: form.genero
      }, audience)
      toast.success('Informações pessoais atualizadas!')
      setEditing(false)
      onSaved?.()
    } catch (err) {
      console.error(err)
      toast.error('Erro ao salvar informações')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setForm({
      nome: user.nome || '',
      cpf: user.cpf ? formatCPF(user.cpf) : '',
      telefone: user.telefone ? formatPhone(user.telefone) : '',
      dataNascimento: parseDateToBR(user.dataNascimento || ''),
      genero: user.genero || ''
    })
    setEditing(false)
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">Informações Pessoais</CardTitle>
          </div>
          {!editing ? (
            <Button size="sm" variant="ghost" onClick={() => setEditing(true)} className="gap-1.5 text-blue-600 hover:text-blue-700">
              <Pencil className="h-3.5 w-3.5" />
              Editar
            </Button>
          ) : (
            <div className="flex gap-1.5">
              <Button size="sm" variant="ghost" onClick={handleCancel} disabled={saving}>
                <X className="h-4 w-4" />
              </Button>
              <Button size="sm" onClick={handleSave} disabled={saving} className="gap-1.5">
                <Save className="h-3.5 w-3.5" />
                {saving ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          )}
        </div>
        <CardDescription>Seus dados de identificação</CardDescription>
      </CardHeader>
      <CardContent>
        {editing ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="nome">Nome completo</Label>
              <Input
                id="nome"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                placeholder="Seu nome completo"
              />
            </div>
            <div>
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                value={form.cpf}
                onChange={(e) => setForm({ ...form, cpf: formatCPF(e.target.value) })}
                placeholder="000.000.000-00"
                maxLength={14}
              />
            </div>
            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={form.telefone}
                onChange={(e) => setForm({ ...form, telefone: formatPhone(e.target.value) })}
                placeholder="(00) 00000-0000"
                maxLength={15}
              />
            </div>
            <div>
              <Label htmlFor="dataNascimento">Data de nascimento</Label>
              <Input
                id="dataNascimento"
                value={form.dataNascimento}
                onChange={(e) => setForm({ ...form, dataNascimento: formatDate(e.target.value) })}
                placeholder="DD/MM/AAAA"
                maxLength={10}
              />
            </div>
            <div>
              <Label htmlFor="genero">Gênero</Label>
              <Select value={form.genero} onValueChange={(v) => setForm({ ...form, genero: v })}>
                <SelectTrigger id="genero">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="masculino">Masculino</SelectItem>
                  <SelectItem value="feminino">Feminino</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                  <SelectItem value="prefiro-nao-dizer">Prefiro não dizer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            <ProfileField icon={User} label="Nome completo" value={user.nome} />
            <ProfileField icon={Hash} label="CPF" value={user.cpf} displayValue={user.cpf ? formatCPF(user.cpf) : ''} />
            <ProfileField icon={Phone} label="Telefone" value={user.telefone} displayValue={user.telefone ? formatPhone(user.telefone) : ''} />
            <ProfileField icon={Calendar} label="Data de nascimento" value={user.dataNascimento} displayValue={parseDateToBR(user.dataNascimento || '')} />
            <ProfileField
              icon={User}
              label="Gênero"
              value={user.genero}
              displayValue={
                user.genero === 'masculino' ? 'Masculino' :
                user.genero === 'feminino' ? 'Feminino' :
                user.genero === 'outro' ? 'Outro' :
                user.genero === 'prefiro-nao-dizer' ? 'Prefiro não dizer' : ''
              }
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ── Seção: email / contato ─────────────────────────────────────────

const EmailSection = ({ user, audience, onSaved }) => {
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [emailContato, setEmailContato] = useState('')

  useEffect(() => {
    setEmailContato(user?.emailContato || user?.email || '')
  }, [user])

  const handleSave = async () => {
    if (!emailContato.trim() || !emailContato.includes('@')) {
      toast.error('Informe um email válido')
      return
    }
    try {
      setSaving(true)
      await firebaseProfileService.updateEmail(user.uid, emailContato, audience)
      toast.success('Email de contato atualizado!')
      setEditing(false)
      onSaved?.()
    } catch {
      toast.error('Erro ao atualizar email')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-green-600" />
            <CardTitle className="text-lg">Email e Contato</CardTitle>
          </div>
          {!editing ? (
            <Button size="sm" variant="ghost" onClick={() => setEditing(true)} className="gap-1.5 text-blue-600 hover:text-blue-700">
              <Pencil className="h-3.5 w-3.5" />
              Editar
            </Button>
          ) : (
            <div className="flex gap-1.5">
              <Button size="sm" variant="ghost" onClick={() => { setEditing(false); setEmailContato(user?.emailContato || user?.email || '') }} disabled={saving}>
                <X className="h-4 w-4" />
              </Button>
              <Button size="sm" onClick={handleSave} disabled={saving} className="gap-1.5">
                <Save className="h-3.5 w-3.5" />
                {saving ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          )}
        </div>
        <CardDescription>Email da conta e email de contato</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-slate-100">
          <div className="flex items-start gap-3 py-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
              <Shield className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Email da conta (login)</p>
              <p className="mt-0.5 text-sm font-medium text-slate-800">{user.email}</p>
              <div className="mt-1">
                <Badge variant={user.emailVerificado ? "default" : "secondary"} className="text-xs">
                  {user.emailVerificado ? "Verificado" : "Não verificado"}
                </Badge>
              </div>
            </div>
          </div>

          {editing ? (
            <div className="py-3">
              <Label htmlFor="emailContato">Email de contato</Label>
              <p className="mb-2 text-xs text-slate-500">
                Use um email diferente para receber notificações e cobranças
              </p>
              <Input
                id="emailContato"
                type="email"
                value={emailContato}
                onChange={(e) => setEmailContato(e.target.value)}
                placeholder="contato@email.com"
              />
            </div>
          ) : (
            <ProfileField
              icon={Mail}
              label="Email de contato"
              value={user.emailContato || user.email}
              emptyText="Mesmo email da conta"
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// ── Seção: endereço ────────────────────────────────────────────────

const AddressSection = ({ user, audience, onSaved }) => {
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loadingCep, setLoadingCep] = useState(false)
  const [form, setForm] = useState({
    cep: '', logradouro: '', numero: '', complemento: '',
    bairro: '', cidade: '', estado: ''
  })

  useEffect(() => {
    if (user?.endereco) {
      setForm({
        cep: user.endereco.cep ? formatCEP(user.endereco.cep) : '',
        logradouro: user.endereco.logradouro || '',
        numero: user.endereco.numero || '',
        complemento: user.endereco.complemento || '',
        bairro: user.endereco.bairro || '',
        cidade: user.endereco.cidade || '',
        estado: user.endereco.estado || ''
      })
    }
  }, [user])

  const handleCepBlur = async () => {
    const cep = form.cep.replace(/\D/g, '')
    if (cep.length !== 8) return
    try {
      setLoadingCep(true)
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      const data = await res.json()
      if (!data.erro) {
        setForm((prev) => ({
          ...prev,
          logradouro: data.logradouro || prev.logradouro,
          bairro: data.bairro || prev.bairro,
          cidade: data.localidade || prev.cidade,
          estado: data.uf || prev.estado
        }))
      }
    } catch {
      // silently ignore CEP lookup failures
    } finally {
      setLoadingCep(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      await firebaseProfileService.updateAddress(user.uid, {
        cep: form.cep,
        logradouro: form.logradouro,
        numero: form.numero,
        complemento: form.complemento,
        bairro: form.bairro,
        cidade: form.cidade,
        estado: form.estado
      }, audience)
      toast.success('Endereço atualizado!')
      setEditing(false)
      onSaved?.()
    } catch {
      toast.error('Erro ao salvar endereço')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (user?.endereco) {
      setForm({
        cep: user.endereco.cep ? formatCEP(user.endereco.cep) : '',
        logradouro: user.endereco.logradouro || '',
        numero: user.endereco.numero || '',
        complemento: user.endereco.complemento || '',
        bairro: user.endereco.bairro || '',
        cidade: user.endereco.cidade || '',
        estado: user.endereco.estado || ''
      })
    } else {
      setForm({ cep: '', logradouro: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '' })
    }
    setEditing(false)
  }

  const hasAddress = user?.endereco && (user.endereco.logradouro || user.endereco.cep)

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-orange-500" />
            <CardTitle className="text-lg">Endereço</CardTitle>
          </div>
          {!editing ? (
            <Button size="sm" variant="ghost" onClick={() => setEditing(true)} className="gap-1.5 text-blue-600 hover:text-blue-700">
              <Pencil className="h-3.5 w-3.5" />
              {hasAddress ? 'Editar' : 'Adicionar'}
            </Button>
          ) : (
            <div className="flex gap-1.5">
              <Button size="sm" variant="ghost" onClick={handleCancel} disabled={saving}>
                <X className="h-4 w-4" />
              </Button>
              <Button size="sm" onClick={handleSave} disabled={saving} className="gap-1.5">
                <Save className="h-3.5 w-3.5" />
                {saving ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          )}
        </div>
        <CardDescription>Endereço para faturamento e correspondência</CardDescription>
      </CardHeader>
      <CardContent>
        {editing ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="cep">CEP</Label>
              <Input
                id="cep"
                value={form.cep}
                onChange={(e) => setForm({ ...form, cep: formatCEP(e.target.value) })}
                onBlur={handleCepBlur}
                placeholder="00000-000"
                maxLength={9}
              />
              {loadingCep && <p className="mt-1 text-xs text-blue-500">Buscando CEP...</p>}
            </div>
            <div>
              <Label htmlFor="estado">Estado</Label>
              <Select value={form.estado} onValueChange={(v) => setForm({ ...form, estado: v })}>
                <SelectTrigger id="estado">
                  <SelectValue placeholder="UF" />
                </SelectTrigger>
                <SelectContent>
                  {ESTADOS_BR.map((uf) => (
                    <SelectItem key={uf} value={uf}>{uf}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="logradouro">Logradouro</Label>
              <Input
                id="logradouro"
                value={form.logradouro}
                onChange={(e) => setForm({ ...form, logradouro: e.target.value })}
                placeholder="Rua, Avenida, etc."
              />
            </div>
            <div>
              <Label htmlFor="numero">Número</Label>
              <Input
                id="numero"
                value={form.numero}
                onChange={(e) => setForm({ ...form, numero: e.target.value })}
                placeholder="Nº"
              />
            </div>
            <div>
              <Label htmlFor="complemento">Complemento</Label>
              <Input
                id="complemento"
                value={form.complemento}
                onChange={(e) => setForm({ ...form, complemento: e.target.value })}
                placeholder="Apto, bloco, etc."
              />
            </div>
            <div>
              <Label htmlFor="bairro">Bairro</Label>
              <Input
                id="bairro"
                value={form.bairro}
                onChange={(e) => setForm({ ...form, bairro: e.target.value })}
                placeholder="Bairro"
              />
            </div>
            <div>
              <Label htmlFor="cidade">Cidade</Label>
              <Input
                id="cidade"
                value={form.cidade}
                onChange={(e) => setForm({ ...form, cidade: e.target.value })}
                placeholder="Cidade"
              />
            </div>
          </div>
        ) : hasAddress ? (
          <div className="divide-y divide-slate-100">
            <ProfileField icon={MapPin} label="CEP" value={user.endereco?.cep} displayValue={user.endereco?.cep ? formatCEP(user.endereco.cep) : ''} />
            <ProfileField
              icon={MapPin}
              label="Endereço"
              value={[user.endereco?.logradouro, user.endereco?.numero].filter(Boolean).join(', ')}
            />
            {user.endereco?.complemento && (
              <ProfileField icon={MapPin} label="Complemento" value={user.endereco.complemento} />
            )}
            <ProfileField
              icon={MapPin}
              label="Localidade"
              value={[user.endereco?.bairro, user.endereco?.cidade, user.endereco?.estado].filter(Boolean).join(' – ')}
            />
          </div>
        ) : (
          <div className="py-6 text-center text-slate-400">
            <MapPin className="mx-auto mb-2 h-8 w-8 opacity-40" />
            <p className="text-sm">Nenhum endereço cadastrado</p>
            <p className="text-xs">Adicione seu endereço para faturamento</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ── Seção: métodos de pagamento ────────────────────────────────────

const PaymentMethodsSection = ({ user, audience }) => {
  const [methods, setMethods] = useState([])
  const [loading, setLoading] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedType, setSelectedType] = useState('')
  const [cardForm, setCardForm] = useState({ number: '', expiry: '', cvv: '', holderName: '' })
  const [boletoForm, setBoletoForm] = useState({ name: '', cpf: '', email: '' })

  const collectionName = audience === 'professor' || audience === 'professores' ? 'professores' : 'estudantes'

  const loadMethods = useCallback(async () => {
    if (!user?.uid) return
    try {
      setLoading(true)
      const m = await firebasePaymentService.getPaymentMethods(user.uid, collectionName)
      setMethods(m.filter((item) => !item.deleted))
    } catch {
      toast.error('Erro ao carregar métodos de pagamento')
    } finally {
      setLoading(false)
    }
  }, [user?.uid, collectionName])

  useEffect(() => { loadMethods() }, [loadMethods])

  const setDefault = async (id) => {
    try {
      setLoading(true)
      await firebasePaymentService.setDefaultPaymentMethod(user.uid, id, collectionName)
      await loadMethods()
      toast.success('Método padrão atualizado')
    } catch {
      toast.error('Erro ao atualizar')
    } finally {
      setLoading(false)
    }
  }

  const remove = async (id) => {
    try {
      setLoading(true)
      await firebasePaymentService.removePaymentMethod(user.uid, id, collectionName)
      await loadMethods()
      toast.success('Método removido')
    } catch {
      toast.error('Erro ao remover')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      let paymentData = {}

      if (selectedType === 'card') {
        const parts = cardForm.expiry.split('/')
        const cardNumber = cardForm.number.replace(/\s/g, '')
        let brand = 'unknown'
        if (cardNumber.startsWith('4')) brand = 'visa'
        else if (cardNumber.startsWith('5') || cardNumber.startsWith('2')) brand = 'mastercard'
        else if (cardNumber.startsWith('3')) brand = 'amex'

        if (!cardNumber || !parts[0] || !parts[1] || !cardForm.cvv || !cardForm.holderName) {
          toast.error('Preencha todos os campos do cartão')
          return
        }

        paymentData = {
          type: 'card',
          card: {
            number: cardNumber,
            expiryMonth: parseInt(parts[0]),
            expiryYear: parseInt(parts[1]),
            cvv: cardForm.cvv,
            holderName: cardForm.holderName,
            brand
          }
        }
      } else if (selectedType === 'boleto') {
        if (!boletoForm.name || !boletoForm.cpf || !boletoForm.email) {
          toast.error('Preencha todos os campos')
          return
        }
        paymentData = {
          type: 'boleto',
          boleto: { name: boletoForm.name, cpf: boletoForm.cpf, email: boletoForm.email }
        }
      }

      await firebasePaymentService.addPaymentMethod(user.uid, paymentData, collectionName)
      setShowAddForm(false)
      setSelectedType('')
      setCardForm({ number: '', expiry: '', cvv: '', holderName: '' })
      setBoletoForm({ name: '', cpf: '', email: '' })
      await loadMethods()
      toast.success('Método adicionado!')
    } catch {
      toast.error('Erro ao adicionar método')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-purple-600" />
            <CardTitle className="text-lg">Métodos de Pagamento</CardTitle>
          </div>
          <Button size="sm" variant="outline" onClick={() => { setShowAddForm(true); setSelectedType('card') }} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Adicionar
          </Button>
        </div>
        <CardDescription>Cartões e métodos de pagamento salvos</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {methods.length === 0 && !showAddForm ? (
          <div className="py-6 text-center text-slate-400">
            <CreditCardIcon className="mx-auto mb-2 h-8 w-8 opacity-40" />
            <p className="text-sm">Nenhum método de pagamento salvo</p>
            <p className="text-xs">Adicione um cartão ou boleto</p>
          </div>
        ) : (
          <div className="space-y-2">
            {methods.map((m) => (
              <div key={m.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-3 transition-colors hover:bg-slate-50/50">
                <div className="flex items-center gap-3">
                  {m.type === 'card' && <CreditCardIcon className="h-5 w-5 text-blue-600" />}
                  {m.type === 'pix' && <Smartphone className="h-5 w-5 text-green-600" />}
                  {m.type === 'boleto' && <Banknote className="h-5 w-5 text-purple-600" />}
                  <div>
                    {m.type === 'card' && m.card && (
                      <>
                        <p className="text-sm font-medium">•••• {m.card.last4}</p>
                        <p className="text-xs text-slate-500">{m.card.brand} · Exp. {m.card.expiryMonth}/{m.card.expiryYear}</p>
                      </>
                    )}
                    {m.type === 'pix' && <p className="text-sm font-medium">PIX</p>}
                    {m.type === 'boleto' && <p className="text-sm font-medium">Boleto</p>}
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {m.isDefault ? (
                    <Badge variant="default" className="text-xs"><Star className="mr-1 h-3 w-3" />Padrão</Badge>
                  ) : (
                    <Button size="sm" variant="ghost" className="text-xs" onClick={() => setDefault(m.id)} disabled={loading}>
                      Tornar padrão
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-50 hover:text-red-600" onClick={() => remove(m.id)} disabled={loading}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showAddForm && (
          <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="font-semibold">Adicionar método</h4>
              <Button size="sm" variant="ghost" onClick={() => { setShowAddForm(false); setSelectedType('') }}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-3">
              <button
                className={`flex items-center gap-2 rounded-lg border-2 p-3 text-left text-sm transition-colors ${selectedType === 'card' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:bg-slate-100'}`}
                onClick={() => setSelectedType('card')}
              >
                <CreditCardIcon className="h-4 w-4 text-blue-600" />
                <span className="font-medium">Cartão</span>
              </button>
              <button
                className={`flex items-center gap-2 rounded-lg border-2 p-3 text-left text-sm transition-colors ${selectedType === 'boleto' ? 'border-purple-500 bg-purple-50' : 'border-slate-200 hover:bg-slate-100'}`}
                onClick={() => setSelectedType('boleto')}
              >
                <Banknote className="h-4 w-4 text-purple-600" />
                <span className="font-medium">Boleto</span>
              </button>
            </div>

            {selectedType === 'card' && (
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Label>Número do cartão</Label>
                  <Input
                    value={cardForm.number}
                    onChange={(e) => setCardForm({ ...cardForm, number: formatCardNumber(e.target.value) })}
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                  />
                </div>
                <div>
                  <Label>Validade</Label>
                  <Input
                    value={cardForm.expiry}
                    onChange={(e) => setCardForm({ ...cardForm, expiry: formatExpiryDate(e.target.value) })}
                    placeholder="MM/AA"
                    maxLength={5}
                  />
                </div>
                <div>
                  <Label>CVV</Label>
                  <Input
                    value={cardForm.cvv}
                    onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                    placeholder="000"
                    maxLength={4}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label>Nome do titular</Label>
                  <Input
                    value={cardForm.holderName}
                    onChange={(e) => setCardForm({ ...cardForm, holderName: e.target.value })}
                    placeholder="Como no cartão"
                  />
                </div>
              </div>
            )}

            {selectedType === 'boleto' && (
              <div className="space-y-3">
                <div>
                  <Label>Nome completo</Label>
                  <Input value={boletoForm.name} onChange={(e) => setBoletoForm({ ...boletoForm, name: e.target.value })} placeholder="Nome no documento" />
                </div>
                <div>
                  <Label>CPF</Label>
                  <Input value={boletoForm.cpf} onChange={(e) => setBoletoForm({ ...boletoForm, cpf: formatCPF(e.target.value) })} placeholder="000.000.000-00" maxLength={14} />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input type="email" value={boletoForm.email} onChange={(e) => setBoletoForm({ ...boletoForm, email: e.target.value })} placeholder="seu@email.com" />
                </div>
              </div>
            )}

            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => { setShowAddForm(false); setSelectedType('') }}>Cancelar</Button>
              <Button onClick={handleSave} disabled={loading}>
                {loading ? 'Salvando...' : 'Adicionar'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ── Seção: histórico de transações ─────────────────────────────────

const TransactionHistorySection = ({ user, audience }) => {
  const [history, setHistory] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [loading, setLoading] = useState(false)
  const collectionName = audience === 'professor' || audience === 'professores' ? 'professores' : 'estudantes'

  const load = async () => {
    try {
      setLoading(true)
      const h = await firebasePaymentService.getTransactionHistory(user.uid, { limit: 10 }, collectionName)
      setHistory(h)
      setLoaded(true)
    } catch {
      toast.error('Erro ao carregar histórico')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-slate-500" />
          <CardTitle className="text-lg">Histórico de Pagamentos</CardTitle>
        </div>
        <CardDescription>Últimas transações realizadas</CardDescription>
      </CardHeader>
      <CardContent>
        {!loaded ? (
          <div className="py-4 text-center">
            <Button variant="outline" onClick={load} disabled={loading} className="gap-2">
              <Eye className="h-4 w-4" />
              {loading ? 'Carregando...' : 'Carregar histórico'}
            </Button>
          </div>
        ) : history.length === 0 ? (
          <div className="py-6 text-center text-slate-400">
            <CreditCard className="mx-auto mb-2 h-8 w-8 opacity-40" />
            <p className="text-sm">Nenhum pagamento encontrado</p>
          </div>
        ) : (
          <div className="space-y-2">
            {history.slice(0, 5).map((t) => (
              <div key={t.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                <div className="flex items-center gap-3">
                  {t.paymentMethodType === 'card' && <CreditCardIcon className="h-4 w-4 text-blue-600" />}
                  {t.paymentMethodType === 'pix' && <Smartphone className="h-4 w-4 text-green-600" />}
                  {t.paymentMethodType === 'boleto' && <Banknote className="h-4 w-4 text-purple-600" />}
                  {!t.paymentMethodType && <CreditCard className="h-4 w-4 text-slate-400" />}
                  <div>
                    <p className="text-sm font-medium">R$ {(t.amount / 100).toFixed(2).replace('.', ',')}</p>
                    <p className="text-xs text-slate-500">{t.description || 'Pagamento'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge
                    variant={
                      t.status === 'completed' ? 'default' :
                      t.status === 'pending' ? 'secondary' :
                      t.status === 'failed' ? 'destructive' : 'outline'
                    }
                    className="text-xs"
                  >
                    {t.status === 'completed' ? 'Concluído' :
                     t.status === 'pending' ? 'Pendente' :
                     t.status === 'failed' ? 'Falhou' : t.status}
                  </Badge>
                  <p className="mt-1 text-xs text-slate-500">
                    {t.createdAt?.toDate?.()?.toLocaleDateString('pt-BR') || ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ── Página principal do perfil ─────────────────────────────────────

const Perfil = () => {
  const { user, logout, refreshUser } = useAuth()
  const navigate = useNavigate()
  const [showAppPassword, setShowAppPassword] = useState(false)
  const [copiedPassword, setCopiedPassword] = useState(false)

  const audience = user?.tipoPlano === 'professor' ? 'professor' : 'aluno'

  useEffect(() => {
    if (!user) navigate('/login')
  }, [user, navigate])

  if (!user) return null

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch {
      console.error('Erro ao fazer logout')
    }
  }

  const memberSince = (() => {
    if (!user.criadoEm) return null
    try {
      if (user.criadoEm.seconds) return new Date(user.criadoEm.seconds * 1000).toLocaleDateString('pt-BR')
      if (user.criadoEm.toDate) return user.criadoEm.toDate().toLocaleDateString('pt-BR')
      return new Date(user.criadoEm).toLocaleDateString('pt-BR')
    } catch {
      return null
    }
  })()

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8 sm:py-12">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl">

          {/* Header do perfil */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-2xl font-bold text-white shadow-lg">
                {(user.nome || user.email || '?')[0].toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{user.nome || 'Meu Perfil'}</h1>
                <p className="text-sm text-slate-500">{user.email}</p>
                {memberSince && (
                  <p className="text-xs text-slate-400">Membro desde {memberSince}</p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="gap-1 px-3 py-1.5 text-sm">
                {user.tipoPlano === 'professor' ? 'Professor' : 'Aluno'}
              </Badge>
              <Badge variant={user.ativa !== false ? "default" : "secondary"} className="gap-1 px-3 py-1.5 text-sm">
                {user.ativa !== false ? 'Conta Ativa' : 'Conta Inativa'}
              </Badge>
            </div>
          </div>

          {/* Conteúdo principal com tabs */}
          <Tabs defaultValue="dados" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 sm:w-auto sm:grid-cols-4">
              <TabsTrigger value="dados" className="gap-1.5">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Dados Pessoais</span>
                <span className="sm:hidden">Dados</span>
              </TabsTrigger>
              <TabsTrigger value="endereco" className="gap-1.5">
                <MapPin className="h-4 w-4" />
                Endereço
              </TabsTrigger>
              <TabsTrigger value="pagamento" className="gap-1.5">
                <CreditCard className="h-4 w-4" />
                <span className="hidden sm:inline">Pagamento</span>
                <span className="sm:hidden">Pagar</span>
              </TabsTrigger>
              <TabsTrigger value="conta" className="gap-1.5">
                <Shield className="h-4 w-4" />
                Conta
              </TabsTrigger>
            </TabsList>

            {/* Aba: Dados Pessoais */}
            <TabsContent value="dados" className="space-y-6">
              <PersonalInfoSection user={user} audience={audience} onSaved={refreshUser} />
              <EmailSection user={user} audience={audience} onSaved={refreshUser} />
            </TabsContent>

            {/* Aba: Endereço */}
            <TabsContent value="endereco">
              <AddressSection user={user} audience={audience} onSaved={refreshUser} />
            </TabsContent>

            {/* Aba: Pagamento */}
            <TabsContent value="pagamento" className="space-y-6">
              <PaymentMethodsSection user={user} audience={audience} />
              <TransactionHistorySection user={user} audience={audience} />
            </TabsContent>

            {/* Aba: Conta */}
            <TabsContent value="conta" className="space-y-6">
              {/* Status da conta */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-lg">Status da Conta</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-lg border border-slate-200 p-4 text-center">
                      <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Tipo de conta</p>
                      <p className="mt-1 text-lg font-semibold text-slate-800">
                        {user.tipoPlano === 'professor' ? 'Professor' : 'Aluno'}
                      </p>
                    </div>
                    <div className="rounded-lg border border-slate-200 p-4 text-center">
                      <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Status</p>
                      <p className={`mt-1 text-lg font-semibold ${user.ativa !== false ? 'text-green-600' : 'text-red-500'}`}>
                        {user.ativa !== false ? 'Ativa' : 'Inativa'}
                      </p>
                    </div>
                    {user.tokens != null && (
                      <div className="rounded-lg border border-slate-200 p-4 text-center">
                        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Créditos</p>
                        <p className="mt-1 text-lg font-semibold text-blue-600">{user.tokens}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Senha do app */}
              {user.senhaApp && (
                <Card className="border-blue-200 bg-blue-50/30">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Key className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-lg">Senha do App</CardTitle>
                    </div>
                    <CardDescription>Use esta senha para fazer login no aplicativo</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Input
                          type={showAppPassword ? "text" : "password"}
                          value={user.senhaApp}
                          readOnly
                          className="bg-white pr-20 font-mono"
                        />
                        <div className="absolute right-1 top-1/2 flex -translate-y-1/2 gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => setShowAppPassword(!showAppPassword)}
                          >
                            {showAppPassword ? <EyeOff className="h-4 w-4 text-slate-500" /> : <Eye className="h-4 w-4 text-slate-500" />}
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
                            {copiedPassword ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4 text-slate-500" />}
                          </Button>
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      Senha gerada ao adquirir seu plano. Guarde-a em local seguro.
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Ações rápidas */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Ações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button onClick={() => navigate('/precos')} variant="outline" className="w-full justify-between gap-2">
                    <span className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Ver Planos
                    </span>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </Button>
                  <Button onClick={() => navigate('/comprar-creditos')} variant="outline" className="w-full justify-between gap-2">
                    <span className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Comprar Créditos
                    </span>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </Button>
                  <Separator className="my-3" />
                  <Button onClick={handleLogout} variant="outline" className="w-full justify-start gap-2 text-red-600 hover:bg-red-50 hover:text-red-700">
                    <LogOut className="h-4 w-4" />
                    Sair da Conta
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default Perfil
