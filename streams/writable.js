const fs = require('fs')
const { createGzip } = require('zlib')
const logUpdate = require('log-update')

/* highWaterMark sets stream buffer size (memory usage) */
const vidStream = fs.createReadStream('./resource/powder-day.mp4', { highWaterMark: 4 * 1024 })
const writeStream = fs.createWriteStream(vidStream.path + '-copy.mp4.gz', { highWaterMark: 4 * 1024 })
const readStreamSize = fs.statSync(vidStream.path).size
const gzip = createGzip()

const progress = (read, zipped, write) => {
  logUpdate(`
    read:         ${(read / readStreamSize * 100).toFixed(4)} %
    zipped:       ${zipped}
    compressed:   ${(write / readStreamSize * 100).toFixed(4)} %
  `)
}

vidStream
  // .pipe(writeStream)
  .on('error', error => process.stderr.write(error))

gzip
  .on('error', error => process.stderr.write(error))

writeStream
  .on('error', error => process.stderr.write(error))
  .on('close', () => process.stdout.write('----------Done----------\n\n'))

/*
  back-pressure:
    read stream outpaces output stream
    may use excessive memory if highWaterMark is set improperly, default: 16kb (16 * 1024)
*/

vidStream
  .on('data', chunk => {
    const status = gzip.write(chunk)
    progress(vidStream.bytesRead, gzip.bytesWritten, writeStream.bytesWritten)

    /* pauses read stream if gzip stream buffer capacity is full */
    if (!status) vidStream.pause()
  })
  .on('close', () => gzip.end())

gzip
  .on('data', chunk => {
    const status = writeStream.write(chunk)
    progress(vidStream.bytesRead, gzip.bytesWritten, writeStream.bytesWritten)
    if (!status) gzip.pause()
  })
  /* resumes paused read stream once write stream is ready */
  .on('drain', () => {
    vidStream.resume()
    progress(vidStream.bytesRead, gzip.bytesWritten, writeStream.bytesWritten)
  })
  .on('close', () => writeStream.end())

writeStream
  .on('drain', () => {
    gzip.resume()
    progress(vidStream.bytesRead, gzip.bytesWritten, writeStream.bytesWritten)
  })
