Pedidos e pagamentos (Order)
A API de Pedidos do PagBank, também conhecida como API Order, engloba todas as operações relacionadas ao processo de cobrança após a definição do pedido.

Serviços disponíveis
Tratando-se de uma API de Pedidos, um dos pontos mais importantes é a gama de meios de pagamento disponíveis. Atualmente, a API de Pedidos do PagBank proporciona as seguintes opções para a realização de pagamentos:

Cartão de Crédito
Cartão de Débito (Obrigatório 3DS)
PIX
Boleto Bancário
Pagar com PagBank (carteira PagBank, pagamento pode ser realizado via saldo ou cartão de crédito)
Além da criação de pagamentos, a API de Pedidos disponibiliza outros recursos, como:

Tokenização
Repasse de taxa
Autenticação 3DS
Divisão do pagamento
Para mais detalhes sobre os serviços disponíveis, acesse Serviços de pedidos e pagamentos.

Fluxos de utilização da API
O fluxo convencional para a realização de um pagamento envolve a utilização de três endpoints para a criação de um pedido, realização do pagamento pelo cliente e captura desse pagamento. Entretanto, dependendo do meio de pagamento ou dos recursos incorporados, como tokenização, esse fluxo e o número de passos que você deve realizar pode ser alterado. Por esse motivo, você pode acessar a seção de Casos de uso para entender melhor todas as possibilidades disponibilizadas pela API de Pedidos do PagBank.

👍
Explore os casos de uso

A seção de Casos de uso lista todas as variações do processo de criação e pagamento de um pedido. Se você está incerto em relação ao que você precisa para o seu negócio, recomendamos fortemente que verifique os guias passo a passo disponíveis.

Endpoints e webhooks
A utilização da API de Pedidos é feita através dos 8 endpoints principais relacionados a criação e consulta de pedidos. Esses endpoints são apresentados a seguir:

Criar pedido: possibilita a criação de um pedido, incluindo a opção de efetuar o pagamento. Dependendo do método de pagamento selecionado, você pode criar e pagar o pedido utilizando apenas este endpoint.
Consultar pedido: permite a consulta de pedidos anteriormente criados, utilizando um identificador único associado ao pedido.
Consultar pedido através de parâmetros: possibilita a consulta de pedidos já existentes através de parâmetros específicos, como o identificador da cobrança.
Consultar divisão do pagamento: permite recuperar os dados relacionados à divisão de um pagamento, oferecendo insights sobre a distribuição dos valores envolvidos.
Pagar pedido: este endpoint viabiliza o processo de pagamento para um pedido previamente criado.
Consultar pagamento: oferece a funcionalidade de consultar o status de um pagamento, proporcionando informações atualizadas sobre a transação.
Capturar pagamento: permite a capture transações pré-autorizadas.
Cancelar pagamento: possibilita a devolução do valor pago ao comprador, sendo aplicável tanto para desfazer uma pré-autorização quanto para reembolsar um pagamento já capturado.
Além desses endpoints, existem outros 3 que oferecem funcionalidades complementares aos processos de criação de pedido e pagamento. Esses serviços são cobertos pelos seguintes endpoints:

Criar sessão de autenticação 3DS: permite gerar sessões que serão utilizadas para a autenticação de operações com autenticação 3DS do PagBank.
Consultar juros de uma transação: permite que você consulte e exiba os juros de parcelamento das transações aos seus clientes.
Validar e armazenar um cartão: permite que você valide e armazene um cartão no sistema do PagBank.
O PagBank também disponibiliza webhooks para notificação em tempo real sobre eventos relacionados à alteração de status em pedidos e pagamentos criados. Acesse a página de Webhooks para mais informações sobre as notificações cobertas e meios de integração.

Objetos
A API de Pedidos utiliza dois objetos principais nos processos de criação de pedidos (objeto Order) e criação de pagamentos (objeto Charge). Para identificar todos os parâmetros, seus respectivos tipos e exemplos de cada parâmetro do objeto, acesse as páginas do Objeto Order e do Objeto Charge.

