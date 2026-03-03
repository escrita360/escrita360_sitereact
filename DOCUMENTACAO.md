# Documentação Completa — escrita360_sitereact

## 1. Visão Geral

O **escrita360_sitereact** é o site institucional e portal de pagamentos da plataforma Escrita360, construído com **React 19** + **Vite**. É a interface web pública que permite:

- Apresentar a plataforma Escrita360 (Home, Recursos, Para Quem, Sobre Nós)
- Exibir planos e preços
- Processar pagamentos via PagBank (cartão criptografado, PIX, boleto)
- Gerenciar assinaturas e créditos
- Painel administrativo para gestão de usuários, assinaturas e pagamentos
- Autenticação JWT para administradores
- ChatBot integrado
- Páginas legais (Termos de Serviço, Política de Privacidade)

**Não existe design system, paleta de cores definida ou qualquer documentação de UX/UI neste projeto.**

---

## 2. Stack Tecnológica

| Tecnologia | Versão | Finalidade |
|---|---|---|
| React | 19.2+ | Biblioteca de UI |
| Vite | 6.4+ | Build tool e dev server |
| React Router DOM | 7.13+ | Roteamento SPA |
| Tailwind CSS | 4.2+ | Estilização utilitária |
| Radix UI | Diversos | Primitivos de componentes acessíveis |
| Framer Motion | 12.34+ | Animações e transições de página |
| Axios | 1.13+ | Cliente HTTP |
| Firebase SDK | 10.14+ | Autenticação client-side |
| Recharts | 2.15+ | Gráficos no painel admin |
| React Hook Form | 7.71+ | Gerenciamento de formulários |
| Zod | 3.25+ | Validação de schemas |
| Sonner | 2.0+ | Notificações toast |
| Lucide React | 0.510+ | Ícones |
| class-variance-authority | 0.7+ | Variantes de componentes |
| tailwind-merge | 3.5+ | Merge de classes Tailwind |
| date-fns | 3.6+ | Manipulação de datas |
| jsencrypt | 3.5+ | Criptografia RSA (cartões PagBank) |
| pnpm | 10.4+ | Gerenciador de pacotes |

---

## 3. Estrutura de Diretórios

