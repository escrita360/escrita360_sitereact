/**
 * Script de Validação do PagBank Sandbox
 * 
 * Este script faz requisições REAIS ao ambiente sandbox do PagBank
 * para validar a integração e gerar ORDER_ID e CHARGE_ID reais.
 * 
 * Execução: node scripts/validate-pagbank-sandbox.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Token do sandbox (conforme .env.easypanel)
const PAGBANK_TOKEN = 'e7160b77-a214-4b48-8c61-93732bc6241b2256143d4139951eb97603d812916bd6e65e-ed77-49cf-97a6-87b1bf6fe327';
const API_URL = 'https://sandbox.api.pagseguro.com';

// Armazenar resultados
const results = {
    timestamp: new Date().toISOString(),
    environment: 'sandbox',
    baseUrl: API_URL,
    tests: []
};

/**
 * Função auxiliar para fazer requisições
 */
async function makeRequest(endpoint, method = 'GET', body = null) {
    const url = `${API_URL}${endpoint}`;
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${PAGBANK_TOKEN}`,
            'Accept': 'application/json'
        }
    };
    
    if (body) {
        options.body = JSON.stringify(body);
    }
    
    console.log(`\n🔗 ${method} ${url}`);
    if (body) {
        console.log('📦 Payload:', JSON.stringify(body, null, 2));
    }
    
    const response = await fetch(url, options);
    const responseText = await response.text();
    
    let data;
    try {
        data = JSON.parse(responseText);
    } catch {
        data = { rawResponse: responseText };
    }
    
    console.log(`📡 Status: ${response.status}`);
    
    return {
        status: response.status,
        ok: response.ok,
        data
    };
}

/**
 * Teste 1: Obter chave pública
 */
async function testPublicKeys() {
    console.log('\n' + '='.repeat(60));
    console.log('📋 TESTE 1: Obter Chave Pública');
    console.log('='.repeat(60));
    
    const result = {
        test: 'public_keys',
        endpoint: '/public-keys',
        method: 'POST',
        timestamp: new Date().toISOString()
    };
    
    try {
        const payload = {
            type: 'card'
        };
        
        const response = await makeRequest('/public-keys', 'POST', payload);
        
        result.status = response.status;
        result.success = response.ok;
        result.response = response.data;
        
        if (response.ok) {
            console.log('✅ Chave pública obtida com sucesso!');
            result.public_key = response.data.public_key?.substring(0, 50) + '...';
            result.created_at = response.data.created_at;
        } else {
            console.log('❌ Erro ao obter chave pública');
        }
    } catch (error) {
        result.success = false;
        result.error = error.message;
        console.log('❌ Erro:', error.message);
    }
    
    results.tests.push(result);
    return result;
}

/**
 * Teste 2: Criar cliente
 */
async function testCreateCustomer() {
    console.log('\n' + '='.repeat(60));
    console.log('👤 TESTE 2: Criar Cliente');
    console.log('='.repeat(60));
    
    const result = {
        test: 'create_customer',
        endpoint: '/customers',
        method: 'POST',
        timestamp: new Date().toISOString()
    };
    
    try {
        const payload = {
            reference_id: `customer_${Date.now()}`,
            name: 'Cliente Teste Escrita360',
            email: `cliente.teste.${Date.now()}@escrita360.com`,
            tax_id: '12345678909',
            phones: [{
                country: '55',
                area: '11',
                number: '999999999',
                type: 'MOBILE'
            }]
        };
        
        const response = await makeRequest('/customers', 'POST', payload);
        
        result.status = response.status;
        result.success = response.ok;
        result.response = response.data;
        
        if (response.ok) {
            console.log('✅ Cliente criado com sucesso!');
            result.customer_id = response.data.id;
            console.log('🆔 Customer ID:', response.data.id);
        } else {
            console.log('❌ Erro ao criar cliente');
        }
    } catch (error) {
        result.success = false;
        result.error = error.message;
        console.log('❌ Erro:', error.message);
    }
    
    results.tests.push(result);
    return result;
}

/**
 * Teste 3: Criar pedido com PIX
 */
async function testPixPayment() {
    console.log('\n' + '='.repeat(60));
    console.log('💠 TESTE 3: Criar Pedido PIX');
    console.log('='.repeat(60));
    
    const result = {
        test: 'pix_payment',
        endpoint: '/orders',
        method: 'POST',
        payment_type: 'PIX',
        timestamp: new Date().toISOString()
    };
    
    try {
        const referenceId = `escrita360_pix_${Date.now()}`;
        const payload = {
            reference_id: referenceId,
            customer: {
                name: 'Cliente PIX Escrita360',
                email: `pix.teste.${Date.now()}@escrita360.com`,
                tax_id: '12345678909',
                phones: [{
                    country: '55',
                    area: '11',
                    number: '999999999',
                    type: 'MOBILE'
                }]
            },
            items: [{
                reference_id: 'plano_profissional',
                name: 'Plano Profissional - Escrita360',
                quantity: 1,
                unit_amount: 9900 // R$ 99,00 em centavos
            }],
            qr_codes: [{
                amount: {
                    value: 9900
                },
                expiration_date: new Date(Date.now() + 120 * 60 * 1000).toISOString() // 2 horas
            }],
            notification_urls: [
                'https://webhook.site/escrita360-pix-webhook'
            ]
        };
        
        const response = await makeRequest('/orders', 'POST', payload);
        
        result.status = response.status;
        result.success = response.ok;
        result.response = response.data;
        result.reference_id = referenceId;
        
        if (response.ok) {
            console.log('✅ Pedido PIX criado com sucesso!');
            result.order_id = response.data.id;
            console.log('🆔 ORDER_ID:', response.data.id);
            
            if (response.data.qr_codes && response.data.qr_codes.length > 0) {
                const qrCode = response.data.qr_codes[0];
                result.qr_code_id = qrCode.id;
                result.qr_code_text = qrCode.text;
                result.expiration_date = qrCode.expiration_date;
                console.log('📱 QR Code ID:', qrCode.id);
                console.log('⏰ Expira em:', qrCode.expiration_date);
            }
        } else {
            console.log('❌ Erro ao criar pedido PIX');
            console.log('📋 Detalhes:', JSON.stringify(response.data, null, 2));
        }
    } catch (error) {
        result.success = false;
        result.error = error.message;
        console.log('❌ Erro:', error.message);
    }
    
    results.tests.push(result);
    return result;
}

/**
 * Teste 4: Criar pedido com Cartão de Crédito
 */
async function testCreditCardPayment() {
    console.log('\n' + '='.repeat(60));
    console.log('💳 TESTE 4: Criar Pedido com Cartão de Crédito');
    console.log('='.repeat(60));
    
    const result = {
        test: 'credit_card_payment',
        endpoint: '/orders',
        method: 'POST',
        payment_type: 'CREDIT_CARD',
        timestamp: new Date().toISOString()
    };
    
    try {
        const referenceId = `escrita360_card_${Date.now()}`;
        const chargeRefId = `charge_${Date.now()}`;
        
        const payload = {
            reference_id: referenceId,
            customer: {
                name: 'Jose da Silva',
                email: `card.teste.${Date.now()}@escrita360.com`,
                tax_id: '12345678909',
                phones: [{
                    country: '55',
                    area: '11',
                    number: '999999999',
                    type: 'MOBILE'
                }]
            },
            items: [{
                reference_id: 'plano_basico',
                name: 'Plano Básico - Escrita360',
                quantity: 1,
                unit_amount: 2990 // R$ 29,90 em centavos
            }],
            charges: [{
                reference_id: chargeRefId,
                description: 'Pagamento Plano Básico Escrita360',
                amount: {
                    value: 2990,
                    currency: 'BRL'
                },
                payment_method: {
                    type: 'CREDIT_CARD',
                    installments: 1,
                    capture: true,
                    card: {
                        number: '4111111111111111', // Cartão de teste VISA
                        exp_month: '12',
                        exp_year: '2030',
                        security_code: '123',
                        holder: {
                            name: 'Jose da Silva'
                        }
                    }
                }
            }],
            notification_urls: [
                'https://webhook.site/escrita360-card-webhook'
            ]
        };
        
        const response = await makeRequest('/orders', 'POST', payload);
        
        result.status = response.status;
        result.success = response.ok;
        result.response = response.data;
        result.reference_id = referenceId;
        result.charge_reference_id = chargeRefId;
        
        if (response.ok) {
            console.log('✅ Pedido com cartão criado com sucesso!');
            result.order_id = response.data.id;
            console.log('🆔 ORDER_ID:', response.data.id);
            
            if (response.data.charges && response.data.charges.length > 0) {
                const charge = response.data.charges[0];
                result.charge_id = charge.id;
                result.charge_status = charge.status;
                console.log('🆔 CHARGE_ID:', charge.id);
                console.log('📊 Status:', charge.status);
            }
        } else {
            console.log('❌ Erro ao criar pedido com cartão');
            console.log('📋 Detalhes:', JSON.stringify(response.data, null, 2));
        }
    } catch (error) {
        result.success = false;
        result.error = error.message;
        console.log('❌ Erro:', error.message);
    }
    
    results.tests.push(result);
    return result;
}

/**
 * Teste 5: Criar pedido com Boleto
 */
async function testBoletoPayment() {
    console.log('\n' + '='.repeat(60));
    console.log('📄 TESTE 5: Criar Pedido com Boleto');
    console.log('='.repeat(60));
    
    const result = {
        test: 'boleto_payment',
        endpoint: '/orders',
        method: 'POST',
        payment_type: 'BOLETO',
        timestamp: new Date().toISOString()
    };
    
    try {
        const referenceId = `escrita360_boleto_${Date.now()}`;
        const chargeRefId = `boleto_charge_${Date.now()}`;
        
        // Data de vencimento: 3 dias a partir de hoje
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 3);
        const dueDateStr = dueDate.toISOString().split('T')[0];
        
        const payload = {
            reference_id: referenceId,
            customer: {
                name: 'Maria Santos',
                email: `boleto.teste.${Date.now()}@escrita360.com`,
                tax_id: '12345678909',
                phones: [{
                    country: '55',
                    area: '11',
                    number: '999999999',
                    type: 'MOBILE'
                }]
            },
            items: [{
                reference_id: 'plano_avancado',
                name: 'Plano Avançado - Escrita360',
                quantity: 1,
                unit_amount: 4990 // R$ 49,90 em centavos
            }],
            charges: [{
                reference_id: chargeRefId,
                description: 'Pagamento Plano Avançado Escrita360',
                amount: {
                    value: 4990,
                    currency: 'BRL'
                },
                payment_method: {
                    type: 'BOLETO',
                    boleto: {
                        due_date: dueDateStr,
                        instruction_lines: {
                            line_1: 'Pagamento do Plano Escrita360',
                            line_2: 'Não receber após o vencimento'
                        },
                        holder: {
                            name: 'Maria Santos',
                            tax_id: '12345678909',
                            email: 'maria.santos@escrita360.com',
                            address: {
                                street: 'Rua das Flores',
                                number: '100',
                                locality: 'Centro',
                                city: 'São Paulo',
                                region: 'São Paulo',
                                region_code: 'SP',
                                country: 'BRA',
                                postal_code: '01310100'
                            }
                        }
                    }
                }
            }],
            notification_urls: [
                'https://webhook.site/escrita360-boleto-webhook'
            ]
        };
        
        const response = await makeRequest('/orders', 'POST', payload);
        
        result.status = response.status;
        result.success = response.ok;
        result.response = response.data;
        result.reference_id = referenceId;
        result.charge_reference_id = chargeRefId;
        
        if (response.ok) {
            console.log('✅ Boleto gerado com sucesso!');
            result.order_id = response.data.id;
            console.log('🆔 ORDER_ID:', response.data.id);
            
            if (response.data.charges && response.data.charges.length > 0) {
                const charge = response.data.charges[0];
                result.charge_id = charge.id;
                result.charge_status = charge.status;
                result.boleto_barcode = charge.payment_method?.boleto?.barcode;
                result.boleto_url = charge.links?.find(l => l.rel === 'self')?.href;
                console.log('🆔 CHARGE_ID:', charge.id);
                console.log('📊 Status:', charge.status);
                if (charge.payment_method?.boleto?.barcode) {
                    console.log('📊 Código de Barras:', charge.payment_method.boleto.barcode);
                }
            }
        } else {
            console.log('❌ Erro ao gerar boleto');
            console.log('📋 Detalhes:', JSON.stringify(response.data, null, 2));
        }
    } catch (error) {
        result.success = false;
        result.error = error.message;
        console.log('❌ Erro:', error.message);
    }
    
    results.tests.push(result);
    return result;
}

/**
 * Teste 6: Consultar pedido
 */
async function testGetOrder(orderId) {
    if (!orderId) {
        console.log('⚠️ ORDER_ID não disponível para consulta');
        return null;
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('🔍 TESTE 6: Consultar Pedido');
    console.log('='.repeat(60));
    
    const result = {
        test: 'get_order',
        endpoint: `/orders/${orderId}`,
        method: 'GET',
        timestamp: new Date().toISOString()
    };
    
    try {
        const response = await makeRequest(`/orders/${orderId}`, 'GET');
        
        result.status = response.status;
        result.success = response.ok;
        result.response = response.data;
        result.order_id = orderId;
        
        if (response.ok) {
            console.log('✅ Pedido consultado com sucesso!');
            console.log('📊 Status:', response.data.charges?.[0]?.status || 'N/A');
        } else {
            console.log('❌ Erro ao consultar pedido');
        }
    } catch (error) {
        result.success = false;
        result.error = error.message;
        console.log('❌ Erro:', error.message);
    }
    
    results.tests.push(result);
    return result;
}

/**
 * Gera relatório Markdown
 */
function generateMarkdownReport() {
    const report = [];
    
    report.push('# 📋 Relatório de Validação - PagBank Sandbox');
    report.push('');
    report.push(`**Data de Execução:** ${new Date().toLocaleString('pt-BR')}`);
    report.push(`**Ambiente:** ${results.environment}`);
    report.push(`**Base URL:** ${results.baseUrl}`);
    report.push('');
    report.push('---');
    report.push('');
    
    // Resumo
    const successCount = results.tests.filter(t => t.success).length;
    const totalCount = results.tests.length;
    
    report.push('## 📊 Resumo');
    report.push('');
    report.push(`| Testes Executados | Sucesso | Falha |`);
    report.push(`|-------------------|---------|-------|`);
    report.push(`| ${totalCount} | ${successCount} ✅ | ${totalCount - successCount} ❌ |`);
    report.push('');
    report.push('---');
    report.push('');
    
    // IDs Gerados
    report.push('## 🆔 IDs Reais Gerados no Sandbox');
    report.push('');
    
    const ordersTable = results.tests.filter(t => t.order_id);
    if (ordersTable.length > 0) {
        report.push('### ORDER_IDs');
        report.push('');
        report.push('| Tipo | ORDER_ID | CHARGE_ID | Reference ID | Status |');
        report.push('|------|----------|-----------|--------------|--------|');
        
        ordersTable.forEach(t => {
            const tipo = t.payment_type || t.test;
            const orderId = t.order_id || 'N/A';
            const chargeId = t.charge_id || t.qr_code_id || 'N/A';
            const refId = t.reference_id || 'N/A';
            const status = t.charge_status || (t.success ? 'CREATED' : 'FAILED');
            report.push(`| ${tipo} | \`${orderId}\` | \`${chargeId}\` | \`${refId}\` | ${status} |`);
        });
        report.push('');
    }
    
    // Clientes
    const customerTest = results.tests.find(t => t.customer_id);
    if (customerTest) {
        report.push('### CUSTOMER_IDs');
        report.push('');
        report.push(`| Customer ID |`);
        report.push(`|-------------|`);
        report.push(`| \`${customerTest.customer_id}\` |`);
        report.push('');
    }
    
    report.push('---');
    report.push('');
    
    // Detalhes dos testes
    report.push('## 🧪 Detalhes dos Testes');
    report.push('');
    
    results.tests.forEach((test, index) => {
        const icon = test.success ? '✅' : '❌';
        report.push(`### ${index + 1}. ${icon} ${test.test.toUpperCase()}`);
        report.push('');
        report.push(`- **Endpoint:** \`${test.method} ${test.endpoint}\``);
        report.push(`- **Status HTTP:** ${test.status}`);
        report.push(`- **Timestamp:** ${test.timestamp}`);
        
        if (test.order_id) {
            report.push(`- **ORDER_ID:** \`${test.order_id}\``);
        }
        if (test.charge_id) {
            report.push(`- **CHARGE_ID:** \`${test.charge_id}\``);
        }
        if (test.customer_id) {
            report.push(`- **CUSTOMER_ID:** \`${test.customer_id}\``);
        }
        if (test.qr_code_id) {
            report.push(`- **QR_CODE_ID:** \`${test.qr_code_id}\``);
        }
        if (test.qr_code_text) {
            report.push(`- **PIX Copia e Cola:** \`${test.qr_code_text.substring(0, 50)}...\``);
        }
        if (test.error) {
            report.push(`- **Erro:** ${test.error}`);
        }
        
        report.push('');
        report.push('<details>');
        report.push('<summary>📋 Resposta Completa (JSON)</summary>');
        report.push('');
        report.push('```json');
        report.push(JSON.stringify(test.response, null, 2));
        report.push('```');
        report.push('</details>');
        report.push('');
    });
    
    report.push('---');
    report.push('');
    
    // APIs Documentadas
    report.push('## 📚 APIs de Pagamento Implementadas');
    report.push('');
    report.push('### 1. API de Orders (Pedidos)');
    report.push('');
    report.push('| Método | Endpoint | Descrição |');
    report.push('|--------|----------|-----------|');
    report.push('| POST | `/orders` | Criar pedido (PIX, Cartão, Boleto) |');
    report.push('| GET | `/orders/{order_id}` | Consultar pedido |');
    report.push('');
    report.push('### 2. API de Charges (Cobranças)');
    report.push('');
    report.push('| Método | Endpoint | Descrição |');
    report.push('|--------|----------|-----------|');
    report.push('| POST | `/charges/{charge_id}/cancel` | Cancelar/Estornar cobrança |');
    report.push('| POST | `/charges/{charge_id}/capture` | Capturar cobrança pré-autorizada |');
    report.push('');
    report.push('### 3. API de Customers (Clientes)');
    report.push('');
    report.push('| Método | Endpoint | Descrição |');
    report.push('|--------|----------|-----------|');
    report.push('| POST | `/customers` | Criar cliente |');
    report.push('| GET | `/customers/{customer_id}` | Consultar cliente |');
    report.push('');
    report.push('### 4. API de Public Keys (Chaves Públicas)');
    report.push('');
    report.push('| Método | Endpoint | Descrição |');
    report.push('|--------|----------|-----------|');
    report.push('| POST | `/public-keys` | Obter chave pública para criptografia |');
    report.push('');
    report.push('### 5. API de Subscriptions (Assinaturas)');
    report.push('');
    report.push('| Método | Endpoint | Descrição |');
    report.push('|--------|----------|-----------|');
    report.push('| POST | `/subscriptions` | Criar assinatura |');
    report.push('| GET | `/subscriptions/{subscription_id}` | Consultar assinatura |');
    report.push('| POST | `/subscriptions/{subscription_id}/cancel` | Cancelar assinatura |');
    report.push('| POST | `/plans` | Criar plano de assinatura |');
    report.push('| GET | `/plans` | Listar planos |');
    report.push('');
    report.push('---');
    report.push('');
    
    // URLs do ambiente
    report.push('## 🔗 URLs do Ambiente');
    report.push('');
    report.push('### Sandbox');
    report.push('```');
    report.push('Pagamentos: https://sandbox.api.pagseguro.com');
    report.push('Assinaturas: https://sandbox.api.assinaturas.pagseguro.com');
    report.push('```');
    report.push('');
    report.push('### Produção');
    report.push('```');
    report.push('Pagamentos: https://api.pagseguro.com');
    report.push('Assinaturas: https://api.assinaturas.pagseguro.com');
    report.push('```');
    report.push('');
    report.push('---');
    report.push('');
    
    // Cartões de teste
    report.push('## 💳 Cartões de Teste (Sandbox)');
    report.push('');
    report.push('| Cenário | Número | CVV | Validade |');
    report.push('|---------|--------|-----|----------|');
    report.push('| Aprovado | 4111111111111111 | 123 | 12/2030 |');
    report.push('| Recusado | 4000000000000002 | 123 | 12/2030 |');
    report.push('| Erro processamento | 4000000000000036 | 123 | 12/2030 |');
    report.push('');
    report.push('---');
    report.push('');
    report.push('*Relatório gerado automaticamente pelo script de validação.*');
    
    return report.join('\n');
}

