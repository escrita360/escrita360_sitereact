# Guia de Implementação: API de Clientes PagBank

Este documento descreve a implementação completa da **API de Clientes** do PagBank para gerenciar clientes em ambiente de produção e sandbox.

## 📖 O que é a API de Clientes?

A API de Clientes do PagBank permite **criar e gerenciar clientes** que serão usados em:
- **Assinaturas recorrentes**
- **Pagamentos (Orders/Charges)**
- **Gestão de dados de cobrança**

### Para que serve?

- Armazenar dados do cliente no PagBank
- Reutilizar informações em múltiplos pagamentos
- Vincular clientes a assinaturas
- Manter histórico centralizado

## 🎯 Endpoints Disponíveis

### Documentados Oficialmente

| Método | Endpoint | Descrição | Status |
|--------|----------|-----------|--------|
| POST | `/customers` | Criar cliente | ✅ Oficial |
| GET | `/customers/:id` | Consultar cliente | ✅ Oficial |

### Não Documentados (Experimental)

| Método | Endpoint | Descrição | Status |
|--------|----------|-----------|--------|
| PUT | `/customers/:id` | Atualizar cliente | ⚠️ Não oficial |
| DELETE | `/customers/:id` | Deletar cliente | ❌ Não disponível |
| GET | `/customers` | Listar clientes | ⚠️ Não oficial |

## 🔧 Configuração

### 1. Variáveis de Ambiente

#### Sandbox (`.env`)

```bash
PAGBANK_ENV=sandbox
PAGBANK_TOKEN=seu_token_sandbox
```

#### Produção (`.env.production`)

```bash
PAGBANK_ENV=production
PAGBANK_TOKEN=seu_token_producao
```

### 2. Arquivos do Projeto

```
server/
├── app/
│   ├── services/
│   │   └── pagbank_customers_service.js    # Serviço de clientes
│   └── routes/
│       └── customers.js                     # Rotas da API
└── app.js                                   # Registro das rotas
```

## 📝 Criar Cliente

### Requisição

```bash
POST /api/customers
```

### Body (JSON)

```json
{
  "name": "João Silva",
  "email": "joao.silva@example.com",
  "tax_id": "12345678901",
  "phones": [
    {
      "country": "55",
      "area": "11",
      "number": "987654321",
      "type": "MOBILE"
    }
  ],
  "billing_info": {
    "address": {
      "street": "Avenida Paulista",
      "number": "1000",
      "complement": "Sala 100",
      "locality": "Bela Vista",
      "city": "São Paulo",
      "region_code": "SP",
      "country": "BRA",
      "postal_code": "01310100"
    }
  }
}
```

### Resposta

```json
{
  "success": true,
  "customer": {
    "id": "CUST_A1B2C3D4-E5F6-7890-ABCD-EF1234567890",
    "name": "João Silva",
    "email": "joao.silva@example.com",
    "tax_id": "12345678901",
    "phones": [
      {
        "country": "55",
        "area": "11",
        "number": "987654321",
        "type": "MOBILE"
      }
    ],
    "created_at": "2025-12-16T10:30:00-03:00"
  }
}
```

### Campos Obrigatórios

| Campo | Tipo | Descrição | Validação |
|-------|------|-----------|-----------|
| `name` | string | Nome completo | Mínimo 3 caracteres |
| `email` | string | Email válido | Formato email |
| `tax_id` | string | CPF ou CNPJ | 11 ou 14 dígitos (apenas números) |

### Campos Opcionais

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `phones` | array | Lista de telefones |
| `billing_info` | object | Informações de cobrança |

## 🔍 Consultar Cliente

### Requisição

```bash
GET /api/customers/:id
```

### Exemplo

```bash
curl --request GET \
  --url http://localhost:5000/api/customers/CUST_A1B2C3D4... \
  --header 'Content-Type: application/json'
```

### Resposta

```json
{
  "success": true,
  "customer": {
    "id": "CUST_A1B2C3D4-E5F6-7890-ABCD-EF1234567890",
    "name": "João Silva",
    "email": "joao.silva@example.com",
    "tax_id": "12345678901",
    "phones": [...],
    "created_at": "2025-12-16T10:30:00-03:00"
  }
}
```

## ✏️ Atualizar Cliente (Não Oficial)

⚠️ **ATENÇÃO**: Este endpoint não está documentado oficialmente e pode não funcionar.

### Requisição

```bash
PUT /api/customers/:id
```

### Body (todos campos opcionais)

```json
{
  "name": "João Silva Atualizado",
  "email": "novo.email@example.com",
  "phones": [
    {
      "country": "55",
      "area": "11",
      "number": "912345678",
      "type": "MOBILE"
    }
  ]
}
```

