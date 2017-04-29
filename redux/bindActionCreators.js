import warning from './utils/warning'

function bindActionCreator(actionCreator, dispatch) {
  return (...args) => dispatch(actionCreator(...args))
}

/**
 * 如果不希望子组件知道Redux的存在，只提供给子组件一个封装好action和dispatch
 * 的函数的时候，可以使用这个函数。
 * 
 * 是dispatch(action(...args))一个隐藏了dispatch的封装，封装完之后可以直接
 * bindResult(...args)进行调用
 * 
 * @export
 * @param {any} actionCreators 如果是函数，表示只有一个action，对象表示多个action
 * @param {any} dispatch 
 * @returns 
 */
export default function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch)
  }
  if (typeof actionCreators !== 'object' || actionCreators === null) {
    throw new TypeError(
      `bindActionCreators expected an object or a function.`
    )
  }

  const keys = Object.keys(actionCreators)
  const boundActionCreators = {}
  // 遍历每个actionCreator，如果元素为function，那么就对其进行绑定
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const actionCreator = actionCreators[key]
    if (typeof actionCreator === 'function') {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch)
    } else {
      warning(`bindActionCreators expected a function actionCreator for key ${key}`)
    }
  }
  return boundActionCreators
}