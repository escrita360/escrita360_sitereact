# 🔧 Solução: Assinatura PagBank não funciona no site

## 📋 Problema Identificado

O teste de assinatura (`scripts/test-pagbank-subscriptions.js`) funciona corretamente no ambiente de teste do PagBank, mas quando você tenta criar uma assinatura através do site, não funciona.

## 🔍 Causa Raiz

Existem **dois fluxos diferentes** de integração com PagBank:

### ✅ Script de Teste (Funciona)
```
Script → pagBankSubscriptionsService (Frontend)
       → PagBank API diretamente
```
- Usa `VITE_PAGBANK_TOKEN` do arquivo `.env` (raiz do projeto)
- Acessa a API do PagBank **diretamente do Node.js**
- Token está configurado corretamente

### ❌ Site/Frontend (Não Funciona)
```
Site → paymentService.createPagBankSubscription()
     → Backend API (/api/payment/create-pagbank-subscription)
     → PagBankSubscriptionsService (Backend)
     → PagBank API
```
- Frontend chama o **backend** em `/api/payment/create-pagbank-subscription`
- Backend usa `PAGBANK_TOKEN` do arquivo `server/.env`
- **Token provavelmente NÃO está configurado no backend**

## ✅ Solução

### Passo 1: Configurar o Backend

O backend precisa do token PagBank configurado em `server/.env`:

```bash
# Navegue até a pasta do servidor
cd server

# Crie ou edite o arquivo .env
nano .env  # ou use seu editor preferido
```

Adicione/configure estas variáveis:

```bash
# ========================================
# CONFIGURAÇÕES PAGBANK - RECORRÊNCIA
# ========================================

# Ambiente (sandbox ou production)
PAGBANK_ENV=sandbox

# Email da conta PagBank
PAGBANK_EMAIL=seu_email@pagseguro.com.br

# Token da conta PagBank (OBRIGATÓRIO!)
# Obtenha em: https://painel.pagseguro.uol.com.br/
PAGBANK_TOKEN=seu_token_pagbank_aqui

# ========================================
# OUTRAS CONFIGURAÇÕES
# ========================================
NODE_ENV=development
PORT=5000
SECRET_KEY=sua_chave_secreta
FRONTEND_URL=http://localhost:5173
```

### Passo 2: Obter o Token PagBank

1. Acesse [Painel PagBank/PagSeguro](https://painel.pagseguro.uol.com.br/)
2. Faça login com sua conta
3. Vá em **Integrações** → **API**
4. Gere um token com **permissões completas** (criar planos, assinaturas, etc.)
5. Copie o token gerado

### Passo 3: Configurar o Token

**NO BACKEND** (`server/.env`):
```bash
PAGBANK_TOKEN=SEU_TOKEN_COPIADO_AQUI
PAGBANK_ENV=sandbox
```

**NO FRONTEND** (`.env` na raiz - apenas para testes):
```bash
VITE_PAGBANK_TOKEN=SEU_TOKEN_COPIADO_AQUI
VITE_PAGBANK_ENV=sandbox
```

> ⚠️ **IMPORTANTE**: O frontend NÃO precisa do token para o fluxo de produção (site), apenas o backend. O token no frontend é usado somente para scripts de teste.

### Passo 4: Reiniciar o Backend

```bash
# Na pasta server/
npm start

# Ou se estiver usando nodemon
npm run dev
```

Você deve ver no console:
```
🔧 PagBank Subscriptions Service inicializado
   Ambiente: sandbox
   Modo: 🔴 REAL
   Base URL: https://sandbox.api.assinaturas.pagseguro.com
```

Se aparecer `🎭 DEMO`, significa que o token não está configurado corretamente.

### Passo 5: Testar no Site

1. Acesse o site: http://localhost:5173
2. Vá para a página de preços
3. Selecione um plano
4. Preencha os dados do pagamento
5. Clique em "Criar Assinatura Recorrente"

## 🎯 Verificação

Para confirmar que está funcionando:

### Backend funcionando corretamente:
```
✅ Backend iniciado sem "MODO DEMO"
✅ Ao criar assinatura, ver no console: "📥 Recebendo dados para criar assinatura"
✅ Ver requisições sendo enviadas para PagBank API
✅ Resposta com ID de assinatura real (não DEMO)
```

### Frontend recebendo resposta:
```
✅ Não aparecer warning de "Modo DEMO"
✅ Receber ID de assinatura real do PagBank
✅ Mensagem de sucesso sem avisos de demonstração
```

## 🔍 Diagnóstico de Problemas

### Erro: "Token não autorizado" (403)
**Causa**: Token inválido, expirado ou sem permissões.

**Solução**:
1. Gere um novo token no painel PagBank
2. Certifique-se de dar **permissões completas**
3. Para API de Assinaturas, use token da API **v4** (não v3)

### Backend ainda em modo DEMO
**Causa**: Token não configurado ou inválido.

**Solução**:
1. Verifique se `PAGBANK_TOKEN` está no arquivo `server/.env`
2. Verifique se o token tem mais de 50 caracteres
3. Não deixe texto como "your_pagbank_token_here"

### Frontend chama backend, mas não recebe resposta
**Causa**: Backend não está rodando ou URL incorreta.

**Solução**:
1. Certifique-se de que o backend está rodando na porta 5000
2. Verifique `VITE_API_URL` no `.env` do frontend: `http://localhost:5000/api`

### CORS error
**Causa**: Backend não permite requisições do frontend.

**Solução**:
1. Verifique `FRONTEND_URL` em `server/.env`
2. Deve estar como `http://localhost:5173`

## 📁 Estrutura de Arquivos de Configuração

```
projeto/
├── .env                          # Frontend (apenas para testes)
│   └── VITE_PAGBANK_TOKEN
│   └── VITE_PAGBANK_ENV
│
└── server/
    └── .env                      # Backend (PRODUÇÃO!)
        └── PAGBANK_TOKEN         ← ESTE É O IMPORTANTE!
        └── PAGBANK_ENV
        └── PAGBANK_EMAIL
```

## 🎬 Comandos Rápidos

```bash
# 1. Configurar backend
cd server
cp .env.example .env
nano .env  # Adicionar PAGBANK_TOKEN

# 2. Instalar dependências (se necessário)
npm install

# 3. Iniciar backend
npm start

# 4. Em outro terminal, iniciar frontend
cd ..
pnpm dev
```

## 📚 Documentação Adicional

- [Documentação PagBank API](https://dev.pagbank.uol.com.br/)
- [API de Assinaturas](https://developer.pagbank.com.br/docs/pagamentos-recorrentes)
- [Painel PagBank](https://painel.pagseguro.uol.com.br/)

## ✅ Checklist Final

- [ ] Token PagBank obtido no painel
- [ ] Token configurado em `server/.env`
- [ ] `PAGBANK_ENV=sandbox` configurado
- [ ] Backend reiniciado após configuração
- [ ] Backend iniciou SEM modo DEMO
- [ ] Frontend consegue criar assinatura
- [ ] Assinatura retorna ID real (não DEMO_*)

---

**Se ainda tiver problemas**, verifique os logs do backend e do console do navegador para mensagens de erro específicas.
