# Diagnóstico: Pagamento Recorrente não funcionando em Sandbox

## Problema Identificado

O erro `ERR_CONNECTION_REFUSED` ocorre porque **o backend não está rodando** quando o frontend tenta fazer a requisição para criar a assinatura recorrente.

## Erros Encontrados

### 1. Erro no nome do módulo (RESOLVIDO ✅)
**Arquivo:** `escrita360_backend/app/routes/payment.js`

```javascript
// ❌ ANTES (errado - arquivo não existe)
const PagBankSubscriptionsService = require('../services/pagbankSubscriptionsService');

// ✅ DEPOIS (correto - arquivo existe com underscores)
const PagBankSubscriptionsService = require('../services/pagbank_subscriptions_service');
```

### 2. Token de Teste no .env (CRÍTICO ⚠️)
**Arquivo:** `escrita360_backend/.env`

```dotenv
# ⚠️ PROBLEMA: Token de teste não funciona na API real do PagBank
PAGBANK_TOKEN=test_token_pagbank

# ✅ SOLUÇÃO: Você precisa obter um token REAL do PagBank Sandbox
# Acesse: https://pagseguro.uol.com.br/preferencias/integracoes.jhtml
# E substitua por um token válido do ambiente Sandbox
PAGBANK_TOKEN=seu_token_sandbox_real_aqui
```

### 3. Configuração do Servidor

O servidor backend está configurado corretamente agora:

```javascript
// app.js
const port = process.env.PORT || 5000;
const server = app.listen(port, 'localhost', () => {
    console.log(`✅ Server running on http://localhost:${port}`);
    console.log(`✅ Health check: http://localhost:${port}/health`);
    console.log(`✅ API ready: http://localhost:${port}/api/payment`);
});
```

## Solução Completa

### Passo 1: Obter Token Real do PagBank Sandbox

1. Acesse sua conta no PagSeguro/PagBank
2. Vá em **Integrações** → **Token de Segurança**
3. Gere um token para o ambiente **Sandbox**
4. Copie o token gerado

### Passo 2: Configurar o .env corretamente

Edite o arquivo `escrita360_backend/.env`:

```dotenv
# PagBank (Sandbox)
PAGBANK_ENV=sandbox
PAGBANK_TOKEN=SEU_TOKEN_SANDBOX_REAL_AQUI
PAGBANK_APP_ID=seu_app_id_se_necessario

# Node.js
NODE_ENV=development
PORT=5000
SECRET_KEY=dev_secret_key_12345
```

### Passo 3: Iniciar o Backend

Abra um terminal **separado** para o backend:

```powershell
# Navegue até a pasta do backend
cd d:\github\escrita360_sitereact\escrita360_backend

# Instale as dependências (se ainda não instalou)
npm install

# Inicie o servidor em modo desenvolvimento
npm run dev
```

Você deve ver:

```
✅ Server running on http://localhost:5000
✅ Health check: http://localhost:5000/health
✅ API ready: http://localhost:5000/api/payment
🎧 Server is now listening...
```

### Passo 4: Iniciar o Frontend

Em **outro terminal**:

```powershell
# Navegue até a pasta do frontend
cd d:\github\escrita360_sitereact

# Inicie o frontend
pnpm dev
```

### Passo 5: Testar o Pagamento Recorrente

1. Acesse `http://localhost:5173` (ou a porta que o Vite estiver usando)
2. Vá até a página de pagamento
3. Selecione um plano
4. Escolha "Assinatura Recorrente"
5. Preencha os dados do cliente:
   - Nome completo
   - Email válido
   - CPF (formato: 123.456.789-00)
   - Telefone (formato: (11) 98765-4321)
6. Clique em "Criar Assinatura Recorrente"

## Estrutura de Requisição

O frontend envia para o backend:

```javascript
POST http://localhost:5000/api/payment/create-pagbank-subscription

{
  "plan_name": "Profissional",
  "plan_description": "Plano Profissional - Escrita360",
  "amount": 29.90,
  "interval_unit": "MONTH",
  "interval_value": 1,
  "customer": {
    "name": "João da Silva",
    "email": "joao@example.com",
    "cpf": "12345678900",
    "phone": "11987654321"
  },
  "payment_method": "BOLETO"
}
```

O backend então chama a API do PagBank Subscriptions:

