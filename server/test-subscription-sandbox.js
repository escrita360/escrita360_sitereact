const axios = require('axios');

// Dados de teste para sandbox
const testData = {
  plan_name: 'Plano Básico',
  plan_description: 'Plano Básico - Escrita360',
  amount: 29.90,
  interval_unit: 'MONTH',
  interval_value: 1,
  customer: {
    name: 'João da Silva',
    email: 'joao.silva@example.com',
    cpf: '12345678909',
    phone: '11987654321'
  },
  payment_method: 'BOLETO'
};

async function testSubscriptionCreation() {
  console.log('🧪 Testando criação de assinatura no sandbox...');
  console.log('📦 Dados enviados:', JSON.stringify(testData, null, 2));
  console.log('');

  try {
    const response = await axios.post(
      'http://localhost:5001/api/payment/create-pagbank-subscription',
      testData,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    console.log('✅ SUCESSO!');
    console.log('📄 Resposta completa:', JSON.stringify(response.data, null, 2));
    console.log('');
    console.log('🎉 Assinatura criada com sucesso!');
    if (response.data.subscription) {
      console.log('   ID da Assinatura:', response.data.subscription.id);
      console.log('   Status:', response.data.subscription.status);
    }
    if (response.data.plan) {
      console.log('   ID do Plano:', response.data.plan.id);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ ERRO ao testar assinatura:');
    console.error('');
    
    if (error.response) {
      console.error('Status HTTP:', error.response.status);
      console.error('Dados do erro:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.error('Erro na requisição (sem resposta do servidor)');
      console.error('Mensagem:', error.message);
    } else {
      console.error('Erro:', error.message);
    }
    
    console.error('');
    console.error('💡 Dicas:');
    console.error('   - Verifique se o servidor está rodando em http://localhost:5001');
    console.error('   - Confirme que o PAGBANK_TOKEN está configurado no .env');
    console.error('   - Teste a conexão: curl http://localhost:5001/health');
    
    process.exit(1);
  }
}

// Aguardar 1 segundo para garantir que o servidor esteja pronto
setTimeout(testSubscriptionCreation, 1000);