Casos de uso
O PagBank oferece diversas opções para criar e pagar pedidos utilizando diferentes meios de pagamento. Nesta página, você encontrará guias que irão ajudá-lo a entender cada processo, além de exemplos de requisições e respostas. A lista foi dividida entre os processos que te permitem criar e pagar um pedido e aqueles que são utilizados apenas para criar pedidos.

Selecione o guia de criação de pedido que atenda a sua necessidade:

Criar pedido
Criar pedido com QR Code (PIX)
Criar pedido com cartão (facilitadores de pagamento)
Caso você deseje criar um pedido com parcelamento do pagamento repassando juros ao comprador, utilize o link abaixo:

Criar pedido com repasse de taxa ao comprador
Se o seu objetivo é criar e pagar um pedido realizando apenas uma requisição, selecione um dos guias disponíveis a seguir:

Criar e pagar pedido com cartão
Criar e pagar pedido com cartão (Cliente PCI)
Criar e pagar pedido com token de bandeira
Criar e pagar pedido com token PagBank
Criar e pagar pedido com indicação de recorrência
Criar e pagar com autenticação 3DS externa
Criar e pagar com autenticação 3DS do PagBank
Criar e pagar pedido com Boleto
Você tembém pore explorar os casos de uso associados ao serviço Pagar com PagBank:

Criar pedido com Pagar com PagBank (QR Code)
Criar pedido com Pagar com PagBank (Deeplink)
O PagBank também disponibiliza a opção de dividir o pagamento. Essa opção é útil caso você deseje realizar a distribuição dos fundos para todos os envolvidos já no momento do pagamento do pedido. Para entender melhor essa opção, acesse o link abaixo:

Divisão do pagamento
Essas informações serão úteis para orientá-lo em cada etapa do processo, permitindo que você escolha a melhor opção conforme as as suas necessidades.

Erros e bloqueios de pagamento
Ao utilizar os endpoints da API de Pagamentos, você pode se deparar com dois tipos de problemas. O primeiro diz respeito aos erros associados à realização de requisições e o segundo se relaciona a não autorização dos pagamentos.

Os erros relacionados à requisição aos endpoints estão normalmente associados ao fornecimento de parâmetros incorretos ou falta de autenticação. Para te auxiliar a entender os problemas ao executar as requisições, você pode acessar a página Códigos de erro, que lista os códigos que você pode receber e provê detalhes adicionais para cada erro.

A realização de um pagamento pode ser efetuada com sucesso ou ser bloqueada. No caso de um pagamento bloqueado, um erro não será necessariamente gerado. Para identificar o status da operação, você deverá checar o código da resposta da operação e a mensagem associada. A página Motivos de compra negada disponibiliza a lista de códigos que você pode receber ao tentar realizar um pagamento e descrições complementares.

Serviços de pedidos e pagamentos
A API de pedidos e pagamentos do PagBank oferece uma ampla gama de funcionalidades para impulsionar o seu negócio. Esta página aborda as diversas possibilidades associadas a essas funcionalidades com uma perspectiva de negócio. Se você necessita de uma compreensão mais técnica do processo de utilização, acesse a página de Casos de Uso, onde você encontrará uma lista completa de guias que detalham todos os passos para a criação de pagamentos utilizando diferentes métodos de pagamento.

Aqui você encontra informações sobre os seguintes tópicos:

Criação de pedidos e pagamentos.
Pagamento com Cartões, utilizando recursos como token e 3DS.
Pagamentos com Boleto Bancário e PIX.
Descrição do recurso de Pagar com PagBank.
Informações sobre o processo de divisão do pagamento e cancelamento de pagamentos.
Como realizar o repasse taxas ao comprador.
Criação de pedidos e pagamentos
Ao utilizar a API de pedidos e pagamentos do PagBank, você tem as seguintes opções:

