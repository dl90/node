import fastify from 'fastify'
import { app } from './src/app.js'

const PORT = 3000
const server = fastify({
  logger: true,
  ignoreTrailingSlash: true
});

(async () => {
  try {
    server.register(app)
    await server.listen(PORT)
  } catch (error) {
    server.log.error(error)
    process.exit(1)
  }
})()
