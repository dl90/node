import {
  getAll,
  getOne,
  postOne,
  updateOne,
  deleteOne
} from './controller.js'

export default async (fastify, opts) => {

  fastify.get('/', getAll)
  fastify.get('/:id', getOne)
  fastify.post('/', postOne)
  fastify.put('/', updateOne)
  fastify.delete('/', deleteOne)
}
