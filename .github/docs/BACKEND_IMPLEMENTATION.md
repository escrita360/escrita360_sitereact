# Implementação Backend - Endpoints PagBank

Este arquivo contém a implementação dos endpoints necessários para resolver o problema CORS.

## 📁 Estrutura de Arquivos

```
escrita360_BACKEND/
├── app/
│   ├── routes/
│   │   └── payment.py          # NOVO: Endpoints PagBank
│   ├── services/
│   │   ├── pagbank_service.py      # NOVO: Serviço PagBank
│   │   └── pagbank_subscriptions_service.py  # NOVO: Serviço Assinaturas
│   └── __init__.py
├── requirements.txt             # Adicionar dependências
└── .env.example                 # Configurações PagBank
```

## 📦 Dependências Necessárias

Adicione ao `requirements.txt`:

```txt
requests==2.31.0
python-dotenv==1.0.0
```

## ⚙️ Configurações de Ambiente

Adicione ao `.env.example`:

```env
# PagBank
PAGBANK_ENV=sandbox
PAGBANK_TOKEN=your_token_here
PAGBANK_APP_ID=your_app_id_here
```

## 🔧 Implementação dos Serviços

### 1. `app/services/pagbank_service.py`

```python
import os
import requests
from dotenv import load_dotenv

load_dotenv()

class PagBankService:
    def __init__(self):
        self.environment = os.getenv('PAGBANK_ENV', 'sandbox')
        self.token = os.getenv('PAGBANK_TOKEN')

        if self.environment == 'sandbox':
            self.base_url = 'https://sandbox.api.pagseguro.com'
        else:
            self.base_url = 'https://api.pagseguro.com'

        self.headers = {
            'Authorization': f'Bearer {self.token}',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }

    def make_request(self, endpoint, method='GET', data=None):
        """Faz requisições para a API PagBank"""
        url = f"{self.base_url}{endpoint}"

        try:
            if method == 'GET':
                response = requests.get(url, headers=self.headers)
            elif method == 'POST':
                response = requests.post(url, headers=self.headers, json=data)
            elif method == 'PUT':
                response = requests.put(url, headers=self.headers, json=data)
            else:
                raise ValueError(f"Método HTTP não suportado: {method}")

            response.raise_for_status()
            return response.json()

        except requests.exceptions.RequestException as e:
            print(f"Erro na requisição PagBank: {e}")
            raise

    def format_tax_id(self, tax_id):
        """Formata CPF/CNPJ removendo caracteres não numéricos"""
        return ''.join(filter(str.isdigit, tax_id))

    def format_phone(self, phone):
        """Formata telefone para o padrão PagBank"""
        clean_phone = ''.join(filter(str.isdigit, phone))

        if len(clean_phone) >= 10:
            return {
                'country': '55',
                'area': clean_phone[:2],
                'number': clean_phone[2:],
                'type': 'MOBILE'
            }
        else:
            raise ValueError("Telefone inválido")

    def create_checkout_link(self, checkout_data):
        """Cria link de checkout PagBank"""
        # Implementação baseada na documentação PagBank
        # https://dev.pagbank.uol.com.br/docs/criar-link-de-pagamento

        payload = {
            'reference_id': f"checkout_{checkout_data['reference_id']}",
            'items': checkout_data['items'],
            'customer': {
                'name': checkout_data['customer']['name'],
                'email': checkout_data['customer']['email'],
                'tax_id': self.format_tax_id(checkout_data['customer']['cpf']),
                'phones': [self.format_phone(checkout_data['customer']['phone'])]
            },
            'redirect_url': checkout_data.get('redirect_url'),
            'notification_urls': checkout_data.get('notification_urls', [])
        }

        return self.make_request('/checkouts', 'POST', payload)

    def create_pix_payment(self, payment_data):
        """Cria pagamento PIX"""
        # Implementação baseada na documentação
        # https://dev.pagbank.uol.com.br/docs/pagamento-com-pix

        payload = {
            'reference_id': f"pix_{payment_data['reference_id']}",
            'customer': {
                'name': payment_data['customer']['name'],
                'email': payment_data['customer']['email'],
                'tax_id': self.format_tax_id(payment_data['customer']['cpf']),
                'phones': [self.format_phone(payment_data['customer']['phone'])]
            },
            'items': [{
                'name': payment_data.get('description', 'Pagamento'),
                'quantity': 1,
                'unit_amount': int(payment_data['amount'] * 100)
            }],
            'qr_codes': [{
                'amount': {
                    'value': int(payment_data['amount'] * 100)
                },
                'expiration_date': payment_data.get('expiration_date')
            }]
        }

        return self.make_request('/orders', 'POST', payload)

    def process_card_payment(self, payment_data):
        """Processa pagamento com cartão"""
        # Implementação baseada na documentação
        # https://dev.pagbank.uol.com.br/docs/pagamento-com-cartao

        payload = {
            'reference_id': f"card_{payment_data['reference_id']}",
            'customer': {
                'name': payment_data['customer']['name'],
                'email': payment_data['customer']['email'],
                'tax_id': self.format_tax_id(payment_data['customer']['cpf']),
                'phones': [self.format_phone(payment_data['customer']['phone'])]
            },
            'items': [{
                'name': payment_data.get('description', 'Pagamento'),
                'quantity': 1,
                'unit_amount': int(payment_data['amount'] * 100)
            }],
            'charges': [{
                'reference_id': f"charge_{payment_data['reference_id']}",
                'amount': {
                    'value': int(payment_data['amount'] * 100),
                    'currency': 'BRL'
                },
                'payment_method': {
                    'type': 'CREDIT_CARD',
                    'installments': payment_data.get('installments', 1),
                    'capture': True,
                    'card': {
                        'encrypted': payment_data['card']['encrypted'],
                        'security_code': payment_data['card']['cvv'],
                        'holder': {
                            'name': payment_data['card']['holder_name']
                        }
                    }
                }
            }]
        }

        return self.make_request('/orders', 'POST', payload)

    def get_order_status(self, order_id):
        """Consulta status de um pedido"""
        return self.make_request(f'/orders/{order_id}')

    def list_orders(self, filters=None):
        """Lista pedidos com filtros"""
        params = filters or {}
        query_string = '&'.join([f"{k}={v}" for k, v in params.items()])
        endpoint = f'/orders{"?" + query_string if query_string else ""}'
        return self.make_request(endpoint)

    def cancel_order(self, order_id):
        """Cancela um pedido"""
        return self.make_request(f'/orders/{order_id}/cancel', 'POST')
```

