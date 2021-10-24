export default async function recipes(fastify, options, done) {
  const getRecipes = (req, reply) => {
    fastify.pg.query('SELECT * FROM Recipes', function onResult(err, result) {
      if (result) {
        let recipes = result.rows.map((value) => ({
          id: value.id,
          userId: value.userid,
          name: value.name,
          method: value.method,
          description: value.Description,
        }));
        reply.send(err || recipes);
      }
    });
  };

  const getARecipe = (req, reply) => {
    fastify.pg.query(
      `SELECT * FROM Recipes WHERE Id = ${req.params.id}`,
      (err, result) => {
        let recipes = result.rows.map((value) => ({
          id: value.id,
          userId: value.userid,
          name: value.name,
          method: value.method,
          description: value.description,
        }));
        reply.send(err || recipes[0]);
      }
    );
  };

  const deleteARecipe = (req, reply) => {
    fastify.pg.query(
      `DELETE FROM Recipes WHERE Id = ${req.params.id}`,
      (err, result) => {
        reply.code(200).send(err || 'Success');
      }
    );
  };

  const saveRecipe = (req, reply) => {
    fastify.pg.query(
      `INSERT INTO Recipes (UserId, Name, Method, Description) 
      VALUES ('${req.user.sub}', '${req.body.name}', '${req.body.method}', '${req.body.description}')`,
      (err, result) => {
        reply.code(200).send(err || 'Success');
      }
    );
  };

  const updateARecipe = (req, reply) => {
    fastify.mysql.query(
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
