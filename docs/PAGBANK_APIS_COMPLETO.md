# 📋 APIs de Pagamento - Escrita360 (PagBank)

**Última Atualização:** 05/01/2026  
**Ambiente Testado:** Sandbox  
**Status:** ✅ Integração Validada

---

## 📊 Resumo da Validação Sandbox

### IDs Reais Gerados (05/01/2026)

| Tipo | ORDER_ID | CHARGE_ID / QR_CODE_ID | Status |
|------|----------|------------------------|--------|
| **PIX** | `ORDE_B890C1B1-FCC6-443D-BC00-EB09F290745C` | `QRCO_6B3C3F24-7095-4B65-B076-7A5414BFE0A6` | ✅ CRIADO |
| **Consulta** | `ORDE_B890C1B1-FCC6-443D-BC00-EB09F290745C` | - | ✅ CONSULTADO |

### Código PIX Gerado (EMV)
```
00020101021226850014br.gov.bcb.pix2563api-h.pagseguro.com/pix/v2/6B3C3F24-7095-4B65-B076-7A5414BFE0A627600016BR.COM.PAGSEGURO01366B3C3F24-7095-4B65-B076-7A5414BFE0A6520482205303986540599.005802BR5916NI projetos LTDA6015Sao Bernardo do62070503***63049379
```

### Links do QR Code PIX
- **Imagem PNG:** https://sandbox.api.pagseguro.com/qrcode/QRCO_6B3C3F24-7095-4B65-B076-7A5414BFE0A6/png
- **Base64:** https://sandbox.api.pagseguro.com/qrcode/QRCO_6B3C3F24-7095-4B65-B076-7A5414BFE0A6/base64

---

## 🔗 URLs das APIs

### Ambiente Sandbox
```plaintext
Pagamentos (Orders):      https://sandbox.api.pagseguro.com
Assinaturas:              https://sandbox.api.assinaturas.pagseguro.com
Autenticação Connect:     https://sandbox.pagseguro.uol.com.br
```

### Ambiente Produção
```plaintext
Pagamentos (Orders):      https://api.pagseguro.com
Assinaturas:              https://api.assinaturas.pagseguro.com
Autenticação Connect:     https://pagseguro.uol.com.br
```

---

## 📚 APIs Implementadas no Site

### 1. 💳 API de Orders (Pedidos)

**Base URL:** `https://sandbox.api.pagseguro.com`

| Método | Endpoint | Descrição | Arquivo |
|--------|----------|-----------|---------|
| `POST` | `/orders` | Criar pedido (PIX, Cartão, Boleto) | `pagbank_orders_service.js` |
| `GET` | `/orders/{order_id}` | Consultar pedido por ID | `pagbank_orders_service.js` |

#### Exemplo: Criar Pedido PIX
```json
POST /orders
Authorization: Bearer {token}
Content-Type: application/json

{
  "reference_id": "escrita360_pix_1234567890",
  "customer": {
    "name": "Cliente Teste",
    "email": "cliente@escrita360.com",
    "tax_id": "12345678909",
    "phones": [{
      "country": "55",
      "area": "11",
      "number": "999999999",
      "type": "MOBILE"
    }]
  },
  "items": [{
    "reference_id": "plano_profissional",
    "name": "Plano Profissional - Escrita360",
    "quantity": 1,
    "unit_amount": 9900
  }],
  "qr_codes": [{
    "amount": { "value": 9900 },
    "expiration_date": "2026-01-05T22:00:00.000Z"
  }],
  "notification_urls": ["https://webhook.escrita360.com/pagbank"]
}
```

#### Exemplo: Criar Pedido com Cartão
```json
POST /orders
Authorization: Bearer {token}
Content-Type: application/json

{
  "reference_id": "escrita360_card_1234567890",
  "customer": {
    "name": "Jose da Silva",
    "email": "jose@escrita360.com",
    "tax_id": "12345678909",
    "phones": [{
      "country": "55",
      "area": "11",
      "number": "999999999",
      "type": "MOBILE"
    }]
  },
  "items": [{
    "reference_id": "plano_basico",
    "name": "Plano Básico - Escrita360",
    "quantity": 1,
    "unit_amount": 2990
  }],
  "charges": [{
    "reference_id": "charge_1234567890",
    "description": "Pagamento Plano Básico Escrita360",
    "amount": { "value": 2990, "currency": "BRL" },
    "payment_method": {
      "type": "CREDIT_CARD",
      "installments": 1,
      "capture": true,
      "card": {
        "number": "4111111111111111",
        "exp_month": "12",
        "exp_year": "2030",
        "security_code": "123",
        "holder": { "name": "Jose da Silva" }
      }
    }
  }],
  "notification_urls": ["https://webhook.escrita360.com/pagbank"]
}
```

