# 💳 Guia Rápido: Sistema de Créditos

## ⚠️ IMPORTANTE: Assinatura Necessária

**O sistema de créditos REQUER uma assinatura ativa.**

### Por quê?

O aplicativo Escrita360 (Flutter) **só libera o acesso para usuários com assinatura válida**. Sem assinatura ativa, não é possível usar os créditos comprados no app.

---

## ✅ Como Funciona

### 1️⃣ Adquira uma Assinatura

Primeiro, você precisa ter uma assinatura ativa:

```
Site: /precos
Planos: Básico, Intermediário, Avançado
Benefício: 10 tokens mensais + acesso ao app
```

### 2️⃣ Compre Créditos Adicionais

Com assinatura ativa, você pode comprar pacotes extras:

```
Site: /comprar-creditos

Pacotes Disponíveis:
├─ 10 créditos → R$ 9,90 (R$ 0,99/crédito)
├─ 25 créditos → R$ 19,90 (R$ 0,80/crédito) 📌 20% OFF
└─ 50 créditos → R$ 34,90 (R$ 0,70/crédito) 📌 30% OFF
```

### 3️⃣ Use no Site e App

Os créditos são sincronizados automaticamente:

```
✅ Comprou no site → Aparece no app Flutter
✅ Usou no app → Atualiza no site
✅ Tempo real via Firestore
```

---

## 🔒 Validação de Assinatura

### Frontend (React)

```jsx
// Verifica assinatura antes de mostrar página
const hasActive = await firebaseSubscriptionService.hasActiveSubscription(userId)

if (!hasActive) {
  // Mostra mensagem de erro
  // Redireciona para /precos
}
```

### Backend (Firebase Service)

```javascript
// Valida assinatura antes de processar pagamento
async purchaseCredits(userId, creditData) {
  const hasActive = await firebaseSubscriptionService.hasActiveSubscription(userId)
  
  if (!hasActive) {
    throw new Error('Assinatura ativa necessária')
  }
  
  // Processa compra...
}
```

---

## 📊 Fluxo Completo

### ✅ Usuário COM Assinatura

```
1. Login no site
   ↓
2. Assinatura ativa detectada
   ↓
3. Acessa /comprar-creditos
   ↓
4. Escolhe pacote (10/25/50)
   ↓
5. Paga com cartão
   ↓
6. ✅ Créditos adicionados à assinatura
   ↓
7. 📱 App Flutter sincroniza automaticamente
```

### ❌ Usuário SEM Assinatura

```
1. Login no site
   ↓
2. ❌ Sem assinatura ativa
   ↓
3. Acessa /comprar-creditos
   ↓
4. 🔒 BLOQUEADO
   ↓
5. Mensagem:
   "Assinatura Necessária
    App Flutter só funciona com assinatura"
   ↓
6. Redirecionado para /precos
```

---

## 🗂️ Estrutura de Dados

### Firestore: `assinaturas/{id}`

```javascript
{
  userId: "abc123...",
  userEmail: "user@email.com",
  tokens: 35,  // 10 (assinatura) + 25 (compra)
  ativa: true,
  dataExpiracao: "2025-12-20T...",
  ultimaCompraCreditos: timestamp,
  // ... outros campos
}
```

### Firestore: `compras_creditos/{id}`

```javascript
{
  userId: "abc123...",
  quantidade: 25,
  valorPago: 19.90,
  valorUnitario: 0.80,
  status: "paid",
  transacaoId: "CREDIT_...",
  origem: "site",
  criadoEm: timestamp
}
```

---

## 🚀 APIs Principais

### Verificar Assinatura Ativa

```javascript
import { firebaseSubscriptionService } from '@/services/firebase.js'

const hasActive = await firebaseSubscriptionService.hasActiveSubscription(userId)
// Retorna: true | false
```

### Comprar Créditos

```javascript
import { firebaseCreditService } from '@/services/firebase.js'

const result = await firebaseCreditService.purchaseCredits(userId, {
  quantity: 25,
  amount: 19.90,
  paymentData: {
    email: user.email,
    transactionId: 'TRANS_...',
    paymentMethod: 'card'
  }
})

// result.novoTotal → Total de créditos após compra
```

### Buscar Total de Créditos

```javascript
const credits = await firebaseCreditService.getTotalCredits(userId)

console.log(credits.total)       // Total de créditos
console.log(credits.assinatura)  // Créditos da assinatura
console.log(credits.avulsos)     // Créditos avulsos (0 se tem assinatura)
```

---

## 🔧 Regras de Negócio

### 1. Assinatura = Pré-requisito

