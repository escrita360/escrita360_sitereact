/**
 * Script de teste para Assinaturas Recorrentes PagBank
 * Uso: node scripts/test-pagbank-subscriptions.js
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

console.log('🚀 Teste de Assinaturas Recorrentes PagBank\n')
console.log('================================================\n')

async function testSubscriptionsFlow() {
  try {
    // 1. Criar um plano de teste
    console.log('📋 1. Criando plano de teste...')
    const plan = await pagBankSubscriptionsService.createPlan({
      name: 'Plano Teste Básico',
      description: 'Plano de teste para Escrita360',
      amount: 29.90,
      intervalUnit: 'MONTH',
      intervalValue: 1
    })
    
    console.log('✅ Plano criado com sucesso!')
    console.log('   ID:', plan.id)
    console.log('   Nome:', plan.name)
    console.log('   Valor:', plan.amount.value / 100, 'BRL')
    console.log('')

    // 2. Criar um assinante de teste
    console.log('👤 2. Criando assinante de teste...')
    const subscriber = await pagBankSubscriptionsService.createSubscriber({
      name: 'João Silva Teste',
      email: 'joao.teste@escrita360.com.br',
      tax_id: '11144477735',
      phone: '11999999999'
    })

    console.log('✅ Assinante criado com sucesso!')
    console.log('   ID:', subscriber.id)
    console.log('   Nome:', subscriber.name)
    console.log('   Email:', subscriber.email)
    console.log('')

    // 3. Criar assinatura
    console.log('📝 3. Criando assinatura...')
    const subscription = await pagBankSubscriptionsService.createSubscription({
      planId: plan.id,
      customer: {
        id: subscriber.id
      },
      paymentMethod: 'BOLETO'
    })

    console.log('✅ Assinatura criada com sucesso!')
    console.log('   ID:', subscription.id)
    console.log('   Status:', subscription.status)
    console.log('   Plano:', subscription.plan?.id)
    console.log('')

    // 4. Listar assinaturas
    console.log('📊 4. Listando assinaturas...')
    const subscriptions = await pagBankSubscriptionsService.listSubscriptions()
    
    console.log('✅ Assinaturas encontradas:', subscriptions.subscriptions?.length || 0)
    console.log('')

    // 5. Consultar assinatura específica
    console.log('🔍 5. Consultando detalhes da assinatura...')
    const subscriptionDetails = await pagBankSubscriptionsService.getSubscription(subscription.id)
    
    console.log('✅ Detalhes obtidos!')
    console.log('   Status:', subscriptionDetails.status)
    console.log('   Data de criação:', subscriptionDetails.created_at)
    console.log('   Próxima cobrança:', subscriptionDetails.next_invoice_at)
    console.log('')

    console.log('================================================')
    console.log('✅ TESTE COMPLETO COM SUCESSO!')
    console.log('================================================\n')

    console.log('📝 Resumo:')
    console.log('   ✓ Plano criado:', plan.id)
    console.log('   ✓ Assinante criado:', subscriber.id)
    console.log('   ✓ Assinatura criada:', subscription.id)
    console.log('')

  } catch (error) {
    console.error('❌ Erro no teste:', error.message)
    console.error('   Detalhes:', error)
  }
}

async function testListPlans() {
  console.log('📋 Listando todos os planos...\n')
  
  try {
    const result = await pagBankSubscriptionsService.listPlans()
    
    if (result.plans && result.plans.length > 0) {
      console.log(`✅ ${result.plans.length} plano(s) encontrado(s):\n`)
      
      result.plans.forEach((plan, index) => {
        console.log(`${index + 1}. ${plan.name}`)
        console.log(`   ID: ${plan.id}`)
        console.log(`   Valor: R$ ${plan.amount.value / 100}`)
        console.log(`   Status: ${plan.status}`)
        console.log(`   Intervalo: ${plan.interval.value} ${plan.interval.unit}`)
        console.log('')
      })
    } else {
      console.log('ℹ️  Nenhum plano encontrado.')
    }
  } catch (error) {
    console.error('❌ Erro ao listar planos:', error.message)
  }
}

async function testListSubscriptions() {
  console.log('📝 Listando todas as assinaturas...\n')
  
  try {
    const result = await pagBankSubscriptionsService.listSubscriptions()
    
    if (result.subscriptions && result.subscriptions.length > 0) {
      console.log(`✅ ${result.subscriptions.length} assinatura(s) encontrada(s):\n`)
      
      result.subscriptions.forEach((sub, index) => {
        console.log(`${index + 1}. Assinatura ${sub.id}`)
        console.log(`   Status: ${sub.status}`)
        console.log(`   Plano: ${sub.plan?.name || sub.plan?.id}`)
        console.log(`   Cliente: ${sub.customer?.name || sub.customer?.id}`)
        console.log(`   Criada em: ${sub.created_at}`)
        console.log('')
      })
    } else {
      console.log('ℹ️  Nenhuma assinatura encontrada.')
    }
  } catch (error) {
    console.error('❌ Erro ao listar assinaturas:', error.message)
  }
}

// Processa argumentos da linha de comando
const args = process.argv.slice(2)
const command = args[0]

switch (command) {
  case 'plans':
    await testListPlans()
    break
  case 'subscriptions':
    await testListSubscriptions()
    break
  case 'full':
  default:
    await testSubscriptionsFlow()
    break
}
