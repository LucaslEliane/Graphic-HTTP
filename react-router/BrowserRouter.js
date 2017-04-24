import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import createBrowserHistory from 'history/createBrowserHistory'
import invariant from 'invariant'
import warning from 'warning'

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
    return Object.assign({}, this.context.router, {
      history: this.props.history,
      route: {
        location: this.props.history.location,
        match: this.state.match
      }
    })
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
    console.log(this.state.match)
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
  router: PropTypes.object,
  history: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired
}

/**
 * BrowserRouter是针对Router的一个封装，添加了HTML5原生的history相关方法
 * 
 * @class BrowserRouter
 * @extends {React.Component}
 */

class BrowserRouter extends React.Component {
  constructor(props) {
    super(props)
    this.history = createBrowserHistory(this.props)
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


class MessageList extends React.Component {
  render() {
    return (
      <div>
        <p>This is a MessageList</p>
      </div>
    )
  }
}


ReactDOM.render(
  (
    <BrowserRouter basename="/content">
      <MessageList />
    </BrowserRouter>
  ),
  document.getElementById('root')
)