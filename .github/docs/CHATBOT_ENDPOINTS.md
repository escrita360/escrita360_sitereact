# Endpoints do Chatbot

Este documento descreve os endpoints da API para o sistema de chatbot do Escrita360.

## 📡 Endpoint Principal

### Enviar Mensagem

**Endpoint:** `POST /api/chat/message`

**Descrição:** Envia uma mensagem do usuário para o chatbot e recebe uma resposta automatizada.

#### Headers
```
Content-Type: application/json
Authorization: Bearer <token>  # Opcional, dependendo da implementação
```

#### Body da Requisição
```json
{
  "message": "string"
}
```

**Campos obrigatórios:**
- `message`: A mensagem enviada pelo usuário (string não vazia)

#### Resposta de Sucesso (200 OK)
```json
{
  "response": "string"
}
```

**Campos da resposta:**
- `response`: A resposta gerada pelo chatbot

#### Respostas de Erro

**400 Bad Request** - Mensagem inválida
```json
{
  "error": "Mensagem não pode estar vazia"
}
```

**401 Unauthorized** - Token inválido (se autenticação for requerida)
```json
{
  "error": "Token de autenticação inválido"
}
```

**500 Internal Server Error** - Erro interno do servidor
```json
{
  "error": "Erro interno do servidor"
}
```

## 🔧 Implementação no Frontend

O frontend React utiliza o serviço `chatService` localizado em `src/services/chat.js`:

```javascript
import { chatService } from '@/services/chat.js'

// Exemplo de uso
const response = await chatService.sendMessage("Olá, como posso ajudar?")
console.log(response.response) // "Olá! Como posso ajudá-lo hoje?"
```

## 🧪 Exemplos de Teste

### Exemplo 1: Mensagem simples
```bash
curl -X POST http://localhost:5000/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{"message": "Olá"}'
```

**Resposta esperada:**
```json
{
  "response": "Olá! Como posso ajudá-lo hoje?"
}
```

### Exemplo 2: Mensagem com pergunta
```bash
curl -X POST http://localhost:5000/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{"message": "Quais são os planos disponíveis?"}'
```

**Resposta esperada:**
```json
{
  "response": "Temos três planos: Básico, Pro e Premium. Cada um com diferentes recursos..."
}
```

## 📝 Notas de Implementação

- O chatbot deve ser capaz de lidar com mensagens em português
- As respostas devem ser contextuais e úteis para usuários do Escrita360
- Considere implementar rate limiting para evitar abuso
- Logs de conversas podem ser úteis para análise e melhoria do chatbot
- O endpoint deve ser rápido (< 2s) para boa experiência do usuário

## 🔗 Integração

Este endpoint é integrado ao componente `ChatBot.jsx` no frontend, que fornece uma interface de chat em tempo real para os usuários.</content>
<parameter name="filePath">c:\Users\marti\Documents\GitHub\escrita360_react\docs\CHATBOT_ENDPOINTS.md