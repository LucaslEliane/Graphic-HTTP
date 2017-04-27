function memorized(func, resolver) {
  if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
    throw new TypeError('Expected a function')
  }
  let memorize = function(...args) {
    let result = func.apply(this, args)
    if (!memorize.cache) {
      memorize.cache = new Map()
    }
    resolver ? memorize.cache.set(resolver.apply(this), result) : memorize.cache.set(func, result)
    return result
  }
  return memorize
}