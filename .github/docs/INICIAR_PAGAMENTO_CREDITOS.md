# 🚀 Como Iniciar o Sistema de Pagamento de Créditos

## Problemas Resolvidos

### 1. ✅ URL Duplicada corrigida
- **Problema**: `POST http://localhost:5001/api/api/pagbank/create-order`
- **Causa**: A URL do `.env` já continha `/api` e o código adicionava `/api` novamente
- **Solução**: Removemos `/api` dos endpoints no componente `PagBankOneTimePayment.jsx`

### 2. ✅ Rotas de pagamento único adicionadas
- `POST /api/payment/pagbank/create-order` - Pagamento com cartão
- `POST /api/payment/pagbank/create-pix-order` - Pagamento PIX
- `GET /api/payment/pagbank/order/:orderId` - Consultar status

## Como Iniciar o Projeto

### Opção 1: Usar o Script PowerShell (Recomendado)

```powershell
# Na raiz do projeto
.\start-backend.ps1
```

Este script irá:
- Verificar se as dependências estão instaladas
- Criar arquivo `.env` se não existir
- Iniciar o servidor na porta 5001

### Opção 2: Iniciar Manualmente

```powershell
# 1. Entrar na pasta server
cd server

# 2. Instalar dependências (se necessário)
npm install

# 3. Iniciar o servidor
$env:PORT = "5001"
npm start
```

### Verificar se o Backend está Rodando

Abra no navegador: http://localhost:5001/health

Você deve ver:
```json
{
  "status": "ok",
  "service": "escrita360-backend"
}
```

## Testar o Pagamento de Créditos

### 1. Iniciar o Frontend

Em outro terminal:

```powershell
# Na raiz do projeto
pnpm dev
```

### 2. Acessar a Página de Planos

Navegue para: http://localhost:5173/planos

### 3. Testar a Compra

1. Selecione um pacote de créditos
2. Clique em "Adquirir Pacote"
3. Preencha os dados do formulário:
   - **Email**: seu@email.com
   - **CPF**: 123.456.789-00
   - **Telefone**: (11) 99999-9999
   - **Cartão**: 4111 1111 1111 1111
   - **Nome**: SEU NOME
   - **Validade**: 12/25
   - **CVV**: 123
4. Clique em "Finalizar Pagamento"

## Ambiente de Desenvolvimento

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5001/api
VITE_PAGBANK_ENV=sandbox
VITE_PAGBANK_TOKEN=seu_token_aqui
```

### Backend (server/.env)
```env
PORT=5001
PAGBANK_ENV=sandbox
PAGBANK_TOKEN=seu_token_aqui
PAGBANK_EMAIL=seu_email@gmail.com
```

## Status Atual da Implementação

### ✅ Concluído (Frontend)
- [x] Página de pagamento de créditos
- [x] Componente de pagamento único
- [x] Validação de formulários
- [x] Formatação de campos
- [x] Suporte a múltiplos métodos (Cartão, PIX, Boleto)
- [x] Tela de confirmação
- [x] Integração com rotas

### ✅ Concluído (Backend)
- [x] Rotas de API criadas
- [x] Simulação de pagamento funcionando
- [x] Estrutura para integração real

### ⏳ Próximos Passos (Produção)

#### Backend
1. **Integrar com API Real do PagBank**
   - Substituir simulações por chamadas reais
   - Implementar autenticação com token PagBank
   - Adicionar validação de webhook

2. **Sistema de Créditos**
   ```sql
   CREATE TABLE user_credits (
     id INT PRIMARY KEY AUTO_INCREMENT,
     user_id INT NOT NULL,
     credits INT NOT NULL,
     purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     expires_at TIMESTAMP,
     order_id VARCHAR(255),
     FOREIGN KEY (user_id) REFERENCES users(id)
   );
   
   CREATE TABLE credit_transactions (
     id INT PRIMARY KEY AUTO_INCREMENT,
     user_id INT NOT NULL,
     amount INT NOT NULL,
     type ENUM('purchase', 'usage', 'expiration'),
     order_id VARCHAR(255),
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (user_id) REFERENCES users(id)
   );
   ```

3. **Webhook Handler**
   - Receber notificações do PagBank
   - Validar assinatura
   - Atualizar créditos automaticamente

#### Frontend
1. **Dashboard de Créditos**
   - Exibir saldo atual
   - Histórico de compras
   - Histórico de uso

2. **Notificações**
   - Alertar quando créditos estiverem acabando
   - Confirmação de compra por email

## Testando Diferentes Métodos de Pagamento

### Cartão de Crédito
- Aprovação imediata
- Créditos liberados instantaneamente

### PIX (Simulado)
- QR Code gerado
- Polling automático
- Timeout de 15 minutos

### Boleto (Simulado)
- Link gerado
- Créditos liberados após 2 dias úteis

## Troubleshooting

### Erro: "Failed to fetch"
**Causa**: Backend não está rodando
**Solução**: Execute `.\start-backend.ps1`

### Erro: "Port 5001 already in use"
**Causa**: Outra aplicação usando a porta
**Solução**: 
```powershell
# Encontrar processo na porta 5001
netstat -ano | findstr :5001

# Matar processo (substitua PID)
taskkill /PID <PID> /F

# Ou use outra porta
$env:PORT = "5002"
npm start
```

### Frontend não conecta ao backend
**Verificar**:
1. `.env` tem `VITE_API_URL=http://localhost:5001/api`
2. Backend rodando na porta 5001
3. CORS configurado corretamente

## Arquivos Modificados

### Criados
- `src/pages/PagamentoCreditos.jsx` - Página de checkout
- `src/components/PagBankOneTimePayment.jsx` - Processador de pagamentos
- `start-backend.ps1` - Script para iniciar backend

### Modificados
- `src/pages/Planos.jsx` - Adicionado botão de compra
- `src/App.jsx` - Adicionada rota `/pagamento-creditos`
- `src/components/PagBankOneTimePayment.jsx` - Corrigida URL duplicada
- `server/app/routes/payment.js` - Adicionadas rotas de pagamento único

## Documentação Adicional

- [PAGAMENTO_CREDITOS.md](./PAGAMENTO_CREDITOS.md) - Documentação técnica completa
- [API PagBank - Orders](https://dev.pagbank.uol.com.br/reference/orders-api-overview)
- [pagamentoUnico.md](../.github/pagamentoUnico.md) - Documentação da API PagBank

## Suporte

Em caso de problemas:
1. Verificar logs do console (F12)
2. Verificar logs do backend
3. Consultar documentação PagBank
4. Abrir issue no repositório
