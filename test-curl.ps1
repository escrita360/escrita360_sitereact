$body = @{
    plan_name = "Plano Básico Mensal"
    plan_description = "Plano de teste para assinatura recorrente"
    amount = 4990
    interval_unit = "MONTH"
    interval_value = 1
    customer = @{
        name = "João Silva Teste"
        email = "joao.silva.teste@escrita360.com"
        cpf = "63013767812"
        phone = @{
            area_code = "11"
            number = "999999999"
        }
    }
    payment_method = "CREDIT_CARD"
    cardData = @{
        number = "5555666677778884"
        expiryMonth = "12"
        expiryYear = "2026"
        cvv = "123"
        holderName = "João Silva Teste"
    }
} | ConvertTo-Json -Depth 5

Write-Host "Enviando para: http://localhost:5001/api/payment/create-pagbank-subscription"
Write-Host ""

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5001/api/payment/create-pagbank-subscription" `
        -Method POST `
        -ContentType "application/json" `
        -Body $body
    
    Write-Host "Status: $($response.StatusCode)"
    Write-Host "Resposta:"
    $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Erro: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Resposta do servidor:"
        Write-Host $responseBody
    }
}
