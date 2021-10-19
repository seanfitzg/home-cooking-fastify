import fp from "fastify-plugin";

async function myPlugin(app) {
  app.decorateReply("utility", function () {
    console.log("---- reply decorator");
  });

  app.decorateRequest("foo", null);
  app.addHook("onRequest", async (req, reply) => {
    req.foo = { bar: 42 };
  });
}

export default fp(myPlugin);
