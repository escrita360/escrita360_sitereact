# 🚀 Escrita360 - Frontend React

Frontend da plataforma Escrita360 construído com **Vite + React** e integração com **PagBank** para processamento de pagamentos nacionais.

## 📋 Funcionalidades

### 💳 Múltiplas Formas de Pagamento
- **Stripe**: Pagamentos internacionais com cartão de crédito
- **PagBank**: Processamento nacional com:
  - Cartão de crédito (parcelamento até 12x)
  - PIX (pagamento instantâneo)
  - Boleto bancário (vencimento em 3 dias)

### 🎯 Páginas Principais
- Landing page com hero e recursos
- Página de planos e preços
- Checkout integrado Stripe + PagBank
- Portal de contato e FAQ
- Páginas de sucesso/cancelamento

## 🛠️ Stack Tecnológica

- **React 18** + **Vite** (build tool)
- **Tailwind CSS** (estilização)
- **Framer Motion** (animações)
- **React Router DOM** (roteamento)
- **Radix UI** (componentes primitivos)
- **Lucide React** (ícones)

## ⚡ Quick Start

```bash
# Instalar dependências
pnpm install

# Configurar variáveis de ambiente
cp .env.example .env
cp .env.example.pagbank .env

# Executar em desenvolvimento
pnpm dev

# Build para produção
pnpm build
```

## 🔧 Configuração de Pagamentos

### Stripe (Internacional)
```env
VITE_API_URL=http://localhost:3000
```

### PagBank (Nacional)
```env
VITE_PAGBANK_ENV=sandbox
VITE_PAGBANK_TOKEN=your_token_here
VITE_PAGBANK_APP_ID=your_app_id_here
VITE_PAGBANK_CLIENT_ID=your_client_id_here
```

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── ui/                    # Componentes primitivos (Radix UI)
│   ├── Layout.jsx            # Layout principal
│   ├── PagBankCheckout.jsx   # Checkout PagBank
│   └── ChatBot.jsx           # Chat integrado
├── pages/
│   ├── Home.jsx              # Landing page
│   ├── Planos.jsx            # Página de preços
│   ├── Pagamento.jsx         # Checkout unificado
│   └── PagamentoSucesso.jsx  # Confirmação
├── services/
│   ├── api.js                # Cliente HTTP base
│   ├── payment.js            # Serviços de pagamento unificados
│   ├── pagbank.js            # Integração PagBank
│   └── auth.js               # Autenticação
├── hooks/
│   ├── use-pagbank.js        # Hook para PagBank
│   └── use-mobile.js         # Detecção mobile
└── lib/
    └── utils.js              # Utilitários (cn, etc.)
```

## 🎨 Componentes de UI

Utilizamos **Radix UI** para componentes acessíveis:

```jsx
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

// Exemplo de uso
<Card>
  <CardContent>
    <Input placeholder="Digite aqui..." />
    <Button>Enviar</Button>
  </CardContent>
</Card>
```

## 💳 Integração de Pagamentos

### Uso Básico - PagBank

```jsx
import { usePagBank } from '@/hooks/use-pagbank'
import { PagBankCheckout } from '@/components/PagBankCheckout'

