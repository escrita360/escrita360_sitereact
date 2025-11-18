# Sandbox PagBank - Guia de Configuração

Este documento explica como configurar e usar o sandbox completo do PagBank criado para testar pagamentos.

## 🚀 Configuração Rápida

### 1. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example.pagbank` para `.env` e configure suas credenciais:

```bash
# Ambiente de teste (sandbox)
VITE_PAGBANK_ENV=sandbox

# Token de acesso do PagBank (obtenha no painel do desenvolvedor)
VITE_PAGBANK_TOKEN=seu_token_aqui

# ID da aplicação PagBank
VITE_PAGBANK_APP_ID=seu_app_id_aqui

# Client ID e Secret para OAuth
VITE_PAGBANK_CLIENT_ID=seu_client_id_aqui
VITE_PAGBANK_CLIENT_SECRET=seu_client_secret_aqui

# URLs de callback (já configuradas para desenvolvimento local)
VITE_PAGBANK_WEBHOOK_URL=http://localhost:3000/webhooks/pagbank
VITE_PAGBANK_REDIRECT_SUCCESS_URL=http://localhost:5173/pagamento-sucesso
VITE_PAGBANK_REDIRECT_CANCEL_URL=http://localhost:5173/pagamento-cancelado
```

### 2. Instalar Dependências

```bash
pnpm install
```

### 3. Iniciar o Desenvolvimento

```bash
pnpm dev
```

## 🧪 Usando o Sandbox

### Interface Web

Acesse `http://localhost:5173/sandbox/pagbank` para usar a interface completa do sandbox.

A interface oferece:
- Testes individuais para cada tipo de pagamento
- Teste completo que executa todos os cenários
- Visualização de logs em tempo real
- Resultados detalhados de cada teste

### Scripts de Linha de Comando

Execute testes via terminal:

```bash
# Teste completo
node scripts/test-pagbank-sandbox.js

# Teste específico de configuração
node scripts/test-pagbank-sandbox.js test config

# Teste específico de cliente
node scripts/test-pagbank-sandbox.js test customer

# Teste específico de cartão
node scripts/test-pagbank-sandbox.js test card

# Teste específico de PIX
node scripts/test-pagbank-sandbox.js test pix

# Teste específico de boleto
node scripts/test-pagbank-sandbox.js test boleto
```

## 🎯 Cenários de Teste

### Cartões de Teste

O sandbox inclui cartões pré-configurados para diferentes cenários:

- **Aprovado**: `4111111111111111` (CVV: 123)
- **Negado**: `4000000000000002` (CVV: 123)
- **Sem fundos**: `4000000000000341` (CVV: 123)

### Dados de Cliente de Teste

```javascript
{
  name: 'João Silva de Teste',
  email: 'teste@sandbox.pagbank.com',
  tax_id: '11144477735', // CPF válido para testes
  phone: '+5511999999999'
}
```

## 📊 Tipos de Pagamento Testados

### 1. Cartão de Crédito
- Criptografia de dados sensíveis
- Diferentes cenários (aprovado/negado)
- Validação de dados do cartão

### 2. PIX
- Geração de QR Code
- Configuração de expiração
- Link de pagamento

### 3. Boleto Bancário
- Geração de boleto com vencimento
- Instruções de pagamento
- Link para visualização

### 4. Cliente
- Criação de cliente no PagBank
- Validação de CPF/CNPJ
- Dados de endereço completos

## 🔍 Debugging e Logs

### Logs Detalhados

O sistema de logs captura:
- Requisições para APIs PagBank
- Respostas e códigos de status
- Erros detalhados
- Timestamps para rastreamento

### Verificação de Configuração

O teste de configuração verifica:
- Presença de tokens necessários
- Conectividade com APIs
- Obtenção de chave pública
- Validade das credenciais

## 🛠️ Arquitetura do Sandbox

### Arquivos Principais

```
src/
├── services/
│   ├── pagbank.js           # Serviço principal PagBank
│   ├── chavepublica.js      # Gerenciamento de chaves públicas
│   └── pagbank-sandbox.js   # Sistema de testes sandbox
├── pages/
│   └── PagBankSandbox.jsx   # Interface web do sandbox
└── scripts/
    └── test-pagbank-sandbox.js # Scripts de linha de comando
```

### Fluxo de Testes

1. **Configuração**: Valida environment e credenciais
2. **Cliente**: Cria cliente de teste
3. **Pagamentos**: Testa cada método de pagamento
4. **Logs**: Captura e exibe resultados detalhados

## 🚨 Troubleshooting

### Erros Comuns

**Token inválido**
```
Erro: HTTP Error: 401
Solução: Verificar VITE_PAGBANK_TOKEN no arquivo .env
```

**Chave pública não encontrada**
```
Erro: Erro ao obter chave pública
Solução: Verificar conectividade e validade do token
```

**Dados do cartão inválidos**
```
Erro: Número do cartão inválido
Solução: Usar cartões de teste fornecidos na documentação
```

### Verificações Rápidas

1. Conferir todas as variáveis de ambiente no `.env`
2. Verificar se o ambiente está configurado como `sandbox`
3. Testar conectividade com `node scripts/test-pagbank-sandbox.js test config`
4. Verificar logs detalhados na interface web

## 📚 Documentação Adicional

- [Documentação Oficial PagBank](https://dev.pagbank.uol.com.br/)
- [API Reference](https://dev.pagbank.uol.com.br/reference/)
- [Códigos de Teste](https://dev.pagbank.uol.com.br/docs/testar-integração)

## 🔐 Segurança

- Nunca commithe tokens reais no repositório
- Use apenas ambiente sandbox para testes
- Rotacione tokens regularmente
- Mantenha credenciais em arquivos `.env` locais

## 💡 Próximos Passos

1. Execute o teste completo para validar sua configuração
2. Integre os métodos desejados em sua aplicação
3. Configure webhooks para produção
4. Solicite homologação no painel PagBank