# Script de teste de integracao Frontend <-> Backend

Write-Host "=== Teste de Integracao Escrita360 ===" -ForegroundColor Cyan
Write-Host ""

# 1. Testar Health Check
Write-Host "1. Testando Health Check..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:5000/health" -Method Get
    Write-Host "Backend esta rodando: $($health.service)" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "Erro ao conectar ao backend: $_" -ForegroundColor Red
    exit 1
}

# 2. Testar endpoint de assinatura com MOCK
Write-Host "2. Testando endpoint de assinatura (verificacao de payload)..." -ForegroundColor Yellow
$testBody = @{
    plan_name = "Plano Teste"
    plan_description = "Teste de integracao"
    amount = 49
    interval_unit = "MONTH"
    interval_value = 1
    customer = @{
        name = "Joao Silva"
        email = "teste@example.com"
        cpf = "12345678900"
        phone = "11987654321"
    }
    payment_method = "BOLETO"
}

$jsonBody = $testBody | ConvertTo-Json -Depth 10 -Compress

Write-Host "📦 Payload:" -ForegroundColor Cyan
Write-Host $jsonBody
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/payment/create-pagbank-subscription" `
        -Method Post `
        -Body $jsonBody `
        -ContentType "application/json; charset=utf-8" `
        -ErrorAction Stop
    
    Write-Host "Endpoint funcionando!" -ForegroundColor Green
    Write-Host "Resposta:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 10 | Write-Host
    Write-Host ""
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "Status: $statusCode" -ForegroundColor Yellow
    
    if ($_.ErrorDetails.Message) {
        Write-Host "Detalhes:" -ForegroundColor Yellow
        Write-Host $_.ErrorDetails.Message
    }
    Write-Host ""
}

# 3. Verificar configuracao do frontend
Write-Host "3. Verificando configuracao do frontend..." -ForegroundColor Yellow

$envFile = "d:\github\escrita360_sitereact\.env"
if (Test-Path $envFile) {
    $envContent = Get-Content $envFile
    $apiUrl = $envContent | Where-Object { $_ -like "VITE_API_URL*" }
    
    if ($apiUrl) {
        Write-Host "VITE_API_URL configurado: $apiUrl" -ForegroundColor Green
    } else {
        Write-Host "VITE_API_URL nao encontrado no .env" -ForegroundColor Yellow
        Write-Host "Sugestao: adicione 'VITE_API_URL=http://localhost:5000/api'" -ForegroundColor Cyan
    }
} else {
    Write-Host "Arquivo .env nao encontrado" -ForegroundColor Yellow
}
Write-Host ""

# 4. Verificar servico de API do frontend
Write-Host "4. Verificando servico de API do frontend..." -ForegroundColor Yellow
$apiFile = "d:\github\escrita360_sitereact\src\services\api.js"
if (Test-Path $apiFile) {
    $apiContent = Get-Content $apiFile -Raw
    if ($apiContent -match "localhost:5000") {
        Write-Host "API service aponta para localhost:5000" -ForegroundColor Green
    } else {
        Write-Host "API service pode nao estar configurado corretamente" -ForegroundColor Yellow
    }
} else {
    Write-Host "Arquivo api.js nao encontrado" -ForegroundColor Red
}
Write-Host ""

# Resumo
Write-Host "=== Resumo da Integracao ===" -ForegroundColor Cyan
Write-Host "Backend: http://localhost:5000" -ForegroundColor White
Write-Host "Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "Health: http://localhost:5000/health" -ForegroundColor White
Write-Host "API: http://localhost:5000/api/payment" -ForegroundColor White
Write-Host ""
Write-Host "Para testar no navegador:" -ForegroundColor Yellow
Write-Host "1. Acesse http://localhost:5173/precos" -ForegroundColor White
Write-Host "2. Selecione um plano" -ForegroundColor White
Write-Host "3. Preencha o formulario de pagamento" -ForegroundColor White
Write-Host ""
