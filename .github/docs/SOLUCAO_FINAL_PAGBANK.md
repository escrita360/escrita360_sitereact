# Solução Final: PagBank Assinaturas com Cartão de Crédito

## Problema Identificado

O erro estava acontecendo porque a API do PagBank de Assinaturas exige uma estrutura específica para cartões de crédito:

```
"customer.billing_info[0].card"
"Subscription can not be created with credit card payment method because customer dont have a valid card."
```

## Estrutura Correta do Payload

De acordo com a documentação oficial do PagBank, para criar uma assinatura com cartão de crédito:

### 1. O Customer DEVE ter `billing_info` com o cartão:

```json
{
  "customer": {
    "name": "Cliente Nome",
    "email": "cliente@email.com",
    "tax_id": "12345678909",
    "phones": [{
      "country": "55",
      "area": "11",
      "number": "999999999",
      "type": "MOBILE"
    }],
    "billing_info": [{
      "type": "CREDIT_CARD",
      "card": {
        "number": "5555666677778884",
        "exp_month": "12",
        "exp_year": "2026",
        "security_code": "123",
        "holder": {
          "name": "TITULAR DO CARTAO"
        }
      }
    }]
  }
}
```

### 2. O `payment_method` deve REFERENCIAR o cartão do billing_info:

```json
{
  "payment_method": [{
    "type": "CREDIT_CARD"
  }]
}
```

**NÃO** deve repetir os dados do cartão aqui!

## Fluxo Correto

1. **Cliente com cartão em billing_info** → Define o cartão disponível
2. **payment_method apenas com type** → Usa o cartão já definido em billing_info
3. **PagBank valida e cria a assinatura** → Cobrança automática mensal

## Implementação

```javascript
// Correto para cartão de crédito
const payload = {
  reference_id: `subscription_${Date.now()}`,
  plan: { id: planId },
  customer: {
    reference_id: `customer_${Date.now()}`,
    name: customerData.name,
    email: customerData.email,
    tax_id: customerData.cpf,
    phones: [{
      country: "55",
      area: customerData.phone.area_code,
      number: customerData.phone.number,
      type: "MOBILE"
    }],
    billing_info: [{
      type: "CREDIT_CARD",
      card: {
        number: cardData.number,
        exp_month: cardData.expiryMonth,
        exp_year: cardData.expiryYear,
        security_code: cardData.cvv,
        holder: {
          name: cardData.holderName
        }
      }
    }]
  },
  payment_method: [{
    type: "CREDIT_CARD"
  }],
  amount: {
    value: amountInCents,
    currency: "BRL"
  }
}
```

## Diferença: Boleto vs Cartão

### Para Boleto:
- **NÃO** precisa de `billing_info`
- `payment_method` só tem `type: "BOLETO"`

### Para Cartão:
- **PRECISA** de `billing_info` com os dados do cartão
- `payment_method` só tem `type: "CREDIT_CARD"` (sem dados do cartão)

## Por que essa estrutura?

O PagBank usa `billing_info` para:
1. **Validar o cartão** antes de criar a assinatura
2. **Armazenar os dados** de forma segura
3. **Cobrar automaticamente** nos ciclos futuros

O `payment_method` apenas indica QUAL método usar dos disponíveis em `billing_info`.
