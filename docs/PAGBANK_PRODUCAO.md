# Guia de Configuração PagBank - Produção

Este documento descreve como configurar o sistema para usar a API PagBank em **ambiente de produção**.

## 📋 Pré-requisitos

1. Conta PagBank com acesso ao painel de produção
2. Certificado SSL/HTTPS configurado no seu domínio
3. Servidor backend em produção acessível publicamente
4. Domínio próprio configurado

## 🔑 Configuração da Chave Pública

### O que é a Chave Pública?

A chave pública do PagBank é usada para:
- **Criptografar dados de cartão de crédito** antes de enviar ao backend
- **Autenticação 3DS** para pagamentos seguros
- **Proteção de dados sensíveis** na camada frontend

### Características

- **Validade**: 24 horas
- **Tipo**: RSA para criptografia de cartão
- **Renovação**: Automática pelo serviço `chavepublica.js`

### APIs de Chave Pública

#### 1. Criar Chave Pública
```http
POST https://api.pagseguro.com/public-keys
Authorization: Bearer {token}
Content-Type: application/json

{
  "type": "card"
}
```

**Resposta (201)**:
```json
{
  "public_key": "-----BEGIN PUBLIC KEY-----\nMIIBIjANBg...",
  "created_at": "2025-12-16T10:00:00-03:00"
}
```

#### 2. Consultar Chave Pública
```http
GET https://api.pagseguro.com/public-keys/card
Authorization: Bearer {token}
```

**Resposta (200)**:
```json
{
  "public_key": "-----BEGIN PUBLIC KEY-----\nMIIBIjANBg..."
}
```

#### 3. Alterar Chave Pública
```http
PUT https://api.pagseguro.com/public-keys/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "type": "card"
}
```

## ⚙️ Configuração Passo a Passo

### 1. Frontend (.env)

Copie o arquivo `.env.production.pagbank` para `.env`:

```bash
cp .env.production.pagbank .env
```

Configure as variáveis:

```bash
# Ambiente de produção
VITE_PAGBANK_ENV=production

# Token de produção (obter no painel PagBank)
VITE_PAGBANK_TOKEN=seu_token_de_producao_aqui

# URLs de produção (substitua pelo seu domínio)
VITE_API_URL=https://api.suaempresa.com.br
VITE_PAGBANK_WEBHOOK_URL=https://api.suaempresa.com.br/webhooks/pagbank
VITE_PAGBANK_REDIRECT_SUCCESS_URL=https://suaempresa.com.br/pagamento/resultado?status=success
VITE_PAGBANK_REDIRECT_CANCEL_URL=https://suaempresa.com.br/pagamento/resultado?status=cancel
```

### 2. Backend (server/.env)

Copie o arquivo `server/.env.production` para `server/.env`:

```bash
cp server/.env.production server/.env
```

Configure as variáveis:

```bash
NODE_ENV=production
PORT=5000

# Ambiente de produção PagBank
PAGBANK_ENV=production
PAGBANK_EMAIL=seu_email@suaempresa.com.br
PAGBANK_TOKEN=seu_token_de_producao_aqui

# URLs de produção
FRONTEND_URL=https://suaempresa.com.br
PAGBANK_WEBHOOK_URL=https://api.suaempresa.com.br/api/webhook/pagbank

# Banco de dados de produção
DATABASE_URL=postgresql://user:password@host:5432/database

# JWT Secret (use uma chave forte)
JWT_SECRET_KEY=sua_chave_jwt_forte_com_minimo_32_caracteres
```

## 🔐 Obtendo Credenciais de Produção

