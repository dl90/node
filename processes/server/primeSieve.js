const queue = new Map()

process.on('message', msg => {
  const { id, data } = msg
  queue.set(id, data)
})

setInterval(() => {
  if (queue.size) {
    const [id, data] = queue.entries().next().value
    const primes = primeSieve(data)
    queue.delete(id)
    process.send({ id, primes })
  }
}, 10)

function hrtimeToMS (hrtime) {
  return hrtime[0] * 1000 + hrtime[1] / 1_000_000
}

function primeSieve (n) {
  const start = process.hrtime()
  const bucket = new Int8Array(n)
  const lim = Math.sqrt(n)

  for (let i = 2; i <= lim; i++) {
    if (!bucket[i])
      for (let j = i * i; j < n; j += i) bucket[j] = 1
  }

  const primes = []
  for (let i = 2; i < bucket.length; i++) {
    if (!bucket[i]) primes.push(i)
  }

  return {
    time_ms: hrtimeToMS(process.hrtime(start)),
    primes
  }
}
