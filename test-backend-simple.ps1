# Script para testar o backend
Write-Host "Testando backend na porta 5000..." -ForegroundColor Cyan

# Teste 1: Health Check
Write-Host "`nTestando /health..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:5000/health" -Method GET
    Write-Host "Health check: OK" -ForegroundColor Green
    $health | ConvertTo-Json
} catch {
    Write-Host "Health check falhou: $_" -ForegroundColor Red
}

# Teste 2: Root endpoint
Write-Host "`nTestando raiz /..." -ForegroundColor Yellow
try {
    $root = Invoke-RestMethod -Uri "http://localhost:5000/" -Method GET
    Write-Host "Root endpoint: OK" -ForegroundColor Green
    $root | ConvertTo-Json
} catch {
    Write-Host "Root endpoint falhou: $_" -ForegroundColor Red
}

# Teste 3: Criar assinatura recorrente
Write-Host "`nTestando criacao de assinatura recorrente..." -ForegroundColor Yellow
$body = @{
    plan_name = "Plano Teste"
    plan_description = "Teste de assinatura recorrente"
    amount = 29.90
    interval_unit = "MONTH"
    interval_value = 1
    customer = @{
        name = "Joao da Silva"
        email = "joao.silva@example.com"
        cpf = "12345678900"
        phone = "11987654321"
    }
    payment_method = "BOLETO"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/payment/create-pagbank-subscription" `
        -Method POST `
        -ContentType "application/json" `
        -Body $body
    Write-Host "Assinatura criada: OK" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Criacao de assinatura falhou:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    if ($_.ErrorDetails) {
        Write-Host $_.ErrorDetails.Message -ForegroundColor Red
    }
}

Write-Host "`nTestes concluidos!" -ForegroundColor Cyan
