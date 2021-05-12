const bunyan = require('bunyan')
const pjs = require('./package.json')

const { name, version } = pjs;
const logger = (serviceName, serviceVersion, level) =>
  bunyan.createLogger({ name: `${serviceName}:${serviceVersion}`, level })

module.exports = {
  development: {
    name,
    version,
    serviceTimeout: 60,
    log: () => logger(name, version, 'debug'),
    store: {
      redis: null
    }
  },
  production: {
    name,
    version,
    serviceTimeout: 60,
    log: () => logger(name, version, 'info'),
    store: {
      redis: null
    }
  },
  test: {
    name,
    version,
    serviceTimeout: 60,
    log: () => logger(name, version, 'fatal'),
    store: {
      redis: null
    }
  }
}
