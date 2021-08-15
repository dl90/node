/*
  a subject notifies a set of observers when a changes occurs

  EventEmitter allows you to register and emit events
*/
import { EventEmitter } from 'events'

(() => {
  const fooEvent = new EventEmitter()
  const listener = console.log

  fooEvent
    .on('foo', listener)
    .on('error', console.error)
    .once('bar', listener)

  fooEvent.emit('foo', 'bar')
  fooEvent.emit('bar', 'baz')
  fooEvent.emit('bar', 'nothing')
  fooEvent.emit('error', new Error('oops'))

  // unreleased listeners can lead to memory leaks, it's referenced and will not GC
  fooEvent.removeListener('foo', listener)
  fooEvent.emit('foo', 'nothing')
  fooEvent.setMaxListeners(3)
})
// ()


// observable class
class Example extends EventEmitter {
  constructor () {
    super()
  }

  add (x, y) {
    if (isNaN(x) || isNaN(y))
      return this.emit('error', new Error('NaN arg'))

    this.emit('add', x + y)
    return this
  }

  divide (x, y) {
    if (isNaN(x) || isNaN(y))
      return this.emit('error', new Error('NaN arg'))

    if (y === 0)
      return this.emit('error', new Error('divide by zero'))

    this.emit('divide', x / y)
    return this
  }
}

(() => {
  const example = new Example()
  example
    .on('add', console.log)
    .on('divide', console.log)

  try {
    example
      .add(1, 1)
      .divide(1, 1)
      .divide(1, 0)
  } catch (err) {
    console.error(err)
  }
})
// ()

class AsyncEvent extends EventEmitter {
  constructor () {
    super()
  }

  add (x, y, cb) {
    if (isNaN(x) || isNaN(y))
      setImmediate(() => {
        console.log(this)
        return this.emit('error', new Error('NaN arg'))
      })

    const ref = setInterval(() => {
      this.emit('processing', `processing ${x} + ${y}`)
    }, 500)

    setTimeout(() => {
      clearInterval(ref)
      this.emit('add', x + y)
      return this
    }, 1000)
  }

  divide (x, y) {
    if (isNaN(x) || isNaN(y))
      setImmediate(() => {
        return this.emit('error', new Error('NaN arg'))
      })

    if (y === 0)
      setImmediate(() => {
        return this.emit('error', new Error('divide by zero'))
      })

    const ref = setInterval(() => {
      this.emit('processing', `processing ${x} / ${y}`)
    }, 500)

    setTimeout(() => {
      clearInterval(ref)
      this.emit('divide', x / y)
      return this
    }, 2000)
  }
}

(() => {
  const asyncExample = new AsyncEvent()
  try {

    // you can register listeners even after calls, as the calls happen in the next event loop tick
    asyncExample.add(3, 7)
    asyncExample.divide(4, 2)
    setTimeout(() => {
      asyncExample.divide(1, 0)
    }, 3000)

    asyncExample
      .on('add', console.log)
      .on('divide', console.log)
      .on('processing', console.log)

  } catch (err) {
    console.error(err)
  }
})
  ()
