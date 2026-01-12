/**
 * Teste simples de logs PagBank em produção
 * Executa: node scripts/test-logs-simple.js
 */

const loggerService = require('../server/app/services/pagbank_logger_service');

console.log('🔍 Iniciando teste de captura de logs PagBank Produção...\n');

async function runTests() {
    try {
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

        console.log('\n2️⃣ Simulando erro de integração...');
        const integrationError = new Error('Connection timeout to PagBank API');
        integrationError.code = 'ECONNRESET';
        loggerService.logIntegrationError(integrationError, {
            endpoint: 'https://api.pagseguro.com/orders',
            method: 'POST',
            attempt: 3,
            userId: 'user_123'
        });

        console.log('\n3️⃣ Simulando teste de conectividade...');
        loggerService.logConnectivityTest({
            success: false,
            endpoint: 'https://api.pagseguro.com/orders',
            responseTime: 30000,
            error: 'Request timeout after 30s'
        });

        console.log('\n4️⃣ Gerando relatório de integração...');
        const report = loggerService.generateIntegrationReport();

        console.log('\n5️⃣ Exportando logs para validação...');
        const exportFile = loggerService.exportLogsForValidation(7);

        console.log('\n✅ Teste completo! Arquivos gerados:');
        console.log('📁 Logs principais:', loggerService.logFile);
        console.log('📁 Logs JSON:', loggerService.jsonLogFile);
        console.log('📁 Exportação:', exportFile);

        // Mostrar últimos logs
        console.log('\n📋 Resumo dos últimos logs:');
        const logs = loggerService.getAllLogs();
        const recent = logs.transactions.slice(-3);
        recent.forEach((log, i) => {
            console.log(`   ${i+1}. [${log.timestamp}] ${log.type} - ${log.summary?.status || log.status || 'N/A'}`);
        });

    } catch (error) {
        console.error('❌ Erro durante os testes:', error.message);
        loggerService.logIntegrationError(error, { 
            test: 'production-logs-test',
            phase: 'execution'
        });
    }
}

runTests().then(() => {
    console.log('\n🎯 Testes de logging concluídos!');
    console.log('👀 Verifique os arquivos na pasta server/logs/');
});