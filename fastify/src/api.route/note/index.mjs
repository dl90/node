import { pgConfig } from '../../../config/appConfig.mjs'
import noteDAL from "./noteDAL.mjs"
import {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne
} from './controller.mjs'
import checkSession from '../../middleware/checkSession.mjs'

export default async (fastify, opts) => {
  fastify.decorate('noteDAL', noteDAL(fastify.pg[pgConfig.database]))

  // requires login
  fastify.addHook('preHandler', checkSession)

  fastify.get('/', getAll)
  fastify.get('/:id', getOne)
  fastify.post('/', createOne)
  fastify.put('/', updateOne)
  fastify.delete('/', deleteOne)
}
