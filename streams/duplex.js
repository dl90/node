const fs = require('fs')
const stream = require('stream')
const logUpdate = require('log-update')

const { spin } = require('./util/spin.js')
const { Collect } = require('./util/customStreams.js')

const FILE_PATH = './resource/powder-day.mp4'
const startTime = process.hrtime()
const startUsage = process.cpuUsage()
const startMemory = process.memoryUsage().rss
const fileSize = fs.statSync(FILE_PATH).size

/*
  duplex streams can be placed between readable and writable streams
  but the read and write streams are independent
*/

class Throttle extends stream.Duplex {
  constructor (ms) {
    super()
    this.delay = ms
  } ƒ

  _read () { }

  _write (chunk, encoding, done) {
    this.push(chunk)
    setTimeout(done, this.delay)
  }

  _final () {
    this.push(null)
  }
}

let passed = 0
const runningBuffer = []

const read = fs.createReadStream(FILE_PATH, { highWaterMark: 16 * 1024 })
const passthrough = new stream.PassThrough()
const throttle = new Throttle(3)
const write = new Collect(runningBuffer)
const progress = spin(startTime, startUsage, startMemory, fileSize)

/*
  chaining throttle reduces cpu usage
*/
read
  .pipe(throttle)
  .pipe(passthrough)
  .pipe(write)

read
  .on('data', () => {
    progress(read.bytesRead, passed)
  })

passthrough
  .on('data', chunk => {
    passed += chunk.length
    progress(read.bytesRead, passed)
  })
  .on('close', () => progress(read.bytesRead, passed, true))


write
  .on('close', () => {
    const buffer = Buffer.concat(runningBuffer)
    console.log(`
      parsed buffer size: ${(buffer.length / 1_048_576).toFixed(2)} MB
      file size on system: ${(fileSize / 1_000_000).toFixed(2)} MB
    `)
  })
