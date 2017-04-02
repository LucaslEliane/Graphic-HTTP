

## 关于this

### 对于this的误解

* 指向自身

`this`并不是指向函数自身的：
```
function foo(num) {
  console.log("foo:" + num);
  this.count++;
}
foo.count = 0;
for (let i=0; i<10; i++) {
  foo(i)
}
foo.count // 0
```
由于`this`的指向和函数的调用方式有关，所以在这种全局调用方式上，会导致在调用的时候，创建一个新的全局对象，而不是指向函数本身。

* this的作用域

第二个误解是`this`指向函数的作用域。`this`在任何情况下都不指向函数的词法作用域。在JavaScript内部，作用域和对象类似，可见的标识符都是它的属性。

* this到底是什么

`this`是在运行的时候绑定的，并不是在编写的时候绑定的，其上下文取决于函数调用时候的各种条件。函数被被调用的时候，会创建一个执行上下文，这个记录会包含函数在哪里被调用、函数的调用方法、传入的参数等信息。

### this全面解析

#### 调用位置

调用位置就是函数在代码中被调用的位置。也就是上一级的调用栈。

#### 绑定规则

* 默认绑定

最常用的函数调用：独立函数调用。如果使用严格模式，那么全局对象将无法使用默认绑定，所以`this`会绑定到`undefined`。

* 隐式绑定

另外一条需要考虑的规则是调用位置是否有上下文，或者被某个对象拥有或者包含。当函数引用有上下文对象的时候，隐式绑定规则会把函数调用中的`this`绑定到这个上下文对象。*对象属性引用链中只有最顶层或者是最后一层会影响调用位置*。

隐式丢失：一个最常见的`this`绑定问题就是被隐式绑定的函数会丢失绑定对象，也就是其会被转换为默认绑定。因为`this`的绑定仅仅和调用的上下文有关，即使其是被赋值的。

并且在函数作为参数进行了传递之后，参数传递相当于一次隐式赋值，参数也会在传递的作用域内进行一次全局的隐式绑定。

```
function foo() {
  console.log(this.a)
}
var obj = {
  foo,
  a: 2
}
var bar = obj.foo
var a = "oops, global"
bar() // oops, global
```

* 显式绑定

`Function.prototype.call`和`Function.prototype.apply`两个方法可以将元素绑定到函数的`this`上面，实现手动的绑定，如果需要实现硬绑定的话，可以使用`Function.prototype.bind()`方法，这个方法类似于：
```
function bind(fn, obj) {
  return function() {
    return fn.apply(obj, arguments)
  }
}
```

* `new`绑定

使用`new`来调用一个构造函数的时候(严格意义上，JavaScript是没有构造函数的，仅仅是对很熟的构造调用)，这个新对象对绑定到函数调用的`this`。

使用`new`来调用`foo()`的时候，我们会构造一个新的对象，并且将其绑定到`foo()`调用中的`this`

### 优先级

优先级排序是这样的：
*new绑定 > 显式绑定 > 隐式绑定 > 默认绑定*

### 例外

* 如果`null`或者`undefined`这种作为绑定对象传入到`call`、`apply`或者`bind`，这些值在调用的时候会被忽略，实际应用的是默认绑定规则。为了防止这样的情况发生，可以创建一个空的非委托对象，来传入到绑定中，而不使用`null`或者`undefined`。

* 间接引用，赋值表达式`p.foo = o.foo`的返回值是目标函数的引用，因此调用位置是`foo()`而不是`p.foo()`或者`o.foo()`。所以会应用默认绑定。对于默认绑定来说，决定`this`绑定对象的不是调用位置是否处于严格模式，而是函数体是否处于严格模式。

* 软绑定，使用硬绑定之后会导致无法使用隐式绑定或者显式绑定来修改`this`，如果可以给默认绑定指定一个全局对象和`undefined`意外的值，那就可以实现和硬绑定相同的效果，同时保留隐式绑定或者显式绑定修改`this`的能力。

