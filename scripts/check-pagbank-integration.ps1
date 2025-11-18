# Verificacao de Integracao PagBank
Write-Host "=== Verificando Integracao PagBank ===" -ForegroundColor Cyan
Write-Host ""

# 1. Verificar variaveis de ambiente
Write-Host "1. Verificando variaveis de ambiente..." -ForegroundColor Yellow
$envFile = "d:\github\escrita360_sitereact\.env"
$serverEnvFile = "d:\github\escrita360_sitereact\server\.env"

if (Test-Path $envFile) {
    $frontendEnv = Get-Content $envFile -Raw
    
    Write-Host "Frontend (.env):" -ForegroundColor Cyan
    if ($frontendEnv -match "VITE_PAGBANK_TOKEN") {
        Write-Host "  VITE_PAGBANK_TOKEN: Configurado" -ForegroundColor Green
    } else {
        Write-Host "  VITE_PAGBANK_TOKEN: NAO ENCONTRADO" -ForegroundColor Red
    }
    
    if ($frontendEnv -match "VITE_PAGBANK_ENV=(\w+)") {
        Write-Host "  VITE_PAGBANK_ENV: $($matches[1])" -ForegroundColor Green
    } else {
        Write-Host "  VITE_PAGBANK_ENV: NAO ENCONTRADO" -ForegroundColor Red
    }
    
    if ($frontendEnv -match "VITE_API_URL=([^\r\n]+)") {
        Write-Host "  VITE_API_URL: $($matches[1])" -ForegroundColor Green
    } else {
        Write-Host "  VITE_API_URL: NAO ENCONTRADO" -ForegroundColor Yellow
    }
}

Write-Host ""

if (Test-Path $serverEnvFile) {
    $backendEnv = Get-Content $serverEnvFile -Raw
    
    Write-Host "Backend (server/.env):" -ForegroundColor Cyan
    if ($backendEnv -match "PAGBANK_TOKEN") {
        Write-Host "  PAGBANK_TOKEN: Configurado" -ForegroundColor Green
    } else {
        Write-Host "  PAGBANK_TOKEN: NAO ENCONTRADO" -ForegroundColor Red
    }
    
    if ($backendEnv -match "PAGBANK_ENV=(\w+)") {
        Write-Host "  PAGBANK_ENV: $($matches[1])" -ForegroundColor Green
    } else {
        Write-Host "  PAGBANK_ENV: NAO ENCONTRADO" -ForegroundColor Red
    }
    
    if ($backendEnv -match "PAGBANK_MOCK_MODE=(\w+)") {
        Write-Host "  PAGBANK_MOCK_MODE: $($matches[1])" -ForegroundColor $(if ($matches[1] -eq "false") { "Green" } else { "Yellow" })
    }
}

Write-Host ""

# 2. Verificar arquivos de servico
Write-Host "2. Verificando arquivos de servico..." -ForegroundColor Yellow

$frontendServices = @(
    "d:\github\escrita360_sitereact\src\services\api.js",
    "d:\github\escrita360_sitereact\src\services\payment.js",
    "d:\github\escrita360_sitereact\src\components\PagBankCheckout.jsx"
)

foreach ($file in $frontendServices) {
    if (Test-Path $file) {
        Write-Host "  $([System.IO.Path]::GetFileName($file)): OK" -ForegroundColor Green
    } else {
        Write-Host "  $([System.IO.Path]::GetFileName($file)): NAO ENCONTRADO" -ForegroundColor Red
    }
}

Write-Host ""

$backendServices = @(
    "d:\github\escrita360_sitereact\server\app\services\pagbank_subscriptions_service.js",
    "d:\github\escrita360_sitereact\server\app\routes\payment.js"
)

foreach ($file in $backendServices) {
    if (Test-Path $file) {
        Write-Host "  $([System.IO.Path]::GetFileName($file)): OK" -ForegroundColor Green
    } else {
        Write-Host "  $([System.IO.Path]::GetFileName($file)): NAO ENCONTRADO" -ForegroundColor Red
    }
}

Write-Host ""

# 3. Verificar endpoints do backend
Write-Host "3. Testando endpoints do backend..." -ForegroundColor Yellow

try {
    $health = Invoke-RestMethod -Uri "http://localhost:5000/health" -Method Get -ErrorAction Stop
    Write-Host "  /health: OK - $($health.service)" -ForegroundColor Green
} catch {
    Write-Host "  /health: ERRO - Backend nao esta rodando?" -ForegroundColor Red
}

Write-Host ""

# 4. Verificar fluxo de pagamento
Write-Host "4. Fluxo de pagamento:" -ForegroundColor Yellow
Write-Host "  Frontend (Pagamento.jsx)" -ForegroundColor Cyan
Write-Host "    -> PagBankCheckout.jsx" -ForegroundColor Cyan
Write-Host "    -> paymentService.createPagBankSubscription()" -ForegroundColor Cyan
Write-Host "    -> api.post('/payment/create-pagbank-subscription')" -ForegroundColor Cyan
Write-Host "  Backend (server/app/routes/payment.js)" -ForegroundColor Cyan
Write-Host "    -> pagbankSubscriptionsService.createCompleteSubscription()" -ForegroundColor Cyan
Write-Host "    -> API PagBank (sandbox.api.assinaturas.pagseguro.com)" -ForegroundColor Cyan
Write-Host ""

# 5. Resumo
Write-Host "=== Resumo ===" -ForegroundColor Cyan
Write-Host "URLs importantes:" -ForegroundColor White
Write-Host "  Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "  Backend: http://localhost:5000" -ForegroundColor White
Write-Host "  API PagBank: https://sandbox.api.assinaturas.pagseguro.com" -ForegroundColor White
Write-Host ""
Write-Host "Endpoints principais:" -ForegroundColor White
Write-Host "  POST /api/payment/create-pagbank-subscription" -ForegroundColor White
Write-Host "  POST /api/payment/create-pagbank-pix-payment" -ForegroundColor White
Write-Host "  GET  /api/payment/pagbank-status/:order_id" -ForegroundColor White
Write-Host ""
