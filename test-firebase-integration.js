// Script de Teste - Integração Firebase
// Execute no console do navegador após importar o serviço

import { firebaseAuthService, firebaseSubscriptionService } from '../src/services/firebase.js'

/**
 * Teste 1: Criar conta no Firebase
 */
async function testCreateAccount() {
  console.log('🧪 Teste 1: Criando conta no Firebase...')
  
  try {
    const result = await firebaseAuthService.register(
      'teste@escrita360.com.br',
      'senha123456',
      {
        name: 'Usuário Teste',
        cpf: '12345678900',
        phone: '11987654321'
      }
    )
    
    console.log('✅ Conta criada com sucesso!')
    console.log('UID:', result.uid)
    console.log('Email:', result.email)
    console.log('Dados:', result.user)
    
    return result
  } catch (error) {
    console.error('❌ Erro ao criar conta:', error.message)
    throw error
  }
}

/**
 * Teste 2: Criar assinatura
 */
async function testCreateSubscription(userId) {
  console.log('🧪 Teste 2: Criando assinatura...')
  
  const planMock = {
    name: 'Intermediário',
    price: 49.90
  }
  
  try {
    const result = await firebaseSubscriptionService.createSubscription(
      userId,
      {
        plan: planMock,
        isYearly: false,
        paymentData: {
          name: 'Usuário Teste',
          email: 'teste@escrita360.com.br',
          transactionId: 'TEST_' + Date.now()
        }
      }
    )
    
    console.log('✅ Assinatura criada com sucesso!')
    console.log('ID:', result.assinaturaId)
    console.log('Dados:', result.assinatura)
    
    return result
  } catch (error) {
    console.error('❌ Erro ao criar assinatura:', error.message)
    throw error
  }
}

/**
 * Teste 3: Buscar assinatura
 */
async function testGetSubscription(userId) {
  console.log('🧪 Teste 3: Buscando assinatura...')
  
  try {
    const subscription = await firebaseSubscriptionService.getActiveSubscription(userId)
    
    if (subscription) {
      console.log('✅ Assinatura encontrada!')
      console.log('ID:', subscription.id)
      console.log('Plano:', subscription.tipoNome)
      console.log('Tokens:', subscription.tokens)
      console.log('Expira em:', subscription.dataExpiracao)
    } else {
      console.log('⚠️ Nenhuma assinatura encontrada')
    }
    
    return subscription
  } catch (error) {
    console.error('❌ Erro ao buscar assinatura:', error.message)
    throw error
  }
}

/**
 * Teste 4: Login
 */
async function testLogin() {
  console.log('🧪 Teste 4: Fazendo login...')
  
  try {
    const result = await firebaseAuthService.login(
      'teste@escrita360.com.br',
      'senha123456'
    )
    
    console.log('✅ Login realizado com sucesso!')
    console.log('UID:', result.uid)
    console.log('Email:', result.email)
    
    return result
  } catch (error) {
    console.error('❌ Erro ao fazer login:', error.message)
    throw error
  }
}

/**
 * Executa todos os testes
 */
async function runAllTests() {
  console.log('🚀 Iniciando testes da integração Firebase...\n')
  
  try {
    // Teste 1: Criar conta
    const accountResult = await testCreateAccount()
    console.log('\n')
    
    // Teste 2: Criar assinatura
    await testCreateSubscription(accountResult.uid)
    console.log('\n')
    
    // Teste 3: Buscar assinatura
    await testGetSubscription(accountResult.uid)
    console.log('\n')
    
    // Teste 4: Login (opcional, apenas para validar)
    // await testLogin()
    
    console.log('\n🎉 Todos os testes passaram com sucesso!')
    console.log('\n📋 Próximo passo: Teste no app Flutter')
    console.log('1. Abra o app Flutter')
    console.log('2. Faça login com: teste@escrita360.com.br / senha123456')
    console.log('3. Verifique se a assinatura aparece')
    
  } catch (error) {
    console.error('\n💥 Falha nos testes:', error)
  }
}

// Exportar funções para uso manual
export {
  testCreateAccount,
  testCreateSubscription,
  testGetSubscription,
  testLogin,
  runAllTests
}

/**
 * COMO USAR:
 * 
 * 1. No terminal:
 *    cd escrita360_sitereact
 *    pnpm install firebase
 *    pnpm dev
 * 
 * 2. No console do navegador (F12):
 *    // Importar e executar
 *    import('./test-firebase-integration.js').then(m => m.runAllTests())
 * 
 * 3. Verificar logs no console
 * 
 * 4. Verificar no Firebase Console:
 *    https://console.firebase.google.com/project/escrita360aluno
 *    - Authentication → Ver usuário
 *    - Firestore → Ver dados
 * 
 * 5. Testar no app Flutter:
 *    - Login com email/senha criados
 *    - Verificar assinatura ativa
 */

console.log('✅ Módulo de testes carregado!')
console.log('Execute: runAllTests() ou teste funções individuais')
