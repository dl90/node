const http = require('http')
const dotenv = require('dotenv')

dotenv.config()

const config = require('./config.js')[process.env.NODE_ENV || 'development']
config.store.redis = require('./store/redis')(process.env.REDIS_USER, process.env.REDIS_PASSWORD)

const service = require('./src/app.js')(config)
const server = http.createServer(service)
const log = config.log()

// Important - a service should not have a fixed port but should randomly choose one
server.listen(process.env.PORT || 3000, () => {
  log.info(`listening on http://localhost:${server.address().port} [${service.get('env')} mode]`)
})
