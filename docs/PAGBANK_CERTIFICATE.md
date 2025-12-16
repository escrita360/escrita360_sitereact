# Guia de Configuração: Certificado Digital PagBank (mTLS)

Este documento descreve como configurar e usar **Certificados Digitais mTLS** do PagBank para comunicação segura.

## 📖 O que é Certificado Digital mTLS?

**mTLS (Mutual Transport Layer Security)** é uma extensão do protocolo TLS que garante autenticação e criptografia em ambos os lados da comunicação.

### Para que serve?

- **API de Transferências**: Obrigatório
- **Outras APIs**: Opcional, mas recomendado para produção
- **Segurança**: Garante que o servidor PagBank identifica e autoriza sua aplicação

### Características

- **Tipo**: mTLS (autenticação mútua)
- **Validade**: 2 anos
- **Componentes**: 
  - `key` (chave privada) - Base64 encoded
  - `pem` (certificado público) - Base64 encoded

## 🎯 Fluxo de Criação do Certificado

```
1. Connect Challenge → 2. Obter Token → 3. Solicitar Challenge → 4. Decriptar → 5. Criar Certificado
   (OAuth)                (certificate.create)   (encrypted)          (decrypt)     (key + pem)
```

### Detalhamento do Fluxo

1. **Connect Challenge**: Processo OAuth especial para obter token com escopo `certificate.create`
2. **Solicitar Challenge**: POST /oauth2/challenge - Retorna challenge encriptado
3. **Decriptar Challenge**: Usa chave privada para decriptar o challenge
4. **Criar Certificado**: POST /certificates com challenge decriptado
5. **Salvar e Usar**: Decodificar base64 e salvar como arquivos .key e .pem

## 🔧 Configuração Passo a Passo

### Passo 1: Obter Token com Scope `certificate.create`

#### Via Connect Challenge

```javascript
// 1. Criar aplicação Connect (se ainda não tiver)
const app = await connectService.createApplication({
  name: 'Escrita360',
  redirect_uri: 'http://localhost:5000/api/connect/callback'
});

// 2. Gerar URL de autorização com scope certificate.create
const authUrl = connectService.getAuthorizationUrl('certificate.create');

// 3. Usuário autoriza
// 4. Obter token no callback
const token = await connectService.getAccessToken({
  grant_type: 'authorization_code',
  code: 'codigo_do_callback'
});

// token.access_token agora tem scope certificate.create
```

### Passo 2: Solicitar Challenge

```bash
curl --request POST \
  --url https://sandbox.api.pagseguro.com/oauth2/challenge \
  --header 'Authorization: Bearer TOKEN_COM_SCOPE_CERTIFICATE_CREATE' \
  --header 'Content-Type: application/json'
```

**Resposta**:
```json
{
  "encrypted_challenge": "base64_encrypted_string..."
}
```

### Passo 3: Decriptar Challenge

O challenge vem encriptado com RSA. Você precisa de uma chave privada para decriptar:

```javascript
const crypto = require('crypto');

const decrypted = crypto.privateDecrypt(
  {
    key: privateKey,
    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
  },
  Buffer.from(encryptedChallenge, 'base64')
);

const decryptedChallenge = decrypted.toString('utf8');
```

### Passo 4: Criar Certificado

```bash
curl --request POST \
  --url https://sandbox.api.pagseguro.com/certificates \
  --header 'Authorization: Bearer TOKEN' \
  --header 'X_CHALLENGE: CHALLENGE_DECRIPTADO' \
  --header 'Content-Type: application/json'
```

**Resposta**:
```json
{
  "key": "base64_encoded_private_key...",
  "pem": "base64_encoded_certificate..."
}
```

### Passo 5: Decodificar e Salvar

```javascript
const fs = require('fs').promises;

// Decodificar base64
const privateKey = Buffer.from(response.key, 'base64');
const certificate = Buffer.from(response.pem, 'base64');

// Salvar em arquivos
await fs.writeFile('./certificates/pagbank_production.key', privateKey);
await fs.writeFile('./certificates/pagbank_production.pem', certificate);

// Restringir permissões (Unix/Linux)
await fs.chmod('./certificates/pagbank_production.key', 0o600);
await fs.chmod('./certificates/pagbank_production.pem', 0o644);
```

## 🚀 Usando a API do Projeto

### Via Backend Routes

#### 1. Solicitar Challenge

```bash
curl --request POST \
  --url http://localhost:5000/api/certificate/challenge \
  --header 'Content-Type: application/json' \
  --data '{
    "access_token": "token_com_scope_certificate_create"
  }'
```

#### 2. Criar Certificado

