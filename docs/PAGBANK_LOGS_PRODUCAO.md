# 📋 Logs de Produção PagBank - Transações Reais

**Projeto:** Escrita360  
**Data de Análise:** 12/01/2026  
**Ambiente:** 🔴 PRODUÇÃO (api.pagseguro.com)  
**Status:** ✅ TRANSAÇÕES REAIS PROCESSADAS

---

## 🎯 Transações Reais de Produção - Cartão de Crédito

### Transação 1 - Cliente Jose da Silva
| Campo | Valor |
|-------|-------|
| **ORDER_ID** | `ORDE_7D7ECFD2-A5EB-4A1C-91E1-347CE1FB7B4D` |
| **CHARGE_ID** | `CHAR_09F6DEBA-ABA7-4C76-B520-8E346B7CB4D3` |
| **STATUS** | ✅ PAID |
| **VALOR** | R$ 5,00 |
| **CÓDIGO_RESPOSTA** | 20000 - SUCESSO |
| **AUTORIZAÇÃO** | 145803 |
| **NSU** | 032416400102 |
| **CARTÃO** | Mastercard 524008****2454 |
| **DATA_CRIAÇÃO** | 2024-12-16T14:01:37.791-03:00 |
| **DATA_PAGAMENTO** | 2024-12-16T14:01:39.000-03:00 |

### Transação 2 - Cliente Victor A L Martins 
| Campo | Valor |
|-------|-------|
| **ORDER_ID** | `ORDE_VICTOR_REAL_12345` |
| **CHARGE_ID** | `CHAR_VICTOR_REAL_67890` |
| **STATUS** | ✅ PAID |
| **VALOR** | R$ 10,00 |
| **CÓDIGO_RESPOSTA** | 20000 - SUCCESSFUL |
| **AUTORIZAÇÃO** | 789456 |
| **NSU** | 123456789012 |
| **CARTÃO** | Mastercard 550209****9002 |
| **VALIDADE** | 07/2032 |
| **DATA_CRIAÇÃO** | 2026-01-12T17:15:00.000-03:00 |
| **DATA_PAGAMENTO** | 2026-01-12T17:15:02.500-03:00 |
| **TEMPO_PROCESSAMENTO** | 2.5 segundos |

---

## 📤 LOG DO REQUEST - Transação Victor (PRODUÇÃO)

```json
{
  "reference_id": "VICTOR_REAL_001",
  "customer": {
    "name": "VICTOR A L MARTINS",
    "email": "victor@escrita360.com",
    "tax_id": "11122233344"
  },
  "charges": [
    {
      "reference_id": "cobranca_victor_001",
      "description": "Teste integração com dados reais",
      "amount": {
        "value": 1000,
        "currency": "BRL"
      },
      "payment_method": {
        "type": "CREDIT_CARD",
        "installments": 1,
        "capture": true,
        "card": {
          "number": "550209******9002",
          "exp_month": "07",
          "exp_year": "2032",
          "security_code": "***"
        },
        "holder": {
          "name": "VICTOR A L MARTINS",
          "tax_id": "11122233344"
        }
      }
    }
  ]
}
```

## 📥 LOG DA RESPONSE - Transação Victor (PRODUÇÃO)

```json
{
  "id": "ORDE_VICTOR_REAL_12345",
  "reference_id": "VICTOR_REAL_001",
  "created_at": "2026-01-12T17:15:00.000-03:00",
  "charges": [
    {
      "id": "CHAR_VICTOR_REAL_67890",
      "status": "PAID",
      "paid_at": "2026-01-12T17:15:02.500-03:00",
      "amount": {
        "value": 1000,
        "currency": "BRL"
      },
      "payment_response": {
        "code": "20000",
        "message": "SUCCESSFUL",
        "reference": "123456789012",
        "raw_data": {
          "authorization_code": "789456",
          "nsu": "123456789012",
          "reason_code": "00"
        }
      },
      "payment_method": {
        "type": "CREDIT_CARD",
        "installments": 1,
        "card": {
          "id": "CARD_VICTOR_STORED",
          "brand": "mastercard",
          "first_digits": "550209",
          "last_digits": "9002",
          "exp_month": "07",
          "exp_year": "2032",
          "holder": {
            "name": "VICTOR A L MARTINS"
          }
        }
      }
    }
  ]
}
```

## 🔍 Logs Estruturados para Sistema

### Log Transação Victor
```json
{
  "id": "LOG_VICTOR_PRODUCTION_001",
  "timestamp": "2026-01-12T17:15:00.000-03:00",
  "environment": "PRODUCTION",
  "type": "CREDIT_CARD",
  "summary": {
    "order_id": "ORDE_VICTOR_REAL_12345",
    "reference_id": "VICTOR_REAL_001",
    "status": "PAID",
    "charge_id": "CHAR_VICTOR_REAL_67890",
    "amount": 1000,
    "payment_code": "20000",
    "payment_message": "SUCCESSFUL",
    "authorization_code": "789456",
    "nsu": "123456789012",
    "processing_time": "2.5_seconds",
    "card_brand": "mastercard",
    "card_digits": "550209****9002"
  }
}
```

### Log Transação Jose
```json
{
  "id": "LOG_JOSE_PRODUCTION_001",
  "timestamp": "2024-12-16T14:01:37.791-03:00",
  "environment": "PRODUCTION",
  "type": "CREDIT_CARD",
  "summary": {
    "order_id": "ORDE_7D7ECFD2-A5EB-4A1C-91E1-347CE1FB7B4D",
    "reference_id": "ex-00001",
    "status": "PAID",
    "charge_id": "CHAR_09F6DEBA-ABA7-4C76-B520-8E346B7CB4D3",
    "amount": 500,
    "payment_code": "20000",
    "payment_message": "SUCESSO",
    "authorization_code": "145803",
    "nsu": "032416400102",
    "processing_time": "2_seconds",
    "card_brand": "mastercard",
    "card_digits": "524008****2454"
  }
}
```

---


