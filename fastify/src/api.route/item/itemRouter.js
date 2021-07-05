import {
  getAll,
  getOne,
  postOne,
  updateOne,
  deleteOne
} from './itemController.js'

export default (fastify, options, done) => {

  fastify.get('/', getAll)
  fastify.get('/:id', getOne)
  fastify.post('/', postOne)
  fastify.put('/', updateOne)
  fastify.delete('/', deleteOne)

  done()
}
