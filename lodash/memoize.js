// _.memoize(func, [resolver])
// 创建一个会缓存`func`结果的函数。如果提供了resolver，就用resolver的返回值
// 作为key缓存函数的结果，默认情况下用第一个参数作为缓存的key，func在调用的
// 时候this会绑定在缓存函数上

function memoize(func, resolver) {
  // func参数需要为 function类型，resolver参数如果不为空的话，也需要function类型
  if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
    throw new TypeError('Expected a function')
  }
  
  var memoized = function() {
    var args = arguments,
        // 直接将传入的函数当做键，如果resolver函数存在的话，就为其绑定缓存的this，然后将其作为key
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache
    
    // 判断缓存Map的键值是否存在，如果已经存在，则返回当前的键
    if (cache.has(key)) {
      return cache.get(key)
    }
    var result = func.apply(this, args)
    memoized.cache = cache.set(key, result) || cache
    return result
  }
  memoized.cache = new (memoized.Cache || MapCache)
  return memoized

}

function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length
  this.clear()
  while(++index < length) {
    var entry = entries[index]
    this.set(entry[0], entry[1])
  }
}
// 从Map缓存中移除所有的键值对
function mapCacheClear() {
  this.size = 0
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash 
  }
}
// 从Map缓存中移除某个元素，这个元素用key来进行标识，并且返回这个被移除的元素
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key)
  this.size -= result ? 1 : 0
  return result
}
// 从Map缓存中获取某个元素的值
function mapCacheGet(key) {
  return getMapData(this, key).get(key)
}
// 判断缓存中是否存在一个键为key的值
function mapCacheHas(key) {
  return getMapData(this, key).has(key)
}
// 设置缓存中的一个元素
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size
  data.set(key, value)
  this.size += data.size == size ? 0 : 1
  return this
}