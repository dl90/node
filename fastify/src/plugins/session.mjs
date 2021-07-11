import fp from 'fastify-plugin'
import fastifySession from 'fastify-session'
import fastifyCookie from 'fastify-cookie'
import redis from 'redis'
import connectRedis from 'connect-redis'

import { sessionConfig, redisConfig } from '../../config/appConfig.mjs'

const redisStore = connectRedis(fastifySession)
const redisClient = redis.createClient(redisConfig)

export default fp(async (fastify, opts) => {
  await fastify.register(fastifyCookie)
  await fastify.register(fastifySession, {
    cookieName: sessionConfig.name,
    store: new redisStore({ client: redisClient }),
    secret: sessionConfig.secret,
    saveUninitialized: false,
    cookie: sessionConfig.cookie
  })
})