function CheckoutPage() {
  const { createPixPayment, isLoading, error } = usePagBank()
  
  const handlePixPayment = async () => {
    try {
      const result = await createPixPayment({
        planData: { name: 'Premium', price: 99.90 },
        customerData: { 
          name: 'João Silva',
          email: 'joao@email.com',
          cpf: '12345678901',
          phone: '11999999999'
        }
      })
      console.log('PIX gerado:', result)
    } catch (err) {
      console.error('Erro:', err)
    }
  }

  return (
    <PagBankCheckout
      planData={{ name: 'Premium', price: 99.90 }}
      customerData={{ name: 'João', email: 'joao@email.com' }}
      onSuccess={(data) => console.log('Sucesso:', data)}
      onError={(error) => console.error('Erro:', error)}
    />
  )
}
```

### Fluxo de Pagamento

1. **Seleção do Plano**: `src/pages/Planos.jsx`
2. **Checkout**: `src/pages/Pagamento.jsx` (abas Stripe/PagBank)
3. **Processamento**: APIs específicas de cada provedor
4. **Confirmação**: `src/pages/PagamentoSucesso.jsx`

## 🔄 Roteamento

```jsx
// src/App.jsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/planos" element={<Planos />} />
  <Route path="/pagamento" element={<Pagamento />} />
  <Route path="/pagamento-sucesso" element={<PagamentoSucesso />} />
  <Route path="/pagamento-cancelado" element={<PagamentoCancelado />} />
</Routes>
```

### Navegação com Estado
```jsx
// Passando dados entre páginas
navigate('/pagamento', {
  state: {
    selectedPlan: plan,
    isYearly: true
  }
})
```

## 🎭 Animações

Usamos **Framer Motion** para transições suaves:

```jsx
// src/App.jsx - Transições de página
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
}

<motion.div
  initial="initial"
  animate="in"
  exit="out"
  variants={pageVariants}
  transition={{ duration: 0.3 }}
>
  {/* Conteúdo da página */}
</motion.div>
```

## 🧪 Ambiente de Desenvolvimento

### Comandos Disponíveis

```bash
# Desenvolvimento
pnpm dev              # Servidor de desenvolvimento
pnpm build            # Build de produção
pnpm preview          # Preview do build
pnpm lint             # Lint do código

# Estrutura de diretórios
pnpm create-dirs      # Criar estrutura padrão
```

### Configuração do VSCode

```json
// .vscode/settings.json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  }
}
```

## 📱 Responsividade

O projeto usa **Tailwind CSS** com breakpoints padrão:

```jsx
// Exemplo de classes responsivas
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  <Card className="p-4 md:p-6 lg:p-8">
    {/* Conteúdo responsivo */}
  </Card>
</div>
```

## 🔒 Segurança

### Validação de Dados
```jsx
// src/services/payment.js
export const validateCardData = (cardData) => {
  const { number, cvv, expiryDate } = cardData
  
  // Validação com algoritmo de Luhn
  if (!isValidLuhn(number)) return false
  
  // Validação de CVV
  if (!/^\d{3,4}$/.test(cvv)) return false
  
  return true
}
```

### Criptografia (PagBank)
```jsx
// TODO: Implementar com biblioteca oficial
const encryptCardData = async (cardData) => {
  // window.PagSeguro.encryptCard(cardData)
  return 'encrypted_data'
}
```

## 📊 Monitoramento

### Analytics de Pagamento
```jsx
// Exemplo de tracking
const trackPaymentEvent = (method, amount, status) => {
  gtag('event', 'payment_attempt', {
    payment_method: method,
    value: amount,
    currency: 'BRL',
    status: status
  })
}
```

## 🚀 Deploy

### Build de Produção
```bash
# Gerar build otimizado
pnpm build

# Testar build localmente
pnpm preview
```

### Variáveis de Produção
```env
# Produção
VITE_API_URL=https://api.escrita360.com
VITE_PAGBANK_ENV=production
VITE_PAGBANK_TOKEN=prod_token_here
```

## 📚 Documentação Adicional

- [Integração PagBank](./docs/PAGBANK_INTEGRATION.md)
- [Componentes UI](./docs/UI_COMPONENTS.md)
- [API Backend](../escrita360_BACKEND/docs/)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit: `git commit -m 'Add nova funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🆘 Suporte

- **Issues**: [GitHub Issues](https://github.com/escrita360/escrita360_react/issues)
- **Documentação**: [Docs](./docs/)
- **Email**: suporte@escrita360.com

---

**Escrita360** - Transformando ideias em conteúdo de qualidade 🚀