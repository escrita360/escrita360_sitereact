# 📋 Relatório de Validação - PagBank Sandbox

**Data de Execução:** 05/01/2026, 16:24:21
**Ambiente:** sandbox
**Base URL:** https://sandbox.api.pagseguro.com

---

## 📊 Resumo

| Testes Executados | Sucesso | Falha |
|-------------------|---------|-------|
| 6 | 3 ✅ | 3 ❌ |

---

## 🆔 IDs Reais Gerados no Sandbox

### ORDER_IDs

| Tipo | ORDER_ID | CHARGE_ID | Reference ID | Status |
|------|----------|-----------|--------------|--------|
| PIX | `ORDE_B890C1B1-FCC6-443D-BC00-EB09F290745C` | `QRCO_6B3C3F24-7095-4B65-B076-7A5414BFE0A6` | `escrita360_pix_1767644656712` | CREATED |
| get_order | `ORDE_B890C1B1-FCC6-443D-BC00-EB09F290745C` | `N/A` | `N/A` | CREATED |

---

## 🧪 Detalhes dos Testes

### 1. ✅ PUBLIC_KEYS

- **Endpoint:** `POST /public-keys`
- **Status HTTP:** 200
- **Timestamp:** 2026-01-05T20:24:15.606Z

<details>
<summary>📋 Resposta Completa (JSON)</summary>

```json
{
  "public_key": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAr+ZqgD892U9/HXsa7XqBZUayPquAfh9xx4iwUbTSUAvTlmiXFQNTp0Bvt/5vK2FhMj39qSv1zi2OuBjvW38q1E374nzx6NNBL5JosV0+SDINTlCG0cmigHuBOyWzYmjgca+mtQu4WczCaApNaSuVqgb8u7Bd9GCOL4YJotvV5+81frlSwQXralhwRzGhj/A57CGPgGKiuPT+AOGmykIGEZsSD9RKkyoKIoc0OS8CPIzdBOtTQCIwrLn2FxI83Clcg55W8gkFSOS6rWNbG5qFZWMll6yl02HtunalHmUlRUL66YeGXdMDC2PuRcmZbGO5a/2tbVppW6mfSWG3NPRpgwIDAQAB",
  "created_at": 1577836800000
}
```
</details>

### 2. ❌ CREATE_CUSTOMER

- **Endpoint:** `POST /customers`
- **Status HTTP:** 403
- **Timestamp:** 2026-01-05T20:24:16.640Z

<details>
<summary>📋 Resposta Completa (JSON)</summary>

