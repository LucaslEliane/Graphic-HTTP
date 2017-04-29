// 判断一个变量是否为纯净的对象，也就是没有修改过原型。使用Object构造器构造的对象
import isPlainObject from 'lodash/isPlainObject'
// 观察者的Symbol标志，类似Symbol.iterator，但是目前还没有广泛实现
// 所以这里需要polyfill一个Symbol.observable
import $$observable from 'symbol-observable'


// redux内部进行初始化的时候的一个action
export const ActionTypes = {
  INIT: '@@redux/INIT'
}

/**
 * 创建一个store对象，来实现对数据状态的操作
 * 
 * @export
 * @param {any} reducer 所有的reducer
 * @param {any} preloadedState 初始化状态
 * @param {any} enhancer apply的中间件
 */
export default function createStore(reducer, preloadedState, enhancer) {
  // 2个参数、3个参数的转换
  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState
    preloadedState = undefined
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new TypeError('enhancer expected a function')
    }

    return enhancer(createStore)(reducer, preloadedState)
  }

  if (typeof reducer !== 'function') {
    throw new TypeError('reducer expected a function')
  }

  let currentReducer = reducer
  let currentState = preloadedState
  let currentListeners = []
  let nextListeners = currentListeners
  let isDispatching = false

  function ensureCanMutateNextListeners() {
    // 保持当前listeners的一个快照，在dispatch完成之后，才可以将监听器进行推进
    // 也就是在某一次dispatch之前的监听器调用必须是一个稳定的状态，不会有在dispatch
    // 的时候发生注册监听的状况发生
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice()
    }
  }

  function getState() {
    return currentState
  }
  
  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new TypeError('listener expected a function')
    }
    let isSubscribed = true
    ensureCanMutateNextListeners()
    nextListeners.push(listener)

    return function unsubscribe() {
      if (!isSubscribed) {
        return
      }

      isSubscribed = false

      ensureCanMutateNextListeners()
      const index = nextListeners.indexOf(listener)
      nextListeners.splice(index, 1)
    }
  }

  function dispatch(action) {
    if (!isPlainObject(action)) {
      throw new TypeError('action must be a plain object.')
    }
    if (typeof action.type === 'undefined') {
      throw new ReferenceError('action must have an "type" property')
    }
    if (isDispatching) {
      throw new Error('reducers may not dispatch actions')
    }
    // 进行原子操作，防止state同时被两个操作修改
    try {
      isDispatching = true
      currentState = currentReducer(currentState, action)
    } finally {
      isDispatching = false
    }
    // 合并监听器状态以及快照，使用快照来进行监听器的调用
    const listeners = currentListeners = nextListeners
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i]
      listener()
    }

    return action
  }
  
  /**
   * 用来替换当前的reducer
   * 
   * @param {any} nextReducer 
   */
  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== 'function') {
      throw new TypeError('nextReducer expect a function')
    }
    currentReducer = nextReducer
    dispatch({ type: ActionTypes.INIT })
  }
  /**
   * 状态发生变化时候的观察者，当为这个对象注册了一个监听对象之后，其next方法的调用
   * 将会被注册到订阅列表里面。
   * 
   * var obs = store[observable]()
   * var result = []
   * obs.subscribe({
   *   next: function(state) {
   *     result.push(state)
   *   }
   * })
   *
   * store.dispatch({
   *   type: 'ADD_TODO',
   *   text: 'Read the docs'
   * })
   * console.log(result)
   *
   * store.dispatch({
   *   type: 'ADD_TODO',
   *   text: 'continue read the docs'
   * })
   *
   * console.log(result)
   * 
   * @returns 
   */
  function observable() {
    const outerSubscribe = subscribe
    return {
      subscribe(observer) {
        if (typeof observer !== 'object') {
          throw new TypeError('observer expect a object')
        }
        function observeState() {
          if (observer.next) {
            observer.next(getState())
          }
        }
        observeState()
        const unsubscribe = outerSubscribe(observeState)
        return { unsubscribe }
      },
      [$$observable]() {
        return this
      }
    }
  }

  dispatch({ type: ActionTypes.INIT })

  return {
    dispatch,
    subscribe,
    getState,
    replaceReducer,
    [$$observable]: observable
  }
}