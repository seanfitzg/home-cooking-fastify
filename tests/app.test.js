'use strict';

import pkg from 'uuid';
import { test } from 'tap';
import build from '../app.js';

const { v4: uuidv4 } = pkg;

test('posts to the "/recipes" route', async (t) => {
  const app = build({}, true);

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
  t.equal(response.statusCode, 200, 'returns a status code of 200');
});

test('requests the "/recipes" route', async (t) => {
  const app = build();
  const response = await app.inject({
    method: 'GET',
    url: '/recipes',
  });
  console.log(response.body);
  t.equal(response.statusCode, 200, 'returns a status code of 200');
});