```
if(!Function.prototype.softBind) {
  Function.prototype.softBind = function(obj) {
    var fn = this;
    var curried = [].slice.call(arguments, 1)
    // [].slice.call(arguments)可以将arguments类数组对象转换为数组
    var bound = function() {
      return fn.apply(
        (!this || this === (window || global)) ? obj : this,
        curried.concat.apply(curried. arguments)
      );
    };
    bound.prototype = Object.create(fn.prototype);
    return bound;
  }
}
```
### `this`词法

箭头函数不使用`this`的四种标准规则，而是根据外层作用域来决定`this`。并且箭头函数的绑定是无法修改的。箭头函数可以像硬绑定一样将`this`绑定到一个指定的对象上，在ES6之前的回调函数使用绑定的时候，需要首先将`this`进行赋值再传递进去。

```
function foo() {
  // ES5
  var self = this;
  setTimeout(function() {
    console.log(self.a)
  }, 100)
  // ES6
  setTimeout(() => {
    console.log(this.a)
  }, 100)
}
```

## 对象

### 语法

对象可以通过两种形式定义：声明形式(字面量)和构造形式(new 关键字)。

### 类型

对象是JavaScript的基础，JavaScript共有六种主要类型：`string`,`number`,`boolean`,`null`,`undefined`,`object`。

简单基本类型本身不是对象。`null`有时会被当作一种对象类型，但是其本身是基本类型。

JavaScript中有许多特殊的对象子类型，可以称为复杂基本类型，函数就是对象的一个子类型。所以可以像操作其他对象一样操作函数。数组也是对象的一种子类型。

JavaScript中还有一些对象子类型，通常被称为内置对象。`String`,`Number`,`Boolean`,`Object`,`Function`,`Array`,`Date`,`RegExp`,`Error`。实际上，这些内置对象都只是一些内置函数。这些内置函数可以当做构造函数。

原始值`"I am a String"`并不是一个对象，只是一个字面量，并且是一个不可变的值。如果要在这个字面量上执行一些操作，那需要将其转换为`String`对象。在JavaScript中，引擎会自动把字面量转换成`String`对象，所以可以访问属性和方法。数值字面量也是一样的。

而对于`Object`,`Array`,`Function`,`RegExp`来说，无论使用文字形式还是构造形式，它们都是对象，不是字面量。

### 内容

内容的访问方式有两种，属性访问和键访问。大部分情况下这两种访问方式都是可以的，除非属性的名字不符合命名规范，这时候就需要使用键访问。并且如果需要动态生成每个属性的名字，也需要使用键访问，用变量作为属性键值。并且对象的属性名永远都是字符串，即使其是数字也会被转换为字符串。

#### 数组

数组也支持`[]`访问形式，但是数组有着更加结构化的值存储机制。仍然可以给数组添加一个属性，并且这个属性不会使数组的长度发生变化，如果这个属性名看起来像是一个数字，那么会变成一个数值下标，使数组长度发生变化。

复制对象：JavaScript初学者最常见的问题之一就是如何复制一个对象。对于浅复制，ES6提供了`Object.assign()`的方法来实现浅复制，这个浅复制提供了可以将多个源对象的所有可枚举的自有键进行复制。

或者使用`var newObj = JSON.parse(JSON.stringify(someObj))`来进行复制，这样需要保证对象是JSON安全的，所以只适用于部分情况。并且这种方法只能复制属性，不能够复制对象的方法。

#### 属性描述符

在ES5开始，所有的属性都有了属性描述符。`Object.getOwnPropertyDescriptor(myObject, "a")`，会显示到每个属性的属性描述符，包含了针对一个属性的访问特性。这个普通的对象包含`value`,`writable`(可写),`enumerable`(可枚举),`configurable`(可配置)。在创建普通属性时属性描述符会使用默认值，也可以使用`Object.defineProperty()`来添加一个新属性或者修改一个已有属性，并且对特性进行设置。

* `Writable`：决定是否可以修改属性的值。如果对`Writable`值为`false`的属性进行修改的话，会静默修改失败，并且在严格模式下会抛出一个类型错误。也就是不可改变的属性。