```bash
curl --request POST \
  --url http://localhost:5000/api/certificate/create \
  --header 'Content-Type: application/json' \
  --data '{
    "access_token": "token_com_scope_certificate_create",
    "decrypted_challenge": "challenge_decriptado"
  }'
```

### Via Serviço (Fluxo Completo)

```javascript
const PagBankCertificateService = require('./services/pagbank_certificate_service');

const certificateService = new PagBankCertificateService();

// Fluxo completo automático
const result = await certificateService.createAndSaveCertificate(
  accessToken,      // Token com scope certificate.create
  privateKey        // Chave privada para decriptar challenge
);

// result = {
//   certificate: { key, pem, created_at },
//   paths: { keyPath, pemPath }
// }
```

## 🔌 Endpoints Disponíveis

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/certificate/info` | GET | Informações do ambiente |
| `/api/certificate/challenge` | POST | Solicitar challenge |
| `/api/certificate/create` | POST | Criar certificado |
| `/api/certificate` | GET | Consultar certificado atual |
| `/api/certificate/list` | GET | Listar certificados |
| `/api/certificate/validity` | GET | Verificar validade |
| `/api/certificate/load` | GET | Carregar de arquivos |

## 💻 Usando Certificado nas Requisições

### Com Axios

```javascript
const https = require('https');
const axios = require('axios');
const fs = require('fs');

// Carregar certificado
const cert = fs.readFileSync('./certificates/pagbank_production.pem');
const key = fs.readFileSync('./certificates/pagbank_production.key');

// Configurar axios
const axiosConfig = {
  httpsAgent: new https.Agent({
    cert: cert,
    key: key,
    rejectUnauthorized: true // Em produção sempre true
  })
};

// Fazer requisição
const response = await axios.post(
  'https://api.pagseguro.com/transfers',
  transferData,
  {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    ...axiosConfig
  }
);
```

### Com Serviço do Projeto

```javascript
const certificateService = new PagBankCertificateService();

// Obter configuração axios com certificado
const axiosConfig = await certificateService.getAxiosConfig();

// Usar nas requisições
const response = await axios.post(url, data, {
  headers: headers,
  ...axiosConfig
});
```

## 📁 Estrutura de Arquivos

```
server/
├── certificates/              # Certificados (não commitados)
│   ├── .gitignore            # Protege certificados
│   ├── pagbank_sandbox.key   # Chave privada sandbox
│   ├── pagbank_sandbox.pem   # Certificado sandbox
│   ├── pagbank_production.key # Chave privada produção
│   └── pagbank_production.pem # Certificado produção
└── app/
    ├── services/
    │   └── pagbank_certificate_service.js
    └── routes/
        └── certificate.js
```

## ⚙️ Configuração de Ambiente

### Sandbox (`.env`)

```bash
PAGBANK_ENV=sandbox
PAGBANK_TOKEN=seu_token_sandbox

# Certificado (opcional em sandbox)
PAGBANK_CERT_KEY_PATH=./certificates/pagbank_sandbox.key
PAGBANK_CERT_PEM_PATH=./certificates/pagbank_sandbox.pem
```

### Produção (`.env.production`)

```bash
PAGBANK_ENV=production
PAGBANK_TOKEN=seu_token_producao

# Certificado (OBRIGATÓRIO para transferências)
PAGBANK_CERT_KEY_PATH=/secure/path/pagbank_production.key
PAGBANK_CERT_PEM_PATH=/secure/path/pagbank_production.pem
```

## 🔐 Segurança do Certificado

### Boas Práticas

#### 1. Armazenamento

```bash
# ❌ ERRADO: No diretório do projeto
./server/certificates/pagbank.key

# ✅ CERTO: Fora do projeto, com path absoluto
/var/secure/certificates/pagbank_production.key
```

#### 2. Permissões (Unix/Linux)

```bash
# Chave privada: apenas owner pode ler/escrever
chmod 600 pagbank_production.key

# Certificado: owner pode ler/escrever, outros apenas ler
chmod 644 pagbank_production.pem

# Diretório: apenas owner
chmod 700 /var/secure/certificates/
```

#### 3. Git Protection

```gitignore
# .gitignore
certificates/
*.key
*.pem
*.crt
*.cer
*.p12
*.pfx
```

#### 4. Criptografia Adicional

```javascript
// Criptografar chave antes de salvar
const crypto = require('crypto');

const encrypted = crypto.publicEncrypt(
  masterPublicKey,
  Buffer.from(privateKey)
);

await fs.writeFile('encrypted.key', encrypted);
```

#### 5. Variáveis de Ambiente

```bash
# Em produção, use variáveis de ambiente do servidor
# Não coloque paths no .env do repositório

# Docker Secrets
docker secret create pagbank_cert_key pagbank_production.key

# Kubernetes Secrets
kubectl create secret generic pagbank-cert \
  --from-file=key=pagbank_production.key \
  --from-file=pem=pagbank_production.pem
