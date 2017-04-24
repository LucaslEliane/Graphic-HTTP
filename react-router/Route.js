import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import createBrowserHistory from 'history/createBrowserHistory'
import invariant from 'invariant'
import warning from 'warning'
import matchPath from './matchPath'

const history = createBrowserHistory()

class Router extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      match: this.computeMatch(this.props.history.location.pathname)
    }
  }
  // 为子组件提供相关的上下文信息。包括history对象，父组件提供的router上下文，
  // 以及路由相关内容，包括匹配结果与location信息
  getChildContext() {
    return {
      router: Object.assign(this.context.router || {} , {
        history: this.props.history,
        route: {
          location: this.props.history.location,
          match: this.state.match
        }
      })
    }
  }
  // 初始化路由匹配信息

  computeMatch(pathname) {
    return {
      path: '/',
      url: '/',
      params: {},
      isExact: pathname === '/'
    }
  }

  componentWillMount() {
    const { children, history } = this.props
    invariant(
      // 判断子组件是否为大于1个或者0个，如果是则要抛出异常
      children == null || React.Children.count(children) === 1,
      'A <Router> may only one child element'
    )

    // 在组件挂载之前检测路由匹配状态，并且写到Router的state中
    this.unListen = history.listen(() => {
      this.setState({
        match: this.computeMatch(history.location.pathname)
      })
    })
  }

  componentWillReceiveProps(nextProps) {
    warning(
      this.props.history === nextProps.history,
      'You cannot change <Router history>'
    )
  }
  // 组件卸载的时候解除针对路由的监听
  componentWillUnmount() {
    this.unListen()
  }

  render() {
    const { children } = this.props
    return children ? React.Children.only(children) : null
  }
}
// Router本身接收的props
Router.propTypes = {
  history: PropTypes.object.isRequired,
  children: PropTypes.node
}
// Router通过上下文获取的this.context.router
Router.contextType = {
  router: PropTypes.object
}
// Router组件共享给下层组件提供的上下文属性
Router.childContextTypes = {
  router: PropTypes.object.isRequired
}

/**
 * B
 * 
 * @class BrowserRouter
 * @extends {React.Component}
 */
class BrowserRouter extends React.Component {
  constructor(props) {
    super(props)
    this.history = createBrowserHistory(props)
    this.history.location.pathname = '/content'
  }
  render() {
    return <Router history={this.history} children={this.props.children}/>
  }
}

BrowserRouter.propTypes = {
  basename: PropTypes.string,
  forceRefresh: PropTypes.bool,
  getUserConfirmation: PropTypes.func,
  keyLength: PropTypes.number,
  children: PropTypes.node
}


class Route extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      match: {}
    }
  }

  /**
   * 计算路由匹配结果
   * 
   * @param {any} { computedMatch, location, path, strict, exact } 
   * @param {any} {route} 
   * @returns { path: '/explore', url: '/explore', isExact: true, params: Object}
   *          { path: '/', url: '/', isExact: false, params: Object}
   *          不匹配的时候，返回null
   * @memberOf Route
   */
  computeMatch({ computedMatch, location, path, strict, exact }, {route}) {
    // 父组件路由计算结果存在的话，就直接返回
    if (computedMatch) {
      return computedMatch
    }
    // 从上下文或者参数中获取路径信息
    const pathname = (location || route.location).pathname
    // 返回路由匹配的结果
    return path ? matchPath(pathname, { path, strict, exact }) : route.path
  }
  componentWillMount() {
    const { component, render, children } = this.props
    this.state = {
      match: this.computeMatch(this.props, this.context.router)
    }
    warning(
      !(component && render),
      'You should not use <Route component> and <Route render> in the same route'
    )

    warning(
      !(component && children),
      'You should not use <Route component> and <Route children> in the same route'
    )

    warning(
      !(render && children),
      'You should not use <Route render> and <Route children> in the same route'
    )
  }

  componentWillReceiveProps(nextProps, nextContext) {
    warning(
      !(nextProps.location && !this.props.location),
      'XXXX'
    )

    warning(
      !(!nextProps.location && this.props.location),
      'XXXX'
    )
    // 在属性改变的时候，重新进行路由匹配
    this.setState({
      match: this.computeMatch(nextProps, nextContext.router)
    })
  }
  // 渲染优先级：component > render > children
  render() {
    console.log(this.state.match, this.props)
    const { match } = this.state
    const { children, component, render } = this.props
    const { history, route, staticContext } = this.context.router
    const location = this.props.location || route.location
    const props = { match, location, history, staticContext }

    return (
      component ? (
        match ? React.createElement(component, props) : null
      ) : render ? (
        match ? render(props) : null
      ) : children ? (
        typeof children === 'function' ? (
          children(props)
        ) : !Array.isArray(children) || children.length ? (
          React.Children.only(children)
        ) : (
          null
        )
      ) : (
        null
      )
    )
  }
  /**
   * 传给子组件的上下文，包含父组件上下文的路由信息，和组件本身的路由信息
   * 
   * @returns 
   * 
   * @memberOf Route
   */
  getChildContext() {
    return 
      Object.assign({}, this.context.router, {
        route: {
          location: this.props.location || this.context.router.route.location,
          match: this.state.match          
        }
      })
    
  }
}
/**
 * path: 一个正则的URL路径，如果Route组件没有设置path，那么就会被一直匹配到
 * exact: 设置为true的时候，必须要完全匹配location.pathname才会触发该路由
 * 负责渲染的属性：component,render,children.
 * component: 路由使用React.createElement从给定组件创建一个新的React元素，会导致一次组件的卸载和安装
 * render: 允许行内的渲染和包装，而不需要重新卸载和加载，针对较小较简单的组件
 * children: 允许根据match的结果对组件进行渲染
 * 和路由相关的属性：match,location,history
 */
Route.propTypes = {
  computedMatch: PropTypes.object,
  path: PropTypes.string,
  exact: PropTypes.bool,
  strict: PropTypes.bool,
  component: PropTypes.func,
  render: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.node
  ]),
  location: PropTypes.object
}

Route.contextTypes = {
  router: PropTypes.object.isRequired
}

Route.childContextTypes = {
  router: PropTypes.object.isRequired
}


class MessageList extends React.Component {
  render() {
    return (
      <div>
        <p>This is a MessageList</p>
      </div>
    )
  }
}

MessageList.contextTypes = {
  router: PropTypes.object.isRequired
}

class Message extends React.Component {
  render() {
    console.log(this.context)
    return (
      <div>
        <p>This is a Message</p>
      </div>
    )
  }
}

Message.contextTypes = {
  router: PropTypes.object.isRequired
}


ReactDOM.render(
  (
    <Router history={history}>
      <div>
        <Route path="/" component={MessageList}/>
        <Route path="/explore" component={Message}/>
      </div>
    </Router>
  ),
  document.getElementById('root')
)