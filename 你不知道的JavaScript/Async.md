## 异步和性能

### 异步

#### 分块的程序

事件循环：循环的每一轮称为一个tick，对于每个tick而言，如果在队列中有等待的事件，那么就会从队列中摘下一个事件并且执行，这些事件就是回调函数。事件队列一般是严格执行的，不存在插入队列中间的情况。

#### 并行线程

事件循环将自身的工作分成一个个任务并且顺序执行，不允许对共享内存的并行访问和修改。通过分立线程中彼此合作的事件循环，并行和顺序执行可以共存。

如果两个线程并行执行，并且两个线程共享了同一个变量，那么执行顺序会导致结果出现很多种不同的情况。但是JavaScript是单线程的，所以回调的执行是具有原子性的，两个不同的回调的执行顺序只会导致出现两个不同的结果。

#### 事件循环

在发出一个异步请求之后，需要在一个函数内部设置好相应的代码，然后引擎会通知宿主环境，并且在异步请求完成了之后，将回调函数挂载到事件循环上，每一个tick中，事件循环都会从其异步回调的队列中拿出一个事件，并且进行执行。

而`setTimeout`在定时器到达时间之后，环境会将你的回调函数放在事件循环中，在未来的某个tick上就会将这个回调执行，这样只能保证回调函数在指定的时间之后执行，但是不能保证稳定的执行时间。

#### 并发

两个或者多个进程在同一个程序里面并发的交替执行一些任务，如果这些任务之间彼此不相关，那么就不一定需要交互。如果进程之间没有相互影响的话，那么不确定性是完全可以接受的。

但是如果并发的进程需要各种各样的交流的话，就需要对其交互进行协调来避免竞态的出现。

##### 并发协作

并发协作的重点是处理长期运行的进程，并且是这个进程分割成多个步骤或者多批任务，使得其他并发进程有机会将自己的运算插入到事件循环队列中交替运行。

如果有一个需要遍历很长的结果列表进行值转换的Ajax响应处理函数，为了防止其不阻塞其他进程，可以将这些遍历分片进行：

```
var res = [];
function response(data) {
  var chunk = data.splice(0, 1000)  // 每次处理1000条数据
  res = res.concat(       // 针对单块数据进行处理
    chunk.map((val) => {
      return val * 2;
    })
  )
  if (data.length > 0) {    // 将剩余内容继续放入事件循环中
    setTimeout(function() {
      response(data);
    }, 0)
  }
}
```

#### 任务

ES6中的一个新的概念，叫做任务队列，这个概念直接关系着Promise的异步特性。

任务队列是挂在事件循环队列的每一个tick之后的队列。在事件循环的每个tick中，可能出现的异步动作不会导致一个完整的新事件添加到事件循环队列中，而是在当前tick的任务队列末尾添加一个任务。

也就是放在当前tick任务队列中的任务比放在事件循环的下一个tick中的事件要更早执行。

#### 语句顺序

引擎在编译期间执行的都是安全的优化，最后可见的结果都是一样的，不会发生不安全的优化。

### 回调

上一章的例子是将函数当做独立的不可分割的运作单元来使用的。在函数内部以可预测的顺序执行，但是在函数顺序这个层级上，事件的运行顺序是有多种可能的。

#### 省点回调

为了解决一些针对回调函数的信任问题，有些API设计提供了分离回调，在这种设计下，API的出错处理函数failure一般是可选的，如果不提供这个函数的话，那么就可以假定这个错误可以被忽略：
```
function success(data) {
  console.log(data)
}
function failure(err) {
  console.error(err)
}
ajax("http://some.url.1", success, failure)
```
另外一种风格是`error-first 风格`，也就是NodeJS里面的风格，其中回调的第一个参数保留作为错误对象。如果成功的话，这个参数就会被置假。如果产生了错误的结果，那么第一个参数将会被置真。
```
function response(err, data) {
  if (err) {
    console.error(err)
  } else {
    console.log(data)
  }
}
ajax("http://some.url.1", response)
```

### Promise

回调函数的信任问题是有第三方代码导致的，我们可能会将自己的回调函数传递给第三方的异步操作，而第三方的异步操作的行为是不可控的。所以无法完全信任第三方的第一操作，可能会多次调用回调函数等。

使用回调来描述未来值的时候，为了在回调函数中处理未来值，我们会假设这个未来值已经是现在值了。