```

## 🔄 Renovação de Certificado

### Quando Renovar?

- **Validade**: 2 anos
- **Renove**: 30 dias antes de expirar
- **Atenção**: Ao criar novo, o antigo é invalidado imediatamente

### Como Renovar?

```javascript
// 1. Verificar validade atual
const validity = await certificateService.checkCertificateValidity();

if (validity.days_until_expiry < 30) {
  console.log('⚠️ Renovar certificado!');
  
  // 2. Criar novo certificado (mesmo processo)
  const newCert = await certificateService.createAndSaveCertificate(
    accessToken,
    privateKey
  );
  
  // 3. Atualizar configuração (reiniciar servidor)
  console.log('✅ Certificado renovado. Reinicie o servidor.');
}
```

### Monitoramento Automático

```javascript
// Cron job para verificar validade diariamente
const cron = require('node-cron');

cron.schedule('0 0 * * *', async () => {
  const validity = await certificateService.checkCertificateValidity();
  
  if (validity.days_until_expiry < 30) {
    // Enviar alerta
    await sendAlert({
      subject: 'Certificado PagBank expira em breve',
      message: `Expira em ${validity.days_until_expiry} dias`
    });
  }
});
```

## 🧪 Testes

### Verificar Certificado

```bash
# Informações do certificado
openssl x509 -in pagbank_production.pem -text -noout

# Validade
openssl x509 -in pagbank_production.pem -noout -dates

# Verificar par chave/certificado
openssl x509 -noout -modulus -in pagbank_production.pem | openssl md5
openssl rsa -noout -modulus -in pagbank_production.key | openssl md5
# Hashes devem ser iguais
```

### Testar Conexão mTLS

```bash
# Teste de conexão com certificado
curl --cert pagbank_production.pem \
     --key pagbank_production.key \
     --request GET \
     --url https://api.pagseguro.com/certificate
```

## 🐛 Troubleshooting

### Erro: "Certificate verification failed"

**Causa**: Certificado inválido, expirado ou chave incorreta.

**Solução**:
1. Verifique validade: `openssl x509 -in cert.pem -noout -dates`
2. Verifique par key/pem: Os hashes devem ser iguais
3. Renove se expirado

### Erro: "ENOENT: no such file or directory"

**Causa**: Path do certificado incorreto.

**Solução**:
```javascript
// Use path absoluto
const keyPath = path.resolve('/var/secure/certificates/pagbank.key');
```

### Erro: "Permission denied"

**Causa**: Permissões incorretas do arquivo.

**Solução**:
```bash
# Dar permissão ao usuário do servidor
sudo chown nodejs:nodejs pagbank_production.key
sudo chmod 600 pagbank_production.key
```

### Erro: "unable to decrypt challenge"

**Causa**: Chave privada incorreta para decriptar challenge.

**Solução**: Use a chave privada correta do par gerado para o Connect Challenge.

## 📋 Checklist de Implementação

### Desenvolvimento (Sandbox)

- [ ] Obter token com scope `certificate.create`
- [ ] Criar aplicação Connect
- [ ] Solicitar challenge
- [ ] Decriptar challenge
- [ ] Criar certificado
- [ ] Salvar em `./certificates/`
- [ ] Testar requisição com mTLS
- [ ] Adicionar `certificates/` ao `.gitignore`

### Produção

- [ ] Repetir processo em ambiente de produção
- [ ] Salvar certificado em diretório seguro **fora do projeto**
- [ ] Configurar permissões restritivas (600/644)
- [ ] Configurar paths no `.env.production`
- [ ] Usar variáveis de ambiente do servidor
- [ ] Não commitar certificados ou paths sensíveis
- [ ] Configurar backup seguro
- [ ] Configurar monitoramento de validade
- [ ] Documentar processo de renovação
- [ ] Testar failover se certificado expirar

## 📚 Referências

### Documentação Oficial

- [Digital Certificate](https://developer.pagbank.com.br/docs/certificado-digital)
- [Create Certificate API](https://developer.pagbank.com.br/reference/criar-certificado-digital)
- [Connect Challenge](https://developer.pagbank.com.br/docs/connect-challenge)

### Código do Projeto

- Service: `server/app/services/pagbank_certificate_service.js`
- Routes: `server/app/routes/certificate.js`
- Docs: `docs/PAGBANK_CERTIFICATE.md`

## 🆘 Suporte

- **Documentação**: https://developer.pagbank.com.br/
- **Suporte PagBank**: https://app.pipefy.com/public/form/sBlh9Nq6
- **Status da API**: https://status.pagbank.uol.com.br/

---

✅ **Certificado Digital PagBank configurado e pronto para uso seguro!**