Criar o pedido e depois realizar o pagamento: duas chamadas a API são necessárias, uma para criar e outra para pagar o pedido.
Criar e pagar o pedido: você cria e realiza o pagamento na mesma ação. Para utilizar essa opção, você deve fornecer tanto os dados do pedido como os dados do meio de pagamento ao mesmo tempo.
Essas duas opções podem ser utilizadas por diferentes métodos de pagamento.

Pagamento com Cartões
No PagBank você pode utilizar criptografia para processar cobranças com cartão de crédito diretamente no ambiente da loja virtual, sem a necessidade de redirecionar o comprador para uma página externa de pagamento. Isso é ideal para quem não possui certificação PCI DSS Compliance, oferecendo segurança e flexibilidade para qualquer modelo de negócio.

Além da proteção dos dados, outros benefícios estão disponíveis, como:

Simplicidade de cobrança: opções para cobranças em um ou dois passos.
Tokenização de Cartão: possibilita salvar cartões para cobranças futuras.
Criptografia offline: a segurança é garantida sem a necessidade de conexões com servidores externos.
Com relação ao funcionamento, você precisa levar em consideração os seguintes fatores:

Apenas a conta PagBank associada à chave pública pode processar as cobranças.
Cada cartão criptografado pode ser utilizado apenas uma vez, independente do resultado da operação.
Os cartões criptografados podem ser usados dentro de 48 horas após a geração.
Para explorar a implementação técnica dessa opção, acesse Criar e pagar um pedido com cartão.

Você também tem a opção de repassar as taxas ao comprador em compras parceladas. Nesse caso, as informações de implementação são apresentadas em Criar pedido com repasse de taxa ao comprador.

Caso você deseje armazenar os dados dos cartões do seu cliente, você deve explorar os recursos de tokens.

Utilizando tokens para pagar com Cartão
A tokenização é o processo de substituição dos dados sensíveis do cartão do seu cliente, como número, CVV e validade, por números alternativos, denominados de tokens. Assim, os dados do cartão ficam armazenados em um ambiente seguro, enquanto os tokens são utilizados no momento da realização do pagamento, aumentando a segurança e as taxas de aprovação das transações.

No PagBank, você pode optar entre duas opções de tokenização:

Token PagBank: O processo de tokenização e armazenamento dos dados do cartão é realizado pelo PagBank. Acesse Criar e pagar pedido com token PagBank mais informações sobre a implementação.
Token de Bandeira: O processamento de tokenização e armazenamento é realizado pela bandeira do cartão. O processo de criação do token é uma ação não vinculada ao PagBank. Portanto, você deverá realizar esse processo por conta própria e fornecer o token resultante no momento da criação do pagamento. Acesse Criar e pagar pedido com token de bandeira para mais informações sobre a implementação.
Autenticação 3DS
Se você deseja aceitar pagamentos com Cartão, a utilização da autenticação 3DS irá melhorar a segurança do processo. O 3DS é um protocolo de autenticação no comércio eletrônico projetado para garantir transações seguras com cartões, visando aumentar a confiabilidade tanto para vendedores quanto para consumidores e reduzir fraudes.

A utilização de 3DS traz uma série de benefícios como:

Aumento de segurança: utiliza dezenas de variáveis para autenticar transações.
Redução de chargebacks: quando uma transação é autenticada, o banco emissor assume a responsabilidade por chargebacks fraudulentos, reduzindo os custos para o vendedor.
Aceitação de Cartão de Débito: facilita os pagamentos com cartão de débito em plataformas de e-commerce, ampliando as opções para os consumidores.
Além disso, é recomendado que se utilize o 3DS quando:

Deseja adicionar uma camada extra de proteção às transações online.
Busca reduzir os custos relacionados a chargebacks.
Pretende aceitar pagamentos com cartão de débito.
Ao utilizar o 3DS, a transação pode ocorrer com ou sem desafio:

Sem desafio: o banco emissor reconhece as informações como suficientes para autenticar o consumidor, sem a necessidade de validação adicional. Assim, o pagamento pode proceder normalmente.
Com desafio: o banco emissor não consegue garantir a autenticidade do consumidor e requer uma validação adicional, que pode ser feita via SMS, token, aplicativo, entre outros meios.
Pagamentos com Boleto Bancário
Utilizando a API de pedidos e pagamentos você pode oferecer a opção do Boleto Bancário como forma de pagamento aos seus clientes. Esse serviço é perfeito para você que busca uma forma direta e descomplicado para gerar Boletos.

