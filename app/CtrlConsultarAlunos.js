const db = require("./DaoAluno.js");

// "module.exports" é uma construção do JavaScript, se assemelhando (mas não é exatamente igual)
// à declaração de uma classe. As funções dentro do module funcionam como métodos e as variáveis
// e constantes como atributos.
module.exports = {    
    // Definição da função configurar.
    configurar: async(servidor) => {    
    servidor.get("/alunos", module.exports.obterAlunos);
    servidor.get("/aluno/:id",  {
        schema: {
            params: {
                id: {
                    type: 'integer'                    
                }
            }
        }
    }, module.exports.obterAluno);
  },
    
  obterAlunos: async (request, reply) => {
    let resposta = await db.obterAlunos();    
    reply.code(200)
         .header('Content-Type', 'application/json; charset=utf-8')
         .header('Access-Control-Allow-Origin', '*')
         .send(resposta);
  },

  obterAluno: async (request, reply) => {
    let resposta;
    console.log("Obter Aluno");
    if(request.params.id) {
      resposta = await db.obterAluno(request.params.id);
      console.log('Requisição feita - Obter Aluno: ' + JSON.stringify(resposta[0]));
      reply.code(200)
         .header('Content-Type', 'application/json; charset=utf-8')
         .header('Access-Control-Allow-Origin', '*')
         .send(resposta[0]);
    } else {
      resposta = "{'erro': 'id não informado para consulta/alteração'}"
      reply.code(403)
         .header('Content-Type', 'application/json; charset=utf-8')
         .header('Access-Control-Allow-Origin', '*')
         .send(resposta);
    }
  }
  //---------------------------------------------------------------------//
};
