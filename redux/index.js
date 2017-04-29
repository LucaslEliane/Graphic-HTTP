import createStore from './createStore'
import combineReducers from './combineReducers'
import bindActionCreators from './bindActionCreators'
import applyMiddleware from './applyMiddleware'
import compose from './compose'
import warning from './utils/warning'

/**
 * 这个函数用来进行代码最小化检测，防止在非生产环境下使用了代码的minify。这样会导致
 * 代码的构建速度变慢，不适合开发环境。
 */
function isCrushed() {}

if (
  process.env.NODE_ENV !== 'production' &&
  typeof isCrushed.name === 'string' &&
  isCrushed.name !== 'isCrushed'
) {
  warning(
    '你现在正在非生产环境进行了代码的最小化，' + 
    '这意味着项目正在运行在较慢的Redux开发构建中。' +
    '你可以使用browserify的loose-envify插件，' +
    '或者webpack的 DefinePlugin插件来保证生产环境中的代码正确'
  )
}

export {
  createStore,
  combineReducers,
  bindActionCreators,
  applyMiddleware,
  compose
}
