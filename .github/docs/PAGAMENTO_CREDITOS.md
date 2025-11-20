# Sistema de Pagamento Único para Créditos

## Visão Geral

Implementação de um sistema de compra de pacotes de créditos usando pagamento único (não recorrente) via PagBank. Os usuários podem comprar créditos para análises de IA sem precisar ter uma assinatura ativa.

## Componentes Criados

### 1. PagamentoCreditos.jsx (`src/pages/PagamentoCreditos.jsx`)

Página dedicada para compra de pacotes de créditos com:
- Formulário de dados pessoais (email, CPF, telefone)
- Seleção de método de pagamento (Cartão, PIX, Boleto)
- Formulário de dados do cartão (quando aplicável)
- Resumo do pedido com detalhes do pacote
- Página de confirmação após pagamento bem-sucedido

**Fluxo:**
1. Usuário seleciona um pacote na página de Planos
2. É redirecionado para `/pagamento-creditos` com os dados do pacote
3. Preenche dados pessoais e de pagamento
4. Confirma a compra
5. Visualiza confirmação com detalhes da transação

### 2. PagBankOneTimePayment.jsx (`src/components/PagBankOneTimePayment.jsx`)

Componente reutilizável para processamento de pagamentos únicos via PagBank:

**Funcionalidades:**
- **Pagamento com Cartão**: Processamento direto com validação em tempo real
- **Pagamento PIX**: Geração de QR Code com polling automático para verificar pagamento
- **Pagamento Boleto**: Geração de boleto com link para visualização/impressão

**Props:**
```jsx
<PagBankOneTimePayment
  packageData={{
    packageId: 'pacote-1',
    name: 'Pacote 1',
    price: 20,
    credits: 5
  }}
  customerData={{
    name: 'João Silva',
    email: 'joao@email.com',
    cpf: '12345678900',
    phone: '11999999999'
  }}
  cardData={{
    number: '4111111111111111',
    expiryMonth: '12',
    expiryYear: '2025',
    cvv: '123',
    holderName: 'JOAO SILVA'
  }}
  paymentMethod="card" // 'card', 'pix', 'boleto'
  onSuccess={(data) => console.log('Pagamento aprovado:', data)}
  onError={(error) => console.log('Erro:', error)}
  validateBeforeSubmit={() => true}
/>
```

## Integração com API PagBank

### Endpoints Utilizados

1. **POST /api/pagbank/create-order** - Pagamento com Cartão
   ```json
   {
     "reference_id": "CREDITOS_pacote-1_123456789",
     "customer": { ... },
     "items": [ ... ],
     "charges": [{
       "payment_method": {
         "type": "CREDIT_CARD",
         "card": { ... }
       }
     }]
   }
   ```

2. **POST /api/pagbank/create-pix-order** - Pagamento PIX
   ```json
   {
     "reference_id": "CREDITOS_pacote-1_123456789",
     "customer": { ... },
     "items": [ ... ],
     "qr_codes": [{
       "amount": { "value": 2000 },
       "expiration_date": "2024-12-31T23:59:59Z"
     }]
   }
   ```

3. **POST /api/pagbank/create-order** (com boleto) - Pagamento Boleto
   ```json
   {
     "reference_id": "CREDITOS_pacote-1_123456789",
     "customer": { ... },
     "items": [ ... ],
     "charges": [{
       "payment_method": {
         "type": "BOLETO",
         "boleto": {
           "due_date": "2024-12-31",
           "instruction_lines": { ... }
         }
       }
     }]
   }
   ```

4. **GET /api/pagbank/order/:orderId** - Consultar status do pedido (polling PIX)

### Webhooks

O sistema está preparado para receber notificações via webhook:
- **URL**: `${VITE_API_URL}/api/pagbank/webhook`
- **Eventos**: Mudanças de status de pagamento
- **Ação**: Atualizar créditos do usuário automaticamente

## Fluxo de Dados

```
Planos.jsx (Seleção) 
  → navigate('/pagamento-creditos', { state: { selectedPackage, audience } })
  → PagamentoCreditos.jsx (Formulário)
    → PagBankOneTimePayment.jsx (Processamento)
      → Backend API (/api/pagbank/*)
        → PagBank API
      ← Resposta
    ← Callback (onSuccess/onError)
  → Tela de Confirmação
```

