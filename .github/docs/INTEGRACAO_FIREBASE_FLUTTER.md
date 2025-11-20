# Integração Firebase: Site React ↔️ App Flutter

## 🎯 Objetivo

Sincronizar autenticação e dados de assinatura entre o site React (escrita360_sitereact) e o app Flutter (escrita360_aluno) usando o **mesmo projeto Firebase**.

## 🏗️ Arquitetura

### Projeto Firebase Unificado
- **Projeto**: `escrita360aluno`
- **Authentication**: Compartilhado entre site e app
- **Firestore**: Coleções compartilhadas

```
Firebase Project: escrita360aluno
│
├── 🔐 Authentication (Firebase Auth)
│   ├── Site React (Web)
│   └── App Flutter (Android/iOS/Windows/Web)
│
└── 📊 Firestore Database
    ├── usuarios/          # Dados dos usuários
    ├── assinaturas/       # Assinaturas ativas
    └── pagamentos/        # Histórico de pagamentos
```

## 📋 Fluxo Completo de Compra

### 1️⃣ Usuário Compra Assinatura no Site

```javascript
// src/pages/Pagamento.jsx
1. Usuário preenche dados (email, senha, cartão)
2. Pagamento processado via PagBank
3. Pagamento aprovado ✅
```

### 2️⃣ Criação de Conta Firebase

```javascript
// src/services/firebase.js - firebaseAuthService.register()
1. createUserWithEmailAndPassword(auth, email, password)
   → Cria usuário no Firebase Auth
   → Retorna UID único

2. Salvar dados no Firestore (usuarios/{uid})
   {
     uid: "abc123...",
     email: "usuario@email.com",
     nome: "Nome do Usuário",
     cpf: "123.456.789-00",
     telefone: "(11) 99999-9999",
     origem: "site",
     criadoEm: timestamp,
     assinaturaAtiva: true,
     planoAtual: "Intermediário"
   }
```

### 3️⃣ Criação de Assinatura

```javascript
// src/services/firebase.js - firebaseSubscriptionService.createSubscription()
1. Criar documento em assinaturas/{id}
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
     planoOrigem: "Intermediário",
     valorPago: 49.90,
     periodicidade: "mensal",
     pagamentoId: "TRANS_XYZ..."
   }

2. Atualizar usuário com referência da assinatura
```

### 4️⃣ Registro de Pagamento

```javascript
// src/services/firebase.js - firebasePaymentService.recordPayment()
Criar documento em pagamentos/{id}
{
  userId: "abc123...",
  userEmail: "usuario@email.com",
  valor: 49.90,
  status: "paid",
  metodoPagamento: "card",
  transacaoId: "TRANS_XYZ...",
  plano: "Intermediário",
  periodicidade: "mensal",
  origem: "site",
  criadoEm: timestamp
}
```

## 🔄 Sincronização com App Flutter

### Usuário Faz Login no App Flutter

```dart
// lib/auth/login_screen.dart
1. Usuário digita mesmo email/senha do site
2. FirebaseAuth.signInWithEmailAndPassword()
3. App busca assinatura ativa automaticamente

// lib/services/assinatura_service.dart
AssinaturaService.buscarAssinaturaAtiva(userId)
→ Query: assinaturas where userId == uid AND ativa == true
→ Retorna AssinaturaModel com tokens e expiração
```

### Estrutura de Dados Compatível

**Site React** cria assinatura com campos compatíveis com **AssinaturaModel** do Flutter:

```dart
// Flutter: lib/models/assinatura_model.dart
class AssinaturaModel {
  String id;
  String codigo;
  int tipo;              // ✅ Compatível
  DateTime dataInicio;   // ✅ Compatível
  DateTime dataExpiracao;// ✅ Compatível
  bool ativa;            // ✅ Compatível
  String userId;         // ✅ Compatível
  String userName;       // ✅ Compatível
  String userEmail;      // ✅ Compatível
  int tokens;            // ✅ Compatível
}
```

## 🔑 Credenciais Únicas

### Firebase Config (Mesmo Projeto)

**Site React** (`src/services/firebase.js`):
```javascript
const firebaseConfig = {
  apiKey: 'AIzaSyBvRxURO1FNwb1ItnlwSwaPKLtlS5sLVjM',
  authDomain: 'escrita360aluno.firebaseapp.com',
  projectId: 'escrita360aluno',
  // ...
}
```

**App Flutter** (`lib/firebase_options.dart`):
```dart
static const FirebaseOptions web = FirebaseOptions(
  apiKey: 'AIzaSyBvRxURO1FNwb1ItnlwSwaPKLtlS5sLVjM',
  projectId: 'escrita360aluno',
  // ...
);
```

✅ **Mesmo projeto = mesmos usuários**

## 📱 Experiência do Usuário

### Cenário Completo

1. **Compra no Site** (Chrome Desktop)
   - Acessa escrita360.com.br/precos
   - Escolhe plano "Intermediário"
   - Paga com cartão
   - Cria conta: usuario@email.com / senha123