Ao emitir um Boleto através do PagBank, você pode oferecer duas formas para que o comprador possa acessá-lo:

Linha digitável: facilita o pagamento, permitindo que o cliente copie e cole o código diretamente em seu internet banking ou aplicativo bancário.
Link para impressão do Boleto: permite que o cliente visualize o boleto pronto para impressão e/ou pagamento.
A página Criar e pagar pedido com Boleto apresenta os detalhes da implementação técnica dessa opção de pagamento.

Pagamentos com PIX
Você também tem a opção de oferecer o PIX como forma de pagamento para os seus clientes. A API do PagBank irá fornecer um QR Code para que o seu cliente consiga facilmente escanear e realizar o pagamento. No entanto, cada QR Code poderá ser utilizado em um único pagamento. Atualmente, o sistema PagBank suporta a criação de apenas um QR Code por pedido.

Para você utilizar esse serviço você deve cadastrar ao menos uma chave PIX na sua conta PagBank.

A página Criar pedido com QR Code (PIX) apresenta os detalhes da implementação técnica dessa opção de pagamento.

Utilizando o recurso de Pagar com PagBank
A API de Pedidos do PagBank também possibilita que você utilize o recurso de Pagar com PagBank. Com essa opção, os consumidores podem utilizar a carteira digital do PagBank para pagar por seus pedidos. O Pagar com PagBank traz mais rapidez, segurança e praticidade na hora de realizar uma compra online. Além de contar com a base de milhões de potenciais compradores usuários do PagBank.

O pagamento é realizado no dispositivo móvel do comprador, através do aplicativo PagBank e poderá ser realizado com saldo disponível na conta PagBank, cartão de crédito à vista ou parcelado. Você pode fornecer a opção de Pagar com PagBank tanto em aplicativos, como em aplicações web.

Divisão do pagamento
O recurso de divisão de pagamento, também chamado de split de pagamento, permite que um único pagamento seja distribuído entre diferentes recebedores de maneira simples, prática, flexível e segura. Esse recurso pode ser utilizado em pagamentos utilizando Cartão de Crédito, Boleto Bancário ou Pix, sendo possível dividir o pagamento entre até 15 recebedores.

Você pode escolher entre realizar a divisão informando valores fixos ou percentuais a serem destinados a cada recebedor em uma transação. Além disso, o recurso de divisão de pagamento está disponível para pagamentos em um passo (com captura) ou em dois passos (pré-autorização seguida de captura).

Em todas as divisões, existe um recebedor primário e pelo menos um secundário. O primário paga integralmente as taxas e tarifas da transação sobre o valor total. A liquidação ocorre nas contas PagBank de cada recebedor, seguindo o prazo de recebimento do primário. Cada recebedor tem acesso ao seu extrato de transações, com diferentes níveis de visibilidade dependendo do papel na transação.

Em casos de chargeback, o valor é integralmente debitado do primário, que também é o único autorizado a solicitar o cancelamento da transação. Se o primário quiser recuperar o valor do chargeback que foi debitado dele, é necessário informar, no momento de criar o pedido com divisão do pagamento, o recebedor secundário para quem quer repassar este valor. Caso tenha interesse em utilizar o repasse de cobrança de chargeback, é necessário entrar em contato com seu gerente de conta para solicitar autorização.

📘
Suporte

Para mais detalhes sobre o processo de divisão de pagamento ou para esclarecer dúvidas, entre em contato com nosso time comercial pelo e-mail comercialweb@pagbank.com.

Para aprender como executar a implementação da divisão do pagamento, acesse Divisão do pagamento.

Cancelamento de pagamentos
O Recurso de cancelamento de pedidos permite a devolução, parcial ou total, do valor pago pelo comprador, independentemente do método de pagamento utilizado. É importante destacar que essa opção estará disponível, desde que a cobrança seja elegível para reembolso.