### 2. `app/services/pagbank_subscriptions_service.py`

```python
import os
import requests
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

class PagBankSubscriptionsService:
    def __init__(self):
        self.environment = os.getenv('PAGBANK_ENV', 'sandbox')
        self.token = os.getenv('PAGBANK_TOKEN')

        if self.environment == 'sandbox':
            self.base_url = 'https://sandbox.api.assinaturas.pagseguro.com'
        else:
            self.base_url = 'https://api.assinaturas.pagseguro.com'

        self.headers = {
            'Authorization': f'Bearer {self.token}',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }

    def make_request(self, endpoint, method='GET', data=None):
        """Faz requisições para a API de Assinaturas PagBank"""
        url = f"{self.base_url}{endpoint}"

        try:
            if method == 'GET':
                response = requests.get(url, headers=self.headers)
            elif method == 'POST':
                response = requests.post(url, headers=self.headers, json=data)
            elif method == 'PUT':
                response = requests.put(url, headers=self.headers, json=data)
            else:
                raise ValueError(f"Método HTTP não suportado: {method}")

            response.raise_for_status()
            return response.json()

        except requests.exceptions.RequestException as e:
            print(f"Erro na requisição PagBank Subscriptions: {e}")
            raise

    def format_tax_id(self, tax_id):
        """Formata CPF/CNPJ removendo caracteres não numéricos"""
        return ''.join(filter(str.isdigit, tax_id))

    def format_phone(self, phone):
        """Formata telefone para o padrão PagBank"""
        clean_phone = ''.join(filter(str.isdigit, phone))

        if len(clean_phone) >= 10:
            return {
                'country': '55',
                'area': clean_phone[:2],
                'number': clean_phone[2:],
                'type': 'MOBILE'
            }
        else:
            raise ValueError("Telefone inválido")

    def create_plan(self, plan_data):
        """Cria um plano de assinatura"""
        payload = {
            'reference_id': f"plan_{datetime.now().timestamp()}",
            'name': plan_data['name'],
            'description': plan_data.get('description', f"Plano {plan_data['name']}"),
            'amount': {
                'value': int(plan_data['amount'] * 100),
                'currency': 'BRL'
            },
            'interval': {
                'unit': plan_data.get('interval_unit', 'MONTH'),
                'length': plan_data.get('interval_value', 1)
            },
            'payment_method': plan_data.get('payment_methods', ['CREDIT_CARD', 'BOLETO'])
        }

        if plan_data.get('trial'):
            payload['trial'] = {
                'enabled': True,
                'hold_setup_fee': False,
                'days': plan_data['trial']
            }

        return self.make_request('/plans', 'POST', payload)

    def create_subscriber(self, subscriber_data):
        """Cria um assinante"""
        payload = {
            'reference_id': f"customer_{datetime.now().timestamp()}",
            'name': subscriber_data['name'],
            'email': subscriber_data['email'],
            'tax_id': self.format_tax_id(subscriber_data['tax_id']),
            'phones': [self.format_phone(subscriber_data['phone'])]
        }

        if subscriber_data.get('address'):
            payload['address'] = subscriber_data['address']

        return self.make_request('/customers', 'POST', payload)

    def create_subscription(self, subscription_data):
        """Cria uma assinatura"""
        customer_data = subscription_data['customer']
        payment_method = subscription_data.get('payment_method', 'CREDIT_CARD')

        payload = {
            'reference_id': f"subscription_{datetime.now().timestamp()}",
            'plan': {
                'id': subscription_data['plan_id']
            },
            'payment_method': []
        }

        # Cliente
        if customer_data.get('id'):
            # Cliente existente
            payload['customer'] = {
                'id': customer_data['id']
            }
        else:
            # Criar cliente novo
            payload['customer'] = {
                'reference_id': f"customer_{datetime.now().timestamp()}",
                'name': customer_data['name'],
                'email': customer_data['email'],
                'tax_id': self.format_tax_id(customer_data['cpf']),
                'phones': [self.format_phone(customer_data['phone'])]
            }

            # Endereço obrigatório para boleto
            if payment_method == 'BOLETO':
                payload['customer']['address'] = customer_data.get('address', {
                    'street': 'Rua Exemplo',
                    'number': '123',
                    'complement': 'Apto 1',
                    'locality': 'Centro',
                    'city': 'São Paulo',
                    'region_code': 'SP',
                    'country': 'BRA',
                    'postal_code': '01310100'
                })

            # Dados do cartão para crédito
            if payment_method == 'CREDIT_CARD' and subscription_data.get('card_token'):
                payload['customer']['billing_info'] = [{
                    'type': 'CREDIT_CARD',
                    'card': {
                        'token': subscription_data['card_token'],
                        'security_code': subscription_data['card_security_code']
                    }
                }]

        # Método de pagamento
        if payment_method == 'CREDIT_CARD':
            payload['payment_method'].append({
                'type': 'CREDIT_CARD',
                'card': {
                    'security_code': subscription_data.get('card_security_code', '')
                }
            })
        elif payment_method == 'BOLETO':
            payload['payment_method'].append({
                'type': 'BOLETO'
            })

        # Valor customizado (opcional)
        if subscription_data.get('amount'):
            payload['amount'] = {
                'value': int(subscription_data['amount'] * 100),
                'currency': 'BRL'
            }

        return self.make_request('/subscriptions', 'POST', payload)

    def create_complete_subscription(self, data):
        """Fluxo completo: criar plano + cliente + assinatura"""
        try:
            # 1. Criar plano
            plan = self.create_plan({
                'name': data['plan_name'],
                'description': data['plan_description'],
                'amount': data['amount'],
                'interval_unit': data['interval_unit'],
                'interval_value': data['interval_value'],
                'payment_methods': ['CREDIT_CARD', 'BOLETO']
            })

            # 2. Criar cliente
            customer = self.create_subscriber({
                'name': data['customer']['name'],
                'email': data['customer']['email'],
                'tax_id': data['customer']['cpf'],
                'phone': data['customer']['phone']
            })

            # 3. Criar assinatura
            subscription = self.create_subscription({
                'plan_id': plan['id'],
                'customer': { 'id': customer['id'] },
                'payment_method': data.get('payment_method', 'BOLETO'),
                'card_token': data.get('card_token'),
                'card_security_code': data.get('card_security_code')
            })

            return {
                'plan': plan,
                'customer': customer,
                'subscription': subscription
            }

        except Exception as e:
            print(f"Erro no fluxo completo: {e}")
            raise

    def list_plans(self, filters=None):
        """Lista planos"""
        params = filters or {}
        query_string = '&'.join([f"{k}={v}" for k, v in params.items()])
        endpoint = f'/plans{"?" + query_string if query_string else ""}'
        return self.make_request(endpoint)

    def get_plan(self, plan_id):
        """Consulta plano específico"""
        return self.make_request(f'/plans/{plan_id}')

    def list_subscriptions(self, filters=None):
        """Lista assinaturas"""
        params = filters or {}
        query_string = '&'.join([f"{k}={v}" for k, v in params.items()])
        endpoint = f'/subscriptions{"?" + query_string if query_string else ""}'
        return self.make_request(endpoint)

    def get_subscription(self, subscription_id):
        """Consulta assinatura específica"""
        return self.make_request(f'/subscriptions/{subscription_id}')

    def cancel_subscription(self, subscription_id):
        """Cancela assinatura"""
        return self.make_request(f'/subscriptions/{subscription_id}/cancel', 'PUT')
```

