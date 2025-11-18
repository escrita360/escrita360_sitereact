# Integração PagBank - Escrita360

Este documento descreve a implementação da integração com PagBank para processamento de pagamentos no frontend Escrita360.

## 📋 Visão Geral

A integração PagBank oferece múltiplas formas de pagamento para o mercado brasileiro:
- **Cartão de Crédito**: Pagamento direto com parcelamento
- **PIX**: Pagamento instantâneo via QR Code
- **Boleto Bancário**: Pagamento tradicional com vencimento

## 🏗️ Arquitetura

### Serviços Implementados

#### 1. `src/services/pagbank.js`
Serviço principal para comunicação com APIs PagBank:
- Criação de pedidos (Orders)
- Processamento de pagamentos
- Geração de links de checkout
- Consulta de status
- Validação de webhooks

#### 2. `src/services/payment.js` (Atualizado)
Serviço unificado que integra Stripe + PagBank:
- Métodos específicos para PagBank
- Validação de dados de cartão
- Criptografia de dados sensíveis

### Componentes

#### 1. `src/components/PagBankCheckout.jsx`
Componente principal para checkout PagBank:
- Seleção de método de pagamento
- Interface para PIX com QR Code
- Interface para Boleto com instruções
- Gerenciamento de estados de pagamento

#### 2. `src/pages/Pagamento.jsx` (Atualizado)
Página de pagamento com abas:
- Aba Stripe (pagamentos internacionais)
- Aba PagBank (pagamentos nacionais)
- Formulário unificado de dados pessoais

## ⚙️ Configuração

### Variáveis de Ambiente

Copie o arquivo `.env.example.pagbank` para `.env` e configure:

```bash
# Ambiente
VITE_PAGBANK_ENV=sandbox

# Credenciais
VITE_PAGBANK_TOKEN=your_token_here
VITE_PAGBANK_APP_ID=your_app_id_here
VITE_PAGBANK_CLIENT_ID=your_client_id_here
VITE_PAGBANK_CLIENT_SECRET=your_client_secret_here

# Webhooks
VITE_PAGBANK_WEBHOOK_URL=http://localhost:3000/webhooks/pagbank
```

### Obtenção de Credenciais

1. **Conta Sandbox**:
   - Acesse: https://sandbox.pagseguro.uol.com.br/
   - Crie uma conta de desenvolvedor
   - Gere as credenciais de API

2. **Conta Produção**:
   - Acesse: https://pagseguro.uol.com.br/
   - Complete o processo de homologação
   - Obtenha credenciais de produção

## 🚀 Como Usar

### 1. Implementação Básica

```jsx
import { PagBankCheckout } from '@/components/PagBankCheckout'

function PagamentoPage() {
  const planData = {
    planId: 'premium',
    name: 'Premium',
    price: 99.90
  }
  
  const customerData = {
    name: 'João Silva',
    email: 'joao@email.com',
    cpf: '12345678901',
    phone: '11999999999'
  }

  return (
    <PagBankCheckout
      planData={planData}
      customerData={customerData}
      onSuccess={(data) => console.log('Pagamento realizado:', data)}
      onError={(error) => console.error('Erro:', error)}
    />
  )
}
```

### 2. Pagamento com Cartão

```javascript
import { paymentService } from '@/services/payment'

const processCardPayment = async () => {
  try {
    const result = await paymentService.processPagBankCardPayment({
      planData: { name: 'Premium', price: 99.90 },
      customerData: { name: 'João', email: 'joao@email.com', cpf: '123456789', phone: '11999999999' },
      cardData: { number: '4111111111111111', cvv: '123', holderName: 'JOAO SILVA' },
      installments: 1
    })
    console.log('Pagamento processado:', result)
  } catch (error) {
    console.error('Erro no pagamento:', error)
  }
}
```

### 3. Pagamento PIX

```javascript
const createPixPayment = async () => {
  try {
    const result = await paymentService.createPagBankPixPayment({
      planData: { name: 'Premium', price: 99.90 },
      customerData: { name: 'João', email: 'joao@email.com', cpf: '123456789', phone: '11999999999' }
    })
    console.log('PIX gerado:', result.charges[0].payment_method.pix.qr_code)
  } catch (error) {
    console.error('Erro ao gerar PIX:', error)
  }
}
```

## 🔄 Fluxos de Pagamento

