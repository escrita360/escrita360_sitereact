# 🧪 Testando Pagamento de Créditos no Sandbox PagBank

## ✅ Integração Real Implementada

O sistema agora está **integrado com o sandbox real do PagBank**, usando a API de Orders (pagamento único).

## 📋 Dados de Teste - Cartões Sandbox

### Cartões de APROVAÇÃO

Use estes cartões para simular pagamentos aprovados:

| Bandeira | Número | CVV | Validade | Status |
|----------|--------|-----|----------|--------|
| **Visa** | `4111 1111 1111 1111` | `123` | Qualquer futura | ✅ APROVADO |
| **Mastercard** | `5555 5555 5555 5555` | `123` | Qualquer futura | ✅ APROVADO |
| **Elo** | `6362 9797 0000 0000 15` | `123` | Qualquer futura | ✅ APROVADO |
| **Hipercard** | `6062 8200 0000 0000 04` | `123` | Qualquer futura | ✅ APROVADO |

### Cartões de RECUSA

Use para testar cenários de erro:

| Número | Status | Motivo |
|--------|--------|--------|
| `4111 1111 1111 1112` | ❌ RECUSADO | Saldo insuficiente |
| `4111 1111 1111 1113` | ❌ RECUSADO | Cartão expirado |
| `4111 1111 1111 1114` | ❌ RECUSADO | Cartão bloqueado |

## 📝 Dados do Cliente para Testes

```
Nome: JOSE DA SILVA
CPF: 123.456.789-09
Email: teste@sandbox.pagseguro.com.br
Telefone: (11) 99999-9999
```

## 🔧 Configuração Necessária

### 1. Obter Token do PagBank

1. Acesse: https://sandbox.pagseguro.uol.com.br/
2. Crie uma conta sandbox (ou faça login)
3. Vá em **Integrações** → **Token de Segurança**
4. Copie o token gerado

### 2. Configurar o Backend

Edite `server/.env`:

```env
# PagBank Sandbox
PAGBANK_ENV=sandbox
PAGBANK_TOKEN=seu_token_aqui
PAGBANK_EMAIL=seu_email_sandbox@pagseguro.com.br
```

### 3. Reiniciar o Backend

```powershell
.\start-backend.ps1
```

## 🧪 Testando os Fluxos

### 1️⃣ Pagamento com Cartão de Crédito

**Passo a passo:**

1. Acesse: http://localhost:5173/planos
2. Clique em **"Adquirir Pacote"** em qualquer pacote de créditos
3. Preencha os dados:
   - **Email**: teste@sandbox.pagseguro.com.br
   - **CPF**: 123.456.789-09
   - **Telefone**: (11) 99999-9999
   - **Cartão**: 4111 1111 1111 1111
   - **Nome**: JOSE DA SILVA
   - **Validade**: 12/30
   - **CVV**: 123
4. Clique em **"Finalizar Pagamento"**

**Resultado esperado:**
- ✅ Pagamento aprovado instantaneamente
- ✅ Tela de confirmação exibida
- ✅ ID da transação gerado
- ✅ Créditos seriam liberados (quando implementar DB)

### 2️⃣ Pagamento com PIX

**Passo a passo:**

1. Selecione o método **PIX**
2. Preencha apenas dados pessoais (sem cartão)
3. Clique em **"Gerar QR Code PIX"**

**Resultado esperado:**
- ✅ QR Code gerado
- ✅ Código PIX copia e cola disponível
- ✅ Polling inicia automaticamente
- ⏱️ Aguarda confirmação do pagamento

**Simulando pagamento PIX:**
- No sandbox, o pagamento PIX precisa ser confirmado manualmente
- Ou aguarde o timeout de 15 minutos

### 3️⃣ Pagamento com Boleto

**Passo a passo:**

1. Selecione o método **Boleto**
2. Preencha apenas dados pessoais
3. Clique em **"Gerar Boleto"**

**Resultado esperado:**
- ✅ Boleto gerado
- ✅ Link para visualização/impressão
- ✅ Vencimento em 3 dias úteis
- ⏱️ Créditos liberados após compensação

## 🔍 Verificando no PagBank

1. Acesse: https://sandbox.pagseguro.uol.com.br/
2. Faça login na sua conta sandbox
3. Vá em **Transações**
4. Veja os pedidos criados

## 📊 Status dos Pagamentos

### Cartão de Crédito

| Status | Significado |
|--------|-------------|
| `AUTHORIZED` | Pré-autorizado (aguardando captura) |
| `PAID` | Pago e capturado |
| `DECLINED` | Recusado |
| `CANCELED` | Cancelado |

### PIX

| Status | Significado |
|--------|-------------|
| `WAITING` | Aguardando pagamento |
| `PAID` | Pago |
| `EXPIRED` | Expirado |

### Boleto

| Status | Significado |
|--------|-------------|
| `WAITING` | Aguardando pagamento |
| `PAID` | Pago |
| `CANCELED` | Cancelado |

## 🐛 Troubleshooting

### Erro: "Token não autorizado" (403)

**Solução:**
1. Verifique se está usando o token do sandbox
2. Gere um novo token se necessário
3. Certifique-se de ter copiado o token completo

### Erro: "Invalid card number"

**Solução:**
- Use apenas os cartões de teste listados acima
- Certifique-se de digitar sem espaços na requisição
- O frontend formata automaticamente

### Erro: "Failed to fetch"

**Solução:**
1. Verifique se o backend está rodando: http://localhost:5001/health
2. Verifique o `.env` do frontend: `VITE_API_URL=http://localhost:5001/api`
3. Reinicie o backend: `.\start-backend.ps1`

### PIX não é confirmado

**Solução:**
- No sandbox, você precisa confirmar manualmente via painel
- Ou aguarde o timeout de 15 minutos
- Ou implemente um endpoint de simulação

## 📝 Logs Úteis

### Backend (Terminal)

Você verá logs como:

```
📦 Criando pedido com cartão no PagBank...
📤 Enviando para PagBank: { ... }
✅ Pedido criado com sucesso: ORDER_123456789
```

### Frontend (Console F12)

```
Enviando para: http://localhost:5001/api/pagbank/create-order
✅ Pagamento aprovado!
```

## 🔐 Segurança no Sandbox

- ✅ Dados sensíveis criptografados pelo PagBank
- ✅ HTTPS obrigatório em produção (não no sandbox local)
- ✅ Token armazenado apenas no backend
- ✅ CVV nunca é armazenado

## 🚀 Próximos Passos

1. **Implementar Webhook**
   - Receber notificações automáticas do PagBank
   - Atualizar status dos pedidos
   - Liberar créditos automaticamente

2. **Sistema de Créditos**
   - Criar tabela `user_credits` no banco
   - Adicionar créditos após pagamento confirmado
   - Exibir saldo no dashboard

3. **Migrar para Produção**
   - Trocar `PAGBANK_ENV=production`
   - Usar token de produção
   - Configurar webhook com HTTPS público

## 📚 Referências

- [API Orders PagBank](https://dev.pagbank.uol.com.br/reference/orders-api-overview)
- [Criar Pedido](https://dev.pagbank.uol.com.br/reference/criar-pedido)
- [Criar QR Code PIX](https://dev.pagbank.uol.com.br/reference/criar-qr-code-pix)
- [Webhooks](https://dev.pagbank.uol.com.br/reference/webhooks)
- [Cartões de Teste](https://dev.pagbank.uol.com.br/docs/cartoes-de-teste)
