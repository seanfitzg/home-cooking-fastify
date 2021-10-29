import Fastify from 'fastify';
import pgSql from 'fastify-postgres';
import fastifyAuth from 'fastify-auth0-verify';
import fastifyCors from 'fastify-cors';
import recipes from './routes/recipes/recipes.js';
import ping from './routes/ping.js';
import fakeAuth from '../tests/utilities/fakeAuth.js';

export default function build(opts = {}, noAuth = false) {
  const app = Fastify(opts);

  app.register(fastifyCors);
  if (noAuth) {
    app.register(fakeAuth);
  } else {
    app.register(fastifyAuth, {
      domain: 'home-cooking.eu.auth0.com',
      audience: 'https://home-cooking/api',
    });
  }

  let connectionString = process.env.DB_CONNECTION_STRING;
  app.register(pgSql, {
    connectionString,
  });

  app.register(recipes);
  app.register(ping);

  return app;
}
