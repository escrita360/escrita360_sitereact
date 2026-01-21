import axios from 'axios';

// Dados de teste para sandbox com cartão real de teste
const testData = {
  plan_name: 'Plano Básico',
  plan_description: 'Plano Básico - Escrita360',
  amount: 2990, // Valor em centavos (R$ 29,90 = 2990 centavos)
  interval_unit: 'MONTH',
  interval_value: 1,
  customer: {
    name: 'Maria Santos',
    email: 'maria.santos' + Date.now() + '@teste.com',
    cpf: '98765432100',
    phone: '11987654322'
  },
  payment_method: 'CREDIT_CARD',
  cardData: {
    number: '5555666677778884',
    expiryMonth: '12',
    expiryYear: '2026',
    cvv: '123',
    holderName: 'TESTE DA SILVA',
    token: 'CARD_8286F604-2D44-4B30-A80D-0E749A555566'
  }
};

async function testRecurringSubscription() {
  console.log('🧪 Testando criação de assinatura recorrente no sandbox...');
  console.log('💳 Cartão de teste: 5555666677778884');
  console.log('📦 Dados enviados:', JSON.stringify(testData, null, 2));
  console.log('');

  try {
    const response = await axios.post(
      'http://localhost:5000/api/payment/create-pagbank-subscription',
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
    console.log('🎉 Assinatura recorrente criada com sucesso!');
    
    if (response.data.subscription) {
      console.log('');
      console.log('📋 Detalhes da Assinatura:');
      console.log('   ID da Assinatura:', response.data.subscription.id);
      console.log('   Status:', response.data.subscription.status);
      console.log('   Código:', response.data.subscription.code);
    }
    
    if (response.data.plan) {
      console.log('');
      console.log('📋 Detalhes do Plano:');
      console.log('   ID do Plano:', response.data.plan.id);
      console.log('   Nome:', response.data.plan.name);
      console.log('   Valor:', 'R$', response.data.plan.amount);
    }
    
    if (response.data.payment_link) {
      console.log('');
      console.log('🔗 Link de Pagamento:', response.data.payment_link);
    }
    
    console.log('');
    console.log('✅ Teste concluído com sucesso!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ ERRO ao testar assinatura recorrente:');
    console.error('');
    
    if (error.response) {
      console.error('Status HTTP:', error.response.status);
      console.error('Dados do erro:', JSON.stringify(error.response.data, null, 2));
      
      if (error.response.data?.details) {
        console.error('');
        console.error('📋 Detalhes do erro:');
        console.error(JSON.stringify(error.response.data.details, null, 2));
      }
    } else if (error.request) {
      console.error('Erro na requisição (sem resposta do servidor)');
      console.error('Mensagem:', error.message);
    } else {
      console.error('Erro:', error.message);
    }
    
    console.error('');
    console.error('💡 Dicas:');
    console.error('   - Verifique se o servidor está rodando em http://localhost:5000');
    console.error('   - Confirme que o PAGBANK_TOKEN está configurado no server/.env');
    console.error('   - Teste a conexão: curl http://localhost:5000/health');
    console.error('   - Verifique os logs do servidor backend');
    
    process.exit(1);
  }
}

console.log('⏳ Aguardando 2 segundos para garantir que o servidor esteja pronto...');
setTimeout(testRecurringSubscription, 2000);
