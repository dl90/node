const { promisify } = require("util")
const redis = require('redis')

module.exports = function Redis (user, password) {
  let client

  const connect = () => {
    client = redis.createClient({ user, password })
    return client
  }

  const promises = () => {
    return {
      exists: promisify(client.exists).bind(client),
      scan: promisify(client.scan).bind(client),
      get: promisify(client.get).bind(client),
      mget: promisify(client.mget).bind(client),
      set: promisify(client.set).bind(client),
      del: promisify(client.del).bind(client),
      expire: promisify(client.expire).bind(client),
      flush: promisify(client.flushdb).bind(client)
    }
  }

  return {
    client: connect(),
    promises: promises()
  }
}
