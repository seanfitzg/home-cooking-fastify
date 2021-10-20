import Fastify from 'fastify';
import mySql from 'fastify-mysql';
import fastifyAuth from 'fastify-auth0-verify';
import fastifyCors from 'fastify-cors';
import recipes from './routes/recipes.js';

const fastify = Fastify({
  logger: true,
});
fastify.register(fastifyCors);
fastify.register(fastifyAuth, {
  domain: 'home-cooking.eu.auth0.com',
  audience: 'https://home-cooking/api',
});

let connectionString = process.env.IS_DOCKER
  ? 'mysql://dbuser@mysql:3306?password=Password1!&database=homecooking'
  : 'mysql://dbuser@localhost:3306?password=Password1!&database=homecooking';

fastify.register(mySql, {
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
