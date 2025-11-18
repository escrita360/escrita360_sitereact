# Arquitetura de Pagamentos PagBank

## 📐 Visão Geral

Este projeto implementa uma arquitetura **Backend-First** para todas as integrações com APIs de pagamento do PagBank, garantindo segurança e centralização da lógica de negócios.

## 🔒 Princípios de Segurança

### ❌ O que NÃO fazer
- **Nunca** expor tokens ou credenciais do PagBank no frontend
- **Nunca** fazer chamadas diretas às APIs do PagBank do navegador
- **Nunca** armazenar dados sensíveis no `localStorage` ou `sessionStorage`

### ✅ O que fazer
- **Sempre** chamar APIs do PagBank através do backend
- **Sempre** validar dados no backend antes de enviar ao PagBank
- **Sempre** usar HTTPS em produção
- **Sempre** implementar rate limiting no backend

## 🏗️ Arquitetura de Integração

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                            │
│  (React + Vite - http://localhost:5173)                    │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Componentes de UI                                   │  │
│  │  - Pagamento.jsx                                     │  │
│  │  - PagBankCheckout.jsx                               │  │
│  └──────────────────────────────────────────────────────┘  │
│                        ↓                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Serviços Frontend                                   │  │
│  │  - payment.js (abstração)                            │  │
│  │  - api.js (cliente HTTP)                             │  │
│  └──────────────────────────────────────────────────────┘  │
│                        ↓                                    │
│              HTTP POST/GET (JSON)                           │
└─────────────────────────────────────────────────────────────┘
                         ↓
                         ↓ http://localhost:5000/api
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                         BACKEND                             │
│  (Node.js + Express - http://localhost:5000)               │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Rotas de API                                        │  │
│  │  - /api/payment/create-pagbank-subscription          │  │
│  │  - /api/payment/create-pagbank-pix-payment           │  │
│  │  - /api/payment/pagbank-status/:order_id             │  │
│  └──────────────────────────────────────────────────────┘  │
│                        ↓                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Serviços Backend                                    │  │
│  │  - pagbank_subscriptions_service.js                  │  │
│  │  - Validação e processamento                         │  │
│  │  - Tratamento de erros                               │  │
│  └──────────────────────────────────────────────────────┘  │
│                        ↓                                    │
│              HTTPS (Bearer Token)                           │
└─────────────────────────────────────────────────────────────┘
                         ↓
                         ↓ Authorization: Bearer {token}
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                    API PAGBANK                              │
│  https://sandbox.api.assinaturas.pagseguro.com             │
│  https://api.assinaturas.pagseguro.com (produção)          │
│                                                             │
│  - POST /plans (criar plano)                               │
│  - POST /subscriptions (criar assinatura)                  │
│  - GET /subscriptions/:id (consultar assinatura)           │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Estrutura de Arquivos

### Frontend (`/src`)
```
src/
├── services/
│   ├── api.js                      ✅ Cliente HTTP (axios)
│   ├── payment.js                  ✅ Abstração para pagamentos (chama backend)
│   ├── pagbank.js                  ⚠️  Apenas para testes/sandbox
│   ├── pagbank-sandbox.js          ⚠️  Apenas para testes/sandbox
│   ├── pagbank-subscriptions.js    ⚠️  Apenas para testes/sandbox
│   └── chavepublica.js             ⚠️  Apenas para testes/sandbox
├── components/
│   └── PagBankCheckout.jsx         ✅ Componente de checkout
└── pages/
    ├── Pagamento.jsx               ✅ Página de pagamento
    └── PagBankSandbox.jsx          ⚠️  Página de testes (desenvolvimento)
```

### Backend (`/server`)
```
server/
├── app/
│   ├── routes/
│   │   └── payment.js              ✅ Rotas de pagamento (endpoints)
│   └── services/
│       └── pagbank_subscriptions_service.js  ✅ Lógica de integração PagBank
├── .env                            🔒 Credenciais PagBank (NUNCA commitar)
└── app.js                          ✅ Servidor Express
```

## 🔌 Endpoints do Backend

### 1. Criar Assinatura Recorrente
```http
POST /api/payment/create-pagbank-subscription
Content-Type: application/json

{
  "plan_name": "Plano Mensal",
  "plan_description": "Plano Mensal - Escrita360",
  "amount": 49,
  "interval_unit": "MONTH",
  "interval_value": 1,
  "customer": {
    "name": "João Silva",
    "email": "joao@example.com",
    "cpf": "12345678900",
    "phone": "11987654321"
  },
  "payment_method": "BOLETO"
}
```

**Resposta:**
```json
{
  "plan": {
    "id": "PLAN_ABC123",
    "name": "Plano Mensal",
    "status": "ACTIVE"
  },
  "subscription": {
    "id": "SUBS_XYZ789",
    "status": "ACTIVE"
  }
}
```

### 2. Criar Pagamento PIX
```http
POST /api/payment/create-pagbank-pix-payment
Content-Type: application/json

{
  "plan_name": "Plano Mensal",
  "amount": 49,
  "customer": {
    "name": "João Silva",
    "email": "joao@example.com",
    "cpf": "12345678900",
    "phone": "11987654321"
  }
}
```

**Resposta:**
```json
{
  "id": "pix_123",
  "qr_codes": [{
    "text": "00020101021126890014br.gov.bcb.pix...",
    "expiration_date": "2025-11-18T18:00:00Z"
  }],
  "status": "WAITING"
}
```

### 3. Consultar Status de Pagamento
```http
GET /api/payment/pagbank-status/{order_id}
```

## 📊 Fluxo de Dados

### Assinatura Recorrente
```
1. Usuário preenche formulário (Pagamento.jsx)
   ↓
2. Valida dados no frontend
   ↓
3. Chama paymentService.createPagBankSubscription()
   ↓
4. Envia POST para /api/payment/create-pagbank-subscription
   ↓
5. Backend valida dados
   ↓
6. Backend cria plano no PagBank (POST /plans)
   ↓
7. Backend cria assinatura no PagBank (POST /subscriptions)
   ↓
8. Backend retorna resultado para frontend
   ↓
9. Frontend exibe confirmação ao usuário
```

## 🔐 Variáveis de Ambiente

### Frontend (`.env`)
```bash
# Backend API
VITE_API_URL=http://localhost:5000/api

# PagBank (apenas para sandbox/testes - opcional)
VITE_PAGBANK_ENV=sandbox
```

### Backend (`server/.env`)
```bash
# PagBank Credentials (OBRIGATÓRIO)
PAGBANK_ENV=sandbox
PAGBANK_TOKEN=seu_token_aqui
PAGBANK_MOCK_MODE=false

# JWT
SECRET_KEY=seu_secret_key_aqui
```

## 🧪 Testes

### Testar Integração Completa
```powershell
# Verificar configuração
.\check-pagbank-integration.ps1

# Testar backend
.\test-integration-simple.ps1
```

### Testar Endpoint Específico
```powershell
$body = @{
    plan_name = "Plano Teste"
    amount = 49
    interval_unit = "MONTH"
    interval_value = 1
    customer = @{
        name = "Teste"
        email = "teste@example.com"
        cpf = "12345678900"
        phone = "11987654321"
    }
    payment_method = "BOLETO"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/payment/create-pagbank-subscription" `
    -Method Post `
    -Body $body `
    -ContentType "application/json"
```

## 🚀 Deploy

### Produção
1. **Frontend**: Deploy no Vercel/Netlify
   - Build: `npm run build`
   - Configurar `VITE_API_URL` para URL do backend em produção

2. **Backend**: Deploy no Heroku/Railway/Render
   - Configurar variáveis de ambiente no painel
   - Usar `PAGBANK_ENV=production`
   - Usar token de produção do PagBank

### Checklist de Segurança
- [ ] Tokens do PagBank estão APENAS no backend
- [ ] Backend usa HTTPS em produção
- [ ] CORS configurado corretamente
- [ ] Rate limiting implementado
- [ ] Logs de erro não expõem dados sensíveis
- [ ] Validação de dados em ambos os lados (frontend e backend)

## 📚 Documentação PagBank

- [API de Assinaturas](https://dev.pagbank.uol.com.br/reference/assinaturas)
- [API de Pagamentos](https://dev.pagbank.uol.com.br/reference/pagamentos)
- [Ambiente Sandbox](https://dev.pagbank.uol.com.br/docs/ambiente-sandbox)

## 🐛 Troubleshooting

### Erro: "payment_method_not_accepted"
**Causa**: O método de pagamento enviado não corresponde aos métodos aceitos pelo plano.
**Solução**: Certifique-se de que o plano aceita o método de pagamento (BOLETO ou CREDIT_CARD).

### Erro: "Invalid JSON format"
**Causa**: O payload enviado não está no formato esperado pela API.
**Solução**: Verifique os logs do backend e compare com a documentação da API.

### Backend não recebe requisição do frontend
**Causa**: CORS ou URL incorreta.
**Solução**: 
- Verifique `VITE_API_URL` no `.env`
- Verifique configuração de CORS no backend
- Certifique-se de que o backend está rodando

## 📝 Notas Importantes

- ⚠️ Os arquivos `pagbank.js`, `pagbank-sandbox.js`, `pagbank-subscriptions.js` e `chavepublica.js` no frontend são **apenas para testes** e **não devem ser usados em produção**.
- ✅ Todas as chamadas de produção passam pelo backend através do `payment.js`.
- 🔒 Nunca exponha tokens do PagBank no código do frontend ou em repositórios públicos.
- 🧪 Use o ambiente sandbox do PagBank para testes antes de ir para produção.
