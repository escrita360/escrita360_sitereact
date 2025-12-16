# Guia de Configuração: PagBank Connect

Este documento descreve como configurar e usar o **PagBank Connect** para realizar ações em nome de vendedores/usuários PagBank.

## 📖 O que é PagBank Connect?

PagBank Connect é um sistema OAuth 2.0 que permite que sua aplicação:
- **Realize pagamentos** em nome de vendedores PagBank
- **Gerencie transações** de múltiplos vendedores
- **Integre e-commerce, marketplaces** e sistemas de conciliação
- **Acesse dados** dos vendedores (com permissão)

## 🎯 Fluxo do Connect

```
1. Criar Aplicação → 2. Obter Autorização → 3. Trocar por Token → 4. Usar Token
   (Você)            (Vendedor)              (Você)              (Você)
```

### Detalhamento do Fluxo

1. **Criar Aplicação**: Registra sua plataforma no PagBank
2. **Obter Autorização**: Vendedor autoriza sua app a agir em nome dele
3. **Trocar por Token**: Código de autorização vira `access_token`
4. **Usar Token**: Realiza operações em nome do vendedor

## 🔧 Configuração Passo a Passo

### Passo 1: Configurar Variáveis de Ambiente

#### Backend (`server/.env`)

```bash
# Token principal PagBank (sua conta)
PAGBANK_TOKEN=seu_token_aqui

# Credenciais Connect (serão geradas no Passo 2)
PAGBANK_CLIENT_ID=client_id_da_sua_aplicacao
PAGBANK_CLIENT_SECRET=client_secret_da_sua_aplicacao

# URL de redirecionamento após autorização
PAGBANK_REDIRECT_URI=http://localhost:5000/api/connect/callback

# Ambiente
PAGBANK_ENV=sandbox
```

#### Frontend (`.env`)

```bash
# Credenciais Connect (mesmas do backend)
VITE_PAGBANK_CLIENT_ID=client_id_da_sua_aplicacao
VITE_PAGBANK_REDIRECT_URI=http://localhost:5173/connect/callback

# Ambiente
VITE_PAGBANK_ENV=sandbox
```

### Passo 2: Criar Aplicação no PagBank

Use a API ou faça manualmente no painel:

#### Via API (Recomendado)

```bash
curl --request POST \
  --url https://sandbox.api.pagseguro.com/oauth2/application \
  --header 'Authorization: Bearer SEU_TOKEN' \
  --header 'Content-Type: application/json' \
  --data '{
    "name": "Minha Plataforma",
    "description": "Plataforma de pagamentos",
    "site": "https://meusite.com",
    "redirect_uri": "http://localhost:5000/api/connect/callback",
    "logo": "https://meusite.com/logo.png"
  }'
```

**Resposta**:
```json
{
  "client_id": "APP-1234567890ABCDEF",
  "client_secret": "abc123def456...",
  "account_id": "ACCO-1234567890",
  "name": "Minha Plataforma"
}
```

Salve o `client_id` e `client_secret` nas variáveis de ambiente!

#### Via Backend Route

```bash
# Inicie o servidor
cd server
npm start

# Criar aplicação
curl --request POST \
  --url http://localhost:5000/api/connect/application \
  --header 'Content-Type: application/json' \
  --data '{
    "name": "Escrita360",
    "description": "Plataforma de redação profissional",
    "site": "https://escrita360.com",
    "redirect_uri": "http://localhost:5000/api/connect/callback",
    "logo": "https://escrita360.com/logo.png"
  }'
```

### Passo 3: Implementar Fluxo de Autorização

Existem **2 métodos** para obter autorização:

#### Método 1: Connect Authorization (Recomendado)

Redireciona o vendedor para a página de autorização do PagBank.

##### 3.1. Gerar URL de Autorização

```javascript
// Backend
const connectService = new PagBankConnectService();
const authUrl = connectService.getAuthorizationUrl('payments.read payments.create');

// authUrl: https://sandbox.pagseguro.uol.com.br/v2/oauth2/authorize?...
```

##### 3.2. Redirecionar Vendedor

```javascript
// Frontend
window.location.href = authUrl;
```

##### 3.3. Receber Callback

Após aprovação, vendedor é redirecionado para:
```
http://localhost:5000/api/connect/callback?code=ABC123...
```

O backend já processa isso automaticamente na rota `/api/connect/callback`.

##### 3.4. Obter Access Token

```javascript
// Automático na rota callback, ou manualmente:
const token = await connectService.getAccessToken({
  grant_type: 'authorization_code',
  code: 'ABC123...'
});

// token = {
//   access_token: 'ey...',
//   refresh_token: 'ey...',
//   expires_in: 3600,
//   token_type: 'Bearer'
// }
```

