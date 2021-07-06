import { items, nextId } from '../../../mockDB.js'

const itemSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    name: { type: 'string' }
  }
}

export const getAll = {
  schema: {
    description: 'get all items',
    tags: ['item'],
    summary: 'qwerty',
    response: {
      200: {
        type: 'array',
        items: itemSchema
      }
    }
  },
  handler: getItems
}
function getItems (request, reply) {
  return items
}

export const getOne = {
  schema: {
    description: 'get one item',
    tags: ['item'],
    summary: 'qwerty',
    params: {
      type: 'object',
      required: ['id'],
      properties: {
        id: {
          type: 'string',
          description: 'item id'
        }
      }
    },
    response: {
      200: itemSchema
    }
  },
  handler: getItem
}
function getItem (request, reply) {
  const { id } = request.params
  return items.find(item => item.id === +id)
}

export const postOne = {
  schema: {
    description: 'add new item',
    tags: ['item'],
    summary: 'qwerty',
    body: {
      type: 'object',
      required: ['name'],
      properties: {
        name: { type: 'string' }
      }
    },
    response: {
      201: itemSchema
    }
  },
  handler: createItem
}
function createItem (request, reply) {
  const { name } = request.body
  const item = {
    id: nextId(),
    name
  }
  items.push(item)
  return reply.code(201).send(item)
}

export const updateOne = {
  schema: {
    description: 'update an item',
    tags: ['item'],
    summary: 'qwerty',
    body: {
      type: 'object',
      required: ['id', 'name'],
      properties: itemSchema.properties
    },
    response: {
      200: itemSchema,
      404: {
        type: 'object',
        properties: {
          message: { type: 'string' }
        }
      }
    }
  },
  handler: updateItem
}
function updateItem (request, reply) {
  const { id, name } = request.body

  const exist = items.find(item => item.id === +id)
  if (!exist)
    return reply.code(404).send({ message: "Item not found" })

  exist.name = name
  return exist
}

export const deleteOne = {
  schema: {
    description: 'delete an item',
    tags: ['item'],
    summary: 'qwerty',
    body: {
      type: 'object',
      required: ['id'],
      properties: {
        id: { type: 'string' }
      }
    },
    response: {
      200: {
        type: 'object',
        properties: {
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
  handler: deleteItem
}
function deleteItem (request, reply) {
  const { id } = request.body

  const exist = items.find(item => item.id === +id)
  if (!exist)
    return reply.code(404).send({ message: "Item not found" })

  items.splice(items.indexOf(exist), 1)
  return { message: `${id} deleted` }
}
