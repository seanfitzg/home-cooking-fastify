import fastifyPlugin from "fastify-plugin";
import fastifyMongo from "fastify-mongodb";

async function myDbConnector(fastify, options) {
  fastify.register(fastifyMongo, {
    url: "mongodb://localhost:27017/test_database",
  });
}

// Wrapping a plugin function with fastify-plugin exposes the decorators
// and hooks, declared inside the plugin to the parent scope.
export default fastifyPlugin(myDbConnector);

// docker run -p 27017:27017 --name my_mongo -d mongo:latest
