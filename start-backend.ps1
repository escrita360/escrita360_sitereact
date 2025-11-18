# Script para iniciar o backend corretamente
param(
    [switch]$Dev,
    [switch]$Prod
)

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Escrita360 Backend Starter" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Mudar para o diretório do backend
$backendPath = "d:\github\escrita360_sitereact\escrita360_backend"

if (!(Test-Path $backendPath)) {
    Write-Host "ERRO: Diretorio do backend nao encontrado!" -ForegroundColor Red
    Write-Host "Procurando em: $backendPath" -ForegroundColor Yellow
    exit 1
}

Set-Location $backendPath
Write-Host "Diretorio: $backendPath" -ForegroundColor Green

# Verificar se node_modules existe
if (!(Test-Path "node_modules")) {
    Write-Host "`nInstalando dependencias..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERRO: Falha ao instalar dependencias!" -ForegroundColor Red
        exit 1
    }
}

# Verificar arquivo .env
if (!(Test-Path ".env")) {
    Write-Host "`nAVISO: Arquivo .env nao encontrado!" -ForegroundColor Yellow
    Write-Host "Criando .env a partir do .env.example..." -ForegroundColor Yellow
    
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "Arquivo .env criado!" -ForegroundColor Green
        Write-Host "`nIMPORTANTE: Edite o arquivo .env e adicione seu token real do PagBank!" -ForegroundColor Red
        Write-Host "PAGBANK_TOKEN=seu_token_real_aqui" -ForegroundColor Yellow
    } else {
        Write-Host "ERRO: .env.example nao encontrado!" -ForegroundColor Red
        exit 1
    }
}

# Verificar se a porta 5000 está em uso
$portInUse = Get-NetTCPConnection -LocalPort 5000 -State Listen -ErrorAction SilentlyContinue

if ($portInUse) {
    Write-Host "`nAVISO: Porta 5000 ja esta em uso!" -ForegroundColor Yellow
    Write-Host "Deseja encerrar o processo atual? (S/N)" -ForegroundColor Yellow
    $response = Read-Host
    
    if ($response -eq 'S' -or $response -eq 's') {
        $processId = $portInUse[0].OwningProcess
        Stop-Process -Id $processId -Force
        Write-Host "Processo encerrado!" -ForegroundColor Green
        Start-Sleep -Seconds 2
    } else {
        Write-Host "Abortando..." -ForegroundColor Red
        exit 1
    }
}

Write-Host "`nIniciando servidor..." -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

# Iniciar o servidor
if ($Dev) {
    npm run dev
} elseif ($Prod) {
    npm start
} else {
    # Por padrão, usar modo desenvolvimento
    npm run dev
}
