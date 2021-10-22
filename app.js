import Fastify from 'fastify';
import mySql from 'fastify-mysql';
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
    ? 'mysql://dbuser@mysql:3306?password=Password1!&database=homecooking'
    : 'mysql://dbuser@localhost:3306?password=Password1!&database=homecooking';
  app.register(mySql, {
    connectionString,
  });

  app.register(recipes);

  return app;
}
