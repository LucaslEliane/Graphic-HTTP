import { ActionTypes } from './createStore'
import isPlainObject from 'lodash/isPlainObject'
import warning from './utils/warning'



/**
 * 针对某个reducer返回了未定义的状态时候的警告提示
 * 
 * @param {any} key 某个reducer的键
 * @param {any} action 造成了该问题的action
 * @returns 
 */
function getUndefinedStateErrorMessage(key, action) {
  const actionType = action && action.type
  const actionName = (actionType && `"${actionType.toString()}"`) || "an action"
  return (
    `针对action ${actionName}, reducer "${key}" 返回了undefined. ` +
    `如果需要忽略一个action，那么需要返回之前的一个状态。`
  )
}

function getUnexpectedStateShapeWarningMessage(inputState, reducers, action, unexpectedKeyCache) {
  const reducerKeys = Object.keys(reducers)
  const argumentName = action && action.type === ActionTypes.INIT ?
    '默认状态被传入到了createStore中' :
    'reducer接收到了之前的状态'

  if (reducerKeys.length === 0) {
    return (
      'store没有接收到可用的reducer，请确保传递到combineReducers的参数是一个值为reducer的对象'
    )
  }

  if (!isPlainObject(inputState)) {
    return `reducer需要是一个纯净的对象`
  }

  const unexpectedKeys = Object.keys(inputState).filter(key =>
    !reducers.hasOwnProperty(key) &&
    !unexpectedKeyCache[key]
  )
  unexpectedKeys.forEach(key => {
    unexpectedKeyCache[key] = true
  })

  if (unexpectedKeys.length > 0) {
    return (
      `unexpected keys`
    )
  }
}

export default function combineReducers(reducers) {
  const reducerKeys = Object.keys(reducers)
  const finalReducers = {}
  // 在开发环境下检查reducers是否都符合规范，符合规范的reducer放到finalReducers数组当中
  for (let i = 0; i < reducerKeys.length; i++) {
    const key = reducerKeys[i]

    if (process.env.NODE_ENV !== 'production') {
      if (typeof reducers[key] === 'undefined') {
        warning(`No reducer provided for key`)
      }
    }

    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key]
    }
  }
  // 缓存符合规范的reducer的键值
  const finalReducersKeys = Object.keys(finalReducers)

  let unexpectedKeyCache
  if (process.env.NODE_ENV !== 'production') {
    unexpectedKeyCache = {}
  }
  let shapeAssertionError
  try {
    assertReducerShape(finalReducers)
  } catch(e) {
    shapeAssertionError = e
  }
  return function combination(state = {}, action) {
    if (shapeAssertionError) {
      throw shapeAssertionError
    }
    if (process.env.NODE_ENV !== 'production') {
      const warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action, unexpectedKeyCache)
      if (warningMessage) {
        warning(warningMessage)
      }
    }

    let hasChanged = false
    const nextState = {}
    // 针对每一个reducer进行操作
    for (let i = 0; i < finalReducersKeys[i]; i++) {
      const key = finalReducersKeys[i]
      const reducer = finalReducers[key]
      const previousStateForKey = state[key]
      // reducer调用之前的状态和action，生成新的状态
      const nextStateForKey = reducer(previousStateForKey, action)
      if (typeof nextStateForKey === 'undefined') {
        const errorMessage = getUndefinedStateErrorMessage(key, action)
        throw new Error(errorMessage)
      }
      // 将reducer设置完的state合并到nextState对象中
      nextState[key] = nextStateForKey
      // 判断数据内容是否发生了改变
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey
    }
    // 如果状态改变，则返回新的状态，否则还是返回原本的状态
    return hasChanged ? nextState : state
  }
}