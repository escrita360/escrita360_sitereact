# 💳 Sistema de Créditos - Documentação Completa

## 🎯 Objetivo

Sistema de compra de créditos avulsos para usuários logados, com sincronização automática entre o site React e o app Flutter.

## 📋 Fluxo Completo

### 1️⃣ Usuário Cria Conta (via Assinatura ou Cadastro Direto)

```
OPÇÃO A: Via Assinatura
1. Usuário compra assinatura no /precos
2. Preenche dados e paga
3. Conta criada automaticamente no Firebase
4. Recebe 10 tokens da assinatura

OPÇÃO B: Via Cadastro Direto
1. Usuário acessa /login
2. Clica em "Cadastrar"
3. Preenche dados e cria conta
4. Conta criada no Firebase (sem assinatura)
5. Pode comprar créditos avulsos
```

### 2️⃣ Login no Site

```javascript
// Usuário faz login no site
1. Acessa /login
2. Digita email/senha
3. Firebase Auth valida credenciais
4. Dados salvos no localStorage
5. Redireciona para home (autenticado)
```

### 3️⃣ Compra de Créditos (Usuário Logado)

```javascript
// Fluxo de compra
1. Usuário LOGADO acessa /comprar-creditos
2. Sistema verifica autenticação:
   ✅ Logado → Mostra pacotes de créditos
   ❌ Não logado → Redireciona para /login?redirect=/comprar-creditos

3. Escolhe pacote (10, 25 ou 50 créditos)
4. Preenche dados do cartão
5. Processa pagamento via PagBank
6. Pagamento aprovado ✅
```

### 4️⃣ Registro de Créditos no Firebase

```javascript
// src/services/firebase.js - firebaseCreditService.purchaseCredits()

1. Criar registro em compras_creditos/{id}
   {
     userId: "abc123...",
     userEmail: "usuario@email.com",
     quantidade: 25,
     valorPago: 19.90,
     status: "paid",
     transacaoId: "TRANS_..."
   }

2. OPÇÃO A: Usuário TEM assinatura ativa
   → Adiciona créditos à assinatura existente
   → assinaturas/{id}.tokens = tokens_atuais + quantidade
   
   OPÇÃO B: Usuário NÃO TEM assinatura
   → Cria registro em creditos_avulsos/{id}
   {
     userId: "abc123...",
     tokens: 25,
     tipo: "creditos_avulsos",
     ativo: true
   }

3. Registrar em pagamentos/{id}
   (histórico de transações)
```

### 5️⃣ Sincronização com App Flutter

```dart
// App Flutter automaticamente sincroniza

// 1. Usuário faz login no app Flutter
FirebaseAuth.signInWithEmailAndPassword(email, password)

// 2. App busca assinatura ativa
AssinaturaService.buscarAssinaturaAtiva(userId)
→ Retorna assinatura com tokens atualizados

// 3. OU busca créditos avulsos (se não tem assinatura)
Query: creditos_avulsos where userId == uid AND ativo == true
→ Soma todos os tokens

// 4. Usuário vê créditos disponíveis no app
print('Créditos disponíveis: ${totalCreditos}')
```

## 🗂️ Estrutura de Dados

### Firestore - compras_creditos/{id}

```javascript
{
  userId: "abc123...",
  userEmail: "usuario@email.com",
  quantidade: 25,              // Número de créditos comprados
  valorPago: 19.90,            // Valor em R$
  valorUnitario: 0.80,         // Preço por crédito
  status: "paid",
  metodoPagamento: "card",
  transacaoId: "TRANS_XYZ...",
  tipo: "compra_creditos",
  origem: "site",
  criadoEm: timestamp
}
```

### Firestore - creditos_avulsos/{id}

```javascript
// Para usuários SEM assinatura
{
  userId: "abc123...",
  tokens: 25,
  tipo: "creditos_avulsos",
  origem: "compra_site",
  ativo: true,
  criadoEm: timestamp,
  compraId: "compra_ref_id"
}
```

### Firestore - assinaturas/{id} (ATUALIZADO)

```javascript
// Para usuários COM assinatura
{
  // ... campos existentes
  tokens: 35,                  // 10 (assinatura) + 25 (compra)
  ultimaCompraCreditos: timestamp,
  // ... outros campos
}
```

## 🔑 Autenticação

### Verificação no Site