### 3. `app/routes/payment.py`

```python
from flask import Blueprint, request, jsonify
from app.services.pagbank_service import PagBankService
from app.services.pagbank_subscriptions_service import PagBankSubscriptionsService

payment_bp = Blueprint('payment', __name__)

# Instâncias dos serviços
pagbank_service = PagBankService()
pagbank_subscriptions_service = PagBankSubscriptionsService()

@payment_bp.route('/create-pagbank-subscription', methods=['POST'])
def create_pagbank_subscription():
    """Cria assinatura recorrente PagBank"""
    try:
        data = request.get_json()

        result = pagbank_subscriptions_service.create_complete_subscription({
            'plan_name': data['plan_name'],
            'plan_description': data['plan_description'],
            'amount': data['amount'],
            'interval_unit': data['interval_unit'],
            'interval_value': data['interval_value'],
            'customer': data['customer'],
            'payment_method': data.get('payment_method', 'BOLETO'),
            'card_token': data.get('card_token'),
            'card_security_code': data.get('card_security_code')
        })

        return jsonify(result), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 400

@payment_bp.route('/create-pagbank-checkout', methods=['POST'])
def create_pagbank_checkout():
    """Cria checkout PagBank"""
    try:
        data = request.get_json()

        items = [{
            'name': data['plan_name'],
            'quantity': 1,
            'unit_amount': int(data['amount'] * 100)
        }]

        checkout_data = {
            'reference_id': f"checkout_{data['plan_id']}",
            'items': items,
            'customer': data['customer'],
            'redirect_url': f"{request.host_url}pagamento-sucesso",
            'notification_urls': [f"{request.host_url}webhooks/pagbank"]
        }

        result = pagbank_service.create_checkout_link(checkout_data)
        return jsonify(result), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 400

@payment_bp.route('/process-pagbank-card-payment', methods=['POST'])
def process_pagbank_card_payment():
    """Processa pagamento com cartão PagBank"""
    try:
        data = request.get_json()

        # Aqui seria necessário criptografar os dados do cartão
        # usando a biblioteca JavaScript do PagBank no frontend
        # e enviar o encrypted_card para o backend

        payment_data = {
            'reference_id': f"card_{data['plan_name'].lower().replace(' ', '_')}",
            'customer': data['customer'],
            'amount': data['amount'],
            'installments': data.get('installments', 1),
            'description': f"Plano {data['plan_name']}",
            'card': {
                'encrypted': data['card'].get('encrypted', 'placeholder'),
                'cvv': data['card']['cvv'],
                'holder_name': data['card']['holder_name']
            }
        }

        result = pagbank_service.process_card_payment(payment_data)
        return jsonify(result), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 400

@payment_bp.route('/create-pagbank-pix-payment', methods=['POST'])
def create_pagbank_pix_payment():
    """Cria pagamento PIX PagBank"""
    try:
        data = request.get_json()

        payment_data = {
            'reference_id': f"pix_{data['plan_name'].lower().replace(' ', '_')}",
            'customer': data['customer'],
            'amount': data['amount'],
            'description': f"Plano {data['plan_name']}",
            'expiration_date': None  # Implementar cálculo de expiração
        }

        result = pagbank_service.create_pix_payment(payment_data)
        return jsonify(result), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 400

@payment_bp.route('/pagbank-status/<order_id>', methods=['GET'])
def get_pagbank_payment_status(order_id):
    """Consulta status de pagamento PagBank"""
    try:
        result = pagbank_service.get_order_status(order_id)
        return jsonify(result), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 400

@payment_bp.route('/pagbank-payments', methods=['GET'])
def list_pagbank_payments():
    """Lista pagamentos PagBank"""
    try:
        filters = request.args.to_dict()
        result = pagbank_service.list_orders(filters)
        return jsonify(result), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 400

@payment_bp.route('/cancel-pagbank-payment/<order_id>', methods=['POST'])
def cancel_pagbank_payment(order_id):
    """Cancela pagamento PagBank"""
    try:
        result = pagbank_service.cancel_order(order_id)
        return jsonify(result), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 400
```

