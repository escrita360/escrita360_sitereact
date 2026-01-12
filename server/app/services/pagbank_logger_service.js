const fs = require('fs');
const path = require('path');

/**
 * Serviço de Logging para transações PagBank
 * Salva logs detalhados em arquivo para validação com o PagBank
 */
class PagBankLoggerService {
    constructor() {
        this.logsDir = path.join(__dirname, '../../logs');
        this.logFile = path.join(this.logsDir, 'pagbank_production.log');
        this.jsonLogFile = path.join(this.logsDir, 'pagbank_transactions.json');
        
        // Criar diretório de logs se não existir
        if (!fs.existsSync(this.logsDir)) {
            fs.mkdirSync(this.logsDir, { recursive: true });
            console.log('📁 Diretório de logs criado:', this.logsDir);
        }
        
        // Inicializar arquivo JSON se não existir
        if (!fs.existsSync(this.jsonLogFile)) {
            fs.writeFileSync(this.jsonLogFile, JSON.stringify({ transactions: [] }, null, 2));
        }
    }

    /**
     * Registra uma transação completa (request + response)
     */
    logTransaction(type, request, response, environment = 'production') {
        const timestamp = new Date().toISOString();
        const logEntry = {
            id: `LOG_${Date.now()}`,
            timestamp,
            environment: environment.toUpperCase(),
            type, // PIX, CREDIT_CARD, BOLETO, WEBHOOK
            request: this.sanitizeRequest(request),
            response: this.sanitizeResponse(response),
            summary: this.extractSummary(type, response)
        };

        // Log no console
        this.logToConsole(logEntry);
        
        // Salvar em arquivo texto formatado
        this.appendToTextLog(logEntry);
        
        // Salvar em arquivo JSON
        this.appendToJsonLog(logEntry);

        return logEntry;
    }

    /**
     * Registra apenas o request (antes de enviar)
     */
    logRequest(type, request, environment = 'production') {
        const timestamp = new Date().toISOString();
        console.log('\n' + '='.repeat(60));
        console.log(`🔴 [${environment.toUpperCase()}] PAGBANK ${type} REQUEST`);
        console.log(`📅 ${timestamp}`);
        console.log('='.repeat(60));
        console.log('📤 ENDPOINT:', request.url || request.endpoint);
        console.log('📤 METHOD:', request.method || 'POST');
        console.log('📤 PAYLOAD:');
        console.log(JSON.stringify(this.sanitizeRequest(request), null, 2));
        console.log('='.repeat(60) + '\n');
    }

    /**
     * Registra apenas o response (após receber)
     */
    logResponse(type, response, environment = 'production') {
        const timestamp = new Date().toISOString();
        console.log('\n' + '='.repeat(60));
        console.log(`🔴 [${environment.toUpperCase()}] PAGBANK ${type} RESPONSE`);
        console.log(`📅 ${timestamp}`);
        console.log('='.repeat(60));
        console.log('📥 STATUS:', response.status || 'N/A');
        console.log('📥 DATA:');
        console.log(JSON.stringify(response.data || response, null, 2));
        console.log('='.repeat(60) + '\n');
    }

    /**
     * Registra webhook recebido
     */
    logWebhook(headers, body) {
        const logEntry = {
            id: `WEBHOOK_${Date.now()}`,
            timestamp: new Date().toISOString(),
            type: 'WEBHOOK',
            headers: this.sanitizeHeaders(headers),
            body: body
        };

        this.logToConsole(logEntry);
        this.appendToTextLog(logEntry);
        this.appendToJsonLog(logEntry);

        return logEntry;
    }

    /**
     * Remove dados sensíveis do request
     */
    sanitizeRequest(request) {
        const sanitized = JSON.parse(JSON.stringify(request));
        
        // Remover token de autorização
        if (sanitized.headers?.Authorization) {
            sanitized.headers.Authorization = '[REDACTED]';
        }
        
        // Manter dados do cartão criptografados (já estão seguros)
        // mas remover dados em texto plano se existirem
        if (sanitized.body?.charges?.[0]?.payment_method?.card) {
            const card = sanitized.body.charges[0].payment_method.card;
            if (card.number) card.number = card.number.slice(0, 6) + '******' + card.number.slice(-4);
            if (card.security_code) card.security_code = '***';
        }

        return sanitized;
    }

    /**
     * Sanitiza response (geralmente não tem dados sensíveis)
     */
    sanitizeResponse(response) {
        if (!response) return null;
        return response.data || response;
    }

    /**
     * Sanitiza headers removendo tokens
     */
    sanitizeHeaders(headers) {
        const sanitized = { ...headers };
        if (sanitized.authorization) sanitized.authorization = '[REDACTED]';
        if (sanitized.Authorization) sanitized.Authorization = '[REDACTED]';
        return sanitized;
    }

