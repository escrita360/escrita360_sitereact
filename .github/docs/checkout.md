Passar para o conteúdo principal
Central de Ajuda da InfinitePay
Maquininha
Máquina de cartão grátis
Acesse sua conta 🔒

Português do Brasil
Português do Brasil
Pesquisar artigos...
Pesquisar artigos...
📝 Antes de começar
👉 Acesso
🔧 Como funciona a integração?
1️⃣ Criando o link de pagamento
2️⃣ Depois que o pagamento acontecer
3️⃣ Confirmando se o pagamento foi aprovado
🎯 Como responder ao webhook?
💡 Dicas práticas
Todas as coleções
Vendas Online
Link de Pagamento
Como usar o Checkout da InfinitePay?
Como usar o Checkout da InfinitePay?
Gere um link e leve seu cliente direto para o pagamento!

Atualizado há mais de 2 meses
Vamos te mostrar como conectar seu site com a InfinitePay de um jeito bem simples! Com essa integração, você vai poder gerar links de pagamento automaticamente e acompanhar as vendas em tempo real.

 

 

📝 Antes de começar
Algumas coisinhas importantes que você precisa saber:

Vendedor: É você, o dono do site de vendas

Comprador: A pessoa que vai fazer a compra

Handle: Sua InfiniteTag (aquela identificação que aparece no cantinho superior esquerdo do app). Use ela sem o símbolo $ do início

order_nsu: É basicamente o número do pedido no seu sistema

 

 

👉 Acesso 
Para configurar as credenciais necessárias, é só acessar sua conta na web!

 

Acesse sua conta

Vá em Configurações

Clique em Link integrado

Configure como preferir!

 

 

🔧 Como funciona a integração?
O processo é bem direto: quando alguém faz um pedido no seu site, você envia os dados para a InfinitePay, recebe um link de pagamento e direciona seu cliente para finalizar a compra. Simples assim!

 

1️⃣ Criando o link de pagamento
Enviando o pedido pra InfinitePay

Assim que seu cliente fizer um pedido, você vai enviar uma requisição POST pra gente:

 

POST https://api.infinitepay.io/invoices/public/checkout/links

Aqui está um exemplo simples de como montar sua requisição:
json
{
  "handle": "sua_infinite_tag",
  "redirect_url": "https://seusite.com/obrigado",
  "webhook_url": "https://seusite.com/webhook", 
  "order_nsu": "123456",
  "items": [
    {
      "quantity": 1,
      "price": 1000,
      "description": "Curso de Vendas Online"
    },
    {
      "quantity": 1,
      "price": 500,
      "description": "Taxa de entrega"
    }
  ]
}
Dica: O preço sempre vai em centavos. Então R$ 10,00 = 1000 centavos!

 

Quer incluir os dados do cliente?

Se você já tem as informações do comprador, pode enviar junto para facilitar o processo:

 

json
{
  "handle": "sua_infinite_tag",
  "redirect_url": "https://seusite.com/obrigado",
  "order_nsu": "123456",
  "customer": {
    "name": "João Silva",
    "email": "joao@email.com",
    "phone_number": "+5511999887766"
  },
  "items": [...]
}
 

E o endereço também?

Se o seu produto precisa ser entregue em mãos, você pode incluir o endereço:

 

json
{
  "handle": "sua_infinite_tag",
  "redirect_url": "https://seusite.com/obrigado",
  "order_nsu": "123456",
  "address": {
    "cep": "12345678",
    "number": "123",
    "complement": "Apto 45"
  },
  "items": [...]
}
 

Recebendo o link de pagamento

Se tudo der certo, você vai receber uma resposta assim:

 

json
{
  "url": "https://checkout.infinitepay.com.br/sua_tag?lenc=codigo_unico"
}
Agora é só direcionar seu cliente para essa URL! 🎯

 

2️⃣ Depois que o pagamento acontecer
Redirecionamento automático

Quando seu cliente finalizar o pagamento, ele volta automaticamente pro seu site (na redirect_url que você configurou). A URL vai vir com alguns parâmetros importantes:

receipt_url - Link do comprovante de pagamento: você pode disponibilizar esse link para o comprador

order_nsu - O número do pedido no seu sistema (que você enviou)

slug - Código da fatura na InfinitePay

capture_method - Como foi pago ("credit_card" ou "pix")

transaction_nsu - ID único da transação

3️⃣ Confirmando se o pagamento foi aprovado
Agora você tem duas opções para verificar se o pagamento realmente aconteceu:

Opção 1: Verificação manual (sem webhook)

Você pode consultar o status do pagamento fazendo uma requisição:

 

POST https://api.infinitepay.io/invoices/public/checkout/payment_check

Corpo da requisição:
json
{
  "handle": "sua_infinite_tag",
  "order_nsu": "123456",
  "transaction_nsu": "UUID-que-recebeu",
  "slug": "codigo-da-fatura"
}
Resposta:
json
{
  "success": true,
  "paid": true,
  "amount": 1500,
  "paid_amount": 1510,
  "installments": 1,
  "capture_method": "pix"
}
 

Opção 2: Webhook

Se você configurou o webhook_url, a gente envia os dados da venda automaticamente pro seu sistema:


json
{
  "invoice_slug": "abc123",
  "amount": 1000,
  "paid_amount": 1010,
  "installments": 1,
  "capture_method": "credit_card",
  "transaction_nsu": "UUID",
  "order_nsu": "UUID-do-pedido",
  "receipt_url": "https://comprovante.com/123",
  "items": [...]
}
 

 

🎯 Como responder ao webhook?
Importante: Responda rapidamente (de preferência em menos de 1 segundo) com um desses códigos:

 

✅ Se deu tudo certo:

Status: 200 OK
{
  "success": true,
  "message": null
}
❗ Se algo deu errado:

Status: 400 Bad Request
{
  "success": false,
  "message": "Pedido não encontrado"
}
Dica: Se você responder com erro 400, a gente tenta enviar novamente! 

 

 

💡 Dicas práticas
Webhook é mais eficiente que ficar consultando manualmente

Sempre valide se o order_nsu corresponde a um pedido real no seu sistema

Guarde o transaction_nsu pra futuras consultas

Teste bastante no ambiente de desenvolvimento antes de colocar no ar

 

Se ficou com alguma dúvida ou encontrou algum problema, nossa equipe está aqui pra te ajudar! 

 

 

🔔 Precisa de ajuda?

Fale com nossa equipe pelo chat no App InfinitePay.

 

🔒 Cuide da sua segurança!

A InfinitePay entra em contato apenas através de canais oficiais e números verificados. Nunca clique em links suspeitos ou compartilhe senhas e códigos de segurança.

Respondeu à sua pergunta?
😞😐😃
Central de Ajuda da InfinitePay
InstagramTikTokYouTubeFacebookTwitterBlog
