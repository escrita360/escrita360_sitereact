/**
 * Configuração para testes - CommonJS
 */

const dotenv = require('dotenv')
dotenv.config()

module.exports = {
  token: process.env.VITE_PAGBANK_TOKEN,
  apiUrl: 'https://sandbox.api.pagseguro.com'
}