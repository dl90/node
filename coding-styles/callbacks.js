/*
  convention

  functions accepting callbacks has the callback as the last argument
  first argument for the callback function is the error

  ```js
  function readJSON (filename, callback) {
    readFile(filename, 'utf8', (err, data) => {
      let parsed
      if (err) {
        // propagate the error and exit the current function
        return callback(err)
      }

      try {
        parsed = JSON.parse(data)
      } catch (err) {
        return callback(err)
      }

      callback(null, parsed)
    })
  }
  ```
    - synchronous errors are propagated with throw
    - asynchronous errors are passed to the callback as the first argument
    - synchronous errors in asynchronous functions are handled with try catch
    - the callback should not be called in a try catch block
*/

// synchronous continuation passing style
function foo (x, y, cb) {
  cb(null, x + y)
}

// asynchronous continuation passing style
function bar (x, y, cb) {
  setTimeout(() => cb(null, x + y), 100)
  console.log('returned')
}

/*
  problems can occur if synchronous is mixed with asynchronous
  best to stick with one or the other

  also, if the function is synchronous, direct return style is preferred over CPS
*/
function foobar (x, y, cache, cb) {

  // synchronous
  if (cache.has([x, y].toString()))
    cb(null, cache.get([x, y].toString()))

  else {
    setTimeout(() => {
      const res = x + y
      cache.set([x, y].toString(), res)
      cb(null, res)
    }, 0)
  }
}

function foobarAsync (x, y, cache, cb) {

  if (cache.has([x, y].toString()))
    process.nextTick(() => cb(null, cache.get([x, y].toString())))

  else {
    setTimeout(() => {
      const res = x + y
      cache.set([x, y].toString(), res)
      cb(null, res)
    }, 0)
  }
}

function problem (x, y, cache) {
  const listeners = []

  /*
    problem here is callback is called before listeners are attached
    b/c if x and y exist in the cache, it is synchronous and the cb is called immediately
  */
  const sync = () =>
    foobar(x, y, cache, (err, res) =>
      listeners.forEach(listener => listener(null, res))
    )

  /*
    with async, we are guaranteed a chance to attach listeners before the callback is called
  */
  const async = () =>
    foobarAsync(x, y, cache, (err, res) =>
      listeners.forEach(listener => listener(null, res))
    )

  // sync()
  async()
  return {
    addListener: cb => listeners.push(cb)
  }
}

const cache = new Map()
  // foo(1, 2, console.log)
  // bar(1, 2, console.log)
  // setTimeout(() => foobar(2, 2, cache, console.log), 100)
  // setTimeout(() => foobar(3, 2, cache, console.log), 100)
  ;

(() => {
  const p1 = problem(4, 2, cache)
  p1.addListener((err, res) => {
    console.log('listener 1', res)

    setTimeout(() => {
      const p2 = problem(4, 2, cache)
      p2.addListener((err, res) => console.log('listener 2', res))
    }, 1)
  })
})
  // ()
  ;


/*
  Timers: setImmediate vs process.nextTick, setImmediate is preferred

  - setImmediate cb function is called after existing I/O calls in the event queue
  - process.nextTick cb function is placed at the head of the event queue and is called immediately after current function ends
      almost as fast as synchronous, blocks I/O (I/O starvation)

  event loop queue
  - setImmediate: [call1, call2, setImmediate]
  - process.nextTick: [process.nextTick, call1, call2]
*/
(() => {
  let num = 0
  console.log('existing sync I/O\n')

  setTimeout(() => console.log('existing async I/O 1'), 0)
  setImmediate(() => console.log('setImmediate, called after'))

  setTimeout(() => console.log('existing async I/O 2'), 0)
  process.nextTick(() => console.log('processes.nextTick, called before other existing async calls'))
  setTimeout(() => console.log('existing async I/O 3'), 0)

  // num incremented after
  for (let i = 0; i < 42; i++)
    setImmediate(() => num++)

  process.nextTick(() => console.log(num))
  setTimeout(() => console.log(num), 42)
})
  // ()
  ;


/*
  setTimeout(fn, 0) behaves similar to setImmediate but the call happens after an event loop cycle
  whereas setImmediate is called after existing I/O calls in the event queue (if any), but before a new event loop cycle
*/
(() => {
  let num = 0

  function recur () {
    setTimeout(() => console.log('timeout', num), 0)
    setImmediate(() => console.log('immediate', num))

    setTimeout(() => {
      setTimeout(() => console.log('*** timeout', num), 0)
      setImmediate(() => console.log('*** immediate', num))

      if (++num < 3)
        recur()
    }, 0)
  }

  recur()
})
  // ()
  ;
