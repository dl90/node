const path = require('path')
const { Worker } = require('worker_threads')

/*
  Node.js has two kinds of threads:
  - main thread for for the event loop
  - worker pool threads

  main thread can be blocked when executing cpu intensive ops, blocking event loop as well
  worker pool spawns and handles new threads to synchronously perform tasks and return results to the main thread
  - libraries such as fs and crypto uses this (but not readFileSync or similar calls)

  compared to child processes (clusters), worker threads are more light weight and shares the same PID as its parent
  Worker threads also shares memory with its parent, avoiding data serialization for transport

  it's better to keep a worker running and pass it data as needed than spawning new workers (worker pool)
  generally not beneficial for I/O heavy ops
*/

setInterval(() => {
  console.log('tick, not blocked')
}, 200)

function call (workerData) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.resolve('./worker_thread.js'), { workerData })
    worker.on('online', () => console.log('\tparsing completed, starting execution on ', worker.threadId))

    // fired when worker sends data to parent thread
    worker.on('message', resolve)
    worker.on('error', reject)
    worker.on('exit', code => {
      if (code === 0) return null
      return reject(new Error(`Worker has stopped with code ${code}`))
    })
  })
}

const startMemory = process.memoryUsage().rss
const inputs = Array.from({ length: 20 }, (_, i) => (i + 1) * 2_000_000)

Promise.all(inputs.map(v => call(v)))
  .then(v => {
    console.log(
      v.map(v => { return { ...v, primes: v.primes.length } })
    )

    console.log('post thread memory: ' + (process.memoryUsage().rss - startMemory) / 1_048_576)
  })
  .catch(console.log)
