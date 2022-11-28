const db = require("./DaoAluno.js");

module.exports = {
    configurar: async(servidor) => {
      // Solicita a inclusão de um aluno
      servidor.get("/aluno/incluir/:nome/:idade/:idCidade",  {
        schema: {
            params: {
                nome: {
                    type: 'string'                    
                },
                idade: {
                    type: 'integer'                    
                },
                idCidade: {
                    type: 'integer'                    
                }
            }
        }
    }, module.exports.incluirAluno);
  },
    
  incluirAluno: async (request, reply) => {
    let resposta;
    
    console.log('incluirAluno ' + request.params.nome);
    if(request.params.nome) {
      resposta = await db.incluirAluno(request.params.nome, request.params.idade, request.params.idCidade);
      reply.code(200)
         .header('Content-Type', 'application/json; charset=utf-8')
         .header('Access-Control-Allow-Origin', '*')
         .send(resposta);
    }
    else {
      resposta = "{'erro': 'nome  não informado para inclusão'}"
      reply.code(404)
         .header('Content-Type', 'application/json; charset=utf-8')
         .header('Access-Control-Allow-Origin', '*')
         .send(resposta);
    }
  }
  //---------------------------------------------------------------------//
};