O processo de cancelamento pode varia dependendo do método de pagamento utilizado. A seguir são listadas as características associadas a cada opção de método de pagamento disponível:

Cartão de Crédito: o reembolso padrão para cobranças por cartão de crédito será refletido nas próximas faturas. O prazo máximo de reembolso é de 350 dias após a autorização da cobrança.
📘
Cancelamento de cobranças autorizadas

No caso da cobrança ter sido autorizada mas não capturada em compras com Cartão de Crédito, o valor será restituído imediatamente na fatura do cartão do cliente. Nesses casos, somente a devolução total é permitida.

Cartão de Débito: o prazo máximo de 350 dias para reembolsos após a autorização da cobrança. Para cartões de débito da bandeira Mastercard, o prazo máximo é de 180 dias.
Boleto: por padrão, o reembolso para cobranças via Boleto será creditado no saldo da conta PagSeguro. Caso o comprador não tenha uma conta, ele receberá instruções por e-mail para criá-la. O prazo máximo para reembolsos após a autorização da cobrança é de 90 dias.
PIX: o reembolso para cobranças via Pix será estornado na conta de origem do pagamento. O prazo máximo para reembolsos após a autorização da cobrança é de 90 dias.
📘
Reembolsos parciais

Não existe limite de reembolsos parciais que você pode executar. No entanto, o valor total da soma dos reembolsos parciais não deve ser superior ao valor da compra.

No caso da realização de reembolsos parciais, o status da cobrança não é alterado. O status mudará para cancelado, somente quando o valor total da compra for reembolsado.

Repasse taxas ao comprador
A funcionalidade de repassar taxas ao comprador, autorizada pela Lei n. 13.455/17, oferece ao vendedor a capacidade de ajustar o preço de seus produtos e serviços com base no prazo e método de pagamento escolhidos pelo comprador. Isso permite adaptar-se às preferências de negócio do vendedor sem afetar sua receita.

Ao adotar essa opção, você pode:

Escolha o número de parcelas oferecidas ao comprador em cada transação.
Determine quantas parcelas resultarão em um aumento do preço do produto.
Ao optar por adotar essa opção, você tem como benefícios:

Flexibilidade para ajustar o valor do produto com base no número de parcelas.
Capacidade de receber o valor total da venda conforme o plano de recebimento escolhido.
Potencial para aumentar as vendas.
A opção de repassar as taxas para o comprador oferece uma maneira eficaz de adaptar a precificação às necessidades do mercado, proporcionando benefícios tanto para você quanto para o comprador. Para mais informações sobre a implementação dessa opção acesse Criar pedido com repasse de taxa ao comprador.

Checkout e Link de Pagamento
A API de Checkout e Link de Pagamento do PagBank oferece uma solução completa e versátil para simplificar o processo de pagamento online. Com essa API, você pode gerar links compartilháveis que direcionam os clientes a uma página de pagamento dentro do ambiente seguro do PagBank, garantindo uma experiência de compra contínua e protegida, alinhada aos mais altos padrões de segurança e conveniência do mercado de pagamentos.

Checkout: você pode redirecionar os seus clientes para o ambiente de pagamento do PagBank, onde eles podem concluir a transação com facilidade. Ao finalizar a compra, você pode optar por retornar o cliente à sua loja, proporcionando uma experiência integrada e personalizada.
Link de Pagamento: você pode compartilhar o link de pagamento gerado com a API do PagBank em diversas plataformas, como redes sociais, e-mails e aplicativos de mensagens, sem a necessidade de ter um e-commerce. Assim, o processo de pagamento online é simplificado, adaptando-se ao seu modelo de negócio.
Checkout Recorrente: automatize cobranças periódicas para mensalidades, assinaturas ou serviços recorrentes. A primeira cobrança é realizada na conclusão do pagamento, e uma assinatura é criada para as próximas cobranças.
Link de Pagamento Recorrente: crie links de pagamento para assinaturas e serviços recorrentes, facilitando a automação de cobranças periódicas para seus clientes.
Ao optar pela API de Checkout e Link de Pagamento do PagBank, você tem total controle sobre as configurações dos pagamentos oferecidos, incluindo o número de parcelas e os meios de pagamento disponíveis, proporcionando flexibilidade e personalização para atender às necessidades específicas do seu negócio.

