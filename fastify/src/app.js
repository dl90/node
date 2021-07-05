import autoload from 'fastify-autoload'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fastifySwagger from 'fastify-swagger'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export async function app (fastify, options) {

  // must be before registered modules - http://localhost:3000/docs
  fastify.register(fastifySwagger, {
    exposeRoute: true,
    routePrefix: '/docs',
    swagger: {
      info: {
        title: 'fastify example'
      }
    }
  })

  fastify.register(autoload, {
    dir: join(__dirname, 'api.route'),
    options: {
      prefix: '/api'
    }
  })
}
