#!/bin/bash

echo "🔍 Verificando configuração do backend PagBank..."
echo ""

# Verificar se o arquivo .env existe
if [ ! -f "server/.env" ]; then
    echo "❌ Arquivo server/.env não encontrado!"
    echo "   Execute: cp server/.env.example server/.env"
    exit 1
fi

echo "✅ Arquivo server/.env encontrado"
echo ""

# Verificar variáveis obrigatórias
echo "📋 Verificando variáveis de ambiente:"
echo ""

if grep -q "PAGBANK_TOKEN=" server/.env && ! grep -q "PAGBANK_TOKEN=your_pagbank_token" server/.env; then
    TOKEN=$(grep "PAGBANK_TOKEN=" server/.env | cut -d '=' -f2 | cut -c1-30)
    echo "✅ PAGBANK_TOKEN: Configurado (${TOKEN}...)"
else
    echo "❌ PAGBANK_TOKEN: NÃO CONFIGURADO ou usando valor padrão"
    echo "   Configure no arquivo server/.env"
fi

if grep -q "PAGBANK_EMAIL=" server/.env; then
    EMAIL=$(grep "PAGBANK_EMAIL=" server/.env | cut -d '=' -f2)
    echo "✅ PAGBANK_EMAIL: $EMAIL"
else
    echo "⚠️  PAGBANK_EMAIL: Não configurado"
fi

if grep -q "PAGBANK_ENV=" server/.env; then
    ENV=$(grep "PAGBANK_ENV=" server/.env | cut -d '=' -f2)
    echo "✅ PAGBANK_ENV: $ENV"
else
    echo "⚠️  PAGBANK_ENV: Não configurado (usando padrão: sandbox)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Verificar se o backend está rodando
echo "🔌 Verificando se o backend está rodando..."
if curl -s http://localhost:5000/api/health > /dev/null 2>&1; then
    echo "✅ Backend está rodando em http://localhost:5000"
else
    echo "❌ Backend NÃO está rodando"
    echo "   Inicie o backend com: cd server && npm start"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 Próximos passos:"
echo ""
echo "1. Se o token não estiver configurado:"
echo "   - Edite: server/.env"
echo "   - Configure: PAGBANK_TOKEN=seu_token_aqui"
echo ""
echo "2. Se o backend não estiver rodando:"
echo "   - Execute: cd server"
echo "   - Execute: npm install"
echo "   - Execute: npm start"
echo ""
echo "3. Teste a criação de assinatura:"
echo "   - Acesse: http://localhost:5173"
echo "   - Vá em Preços e selecione um plano"
echo ""
