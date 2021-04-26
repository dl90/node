const fs = require('fs')
const stream = require('stream')
const { createGunzip } = require('zlib')
const logUpdate = require('log-update')

const FILE_PATH = './resource/TinyButMighty.txt.gz'
const startTime = process.hrtime()
const startUsage = process.cpuUsage()
const startMemory = process.memoryUsage().rss
const fileSize = fs.statSync(FILE_PATH).size

/*
  transform stream = duplex stream that modifies chunks mid stream
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
  }

  _read () { }

  _write (chunk, encoding, done) {
    this.push(chunk)
    setTimeout(done, this.delay)
  }

  _final () {
    this.push(null)
  }
}

class FilterByMatch extends stream.Transform {
  constructor (match) {
    super()
    this.match = match
  }

  _transform (chunk, encoding, done) {
    const matches = chunk.toString().match(this.match)?.join(' ') ?? ''
    const buffer = new TextEncoder().encode(matches)
    this.push(buffer)
    done()
  }

  _flush (done) {
    this.push(new TextEncoder().encode('---END---'))
    done()
  }
}

let passed = 0
const runningBuffer = []

const read = fs.createReadStream(FILE_PATH)
const unzip = createGunzip()
const throttle = new Throttle(2)
const filter = new FilterByMatch(/secret([\w]?)+/g)
const collect = new Collect(runningBuffer)
const progress = spin()

read
  .pipe(unzip)
  .pipe(throttle)
  .pipe(filter)
  .pipe(collect)

read
  .on('data', () => {
    progress(read.bytesRead, passed)
  })

filter
  .on('data', chunk => {
    passed += chunk.length
    progress(read.bytesRead, passed)
  })
  .on('close', () => progress(read.bytesRead, passed, true))

collect
  .on('close', () => {
    const buffer = Buffer.concat(runningBuffer)
    console.log(`
      parsed buffer size: ${buffer.length}
    `)
    console.log(new Set(buffer.toString().split(' ')))
  })


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
            remaining: ${(read / fileSize * 100).toFixed(3)}%
            cpu usage: ~${cpuPercent}
            rss memory: ${elapsedRSSMemory.toFixed(3)} MB
            elapsed time: ${elapsedTime.toFixed(3)} ms
        `)
      : logUpdate(`
          ${spinner[i = ++i % spinner.length]} read: ${read}
            passed: ${passed}
            diff: ${read - passed}
            remaining: ${(read / fileSize * 100).toFixed(3)}%
            cpu usage: ~${cpuPercent}
            rss memory: ${elapsedRSSMemory.toFixed(3)} MB
            elapsed time: ${elapsedTime.toFixed(3)} ms
        `)
  }
}
