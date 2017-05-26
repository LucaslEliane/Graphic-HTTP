## ReactDOM.render

渲染的起始，将根组件和HTML的插入位置的映射关系。来自ReactMount对象。

### ReactMount

这个模块中有一个方法是`render`，这个方法是基本上原样调用了一个内部的方法。将一个内部方法封装成了一个外部方法。

内部方法是`ReactMount._renderSubtreeIntoContainer(null, nextElement, container, callback)`，这个方法会将React组件渲染到提供的HTML容器当中，如果当前这个组件已经渲染进去了，那么就对其进行更新操作，并且根据需要来对DOM进行修改，来反映组件的最新状态。

实例化组件的时候，会根据传入的组件的类型进行判断，总共会生成四种组件类型，这四种组件类型已经涵盖了所有的符合当前规范的组件类型，其中包括React空对象，DOM原生对象，React自定义对象以及文本对象四种情况。这四种对象都有着自己的构建方法，每个对象都会暴露出一些private和public的接口，来在内部进行调用，重点是React自定义组件。

[React自定义组件](./ReactCompositeComponent.md "React自定义组件")

```
ReactMount._renderSubtreeIntoContainer() {
  // 这里面有一个判断组件是否更新的代码，在进行初始化渲染的时候是不调用的
  // 这段代码主要对于同级组件的比较，如果不同可以进行更新或者直接卸载
  // 并且进行重新挂载
}
/**
  * @param { parentComponent } 父组件
  * @param { nextElement } 当前组件
  * @param { container } 外部容器
  * @param { callback } 渲染回调
  */
instantiateReactComponent: function (parentComponent, nextElement, container, callback) {
  var nextWrappedElement = React.createElement(TopLevelWrapper, { child: nextElement })
  // 在这之后，有几层函数调用，这几次函数调用，分别对组件进行处理和包装
  var component = ReactMount._renderNewRootComponent(nextWrappedElement, container, shouldReuseMarkup, nextContext..)
  return component
}
/**
  * 将一个新的组件渲染到DOM中
  * @param { nextElement } 一个需要去渲染元素
  * @param { container } 需要去渲染进去的DOM元素
  * @param { shouldReuseMarkup } 是否应该去跳过插入流程
  */
_renderNewRootComponent: function (nextElement, container, shouldReuseMarkup) {
  var componentInstance = instantiateReactComponent(nextElement, false)
}
/**
  * 给出一个真实的React节点，创建一个真正被挂载的实例
  * @param { node } 一个React节点
  */
function instantiateReactComponent(node, shouldHaveDebugID) {
  // 在这个函数中，每个节点都会被进行包装，根据node的类型，会被包装成
  // 各种类型的对象

  // 空对象
  if (node === null || node === false) {
    instance = ReactEmptyComponent.create(instantiateReactComponent)
  } else if (typeof node === 'object') {
    var element = node
    if (typeof element === 'string') {
      // 原生DOM元素
      instance = ReactHostComponent.createInternalComponent(element)
    } else {
      // 返回一个React自定义组件
      instance = new ReactCompositeComponentWrapper(element)
    }
  } else if (typeof node === 'string' || typeof node === 'number') {
    // 一个文本组件
    instance = ReactHostComponent.createInstanceForText(node)
  }
  return instance
}
```

这里调用了`React`组件的`createElement`方法，这个方法返回一个指定类型的`ReactElement`组件。然后将传入的组件作为创建的组件的子组件，来获取包装完成的组件。

`createElement`方法的第一个参数表示当前传入的JSX到底是React组件还是一般的DOM元素，这两个类型主要是通过传入的JSX最外层标签的第一个字母表示的，如果第一个字母是大写的，那么就是React自定义组件，如果是小写的，就是DOM原生元素。

```
/**
  * @param { type } DOM组件的type是字符串，而React组件则是对象
  * @param { config } 表示这个组件的属性，对象表示
  * @param { children } 子组件，嵌套调用createElement
  */
ReactElement.createElement = function(type, config, children) {
  // 这里针对React组件的两个重要属性，key和ref进行特殊处理
  if (config != null) {
    if (hasValidRef(config)) {
      ref = config.ref
    }
    if (hasValidKey(config)) {
      key = config.key
    }
  }
  return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props)
}
/**
 * 创建一个新的React元素的工厂方法
 * @params {self} 用来保存this对象的，用来和owner对比，如果这两个对象的行为是一致的就没有问题，
 *                如果行为不一致的话，就需要warning出来。
var ReactElement = function (type, key, ref, self, source, owner, props) {
  var element = {
    // 这个属性指示一个元素的类型，这个表示是React元素
    $$typeof: REACT_ELEMENT_TYPE,
    type: type,
    key: key,
    ref: ref,
    props: props,
    _owner: owner
  }
}
```

### createClass

这个函数用于创建一个React组件对象，这个也是提供给外部调用的接口，即使使用`React.Component`来进行ES6形式的创建，在内部实现上也是在使用这个方法来进行创建的。这个创建的时候，对于组件的一些属性进行了初始化，包括属性，上下文等信息。

在这个函数里面，对于函数的构造函数和原型进行了很多次的合并，将各个版本的属性和方法以及公共属性方法合并到一起，这样子可以更好的进行版本控制，以及向后兼容，如果需要添加新的方法或者移除某个方法，可以先将方法移植到其他模块的对象上，最后再合并起来，一步步将不需要的方法慢慢进行废弃，或者慢慢开始兼容新的方法。

```

var ReactClassComponent = function() {}
Object.assign(
  ReactClassComponent.prototype,
  // 这个原型上是对于现在的ES6版本构造函数的控制，里面包含针对于React.Component
  // 方式创建的组件的一些方法和属性的定义，包括对于参数的初始化以及setState方法
  // 等相关内容
  ReactComponent.prototype,
  // 这个对象上有对于一些之前的方法兼容的属性和参数，这里面的东西可能即将废弃
  ReactClassMixin
)
createClass: function(props, context, updater) {
  this.props = props
  this.context = context
  // 对于状态进行初始化
  var initialState = this.getInitialState ? this.getInitialState() : null
  this.state = initialState
  // 将合并完的原型赋值到现在的构造函数上
  Constructor.prototype = new ReactClassComponent()
  Constructor.prototype.constructor = Constructor
  // 将当前版本的一些方法和属性合并到构造函数上面
  mixSpecIntoComponent(Constructor, spec)
  // 合并完成之后，对于默认的属性进行初始化操作
  if (Constructor.getDefaultProps) {
    Constructor.defaultProps = Constructor.getDefaultProps()
  }
  // 这里面将原型上没有定义的一些方法置为null，也就是将这些方法预设一下
  // 这些方法以后可能会进行调用或者测试是否存在，将其赋值为null可以
  // 对于测试的结果标准化
  for (var methodName in ReactClassInterface) {
    if (!Constructor.prototype[methodName]) {
      Constructor.prototype[methodName] = null
    }
  }
}
```
