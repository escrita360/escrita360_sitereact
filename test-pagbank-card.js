import axios from 'axios';

/**
 * Teste de integração com PagBank usando cartão de teste
 * Cartão: 5555666677778884
 */

const testOrderWithCard = async () => {
    try {
        console.log('🧪 Testando criação de pedido com cartão de teste...\n');

        const orderData = {
            reference_id: `TEST_CREDITOS_${Date.now()}`,
            customer: {
                name: 'João da Silva',
                email: 'joao.teste@email.com',
                tax_id: '12345678909',
                phones: [{
                    country: '55',
                    area: '11',
                    number: '987654321',
                    type: 'MOBILE'
                }]
            },
            items: [{
                reference_id: 'pacote-basico',
                name: 'Pacote Básico - 50 Créditos',
                quantity: 1,
                unit_amount: 2990 // R$ 29,90 em centavos
            }],
            charges: [{
                reference_id: `CHARGE_${Date.now()}`,
                description: 'Compra de Pacote Básico - 50 Créditos',
                amount: {
                    value: 2990,
                    currency: 'BRL'
                },
                payment_method: {
                    type: 'CREDIT_CARD',
                    installments: 1,
                    capture: true,
                    card: {
                        number: '5555666677778884',
                        exp_month: '12',
                        exp_year: '2026',
                        security_code: '123',
                        holder: {
                            name: 'JOAO DA SILVA'
                        }
                    }
                }
            }]
        };

        console.log('📤 Enviando pedido para backend...');
        console.log('Endpoint: http://localhost:5001/api/payment/pagbank/create-order\n');

        const response = await axios.post(
            'http://localhost:5001/api/payment/pagbank/create-order',
            orderData,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('✅ SUCESSO! Pedido criado:\n');
        console.log('Order ID:', response.data.id);
        console.log('Status:', response.data.charges?.[0]?.status);
        console.log('Valor:', response.data.charges?.[0]?.amount?.value / 100, 'BRL');
        console.log('\n📋 Resposta completa:');
        console.log(JSON.stringify(response.data, null, 2));

        return response.data;

    } catch (error) {
        console.error('\n❌ ERRO ao criar pedido:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Detalhes:', JSON.stringify(error.response.data, null, 2));
        } else if (error.request) {
            console.error('Sem resposta do servidor');
            console.error('Request:', error.request);
        } else {
            console.error('Erro:', error.message);
            console.error('Stack:', error.stack);
        }
        throw error;
    }
};

// Executar teste
testOrderWithCard()
    .then(() => {
        console.log('\n✅ Teste concluído com sucesso!');
        process.exit(0);
    })
    .catch(() => {
        console.error('\n❌ Teste falhou!');
        process.exit(1);
    });