#### Exemplo: Criar Pedido com Boleto
```json
POST /orders
Authorization: Bearer {token}
Content-Type: application/json

{
  "reference_id": "escrita360_boleto_1234567890",
  "customer": {
    "name": "Maria Santos",
    "email": "maria@escrita360.com",
    "tax_id": "12345678909",
    "phones": [{
      "country": "55",
      "area": "11",
      "number": "999999999",
      "type": "MOBILE"
    }]
  },
  "items": [{
    "reference_id": "plano_avancado",
    "name": "Plano Avançado - Escrita360",
    "quantity": 1,
    "unit_amount": 4990
  }],
  "charges": [{
    "reference_id": "boleto_charge_1234567890",
    "description": "Pagamento Plano Avançado Escrita360",
    "amount": { "value": 4990, "currency": "BRL" },
    "payment_method": {
      "type": "BOLETO",
      "boleto": {
        "due_date": "2026-01-08",
        "instruction_lines": {
          "line_1": "Pagamento do Plano Escrita360",
          "line_2": "Não receber após o vencimento"
        },
        "holder": {
          "name": "Maria Santos",
          "tax_id": "12345678909",
          "email": "maria@escrita360.com",
          "address": {
            "street": "Rua das Flores",
            "number": "100",
            "locality": "Centro",
            "city": "São Paulo",
            "region_code": "SP",
            "country": "BRA",
            "postal_code": "01310100"
          }
        }
      }
    }
  }],
  "notification_urls": ["https://webhook.escrita360.com/pagbank"]
}
```

---

### 2. 💰 API de Charges (Cobranças)

**Base URL:** `https://sandbox.api.pagseguro.com`

| Método | Endpoint | Descrição | Arquivo |
|--------|----------|-----------|---------|
| `POST` | `/charges/{charge_id}/cancel` | Cancelar/Estornar cobrança | `pagbank_orders_service.js` |
| `POST` | `/charges/{charge_id}/capture` | Capturar pagamento pré-autorizado | `pagbank_orders_service.js` |

#### Exemplo: Cancelar Cobrança
```json
POST /charges/CHAR_12345678/cancel
Authorization: Bearer {token}
Content-Type: application/json

{
  "amount": { "value": 2990 }
}
```

---

### 3. 👤 API de Customers (Clientes)

**Base URL:** `https://sandbox.api.pagseguro.com`

| Método | Endpoint | Descrição | Arquivo |
|--------|----------|-----------|---------|
| `POST` | `/customers` | Criar cliente | `pagbank_customers_service.js` |
| `GET` | `/customers/{customer_id}` | Consultar cliente | `pagbank_customers_service.js` |
| `PUT` | `/customers/{customer_id}` | Atualizar cliente (não oficial) | `pagbank_customers_service.js` |

#### Exemplo: Criar Cliente
```json
POST /customers
Authorization: Bearer {token}
Content-Type: application/json

{
  "reference_id": "customer_1234567890",
  "name": "João Silva",
  "email": "joao.silva@escrita360.com",
  "tax_id": "12345678901",
  "phones": [{
    "country": "55",
    "area": "11",
    "number": "987654321",
    "type": "MOBILE"
  }]
}
```

---

### 4. 🔑 API de Public Keys (Chaves Públicas)

**Base URL:** `https://sandbox.api.pagseguro.com`

| Método | Endpoint | Descrição | Arquivo |
|--------|----------|-----------|---------|
| `POST` | `/public-keys` | Obter chave pública para criptografia | `chavepublica.js` |

#### Exemplo: Obter Chave Pública
```json
POST /public-keys
Authorization: Bearer {token}
Content-Type: application/json

{
  "type": "card"
}
```

