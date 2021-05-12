const semver = require('semver')

module.exports = class ServiceRegistry {
  constructor (log, redis, timeout = 60) {
    this.log = log
    this.redis = redis
    this.timeout = timeout
  }

  #idGen ({ name, version, ip, port }) {
    return [name, version, ip, port].join('|')
  }

  async #getAllKeys () {
    const init = await this.redis.scan('0')
    let pointer = init[0]
    const KEYS = new Set(init[1])

    while (pointer !== '0') {
      const res = await this.redis.scan(pointer)
      pointer = res[0]
      res[1].forEach(key => KEYS.add(key))
    }

    return [...KEYS]
  }

  async register (name, version, ip, port) {
    const id = this.#idGen({ name, version, ip, port })
    const exists = await this.redis.get(id)

    if (!exists) {
      await this.redis.set(id, JSON.stringify({
        timestamp: ~~(new Date() / 1000),
        name,
        version,
        ip,
        port
      }))
    } else {
      const service = JSON.parse(exists)
      await this.redis.set(id, JSON.stringify({ ...service, timestamp: ~~(new Date() / 1000) }))
    }
    await this.redis.expire(id, this.timeout)

    this.log.debug(`Updated service ${name} ${version} - ${ip}:${port}`)
    return id
  }

  async get (name, version) {
    const keys = await this.#getAllKeys()
    const validKeys = keys.filter(key => {
      const [_name, _version] = key.split('|')
      return _name === name && semver.satisfies(semver.clean(_version), version)
    })

    if (!validKeys.length) return false
    const randKey = validKeys[Math.floor(Math.random() * validKeys.length)]
    const randService = JSON.parse(await this.redis.get(randKey))
    return randService
  }

  async remove (name, version, ip, port) {
    const id = this.#idGen({ name, version, ip, port })
    const exists = await this.redis.exists(id)

    return exists ? await this.redis.del(id) : false
  }

  async flush () {
    this.log.warn('Flushed all services')
    return await this.redis.flush()
  }
}
