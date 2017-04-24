// const EventEmitter = require('events')

// class MyEventEmitter extends EventEmitter {
//   constructor() {
//     super()
//   }
// }

// var myEventEmitter = new MyEventEmitter()

// myEventEmitter.on('log', () => {
//   console.log('Trigger a new event')
// })

// myEventEmitter.emit('log')

// const http = require('http')

// const server = http.createServer((req, res) => {
//   console.log(`request: ${JSON.stringify(req.headers)}`);
//   res.statusCode = 200
//   res.end("okay")
// })

// server.listen(3000)

const Koa = require('koa')
koa = new Koa()

koa.use(function *() {
  this.body = `${JSON.stringify(this)}`
})

koa.listen(50000)