

const Emitter = require('events')
// const context = require('./context')
// const request = require('./request')
// const response = require('./response')
const debug = require('debug')('koa:application')
const http = require('http')

class Application extends Emitter {
  constructor() {
    super()

    this.proxy = false
    this.middleware = []
    this.subdomainOffset = 2
    this.env = process.env.NODE_ENV || 'development'
    // this.context = Object.create(context)
    // this.request = Object.create(request)
    // this.response = Object.create(response)
  }

  listen(...args) {
    debug('listen')
    const server = http.createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/plain' })
      res.end('okay')
    })
    console.log('nodejs server is running in port: 3000')
    return server.listen(...args)
  }
}

var koa = new Application()
koa.listen(3000)

