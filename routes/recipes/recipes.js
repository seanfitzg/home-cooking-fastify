export default async function recipes(fastify, options, done) {
  const getRecipes = async (req, reply) => {
    const { rows } = await fastify.pg.query('SELECT * FROM Recipes');
    if (rows) {
      let recipes = rows.map((value) => {
        return {
          id: value.id,
          userId: value.userid,
          name: value.name,
          method: value.method,
          description: value.Description,
        };
      });
      reply.send(recipes);
    }
  };

  const getARecipe = async (req, reply) => {
    const { rows } = await fastify.pg.query(
      'SELECT * FROM Recipes WHERE Id = $1',
      [req.params.id]
    );
    // what if there is no recipe for that id?
    if (rows.length > 0) {
      const dbRecipe = rows[0];
      const dbIngredient = await fastify.pg.query(
        'SELECT * FROM Ingredients WHERE RecipeId = $1',
        [dbRecipe.id]
      );
      const ingredients = dbIngredient.rows.map((ing) => ({
        id: ing.id,
        amount: ing.amount,
        item: ing.item,
      }));
      const recipe = {
        id: dbRecipe.id,
        userId: dbRecipe.userid,
        name: dbRecipe.name,
        method: dbRecipe.method,
        description: dbRecipe.description,
        ingredients,
      };
      reply.send(recipe);
    }
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
    fastify.pg.transact(
      async (client) => {
        const recipeId = await client.query(`
          INSERT INTO Recipes (UserId, Name, Method, Description) 
          VALUES ('${req.user.sub}', '${req.body.name}', '${req.body.method}', '${req.body.description}') returning Id;`);

        req.body.ingredients.forEach(async (ingredient) => {
          await client.query(
            `INSERT INTO Ingredients (Id, Item, Amount, RecipeId)
            VALUES ('${ingredient.id}', '${ingredient.item}', '${ingredient.amount}', '${recipeId.rows[0].id}')`,
            (err, result) => {
              if (err) {
                console.log(err);
                reply.code(200).send(err);
              }
            }
          );
        });
      },
      (err, result) => {
        reply.code(200).send(err || 'Success');
      }
    );
  };

  const updateARecipe = (req, reply) => {
    fastify.pg.query(
      `UPDATE Recipes
        SET Name = '${req.body.name}',
        Method = '${req.body.method}', 
        Description = '${req.body.description}'
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
