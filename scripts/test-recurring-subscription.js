/**
 * Script de teste para Assinatura Recorrente PagBank
 * Testa a criação de assinatura recorrente com dados específicos de cartão
 * Uso: node scripts/test-recurring-subscription.js
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
const { pagBankSubscriptionsService } = await import('../src/services/pagbank-subscriptions.js')

console.log('🚀 Teste de Assinatura Recorrente PagBank\n')
console.log('================================================\n')

// Função para gerar CPF válido
function generateValidCPF() {
  const base = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
  let cpf = base;
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf[i]) * (10 - i);
  }
  let remainder = sum % 11;
  let digit1 = remainder < 2 ? 0 : 11 - remainder;
  cpf += digit1;
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf[i]) * (11 - i);
  }
  remainder = sum % 11;
  let digit2 = remainder < 2 ? 0 : 11 - remainder;
  cpf += digit2;
  return cpf;
}

// Dados do cartão fornecidos pelo usuário
const testCardData = {
  number: '5555666677778884',
  token: 'CARD_8286F604-2D44-4B30-A80D-0E749A555566',
  securityCode: '123',
  expiryDate: '12/2026'
}

// Dados do cliente de teste
const testCustomer = {
  name: 'João Silva Teste',
  email: 'joao.silva.teste@escrita360.com',
  cpf: generateValidCPF(), // CPF válido gerado dinamicamente
  phone: '11999999999'
}

// Plano de teste
const testPlan = {
  name: 'Plano Básico Mensal',
  amount: 49.90,
  intervalUnit: 'MONTH',
  intervalValue: 1
}

async function testRecurringSubscription() {
  try {
    console.log('📋 Dados do teste:')
    console.log(`   Cartão: **** **** **** ${testCardData.number.slice(-4)}`)
    console.log(`   Token: ${testCardData.token}`)
    console.log(`   CVV: ${testCardData.securityCode}`)
    console.log(`   Validade: ${testCardData.expiryDate}`)
    console.log(`   Cliente: ${testCustomer.name} (${testCustomer.email})`)
    console.log(`   Plano: ${testPlan.name} - R$ ${testPlan.amount.toFixed(2)}/mês`)
    console.log('')

    // 1. Criar um plano de teste
    console.log('📋 1. Criando plano de teste...')
    const plan = await pagBankSubscriptionsService.createPlan({
      name: testPlan.name,
      description: 'Plano de teste para assinatura recorrente',
      amount: testPlan.amount,
      intervalUnit: testPlan.intervalUnit,
      intervalValue: testPlan.intervalValue
    })

    console.log('✅ Plano criado com sucesso!')
    console.log('   ID:', plan.id)
    console.log('   Nome:', plan.name)
    console.log('   Valor:', plan.amount.value / 100, 'BRL')
    console.log('   Periodicidade:', plan.interval_value, plan.interval_unit)
    console.log('')

    // 2. Criar assinatura recorrente
    console.log('📝 2. Criando assinatura recorrente...')

    const subscriptionData = {
      planId: plan.id,
      customer: testCustomer,
      paymentMethod: 'CREDIT_CARD',
      cardToken: testCardData.token,
      cardSecurityCode: testCardData.securityCode,
      amount: testPlan.amount
    }

    console.log('   Dados da assinatura:')
    console.log(`   - Plano ID: ${subscriptionData.planId}`)
    console.log(`   - Método: ${subscriptionData.paymentMethod}`)
    console.log(`   - Token do cartão: ${subscriptionData.cardToken}`)
    console.log(`   - CVV: ${subscriptionData.cardSecurityCode}`)
    console.log(`   - Valor: R$ ${subscriptionData.amount.toFixed(2)}`)
    console.log('')

    const subscription = await pagBankSubscriptionsService.createSubscription(subscriptionData)

    console.log('✅ Assinatura criada com sucesso!')
    console.log('   ID:', subscription.id)
    console.log('   Status:', subscription.status)
    console.log('   Cliente:', subscription.customer?.name)
    console.log('   Plano:', subscription.plan?.name)
    console.log('   Valor:', subscription.amount?.value ? subscription.amount.value / 100 : 'N/A', 'BRL')
    console.log('   Próxima cobrança:', subscription.next_invoice_at)
    console.log('   Data de criação:', subscription.created_at)
    console.log('')

    // 3. Verificar status da assinatura
    console.log('🔍 3. Verificando detalhes da assinatura...')
    const subscriptionDetails = await pagBankSubscriptionsService.getSubscription(subscription.id)

    console.log('✅ Detalhes obtidos!')
    console.log('   Status atual:', subscriptionDetails.status)
    console.log('   Status do pagamento:', subscriptionDetails.payment_method?.[0]?.card?.status || 'N/A')
    console.log('   Última cobrança:', subscriptionDetails.last_invoice_at || 'Nenhuma ainda')
    console.log('   Próxima cobrança:', subscriptionDetails.next_invoice_at)
    console.log('')

    // 4. Listar assinaturas para confirmar
    console.log('📊 4. Listando assinaturas...')
    const subscriptions = await pagBankSubscriptionsService.listSubscriptions()

    console.log('✅ Assinaturas encontradas:', subscriptions.subscriptions?.length || 0)
    const ourSubscription = subscriptions.subscriptions?.find(sub => sub.id === subscription.id)
    if (ourSubscription) {
      console.log('   ✓ Nossa assinatura encontrada na lista')
      console.log('   Status na lista:', ourSubscription.status)
    }
    console.log('')

    console.log('================================================')
    console.log('✅ TESTE DE ASSINATURA RECORRENTE CONCLUÍDO!')
    console.log('================================================\n')

    console.log('📝 Resumo:')
    console.log('   ✓ Plano criado:', plan.id)
    console.log('   ✓ Assinatura criada:', subscription.id)
    console.log('   ✓ Status:', subscription.status)
    console.log('   ✓ Valor:', testPlan.amount.toFixed(2), 'BRL/mês')
    console.log('   ✓ Cartão tokenizado usado com sucesso')
    console.log('')

    return {
      success: true,
      planId: plan.id,
      subscriptionId: subscription.id,
      status: subscription.status,
      amount: testPlan.amount
    }

  } catch (error) {
    console.error('❌ Erro no teste de assinatura recorrente:', error.message)
    console.error('Stack trace:', error.stack)
    console.log('')

    return {
      success: false,
      error: error.message
    }
  }
}

// Executar o teste
testRecurringSubscription().catch(console.error)