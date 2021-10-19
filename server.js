import Fastify from "fastify";
import mySql from "fastify-mysql";

import dbConnector from "./our-db-connector.js";
import firstRoute from "./our-first-route.js";
import myplugin from "./myplugin.js";
import getRecipes from "./getRecipes.js";

const fastify = Fastify({
  logger: true,
});
// fastify.register(myplugin);
// fastify.register(dbConnector);
// fastify.register(mySql, {
//   connectionString:
//     "Server=localhost; Port=3306; Database=homecooking; Uid=dbuser; Pwd=Password1!;",
// });

fastify.register(mySql, {
  connectionString:
    "mysql://dbuser@localhost:3306?password=Password1!&database=homecooking",
});

// fastify.register(firstRoute);
fastify.register(getRecipes);

fastify.listen(3000, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  // Server is now listening on ${address}
});
