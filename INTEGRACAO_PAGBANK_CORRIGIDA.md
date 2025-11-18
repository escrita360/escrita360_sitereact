# Integração PagBank - Correções Implementadas

## ✅ Problema Identificado

O erro **403 Forbidden** estava ocorrendo devido a incompatibilidade no formato dos dados enviados pelo frontend para o backend.

### Dados Esperados pelo Backend
```json
{
  "plan_name": "Premium",
  "plan_description": "Plano Premium - Escrita360",
  "amount": 9900,  // Em centavos
  "interval_unit": "MONTH",
  "interval_value": 1,
  "customer": {
    "name": "João Silva",
    "email": "joao@example.com",
    "cpf": "12345678900",  // Sem formatação
    "phone": {
      "area_code": "11",
      "number": "987654321"
    }
  },
  "payment_method": "CREDIT_CARD",
  "cardData": { ... }
}
```

## 🔧 Correções Implementadas

### 1. Arquivo: `src/services/payment.js`

#### Função: `createPagBankSubscription()`

**Antes:**
```javascript
customer: {
  name: customerData.name,
  email: customerData.email,
  cpf: customerData.cpf,
  phone: customerData.phone  // String: "(11) 98765-4321"
}
```

**Depois:**
```javascript
// Processar telefone para o formato correto
const phoneClean = customerData.phone.replace(/\D/g, '')
const phoneFormatted = phoneClean.length === 11 
  ? { area_code: phoneClean.substring(0, 2), number: phoneClean.substring(2) }
  : { area_code: phoneClean.substring(0, 2), number: phoneClean.substring(2) }

customer: {
  name: customerData.name,
  email: customerData.email,
  cpf: customerData.cpf.replace(/\D/g, ''),  // Remove formatação
  phone: phoneFormatted  // Objeto: {area_code: "11", number: "987654321"}
}
```

**Conversão de Preço:**
```javascript
amount: Math.round(planData.price * 100),  // Converte R$ 99.00 para 9900 centavos
```

#### Função: `createPagBankPixPayment()`

Aplicadas as mesmas correções de formatação:
- CPF sem formatação
- Telefone como objeto com `area_code` e `number`
- Valor em centavos

## 📋 Formato dos Dados por Etapa

### Frontend (Pagamento.jsx)
```javascript
customerData={{
  name: formData.cardName || formData.email.split('@')[0],
  email: formData.email,
  cpf: formData.cpf,           // "123.456.789-00"
  phone: formData.phone         // "(11) 98765-4321"
}}

planData={{
  planId: selectedPlan.name.toLowerCase(),
  name: selectedPlan.name,
  price: price                  // 99.00 (em reais)
}}
```

### Serviço (payment.js)
O serviço agora processa:
1. **CPF**: Remove pontos e traços → `"12345678900"`
2. **Telefone**: Converte para objeto → `{area_code: "11", number: "987654321"}`
3. **Preço**: Multiplica por 100 → `9900` (centavos)

### Backend (app.js)
Recebe dados prontos no formato PagBank:
```javascript
{
  plan_name: "Premium",
  amount: 9900,  // centavos
  customer: {
    cpf: "12345678900",
    phone: { area_code: "11", number: "987654321" }
  }
}
```

## 🧪 Testes

### Teste Manual via Terminal
```powershell
$body = @{
  plan_name="Premium"
  amount=9900
  customer=@{
    name="João Silva"
    email="joao@example.com"
    cpf="12345678900"
    phone=@{area_code="11"; number="987654321"}
  }
  interval_unit="MONTH"
  interval_value=1
  payment_method="CREDIT_CARD"
} | ConvertTo-Json -Depth 10

Invoke-WebRequest -Uri "http://localhost:5001/api/payment/create-pagbank-subscription" -Method POST -Headers @{"Content-Type"="application/json"} -Body $body
```

**Resultado:** ✅ 201 Created

### Script de Teste Automático
Criado: `scripts/test-frontend-pagbank.ps1`
- Simula dados do frontend
- Aplica as mesmas transformações
- Testa endpoint do backend

## 🎯 Validação

### Checklist de Integração
- ✅ CPF sem formatação (apenas números)
- ✅ Telefone como objeto com `area_code` e `number`
- ✅ Valor em centavos (multiplicado por 100)
- ✅ Campos obrigatórios presentes: `plan_name`, `amount`, `interval_unit`, `interval_value`
- ✅ Backend responde 201 Created
- ✅ Modo demo ativo (token PagBank não configurado)

## 📝 Próximos Passos

### Para Usar API Real do PagBank
1. Acesse https://painel.pagseguro.uol.com.br/
2. Vá em **Integrações > API**
3. Gere um token com permissões completas
4. Configure no arquivo `.env` do backend:
   ```
   PAGBANK_TOKEN=seu_token_aqui
   ```
5. Reinicie o servidor backend

### Para Testar no Frontend
1. Inicie o backend: `cd server && npm start` (porta 5001)
2. Inicie o frontend: `pnpm dev` (porta 5173)
3. Acesse `/precos` e selecione um plano
4. Preencha todos os campos obrigatórios
5. Escolha "Assinatura Recorrente"
6. Verifique o console do browser para logs

## 🔍 Debugging

### Console do Backend
```
📥 Recebendo dados para criar assinatura: {...}
✅ Assinatura criada com sucesso: {...}
```

### Console do Frontend
```javascript
🔄 Criando assinatura recorrente com PagBank...
✅ Assinatura criada: {...}
⚠️ Modo DEMO ativo (se token não configurado)
```

### Logs de Erro
Se houver erro 403, verificar:
1. Campos obrigatórios estão presentes?
2. Formato do telefone está correto?
3. CPF está sem formatação?
4. Valor está em centavos?

## 📚 Referências
- Documentação PagBank: https://dev.pagbank.uol.com.br/
- API de Assinaturas: https://dev.pagbank.uol.com.br/reference/criar-plano
- Código Frontend: `src/services/payment.js`
- Código Backend: `server/app/routes/payment.js`
