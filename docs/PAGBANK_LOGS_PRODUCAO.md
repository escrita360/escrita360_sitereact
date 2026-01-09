# 📋 Logs de Validação - Integração PagBank PRODUÇÃO

**Projeto:** Escrita360  
**Data de Geração:** 09/01/2026  
**Ambiente:** 🔴 PRODUÇÃO (api.pagseguro.com)  
**Base URL API:** https://api.pagseguro.com

---

## ⚠️ IMPORTANTE

> **Este documento deve conter logs de transações REAIS em ambiente de PRODUÇÃO.**
> 
> Os logs anteriores foram gerados em ambiente **Sandbox** (sandbox.api.pagseguro.com).
> Para validação da integração, o PagBank requer logs de transações reais processadas em produção.

---

## 📌 Objetivo

Este documento consolida os logs de transações **REAIS** realizadas em ambiente de **PRODUÇÃO** para validar a integração com o PagBank.

---

## ✅ Status da Integração em Produção

| Item | Status | Observação |
|------|--------|------------|
| Configuração de Produção | 🟡 Pendente | Aguardando credenciais de produção |
| PIX - Geração QR Code | 🟡 Pendente | Aguardando transação real |
| PIX - Webhook Notificação | 🟡 Pendente | Aguardando transação real |
| Cartão de Crédito - Pagamento | 🟡 Pendente | Aguardando transação real |
| Webhook - Recebimento | 🟡 Pendente | Configurar URL de produção |

---

## 🔑 Configuração de Produção

### Variáveis de Ambiente

```bash
# Frontend (.env)
VITE_PAGBANK_ENV=production
VITE_PAGBANK_TOKEN=<TOKEN_PRODUCAO_REAL>
VITE_API_URL=https://api.escrita360.com

# Backend (server/.env)
NODE_ENV=production
PAGBANK_ENV=production
PAGBANK_TOKEN=<TOKEN_PRODUCAO_REAL>
PAGBANK_WEBHOOK_URL=https://api.escrita360.com/api/webhook/pagbank
```

### URLs de API - PRODUÇÃO

| Ambiente | Base URL | Status |
|----------|----------|--------|
| ~~Sandbox~~ | ~~`https://sandbox.api.pagseguro.com`~~ | ❌ Não usar |
| **Produção** | **`https://api.pagseguro.com`** | ✅ Usar este |

---

## 📊 Logs de Transações em PRODUÇÃO

### IDs de Referência - Transações Reais

| Tipo | ORDER_ID | CHARGE_ID | Status | Data |
|------|----------|-----------|--------|------|
| **PIX** | `[AGUARDANDO TRANSAÇÃO REAL]` | `[AGUARDANDO]` | 🟡 Pendente | - |
| **CREDIT_CARD** | `[AGUARDANDO TRANSAÇÃO REAL]` | `[AGUARDANDO]` | 🟡 Pendente | - |

---

## 1. 💳 PIX - Pagamento com QR Code (PRODUÇÃO)

### 1.1 Request - Produção

**Endpoint:** `POST https://api.pagseguro.com/orders`

**Headers:**
```
Authorization: Bearer <TOKEN_PRODUCAO>
Content-Type: application/json
```

```json
{
    "reference_id": "[PREENCHER COM REFERENCE_ID REAL]",
    "customer": {
        "name": "[NOME CLIENTE REAL]",
        "email": "[EMAIL REAL]",
        "tax_id": "[CPF REAL]",
        "phones": [
            {
                "country": "55",
                "area": "[DDD]",
                "number": "[TELEFONE]",
                "type": "MOBILE"
            }
        ]
    },
    "items": [
        {
            "reference_id": "plano_escrita360",
            "name": "Plano Escrita360",
            "quantity": 1,
            "unit_amount": "[VALOR EM CENTAVOS]"
        }
    ],
    "qr_codes": [
        {
            "amount": {
                "value": "[VALOR EM CENTAVOS]"
            },
            "expiration_date": "[DATA EXPIRAÇÃO ISO8601]"
        }
    ],
    "notification_urls": [
        "https://api.escrita360.com/api/webhook/pagbank"
    ]
}
```

### 1.2 Response - Produção (AGUARDANDO)