#### Resposta (validada em sandbox):
```json
{
  "public_key": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAr+ZqgD892U9/HXsa7XqBZUayPquAfh9xx4iwUbTSUAvTlmiXFQNTp0Bvt/5vK2FhMj39qSv1zi2OuBjvW38q1E374nzx6NNBL5JosV0+SDINTlCG0cmigHuBOyWzYmjgca+mtQu4WczCaApNaSuVqgb8u7Bd9GCOL4YJotvV5+81frlSwQXralhwRzGhj/A57CGPgGKiuPT+AOGmykIGEZsSD9RKkyoKIoc0OS8CPIzdBOtTQCIwrLn2FxI83Clcg55W8gkFSOS6rWNbG5qFZWMll6yl02HtunalHmUlRUL66YeGXdMDC2PuRcmZbGO5a/2tbVppW6mfSWG3NPRpgwIDAQAB",
  "created_at": 1577836800000
}
```

---

### 5. 📆 API de Subscriptions (Assinaturas)

**Base URL:** `https://sandbox.api.assinaturas.pagseguro.com`

| Método | Endpoint | Descrição | Arquivo |
|--------|----------|-----------|---------|
| `POST` | `/plans` | Criar plano de assinatura | `pagbank_subscriptions_service.js` |
| `GET` | `/plans` | Listar planos | `pagbank_subscriptions_service.js` |
| `GET` | `/plans/{plan_id}` | Consultar plano | `pagbank_subscriptions_service.js` |
| `POST` | `/subscriptions` | Criar assinatura | `pagbank_subscriptions_service.js` |
| `GET` | `/subscriptions` | Listar assinaturas | `pagbank_subscriptions_service.js` |
| `GET` | `/subscriptions/{subscription_id}` | Consultar assinatura | `pagbank_subscriptions_service.js` |
| `PUT` | `/subscriptions/{subscription_id}/cancel` | Cancelar assinatura | `pagbank_subscriptions_service.js` |

#### Exemplo: Criar Plano
```json
POST /plans
Authorization: Bearer {token}
Content-Type: application/json
x-api-version: 4.0

{
  "reference_id": "plan_1234567890",
  "name": "Plano Básico Mensal",
  "description": "Plano Básico Escrita360 - Cobrança Mensal",
  "amount": {
    "value": 2990,
    "currency": "BRL"
  },
  "interval": {
    "unit": "MONTH",
    "length": 1
  },
  "payment_method": ["CREDIT_CARD", "BOLETO"]
}
```

#### Exemplo: Criar Assinatura
```json
POST /subscriptions
Authorization: Bearer {token}
Content-Type: application/json
x-api-version: 4.0

{
  "reference_id": "subscription_1234567890",
  "plan": { "id": "PLAN_ABC123" },
  "customer": {
    "reference_id": "customer_1234567890",
    "name": "João Silva",
    "email": "joao@escrita360.com",
    "tax_id": "12345678901",
    "phones": [{
      "country": "55",
      "area": "11",
      "number": "987654321",
      "type": "MOBILE"
    }],
    "billing_info": [{
      "type": "CREDIT_CARD",
      "card": {
        "number": "4111111111111111",
        "exp_month": "12",
        "exp_year": "2030",
        "security_code": "123",
        "holder": { "name": "João Silva" }
      }
    }]
  },
  "payment_method": [{
    "type": "CREDIT_CARD",
    "card": {
      "number": "4111111111111111",
      "exp_month": "12",
      "exp_year": "2030",
      "security_code": "123",
      "holder": { "name": "João Silva" }
    }
  }],
  "amount": { "value": 2990, "currency": "BRL" }
}
```

---

### 6. 🔗 API Connect (OAuth2)

**Base URL:** `https://sandbox.pagseguro.uol.com.br`

| Método | Endpoint | Descrição | Arquivo |
|--------|----------|-----------|---------|
| `GET` | `/oauth2/authorize` | URL de autorização | `pagbank_connect_service.js` |
| `POST` | `/oauth2/token` | Obter access token | `pagbank_connect_service.js` |
| `POST` | `/oauth2/refresh` | Renovar token | `pagbank_connect_service.js` |

---

## 🗂️ Arquivos de Serviço

### Frontend (src/services)
| Arquivo | Descrição |
|---------|-----------|
| `pagbank.js` | Serviço principal de pagamentos |
| `pagbank-sandbox.js` | Ambiente de testes sandbox |
| `pagbank-subscriptions.js` | Assinaturas recorrentes |
| `chavepublica.js` | Criptografia de cartão |

