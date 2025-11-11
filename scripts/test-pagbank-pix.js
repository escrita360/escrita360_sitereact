/**
 * Teste da API PagBank - Pagamento PIX
 * Baseado na documentação oficial: https://developer.pagbank.com.br/reference/criar-pedido
 */

// Configuração
const PAGBANK_TOKEN = 'e7160b77-a214-4b48-8c61-93732bc6241b2256143d4139951eb97603d812916bd6e65e-ed77-49cf-97a6-87b1bf6fe327'
const API_URL = 'https://sandbox.api.pagseguro.com'

async function testPixPayment() {
  console.log('🧪 Testando criação de pedido PIX...\n')

  const payload = {
    reference_id: `test_pix_${Date.now()}`,
    customer: {
      name: 'Cliente Teste',
      email: 'cliente.teste@email.com',
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
        name: 'Plano Profissional - Escrita360',
        quantity: 1,
        unit_amount: 9900 // R$ 99,00 em centavos
      }
    ],
    qr_codes: [
      {
        amount: {
          value: 9900 // R$ 99,00 em centavos
        },
        expiration_date: new Date(Date.now() + 30 * 60 * 1000).toISOString()
      }
    ],
    notification_urls: [
      'https://webhook.site/your-unique-id'
    ]
  }

  console.log('📦 Payload:', JSON.stringify(payload, null, 2))
  console.log('\n🔗 Fazendo requisição para:', `${API_URL}/orders`)

  try {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PAGBANK_TOKEN}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    console.log(`\n📡 Status: ${response.status} ${response.statusText}`)
    console.log('📋 Headers:', Object.fromEntries(response.headers.entries()))

    const data = await response.json()
    
    if (!response.ok) {
      console.error('\n❌ Erro na API:')
      console.error(JSON.stringify(data, null, 2))
      return
    }

    console.log('\n✅ Sucesso! Resposta da API:')
    console.log(JSON.stringify(data, null, 2))

    // Exibir informações do QR Code PIX se disponível
    if (data.qr_codes && data.qr_codes.length > 0) {
      const qrCode = data.qr_codes[0]
      console.log('\n🔍 Informações do PIX:')
      console.log('ID:', qrCode.id)
      console.log('Expira em:', qrCode.expiration_date)
      if (qrCode.links) {
        console.log('Links:', qrCode.links)
      }
      if (qrCode.text) {
        console.log('\n📱 Código PIX (copiar e colar):')
        console.log(qrCode.text)
      }
    }

  } catch (error) {
    console.error('\n❌ Erro na requisição:', error.message)
  }
}

// Executar teste
testPixPayment()
