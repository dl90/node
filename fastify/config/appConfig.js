import dotenv from 'dotenv'

dotenv.config()

function requiredEnv (name) {
  if (process.env[name] === undefined)
    throw new Error(`missing env ${name}`)

  return process.env[name]
}

export const pgConfig = {
  host: requiredEnv('POSTGRES_HOST'),
  port: requiredEnv('POSTGRES_PORT'),
  database: requiredEnv('POSTGRES_DATABASE'),
  user: requiredEnv('POSTGRES_USERNAME'),
  password: requiredEnv('POSTGRES_PASSWORD')
}

export const serverConfig = {
  port: process.env.PORT || 3001
}
