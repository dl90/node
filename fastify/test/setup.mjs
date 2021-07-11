import fastify from 'fastify'
import fp from 'fastify-plugin'

import app from '../src/app.mjs'

export default function setup () {

  const server = fastify({
    logger: false,
    ignoreTrailingSlash: true
  })
  server.register(fp(app))

  return server
}
