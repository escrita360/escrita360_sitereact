Ambientes Disponíveis
Ambiente	URL
Produção	https://ws.pagseguro.uol.com.br/pre-approvals/
Sandbox	https://ws.sandbox.pagseguro.uol.com.br/pre-approvals/

Providers
Segue abaixo todos os Providers da API Recorrência.

As requisições HTTP devem conter os seguintes itens no cabeçalho:

Accept: application/vnd.pagseguro.com.br.v3+xml;charset=ISO-8859-1
Content-Type: application/xml;charset=ISO-8859-1

Provider	Descrição
/pre-approvals/request/?	Criação do plano.
/v2/sessions?	Iniciar sessão para aderir um plano.
/pre-approvals?	Adesão do plano.
/pre-approvals/payment?	Cobrança plano.
/pre-approvals/{{preApprovalCode}}/status?	Suspender um plano.
/pre-approvals/{{preApprovalCode}}/status?	Reativar um plano.
/pre-approvals/request/{{preApprovalRequestCode}}/payment?	Edição de Valor e planos.
/pre-approvals/{{preApprovalCode}}/discount?	Incluir um desconto no pagamento.
/pre-approvals/{{preApprovalCode}}/payment-method?	Mudar meio de pagamento.
/pre-approvals/{preApprovalCode}/cancel?	Cancelamento de Adesão.
/pre-approvals/{{preApprovalCode}}/payment-orders/{{paymentOrderCode}}/payment?	Retentativa de Pagamento.



Providers - Fluxo básico
Provider	Descrição
/pre-approvals/request/?	Criação do plano.
/v2/sessions?	Iniciar sessão para aderir um plano.
/pre-approvals?	Adesão do plano.
/pre-approvals/payment?	Cobrança plano.
/pre-approvals/{{preApprovalCode}}/status?	Retentativa de pagamento


Criar Plano
post
https://ws.sandbox.pagseguro.uol.com.br/pre-approvals/request/?email={email}&token={token}
Log in to see full request history
time	status	user agent	
Make a request to see history.

Path Params
email
string
required
email de sua conta sandbox

token
string
required
token de sua conta sandbox

Body Params
redirectURL
string
URL para onde o assinante será redirecionado após a finalização do fluxo de pagamento. Este valor somente será utilizado caso queira utilizar este plano em um Pagamento Recorrente via botão.

reference
string
required
Código/Identificador para fazer referência a assinatura em seu sistema.

preApproval
object
Configurações do plano.


preApproval object
reviewURL
string
URL para onde o assinante será redirecionado, durante o fluxo de pagamento, caso o mesmo queira alterar/revisar as regras da assinatura. Este valor somente será utilizado caso queira utilizar este plano em um Pagamento Recorrente via botão.

maxUses
int32
Quantidade máxima de consumidores que podem aderir ao plano.

receiver
object
Dados da sua empresa.


receiver object
Headers
Accept
string
Defaults to application/vnd.pagseguro.com.br.v3+xml;charset=ISO-8859-1
application/vnd.pagseguro.com.br.v3+xml;charset=ISO-8859-1
Content-Type
string
Defaults to application/xml;charset=ISO-8859-1
application/xml;charset=ISO-8859-1
Responses

200
200


400
400

Gerando uma sessão
post
https://ws.sandbox.pagseguro.uol.com.br/sessions/email={email}&token={token}
Log in to see full request history
time	status	user agent	
Make a request to see history.

Path Params
email
string
required
Email de sua conta

token
string
required
Token de sua conta

Responses

200
200


400
400

Adesão ao plano
post
https://ws.sandbox.pagseguro.uol.com.br/pre-approvals?email={email}&token={token}
Log in to see full request history
time	status	user agent	
Make a request to see history.

Path Params
email
string
required
email de sua conta sandbox

token
string
required
token de sua conta sandbox

Body Params
plan
string
required
Código do plano ao qual a assinatura será vinculada. Formato: Obtido no método /pre-approvals/request.

reference
string
Código de referência da assinatura no seu sistema. Formato: Livre, com no mínimo 1 e no máximo 200 caracteres.

sender
object
Dados do assinante.


sender object
paymentMethod
object
Dados do pagamento.


paymentMethod object
Headers
Content-Type
string
application/json

Accept
string
application/vnd.pagseguro.com.br.v3+json;charset=ISO-8859-1

Responses

200
200


400
400

Cobrar plano
post
https://ws.sandbox.pagseguro.uol.com.br/pre-approvals/payment?email={email}&token={token}
Log in to see full request history
time	status	user agent	
Make a request to see history.

Path Params
email
string
required
email de sua conta sandbox

