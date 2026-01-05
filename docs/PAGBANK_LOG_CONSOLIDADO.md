# 📋 Log de Testes PagBank Sandbox - Escrita360

**Data:** 05/01/2026  
**Ambiente:** Sandbox  
**Base URL:** https://sandbox.api.pagseguro.com

---

## 🆔 IDs Gerados (Requisições Reais)

| Tipo | ORDER_ID | CHARGE_ID | Status |
|------|----------|-----------|--------|
| **PIX** | `ORDE_367BABB7-2144-4247-ABC5-26232D8F04B9` | `QRCO_F7D7A43A-FCD5-43B9-8AE3-2D17F9E1D52F` | ✅ CREATED |
| **PIX** | `ORDE_767202A6-F334-4BC3-A579-3FBF87E8C549` | `QRCO_08AAE39A-F9AE-4C78-8A6D-E5CF9A521912` | ✅ CREATED |
| **PIX** | `ORDE_B890C1B1-FCC6-443D-BC00-EB09F290745C` | `QRCO_6B3C3F24-7095-4B65-B076-7A5414BFE0A6` | ✅ CREATED |
| **CREDIT_CARD** | `ORDE_7D7ECFD2-A5EB-4A1C-91E1-347CE1FB7B4D` | `CHAR_09F6DEBA-ABA7-4C76-B520-8E346B7CB4D3` | ✅ PAID |

---

## 1. PIX - Pagamento com QR Code

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

## 2. CREDIT_CARD - Pagamento com Cartão de Crédito (Criptografado)

### Request

```json
{
    "reference_id": "ex-00001",
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
            "reference_id": "referencia do item",
            "name": "nome do item",
            "quantity": 1,
            "unit_amount": 500
        }
    ],
    "shipping": {
        "address": {
            "street": "Avenida Brigadeiro Faria Lima",
            "number": "1384",
            "complement": "apto 12",
            "locality": "Pinheiros",
            "city": "São Paulo",
            "region_code": "SP",
            "country": "BRA",
            "postal_code": "01452002"
        }
    },
    "notification_urls": [
        "https://meusite.com/notificacoes"
    ],
    "charges": [
        {
            "reference_id": "referencia da cobranca",
            "description": "descricao da cobranca",
            "amount": {
                "value": 500,
                "currency": "BRL"
            },
            "payment_method": {
                "type": "CREDIT_CARD",
                "installments": 1,
                "capture": true,
                "card": {
                    "encrypted": "mKSnk0i1JaDw69Ino8AMABWIBCS9e1tfvt0K69xx38bOvaX46MGV/PkS6yzODk64CZ/SPuqqD7hV459NiR0+QnkA9zOiXYUdLCUChS5MadbqfZvzu6J8dfkizvfN2oYODflZa0+UmOPn35J8gQwSZq+QWZdYX5+Jqm0Ve2gYB9XBIEb1CPBt3ghvSNU7bBhwafxZUZpBffQc5UOYChhH75EF5MWjk0rQOCV9xU2TCjoRpQfVph/Jg2H20KtZ+FNOgEkH/WBnHbH0/rghpp7J/MHnGSaXnkMCnE44vpFt+gSge5WIgT9lQTz7XkrThPsS5WEmeMVuE+eslLeRtI1HKg==",
                    "store": true
                },
                "holder": {
                    "name": "Jose da Silva",
                    "tax_id": "65544332211"
                }
            }
        }
    ]
}
```

### Response

