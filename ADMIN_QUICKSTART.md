# Guia Rápido - Área Administrativa

## Instalação

### 1. Instalar dependências do servidor

```bash
cd server
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite `.env` e adicione suas credenciais do Firebase Admin SDK.

### 3. Obter credenciais Firebase

1. Acesse: https://console.firebase.google.com/
2. Selecione seu projeto
3. Vá em **Configurações** (ícone de engrenagem) > **Configurações do Projeto**
4. Aba **Contas de Serviço**
5. Clique em **Gerar nova chave privada**
6. Salve o arquivo JSON

### 4. Configurar credenciais no .env

Copie o conteúdo do JSON da conta de serviço e coloque em uma única linha na variável `FIREBASE_SERVICE_ACCOUNT`.

## Como Usar

### 1. Iniciar o servidor

```bash
cd server
npm start
```

O servidor rodará em: `http://localhost:5000`

### 2. Iniciar o frontend

Em outro terminal:

```bash
pnpm dev
```

O site rodará em: `http://localhost:5173`

### 3. Fazer login como admin

1. Acesse: `http://localhost:5173/login`
2. Use um dos emails admin:
   - `admin@escrita360.com`
   - `suporte@escrita360.com`
3. Senha: qualquer senha (no momento é simulação)

### 4. Acessar área admin

Após login, acesse: `http://localhost:5173/admin`

## Adicionar Novos Admins

Edite o arquivo: `server/app/middleware/adminAuth.js`

```javascript
const ADMIN_EMAILS = [
  'admin@escrita360.com',
  'suporte@escrita360.com',
  'seu.email@exemplo.com'  // Adicione aqui
];
```

## Estrutura de Dados no Firebase

### Coleção: subscriptions

```javascript
{
  userId: "uid_do_usuario",
  planName: "Plano Mensal",
  planId: "plan_mensal",
  status: "active",
  amount: 2990,
  interval: "monthly",
  createdAt: Timestamp,
  nextBillingDate: Timestamp
}
```

### Coleção: payments

```javascript
{
  userId: "uid_do_usuario",
  subscriptionId: "id_da_assinatura",
  amount: 2990,
  status: "paid",
  paymentMethod: "credit_card",
  createdAt: Timestamp,
  paidAt: Timestamp
}
```

## Funcionalidades

- ✅ Dashboard com estatísticas
- ✅ Gerenciar usuários (listar, desabilitar, visualizar)
- ✅ Gerenciar assinaturas (listar, alterar status)
- ✅ Histórico de pagamentos
- ✅ Busca de usuários
- ✅ Proteção de rotas (apenas admins)

## Troubleshooting

**Erro: "Firebase Admin não inicializado"**
- Verifique se o `.env` está configurado corretamente
- Confirme que o JSON da conta de serviço está válido

**Erro: "Acesso negado"**
- Confirme que seu email está na lista `ADMIN_EMAILS`
- Faça logout e login novamente

**Servidor não inicia**
- Verifique se a porta 5000 está livre
- Rode: `npm install` novamente

## Próximos Passos

1. Configure Firebase com dados reais
2. Adicione usuários no Firebase Auth
3. Crie assinaturas e pagamentos de teste
4. Teste todas as funcionalidades
5. Configure CORS para produção
6. Adicione HTTPS em produção
