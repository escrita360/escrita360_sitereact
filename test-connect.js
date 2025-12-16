/**
 * Script de Teste do PagBank Connect
 * 
 * Este script testa o fluxo completo do Connect:
 * 1. Criar aplicação
 * 2. Obter URL de autorização
 * 3. Simular callback
 * 
 * Execute: node test-connect.js
 */

require('dotenv').config();
const axios = require('axios');

const API_URL = process.env.VITE_API_URL || 'http://localhost:5000/api';
const PAGBANK_TOKEN = process.env.PAGBANK_TOKEN;

console.log('🧪 Testando PagBank Connect\n');

async function testConnectStatus() {
    console.log('📊 1. Verificando status do Connect...');
    try {
        const response = await axios.get(`${API_URL}/connect/status`);
        console.log('✅ Status:', response.data);
        return response.data.configured;
    } catch (error) {
        console.error('❌ Erro:', error.response?.data || error.message);
        return false;
    }
}

async function testCreateApplication() {
    console.log('\n📝 2. Criando aplicação...');
    try {
        const response = await axios.post(`${API_URL}/connect/application`, {
            name: 'Escrita360 Test',
            description: 'Plataforma de redação profissional - Teste',
            site: 'https://escrita360.com',
            redirect_uri: `${API_URL.replace('/api', '')}/api/connect/callback`,
            logo: 'https://via.placeholder.com/440x160/4F46E5/ffffff?text=Escrita360'
        });
        
        console.log('✅ Aplicação criada:');
        console.log('   Client ID:', response.data.application.client_id);
        console.log('   Account ID:', response.data.application.account_id);
        console.log('\n⚠️  IMPORTANTE: Salve estas credenciais no .env:');
        console.log(`   PAGBANK_CLIENT_ID=${response.data.application.client_id}`);
        console.log(`   PAGBANK_CLIENT_SECRET=${response.data.application.client_secret}`);
        
        return response.data.application;
    } catch (error) {
        if (error.response?.status === 409 || error.response?.data?.error?.includes('already exists')) {
            console.log('ℹ️  Aplicação já existe, consultando...');
            return await testGetApplication();
        }
        console.error('❌ Erro:', error.response?.data || error.message);
        return null;
    }
}

async function testGetApplication() {
    console.log('\n🔍 3. Consultando aplicação existente...');
    try {
        const response = await axios.get(`${API_URL}/connect/application`);
        console.log('✅ Aplicação encontrada:');
        console.log('   Nome:', response.data.name);
        console.log('   Client ID:', response.data.client_id);
        console.log('   Account ID:', response.data.account_id);
        return response.data;
    } catch (error) {
        console.error('❌ Erro:', error.response?.data || error.message);
        return null;
    }
}

async function testGetAuthorizationUrl() {
    console.log('\n🔗 4. Gerando URL de autorização...');
    try {
        const response = await axios.get(`${API_URL}/connect/authorize-url`, {
            params: {
                scope: 'payments.read payments.create'
            }
        });
        
        console.log('✅ URL de autorização gerada:');
        console.log('   URL:', response.data.authorization_url);
        console.log('\n📌 Próximos passos:');
        console.log('   1. Abra a URL acima no navegador');
        console.log('   2. Faça login no PagBank');
        console.log('   3. Autorize a aplicação');
        console.log('   4. Você será redirecionado para o callback');
        
        return response.data.authorization_url;
    } catch (error) {
        console.error('❌ Erro:', error.response?.data || error.message);
        return null;
    }
}

async function testAuthorizeSMS() {
    console.log('\n📱 5. Testando autorização via SMS...');
    console.log('ℹ️  Este teste requer email e telefone reais cadastrados no PagBank');
    console.log('ℹ️  Pulando teste de SMS (configure email/telefone reais para testar)\n');
    
    // Descomente e configure para testar:
    /*
    try {
        const response = await axios.post(`${API_URL}/connect/authorize-sms`, {
            email: 'seu_email@example.com',
            phone: '11999999999'
        });
        console.log('✅ SMS enviado:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Erro:', error.response?.data || error.message);
        return null;
    }
    */
}

async function runAllTests() {
    console.log('═'.repeat(60));
    console.log('🚀 TESTE DO PAGBANK CONNECT');
    console.log('═'.repeat(60));
    
    if (!PAGBANK_TOKEN) {
        console.error('\n❌ ERRO: PAGBANK_TOKEN não configurado no .env');
        console.log('   Configure o token antes de executar os testes\n');
        return;
    }
    
    // 1. Verificar status
    const configured = await testConnectStatus();
    
    // 2. Criar ou consultar aplicação
    let application;
    if (!configured) {
        application = await testCreateApplication();
    } else {
        application = await testGetApplication();
    }
    
    if (!application) {
        console.error('\n❌ Falha ao obter dados da aplicação');
        return;
    }
    
    // 3. Gerar URL de autorização
    await testGetAuthorizationUrl();
    
    // 4. Testar SMS (opcional)
    await testAuthorizeSMS();
    
    console.log('\n' + '═'.repeat(60));
    console.log('✅ TESTES CONCLUÍDOS');
    console.log('═'.repeat(60));
    console.log('\n📚 Próximos passos:');
    console.log('   1. Configure CLIENT_ID e CLIENT_SECRET no .env');
    console.log('   2. Abra a URL de autorização e autorize');
    console.log('   3. Verifique o callback em /api/connect/callback');
    console.log('   4. Leia a documentação em docs/PAGBANK_CONNECT.md\n');
}

// Executar testes
runAllTests().catch(console.error);