## ✅ Validar Dados

Valide dados do cliente **antes de criar**:

### Requisição

```bash
POST /api/customers/validate
```

### Body

```json
{
  "name": "João Silva",
  "email": "joao.silva@example.com",
  "tax_id": "12345678901"
}
```

### Resposta (sucesso)

```json
{
  "success": true,
  "valid": true,
  "message": "Dados válidos"
}
```

### Resposta (erro)

```json
{
  "success": false,
  "valid": false,
  "errors": [
    "Nome é obrigatório (mínimo 3 caracteres)",
    "Email inválido",
    "CPF deve ter 11 dígitos ou CNPJ 14 dígitos"
  ]
}
```

## 💻 Exemplos de Uso

### Node.js (Backend)

```javascript
const PagBankCustomersService = require('./services/pagbank_customers_service');

const customersService = new PagBankCustomersService();

// Criar cliente
const customer = await customersService.createCustomer({
  name: 'João Silva',
  email: 'joao@example.com',
  tax_id: '12345678901',
  phones: [{
    country: '55',
    area: '11',
    number: '987654321',
    type: 'MOBILE'
  }]
});

console.log('Cliente criado:', customer.id);

// Consultar cliente
const data = await customersService.getCustomer(customer.id);
console.log('Dados do cliente:', data);
```

### Frontend (Axios)

```javascript
import axios from 'axios';

// Criar cliente
const response = await axios.post('/api/customers', {
  name: 'João Silva',
  email: 'joao@example.com',
  tax_id: '12345678901',
  phones: [{
    country: '55',
    area: '11',
    number: '987654321',
    type: 'MOBILE'
  }]
});

const customerId = response.data.customer.id;

// Consultar cliente
const customer = await axios.get(`/api/customers/${customerId}`);
console.log(customer.data);
```

### cURL

```bash
# Criar cliente
curl --request POST \
  --url http://localhost:5000/api/customers \
  --header 'Content-Type: application/json' \
  --data '{
    "name": "João Silva",
    "email": "joao@example.com",
    "tax_id": "12345678901",
    "phones": [{
      "country": "55",
      "area": "11",
      "number": "987654321",
      "type": "MOBILE"
    }]
  }'

# Consultar cliente
curl --request GET \
  --url http://localhost:5000/api/customers/CUST_ID_AQUI \
  --header 'Content-Type: application/json'
```

## 🔗 Integração com Assinaturas

### Criar Assinatura com Cliente Existente

```javascript
// 1. Criar ou obter cliente
const customer = await customersService.createCustomer({...});

// 2. Criar assinatura usando o customer.id
const subscription = await subscriptionsService.createSubscription({
  plan_id: 'PLAN_123',
  customer: {
    id: customer.id  // Usa ID do cliente existente
  },
  payment_method: {...}
});
```

### Criar Assinatura com Novo Cliente

```javascript
// Criar assinatura passando dados do cliente diretamente
const subscription = await subscriptionsService.createSubscription({
  plan_id: 'PLAN_123',
  customer: {
    name: 'João Silva',
    email: 'joao@example.com',
    tax_id: '12345678901'
  },
  payment_method: {...}
});

// PagBank cria o cliente automaticamente
console.log('Cliente criado:', subscription.customer.id);
```

## 🧪 Testes

### Teste Completo

```bash
# Execute o script de teste
node test-customers.js
```

O script testa:
1. ✅ Informações do serviço
2. ✅ Validação de dados
3. ✅ Criação de cliente
4. ✅ Consulta de cliente
5. ⚠️ Atualização (não oficial)

### Teste Manual (API)

```bash
# 1. Verificar serviço
curl http://localhost:5000/api/customers/info

# 2. Validar dados
curl -X POST http://localhost:5000/api/customers/validate \
  -H "Content-Type: application/json" \
  -d '{"name":"João","email":"joao@example.com","tax_id":"12345678901"}'

# 3. Criar cliente
curl -X POST http://localhost:5000/api/customers \
  -H "Content-Type: application/json" \
  -d '{"name":"João Silva","email":"joao@example.com","tax_id":"12345678901"}'

# 4. Consultar cliente (use ID retornado)
curl http://localhost:5000/api/customers/CUST_ID_AQUI
```

## 🔐 Segurança

### Boas Práticas

#### 1. Validação de Dados

```javascript
// Sempre valide antes de criar
const errors = customersService.validateCustomerData(data);
if (errors.length > 0) {
  throw new Error(`Dados inválidos: ${errors.join(', ')}`);
}
```

#### 2. Proteção de Dados Sensíveis

