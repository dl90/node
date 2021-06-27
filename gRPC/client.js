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

// stub
const client = new todoPackage.Todo('localhost:3000', grpc.credentials.createInsecure())

const payload = {
  id: -1,
  text: 'test'
}

function create () {
  client.createTodo(payload, (err, res) => {
    if (err !== null) console.error(err)
    console.log(res)
  })
}

function read () {
  client.getTodos({ start: 0, end: 10 }, (err, res) => {
    console.log(res)
  })
}

function encrypt (message) {
  const chunks = message.split(' ').map((payload, id) => ({ id: id + 1, payload }))

  const stream = client.encrypt()
  chunks.forEach(chunk => stream.write(chunk))

  stream.on('data', data => {
    console.log(data)
  })
  stream.end()
}

// create()
// read()
encrypt('testtesttest1 testtesttest2 testtesttest3 testtesttest4 testtesttest5')
