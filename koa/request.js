'use strict'

const only = require('only')

module.exports = {
  get header() {
    console.log(this)
    return this.req.headers
  },
  /**
   * 获取ip的getter方法
   */
  get ips() {
    const proxy = this.app.proxy
    const val = this.get('X-Forwarded-For')
    return proxy && val
      ? val.split(/\s*,\s*/)
      : [] 
  },

  /**
   * 获取请求头的相应首部字段的值，对于referrer字段需要特殊处理，
   * 该字段可以有两种引用方式
   * 
   * @param {any} field 需要获取内容的字段名
   * @returns 相应的首部字段值
   */
  get(field) {
    const req = this.req
    switch (field = field.toLowerCase()) {
      case 'referer':
      case 'referrer':
        return req.headers.referrer || req.headers.referer || ''
      default:
        return req.headers[field] || ''
    }
  },
  toJSON() {
    return only(this, [
      'method',
      'url',
      'header'
    ])
  }
}