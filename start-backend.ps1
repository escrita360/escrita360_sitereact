# Script para iniciar o backend do Escrita360
Write-Host "🚀 Iniciando Backend Escrita360..." -ForegroundColor Green

# Verificar se a pasta server existe
if (-not (Test-Path ".\server")) {
    Write-Host "❌ Pasta 'server' não encontrada!" -ForegroundColor Red
    exit 1
}

# Entrar na pasta server
Set-Location .\server

# Verificar se node_modules existe
if (-not (Test-Path ".\node_modules")) {
    Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
    npm install
}

# Verificar se o arquivo .env existe
if (-not (Test-Path ".\.env")) {
    Write-Host "⚠️  Arquivo .env não encontrado na pasta server!" -ForegroundColor Yellow
    Write-Host "📝 Copiando .env.example..." -ForegroundColor Yellow
    if (Test-Path ".\.env.example") {
        Copy-Item ".\.env.example" ".\.env"
        Write-Host "✅ Arquivo .env criado! Configure as variáveis necessárias." -ForegroundColor Green
    }
}

# Iniciar o servidor
Write-Host "Iniciando servidor na porta 5000..." -ForegroundColor Cyan
Write-Host "Health check: http://localhost:5000/health" -ForegroundColor Cyan
Write-Host "API Base: http://localhost:5000/api" -ForegroundColor Cyan
Write-Host ""
$env:PORT = "5000"
npm start
