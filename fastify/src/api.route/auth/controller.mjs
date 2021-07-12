import argon2 from 'argon2'
import { argon2Config, sessionConfig } from '../../../config/appConfig.mjs'
import checkSession from '../../middleware/checkSession.mjs'

const credSchema = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      nullable: false,
      minLength: 3,
      maxLength: 254,
      format: "email"
    },
    password: {
      type: 'string',
      nullable: false,
      minLength: 6,
      maxLength: 80,
      pattern: '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'
    }
  }
}

const messageSchema = {
  type: 'object',
  properties: {
    time: { type: 'number' },
    message: { type: 'string' }
  }
}

export const createUser = {
  schema: {
    description: 'create new user',
    tags: ['auth'],
    body: credSchema,
    response: {
      201: messageSchema,
      400: messageSchema
    }
  },
  handler: async function (request, reply) {
    try {
      if (request.session.user)
        request.sessionStore.destroy(request.session.sessionId)

      const { email, password } = request.body
      const exist = await this.userDAL.findEmail(email)
      if (exist.rowCount === 1)
        throw new Error('email already exists')

      const hash = await argon2.hash(password, argon2Config)
      const result = await this.userDAL.createUser(email, hash)

      if (result.rowCount === 1) {
        const { uid } = result.rows[0]
        request.session.user = { uid }
        return reply
          .code(201)
          .send({ time: reply.getResponseTime(), message: 'created' })
      }

      return reply
        .code(400)
        .send({ time: reply.getResponseTime(), message: 'not created' })

    } catch (error) {
      request.log.warn(`error: ${error}`)
      return reply
        .code(400)
        .send({ time: reply.getResponseTime(), message: 'not created' })
    }
  }
}

export const login = {
  schema: {
    description: 'login user',
    tags: ['auth'],
    body: credSchema,
    response: {
      200: {
        type: 'object',
        required: ['time', 'user'],
        properties: {
          time: { type: 'number' },
          user: {
            type: 'object',
            required: ['uid'],
            properties: {
              uid: { type: 'string' }
            }
          }
        }
      },
      400: messageSchema
    }
  },
  handler: async function (request, reply) {
    try {
      if (request.session.user)
        return reply
          .code(200)
          .send({ time: reply.getResponseTime(), user: { uid: request.session.user.uid } })

      const { email, password } = request.body
      const user = await this.userDAL.findUser(email)
      if (user.rowCount !== 1)
        throw new Error('not found')

      const { uid, hash } = user.rows[0]
      const valid = await argon2.verify(hash, password)
      if (!valid)
        throw new Error('invalid password')

      request.session.user = { uid }
      return reply
        .code(200)
        .send({ time: reply.getResponseTime(), user: { uid } })

    } catch (error) {
      request.log.warn(`error: ${error}`)
      return reply
        .code(400)
        .send({ time: reply.getResponseTime(), message: 'attempt unsuccessful' })
    }
  }
}

export const check = {
  schema: {
    description: 'login user',
    tags: ['auth'],
    response: {
      200: {
        type: 'object',
        required: ['time', 'user'],
        properties: {
          time: { type: 'number' },
          user: {
            type: 'object',
            required: ['email'],
            properties: {
              email: { type: 'string' }
            }
          }
        }
      },
      403: messageSchema
    },
  },
  preHandler: checkSession,
  handler: async function (request, reply) {
    try {
      const { uid } = request.session.user
      const one = await this.userDAL.findOne(uid)
      if (one.rowCount !== 1)
        throw new Error('not found')

      const { email } = one.rows[0]
      return { time: reply.getResponseTime(), user: { email } }

    } catch (error) {
      request.log.warn(`error: ${error}`)
      return reply
        .code(403)
        .send({ time: reply.getResponseTime(), message: 'not authorized' })
    }
  }
}

export const logout = {
  schema: {
    description: 'logout user',
    tags: ['auth'],
    response: {
      200: messageSchema,
      403: messageSchema
    },
  },
  handler: async function (request, reply) {
    try {
      request.sessionStore.destroy(request.session.sessionId)
      request.session = null

      return reply
        .setCookie(sessionConfig.name, '', { expires: Date.now(), httpOnly: true })
        .send({ time: reply.getResponseTime(), message: 'ok' })

    } catch (error) {
      request.log.warn(`error: ${error}`)
      return reply
        .code(403)
        .setCookie(sessionConfig.name, '', { expires: Date.now(), httpOnly: true })
        .send({ time: reply.getResponseTime(), message: 'something went wrong' })
    }
  }
}

export const deleteUser = {
  schema: {
    description: 'delete current user',
    tags: ['auth'],
    response: {
      200: messageSchema,
      403: messageSchema
    },
  },
  preHandler: checkSession,
  handler: async function (request, reply) {
    try {
      const { uid } = request.session.user
      const result = await this.userDAL.deleteUser(uid)
      if (result.rowCount !== 1)
        throw new Error('failed to delete user')

      request.sessionStore.destroy(request.session.sessionId)
      request.session = null

      return reply
        .setCookie(sessionConfig.name, '', { expires: Date.now(), httpOnly: true })
        .send({ time: reply.getResponseTime(), message: 'ok' })

    } catch (error) {
      request.log.warn(`error: ${error}`)
      return reply
        .code(403)
        .setCookie(sessionConfig.name, '', { expires: Date.now(), httpOnly: true })
        .send({ time: reply.getResponseTime(), message: 'something went wrong' })
    }
  }
}
