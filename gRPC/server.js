const crypto = require('crypto')
const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')
const todoPackageDef = protoLoader.loadSync('./todo.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
})
const todoPackage = grpc.loadPackageDefinition(todoPackageDef).todo
const server = new grpc.Server();

server.addService(todoPackage.Todo.service, {
  createTodo,
  getTodos,
  encrypt
})
server.bindAsync('localhost:3000', grpc.ServerCredentials.createInsecure(), (err, port) => {
  server.start()
  console.log(`listening on port ${port}`)
});

const memory = [];
function createTodo (call, callback) {
  // console.log(call.metadata)
  const todo = {
    id: memory.length + 1,
    text: call.request.text
  }
  memory.push(todo)
  callback(null, todo)
}

function getTodos (call, callback) {
  const { start, end } = call.request
  const slice = memory.slice(start, end)
  callback(null, { 'items': slice, 'size': memory.length })
}

function encrypt (call) {
  const initVector = crypto.randomBytes(16)
  const cipherKey = crypto.createHash('sha256').update('123456').digest()
  encryptStream = crypto.createCipheriv('aes256', cipherKey, initVector)
  let _id

  encryptStream.on('data', (hash) => {
    call.write({ id: _id++, payload: hash })
  })

  call.on('data', chunk => {
    const { id, payload } = chunk
    if (!_id) _id = id
    encryptStream.write(payload)
  })

  call.on('end', () => {
    encryptStream.end()
    call.end()
  })
}