    /**
     * Extrai resumo da transação
     */
    extractSummary(type, response) {
        const data = response?.data || response;
        if (!data) return null;

        return {
            order_id: data.id,
            reference_id: data.reference_id,
            status: data.charges?.[0]?.status || data.qr_codes?.[0]?.id ? 'CREATED' : 'UNKNOWN',
            charge_id: data.charges?.[0]?.id || data.qr_codes?.[0]?.id,
            amount: data.charges?.[0]?.amount?.value || data.qr_codes?.[0]?.amount?.value,
            payment_code: data.charges?.[0]?.payment_response?.code,
            payment_message: data.charges?.[0]?.payment_response?.message
        };
    }

    /**
     * Log formatado no console
     */
    logToConsole(logEntry) {
        const divider = '='.repeat(70);
        console.log('\n' + divider);
        console.log('🔴 PAGBANK PRODUCTION LOG');
        console.log(divider);
        console.log(`📅 Timestamp: ${logEntry.timestamp}`);
        console.log(`🏷️  Tipo: ${logEntry.type}`);
        console.log(`🌍 Ambiente: ${logEntry.environment}`);
        
        if (logEntry.summary) {
            console.log('\n📊 RESUMO:');
            console.log(`   ORDER_ID: ${logEntry.summary.order_id || 'N/A'}`);
            console.log(`   CHARGE_ID: ${logEntry.summary.charge_id || 'N/A'}`);
            console.log(`   STATUS: ${logEntry.summary.status || 'N/A'}`);
            console.log(`   VALOR: ${logEntry.summary.amount ? (logEntry.summary.amount / 100).toFixed(2) : 'N/A'}`);
            if (logEntry.summary.payment_code) {
                console.log(`   CÓDIGO: ${logEntry.summary.payment_code}`);
                console.log(`   MENSAGEM: ${logEntry.summary.payment_message}`);
            }
        }
        
        console.log('\n📤 REQUEST:');
        console.log(JSON.stringify(logEntry.request, null, 2));
        
        console.log('\n📥 RESPONSE:');
        console.log(JSON.stringify(logEntry.response, null, 2));
        
        console.log(divider);
        console.log(`💾 Log salvo em: ${this.logFile}`);
        console.log(divider + '\n');
    }

    /**
     * Append ao arquivo de log texto
     */
    appendToTextLog(logEntry) {
        const divider = '='.repeat(70);
        const textLog = `
${divider}
🔴 TRANSAÇÃO PRODUÇÃO - PAGBANK
${divider}
ID LOG: ${logEntry.id}
TIPO: ${logEntry.type}
DATA: ${logEntry.timestamp}
AMBIENTE: ${logEntry.environment}
${'-'.repeat(70)}
${logEntry.summary ? `
ORDER_ID: ${logEntry.summary.order_id || 'N/A'}
CHARGE_ID: ${logEntry.summary.charge_id || 'N/A'}
STATUS: ${logEntry.summary.status || 'N/A'}
VALOR: R$ ${logEntry.summary.amount ? (logEntry.summary.amount / 100).toFixed(2) : 'N/A'}
CÓDIGO: ${logEntry.summary.payment_code || 'N/A'}
MENSAGEM: ${logEntry.summary.payment_message || 'N/A'}
${'-'.repeat(70)}` : ''}
REQUEST:
${JSON.stringify(logEntry.request, null, 2)}
${'-'.repeat(70)}
RESPONSE:
${JSON.stringify(logEntry.response, null, 2)}
${divider}

`;
        fs.appendFileSync(this.logFile, textLog);
    }

    /**
     * Append ao arquivo JSON
     */
    appendToJsonLog(logEntry) {
        try {
            const data = JSON.parse(fs.readFileSync(this.jsonLogFile, 'utf8'));
            data.transactions.push(logEntry);
            data.lastUpdated = new Date().toISOString();
            fs.writeFileSync(this.jsonLogFile, JSON.stringify(data, null, 2));
        } catch (error) {
            console.error('Erro ao salvar JSON log:', error.message);
        }
    }

    /**
     * Retorna todos os logs
     */
    getAllLogs() {
        try {
            return JSON.parse(fs.readFileSync(this.jsonLogFile, 'utf8'));
        // eslint-disable-next-line no-unused-vars
        } catch (error) {
            return { transactions: [] };
        }
    }