Atualmente os seguintes métodos de pagamentos estão disponíveis:

Cartão de crédito
Cartão de débito
Pix
Boleto
Pagar com PagBank (cartão de crédito e saldo)
📘
Pagar com PagBank

Você pode escolher os meios de pagamento que estarão disponíveis ao seu cliente, podendo habilitar ou emitir as opções acima. No entanto, a opção de Pagar com PagBank sempre ficará disponível no checkout, independente da configuração.

Tabela de Conteúdo
Como a API de Checkout e Link de Pagamento funciona
Personalização da página de pagamento
Valor do pagamento
Expiração do Checkout e Link de Pagamento
Repassando taxas de parcelamento ao vendedor
Checkout Recorrente
Endpoints e webhooks
Objeto Checkout
Erros
Bandeiras aceitas
Como a API de Checkout e Link de Pagamento funciona
O processo de utilização do Checkout PagBank pode ser dividido em seis passos:

Você coleta as informações dos itens associados ao pedido. Isso pode ser feito por meio do seu e-commerce ou qualquer outra plataforma de vendas que você utilize.

Com base nas características do pedido, você irá criar uma página de pagamento utilizando o endpoint Criar Checkout. Nesse endpoint, você irá configurar o checkout que será disponibilizado ao seu cliente. Entre as configurações disponíveis, você poderá definir:

A URL para a qual o seu cliente deve ser redirecionado após a conclusão do pagamento (redirect_url).
Formas de pagamento que estarão disponíveis para o seu cliente.
Limite de parcelas para pagamentos com cartão.

📘
O Link de pagamento é considerada uma página de pagamento pelo PagBank, onde você customizou as preferências do pedido.

A API do PagBank irá te fornecer um id de identificação do checkout. Esse id é utilizado caso você deseje fazer consultas acerca do checkout ou link de pagamento criado. Você também recebe um link que você utilizará para redirecionar o seu cliente para a página de pagamento, contendo todas as configurações definidas por você. Essa URL é disponibilizada em links[].href no objeto que contem links[].rel = PAY.

JSON

     "links": [
       	{
          "rel": "PAY",
          "href": "https://pagamento.pagseguro.uol.com.br/pagamento?code=XXXX",
          "method": "GET"
      	}
     ]
Utilizando o link fornecido, você irá redirecionar (checkout) ou encaminhar (link de pagamento) o seu cliente à página de pagamento criada pelo PagBank.

Na página criada, o seu cliente irá concluir o pagamento com o método que ele desejar. Além disso, dependendo de como o checkout ou link de pagamento foi criado, ele também pode escolher a forma de envio e fornecer os dados do endereço de entrega.

Com a conclusão do pagamento, o Checkout do PagBank irá direcionar o seu cliente à página que você definiu ao criar o checkout, defina pelo parâmetro redirect_url .

👍
Suporte

Em caso de dúvidas, entre em contato com nosso time de especialistas.

A imagem abaixo sumariza esse processo.



🚧
Autenticação

Para utilizar o Checkout e Link de Pagamento do Pagbank você precisa estar autenticado. Se você não está familiarizado com as opções de autenticação utilizadas pelo PagBank, acesse a página de Primeiros passos para ter um guia completo de todos os passos necessários.

Personalização da página de pagamento
Depois que seu cliente acessa a página do pagamento, ele precisa fornecer informações de identificação e sobre o endereço de entrega. Você tem a opção de pular esses passos para o seu cliente.

A personalização dos passos existentes no processo de pagamento depende dos parâmetros abaixo fornecidos no momento da criação:

