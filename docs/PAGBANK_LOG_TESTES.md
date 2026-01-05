# 📋 Log de Testes PagBank Sandbox

**Data:** 05/01/2026, 16:38:57
**Ambiente:** Sandbox
**Base URL:** https://sandbox.api.pagseguro.com

---

## 🆔 IDs Gerados

| Tipo | ORDER_ID | CHARGE_ID | Status |
|------|----------|-----------|--------|
| PIX | `ORDE_367BABB7-2144-4247-ABC5-26232D8F04B9` | `QRCO_F7D7A43A-FCD5-43B9-8AE3-2D17F9E1D52F` | CREATED |
| CREDIT_CARD | `N/A` | `N/A` | FAILED |
| BOLETO | `N/A` | `N/A` | FAILED |

---

## 1. PIX

### Request

```json
{
    "reference_id": "pix_1767645533780",
    "customer": {
        "name": "Jose da Silva",
        "email": "email@test.com",
        "tax_id": "12345678909",
        "phones": [
            {
                "country": "55",
                "area": "11",
                "number": "999999999",
                "type": "MOBILE"
            }
        ]
    },
    "items": [
        {
            "reference_id": "plano_escrita360",
            "name": "Plano Profissional - Escrita360",
            "quantity": 1,
            "unit_amount": 9900
        }
    ],
    "qr_codes": [
        {
            "amount": {
                "value": 9900
            },
            "expiration_date": "2026-01-05T21:38:53.780Z"
        }
    ],
    "notification_urls": [
        "https://escrita360.com/api/webhook/pagbank"
    ]
}
```

### Response

```json
{
    "id": "ORDE_367BABB7-2144-4247-ABC5-26232D8F04B9",
    "reference_id": "pix_1767645533780",
    "created_at": "2026-01-05T17:38:54.235-03:00",
    "customer": {
        "name": "Jose da Silva",
        "email": "email@test.com",
        "tax_id": "12345678909",
        "phones": [
            {
                "type": "MOBILE",
                "country": "55",
                "area": "11",
                "number": "999999999"
            }
        ]
    },
    "items": [
        {
            "reference_id": "plano_escrita360",
            "name": "Plano Profissional - Escrita360",
            "quantity": 1,
            "unit_amount": 9900
        }
    ],
    "qr_codes": [
        {
            "id": "QRCO_F7D7A43A-FCD5-43B9-8AE3-2D17F9E1D52F",
            "expiration_date": "2026-01-05T18:38:53.000-03:00",
            "amount": {
                "value": 9900
            },
            "text": "00020101021226850014br.gov.bcb.pix2563api-h.pagseguro.com/pix/v2/F7D7A43A-FCD5-43B9-8AE3-2D17F9E1D52F27600016BR.COM.PAGSEGURO0136F7D7A43A-FCD5-43B9-8AE3-2D17F9E1D52F520482205303986540599.005802BR5916NI projetos LTDA6015Sao Bernardo do62070503***63040BAC",
            "arrangements": [
                "PIX"
            ],
            "links": [
                {
                    "rel": "QRCODE.PNG",
                    "href": "https://sandbox.api.pagseguro.com/qrcode/QRCO_F7D7A43A-FCD5-43B9-8AE3-2D17F9E1D52F/png",
                    "media": "image/png",
                    "type": "GET"
                },
                {
                    "rel": "QRCODE.BASE64",
                    "href": "https://sandbox.api.pagseguro.com/qrcode/QRCO_F7D7A43A-FCD5-43B9-8AE3-2D17F9E1D52F/base64",
                    "media": "text/plain",
                    "type": "GET"
                }
            ]
        }
    ],
    "notification_urls": [
        "https://escrita360.com/api/webhook/pagbank"
    ],
    "links": [
        {
            "rel": "SELF",
            "href": "https://sandbox.api.pagseguro.com/orders/ORDE_367BABB7-2144-4247-ABC5-26232D8F04B9",
            "media": "application/json",
            "type": "GET"
        },
        {
            "rel": "PAY",
            "href": "https://sandbox.api.pagseguro.com/orders/ORDE_367BABB7-2144-4247-ABC5-26232D8F04B9/pay",
            "media": "application/json",
            "type": "POST"
        }
    ]
}
```

---

## 2. CREDIT_CARD

### Request

```json
{
    "reference_id": "card_1767645534869",
    "customer": {
        "name": "Jose da Silva",
        "email": "email@test.com",
        "tax_id": "12345678909",
        "phones": [
            {
                "country": "55",
                "area": "11",
                "number": "999999999",
                "type": "MOBILE"
            }
        ]
    },
    "items": [
        {
            "reference_id": "plano_basico",
            "name": "Plano Básico - Escrita360",
            "quantity": 1,
            "unit_amount": 2990
        }
    ],
    "shipping": {
        "address": {
            "street": "Avenida Brigadeiro Faria Lima",
            "number": "1384",
            "complement": "apto 12",
            "locality": "Pinheiros",
            "city": "São Paulo",
            "region": "São Paulo",
            "region_code": "SP",
            "country": "BRA",
            "postal_code": "01452002"
        }
    },
    "notification_urls": [
        "https://escrita360.com/api/webhook/pagbank"
    ],
    "charges": [
        {
            "reference_id": "charge_1767645534869",
            "description": "Pagamento Plano Básico Escrita360",
            "amount": {
                "value": 2990,
                "currency": "BRL"
            },
            "payment_method": {
                "type": "CREDIT_CARD",
                "installments": 1,
                "capture": true,
                "card": {
                    "number": "4111111111111111",
                    "exp_month": "12",
                    "exp_year": "2030",
                    "security_code": "123",
                    "holder": {
                        "name": "Jose da Silva"
                    },
                    "store": true
                }
            }
        }
    ]
}
```

### Response

```json
{
    "rawResponse": ""
}
```

---

## 3. BOLETO

### Request

```json
{
    "reference_id": "boleto_1767645536125",
    "customer": {
        "name": "Maria Santos",
        "email": "maria@test.com",
        "tax_id": "12345678909",
        "phones": [
            {
                "country": "55",
                "area": "11",
                "number": "999999999",
                "type": "MOBILE"
            }
        ]
    },
    "items": [
        {
            "reference_id": "plano_avancado",
            "name": "Plano Avançado - Escrita360",
            "quantity": 1,
            "unit_amount": 4990
        }
    ],
    "notification_urls": [
        "https://escrita360.com/api/webhook/pagbank"
    ],
    "charges": [
        {
            "reference_id": "boleto_charge_1767645536125",
            "description": "Pagamento Plano Avançado Escrita360",
            "amount": {
                "value": 4990,
                "currency": "BRL"
            },
            "payment_method": {
                "type": "BOLETO",
                "boleto": {
                    "due_date": "2026-01-08",
                    "instruction_lines": {
                        "line_1": "Pagamento referente ao Plano Escrita360",
                        "line_2": "Não receber após o vencimento"
                    },
                    "holder": {
                        "name": "Maria Santos",
                        "tax_id": "12345678909",
                        "email": "maria@test.com",
                        "address": {
                            "street": "Rua das Flores",
                            "number": "100",
                            "complement": "Sala 1",
                            "locality": "Centro",
                            "city": "São Paulo",
                            "region": "São Paulo",
                            "region_code": "SP",
                            "country": "BRA",
                            "postal_code": "01310100"
                        }
                    }
                }
            }
        }
    ]
}
```

### Response

```json
{
    "rawResponse": ""
}
```

---


*Log gerado automaticamente pelo script test-pagbank-real.js*