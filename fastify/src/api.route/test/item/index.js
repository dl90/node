import {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne
} from './controller.js'

export default async (fastify, opts) => {

  fastify.get('/', getAll)
  fastify.get('/:id', getOne)
  fastify.post('/', createOne)
  fastify.put('/', updateOne)
  fastify.delete('/', deleteOne)
}