```json
{
  "rawResponse": "<!DOCTYPE html>\n<!--[if lt IE 7]> <html class=\"no-js ie6 oldie\" lang=\"en-US\"> <![endif]-->\n<!--[if IE 7]>    <html class=\"no-js ie7 oldie\" lang=\"en-US\"> <![endif]-->\n<!--[if IE 8]>    <html class=\"no-js ie8 oldie\" lang=\"en-US\"> <![endif]-->\n<!--[if gt IE 8]><!--> <html class=\"no-js\" lang=\"en-US\"> <!--<![endif]-->\n<head>\n<title>Attention Required! | Cloudflare</title>\n<meta charset=\"UTF-8\" />\n<meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\" />\n<meta http-equiv=\"X-UA-Compatible\" content=\"IE=Edge\" />\n<meta name=\"robots\" content=\"noindex, nofollow\" />\n<meta name=\"viewport\" content=\"width=device-width,initial-scale=1\" />\n<link rel=\"stylesheet\" id=\"cf_styles-css\" href=\"/cdn-cgi/styles/cf.errors.css\" />\n<!--[if lt IE 9]><link rel=\"stylesheet\" id='cf_styles-ie-css' href=\"/cdn-cgi/styles/cf.errors.ie.css\" /><![endif]-->\n<style>body{margin:0;padding:0}</style>\n\n\n<!--[if gte IE 10]><!-->\n<script>\n  if (!navigator.cookieEnabled) {\n    window.addEventListener('DOMContentLoaded', function () {\n      var cookieEl = document.getElementById('cookie-alert');\n      cookieEl.style.display = 'block';\n    })\n  }\n</script>\n<!--<![endif]-->\n\n\n</head>\n<body>\n  <div id=\"cf-wrapper\">\n    <div class=\"cf-alert cf-alert-error cf-cookie-error\" id=\"cookie-alert\" data-translate=\"enable_cookies\">Please enable cookies.</div>\n    <div id=\"cf-error-details\" class=\"cf-error-details-wrapper\">\n      <div class=\"cf-wrapper cf-header cf-error-overview\">\n        <h1 data-translate=\"block_headline\">Sorry, you have been blocked</h1>\n        <h2 class=\"cf-subheadline\"><span data-translate=\"unable_to_access\">You are unable to access</span> pagseguro.com</h2>\n      </div><!-- /.header -->\n\n      <div class=\"cf-section cf-highlight\">\n        <div class=\"cf-wrapper\">\n          <div class=\"cf-screenshot-container cf-screenshot-full\">\n            \n              <span class=\"cf-no-screenshot error\"></span>\n            \n          </div>\n        </div>\n      </div><!-- /.captcha-container -->\n\n      <div class=\"cf-section cf-wrapper\">\n        <div class=\"cf-columns two\">\n          <div class=\"cf-column\">\n            <h2 data-translate=\"blocked_why_headline\">Why have I been blocked?</h2>\n\n            <p data-translate=\"blocked_why_detail\">This website is using a security service to protect itself from online attacks. The action you just performed triggered the security solution. There are several actions that could trigger this block including submitting a certain word or phrase, a SQL command or malformed data.</p>\n          </div>\n\n          <div class=\"cf-column\">\n            <h2 data-translate=\"blocked_resolve_headline\">What can I do to resolve this?</h2>\n\n            <p data-translate=\"blocked_resolve_detail\">You can email the site owner to let them know you were blocked. Please include what you were doing when this page came up and the Cloudflare Ray ID found at the bottom of this page.</p>\n          </div>\n        </div>\n      </div><!-- /.section -->\n\n      <div class=\"cf-error-footer cf-wrapper w-240 lg:w-full py-10 sm:py-4 sm:px-8 mx-auto text-center sm:text-left border-solid border-0 border-t border-gray-300\">\n  <p class=\"text-13\">\n    <span class=\"cf-footer-item sm:block sm:mb-1\">Cloudflare Ray ID: <strong class=\"font-semibold\">9b95b2bf8fd19892</strong></span>\n    <span class=\"cf-footer-separator sm:hidden\">&bull;</span>\n    <span id=\"cf-footer-item-ip\" class=\"cf-footer-item hidden sm:block sm:mb-1\">\n      Your IP:\n      <button type=\"button\" id=\"cf-footer-ip-reveal\" class=\"cf-footer-ip-reveal-btn\">Click to reveal</button>\n      <span class=\"hidden\" id=\"cf-footer-ip\">177.36.76.91</span>\n      <span class=\"cf-footer-separator sm:hidden\">&bull;</span>\n    </span>\n    <span class=\"cf-footer-item sm:block sm:mb-1\"><span>Performance &amp; security by</span> <a rel=\"noopener noreferrer\" href=\"https://www.cloudflare.com/5xx-error-landing\" id=\"brand_link\" target=\"_blank\">Cloudflare</a></span>\n    \n  </p>\n  <script>(function(){function d(){var b=a.getElementById(\"cf-footer-item-ip\"),c=a.getElementById(\"cf-footer-ip-reveal\");b&&\"classList\"in b&&(b.classList.remove(\"hidden\"),c.addEventListener(\"click\",function(){c.classList.add(\"hidden\");a.getElementById(\"cf-footer-ip\").classList.remove(\"hidden\")}))}var a=document;document.addEventListener&&a.addEventListener(\"DOMContentLoaded\",d)})();</script>\n</div><!-- /.error-footer -->\n\n\n    </div><!-- /#cf-error-details -->\n  </div><!-- /#cf-wrapper -->\n\n  <script>\n  window._cf_translation = {};\n  \n  \n</script>\n\n<script>(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML=\"window.__CF$cv$params={r:'9b95b2bf8fd19892',t:'MTc2NzY0NDY1Ni4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);\";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();</script></body>\n</html>\n"
}
```
</details>

