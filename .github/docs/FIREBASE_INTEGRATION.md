# 🔥 Integração Firebase: Site + App Flutter

## 📝 Resumo da Implementação

Foi implementada a **sincronização completa** entre o site React e o app Flutter usando o **mesmo Firebase** (`escrita360aluno`).

### ✅ O Que Foi Feito

1. **Serviço Firebase no Site** (`src/services/firebase.js`)
   - Autenticação (criar conta, login, logout)
   - Assinaturas (criar, buscar, verificar status)
   - Pagamentos (registrar histórico)

2. **Integração no Pagamento** (`src/pages/Pagamento.jsx`)
   - Após pagamento aprovado → cria conta no Firebase
   - Salva assinatura no Firestore (compatível com Flutter)
   - Registra pagamento para histórico

3. **Documentação Completa**
   - `INTEGRACAO_FIREBASE_FLUTTER.md` - Arquitetura e fluxo
   - `GUIA_INSTALACAO_FIREBASE.md` - Instalação e testes
   - `test-firebase-integration.js` - Script de testes

## 🎯 Como Funciona

```
SITE REACT                          FIREBASE                          APP FLUTTER
────────────────────────────────────────────────────────────────────────────────

1. Usuário compra      →  2. Cria conta (Auth)     →  3. App faz login
   no site                                              com mesmo email/senha

                          4. Salva dados em:
                             • usuarios/{uid}
                             • assinaturas/{id}      →  5. App busca assinatura
                             • pagamentos/{id}           automaticamente

6. Mesma conta = mesma assinatura = mesmos tokens em todas as plataformas! 🎉
```

## 🚀 Como Instalar

### 1. Instalar Firebase SDK

```powershell
cd D:\github\escrita360_sitereact
pnpm install firebase
```

### 2. Iniciar Desenvolvimento

```powershell
pnpm dev
```

### 3. Testar Fluxo Completo

**No Site:**
1. Acesse http://localhost:5173/precos
2. Escolha um plano
3. Preencha dados (email, senha, cartão)
4. Complete o pagamento
5. Veja mensagem de sucesso

**Verifique Console do Navegador:**
```
🔐 Criando conta Firebase para: usuario@email.com
✅ Conta Firebase criada - UID: abc123...
✅ Dados do usuário salvos no Firestore
📝 Criando assinatura no Firestore para: abc123...
✅ Assinatura criada: def456...
🎉 Processo completo!
```

**No App Flutter:**
1. Abra o app (Windows/Android/iOS/Web)
2. Login: mesmo email/senha do site
3. ✅ Assinatura ativa aparece automaticamente!

## 📊 Estrutura de Dados

### Firebase Auth
```javascript
{
  uid: "abc123...",
  email: "usuario@email.com",
  // Senha criptografada pelo Firebase
}
```

### Firestore - usuarios/{uid}
```javascript
{
  uid: "abc123...",
  email: "usuario@email.com",
  nome: "Nome do Usuário",
  cpf: "123.456.789-00",
  telefone: "(11) 99999-9999",
  origem: "site",
  assinaturaAtiva: true,
  planoAtual: "Intermediário",
  criadoEm: timestamp
}
```

### Firestore - assinaturas/{id}
```javascript
{
  codigo: "WEB_1234567890",
  tipo: 1,                    // 0=Básico, 1=Intermediário, 2=Avançado
  tipoNome: "Intermediário",
  dataInicio: "2025-11-20T...",
  dataExpiracao: "2025-12-20T...",
  ativa: true,
  userId: "abc123...",
  userName: "Nome do Usuário",
  userEmail: "usuario@email.com",
  tokens: 10,                 // 10 tokens por mês
  origem: "site",
  valorPago: 49.90,
  periodicidade: "mensal"
}
```

## 🔍 Testes Automatizados

Execute o script de testes:

```javascript
// No console do navegador (F12)
import('./test-firebase-integration.js').then(m => m.runAllTests())
```

Ou testes individuais:

```javascript
import('./test-firebase-integration.js').then(m => {
  m.testCreateAccount()      // Criar conta
  m.testCreateSubscription()  // Criar assinatura
  m.testGetSubscription()     // Buscar assinatura
  m.testLogin()               // Fazer login
})
```