```
escrita360_sitereact/
├── index.html                     # HTML base (SPA entry point)
├── package.json                   # Dependências e scripts
├── vite.config.js                 # Configuração Vite (proxy, aliases, plugins)
├── tailwind.config.js             # Configuração Tailwind CSS
├── jsconfig.json                  # Path alias @/ → src/
├── eslint.config.js               # Configuração ESLint
├── components.json                # Configuração shadcn/ui
├── Dockerfile                     # Containerização
├── docker-compose.yml             # Compose para deploy
├── firebase.json                  # Configuração Firebase Hosting
├── firestore.rules                # Regras de segurança Firestore
├── src/
│   ├── main.jsx                   # Entry point React (BrowserRouter)
│   ├── App.jsx                    # Rotas, AnimatePresence, AuthProvider
│   ├── App.css                    # Estilos globais
│   ├── index.css                  # Estilos base/Tailwind
│   ├── pages/                     # Páginas da aplicação
│   │   ├── Home.jsx               # Página inicial
│   │   ├── ParaQuem.jsx           # Para quem é a plataforma
│   │   ├── Recursos.jsx           # Recursos da plataforma
│   │   ├── Planos.jsx             # Exibição de planos e preços
│   │   ├── Contato.jsx            # Formulário de contato
│   │   ├── Faq.jsx                # Perguntas frequentes
│   │   ├── SobreNos.jsx           # Sobre a empresa
│   │   ├── Pagamento.jsx          # Processamento de pagamento (cartão/PIX/boleto)
│   │   ├── PagamentoCreditos.jsx  # Compra de créditos
│   │   ├── ComprarCreditos.jsx    # Seleção de pacotes de créditos
│   │   ├── PagamentoResultado.jsx # Resultado do pagamento (sucesso/cancelado)
│   │   ├── Login.jsx              # Tela de login admin
│   │   ├── Perfil.jsx             # Perfil do usuário logado
│   │   ├── ResetarSenha.jsx       # Reset de senha
│   │   ├── TermosServico.jsx      # Termos de serviço
│   │   ├── PoliticaPrivacidade.jsx # Política de privacidade
│   │   ├── ContractSignatures.jsx # Assinatura de contratos
│   │   ├── 404.jsx                # Página não encontrada
│   │   └── admin/                 # Páginas do painel administrativo
│   │       ├── AdminDashboard.jsx # Dashboard principal admin
│   │       ├── AdminUsers.jsx     # Gerenciamento de usuários
│   │       ├── AdminSubscriptions.jsx # Gerenciamento de assinaturas
│   │       ├── AdminPayments.jsx  # Gerenciamento de pagamentos
│   │       └── AdminPagBank.jsx   # Configurações PagBank
│   ├── components/                # Componentes reutilizáveis
│   │   ├── Layout.jsx             # Layout principal (header, footer, navegação)
│   │   ├── AdminRoute.jsx         # Rota protegida para admin
│   │   ├── ChatBot.jsx            # ChatBot integrado
│   │   ├── CookieConsent.jsx      # Banner de consentimento de cookies
│   │   ├── CardBrandIcon.jsx      # Ícone de bandeira de cartão
│   │   ├── InstallmentOptions.jsx # Opções de parcelamento
│   │   ├── PagBankCheckout.jsx    # Componente de checkout PagBank
│   │   ├── PagBankOneTimePayment.jsx # Pagamento único PagBank
│   │   ├── PageHero.jsx           # Hero genérico para páginas
│   │   ├── PageTransition.jsx     # Wrapper de transição de página
│   │   ├── TestButton.jsx         # Botão de teste
│   │   └── ui/                    # Primitivos UI (Radix + shadcn)
│   │       ├── button.jsx         # Botão com variantes
│   │       ├── card.jsx           # Card container
│   │       ├── input.jsx          # Campo de entrada
│   │       ├── dialog.jsx         # Modal/Dialog
│   │       ├── select.jsx         # Select dropdown
│   │       ├── tabs.jsx           # Tabs
│   │       ├── table.jsx          # Tabela
│   │       ├── form.jsx           # Formulário com React Hook Form
│   │       ├── calendar.jsx       # Calendário (react-day-picker)
│   │       ├── chart.jsx          # Gráficos (Recharts wrapper)
│   │       ├── sonner.jsx         # Toaster notifications
│   │       └── ... (53 componentes UI no total)
│   ├── contexts/
│   │   └── AuthContext.jsx        # Context de autenticação JWT
│   ├── services/                  # Camada de serviços (chamadas API)
│   │   ├── api.js                 # Instância Axios configurada
│   │   ├── auth.js                # Serviço de autenticação
│   │   ├── admin.js               # Serviço administrativo
│   │   ├── payment.js             # Serviço de pagamento
│   │   ├── plans.js               # Serviço de planos
│   │   ├── pagbank.js             # Serviço PagBank direto
│   │   ├── pagbank-subscriptions.js # Serviço de assinaturas PagBank
│   │   ├── chavepublica.js        # Serviço de chave pública (criptografia cartão)
│   │   ├── firebase.js            # Serviço Firebase client-side
│   │   └── chat.js                # Serviço de chatbot
│   ├── hooks/                     # Custom hooks
│   │   ├── use-mobile.js          # Detecção de dispositivo móvel
│   │   ├── use-scroll-animation.js # Animação baseada em scroll
│   │   └── usePagBank.js          # Hook para integração PagBank
│   ├── lib/
│   │   └── utils.js               # Utilitário cn() para classes Tailwind
│   ├── assets/                    # Recursos estáticos
│   └── tests/                     # Testes
└── scripts/                       # Scripts de teste PagBank
```

---

## 4. Configuração e Inicialização

### 4.1. Variáveis de Ambiente

| Variável | Descrição |
|---|---|
| `VITE_API_URL` | URL base da API backend (padrão: `http://localhost:5000/api`) |