```javascript
// Não exponha customer.id no frontend
// Armazene no banco de dados do backend

// ❌ ERRADO
localStorage.setItem('customerId', customer.id);

// ✅ CERTO (backend)
await db.users.update({ id: userId }, { 
  pagbank_customer_id: customer.id 
});
```

#### 3. CPF/CNPJ Válido

```javascript
// Em produção, use CPF/CNPJ reais e válidos
const isProduction = process.env.PAGBANK_ENV === 'production';

if (isProduction) {
  // Validar CPF com algoritmo de verificação
  if (!isValidCPF(customerData.tax_id)) {
    throw new Error('CPF inválido');
  }
}
```

#### 4. Rate Limiting

```javascript
// Implemente rate limiting para evitar abuso
const rateLimit = require('express-rate-limit');

const createCustomerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10 // 10 requests por IP
});

app.post('/api/customers', createCustomerLimiter, async (req, res) => {
  // ...
});
```

## 🐛 Troubleshooting

### Erro: "Validação falhou"

**Causa**: Dados obrigatórios faltando ou inválidos.

**Solução**:
1. Verifique se `name`, `email` e `tax_id` estão presentes
2. Use `/api/customers/validate` para verificar dados
3. Confira formato: CPF (11 dígitos) ou CNPJ (14 dígitos)

### Erro: "401 Unauthorized"

**Causa**: Token PagBank inválido ou não configurado.

**Solução**:
```bash
# Verifique variáveis de ambiente
echo $PAGBANK_TOKEN

# Configure no .env
PAGBANK_TOKEN=seu_token_aqui
```

### Erro: "404 Not Found" ao consultar cliente

**Causa**: Cliente não existe ou ID incorreto.

**Solução**:
1. Verifique se o ID está correto (formato: `CUST_...`)
2. Confirme que o cliente foi criado no mesmo ambiente (sandbox/production)

### Cliente criado mas não aparece em assinaturas

**Causa**: Cliente criado em ambiente diferente (sandbox vs production).

**Solução**:
1. Verifique `PAGBANK_ENV` na criação do cliente
2. Use o mesmo ambiente para assinaturas
3. Em produção, recrie o cliente no ambiente correto

## 📊 Monitoramento

### Logs Importantes

```javascript
// Log de sucesso
console.log('✅ Cliente criado:', customer.id);

// Log de erro
console.error('❌ Erro ao criar cliente:', error.message);

// Log de validação
console.warn('⚠️ Dados inválidos:', errors);
```

### Métricas

- Taxa de sucesso de criação de clientes
- Tempo de resposta da API
- Erros de validação mais comuns
- Clientes criados por dia/semana/mês

## 🚀 Diferenças Sandbox vs Produção

| Aspecto | Sandbox | Produção |
|---------|---------|----------|
| URL Base | `https://sandbox.api.pagseguro.com` | `https://api.pagseguro.com` |
| Token | Token de teste | Token real |
| CPF/CNPJ | Pode ser fictício | **Deve ser válido** |
| Email | Qualquer | **Deve ser válido** |
| Dados | Para testes | **Dados reais de clientes** |

## ✅ Checklist de Produção

Antes de usar em produção:

- [ ] Token de produção configurado (`PAGBANK_ENV=production`)
- [ ] CPF/CNPJ com validação implementada
- [ ] Email validation implementada
- [ ] Rate limiting configurado
- [ ] Logs de auditoria habilitados
- [ ] Backup de customer IDs no banco de dados
- [ ] LGPD: Consentimento de uso de dados
- [ ] Política de privacidade atualizada
- [ ] Testado em sandbox antes
- [ ] Documentação interna atualizada

## 📚 Referências

### Documentação Oficial

- [API Customers](https://developer.pagbank.com.br/reference/customers)
- [Criar Cliente](https://developer.pagbank.com.br/reference/post_customers)
- [Consultar Cliente](https://developer.pagbank.com.br/reference/get_customers)

### Código do Projeto

- Service: `server/app/services/pagbank_customers_service.js`
- Routes: `server/app/routes/customers.js`
- Tests: `test-customers.js`
- Docs: `docs/PAGBANK_CUSTOMERS.md`

### Documentação Relacionada

- [Assinaturas](./PAGBANK_IMPLEMENTACAO.md)
- [Connect OAuth](./PAGBANK_CONNECT.md)
- [Produção](./PAGBANK_PRODUCAO.md)

## 🆘 Suporte

- **Documentação**: https://developer.pagbank.com.br/
- **Suporte PagBank**: https://app.pipefy.com/public/form/sBlh9Nq6
- **Status da API**: https://status.pagbank.uol.com.br/

---

✅ **API de Clientes PagBank configurada e pronta para uso em produção!**
