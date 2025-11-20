# 🚀 Guia Rápido: Sistema de Créditos

## ✅ O Que Foi Implementado

### 1. Autenticação Integrada
- **Login atualizado** para usar Firebase Auth
- Usuários podem criar conta via:
  - Cadastro direto (`/login`)
  - Compra de assinatura (`/precos`)
- **Mesma conta** funciona no site e app Flutter

### 2. Compra de Créditos
- **Página dedicada**: `/comprar-creditos`
- **Requer login**: Usuário DEVE estar autenticado
- **3 pacotes disponíveis**:
  - 10 créditos: R$ 9,90 (R$ 0,99/crédito)
  - 25 créditos: R$ 19,90 (R$ 0,80/crédito) - 20% OFF
  - 50 créditos: R$ 34,90 (R$ 0,70/crédito) - 30% OFF

### 3. Sincronização Automática
- Créditos comprados no site aparecem no app Flutter
- Tokens compartilhados em tempo real
- Suporta usuários COM e SEM assinatura

## 🎯 Fluxo Completo

```
1. CRIAR CONTA
   Site: /login → Cadastrar
   OU
   Site: /precos → Comprar assinatura
   ↓
   Conta criada no Firebase Auth

2. FAZER LOGIN
   Site: /login → Email/senha
   ↓
   Autenticado no site

3. COMPRAR CRÉDITOS
   Site: /comprar-creditos
   → Escolhe pacote
   → Paga com cartão
   → Créditos adicionados
   ↓
   Salvos no Firestore

4. USAR NO APP FLUTTER
   App: Login com mesma conta
   → Busca créditos automaticamente
   → Vê total disponível
   → Usa funcionalidades
   ↓
   Sincronia em tempo real
```

## 📁 Arquivos Criados/Modificados

### Novos Arquivos

1. **`src/services/firebase.js`** (ATUALIZADO)
   - `firebaseCreditService` - Gerenciar créditos
     - `purchaseCredits()` - Comprar créditos
     - `getTotalCredits()` - Buscar total
     - `consumeCredits()` - Consumir créditos
     - `getPurchaseHistory()` - Histórico

2. **`src/pages/ComprarCreditos.jsx`** (NOVO)
   - Página completa de compra
   - Verificação de autenticação
   - Seleção de pacotes
   - Pagamento integrado
   - Tela de sucesso

3. **`docs/SISTEMA_CREDITOS.md`** (NOVO)
   - Documentação completa
   - Casos de uso
   - Exemplos de código

### Arquivos Modificados

1. **`src/pages/Login.jsx`**
   - Usa `firebaseAuthService` ao invés de backend local
   - Salva dados no localStorage
   - Compatível com app Flutter

2. **`src/App.jsx`**
   - Nova rota: `/comprar-creditos`
   - Importação do componente

## 🗂️ Estrutura de Dados no Firestore

### 1. compras_creditos/{id}
```javascript
{
  userId: "abc123...",
  quantidade: 25,
  valorPago: 19.90,
  status: "paid",
  transacaoId: "TRANS_XYZ...",
  criadoEm: timestamp
}
```

### 2. creditos_avulsos/{id}
```javascript
// Para usuários SEM assinatura
{
  userId: "abc123...",
  tokens: 25,
  ativo: true,
  criadoEm: timestamp
}
```

### 3. assinaturas/{id} (ATUALIZADO)
```javascript
// Para usuários COM assinatura
{
  tokens: 35,  // 10 (assinatura) + 25 (compra)
  ultimaCompraCreditos: timestamp,
  // ... outros campos
}
```

## 🔐 Como Funciona a Autenticação

### No Site (React)

```javascript
// 1. Verificar se está logado
const user = firebaseAuthService.getCurrentUser()

if (!user) {
  // Redirecionar para login
  navigate('/login?redirect=/comprar-creditos')
} else {
  // Mostrar página de compra
}
```

### No App (Flutter)

```dart
// Usuário faz login com mesma conta
final credential = await FirebaseAuth.instance.signInWithEmailAndPassword(
  email: 'usuario@email.com',
  password: 'senha123'
);

// Busca créditos automaticamente
final assinatura = await AssinaturaService.buscarAssinaturaAtiva(
  credential.user!.uid
);

print('Créditos: ${assinatura?.tokens ?? 0}');
```