## Atualização da Página de Planos

A página `Planos.jsx` foi atualizada para incluir navegação aos pacotes de créditos:

```jsx
<Button 
  onClick={() => navigate('/pagamento-creditos', { 
    state: { 
      selectedPackage: pkg, 
      audience: selectedAudience 
    } 
  })}
>
  Adquirir Pacote
</Button>
```

## Roteamento

Adicionada nova rota em `App.jsx`:

```jsx
<Route path="/pagamento-creditos" element={
  <Layout>
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <PagamentoCreditos />
    </motion.div>
  </Layout>
} />
```

## Validações Implementadas

### Frontend
- Email válido (regex)
- CPF com 11 dígitos
- Telefone com mínimo 10 dígitos
- Número do cartão com mínimo 13 dígitos
- Data de validade no formato MM/AA
- CVV com 3-4 dígitos
- Nome no cartão com mínimo 2 caracteres

### Formatação Automática
- CPF: `123.456.789-00`
- Telefone: `(11) 99999-9999`
- Cartão: `1234 5678 9012 3456`
- Validade: `12/25`

## Métodos de Pagamento

### Cartão de Crédito
- ✅ Pagamento imediato
- ✅ Aprovação em tempo real
- ✅ Créditos liberados instantaneamente

### PIX
- ✅ QR Code gerado automaticamente
- ✅ Opção de copiar código
- ✅ Polling automático para verificar pagamento (5 em 5 segundos)
- ✅ Timeout de 15 minutos
- ⏱️ Créditos liberados em até 2 minutos

### Boleto
- ✅ Geração automática
- ✅ Link para visualização/impressão
- ✅ Validade de 3 dias úteis
- ⏱️ Créditos liberados em até 2 dias úteis após compensação

## Segurança

- ✅ Validação de dados no frontend e backend
- ✅ Dados do cartão criptografados via PagBank
- ✅ Conexão HTTPS obrigatória
- ✅ Webhook com validação de assinatura
- ✅ CPV mascarado (type="password")

## Próximos Passos

### Backend (Necessário Implementar)

1. **Endpoint para Criar Pedido com Cartão**
   - `POST /api/pagbank/create-order`
   - Validar dados do cartão
   - Chamar API PagBank
   - Retornar status da transação

2. **Endpoint para Criar Pedido PIX**
   - `POST /api/pagbank/create-pix-order`
   - Gerar QR Code
   - Retornar dados do QR Code

3. **Endpoint para Criar Pedido com Boleto**
   - `POST /api/pagbank/create-order` (com boleto)
   - Gerar boleto
   - Retornar link do boleto

4. **Endpoint de Consulta de Pedido**
   - `GET /api/pagbank/order/:orderId`
   - Consultar status na API PagBank
   - Retornar dados atualizados

5. **Webhook Handler**
   - `POST /api/pagbank/webhook`
   - Validar assinatura
   - Processar eventos de pagamento
   - Atualizar créditos do usuário no banco

6. **Sistema de Créditos**
   - Tabela `user_credits` no banco de dados
   - Função para adicionar créditos
   - Função para consumir créditos
   - Histórico de transações

### Frontend (Melhorias)

1. **Histórico de Compras**
   - Página para listar compras anteriores
   - Detalhes de cada transação
   - Status dos créditos

2. **Saldo de Créditos**
   - Exibir saldo atual no dashboard
   - Alertas quando os créditos estiverem acabando

3. **Testes**
   - Testes unitários dos componentes
   - Testes de integração do fluxo de pagamento
   - Testes E2E

## Referências

- [Documentação PagBank - API Order](https://dev.pagbank.uol.com.br/reference/orders-api-overview)
- [Criar Pedido com Cartão](https://dev.pagbank.uol.com.br/reference/criar-pedido)
- [Criar Pedido com PIX](https://dev.pagbank.uol.com.br/reference/criar-qr-code-pix)
- [Webhooks PagBank](https://dev.pagbank.uol.com.br/reference/webhooks)

## Variáveis de Ambiente

```env
VITE_API_URL=http://localhost:5000
VITE_PAGBANK_TOKEN=your_token_here
```

## Suporte

Em caso de dúvidas ou problemas:
1. Verificar logs do console do navegador
2. Verificar logs do backend
3. Consultar documentação PagBank
4. Contatar suporte PagBank se necessário
