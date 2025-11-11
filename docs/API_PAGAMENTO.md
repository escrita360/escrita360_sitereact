
Consultar por Id:

const options = {
  method: 'GET',
  headers: {accept: 'application/json', Authorization: 'Bearer <token>'}
};

fetch('https://sandbox.api.assinaturas.pagseguro.com/customers/customer_id', options)
  .then(res => res.json())
  .then(res => console.log(res))
  .catch(err => console.error(err));

  Criar Assinantes:

  const options = {
  method: 'POST',
  headers: {accept: 'application/json', 'content-type': 'application/json'}
};

fetch('https://sandbox.api.assinaturas.pagseguro.com/customers', options)
  .then(res => res.json())
  .then(res => console.log(res))
  .catch(err => console.error(err));