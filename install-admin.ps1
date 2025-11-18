# Script de instalação da área administrativa
# Execute: .\install-admin.ps1

Write-Host "🚀 Instalando Área Administrativa - Escrita360" -ForegroundColor Cyan
Write-Host ""

# Verificar se está no diretório correto
if (-not (Test-Path "server")) {
    Write-Host "❌ Erro: Execute este script no diretório raiz do projeto!" -ForegroundColor Red
    exit 1
}

# Instalar dependências do servidor
Write-Host "📦 Instalando dependências do servidor..." -ForegroundColor Yellow
Set-Location server
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao instalar dependências do servidor!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Dependências do servidor instaladas com sucesso!" -ForegroundColor Green
Set-Location ..

# Verificar se o .env existe
if (-not (Test-Path "server\.env")) {
    Write-Host ""
    Write-Host "⚠️  Arquivo .env não encontrado!" -ForegroundColor Yellow
    Write-Host "📋 Copiando .env.example para .env..." -ForegroundColor Yellow
    Copy-Item "server\.env.example" "server\.env"
    Write-Host ""
    Write-Host "🔑 IMPORTANTE: Edite o arquivo server\.env e adicione suas credenciais do Firebase!" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host "✅ Arquivo .env encontrado!" -ForegroundColor Green
}

# Resumo
Write-Host ""
Write-Host "=" * 70 -ForegroundColor Cyan
Write-Host "✅ Instalação concluída com sucesso!" -ForegroundColor Green
Write-Host "=" * 70 -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Próximos passos:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Configure o Firebase:" -ForegroundColor White
Write-Host "   - Edite o arquivo: server\.env" -ForegroundColor Gray
Write-Host "   - Adicione suas credenciais do Firebase Admin SDK" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Adicione emails de administradores:" -ForegroundColor White
Write-Host "   - Edite: server\app\middleware\adminAuth.js" -ForegroundColor Gray
Write-Host "   - Adicione emails na lista ADMIN_EMAILS" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Inicie o servidor:" -ForegroundColor White
Write-Host "   cd server" -ForegroundColor Gray
Write-Host "   npm start" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Inicie o frontend (em outro terminal):" -ForegroundColor White
Write-Host "   pnpm dev" -ForegroundColor Gray
Write-Host ""
Write-Host "5. Acesse a área admin:" -ForegroundColor White
Write-Host "   http://localhost:5173/admin" -ForegroundColor Gray
Write-Host ""
Write-Host "=" * 70 -ForegroundColor Cyan
Write-Host ""
Write-Host "📚 Documentação:" -ForegroundColor Yellow
Write-Host "   - docs\ADMIN_PANEL.md" -ForegroundColor Gray
Write-Host "   - ADMIN_QUICKSTART.md" -ForegroundColor Gray
Write-Host "   - docs\ADMIN_IMPLEMENTATION.md" -ForegroundColor Gray
Write-Host ""
