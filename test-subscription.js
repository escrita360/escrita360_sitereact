import axios from 'axios';

async function testSubscriptionAPI() {
  try {
    console.log('🔄 Testando API de criação de assinatura...');

    const data = {
      plan_name: "Básico",
      plan_description: "Plano Básico - Escrita360",
      amount: 29.9,
      interval_unit: "MONTH",
      interval_value: 1,
      customer: {
        name: "Teste",
        email: "teste@example.com",
        cpf: "12345678901",
        phone: "11999999999"
      },
      payment_method: "CREDIT_CARD",
      cardData: {
        number: "4111111111111111",
        expiryMonth: "12",
        expiryYear: "2025",
        cvv: "123",
        holderName: "Teste"
      }
    };

    console.log('📦 Dados enviados:', JSON.stringify(data, null, 2));

    const response = await axios.post('http://localhost:5001/api/payment/create-pagbank-subscription', data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Resposta:', response.data);
  } catch (error) {
    console.error('❌ Erro:', error.response?.data || error.message);
    if (error.response?.data?.details) {
      console.error('Detalhes:', JSON.stringify(error.response.data.details, null, 2));
    }
  }
}

testSubscriptionAPI();