customer_modifiable: define se o passo de fornecimento dos dados pessoais será apresentado.
address_modifiable: define se o passo de fornecimento dos dados do endereço de entrega será apresentado.
Caso opte por não apresentar um desses passos, você deverá fornecer os dados relacionados no momento da criação do checkout.

Valor do pagamento
O valor a ser pago pelo seu cliente no checkout será calculado pelo sistema do PagBank, definido por:

valor a ser pago = valor dos itens + valor do frete + valor adicional - desconto

O valor adicional, definido pelo parâmetro additional_amount, é utilizado para incorporar ao valor total custos que não estão vinculados aos itens do pedido ou ao envio dos produtos. Já o desconto, definido através do parâmetro discount_amount, aplicará um desconto sobre o valor total a ser cobrado do cliente.

🚧
Valor do desconto

O valor do desconto não pode ser superior a soma do valor dos itens, frete e valor adicional.

🚧
Valor máximo do pedido

O valor máximo do carrinho não deve ultrapassar 8999999100 centavos, equivalente a R$ 89.999.991,00.

Expiração do Checkout e Link de Pagamento
Você pode informar no momento da criação do pagamento, via parâmetro, um prazo de expiração. Caso não faça, a página de pagamento seguirá ativa independente do momento em que for acessada.

Repassando taxas de parcelamento ao vendedor
Por padrão, as taxas de parcelamento são arcadas pelo comprador quando você criar um Checkout ou Link de Pagamento. No entanto, você pode configurar o Checkout/Link de Pagamento para você assumir essas taxas de parcelamento de uma venda.

Caso você deseje arcar com as taxas de parcelamento, você precisa:

Determinar o número máximo de parcelas que você aceitará para a venda.
Especificar a quantidade de parcelas em que você assumirá os juros do parcelamento.
📘
Consulta de taxas

Para consultar as taxas aplicáveis, acesse sua conta e navegue até Vendas > Simulação.

As informações referentes ao número de parcelas e as taxas devem ser enviadas no momento da criação do Checkout/Link de Pagamento. Essas informações devem ser repassadas através do objeto payment_methods_configs.config_options através de objetos distintos, contento os parâmetros option e value. O parâmetro value define a quantidade de parcela, enquanto o parâmetro option pode conter uma das seguintes opções:

INSTALLMENTS_LIMIT: define o número máximo de parcelas permitidas para o pagamento.
INTEREST_FREE_INSTALLMENTS: especifica o número de parcelas cujo juros serão assumidos pelo vendedor.
O bloco de código a seguir apresenta um exemplo de configuração, onde a venda pode ser parcelada em até 12 vezes e o vendedor irá arcar com os juros das primeiras 5 parcelas.

JSON

"config_options": [
  {
    "option": "INSTALLMENTS_LIMIT",
    "value": "12"
  },
  {
    "option": "INTEREST_FREE_INSTALLMENTS",
    "value": "5"
  }
]
Com essa configuração, o vendedor assumirá a taxa de parcelamento das primeiras 5 parcelas. Caso o comprador opte por parcelar em mais de 5 vezes, ele será responsável pelas taxas de parcelamento adicionais.

Checkout Recorrente
O Checkout Recorrente permite que você automatize cobranças periódicas, como mensalidades, assinaturas ou serviços recorrentes. Ao criar um checkout com recorrência, a primeira cobrança é realizada no momento da conclusão do pagamento, e uma assinatura é criada automaticamente para as próximas cobranças.

📘
No momento, o Checkout Recorrente está disponível apenas para pagamentos via cartão de crédito. Em breve, outros meios de pagamento estarão disponíveis.

Para utilizar o checkout para cobranças recorrentes, você deve cria um checkout informando os campos obrigatórios para recorrência. Você deve incluir as informações do plano a ser criado, que são:

recurrence_plan: objeto com as definições do plano de cobrança recorrente.
name: nome do plano.
interval: intervalo de cobrança.
billing_cycles: número de cíclos de cobrança associados ao plano.
O bloco de código a seguir mostra exemplos de requisição e resposta para a utilização do checkout com cobrança recorrente.

