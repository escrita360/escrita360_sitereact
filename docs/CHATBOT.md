# DOCUMENTAÇÃO CHATBOT ESCRITA360

---

## CONFIGURAÇÃO NO FRONTEND

### Variáveis de Ambiente
Configure a URL do chatbot no arquivo `.env`:
```
VITE_CHATBOT_URL=https://escrita360-n8n.nnjeij.easypanel.host/webhook
```

Se não definida, o código usa `VITE_API_URL` como fallback.

### Como Rodar
1. Instalar dependências: `pnpm install`
2. Rodar servidor de desenvolvimento: `pnpm dev`
3. Abrir no browser: `http://localhost:5173/`
4. Clicar no botão do chat (canto inferior direito)
5. Preencher formulário inicial (nome, email, telefone)
6. Seguir o fluxo de botões até finalizar

### Arquivos Modificados
- `src/services/chat.js`: Serviço para integração com endpoints do chatbot
- `src/components/ChatBot.jsx`: Componente UI com formulário inicial e fluxo de conversa
- `.env`: Configuração da URL do chatbot

---

## BASE URL
```
https://escrita360-n8n.nnjeij.easypanel.host/webhook
```

---

## ENDPOINTS DISPONÍVEIS

1. **POST** `/chatbot/start` - Iniciar conversa
2. **POST** `/chatbot/message` - Enviar escolha do usuário
3. **POST** `/chatbot/finalize` - Finalizar e criar lead

---

# 1. INICIAR CONVERSA

## Endpoint:
```
POST /chatbot/start
```

## Descrição:
Inicia uma nova conversa com o chatbot. Deve ser chamado quando o usuário preencher o formulário inicial com nome, email e telefone.

## Headers:
```
Content-Type: application/json
```

## Body (Envio):
```json
{
  "nome": "Maria Silva",
  "email": "maria@email.com",
  "telefone": "11987654321"
}
```

### Campos Obrigatórios:
| Campo    | Tipo   | Descrição                 |
| -------- | ------ | ------------------------- |
| nome     | string | Nome completo do usuário  |
| email    | string | Email válido              |
| telefone | string | Telefone (apenas números) |
|          |        |                           |

## Response (Resposta):
```json
{
  "session_id": "abc-123-xyz-789",
  "message": "Bem-vindo, Maria Silva! Quem é você?",
  "buttons": [
    {
      "id": "estudante",
      "text": "Sou Estudante"
    },
    {
      "id": "professor",
      "text": "Sou Professor"
    },
    {
      "id": "escola",
      "text": "Represento uma Escola"
    }
  ]
}
```

### Campos da Resposta:
| Campo | Tipo | Descrição |
|-------|------|-----------|
| session_id | string | ID único da sessão (UUID). GUARDAR para uso em todas as próximas chamadas |
| message | string | Mensagem a ser exibida para o usuário |
| buttons | array | Lista de botões com opções de escolha |
| buttons[].id | string | **ID do botão - usar este valor no próximo envio** |
| buttons[].text | string | Texto a ser exibido no botão |

## Observações Importantes:
- ⚠️ **GUARDAR o `session_id`** retornado - será usado em TODAS as próximas requisições
- ⚠️ Sempre enviar o **`id`** do botão escolhido, nunca o `text`

---

# 2. ENVIAR ESCOLHA DO USUÁRIO

## Endpoint:
```
POST /chatbot/message
```

## Descrição:
Envia a escolha do usuário (clique em um botão) e recebe a próxima pergunta do chatbot.

## Headers:
```
Content-Type: application/json
```

## Body (Envio):
```json
{
  "session_id": "abc-123-xyz-789",
  "choice": "estudante"
}
```

### Campos Obrigatórios:
| Campo | Tipo | Descrição |
|-------|------|-----------|
| session_id | string | Session ID retornado no `/start` ou na requisição anterior |
| choice | string | **ID do botão** clicado pelo usuário (não enviar o texto) |

