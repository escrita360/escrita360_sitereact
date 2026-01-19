/**
 * Teste PIX e Boleto em PRODUÇÃO
 * Diagnóstico de problemas em ambiente de produção
 */

// Configuração PRODUÇÃO
const PAGBANK_TOKEN_PRODUCTION = 'f11f98bb-9f75-42c9-af5a-94a77c0de7a2498993c640c0806b91658927a44cb5121dc0-4674-4b09-b736-204105dc5080'; // Token do .env do servidor
const API_URL_PRODUCTION = 'https://api.pagseguro.com'; // URL de produção

console.log('🔴 TESTANDO PIX E BOLETO EM PRODUÇÃO');
console.log('===================================\n');

/**
 * Teste PIX em Produção
 */
async function testPixProduction() {
  console.log('💰 Testando PIX em PRODUÇÃO...\n');

  const payload = {
    reference_id: `prod_pix_${Date.now()}`,
    customer: {
      name: 'Cliente Teste Producao',
      email: 'cliente@email.com',
      tax_id: '12345678909',
      phones: [
        {
          country: '55',
          area: '11',
          number: '999999999',
          type: 'MOBILE'
        }
      ]
    },
    items: [
      {
        reference_id: 'item_001',
        name: 'Teste PIX Produção',
        quantity: 1,
        unit_amount: 100 // R$ 1,00 para teste
      }
    ],
    qr_codes: [
      {
        amount: {
          value: 100 // R$ 1,00 para teste
        },
        expiration_date: new Date(Date.now() + 120 * 60 * 1000).toISOString() // 2 horas
      }
    ],
    notification_urls: [
      'https://webhook.site/your-unique-id'
    ]
  };

  console.log('📦 Payload PIX:');
  console.log(JSON.stringify(payload, null, 2));
  console.log(`\n🔗 URL: ${API_URL_PRODUCTION}/orders`);
  console.log(`🔑 Token: ${PAGBANK_TOKEN_PRODUCTION.substring(0, 20)}...`);

  try {
    const response = await fetch(`${API_URL_PRODUCTION}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PAGBANK_TOKEN_PRODUCTION}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    console.log(`\n📡 Status PIX: ${response.status} ${response.statusText}`);

    const data = await response.json();
    
    if (!response.ok) {
      console.error('\n❌ ERRO PIX PRODUÇÃO:');
      console.error(JSON.stringify(data, null, 2));
      
      // Diagnóstico específico
      if (response.status === 401) {
        console.error('\n🚨 PROBLEMA: Token inválido ou sem permissões');
        console.error('✅ SOLUÇÃO: Verifique o token no painel PagBank produção');
      }
      if (response.status === 403) {
        console.error('\n🚨 PROBLEMA: Acesso negado - PIX pode não estar habilitado');
        console.error('✅ SOLUÇÃO: Habilite PIX na sua conta PagBank de produção');
        console.error('✅ SOLUÇÃO: Cadastre uma chave PIX na conta');
      }
      if (response.status === 400) {
        console.error('\n🚨 PROBLEMA: Dados inválidos no payload');
        console.error('✅ SOLUÇÃO: Verifique se os dados do cliente estão corretos');
      }
      return;
    }

    console.log('\n✅ SUCESSO PIX PRODUÇÃO:');
    console.log(JSON.stringify(data, null, 2));

    if (data.qr_codes && data.qr_codes.length > 0) {
      const qrCode = data.qr_codes[0];
      console.log('\n🎯 PIX Gerado:');
      console.log('ID:', qrCode.id);
      console.log('Expira em:', qrCode.expiration_date);
      console.log('Valor: R$', (qrCode.amount.value / 100).toFixed(2));
    }

  } catch (error) {
    console.error('\n❌ Erro na requisição PIX:', error.message);
  }
}

/**
 * Teste Boleto em Produção
 */
async function testBoletoProduction() {
  console.log('\n\n📄 Testando BOLETO em PRODUÇÃO...\n');

  const payload = {
    reference_id: `prod_boleto_${Date.now()}`,
    customer: {
      name: 'Cliente Teste Boleto',
      email: 'cliente@email.com',
      tax_id: '12345678909',
      phones: [
        {
          country: '55',
          area: '11',
          number: '999999999',
          type: 'MOBILE'
        }
      ]
    },
    items: [
      {
        reference_id: 'item_002',
        name: 'Teste Boleto Produção',
        quantity: 1,
        unit_amount: 100 // R$ 1,00 para teste
      }
    ],
    charges: [
      {
        reference_id: 'charge_boleto_001',
        description: 'Teste Boleto Produção',
        amount: {
          value: 100,
          currency: 'BRL'
        },
        payment_method: {
          type: 'BOLETO',
          boleto: {
            due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 dias
            holder: {
              name: 'Cliente Teste Boleto',
              tax_id: '12345678909',
              email: 'cliente@email.com',
              address: {
                street: 'Rua Teste',
                number: '123',
                locality: 'Centro',
                city: 'São Paulo',
                region: 'SP',
                region_code: 'SP',
                country: 'BRA',
                postal_code: '01000000'
              }
            }
          }
        }
      }
    ],
    notification_urls: [
      'https://webhook.site/your-unique-id'
    ]
  };

  console.log('📦 Payload Boleto:');
  console.log(JSON.stringify(payload, null, 2));

  try {
    const response = await fetch(`${API_URL_PRODUCTION}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PAGBANK_TOKEN_PRODUCTION}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    console.log(`\n📡 Status Boleto: ${response.status} ${response.statusText}`);

    const data = await response.json();
    
    if (!response.ok) {
      console.error('\n❌ ERRO BOLETO PRODUÇÃO:');
      console.error(JSON.stringify(data, null, 2));
      
      // Diagnóstico específico
      if (response.status === 401) {
        console.error('\n🚨 PROBLEMA: Token inválido ou sem permissões');
        console.error('✅ SOLUÇÃO: Verifique o token no painel PagBank produção');
      }
      if (response.status === 403) {
        console.error('\n🚨 PROBLEMA: Acesso negado - Boleto pode não estar habilitado');
        console.error('✅ SOLUÇÃO: Habilite Boleto Bancário na conta PagBank');
      }
      if (response.status === 400) {
        console.error('\n🚨 PROBLEMA: Dados inválidos no payload');
        console.error('✅ SOLUÇÃO: Verifique dados do cliente e vencimento do boleto');
      }
      return;
    }

    console.log('\n✅ SUCESSO BOLETO PRODUÇÃO:');
    console.log(JSON.stringify(data, null, 2));

    if (data.charges && data.charges.length > 0) {
      const charge = data.charges[0];
      console.log('\n🎯 Boleto Gerado:');
      console.log('ID:', charge.id);
      console.log('Status:', charge.status);
      if (charge.links) {
        charge.links.forEach(link => {
          console.log(`${link.rel}:`, link.href);
        });
      }
    }

  } catch (error) {
    console.error('\n❌ Erro na requisição Boleto:', error.message);
  }
}

