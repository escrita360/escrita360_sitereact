// Teste do serviço de assinatura de contratos
// node test-contract-signatures.js

import { contractSignatureService } from './src/services/firebase.js'

async function testContractSignatures() {
  console.log('🧪 Iniciando testes do serviço de assinatura de contratos...')
  console.log('=' .repeat(60))

  try {
    // Teste 1: Registrar assinatura de contrato
    console.log('\n🧪 Teste 1: Registrando assinatura de contrato...')
    
    const testUserId = 'test_user_' + Date.now()
    const contractData = {
      userName: 'USER_NAME',
      userEmail: 'user@example.com',
      userCpf: 'CPF_NUMBER',
      userPhone: 'PHONE_NUMBER',
      contractType: 'terms_and_conditions',
      contractVersion: '1.0',
      signatureContext: 'payment_process',
      planType: 'alunos',
      planId: 'plan_individual',
      ipAddress: '192.168.1.1',
      metadata: {
        transactionId: 'test_tx_123',
        paymentMethod: 'card',
        planName: 'Individual',
        planPrice: 29.90,
        timestamp: new Date().toISOString()
      }
    }

    const signatureResult = await contractSignatureService.registerContractAcceptance(
      testUserId,
      contractData,
      'alunos'
    )

    if (signatureResult.success) {
      console.log('✅ Assinatura de contrato registrada com sucesso!')
      console.log('ID:', signatureResult.signatureId)
      console.log('Dados:', JSON.stringify(signatureResult.signature, null, 2))
    } else {
      console.log('❌ Erro ao registrar assinatura de contrato')
    }

    // Teste 2: Buscar assinaturas do usuário
    console.log('\n🧪 Teste 2: Buscando assinaturas do usuário...')
    
    const userSignatures = await contractSignatureService.getUserContractSignatures(
      testUserId,
      'alunos'
    )

    console.log(`✅ Encontradas ${userSignatures.length} assinatura(s) para o usuário`)
    userSignatures.forEach((signature, index) => {
      console.log(`\nAssinatura ${index + 1}:`)
      console.log(`- ID: ${signature.id}`)
      console.log(`- Tipo: ${signature.contractType}`)
      console.log(`- Status: ${signature.status}`)
      console.log(`- Contexto: ${signature.signatureContext}`)
      console.log(`- Data: ${signature.acceptedAt ? signature.acceptedAt.toDate() : 'N/A'}`)
    })

    // Teste 3: Verificar se usuário aceitou termos
    console.log('\n🧪 Teste 3: Verificando aceitação de termos...')
    
    const hasAccepted = await contractSignatureService.hasAcceptedContract(
      testUserId,
      'terms_and_conditions',
      'alunos'
    )

    console.log(`✅ Usuário aceitou os termos: ${hasAccepted ? 'SIM' : 'NÃO'}`)

    // Teste 4: Atualizar status da assinatura
    if (signatureResult.signatureId) {
      console.log('\n🧪 Teste 4: Atualizando status da assinatura...')
      
      const updateResult = await contractSignatureService.updateSignatureStatus(
        signatureResult.signatureId,
        'revoked',
        'alunos'
      )

      if (updateResult.success) {
        console.log('✅ Status da assinatura atualizado com sucesso!')
      } else {
        console.log('❌ Erro ao atualizar status da assinatura')
      }
    }

    console.log('\n' + '='.repeat(60))
    console.log('✅ Todos os testes do serviço de assinatura de contratos concluídos!')

  } catch (error) {
    console.error('❌ Erro durante os testes:', error)
    console.error('Stack:', error.stack)
  }
}

// Função principal
async function main() {
  console.log('🚀 Iniciando testes do sistema de assinatura de contratos')
  console.log('Data/Hora:', new Date().toLocaleString('pt-BR'))
  console.log('')

  try {
    await testContractSignatures()
  } catch (error) {
    console.error('❌ Erro geral:', error)
  }

  console.log('\n📋 Como usar o sistema de assinatura de contratos:')
  console.log('1. No pagamento: assinatura é registrada automaticamente quando user aceita termos')
  console.log('2. No formulário de contato: assinatura registrada quando user marca checkbox dos termos')
  console.log('3. Para visualizar: acesse /contract-signatures (página de admin)')
  console.log('4. Dados são armazenados em Firebase Firestore na coleção "contract_signatures"')
  console.log('')
  console.log('🔧 Configurações importantes:')
  console.log('- Assinaturas são separadas por projeto (alunos vs professores)')
  console.log('- Cada assinatura tem timestamp, IP, user agent e metadata')
  console.log('- Status pode ser: accepted, revoked, expired')
  console.log('- Tipos suportados: terms_and_conditions, privacy_policy, service_agreement')
  console.log('')
  console.log('🎯 Teste concluído!')
}

// Executar se for chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export default testContractSignatures