* `Configurable`：表示属性是否可以配置，如果属性是可以配置的，就可以使用`defineProperty`方法来修改属性描述符。如果不可配置的话，还会禁止删除这个属性。

* `Enumerable`：判断这个属性是否会出现在对象的属性枚举中，比如说`for..in`循环。自定义的属性一般都是可以进行枚举的。

#### 不变性

1. 对象常量：结合`writable:false`和`configurable:false`就可以创建一个真正的常量属性。

2. 禁止扩展：如果想要禁止一个对象添加新的属性并且保留已有属性，使用`Object.preventExtensions()`

3. 密封：`Object.seal()`会创建一个密封的对象，这个方法实际上会在一个现有对象上调用`Object.preventExtensions()`并且将所有现有属性标记为`configurable:false`。

4. 冻结：`Object.freeze()`会创建一个冻结对象，这个方法实际上会在一个现有对象上调用`Object.seal()`并且将所有的数据访问属性标记为`writable:false`。并且其引用的其他对象并不会被冻结。

#### [[Get]]

属性访问并不仅仅是在对象中查找名字为`a`的属性，而实际上是实现`[[Get]]`操作，对象默认的内置`[[Get]]`操作首先在对象中查找是否有名称相同的属性，如果找到就会返回这个属性的值。如果没有的话，按照其算法定义会遍历可能存在的`[[prototype]]`链，也就是原型链。但是这样不知道是操作返回了`undefined`还是变量不存在。

#### [[Put]]

`[[Put]]`被触发的时候，实际行为取决于许多因素，包括对象中是否存在这个属性。

1. 属性是否是访问描述符，并且存在`setter`就调用`setter`。

2. 属性数据描述符中`writable`是否是`false`。

3. 如果都不是，将该值设置为属性的值。

#### Getter和Setter

对象默认的`[[Put]]`和`[[Set]]`操作分别可以控制属性值的设置和获取。

在ES5中可以使用`getter`和`setter`部分改写默认操作，但是只能应用在单个属性上，无法应用在整个对象上。`getter`是一个隐藏函数，会在获取属性值的时候调用。`setter`也是一个隐藏函数，会在设置属性值时调用。

#### 存在性

`obj.a`的属性访问返回值可能是`undefined`，但是这个值有可能是属性中存储的`undefined`，也可能是因为属性值不存在返回的`undefined`。

使用`in`操作符可以检查属性是否在对象及其`[[prototype]]`的原型链中，而`hasOwnProperty()`只会检查属性是否在对象上，不会检查原型链，所有的普通对象都可以使用`hasOwnProperty()`来访问自有属性，除了没有连接到`Object.prototype`的对象，这时候可以使用显式绑定来绑定对象`Object.prototype.hasOwnProperty.call(myObject, "a")`。

#### 枚举

```
var object = {};
Object.defineProperty(
  object,
  "a",
  {
    enumerable: true,
    value: 1
  }
)
Object.defineProperty(
  object,
  "b",
  {
    enumerable: false,
    value: 2
  }
)
// 这里面属性a是可枚举的，所以在for...in循环或者是keys、entries、values等方法中都可以获取
// 并且通过propertyIsEnumerable方法可以查看一个属性是否是可以枚举的
// in和hasOwnProperty的区别在于该属性在不在对象内部，而keys和getOwnPropertyNames都只关注对象直接包含的属性
```

### 遍历

`for...in`循环可以用来遍历对象的可枚举属性列表，并且还会遍历对象的原型链`[[Prototype]]`链。

对于数组来说，`forEach`方法可以针对每个数组元素调用回调函数，`every`直到有一个元素的回调返回`false`的时候终止，而`some`会在遇到有一个元素的回调返回`true`的时候终止。

ES6中的`for..of`循环可以用来遍历数组或者对象的值，但是如果需要遍历对象的话，那么对象需要提前定义一个迭代器。`for..of`循环首先会向被访问的对象请求一个迭代器对象，然后通过调用迭代器对象的`next()`方法来遍历所有的返回值。

