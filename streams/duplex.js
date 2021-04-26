const fs = require('fs')
const stream = require('stream')
const logUpdate = require('log-update')

const FILE_PATH = './resource/powder-day.mp4'
const startTime = process.hrtime()
const startUsage = process.cpuUsage()
const startMemory = process.memoryUsage().rss
const fileSize = fs.statSync(FILE_PATH).size

/*
  duplex streams can be placed between readable and writable streams
*/

class Collect extends stream.Writable {
  constructor (runningBuffer) {
    super()
    this.buffer = runningBuffer
  }

  _write (chunk, encoding, done) {
    if (!chunk) this.end()
    this.buffer.push(Buffer.from(chunk))
    done()
  }
}

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
const progress = spin()

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

/*
  populate some stats
*/
function spin () {
  const spinner = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
  let i = 0

  function hrtimeToMS (hrtime) {
    return hrtime[0] * 1000 + hrtime[1] / 1_000_000
  }

  return (read, passed, done = false) => {
    const elapsedTime = hrtimeToMS(process.hrtime(startTime))
    const elapsedUsage = process.cpuUsage(startUsage)
    const elapsedRSSMemory = (process.memoryUsage().rss - startMemory) / 1_048_576 // MB

    const elapsedUserMS = elapsedUsage.user / 1000
    const elapsedSystMS = elapsedUsage.system / 1000;
    const cpuPercent = (100 * (elapsedUserMS + elapsedSystMS) / elapsedTime).toFixed(1) + '%'

    done
      ? logUpdate(`
        ⠿ read: ${read}
          passed: ${passed}
          diff: ${read - passed}
          remaining: ${(passed / fileSize * 100).toFixed(3)}%
          cpu usage: ~${cpuPercent}
          rss memory: ${elapsedRSSMemory.toFixed(3)} MB
          elapsed time: ${elapsedTime.toFixed(3)} ms
      `)
      : logUpdate(`
        ${spinner[i = ++i % spinner.length]} read: ${read}
          passed: ${passed}
          diff: ${read - passed}
          remaining: ${(passed / fileSize * 100).toFixed(3)}%
          cpu usage: ~${cpuPercent}
          rss memory: ${elapsedRSSMemory.toFixed(3)} MB
          elapsed time: ${elapsedTime.toFixed(3)} ms
      `)
  }
}