2. **Login no App** (Celular Android)
   - Baixa app "Escrita360 Aluno" da Play Store
   - Login: usuario@email.com / senha123
   - ✅ Entra automaticamente
   - ✅ Vê assinatura ativa
   - ✅ Tem 10 tokens disponíveis

3. **Mesma Conta em Múltiplos Dispositivos**
   - Windows Desktop (app Flutter)
   - Celular Android
   - Tablet iOS
   - Web (app Flutter)
   
   **Todos compartilham a mesma assinatura e tokens!**

## 🛠️ Implementação Técnica

### Dependências Necessárias

**Site React** (`package.json`):
```json
{
  "dependencies": {
    "firebase": "^10.7.1"
  }
}
```

Instalar:
```bash
cd escrita360_sitereact
pnpm install firebase
```

**App Flutter** (já instalado em `pubspec.yaml`):
```yaml
dependencies:
  firebase_core: ^4.1.1
  firebase_auth: ^6.1.0
  cloud_firestore: ^6.0.2
```

### Regras do Firestore

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuários podem ler/escrever seus próprios dados
    match /usuarios/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Assinaturas podem ser lidas pelo próprio usuário
    match /assinaturas/{assinaturaId} {
      allow read: if request.auth != null && 
                     resource.data.userId == request.auth.uid;
      allow write: if request.auth != null; // Site cria, admin gerencia
    }
    
    // Pagamentos são read-only para usuários
    match /pagamentos/{pagamentoId} {
      allow read: if request.auth != null && 
                     resource.data.userId == request.auth.uid;
      allow write: if request.auth != null; // Apenas sistema
    }
  }
}
```

## 🔍 Verificação e Testes

### 1. Teste de Criação de Conta

```javascript
// Console do navegador (site React)
import { firebaseAuthService } from './services/firebase.js'

const result = await firebaseAuthService.register(
  'teste@email.com',
  'senha123',
  { name: 'Teste', cpf: '12345678900', phone: '11999999999' }
)

console.log('UID criado:', result.uid)
```

### 2. Teste de Login no Flutter

```dart
// No app Flutter
final credential = await FirebaseAuth.instance.signInWithEmailAndPassword(
  email: 'teste@email.com',
  password: 'senha123'
);

print('Login OK: ${credential.user?.uid}');

// Buscar assinatura
final assinatura = await AssinaturaService.buscarAssinaturaAtiva(
  credential.user!.uid
);

print('Assinatura: ${assinatura?.tipo} - Tokens: ${assinatura?.tokens}');
```

### 3. Verificar no Firebase Console

1. Acessar: https://console.firebase.google.com/
2. Projeto: `escrita360aluno`
3. **Authentication** → Ver usuário criado
4. **Firestore** → Ver coleções:
   - `usuarios/{uid}`
   - `assinaturas/{id}`
   - `pagamentos/{id}`

## 🚨 Tratamento de Erros

### Erros Comuns

#### Email já cadastrado
```javascript
// Site detecta e mostra mensagem
"Este email já está em uso"
```

#### Assinatura não encontrada no app
```dart
// App Flutter - AssinaturaService
if (assinatura == null) {
  // Tentar buscar por email (fallback)
  // Corrigir userId se necessário
}
```

#### Token expirado
```dart
// App verifica validade
if (DateTime.now().isAfter(assinatura.dataExpiracao)) {
  // Mostrar tela "Renovar Assinatura"
}
```

## 📊 Monitoramento

### Logs do Site React

```javascript
console.log('🔐 Criando conta Firebase para:', email)
console.log('✅ Conta Firebase criada - UID:', user.uid)
console.log('✅ Dados do usuário salvos no Firestore')
console.log('📝 Criando assinatura no Firestore para:', userId)
console.log('✅ Assinatura criada:', assinaturaRef.id)
```

### Logs do App Flutter

```dart
if (kDebugMode) {
  print('🔍 AssinaturaService: Buscando assinatura ativa para usuário $userId');
  print('✅ AssinaturaService: Assinatura ativa encontrada: ${assinatura.id}');
  print('   Tokens: ${assinatura.tokens}, Expiração: ${assinatura.dataExpiracao}');
}
```

## 🎓 Resumo para Desenvolvedores

1. **Site cria conta** → Firebase Auth + Firestore
2. **Site cria assinatura** → Firestore (formato compatível com Flutter)
3. **App usa mesma conta** → Firebase Auth (mesmo projeto)
4. **App lê assinatura** → Firestore (AssinaturaService)
5. **Dados sincronizados** → Tempo real via Firestore

✅ **Um usuário, múltiplas plataformas, mesma assinatura!**

## 📞 Suporte

Problemas com integração? Verifique:

1. ✅ Firebase config correto em ambos projetos
2. ✅ Regras do Firestore permitem leitura/escrita
3. ✅ Estrutura de dados compatível (tipo, userId, tokens)
4. ✅ Logs no console para debug

---

**Documentação atualizada:** 20/11/2025
**Versão:** 1.0
