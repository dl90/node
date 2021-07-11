import dotenv from 'dotenv'
import crypto from 'crypto'
import argon2 from 'argon2'

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

export const redisConfig = {
  host: requiredEnv('REDIS_HOST'),
  port: requiredEnv('REDIS_PORT'),
  db: requiredEnv("REDIS_DB"),
  user: requiredEnv("REDIS_USER"),
  password: requiredEnv("REDIS_PW")
}

export const serverConfig = {
  port: process.env.PORT || 3001
}

export const sessionConfig = {
  name: 'ssid',
  secret: process.env.SESSION_SECRET?.split(',') ||
    [crypto.randomBytes(32).toString('hex'), crypto.randomBytes(32).toString('hex')],
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: +process.env.MAX_AGE || 1_800_000 // 30min
  }
}

// https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
export const argon2Config = {
  type: argon2.argon2id,
  timeCost: 2,
  memoryCost: 1 << 14,  // 16 MiB
  hashLength: 32,       // 97 chars
}
