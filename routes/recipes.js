export default async function recipes(fastify, options, done) {
  fastify.get('/recipes', {
    handler: (req, reply) => {
      fastify.mysql.query(
        'SELECT * FROM Recipes',
        function onResult(err, result) {
          let recipes = result.map((value) => ({
            userId: value.UserId,
            name: value.Name,
            method: value.Method,
            description: value.Description,
          }));
          console.log(`recipes`, recipes);
          reply.send(err || recipes);
        }
      );
    },
    preValidation: fastify.authenticate,
  });

  fastify.post('/recipes/add', {
    handler: (req, reply) => {
      console.log(req.body);
      var recipe = JSON.parse(req.body);
      fastify.mysql.execute(
        `INSERT INTO Recipes (UserId, Name, Method, Description) 
      VALUES ("${recipe.userId}", "${recipe.name}", "${recipe.method}", "${recipe.description}")`,
        (err, result) => {
          console.log(err);
          console.log(result);
          reply.code(201).send(err || 'Success');
        }
      );
    },
    preValidation: fastify.authenticate,
  });

  done();
}