#### Método 2: Connect via SMS

Envia código SMS para o vendedor (sem sair da sua plataforma).

##### 3.1. Solicitar Código SMS

```bash
curl --request POST \
  --url http://localhost:5000/api/connect/authorize-sms \
  --header 'Content-Type: application/json' \
  --data '{
    "email": "vendedor@example.com",
    "phone": "11999999999"
  }'
```

##### 3.2. Vendedor Recebe SMS

```
Código de autorização: 123456
```

##### 3.3. Trocar Código por Token

```bash
curl --request POST \
  --url http://localhost:5000/api/connect/token \
  --header 'Content-Type: application/json' \
  --data '{
    "grant_type": "sms",
    "sms_code": "123456",
    "email": "vendedor@example.com"
  }'
```

### Passo 4: Salvar Access Token

⚠️ **IMPORTANTE**: Salve o `access_token` e `refresh_token` no banco de dados associado ao vendedor!

```javascript
// Exemplo de estrutura no banco
{
  seller_id: '123',
  pagbank_access_token: 'ey...',
  pagbank_refresh_token: 'ey...',
  token_expires_at: '2025-12-16T15:00:00Z'
}
```

### Passo 5: Usar Access Token nas Requisições

Use o `access_token` do vendedor em vez do seu token principal:

```javascript
// Exemplo: Criar pedido em nome do vendedor
const response = await axios.post(
  'https://sandbox.api.pagseguro.com/orders',
  orderData,
  {
    headers: {
      'Authorization': `Bearer ${seller_access_token}`, // Token do vendedor
      'Content-Type': 'application/json'
    }
  }
);
```

### Passo 6: Renovar Token Quando Necessário

Tokens expiram após 1 hora. Use `refresh_token` para renovar:

```bash
curl --request POST \
  --url http://localhost:5000/api/connect/token/refresh \
  --header 'Content-Type: application/json' \
  --data '{
    "refresh_token": "ey..."
  }'
```

**Resposta**:
```json
{
  "access_token": "novo_token...",
  "refresh_token": "novo_refresh_token...",
  "expires_in": 3600
}
```

⚠️ **Importante**: O `refresh_token` antigo é invalidado. Use o novo!

## 🔌 Endpoints Disponíveis

### Backend (`/api/connect/...`)

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/status` | GET | Verifica configuração do Connect |
| `/application` | POST | Cria nova aplicação |
| `/application` | GET | Consulta aplicação existente |
| `/authorize-url` | GET | Gera URL de autorização |
| `/authorize-sms` | POST | Envia código SMS |
| `/token` | POST | Obtém access token |
| `/token/refresh` | POST | Renova access token |
| `/token/revoke` | POST | Revoga access token |
| `/callback` | GET | Callback de autorização |

### Exemplos de Uso

#### Verificar Configuração

```bash
curl http://localhost:5000/api/connect/status
```

#### Consultar Aplicação

```bash
curl http://localhost:5000/api/connect/application
```

#### Gerar URL de Autorização

```bash
curl "http://localhost:5000/api/connect/authorize-url?scope=payments.read+payments.create"
```

## 🔐 Escopos de Permissão

Defina quais ações sua app pode fazer:

| Escopo | Descrição |
|--------|-----------|
| `payments.read` | Consultar pagamentos |
| `payments.create` | Criar pagamentos |
| `payments.refund` | Estornar pagamentos |
| `accounts.read` | Consultar dados da conta |
| `subscriptions.read` | Consultar assinaturas |
| `subscriptions.create` | Criar assinaturas |

**Exemplo**:
```javascript
const scope = 'payments.read payments.create subscriptions.read';
const authUrl = connectService.getAuthorizationUrl(scope);
```

## 🏗️ Arquitetura do Connect

```
┌─────────────────────────────────────────────────────────┐
│                   Sua Aplicação                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Backend (server/)                               │   │
│  │  - pagbank_connect_service.js                   │   │
│  │  - routes/connect.js                            │   │
│  │  - Salva tokens no banco                        │   │
│  └─────────────────────────────────────────────────┘   │
│                         ↕                                │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Frontend (src/)                                 │   │
│  │  - Redireciona para autorização                 │   │
│  │  - Recebe callback                               │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                         ↕
┌─────────────────────────────────────────────────────────┐
│                 PagBank Connect API                      │
│  - Autorização OAuth 2.0                                │
│  - Emissão de tokens                                    │
│  - Validação de permissões                              │
└─────────────────────────────────────────────────────────┘
                         ↕