```json
{
    "// AGUARDANDO LOG DE TRANSAÇÃO REAL EM PRODUÇÃO": "",
    "// Este campo será preenchido após a primeira transação PIX real": "",
    "id": "[ORDER_ID_PRODUCAO]",
    "reference_id": "[REFERENCE_ID]",
    "created_at": "[TIMESTAMP]",
    "qr_codes": [
        {
            "id": "[QRCO_ID_PRODUCAO]",
            "text": "[CODIGO PIX COPIA E COLA]",
            "links": []
        }
    ]
}
```

---

## 2. 💳 Cartão de Crédito - Pagamento (PRODUÇÃO)

### 2.1 Request - Produção

**Endpoint:** `POST https://api.pagseguro.com/orders`

**Headers:**
```
Authorization: Bearer <TOKEN_PRODUCAO>
Content-Type: application/json
```

```json
{
    "reference_id": "[PREENCHER COM REFERENCE_ID REAL]",
    "customer": {
        "name": "[NOME CLIENTE REAL]",
        "email": "[EMAIL REAL]",
        "tax_id": "[CPF REAL]",
        "phones": [
            {
                "country": "55",
                "area": "[DDD]",
                "number": "[TELEFONE]",
                "type": "MOBILE"
            }
        ]
    },
    "items": [
        {
            "reference_id": "plano_escrita360",
            "name": "Plano Escrita360",
            "quantity": 1,
            "unit_amount": "[VALOR EM CENTAVOS]"
        }
    ],
    "notification_urls": [
        "https://api.escrita360.com/api/webhook/pagbank"
    ],
    "charges": [
        {
            "reference_id": "[CHARGE_REFERENCE]",
            "description": "Pagamento Plano Escrita360",
            "amount": {
                "value": "[VALOR EM CENTAVOS]",
                "currency": "BRL"
            },
            "payment_method": {
                "type": "CREDIT_CARD",
                "installments": 1,
                "capture": true,
                "card": {
                    "encrypted": "[DADOS CARTÃO CRIPTOGRAFADOS]",
                    "store": false
                },
                "holder": {
                    "name": "[NOME NO CARTÃO]",
                    "tax_id": "[CPF TITULAR]"
                }
            }
        }
    ]
}
```

### 2.2 Response - Produção (AGUARDANDO)

```json
{
    "// AGUARDANDO LOG DE TRANSAÇÃO REAL EM PRODUÇÃO": "",
    "// Este campo será preenchido após a primeira transação de cartão real": "",
    "id": "[ORDER_ID_PRODUCAO]",
    "reference_id": "[REFERENCE_ID]",
    "created_at": "[TIMESTAMP]",
    "charges": [
        {
            "id": "[CHAR_ID_PRODUCAO]",
            "status": "[PAID/DECLINED]",
            "paid_at": "[TIMESTAMP]",
            "payment_response": {
                "code": "[CODIGO]",
                "message": "[MENSAGEM]",
                "raw_data": {
                    "authorization_code": "[CODIGO_AUTORIZACAO]",
                    "nsu": "[NSU]"
                }
            }
        }
    ]
}
```

---

## 📝 Como Capturar os Logs de Produção

### Passo 1: Configurar Logging no Backend

Adicione logging detalhado nas chamadas à API PagBank:

```javascript
// Exemplo de logging para capturar request/response
const logPagBankTransaction = async (request, response) => {
    const logEntry = {
        timestamp: new Date().toISOString(),
        environment: 'PRODUCTION',
        endpoint: request.url,
        request: {
            method: request.method,
            headers: { ...request.headers, Authorization: '[REDACTED]' },
            body: request.body
        },
        response: {
            status: response.status,
            body: response.data
        }
    };
    
    console.log('=== PAGBANK PRODUCTION LOG ===');
    console.log(JSON.stringify(logEntry, null, 2));
    console.log('==============================');
    
    // Salvar em arquivo ou banco de dados
    fs.appendFileSync('logs/pagbank_production.log', JSON.stringify(logEntry) + '\n');
};
```

### Passo 2: Realizar Transação de Teste Real

1. Configure as credenciais de **PRODUÇÃO** no `.env`
2. Acesse o sistema em produção
3. Realize um pagamento real (pode ser de valor mínimo)
4. Capture os logs gerados

