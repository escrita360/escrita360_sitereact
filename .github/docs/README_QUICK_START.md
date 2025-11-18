# Guia Rápido - Pagamento Recorrente PagBank

## 🚀 Como Iniciar

### 1. Configurar o Token do PagBank

Antes de tudo, você precisa de um token real do PagBank Sandbox:

1. Acesse https://pagseguro.uol.com.br/
2. Faça login na sua conta
3. Vá em **Integrações** → **Token de Segurança**
4. Gere um token para **Sandbox**
5. Copie o token

### 2. Configurar o Backend

Edite o arquivo `escrita360_backend/.env`:

```dotenv
PAGBANK_ENV=sandbox
PAGBANK_TOKEN=COLE_SEU_TOKEN_AQUI
```

### 3. Iniciar o Backend

**Opção A - Script Automático (Recomendado):**

```powershell
# Na raiz do projeto
.\start-backend.ps1
```

**Opção B - Manual:**

```powershell
cd escrita360_backend
npm install  # Apenas na primeira vez
npm run dev
```

Aguarde ver:
```
✅ Server running on http://localhost:5000
✅ Health check: http://localhost:5000/health
✅ API ready: http://localhost:5000/api/payment
🎧 Server is now listening...
```

### 4. Iniciar o Frontend

Em **outro terminal**:

```powershell
cd d:\github\escrita360_sitereact
pnpm dev
```

### 5. Testar

1. Acesse http://localhost:5173
2. Vá para a página de pagamento
3. Selecione um plano
4. Escolha "Assinatura Recorrente"
5. Preencha os dados:
   - **Nome:** João da Silva
   - **Email:** joao@example.com
   - **CPF:** 123.456.789-00
   - **Telefone:** (11) 98765-4321
6. Clique em "Criar Assinatura Recorrente"

## 🔧 Scripts Disponíveis

### Backend

```powershell
# Iniciar em modo desenvolvimento (com hot reload)
npm run dev

# Iniciar em modo produção
npm start
```

### Testes

```powershell
# Testar se o backend está funcionando
.\test-backend-simple.ps1
```

## ❗ Problemas Comuns

### "ERR_CONNECTION_REFUSED"
**Causa:** Backend não está rodando  
**Solução:** Execute `.\start-backend.ps1`

### "Port 5000 already in use"
**Causa:** Já existe um processo na porta 5000  
**Solução:** O script `start-backend.ps1` oferece encerrar automaticamente

### "Unauthorized" ou "Invalid token"
**Causa:** Token do PagBank inválido  
**Solução:** Verifique se o token no `.env` é válido e do ambiente correto (Sandbox)

### "Invalid CPF" ou "Invalid phone"
**Causa:** Formato inválido  
**Solução:** Use os formatos corretos:
- CPF: 11 dígitos (123.456.789-00 ou 12345678900)
- Telefone: DDD + número (11987654321)

## 📁 Estrutura dos Arquivos

```
escrita360_sitereact/
├── escrita360_backend/          # Backend Node.js
│   ├── app.js                   # Servidor principal
│   ├── .env                     # Configurações (TOKEN aqui!)
│   ├── app/
│   │   ├── routes/
│   │   │   └── payment.js       # Rotas de pagamento
│   │   └── services/
│   │       └── pagbank_subscriptions_service.js
│   └── package.json
│
├── src/                         # Frontend React
│   ├── components/
│   │   └── PagBankCheckout.jsx  # Componente de checkout
│   ├── services/
│   │   └── payment.js           # Serviço de pagamento
│   └── ...
│
├── start-backend.ps1            # Script para iniciar backend
├── test-backend-simple.ps1      # Script para testar backend
└── DIAGNOSTICO_PAGAMENTO_RECORRENTE.md  # Diagnóstico completo
```

## 🔑 Dados de Teste Sandbox

Use estes dados para testar no ambiente Sandbox do PagBank:

- **CPF:** 123.456.789-00
- **Email:** qualquer email válido (ex: teste@example.com)
- **Telefone:** (11) 98765-4321
- **Nome:** Qualquer nome

## 📚 Documentação

- [PagBank API Assinaturas](https://dev.pagbank.uol.com.br/reference/assinaturas-overview)
- [Diagnóstico Completo](./DIAGNOSTICO_PAGAMENTO_RECORRENTE.md)

## ✅ Checklist

Antes de testar, certifique-se de que:

- [ ] Token do PagBank configurado no `.env`
- [ ] Backend rodando (porta 5000)
- [ ] Frontend rodando (porta 5173)
- [ ] Navegador aberto na página de pagamento
- [ ] Dados do cliente preenchidos corretamente

## 🆘 Suporte

Se encontrar problemas:

1. Verifique o console do backend (terminal onde rodou `npm run dev`)
2. Verifique o console do navegador (F12)
3. Execute o script de teste: `.\test-backend-simple.ps1`
4. Leia o [diagnóstico completo](./DIAGNOSTICO_PAGAMENTO_RECORRENTE.md)

---

**Última atualização:** 18/11/2025
