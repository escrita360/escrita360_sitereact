# Script para manter o servidor rodando
Write-Host "🚀 Iniciando Backend na porta 5000..." -ForegroundColor Green

$env:PORT = "5000"
$env:NODE_ENV = "development"

# Verificar se .env existe
if (-not (Test-Path ".\.env")) {
    Write-Host "⚠️ Arquivo .env não encontrado!" -ForegroundColor Yellow
    if (Test-Path ".\.env.example") {
        Copy-Item ".\.env.example" ".\.env"
        Write-Host "✅ Copiado .env.example para .env" -ForegroundColor Green
    }
}

Write-Host "Pressione Ctrl+C para parar o servidor" -ForegroundColor Cyan
Write-Host ""

# Iniciar o servidor
node app.js

# Manter o terminal aberto em caso de erro
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ O servidor encontrou um erro" -ForegroundColor Red
    Write-Host "Pressione qualquer tecla para fechar..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}
