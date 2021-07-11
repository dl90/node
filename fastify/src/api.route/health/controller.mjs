export const root = {
  schema: {
    description: 'test endpoint',
    tags: ['test'],
    summary: 'test me',
    response: {
      200: {
        type: 'object',
        properties: {
          message: { type: 'string' }
        }
      }
    }
  },
  handler: (request, reply) => ({ message: 'OK' })
}

export const ping = {
  schema: {
    description: 'check ping',
    tags: ['test'],
    summary: 'ping me',
    response: {
      200: {
        type: 'object',
        properties: {
          message: { type: 'string' }
        }
      }
    }
  },
  handler: (request, reply) => ({
    message: `Pong: ${reply.getResponseTime()}`
  })
}