## Response (Resposta - Exemplo 1):
```json
{
  "message": "Qual é o seu objetivo com as redações?",
  "buttons": [
    {
      "id": "enem",
      "text": "ENEM"
    },
    {
      "id": "vestibular",
      "text": "Vestibular"
    },
    {
      "id": "concurso",
      "text": "Concurso"
    },
    {
      "id": "melhorar",
      "text": "Melhorar Escrita"
    }
  ],
  "user_data": {
    "nome": "Maria Silva",
    "email": "maria@email.com",
    "telefone": "11987654321"
  }
}
```

## Response (Resposta - Exemplo 2 - Última etapa):
```json
{
  "message": "Perfeito! Clique no botão abaixo para finalizar:",
  "buttons": [
    {
      "id": "comprar",
      "text": "VOU COMPRAR"
    }
  ],
  "user_data": {
    "nome": "Maria Silva",
    "email": "maria@email.com",
    "telefone": "11987654321"
  }
}
```

### Campos da Resposta:
| Campo | Tipo | Descrição |
|-------|------|-----------|
| message | string | Próxima mensagem a ser exibida |
| buttons | array | Lista de botões com as próximas opções |
| buttons[].id | string | **ID do botão - usar no próximo envio** |
| buttons[].text | string | Texto do botão |
| user_data | object | Dados do usuário (opcional - apenas para referência) |

## Observações Importantes:
- ⚠️ Sempre usar o **`id`** do botão, nunca o `text`
- ⚠️ Manter o mesmo `session_id` durante toda a conversa
- ⚠️ Quando o botão retornado for `"id": "comprar"`, NÃO chamar `/message` novamente, ir direto para `/finalize`

---

# 3. FINALIZAR E CRIAR LEAD

## Endpoint:
```
POST /chatbot/finalize
```

## Descrição:
Finaliza a conversa e cria o lead no sistema. Deve ser chamado quando o usuário clicar no botão "VOU COMPRAR".

## Headers:
```
Content-Type: application/json
```

## Body (Envio):
```json
{
  "session_id": "abc-123-xyz-789"
}
```

### Campos Obrigatórios:
| Campo | Tipo | Descrição |
|-------|------|-----------|
| session_id | string | Session ID da conversa atual |

## Response (Resposta):
```json
{
  "success": true,
  "message": "Ótimo!! Alguém do nosso time entrará em contato com você através das plataformas identificadas.",
  "lead_id": 1
}
```
---

# FLUXO COMPLETO DE CONVERSA

## Exemplo: Usuário Estudante → ENEM → Gramática → Premium

### Passo 1: Iniciar
**Request:**
```json
POST /chatbot/start
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "telefone": "11999999999"
}
```

**Response:**
```json
{
  "session_id": "uuid-gerado-123",
  "message": "Bem-vindo, João Silva! Quem é você?",
  "buttons": [
    {"id": "estudante", "text": "Sou Estudante"},
    {"id": "professor", "text": "Sou Professor"},
    {"id": "escola", "text": "Represento uma Escola"}
  ]
}
```

**Ação:** Usuário clica em "Sou Estudante"

---

### Passo 2: Escolher Perfil
**Request:**
```json
POST /chatbot/message
{
  "session_id": "uuid-gerado-123",
  "choice": "estudante"
}
```

**Response:**
```json
{
  "message": "Qual é o seu objetivo com as redações?",
  "buttons": [
    {"id": "enem", "text": "ENEM"},
    {"id": "vestibular", "text": "Vestibular"},
    {"id": "concurso", "text": "Concurso"},
    {"id": "melhorar", "text": "Melhorar Escrita"}
  ],
  "user_data": {
    "nome": "João Silva",
    "email": "joao@email.com",
    "telefone": "11999999999"
  }
}
```

**Ação:** Usuário clica em "ENEM"

---

### Passo 3: Escolher Objetivo
**Request:**
```json
POST /chatbot/message
{
  "session_id": "uuid-gerado-123",
  "choice": "enem"
}
```

