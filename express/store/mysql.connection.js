import mysql from 'mysql2'
import env from 'dotenv'

env.config()

const config = {
  connectionLimit: 10,
  waitForConnections: true,
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
}

export default mysql.createPool(config)
