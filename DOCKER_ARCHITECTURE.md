# 🐳 Docker Multi-Service Container

Este Dockerfile cria um container que executa **dois serviços simultaneamente**:

## 📦 Serviços Incluídos

### 1. 📱 Frontend (Nginx - Porta 80)
- Serve os arquivos estáticos do React (build do Vite)
- Configurado como SPA com fallback para `index.html`
- Proxy reverso para o backend em `/api/*`

### 2. ⚙️ Backend (Node.js - Porta 5001)
- Servidor Express com API de pagamentos
- Integração com PagBank
- Autenticação e gerenciamento de usuários

## 🎯 Como Funciona

O container usa **Supervisor** para gerenciar ambos os processos:

```
Container
├── Nginx (Port 80) → Frontend estático
│   └── Proxy /api/* → http://localhost:5001
└── Node.js (Port 5001) → Backend API
```

## 🚀 Uso

### Docker Compose (Recomendado)
```bash
docker-compose up -d
```

Acesse:
- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:8080/api
- **Health Check**: http://localhost:8080/health

### Docker Run (Manual)
```bash
docker build -t escrita360 .
docker run -p 8080:80 -p 5001:5001 \
  -e PAGBANK_TOKEN=seu_token \
  -e PAGBANK_ENV=sandbox \
  -e PAGBANK_EMAIL=seu_email \
  escrita360
```

## 📋 Variáveis de Ambiente Obrigatórias

```bash
PAGBANK_TOKEN=seu_token_aqui
PAGBANK_ENV=sandbox           # ou production
PAGBANK_EMAIL=seu_email@example.com
PORT=5001
```

Ver `EASYPANEL_ENV_VARS.md` para lista completa.

## 🔍 Logs

Para ver os logs dos serviços:

```bash
# Todos os logs
docker-compose logs -f

# Apenas backend
docker-compose exec app supervisorctl tail -f backend

# Apenas nginx
docker-compose exec app supervisorctl tail -f nginx
```

## 🛠️ Troubleshooting

### Verificar status dos serviços
```bash
docker-compose exec app supervisorctl status
```

### Reiniciar um serviço específico
```bash
# Reiniciar backend
docker-compose exec app supervisorctl restart backend

# Reiniciar nginx
docker-compose exec app supervisorctl restart nginx
```

## 📁 Estrutura do Container

```
/app/
├── dist/              # Frontend build (servido pelo Nginx)
├── server/            # Backend Node.js
│   ├── app.js
│   └── node_modules/
└── entrypoint.sh      # Script de inicialização
```

## 🎨 Configuração do Nginx

- Root: `/app/dist`
- Proxy API: `/api/*` → `http://localhost:5001`
- SPA Fallback: Todas as rotas não encontradas retornam `index.html`
- Health Check: `/health` → Proxy para backend

## ⚡ Performance

- **Build time**: ~30-40 segundos
- **Image size**: ~250MB (Alpine Linux)
- **Processos**: 2 (Nginx + Node.js) gerenciados pelo Supervisor
- **Memory**: ~150MB em idle

## 🔐 Segurança

- Não inclui arquivos `.env` no build
- Variáveis sensíveis via environment variables
- Nginx configurado para não expor informações do servidor
- Backend não é exposto diretamente (acesso via proxy Nginx)
