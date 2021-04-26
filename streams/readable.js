const fs = require('fs')
const stream = require('stream')

const arr = 'As an asynchronous event-driven JavaScript runtime, Node.js is designed to build scalable network applications. In the following "hello world" example, many connections can be handled concurrently. Upon each connection, the callback is fired, but if there is no work to be done, Node.js will sleep.'.split(' ')

class CustomArrayStream extends stream.Readable {
  constructor (array) {
    super()
    this.array = array
    this.index = 0
  }

  _read () {
    if (this.index > this.array.length) this.push(null)
    else {
      const chunk = this.array[this.index]
      this.push(chunk)
      this.index += 1
    }
  }
}

// const stream = new CustomArrayStream(arr)
// stream.on('data', chunk => console.log(chunk.toString()))
// stream.on('end', () => console.log('\nDone\n'))

const vidStream = fs.createReadStream('./resource/powder-day.mp4')
vidStream
  .on('data', chunk => console.log(chunk))
  .on('error', error => console.log(error))
  .on('end', () => console.log('\nFinished\n'))
  .pause() /* non flowing mode */

process.stdin.on('data', chunk => {
  /* read next chunk */
  vidStream.read()

  /* flowing mode */
  if (chunk.toString().trim() === 'all') vidStream.resume()
})
process.stdin.on('close', () => console.log(inputs))