### Backend (server/app/services)
| Arquivo | Descrição |
|---------|-----------|
| `pagbank_orders_service.js` | API de Orders (PIX, Cartão, Boleto) |
| `pagbank_customers_service.js` | API de Clientes |
| `pagbank_subscriptions_service.js` | API de Assinaturas |
| `pagbank_connect_service.js` | OAuth2 Connect |
| `pagbank_recurrence_service.js` | Pagamentos recorrentes |
| `pagbank_certificate_service.js` | Certificados mTLS |

---

## 💳 Cartões de Teste (Sandbox)

| Cenário | Bandeira | Número | CVV | Validade |
|---------|----------|--------|-----|----------|
| ✅ Aprovado | VISA | `4111111111111111` | `123` | `12/2030` |
| ❌ Recusado | VISA | `4000000000000002` | `123` | `12/2030` |
| ⚠️ Erro | VISA | `4000000000000036` | `123` | `12/2030` |
| ✅ Aprovado | Mastercard | `5555555555554444` | `123` | `12/2030` |
| ✅ Aprovado | Amex | `378282246310005` | `1234` | `12/2030` |

---

## 🔐 Headers de Autenticação

```http
Authorization: Bearer {PAGBANK_TOKEN}
Content-Type: application/json
Accept: application/json
x-api-version: 4.0  # Para API de Assinaturas
```

---

## 📡 Webhooks (Notification URLs)

### Eventos de Pagamento
| Evento | Descrição |
|--------|-----------|
| `AUTHORIZED` | Pagamento autorizado |
| `PAID` | Pagamento confirmado |
| `IN_ANALYSIS` | Em análise de fraude |
| `DECLINED` | Recusado |
| `CANCELED` | Cancelado/Estornado |

### Exemplo de Webhook Recebido
```json
{
  "id": "webhook_1234567890",
  "created_date": "2026-01-05T20:24:17.327Z",
  "reference_id": "escrita360_pix_1234567890",
  "charges": [{
    "id": "CHAR_ABC123",
    "reference_id": "charge_1234567890",
    "status": "PAID",
    "amount": {
      "value": 9900,
      "currency": "BRL"
    },
    "payment_method": {
      "type": "PIX"
    },
    "created_at": "2026-01-05T20:24:17.327Z",
    "paid_at": "2026-01-05T20:25:00.000Z"
  }]
}
```

---

## ⚙️ Variáveis de Ambiente

```env
# Ambiente (sandbox ou production)
PAGBANK_ENV=sandbox

# Token de autenticação
PAGBANK_TOKEN=seu_token_aqui

# Para frontend (Vite)
VITE_PAGBANK_ENV=sandbox
VITE_PAGBANK_TOKEN=seu_token_aqui

# OAuth2 Connect (opcional)
PAGBANK_CLIENT_ID=seu_client_id
PAGBANK_CLIENT_SECRET=seu_client_secret
PAGBANK_REDIRECT_URI=http://localhost:5000/api/connect/callback

# Certificado mTLS (opcional)
PAGBANK_CERT_KEY_PATH=./certificates/pagbank_sandbox.key
PAGBANK_CERT_PEM_PATH=./certificates/pagbank_sandbox.pem
```

---

## 📝 Notas Importantes

1. **Valores em centavos:** Todos os valores monetários devem ser enviados em centavos (ex: R$ 29,90 = 2990)

2. **CPF de Teste:** No sandbox, use `12345678909` como CPF válido para testes

3. **Expiração PIX:** Configure a expiração do QR Code em minutos a partir do momento da criação

4. **API de Customers:** A criação de clientes pode estar bloqueada por Cloudflare no sandbox em algumas situações

5. **Cartão de Crédito:** Em sandbox, alguns cenários podem retornar erro 500 devido a limitações do ambiente de teste

---

## 📖 Documentação Oficial

- [API de Orders](https://dev.pagbank.uol.com.br/reference/orders-api-overview)
- [API de Customers](https://developer.pagbank.com.br/reference/customers)
- [API de Assinaturas](https://dev.pagbank.uol.com.br/reference/subscriptions)
- [PIX](https://dev.pagbank.uol.com.br/reference/criar-qr-code-pix)
- [Connect OAuth2](https://dev.pagbank.uol.com.br/reference/connect)

---

*Documento gerado em: 05/01/2026*  
*Script de validação: `scripts/validate-pagbank-sandbox.js`*
