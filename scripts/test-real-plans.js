/**
 * Script de teste para simular compras reais dos planos do site Escrita360
 * Baseado nos planos reais: Básico (R$49), Profissional (R$130), Trimestral (R$340), Semestral (R$650)
 * Uso: node scripts/test-real-plans.js
 */

import dotenv from 'dotenv'

// Definir process como global para compatibilidade
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
globalThis.process = require('process')

// Mock do localStorage para Node.js
globalThis.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {}
}

// Carrega variáveis de ambiente
dotenv.config()

// Definir ambiente de teste
globalThis.process.env.NODE_ENV = 'test'

// Define globalThis para simular o ambiente do Vite
globalThis.import = {
  meta: {
    env: {
      VITE_API_URL: globalThis.process.env.VITE_API_URL || 'http://localhost:5000/api'
    }
  }
}

// Importa os serviços necessários
const { paymentService } = await import('../src/services/payment.js')

console.log('🚀 Teste de Compras Reais - Planos Escrita360\n')
console.log('================================================\n')

// Planos reais do site
const realPlans = [
  {
    name: 'Básico',
    price: 49.00,
    credits: 20,
    description: 'Plano Básico Mensal - 20 créditos IA'
  },
  {
    name: 'Profissional',
    price: 130.00,
    credits: 100,
    description: 'Plano Profissional Mensal - 100 créditos IA'
  },
  {
    name: 'Trimestral',
    price: 340.00,
    credits: 250,
    description: 'Plano Trimestral - 250 créditos IA'
  },
  {
    name: 'Semestral',
    price: 650.00,
    credits: 500,
    description: 'Plano Semestral - 500 créditos IA'
  }
]

// Dados de teste para diferentes compradores
const testCustomers = [
  {
    name: 'Maria Silva',
    email: 'maria.silva.teste@escrita360.com',
    cpf: '12345678901',
    phone: '11987654321'
  },
  {
    name: 'João Santos',
    email: 'joao.santos.teste@escrita360.com',
    cpf: '98765432109',
    phone: '11876543210'
  },
  {
    name: 'Ana Costa',
    email: 'ana.costa.teste@escrita360.com',
    cpf: '45678912345',
    phone: '11765432109'
  },
  {
    name: 'Pedro Oliveira',
    email: 'pedro.oliveira.teste@escrita360.com',
    cpf: '78912345678',
    phone: '11654321098'
  }
]

async function testRealPlanPurchase(plan, customer) {
  console.log(`🛒 Testando compra do ${plan.name} para ${customer.name}`)
  console.log(`   Valor: R$ ${plan.price.toFixed(2)}`)
  console.log(`   Créditos IA: ${plan.credits}`)
  console.log('')

  try {
    // 1. Criar checkout PagBank
    console.log('   💳 1. Criando checkout PagBank...')
    const checkout = await paymentService.createPagBankCheckout({
      planId: plan.name.toLowerCase(),
      name: plan.name,
      price: plan.price
    }, {
      name: customer.name,
      email: customer.email,
      cpf: customer.cpf,
      phone: customer.phone
    })

    console.log('   ✅ Checkout criado!')
    console.log(`      ID: ${checkout.id || 'mock_id'}`)
    console.log(`      Valor: R$ ${plan.price.toFixed(2)}`)
    console.log('')

    // 2. Processar pagamento com cartão
    console.log('   🔄 2. Processando pagamento com cartão...')

    // Dados de cartão de teste (PagBank sandbox)
    const cardData = {
      number: '4111111111111111',
      expiryMonth: '12',
      expiryYear: '2026',
      cvv: '123',
      holderName: customer.name
    }

    const paymentResult = await paymentService.processPagBankCardPayment({
      planData: {
        name: plan.name,
        price: plan.price
      },
      customerData: {
        name: customer.name,
        email: customer.email,
        cpf: customer.cpf,
        phone: customer.phone
      },
      cardData: cardData,
      installments: 1
    })

    console.log('   ✅ Pagamento processado!')
    console.log(`      Status: ${paymentResult.status}`)
    console.log(`      Transaction ID: ${paymentResult.id}`)
    console.log('')

    return {
      success: true,
      plan: plan.name,
      customer: customer.name,
      amount: plan.price,
      transactionId: paymentResult.id,
      status: paymentResult.status
    }

  } catch (error) {
    console.log(`   ❌ Erro na compra: ${error.message}`)
    console.log('')

    return {
      success: false,
      plan: plan.name,
      customer: customer.name,
      error: error.message
    }
  }
}

async function runRealPlansTest() {
  const results = []

  console.log('📋 Iniciando testes de compras reais...\n')

  // Testar cada plano com diferentes clientes
  for (let i = 0; i < realPlans.length; i++) {
    const plan = realPlans[i]
    const customer = testCustomers[i % testCustomers.length]

    const result = await testRealPlanPurchase(plan, customer)
    results.push(result)

    // Pequena pausa entre testes para não sobrecarregar
    await new Promise(resolve => setTimeout(resolve, 2000))
  }

  // Resumo dos resultados
  console.log('================================================')
  console.log('📊 RESUMO DOS TESTES')
  console.log('================================================\n')

  const successful = results.filter(r => r.success)
  const failed = results.filter(r => !r.success)

  console.log(`✅ Compras bem-sucedidas: ${successful.length}`)
  successful.forEach(result => {
    console.log(`   ✓ ${result.plan} - ${result.customer} - R$ ${result.amount.toFixed(2)}`)
  })

  if (failed.length > 0) {
    console.log(`\n❌ Compras com falha: ${failed.length}`)
    failed.forEach(result => {
      console.log(`   ✗ ${result.plan} - ${result.customer} - Erro: ${result.error}`)
    })
  }

  console.log('\n================================================')
  console.log(`🏆 Taxa de sucesso: ${((successful.length / results.length) * 100).toFixed(1)}%`)
  console.log('================================================\n')

  if (successful.length === results.length) {
    console.log('🎉 Todos os testes passaram! O sistema está funcionando corretamente.')
  } else {
    console.log('⚠️ Alguns testes falharam. Verifique os logs acima para detalhes.')
  }
}

// Executar os testes
runRealPlansTest().catch(console.error)