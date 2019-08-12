'use strict';

const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
const hapiAuthJWT = require('hapi-auth-jwt2');

require('dotenv').config();

// import routes
const routes = require('./main/routes');

// create new server instance
const server = new Hapi.Server({
  host: process.env.APP_HOST || 'localhost',
  port: process.env.PORT || 3000,
  routes: {
    cors: {
      origin: ['*'], // an array of origins or 'ignore'
      maxAge: 60,
      credentials: true // boolean - 'Access-Control-Allow-Credentials'
    },
    validate: {
      failAction: async (request, h, err) => {
        if (process.env.NODE_ENV === 'production') {
          // In prod, log a limited error message and throw the default Bad Request error.
          throw err;
        } else {
          // During development, log and respond with the full error.
          console.error(err);
          throw err;
        }
      }
    }
  }
});

const validateUser = (decoded, request) => {
  // This is a simple check that the `sub` claim
  // exists in the access token. Modify it to suit
  // the needs of your application
  if (decoded && decoded.id) {
    return {
      isValid: true
    };
  }
  return {
    isValid: false
  };
};

const apiVersionOptions = {
  basePath: '/api',
  validVersions: [1, 2],
  defaultVersion: 1,
  vendorName: 'api'
};

const swaggerOptions = {
  pathPrefixSize: 3,
  host: `${process.env.APP_HOST || 'localhost'}:${process.env.PORT || 3000}`,
  basePath: apiVersionOptions.basePath,
  info: {
    title: `${process.env.APP_NAME} Documentation`,
    description: `This is ${process.env.APP_NAME} documentation`
  },
  deReference: false,
  securityDefinitions: {
    Bearer: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header'
    }
  },
  security: [{ Bearer: [] }]
};

process.on('uncaughtException', err => {
  console.log(err, 'Uncaught exception');
  process.exit(1);
});

server.events.on(
  {
    name: 'request',
    channels: 'error'
  },
  (request, event, tags) => {
    console.log(`Request ${event.request} failed`);
  }
);

async function gracefulStopServer() {
  // Wait 60s for server handle remaining requests and stop the server
  await server.stop({
    timeout: 60 * 1000
  });
  // Clear everything after that
  return process.exit(0);
}

process.on('SIGINT', gracefulStopServer);
process.on('SIGTERM', gracefulStopServer);

async function start() {
  // start your server
  try {
    const plugins = [
      Inert,
      Vision,
      {
        plugin: require('./plugins/logger'),
        options: {
          name: 'web-base-api',
          prettyPrint: process.env.NODE_ENV !== 'production',
          redact: ['req.headers.authorization']
        }
      },
      hapiAuthJWT
    ];
    if (process.env.SWAGGER_ENABLED) {
      plugins.push({
        plugin: HapiSwagger,
        options: swaggerOptions
      });
    }
    await server.register(plugins);
    server.auth.strategy('jwt', 'jwt', {
      key: process.env.JWT_SECRET || 'enouvo123',
      validate: validateUser,
      verifyOptions: {
        ignoreExpiration: true
      }
    });

    server.auth.default('jwt');
    server.route(routes);
    await server.start();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  console.log('Server running at: ', server.info.uri);
}

start();

module.exports = server;
