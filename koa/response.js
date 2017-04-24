'use strict'
// 返回一个对象的在白名单列表中的属性值
const only = require('only')

module.exports = {
  toJSON() {
    return only(this, [
      'status',
      'message',
      'header'
    ])
  }
}