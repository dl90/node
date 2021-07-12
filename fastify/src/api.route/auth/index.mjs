import { pgConfig } from '../../../config/appConfig.mjs'
import userDAL from "./userDAL.mjs"
import {
  createUser,
  login,
  check,
  logout,
  deleteUser
} from './controller.mjs'

export default async (fastify, opts) => {
  fastify.decorate('userDAL', userDAL(fastify.pg[pgConfig.database]))

  // scoped handler
  fastify.setErrorHandler((error, request, reply) => {
    if (error.validation) {
      const dataPaths = error.validation.map(e => e.dataPath)
      const params = dataPaths.join(', ').replace('.', '')
      return reply
        .status(422)
        .send({ message: `Invalid ${params}` })
    }
  })

  fastify.post('/signup', createUser)
  fastify.post('/login', login)
  fastify.get('/', check)
  fastify.post('/', logout)
  fastify.delete('/', deleteUser)

}