```javascript
// 1. Cria o plano
POST https://sandbox.api.assinaturas.pagseguro.com/plans

// 2. Cria a assinatura
POST https://sandbox.api.assinaturas.pagseguro.com/subscriptions
```

## Validações Necessárias

### No Frontend (PagBankCheckout.jsx)

```javascript
const validateBeforeSubmit = () => {
  // Nome: mínimo 3 caracteres
  if (!customerData.name || customerData.name.trim().length < 3) {
    toast.error('Nome deve ter pelo menos 3 caracteres');
    return false;
  }
  
  // Email: formato válido
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(customerData.email)) {
    toast.error('Email inválido');
    return false;
  }
  
  // CPF: 11 dígitos
  const cpfOnly = customerData.cpf.replace(/\D/g, '');
  if (cpfOnly.length !== 11) {
    toast.error('CPF deve ter 11 dígitos');
    return false;
  }
  
  // Telefone: mínimo 10 dígitos (DDD + número)
  const phoneOnly = customerData.phone.replace(/\D/g, '');
  if (phoneOnly.length < 10) {
    toast.error('Telefone inválido');
    return false;
  }
  
  return true;
};
```

### No Backend (pagbank_subscriptions_service.js)

O serviço já faz:
- Formatação do CPF (remove caracteres não-numéricos)
- Formatação do telefone (separa DDD e número)
- Validação de campos obrigatórios

## Possíveis Erros e Soluções

### Erro: "Cannot find module"
✅ **RESOLVIDO** - Corrigido o nome do require no payment.js

### Erro: "ERR_CONNECTION_REFUSED"
- **Causa:** Backend não está rodando
- **Solução:** Inicie o backend com `npm run dev` no diretório `escrita360_backend`

### Erro: "Unauthorized" ou "Invalid token"
- **Causa:** Token do PagBank inválido ou expirado
- **Solução:** Gere um novo token no painel do PagSeguro e atualize o `.env`

### Erro: "Invalid CPF" ou "Invalid phone"
- **Causa:** Formato inválido nos dados do cliente
- **Solução:** O backend já formata automaticamente, mas certifique-se de enviar dados válidos:
  - CPF: números apenas, 11 dígitos
  - Telefone: números apenas, mínimo 10 dígitos (DDD + número)

## Próximos Passos

### Para Produção:

1. **Obter credenciais de produção:**
   - Token de produção do PagBank
   - Configurar webhook para notificações de pagamento

2. **Atualizar variável de ambiente:**
   ```dotenv
   PAGBANK_ENV=production
   PAGBANK_TOKEN=seu_token_producao_aqui
   ```

3. **Implementar webhook handler:**
   - Endpoint para receber notificações do PagBank
   - Atualizar status das assinaturas no banco de dados
   - Enviar emails de confirmação

4. **Adicionar persistência:**
   - Salvar assinaturas criadas em um banco de dados
   - Ligar assinaturas aos usuários
   - Controlar acesso baseado no status da assinatura

## Teste Rápido

Para verificar se o backend está funcionando, execute:

```powershell
# Em um terminal separado
cd d:\github\escrita360_sitereact
.\test-backend-simple.ps1
```

Este script testa:
1. Health check endpoint
2. Root endpoint
3. Criação de assinatura recorrente

## Observações Importantes

- **Sandbox do PagBank:** Use dados de teste fornecidos na documentação
- **CPF de teste:** 123.456.789-00
- **Email de teste:** Use qualquer email válido
- **Timeout:** A API do PagBank pode demorar alguns segundos para responder
- **Rate Limiting:** Cuidado com muitas requisições seguidas

## Status Atual

✅ Código corrigido (require do módulo)  
✅ Servidor configurado corretamente  
⚠️ Token de teste precisa ser substituído por token real do Sandbox  
⚠️ Backend precisa estar rodando para o frontend funcionar  
⚠️ Validações do frontend precisam ser implementadas  

## Conclusão

O problema principal é que o backend não estava rodando quando o frontend tentou fazer a requisição. Além disso, o token no `.env` é apenas um placeholder e precisa ser substituído por um token real do PagBank Sandbox.

**Para testar imediatamente:**
1. Obtenha um token real do PagBank Sandbox
2. Atualize o `.env`
3. Inicie o backend em um terminal separado
4. Inicie o frontend em outro terminal
5. Teste a criação de assinatura

---

**Data:** 18/11/2025  
**Status:** Diagnóstico completo - Aguardando token real do PagBank para testes
