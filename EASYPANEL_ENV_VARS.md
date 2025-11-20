# Variáveis de Ambiente para Easypanel

Configure estas variáveis de ambiente no painel do Easypanel para o serviço **react**:

## Configurações do Servidor
```
NODE_ENV=production
PORT=5001
SECRET_KEY=prod_secret_key_change_this_in_production
```

## PagBank (Ambiente de Produção)
```
PAGBANK_ENV=production
PAGBANK_EMAIL=escrita360@gmail.com
PAGBANK_TOKEN=seu_token_de_producao_aqui
PAGBANK_APP_ID=app_escrita360
```

## PagBank (Ambiente Sandbox - Para testes)
```
PAGBANK_ENV=sandbox
PAGBANK_EMAIL=escrita360@gmail.com
PAGBANK_TOKEN=e7160b77-a214-4b48-8c61-93732bc6241b2256143d4139951eb97603d812916bd6e65e-ed77-49cf-97a6-87b1bf6fe327
PAGBANK_APP_ID=app_escrita360
```

## URLs
```
FRONTEND_URL=https://seu-dominio.com
PAGBANK_WEBHOOK_URL=https://seu-dominio.com/api/webhook/pagbank
```

## Database
```
DATABASE_URL=sqlite:///app.db
```

## JWT
```
JWT_SECRET_KEY=jwt_secret_prod_change_this_in_production
```

---

## Como Configurar no Easypanel

1. Acesse o painel do Easypanel
2. Navegue até o projeto **escrita360**
3. Selecione o serviço **react**
4. Vá para a aba **Environment**
5. Adicione cada variável acima (uma por linha no formato `CHAVE=VALOR`)
6. Salve as alterações
7. Reimplante o serviço

**IMPORTANTE:** 
- Para produção, use `PAGBANK_ENV=production` e o token real do PagBank
- Para testes, use `PAGBANK_ENV=sandbox` e o token sandbox fornecido acima
- Altere `SECRET_KEY` e `JWT_SECRET_KEY` para valores seguros em produção
- Atualize `FRONTEND_URL` e `PAGBANK_WEBHOOK_URL` com seu domínio real
