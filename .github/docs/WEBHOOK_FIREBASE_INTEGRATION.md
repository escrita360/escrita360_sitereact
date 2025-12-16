# Integração Webhook PagBank → Firebase

## Visão Geral

Este documento descreve como o sistema cria automaticamente contas de usuário no Firebase quando um pagamento é aprovado pelo PagBank.

## Arquitetura

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────────┐
│    PagBank      │────▶│  Backend Node.js │────▶│  Firebase Projects  │
│  (Pagamento)    │     │    (Webhook)     │     │                     │
└─────────────────┘     └──────────────────┘     │  ┌───────────────┐  │
                                                 │  │escrita360aluno│  │
                                                 │  │   (Alunos)    │  │
                                                 │  └───────────────┘  │
                                                 │                     │
                                                 │  ┌───────────────┐  │
                                                 │  │   indivprof   │  │
                                                 │  │ (Professores) │  │
                                                 │  └───────────────┘  │
                                                 └─────────────────────┘
```

## Fluxo de Pagamento

1. **Cliente compra um plano** no site React
2. **PagBank processa o pagamento** e envia webhook
3. **Backend recebe o webhook** e identifica:
   - Tipo de plano (aluno ou professor)
   - Email do cliente
   - Senha (se fornecida)
4. **Cria conta no Firebase** correspondente
5. **Salva dados da assinatura** no Firestore

## Endpoints de Webhook

### POST `/api/webhook/pagbank`
Webhook principal para assinaturas recorrentes.

### POST `/api/webhook/pagbank/orders`
Webhook para pagamentos únicos (API moderna do PagBank).

### POST `/api/webhook/pagbank/transaction`
Webhook para transações avulsas.

### POST `/api/webhook/pagbank/simulate`
Endpoint de teste para simular criação de conta.

```bash
# Exemplo de simulação
curl -X POST http://localhost:5000/api/webhook/pagbank/simulate \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@exemplo.com",
    "password": "senhaSegura123",
    "displayName": "Nome do Usuário",
    "planType": "aluno"
  }'
```

## Configuração

### 1. Variáveis de Ambiente

Adicione ao arquivo `.env` do servidor:

```env
# Projeto ALUNO (escrita360aluno)
FIREBASE_ALUNO_PROJECT_ID=escrita360aluno
FIREBASE_ALUNO_SERVICE_ACCOUNT_PATH=./firebase-aluno-service-account.json

# Projeto PROFESSOR (indivprof)
FIREBASE_PROFESSOR_PROJECT_ID=indivprof
FIREBASE_PROFESSOR_SERVICE_ACCOUNT_PATH=./firebase-professor-service-account.json
```

### 2. Service Accounts

Gere as chaves de serviço no Firebase Console:

1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Selecione o projeto (escrita360aluno ou indivprof)
3. Vá em **Configurações do Projeto** → **Contas de serviço**
4. Clique em **Gerar nova chave privada**
5. Salve o arquivo JSON no diretório `server/`

### 3. Configurar URL do Webhook no PagBank

No painel do PagBank, configure a URL do webhook:

```
https://seu-dominio.com/api/webhook/pagbank
```

Para desenvolvimento local, use ngrok:

```bash
ngrok http 5000
# Use a URL gerada: https://abc123.ngrok.io/api/webhook/pagbank
```

## Mapeamento de Planos

O sistema mapeia automaticamente o tipo de plano para o projeto Firebase:

| Tipo de Plano | Projeto Firebase |
|---------------|------------------|
| `aluno` | escrita360aluno |
| `aluno_individual` | escrita360aluno |
| `aluno_mensal` | escrita360aluno |
| `aluno_anual` | escrita360aluno |
| `estudante` | escrita360aluno |
| `student` | escrita360aluno |
| `professor` | indivprof |
| `professor_individual` | indivprof |
| `professor_mensal` | indivprof |
| `professor_anual` | indivprof |
| `teacher` | indivprof |
| `docente` | indivprof |

## Passando a Senha no Pagamento

Para que a senha do usuário seja usada na criação da conta, inclua-a de uma das seguintes formas:

### Opção 1: Via Reference ID
```javascript
const reference_id = `${planType}|${password}|${uniqueId}`;
// Exemplo: "aluno|minhasenha123|user_12345"
```

### Opção 2: Via Metadata
```javascript
const metadata = {
  password: "minhasenha123",
  planType: "aluno"
};
```

### Opção 3: Via Campo Customer
```javascript
const customer = {
  email: "cliente@email.com",
  name: "Nome Cliente",
  password: "minhasenha123" // Campo customizado
};
```

## Estrutura de Dados no Firestore

Quando uma conta é criada, os dados são salvos assim:

```javascript
// Collection: users
// Document: {uid}
{
  email: "usuario@email.com",
  displayName: "Nome do Usuário",
  planType: "aluno",
  createdAt: Timestamp,
  updatedAt: Timestamp,
  subscription: {
    status: "active",
    startDate: Timestamp,
    pagbankCode: "SUB_ABC123",
    pagbankReference: "aluno|senha|ref123",
    planName: "Plano Aluno Mensal",
    amount: 2990, // em centavos
    paymentMethod: "CREDIT_CARD",
    approvedAt: "2024-01-15T10:30:00Z"
  }
}
```

## Status de Assinatura

| Status PagBank | Ação no Firebase |
|----------------|------------------|
| `ACTIVE` / `PAID` | Cria/ativa conta |
| `SUSPENDED` | Suspende acesso |
| `CANCELLED` | Desativa conta |
| `EXPIRED` | Marca como expirado |

## Tratamento de Erros

- Se o usuário já existir: atualiza dados (não sobrescreve senha)
- Se não houver senha: gera senha temporária (logada para debug)
- Erros não bloqueiam o webhook (retorna 200 OK)

## Testando a Integração

### 1. Teste Local

```bash
# Iniciar servidor
cd server
npm run dev

# Em outro terminal, simular webhook
curl -X POST http://localhost:5000/api/webhook/pagbank/simulate \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@exemplo.com",
    "password": "Teste123!",
    "planType": "aluno"
  }'
```

### 2. Verificar no Firebase

1. Acesse o [Firebase Console](https://console.firebase.google.com)
2. Selecione o projeto apropriado
3. Vá em **Authentication** → **Users**
4. Confirme que o usuário foi criado
5. Vá em **Firestore** → **users**
6. Confirme os dados da assinatura

## Logs

O sistema produz logs detalhados:

```
🔔 Webhook PagBank recebido
📦 Body: {...}
📊 Processando notificação tipo: preApproval
✅ Pagamento aprovado - criando conta do usuário
🔥 Criando conta Firebase para: user@email.com (plano: aluno)
✅ Novo usuário criado: ABC123XYZ
💾 Dados salvos no Firestore para usuário ABC123XYZ
```

## Troubleshooting

### Erro: "Projeto Firebase não está configurado"
- Verifique se as variáveis de ambiente estão corretas
- Confirme que os arquivos de service account existem

### Erro: "auth/email-already-exists"
- Normal se o usuário já existe
- O sistema atualiza os dados sem sobrescrever a senha

### Webhook não está sendo chamado
- Verifique a URL configurada no PagBank
- Use ngrok para desenvolvimento local
- Confirme que o servidor está rodando

### Senha não está sendo salva
- Verifique como está passando a senha (reference, metadata ou customer)
- Se não houver senha, uma temporária é gerada

## Segurança

⚠️ **Importante:**
- Nunca commite arquivos de service account no git
- Use variáveis de ambiente ou secrets em produção
- Para deploy em cloud, use a opção de JSON em Base64
- Valide a origem das requisições de webhook em produção
