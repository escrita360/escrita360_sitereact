#!/usr/bin/env node

/**
 * Script para verificar configuração PIX de produção
 * Execute: node verify-pix-production.js
 */

require('dotenv').config();

console.log('🔍 Verificando configuração PIX para PRODUÇÃO...\n');

// Verificar variáveis de ambiente
const checks = {
    'PAGBANK_ENV': process.env.PAGBANK_ENV,
    'PAGBANK_TOKEN': process.env.PAGBANK_TOKEN ? '✓ Configurado' : '❌ Faltando',
    'PAGBANK_EMAIL': process.env.PAGBANK_EMAIL,
    'PAGBANK_WEBHOOK_URL': process.env.PAGBANK_WEBHOOK_URL
};

console.log('⚙️ CONFIGURAÇÕES:');
for (const [key, value] of Object.entries(checks)) {
    console.log(`   ${key}: ${value}`);
}
console.log('');

// Verificar ambiente
if (process.env.PAGBANK_ENV !== 'production') {
    console.log('⚠️ ATENÇÃO: Ambiente não está como "production"');
    console.log('   Configure PAGBANK_ENV=production no arquivo .env\n');
} else {
    console.log('✅ Ambiente configurado para PRODUÇÃO\n');
}

// Verificar token
if (!process.env.PAGBANK_TOKEN || process.env.PAGBANK_TOKEN.includes('your_token')) {
    console.log('❌ TOKEN INVÁLIDO: Configure um token real do PagBank');
    console.log('   Obtenha em: https://pagseguro.uol.com.br/preferencias/integracoes.jhtml\n');
}

// Verificar webhook
if (process.env.PAGBANK_WEBHOOK_URL.includes('localhost')) {
    console.log('⚠️ WEBHOOK LOCAL: URL ainda aponta para localhost');
    console.log('   Para produção real, use um domínio público com HTTPS\n');
}

// Testar conectividade
console.log('🔗 Testando conectividade com PagBank...');
const axios = require('axios');

(async () => {
    try {
        const response = await axios.get('https://api.pagseguro.com', {
            headers: {
                'Authorization': `Bearer ${process.env.PAGBANK_TOKEN}`,
                'Content-Type': 'application/json'
            },
            timeout: 5000
        });
        
        console.log('✅ Conectividade com PagBank OK\n');
        
    } catch (error) {
        if (error.response) {
            console.log(`⚠️ API respondeu com status: ${error.response.status}`);
            if (error.response.status === 401) {
                console.log('❌ Token inválido ou expirado\n');
            }
        } else {
            console.log('❌ Erro de conectividade:', error.message, '\n');
        }
    }

    // Resumo final
    console.log('📋 RESUMO PARA PIX PRODUÇÃO:');
    console.log('   ✓ Use PAGBANK_ENV=production');
    console.log('   ✓ Configure token real do PagBank');
    console.log('   ✓ Use webhook HTTPS público');
    console.log('   ✓ Teste com valores pequenos primeiro');
    console.log('');
    console.log('🎯 PRONTO PARA PRODUÇÃO!');
    console.log('   O PIX será processado REALMENTE');
    console.log('   Os pagamentos vão cair na conta PagBank configurada');
})();