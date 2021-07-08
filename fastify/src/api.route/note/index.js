import { pgConfig } from '../../../config/appConfig.js'
import noteDAL from "./noteDAL.js"
import {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne
} from './controller.js'

export default async (fastify, opts) => {
  fastify.decorate('noteDAL', noteDAL(fastify.pg[pgConfig.database]))

  fastify.get('/', getAll)
  fastify.get('/:id', getOne)
  fastify.post('/', createOne)
  fastify.put('/', updateOne)
  fastify.delete('/', deleteOne)
}
