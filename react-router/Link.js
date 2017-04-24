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

class Button extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <button style={{background: this.context.color}}>
        {this.props.children}
      </button>
    );
  }
}
Button.contextTypes = {
  color: PropTypes.string
}



const isModifiedEvent = (event) => 
  !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)

class Link extends React.Component {
  constructor(props) {
    super(props)
  }
  handleClick = function(event) {
    // 如果传入了点击函数，则不使用默认的点击函数
    if (this.props.onClick) {
      this.props.onClick(event)
    }
    /**
     * 进行几种判断处理
     * 1. 是否已经被移除了默认操作，已经移除默认操作的不进行处理
     * 2. 是否为右键点击，对于右键点击不进行处理
     * 3. 是否目标为空，目标为空的不进行处理
     * 4. 是否已经按住辅助按键，已经按住辅助按键的不进行处理
     */
    if (
      !event.defaultPrevented &&
      event.button === 0 &&
      !this.props.target &&
      !isModifiedEvent(event)
    ) {
      event.preventDefault()

      const { history } = this.context.router
      const { replace, to } = this.props
      // 直接调用HTML5的history API
      if (replace) {
        history.replace(to)
      } else {
        history.push(to)
      }
    }
  }
  render() {
    const { replace, to, ...props } = this.props
    const href = this.context.router.history.createHref(
      typeof to === 'string' ? { pathname: to } : to
    )

    return <a {...props} onClick={this.handleClick} href={href} />
  }
}

Link.propTypes = {
  onClick: PropTypes.func,
  target: PropTypes.string,
  replace: PropTypes.bool,
  to: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]).isRequired
}

Link.defaultProps = {
  replace: false
}
/**
 * 需要接收的上下文信息，只需要router路由信息的history里面的部分
 * 属性以及方法
 */
Link.contextTypes = {
  router: PropTypes.shape({
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
      replace: PropTypes.func.isRequired,
      createHref: PropTypes.func.isRequired
    }).isRequired
  }).isRequired
}
/**
 * 测试路由上下文信息
 * 
 * Object {
 *   router: undefined,
 *   history: Object,
 *   route: {
 *     location: Object,
 *     match: Object    注意，访问根目录的时候，isExact属性的值为true
 *   }
 * }
 * 
 * @class Message
 * @extends {React.Component}
 */
class Message extends React.Component {
  render() {
    console.log(this.context)
    return (
      <div>
        {this.props.text} <Button color={this.props.color}>Delete</Button>
      </div>
    );
  }
}
Message.contextTypes = {
  router: PropTypes.object,
  history: PropTypes.object,
  route: PropTypes.object
}

class MessageList extends React.Component {
  getChildContext() {
    return {
      color: 'purple'
    }
  }
  render() {
    const children = this.props.messages.map((message) =>
      <Message text={message.text} key={message}/>
    );
    return (
      <Router history={history}>
        <Link to="/"></Link>
        <Link to="/explore"></Link>
      </Router>
    )
  }
}

MessageList.childContextTypes = {
  color: PropTypes.string
}

ReactDOM.render(
  <MessageList messages={["message1", "message2", "message3"]}/>,
  document.getElementById('root')
)