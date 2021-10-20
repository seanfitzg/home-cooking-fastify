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

  fastify.post('/recipes', {
    handler: (req, reply) => {
      fastify.mysql.execute(
        `INSERT INTO Recipes (UserId, Name, Method, Description) 
      VALUES ("${req.user.sub}", "${req.body.name}", "${req.body.method}", "${req.body.description}")`,
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
