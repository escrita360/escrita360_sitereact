/**
 * Script de Teste - API de Clientes PagBank
 * 
 * Testa o fluxo completo de gerenciamento de clientes:
 * 1. Verificar configuração
 * 2. Validar dados do cliente
 * 3. Criar cliente
 * 4. Consultar cliente criado
 * 5. (Opcional) Atualizar cliente
 * 
 * Execute: node test-customers.js
 */

require('dotenv').config();
const axios = require('axios');

const API_URL = process.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('🧪 Testando API de Clientes PagBank\n');

// Dados de teste
const testCustomerData = {
    name: 'João Silva Teste',
    email: `teste.${Date.now()}@escrita360.com.br`,
    tax_id: '12345678901', // CPF de teste (produção: use CPF válido)
    phones: [
        {
            country: '55',
            area: '11',
            number: '987654321',
            type: 'MOBILE'
        }
    ],
    billing_info: {
        address: {
            street: 'Avenida Paulista',
            number: '1000',
            complement: 'Sala 100',
            locality: 'Bela Vista',
            city: 'São Paulo',
            region_code: 'SP',
            postal_code: '01310-100'
        }
    }
};

async function testServiceInfo() {
    console.log('📊 1. Verificando informações do serviço...');
    try {
        const response = await axios.get(`${API_URL}/customers/info`);
        console.log('✅ Informações:', response.data);
        return true;
    } catch (error) {
        console.error('❌ Erro:', error.response?.data || error.message);
        return false;
    }
}

async function testValidateCustomer() {
    console.log('\n✔️ 2. Validando dados do cliente...');
    try {
        const response = await axios.post(`${API_URL}/customers/validate`, testCustomerData);
        console.log('✅ Validação:', response.data);
        return true;
    } catch (error) {
        console.error('❌ Erro na validação:', error.response?.data || error.message);
        return false;
    }
}

async function testCreateCustomer() {
    console.log('\n🆕 3. Criando cliente...');
    try {
        const response = await axios.post(`${API_URL}/customers`, testCustomerData);
        console.log('✅ Cliente criado:');
        console.log('   - ID:', response.data.customer.id);
        console.log('   - Nome:', response.data.customer.name);
        console.log('   - Email:', response.data.customer.email);
        console.log('   - CPF:', response.data.customer.tax_id);
        return response.data.customer;
    } catch (error) {
        console.error('❌ Erro ao criar cliente:', error.response?.data || error.message);
        return null;
    }
}

async function testGetCustomer(customerId) {
    console.log(`\n🔍 4. Consultando cliente ${customerId}...`);
    try {
        const response = await axios.get(`${API_URL}/customers/${customerId}`);
        console.log('✅ Cliente encontrado:');
        console.log('   - ID:', response.data.customer.id);
        console.log('   - Nome:', response.data.customer.name);
        console.log('   - Email:', response.data.customer.email);
        console.log('   - CPF:', response.data.customer.tax_id);
        
        if (response.data.customer.phones) {
            console.log('   - Telefones:', response.data.customer.phones.length);
        }
        
        return true;
    } catch (error) {
        console.error('❌ Erro ao consultar cliente:', error.response?.data || error.message);
        return false;
    }
}

async function testUpdateCustomer(customerId) {
    console.log(`\n✏️ 5. Atualizando cliente ${customerId}...`);
    console.log('⚠️ Testando endpoint não oficial (pode falhar)');
    
    try {
        const updateData = {
            name: 'João Silva Teste Atualizado',
            phones: [
                {
                    country: '55',
                    area: '11',
                    number: '912345678',
                    type: 'MOBILE'
                }
            ]
        };
        
        const response = await axios.put(`${API_URL}/customers/${customerId}`, updateData);
        console.log('✅ Cliente atualizado:', response.data);
        
        if (response.data.warning) {
            console.warn('   ⚠️ ', response.data.warning);
        }
        
        return true;
    } catch (error) {
        console.error('❌ Erro ao atualizar cliente:', error.response?.data || error.message);
        console.log('   ℹ️ Este endpoint não é oficialmente documentado e pode não funcionar');
        return false;
    }
}

async function showInstructions() {
    console.log('\n' + '═'.repeat(60));
    console.log('📚 COMO USAR A API DE CLIENTES');
    console.log('═'.repeat(60));
    console.log('\n✅ Endpoints Disponíveis:\n');
    console.log('GET  /api/customers/info       - Informações do serviço');
    console.log('POST /api/customers/validate   - Validar dados sem criar');
    console.log('POST /api/customers            - Criar novo cliente');
    console.log('GET  /api/customers/:id        - Consultar cliente');
    console.log('PUT  /api/customers/:id        - Atualizar cliente (não oficial)');
    console.log('GET  /api/customers            - Listar clientes (não oficial)');
    console.log('\n📖 Documentação completa: docs/PAGBANK_CUSTOMERS.md\n');
}

async function runAllTests() {
    console.log('═'.repeat(60));
    console.log('🚀 TESTE DA API DE CLIENTES PAGBANK');
    console.log('═'.repeat(60));
    console.log(`Ambiente: ${process.env.PAGBANK_ENV || 'sandbox'}`);
    console.log(`API URL: ${API_URL}\n`);
    
    // 1. Verificar serviço
    const serviceOk = await testServiceInfo();
    if (!serviceOk) {
        console.log('\n⚠️ Serviço não configurado. Configure PAGBANK_TOKEN no .env');
        await showInstructions();
        return;
    }
    
    // 2. Validar dados
    const validationOk = await testValidateCustomer();
    if (!validationOk) {
        console.log('\n⚠️ Dados de teste inválidos');
        return;
    }
    
    // 3. Criar cliente
    const customer = await testCreateCustomer();
    if (!customer || !customer.id) {
        console.log('\n⚠️ Não foi possível criar cliente');
        console.log('   Verifique:');
        console.log('   - PAGBANK_TOKEN configurado');
        console.log('   - Ambiente (sandbox/production)');
        console.log('   - Saldo/créditos na conta PagBank');
        return;
    }
    
    // 4. Consultar cliente criado
    await testGetCustomer(customer.id);
    
    // 5. Tentar atualizar (endpoint não oficial)
    await testUpdateCustomer(customer.id);
    
    console.log('\n' + '═'.repeat(60));
    console.log('✅ TESTES CONCLUÍDOS');
    console.log('═'.repeat(60));
    console.log('\n📋 Resumo:');
    console.log(`   - Cliente criado: ${customer.id}`);
    console.log(`   - Nome: ${customer.name}`);
    console.log(`   - Email: ${customer.email}`);
    console.log('\n💡 Próximos passos:');
    console.log('   1. Use o customer.id em assinaturas/pagamentos');
    console.log('   2. Armazene o ID no seu banco de dados');
    console.log('   3. Consulte quando necessário');
    console.log('   4. Leia docs/PAGBANK_CUSTOMERS.md para mais detalhes\n');
    
    await showInstructions();
}

// Executar testes
runAllTests().catch(console.error);
