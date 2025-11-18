/**
 * Script para testar a criação de assinatura via backend
 * Uso: node scripts/test-backend-subscription.js
 */

import dotenv from 'dotenv'

dotenv.config()

const API_URL = process.env.VITE_API_URL || 'http://localhost:5000/api'

console.log('🚀 Teste de Assinatura via Backend\n')
console.log('================================================\n')

// Dados do cartão (mesmos do teste anterior)
const testCardData = {
  number: '5555666677778884',
  expiryMonth: '12',
  expiryYear: '2026',
  cvv: '123',
  holderName: 'João Silva Teste'
}

// Dados do cliente
const testCustomer = {
  name: 'João Silva Teste',
  email: 'joao.silva.teste@escrita360.com',
  cpf: '12345678909',
  phone: {
    area_code: '11',
    number: '999999999'
  }
}

// Dados do plano
const testPlan = {
  name: 'Plano Básico Mensal',
  description: 'Plano de teste para assinatura recorrente',
  amount: 4990, // em centavos
  interval_unit: 'MONTH',
  interval_value: 1
}

async function testBackendSubscription() {
  try {
    console.log('📋 Dados do teste:')
    console.log(`   Cartão: **** **** **** 8884`)
    console.log(`   Cliente: ${testCustomer.name} (${testCustomer.email})`)
    console.log(`   Plano: ${testPlan.name} - R$ ${(testPlan.amount / 100).toFixed(2)}/mês`)
    console.log('')

    // Payload para o backend
    const payload = {
      plan_name: testPlan.name,
      plan_description: testPlan.description,
      amount: testPlan.amount,
      interval_unit: testPlan.interval_unit,
      interval_value: testPlan.interval_value,
      customer: testCustomer,
      payment_method: 'CREDIT_CARD',
      cardData: testCardData
    }

    console.log('📤 Enviando payload para backend...')
    console.log('URL:', `${API_URL}/payment/create-pagbank-subscription`)
    console.log('Payload:', JSON.stringify(payload, null, 2))
    console.log('')

    const response = await fetch(`${API_URL}/payment/create-pagbank-subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${result.error || JSON.stringify(result)}`)
    }

    console.log('✅ Resposta do backend:')
    console.log(JSON.stringify(result, null, 2))
    console.log('')

    if (result.demo_mode) {
      console.log('⚠️ Modo DEMO ativo - assinatura simulada')
      console.log('Instruções:', result.instructions)
    } else {
      console.log('✅ Assinatura criada com sucesso!')
      console.log('Plano ID:', result.plan?.id)
      console.log('Assinatura ID:', result.subscription?.id)
      console.log('Status:', result.subscription?.status)
    }

    console.log('')
    console.log('================================================')
    console.log('✅ TESTE CONCLUÍDO!')
    console.log('================================================\n')

    return result

  } catch (error) {
    console.error('❌ Erro no teste:', error.message)
    console.error('Stack trace:', error.stack)
    return { success: false, error: error.message }
  }
}

// Executar o teste
testBackendSubscription().catch(console.error)