# Test Backend Health
Write-Host "Testing Backend..." -ForegroundColor Cyan
$health = Invoke-RestMethod -Uri "http://localhost:5000/health" -Method Get
Write-Host "Backend Status: $($health.status) - Service: $($health.service)" -ForegroundColor Green
Write-Host ""

# Test Frontend .env
Write-Host "Checking Frontend Config..." -ForegroundColor Cyan
$envFile = "d:\github\escrita360_sitereact\.env"
if (Test-Path $envFile) {
    $envContent = Get-Content $envFile
    $apiUrl = $envContent | Where-Object { $_ -like "VITE_API_URL*" }
    
    if ($apiUrl) {
        Write-Host "Found: $apiUrl" -ForegroundColor Green
    } else {
        Write-Host "VITE_API_URL not found in .env" -ForegroundColor Yellow
        Write-Host "Add: VITE_API_URL=http://localhost:5000/api" -ForegroundColor White
    }
} else {
    Write-Host ".env file not found" -ForegroundColor Yellow
}
Write-Host ""

# Summary
Write-Host "=== Integration Summary ===" -ForegroundColor Cyan
Write-Host "Backend: http://localhost:5000" -ForegroundColor White
Write-Host "Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "API Endpoint: http://localhost:5000/api/payment" -ForegroundColor White
Write-Host ""
Write-Host "Test in browser: http://localhost:5173/precos" -ForegroundColor Yellow
