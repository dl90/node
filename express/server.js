import app from './src/app.js'
import mysql_connection from './store/mysql.connection.js'
import http from 'http'
import env from 'dotenv'

env.config()
const PORT = process.env.PORT

http.createServer(app(mysql_connection))
  .listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`)
  })
