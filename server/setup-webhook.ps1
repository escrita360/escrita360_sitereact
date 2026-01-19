# ========================================
# Script para configurar webhook PIX em produção
# ========================================

Write-Host "🔧 Configurando webhook PIX para produção..."
Write-Host ""

# Verificar se ngrok está instalado (para desenvolvimento)
$ngrokExists = Get-Command ngrok -ErrorAction SilentlyContinue
if ($ngrokExists) {
    Write-Host "📡 ngrok encontrado. Você pode usar para desenvolvimento:"
    Write-Host "   ngrok http 5000"
    Write-Host "   Depois copie a URL HTTPS para PAGBANK_WEBHOOK_URL no .env"
    Write-Host ""
}

# Mostrar configuração atual
Write-Host "⚙️ Configuração atual:"
$envContent = Get-Content ".env" | Select-String "PAGBANK_WEBHOOK_URL"
Write-Host "   $envContent"
Write-Host ""

# Instruções para produção
Write-Host "🌐 Para PRODUÇÃO REAL:"
Write-Host "   1. Substitua 'https://escrita360.com' pelo seu domínio real"
Write-Host "   2. Configure SSL/HTTPS no seu servidor"
Write-Host "   3. Teste o webhook: curl -X POST https://seudominio.com/api/webhook/pagbank/pix"
Write-Host ""

# Verificar se o servidor está rodando
$process = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.ProcessName -eq "node" }
if ($process) {
    Write-Host "✅ Servidor Node.js está rodando"
} else {
    Write-Host "⚠️ Servidor Node.js não está rodando"
    Write-Host "   Execute: npm start ou nodemon app.js"
}

Write-Host ""
Write-Host "🎯 URLs de webhook configuradas:"
Write-Host "   • Geral: https://escrita360.com/api/webhook/pagbank"
Write-Host "   • PIX específico: https://escrita360.com/api/webhook/pagbank/pix"
Write-Host ""
Write-Host "✅ Setup concluído! PIX em produção configurado."
