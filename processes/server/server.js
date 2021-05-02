import path from 'path'
import { fork } from 'child_process'
import crypto from 'crypto'
import express from 'express'

const queue = new Map()
const childProcess = fork(path.resolve('./primeSieve.js'))
childProcess.on('message', returnResponse)

function addToQueue (id, res, data) {
  queue.set(id, res)
  childProcess.send({ id, data })
}

function returnResponse (msg) {
  const { id, primes } = msg
  const res = queue.get(id)
  res.send(primes)
  queue.delete(id)
  console.log(`${id} request handled`)
}

express()
  .get('/prime', (req, res) => {
    const n = +req.query.n || 100
    const id = crypto.randomBytes(32).toString('hex')

    addToQueue(id, res, n > 100_000_000 ? 100_000_000 : n)
    console.log(`${id} request queued`)
  })
  .get('/', (req, res) => res.send('Hello'))
  .listen(8080, () => console.log(`
  running on http://localhost:8080

  hit http://localhost:8080/prime?n=10000000000000
  hit http://localhost:8080/prime?n=100000000000
  hit http://localhost:8080/prime?n=1000000000
  `))
