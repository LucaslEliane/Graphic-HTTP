export default function applyMiddleware(...middlewares) {
  return (createStore) => (reducer, preloadedState, enhancer) => {
    const store = createStore(reducer, preloadedState, enhancer)
    let dispatch = store.dispatch
    let chain = []
    // 这个对象是提供给middleware进行嵌套的安全版store，这样不会修改原版的
    // dispatch，修改的只是返回的一个dispatch的封装
    const middlewareAPI = {
      getState: store.getState,
      dispatch: (action) => dispatch(action)
    }
    // 将中间件进行解构，传入第一层封装的store对象
    chain = middlewares.map(middleware => middleware(middlewareAPI))
    // 嵌套调用，返回嵌套调用的结果，也就是一个中间件的调用链
    dispatch = compose(...chain)(store.dispatch)

    return {
      ...store,
      dispatch
    }
  }
}