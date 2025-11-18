# Área Administrativa - Escrita360

## Visão Geral

A área administrativa do Escrita360 permite gerenciar usuários, assinaturas e pagamentos integrados com Firebase.

## Acesso

- **URL**: `http://localhost:5173/admin`
- **Emails autorizados**: 
  - `admin@escrita360.com`
  - `suporte@escrita360.com`

Para adicionar novos administradores, edite o arquivo `server/app/middleware/adminAuth.js`.

## Funcionalidades

### Dashboard (`/admin`)
- Visualização de estatísticas gerais
- Total de usuários cadastrados
- Assinaturas ativas
- Pagamentos do mês
- Receita mensal

### Gerenciar Usuários (`/admin/users`)
- Listar todos os usuários do Firebase Auth
- Buscar usuários por email, nome ou UID
- Visualizar detalhes completos de cada usuário
- Desabilitar/habilitar usuários
- Ver assinaturas vinculadas ao usuário
- Definir permissões customizadas (claims)

### Gerenciar Assinaturas (`/admin/subscriptions`)
- Listar todas as assinaturas do Firestore
- Visualizar detalhes das assinaturas
- Alterar status (ativa, pendente, cancelada, expirada)
- Ver metadados e histórico

### Histórico de Pagamentos (`/admin/payments`)
- Listar todas as transações
- Filtrar por status
- Ver resumo financeiro
- Total de transações aprovadas
- Receita total calculada

## Configuração do Backend

### 1. Instalar dependências

```bash
cd server
npm install firebase-admin
```

### 2. Configurar credenciais do Firebase

Crie um arquivo `.env` no diretório `server/`:

```env
# Firebase Admin SDK
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"..."}
FIREBASE_DATABASE_URL=https://seu-projeto.firebaseio.com

# JWT Secret
JWT_SECRET_KEY=seu_jwt_secret_aqui
```

Ou defina apenas a variável `FIREBASE_SERVICE_ACCOUNT` com o JSON da sua conta de serviço.

### 3. Obter credenciais do Firebase

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto
3. Vá em **Configurações do Projeto** > **Contas de Serviço**
4. Clique em **Gerar nova chave privada**
5. Salve o arquivo JSON ou copie seu conteúdo para a variável de ambiente

## Estrutura de Arquivos

```
server/
├── app/
│   ├── middleware/
│   │   └── adminAuth.js          # Middleware de autenticação admin
│   ├── routes/
│   │   ├── admin.js              # Rotas da API admin
│   │   ├── auth.js               # Rotas de autenticação
│   │   └── payment.js            # Rotas de pagamento
│   └── services/
│       └── firebase_admin_service.js  # Serviço Firebase Admin
└── app.js                        # Aplicação principal

src/
├── pages/
│   └── admin/
│       ├── AdminDashboard.jsx    # Dashboard principal
│       ├── AdminUsers.jsx        # Gerenciamento de usuários
│       ├── AdminSubscriptions.jsx # Gerenciamento de assinaturas
│       └── AdminPayments.jsx     # Histórico de pagamentos
└── services/
    └── admin.js                  # Serviço de comunicação com API admin
```

## Endpoints da API

### Estatísticas
- `GET /api/admin/dashboard/stats` - Estatísticas gerais

### Usuários
- `GET /api/admin/users` - Listar usuários (paginado)
- `GET /api/admin/users/:uid` - Detalhes de um usuário
- `PUT /api/admin/users/:uid/disable` - Desabilitar/habilitar usuário
- `PUT /api/admin/users/:uid/claims` - Definir claims customizados
- `GET /api/admin/users/:uid/subscriptions` - Assinaturas do usuário

### Assinaturas
- `GET /api/admin/subscriptions` - Listar assinaturas (paginado)
- `PUT /api/admin/subscriptions/:id/status` - Atualizar status

### Pagamentos
- `GET /api/admin/payments` - Listar pagamentos (paginado)

## Segurança

### Autenticação
- Todos os endpoints requerem token JWT válido
- Token deve ser enviado no header: `Authorization: Bearer <token>`

### Autorização
- Apenas emails listados em `ADMIN_EMAILS` têm acesso
- Middleware `requireAdmin` verifica permissões em cada requisição

### Recomendações
- **Produção**: Use banco de dados para gerenciar admins
- **Produção**: Implemente logs de auditoria
- **Produção**: Use HTTPS obrigatório
- **Produção**: Adicione rate limiting
- **Produção**: Configure CORS adequadamente

## Estrutura de Dados Firebase

### Coleção: `subscriptions`
```javascript
{
  id: "sub_123",
  userId: "firebase_user_uid",
  planId: "plan_mensal",
  planName: "Plano Mensal",
  status: "active",
  amount: 2990,  // em centavos
  interval: "monthly",
  createdAt: Timestamp,
  updatedAt: Timestamp,
  nextBillingDate: Timestamp,
  metadata: {}
}
```

### Coleção: `payments`
```javascript
{
  id: "pay_123",
  userId: "firebase_user_uid",
  subscriptionId: "sub_123",
  amount: 2990,  // em centavos
  status: "paid",
  paymentMethod: "credit_card",
  description: "Plano Mensal",
  createdAt: Timestamp,
  paidAt: Timestamp,
  metadata: {}
}
```

## Desenvolvimento

### Executar servidor
```bash
cd server
npm start
```

### Executar frontend
```bash
pnpm dev
```

### Acessar área admin
1. Faça login com email admin (ex: `admin@escrita360.com`)
2. Acesse: `http://localhost:5173/admin`

## Troubleshooting

### Erro: "Firebase Admin não inicializado"
- Verifique se `FIREBASE_SERVICE_ACCOUNT` está configurado
- Valide o JSON da conta de serviço

### Erro: "Acesso negado"
- Confirme que seu email está em `ADMIN_EMAILS`
- Verifique se o token JWT é válido

### Erro: "Token inválido"
- Faça logout e login novamente
- Verifique se `JWT_SECRET_KEY` é o mesmo no backend e frontend

## Próximos Passos

- [ ] Adicionar filtros avançados de busca
- [ ] Implementar exportação de relatórios
- [ ] Adicionar gráficos de dashboard
- [ ] Criar logs de auditoria
- [ ] Implementar notificações de eventos importantes
- [ ] Adicionar suporte a múltiplos idiomas
