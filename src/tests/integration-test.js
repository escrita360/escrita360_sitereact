/**
 * Script de teste para validar a integração Frontend-Backend
 * Execute no console do navegador após carregar a página
 */

// 1. Testar conexão com a API
async function testConnection() {
  console.log('🔍 Testando conexão com o backend...')
  
  try {
    const response = await fetch('http://localhost:5000/api/health')
    const data = await response.json()
    console.log('✅ Backend está rodando:', data)
    return true
  } catch (error) {
    console.error('❌ Erro ao conectar com o backend:', error)
    console.log('💡 Certifique-se de que o backend está rodando em http://localhost:5000')
    return false
  }
}

// 2. Testar autenticação
async function testAuth() {
  console.log('🔐 Testando autenticação...')
  
  const testUser = {
    email: `teste${Date.now()}@email.com`,
    password: 'Senha123!',
    name: 'Usuario Teste'
  }
  
  try {
    // Importar o serviço
    const { authService } = await import('./src/services/auth.js')
    
    // Registrar
    console.log('📝 Registrando usuário...')
    const registerResult = await authService.register(
      testUser.email,
      testUser.password,
      testUser.name
    )
    console.log('✅ Registro bem-sucedido:', registerResult)
    
    // Logout
    console.log('🚪 Fazendo logout...')
    authService.logout()
    
    // Login
    console.log('🔓 Fazendo login...')
    const loginResult = await authService.login(testUser.email, testUser.password)
    console.log('✅ Login bem-sucedido:', loginResult)
    
    // Verificar token
    console.log('🎫 Verificando token...')
    const verifyResult = await authService.verifyToken()
    console.log('✅ Token válido:', verifyResult)
    
    return true
  } catch (error) {
    console.error('❌ Erro no teste de autenticação:', error)
    return false
  }
}

// 3. Testar pagamento (requer autenticação)
async function testPayment() {
  console.log('💳 Testando processamento de pagamento...')
  
  const testPayment = {
    planId: 'basic',
    isYearly: false,
    email: 'teste@email.com',
    cardName: 'TESTE USUARIO',
    cardNumber: 'CARD_NUMBER', // REMOVER: Cartão de teste
    expiryDate: 'MM/YY',
    cvv: 'CVV',
    phone: '11999999999',
    cpf: 'CPF_NUMBER'
  }
  
  try {
    const { paymentService } = await import('./src/services/payment.js')
    
    console.log('💰 Processando pagamento...')
    const result = await paymentService.processPayment(testPayment)
    console.log('✅ Pagamento processado:', result)
    
    return true
  } catch (error) {
    console.error('❌ Erro no teste de pagamento:', error.response?.data || error.message)
    return false
  }
}

// 4. Executar todos os testes
async function runAllTests() {
  console.clear()
  console.log('🚀 Iniciando testes de integração...\n')
  
  const connectionOk = await testConnection()
  if (!connectionOk) {
    console.log('\n❌ Não foi possível continuar. Backend não está acessível.')
    return
  }
  
  console.log('\n' + '='.repeat(50) + '\n')
  
  const authOk = await testAuth()
  
  console.log('\n' + '='.repeat(50) + '\n')
  
  if (authOk) {
    await testPayment()
  } else {
    console.log('⚠️ Pulando teste de pagamento (autenticação falhou)')
  }
  
  console.log('\n' + '='.repeat(50))
  console.log('\n✨ Testes concluídos!')
}

// Exportar funções para uso no console
window.testIntegration = {
  connection: testConnection,
  auth: testAuth,
  payment: testPayment,
  all: runAllTests
}

console.log('🧪 Testes de integração carregados!')
console.log('Execute: testIntegration.all() para rodar todos os testes')
console.log('Ou execute testes individuais:')
console.log('  - testIntegration.connection()')
console.log('  - testIntegration.auth()')
console.log('  - testIntegration.payment()')
