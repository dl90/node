const fs = require('fs')
const stream = require('stream')
const { createGunzip } = require('zlib')

const { spin } = require('./util/spin.js')
const { Throttle, Collect } = require('./util/customStreams.js')

const FILE_PATH = './resource/TinyButMighty.txt.gz'
const startTime = process.hrtime()
const startUsage = process.cpuUsage()
const startMemory = process.memoryUsage().rss
const fileSize = fs.statSync(FILE_PATH).size


/*
  transform stream = duplex stream that modifies chunks mid stream
*/

class FilterByMatch extends stream.Transform {
  constructor (match) {
    super()
    this.match = match
  }

  /*
    here read and write are combined with
    - chunk representing data coming in
    - this.push(buffer) representing data going out
  */
  _transform (chunk, encoding, done) {
    const matches = chunk.toString().match(this.match)?.join(' ') ?? ''
    const buffer = new TextEncoder().encode(matches)
    this.push(buffer)
    done()
  }

  /*
    called when no more data is to be consumed, but before end event
  */
  _flush (done) {
    // push buffer of text
    // this.push(new TextEncoder().encode(' ---END---'))
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
const progress = spin(startTime, startUsage, startMemory, fileSize)

try {
  read
    .pipe(unzip)
    .pipe(throttle)
    .pipe(filter)
    .pipe(collect)
} catch (error) {
  console.log(error)
  process.abort(123)
}

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

    const deduped = new Set(buffer.toString().split(' '))
    const str = Array.from(deduped).sort((a, b) => {
      if (a.length !== b.length) return a.length - b.length
      for (let i = 0; i < a.length; i++) {
        if (a.charCodeAt(i) === b.charCodeAt(i)) continue
        return a.charCodeAt[i] - b.charCodeAt[i]
      }
    }).join('\n')
    const output = fs.createWriteStream('./resource/pw.txt')

    // create readable stream
    stream.Readable.from(str).pipe(output)
  })
