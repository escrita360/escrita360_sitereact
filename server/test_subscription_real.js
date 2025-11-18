/**
 * Script de teste para assinatura recorrente PagBank Sandbox
 * 
 * Este script testa o fluxo completo de criação de assinatura:
 * 1. Criar um plano
 * 2. Criar uma assinatura para o plano
 */

const PagBankSubscriptionsService = require('./app/services/pagbank_subscriptions_service');

async function testSubscriptionFlow() {
    console.log('🚀 Iniciando teste de assinatura PagBank Sandbox\n');
    
    const service = new PagBankSubscriptionsService();
    
    try {
        // Dados de teste
        const customerData = {
            name: 'João Silva Teste',
            email: 'joao.teste@example.com',
            cpf: '12345678909', // CPF de teste
            phone: '11987654321',
            address: {
                street: 'Rua Teste',
                number: '123',
                complement: 'Apto 45',
                locality: 'Centro',
                city: 'São Paulo',
                region_code: 'SP',
                postal_code: '01310100'
            }
        };

        console.log('📋 Dados do cliente:', customerData, '\n');

        // Passo 1: Criar plano
        console.log('1️⃣ Criando plano...');
        const planData = {
            name: 'Plano Teste Básico',
            description: 'Plano de teste para sandbox',
            amount: 29.90,
            interval_unit: 'MONTH',
            interval_value: 1,
            payment_methods: ['BOLETO'] // Apenas boleto para teste
        };
        
        console.log('📦 Dados do plano:', planData, '\n');
        
        const plan = await service.createPlan(planData);
        console.log('✅ Plano criado com sucesso!');
        console.log('📄 ID do Plano:', plan.id);
        console.log('📄 Referência:', plan.reference_id);
        console.log('💰 Valor:', plan.amount, '\n');

        // Passo 2: Criar assinatura
        console.log('2️⃣ Criando assinatura...');
        const subscriptionData = {
            plan_id: plan.id,
            customer: customerData,
            payment_method: 'BOLETO',
            amount: 29.90
        };

        const subscription = await service.createSubscription(subscriptionData);
        console.log('✅ Assinatura criada com sucesso!');
        console.log('📄 ID da Assinatura:', subscription.id);
        console.log('📄 Referência:', subscription.reference_id);
        console.log('📊 Status:', subscription.status);
        console.log('💳 Método de pagamento:', subscription.payment_method);
        console.log('👤 Cliente:', subscription.customer, '\n');

        // Resumo
        console.log('=' .repeat(60));
        console.log('✨ TESTE CONCLUÍDO COM SUCESSO! ✨');
        console.log('=' .repeat(60));
        console.log('📋 Resumo:');
        console.log(`  • Plano ID: ${plan.id}`);
        console.log(`  • Assinatura ID: ${subscription.id}`);
        console.log(`  • Status: ${subscription.status}`);
        console.log(`  • Valor: R$ ${planData.amount.toFixed(2)}`);
        console.log('=' .repeat(60));

        return { plan, subscription };

    } catch (error) {
        console.error('\n❌ ERRO NO TESTE:', error.message);
        
        if (error.response) {
            console.error('\n📋 Detalhes do erro:');
            console.error('Status:', error.response.status);
            console.error('Dados:', JSON.stringify(error.response.data, null, 2));
        }
        
        if (error.config) {
            console.error('\n🔧 Configuração da requisição:');
            console.error('URL:', error.config.url);
            console.error('Método:', error.config.method);
            console.error('Headers:', JSON.stringify(error.config.headers, null, 2));
        }
        
        throw error;
    }
}

// Executar teste
if (require.main === module) {
    testSubscriptionFlow()
        .then(() => {
            console.log('\n✅ Script finalizado com sucesso');
            process.exit(0);
        })
        .catch(() => {
            console.error('\n❌ Script finalizado com erro');
            process.exit(1);
        });
}

module.exports = { testSubscriptionFlow };