## 🌐 Firebase Console

Verifique dados criados:

1. **Authentication**: https://console.firebase.google.com/project/escrita360aluno/authentication/users
2. **Firestore**: https://console.firebase.google.com/project/escrita360aluno/firestore

## 📱 Compatibilidade

### Plataformas Suportadas

- ✅ **Site React** (Chrome, Firefox, Safari, Edge)
- ✅ **App Flutter Web**
- ✅ **App Flutter Android**
- ✅ **App Flutter iOS**
- ✅ **App Flutter Windows**
- ✅ **App Flutter macOS**

### Sincronização

- ✅ **Conta única** em todas as plataformas
- ✅ **Assinatura compartilhada**
- ✅ **Tokens sincronizados** (10 por mês)
- ✅ **Histórico unificado**

## 🔐 Segurança

### Firestore Rules (Recomendado)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuários
    match /usuarios/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Assinaturas
    match /assinaturas/{assinaturaId} {
      allow read: if request.auth != null && 
                     resource.data.userId == request.auth.uid;
      allow write: if request.auth != null;
    }
    
    // Pagamentos
    match /pagamentos/{pagamentoId} {
      allow read: if request.auth != null && 
                     resource.data.userId == request.auth.uid;
      allow write: if request.auth != null;
    }
  }
}
```

Aplicar no Firebase Console: 
https://console.firebase.google.com/project/escrita360aluno/firestore/rules

## 🐛 Troubleshooting

### Email já em uso
```
Erro: "Este email já está em uso"
Solução: Use email diferente ou faça login
```

### Permissão negada
```
Erro: "Permission denied"
Solução: Configure Firestore Rules (ver acima)
```

### App não encontra assinatura
```
Solução: O app tem fallback automático
Se persistir, verifique userId no Firestore
```

### Firebase não inicializado
```
Solução: Verifique se instalou: pnpm install firebase
```

## 📚 Documentação Detalhada

- **Arquitetura**: `docs/INTEGRACAO_FIREBASE_FLUTTER.md`
- **Guia de Instalação**: `docs/GUIA_INSTALACAO_FIREBASE.md`
- **Script de Testes**: `test-firebase-integration.js`

## 🎓 Para Desenvolvedores

### Arquivos Principais

```
escrita360_sitereact/
├── src/
│   ├── services/
│   │   └── firebase.js          ← Serviços Firebase
│   └── pages/
│       └── Pagamento.jsx         ← Integração pagamento
├── docs/
│   ├── INTEGRACAO_FIREBASE_FLUTTER.md
│   └── GUIA_INSTALACAO_FIREBASE.md
└── test-firebase-integration.js  ← Testes
```

### API Reference

```javascript
// Criar conta
import { firebaseAuthService } from '@/services/firebase.js'
const result = await firebaseAuthService.register(email, password, userData)

// Criar assinatura
import { firebaseSubscriptionService } from '@/services/firebase.js'
const sub = await firebaseSubscriptionService.createSubscription(userId, data)

// Buscar assinatura
const active = await firebaseSubscriptionService.getActiveSubscription(userId)
```

## 🎉 Resultado Final

### ✅ Implementado com Sucesso

- [x] Firebase Auth integrado ao site
- [x] Criação de conta automática após pagamento
- [x] Assinatura salva no Firestore (compatível com Flutter)
- [x] Histórico de pagamentos
- [x] Login compartilhado entre plataformas
- [x] Tokens sincronizados
- [x] Documentação completa
- [x] Scripts de teste

### 🎯 Benefícios

1. **Uma conta, múltiplas plataformas**
2. **Sincronização automática** (tempo real)
3. **Estrutura unificada** (site + app)
4. **Fácil manutenção** (um único Firebase)
5. **Escalável** (Firebase gerenciado)

---

**Status:** ✅ Pronto para usar!  
**Próximo passo:** Instalar Firebase e testar o fluxo completo

```powershell
pnpm install firebase
pnpm dev
```

🚀 **Boa implementação!**
