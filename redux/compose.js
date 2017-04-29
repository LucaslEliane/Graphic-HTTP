
/**
 * 从左至右将函数合成为一个嵌套调用的函数，用于组合redux的enhancers
 * 为何使用这种迭代的方式进行调用，这和redux调用middleware 的方式有关
 * 一般的redux middleware（未柯里化之前的样子）：
 * 
 * function logger(store) {
 *    return function (next) {
 *      return function (action) {
 *        console.log('dispatching ', action)
 *        let result = next(action)
 *        console.log('next state ', store.getState())
 *        return result
 *      }
 *    }
 * }
 * 
 * 调用：middleware.forEach(middleware => dispatch = middleware(store)(dispatch))
 * 
 * 中间件每次调用到next(action)的时候，都会陷入下一层嵌套，而next参数表示
 * 下一层嵌套的封装好的dispatch函数，原来的dispatch函数被层层包裹起来，每
 * 一层实现一个功能，这个方法有点类似于express的中间件，但是与express中间
 * 件的串行处理还是有点点不同，但是也是处理的是数据从action出发一直到reducer
 * 之间的状态。
 * 
 * @export
 * @param {any} funcs 
 * @returns 
 */
export default function compose(...funcs) {
  // 如果没有任何一个函数，那么使用默认的函数，对于传入的参数原样返回
  if (funcs.length === 0) {
    return arg => arg
  }
  // 如果有一个函数，直接返回这个函数
  if (funcs.length === 1) {
    return funcs[0]
  }
  // 多个函数要进行迭代调用
  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}