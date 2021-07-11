
const noteSchema = {
  type: 'object',
  required: ['id', 'title', 'body', 'created_at'],
  properties: {
    id: { type: 'number', description: 'note id', nullable: false },
    user_uid: { type: 'string', description: 'user uid', nullable: false },
    title: { type: 'string', nullable: false },
    body: { type: 'string', nullable: false },
    created_at: { type: 'string', nullable: false },
    updated_at: { type: 'string', nullable: true }
  }
}

const perfSchema = {
  type: 'object',
  properties: {
    time: { type: 'number' },
    note: noteSchema
  }
}

const messageSchema = {
  type: 'object',
  properties: {
    time: { type: 'number' },
    message: { type: 'string' }
  }
}

export const getAll = {
  schema: {
    description: 'get all notes',
    tags: ['note'],
    querystring: {
      type: 'object',
      properties: {
        search: { type: 'string', description: 'matches against body' },
        index: { type: 'number' },
        limit: { type: 'number' }
      }
    },
    response: {
      200: {
        type: 'object',
        properties: {
          time: { type: 'number' },
          notes: {
            type: 'array',
            items: noteSchema
          }
        }
      }
    }
  },
  handler: async function (request, reply) {
    const { search, index, limit } = request.query
    const { rows } = await this.noteDAL.getAll({ search, index, limit })
    return { time: reply.getResponseTime(), notes: rows }
  }
}


export const getOne = {
  schema: {
    description: 'get one note',
    tags: ['note'],
    params: {
      type: 'object',
      required: ['id'],
      properties: {
        id: {
          type: 'number',
          description: 'item id',
          nullable: false
        }
      }
    },
    response: {
      200: perfSchema,
      404: messageSchema
    }
  },
  handler: async function (request, reply) {
    const { id } = request.params
    const { rows } = await this.noteDAL.getOne(id)

    if (!rows.length)
      return reply
        .code(404)
        .send({ time: reply.getResponseTime(), message: "Item not found" })

    return { time: reply.getResponseTime(), note: rows[0] }
  }
}


export const createOne = {
  schema: {
    description: 'create new note',
    tags: ['note'],
    body: {
      type: 'object',
      required: ['title', 'body'],
      properties: {
        title: { type: 'string', nullable: false },
        body: { type: 'string', nullable: false }
      }
    },
    response: {
      201: perfSchema,
      400: messageSchema
    }
  },
  handler: async function (request, reply) {
    try {
      const { uid } = request.session.user
      const { title, body } = request.body
      const { rows } = await this.noteDAL.createOne(uid, title, body)

      return reply.code(201).send({ time: reply.getResponseTime(), note: rows[0] })
    } catch (error) {
      request.log.warn(`error: ${error}`)
      return reply
        .code(400)
        .send({ time: reply.getResponseTime(), message: 'not created' })
    }
  }
}


export const updateOne = {
  schema: {
    description: 'update a note',
    tags: ['note'],
    body: {
      type: 'object',
      properties: noteSchema.properties,
      anyOf: [
        { required: ['id', 'title', 'body'] },
        { required: ['id', 'title'] },
        { required: ['id', 'body'] }
      ]
    },
    response: {
      200: perfSchema,
      404: messageSchema
    }
  },
  handler: async function (request, reply) {
    try {
      const { uid } = request.session.user
      const { id, title, body } = request.body
      const { rows } = await this.noteDAL.updateOne(id, uid, title, body)

      if (!rows.length)
        return reply
          .code(404)
          .send({ time: reply.getResponseTime(), message: 'item not found' })

      return { time: reply.getResponseTime(), note: rows[0] }
    } catch (error) {
      request.log.warn(`error: ${error}`)
      return reply
        .code(404)
        .send({ time: reply.getResponseTime(), message: 'update failed' })
    }
  }
}


export const deleteOne = {
  schema: {
    description: 'delete a note',
    tags: ['note'],
    body: {
      type: 'object',
      required: ['id'],
      properties: {
        id: { type: 'number' }
      }
    },
    response: {
      200: {
        type: 'object',
        properties: {
          time: { type: 'number' },
          message: { type: 'string' }
        }
      },
      404: {
        type: 'object',
        properties: {
          message: { type: 'string' }
        }
      }
    }
  },
  handler: async function (request, reply) {
    try {
      const { uid } = request.session.user
      const { id } = request.body
      const { rowCount } = await this.noteDAL.deleteOne(id, uid)

      if (!rowCount)
        return reply.code(404).send({ message: "Item not found" })

      return { time: reply.getResponseTime(), message: `${id} deleted` }
    } catch (error) {
      request.log.warn(`error: ${error}`)
      return reply
        .code(404)
        .send({ time: reply.getResponseTime(), message: 'delete failed' })
    }
  }
}
