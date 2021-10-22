import app from './app.js';

const server = app({
  logger: true,
});

server.listen(5000, '0.0.0.0', function (err, address) {
  if (err) {
    app.log.error(process.versions);
    app.log.error(err);
    process.exit(1);
  }
});