1. Acesse o [Painel PagBank](https://painel.pagseguro.uol.com.br/)
2. Faça login com sua conta de produção
3. Navegue até **Integrações** → **Credenciais**
4. Copie o **Token de Produção**
5. (Opcional) Gere **Client ID** e **Client Secret** para OAuth 2.0

## 🌐 Configuração de Webhooks

1. No painel PagBank, navegue até **Integrações** → **Webhooks**
2. Configure a URL do webhook:
   ```
   https://api.suaempresa.com.br/api/webhook/pagbank
   ```
3. Selecione os eventos que deseja receber:
   - ✅ Pagamentos aprovados
   - ✅ Pagamentos cancelados
   - ✅ Assinaturas criadas
   - ✅ Assinaturas canceladas
   - ✅ Cobranças recorrentes

## 🧪 Como Funciona o Serviço de Chave Pública

O arquivo `src/services/chavepublica.js` implementa:

### 1. Inicialização
```javascript
import chavePublicaService from '@/services/chavepublica'

// Verifica se está configurado
if (!chavePublicaService.isConfigured()) {
  console.error('Serviço não configurado!')
}
```

### 2. Obter Chave Pública (com cache)
```javascript
// Obtém chave (usa cache se válida, senão busca nova)
const publicKey = await chavePublicaService.getPublicKey()
```

### 3. Criptografar Dados do Cartão
```javascript
const cardData = {
  number: '4111111111111111',
  security_code: '123',
  exp_month: 12,
  exp_year: 2025,
  holder: {
    name: 'JOSE DA SILVA'
  }
}

const encryptedData = await chavePublicaService.encryptCardData(cardData)
// encryptedData.number e encryptedData.security_code estão criptografados
```

### 4. Cache Automático
- A chave é armazenada em memória por **23 horas**
- Após expiração, uma nova chave é obtida automaticamente
- Use `clearCache()` para forçar renovação

### 5. Informações de Debug
```javascript
const info = chavePublicaService.getEnvironmentInfo()
console.log(info)
// {
//   environment: 'production',
//   baseUrl: 'https://api.pagseguro.com',
//   tokenConfigured: true,
//   hasCachedKey: true,
//   keyExpiry: '2025-12-17T09:00:00.000Z'
// }
```

## 🚀 Diferenças Sandbox vs Produção

| Aspecto | Sandbox | Produção |
|---------|---------|----------|
| URL Base | `https://sandbox.api.pagseguro.com` | `https://api.pagseguro.com` |
| Token | Token de teste | Token real |
| Pagamentos | Simulados | Reais |
| Cartões | [Cartões de teste](https://developer.pagbank.com.br/reference/testar-sua-integracao) | Cartões reais |
| Webhook | Pode ser localhost (via ngrok) | Deve ser HTTPS público |
| SSL | Opcional | Obrigatório |
| Certificado mTLS | Opcional | Obrigatório para transferências |

## 🔐 Certificado Digital (mTLS)

### Quando é Necessário?

- **Obrigatório**: API de Transferências
- **Opcional**: Outras APIs (segurança adicional)
- **Validade**: 2 anos
- **Tipo**: mTLS (autenticação mútua)

### Como Criar?

#### 1. Obter Token com Scope `certificate.create`

```bash
# Use Connect Challenge (OAuth 2.0)
# Ver documentação completa: docs/PAGBANK_CONNECT.md
```

#### 2. Solicitar e Criar Certificado

```bash
# Solicitar challenge
curl -X POST http://localhost:5000/api/certificate/challenge \
  -H "Content-Type: application/json" \
  -d '{"access_token": "token_com_scope_certificate_create"}'

# Decriptar challenge com chave privada RSA
# Criar certificado
curl -X POST http://localhost:5000/api/certificate/create \
  -H "Content-Type: application/json" \
  -d '{"access_token": "TOKEN", "decrypted_challenge": "CHALLENGE"}'
```

#### 3. Salvar em Local Seguro

```bash
# IMPORTANTE: Salvar FORA do diretório do projeto
# Exemplo: /var/secure/certificates/

# Permissões corretas (Unix/Linux)
chmod 600 /var/secure/certificates/pagbank_production.key
chmod 644 /var/secure/certificates/pagbank_production.pem
chmod 700 /var/secure/certificates/
```

#### 4. Configurar no Backend

```bash
# server/.env.production
PAGBANK_CERT_KEY_PATH=/var/secure/certificates/pagbank_production.key
PAGBANK_CERT_PEM_PATH=/var/secure/certificates/pagbank_production.pem
```

### Renovação

- **Quando**: 30 dias antes de expirar
- **Como**: Repetir processo de criação
- **Monitoramento**: Use `node test-certificate.js` para verificar validade

### Documentação Completa

📖 Guia detalhado: [PAGBANK_CERTIFICATE.md](./PAGBANK_CERTIFICATE.md)

---

## ✅ Checklist de Produção

Antes de ativar em produção, verifique:

- [ ] Token de produção configurado corretamente
- [ ] Chave pública configurada (criada automaticamente no primeiro uso)
- [ ] Connect OAuth configurado (se usar multi-vendas)
- [ ] Certificado digital criado (se usar transferências)
- [ ] Certificado salvo em local seguro com permissões corretas
- [ ] Todas as URLs são HTTPS (não HTTP)
- [ ] Certificado SSL válido no domínio
- [ ] Webhook configurado no painel PagBank
- [ ] Webhook respondendo corretamente (200 OK)
- [ ] Banco de dados de produção configurado
- [ ] Backup automático do banco configurado
- [ ] Variáveis de ambiente protegidas (não no Git)
- [ ] Logs de erro configurados
- [ ] Monitoramento ativo
- [ ] Testado em sandbox antes
- [ ] CORS configurado corretamente
- [ ] Rate limiting configurado
- [ ] Firewall e segurança de rede ativos

## 🔒 Segurança

### Boas Práticas

1. **Nunca commite credenciais**
   - Adicione `.env` ao `.gitignore`
   - Use variáveis de ambiente do servidor

2. **Use HTTPS em tudo**
   - Frontend: HTTPS
   - Backend: HTTPS
   - Webhook: HTTPS

3. **Proteja o token**
   - Proteja certificados digitais**
   - Armazene fora do diretório do projeto
   - Use permissões restritas (600 para .key, 644 para .pem)
   - Não commite no Git
   - Configure backup criptografado
   - Monitore validade e renove antes de expirar

5. **Não exponha no frontend
   - Use apenas no backend
6  - Renove periodicamente

4. **Valide webhooks**
   - Verifique origem das requisições
   - Valide assinatura se disponível
   - Log todas as tentativas

5. **Criptografe dados sensíveis**
   - Use a chave pública para cartões
   - Nunca envie CVV sem criptografar
   - Não armazene dados completos do cartão

## 📊 Monitoramento

### Logs Importantes

```javascript
// Log de sucesso
console.log('✅ Chave pública obtida com sucesso')

// Log de erro
console.error('❌ Erro ao obter chave pública:', error)

// Log de cache
console.log('🔑 Usando chave pública do cache')
```

### Métricas para Monitorar

- Taxa de sucesso de pagamentos
- Tempo de resposta da API PagBank
- Erros de chave pública
- Renovações de chave
- Validade de certificados (alertar 30 dias antes)
- Webhooks recebidos vs processados

## 🐛 Troubleshooting

### Erro: "Chave pública não encontrada"

**Solução**: O serviço cria automaticamente. Verifique o token.

### Erro: "401 Unauthorized"

**Solução**: Token inválido ou expirado. Obtenha novo token no painel.

### Erro: "SSL Certificate Error"

**Solução**: Configure certificado SSL válido no seu domínio.

### Webhook não recebe notificações

**Soluções**:
1. Verifique se a URL está acessível publicamente
2. Certifique-se de que é HTTPS
3. Verifique logs do servidor
4. Teste a URL manualmente com curl
# Erro: "Certificate verification failed"

### PagBank Developer

- [API Reference - Chave Pública](https://developer.pagbank.com.br/reference/criar-chave-publica)
- [Guia de Chaves Públicas](https://developer.pagbank.com.br/docs/chaves-publicas)
- [Certificado Digital](https://developer.pagbank.com.br/docs/certificado-digital)
- [Connect OAuth 2.0](https://developer.pagbank.com.br/docs/connect-visao-geral)
- [Criptografia e Segurança](https://developer.pagbank.com.br/docs/criptografia)

### Documentação do Projeto

- **Chave Pública**: [PAGBANK_CONFIG.md](./PAGBANK_CONFIG.md)
- **Connect OAuth**: [PAGBANK_CONNECT.md](./PAGBANK_CONNECT.md)
- **Certificado Digital**: [PAGBANK_CERTIFICATE.md](./PAGBANK_CERTIFICATE.md)
- **Implementação Geral**: [PAGBANK_IMPLEMENTACAO.md](../PAGBANK_IMPLEMENTACAO.md
1. Verifique validade: `node test-certificate.js`
2. Verifique par key/pem com openssl
3. Renove se expirado
4. Consulte: [PAGBANK_CERTIFICATE.md](./PAGBANK_CERTIFICATE.md)

##
## 📚 Documentação Oficial

- [API Reference - Chave Pública](https://developer.pagbank.com.br/reference/criar-chave-publica)
- [Guia de Chaves Públicas](https://developer.pagbank.com.br/docs/chaves-publicas)
- [Criptografia e Segurança](https://developer.pagbank.com.br/docs/criptografia)

## 🆘 Suporte

- **Documentação**: https://developer.pagbank.com.br/
- **Suporte PagBank**: https://app.pipefy.com/public/form/sBlh9Nq6
- **Status da API**: https://status.pagbank.uol.com.br/
