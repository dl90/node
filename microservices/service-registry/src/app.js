const express = require('express')
const ServiceRegistry = require('./ServiceRegistry.js')

const service = express()

module.exports = (config) => {
  const log = config.log()
  const serviceRegistry = new ServiceRegistry(log, config.store.redis.promises, config.serviceTimeout)

  if (service.get('env') === 'development') {
    service.use((req, res, next) => {
      log.debug(`${req.method}: ${req.url}`)
      return next()
    })
  }

  service.put('/register/:serviceName/:serviceVersion/:servicePort', async (req, res, next) => {
    const { serviceName, serviceVersion, servicePort } = req.params
    const ip = req.ip.includes('::') ? `[${req.ip}]` : req.ip
    const serviceID = await serviceRegistry.register(serviceName, serviceVersion, ip, servicePort)

    return res.json({ id: serviceID })
  })

  service.delete('/register/:serviceName/:serviceVersion/:servicePort', async (req, res, next) => {
    const { serviceName, serviceVersion, servicePort } = req.params
    const result = await serviceRegistry.remove(serviceName, serviceVersion, req.ip, servicePort)

    return res.json({ result })
  })

  service.delete('/reset', async (req, res, next) => {
    const result = await serviceRegistry.flush()
    return res.json({ result })
  })

  service.get('/find/:serviceName/:serviceVersion', async (req, res, next) => {
    const { serviceName, serviceVersion } = req.params
    const service = await serviceRegistry.get(serviceName, serviceVersion)

    if (service) {
      return res.json({ result: service })
    } else {
      return res.status(404).send({ result: 'not found' })
    }
  })

  service.use((error, req, res, next) => {
    res.status(error.status || 500)
    log.error(error)

    return res.json({
      error: { message: error.message }
    })
  })

  return service
}