### Passo 3: Preencher este Documento

Após capturar os logs, substitua os campos `[AGUARDANDO...]` pelos valores reais.

---

## 3. � Webhook - Notificações (PRODUÇÃO)

### 3.1 Configuração de Produção

```
URL: https://api.escrita360.com/api/webhook/pagbank
Método: POST
Content-Type: application/json
Ambiente: PRODUÇÃO
```

### 3.2 Exemplo de Payload Recebido (AGUARDANDO)

```json
{
    "// AGUARDANDO WEBHOOK REAL EM PRODUÇÃO": "",
    "id": "[ORDER_ID_PRODUCAO]",
    "reference_id": "[REFERENCE_ID]",
    "charges": [
        {
            "id": "[CHAR_ID]",
            "status": "[STATUS]",
            "paid_at": "[TIMESTAMP]",
            "amount": {
                "value": "[VALOR]",
                "currency": "BRL"
            }
        }
    ]
}
```

---

## 4. 📈 Códigos de Resposta Esperados

### 4.1 Códigos de Sucesso

| Código | Mensagem | Descrição |
|--------|----------|-----------|
| `20000` | SUCESSO | Transação aprovada |
| `20001` | SUCESSO | Transação pré-autorizada |

### 4.2 Códigos de Erro Comuns

| Código | Mensagem | Ação Recomendada |
|--------|----------|------------------|
| `40001` | Dados inválidos | Verificar payload |
| `40002` | Cartão inválido | Verificar dados do cartão |
| `40003` | CVV inválido | Verificar código de segurança |
| `40004` | Data expiração inválida | Verificar validade |
| `41001` | Saldo insuficiente | Informar cliente |
| `41002` | Cartão bloqueado | Informar cliente |
| `42001` | Transação não autorizada | Tentar outro cartão |

---

## 5. 📝 Template para Registro de Logs de Produção

Utilize este template para registrar cada transação real:

```
=====================================
🔴 TRANSAÇÃO PRODUÇÃO - PAGBANK
=====================================
TIPO: [PIX/CARTÃO/BOLETO]
DATA: YYYY-MM-DD HH:MM:SS
AMBIENTE: PRODUÇÃO (api.pagseguro.com)
-------------------------------------
ORDER_ID: ORDE_XXXX-XXXX-XXXX
CHARGE_ID: CHAR_XXXX-XXXX-XXXX
VALOR: R$ XX,XX
STATUS: [CREATED/PAID/CANCELED/DECLINED]
CLIENTE: [email - anonimizado se necessário]
-------------------------------------
REQUEST:
{
    // payload JSON completo
}
-------------------------------------
RESPONSE:
{
    // response JSON completo
}
-------------------------------------
CÓDIGO RESPOSTA: XXXXX
MENSAGEM: XXXXXXX
CÓDIGO AUTORIZAÇÃO: XXXXXX (se cartão)
NSU: XXXXXX (se cartão)
=====================================
```

---

## 6. ✅ Próximos Passos para Obter Logs de Produção

### Checklist

- [ ] **1. Obter credenciais de produção** no painel PagBank
- [ ] **2. Configurar variáveis de ambiente** com token de produção
- [ ] **3. Configurar webhook** de produção no painel PagBank
- [ ] **4. Realizar transação de teste real** (valor mínimo)
- [ ] **5. Capturar logs** do request e response
- [ ] **6. Preencher este documento** com os dados reais
- [ ] **7. Enviar para o PagBank** para validação

### Informações Necessárias do PagBank

Para prosseguir com os testes em produção, precisamos confirmar:

1. ✅ Token de produção ativo
2. ✅ URL de webhook configurada: `https://api.escrita360.com/api/webhook/pagbank`
3. ✅ Domínio com HTTPS válido
4. ⏳ Primeira transação real pendente

---

## 📚 Referências

- [Documentação PagBank API](https://dev.pagbank.uol.com.br/)
- [Painel de Produção](https://painel.pagseguro.uol.com.br/)

---

*Documento atualizado em 09/01/2026 - Escrita360*  
*Status: AGUARDANDO LOGS DE PRODUÇÃO*  
*Versão: 2.0*
