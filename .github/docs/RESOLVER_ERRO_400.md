# 🚨 ERRO 400: Como Resolver

## O que está acontecendo?

Você está recebendo o erro:
```
POST http://localhost:5000/api/payment/create-pagbank-subscription 400 (Bad Request)
```

Isso significa que o backend rejeitou a requisição. Há **3 possíveis causas**:

## ✅ Solução Rápida: Modo Simulação (RECOMENDADO)

Se você ainda não tem um token real do PagBank, use o modo simulação:

### 1. Verifique o arquivo `.env`

O arquivo `escrita360_backend/.env` deve conter:

```dotenv
# PagBank (Sandbox)
PAGBANK_ENV=sandbox
PAGBANK_TOKEN=test_token_pagbank
PAGBANK_APP_ID=test_app_id
PAGBANK_MOCK_MODE=true  # ← Esta linha ativa a simulação
```

### 2. Reinicie o Backend

```powershell
# Pare o backend (Ctrl+C no terminal onde está rodando)

# Na pasta do backend
cd d:\github\escrita360_sitereact\escrita360_backend

# Reinicie
npm run dev
```

Você deve ver:
```
⚠️ MODO SIMULAÇÃO ATIVADO - Nenhuma chamada real será feita à API do PagBank
✅ Server running on http://localhost:5000
```

### 3. Teste Novamente

1. Acesse o frontend (http://localhost:5173)
2. Vá para a página de pagamento
3. Tente criar uma assinatura recorrente

Com o modo simulação ativo:
- ✅ Não precisa de token real
- ✅ Retorna dados falsos mas realistas
- ✅ Permite testar toda a interface
- ✅ Não faz chamadas à API real do PagBank

## 🔑 Solução Definitiva: Token Real

Para usar a API real do PagBank:

### 1. Obter Token

Siga as instruções em: [COMO_OBTER_TOKEN_PAGBANK.md](./COMO_OBTER_TOKEN_PAGBANK.md)

### 2. Atualizar o `.env`

```dotenv
# PagBank (Sandbox)
PAGBANK_ENV=sandbox
PAGBANK_TOKEN=SEU_TOKEN_REAL_AQUI  # ← Cole seu token aqui
PAGBANK_APP_ID=seu_app_id
PAGBANK_MOCK_MODE=false  # ← Desativa a simulação
```

### 3. Reiniciar Backend

```powershell
# Pare e reinicie o backend
npm run dev
```

## 🔍 Verificar Logs Detalhados

Com as últimas alterações, o backend agora mostra logs detalhados.

Quando você tentar criar uma assinatura, verá no terminal do backend:

```
📥 Recebendo dados para criar assinatura: { ... }
🔄 POST https://sandbox.api.assinaturas.pagseguro.com/plans
📦 Payload: { ... }
```

Se houver erro, verá:

```
❌ Erro na requisição PagBank Subscriptions:
Status: 400
Dados do erro: { "error_messages": [...] }
```

## 📋 Checklist de Verificação

Antes de criar a assinatura, certifique-se:

- [ ] Backend está rodando (porta 5000)
- [ ] Frontend está rodando (porta 5173)
- [ ] Modo simulação está ativo OU token real está configurado
- [ ] Backend foi reiniciado após alterar o `.env`
- [ ] Formulário de pagamento está preenchido corretamente

### Dados do Formulário

Certifique-se de preencher:
- **Nome completo** (mínimo 3 caracteres)
- **Email válido** (formato: usuario@dominio.com)
- **CPF** (11 dígitos, pode ter pontos e hífen)
- **Telefone** (DDD + número, mínimo 10 dígitos)

## 🐛 Outros Erros Comuns

### "ERR_CONNECTION_REFUSED"
**Causa:** Backend não está rodando  
**Solução:** Execute `npm run dev` na pasta `escrita360_backend`

### "Network Error"
**Causa:** Backend travou ou não respondeu  
**Solução:** Verifique os logs do backend e reinicie

### "Unauthorized" (401)
**Causa:** Token inválido  
**Solução:** Ative o modo simulação OU obtenha token real

### "Forbidden" (403)
**Causa:** Token sem permissões  
**Solução:** Gere um novo token no painel PagBank

## 📞 Suporte

Se o problema persistir:

1. **Veja os logs do backend** (terminal onde rodou `npm run dev`)
2. **Veja o console do navegador** (F12 → Console)
3. **Execute o teste:** `.\test-backend-simple.ps1`
4. **Leia:** [DIAGNOSTICO_PAGAMENTO_RECORRENTE.md](./DIAGNOSTICO_PAGAMENTO_RECORRENTE.md)

## 🎯 Resumo

**Para testar rapidamente sem token real:**
1. Adicione `PAGBANK_MOCK_MODE=true` no `.env`
2. Reinicie o backend
3. Teste a criação de assinatura

**Para usar a API real:**
1. Obtenha token em https://sandbox.pagseguro.uol.com.br/
2. Configure no `.env`
3. Defina `PAGBANK_MOCK_MODE=false`
4. Reinicie o backend

---

**Última atualização:** 18/11/2025  
**Status:** Modo simulação implementado e funcional ✅