```
❌ Sem assinatura → Não pode comprar créditos
✅ Com assinatura → Pode comprar quantos quiser
```

### 2. Créditos Vão para Assinatura

```
Créditos comprados são SEMPRE adicionados à assinatura existente
Não há "créditos avulsos" independentes
```

### 3. Sincronização Automática

```
Site ← Firestore → App Flutter
(Tempo real via listeners)
```

### 4. Histórico Imutável

```
Compras de créditos = histórico permanente
Não pode editar/deletar após criação
```

---

## 🎯 Casos de Uso

### Caso 1: Usuário Novo

```
1. Cria conta no site (/login)
2. Compra assinatura (/precos)
3. Recebe 10 tokens mensais
4. Pode comprar créditos extras quando precisar
```

### Caso 2: Assinante Precisa de Mais Créditos

```
1. Já tem assinatura ativa
2. Usou 8 dos 10 tokens mensais
3. Precisa fazer mais correções
4. Compra pacote de 25 créditos
5. Total: 2 + 25 = 27 créditos
```

### Caso 3: Assinatura Expirada

```
1. Assinatura expirou
2. Tenta comprar créditos
3. ❌ Bloqueado
4. Deve renovar assinatura primeiro
5. Depois pode comprar créditos
```

---

## 📱 Integração com App Flutter

### App Flutter Usa o Mesmo Firebase

```dart
// Flutter: TokenManagerService
static Future<bool> temAssinaturaAtiva() async {
  final user = FirebaseAuth.instance.currentUser;
  if (user == null) return false;
  
  final assinatura = await AssinaturaService.buscarAssinaturaAtiva(user.uid);
  
  return assinatura != null && 
         assinatura.ativa && 
         assinatura.dataExpiracao.isAfter(DateTime.now());
}
```

### App Só Funciona COM Assinatura

```dart
// Antes de usar IA
final assinatura = await TokenManagerService.verificarTokensDisponiveis();

if (assinatura == null) {
  throw AssinaturaInativaException(
    'Você não possui uma assinatura ativa'
  );
}

// Usa tokens...
```

---

## 🛡️ Segurança (Firestore Rules)

```javascript
// compras_creditos: Somente leitura + criação
match /compras_creditos/{compraId} {
  allow read: if request.auth != null && 
                 resource.data.userId == request.auth.uid;
  allow create: if request.auth != null && 
                   request.resource.data.userId == request.auth.uid;
  allow update, delete: if false; // Imutável
}

// assinaturas: Usuário pode ler própria assinatura
match /assinaturas/{assinaturaId} {
  allow read: if request.auth != null && 
                 (resource.data.userId == request.auth.uid || 
                  resource.data.userEmail == request.auth.token.email);
  allow write: if false; // Apenas backend pode escrever
}
```

---

## ✅ Checklist de Implementação

- [x] Validação de assinatura no frontend (`ComprarCreditos.jsx`)
- [x] Validação de assinatura no backend (`firebaseCreditService.purchaseCredits`)
- [x] Mensagem de erro quando não tem assinatura
- [x] Redirecionamento para `/precos` quando bloqueado
- [x] Créditos sempre adicionados à assinatura existente
- [x] Sincronização em tempo real com app Flutter
- [x] Firestore rules para segurança
- [x] Histórico de compras imutável
- [x] Documentação completa

---

## 📚 Arquivos Relacionados

**Implementação:**
- `src/pages/ComprarCreditos.jsx` - Página de compra (com validação)
- `src/services/firebase.js` - Serviços Firebase (auth, subscription, credits)

**Documentação:**
- `README_SISTEMA_COMPLETO.md` - Visão geral do sistema
- `SISTEMA_CREDITOS.md` - Detalhes técnicos
- `INTEGRACAO_FIREBASE_FLUTTER.md` - Arquitetura Firebase

---

## 🚨 Erros Comuns

### Erro: "Assinatura ativa necessária"

**Causa:** Usuário tentou comprar créditos sem assinatura  
**Solução:** Adquirir assinatura em `/precos`

### Erro: "Assinatura não encontrada após validação"

**Causa:** Inconsistência no Firestore  
**Solução:** Verificar se assinatura existe e está ativa

### Créditos não aparecem no app

**Causa:** userId diferente entre site e app  
**Solução:** Garantir que userId é o mesmo (Firebase UID)

---

**Status:** ✅ Sistema completo e funcional  
**Versão:** 2.0.0 (com validação de assinatura)  
**Data:** 20/11/2025

🔒 **Política:** Créditos APENAS para assinantes ativos
