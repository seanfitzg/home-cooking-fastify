import Fastify from 'fastify';
import pgSql from 'fastify-postgres';
import fastifyAuth from 'fastify-auth0-verify';
import fastifyCors from 'fastify-cors';
import recipes from './routes/recipes/recipes.js';

const fastify = Fastify({
  logger: true,
});
fastify.register(fastifyCors);
fastify.register(fastifyAuth, {
  domain: 'home-cooking.eu.auth0.com',
  audience: 'https://home-cooking/api',
});

let connectionString = process.env.IS_DOCKER
  ? 'postgresql://dbuser:Password1!@pgsql:5432/homecooking'
  : 'postgresql://dbuser:Password1!@127.0.0.1:5432/homecooking';

fastify.register(pgSql, {
  connectionString,
});
fastify.register(recipes);

fastify.listen(5000, '0.0.0.0', function (err, address) {
  if (err) {
    fastify.log.error(process.versions);
    fastify.log.error(err);
    process.exit(1);
  }
  // Server is now listening on ${address}
});
