'use strict'

const delegate = require('delegates')

const proto = module.exports = {
  inspect() {
    return this.toJSON()
  },
  toJSON() {
    return {
      request: this.request.toJSON(),
      response: this.response.toJSON(),
      app: this.app.toJSON(),
      originalUrl: this.originalUrl,
      req: '<original node req>',
      res: '<original node res>',
      socket: '<original node socket>'
    }
  }
}

delegate(proto, 'request')
  .method('get')
  .getter('ips')
  .getter('header')

delegate(proto, 'response')