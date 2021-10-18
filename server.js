import Fastify from "fastify";
import dbConnector from "./our-db-connector.js";
import firstRoute from "./our-first-route.js";
import myplugin from "./myplugin.js";

const fastify = Fastify({
  logger: true,
});
fastify.register(myplugin);
fastify.register(dbConnector);
fastify.register(firstRoute);

fastify.listen(3000, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  // Server is now listening on ${address}
});
