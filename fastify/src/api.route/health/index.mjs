import { root, ping } from "./controller.mjs"

export default async (fastify, opts) => {

  fastify.get('/', root)
  fastify.get('/ping', ping)
}