token
string
required
token de sua conta sandbox

Body Params
preApprovalCode
string
required
Código da recorrência obtido no método /pre-approvals.

reference
string
Código/Identificador para fazer referência à recorrência em seu sistema.

senderHash
string
Identificador (fingerprint) gerado pelo vendedor por meio do JavaScript do PagSeguro. Obrigatório se senderIp for nulo. Formato: Obtido a partir do método Javascript PagseguroDirectPayment.getSenderHash()

senderIp
string
Endereço de IP de origem da assinatura, relacionado ao assinante. Obrigatório se hash for nulo. Formato: 4 números, de 0 a 255, separados por ponto

items
object
Lista de itens contidos na recorrencia.


items object
Headers
Content-Type
string
application/xml

Accept
string
application/vnd.pagseguro.com.br.v3+json;charset=ISO-8859-1

Responses

200
200


400
400Retentativa de pagamento
post
https://ws.sandbox.pagseguro.uol.com.br/pre-approvals/{pre-approval-code}/payment-orders/{payment-order-code}/payment?email={email}&token={token}
Log in to see full request history
time	status	user agent	
Make a request to see history.

Path Params
pre-approval-code
string
required
Código que retorna na chamada de Adesão ao Plano

payment-order-code
string
required
Código que retorna na chamada de Criação de plano.

email
string
required
email de sua conta sandbox.

token
string
required
token de sua conta sandbox.

Headers
Content-Type
string
application/json

Accept
string
application/vnd.pagseguro.com.br.v3+json;charset=ISO-8859-1

Responses

200
200


400
400

Providers - Cancelamento
Segue abaixo todos os Providers da API Recorrência.

Provider	Descrição
/pre-approvals/{{preApprovalCode}}/status?	Suspender um plano.
/pre-approvals/{{preApprovalCode}}/status?	Reativar um plano.
/pre-approvals/{preApprovalCode}/cancel?	Cancelamento de Adesão.


Suspensão e Reativação
put
https://ws.sandbox.pagseguro.uol.com.br/pre-approvals/{pre-approval}/status?token=38E3E92F0DCA4CB5895D75AC5B492179&email=vladimirintegracao@gmail.com
Log in to see full request history
time	status	user agent	
Make a request to see history.

Path Params
pre-approval
string
required
Código de pre-approvals que retorna na Adesão do Plano

Body Params
status
string
Novo status da assinatura.

Headers
Content-Type
string
application/json

Accept
string
application/vnd.pagseguro.com.br.v3+json;charset=ISO-8859-1

Responses

204
204


400
400

Cancelamento de adesão
put
https://ws.sandbox.pagseguro.uol.com.br/pre-approvals/{pre-approval}/cancel?email={email}&token={token}
Log in to see full request history
time	status	user agent	
Make a request to see history.

Path Params
pre-approval
string
required
Código de pre-approvals que retorna na Adesão do Plano

email
string
required
email da sua conta sandbox.

token
string
required
token da sua conta sandbox.

Headers
Content-Type
string
application/json

Accept
string
application/vnd.pagseguro.com.br.v3+json;charset=ISO-8859-1

Responses

204
204


400
400

Provider - Alteração
Segue abaixo todos os Providers da API Recorrência.

Provider	Descrição
/pre-approvals/request/{{preApprovalRequestCode}}/payment?	Edição de Valor e planos.
/pre-approvals/{{preApprovalCode}}/discount?	Incluir um desconto no pagamento.
/pre-approvals/{{preApprovalCode}}/payment-method?	Mudar meio de pagamento.
Edição de Valor e Planos
put
https://ws.sandbox.pagseguro.uol.com.br/pre-approvals/request/{preApprovalRequestCode}/payment?email={email}&token={token}
Log in to see full request history
time	status	user agent	
Make a request to see history.

Path Params
preApprovalRequestCode
string
required
Código que retorna na chamada de Criação de plano

Body Params
amountPerPayment
string
Novo valor para cobrança do plano e para as adesões do plano.

updateSubscriptions
boolean
Flag para indicar se a alteração de valor deve afetar as adesões vigentes do plano.


Headers
Content-Type
string
application/json

Accept
string
application/vnd.pagseguro.com.br.v3+json;charset=ISO-8859-1

Responses

204
204


400
400

Desconto no pagamento
put
https://ws.sandbox.pagseguro.uol.com.br/{pre-approval-code}/discount?email={email}&token={token}
Log in to see full request history
time	status	user agent	
Make a request to see history.

https://ws.sandbox.pagseguro.uol.com.br/pre-approvals/{{pre-approved-code}}/discount?email={{email}}&token={{token}}

