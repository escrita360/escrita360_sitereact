import dotenv from 'dotenv'
dotenv.config()

async function testAPI() {
  console.log('🔍 Testando API PagBank diretamente...\n')

  const token = process.env.VITE_PAGBANK_TOKEN
  console.log('Token configurado:', token ? 'Sim' : 'Não')

  try {
    // Testa a API de assinaturas que pode estar ativa
    console.log('\nTestando API de assinaturas...')
    const subsResponse = await fetch('https://sandbox.api.pagseguro.com/subscriptions', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })

    console.log('Status subscriptions:', subsResponse.status)

    if (subsResponse.status === 200) {
      const subsData = await subsResponse.json()
      console.log('Dados subscriptions:', subsData)
    } else {
      const subsText = await subsResponse.text()
      console.log('Erro subscriptions:', subsText)
    }

    // Testa a API de public keys que funcionou antes
    console.log('\nTestando API de public keys...')
    const keysResponse = await fetch('https://sandbox.api.pagseguro.com/public-keys/card', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })

    console.log('Status public keys:', keysResponse.status)

    if (keysResponse.status === 200) {
      const keysData = await keysResponse.json()
      console.log('Chave pública:', keysData)
    }

  } catch (error) {
    console.error('Erro geral:', error.message)
  }
}

testAPI()