### 4.2. Execução Local

```powershell
# Instalar dependências
pnpm install

# Iniciar frontend (dev server na porta 5173)
pnpm dev

# Apenas frontend
pnpm dev:frontend

# Apenas backend
pnpm dev:backend

# Build de produção
pnpm build

# Preview do build
pnpm preview
```

### 4.3. Proxy de Desenvolvimento

O Vite está configurado com proxy para desenvolvimento:
- `/api/chatbot` → `https://escrita360-n8n.nnjeij.easypanel.host/webhook`
- `/api/*` → `http://localhost:5001`

---

## 5. Roteamento

Todas as rotas usam `react-router-dom` com `AnimatePresence` do Framer Motion para transições suaves entre páginas.

### 5.1. Rotas Públicas

| Rota | Componente | Descrição |
|---|---|---|
| `/` | `Home` | Página inicial |
| `/para-quem` | `ParaQuem` | Público-alvo da plataforma |
| `/recursos` | `Recursos` | Funcionalidades da plataforma |
| `/precos` | `Planos` | Planos e preços |
| `/contato` | `Contato` | Formulário de contato |
| `/faq` | `Faq` | Perguntas frequentes |
| `/sobre-nos` | `SobreNos` | Sobre a empresa |
| `/termos-servico` | `TermosServico` | Termos de serviço |
| `/politica-privacidade` | `PoliticaPrivacidade` | Política de privacidade |

### 5.2. Rotas de Pagamento

| Rota | Componente | Descrição |
|---|---|---|
| `/pagamento` | `Pagamento` | Processamento de pagamento |
| `/pagamento-creditos` | `PagamentoCreditos` | Compra de créditos |
| `/comprar-creditos` | `ComprarCreditos` | Seleção de créditos |
| `/pagamento-sucesso` | `PagamentoResultado` | Resultado: sucesso |
| `/pagamento-cancelado` | `PagamentoResultado` | Resultado: cancelado |

### 5.3. Rotas de Autenticação

| Rota | Componente | Descrição |
|---|---|---|
| `/login` | `Login` | Login admin |
| `/resetar-senha` | `ResetarSenha` | Reset de senha |
| `/perfil` | `Perfil` | Perfil do usuário logado |

### 5.4. Rotas Administrativas (protegidas por `AdminRoute`)

| Rota | Componente | Descrição |
|---|---|---|
| `/admin` | `AdminDashboard` | Dashboard administrativo |
| `/admin/users` | `AdminUsers` | Gerenciamento de usuários |
| `/admin/subscriptions` | `AdminSubscriptions` | Gerenciamento de assinaturas |
| `/admin/payments` | `AdminPayments` | Gerenciamento de pagamentos |
| `/admin/pagbank` | `AdminPagBank` | Configuração PagBank |
| `/admin/login` | `Login` | Login do admin |

### 5.5. Página 404

| Rota | Componente | Descrição |
|---|---|---|
| `*` | `NotFound` | Página não encontrada |

---

## 6. Fluxo de Pagamento

1. **Seleção de plano:** Página `Planos.jsx` busca planos via `plansService.getPlans(audience)` do endpoint `/api/payment/plans`
2. **Navegação para pagamento:** `navigate('/pagamento', { state: { selectedPlan, audience } })`
3. **Processamento:** `Pagamento.jsx` coleta dados do cartão, formata (masks de CPF, validade, número), criptografa via `PagSeguro.encryptCard()` e submete ao backend
4. **Resultado:** Redirecionamento para `/pagamento-sucesso` ou `/pagamento-cancelado`

### Métodos de Pagamento Suportados
- **Cartão de crédito** (com criptografia RSA via chave pública PagBank)
- **PIX** (QR Code)
- **Boleto**

---

## 7. Autenticação

A autenticação é gerenciada pelo `AuthContext.jsx`:

