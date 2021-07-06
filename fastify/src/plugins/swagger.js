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
      consumes: ['application/json'],
      produces: ['application/json'],
      tags: [
        { name: 'item', description: 'Item related end-points' },
        { name: 'test', description: 'Testing related end-points' }
      ],
    }
  })
})