也可以手动给对象定义迭代器：
```
var object = {
  a: 2,
  b: 3
}
Object.defineProperty(
  object,
  Symbol.interator,
  {
    enumerable: false,
    writable: false,
    configurable: true,
    value: function() {
      var o = this;
      var idx = 0;
      var ks = Object.keys(o);
      return {
        next: function() {
          return {
            value: o[ks[idx++]],
            done: (idx > ks.length)
          }
        }
      }
    }
  }
)
```
`for..of`循环每次调用`object`迭代器对象的`next()`时，内部的指针都会向前移动并且返回对象属性列表的下标值。

## 对象混合类

### 类理论

面向对象编程强调的是数据和操作数据的行为本质上是互相关联的，因此好的设计就是将数据以及及其相关的属性操作封装起来。

子类和父类之间的继承关系是基于父类对于子类的包含性的，父类的定义较子类来说具有更高的宽泛性，一种父类可能包含有多个子类，每个子类有着父类的全部特征，并且又能够声明自己本身的一些特征，子类的定义就是对通用的父类定义的特殊化。而每个子类实例又有着自己独一无二的性质。

多态性允许子类继承父类的方法，并且将方法针对子类的特殊性进行重写。但是JavaScript中的多态会降低代码的可读性以及健壮性。

### 混入

在继承或者实例化的时候，JavaScript不会自动执行复制机制，因为JavaScript中不存在类，只有对象，而一个对象不会被复制到另外一个对象上，而是会被关联起来。

## 原型

### [[Prototype]]

JavaScript中的对象有一个特殊的值，这个值是针对于其他对象的引用，这个值从对象刚开始创建就存在了，一般不为空，这个值是`[[Prototype]]`。

并且许多语法，包括`in`，`for...in`等都会查找到整个原型链，直到找到相应的属性为止。

#### Object.prototype

所有普通的`[[Prototype]]`链最终都会指向内置的`Object.prototype`。由于所有的普通对象都源于这个`Object.prototype`对象，所以这个对象包含了许多通用的功能。

在进行对象属性的一般赋值的时候，如果该属性不存在于对象本身，而是存在于原型链上层的时候，会出现下面三种情况：

1. 如果在原型链上层存在同名属性，并且其被标记为可写，那么就会直接在该对象上创建一个该属性，并且屏蔽原型链上层的对应属性。

2. 如果原型链上层存在同名属性，但是该属性被标记为只读，那么无法修改已有属性或者创建屏蔽属性。

3. 如果在原型链上层存在同名属性，并且是一个`setter`，那么就会调用这个`setter`，不会添加到该对象上。

如果想要强行设置屏蔽属性的话，需要使用`Object.defineProperty`来进行设置。使用`=`赋值的话是不一定能够设置屏蔽属性的。

### 类

在进行对象实例化的时候，我们初始化了一个对象：
```
function Foo() {
}

Foo.prototype // {}
```
这个原型对象在使用`new Foo()`创建新的对象的时候，会被链接到新对象的圆形脸上面：
```
function Foo(){
}
var a = new Foo()
Object.getPrototypeOf(a) === Foo.prototype  // true
```
也就是说，如果使用一个对象来构建更多的其他对象，那么这些对象都会将该对象引用到自己的原型链上面。


#### 原型继承

```
function Foo(name) {
  this.name = name
}

Foo.prototype.myName = function() {
  return this.name
}

function Bar(name, label) {
  Foo.call(this, name)
  this.label = label
}

// Bar.prototype = Foo.prototype 错误，这样修改Bar.prototype的时候会直接修改到Foo的原型
// Bar.prototype = new Foo() 可以，因为是创建了一个新的对象，并且将这个对象绑定到Bar的原型上，但是如果Foo函数有副作用的话，就会有一定的影响

Bar.prototype = Object.create(Foo.prototype)
Object.setPrototypeOf(Bar.prototype, Foo.prototype)
```

那么如果需要查找某个对象的祖先(在JavaScript中称为内省或者反射)