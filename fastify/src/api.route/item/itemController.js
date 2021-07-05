import { items } from '../../../mockDB.js'

const itemSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    name: { type: 'string' }
  }
}

export const getAll = {
  schema: {
    response: {
      200: {
        type: 'array',
        items: itemSchema
      }
    }
  },
  handler: getItems
}
function getItems (req, res) {
  return res.send(items)
}

export const getOne = {
  schema: {
    querystring: {
      type: 'object',
      properties: {
        id: { type: 'string' }
      }
    },
    response: {
      200: itemSchema
    }
  },
  handler: getItem
}
function getItem (req, res) {
  const { id } = req.params
  return res.send(items.find(item => item.id === +id))
}

export const postOne = {
  schema: {
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
function createItem (req, res) {
  const { name } = req.body
  const item = {
    id: items.length + 1,
    name
  }
  items.push(item)
  return res.code(201).send(item)
}

export const updateOne = {
  schema: {
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
function updateItem (req, res) {
  const { id, name } = req.body

  const exist = items.find(item => item.id === +id)
  if (!exist)
    return res.code(404).send({ message: "Item not found" })

  exist.name = name
  return res.send(exist)
}

export const deleteOne = {
  schema: {
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
function deleteItem (req, res) {
  const { id } = req.body

  const exist = items.find(item => item.id === +id)
  if (!exist)
    return res.code(404).send({ message: "Item not found" })

  items.splice(items.indexOf(exist), 1)
  return res.send({ message: `${id} deleted` })
}
