# Escrita360 Backend Server

Backend Node.js + Express para o frontend React do Escrita360.

## 🚀 Quick Start

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais

# Iniciar servidor
npm start
```

O servidor estará disponível em `http://localhost:5000`

## 📁 Estrutura

```
server/
├── app/
│   ├── routes/
│   │   ├── payment.js      # Rotas de pagamento (PagBank)
│   │   ├── webhook.js      # Webhooks do PagBank
│   │   ├── connect.js      # PagBank Connect (OAuth)
│   │   ├── auth.js         # Autenticação
│   │   └── admin.js        # Administração
│   └── services/
│       ├── pagbank_recurrence_service.js    # API Recorrência PagBank
│       ├── pagbank_subscriptions_service.js # API Assinaturas PagBank
│       ├── pagbank_orders_service.js        # API Orders PagBank
│       └── pagbank_connect_service.js       # API Connect PagBank (OAuth)
├── app.js           # Configuração principal
├── package.json     # Dependências
└── .env.example     # Template de variáveis
```

## 🔧 Configuração

### Variáveis de Ambiente Obrigatórias

```env
# Servidor
PORT=5000
NODE_ENV=development
SECRET_KEY=your_secret_key

# PagBank
PAGBANK_ENV=sandbox
PAGBANK_EMAIL=seu_email@example.com
PAGBANK_TOKEN=seu_token_aqui

# PagBank Connect (OAuth 2.0)
PAGBANK_CLIENT_ID=your_client_id_here
PAGBANK_CLIENT_SECRET=your_client_secret_here
PAGBANK_REDIRECT_URI=http://localhost:5000/api/connect/callback

# Modo simulação (true para testes sem chamadas reais)
PAGBANK_MOCK_MODE=true
```

### Obter Credenciais PagBank

**Sandbox (Desenvolvimento):**
1. Acesse: https://sandbox.pagseguro.uol.com.br/
2. Crie conta de teste
3. Obtenha email e token

**Produção:**
1. Acesse: https://pagseguro.uol.com.br/
2. "Minha Conta" > "Preferências" > "Integração"
3. Gere token de produção

## 📡 API Endpoints

### Health Check
```http
GET /health
```

### Pagamentos PagBank

#### PagBank Connect (OAuth 2.0)
```http
GET  /api/connect/status                 # Verificar configuração
POST /api/connect/application            # Criar aplicação Connect
GET  /api/connect/application            # Consultar aplicação
GET  /api/connect/authorize-url          # Gerar URL de autorização
POST /api/connect/authorize-sms          # Autorização via SMS
POST /api/connect/token                  # Obter access token
POST /api/connect/token/refresh          # Renovar token
POST /api/connect/token/revoke           # Revogar token
GET  /api/connect/callback               # Callback de autorização
```

#### Criar Plano
```http
POST /api/payment/pagbank/plan
```

#### Criar Assinatura
```http
POST /api/payment/pagbank/subscription
```

#### Gerenciar Assinatura
```http
PUT /api/payment/pagbank/subscription/:id/suspend
PUT /api/payment/pagbank/subscription/:id/reactivate
PUT /api/payment/pagbank/subscription/:id/cancel
```

#### Consultas
```http
GET /api/payment/pagbank/subscription/:id
GET /api/payment/pagbank/subscriptions
```

Veja documentação completa em: `../.github/docs/BACKEND_PAGBANK.md`

## 🔔 Webhooks

### Configurar Webhook

1. Configure URL no painel PagBank
2. Em desenvolvimento, use ngrok:
   ```bash
   ngrok http 5000
   ```
3. Configure URL gerada: `https://abc123.ngrok.io/api/webhook/pagbank`

### Testar Webhook
```bash
curl http://localhost:5000/api/webhook/pagbank/test
```

## 🧪 Modo Simulação

Para testes sem fazer chamadas reais à API:

```env
PAGBANK_MOCK_MODE=true
```

Todos os métodos retornarão respostas simuladas.

## 📝 Scripts

```json
{
  "start": "node app.js",
  "dev": "nodemon app.js",
  "test": "jest"
}
```

## 🐛 Debug

### Logs do Servidor
Os logs mostram todas as requisições e respostas:
- 🔄 Requisições
- ✅ Sucessos
- ❌ Erros
- 📦 Payloads

### Testar Endpoints
```bash
# Health check
curl http://localhost:5000/health

# Criar plano (simulação)
curl -X POST http://localhost:5000/api/payment/pagbank/plan \
  -H "Content-Type: application/json" \
  -d '{"name":"Plano Teste","amountPerPayment":"29.90","period":"MONTHLY"}'
```

## 📚 Documentação

- [Integração PagBank Backend](../.github/docs/BACKEND_PAGBANK.md)
- [API Reference PagBank](../.github/docs/PAGBANnK.md)
- [Frontend Integration](../.github/docs/PAGBANK_INTEGRATION.md)

## 🔒 Segurança

- ✅ CORS configurado para frontend
- ✅ Credenciais em variáveis de ambiente
- ✅ Validação de entrada
- ✅ Rate limiting (implementar)
- ✅ HTTPS em produção

## 📦 Dependências Principais

- `express` - Framework web
- `axios` - Cliente HTTP
- `cors` - CORS middleware
- `dotenv` - Variáveis de ambiente

## 🆘 Troubleshooting

### Erro: Port already in use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill
```

### Erro: Cannot find module
```bash
npm install
```

### Erro: PAGBANK_TOKEN não configurado
Edite `.env` e adicione suas credenciais PagBank

## 📄 Licença

Proprietary - Escrita360
