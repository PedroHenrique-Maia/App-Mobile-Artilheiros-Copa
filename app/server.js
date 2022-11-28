'use strict'

// Para especificações de path 
const path = require("path");

// Para uso do Framework Fastify
const servidor = require("fastify")({
  logger: false //  Para visualizarmos o log do sistema
});

servidor.register(require('@fastify/formbody'));

servidor.register(require('fastify-cors'), {
    origin: true,
    methods: ['POST', 'GET', 'OPTIONS', 'HEAD', 'PUT', 'DELETE', 'PATCH'],
    allowHeaders: 'Content-Type,Accept',
    credentials: true,
  });

// Processa a injeção de dependência colocada no arquivo .env 
// Realizo a carga dos controladores e chamo o método configurar.
const nomesCtrl = process.env.CONTROLADORES.split(',');
for(let i = 0; i < nomesCtrl.length; i++) {
  let ctrl = require("./" + nomesCtrl[i] + ".js");
  ctrl.configurar(servidor);
}
console.log(nomesCtrl);

// Colocando o servidor no ar 
servidor.listen(process.env.PORT, '0.0.0.0', function(err, address) {
  if (err) {
    console.log(err);
    servidor.log.error(err);
    process.exit(1);
  }
  console.log(`A aplicação está ouvindo em ${address}`);
  servidor.log.info('servidor ouvindo em ' + address);
});

//---------------------------------------------------------------------//
