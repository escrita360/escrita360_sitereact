/**
 * Script para consultar informações reais do PagBank
 * Lista pedidos, pagamentos, clientes e outras informações da API
 */

import dotenv from 'dotenv'
dotenv.config()

// Simula o ambiente do Vite
Object.defineProperty(globalThis, 'import', {
  value: {
    meta: {
      env: process.env
    }
  },
  writable: true,
  configurable: true
})

const { pagBankService } = await import('../src/services/pagbank.js')

async function consultarInformacoesPagBank() {
  console.log('🔍 Consultando informações reais do PagBank...\n')
  console.log('================================================\n')

  try {
    // 1. Verificar conectividade e configuração
    console.log('1️⃣ Verificando configuração e conectividade...\n')

    console.log('Ambiente:', pagBankService.environment)
    console.log('Token configurado:', pagBankService.token ? '✅ Sim' : '❌ Não')
    console.log('Base URL:', pagBankService.config.paymentsUrl)
    console.log('')

    // 2. Testar conectividade básica
    console.log('2️⃣ Testando conectividade básica...\n')
    try {
      // Tentar fazer uma requisição simples para verificar se o token funciona
      const testResponse = await fetch('https://sandbox.api.pagseguro.com/orders', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${pagBankService.token}`,
          'Accept': 'application/json'
        }
      })
      console.log('✅ Conectividade OK - Status:', testResponse.status)
      if (testResponse.status === 200) {
        const testData = await testResponse.json()
        console.log('Dados de teste recebidos:', testData.length || 'OK')
      } else {
        console.log('Status não-200, mas conectividade funciona')
      }
    } catch (error) {
      console.log('❌ Erro de conectividade:', error.message)
    }
    console.log('')

    // 3. Consultar pedidos específicos que sabemos que existem
    console.log('3️⃣ Consultando pedidos específicos...\n')

    // IDs de pedidos que vimos nos testes anteriores
    const knownOrderIds = [
      'ORDE_4829A1AE-6A8A-4E92-8631-EC7908CAD094' // Do teste de cartão que funcionou
    ]

    for (const orderId of knownOrderIds) {
      try {
        console.log(`Consultando pedido: ${orderId}`)
        const orderDetails = await pagBankService.getOrderStatus(orderId)
        console.log('✅ Pedido encontrado:')
        console.log(`   ID: ${orderDetails.id}`)
        console.log(`   Referência: ${orderDetails.reference_id}`)
        console.log(`   Cliente: ${orderDetails.customer?.name} (${orderDetails.customer?.email})`)
        console.log(`   Valor: R$ ${(orderDetails.charges?.[0]?.amount?.value / 100)?.toFixed(2)}`)
        console.log(`   Status: ${orderDetails.charges?.[0]?.status}`)
        console.log(`   Método: ${orderDetails.charges?.[0]?.payment_method?.type}`)
        console.log(`   Data: ${new Date(orderDetails.created_at).toLocaleString('pt-BR')}`)
        console.log('')
      } catch (error) {
        console.log(`❌ Erro ao consultar pedido ${orderId}:`, error.message)
      }
    }

    // 4. Tentar listar pedidos com paginação
    console.log('4️⃣ Tentando listar pedidos com paginação...\n')
    try {
      // Tentar com paginação limitada
      const response = await fetch('https://sandbox.api.pagseguro.com/orders?page=1&size=10', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${pagBankService.token}`,
          'Accept': 'application/json'
        }
      })

      console.log('Status da listagem paginada:', response.status)
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Pedidos encontrados:', data.length || 'N/A')
        if (data.length > 0) {
          console.log('\n📋 Primeiros pedidos:')
          data.slice(0, 3).forEach((order, index) => {
            console.log(`${index + 1}. ${order.id} - ${order.customer?.name} - R$ ${(order.charges?.[0]?.amount?.value / 100)?.toFixed(2)}`)
          })
        }
      } else {
        const errorText = await response.text()
        console.log('Erro na paginação:', errorText)
      }
    } catch (error) {
      console.log('❌ Erro na paginação:', error.message)
    }
    console.log('')

    // 5. Consultar um pedido específico se houver algum
    if (process.argv[2]) {
      console.log(`5️⃣ Consultando pedido específico: ${process.argv[2]}\n`)
      try {
        const orderDetails = await pagBankService.getOrderStatus(process.argv[2])
        console.log('✅ Detalhes do pedido:')
        console.log(JSON.stringify(orderDetails, null, 2))
      } catch (error) {
        console.log('❌ Erro ao consultar pedido:', error.message)
      }
    }

    // 6. Testar API de assinaturas se disponível
    console.log('6️⃣ Testando API de assinaturas...\n')
    try {
      const subscriptionsResponse = await fetch('https://sandbox.api.pagseguro.com/subscriptions', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${pagBankService.token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })

      console.log('Status API de assinaturas:', subscriptionsResponse.status)

      if (subscriptionsResponse.status === 200) {
        const subscriptions = await subscriptionsResponse.json()
        console.log('✅ Assinaturas encontradas:', subscriptions.length || 'N/A')
        if (subscriptions.length > 0) {
          console.log('\n📋 Primeiras assinaturas:')
          subscriptions.slice(0, 3).forEach((sub, index) => {
            console.log(`${index + 1}. ID: ${sub.id}, Status: ${sub.status}, Plano: ${sub.plan?.name}`)
          })
        }
      }
    } catch (error) {
      console.log('❌ Erro na API de assinaturas:', error.message)
    }

    console.log('\n================================================')
    console.log('✅ Consulta concluída!')
    console.log('================================================\n')

  } catch (error) {
    console.error('\n❌ Erro geral na consulta:', error.message)
    console.error('Stack:', error.stack)
  }
}

// Executar consulta
consultarInformacoesPagBank()