/**
 * Teste direto da API PagBank - Criação de pedido
 */

import dotenv from 'dotenv'
dotenv.config()

// Simula o ambiente do Vite
Object.defineProperty(globalThis, 'import', {
  value: {
    meta: {
      env: process.env
    }
  },
  writable: true,
  configurable: true
})

const { pagBankService } = await import('../src/services/pagbank.js')

async function testDirectOrder() {
  console.log('🧪 Testando criação direta de pedido PagBank...\n')

  try {
    // Dados de teste para um pedido PIX
    const orderData = {
      reference_id: `test_${Date.now()}`,
      customer: {
        name: 'João Silva Teste',
        email: 'teste@example.com',
        tax_id: '11144477735', // CPF válido de teste
        phone: {
          country: '+55',
          area: '11',
          number: '999999999'
        }
      },
      items: [{
        reference_id: 'plano_basico',
        name: 'Plano Básico Escrita360',
        quantity: 1,
        unit_amount: 2900 // R$ 29,00
      }],
      charges: [{
        reference_id: `charge_${Date.now()}`,
        description: 'Pagamento teste Escrita360',
        amount: {
          value: 2900,
          currency: 'BRL'
        },
        payment_method: {
          type: 'PIX',
          pix: {
            expires_in: 1800 // 30 minutos
          }
        }
      }],
      notification_urls: [
        'https://webhook.site/test-pagbank'
      ]
    }

    console.log('📤 Enviando pedido para PagBank...')
    console.log('Dados:', JSON.stringify(orderData, null, 2))

    console.log('🔍 Testando conectividade básica...')
    
    // Primeiro, testa uma requisição simples para verificar conectividade
    try {
      const testResponse = await fetch('https://sandbox.api.pagseguro.com/public-keys/card', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.VITE_PAGBANK_TOKEN}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
      console.log('✅ Conectividade OK - Status:', testResponse.status)
    } catch (error) {
      console.log('❌ Erro de conectividade:', error.message)
    }

    console.log('� Testando endpoints disponíveis...')
    
    // Testa alguns endpoints GET para ver o que está disponível
    const endpointsToTest = ['', '/charges', '/orders', '/checkouts', '/transactions']
    
    for (const endpoint of endpointsToTest) {
      try {
        const response = await fetch(`https://ws.sandbox.pagseguro.uol.com.br${endpoint}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${process.env.VITE_PAGBANK_TOKEN}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        })
        console.log(`Endpoint ${endpoint || '/'} : Status ${response.status}`)
      } catch (error) {
        console.log(`Endpoint ${endpoint || '/'} : Erro - ${error.message}`)
      }
    }

    console.log('📤 Testando criação de pedido com implementação simulada...')
    
    // Usar a implementação simulada
    const result = await pagBankService.createOrder(orderData)

    console.log('\n✅ Pedido criado com sucesso!')
    console.log('Resultado:', JSON.stringify(result, null, 2))

    // Verifica se tem dados do PIX
    if (result.charges && result.charges[0]?.payment_method?.pix) {
      console.log('\n💰 Dados do PIX:')
      console.log('QR Code:', result.charges[0].payment_method.pix.qr_code)
      console.log('Copia e Cola:', result.charges[0].payment_method.pix.qr_code_text)
    }

  } catch (error) {
    console.error('\n❌ Erro ao criar pedido:', error.message)

    // Tenta obter mais detalhes do erro
    if (error.response) {
      console.error('Status:', error.response.status)
      console.error('Dados do erro:', error.response.data)
    }
  }
}

testDirectOrder()