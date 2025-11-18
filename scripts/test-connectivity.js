/**
 * Teste básico de conectividade com PagBank API
 */

import dotenv from 'dotenv'
dotenv.config()

async function testBasicConnectivity() {
  console.log('🔗 Testando conectividade básica com PagBank...\n')

  const token = process.env.VITE_PAGBANK_TOKEN
  console.log('Token:', token ? 'Configurado' : 'Não configurado')
  console.log('Token length:', token?.length)
  console.log('')

  // Teste 1: Endpoint público (não requer auth)
  console.log('1️⃣ Testando endpoint público...')
  try {
    const response = await fetch('https://sandbox.api.pagseguro.com/public-keys/card', {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })
    console.log('Status:', response.status)
    if (response.ok) {
      const data = await response.json()
      console.log('✅ Chave pública:', data.public_key || 'N/A')
    } else {
      console.log('❌ Erro:', response.statusText)
    }
  } catch (error) {
    console.log('❌ Erro de rede:', error.message)
  }
  console.log('')

  // Teste 2: Endpoint que requer auth
  console.log('2️⃣ Testando endpoint com autenticação...')
  try {
    const response = await fetch('https://sandbox.api.pagseguro.com/orders', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })
    console.log('Status:', response.status)
    if (response.ok) {
      const data = await response.json()
      console.log('✅ Pedidos encontrados:', data.length || 'N/A')
    } else {
      const errorText = await response.text()
      console.log('❌ Erro:', response.status, errorText)
    }
  } catch (error) {
    console.log('❌ Erro de rede:', error.message)
  }
  console.log('')

  // Teste 3: Verificar formato do token
  console.log('3️⃣ Verificando formato do token...')
  if (token) {
    console.log('Token starts with:', token.substring(0, 10) + '...')
    console.log('Token ends with:', '...' + token.substring(token.length - 10))
    console.log('Contains spaces:', token.includes(' '))
    console.log('Contains newlines:', token.includes('\n') || token.includes('\r'))
  }
}

testBasicConnectivity()