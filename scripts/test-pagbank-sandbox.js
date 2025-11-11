/**
 * Script executável para testar o sandbox PagBank
 * Uso: node scripts/test-pagbank-sandbox.js
 */

import dotenv from 'dotenv'

// Carrega variáveis de ambiente
dotenv.config()

// Debug: mostra as variáveis carregadas
console.log('🔍 Variáveis de ambiente carregadas:')
console.log('VITE_PAGBANK_ENV:', process.env.VITE_PAGBANK_ENV)
console.log('VITE_PAGBANK_TOKEN:', process.env.VITE_PAGBANK_TOKEN ? 'Configurado' : 'Não configurado')
console.log('globalThis.import exists:', typeof globalThis.import !== 'undefined')
console.log('globalThis.import.meta exists:', typeof globalThis.import?.meta !== 'undefined')
console.log('---')

// Define globalThis para simular o ambiente do Vite
Object.defineProperty(globalThis, 'import', {
  value: {
    meta: {
      env: process.env
    }
  },
  writable: true,
  configurable: true
})

// Agora importa os módulos após configurar o ambiente
const { pagBankSandbox } = await import('../src/services/pagbank-sandbox.js')

async function runSandboxTests() {
  console.log('🚀 Iniciando testes do Sandbox PagBank...\n')
  
  try {
    const { results, logs } = await pagBankSandbox.runAllTests()
    
    // Exibe resultados
    console.log('\n📊 RESULTADOS DOS TESTES:')
    console.log('========================\n')
    
    // Configuração
    if (results.configuration?.success) {
      console.log('✅ Configuração: OK')
    } else {
      console.log('❌ Configuração: ERRO -', results.configuration?.error)
    }
    
    // Cartão aprovado
    if (results.creditCardApproved) {
      console.log('✅ Cartão Aprovado: OK')
    } else {
      console.log('❌ Cartão Aprovado: ERRO')
    }
    
    // Cartão negado
    if (results.creditCardDeclined) {
      console.log('✅ Cartão Negado: OK (esperado)')
    } else {
      console.log('❌ Cartão Negado: ERRO')
    }
    
    // PIX
    if (results.pix) {
      console.log('✅ PIX: OK')
    } else {
      console.log('❌ PIX: ERRO')
    }
    
    // Boleto
    if (results.boleto) {
      console.log('✅ Boleto: OK')
    } else {
      console.log('❌ Boleto: ERRO')
    }
    
    // Erros
    if (results.errors.length > 0) {
      console.log('\n🔥 ERROS ENCONTRADOS:')
      results.errors.forEach(error => {
        console.log(`   ${error.test}: ${error.error}`)
      })
    }
    
    console.log('\n📝 LOGS DETALHADOS:')
    console.log('===================\n')
    logs.forEach(log => {
      const icon = log.type === 'error' ? '❌' : log.type === 'success' ? '✅' : 'ℹ️'
      console.log(`${icon} [${log.timestamp}] ${log.message}`)
      if (log.data) {
        console.log('   Dados:', JSON.stringify(log.data, null, 2))
      }
    })
    
  } catch (error) {
    console.error('💥 Erro crítico no teste:', error.message)
    process.exit(1)
  }
}

// Função para testar componente específico
async function testSpecificComponent(component) {
  console.log(`🎯 Testando componente: ${component}\n`)
  
  try {
    switch (component) {
      case 'config':
        const configResult = await pagBankSandbox.testConfiguration()
        console.log('Resultado:', configResult)
        break
        
      case 'customer':
        const customer = await pagBankSandbox.testCreateCustomer()
        console.log('Cliente criado:', customer)
        break
        
      case 'card':
        const cardPayment = await pagBankSandbox.testCreditCardPayment('approved')
        console.log('Pagamento criado:', cardPayment)
        break
        
      case 'pix':
        const pixPayment = await pagBankSandbox.testPixPayment()
        console.log('PIX criado:', pixPayment)
        break
        
      case 'boleto':
        const boletoPayment = await pagBankSandbox.testBoletoPayment()
        console.log('Boleto criado:', boletoPayment)
        break
        
      default:
        console.log('Componentes disponíveis: config, customer, card, pix, boleto')
    }
    
  } catch (error) {
    console.error('Erro no teste:', error.message)
  }
}

// Processa argumentos da linha de comando
const args = process.argv.slice(2)
const command = args[0]
const component = args[1]

if (command === 'test' && component) {
  testSpecificComponent(component)
} else {
  runSandboxTests()
}