#!/bin/bash

# Script de Deploy para VPS - Escrita360
# Deploy via Docker Container

# Configurações
CONTAINER_NAME="escrita360-frontend"
CONTAINER_PATH="/usr/share/nginx/html/"
DOMAIN="https://vps59536.publiccloud.com.br/"

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Deploy Escrita360 - Container       ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# 1. Verificar se o container está rodando
echo -e "${BLUE}[1/5] Verificando container...${NC}"
if ! docker ps | grep -q $CONTAINER_NAME; then
    echo -e "${RED}✗ Container $CONTAINER_NAME não está rodando!${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Container está rodando${NC}"

# 2. Build do projeto
echo -e "${BLUE}[2/5] Fazendo build do projeto...${NC}"
pnpm build

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Erro ao fazer build!${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Build concluído com sucesso${NC}"

# 3. Criar backup no container
echo -e "${BLUE}[3/5] Criando backup...${NC}"
BACKUP_NAME="backup-$(date +%Y%m%d-%H%M%S).tar.gz"
docker exec $CONTAINER_NAME tar -czf /tmp/$BACKUP_NAME -C $CONTAINER_PATH . 2>/dev/null || true
echo -e "${GREEN}✓ Backup criado: $BACKUP_NAME${NC}"

# 4. Copiar arquivos para o container
echo -e "${BLUE}[4/5] Copiando arquivos para o container...${NC}"
docker cp dist/. $CONTAINER_NAME:$CONTAINER_PATH

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Erro ao copiar arquivos!${NC}"
    echo -e "${YELLOW}Restaurando backup...${NC}"
    docker exec $CONTAINER_NAME tar -xzf /tmp/$BACKUP_NAME -C $CONTAINER_PATH
    exit 1
fi
echo -e "${GREEN}✓ Arquivos copiados com sucesso${NC}"

# 5. Recarregar nginx
echo -e "${BLUE}[5/5] Recarregando servidor web...${NC}"
docker exec $CONTAINER_NAME nginx -s reload

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Erro ao recarregar nginx!${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Servidor recarregado${NC}"

echo ""
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   ✓ Deploy concluído com sucesso!     ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}🌐 Site atualizado em: ${YELLOW}$DOMAIN${NC}"
echo -e "${BLUE}📦 Container: ${YELLOW}$CONTAINER_NAME${NC}"
echo -e "${BLUE}💾 Backup: ${YELLOW}$BACKUP_NAME${NC}"
echo ""
