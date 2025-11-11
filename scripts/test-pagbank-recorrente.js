/**
 * Script para testar Pagamentos Recorrentes (Assinaturas) do PagBank
 * Uso: node scripts/test-pagbank-recorrente.js
 */

import dotenv from 'dotenv'

// Carrega variáveis de ambiente
dotenv.config()

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

// Importa o serviço de assinaturas
const { pagBankSubscriptionsService } = await import('../src/services/pagbank-subscriptions.js')

console.log('🚀 Teste de Pagamentos Recorrentes PagBank\n')
console.log('='.repeat(60))
console.log('Configuração:')
console.log('Token:', process.env.VITE_PAGBANK_TOKEN ? '✅ Configurado' : '❌ Não configurado')
console.log('Ambiente:', process.env.VITE_PAGBANK_ENV || 'sandbox')
console.log('Email:', 'escrita360@gmail.com')
console.log('='.repeat(60) + '\n')

/**
 * Teste 1: Criar um Plano
 */
async function test1_CreatePlan() {
  console.log('📋 TESTE 1: Criar Plano de Assinatura')
  console.log('-'.repeat(60))
  
  try {
    // Criar payload manualmente para ter controle total
    const planPayload = {
      reference_id: `plan_${Date.now()}`,
      name: 'Plano Profissional Mensal',
      description: 'Plano Profissional da Escrita360 - Cobrança Mensal',
      amount: {
        value: 4990, // R$ 49,90 em centavos
        currency: 'BRL'
      },
      interval: {
        unit: 'MONTH',
        length: 1
      },
      payment_method: ['CREDIT_CARD', 'BOLETO'], // Aceita ambos os métodos
      editable: true
    }
    
    const plan = await pagBankSubscriptionsService.makeRequest('/plans', {
      method: 'POST',
      body: JSON.stringify(planPayload)
    })
    
    console.log('✅ Plano criado com sucesso!')
    console.log('ID do Plano:', plan.id)
    console.log('Nome:', plan.name)
    console.log('Valor:', `R$ ${(plan.amount.value / 100).toFixed(2)}`)
    console.log('Intervalo:', `${plan.interval.value} ${plan.interval.unit}`)
    console.log('\n')
    
    return plan
  } catch (error) {
    console.error('❌ Erro ao criar plano:', error.message)
    console.error('Detalhes:', error)
    return null
  }
}

/**
 * Teste 2: Listar Planos Existentes
 */
async function test2_ListPlans() {
  console.log('📋 TESTE 2: Listar Planos Existentes')
  console.log('-'.repeat(60))
  
  try {
    const result = await pagBankSubscriptionsService.listPlans({
      status: 'ACTIVE',
      limit: 10
    })
    
    console.log(`✅ Total de planos ativos: ${result.plans?.length || 0}`)
    
    if (result.plans && result.plans.length > 0) {
      console.log('\nPlanos encontrados:')
      result.plans.forEach((plan, index) => {
        console.log(`\n${index + 1}. ${plan.name}`)
        console.log(`   ID: ${plan.id}`)
        console.log(`   Valor: R$ ${(plan.amount.value / 100).toFixed(2)}`)
        console.log(`   Status: ${plan.status}`)
      })
      
      return result.plans[0] // Retorna o primeiro plano
    } else {
      console.log('Nenhum plano encontrado.')
      return null
    }
  } catch (error) {
    console.error('❌ Erro ao listar planos:', error.message)
    return null
  }
  
  console.log('\n')
}

/**
 * Teste 3: Criar um Assinante (Customer)
 */
async function test3_CreateCustomer() {
  console.log('👤 TESTE 3: Criar Assinante')
  console.log('-'.repeat(60))
  
  try {
    const customer = await pagBankSubscriptionsService.createSubscriber({
      name: 'João da Silva Teste',
      email: 'joao.teste@example.com', // Email diferente do vendedor
      tax_id: '11144477735', // CPF de teste válido
      phone: '11999999999'
    })
    
    console.log('✅ Assinante criado com sucesso!')
    console.log('ID do Assinante:', customer.id)
    console.log('Nome:', customer.name)
    console.log('Email:', customer.email)
    console.log('\n')
    
    return customer
  } catch (error) {
    console.error('❌ Erro ao criar assinante:', error.message)
    console.error('Detalhes:', error)
    return null
  }
}

/**
 * Teste 4: Criar uma Assinatura com Boleto
 */
