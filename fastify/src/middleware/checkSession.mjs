export default async function (request, reply) {
  if (!request.session.user)
    return reply
      .status(403)
      .send({ time: reply.getResponseTime(), message: 'not authorized' })
}
