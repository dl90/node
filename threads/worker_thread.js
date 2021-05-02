const { parentPort, workerData, isMainThread } = require('worker_threads')

if (isMainThread) { throw new Error('Its not a worker') }
if (isNaN(workerData)) { throw new Error('Input not a number') }

const start = process.hrtime()
const startMemory = process.memoryUsage().rss

// output
parentPort.postMessage(primeSieve(workerData))

function hrtimeToMS (hrtime) {
  return hrtime[0] * 1_000 + hrtime[1] / 1_000_000
}

function primeSieve (n) {
  const bucket = new Int8Array(n)
  const lim = Math.sqrt(n)

  for (let i = 2; i <= lim; i++)
    if (!bucket[i])
      for (let j = i * i; j < n; j += i) bucket[j] = 1

  const primes = []
  for (let i = 2; i < bucket.length; i++)
    if (!bucket[i]) primes.push(i)

  return {
    range: workerData,
    elapsed_ms: hrtimeToMS(process.hrtime(start)),
    elapsed_mb: (process.memoryUsage().rss - startMemory) / 1_048_576,
    primes
  }
}
