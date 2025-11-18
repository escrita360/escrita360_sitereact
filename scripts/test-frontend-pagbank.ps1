# Test PagBank Integration from Frontend Format
# Este script testa a integração PagBank usando o formato que o frontend envia

Write-Host "🧪 Testando integração PagBank com formato do frontend..." -ForegroundColor Cyan

# Dados simulados do frontend
$planData = @{
    planId = "premium"
    name = "Premium"
    price = 99.00
}

$customerData = @{
    name = "João Silva"
    email = "joao.silva@example.com"
    cpf = "123.456.789-00"
    phone = "(11) 98765-4321"
}

$cardData = @{
    number = "4111111111111111"
    expiryMonth = "12"
    expiryYear = "2025"
    cvv = "123"
    holderName = "JOAO SILVA"
}

# Processar telefone (remover formatação)
$phoneClean = $customerData.phone -replace '\D', ''
$phoneFormatted = @{
    area_code = $phoneClean.Substring(0, 2)
    number = $phoneClean.Substring(2)
}

# Processar CPF (remover formatação)
$cpfClean = $customerData.cpf -replace '\D', ''

# Converter preço para centavos
$amountCents = [math]::Round($planData.price * 100)

# Montar payload no formato correto
$body = @{
    plan_name = $planData.name
    plan_description = "Plano $($planData.name) - Escrita360"
    amount = $amountCents
    interval_unit = "MONTH"
    interval_value = 1
    customer = @{
        name = $customerData.name
        email = $customerData.email
        cpf = $cpfClean
        phone = $phoneFormatted
    }
    payment_method = "CREDIT_CARD"
    cardData = $cardData
} | ConvertTo-Json -Depth 10

Write-Host "`n📤 Enviando requisição para o backend..." -ForegroundColor Yellow
Write-Host $body -ForegroundColor Gray

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5001/api/payment/create-pagbank-subscription" -Method POST -Headers @{"Content-Type"="application/json"} -Body $body
    
    Write-Host "`n✅ SUCESSO! Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "`n📦 Resposta do servidor:" -ForegroundColor Cyan
    $jsonResponse = $response.Content | ConvertFrom-Json
    $jsonResponse | ConvertTo-Json -Depth 10 | Write-Host -ForegroundColor White
    
    if ($jsonResponse.demo_mode -eq $true) {
        Write-Host "`n⚠️  ATENÇÃO: Servidor em modo DEMO" -ForegroundColor Yellow
        Write-Host "Configure um token PagBank válido no arquivo .env para usar a API real" -ForegroundColor Yellow
    }
    
}
catch {
    Write-Host "`n❌ ERRO!" -ForegroundColor Red
    Write-Host "Mensagem: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n✅ Teste concluído!" -ForegroundColor Green
