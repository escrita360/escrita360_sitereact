# 🧪 PagBank Sandbox - Ambiente de Testes Completo

Sistema completo de testes para integração PagBank, incluindo todos os métodos de pagamento suportados.

## ⚡ Início Rápido

### 1. Configuração

```bash
# Copie o arquivo de configuração
cp .env.example.pagbank .env

# Configure suas credenciais PagBank no arquivo .env
# VITE_PAGBANK_TOKEN=seu_token_aqui
# VITE_PAGBANK_CLIENT_ID=seu_client_id_aqui
```

### 2. Execute os Testes

```bash
# Interface web (recomendado)
pnpm dev
# Acesse: http://localhost:5173/sandbox/pagbank

# Ou via linha de comando
pnpm run test:pagbank
```

## 🎯 Funcionalidades

### ✅ Métodos de Pagamento Testados
- **Cartão de Crédito** (aprovado/negado/sem fundos)
- **PIX** com QR Code
- **Boleto Bancário** com vencimento
- **Gestão de Clientes**

### 🔍 Recursos do Sandbox
- **Interface Web Completa** com logs em tempo real
- **Scripts de Terminal** para automação
- **Validação de Configuração** automática
- **Dados de Teste** pré-configurados
- **Debugging Avançado** com logs detalhados

## 🖥️ Interface Web

Acesse `/sandbox/pagbank` para uma experiência visual completa:

- **Visão Geral**: Cartões interativos para cada tipo de teste
- **Testes Individuais**: Execute testes específicos com um clique
- **Resultados**: Visualize respostas completas das APIs
- **Logs**: Acompanhe cada etapa em tempo real

## ⌨️ Scripts de Terminal

```bash
# Teste completo (todos os métodos)
pnpm run test:pagbank

# Testes específicos
pnpm run test:pagbank:config    # Configuração
pnpm run test:pagbank:card      # Cartão de crédito
pnpm run test:pagbank:pix       # PIX
pnpm run test:pagbank:boleto    # Boleto
```

## 🧪 Dados de Teste

### Cartões de Teste
```javascript
// Cartão aprovado
4111111111111111 (CVV: 123, Exp: 12/2030)

// Cartão negado  
4000000000000002 (CVV: 123, Exp: 12/2030)

// Sem fundos
4000000000000341 (CVV: 123, Exp: 12/2030)
```

### Cliente de Teste
```javascript
{
  name: 'João Silva de Teste',
  email: 'teste@sandbox.pagbank.com', 
  tax_id: '11144477735', // CPF válido
  phone: '+5511999999999'
}
```

## 🔧 Configuração Avançada

### Variáveis de Ambiente Necessárias

```env
# Obrigatórias
VITE_PAGBANK_ENV=sandbox
VITE_PAGBANK_TOKEN=seu_token_sandbox

# Opcionais (para funcionalidades completas)
VITE_PAGBANK_APP_ID=seu_app_id
VITE_PAGBANK_CLIENT_ID=seu_client_id
VITE_PAGBANK_CLIENT_SECRET=seu_client_secret

# URLs (pré-configuradas para desenvolvimento)
VITE_PAGBANK_WEBHOOK_URL=http://localhost:3000/webhooks/pagbank
VITE_PAGBANK_REDIRECT_SUCCESS_URL=http://localhost:5173/pagamento-sucesso
VITE_PAGBANK_REDIRECT_CANCEL_URL=http://localhost:5173/pagamento-cancelado
```

### Obter Credenciais PagBank

1. Acesse [PagBank Desenvolvedores](https://dev.pagbank.uol.com.br/)
2. Crie uma conta de desenvolvedor
3. Gere token de sandbox
4. Configure aplicação OAuth (se necessário)

## 📊 Entendendo os Resultados

### Status de Sucesso ✅
- Configuração válida
- APIs respondendo corretamente
- Dados de teste aceitos
- Criptografia funcionando

### Status de Erro ❌
- Token inválido ou expirado
- Conectividade com APIs
- Dados malformados
- Configuração incompleta

### Logs Detalhados
Todos os testes geram logs com:
- Timestamp de execução
- Dados enviados/recebidos
- Códigos de resposta HTTP
- Mensagens de erro detalhadas

## 🛠️ Desenvolvimento

### Estrutura do Código

```
src/services/
├── chavepublica.js      # Criptografia de dados sensíveis
├── pagbank.js           # Cliente principal PagBank
└── pagbank-sandbox.js   # Sistema de testes

src/pages/
└── PagBankSandbox.jsx   # Interface web completa

scripts/
└── test-pagbank-sandbox.js # Scripts de terminal
```

### Adicionando Novos Testes

1. Edite `pagbank-sandbox.js`
2. Adicione método de teste
3. Atualize interface em `PagBankSandbox.jsx`
4. Documente no README

## 🚨 Troubleshooting

### Problemas Comuns

**Token não configurado**
```bash
❌ Configuração: ERRO - Token PagBank não configurado
```
**Solução**: Configure `VITE_PAGBANK_TOKEN` no arquivo `.env`

**Erro de conectividade**
```bash
❌ Chave pública: ERRO - HTTP Error: 401
```
**Solução**: Verifique token e conectividade com internet

**Dados inválidos**
```bash
❌ Cartão: ERRO - Número do cartão inválido
```
**Solução**: Use cartões de teste fornecidos na documentação

### Debug Rápido

```bash
# Teste apenas configuração
pnpm run test:pagbank:config

# Verifique logs na interface web
# Acesse /sandbox/pagbank → aba "Logs"
```

## 📚 Recursos Adicionais

- **[Documentação PagBank](https://dev.pagbank.uol.com.br/)**: Referência oficial
- **[API Reference](https://dev.pagbank.uol.com.br/reference/)**: Endpoints detalhados  
- **[Guia Completo](./docs/SANDBOX_PAGBANK.md)**: Documentação técnica detalhada

## 🔐 Segurança

⚠️ **IMPORTANTE**: Este sandbox é apenas para desenvolvimento

- Use APENAS tokens de sandbox
- Nunca commithe credenciais reais
- Mantenha arquivos `.env` locais
- Rotacione tokens regularmente

## 🎉 Próximos Passos

1. ✅ Execute `pnpm run test:pagbank` para validar setup
2. 🖥️ Explore interface web em `/sandbox/pagbank`
3. 🔧 Integre métodos na sua aplicação
4. 🚀 Configure webhooks para produção
5. ✨ Solicite homologação no painel PagBank

---

💡 **Dica**: Comece com a interface web para entender o fluxo, depois use scripts para automação!