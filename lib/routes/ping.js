export default async function ping(fastify, options, done) {
  fastify.get('/ping', {
    handler: (req, reply) => {
      reply.code(200).send('ok');
    },
  });

  done();
}