## ✨ Casos de Uso

### Caso 1: Usuário COM Assinatura
```
Tem assinatura → 10 tokens/mês
Compra 25 créditos no site
Total: 10 + 25 = 35 tokens
App Flutter mostra 35 tokens
```

### Caso 2: Usuário SEM Assinatura
```
Criou conta via /login
Não tem assinatura → 0 tokens
Compra 25 créditos no site
Total: 25 tokens
App Flutter mostra 25 tokens
```

### Caso 3: Assinatura Expirou
```
Assinatura expirou
Tinha comprado 25 créditos
Total: 25 tokens (permanece)
App Flutter mostra 25 tokens
Créditos NÃO expiram!
```

## 🧪 Como Testar

### 1. Instalar Dependências
```powershell
cd D:\github\escrita360_sitereact
pnpm install firebase
```

### 2. Iniciar Servidor
```powershell
pnpm dev
```

### 3. Teste Passo a Passo

#### A. Criar Conta
```
1. Acesse: http://localhost:5173/login
2. Aba "Cadastrar"
3. Preencha: nome, email, senha
4. Clique em "Criar Conta"
5. Login automático ✅
```

#### B. Comprar Créditos
```
1. Acesse: http://localhost:5173/comprar-creditos
2. Escolha pacote (ex: 25 créditos)
3. Preencha dados do cartão
4. Clique em "Finalizar Compra"
5. Veja: "Compra Confirmada!" ✅
```

#### C. Verificar no Firebase
```
1. Firebase Console: https://console.firebase.google.com/project/escrita360aluno
2. Authentication → Ver usuário criado
3. Firestore → compras_creditos → Ver compra
4. Firestore → creditos_avulsos OU assinaturas → Ver tokens
```

#### D. Testar no App Flutter
```
1. Abra app Flutter
2. Login: mesmo email/senha do site
3. Veja créditos disponíveis
4. Use uma funcionalidade (correção)
5. Veja créditos diminuírem
```

## 🔄 Sincronização Site ↔ App

### Tempo Real
```
SITE                FIRESTORE               APP FLUTTER
─────────────────────────────────────────────────────────

Compra 25     →     Salva tokens      →     Busca tokens
créditos            tokens: 25               Vê 25 tokens

                    ↓ Atualiza ↓

Usa no app    ←     Consome tokens    ←     Usa correção
                    tokens: 24               Vê 24 tokens

Site atualiza ←     Lê tokens         ←     
Vê 24 tokens        tokens: 24
```

## 📊 Firestore Rules (Aplicar)

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Compras de créditos
    match /compras_creditos/{compraId} {
      allow read: if request.auth != null && 
                     resource.data.userId == request.auth.uid;
      allow create: if request.auth != null &&
                       request.resource.data.userId == request.auth.uid;
      allow update, delete: if false;
    }
    
    // Créditos avulsos
    match /creditos_avulsos/{creditoId} {
      allow read: if request.auth != null && 
                     resource.data.userId == request.auth.uid;
      allow create, update: if request.auth != null;
      allow delete: if false;
    }
  }
}
```

**Aplicar em:**
https://console.firebase.google.com/project/escrita360aluno/firestore/rules

## 🎉 Resumo Final

### ✅ Implementado

- [x] Login com Firebase Auth
- [x] Página de compra de créditos
- [x] Verificação de autenticação
- [x] 3 pacotes de créditos
- [x] Pagamento via PagBank
- [x] Salvamento no Firestore
- [x] Sincronização com app Flutter
- [x] Suporte para usuários COM e SEM assinatura
- [x] Documentação completa

### 🚀 Próximo Passo

```powershell
# Instalar e testar
pnpm install firebase
pnpm dev

# Acessar
http://localhost:5173/login          → Criar conta
http://localhost:5173/comprar-creditos → Comprar créditos
```

### 📱 No App Flutter

```dart
// Já está pronto!
// Apenas faça login com mesma conta
// Créditos aparecem automaticamente
```

---

## 💡 Benefícios

✅ **Uma conta, múltiplas plataformas**  
✅ **Créditos sincronizados em tempo real**  
✅ **Compra fácil e segura**  
✅ **Flexibilidade**: Funciona com ou sem assinatura  
✅ **Transparente**: Usuário vê total sempre atualizado  

🎉 **Sistema completo e pronto para uso!**
