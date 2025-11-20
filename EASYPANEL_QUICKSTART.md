# 🚀 Guia Rápido: Resolver Erro PAGBANK_TOKEN no Easypanel

## ❌ Problema
```
Error: PAGBANK_TOKEN não configurado! Configure o token no arquivo server/.env
```

## ✅ Solução

### Passo 1: Acessar Easypanel
1. Faça login no Easypanel
2. Navegue até o projeto **escrita360**
3. Selecione o serviço **react**

### Passo 2: Configurar Variáveis de Ambiente
Na aba **Environment** do Easypanel, adicione estas variáveis:

#### Obrigatórias para o Backend Funcionar:
```
PAGBANK_TOKEN=e7160b77-a214-4b48-8c61-93732bc6241b2256143d4139951eb97603d812916bd6e65e-ed77-49cf-97a6-87b1bf6fe327
PAGBANK_ENV=sandbox
PAGBANK_EMAIL=escrita360@gmail.com
PORT=5001
```

#### Recomendadas:
```
NODE_ENV=production
SECRET_KEY=seu_secret_key_seguro_aqui
JWT_SECRET_KEY=seu_jwt_secret_seguro_aqui
PAGBANK_APP_ID=app_escrita360
FRONTEND_URL=https://seu-dominio.com
PAGBANK_WEBHOOK_URL=https://seu-dominio.com/api/webhook/pagbank
DATABASE_URL=sqlite:///app.db
```

### Passo 3: Reimplantar
1. Salve as configurações de ambiente
2. Clique em **Deploy** ou **Rebuild** no Easypanel
3. Aguarde a nova implantação completar

### Passo 4: Verificar
Após a reimplantação, verifique os logs. Você deve ver:
```
✅ Environment variables validated
   PAGBANK_ENV: sandbox
   PORT: 5001
🔧 PagBank Subscriptions Service inicializado
   Ambiente: sandbox
   Email: escrita360@gmail.com
```

## 📝 Notas Importantes

- **Sandbox vs Produção**: Use `PAGBANK_ENV=sandbox` para testes com o token fornecido acima
- **Token de Produção**: Quando estiver pronto para produção, obtenha um token real do PagBank e mude `PAGBANK_ENV=production`
- **Segurança**: Nunca commite tokens reais no repositório Git
- **Webhook URL**: Atualize com seu domínio real para receber notificações do PagBank

## 🔍 Troubleshooting

Se o erro persistir:

1. **Verifique se as variáveis foram salvas corretamente** no Easypanel
2. **Confira os logs** do container para ver quais variáveis estão sendo carregadas
3. **Reimplante completamente** o serviço (não apenas restart)
4. **Verifique a sintaxe**: Não use espaços ao redor do `=` nas variáveis de ambiente

## 📚 Arquivos de Referência

- `EASYPANEL_ENV_VARS.md` - Documentação completa das variáveis
- `.env.easypanel` - Template para copiar e colar
- `server/.env` - Configuração local (NÃO é usado no Docker)
