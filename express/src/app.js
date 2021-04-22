import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieSession from 'cookie-session'
import rateLimit from 'express-rate-limit'
import csurf from 'csurf'
import morgan from 'morgan'
import { accessLogStream } from './logging.js'

import postRoute from './modules/post/postRoute.js'

const app = express()
const limiter = rateLimit({
  windowMs: 600_000, // 10 minutes
  max: 100
})

app.use(morgan('combined', { stream: accessLogStream }))
app.use(cors())
app.use(helmet())
app.use(express.json({ strict: true, limit: '100kb' })) // verify: function to validate json
app.use(express.urlencoded({ extended: false, limit: '100kb', parameterLimit: 100 })) // verify: function to validate x-www-form-urlencoded
app.use(cookieSession({
  name: 'session',
  secret: 'WcGZDidfCgtdzgNZRK3hcHwmKkeEmNG82oqd6q3osjfzCDHcZUweDex8Q7g2WNPuR3KenP',
  maxAge: 86_400_000, // 24 hours
  secure: false,
  httpOnly: true
}))
app.use(limiter)
app.use(csurf({ cookie: false }))

export default function (databasePool) {

  app.use('/api/posts', postRoute(databasePool))

  app.get('/test', (req, res) => res.send(req.body))

  return app
}