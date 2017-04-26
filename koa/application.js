

const Emitter = require('events')
const context = require('./context')
const request = require('./request')
const response = require('./response')
const debug = require('debug')('koa:application')
const http = require('http')
const compose = require('koa-compose')
const Cookies = require('cookies')
const isGeneratorFunction = require('is-generator-function')
const convert = require('koa-convert')
const deprecate = require('depd')('koa')
const statuses = require('statuses')

class Application extends Emitter {
  constructor() {
    super()

    this.proxy = false
    this.middleware = []
    this.subdomainOffset = 2
    this.env = process.env.NODE_ENV || 'development'
    this.context = Object.create(context)
    this.request = Object.create(request)
    this.response = Object.create(response)
  }

  /**
   * 开启服务器监听的方法，传入的参数和原本的Server.listen方法相同
   * 
   * @param {any} args 创建服务器监听所需要的全部参数
   * @returns Server
   * 
   * @memberOf Application
   */
  listen(...args) {
    debug('listen')
    const server = http.createServer(this.callback())
    console.log('create the server')
    return server.listen(...args)
  }
  use(fn) {
    if (typeof fn !== 'function')
      throw new TypeError('middleware must be a function!')
    if (isGeneratorFunction(fn)) {
      deprecate('Support for generators will be removed in v3. ' +
                'See the documentation for examples of how to convert old middleware ' +
                'https://github.com/koajs/koa/blob/master/docs/migration.md')
      fn = convert(fn)
    }
    debug('use %s', fn._name || fn.name || '-')
    this.middleware.push(fn)
    return this
  }
  callback() {
    // 用于组合中间件数组
    const fn = compose(this.middleware)
    // 返回一个error事件监听器数组的副本，如果长度不为0，则将这个数组全部注册到应用上
    if (!this.listeners('error').length)
      this.on('error', this.onerror)

    /**
     * 传入到createServer方法里面的参数函数，这个函数将会被挂到request事件的队列中
     * @param {*} req 请求对象
     * @param {*} res 响应对象
     */
    const handleRequest = (req, res) => {
      res.statusCode = 404
      const ctx = this.createContext(req, res)
     const onerror = err => ctx.onerror(err)
     const handleResponse = () => response(ctx)
     onFinished(res, onerror)
     return fn(ctx).then(handleResponse).catch(onerror)
      return fn(ctx)
    }

    return handleRequest
  }

  /**
   * 创建上下文对象，也就是Koa中的ctx对象
   * 
   * @param {any} req 请求对象
   * @param {any} res 响应对象
   * 
   * @memberOf Application
   */
  createContext(req, res) {
    const context = Object.create(this.context)
    // 将请求和响应对象挂载到context上下文对象中
    const request = context.request = Object.create(this.request)
    const response = context.response = Object.create(this.response)
    // 互相绑定三个共享对象，应用、请求、响应
    context.app = request.app = response.app = this
    context.req = request.req = response.req = req
    context.res = request.res = response.res = res

    request.ctx = response.ctx = context
    request.response = response
    response.request = request
    // 请求原始地址写入到上下文对象当中
    context.originalUrl = request.originalUrl = req.url
    /**
     * 新建一个cookies对象，绑定到上下文对象中。
     * 对象中的两个参数分别指明是否仅在HTTPS中发送cookies以及cookies的密钥
     */
    context.cookies = new Cookies(req, res, {
      keys: this.keys,
      secure: request.secure
    })
    request.ip = request.ips[0] || req.socket.remoteAddress || ''
    // context.accept = request.accept = accepts(req)
    context.state = {}
    return context
  }
}

function respond(ctx) {
  if (false === ctx.respond)
    return
  const res = ctx.res
  if (!ctx.writable)
    return
  let body = ctx.body
  const code = ctx.status
  // statuses.empty，判断传入的状态码，如果状态码对应的响应不需要
  // body部分的话，那么就将body设置为空，然后将响应发送出去
  if (statuses.empty[code]) {
    ctx.body = null
    return res.end()
  }
  // 判断请求方法是HEAD的情况下，手动计算body部分的长度？
  if ('HEAD' == ctx.method) {
    if (!res.headerSent && isJSON(body)) {
      ctx.length = Buffer.byteLength(JSON.stringify(body))
    }
    return res.end()
  }
  // 除了上面两种情况外，针对于body部分值未设置情况的处理
  if (null == body) {
    body = ctx.message || String(code)
    if (!res.headerSent) {
      ctx.type = 'text'
      ctx.length = Buffer.byteLength(body)
    }
  }
  // 最后针对三种不同类型的body进行处理，分别是Buffer、string、Stream
  if (Buffer.isBuffer(body)) return res.end(body)
  if ('string' == typeof body) return res.end(body)
  if (body instanceof Stream) return body.pipe(res)
  // 除了上面的特殊情况，针对body的处理过程
  body = JSON.stringify(body)
  if (!res.headerSent) {
    ctx.length = Buffer.byteLength(body)
  }
  res.end(body)
}

var koa = new Application()

koa.use(function *() {
  
})

koa.listen(3000)

