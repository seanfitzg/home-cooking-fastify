import fp from 'fastify-plugin';

export const fakeUserId = '1234567890';

async function fakeAuth(app) {
  app.decorateRequest('user', null);
  app.addHook('onRequest', async (req, reply) => {
    req.user = { sub: fakeUserId };
  });
}

export default fp(fakeAuth);