async function test4_CreateSubscriptionBoleto(planId) {
  console.log('🔄 TESTE 4: Criar Assinatura com Boleto')
  console.log('-'.repeat(60))
  
  if (!planId) {
    console.log('⚠️  Pulando teste - Nenhum plano disponível')
    return null
  }
  
  try {
    const subscription = await pagBankSubscriptionsService.createSubscription({
      planId: planId,
      customer: {
        name: 'Maria Santos Teste',
        email: 'maria.teste@example.com', // Email diferente do vendedor
        cpf: '12345678909',
        phone: '11987654321'
      },
      paymentMethod: 'BOLETO'
    })
    
    console.log('✅ Assinatura criada com sucesso!')
    console.log('ID da Assinatura:', subscription.id)
    console.log('Status:', subscription.status)
    console.log('Plano:', subscription.plan.name)
    console.log('Método de Pagamento: Boleto')
    
    if (subscription.next_invoice_at) {
      console.log('Próxima cobrança:', new Date(subscription.next_invoice_at).toLocaleDateString('pt-BR'))
    }
    
    console.log('\n')
    return subscription
  } catch (error) {
    console.error('❌ Erro ao criar assinatura:', error.message)
    console.error('Detalhes:', error)
    return null
  }
}

/**
 * Teste 5: Listar Assinaturas
 */
async function test5_ListSubscriptions() {
  console.log('📋 TESTE 5: Listar Assinaturas')
  console.log('-'.repeat(60))
  
  try {
    const result = await pagBankSubscriptionsService.listSubscriptions({
      limit: 10
    })
    
    console.log(`✅ Total de assinaturas: ${result.subscriptions?.length || 0}`)
    
    if (result.subscriptions && result.subscriptions.length > 0) {
      console.log('\nAssinaturas encontradas:')
      result.subscriptions.forEach((sub, index) => {
        console.log(`\n${index + 1}. Assinatura ${sub.id}`)
        console.log(`   Status: ${sub.status}`)
        console.log(`   Plano: ${sub.plan.name}`)
        console.log(`   Cliente: ${sub.customer.name}`)
        console.log(`   Criada em: ${new Date(sub.created_at).toLocaleDateString('pt-BR')}`)
      })
    } else {
      console.log('Nenhuma assinatura encontrada.')
    }
    
    console.log('\n')
    return result.subscriptions
  } catch (error) {
    console.error('❌ Erro ao listar assinaturas:', error.message)
    return null
  }
}

/**
 * Teste 6: Consultar Detalhes de uma Assinatura
 */
async function test6_GetSubscription(subscriptionId) {
  if (!subscriptionId) {
    console.log('⚠️  Pulando TESTE 6 - Nenhuma assinatura disponível\n')
    return
  }
  
  console.log('🔍 TESTE 6: Consultar Detalhes da Assinatura')
  console.log('-'.repeat(60))
  
  try {
    const subscription = await pagBankSubscriptionsService.getSubscription(subscriptionId)
    
    console.log('✅ Assinatura encontrada!')
    console.log('ID:', subscription.id)
    console.log('Status:', subscription.status)
    console.log('Plano:', subscription.plan.name)
    console.log('Cliente:', subscription.customer.name)
    console.log('Email:', subscription.customer.email)
    console.log('Valor:', `R$ ${(subscription.amount.value / 100).toFixed(2)}`)
    
    if (subscription.next_invoice_at) {
      console.log('Próxima cobrança:', new Date(subscription.next_invoice_at).toLocaleDateString('pt-BR'))
    }
    
    console.log('\n')
  } catch (error) {
    console.error('❌ Erro ao consultar assinatura:', error.message)
  }
}

/**
 * Executar todos os testes
 */
async function runAllTests() {
  console.log('🎯 Iniciando bateria de testes completa...\n')
  
  try {
    // Teste 1: Criar plano
    const newPlan = await test1_CreatePlan()
    
    // Teste 2: Listar planos
    const existingPlans = await test2_ListPlans()
    const planToUse = newPlan || existingPlans
    
    // Teste 3: Criar cliente
    const customer = await test3_CreateCustomer()
    
    // Teste 4: Criar assinatura com boleto
    let subscription = null
    if (planToUse && planToUse.id) {
      subscription = await test4_CreateSubscriptionBoleto(planToUse.id)
    }
    
    // Teste 5: Listar assinaturas
    const subscriptions = await test5_ListSubscriptions()
    
    // Teste 6: Consultar detalhes de uma assinatura
    const subToCheck = subscription || (subscriptions && subscriptions[0])
    if (subToCheck) {
      await test6_GetSubscription(subToCheck.id)
    }
    
    console.log('='.repeat(60))
    console.log('✅ Bateria de testes concluída!')
    console.log('='.repeat(60))
    
  } catch (error) {
    console.error('\n❌ Erro crítico durante os testes:', error)
  }
}

// Executar testes
runAllTests().catch(console.error)
