# Deploy no Easypanel

## 🚨 Problema Identificado

O frontend em produção (`https://escrita360-react.nnjeij.easypanel.host`) está tentando acessar `http://localhost:5000`, que só existe localmente. Precisamos configurar o backend em produção.

## ✅ Correções Aplicadas

1. **CORS atualizado** - Adicionado domínio de produção `escrita360-react.nnjeij.easypanel.host`
2. **API URL dinâmica** - Frontend detecta automaticamente se está em produção e usa a URL correta
3. **Porta 5000** - Atualizada em todos os arquivos de configuração

## 📋 Configuração no Easypanel

### Opção 1: Frontend e Backend no mesmo container (Recomendado)

O Dockerfile já está configurado para rodar ambos juntos:

1. **Build da imagem Docker:**
   ```bash
   docker build -t escrita360-fullstack .
   ```

2. **No Easypanel, configure:**
   - **Port Mapping:** `80:80` (frontend Nginx) e `5000:5000` (backend Node.js)
   - **Environment Variables:** (copie de `.env.easypanel`)
     ```
     NODE_ENV=production
     PORT=5000
     SECRET_KEY=prod_secret_key_change_this_in_production
     PAGBANK_ENV=sandbox
     PAGBANK_EMAIL=escrita360@gmail.com
     PAGBANK_TOKEN=e7160b77-a214-4b48-8c61-93732bc6241b2256143d4139951eb97603d812916bd6e65e-ed77-49cf-97a6-87b1bf6fe327
     PAGBANK_APP_ID=app_escrita360
     FRONTEND_URL=https://escrita360-react.nnjeij.easypanel.host
     PAGBANK_WEBHOOK_URL=https://escrita360-react.nnjeij.easypanel.host/api/webhook/pagbank
     DATABASE_URL=sqlite:///app.db
     JWT_SECRET_KEY=jwt_secret_prod_change_this_in_production
     ```

3. **Configuração de Reverse Proxy no Easypanel:**
   - O Nginx interno já faz o proxy de `/api/*` para `localhost:5000`
   - Certifique-se de que o domínio `escrita360-react.nnjeij.easypanel.host` está apontando para o container

### Opção 2: Frontend e Backend separados

Se você quiser separar:

**Backend (container separado):**
1. Criar um service no Easypanel para o backend
2. Expor a porta 5000
3. Configurar variáveis de ambiente
4. Obter URL do backend (ex: `https://escrita360-api.nnjeij.easypanel.host`)

**Frontend:**
1. Adicionar variável `VITE_API_URL=https://escrita360-api.nnjeij.easypanel.host/api`
2. Rebuild o frontend com essa variável

## 🔧 Testando Localmente

```powershell
# Backend
cd server
$env:PORT='5000'
npm start

# Frontend (outro terminal)
cd ..
pnpm dev
```

O frontend em `http://localhost:5173` deve conectar ao backend em `http://localhost:5000/api`.

## 🐋 Build Docker Local

```powershell
docker-compose up --build
```

- Frontend: `http://localhost:8080`
- Backend: `http://localhost:5000`
- API: `http://localhost:8080/api` (proxy via Nginx)

## 📝 Variáveis de Ambiente Necessárias

### Produção (Easypanel)
- `NODE_ENV=production`
- `PORT=5000`
- `PAGBANK_TOKEN` - Token do PagBank
- `PAGBANK_EMAIL` - Email da conta PagBank
- `FRONTEND_URL` - URL do frontend
- `SECRET_KEY` - Chave secreta para JWT
- `JWT_SECRET_KEY` - Chave para tokens JWT

### Desenvolvimento Local
- `VITE_API_URL=http://localhost:5000/api`
- `PAGBANK_ENV=sandbox`

## 🚀 Checklist de Deploy

- [ ] Variáveis de ambiente configuradas no Easypanel
- [ ] Porta 5000 exposta no container
- [ ] Domínio configurado e apontando para o container
- [ ] CORS incluindo o domínio de produção
- [ ] Frontend rebuiltado após mudanças
- [ ] Testar endpoint: `https://escrita360-react.nnjeij.easypanel.host/health`
- [ ] Testar API: `https://escrita360-react.nnjeij.easypanel.host/api/payment/create-pagbank-subscription`

## ⚠️ Troubleshooting

### Erro "ERR_CONNECTION_REFUSED"
- Verifique se o backend está rodando na porta 5000
- Confirme que as variáveis de ambiente estão configuradas
- Teste o health check: `/health`

### Erro de CORS
- Adicione o domínio no array `origin` em `server/app.js`
- Rebuild o container após mudanças

### Frontend não conecta ao backend
- Verifique se `api.js` detecta corretamente o ambiente de produção
- Confirme que o Nginx está fazendo proxy de `/api/*` para `localhost:5000`
- Veja os logs do container: `docker logs <container-id>`

## 📊 Logs Úteis

```bash
# Ver logs do container
docker logs -f <container-id>

# Verificar se a porta está aberta
curl http://localhost:5000/health

# Testar API diretamente
curl -X POST http://localhost:5000/api/payment/create-pagbank-subscription \
  -H "Content-Type: application/json" \
  -d '{"plan_name":"Teste",...}'
```
