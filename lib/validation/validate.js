export default (fastify) => {
  return process.env.USE_AUTH === 'true' ? fastify.authenticate : null;
};
