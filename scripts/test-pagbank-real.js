/**
 * Script de Teste Real PagBank Sandbox
 * Gera arquivo de log com Request/Response
 * 
 * Execução: node scripts/test-pagbank-real.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Token do sandbox
const PAGBANK_TOKEN = 'e7160b77-a214-4b48-8c61-93732bc6241b2256143d4139951eb97603d812916bd6e65e-ed77-49cf-97a6-87b1bf6fe327';
const API_URL = 'https://sandbox.api.pagseguro.com';

// Armazenar logs
const logs = [];

function addLog(title, data) {
    logs.push({ title, data, timestamp: new Date().toISOString() });
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📋 ${title}`);
    console.log('='.repeat(60));
    console.log(JSON.stringify(data, null, 4));
}

/**
 * Fazer requisição à API
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
    
    const response = await fetch(url, options);
    const responseText = await response.text();
    
    let data;
    try {
        data = JSON.parse(responseText);
    } catch {
        data = { rawResponse: responseText };
    }
    
    return { status: response.status, ok: response.ok, data };
}


/**
 * Teste 1: Pagamento PIX
 */
async function testPixPayment() {
    const referenceId = `pix_${Date.now()}`;
    
    const request = {
        reference_id: referenceId,
        customer: {
            name: "Jose da Silva",
            email: "email@test.com",
            tax_id: "12345678909",
            phones: [{
                country: "55",
                area: "11",
                number: "999999999",
                type: "MOBILE"
            }]
        },
        items: [{
            reference_id: "plano_escrita360",
            name: "Plano Profissional - Escrita360",
            quantity: 1,
            unit_amount: 9900
        }],
        qr_codes: [{
            amount: {
                value: 9900
            },
            expiration_date: new Date(Date.now() + 60 * 60 * 1000).toISOString()
        }],
        notification_urls: [
            "https://escrita360.com/api/webhook/pagbank"
        ]
    };
    
    addLog('PIX - Request', request);
    
    const response = await makeRequest('/orders', 'POST', request);
    
    addLog('PIX - Response', response.data);
    
    return { request, response: response.data, success: response.ok };
}

/**
 * Teste 2: Pagamento Cartão de Crédito (sem criptografia - sandbox aceita)
 */
async function testCreditCardPayment() {
    const referenceId = `card_${Date.now()}`;
    const chargeRefId = `charge_${Date.now()}`;
    
    // Cartão de teste Visa que funciona no sandbox
    const request = {
        reference_id: referenceId,
        customer: {
            name: "Jose da Silva",
            email: "email@test.com",
            tax_id: "12345678909",
            phones: [{
                country: "55",
                area: "11",
                number: "999999999",
                type: "MOBILE"
            }]
        },
        items: [{
            reference_id: "plano_basico",
            name: "Plano Básico - Escrita360",
            quantity: 1,
            unit_amount: 2990
        }],
        shipping: {
            address: {
                street: "Avenida Brigadeiro Faria Lima",
                number: "1384",
                complement: "apto 12",
                locality: "Pinheiros",
                city: "São Paulo",
                region: "São Paulo",
                region_code: "SP",
                country: "BRA",
                postal_code: "01452002"
            }
        },
        notification_urls: [
            "https://escrita360.com/api/webhook/pagbank"
        ],
        charges: [{
            reference_id: chargeRefId,
            description: "Pagamento Plano Básico Escrita360",
            amount: {
                value: 2990,
                currency: "BRL"
            },
            payment_method: {
                type: "CREDIT_CARD",
                installments: 1,
                capture: true,
                card: {
                    number: "4111111111111111",
                    exp_month: "12",
                    exp_year: "2030",
                    security_code: "123",
                    holder: {
                        name: "Jose da Silva"
                    },
                    store: true
                }
            }
        }]
    };
    
    addLog('CREDIT_CARD - Request', request);
    
    const response = await makeRequest('/orders', 'POST', request);
    
    addLog('CREDIT_CARD - Response', response.data);
    
    return { request, response: response.data, success: response.ok };
}

/**
 * Teste 3: Pagamento Boleto
 */
async function testBoletoPayment() {
    const referenceId = `boleto_${Date.now()}`;
    const chargeRefId = `boleto_charge_${Date.now()}`;
    
    // Data de vencimento: 3 dias
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 3);
    const dueDateStr = dueDate.toISOString().split('T')[0];
    
    const request = {
        reference_id: referenceId,
        customer: {
            name: "Maria Santos",
            email: "maria@test.com",
            tax_id: "12345678909",
            phones: [{
                country: "55",
                area: "11",
                number: "999999999",
                type: "MOBILE"
            }]
        },
        items: [{
            reference_id: "plano_avancado",
            name: "Plano Avançado - Escrita360",
            quantity: 1,
            unit_amount: 4990
        }],
        notification_urls: [
            "https://escrita360.com/api/webhook/pagbank"
        ],
        charges: [{
            reference_id: chargeRefId,
            description: "Pagamento Plano Avançado Escrita360",
            amount: {
                value: 4990,
                currency: "BRL"
            },
            payment_method: {
                type: "BOLETO",
                boleto: {
                    due_date: dueDateStr,
                    instruction_lines: {
                        line_1: "Pagamento referente ao Plano Escrita360",
                        line_2: "Não receber após o vencimento"
                    },
                    holder: {
                        name: "Maria Santos",
                        tax_id: "12345678909",
                        email: "maria@test.com",
                        address: {
                            street: "Rua das Flores",
                            number: "100",
                            complement: "Sala 1",
                            locality: "Centro",
                            city: "São Paulo",
                            region: "São Paulo",
                            region_code: "SP",
                            country: "BRA",
                            postal_code: "01310100"
                        }
                    }
                }
            }
        }]
    };
    
    addLog('BOLETO - Request', request);
    
    const response = await makeRequest('/orders', 'POST', request);
    
    addLog('BOLETO - Response', response.data);
    
    return { request, response: response.data, success: response.ok };
}

