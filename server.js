const Hapi = require('hapi');
const api = require('./api');
const Inert = require('inert');
const Path = require('path');

// define some constants to make life easier
const DEFAULT_HOST = "localhost";
const DEFAULT_PORT = 3000;
const RADIX = 10;
const CORS = true;

// define your server
const server = Hapi.server({
  host: process.env.HOST || DEFAULT_HOST,
  port: parseInt(process.env.PORT, RADIX) || DEFAULT_PORT,
  app: {},
  routes: {
    cors: CORS,
    files: {
      relativeTo: Path.join(__dirname, 'frontend', 'dist')
    }
  }
});

const apiServer = async () => {
  try {
    await server.register(Inert);
    await server.register(api);
    await server.start();
    console.log(`Hapi server running at ${server.info.uri}`);
  } catch (err) {
    console.log("Hapi error starting server", err);
    process.exit(1);
  }
};

apiServer();
