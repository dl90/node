import fp from 'fastify-plugin'
import fastifySwagger from 'fastify-swagger'

export default fp(async (fastify, opts) => {
  fastify.register(fastifySwagger, {
    exposeRoute: true,
    routePrefix: '/docs',
    swagger: {
      info: {
        title: 'fastify example',
        description: 'Testing the Fastify swagger API',
        version: '0.0.1'
      },
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
      tags: [
        { name: 'test', description: 'Testing related end-points', },
        { name: 'note', description: 'Testing related end-points' }
      ],
      uiConfig: {
        docExpansion: 'none',
        tryItOutEnabled: true,
        syntaxHighlight: {
          activate: true,
          theme: 'obsidian'
        }
      }
    }
  })
})
