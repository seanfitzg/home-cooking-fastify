export default async function users(fastify, options) {
  fastify.get('/users', (req, reply) => {
    fastify.mysql.query('SELECT * FROM Users', function onResult(err, result) {
      reply.send(err || result);
    });
  });

  let opts = {
    schema: {
      body: { type: 'string' },
    },
  };

  fastify.post('/users/add', opts, (req, reply) => {
    console.log(req.body);
    var user = JSON.parse(req.body);
    console.log('user.userName', user.userName);
    fastify.mysql.execute(
      `INSERT INTO Users (Name) VALUES ("${user.userName}")`,
      (err, result) => {
        console.log(err);
        console.log(result);
        reply.code(201).send(err || 'Success');
      }
    );
  });
}
