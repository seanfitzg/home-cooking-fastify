export default (fastify) => {
  return process.env.NO_AUTH === 'true' ? null : fastify.authenticate;
};
