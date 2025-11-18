# ⚠️ COMO OBTER O TOKEN DO PAGBANK SANDBOX

## Problema Atual

O arquivo `.env` contém apenas um token de teste (`test_token_pagbank`) que **NÃO FUNCIONA** com a API real do PagBank.

```dotenv
# ❌ Isso não funciona na API real
PAGBANK_TOKEN=test_token_pagbank
```

## Solução: Obter Token Real

### Passo 1: Acesse sua Conta PagBank

1. Vá para https://pagseguro.uol.com.br/
2. Faça login com suas credenciais
3. Acesse o menu **Integrações**

### Passo 2: Gerar Token

#### Para Ambiente Sandbox (Testes):
1. Acesse https://sandbox.pagseguro.uol.com.br/
2. Faça login com sua conta de desenvolvedor
3. Vá em **Preferências** → **Integrações**
4. Clique em **Gerar Token de Segurança**
5. Selecione **Ambiente Sandbox**
6. Copie o token gerado

#### Para Ambiente de Produção:
1. Acesse https://pagseguro.uol.com.br/
2. Faça login
3. Vá em **Preferências** → **Integrações**
4. Clique em **Gerar Token de Segurança**
5. Selecione **Ambiente Produção**
6. Copie o token gerado

### Passo 3: Atualizar o .env

Edite o arquivo `escrita360_backend/.env`:

```dotenv
# PagBank (Sandbox)
PAGBANK_ENV=sandbox
PAGBANK_TOKEN=SEU_TOKEN_REAL_AQUI  # Cole o token que você copiou
```

## Opção Alternativa: Modo Simulação

Se você ainda não tem um token real e quer testar a interface, pode usar o modo de simulação.

### Ativar Modo Simulação

Adicione esta variável no `.env`:

```dotenv
PAGBANK_ENV=sandbox
PAGBANK_TOKEN=test_token_pagbank
PAGBANK_MOCK_MODE=true  # Ativa o modo simulação
```

Com `PAGBANK_MOCK_MODE=true`, o backend irá:
- ✅ Simular a criação de planos
- ✅ Simular a criação de assinaturas
- ✅ Retornar dados falsos mas realistas
- ✅ Permitir testar a UI sem API real

### Reiniciar o Backend

Após alterar o `.env`:

```powershell
# Pare o backend (Ctrl+C no terminal)
# Reinicie
npm run dev
```

## Estrutura do Token

Um token real do PagBank se parece com isso:

```
EXEMPLO: A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0
```

- Contém letras e números
- Tem aproximadamente 40 caracteres
- É único para cada conta

## Testando o Token

Após configurar o token, teste:

```powershell
cd d:\github\escrita360_sitereact
.\test-backend-simple.ps1
```

Se o token estiver correto, você verá:
```
✅ Assinatura criada: OK
```

Se o token estiver errado:
```
❌ Criação de assinatura falhou: Unauthorized
```

## Links Úteis

- [Documentação PagBank - Assinaturas](https://dev.pagbank.uol.com.br/reference/criar-assinatura)
- [Portal do Desenvolvedor PagBank](https://dev.pagbank.uol.com.br/)
- [Sandbox PagBank](https://sandbox.pagseguro.uol.com.br/)

## Resolução de Problemas

### "Unauthorized" ou "Invalid token"
- Token inválido ou expirado
- Solução: Gere um novo token no painel

### "Token não encontrado"
- Variável de ambiente não carregada
- Solução: Reinicie o backend após editar o `.env`

### "Bad Request" ou "400"
- Dados enviados estão incorretos
- Solução: Veja os logs do backend para detalhes

---

**Atualizado:** 18/11/2025
