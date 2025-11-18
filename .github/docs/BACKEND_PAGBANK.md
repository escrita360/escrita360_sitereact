# Integração Backend PagBank - API de Recorrência

Documentação completa da integração PagBank implementada no backend do Escrita360.

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Configuração](#configuração)
3. [Endpoints API](#endpoints-api)
4. [Webhooks](#webhooks)
5. [Exemplos de Uso](#exemplos-de-uso)
6. [Referências](#referências)

## 🔍 Visão Geral

Implementação completa da API de Recorrência do PagBank com todos os endpoints documentados em `PAGBANnK.md`.

### Serviços Implementados

- `pagbank_recurrence_service.js` - API de Recorrência (XML/JSON)
- `pagbank_subscriptions_service.js` - API de Assinaturas moderna

### Funcionalidades

✅ Criar planos de recorrência  
✅ Gerar sessões de pagamento  
✅ Criar adesões (assinaturas)  
✅ Cobrar planos  
✅ Retentativa de pagamento  
✅ Suspender/Reativar assinaturas  
✅ Cancelar assinaturas  
✅ Atualizar valores  
✅ Aplicar descontos  
✅ Alterar meio de pagamento  
✅ Consultas e relatórios  
✅ Webhooks para notificações  

## ⚙️ Configuração

### 1. Instalar Dependências

```bash
cd server
npm install
```

### 2. Configurar Variáveis de Ambiente

Edite `server/.env`:

```env
# PagBank
PAGBANK_ENV=sandbox
PAGBANK_EMAIL=seu_email@example.com
PAGBANK_TOKEN=seu_token_aqui
PAGBANK_MOCK_MODE=false

# URLs
FRONTEND_URL=http://localhost:5173
PAGBANK_WEBHOOK_URL=http://localhost:5000/api/webhook/pagbank
```

### 3. Iniciar Servidor

```bash
npm start
```

## 🌐 Endpoints API

### Base URL
```
http://localhost:5000/api/payment
```

### Criar Plano
```http
POST /pagbank/plan
```

### Gerar Sessão
```http
POST /pagbank/session
```

### Criar Assinatura
```http
POST /pagbank/subscription
```

### Cobrar Plano
```http
POST /pagbank/charge
```

### Retentativa
```http
POST /pagbank/retry/:preApprovalCode/:paymentOrderCode
```

### Suspender
```http
PUT /pagbank/subscription/:preApprovalCode/suspend
```

### Reativar
```http
PUT /pagbank/subscription/:preApprovalCode/reactivate
```

### Cancelar
```http
PUT /pagbank/subscription/:preApprovalCode/cancel
```

### Atualizar Valor
```http
PUT /pagbank/plan/:preApprovalRequestCode/amount
```

### Aplicar Desconto
```http
PUT /pagbank/subscription/:preApprovalCode/discount
```

### Consultas
```http
GET /pagbank/subscription/:preApprovalCode
GET /pagbank/subscription/:preApprovalCode/payment-orders
GET /pagbank/subscriptions?initialDate=...&finalDate=...
```

Veja documentação completa em `PAGBANnK.md`.

## 🔔 Webhooks

### Endpoint
```
POST /api/webhook/pagbank
```

### Configuração
1. Configure no painel PagBank
2. Use ngrok em desenvolvimento:
   ```bash
   ngrok http 5000
   ```
3. URL: `https://abc123.ngrok.io/api/webhook/pagbank`

### Teste
```bash
curl http://localhost:5000/api/webhook/pagbank/test
```

## 📝 Exemplos

Veja exemplos completos no arquivo anterior ou em `PAGBANnK.md`.

## 📚 Referências

- [Documentação PagBank](https://dev.pagbank.uol.com.br/)
- [API Reference](PAGBANnK.md)
- [Frontend Integration](PAGBANK_INTEGRATION.md)
