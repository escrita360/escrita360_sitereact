/**
 * Script para testar captura de logs de integração PagBank em produção
 * Executa: node scripts/test-production-logs.js
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

const loggerService = require(join(__dirname, '../server/app/services/pagbank_logger_service'));

console.log('🔍 Iniciando teste de captura de logs PagBank Produção...\n');

// Simular diferentes tipos de logs para verificação
async function runProductionLogTests() {
    console.log('1️⃣ Simulando transação PIX bem-sucedida...');
    loggerService.logTransaction('PIX', 
        {
            url: 'https://api.pagseguro.com/orders',
            method: 'POST',
            headers: { Authorization: 'Bearer TOKEN_REAL' },
            body: {
                reference_id: 'TEST_PIX_001',
                customer: { name: 'João Silva', email: 'joao@email.com' },
                qr_codes: [{ amount: { value: 5000 } }]
            }
        },
        {
            data: {
                id: 'ORDE_12345678',
                reference_id: 'TEST_PIX_001',
                qr_codes: [{ 
                    id: 'QRCO_87654321',
                    amount: { value: 5000 },
                    text: 'pix://qrcode...'
                }]
            }
        },
        'production'
    );

    await sleep(1000);

    console.log('2️⃣ Simulando transação cartão com erro...');
    loggerService.logTransaction('CREDIT_CARD',
        {
            url: 'https://api.pagseguro.com/orders',
            method: 'POST',
            headers: { Authorization: 'Bearer TOKEN_REAL' },
            body: {
                reference_id: 'TEST_CARD_002',
                customer: { name: 'Maria Santos' },
                charges: [{ 
                    amount: { value: 10000 },
                    payment_method: { 
                        type: 'CREDIT_CARD',
                        card: { encrypted: 'ENCRYPTED_DATA' }
                    }
                }]
            }
        },
        {
            data: {
                error_messages: [
                    { 
                        code: '40001',
                        description: 'Invalid card number' 
                    }
                ]
            },
            status: 400
        },
        'production'
    );

    await sleep(1000);

    console.log('3️⃣ Simulando erro de integração...');
    const integrationError = new Error('Connection timeout to PagBank API');
    integrationError.code = 'ECONNRESET';
    loggerService.logIntegrationError(integrationError, {
        endpoint: 'https://api.pagseguro.com/orders',
        method: 'POST',
        attempt: 3,
        userId: 'user_123'
    });

    await sleep(1000);

    console.log('4️⃣ Simulando teste de conectividade...');
    loggerService.logConnectivityTest({
        success: false,
        endpoint: 'https://api.pagseguro.com/orders',
        responseTime: 30000,
        error: 'Request timeout after 30s'
    });

    await sleep(1000);

    console.log('5️⃣ Simulando webhook recebido...');
    loggerService.logWebhook(
        {
            'content-type': 'application/json',
            'x-pagseguro-signature': 'signature123'
        },
        {
            id: 'ORDE_12345678',
            reference_id: 'TEST_PIX_001',
            charges: [{
                id: 'CHAR_87654321',
                status: 'PAID',
                amount: { value: 5000 }
            }]
        }
    );

    await sleep(1000);

    console.log('6️⃣ Gerando relatório de integração...');
    const report = loggerService.generateIntegrationReport();

    console.log('7️⃣ Exportando logs para validação...');
    const exportFile = loggerService.exportLogsForValidation(7);

    console.log('\n✅ Teste completo! Arquivos gerados:');
    console.log('📁 Logs principais:', loggerService.logFile);
    console.log('📁 Logs JSON:', loggerService.jsonLogFile);
    console.log('📁 Exportação:', exportFile);

    return { report, exportFile };
}

// Teste de conectividade real (opcional)
async function testRealConnectivity() {
    console.log('\n🌐 Testando conectividade real com PagBank...');
    
    const startTime = Date.now();
    try {
        const response = await fetch('https://api.pagseguro.com/orders', {
            method: 'OPTIONS',
            timeout: 10000
        });
        
        const endTime = Date.now();
        loggerService.logConnectivityTest({
            success: true,
            endpoint: 'https://api.pagseguro.com/orders',
            responseTime: endTime - startTime,
            status: response.status
        });
    } catch (error) {
        const endTime = Date.now();
        loggerService.logConnectivityTest({
            success: false,
            endpoint: 'https://api.pagseguro.com/orders',
            responseTime: endTime - startTime,
            error: error.message
        });
    }
}

// Função auxiliar para aguardar
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Executar testes
if (import.meta.url === `file://${process.argv[1]}`) {
    runProductionLogTests()
        .then(() => testRealConnectivity())
        .then(() => {
            console.log('\n🎯 Todos os testes de logging concluídos!');
            console.log('👀 Verifique os arquivos de log gerados para validação.');
        })
        .catch(error => {
            console.error('❌ Erro durante os testes:', error);
            loggerService.logIntegrationError(error, { 
                test: 'production-logs-test',
                phase: 'execution'
            });
        });
}

export { runProductionLogTests, testRealConnectivity };