import { root, ping } from "./controller.js"

export default async (fastify, opts) => {

  fastify.get('/', root)
  fastify.get('/ping', ping)
}
