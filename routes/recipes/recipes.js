import validate from '../../validation/validate.js';
import { fakeUserId } from '../../utilities/fakeAuth.js';

export default async function recipes(fastify, options, done) {
  const getRecipes = async (req, reply) => {
    const { rows } = await fastify.pg.query(
      'SELECT * FROM Recipes WHERE UserId = $1',
      [req.user.sub]
    );
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

  const deleteAllRecipesForTestUser = (req, reply) => {
    fastify.pg.transact(
      async (client) => {
        const { rows } = await client.query(
          'SELECT * FROM Recipes WHERE UserId = $1',
          [fakeUserId]
        );
        rows.forEach(async (recipe) => {
          await client.query('DELETE FROM Ingredients WHERE RecipeId = $1', [
            recipe.id,
          ]);
          await client.query('DELETE FROM Recipes WHERE Id = $1', [recipe.id]);
        });
      },
      (err, result) => {
        reply.code(200).send(err || 'Success');
      }
    );
  };

  const deleteARecipe = (req, reply) => {
    fastify.pg.transact(
      async (client) => {
        await client.query(
          `DELETE FROM Ingredients
          WHERE RecipeId = $1`,
          [req.params.id]
        );
        await client.query('DELETE FROM Recipes WHERE Id = $1', [
          req.params.id,
        ]);
      },
      (err, result) => {
        reply.code(200).send(err || 'Success');
      }
    );
  };

  const insertIngredients = (client, recipeId, ingredients) => {
    ingredients.forEach(async (ingredient) => {
      await client.query(
        `INSERT INTO Ingredients (Id, Item, Amount, RecipeId)
              VALUES ('${ingredient.id}', '${ingredient.item}', '${ingredient.amount}', '${recipeId}')`
      );
    });
  };

  const saveRecipe = (req, reply) => {
    fastify.pg.transact(
      async (client) => {
        const insertResult = await client.query(`
          INSERT INTO Recipes (UserId, Name, Method, Description) 
          VALUES ('${req.user.sub}', '${req.body.name}', '${req.body.method}', '${req.body.description}') returning Id;`);

        insertIngredients(
          client,
          insertResult.rows[0].id,
          req.body.ingredients
        );
      },
      (err, result) => {
        reply.code(200).send(err || 'Success');
      }
    );
  };

  const updateARecipe = (req, reply) => {
    fastify.pg.transact(
      async (client) => {
        await client.query(
          `UPDATE Recipes
          SET Name = '${req.body.name}',
          Method = '${req.body.method}', 
          Description = '${req.body.description}'
          WHERE Id = ${req.body.id}`
        );

        await client.query(
          `DELETE FROM Ingredients
            WHERE RecipeId = $1`,
          [req.body.id]
        );

        insertIngredients(client, req.body.id, req.body.ingredients);
      },
      (err, result) => {
        reply.code(200).send(err || 'Success');
      }
    );
  };

  fastify.get('/recipes', {
    handler: getRecipes,
    preValidation: validate(fastify),
  });

  fastify.get('/recipes/:id', {
    handler: getARecipe,
    preValidation: validate(fastify),
  });

  fastify.post('/recipes', {
    handler: saveRecipe,
    preValidation: validate(fastify),
  });

  fastify.put('/recipes', {
    handler: updateARecipe,
    preValidation: validate(fastify),
  });

  fastify.delete('/recipes/:id', {
    handler: deleteARecipe,
    preValidation: validate(fastify),
  });

  fastify.delete(`/deleteallfortestuser`, {
    handler: deleteAllRecipesForTestUser,
    preValidation: validate(fastify),
  });

  done();
}
