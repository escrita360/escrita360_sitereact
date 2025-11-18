# Configuração do PagBank para Pagamentos

## 🔧 Configuração Necessária

Para que o sistema de pagamentos funcione corretamente, você precisa configurar as credenciais do PagBank.

### 1. Obter Credenciais do PagBank

#### Ambiente Sandbox (Testes)
1. Acesse [PagBank Developers](https://dev.pagseguro.uol.com.br/)
2. Crie uma conta de desenvolvedor
3. Acesse o painel de desenvolvedor
4. Gere um **Token de API** para o ambiente sandbox

#### Ambiente Produção
1. Acesse sua conta PagBank
2. Vá em **Integrações** > **Token de Segurança**
3. Gere um token de API v4
4. Configure o email da conta PagBank

### 2. Configurar o arquivo .env

Edite o arquivo `server/.env` e adicione suas credenciais:

```bash
# PagBank Configuração
PAGBANK_ENV=sandbox          # ou 'production' para produção
PAGBANK_TOKEN=SEU_TOKEN_AQUI # Token gerado no painel
PAGBANK_EMAIL=seu@email.com  # Email da conta PagBank
PAGBANK_APP_ID=seu_app_id    # ID da aplicação (opcional)
```

### 3. Endpoints da API

#### Sandbox
- Base URL: `https://sandbox.api.pagseguro.com`
- Planos: `POST /plans`
- Assinaturas: `POST /subscriptions`
- Tokens: `POST /tokens`

#### Produção
- Base URL: `https://api.pagseguro.com`
- Mesmos endpoints

### 4. Estrutura dos Dados

#### Criar Plano
```json
{
  "reference_id": "plan_123",
  "name": "Plano Básico",
  "description": "Plano mensal básico",
  "amount": {
    "value": 2990,  // Em centavos (R$ 29,90)
    "currency": "BRL"
  },
  "interval": {
    "unit": "MONTH",
    "length": 1
  },
  "payment_method": ["CREDIT_CARD", "BOLETO"]
}
```

#### Criar Assinatura
```json
{
  "reference_id": "subscription_123",
  "plan": {
    "id": "PLAN_ID"
  },
  "customer": {
    "name": "João da Silva",
    "email": "joao@example.com",
    "tax_id": "12345678909",
    "phones": [{
      "country": "55",
      "area": "11",
      "number": "987654321",
      "type": "MOBILE"
    }]
  },
  "payment_method": {
    "type": "BOLETO"
  }
}
```

### 5. Testando a Integração

Execute o script de teste:

```bash
cd server
node test-subscription-sandbox.js
```

### 6. Solução de Problemas

#### Erro 403 (Forbidden)
- Verifique se o token está correto
- Confirme que o token tem permissões necessárias
- Verifique se está usando o ambiente correto (sandbox/production)

#### Erro 400 (Bad Request)
- Verifique o formato do JSON
- Confirme que todos os campos obrigatórios estão presentes
- Valide os formatos de CPF, telefone, etc.

#### Erro 401 (Unauthorized)
- Token inválido ou expirado
- Gere um novo token no painel do PagBank

### 7. Cartões de Teste (Sandbox)

Para testar pagamentos com cartão no sandbox, use:

```
Número: 4111 1111 1111 1111
CVV: 123
Validade: 12/2030
Nome: TESTE SANDBOX
```

### 8. Links Úteis

- [Documentação Oficial PagBank](https://dev.pagseguro.uol.com.br/reference/overview)
- [API de Assinaturas](https://dev.pagseguro.uol.com.br/reference/post-plans)
- [Painel de Desenvolvedor](https://painel.pagseguro.uol.com.br/)
- [Status da API](https://status.pagseguro.uol.com.br/)

### 9. Segurança

⚠️ **IMPORTANTE:**
- Nunca commite o arquivo `.env` com credenciais reais
- Use variáveis de ambiente em produção
- Mantenha tokens seguros e rotacione periodicamente
- Use HTTPS em produção

### 10. Suporte

Se precisar de ajuda:
- Email: desenvolvedores@pagseguro.com.br
- Fórum: https://comunidade.pagseguro.uol.com.br/
- Telefone: 0800 570 4398
