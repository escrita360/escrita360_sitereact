// Teste da API de taxas
async function testAPI() {
  try {
    console.log('🔍 Testando API de taxas...')

    const response = await fetch('http://localhost:5000/api/payment/pagbank/fees?value=57000&max_installments=3&max_installments_no_interest=3')
    console.log('📊 Status:', response.status)

    if (response.ok) {
      const data = await response.json()
      console.log('✅ Dados da API:', JSON.stringify(data, null, 2))
    } else {
      const error = await response.text()
      console.error('❌ Erro da API:', error)
    }
  } catch (error) {
    console.error('❌ Erro de conexão:', error)
  }
}

testAPI()