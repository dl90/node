import autoload from 'fastify-autoload'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export async function app (fastify, opts) {

  fastify.register(autoload, {
    dir: join(__dirname, 'plugins')
  })

  fastify.register(autoload, {
    dir: join(__dirname, 'api.route'),
    options: {
      prefix: '/api'
    }
  })

}
