@echo off
echo Iniciando teste de integração PagBank...
echo.

REM Iniciar o servidor em background
echo [1/3] Iniciando servidor backend...
start /B node app.js > server.log 2>&1

REM Aguardar o servidor iniciar
echo [2/3] Aguardando servidor inicializar (5 segundos)...
timeout /t 5 /nobreak > nul

REM Executar o teste
echo [3/3] Executando teste de assinatura...
echo.
node test-subscription-sandbox.js

REM Encerrar o servidor
echo.
echo Encerrando servidor...
taskkill /F /IM node.exe /FI "WINDOWTITLE eq Node.js*" > nul 2>&1

echo.
echo Teste concluído!
pause
