/**
 * Sandbox PagBank - Ambiente de Testes Completo
 * 
 * Este arquivo implementa um sandbox completo para testes de pagamento
 * com PagBank, incluindo simulações de diferentes cenários de pagamento.
 * 
 * Documentação: https://dev.pagbank.uol.com.br/
 * API Reference: https://sandbox.api.pagseguro.com/
 */

import { pagBankService } from './pagbank.js'
import { chavePublicaService } from './chavepublica.js'

// Dados de teste para sandbox
const SANDBOX_DATA = {
  // Cartões de teste para diferentes cenários
  testCards: {
    approved: {
      number: '4111111111111111',
      security_code: '123',
      exp_month: '12',
      exp_year: '2030',
      holder: { name: 'Jose da Silva' }
    },
    declined: {
      number: '4000000000000002',
      security_code: '123',
      exp_month: '12',
      exp_year: '2030',
      holder: { name: 'Maria Santos' }
    },
    insufficientFunds: {
      number: '4000000000000341',
      security_code: '123',
      exp_month: '12',
      exp_year: '2030',
      holder: { name: 'João Oliveira' }
    }
  },

  // Cliente de teste
  testCustomer: {
    name: 'João Silva de Teste',
    email: 'teste@sandbox.pagbank.com',
    tax_id: '11144477735', // CPF de teste válido
    phone: '+5511999999999',
    address: {
      street: 'Rua das Flores',
      number: '123',
      complement: 'Apto 45',
      locality: 'Centro',
      city: 'São Paulo',
      region: 'SP',
      region_code: 'SP',
      country: 'BRA',
      postal_code: '01310-100'
    }
  },

  // Produtos de teste
  testProducts: [
    {
      name: 'Escrita360 - Plano Básico',
      quantity: 1,
      unit_amount: 2900 // R$ 29,00 em centavos
    },
    {
      name: 'Escrita360 - Plano Profissional',
      quantity: 1,
      unit_amount: 4900 // R$ 49,00 em centavos
    },
    {
      name: 'Escrita360 - Plano Empresarial',
      quantity: 1,
      unit_amount: 9900 // R$ 99,00 em centavos
    }
  ]
}

class PagBankSandbox {
  constructor() {
    // Suporte para Node.js (scripts) e Vite (frontend)
    const isNode = typeof process !== 'undefined' && process.env
    const env = isNode ? process.env : import.meta.env
    
    this.isTestMode = env.VITE_PAGBANK_ENV === 'sandbox'
    this.logs = []
  }