/**
 * Diagnóstico geral
 */
async function diagnosticProduction() {
  console.log('\n\n🔍 DIAGNÓSTICO GERAL PRODUÇÃO');
  console.log('=============================\n');

  // Verificar token
  if (!PAGBANK_TOKEN_PRODUCTION || PAGBANK_TOKEN_PRODUCTION === 'your_production_token_here') {
    console.error('❌ Token de produção não configurado!');
    console.log('✅ Configure o token real de produção neste script');
    console.log('✅ Obtenha o token em: https://painel.pagseguro.uol.com.br/');
    return false;
  }

  // Verificar conectividade
  try {
    console.log('🌐 Testando conectividade com API de produção...');
    const response = await fetch(API_URL_PRODUCTION, {
      method: 'HEAD'
    });
    console.log(`✅ API acessível: ${response.status}`);
  } catch (error) {
    console.error('❌ Erro de conectividade:', error.message);
    return false;
  }

  return true;
}

/**
 * Executar todos os testes
 */
async function runAllTests() {
  const isReady = await diagnosticProduction();
  
  if (!isReady) {
    console.log('\n❌ Configuração incompleta. Corrija os problemas acima e execute novamente.');
    return;
  }

  await testPixProduction();
  await testBoletoProduction();

  console.log('\n\n📋 RESUMO DO DIAGNÓSTICO:');
  console.log('========================');
  console.log('1. Configure o token de produção real neste script');
  console.log('2. Verifique se PIX está habilitado na conta PagBank');
  console.log('3. Cadastre pelo menos uma chave PIX');
  console.log('4. Verifique se Boleto Bancário está habilitado');
  console.log('5. Configure webhooks para receber notificações');
  console.log('\n🔗 Painel PagBank: https://painel.pagseguro.uol.com.br/');
}

// Executar
runAllTests().catch(console.error);