```
function add(xPromise, yPromise) {
  return Promise.all([xPromise, yPromise])
    .then(function(value) {
      return value[0] + value[1]
    })
}
add(fetchX(), fetchY())
  .then(function(sum) {
    console.log(sum)
  })
```
一旦Promise决议后，就是一个外部不可变的值，可以安全地将这个值传递给第三方，并且确信其不会被有意无意的修改。

#### Promise信任问题

引入异步操作的信任问题，主要因为下面这几个原因：
* 调用回调过早
* 调用回调过晚
* 调用回调次数过多或者过少
* 未能传递所需的环境和参数
* 吞掉可能出现的错误和异常

##### 调用过早

是为了防止同步代码被立即调用，导致竞态条件。但是在Promise中，即使是立即完成的Promise也没有办法被同步观察到。即使Promise已经决议，但是提供给then的回调也总是会被异步调用的。

##### 调用过晚

Promise创建对象调用resolve或者reject的时候，这个Promise注册的观察回调都会被自动调度。这些被调度的回调在下一个异步事件点上一定会被触发。

一旦一个Promise决议了之后，这个Promise上所有监听的回调都会在下一个异步时间点上依次被立即调用。也就是C无法打断或者抢占B。
```
p.then(() => {
  p.then(() => {
    console.log("C")
  })
  console.log("A")
})

p.then(() => {
  console.log("B")
})
// A B C
```

##### 回调未调用

首先，没有任何东西能阻止Promise向你通知它的决议，如果你对一个Promise注册了一个完成回调和拒绝回调，那么Promise在决议的时候总是会调用其中的一个。

并且可以使用`Promise.race`来传入两个Promise对象，来保证一个输出信号，这样即使你的决议并未完成，也可以得到一个结果。

##### 调用次数过多或者过少

由于Promise只能够被决议一次，所以任何通过then注册的每个回调都只会被调用一次。但是如果主动注册多次回调，那么回调会被调用多次。

##### 未能传递参数/环境值

Promise至多只能有一个决议值。如果没有使用任何显式决议的话，这个值就是`undefined`。获取使用了多个决议参数的话，那么只有第一个参数会被回调使用，其余都会被抛弃。

##### 吞掉错误或异常

如果拒绝一个Promise并且给出一个理由，那么这个值就会被传给拒绝回调。如果在Promise的创建过程或者在查看决议过程中出现了错误的话，这个异常会被捕捉，并且会使这个Promise被拒绝。

如果在处理决议结果的时候出现了异常，那么这个异常将会导致resolve和reject回调都无法进行，这个异常需要使用catch方法来进行捕获并且处理。

#### 链式流

Promise并不只是一个单步执行this-then-that操作的机制。可以将多个Promise连接到一起以表示一系列异步步骤。

* 每次对Promise调用then的时候，都会创建并且返回一个新的Promise
* 不管从then调用的完成回调返回的值是什么。都会被自动设置为被连接Promise的完成

#### Promise模式

* Promise.all：传入几个Promise或者thenable对象，只有当所有的Promise都完成之后才会完成，否则拒绝。如果完成的话，则结果以数组方式传递进去。

* Promise.race：选择第一个完成的Promise来进入完成状态。可以使用这个方法来进行超时检测。

```
Promise.race([
  foo,
  timeoutPromise(3000)
])
.then(
  function() {
    // foo按时完成了
  },
  function(err) {
    // 要么是foo被拒绝了，要么只是没有能够按时完成
  }
)
```

#### Promise的局限性

*Promise链中的错误很容易被无意中默默忽略掉。*

*单一值：Promise只允许给下一个状态传递一个单一的值，所以如果需要传递比较复杂的值的时候是需要封装的。这时候可以使用ES6中的参数解构赋值*

```
var a = Promise.resolve({
  name: {
    firstName: "lucas",
    lastName: "twilight"
  },
  age: 12
})

var b = Promise.resolve(2)

Promise.all([a, b])
  .then(function( [{name, age}, b] ) {
    console.log(b, name, age)
  })

```

*单决议，也就是Promise只能够被决议一次，完成或者拒绝。*

*无法取消的Promise*，也就是在Promise被决议之前，是没有内部方法来将其停止的，必须等到其决议。

### 生成器

#### 打破完整运行