```json
{
    "id": "ORDE_7D7ECFD2-A5EB-4A1C-91E1-347CE1FB7B4D",
    "reference_id": "ex-00001",
    "created_at": "2024-12-16T14:01:37.791-03:00",
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
            "reference_id": "referencia do item",
            "name": "nome do item",
            "quantity": 1,
            "unit_amount": 500
        }
    ],
    "shipping": {
        "address": {
            "street": "Avenida Brigadeiro Faria Lima",
            "number": "1384",
            "complement": "apto 12",
            "locality": "Pinheiros",
            "city": "São Paulo",
            "region_code": "SP",
            "country": "BRA",
            "postal_code": "01452002"
        }
    },
    "charges": [
        {
            "id": "CHAR_09F6DEBA-ABA7-4C76-B520-8E346B7CB4D3",
            "reference_id": "referencia da cobranca",
            "status": "PAID",
            "created_at": "2024-12-16T14:01:37.918-03:00",
            "paid_at": "2024-12-16T14:01:39.000-03:00",
            "description": "descricao da cobranca",
            "amount": {
                "value": 500,
                "currency": "BRL",
                "summary": {
                    "total": 500,
                    "paid": 500,
                    "refunded": 0
                }
            },
            "payment_response": {
                "code": "20000",
                "message": "SUCESSO",
                "reference": "032416400102",
                "raw_data": {
                    "authorization_code": "145803",
                    "nsu": "032416400102",
                    "reason_code": "00"
                }
            },
            "payment_method": {
                "type": "CREDIT_CARD",
                "installments": 1,
                "capture": true,
                "card": {
                    "id": "CARD_2540044F-EA6A-4DEF-BC9B-12D50E4E1C04",
                    "brand": "mastercard",
                    "first_digits": "524008",
                    "last_digits": "2454",
                    "exp_month": "12",
                    "exp_year": "2026",
                    "holder": {
                        "name": "Nome Sobrenome"
                    },
                    "store": true
                },
                "soft_descriptor": "IntegracaoPagseguro"
            },
            "links": [
                {
                    "rel": "SELF",
                    "href": "https://sandbox.api.pagseguro.com/charges/CHAR_09F6DEBA-ABA7-4C76-B520-8E346B7CB4D3",
                    "media": "application/json",
                    "type": "GET"
                },
                {
                    "rel": "CHARGE.CANCEL",
                    "href": "https://sandbox.api.pagseguro.com/charges/CHAR_09F6DEBA-ABA7-4C76-B520-8E346B7CB4D3/cancel",
                    "media": "application/json",
                    "type": "POST"
                }
            ]
        }
    ],
    "notification_urls": [
        "https://meusite.com/notificacoes"
    ],
    "links": [
        {
            "rel": "SELF",
            "href": "https://sandbox.api.pagseguro.com/orders/ORDE_7D7ECFD2-A5EB-4A1C-91E1-347CE1FB7B4D",
            "media": "application/json",
            "type": "GET"
        },
        {
            "rel": "PAY",
            "href": "https://sandbox.api.pagseguro.com/orders/ORDE_7D7ECFD2-A5EB-4A1C-91E1-347CE1FB7B4D/pay",
            "media": "application/json",
            "type": "POST"
        }
    ]
}
```

---

## 📊 Resumo dos IDs

### ORDER_IDs

| ORDER_ID | Tipo | Data |
|----------|------|------|
| `ORDE_367BABB7-2144-4247-ABC5-26232D8F04B9` | PIX | 05/01/2026 |
| `ORDE_767202A6-F334-4BC3-A579-3FBF87E8C549` | PIX | 05/01/2026 |
| `ORDE_B890C1B1-FCC6-443D-BC00-EB09F290745C` | PIX | 05/01/2026 |
| `ORDE_7D7ECFD2-A5EB-4A1C-91E1-347CE1FB7B4D` | CREDIT_CARD | 16/12/2024 |

### CHARGE_IDs / QR_CODE_IDs

| ID | Tipo | Status |
|----|------|--------|
| `QRCO_F7D7A43A-FCD5-43B9-8AE3-2D17F9E1D52F` | PIX QR Code | WAITING_PAYMENT |
| `QRCO_08AAE39A-F9AE-4C78-8A6D-E5CF9A521912` | PIX QR Code | WAITING_PAYMENT |
| `QRCO_6B3C3F24-7095-4B65-B076-7A5414BFE0A6` | PIX QR Code | WAITING_PAYMENT |
| `CHAR_09F6DEBA-ABA7-4C76-B520-8E346B7CB4D3` | Cartão Crédito | PAID |

### CARD_IDs (Cartões Salvos)

| CARD_ID | Bandeira | Últimos Dígitos |
|---------|----------|-----------------|
| `CARD_2540044F-EA6A-4DEF-BC9B-12D50E4E1C04` | Mastercard | 2454 |

---

## 🔗 Links Úteis

### QR Codes PIX (Imagens)
- https://sandbox.api.pagseguro.com/qrcode/QRCO_F7D7A43A-FCD5-43B9-8AE3-2D17F9E1D52F/png
- https://sandbox.api.pagseguro.com/qrcode/QRCO_08AAE39A-F9AE-4C78-8A6D-E5CF9A521912/png
- https://sandbox.api.pagseguro.com/qrcode/QRCO_6B3C3F24-7095-4B65-B076-7A5414BFE0A6/png

### Consultar Pedidos
- https://sandbox.api.pagseguro.com/orders/ORDE_367BABB7-2144-4247-ABC5-26232D8F04B9
- https://sandbox.api.pagseguro.com/orders/ORDE_7D7ECFD2-A5EB-4A1C-91E1-347CE1FB7B4D

### Consultar/Cancelar Cobranças
- https://sandbox.api.pagseguro.com/charges/CHAR_09F6DEBA-ABA7-4C76-B520-8E346B7CB4D3
- https://sandbox.api.pagseguro.com/charges/CHAR_09F6DEBA-ABA7-4C76-B520-8E346B7CB4D3/cancel

---

*Log gerado automaticamente - Escrita360*
