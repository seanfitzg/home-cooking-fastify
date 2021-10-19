export default async function recipes(fastify, options) {
  fastify.get('/recipes', (req, reply) => {
    fastify.mysql.query(
      'SELECT * FROM Recipes',
      function onResult(err, result) {
        reply.send(err || result);
      }
    );
  });

  let opts = {
    schema: {
      body: { type: 'string' },
    },
  };

  fastify.post('/recipes/add', opts, (req, reply) => {
    console.log(req.body);
    var recipe = JSON.parse(req.body);
    fastify.mysql.execute(
      `INSERT INTO Recipe (UserId, Name, Method, Description) 
      VALUES ("${recipe.userId}", "${recipe.name}", "", "")`,
      (err, result) => {
        console.log(err);
        console.log(result);
        reply.code(201).send(err || 'Success');
      }
    );
  });
}