Requisição
Resposta

{
  "reference_id": "TESTE_ASSINATURAS_3",
  "items": [
    {
      "name": "Item",
      "quantity": 3,
      "unit_amount": 1000
    }
  ],
  "shipping": {
    "type": "FIXED",
    "service_type": "SEDEX",
    "amount": 10,
    "address": {
      "country": "BRA",
      "region_code": "SP",
      "city": "São Paulo",
      "postal_code": "01452002",
      "street": "Faria Lima",
      "number": "1",
      "locality": "Pinheiros"
    },
    "address_modifiable": true,
    "estimated_delivery_time_in_days": 10
  },
  "discount_amount": 300,
  "notification_urls": [
    "https://meu-teste.com/notificacao"
  ],
  "expiration_date": "2025-04-30T23:59:59-03:00",
  "recurrence_plan": {
    "name": "UM plano qualquer",
    "interval": {
      "unit": "MONTH",
      "length": 1
    },
    "billing_cycles": 1
  }
}
Assim que o comprador realiza o primeiro pagamento, uma assinatura é gerada automaticamente.

As próximas cobranças ocorrem de forma automática, de acordo com a periodicidade configurada.

📘
O comprador deve utilizar cartão de crédito no primeiro pagamento.

Você pode acompanhar o status das assinaturas e pagamentos diretamente no seu painel.

O cancelamento da assinatura pode ser feito diretamente no painel de recorrência.

Para inativar um checkout recorrente utilize o mesmo fluxo de inativação do checkout.

Endpoints e Webhooks
A utilização da API de Checkout e Link de Pagamento é realizado por meio de quatro endpoints. Esses endpoints são apresentados a seguir:

Criar Checkout: permite que você crie e configure um checkout para cada compra realizada pelos seus clientes.
Consultar Checkout: possibilita que você recupere os dados associados a um checkout criado previamente. Utilize essa opção para verificar o status atual do checkout e da transação ou para recuperar dados relacionados ao montante, forma de pagamento, ou valor do frete, por exemplo.
Inativar Checkout: utilize essa opção para bloquear a realização do pagamento relacionado a um checkout criado previamente. O checkout continuará existindo com suas configurações. No entanto, o seu cliente não será capaz de realizar o pagamento enquanto o checkout estiver desativado.
Ativar Checkout: ativa um checkout previamente inativado. Enquanto o checkout está ativado, o cliente pode executar o pagamento.
Além dos endpoints, o PagBank também fornece webhooks que te notificarão sempre que um evento relacionado a mudança de status ocorrer. Essas notificações podem ser relacionadas ao checkout ou às transações a ele associadas. Para mais informações, acesse Webhooks.

📘
Homologação

Após finalizar os testes no ambiente de Sandbox, você precisa fazer a homologação junto ao PagBank.

Objeto Checkout
A API de Checkout utiliza o objeto Checkout. Para identificar todos os parâmetros, seus respectivos tipos e exemplos de cada parâmetro do objeto, acesse Objeto Checkout.

Erros
Os erros relacionados à requisição aos endpoints da API de Checkout estão normalmente associados ao fornecimento de parâmetros incorretos ou falta de autenticação. Para te auxiliar a entender os problemas ao executar as requisições, você pode acessar a página Códigos de erro, que lista os códigos que você pode receber e provê detalhes adicionais para cada erro.

Bandeiras aceitas
Durante a criação do checkout, você pode escolher quais bandeiras de cartão estarão disponíveis para o comprador executar o pagamento. Atualmente, as seguintes bandeiras de cartão são aceitas pelo Checkout do PagBank.

AMEX
AVISTA
AURA
BANESECARD
BRASILCARD
CABAL
CARDBAN
DINERS
DISCOVER
ELO
FORTBRASIL
GRANDCARD
HIPER
HIPERCARD
JCB
MAIS
MASTERCARD
PERSONALCARD
PLENOCARD
POLICARD
SOROCRED
UPBRASIL
VALECARD
VERDECARD
VISA