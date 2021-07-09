import fp from 'fastify-plugin'
import fastifyPostgres from 'fastify-postgres'

import { pgConfig } from '../../config/appConfig.mjs'

export default fp(async (fastify, opts) => {
  fastify.register(fastifyPostgres, {
    name: pgConfig.database,
    ...pgConfig
  })
})
