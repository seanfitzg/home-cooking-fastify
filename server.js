import Fastify from 'fastify';
import mySql from 'fastify-mysql';
import users from './routes/users.js';
import recipes from './routes/recipes.js';

const fastify = Fastify({
  logger: true,
});

fastify.register(mySql, {
  connectionString:
    'mysql://dbuser@localhost:3306?password=Password1!&database=homecooking',
});
fastify.register(users);
fastify.register(recipes);

fastify.listen(3000, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  // Server is now listening on ${address}
});