- **Login:** Envia credenciais ao backend (`/api/auth/login`), recebe JWT
- **Persistência:** Token JWT armazenado em localStorage
- **Proteção de rotas:** Componente `AdminRoute` verifica autenticação e role admin
- **Logout:** Remove token e redireciona

---

## 8. Camada de Serviços

### 8.1. api.js
Instância Axios configurada com `VITE_API_URL`, interceptors para JWT e tratamento de erros.

### 8.2. auth.js
- `login(email, password)` — Autenticação
- `register(data)` — Registro
- `resetPassword(email)` — Solicitar reset

### 8.3. plans.js
- `getPlans(audience)` — Buscar planos filtrados por audiência

### 8.4. payment.js
- `createSubscription(data)` — Criar assinatura PagBank
- Outros métodos de pagamento

### 8.5. pagbank.js / pagbank-subscriptions.js
Chamadas diretas às APIs PagBank via backend.

### 8.6. chavepublica.js
- `getPublicKey()` — Obter chave pública para criptografia de cartão

### 8.7. admin.js
- CRUD de usuários, assinaturas e pagamentos

### 8.8. firebase.js
Configuração do Firebase SDK client-side.

### 8.9. chat.js
Serviço de chatbot integrado.

---

## 9. Componentes

### 9.1. Layout
Componente wrapper com header, navegação principal, footer e cookie consent.

### 9.2. AdminRoute
Higher-Order Component que verifica autenticação e role admin antes de renderizar children.

### 9.3. Componentes de Pagamento
- `PagBankCheckout` — Checkout integrado PagBank
- `PagBankOneTimePayment` — Pagamento único
- `CardBrandIcon` — Ícone de bandeira (Visa, MasterCard, etc.)
- `InstallmentOptions` — Seleção de parcelamento

### 9.4. ChatBot
ChatBot integrado via widget, conectado ao n8n webhook.

### 9.5. Componentes UI (53 primitivos)
Biblioteca de componentes baseados em Radix UI + shadcn/ui pattern:
- Accordion, Alert, Avatar, Badge, Breadcrumb
- Button, Calendar, Card, Carousel, Chart
- Checkbox, Collapsible, Command, Context Menu
- Dialog, Drawer, Dropdown Menu, Form
- Hover Card, Input, Input OTP, Label
- Menubar, Navigation Menu, Pagination
- Popover, Progress, Radio Group, Resizable
- Scroll Area, Select, Separator, Sheet
- Sidebar, Skeleton, Slider, Sonner (toast)
- Switch, Table, Tabs, Textarea
- Toggle, Toggle Group, Tooltip

---

## 10. Hooks Customizados

| Hook | Descrição |
|---|---|
| `useMobile()` | Detecta se o dispositivo é móvel |
| `useScrollAnimation()` | Animação baseada em posição de scroll |
| `usePagBank()` | Integração com SDK PagBank |

---

## 11. Scripts de Teste

```powershell
pnpm test:pagbank          # Teste completo PagBank sandbox
pnpm test:pagbank:config   # Teste de configuração
pnpm test:pagbank:card     # Teste de cartão
pnpm test:pagbank:pix      # Teste de PIX
pnpm test:pagbank:boleto   # Teste de boleto
pnpm test:firebase         # Teste de integração Firebase
```

---

## 12. Build e Deploy

```powershell
# Build de produção
pnpm build

# Preview local do build
pnpm preview
```

O projeto inclui `Dockerfile` e `docker-compose.yml` para deploy containerizado. Também possui `firebase.json` para deploy via Firebase Hosting.

---

## 13. Convenções do Projeto

- **Path alias:** `@/*` mapeia para `src/*` (configurado em `jsconfig.json`)
- **Componentes:** PascalCase, export default
- **Hooks:** camelCase, prefixo `use`
- **Serviços:** camelCase
- **Formatação de inputs:** Masks mantidas nos componentes de página (CPF, cartão, validade)
- **Animações:** Framer Motion com `pageVariants` e `pageTransition` no `App.jsx`
- **Classes CSS:** Utilidade `cn()` de `src/lib/utils.js` para merge condicional de classes Tailwind
