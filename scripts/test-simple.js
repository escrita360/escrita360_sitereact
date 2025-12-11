const http = require('http');

const payload = {
    plan_name: "Plano Básico Mensal",
    plan_description: "Plano de teste para assinatura recorrente",
    amount: 4990,
    interval_unit: "MONTH",
    interval_value: 1,
    customer: {
        name: "João Silva Teste",
        email: "joao.silva.teste@escrita360.com",
        cpf: "63013767812",
        phone: {
            area_code: "11",
            number: "999999999"
        }
    },
    payment_method: "CREDIT_CARD",
    cardData: {
        number: "5555666677778884",
        expiryMonth: "12",
        expiryYear: "2026",
        cvv: "123",
        holderName: "João Silva Teste"
    }
};

const postData = JSON.stringify(payload);

const options = {
    hostname: 'localhost',
    port: 5001,
    path: '/api/payment/create-pagbank-subscription',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
    }
};

console.log('🚀 Testando criação de assinatura...\n');

const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers: ${JSON.stringify(res.headers)}\n`);
    
    let data = '';
    
    res.on('data', (chunk) => {
        data += chunk;
    });
    
    res.on('end', () => {
        console.log('📋 Resposta do servidor:');
        try {
            const jsonResponse = JSON.parse(data);
            console.log(JSON.stringify(jsonResponse, null, 2));
        } catch {
            console.log(data);
        }
    });
});

req.on('error', (e) => {
    console.error(`❌ Erro na requisição: ${e.message}`);
});

req.write(postData);
req.end();