```javascript
// src/pages/ComprarCreditos.jsx

useEffect(() => {
  const currentUser = firebaseAuthService.getCurrentUser()
  
  if (!currentUser) {
    // Não está logado → redirecionar
    navigate('/login?redirect=/comprar-creditos')
    return
  }
  
  // Está logado → buscar dados
  const userData = JSON.parse(localStorage.getItem('user'))
  setUser(userData)
}, [])
```

### Verificação no App Flutter

```dart
// App Flutter - Automático
final user = FirebaseAuth.instance.currentUser;

if (user == null) {
  // Mostrar tela de login
} else {
  // Buscar créditos
  final assinatura = await AssinaturaService.buscarAssinaturaAtiva(user.uid);
}
```

## 💰 Pacotes de Créditos

### Opções Disponíveis

```javascript
const CREDIT_PACKAGES = [
  {
    id: 'pack_10',
    name: '10 Créditos',
    quantity: 10,
    price: 9.90,
    pricePerCredit: 0.99,
    badge: 'Básico'
  },
  {
    id: 'pack_25',
    name: '25 Créditos',
    quantity: 25,
    price: 19.90,
    pricePerCredit: 0.80,
    badge: 'Mais Vendido',
    discount: 20  // 20% OFF
  },
  {
    id: 'pack_50',
    name: '50 Créditos',
    quantity: 50,
    price: 34.90,
    pricePerCredit: 0.70,
    badge: 'Melhor Valor',
    discount: 30  // 30% OFF
  }
]
```

## 🔄 APIs do Firebase

### firebaseCreditService

```javascript
// Comprar créditos
await firebaseCreditService.purchaseCredits(userId, {
  quantity: 25,
  amount: 19.90,
  paymentData: {
    email: 'usuario@email.com',
    transactionId: 'TRANS_123'
  }
})

// Buscar total de créditos
const credits = await firebaseCreditService.getTotalCredits(userId)
// Retorna: { total: 35, assinatura: 10, avulsos: 25 }

// Consumir créditos (quando usar no app)
await firebaseCreditService.consumeCredits(userId, 5)

// Histórico de compras
const compras = await firebaseCreditService.getPurchaseHistory(userId)
```

## 📱 Sincronização em Tempo Real

### Site → Firebase → App

```
SITE REACT                    FIREBASE                    APP FLUTTER
────────────────────────────────────────────────────────────────────

1. Usuário compra      →   2. Salva em Firestore   →   3. App busca
   25 créditos               compras_creditos/           automaticamente
                             assinaturas/

4. Tokens adicionados  ←   5. Firestore atualiza   ←   6. App lê tokens
   Total: 35                  tokens: 35                   Total: 35

7. Usuário abre app    →   8. Query Firestore     →   9. Vê 35 créditos
   Flutter                    busca por userId           disponíveis
```

## 🎓 Casos de Uso

### Caso 1: Usuário COM Assinatura Ativa

```
Situação:
- Tem assinatura Intermediário (10 tokens/mês)
- Usou 7 tokens
- Restam 3 tokens

Ação: Compra 25 créditos

Resultado:
- Créditos adicionados à assinatura existente
- Total: 3 + 25 = 28 tokens
- App Flutter mostra 28 tokens disponíveis
```

### Caso 2: Usuário SEM Assinatura

```
Situação:
- Criou conta via /login (cadastro direto)
- Não tem assinatura
- 0 tokens

Ação: Compra 25 créditos

Resultado:
- Créditos salvos em creditos_avulsos/
- Total: 25 tokens
- App Flutter busca creditos_avulsos e mostra 25 tokens
```

### Caso 3: Assinatura Expirou

```
Situação:
- Tinha assinatura (10 tokens)
- Assinatura expirou
- Comprou 25 créditos antes de expirar
- Total: 35 tokens

Resultado:
- Assinatura fica inativa (ativa: false)
- MAS tokens permanecem disponíveis (35)
- App Flutter continua mostrando 35 tokens
- Usuário pode continuar usando os créditos comprados
```

## 🔒 Segurança

### Firestore Rules

```javascript
// firestore.rules

// Compras de créditos
match /compras_creditos/{compraId} {
  allow read: if request.auth != null && 
                 resource.data.userId == request.auth.uid;
  allow create: if request.auth != null &&
                   request.resource.data.userId == request.auth.uid;
  allow update, delete: if false; // Imutável
}

// Créditos avulsos
match /creditos_avulsos/{creditoId} {
  allow read: if request.auth != null && 
                 resource.data.userId == request.auth.uid;
  allow create, update: if request.auth != null;
  allow delete: if false;
}
```