  /**
   * Adiciona log para debugging
   */
  log(message, type = 'info', data = null) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      type,
      message,
      data
    }
    this.logs.push(logEntry)
    console.log(`[PagBank Sandbox ${type.toUpperCase()}]`, message, data || '')
  }

  /**
   * Testa a configuração do PagBank
   */
  async testConfiguration() {
    this.log('Iniciando teste de configuração...')
    
    try {
      // Suporte para Node.js (scripts) e Vite (frontend)
      const isNode = typeof process !== 'undefined' && process.env
      const env = isNode ? process.env : import.meta.env
      
      // Verifica se as variáveis de ambiente estão configuradas
      const envVars = {
        token: env.VITE_PAGBANK_TOKEN,
        environment: env.VITE_PAGBANK_ENV,
        clientId: env.VITE_PAGBANK_CLIENT_ID
      }

      this.log('Variáveis de ambiente:', 'info', envVars)

      if (!envVars.token) {
        throw new Error('Token PagBank não configurado')
      }

      // Testa obtenção da chave pública
      await chavePublicaService.getPublicKey()
      this.log('Chave pública obtida com sucesso', 'success')

      return { success: true, message: 'Configuração válida' }
    } catch (error) {
      this.log('Erro na configuração', 'error', error.message)
      return { success: false, error: error.message }
    }
  }

  /**
   * Testa criação de cliente
   */
  async testCreateCustomer() {
    this.log('Testando criação de cliente...')
    
    try {
      const customer = await pagBankService.createCustomer(SANDBOX_DATA.testCustomer)
      this.log('Cliente criado com sucesso', 'success', customer)
      return customer
    } catch (error) {
      this.log('Erro ao criar cliente', 'error', error.message)
      throw error
    }
  }

  /**
   * Testa pagamento com cartão de crédito
   */
  async testCreditCardPayment(scenario = 'approved') {
    this.log(`Testando pagamento com cartão - cenário: ${scenario}`)
    
    try {
      const cardData = SANDBOX_DATA.testCards[scenario]
      if (!cardData) {
        throw new Error(`Cenário de teste '${scenario}' não encontrado`)
      }

      // Cria o cliente
      const customer = await this.testCreateCustomer()
      
      // Para testes em Node.js, usar dados diretos do cartão
      const isNode = typeof process !== 'undefined' && process.env;
      let encryptedCard;
      
      if (isNode) {
        // Em Node.js, usar dados diretos (não criptografados)
        encryptedCard = {
          number: cardData.number,
          exp_month: cardData.exp_month || cardData.expiryMonth,
          exp_year: cardData.exp_year || cardData.expiryYear,
          security_code: cardData.security_code || cardData.cvv,
          holder: {
            name: cardData.holder.name
          }
        };
      } else {
        // No browser, criptografar normalmente
        encryptedCard = await chavePublicaService.encryptCardData(cardData);
      }
      this.log('Dados do cartão criptografados', 'info')

      // Cria o pagamento
      const paymentData = {
        reference_id: `test_${Date.now()}`,
        customer: {
          name: customer.name,
          email: customer.email,
          tax_id: customer.tax_id,
          phone: customer.phone
        },
        items: SANDBOX_DATA.testProducts.slice(0, 1), // Usa apenas o primeiro produto
        charges: [{
          reference_id: `charge_${Date.now()}`,
          description: 'Pagamento teste Escrita360',
          amount: {
            value: SANDBOX_DATA.testProducts[0].unit_amount,
            currency: 'BRL'
          },
          payment_method: {
            type: 'CREDIT_CARD',
            installments: 1,
            capture: true,
            card: encryptedCard
          }
        }]
      }

      const payment = await pagBankService.createOrder(paymentData)
      this.log('Pagamento criado com sucesso', 'success', payment)
      
      return payment
    } catch (error) {
      this.log('Erro no pagamento', 'error', error.message)
      throw error
    }
  }

  /**
   * Testa pagamento PIX
   */
  async testPixPayment() {
    this.log('Testando pagamento PIX...')
    
    try {
      const customer = await this.testCreateCustomer()
      
      const pixData = {
        reference_id: `pix_test_${Date.now()}`,
        customer: {
          name: customer.name,
          email: customer.email,
          tax_id: customer.tax_id,
          phone: customer.phone
        },
        items: SANDBOX_DATA.testProducts.slice(0, 1),
        charges: [{
          reference_id: `pix_charge_${Date.now()}`,
          description: 'Pagamento PIX teste Escrita360',
          amount: {
            value: SANDBOX_DATA.testProducts[0].unit_amount,
            currency: 'BRL'
          },
          payment_method: {
            type: 'PIX',
            pix: {
              expiration_date: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutos
            }
          }
        }]
      }

      const payment = await pagBankService.createOrder(pixData)
      this.log('Pagamento PIX criado com sucesso', 'success', payment)
      
      return payment
    } catch (error) {
      this.log('Erro no pagamento PIX', 'error', error.message)
      throw error
    }
  }

  /**
   * Testa pagamento por boleto
   */
  async testBoletoPayment() {
    this.log('Testando pagamento por boleto...')
    
    try {
      const customer = await this.testCreateCustomer()
      
      const boletoData = {
        reference_id: `boleto_test_${Date.now()}`,
        customer: {
          name: customer.name,
          email: customer.email,
          tax_id: customer.tax_id,
          phone: customer.phone
        },
        items: SANDBOX_DATA.testProducts.slice(0, 1),
        charges: [{
          reference_id: `boleto_charge_${Date.now()}`,
          description: 'Pagamento Boleto teste Escrita360',
          amount: {
            value: SANDBOX_DATA.testProducts[0].unit_amount,
            currency: 'BRL'
          },
          payment_method: {
            type: 'BOLETO',
            boleto: {
              due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 dias
              instruction_lines: {
                line_1: 'Pagamento referente ao plano Escrita360',
                line_2: 'Não receber após o vencimento'
              }
            }
          }
        }]
      }

      const payment = await pagBankService.createOrder(boletoData)
      this.log('Pagamento por boleto criado com sucesso', 'success', payment)
      
      return payment
    } catch (error) {
      this.log('Erro no pagamento por boleto', 'error', error.message)
      throw error
    }
  }

  /**
   * Executa todos os testes do sandbox
   */
  async runAllTests() {
    this.log('=== INICIANDO TESTE COMPLETO DO SANDBOX PAGBANK ===')
    
    const results = {
      configuration: null,
      creditCardApproved: null,
      creditCardDeclined: null,
      pix: null,
      boleto: null,
      errors: []
    }

    try {
      // Teste de configuração
      results.configuration = await this.testConfiguration()
      
      if (!results.configuration.success) {
        throw new Error('Configuração inválida - parando testes')
      }

      // Teste de cartão aprovado
      try {
        results.creditCardApproved = await this.testCreditCardPayment('approved')
      } catch (error) {
        results.errors.push({ test: 'creditCardApproved', error: error.message })
      }

      // Teste de cartão negado
      try {
        results.creditCardDeclined = await this.testCreditCardPayment('declined')
      } catch (error) {
        results.errors.push({ test: 'creditCardDeclined', error: error.message })
      }

      // Teste PIX
      try {
        results.pix = await this.testPixPayment()
      } catch (error) {
        results.errors.push({ test: 'pix', error: error.message })
      }

      // Teste Boleto
      try {
        results.boleto = await this.testBoletoPayment()
      } catch (error) {
        results.errors.push({ test: 'boleto', error: error.message })
      }

    } catch (error) {
      results.errors.push({ test: 'general', error: error.message })
    }

    this.log('=== TESTES CONCLUÍDOS ===')
    this.log('Resultados completos:', 'info', results)
    
    return {
      results,
      logs: this.logs
    }
  }

  /**
   * Simula webhook de pagamento
   */
  simulateWebhook(paymentId, status = 'PAID') {
    const webhook = {
      id: `webhook_${Date.now()}`,
      created_date: new Date().toISOString(),
      reference_id: paymentId,
      charges: [{
        id: `charge_${Date.now()}`,
        reference_id: paymentId,
        status: status,
        amount: {
          value: 2900,
          currency: 'BRL'
        },
        payment_method: {
          type: 'CREDIT_CARD'
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }]
    }

    this.log('Webhook simulado', 'info', webhook)
    return webhook
  }

  /**
   * Obtém logs do sandbox
   */
  getLogs() {
    return this.logs
  }

  /**
   * Limpa logs do sandbox
   */
  clearLogs() {
    this.logs = []
  }
}

export const pagBankSandbox = new PagBankSandbox()
export default pagBankSandbox