┌─────────────────────────────────────────────────────────┐
│                  Vendedor/Usuário                        │
│  - Aprova permissões                                    │
│  - Tokens associados à conta dele                       │
└─────────────────────────────────────────────────────────┘
```

## 📝 Exemplo Completo de Integração

```javascript
// ===== 1. Criar aplicação (uma vez) =====
const connectService = new PagBankConnectService();

const app = await connectService.createApplication({
  name: 'Escrita360',
  description: 'Plataforma de redação',
  site: 'https://escrita360.com',
  redirect_uri: 'http://localhost:5000/api/connect/callback'
});
// Salve app.client_id e app.client_secret no .env

// ===== 2. Quando vendedor se cadastrar =====
// Frontend: redireciona para autorização
const authUrl = connectService.getAuthorizationUrl('payments.read payments.create');
window.location.href = authUrl;

// ===== 3. Vendedor aprova e volta para callback =====
// Callback automático processa o código e retorna tokens
// GET /api/connect/callback?code=ABC123

// ===== 4. Salvar tokens no banco =====
await db.sellers.update(sellerId, {
  access_token: token.access_token,
  refresh_token: token.refresh_token,
  token_expires_at: new Date(Date.now() + token.expires_in * 1000)
});

// ===== 5. Usar token nas requisições =====
const seller = await db.sellers.findById(sellerId);

// Verifica se token expirou
if (new Date() >= seller.token_expires_at) {
  // Renova token
  const newToken = await connectService.refreshAccessToken(seller.refresh_token);
  await db.sellers.update(sellerId, {
    access_token: newToken.access_token,
    refresh_token: newToken.refresh_token,
    token_expires_at: new Date(Date.now() + newToken.expires_in * 1000)
  });
}

// Cria pedido em nome do vendedor
const order = await createOrderForSeller(seller.access_token, orderData);
```

## 🚨 Checklist de Implementação

- [ ] Configurar `PAGBANK_TOKEN` no .env
- [ ] Criar aplicação via API
- [ ] Salvar `CLIENT_ID` e `CLIENT_SECRET` no .env
- [ ] Configurar `REDIRECT_URI` corretamente
- [ ] Implementar salvamento de tokens no banco
- [ ] Implementar renovação automática de tokens
- [ ] Testar fluxo completo em sandbox
- [ ] Tratar erros de autorização negada
- [ ] Adicionar logs de auditoria
- [ ] Configurar HTTPS para produção

## 🔒 Segurança

### Boas Práticas

1. **Nunca exponha `client_secret` no frontend**
2. **Salve tokens criptografados no banco**
3. **Use HTTPS em produção**
4. **Renove tokens antes de expirar**
5. **Revogue tokens quando vendedor desautorizar**
6. **Valide escopos antes de usar tokens**
7. **Faça auditoria de acesso**

### Armazenamento Seguro

```javascript
// ❌ ERRADO
localStorage.setItem('access_token', token);

// ✅ CERTO
// Salve no banco do backend, nunca no frontend
await db.tokens.create({
  seller_id: sellerId,
  access_token: encrypt(token.access_token),
  refresh_token: encrypt(token.refresh_token),
  created_at: new Date()
});
```

## 🐛 Troubleshooting

### Erro: "Client not found"

**Causa**: `CLIENT_ID` ou `CLIENT_SECRET` incorretos.

**Solução**: Verifique as credenciais no .env e na aplicação criada.

### Erro: "Invalid redirect_uri"

**Causa**: `redirect_uri` na requisição difere da configurada na aplicação.

**Solução**: Use exatamente a mesma URL configurada ao criar a aplicação.

### Erro: "Code expired"

**Causa**: Código de autorização expirou (5 minutos).

**Solução**: Gere novo código solicitando autorização novamente.

### Erro: "Invalid refresh_token"

**Causa**: `refresh_token` já foi usado ou expirou.

**Solução**: Solicite nova autorização do vendedor.

## 📚 Documentação Oficial

- [PagBank Connect](https://developer.pagbank.com.br/docs/connect)
- [Connect Authorization](https://developer.pagbank.com.br/docs/connect-authorization)
- [Connect via SMS](https://developer.pagbank.com.br/docs/connect-via-sms)
- [API Reference - Criar Aplicação](https://developer.pagbank.com.br/reference/criar-aplicacao)
- [API Reference - Obter Token](https://developer.pagbank.com.br/reference/obter-access-token)

## 🆘 Suporte

- **Documentação**: https://developer.pagbank.com.br/
- **Suporte PagBank**: https://app.pipefy.com/public/form/sBlh9Nq6
- **Status da API**: https://status.pagbank.uol.com.br/

---

✅ **PagBank Connect configurado e pronto para uso!**
