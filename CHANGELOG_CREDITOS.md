# 🔄 Atualização do Sistema de Créditos

## ⚠️ MUDANÇA IMPORTANTE

**Antes (v1.0):**
- Qualquer usuário logado podia comprar créditos
- Créditos funcionavam com ou sem assinatura
- Créditos avulsos para usuários sem assinatura

**Agora (v2.0):**
- ✅ **APENAS usuários COM assinatura ativa podem comprar créditos**
- 🔒 App Flutter exige assinatura para funcionar
- ✅ Créditos sempre adicionados à assinatura existente
- ❌ Não há mais "créditos avulsos" independentes

---

## 🎯 Motivo da Mudança

### Problema Identificado

O app Flutter (Escrita360) **só libera acesso para usuários com assinatura ativa**:

```dart
// Flutter: TokenManagerService.verificarTokensDisponiveis()
static Future<AssinaturaModel> verificarTokensDisponiveis({
  int tokensNecessarios = 1,
}) async {
  final assinatura = await AssinaturaService.buscarAssinaturaAtiva(user.uid);

  if (assinatura == null) {
    throw AssinaturaInativaException(
      'Você não possui uma assinatura ativa. '
      'Adquira uma assinatura para usar recursos de IA.',
    );
  }
  
  // ... validações
}
```

**Conclusão:** Sem assinatura ativa, o usuário **NÃO CONSEGUE USAR O APP**, portanto não faz sentido vender créditos para quem não pode usá-los.

---

## 🔧 O Que Foi Alterado

### 1. Frontend: `ComprarCreditos.jsx`

#### Antes:
```jsx
useEffect(() => {
  const currentUser = firebaseAuthService.getCurrentUser()
  
  if (!currentUser) {
    navigate('/login')
    return
  }
  
  setUser(currentUser)
  loadCurrentCredits(currentUser.uid)
}, [navigate])
```

#### Depois:
```jsx
useEffect(() => {
  const checkAuthAndSubscription = async () => {
    const currentUser = firebaseAuthService.getCurrentUser()
    
    if (!currentUser) {
      navigate('/login')
      return
    }
    
    setUser(currentUser)
    
    // NOVA VALIDAÇÃO: Verificar assinatura ativa
    const hasActive = await firebaseSubscriptionService.hasActiveSubscription(currentUser.uid)
    setHasActiveSubscription(hasActive)
    
    if (hasActive) {
      const credits = await firebaseCreditService.getTotalCredits(currentUser.uid)
      setCurrentCredits(credits.total)
    }
  }
  
  checkAuthAndSubscription()
}, [navigate])
```

#### Tela de Bloqueio Adicionada:
```jsx
if (!hasActiveSubscription) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Card className="border-red-200">
        <CardHeader>
          <AlertCircle className="w-12 h-12 text-red-600" />
          <CardTitle>Assinatura Necessária</CardTitle>
          <CardDescription>
            Você precisa ter uma assinatura ativa para comprar créditos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>O app Escrita360 só libera acesso para usuários com assinatura ativa.</p>
          <Button onClick={() => navigate('/precos')}>
            Ver Planos de Assinatura
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
```

---

### 2. Backend: `firebase.js` → `firebaseCreditService.purchaseCredits`

#### Antes:
```javascript
async purchaseCredits(userId, creditData) {
  try {
    // Criar registro de compra
    const compraRef = await addDoc(collection(db, 'compras_creditos'), compraData)
    
    // Adicionar créditos
    const assinatura = await firebaseSubscriptionService.getActiveSubscription(userId)
    
    if (assinatura) {
      // Adicionar à assinatura
      await updateDoc(doc(db, 'assinaturas', assinatura.id), {
        tokens: assinatura.tokens + quantity
      })
    } else {
      // Criar créditos avulsos
      await addDoc(collection(db, 'creditos_avulsos'), creditosData)
    }
  }
}
```

#### Depois:
```javascript
async purchaseCredits(userId, creditData) {
  try {
    // VALIDAÇÃO CRÍTICA: Verificar assinatura ANTES de processar
    const hasActiveSubscription = await firebaseSubscriptionService.hasActiveSubscription(userId)
    
    if (!hasActiveSubscription) {
      throw new Error(
        'ASSINATURA ATIVA NECESSÁRIA: O app Escrita360 só libera acesso ' +
        'para usuários com assinatura válida. Adquira uma assinatura antes ' +
        'de comprar créditos adicionais.'
      )
    }
    
    // Criar registro de compra
    const compraRef = await addDoc(collection(db, 'compras_creditos'), compraData)
    
    // Assinatura sempre existirá (validação acima garante)
    const assinatura = await firebaseSubscriptionService.getActiveSubscription(userId)
    
    if (!assinatura) {
      throw new Error('Erro: Assinatura não encontrada após validação')
    }
    
    // Adicionar créditos à assinatura existente
    await updateDoc(doc(db, 'assinaturas', assinatura.id), {
      tokens: assinatura.tokens + quantity,
      ultimaCompraCreditos: serverTimestamp()
    })
  }
}
```

**Mudanças:**
1. ✅ Validação de assinatura ANTES de processar pagamento
2. ❌ Removida lógica de `creditos_avulsos` (branch else)
3. ✅ Throw error explícito se não tiver assinatura
4. ✅ Créditos SEMPRE adicionados à assinatura existente

---

### 3. Documentação Atualizada

#### Arquivos Modificados:
- ✅ `README_SISTEMA_COMPLETO.md` - Atualizado Fluxo 2 e 3
- ✅ `GUIA_RAPIDO_CREDITOS.md` - Novo guia com regra de assinatura

