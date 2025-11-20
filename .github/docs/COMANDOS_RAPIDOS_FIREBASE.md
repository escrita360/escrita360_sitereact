# 🚀 Comandos Rápidos - Integração Firebase

## 📦 Instalação

```powershell
# Instalar Firebase SDK
cd D:\github\escrita360_sitereact
pnpm install firebase

# Verificar instalação
pnpm list firebase
```

## 🔧 Desenvolvimento

```powershell
# Iniciar servidor de desenvolvimento
pnpm dev

# Apenas frontend
pnpm dev:frontend

# Apenas backend (se necessário)
pnpm dev:backend
```

## 🧪 Testes

```powershell
# Teste completo do Firebase
pnpm test:firebase

# Ou no console do navegador (F12):
import('./test-firebase-integration.js').then(m => m.runAllTests())

# Testes individuais no console:
import('./test-firebase-integration.js').then(m => m.testCreateAccount())
import('./test-firebase-integration.js').then(m => m.testLogin())
```

## 🌐 URLs Úteis

```bash
# Site local
http://localhost:5173

# Página de preços
http://localhost:5173/precos

# Firebase Console - Projeto
https://console.firebase.google.com/project/escrita360aluno

# Firebase Console - Authentication
https://console.firebase.google.com/project/escrita360aluno/authentication/users

# Firebase Console - Firestore
https://console.firebase.google.com/project/escrita360aluno/firestore

# Firebase Console - Rules
https://console.firebase.google.com/project/escrita360aluno/firestore/rules
```

## 📊 Verificações Rápidas

```javascript
// No console do navegador (F12)

// 1. Verificar Firebase inicializado
import { auth, db } from './src/services/firebase.js'
console.log('Auth:', auth)
console.log('Firestore:', db)

// 2. Verificar usuário atual
import { firebaseAuthService } from './src/services/firebase.js'
const user = firebaseAuthService.getCurrentUser()
console.log('Usuário atual:', user)

// 3. Criar conta de teste
import { firebaseAuthService } from './src/services/firebase.js'
const result = await firebaseAuthService.register(
  'teste@escrita360.com.br',
  'senha123456',
  { name: 'Teste', cpf: '12345678900', phone: '11999999999' }
)
console.log('Conta criada:', result)

// 4. Fazer login
const loginResult = await firebaseAuthService.login(
  'teste@escrita360.com.br',
  'senha123456'
)
console.log('Login:', loginResult)

// 5. Buscar assinatura
import { firebaseSubscriptionService } from './src/services/firebase.js'
const sub = await firebaseSubscriptionService.getActiveSubscription(loginResult.uid)
console.log('Assinatura:', sub)
```

## 🔍 Debug no Console

```javascript
// Ativar logs detalhados do Firebase
import { enableLogging } from 'firebase/firestore'
enableLogging(true)

// Ver erros de autenticação
import { getAuth } from 'firebase/auth'
const auth = getAuth()
auth.onAuthStateChanged(user => {
  console.log('Auth state:', user)
})
```

## 📱 Teste no App Flutter

```dart
// No terminal do app Flutter
cd C:\Ggithub
flutter run -d windows

// Ou Android
flutter run -d <device-id>

// Ver logs
flutter logs
```

## 🐛 Troubleshooting

```powershell
# Limpar cache do PNPM
pnpm store prune
pnpm install

# Limpar cache do Vite
rm -rf node_modules/.vite
pnpm dev

# Verificar versão do Node
node --version  # Recomendado: v18+

# Verificar versão do Firebase
pnpm list firebase

# Reinstalar dependências
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## 🔄 Git

```powershell
# Status
git status

# Add mudanças
git add .

# Commit
git commit -m "feat: integração Firebase para sincronização site + app Flutter"

# Push
git push origin main
```

## 📋 Checklist Rápido

Antes de testar:
- [ ] `pnpm install firebase` executado
- [ ] `pnpm dev` rodando sem erros
- [ ] Console sem erros críticos
- [ ] Firebase Console acessível

Para testar:
- [ ] Acessar /precos
- [ ] Escolher plano
- [ ] Preencher dados
- [ ] Completar pagamento
- [ ] Ver logs no console
- [ ] Verificar Firebase Console
- [ ] Testar login no app Flutter

## 🎯 Atalhos do Teclado

- **F12** - Abrir DevTools
- **Ctrl+Shift+J** - Abrir Console
- **Ctrl+R** - Recarregar página
- **Ctrl+Shift+R** - Recarregar sem cache

## 📞 Links de Suporte

- [Documentação Firebase](https://firebase.google.com/docs)
- [Firebase Auth Docs](https://firebase.google.com/docs/auth)
- [Firestore Docs](https://firebase.google.com/docs/firestore)
- [Flutter Firebase](https://firebase.flutter.dev/)

## 💾 Backup

```powershell
# Backup do Firestore (via Firebase Console)
# Tools → Import/Export → Export

# Backup do código
git add .
git commit -m "backup: integração Firebase"
git push
```

## 🎓 Exemplos de Uso

### Criar Conta
```javascript
import { firebaseAuthService } from './src/services/firebase.js'

const result = await firebaseAuthService.register(
  'usuario@email.com',
  'senha123',
  {
    name: 'Nome Completo',
    cpf: '12345678900',
    phone: '11999999999'
  }
)
console.log('UID:', result.uid)
```

### Login
```javascript
const result = await firebaseAuthService.login(
  'usuario@email.com',
  'senha123'
)
console.log('Logado:', result.uid)
```

### Criar Assinatura
```javascript
import { firebaseSubscriptionService } from './src/services/firebase.js'

const sub = await firebaseSubscriptionService.createSubscription(
  'userId123',
  {
    plan: { name: 'Intermediário', price: 49.90 },
    isYearly: false,
    paymentData: {
      name: 'Nome',
      email: 'email@email.com',
      transactionId: 'TRANS_123'
    }
  }
)
console.log('Assinatura:', sub.assinaturaId)
```

---

## 🚀 Comando Principal

```powershell
# INSTALAR E INICIAR (Execute apenas isso!)
pnpm install firebase && pnpm dev
```

🎉 **Pronto para usar!**
