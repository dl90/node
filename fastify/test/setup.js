import fastify from 'fastify'
import fp from 'fastify-plugin'

import app from '../src/app.js'
import { pgConfig } from '../config/appConfig.js'

export default function setup () {

  const server = fastify({
    logger: false,
    ignoreTrailingSlash: true
  })
  server.register(fp(app))

  beforeAll(async () => {
    await server.ready()
    await server.pg[pgConfig.database].query('TRUNCATE "note" RESTART IDENTITY')
  })

  afterAll(async () => {
    await server.close()
  })

  beforeEach(async () => {

  })

  afterEach(async () => {

  })

  return server
}