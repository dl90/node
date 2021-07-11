import { pgConfig } from '../../../config/appConfig.mjs'
import userDAL from "./userDAL.mjs"
import {
  createUser,
  login,
  check,
  logout
} from './controller.mjs'

export default async (fastify, opts) => {
  fastify.decorate('userDAL', userDAL(fastify.pg[pgConfig.database]))

  fastify.post('/signup', createUser)
  fastify.post('/login', login)
  fastify.get('/', check)
  fastify.post('/', logout)

}
