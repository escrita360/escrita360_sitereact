# Configuração PagBank - Guia Rápido

## 🎯 Ambientes Disponíveis

Este projeto suporta dois ambientes PagBank:

- **Sandbox (Testes)**: Para desenvolvimento e testes
- **Produção**: Para pagamentos reais

## 🔧 Configuração Rápida

### Sandbox (Desenvolvimento)

1. Copie o arquivo de configuração:
   ```bash
   cp .env.sandbox.pagbank .env
   ```

2. Configure suas credenciais de teste:
   ```bash
   VITE_PAGBANK_ENV=sandbox
   VITE_PAGBANK_TOKEN=seu_token_sandbox_aqui
   ```

3. Inicie o projeto:
   ```bash
   pnpm dev
   ```

### Produção

⚠️ **IMPORTANTE**: Leia o guia completo antes de configurar produção!

1. Leia o guia completo: [`docs/PAGBANK_PRODUCAO.md`](docs/PAGBANK_PRODUCAO.md)

2. Copie o arquivo de configuração:
   ```bash
   cp .env.production.pagbank .env
   ```

3. Configure suas credenciais reais:
   ```bash
   VITE_PAGBANK_ENV=production
   VITE_PAGBANK_TOKEN=seu_token_producao_aqui
   ```

4. Configure HTTPS, SSL, webhooks e segurança

5. Faça build e deploy:
   ```bash
   pnpm build
   ```

## 📚 Documentação

- **Guia de Produção Completo**: [`docs/PAGBANK_PRODUCAO.md`](docs/PAGBANK_PRODUCAO.md)
- **Arquitetura PagBank**: [`.github/docs/ARCHITECTURE_PAGBANK.md`](.github/docs/ARCHITECTURE_PAGBANK.md)
- **Implementação PagBank**: [`PAGBANK_IMPLEMENTACAO.md`](PAGBANK_IMPLEMENTACAO.md)

## 🔑 Chave Pública

O serviço de chave pública (`src/services/chavepublica.js`) gerencia automaticamente:

- ✅ Criação de chaves públicas
- ✅ Cache por 23 horas
- ✅ Renovação automática
- ✅ Criptografia de dados do cartão
- ✅ Suporte para sandbox e produção

### Uso Básico

```javascript
import chavePublicaService from '@/services/chavepublica'

// Obter chave pública
const publicKey = await chavePublicaService.getPublicKey()

// Criptografar dados do cartão
const encrypted = await chavePublicaService.encryptCardData({
  number: '4111111111111111',
  security_code: '123',
  exp_month: 12,
  exp_year: 2025,
  holder: { name: 'JOSE DA SILVA' }
})
```

## 🚨 Checklist de Produção

Antes de ativar em produção, certifique-se de:

- [ ] Ler o guia completo de produção
- [ ] Configurar HTTPS/SSL
- [ ] Configurar webhook no painel PagBank
- [ ] Testar em sandbox antes
- [ ] Proteger credenciais (não commitar .env)
- [ ] Configurar monitoramento
- [ ] Configurar backup do banco de dados

## 🆘 Ajuda

- **Documentação PagBank**: https://developer.pagbank.com.br/
- **Guia Completo**: [`docs/PAGBANK_PRODUCAO.md`](docs/PAGBANK_PRODUCAO.md)
