import fp from 'fastify-plugin';

async function myPlugin(app) {
  app.decorateRequest('user', null);
  app.addHook('onRequest', async (req, reply) => {
    req.user = { sub: '1234567890' };
  });
}

export default fp(myPlugin);
