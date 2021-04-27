const fs = require('fs')
const zlib = require('zlib')
const crypto = require('crypto')

const { spin } = require('./util/spin.js')

const PASSWORD = 'Hunter2'
const FILE_PATH = './resource/pw.txt'

const startTime = process.hrtime()
const startUsage = process.cpuUsage()
const startMemory = process.memoryUsage().rss
// const fileSize = fs.statSync(FILE_PATH).size

const progress = spin(startTime, startUsage, startMemory, 1)

/*
  openssl list -cipher-algorithms
*/

const hashPW = password => crypto.createHash('sha256').update(password).digest()

function encrypt (password, filePath) {
  return new Promise((resolve, reject) => {
    try {
      const initVector = crypto.randomBytes(16)
      const cipherKey = hashPW(password)

      const fileStream = fs.createReadStream(filePath)
      const zipStream = zlib.createGzip()
      const encryptStream = crypto.createCipheriv('aes256', cipherKey, initVector)
      const outStream = fs.createWriteStream(filePath + '.enc')

      /* initVector included in file, prepended to outStream */
      outStream.write(initVector)

      fileStream
        .pipe(encryptStream)
        .pipe(zipStream)
        .pipe(outStream)
        .on('finish', () => resolve(outStream.path))

    } catch (error) {
      reject(error)
    }
  })
}

function decrypt (password, filePath) {
  return new Promise((resolve, reject) => {
    let initVector

    try {
      const initVectorStream = fs.createReadStream(filePath, { end: 15 })

      /* parses initVector in first 16 bit of file */
      initVectorStream.on('data', chunk => initVector = chunk)
      initVectorStream.on('close', () => {
        const cipherKey = hashPW(password)

        const fileStream = fs.createReadStream(filePath, { start: 16 })
        const unzipStream = zlib.createGunzip()
        const unEncryptStream = crypto.createDecipheriv('aes256', cipherKey, initVector)
        const outStream = fs.createWriteStream(filePath.slice(0, filePath.length - 4) + '.unenc')

        fileStream
          .pipe(unzipStream)
          .pipe(unEncryptStream)
          .pipe(outStream)
          .on('finish', () => resolve(outStream.path))
      })

    } catch (error) {
      reject(error)
    }
  })
}

run()

async function run () {
  progress(0, 0)
  const encryptedPath = await encrypt(PASSWORD, FILE_PATH)
  await decrypt(PASSWORD, encryptedPath)
  progress(1, 1, true)
}