    /**
     * Retorna logs formatados para o documento MD
     */
    getLogsForMarkdown() {
        const logs = this.getAllLogs();
        let markdown = '';

        logs.transactions.forEach((log, index) => {
            markdown += `\n### Transação ${index + 1} - ${log.type}\n\n`;
            markdown += `**Data:** ${log.timestamp}\n`;
            markdown += `**Ambiente:** ${log.environment}\n\n`;
            
            if (log.summary) {
                markdown += `| Campo | Valor |\n`;
                markdown += `|-------|-------|\n`;
                markdown += `| ORDER_ID | \`${log.summary.order_id || 'N/A'}\` |\n`;
                markdown += `| CHARGE_ID | \`${log.summary.charge_id || 'N/A'}\` |\n`;
                markdown += `| STATUS | ${log.summary.status || 'N/A'} |\n`;
                markdown += `| VALOR | R$ ${log.summary.amount ? (log.summary.amount / 100).toFixed(2) : 'N/A'} |\n\n`;
            }

            markdown += `**Request:**\n\`\`\`json\n${JSON.stringify(log.request, null, 2)}\n\`\`\`\n\n`;
            markdown += `**Response:**\n\`\`\`json\n${JSON.stringify(log.response, null, 2)}\n\`\`\`\n\n`;
            markdown += `---\n`;
        });

        return markdown;
    }

    /**
     * Registra erro específico para verificação de integração
     */
    logIntegrationError(error, context = {}) {
        const timestamp = new Date().toISOString();
        const errorLog = {
            id: `ERROR_${Date.now()}`,
            timestamp,
            environment: 'PRODUCTION',
            type: 'INTEGRATION_ERROR',
            error: {
                message: error.message,
                stack: error.stack,
                code: error.code
            },
            context,
            severity: 'HIGH'
        };

        // Log crítico no console
        console.log('\n' + '🚨'.repeat(20));
        console.log('🚨 ERRO CRÍTICO DE INTEGRAÇÃO PAGBANK');
        console.log('🚨'.repeat(20));
        console.log(`📅 ${timestamp}`);
        console.log(`❌ ERRO: ${error.message}`);
        console.log(`🔍 CONTEXTO:`, context);
        console.log('🚨'.repeat(20) + '\n');

        this.appendToTextLog(errorLog);
        this.appendToJsonLog(errorLog);

        return errorLog;
    }

    /**
     * Gera relatório de status da integração
     */
    generateIntegrationReport() {
        const logs = this.getAllLogs();
        const last24h = Date.now() - (24 * 60 * 60 * 1000);
        
        const recentLogs = logs.transactions.filter(log => 
            new Date(log.timestamp).getTime() > last24h
        );

        const report = {
            reportId: `INTEGRATION_REPORT_${Date.now()}`,
            timestamp: new Date().toISOString(),
            period: 'Últimas 24 horas',
            totalTransactions: recentLogs.length,
            transactionsByType: {},
            errorCount: 0,
            successCount: 0,
            criticalIssues: [],
            recommendations: []
        };

        // Análise das transações
        recentLogs.forEach(log => {
            // Contar por tipo
            report.transactionsByType[log.type] = (report.transactionsByType[log.type] || 0) + 1;

            // Verificar erros
            if (log.type === 'INTEGRATION_ERROR' || 
                (log.response && log.response.error_messages)) {
                report.errorCount++;
                if (log.type === 'INTEGRATION_ERROR') {
                    report.criticalIssues.push({
                        timestamp: log.timestamp,
                        error: log.error?.message,
                        context: log.context
                    });
                }
            } else {
                report.successCount++;
            }
        });

        // Calcular taxa de sucesso
        const totalNonWebhook = recentLogs.filter(log => log.type !== 'WEBHOOK').length;
        report.successRate = totalNonWebhook > 0 ? 
            ((report.successCount / totalNonWebhook) * 100).toFixed(2) + '%' : 'N/A';

        // Gerar recomendações
        if (report.errorCount > 0) {
            report.recommendations.push('Investigar erros de integração encontrados');
        }
        if (report.successRate && parseFloat(report.successRate) < 95) {
            report.recommendations.push('Taxa de sucesso baixa - revisar configurações');
        }
        if (report.totalTransactions === 0) {
            report.recommendations.push('Nenhuma transação nas últimas 24h - verificar conectividade');
        }

        this.logIntegrationReport(report);
        return report;
    }

