import Fastify from 'fastify';
import mySql from 'fastify-postgres';
import fastifyAuth from 'fastify-auth0-verify';
import fastifyCors from 'fastify-cors';
import recipes from './routes/recipes/recipes.js';

export default function build(opts = {}) {
  const app = Fastify(opts);

  app.register(fastifyCors);
  app.register(fastifyAuth, {
    domain: 'home-cooking.eu.auth0.com',
    audience: 'https://home-cooking/api',
  });

  let connectionString = process.env.IS_DOCKER
    ? 'postgresql://dbuser:Password1!@pgsql:5432/homecooking'
    : 'postgresql://dbuser:Password1!@127.0.0.1:5432/homecooking';
  app.register(mySql, {
    connectionString,
  });

  app.register(recipes);

  return app;
}
