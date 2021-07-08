
const noteSchema = {
  type: 'object',
  required: ['id', 'title', 'body'],
  properties: {
    id: { type: 'number', description: 'note id', nullable: false },
    title: { type: 'string', nullable: false },
    body: { type: 'string', nullable: false }
  }
}

const perfSchema = {
  type: 'object',
  required: ['time'],
  properties: {
    time: { type: 'number' },
    note: noteSchema
  }
}

export const getAll = {
  schema: {
    description: 'get all notes',
    tags: ['note'],
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
  handler: getNotes
}
async function getNotes (request, reply) {
  const { rows } = await this.noteDAL.getAll()
  return { time: reply.getResponseTime(), notes: rows }
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
      404: {
        type: 'object',
        properties: {
          message: { type: 'string' }
        }
      }
    }
  },
  handler: getNote
}
async function getNote (request, reply) {
  const { id } = request.params
  const { rows } = await this.noteDAL.getOne(id)

  if (!rows.length)
    return reply.code(404).send({ message: "Item not found" })

  return { time: reply.getResponseTime(), note: rows[0] }
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
      201: perfSchema
    }
  },
  handler: createNote
}
async function createNote (request, reply) {
  const { title, body } = request.body
  const { rows } = await this.noteDAL.createOne(title, body)

  reply.code(201)
  return { time: reply.getResponseTime(), note: rows[0] }
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
      404: {
        type: 'object',
        properties: {
          message: { type: 'string' }
        }
      }
    }
  },
  handler: updateNote
}
async function updateNote (request, reply) {
  const { id, title, body } = request.body
  const { rows } = await this.noteDAL.updateOne(id, title, body)

  if (!rows.length)
    return reply.code(404).send({ message: "Item not found" })

  return { time: reply.getResponseTime(), note: rows[0] }
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
  handler: deleteNote
}
async function deleteNote (request, reply) {
  const { id } = request.body
  const { rowCount } = await this.noteDAL.deleteOne(id)

  if (!rowCount)
    return reply.code(404).send({ message: "Item not found" })

  return { time: reply.getResponseTime(), message: `${id} deleted` }
}
