const db = require("./DaoAluno.js");

module.exports = {
    configurar: async(servidor) => {
      servidor.get("/aluno/alterar/:id/:nome/:idade/:idCidade",  {
        schema: {
            params: {
                id: {
                    type: 'integer'                    
                },
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
    }, module.exports.alterarAluno);
  },
    
  alterarAluno: async (request, reply) => {
    let resposta;

    console.log('alterarAluno ' + request.params.nome);
    if(request.params.id) {
      resposta = await db.alterarAluno(request.params.id, request.params.nome, request.params.idade, request.params.idCidade);
      reply.code(200)
         .header('Content-Type', 'application/json; charset=utf-8')
         .header('Access-Control-Allow-Origin', '*')
         .send(resposta);
    }
    else {
      resposta = "{'erro': 'id não informado para alteração'}"
      reply.code(404)
         .header('Content-Type', 'application/json; charset=utf-8')
         .header('Access-Control-Allow-Origin', '*')
         .send(resposta);
    }
  }
  //---------------------------------------------------------------------//
};