### Cartão de Crédito
1. Cliente preenche dados do cartão
2. Frontend criptografa dados sensíveis
3. Envia requisição para PagBank
4. Retorna status de aprovação/negação

### PIX
1. Cliente seleciona PIX
2. Backend gera QR Code e código PIX
3. Cliente escaneia ou copia código
4. Pagamento é confirmado via webhook

### Boleto
1. Cliente seleciona boleto
2. Backend gera boleto com vencimento
3. Cliente baixa e paga o boleto
4. Confirmação via webhook em 1-2 dias úteis

## 🔒 Segurança

### Criptografia de Cartão
```javascript
// TODO: Implementar com biblioteca oficial PagBank
const encryptCardData = async (cardData) => {
  // Usar window.PagSeguro.encryptCard(cardData)
  // Documentação: https://dev.pagbank.uol.com.br/docs/criptografia-dados-cartao
}
```

### Validação de Webhooks
```javascript
import { pagBankService } from '@/services/pagbank'

const validateWebhook = (payload, signature) => {
  return pagBankService.validateWebhook(payload, signature, publicKey)
}
```

## 📊 Monitoramento

### Consultar Status de Pagamento
```javascript
const checkPaymentStatus = async (orderId) => {
  const status = await paymentService.getPagBankPaymentStatus(orderId)
  console.log('Status:', status.charges[0].status)
}
```

### Listar Pagamentos
```javascript
const listPayments = async () => {
  const payments = await paymentService.listPagBankPayments({
    created_at_gte: '2024-01-01T00:00:00Z',
    status: 'PAID'
  })
  console.log('Pagamentos:', payments.orders)
}
```

## 🐛 Tratamento de Erros

### Códigos de Status Comuns
- `PAID`: Pagamento aprovado
- `WAITING`: Aguardando pagamento
- `DECLINED`: Pagamento negado
- `CANCELED`: Pagamento cancelado

### Exemplo de Tratamento
```javascript
try {
  const result = await paymentService.processPagBankCardPayment(data)
  
  switch (result.charges[0].status) {
    case 'PAID':
      showSuccess('Pagamento aprovado!')
      break
    case 'DECLINED':
      showError('Pagamento negado. Verifique os dados do cartão.')
      break
    case 'WAITING':
      showInfo('Pagamento em análise.')
      break
  }
} catch (error) {
  showError('Erro ao processar pagamento: ' + error.message)
}
```

## 🧪 Testes

### Dados de Teste (Sandbox)
```javascript
// Cartões de teste
const TEST_CARDS = {
  visa: '4111111111111111',
  mastercard: '5555555555554444',
  elo: '6362970000457013'
}

// CPF de teste
const TEST_CPF = '11144477735'
```

### Simulação de Status
```javascript
// No ambiente sandbox, é possível simular diferentes status
const simulateDeclined = {
  cardNumber: '4000000000000002' // Sempre negado
}

const simulateApproved = {
  cardNumber: '4111111111111111' // Sempre aprovado
}
```

## 📈 Métricas e Analytics

### Eventos para Tracking
```javascript
// Exemplo com Google Analytics
const trackPaymentEvent = (method, amount, status) => {
  gtag('event', 'payment_attempt', {
    payment_method: method,
    value: amount,
    currency: 'BRL',
    status: status
  })
}
```

## 🔧 Manutenção

### Logs Importantes
- Erros de API PagBank
- Webhooks recebidos
- Pagamentos processados
- Tentativas de fraude

### Monitoramento Recomendado
- Taxa de aprovação por método
- Tempo médio de processamento
- Erros de integração
- Webhooks perdidos

## 📚 Recursos Adicionais

- [Documentação Oficial PagBank](https://dev.pagbank.uol.com.br/)
- [API Reference](https://dev.pagbank.uol.com.br/reference)
- [Códigos de Status](https://dev.pagbank.uol.com.br/docs/status-codes)
- [Webhooks](https://dev.pagbank.uol.com.br/docs/webhooks)

## 🚨 Notas Importantes

1. **Criptografia**: Implementar criptografia adequada antes de produção
2. **Certificados**: Validar certificados SSL em produção
3. **Rate Limiting**: Implementar controle de taxa de requisições
4. **Backup**: Manter logs de todas as transações
5. **Compliance**: Seguir normas PCI DSS para dados de cartão

## 📞 Suporte

Para problemas relacionados ao PagBank:
- Documentação: https://dev.pagbank.uol.com.br/
- Suporte Técnico: Através do portal do desenvolvedor PagBank