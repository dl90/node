const stream = require('stream')

/**
 * Write stream that collects to a buffer
 * @constructor (runningBuffer)
 * @extends stream.Writable
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

/**
 * Duplex stream that throttles
 * @constructor (ms)
 * @extends stream.Duplex
 */
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


module.exports = { Collect, Throttle }
