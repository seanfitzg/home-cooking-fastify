import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();
const server = app({
  logger: true,
});

server.listen(5000, '0.0.0.0', function (err, address) {
  if (err) {
    server.log.error(process.versions);
    server.log.error(err);
    process.exit(1);
  }
});