## 🔗 Integração com o App Flask

Adicione ao `app/__init__.py`:

```python
from app.routes.payment import payment_bp

app.register_blueprint(payment_bp, url_prefix='/api/payment')
```

## 🧪 Teste dos Endpoints

### 1. Teste de Assinatura

```bash
curl -X POST http://localhost:5000/api/payment/create-pagbank-subscription \
  -H "Content-Type: application/json" \
  -d '{
    "plan_name": "Plano Profissional",
    "plan_description": "Plano mensal profissional",
    "amount": 49.90,
    "interval_unit": "MONTH",
    "interval_value": 1,
    "customer": {
      "name": "João Silva",
      "email": "joao@email.com",
      "cpf": "12345678901",
      "phone": "11999999999"
    },
    "payment_method": "BOLETO"
  }'
```

### 2. Teste de PIX

```bash
curl -X POST http://localhost:5000/api/payment/create-pagbank-pix-payment \
  -H "Content-Type: application/json" \
  -d '{
    "plan_name": "Plano Básico",
    "amount": 29.90,
    "customer": {
      "name": "Maria Santos",
      "email": "maria@email.com",
      "cpf": "98765432100",
      "phone": "11888888888"
    },
    "expiration_minutes": 30
  }'
```

## ⚠️ Considerações de Segurança

1. **Nunca armazene dados de cartão** no backend
2. **Use HTTPS** em produção
3. **Valide tokens JWT** para autenticação
4. **Implemente rate limiting** para prevenir abusos
5. **Log todas as operações** para auditoria

## 🔄 Webhooks

Implemente o endpoint de webhooks para receber notificações do PagBank:

```python
@payment_bp.route('/webhooks/pagbank', methods=['POST'])
def pagbank_webhook():
    """Recebe notificações do PagBank"""
    data = request.get_json()
    # Processar notificação
    # Atualizar status no banco de dados
    return jsonify({'status': 'ok'}), 200
```

Esta implementação resolve o problema CORS movendo todas as chamadas PagBank para o backend, mantendo a segurança e seguindo as melhores práticas.