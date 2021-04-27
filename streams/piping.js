const { createReadStream, createWriteStream } = require('fs')
const { createGzip, createGunzip } = require('zlib')
const { pipeline } = require('stream')
const { pipeline: pipelinePromise } = require('stream/promises')
const { promisify } = require('util')

/*
  pipe automatically handles
  - errors
  - end-of-files
  - back pressure
*/

const pipe = promisify(pipeline)

async function zip (inputFilePath, outputFilePath) {
  const gzip = createGzip()
  const input = createReadStream(inputFilePath)
  const output = createWriteStream(outputFilePath)
  await pipe(input, gzip, output).catch(console.log)
}

async function pipelineP (inputFilePath) {
  const input = createReadStream(inputFilePath)
  const unzip = createGunzip()
  await pipelinePromise(input, unzip, process.stdout).catch(console.log)
}

async function unzipToStdout (inputFilePath) {
  const input = createReadStream(inputFilePath)
  const unzip = createGunzip()
  input.pipe(unzip).pipe(process.stdout)
}

// zip('./TinyButMighty.txt', './TinyButMighty.txt.gz').catch(console.log)
// unzipToStdout('./resource/TinyButMighty.txt.gz')
// pipelineP('./resource/TinyButMighty.txt.gz')
