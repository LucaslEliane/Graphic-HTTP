const EventEmitter = require('events')

class MyEventEmitter extends EventEmitter {
  constructor() {
    super()
  }
}

var myEventEmitter = new MyEventEmitter()

myEventEmitter.on('log', () => {
  console.log('Trigger a new event')
})

myEventEmitter.emit('log')