```
var it = foo()
// 构造一个迭代器it来控制这个生成器
// 启动
it.next()
x;    // 2
bar()
x;    // 3
it.next()   // x: 3
```

```
function *foo(x) {
  var y = x * (yield "Hello")
  return y
}
var it = foo(6)
var res = it.next()   // 第一个next(),并不传入任何东西
res.value             // Hello

res = it.next(7)      // 向等待的yield传入7
res.value             // 42
```

第一个`next()`并没有传入调用值，只有暂停的`yield`才能接受这样一个通过`next()`传递的值。并且规范和所有兼容浏览器都会默默丢弃第一个`next`传递的值。

#### 生成器产生值

上面的可迭代的对象叫做迭代器，因为其接口中包含一个`next()`方法。可以通过`for..of`循环来自动调用`Symbol.iterator`函数来构建一个迭代器。也可以手工调用这个函数，然后返回它返回的迭代器。

##### 生成器迭代器

可以将生成器看做一个值的生产者，通过迭代器接口的`next()`调用一次提取出一个值。

严格来说，生成器本身并不是`iterable`，在执行了一个生成器之后，就得到了一个迭代器。

```
function *something() {   // 生成器的迭代器也有一个Symbol.iterator函数，基本上这个函数就是return this
  var nextVal

  while(true) {
    if (nextVal === undefined) {
      nextVal = 1;
    } else {
      nextVal = (3 * nextVal) + 6;
    }

    yield nextVal;
  }
}

for (var a of something()) {  // 这里需要使用函数调用，来获得返回的迭代器
  ...some operate
}
```

*停止生成器*：其实`for..of`循环的异常结束，通常由`break`、`return`或者未捕获异常引起，会向生成器的迭代器发送一个信号使其终止。

`for..of`循环内的`break`会触发生成器里面的`finally`语句，在外部调用生成器的迭代器实例的`return`方法也可以手工终止生成器的迭代器实例。调用`it.return()`之后，会立即终止生成器，并且会运行`finally`语句，并且生成器的迭代器已经被设置为`done:true`，所以循环会在下一个迭代终止。

```
function *something() {
  var nextVal

  while(true) {
    if (nextVal === undefined) {
      nextVal = 1
    } else {
      nextVal = ( 3 * nextVal ) + 6
    }

    yield nextVal
  }
}

var it = something();
for (var v of it) {
  console.log(v)
  if (v > 500) {
    console.log(it.return("clean up!").value)
  }
}
```

#### 异步迭代生成器

如果想要通过生成器来表达同样的任务流控制：

```
// 使用看起来是同步的方式来进行异步操作
function foo(x, y) {
  setTimeout(() => {
    it.next(x + y)    // 在这里恢复生成器的执行
  }, 2000)
}
function *main() {
  try {
    var text = yield foo(11, 12)  // 在这里暂停生成器的执行
    console.log(text)
  } catch (err) {
    console.error(err)
  }
}

var it = main()
it.next()
```

##### 同步错误处理

生成器`yield`的暂停的特性意味着我们不仅能够从异步函数调用得到看似同步的返回值，还可以同步捕获来自这些异步函数调用的错误。

#### 生成器+Promise

```
function foo(x, y) {    // 构建一个返回Promise的操作
  return new Promise(function(resolve, reject) {
    setTimeout(() => {
      resolve(x + y);
    }, 3000)
  })
}

function *main() {
  try {
    var text = yield foo(11, 31)  // yield一个Promise
    console.log(text)
  } catch (err) {
    console.error(err)
  }
}

var it = main()

var p = it.next().value

p.then(
  function(text) {
    it.next(text)     // 在Promise决议之后，调用生成器的next，继续生成器的运行
  },
  function(err) {
    it.throw(err)
  }
)
```

这样手动进行迭代是非常麻烦的，下面这段代码实现了一个自动进行生成器+Promise的自动迭代方法。

