import pkg from 'uuid';
import tap, { test } from 'tap';
import build from '../lib/app.js';
import { deleteRecipesByUser } from './utilities/sqlQueries.js';
import { fakeUserId } from './utilities/fakeAuth.js';

const { v4: uuidv4 } = pkg;

let recipeId = 0,
  app;

tap.before(async (t) => {
  app = build({}, true);
  await deleteRecipesByUser(fakeUserId);
});

test('creates a new recipe', async (t) => {
  const response = await app.inject({
    method: 'POST',
    url: '/recipes',
    payload: {
      name: 'Recipe Name',
      ingredients: [
        {
          id: uuidv4(),
          item: 'Beans',
          amount: '12',
          isNew: true,
        },
        {
          id: uuidv4(),
          item: 'Bananas',
          amount: '3',
          isNew: true,
        },
      ],
      description: 'Recipe Description',
      method: 'Recipe Method',
    },
  });
  recipeId = JSON.parse(response.body).recipeId;
  t.equal(response.statusCode, 200, 'returns a status code of 200');
});

test('updates a recipe', async (t) => {
  const response = await app.inject({
    method: 'put',
    url: '/recipes',
    payload: {
      id: recipeId,
      name: 'Updated Recipe Name',
      ingredients: [
        {
          id: uuidv4(),
          item: 'Bread',
          amount: '2',
          isNew: true,
        },
        {
          id: uuidv4(),
          item: 'Meat',
          amount: '3',
          isNew: true,
        },
      ],
      description: 'Updated Recipe Description',
      method: 'Updated Recipe Method',
    },
  });
  t.equal(response.statusCode, 200, 'returns a status code of 200');
});

test('gets a recipe', async (t) => {
  const response = await app.inject({
    method: 'GET',
    url: `/recipes/${recipeId}`,
  });
  t.equal(response.statusCode, 200, 'returns a status code of 200');
});

test('deletes a recipe', async (t) => {
  const response = await app.inject({
    method: 'DELETE',
    url: `/recipes/${recipeId}`,
  });
  t.equal(response.statusCode, 200, 'returns a status code of 200');
});

test('gets all recipes', async (t) => {
  const response = await app.inject({
    method: 'GET',
    url: '/recipes',
  });
  t.equal(response.statusCode, 200, 'returns a status code of 200');
});
