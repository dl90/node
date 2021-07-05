import mysql from 'mysql2'
import env from 'dotenv'

env.config()

const config = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PW,
  database: process.env.MYSQL_DB,
  waitForConnections: true,
  connectionLimit: 10
}

export default mysql.createPool(config)
