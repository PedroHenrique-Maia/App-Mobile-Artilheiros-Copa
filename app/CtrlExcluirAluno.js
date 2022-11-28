const db = require("./DaoAluno.js");

module.exports = {
    configurar: async(servidor) => {
      servidor.get("/aluno/excluir/:id",  {
        schema: {
            params: {
                id: {
                    type: 'integer'                    
                }
            }
        }
    }, module.exports.excluirAluno);
  },
    
  excluirAluno: async (request, reply) => {
    let resposta;

    console.log("Excluir");
    if(request.params.id) {
      resposta = await db.excluirAluno(request.params.id);
      console.log("excluir:" + resposta);
      reply.code(200)
         .headers.add('Content-Type', 'application/json; charset=utf-8')
         .headers.add('Access-Control-Allow-Origin', '*')
         .headers.add('Access-Control-Allow-Headers', 'Accept,Content-Type')
         .headers.add('Access-Control-Allow-Methods', 'OPTIONS,GET,PUT,POST,DELETE')
         .send(resposta);
    }
    else {
      resposta = "{'erro': 'id não informado para exclusão'}"
      reply.code(403)
         .header('Content-Type', 'application/json; charset=utf-8')
         .header('Access-Control-Allow-Origin', '*')
         .send(resposta);
    }
  }
  //---------------------------------------------------------------------//
};
