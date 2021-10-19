export default async function getRecipes(fastify, options) {
  fastify.get("/recipes", (req, reply) => {
    fastify.mysql.query(
      "SELECT * FROM Recipes",
      function onResult(err, result) {
        reply.send(err || result);
      }
    );
  });

  let opts = {
    schema: {
      body: { type: "string" },
    },
  };

  fastify.post("/recipes/add", opts, (req, reply) => {
    console.log(req.body);
    var recipe = JSON.parse(req.body);
    console.log(`recipe.recipeName`, recipe.recipeName);
    reply.code(201).send();
  });
}
