const db = require("./DaoAluno.js");

// "module.exports" é uma construção do JavaScript, se assemelhando (mas não é exatamente igual)
// à declaração de uma classe. As funções dentro do module funcionam como métodos e as variáveis
// e constantes como atributos.
module.exports = {    
    // Definição da função configurar.
    configurar: async(servidor) => {    
      servidor.get("/cidades", module.exports.obterCidades);
  },
    
  obterCidades: async (request, reply) => {
    let resposta = await db.obterCidades();    
    reply.code(200)
         .header('Content-Type', 'application/json; charset=utf-8')
         .header('Access-Control-Allow-Origin', '*')
         .send(resposta);
  }
  //---------------------------------------------------------------------//
};