/**
 * Gerar arquivo de log Markdown
 */
function generateLogFile(results) {
    const lines = [];
    
    lines.push('# 📋 Log de Testes PagBank Sandbox');
    lines.push('');
    lines.push(`**Data:** ${new Date().toLocaleString('pt-BR')}`);
    lines.push(`**Ambiente:** Sandbox`);
    lines.push(`**Base URL:** ${API_URL}`);
    lines.push('');
    lines.push('---');
    lines.push('');
    
    // Resumo de IDs
    lines.push('## 🆔 IDs Gerados');
    lines.push('');
    lines.push('| Tipo | ORDER_ID | CHARGE_ID | Status |');
    lines.push('|------|----------|-----------|--------|');
    
    results.forEach(r => {
        if (r && r.response) {
            const orderId = r.response.id || 'N/A';
            const chargeId = r.response.charges?.[0]?.id || r.response.qr_codes?.[0]?.id || 'N/A';
            const status = r.response.charges?.[0]?.status || (r.success ? 'CREATED' : 'FAILED');
            const tipo = r.tipo || 'N/A';
            lines.push(`| ${tipo} | \`${orderId}\` | \`${chargeId}\` | ${status} |`);
        }
    });
    
    lines.push('');
    lines.push('---');
    lines.push('');
    
    // Detalhes de cada teste
    results.forEach((r, index) => {
        if (r && r.request) {
            lines.push(`## ${index + 1}. ${r.tipo || 'Teste'}`);
            lines.push('');
            lines.push('### Request');
            lines.push('');
            lines.push('```json');
            lines.push(JSON.stringify(r.request, null, 4));
            lines.push('```');
            lines.push('');
            lines.push('### Response');
            lines.push('');
            lines.push('```json');
            lines.push(JSON.stringify(r.response, null, 4));
            lines.push('```');
            lines.push('');
            lines.push('---');
            lines.push('');
        }
    });
    
    lines.push('');
    lines.push('*Log gerado automaticamente pelo script test-pagbank-real.js*');
    
    return lines.join('\n');
}

/**
 * Executar todos os testes
 */
async function runTests() {
    console.log('\n' + '🚀'.repeat(30));
    console.log('\n🔥 TESTES REAIS PAGBANK SANDBOX\n');
    console.log('🚀'.repeat(30));
    
    const results = [];
    
    try {
        // Teste PIX
        console.log('\n\n💠 TESTE 1: PAGAMENTO PIX');
        const pixResult = await testPixPayment();
        if (pixResult) {
            pixResult.tipo = 'PIX';
            results.push(pixResult);
        }
        
        // Teste Cartão
        console.log('\n\n💳 TESTE 2: PAGAMENTO CARTÃO DE CRÉDITO');
        const cardResult = await testCreditCardPayment();
        if (cardResult) {
            cardResult.tipo = 'CREDIT_CARD';
            results.push(cardResult);
        }
        
        // Teste Boleto
        console.log('\n\n📄 TESTE 3: PAGAMENTO BOLETO');
        const boletoResult = await testBoletoPayment();
        if (boletoResult) {
            boletoResult.tipo = 'BOLETO';
            results.push(boletoResult);
        }
        
        // Gerar arquivo de log
        console.log('\n\n📝 GERANDO ARQUIVO DE LOG...');
        
        const logContent = generateLogFile(results);
        const logPath = path.join(__dirname, '..', 'docs', 'PAGBANK_LOG_TESTES.md');
        
        fs.writeFileSync(logPath, logContent, 'utf8');
        console.log(`\n✅ Log salvo em: ${logPath}`);
        
        // Resumo final
        console.log('\n' + '='.repeat(60));
        console.log('📊 RESUMO FINAL');
        console.log('='.repeat(60));
        
        results.forEach(r => {
            if (r && r.response) {
                const icon = r.success ? '✅' : '❌';
                const orderId = r.response.id || 'N/A';
                const chargeId = r.response.charges?.[0]?.id || r.response.qr_codes?.[0]?.id || 'N/A';
                console.log(`\n${icon} ${r.tipo}:`);
                console.log(`   ORDER_ID: ${orderId}`);
                console.log(`   CHARGE_ID: ${chargeId}`);
            }
        });
        
    } catch (error) {
        console.error('\n❌ ERRO:', error.message);
        console.error(error.stack);
    }
}

// Executar
runTests();
