# Script PowerShell para capturar e monitorar logs PagBank em produção
# Executa: .\scripts\monitor-pagbank-logs.ps1

Write-Host "🔍 Monitor de Logs PagBank Produção" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Verificar se Node.js está instalado
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js não encontrado. Instale o Node.js primeiro." -ForegroundColor Red
    exit 1
}

# Navegar para o diretório correto
$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

Write-Host "📂 Diretório: $projectRoot" -ForegroundColor Cyan

# Função para exibir menu
function Show-Menu {
    Write-Host "`n🔧 OPÇÕES DISPONÍVEIS:" -ForegroundColor Yellow
    Write-Host "1. Executar teste completo de logs"
    Write-Host "2. Gerar relatório de integração"
    Write-Host "3. Testar conectividade com PagBank"
    Write-Host "4. Exportar logs para validação"
    Write-Host "5. Monitorar logs em tempo real"
    Write-Host "6. Limpar logs antigos"
    Write-Host "7. Visualizar últimos logs"
    Write-Host "0. Sair"
    Write-Host ""
}

# Função para executar teste completo
function Run-CompleteTest {
    Write-Host "🚀 Executando teste completo..." -ForegroundColor Green
    node scripts/test-production-logs.js
}

# Função para gerar relatório
function Generate-Report {
    Write-Host "📊 Gerando relatório de integração..." -ForegroundColor Green
    node -e "const logger = require('./server/app/services/pagbank_logger_service'); logger.generateIntegrationReport();"
}

# Função para testar conectividade
function Test-Connectivity {
    Write-Host "🌐 Testando conectividade..." -ForegroundColor Green
    node -e "
        const logger = require('./server/app/services/pagbank_logger_service');
        const startTime = Date.now();
        fetch('https://api.pagseguro.com/orders', { method: 'HEAD', timeout: 10000 })
        .then(response => {
            const endTime = Date.now();
            logger.logConnectivityTest({
                success: true,
                endpoint: 'https://api.pagseguro.com/orders',
                responseTime: endTime - startTime,
                status: response.status
            });
        })
        .catch(error => {
            const endTime = Date.now();
            logger.logConnectivityTest({
                success: false,
                endpoint: 'https://api.pagseguro.com/orders',
                responseTime: endTime - startTime,
                error: error.message
            });
        });
    "
}

# Função para exportar logs
function Export-Logs {
    $days = Read-Host "Digite o número de dias para exportação (padrão: 7)"
    if ([string]::IsNullOrEmpty($days)) { $days = 7 }
    
    Write-Host "📋 Exportando logs dos últimos $days dias..." -ForegroundColor Green
    node -e "
        const logger = require('./server/app/services/pagbank_logger_service');
        const file = logger.exportLogsForValidation($days);
        console.log('Arquivo exportado:', file);
    "
}

# Função para monitorar em tempo real
function Monitor-RealTime {
    Write-Host "📡 Monitorando logs em tempo real..." -ForegroundColor Green
    Write-Host "Pressione Ctrl+C para parar" -ForegroundColor Yellow
    
    if (Test-Path "server/logs/pagbank_production.log") {
        Get-Content "server/logs/pagbank_production.log" -Wait -Tail 20
    } else {
        Write-Host "❌ Arquivo de log não encontrado. Execute uma transação primeiro." -ForegroundColor Red
    }
}

# Função para limpar logs
function Clean-Logs {
    $keep = Read-Host "Quantos logs manter? (padrão: 100)"
    if ([string]::IsNullOrEmpty($keep)) { $keep = 100 }
    
    Write-Host "🧹 Limpando logs antigos (mantendo $keep)..." -ForegroundColor Green
    node -e "
        const logger = require('./server/app/services/pagbank_logger_service');
        logger.cleanOldLogs($keep);
        console.log('✅ Logs limpos com sucesso!');
    "
}

# Função para visualizar últimos logs
function Show-RecentLogs {
    Write-Host "📋 Últimos 5 logs:" -ForegroundColor Green
    
    if (Test-Path "server/logs/pagbank_transactions.json") {
        node -e "
            const logger = require('./server/app/services/pagbank_logger_service');
            const logs = logger.getAllLogs();
            const recent = logs.transactions.slice(-5);
            recent.forEach((log, i) => {
                console.log(\`\${i+1}. [\${log.timestamp}] \${log.type} - \${log.summary?.status || 'N/A'}\`);
            });
        "
    } else {
        Write-Host "❌ Arquivo de logs não encontrado." -ForegroundColor Red
    }
}

# Loop principal
do {
    Show-Menu
    $choice = Read-Host "Escolha uma opção (0-7)"
    
    switch ($choice) {
        1 { Run-CompleteTest }
        2 { Generate-Report }
        3 { Test-Connectivity }
        4 { Export-Logs }
        5 { Monitor-RealTime }
        6 { Clean-Logs }
        7 { Show-RecentLogs }
        0 { 
            Write-Host "👋 Encerrando monitor de logs..." -ForegroundColor Green
            break 
        }
        default { 
            Write-Host "❌ Opção inválida. Tente novamente." -ForegroundColor Red 
        }
    }
    
    if ($choice -ne 0 -and $choice -ne 5) {
        Write-Host "`nPressione qualquer tecla para continuar..." -ForegroundColor Gray
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    }
    
} while ($choice -ne 0)

Write-Host "✅ Monitor finalizado." -ForegroundColor Green