**Response:**
```json
{
  "message": "Qual sua maior dificuldade com redações?",
  "buttons": [
    {"id": "ideias", "text": "Ter ideias"},
    {"id": "estrutura", "text": "Estruturar texto"},
    {"id": "gramatica", "text": "Gramática"},
    {"id": "tempo", "text": "Tempo de escrita"},
    {"id": "argumentacao", "text": "Argumentação"}
  ],
  "user_data": {
    "nome": "João Silva",
    "email": "joao@email.com",
    "telefone": "11999999999"
  }
}
```

**Ação:** Usuário clica em "Gramática"

---

### Passo 4: Escolher Dificuldade
**Request:**
```json
POST /chatbot/message
{
  "session_id": "uuid-gerado-123",
  "choice": "gramatica"
}
```

**Response:**
```json
{
  "message": "Perfeito! Temos a solução ideal para você. Escolha o plano:",
  "buttons": [
    {"id": "basico", "text": "Plano Básico - R$ 29,90"},
    {"id": "padrao", "text": "Plano Padrão - R$ 49,90"},
    {"id": "premium", "text": "Plano Premium - R$ 89,90"},
    {"id": "institucional", "text": "Plano Institucional"}
  ],
  "user_data": {
    "nome": "João Silva",
    "email": "joao@email.com",
    "telefone": "11999999999"
  }
}
```

**Ação:** Usuário clica em "Plano Premium - R$ 89,90"

---

### Passo 5: Escolher Plano
**Request:**
```json
POST /chatbot/message
{
  "session_id": "uuid-gerado-123",
  "choice": "premium"
}
```

**Response:**
```json
{
  "message": "Perfeito! Clique no botão abaixo para finalizar:",
  "buttons": [
    {"id": "comprar", "text": "VOU COMPRAR"}
  ],
  "user_data": {
    "nome": "João Silva",
    "email": "joao@email.com",
    "telefone": "11999999999"
  }
}
```

**Ação:** Usuário clica em "VOU COMPRAR"

---

### Passo 6: Finalizar
**Request:**
```json
POST /chatbot/finalize
{
  "session_id": "uuid-gerado-123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Ótimo!! Alguém do nosso time entrará em contato com você através das plataformas identificadas.",
  "lead_id": 42
}
```

---

# TABELA DE OPÇÕES (IDs)

## Perfil:
| ID | Texto |
|----|-------|
| estudante | Sou Estudante |
| professor | Sou Professor |
| escola | Represento uma Escola |

## Objetivo (Estudante):
| ID | Texto |
|----|-------|
| enem | ENEM |
| vestibular | Vestibular |
| concurso | Concurso |
| melhorar | Melhorar Escrita |

## Local de Ensino (Professor):
| ID | Texto |
|----|-------|
| escola_particular | Escola Particular |
| escola_publica | Escola Pública |
| aulas_particulares | Aulas Particulares |
| online | Online |

## Porte (Escola):
| ID | Texto |
|----|-------|
| ate_100 | Até 100 alunos |
| 100_500 | 100 a 500 alunos |
| mais_500 | Mais de 500 alunos |

## Dificuldade:
| ID | Texto |
|----|-------|
| ideias | Ter ideias |
| estrutura | Estruturar texto |
| gramatica | Gramática |
| tempo | Tempo de escrita |
| argumentacao | Argumentação |

## Plano:
| ID | Texto |
|----|-------|
| basico | Plano Básico - R$ 29,90 |
| padrao | Plano Padrão - R$ 49,90 |
| premium | Plano Premium - R$ 89,90 |
| institucional | Plano Institucional |

## Ação Final:
| ID | Texto |
|----|-------|
| comprar | VOU COMPRAR |

---

# REGRAS IMPORTANTES

1. ⚠️ **SEMPRE usar o `id` do botão**, nunca o `text`
2. ⚠️ **Guardar o `session_id`** do `/start` e usar em todas as chamadas
3. ⚠️ **Manter o mesmo `session_id`** durante toda a conversa
4. ⚠️ Quando receber botão com `"id": "comprar"`, chamar `/finalize` (não `/message`)
5. ⚠️ O `session_id` é um UUID único para cada conversa