Path Params
pre-approval-code
string
required
Código que retorna na chamada de Adesão ao plano.

email
string
required
email de sua conta sandbox.

token
string
required
token de sua conta sandbox.

Body Params
type
string
Tipo do desconto a ser aplicado

value
string
Valor do desconto a ser aplicado, de acordo com o tipo. Formato: Decimal, com duas casas decimais separadas por ponto, maior que 0.00 e deve ser compatível com o valor a ser descontado. Por exemplo: não é possível aplicar um desconto fixo de 11.00 para uma cobrança de 10.00, tal como não é possível informar uma porcentagem acima de 100.00.

Headers
Content-Type
string
application/json

Accept
string
application/vnd.pagseguro.com.br.v3+json;charset=ISO-8859-1

Responses

204
204


400
400Mudança de meio de pagamento
put
https://ws.sandbox.pagseguro.uol.com.br/pre-approvals/{preApprovalCode}/payment-method?email={email}&token={token}
Log in to see full request history
time	status	user agent	
Make a request to see history.

Path Params
preApprovalCode
string
required
Código que retorna na chamada de Adesão ao plano.

email
string
required
email de sua conta sandbox.

token
string
required
token de sua conta sandbox.

Body Params
type
string
required
Tipo do desconto a ser aplicado

sender
object
Dados do assinante.


sender object
creditCard
object
Dados do Cartão


creditCard object
Headers
Content-Type
string
application/json

Accept
string
application/vnd.pagseguro.com.br.v3+json;charset=ISO-8859-1

Responses

204
204


400
400
Providers - Consulta
Segue abaixo todos os Providers da API Recorrência.

Provider	Descrição
/pre-approvals/request/?	Criação do plano.
/v2/sessions?	Iniciar sessão para aderir um plano.
/pre-approvals?	Adesão do plano.
/pre-approvals/payment?	Cobrança plano.
/pre-approvals/{{preApprovalCode}}/status?	Suspender um plano.
/pre-approvals/{{preApprovalCode}}/status?	Reativar um plano.
/pre-approvals/request/{{preApprovalRequestCode}}/payment?	Edição de Valor e planos.
/pre-approvals/{{preApprovalCode}}/discount?	Incluir um desconto no pagamento.
/pre-approvals/{{preApprovalCode}}/payment-method?	Mudar meio de pagamento.
/pre-approvals/{preApprovalCode}/cancel?	Cancelamento de Adesão.
/pre-approvals/{{preApprovalCode}}/payment-orders/{{paymentOrderCode}}/payment?	Retentativa de Pagamento.


Listar ordens de pagamento
get
https://ws.sandbox.pagseguro.uol.com.br/pre-approvals/{preApprovalCode}/payment-orders?email={email}&token={token}
Log in to see full request history
time	status	user agent	
Make a request to see history.

Path Params
preApprovalCode
string
required
Código que retorna na chamada de Adesão ao Plano

email
string
required
email de sua conta sandbox.

token
string
required
token de sua conta sandbox.

Headers
Content-Type
string
application/json

Accept
string
application/vnd.pagseguro.com.br.v3+json;charset=ISO-8859-1

Responses

200
200


400
400

Consulta pelo Código da Adesão
get
https://ws.sandbox.pagseguro.uol.com.br/pre-approvals/{pre-appovals-code}?email={email}&token={token}
Log in to see full request history
time	status	user agent	
Make a request to see history.

Path Params
pre-appovals-code
string
required
Código que retorna na chamada de Adesão ao plano.

email
string
required
email de sua conta sandbox.

token
string
required
token de sua conta sandbox.

Headers
Content-Type
string
application/json

Accept
string
application/vnd.pagseguro.com.br.v3+json;charset=ISO-8859-1

Responses

200
200


400
400

Consulta por intervalo de datas
get
https://ws.sandbox.pagseguro.uol.com.br/pre-approvals/?email={email}&token={token}&initialDate=2019-08-09T01:00&finalDate=2019-08-10T00:00
Log in to see full request history
time	status	user agent	
Make a request to see history.

Path Params
email
string
required
email de sua conta sandbox.

token
string
required
token de sua conta sandbox.

initialDate
string
required
Data inicial.

finalDate
string
required
Data final.

Headers
Content-Type
string
application/json

Accept
string
application/vnd.pagseguro.com.br.v3+json;charset=ISO-8859-1

Responses

200
200


400
400

Consulta pelo Código de Notificação
get
https://ws.sandbox.pagseguro.uol.com.br/pre-approvals/notifications/{notification-code}?email={email}&token={token}
Log in to see full request history
time	status	user agent	
Make a request to see history.