```
// 传入一个生成器，并且自动对其进行迭代
function run(gen) {
  var args = [].slice.call( arguments, 1), it;
// 在当前上下文中初始化生成器 
  it = gen.apply( this, args );
// 返回一个promise用于生成器完成 
  return Promise.resolve()
    .then( function handleNext(value){ // 对下一个yield出的值运行
      var next = it.next( value );
      return (function handleResult(next){ // 生成器运行完毕了吗?
      if (next.done) {
        return next.value;
      }
// 否则继续运行 
      else {
        return Promise.resolve( next.value )
          .then(
// 成功就恢复异步循环，把决议的值发回生成器
            handleNext,
// 如果value是被拒绝的 promise， 
// 就把错误传回生成器进行出错处理 
            function handleErr(err) {
              return Promise.resolve(
                it.throw( err )
              )
              .then(handleResult);
            }
          );
        }
      })(next)
  });
}

function foo(x, y) {
  return new Promise(function(resolve, reject) {
    setTimeout(() => {
      resolve(x + y);
    }, 3000)
  })
}

function bar(x, y) {
  return new Promise(function(resolve, reject) {
    setTimeout(() => {
      resolve(x * y);
    }, 3000)
  })
}

function *main() {
  try {
    var text = yield foo(11, 31)
    console.log(text)
    var text1 = yield bar(11, 31)
    console.log(text1)
  } catch (error) {
    console.error(error)
  }
}

run(main)
```

##### 生成器中的Promise并发

在某种情况下，是需要Promise进行并发执行的，比如：在请求两个信息，并且需要使用这两个信息的结果来进行第三个请求的时候，第一个和第二个请求是可以进行并发的。如果按照下面的方法进行实现，会导致第一个和第二个本来可以并发的请求变得不能够并发。

```
function *foo() {
  var r1 = yield request("http://some.url.1")
  var r2 = yield request("http://some.url.2")

  var r3 = yield request(
    "http://some.url.3/?v=" + r1 + "," + r2
  )

  console.log(r3)
}
```

这里可以使用`Promise.all`来进行并发的流程控制。

```
function *foo() {
  var results = yield Promise.all([
    request("http://some.url.1"),
    request("http://some.url.2")
  ])
  var r1 = results[0]
  var r2 = results[1]

  var r3 = yield request(
    "http://some.url.3/?v=" + r1 + "," + r2
  )

  console.log(r3)
}
```

#### 生成器委托

如果需要在一个生成器中调用另外一个生成器，可以使用生成器委托`yield *`。

```
function *foo() {
  console.log("*foo is starting")
  yield 3
  yield 4
  console.log("*foo finished")
}

function *bar() {
  yield 1
  yield 2
  yield *foo()
  yield 5
}

var it = bar()

it.next()
it.next()
it.next()
it.next()
it.next()
```

调用`foo()`创建一个迭代器，然后`yield *`将将迭代器的实例进行控制，并且委托给了`bar`里面的`* foo`迭代器。一旦调用到了`*foo`迭代器，那么控制前将会被委托给内层的迭代器，当内层迭代器被消费完了之后，控制权再还给外层迭代器，类似函数的嵌套运行。

#### 生成器并发

有时候需要实现两个生成器的并发控制，来保证其竞态条件。
```
var res = []

function *reqData(url) {
  var data = yield request(url)

  yield;

  res.push(data)
}

var it1 = reqData("http://some.url.1")
var it2 = reqData("http://some.url.2")
// 同时发起两个Promise
var p1 = it1.next()
var p2 = it2.next()
// 两个Promise的决议实现
p1.then(function(data) {
  it1.next(data)
})
p2.then(function(data) {
  it2.next(data)
})
Promise.all([p1, p2])
  .then(function() {
    it1.next()
    it2.next()
  })
```

编写一个`runAll()`函数，使得传递到该函数中的几个生成器可以并行执行：
```
function runAll(...gens) {

  gens.forEach((value, index) => {
    gens[index] = value()
  })


  return Promise.resolve()
    .then(function handleAll() {
      gens.forEach((value, index) => {
        value.next()
      })
      gens.forEach((value, index) => {
        let promise = value.next().value
        promise.then(function handleRes(res) {
          value.next(res)
        }, function handleErr(error) {
          value.throw(error)
        })
      })
    })
}

var res = [];

runAll(
  function *() {
    var p1 = new Promise(function (resolve, reject) {
      setTimeout(() => {
        resolve(22)
      }, 3000)
    })
    yield;
    res.push(yield p1)
    console.log(res)
  },
  function *() {
    var p2 = new Promise(function (resolve, reject) {
      setTimeout(() => {
        resolve(33)
      }, 3000)
    })
    yield;
    res.push(yield p2)
    console.log(res)
  }
)
```