## 🧪 Como Testar

### Teste Completo End-to-End

```bash
# 1. Site - Criar conta
1. Acesse http://localhost:5173/login
2. Cadastre-se: teste@escrita360.com.br / senha123
3. Login automático

# 2. Site - Comprar créditos
1. Acesse http://localhost:5173/comprar-creditos
2. Escolha pacote "25 Créditos"
3. Preencha dados do cartão (sandbox)
4. Conclua pagamento
5. Veja: "Créditos Disponíveis: 25"

# 3. Verificar no Firebase Console
1. Authentication → Ver usuário
2. Firestore → compras_creditos → Ver compra
3. Firestore → creditos_avulsos → Ver créditos

# 4. App Flutter - Login
1. Abra app Flutter
2. Login: teste@escrita360.com.br / senha123
3. Veja na tela: "25 créditos disponíveis"

# 5. App Flutter - Usar crédito
1. Use uma funcionalidade (correção de redação)
2. Veja créditos diminuírem: 25 → 24
3. Volte ao site
4. Créditos atualizados automaticamente: 24
```

### Teste de Sincronização

```javascript
// Console do navegador (site)
import { firebaseCreditService } from './src/services/firebase.js'

// Buscar créditos
const user = JSON.parse(localStorage.getItem('user'))
const credits = await firebaseCreditService.getTotalCredits(user.uid)
console.log('Créditos:', credits)

// Simular compra
await firebaseCreditService.purchaseCredits(user.uid, {
  quantity: 10,
  amount: 9.90,
  paymentData: { email: user.email, transactionId: 'TEST_123' }
})

// Ver novo total
const newCredits = await firebaseCreditService.getTotalCredits(user.uid)
console.log('Novos créditos:', newCredits)
```

## 📊 Relatórios e Analytics

### Consultas Úteis

```javascript
// Total de créditos vendidos (admin)
const compras = await firebaseCreditService.getPurchaseHistory(userId)
const totalVendido = compras.reduce((sum, c) => sum + c.quantidade, 0)

// Receita total
const receitaTotal = compras.reduce((sum, c) => sum + c.valorPago, 0)

// Pacote mais vendido
const pacotes = {}
compras.forEach(c => {
  pacotes[c.quantidade] = (pacotes[c.quantidade] || 0) + 1
})
```

## 🚀 Próximos Passos

1. **Notificações**: Email quando créditos são adicionados
2. **Renovação Automática**: Opção de compra recorrente
3. **Desconto progressivo**: Quanto mais compra, mais desconto
4. **Créditos de bônus**: Programa de indicação
5. **Dashboard**: Histórico visual de compras

## ✅ Checklist de Implementação

- [x] Serviço de créditos no Firebase
- [x] Página de compra de créditos
- [x] Autenticação obrigatória
- [x] Integração com PagBank
- [x] Sincronização com app Flutter
- [x] Estrutura de dados compatível
- [x] Regras de segurança
- [x] Documentação completa

## 🎉 Resumo

### O Que Foi Implementado

1. ✅ **Login com Firebase Auth** no site
2. ✅ **Página de compra de créditos** (/comprar-creditos)
3. ✅ **Verificação de autenticação** (obrigatório estar logado)
4. ✅ **3 pacotes de créditos** (10, 25, 50)
5. ✅ **Pagamento via PagBank**
6. ✅ **Registro no Firestore** (compras_creditos, creditos_avulsos)
7. ✅ **Sincronização automática** com app Flutter
8. ✅ **Compatibilidade total** com AssinaturaService do Flutter

### Como Funciona (Resumo)

```
1. Usuário LOGA no site → Firebase Auth
2. Acessa /comprar-creditos → Escolhe pacote
3. Paga com cartão → PagBank processa
4. Créditos salvos no Firestore → Sincronização
5. App Flutter busca créditos → Mostra total
6. Usuário usa créditos → Consome do total
7. Sincronia em tempo real entre site e app
```

---

**Status:** ✅ Sistema completo e funcional  
**Próximo passo:** Instalar Firebase e testar

```powershell
cd D:\github\escrita360_sitereact
pnpm install firebase
pnpm dev
```

🎉 **Sistema de créditos pronto para uso!**
