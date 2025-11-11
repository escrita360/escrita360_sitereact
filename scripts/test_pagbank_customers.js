/**
 * Script de exemplo para testar as APIs de clientes do PagBank
 * Uso: node scripts/test_pagbank_customers.js
 */

import { pagBankService } from '../src/services/pagbank.js'

// Exemplo de dados para criar um cliente
const customerData = {
  name: 'João Silva',
  email: 'joao.silva@example.com',
  tax_id: '12345678901', // CPF
  phone: '11987654321'
}

// Função para testar criação de cliente
async function testCreateCustomer() {
  try {
    console.log('Criando cliente...')
    const result = await pagBankService.createCustomer(customerData)
    console.log('Cliente criado com sucesso:', result)
    return result.id
  } catch (error) {
    console.error('Erro ao criar cliente:', error.message)
  }
}

// Função para testar consulta de cliente
async function testGetCustomer(customerId) {
  try {
    console.log(`Consultando cliente ${customerId}...`)
    const result = await pagBankService.getCustomer(customerId)
    console.log('Dados do cliente:', result)
  } catch (error) {
    console.error('Erro ao consultar cliente:', error.message)
  }
}

// Execução do teste
async function runTests() {
  console.log('Iniciando testes das APIs de clientes PagBank...\n')

  // Criar cliente
  const customerId = await testCreateCustomer()

  if (customerId) {
    console.log('\n---\n')
    // Consultar cliente criado
    await testGetCustomer(customerId)
  }

  console.log('\nTestes concluídos.')
}

// Executar apenas se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests()
}

export { testCreateCustomer, testGetCustomer }