### 3. ✅ PIX_PAYMENT

- **Endpoint:** `POST /orders`
- **Status HTTP:** 201
- **Timestamp:** 2026-01-05T20:24:16.712Z
- **ORDER_ID:** `ORDE_B890C1B1-FCC6-443D-BC00-EB09F290745C`
- **QR_CODE_ID:** `QRCO_6B3C3F24-7095-4B65-B076-7A5414BFE0A6`
- **PIX Copia e Cola:** `00020101021226850014br.gov.bcb.pix2563api-h.pagseg...`

<details>
<summary>📋 Resposta Completa (JSON)</summary>

```json
{
  "id": "ORDE_B890C1B1-FCC6-443D-BC00-EB09F290745C",
  "reference_id": "escrita360_pix_1767644656712",
  "created_at": "2026-01-05T17:24:17.327-03:00",
  "customer": {
    "name": "Cliente PIX Escrita360",
    "email": "pix.teste.1767644656712@escrita360.com",
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
      "reference_id": "plano_profissional",
      "name": "Plano Profissional - Escrita360",
      "quantity": 1,
      "unit_amount": 9900
    }
  ],
  "qr_codes": [
    {
      "id": "QRCO_6B3C3F24-7095-4B65-B076-7A5414BFE0A6",
      "expiration_date": "2026-01-05T18:24:16.000-03:00",
      "amount": {
        "value": 9900
      },
      "text": "00020101021226850014br.gov.bcb.pix2563api-h.pagseguro.com/pix/v2/6B3C3F24-7095-4B65-B076-7A5414BFE0A627600016BR.COM.PAGSEGURO01366B3C3F24-7095-4B65-B076-7A5414BFE0A6520482205303986540599.005802BR5916NI projetos LTDA6015Sao Bernardo do62070503***63049379",
      "arrangements": [
        "PIX"
      ],
      "links": [
        {
          "rel": "QRCODE.PNG",
          "href": "https://sandbox.api.pagseguro.com/qrcode/QRCO_6B3C3F24-7095-4B65-B076-7A5414BFE0A6/png",
          "media": "image/png",
          "type": "GET"
        },
        {
          "rel": "QRCODE.BASE64",
          "href": "https://sandbox.api.pagseguro.com/qrcode/QRCO_6B3C3F24-7095-4B65-B076-7A5414BFE0A6/base64",
          "media": "text/plain",
          "type": "GET"
        }
      ]
    }
  ],
  "notification_urls": [
    "https://webhook.site/escrita360-pix-webhook"
  ],
  "links": [
    {
      "rel": "SELF",
      "href": "https://sandbox.api.pagseguro.com/orders/ORDE_B890C1B1-FCC6-443D-BC00-EB09F290745C",
      "media": "application/json",
      "type": "GET"
    },
    {
      "rel": "PAY",
      "href": "https://sandbox.api.pagseguro.com/orders/ORDE_B890C1B1-FCC6-443D-BC00-EB09F290745C/pay",
      "media": "application/json",
      "type": "POST"
    }
  ]
}
```
</details>

### 4. ❌ CREDIT_CARD_PAYMENT

- **Endpoint:** `POST /orders`
- **Status HTTP:** 500
- **Timestamp:** 2026-01-05T20:24:18.221Z

<details>
<summary>📋 Resposta Completa (JSON)</summary>

```json
{
  "rawResponse": ""
}
```
</details>

### 5. ❌ BOLETO_PAYMENT

- **Endpoint:** `POST /orders`
- **Status HTTP:** 500
- **Timestamp:** 2026-01-05T20:24:19.752Z

<details>
<summary>📋 Resposta Completa (JSON)</summary>

```json
{
  "rawResponse": ""
}
```
</details>

### 6. ✅ GET_ORDER

- **Endpoint:** `GET /orders/ORDE_B890C1B1-FCC6-443D-BC00-EB09F290745C`
- **Status HTTP:** 200
- **Timestamp:** 2026-01-05T20:24:20.853Z
- **ORDER_ID:** `ORDE_B890C1B1-FCC6-443D-BC00-EB09F290745C`

<details>
<summary>📋 Resposta Completa (JSON)</summary>