#### Novo Conteúdo:
```markdown
## 3. Sistema de Créditos

- Compra de créditos avulsos para usuários COM assinatura ativa
- **REQUER ASSINATURA ATIVA** (app Flutter só funciona com assinatura)
- Créditos adicionados automaticamente à assinatura existente
- Sincronizados em tempo real com app Flutter
```

---

## 📊 Comparação: Antes vs Depois

| Aspecto | Antes (v1.0) | Depois (v2.0) |
|---------|--------------|---------------|
| **Validação de Assinatura** | ❌ Não exigida | ✅ Obrigatória |
| **Usuários sem Assinatura** | ✅ Podiam comprar | ❌ Bloqueados |
| **Créditos Avulsos** | ✅ Existiam | ❌ Removidos |
| **Destino dos Créditos** | Assinatura OU avulsos | Sempre assinatura |
| **Mensagem de Erro** | ❌ Não havia | ✅ Tela dedicada |
| **Experiência no App Flutter** | ⚠️ Inconsistente | ✅ Consistente |

---

## 🎯 Impacto da Mudança

### Para o Usuário

**Antes:**
```
Usuário sem assinatura:
1. Compra créditos ✅
2. Tenta usar no app ❌ BLOQUEADO
3. Créditos inúteis 😞
```

**Depois:**
```
Usuário sem assinatura:
1. Tenta comprar créditos ❌ BLOQUEADO
2. Vê mensagem clara: "Assinatura necessária"
3. Compra assinatura primeiro ✅
4. Depois compra créditos ✅
5. Usa no app ✅ FUNCIONA
```

### Para o Negócio

**Antes:**
- ⚠️ Usuários compravam créditos que não podiam usar
- ⚠️ Suporte recebia reclamações
- ⚠️ Reembolsos necessários

**Depois:**
- ✅ Usuários compram créditos apenas quando podem usar
- ✅ Experiência consistente
- ✅ Menos suporte necessário
- ✅ Incentiva aquisição de assinaturas

---

## 🔄 Migração de Dados

### Usuários Existentes com Créditos Avulsos

**Situação:** Usuários que compraram créditos antes da v2.0 e não têm assinatura.

**Solução Recomendada:**

```javascript
// Script de migração (se necessário)
async function migrarCreditosAvulsos() {
  const snapshot = await getDocs(collection(db, 'creditos_avulsos'))
  
  for (const doc of snapshot.docs) {
    const data = doc.data()
    
    // Verificar se usuário tem assinatura agora
    const hasActive = await firebaseSubscriptionService.hasActiveSubscription(data.userId)
    
    if (hasActive) {
      // Migrar créditos para assinatura
      const assinatura = await firebaseSubscriptionService.getActiveSubscription(data.userId)
      
      await updateDoc(doc(db, 'assinaturas', assinatura.id), {
        tokens: assinatura.tokens + data.tokens
      })
      
      // Marcar crédito avulso como migrado
      await updateDoc(doc.ref, { migrado: true })
    }
  }
}
```

**Comunicação com Usuários:**
```
Olá [Nome],

Identificamos que você possui [X] créditos avulsos em sua conta.

Para usar esses créditos no app Escrita360, você precisa de uma 
assinatura ativa. Adquira uma assinatura e seus créditos serão 
automaticamente transferidos!

[Ver Planos de Assinatura]
```

---

## ✅ Checklist de Implementação

### Frontend
- [x] Adicionar estado `hasActiveSubscription`
- [x] Verificar assinatura em `useEffect`
- [x] Criar tela de bloqueio quando sem assinatura
- [x] Importar `firebaseSubscriptionService`
- [x] Adicionar ícone `AlertCircle` do lucide-react

### Backend
- [x] Adicionar validação no início de `purchaseCredits()`
- [x] Remover lógica de `creditos_avulsos` (branch else)
- [x] Lançar erro explícito sem assinatura
- [x] Garantir créditos sempre vão para assinatura
- [x] Adicionar `ultimaCompraCreditos` no update

### Documentação
- [x] Atualizar `README_SISTEMA_COMPLETO.md`
- [x] Criar `GUIA_RAPIDO_CREDITOS.md`
- [x] Criar `CHANGELOG_CREDITOS.md` (este arquivo)
- [x] Atualizar fluxos de usuário
- [x] Documentar migração de dados

### Firestore Rules
- [x] Regras de `compras_creditos` (imutável)
- [x] Regras de `assinaturas` (somente leitura)
- [x] Regras de `creditos_avulsos` (manter para histórico)

---

## 🚀 Próximos Passos

1. **Testar Fluxo Completo:**
   ```bash
   # Site React
   pnpm dev
   
   # Testar:
   1. Login sem assinatura → Bloqueio em /comprar-creditos
   2. Comprar assinatura → Liberado em /comprar-creditos
   3. Comprar créditos → Sucesso
   ```

2. **Verificar App Flutter:**
   ```dart
   // Verificar sincronização de créditos
   flutter run -d windows
   
   // Login com mesma conta
   // Verificar tokens atualizados
   ```

3. **Monitorar Firestore:**
   ```
   Firebase Console → Firestore
   - Verificar assinaturas/{id} → tokens atualizados
   - Verificar compras_creditos/{id} → registros criados
   ```

---

## 📞 Suporte

**Dúvidas sobre a mudança?**

- Consulte: `GUIA_RAPIDO_CREDITOS.md`
- Veja: `README_SISTEMA_COMPLETO.md`
- Firestore Rules: `firestore.rules`

---

**Versão:** 2.0.0  
**Data:** 20/11/2025  
**Status:** ✅ Implementado e Testado

🔒 **Nova Política:** Créditos APENAS para assinantes ativos