Path Params
notification-code
string
required
Código que retorna na chamada de Adesão ao plano.

email
string
required
email de sua conta sandbox.

token
string
required
token de sua conta sandbox.

Headers
Content-Type
string
application/json

Accept
string
application/vnd.pagseguro.com.br.v3+json;charset=ISO-8859-1

Responses

200
200


400
400

Collection Postman
Para facilitar sua integração, desponibilização uma Collection no Postman, onde apresentamos como gerar uma Recorrência.

Apêndice
Tabela de Status de Plano
STATUS	DESCRIÇÃO
A	Ativo. É possível fazer adesões
I	Inativo. Não é possível fazer novas adesões até que ele seja reativado.
E	Expirado. Não é possível mais utilizá-lo.
Tabela de Status de Adesão
STATUS	DESCRIÇÃO
INITIATED	O comprador iniciou o processo de pagamento, mas abandonou o checkout e não concluiu a compra.
PENDING	O processo de pagamento foi concluído e transação está em análise ou aguardando a confirmação da operadora.
ACTIVE	A criação da recorrência, transação validadora ou transação recorrente foi aprovada.
PAYMENT_METHOD_CHANGE	Uma transação retornou como "Cartão Expirado, Cancelado ou Bloqueado" e o cartão da recorrência precisa ser substituído pelo comprador.
SUSPENDED	A recorrência foi suspensa pelo vendedor.
CANCELLED	A criação da recorrência foi cancelada pelo PagSeguro
CANCELLED_BY_RECEIVER	A recorrência foi cancelada a pedido do vendedor.
CANCELLED_BY_SENDER	A recorrência foi cancelada a pedido do comprador.
EXPIRED	A recorrência expirou por atingir a data limite da vigência ou por ter atingido o valor máximo de cobrança definido na cobrança do plano.
Tabela de Status de Ordem de Pagamento
STATUS	VALOR	DESCRIÇÃO
1	Agendada	A ordem de pagamento está aguardando a data agendada para processamento.
2	Processando	A ordem de pagamento está sendo processada pelo sistema.
3	Não Processada	A ordem de pagamento não pôde ser processada por alguma falha interna, a equipe do PagSeguro é notificada imediatamente assim que isso ocorre.
4	Suspensa	A ordem de pagamento foi desconsiderada pois a recorrência estava suspensa na data agendada para processamento.
5	Paga	A ordem de pagamento foi paga, ou seja, a última transação vinculada à ordem de pagamento foi paga.
6	Não Paga	A ordem de pagamento não pôde ser paga, ou seja, nenhuma transação associada apresentou sucesso no pagamento.
Tabela de Status de Transação
STATUS	VALOR	DESCRIÇÃO
1	Aguardando pagamento	O comprador iniciou a transação, mas até o momento o PagSeguro não recebeu nenhuma informação sobre o pagamento.
2	Em análise	O comprador optou por pagar com um cartão de crédito e o PagSeguro está analisando o risco da transação.
3	Paga	A transação foi paga pelo comprador e o PagSeguro já recebeu uma confirmação da instituição financeira responsável pelo processamento.
4	Disponível	A transação foi paga e chegou ao final de seu prazo de liberação sem ter sido retornada e sem que haja nenhuma disputa aberta.
5	Em disputa	O comprador, dentro do prazo de liberação da transação, abriu uma disputa.
6	Devolvida	O valor da transação foi devolvido para o comprador.
7	Cancelada	A transação foi cancelada sem ter sido finalizada.
Tabela de Listagem de Erros
CÓDIGO DE ERRO	MENSAGEM
10003	Email invalid value.
10005	The accounts of the vendor and buyer can not be related to each other.
10009	Method of payment currently unavailable.
10020	Invalid payment method.
10021	Error fetching vendor data from the system.
10023	Payment Method unavailable.
10024	Unregistered buyer is not allowed.
10025	senderName cannot be blank.
10026	senderEmail cannot be blank.
10049	senderName mandatory.
10050	senderEmail mandatory.
11002	receiverEmail invalid length: {0}
11006	redirectURL invalid length: {0}
11007	redirectURL invalid value: {0}
11008	reference invalid length: {0}
11013	senderAreaCode invalid value: {0}
11014	senderPhone invalid value: {0}
11027	Item quantity out of range: {0}
11028	Item amount is required. (e.g. "12.00")
11040	maxAge invalid pattern: {0}. Must be an integer.
11041	maxAge out of range: {0}
11042	maxUses invalid pattern: {0}. Must be an integer.
11043	maxUses out of range: {0}
11054	abandonURL/reviewURL invalid length: {0}
11055	abandonURL/reviewURL invalid value: {0}
11071	preApprovalInitialDate invalid value.
11072	preApprovalFinalDate invalid value.
11084	seller has no credit card payment option.
11101	preApproval data is required.
11163	You must configure a transactions notifications (Notificação de Transações) URL before using this service.
11211	pre-approval cannot be paid twice on the same day.
11214	Pre approval can not be paid twice on the same day while the status is in processing or suspended.
13005	initialDate must be lower than allowed limit.
13006	initialDate must not be older than 180 days.
13007	initialDate must be lower than or equal finalDate.
13008	search interval must be lower than or equal 30 days.
13009	finalDate must be lower than allowed limit.
13010	initialDate invalid format use 'yyyy-MM-ddTHH:mm' (eg. 2010-01-27T17:25).
13011	finalDate invalid format use 'yyyy-MM-ddTHH:mm' (eg. 2010-01-27T17:25). |
| 13013 | page invalid value.
13014	maxPageResults invalid value (must be between 1 and 1000).
13017	initialDate and finalDate are required on searching by interval.
13018	interval must be between 1 and 30.
13019	notification interval is required.
13020	page is greater than the total number of pages returned.
13023	Invalid minimum reference length (1-255)
13024	Invalid maximum reference length (1-255)
17008	pre-approval not found.
17022	invalid pre-approval status to execute the requested operation. Pre-approval status is {0}.
17023	seller has no credit card payment option.
17024	pre-approval is not allowed for this seller {0}
17032	invalid receiver for checkout: {0} verify receiver's account status and if it is a seller's account.
17033	preApproval.paymentMethod isn't {0} must be the same from pre-approval.
17035	Due days format is invalid: {0}.
17036	Due days value is invalid: {0}. Any value from 1 to 120 is allowed.
17037	Due days must be smaller than expiration days.
17038	Expiration days format is invalid: {0}.
17039	Expiration value is invalid: {0}. Any value from 1 to 120 is allowed.
17061	Plan not found.
17063	Hash is mandatory.
17065	Documents required.
17066	Invalid document quantity.
17067	Payment method type is mandatory.
17068	Payment method type is invalid.
17069	Phone is mandatory.
17070	Address is mandatory.
17071	Sender is mandatory.
17072	Payment method is mandatory.
17073	Credit card is mandatory.
17074	Credit card holder is mandatory.
17075	Credit card token is invalid.
17078	Expiration date reached.
17079	Use limit exceeded.
17080	Pre-approval is suspended.
17081	pre-approval payment order not found.
17082	invalid pre-approval payment order status to execute the requested operation. Pre-approval payment order status is {0}.
17083	Pre-approval is already {0}.
17093	Sender hash or IP is required.
17094	There can be no new subscriptions to an inactive plan.
19001	postalCode invalid Value: {0}
19002	addressStreet invalid length: {0}
19003	addressNumber invalid length: {0}
19004	addressComplement invalid length: {0}
19005	addressDistrict invalid length: {0}
19006	addressCity invalid length: {0}
19007	addressState invalid value: {0} must fit the pattern: \w{2} (e. g. "SP")
19008	addressCountry invalid length: {0}
19014	senderPhone invalid value: {0}
19015	addressCountry invalid pattern: {0}
30400	invalid creditcard data
30401	invalid creditCard durable token
30402	invalid creditCard transient token
30405	invalid creditcard brand/Invalid date format
30406	Invalid encrypted-cc parameter
30407	Could not decrypt creditcard
50103	postal code can not be empty
50105	address number can not be empty
50106	address district can not be empty
50107	address country can not be empty
50108	address city can not be empty
50131	The IP address does not follow a valid pattern
50134	address street can not be empty
53037	credit card token is required.
53042	credit card holder name is required.
53047	credit card holder birthdate is required.
53048	credit card holder birthdate invalid value: {0}
53151	Discount value cannot be blank.
53152	Discount value out of range. For DISCOUNT_PERCENT type the value must be greater than or equal to 0.00 and less than or equal to 100.00.
53153	not found next payment for this preApproval.
53154	Status cannot be blank.
53155	Discount type is mandatory.
53156	Discount type invalid value. Valid values are: DISCOUNT_AMOUNT and DISCOUNT_PERCENT.
53157	Discount value out of range. For DISCOUNT_AMOUNT type the value must be greater than or equal to 0.00 and less than or equal to the maximum amount of the corresponding payment.
53158	Discount value is mandatory.
57038	address state is required.
61007	document type is required.
61008	document type is invalid: {0}
61009	document value is required.
61010	document value is invalid: {0}
61011	cpf is invalid: {0}
61012	cnpj is invalid: {0}

