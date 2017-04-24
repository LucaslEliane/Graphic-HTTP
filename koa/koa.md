## Koa源码

Koa是基于nodejs的一个服务端框架，其与express非常相似，但是少了许多的模块，这些模块都要以中间件的形式加载进去，也就是一个简化版的express框架，该框架的2.0+版本已经支持了ES6标准中的`generator`函数，而在其3.0+的版本上更是已经预支持了`async`的异步方法，这一点上比express更加具有前瞻性。

其代码主要分为4个部分：

1. request.js：主要是针对req对象，也就是nodeJS里面的请求对象的封装。
2. response.js：主要是针对res对象，也就是nodeJS里面的响应对象的封装。
3. context.js：这一个部分是Koa的ctx对象的封装，`ctx`对象在koa2中需要使用`this`来进行引用，而在koa3中可以直接通过`ctx`对象来进行引用。
4. application.js：这部分也是Koa的核心部分，包括服务器创建操作和中间件调用以及body处理的相关操作。

```
// koa2
app.use(function *() {
  this.end()
})
// koa3
app.use(async function(ctx) {
  ctx.end()
})
```

## application.js

代码的核心部分`application`也大致可以分为三个部分，在初始化Koa框架的时候，Koa会进行一次参数初始化操作。这部分操作比较简单。第二个部分是`app.use`，通过将中间件整合到得到请求和发送响应这一过程的中间，对于请求进行处理，并且产生相应的`response`，第三个部分是监听，也就是调用`app.listen`方法时候的操作，这一个部分实现了比较多的处理功能。

### app.use

```
use(fn) {
  if (typeof fn !== 'function')
    throw new TypeError('middleware must be a function!')
  // .....
  this.middleware.push(fn)
  return this
}
```

其实这一部分也没有实现什么操作，也仅仅是将中间件注入到中间件数组当中，等待后面的调用，并且返回当前对象，来实现中间件的链式调用。真正的中间件调用是在`request`事件触发的回调函数中进行处理。

```
// 在这里面进行中间件调用
const server = http.createServer(this.callback())
```

### 创建监听以及事件回调

这个部分的代码是最核心的部分，但是也比较容易看懂。

在调用了`app.listen()`方法之后，nodeJS服务器被启动，然后许多的逻辑也都被注册到了收到请求和响应的中间，也就是`request`事件触发之后的回调逻辑中。

```
// 针对于listen事件进行类似于原生NodeJS的函数封装
listen(...arg) {
  debug('listen')
  const server = http.createServer(this.callback)
  return server.listen(...args)
}
```
在`callback`回调函数中进行了大部分的内容处理，返回了一个对于上下文和中间件以及响应内容进行处理的函数

```
callback() {
  // compose函数针对于Koa的中间件进行嵌套调用，返回一个最外层的
  // 中间件嵌套函数
  const fn = compose(this.middleware)
  // 如果存在错误处理的回调函数，则对其进行注册
  if (!this.listener('error').length)
    this.on('error', this.onerror)
  
  const handleRequest = (req, res) => {
    // 设置默认的状态码，在默认情况下状态码的404
    res.statusCode = 404
    // 合并请求和响应对象，将其合并成为`context`对象
    const ctx = this.createContext(req, res)
    const onerror = err => ctx.onerror(err)
    const handleResponse = () => respond(ctx)
    onFinished(res, onerror)
    // 执行所有的中间件内容，之后调用对于响应的处理函数
    return fn(ctx).then(handleResponse).catch(onerror)
  }
  // 返回过程回调函数，这个回调函数涉及的过程基本上就是Koa对于
  // 请求和响应所有的处理过程了
  return handleRequest
}
```