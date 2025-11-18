# Integração Frontend - Backend

Este documento descreve como o frontend React está integrado com o backend Flask para processar pagamentos.

## 📋 Arquivos Criados

### Serviços (src/services/)

1. **api.js** - Cliente Axios configurado
   - Base URL do backend
   - Interceptor para adicionar JWT token
   - Tratamento automático de erros de autenticação

2. **auth.js** - Serviço de autenticação
   - Registro de usuários
   - Login
   - Verificação de token
   - Logout
   - Gerenciamento de sessão

3. **payment.js** - Serviço de pagamentos
   - Criação de sessões de checkout
   - Processamento de pagamentos
   - Verificação de status
   - Histórico de pagamentos
   - Cancelamento de assinaturas

4. **chat.js** - Serviço de chatbot
   - Envio de mensagens para o chatbot
   - Recebimento de respostas automatizadas

## 🔧 Configuração

### 1. Instalar Dependências

```bash
pnpm install
```

Isso instalará o `axios` que foi adicionado ao `package.json`.

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto frontend (já foi criado):

```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```

**Importante:** O arquivo `.env` está no `.gitignore` e não deve ser commitado.

### 3. Iniciar o Backend

No terminal, vá para a pasta do backend e inicie:

```bash
cd escrita360_BACKEND
python start.py
```

O backend estará rodando em `http://localhost:5000`

### 4. Iniciar o Frontend

Em outro terminal, inicie o frontend:

```bash
cd escrita360
pnpm dev
```

O frontend estará rodando em `http://localhost:5173`

## 🔄 Fluxo de Pagamento

### Página de Preços → Página de Pagamento

1. Usuário seleciona um plano em `/precos`
2. Clica em "Assinar" e é redirecionado para `/pagamento`
3. Os dados do plano são passados via `navigate` state:
   ```javascript
   navigate('/pagamento', { 
     state: { 
       selectedPlan: plan, 
       isYearly: billingPeriod === 'yearly' 
     } 
   })
   ```

### Processamento do Pagamento

1. Usuário preenche o formulário com:
   - Dados pessoais (email, CPF, telefone)
   - Dados do cartão (número, nome, validade, CVV)

2. Ao submeter, o componente `Pagamento.jsx`:
   - Valida os dados do formulário
   - Verifica se o usuário está autenticado
   - Se não estiver, cria uma conta automaticamente
   - Chama `paymentService.processPayment()` com os dados

3. O serviço de pagamento:
   - Envia uma requisição POST para `/api/payment/process`
   - Inclui o JWT token no header (se autenticado)
   - Passa os dados do plano, cliente e cartão

4. Backend processa:
   - Valida os dados
   - Cria/atualiza o cliente no Stripe
   - Processa o pagamento
   - Cria a assinatura
   - Retorna o resultado

5. Frontend recebe resposta:
   - **Sucesso:** Mostra tela de confirmação com detalhes
   - **Erro:** Exibe mensagem de erro ao usuário

## 🔐 Autenticação

### Fluxo Automático

O componente de pagamento cria automaticamente uma conta se o usuário não estiver logado:

```javascript
if (!isAuthenticated) {
  const tempPassword = Math.random().toString(36).slice(-8) + 'A1!'
  await authService.register(formData.email, tempPassword, formData.cardName)
}
```

A senha temporária é gerada e o usuário pode alterá-la depois no dashboard.

### JWT Token

- Armazenado no `localStorage` após login/registro
- Automaticamente incluído em todas as requisições via interceptor
- Removido automaticamente se expirar (erro 401)

## 📡 Endpoints do Backend

### Autenticação

- `POST /api/auth/register` - Criar conta
- `POST /api/auth/login` - Login
- `GET /api/auth/verify` - Verificar token

### Pagamentos

- `POST /api/payment/create-checkout-session` - Criar sessão Stripe
- `POST /api/payment/process` - Processar pagamento direto
- `GET /api/payment/status/:sessionId` - Verificar status
- `GET /api/payment/history` - Histórico do usuário

### Assinaturas

- `POST /api/subscription/cancel/:subscriptionId` - Cancelar assinatura

### Chatbot

- `POST /api/chat/message` - Enviar mensagem para o chatbot
  - Body: `{ "message": "string" }`
  - Response: `{ "response": "string" }`

## 🧪 Testando a Integração

### 1. Teste Básico

```javascript
// Console do navegador
import { paymentService } from './src/services/payment'

const testPayment = {
  planId: 'basic',
  isYearly: false,
  email: 'teste@email.com',
  cardName: 'TESTE USUARIO',
  cardNumber: '4242424242424242',
  expiryDate: '12/25',
  cvv: '123',
  phone: '11999999999',
  cpf: '12345678901'
}

paymentService.processPayment(testPayment)
  .then(console.log)
  .catch(console.error)
```

### 2. Cartões de Teste Stripe

- **Sucesso:** 4242 4242 4242 4242
- **Falha:** 4000 0000 0000 0002
- **Requer autenticação:** 4000 0025 0000 3155

Qualquer data futura e CVV de 3 dígitos funcionam.

## ⚠️ Tratamento de Erros

### Frontend

O componente `Pagamento.jsx` trata erros e exibe mensagens amigáveis:

```javascript
try {
  await paymentService.processPayment(paymentData)
} catch (error) {
  setPaymentError(
    error.response?.data?.error || 
    'Erro ao processar pagamento. Tente novamente.'
  )
}
```

### Backend

O backend retorna erros estruturados:

```json
{
  "error": "Cartão recusado",
  "details": "insufficient_funds"
}
```

## 🚀 Próximos Passos

### Para Produção

1. **Variáveis de Ambiente:**
   - Atualizar `VITE_API_URL` para a URL de produção
   - Configurar chaves do Stripe de produção

2. **Segurança:**
   - Implementar HTTPS
   - Adicionar CORS apropriado no backend
   - Implementar rate limiting
   - Adicionar validação adicional

3. **UX:**
   - Adicionar loader durante processamento
   - Melhorar mensagens de erro
   - Adicionar retry automático
   - Implementar webhook listener para atualizações em tempo real

4. **Funcionalidades:**
   - Dashboard de assinatura
   - Histórico de pagamentos
   - Gerenciamento de cartões
   - Cancelamento de assinatura
   - Alteração de plano

## 📚 Documentação Adicional

- [Documentação Backend](../../escrita360_BACKEND/docs/FRONTEND_INTEGRATION.md)
- [Stripe API](https://stripe.com/docs/api)
- [Axios](https://axios-http.com/docs/intro)

## 🐛 Troubleshooting

### Erro: "Network Error"
- Verifique se o backend está rodando
- Confirme a URL no `.env`
- Verifique CORS no backend

### Erro: "401 Unauthorized"
- Token expirado ou inválido
- Limpe localStorage e faça login novamente

### Erro: "Cannot read properties of undefined"
- Verifique se os dados do plano estão sendo passados corretamente
- Confirme que `location.state` contém `selectedPlan` e `isYearly`

## 💡 Dicas

1. Use o DevTools Network tab para debugar requisições
2. Console.log é seu amigo para verificar dados
3. Teste com cartões de teste do Stripe
4. Verifique os logs do backend para erros detalhados