/**
 * Executa todos os testes
 */
async function runAllTests() {
    console.log('\n' + '🚀'.repeat(30));
    console.log('\n🔥 INICIANDO VALIDAÇÃO DO PAGBANK SANDBOX\n');
    console.log('🚀'.repeat(30));
    
    try {
        // Executar testes
        await testPublicKeys();
        await testCreateCustomer();
        const pixResult = await testPixPayment();
        const cardResult = await testCreditCardPayment();
        await testBoletoPayment();
        
        // Consultar um pedido se houver
        if (pixResult?.order_id) {
            await testGetOrder(pixResult.order_id);
        } else if (cardResult?.order_id) {
            await testGetOrder(cardResult.order_id);
        }
        
        // Gerar relatório
        console.log('\n' + '='.repeat(60));
        console.log('📄 GERANDO RELATÓRIO');
        console.log('='.repeat(60));
        
        const markdownReport = generateMarkdownReport();
        const reportPath = path.join(__dirname, '..', 'docs', 'PAGBANK_SANDBOX_VALIDATION.md');
        
        fs.writeFileSync(reportPath, markdownReport, 'utf8');
        console.log(`\n✅ Relatório salvo em: ${reportPath}`);
        
        // Também salvar JSON com resultados brutos
        const jsonPath = path.join(__dirname, '..', 'docs', 'pagbank-sandbox-results.json');
        fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2), 'utf8');
        console.log(`✅ Resultados JSON salvos em: ${jsonPath}`);
        
        // Resumo final
        const successCount = results.tests.filter(t => t.success).length;
        const totalCount = results.tests.length;
        
        console.log('\n' + '='.repeat(60));
        console.log('📊 RESUMO FINAL');
        console.log('='.repeat(60));
        console.log(`\nTestes executados: ${totalCount}`);
        console.log(`Sucesso: ${successCount} ✅`);
        console.log(`Falha: ${totalCount - successCount} ❌`);
        
        // Listar IDs gerados
        console.log('\n🆔 IDs GERADOS:');
        results.tests.forEach(t => {
            if (t.order_id) {
                console.log(`   ORDER_ID (${t.payment_type || t.test}): ${t.order_id}`);
            }
            if (t.charge_id) {
                console.log(`   CHARGE_ID: ${t.charge_id}`);
            }
            if (t.customer_id) {
                console.log(`   CUSTOMER_ID: ${t.customer_id}`);
            }
        });
        
    } catch (error) {
        console.error('\n❌ ERRO FATAL:', error.message);
        console.error(error.stack);
    }
}

// Executar
runAllTests();
