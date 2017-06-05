## RxJS

参考：

[徐飞：单页应用的数据流方案探索](https://zhuanlan.zhihu.com/p/26426054)

[andrestaltz：RP入门](https://github.com/benjycui/introrx-chinese-edition)

[Redux in Chinese](http://cn.redux.js.org/docs/advanced/ExampleRedditAPI.html)

[RxJS官方文档](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html)

### 主要的概念

RxJS使用函数响应式编程，使用流(observable sequences)来实现基于事件的编程。这个编程模式混合了订阅者模式、迭代器模式以及函数式编程来处理事件流。observable可以通过很多方法进行合并，或者基于已经存在observable来构建新的observable，所有的observable其实都是具有不变性的(immutable)，无论如果构建或者操作，其原本的observable都是不变的，这样保证了对一个observable进行的操作都是在一个对象上进行操作的。

RxJS中有几个比较重要的概念来处理异步事件：

1. *Observable*：表示一个可以收集未来的值或者事件(values or events)的概念，在有些文章中，这个概念被翻译为流。事件或者值从流的一端触发，这个流上会被绑定许多监听器(Observer)，当流通过了其中的某个监听器的时候，监听器会触发，生成一个新的流，而并不修改原本的流
2. *Observer*：表示一个回调的集合，这个回调回去监听通过流的值或者事件。
3. *Subscription*：表示一个流的执行，其主要的作用是用来取消执行的。
4. *Operators*：是一个纯函数(pure function)，使用函数式编程的风格来处理一些集合，比如：`map`等。
5. *Subject*：其功能和NodeJS中的`EventEmitter`类似，是唯一将一个值广播给多个监听器(Observers)的唯一途径。
6. *Schedulers*：是用来控制并发的中央调度器，允许我们在类似`setTimeout`等计算发生的时候进行协调。

#### pure function

纯函数(pure function)主要有两个特点：

1. 其返回值不会因为外部因素而发生改变。也就是无论在什么样的情况下，如果给出相同的参数值，那么纯函数将会返回相同的结果。
2. 结果的求值不会导致任何可以观察到的副作用或者是输出。

纯函数可以看做是一个完全的黑盒，除了输入和返回，不会与外界有任何的交互，是一个类似透明的过程。RxJS使用纯函数的主要好处在于会更不容易产生错误。会产生一个与外界隔绝的状态。

#### Observable

下面的代码产生了一个流，这个流中共触发了四个值，其中前三个值是简单的同步值，而第四个是异步的值。

```javascript
var observable = Rx.Observable.create(function (observer) {
  observer.next(1)
  observer.next(2)
  observer.next(3)
  setTimeout(() => {
    observer.next(4)
    observer.complete()
  }, 1000)
})
```

这个流用ASCII图看起来差不多是这个样子的:

```asciiarmor
------1-2-3----------------4-------|-->
       Sync |------1s------|
```

### RP和Redux的主要区别

#### 数据抽象

平常进行Redux数据逻辑的业务开发的时候，一般抽象程度都比较低，但是如果进行高度抽象的话，我们不需要去对数据的来源进行区分，如果是相同的数据被修改了，那么只需要在相应的地方进行`dispatch`就可以了；这样将数据的来源和修改数据的对象不进行区分的话，许多操作都可以被合并为一个`action`去实现。

而在RP中，我们通过将各种数据来源的管道进行声明和构建，然后再将这些数据的变更过程进行统一，这样可以比较清楚的获得数据的，数据的修改入口都被放到了一起，所以可以很简单地对所有的数据修改进行统一的管理。不需要让数据再提出民工三问了(我是谁、我在哪里、我在干什么)。

也可以将Redux和RP结合起来：使用管道的方式管理action，将每个事件的变化映射为action，然后再`subscribe`的时候对这些action进行dispatch：

```javascript
const updateActions$ = changes$
	.map(todo => ({type: 'updateTodo', payload: todo}))
```

#### 组件与状态外置

React原本的想法是这样的，将状态完全放在组件内部，父组件管理所有子组件的状态。然后这些状态会被一级一级地传递，但是这样就会导致组件树上所有的组件都保有自己的状态，状态的管理变得繁琐起来，并且子组件到父组件的状态通信以及兄弟组件之间的状态通信非常麻烦，就更不用提不是一棵子树上的部分的通信了。

而Redux采用的方法是将状态外置，也就是将大部分的状态交给store管理，然后通过connect方法将方法或者状态映射一部分到组件当中，大部分组件只负责接收状态的改变，并且进行re-render就可以了，并不需要管理自身的状态。在Redux官方的文档当中提到了这个问题，组件分为两种，其一是无状态组件：展示型组件`component`以及有状态的组件：容器型组件`container`。容器组件的主要作用是将外部的全局状态映射到组件的`props`中，这样容器组件内部的组件就可以保证组件的纯净，这也是React-Redux提供给我们的最佳实践。

#### 状态的变更过程

在MVI(Model View Intent)中，视图始终是调用链的最后一段，其职责就是简单地消费所有的数据，并且将DOM渲染出来。在Redux中，所有事件触发的来源都是自定义事件，这样会导致很繁琐的事件逻辑，而RP中，对于事件的抽象可以让我们简单的将事件作为一根根管道进行操作。

Redux是为了清晰地管理数据流而设计的，可以很好地管理中小规模的单向数据流，而在管道当中，数据本身就是单向流动的，可以防止混乱的状态修改的出现。

#### Model的结构

在Redux和Vuex中的数据的结构组织一般提供的最佳实践都是将Model的数据尽可能的扁平化，通过key和value去进行索引，这样可以保证在数据需要更新的时候，可以对尽可能小的数据部分进行更新，如果按照DOM的树型结构进行存储的话，很容易造成更新的时候由于嵌套层级太深导致的更新速度和更新完整性问题。

在大型业务的开发中，store应该尽早，尽量在开始view的编写期之前稳定下来，并且需要存放尽量原始一些的数据、保持数据的扁平化，不要产生过于深层的结构。

如果针对BOM环境使用RP，那么MVI的理念可以保证一个管道流是针对了模型、动作以及视图三者操作的集合，那么使用RP就可以保证组件在一定程度上的自治，而不是在Redux中的由store进行统一管理。

### Rx.Observable.bindCallback

这个方法可以传入一个参数f，这个参数是一个函数，其最后一个参数值是一个回调函数，这个回调函数是f调用完成后的回调。然后会返回一个函数g，当调用这个函数g的时候，会返回一个流(Observable)。

### Rx.Observable.bindNodeCallback

和上面的方法类似，不过这个函数的回调函数接受的是一个NodeJS类型的回调函数，也就是`callback(error, result)`。

这时候，如果调用生成的函数，并且为其传入第一个参数，也就是发生了错误，那么则永远会调用observable的error事件回调函数。这个函数主要是用于在服务器端环境下，将NodeJS中的异步操作回调函数转换为一个可以被观察的observable，来便于使用RxJS的方式对事件进行处理。

### Rx.Observable.combineLatest

合并多个observable，来创建一个新的observable，这个observable的值是当前两个observable的最近产生的一个值合并而成的。并且这个observable会在两个observable都产生值了的时候开始启动的。

```javascript
const firstTimer = Rx.Observable.timer(0, 1000)
const secondTimer = Rx.Observable.timer(200, 500)
const combinedTimer = Rx.Observable.combineLatest(firstTimer, secondTimer)

combinedTimer.subscribe( v => console.log(v) )
// [0, 0] [0, 1] [1, 1] [1, 2] [1, 3] [2, 3] [2, 4]
```

### Rx.Observable.concat

创建一个输出observable，根据参数指定的observable按照其第一个值发出的顺序，将生成一个新的合并的observable。也就是，如果有三个observable，其第一个发出的值的时间分别为100ms，200ms，50ms，那么observable将会被合并为observable3—observable1—observable2。

```javascript
const firstTimer = Rx.Observable.timer(0, 1000).take(3)
const secondTimer = Rx.Observable.timer(200, 500).take(4)
const thirdTimer = Rx.Observable.timer(300, 100).take(5)

const result$ = Rx.Observable.concat(firstTimer, secondTimer, thirdTimer)
result$.subscribe( v => console.log(v) )
// 0 1 2 0 1 2 3 0 1 2 3 4
```

### Rx.Observable.create

创建一个observable，然后这个observable会在有任何一个监听器订阅了这个observable 的时候执行一个指定的函数。

这个方法只有一个参数`onSubscription`，该参数指定了当该observable被订阅了之后，需要执行什么样的函数，该`onSubscription`函数具有一个参数，这个参数指定了一个订阅对象的迭代器，可以用来进行observable的数据触发，observable抛出错误或者是observable完成操作。

```javascript
const observable = Rx.Observable.create(observer => {
  observer.next(1)
  setTimeout(() => observer.next(2), 1000)
  observer.complete()
})
observable.subscribe(
  value => console.log(value),
  err => {},
  () => console.log('this is the end')
)
// 1 this the end
```

### Rx.Observable.defer

创建一个observable，这个observable会在被订阅的时候调用Observable的工厂函数，来为每一个观察者创建一个observable。也就是说，每个订阅者拿到的observable可能是不一样的，因为这个observable是在订阅时候动态生成的。

```javascript
var randomTimer = Rx.Observable.defer(() => Rx.Observable.timer(Math.random() * 1000, Math.random() * 1000))
randomTimer.subscribe(
  v => console.log(v)
)
randomTimer.subscribe(
  v => console.log(v)
)
// 这里输出的流的顺序是随机的，并且订阅同样一个stream得到的stream也都是不同的
```

### Rx.Observable.forkJoin

这个方法会运行参数传入的所有的observable，并且获取每一个observable产生的最后一个值，然后将这个值的数组进行返回。

```Javascript
const source = Rx.Observable.forkJoin(
  Rx.Observable.range(10, 42),
  Rx.Observable.timer(100, 300).take(3),
  Rx.Observable.range(0, 10)
)
source.subscribe(
  v => console.log(v)
)
```

### Rx.Observable.from

通过一个数组、一个类素组对象、一个Promise、一个迭代器对象或者一个类Observable对象来创建一个observable。这个方法会自动迭代可以迭代的参数类型，然后将其整合成一个observable进行输出。

```javascript
function* generateDoubles(seed) {
  var i = seed
  while (true) {
    yield i
    i = 2 * i
  }
}
var iterator = generateDoubles(3)
var result = Rx.Observable.from(iterator).take(10)
result.subscribe(x => console.log(x))
```

### Rx.Observable.fromEvent

当触发事件的时候，通过给定的参数来创建一个observable，参数分别是触发事件的DOM元素以及事件类型。这个事件也可以是NodeJS的EventEmitter的事件。

通过下面这个例子可以看到，当事件被触发了之后，这个observable也被触发，并且将一个产生的事件结果注入到observable中，可以通过其他方法对于这个事件进行处理。

```Javascript
const Rx = require('rxjs/Rx')
const EventEmitter = require('events')

class myEvent extends EventEmitter {}
const myEmitter = new myEvent()
myEmitter.on('event', () => {
  console.log('trigger a event')
})
const nodeEvent$ = Rx.Observable.fromEvent(myEmitter, 'event')
  .map(() => 'this is a event')
nodeEvent$.subscribe(
  v => console.log(v)
)

myEmitter.emit('event')
// trigger a event
// this is a event
```

### Rx.Observable.fromEventPattern

通过使用addHandler和removeHandler两个函数参数来进行处理程序的添加和删除，当事件被订阅的时候，也就是observable开始输出的时候，addHandler函数被调用，然后当订阅被取消的时候，removeHandler函数被调用。

```Javascript
const Rx = require('rxjs/Rx')
const EventEmitter = require('events')
class myEvent extends EventEmitter {}
const myEmitter = new myEvent()
const nodeEvent$ = Rx.Observable.fromEventPattern(
  () => console.log('this is event bind'),
  () => console.log('this is event unbind')
)
nodeEvent$.subscribe(
  v => {}
).unsubscribe()
// this is event bind
// this is event unbind
```

### Rx.Observable.fromPromise

将一个Promise对象转换为observable。

他会将Promise的resolve和reject分别作为observable的值和失败进行处理，也就是`subscribe`的第一个和第二个参数作为Promise转换的observable的处理函数。并且如果Promise成功的话，在执行完resolve回调之后，还有执行observable的complete方法。

```javascript
const Rx = require('rxjs/Rx')

const myPromise = function (value) {
  return new Promise((resolve, reject) => {
    if (value > 1) {
      resolve(value)
    } else {
      reject(value)
    }
  })
}
const result$ = Rx.Observable.fromPromise(myPromise(1))

result$.subscribe(
  x => console.log(`Next: ${x}`),
  e => console.log(`Error: ${e}`),
  () => console.log('this is complete')
)
// 如果调用myPromise的时候参数为1，则表示Promise被reject
// Error: 1
// 如果参数为2，则表示Promise被resolve
// Next: 2
// this is complete
```

### Rx.Observable.empty

创建一个observable，这个observable不会给订阅者任何值，而是立即触发一个完成通知。

```javascript
const result$ = Rx.Observable.empty()
result$.subscribe(
  v => {},
  e => {},
  () => console.log('this is the end')
)
// this is the end
```

### Rx.Observable.timer

返回一个observable序列，这个序列在dueTime之后生成一个值，如果调用的时候具有第二个参数，period，那么会在每隔period ms后都生成这样的一个值。

```javascript
const source = Rx.Observable.timer(3000, 1000)
var subscription = source.subscribe(x => console.log('Next: ' + x))
// 首先暂停3s，然后输出：Next: 0，之后每隔1s输出：Next: 1  Next: 2...
```

### Rx.Observable.prototype.timeInterval

记录一个observable序列中连续两个值之间的时间间隔，返回一个对象observable，这个observable中的每个对象都包含一个两个属性，分别为值和事件间隔。

```javascript
const source = Rx.Observable.timer(3000, 1000).timeInterval()
var subscription = source.subscribe(x => console.log(x.value, x.interval))
// 0 3008
// 1 1025
// 2 1002 ...
```

### Rx.Observable.prototype.interval

创建一个以参数为指定的时间间隔，发出顺序数字为value的observable。

### Rx.Observable.prototype.merge

创建一个输出observable，这个observable根据时间顺序触发所有参数observable中的值。

这个方法的功能很类似于`concat`方法，但是这两个方法的主要区别在于`concat`是将observable进行首尾连接，而`merge`却是进行合并。

```javascript
const firstTimer = Rx.Observable.timer(0, 1000).take(3)
const secondTimer = Rx.Observable.timer(200, 500).take(4)
const thirdTimer = Rx.Observable.timer(300, 100).take(5)
const result$ = Rx.Observable.merge(firstTimer, thirdTimer, secondTimer)
result$.subscribe(v => console.log(v))
```

```asciiarmor
firstTimer-------0------1------2----------------------|--->
secondTimer--------0--1--2--3-------------------------|--->
thirdTimer----------01234-----------------------------|--->
mergeTimer-------00-0123141232------------------------|--->
concatTimer------0------1------2--0--1--2--301234-----|--->
```

### Rx.Observable.prototype.never

这个方法会创建一个不会触发任何返回的observable。

### Rx.Observable.prototype.of

这个方法创建一个observable，这个observable会立即顺序返回参数列表中的所有value，然后触发完成通知。

### Rx.Observable.prototype.pluck

返回一个包含参数指定的嵌套属性的值的observable，如果这个属性不能够被解析，则返回`undefined`。

```javascript
const source = Rx.Observable.timer(3000, 1000).timeInterval().pluck('interval')
var subscription = source.subscribe(x => console.log(x))
// 3002
// 1032
// 1004 ...
```

### Rx.Observable.prototype.map

针对一个observable中的每个元素，结合元素的索引，将映射出一个新的observable。

```javascript
var source = Rx.Observable.range(1, 3)
	.map((x, idx, obs) => x * x)
var subscription = source.subscribe(x => console.log(x))
// 1
// 4
// 9
```

### Rx.Observable.range

生成一个observable，这个observable是在一个特定范围的所有整数，使用指定`scheduler`参数可以发出监听消息。`Rx.Observable.range(start, count, [scheduler])`，其中参数`start`为初始值，而参数`count`为产生的值的个数。

```javascript
const source = Rx.Observable.range(2, 4)
var subscription = source.subscribe(x => console.log(x))
// 2 3 4 5
```

### Rx.Observable.throw

创建一个不会触发任何value，但是会立即抛出一个error通知的observable。

### Rx.Observable.webSocket

将浏览器提供的一个webSocket对象包裹起来。将其包裹为一个observable。

### Rx.Observerable.zip

将几个observable合并起来，生成一个新的observable，而这个新的observable的值是由那几个observable的值计算出来的，也就是将那个几个observable作为输入值使用。这个方法的前几个参数都是用于计算的observable，而最后一个参数表示进行计算的函数，这个函数的返回值会作为新的observable的值被触发。

```Javascript
const age$ = Rx.Observable.of(27, 25, 29)
const name$ = Rx.Observable.of('Foo', 'Bar', 'Beer')
const isDev$ = Rx.Observable.of(true, true, false)

Rx.Observable.zip(
  age$,
  name$,
  isDev$,
  (age, name, isDev) => {
    return {
      age,
      name,
      isDev
    }
  }
).subscribe(
  v => console.log(v)
)
// { age: 27, name: 'Foo', isDev: true }
// { age: 25, name: 'Bar', isDev: true }
// { age: 29, name: 'Beer', isDev: false }
```

### Rx.Observable.prototype.audit

通过另外一个observable来确定忽略部分时间段内的源value，然后从源observable触发剩余的value。参数observable是用来表示忽略的时长的。

用这个方法可以通过observable来保证按钮点击或者输入框的更新等操作只能够在一段时间内被触发一次。防止多次的触发。

### Rx.Observable.prototype.auditTime

和上面的方法功能基本一致，不过这个方法是通过时间参数来确定时间间隔的，而不是observable。这两个方法都只会返回最后一次触发的value。

```javascript
const btn = document.querySelector('.clickBtn')
const click$ = Rx.Observable.fromEvent(btn, 'click')
	.auditTime(2000)
	.subscribe(x => console.log(x))
// 这样表示点击事件只会在2s内触发一次
// 如果使用上面的方法可以这样写
// .audit(Rx.Observable.interval(2000))
```

### Rx.Observable.prototype.buffer

将源observable产生的值进行缓冲，直到`closingNotifier`被触发。可以将observable产生的值收集到一个数组里面，然后等另外一个observable被触发的时候将这个数组发出。

```Javascript
const clicks = Rx.Observable.fromEvent(document, 'click')
const interval = Rx.Observable.interval(1000)
const buffered = interval.buffer(clicks)
	.subscribe(v => console.log(v))
// 这个observable会在被订阅之后，开始计时，每当点击事件被触发之后，缓存的所有interval触发的value会被保存在数组中被触发出来
```

### Rx.Observable.prototype.bufferCount

这个方法会缓存源observable产生的value，直到缓存的长度到了第一个参数`bufferSize`的时候会一次将所有的放在数组中触发出来。

```Javascript
const interval$ = Rx.Observable.interval(1000)
	.bufferCount(10)
	.subscribe(x => console.log(x))
// 这样可以让interval每1s输出的value被缓存到数组中，缓存会被每
// 10个元素触发一次，这个新的observable会每10s产生一个长度为10的数组
```

### Rx.Observable.prototype.bufferTime

这个方法和上一个类似，不过是按照时间进行缓存的，根据参数给出的时间，在时间段的结束时将当前缓存的内容进行触发。

```javascript
const timer1$ = Rx.Observable.timer(100, 400)
const timer2$ = Rx.Observable.timer(200, 1000)
const timerAll = Rx.Observable.merge(timer1$, timer2$)
	.bufferTime(1000)
	.subscribe(x => console.log(x))
// 这里会每1s将缓存的value触发出来
// [0, 0, 1, 2]
// [1, 3, 4] ...
```

### Rx.Observable.prototype.bufferToggle

这个方法会传入两个observable，对两次触发中的observable的值进行缓存，其中参数`openings`是表示缓存开始的observable，而第二个参数`closingSelector`是一个函数，这个函数返回一个表示缓存结束的observable。当结束缓存被触发的时候，这个observable会发出一个值，这个值包含了缓存中的所有value。

```javascript
const btnArr = document.querySelectorAll('.clickBtn')
const startClick$ = Rx.Observable.fromEvent(btnArr[0], 'click')
const endClick$ = Rx.Observable.fromEvent(btnArr[1], 'click')
const interval = Rx.Observable.interval(1000)
const toggleInterval = interval.bufferToggle(
	startClick$,
  	() => endClick$
).subscribe(v => console.log(v))
// 上面的代码可以在点击start按钮的时候开始进行缓存，在点击end按钮的时候结束缓存并且将缓存的value触发出来，用数组进行表示
```

### Rx.Observable.prototype.bufferWhen

和上面的方法类似，不过这个方法只使用了一个结束的标志，用函数返回的observable对源observable进行缓存判断。

### Rx.Observable.prototype.switch

如果使用map方法返回值不是一个简单的值，而是一个observable的话，就会生成一个高阶的observable，也就是在一个observable上的每个value也都是一个observable，这样类似于高阶函数的存在需要将其进行转换为普通的observable。调用这样的observable的switch方法可以做到将高阶observable转换为一般observable。而方法`switchMap`方法可以在进行映射的同时，直接将高阶observable进行降阶。