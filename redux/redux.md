## Redux源码解析

### 发布/订阅

Redux采用的设计模式中的观察者模式(observer)，这个模式也被称为发布/订阅模式。

这个模式中，一个对象可以订阅另外一个对象的特定的活动，并且在状态发生改变之后收到通知。订阅者也称为观察者，被订阅的对象被称为发布者。

这个模式在JavaScript中广泛被使用。比如针对于DOM对象的`addEventListener`方法就可以将DOM对象看做发布者，而注册的一个个事件监听函数也就是订阅者，当DOM对象触发了一个事件，也就是状态发生了改变，一个个事件监听函数将会被依次调用。同理，NodeJS中的异步I/O也是通过这个机制进行实现的。

### 一个例子

举个最简单的栗子，我们可以对某个报社进行订阅，当报社有了新的报纸，他就会把报纸送到我们家，这就是最形象化的发布/订阅机制。

下面是一个JavaScript实现的通用发布者类以及其实例化的子类(TypeScript)：

```
class Publisher {
  private subscribers: Object = {
    any: []
  }
  // 外部接口，订阅
  public subscribe(fn, type: string = 'any') {
    if (typeof fn != 'function') {
      throw new TypeError('subscribe need a function as the first parameter')
    }
    if (this.subscribers[type] === undefined) {
      this.subscribers[type] = []
    }
    this.subscribers[type].push(fn)
  }
  // 外部接口，取消订阅
  public unsubscribe(fn, type: string = 'any') {
    if (typeof fn != 'function') {
      throw new TypeError('unsubscribe need a function as the first parameter')
    }
    this.visitSubscribers('unsubscribers', fn, type)
  }
  // 内部接口，发布，可以让子类进行继承来具体实现
  protected publish(publication: string, type: string = 'any') {
    this.visitSubscribers('publish', publication, type)
  }
  private visitSubscribers(operate: string, fn, type: string) {
    let subscribers = this.subscribers,
        i,
        length = subscribers[type].length,
        subscriberArray = subscribers[type]
    for (i = 0; i < length ; i++) {
      if (operate === 'unsubscribers') {
        if (fn == subscriberArray[i]) {
          subscriberArray.splice(i, 1)
        }
      } else if (operate === 'publish') {
        subscriberArray[i](fn)
      }
    }
  }
}
// 真正的发布者
class Paper extends Publisher {
  constructor(private paperName: string = 'default paper') {
    super()
  }
  public daily() {
    super.publish(`daily ${this.paperName}`)
  }
  public weekly() {
    super.publish(`weekly ${this.paperName}`)
  }
}
```

订阅者进行订阅：

```
let dailyNews = new Paper('daily news')

var joe = {
  drinkCoffee: function(paper) {
    console.log('Just read ' + paper)
  },
  sundayPreNap: function(paper) {
    console.log('About to fall asleep reading this ' + paper)
  }
}

dailyNews.subscribe(joe.drinkCoffee)
dailyNews.subscribe(joe.sundayPreNap, 'monthly')

dailyNews.daily()
dailyNews.daily()
dailyNews.weekly()
```

### Redux中

在Redux中，发布者的实现主要在`store`对象中，通过`createStore`进行创建。

这个发布者主要向外部暴露两个API，其中一个是`dispatch`，当需要修改`store`内的状态的时候，将一个action进行分发，使用reducer对其进行处理，就可以得到一个新的状态，当状态发生了变化，通过另外一个接口注册的所有回调都会注意到这个变化，从而对自己的状态进行处理。React-Redux中使用 Redux提供的`[$$observable]`进行回调注册，observable是 TC39，也就是ECMAScript官方组织提议的下一代JavaScript的新特性，现在还没有被完全实现，所以还需要引入[Symbol-Observable](https://github.com/benlesh/symbol-observable)库来使用。

Redux中`[$$observable]`接口的实现

```
 /**
   * 状态发生变化时候的观察者，当为这个对象注册了一个监听对象之后，其next方法的调用
   * 将会被注册到订阅列表里面。
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
      // 以当前state为参数调用传入对象的next方法
      observeState()
      const unsubscribe = outerSubscribe(observeState)
      // 返回解除订阅的函数
      return { unsubscribe }
    },
    [$$observable]() {
      return this
    }
  }
}
```