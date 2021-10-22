export default async function recipes(fastify, options, done) {
  const getRecipes = (req, reply) => {
    fastify.mysql.query(
      'SELECT * FROM Recipes',
      function onResult(err, result) {
        let recipes = result.map((value) => ({
          id: value.Id,
          userId: value.UserId,
          name: value.Name,
          method: value.Method,
          description: value.Description,
        }));
        reply.send(err || recipes);
      }
    );
  };

  const getARecipe = (req, reply) => {
    fastify.mysql.query(
      `SELECT * FROM Recipes WHERE Id = ${req.params.id}`,
      // what if there is no recipe for that id?
      (err, result) => {
        let recipes = result.map((value) => ({
          id: value.Id,
          userId: value.UserId,
          name: value.Name,
          method: value.Method,
          description: value.Description,
        }));
        reply.send(err || recipes[0]);
      }
    );
  };

  const deleteARecipe = (req, reply) => {
    fastify.mysql.query(
      `DELETE FROM Recipes WHERE Id = ${req.params.id}`,
      (err, result) => {
        reply.code(200).send(err || 'Success');
      }
    );
  };

  const saveRecipe = (req, reply) => {
    fastify.mysql.execute(
      `INSERT INTO Recipes (UserId, Name, Method, Description) 
      VALUES ("${req.user.sub}", "${req.body.name}", "${req.body.method}", "${req.body.description}")`,
      (err, result) => {
        reply.code(200).send(err || 'Success');
      }
    );
  };

  const updateARecipe = (req, reply) => {
    fastify.mysql.execute(
      `UPDATE Recipes
        SET Name = "${req.body.name}",
        Method = "${req.body.method}", 
        Description = "${req.body.description}"
        WHERE Id = ${req.body.id}`,
      (err, result) => {
        reply.code(200).send(err || 'Success');
      }
    );
  };

  fastify.get('/recipes', {
    handler: getRecipes,
    preValidation: fastify.authenticate,
  });

  fastify.get('/recipes/:id', {
    handler: getARecipe,
    preValidation: fastify.authenticate,
  });

  fastify.post('/recipes', {
    handler: saveRecipe,
    preValidation: fastify.authenticate,
  });

  fastify.put('/recipes', {
    handler: updateARecipe,
    preValidation: fastify.authenticate,
  });

  fastify.delete('/recipes/:id', {
    handler: deleteARecipe,
    preValidation: fastify.authenticate,
  });

  done();
}
