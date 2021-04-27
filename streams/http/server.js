const http = require('http')
const fs = require('fs')
const util = require('util')
const multiparty = require('multiparty')

const FILE_NAME = '../resource/powder-day.mp4'

const serveVideo = async (req, res) => {

  const info = util.promisify(fs.stat)
  const { size } = await info(FILE_NAME)

  if (req.headers.range) {
    let [start, end] = req.headers.range.slice(6).split('-')
    start = +start
    end = end ? +end : size - 1

    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Accept-Range': 'bytes',
      'Content-Length': end - start + 1,
      'Content-Type': 'video/mp4'
    })
    fs.createReadStream(FILE_NAME, { start, end }).pipe(res)

  } else {
    res.writeHead(200, {
      'Content-Type': 'video/mp4',
      'Content-Length': size
    })
    fs.createReadStream(FILE_NAME).pipe(res)
  }
}

http.createServer((req, res) => {
  if (req.url === '/video') serveVideo(req, res)
  if (req.url === '/' && req.method === 'POST') {
    const form = new multiparty.Form()
    form.parse(req)
    form
      .on('part', part => {
        part.pipe(fs.createWriteStream(`./${part.filename}`))
      })
      .on('close', () => {
        res
          .writeHead(200, { 'Content-Type': 'text/html' })
          .end(`Success: ${part.filename} uploaded`)
      })
  }
  if (req.url === '/' && req.method === 'GET') {
    res
      .writeHead(200, { 'Content-Type': 'text/html' })
      .end(`
      <form enctype='multipart/form-data' method='POST' action='/'>
        <input type='file' name='upload-file' />
        <input type='submit' value='Upload'/>
      </form>`
      )
  }

}).listen(4040, () => console.log('http://localhost:4040'))
