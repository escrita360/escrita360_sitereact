/**
 * Teste do formato do código PIX gerado
 */

const testPixCode = '00020101021226830014br.gov.bcb.pix2561api.pagseguro.com/pix/v2/87EC99ED-CD38-44A8-917D-E350C7D36F9D27600016BR.COM.PAGSEGURO013687EC99ED-CD38-44A8-917D-E350C7D36F9D520473725303986540550.005802BR5916NI projetos LTDA6015Sao Bernardo do62070503***63043D88'

console.log('🔍 Analisando código PIX gerado pelo PagBank...\n')

console.log('📏 Comprimento:', testPixCode.length, 'caracteres')
console.log('🏁 Início:', testPixCode.substring(0, 20))
console.log('🏁 Final:', testPixCode.substring(-20))

// Validações básicas EMV QR Code
console.log('\n✅ Validações:')
console.log('- Começa com 0002?', testPixCode.startsWith('0002') ? '✅' : '❌')
console.log('- Contém br.gov.bcb.pix?', testPixCode.includes('br.gov.bcb.pix') ? '✅' : '❌')  
console.log('- Contém api.pagseguro.com?', testPixCode.includes('api.pagseguro.com') ? '✅' : '❌')
console.log('- Comprimento adequado?', testPixCode.length > 100 ? '✅' : '❌')

// Análise de campos EMV
console.log('\n📋 Análise de campos EMV:')
console.log('- Payload Format Indicator (00):', testPixCode.substring(0, 6))
console.log('- Point of Initiation Method (01):', testPixCode.substring(6, 12))
console.log('- Merchant Account Information PIX:', testPixCode.includes('2561api.pagseguro.com') ? '✅ Presente' : '❌ Ausente')
console.log('- Transaction Currency (52):', testPixCode.includes('5204') ? '✅ Presente' : '❌ Ausente')
console.log('- Transaction Amount (54):', testPixCode.includes('5405') ? '✅ Presente' : '❌ Ausente')
console.log('- Country Code (58):', testPixCode.includes('5802BR') ? '✅ Brasil' : '❌ Ausente')
console.log('- Merchant Name (59):', testPixCode.includes('5916') ? '✅ Presente' : '❌ Ausente')
console.log('- Merchant City (60):', testPixCode.includes('6015') ? '✅ Presente' : '❌ Ausente')
console.log('- CRC16 (63):', testPixCode.substring(-4))

console.log('\n🎯 Conclusão:')
if (testPixCode.startsWith('0002') && 
    testPixCode.includes('br.gov.bcb.pix') && 
    testPixCode.includes('5802BR') &&
    testPixCode.length > 100) {
    console.log('✅ Código PIX parece estar no formato EMV correto!')
    console.log('📱 Deve funcionar na maioria dos apps bancários.')
} else {
    console.log('❌ Código PIX pode ter problemas de formato.')
}

console.log('\n📋 Para debug, copie este código completo:')
console.log('---')
console.log(testPixCode)
console.log('---')