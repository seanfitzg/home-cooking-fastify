import pg from 'pg';

const { Client } = pg;
const db = {
  user: 'dbuser',
  host: '127.0.0.1',
  database: 'homecooking',
  password: 'Password1!',
  port: 5432,
};

export const deleteRecipesByUser = async (userId) => {
  try {
    const client = new Client(db);
    await client.connect();

    const { rows } = await client.query(
      'SELECT * FROM Recipes WHERE UserId = $1',
      [userId]
    );
    // pg does not like array.forEach for some reason.
    for (let index = 0; index < rows.length; index++) {
      const recipe = rows[index];
      await client.query('DELETE FROM Ingredients WHERE RecipeId = $1', [
        recipe.id,
      ]);
      await client.query('DELETE FROM Recipes WHERE Id = $1', [recipe.id]);
    }
    await client.end();
  } catch (error) {
    console.log(`error`, error);
  }
};