    /**
     * Registra relatório de integração
     */
    logIntegrationReport(report) {
        console.log('\n' + '📊'.repeat(25));
        console.log('📊 RELATÓRIO DE INTEGRAÇÃO PAGBANK PRODUÇÃO');
        console.log('📊'.repeat(25));
        console.log(`📅 Gerado em: ${report.timestamp}`);
        console.log(`⏱️  Período: ${report.period}`);
        console.log(`📈 Total de transações: ${report.totalTransactions}`);
        console.log(`✅ Sucessos: ${report.successCount}`);
        console.log(`❌ Erros: ${report.errorCount}`);
        console.log(`📊 Taxa de sucesso: ${report.successRate}`);
        
        console.log('\n📋 TRANSAÇÕES POR TIPO:');
        Object.entries(report.transactionsByType).forEach(([type, count]) => {
            console.log(`   ${type}: ${count}`);
        });

        if (report.criticalIssues.length > 0) {
            console.log('\n🚨 PROBLEMAS CRÍTICOS:');
            report.criticalIssues.forEach((issue, index) => {
                console.log(`   ${index + 1}. ${issue.error} (${issue.timestamp})`);
            });
        }

        if (report.recommendations.length > 0) {
            console.log('\n💡 RECOMENDAÇÕES:');
            report.recommendations.forEach((rec, index) => {
                console.log(`   ${index + 1}. ${rec}`);
            });
        }

        console.log('📊'.repeat(25) + '\n');

        // Salvar relatório
        const reportFile = path.join(this.logsDir, `integration_report_${Date.now()}.json`);
        fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
        console.log(`💾 Relatório salvo em: ${reportFile}\n`);
    }

    /**
     * Verifica conectividade com PagBank
     */
    logConnectivityTest(testResult) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            id: `CONNECTIVITY_${Date.now()}`,
            timestamp,
            environment: 'PRODUCTION',
            type: 'CONNECTIVITY_TEST',
            result: testResult,
            status: testResult.success ? 'SUCCESS' : 'FAILED'
        };

        const icon = testResult.success ? '✅' : '❌';
        console.log('\n' + '🔍'.repeat(20));
        console.log('🔍 TESTE DE CONECTIVIDADE PAGBANK');
        console.log('🔍'.repeat(20));
        console.log(`📅 ${timestamp}`);
        console.log(`${icon} Status: ${logEntry.status}`);
        console.log(`⏱️  Tempo de resposta: ${testResult.responseTime || 'N/A'}ms`);
        console.log(`📡 Endpoint: ${testResult.endpoint || 'N/A'}`);
        if (!testResult.success) {
            console.log(`❌ Erro: ${testResult.error}`);
        }
        console.log('🔍'.repeat(20) + '\n');

        this.appendToTextLog(logEntry);
        this.appendToJsonLog(logEntry);

        return logEntry;
    }

    /**
     * Exporta logs para validação com PagBank
     */
    exportLogsForValidation(days = 7) {
        const logs = this.getAllLogs();
        const cutoffDate = Date.now() - (days * 24 * 60 * 60 * 1000);
        
        const validationLogs = logs.transactions
            .filter(log => new Date(log.timestamp).getTime() > cutoffDate)
            .map(log => ({
                timestamp: log.timestamp,
                type: log.type,
                order_id: log.summary?.order_id,
                charge_id: log.summary?.charge_id,
                status: log.summary?.status,
                amount: log.summary?.amount,
                environment: log.environment,
                payment_code: log.summary?.payment_code,
                payment_message: log.summary?.payment_message
            }));

        const exportData = {
            exportId: `PAGBANK_VALIDATION_${Date.now()}`,
            generatedAt: new Date().toISOString(),
            period: `Últimos ${days} dias`,
            totalLogs: validationLogs.length,
            logs: validationLogs
        };

        const exportFile = path.join(this.logsDir, `pagbank_validation_export_${Date.now()}.json`);
        fs.writeFileSync(exportFile, JSON.stringify(exportData, null, 2));

        console.log('\n' + '📋'.repeat(20));
        console.log('📋 EXPORTAÇÃO PARA VALIDAÇÃO PAGBANK');
        console.log('📋'.repeat(20));
        console.log(`📅 Gerado em: ${exportData.generatedAt}`);
        console.log(`⏱️  Período: ${exportData.period}`);
        console.log(`📊 Total de logs: ${exportData.totalLogs}`);
        console.log(`💾 Arquivo: ${exportFile}`);
        console.log('📋'.repeat(20) + '\n');

        return exportFile;
    }

    /**
     * Limpa logs antigos (mantém últimos N)
     */
    cleanOldLogs(keepLast = 100) {
        try {
            const data = JSON.parse(fs.readFileSync(this.jsonLogFile, 'utf8'));
            if (data.transactions.length > keepLast) {
                data.transactions = data.transactions.slice(-keepLast);
                fs.writeFileSync(this.jsonLogFile, JSON.stringify(data, null, 2));
            }
        } catch (error) {
            console.error('Erro ao limpar logs:', error.message);
        }
    }
}

// Exportar instância singleton
module.exports = new PagBankLoggerService();