```json
{
  "id": "ORDE_B890C1B1-FCC6-443D-BC00-EB09F290745C",
  "reference_id": "escrita360_pix_1767644656712",
  "created_at": "2026-01-05T17:24:17.327-03:00",
  "customer": {
    "name": "Cliente PIX Escrita360",
    "email": "pix.teste.1767644656712@escrita360.com",
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
      "reference_id": "plano_profissional",
      "name": "Plano Profissional - Escrita360",
      "quantity": 1,
      "unit_amount": 9900
    }
  ],
  "qr_codes": [
    {
      "id": "QRCO_6B3C3F24-7095-4B65-B076-7A5414BFE0A6",
      "expiration_date": "2026-01-05T18:24:16.000-03:00",
      "amount": {
        "value": 9900
      },
      "text": "00020101021226850014br.gov.bcb.pix2563api-h.pagseguro.com/pix/v2/6B3C3F24-7095-4B65-B076-7A5414BFE0A627600016BR.COM.PAGSEGURO01366B3C3F24-7095-4B65-B076-7A5414BFE0A6520482205303986540599.005802BR5916NI projetos LTDA6015Sao Bernardo do62070503***63049379",
      "arrangements": [
        "PIX"
      ],
      "links": [
        {
          "rel": "QRCODE.PNG",
          "href": "https://sandbox.api.pagseguro.com/qrcode/QRCO_6B3C3F24-7095-4B65-B076-7A5414BFE0A6/png",
          "media": "image/png",
          "type": "GET"
        },
        {
          "rel": "QRCODE.BASE64",
          "href": "https://sandbox.api.pagseguro.com/qrcode/QRCO_6B3C3F24-7095-4B65-B076-7A5414BFE0A6/base64",
          "media": "text/plain",
          "type": "GET"
        }
      ]
    }
  ],
  "notification_urls": [
    "https://webhook.site/escrita360-pix-webhook"
  ],
  "links": [
    {
      "rel": "SELF",
      "href": "https://sandbox.api.pagseguro.com/orders/ORDE_B890C1B1-FCC6-443D-BC00-EB09F290745C",
      "media": "application/json",
      "type": "GET"
    },
    {
      "rel": "PAY",
      "href": "https://sandbox.api.pagseguro.com/orders/ORDE_B890C1B1-FCC6-443D-BC00-EB09F290745C/pay",
      "media": "application/json",
      "type": "POST"
    }
  ]
}
```
</details>

---

## 📚 APIs de Pagamento Implementadas

### 1. API de Orders (Pedidos)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/orders` | Criar pedido (PIX, Cartão, Boleto) |
| GET | `/orders/{order_id}` | Consultar pedido |

### 2. API de Charges (Cobranças)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/charges/{charge_id}/cancel` | Cancelar/Estornar cobrança |
| POST | `/charges/{charge_id}/capture` | Capturar cobrança pré-autorizada |

### 3. API de Customers (Clientes)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/customers` | Criar cliente |
| GET | `/customers/{customer_id}` | Consultar cliente |

### 4. API de Public Keys (Chaves Públicas)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/public-keys` | Obter chave pública para criptografia |

### 5. API de Subscriptions (Assinaturas)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/subscriptions` | Criar assinatura |
| GET | `/subscriptions/{subscription_id}` | Consultar assinatura |
| POST | `/subscriptions/{subscription_id}/cancel` | Cancelar assinatura |
| POST | `/plans` | Criar plano de assinatura |
| GET | `/plans` | Listar planos |

---

## 🔗 URLs do Ambiente

### Sandbox
```
Pagamentos: https://sandbox.api.pagseguro.com
Assinaturas: https://sandbox.api.assinaturas.pagseguro.com
```

### Produção
```
Pagamentos: https://api.pagseguro.com
Assinaturas: https://api.assinaturas.pagseguro.com
```

---

## 💳 Cartões de Teste (Sandbox)

| Cenário | Número | CVV | Validade |
|---------|--------|-----|----------|
| Aprovado | 4111111111111111 | 123 | 12/2030 |
| Recusado | 4000000000000002 | 123 | 12/2030 |
| Erro processamento | 4000000000000036 | 123 | 12/2030 |

---

*Relatório gerado automaticamente pelo script de validação.*