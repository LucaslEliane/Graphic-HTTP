function curryLeft(func, ...args) {
  if (typeof func != 'function') {
    throw new TypeError('Expected a function')
  }
  return function(...rightArgs) {
    let argArray = [].concat(args, rightArgs)
    return func.apply(this, argArray)
  }
}
function curryRight(func, ...args) {
  if (typeof func != 'function') {
    throw new TypeError('Expected a function')
  }
  return function(...leftArgs) {
    let argArray = [].concat(leftArgs, args)
    return func.apply(this, argArray)
  }
}