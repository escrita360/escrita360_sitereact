// Teste rápido do backend
async function testBackend() {
  try {
    console.log('🔍 Testando backend...')
    
    // Teste de health
    const healthResponse = await fetch('http://localhost:5000/health')
    const healthData = await healthResponse.text()
    console.log('✅ Health check:', healthData)
    
    // Teste de fees
    const feesUrl = 'http://localhost:5000/api/payment/pagbank/fees?value=10000&max_installments=12&max_installments_no_interest=1'
    console.log('🔍 Testando endpoint de fees:', feesUrl)
    
    const feesResponse = await fetch(feesUrl)
    console.log('📊 Status da resposta:', feesResponse.status)
    console.log('📊 Headers:', [...feesResponse.headers.entries()])
    
    if (feesResponse.ok) {
      const feesData = await feesResponse.json()
      console.log('✅ Dados de fees:', JSON.stringify(feesData, null, 2))
    } else {
      const errorText = await feesResponse.text()
      console.error('❌ Erro na resposta:', errorText)
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error)
  }
}

testBackend()