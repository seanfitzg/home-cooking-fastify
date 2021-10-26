'use strict';

import { test } from 'tap';
import build from '../app.js';

test('posts to the "/recipes" route', async (t) => {
  const app = build();

  const response = await app.inject({
    method: 'POST',
    url: '/recipes',
    payload: {
      name: 'Recipe Name',
      ingredients: [
        {
          id: 'b67e3f55-eed6-4941-b4c0-156ea92926bc',
          item: 'Beans',
          amount: '12',
          isNew: true,
        },
        {
          id: '54d9bf1f-3db7-409a-836b-474d72c3b795',
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
