import fastify from 'fastify'

import app from './src/app.js'
import { serverConfig } from './config/appConfig.js';

const server = fastify({
  logger: true,
  ignoreTrailingSlash: true
});

(async () => {
  try {
    server.register(app)
    const address = await server.listen(serverConfig.port)
    console.log(`serving: ${address}`)
  } catch (error) {
    server.log.error(error)
    process.exit(1)
  }
})()
