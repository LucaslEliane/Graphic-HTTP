## CommonJS

### 概述

根据CommonJS模块规范，每一个文件就是一个模块，有着其自己的作用域。全局内容需要使用`global`对象来进行设置。

CommonJS规范规定，每一个模块内部，`module`变量代表着当前的模块。这个变量的`module.exports`属性是该模块对外部的接口。加载这个模块就是加载模块的`module.exports`属性。

模块可以进行多次加载，但是只有在第一次加载的时候运行一次，之后的加载使用其缓存。

### module对象

在每一个模块内部，都有着一个`module`对象，来代表着当前的模块。

> module.id:模块的识别符，通常是带有绝对路径的模块文件名。

> module.filename:模块的文件名，带有绝对路径。

> module.loaded:返回一个bool值，表示模块是否加载过。

> module.parent:返回一个对象，表示调用了该模块的模块。

> module.children:返回一个数组，表示该模块要用到的模块。

> module.exports:表示模块对外部的输出。

#### exports变量

为了方便起见，Node为每个模块提供了一个`exports`变量，这个变量是指向的`module.exports`的，也就是在导出的时候可以使用`exports.area = function() {}`来进行模块导出。

### AMD与CommonJS规范的兼容性

CommonJS加载模块是同步加载的，由于文件大部分都存储在服务器端本身，所以对于同步加载代码没有什么太多的性能限制。因此AMD规范主要适用于浏览器端环境。

AMD规范允许输出模块兼容CommonJS规范：
```
define(function (require, exports, module) {
  var someModule = require("someModule")
  var anotherModule = require("anotherModule")

  someModule.doTehAwesome()
  anotherModule.doMoarAwesome()

  exports.aspload = function () {
    someModule.doTehAwesome()
    anotherModule.doMoarAwsome()
  }
})
```

### require命令

Node适用CommonJS的模块规范，内置的`require`命令用于加载模块文件。`require`命令的基本功能是，读入并且执行一个JavaScript文件，然后返回这个文件的`exports`对象。

在模块进行加载的过程中，会根据引用的路径进行查找，一般来说，如果不添加后缀名的文件会被默认为`.js`格式的文件，如果不能解析则自动切换后缀进行解析。如果参数字符串以`./`或者`/`这种路径形式开头，那么会自动寻找文件，如果不是，那么会在node的环境中进行查找。以依赖模块的形式进行加载。

## AMD

由于CommonJS的同步加载特性，将其用于浏览器端环境会导致脚本被阻塞，这样严重影响了浏览器端的用户体验。

`require.js`是AMD规范的最佳实践，当采用require.js进行浏览器端依赖处理的时候，使用：
```
require(['moduleA', 'moduleB', 'moduleC'], function (moduleA, moduleB, moduleC) {
  // code
})
```
来进行模块的异步加载。

回调函数内部的代码会阻塞，知道几个模块异步加载完毕后才会执行。并且也可以使用`require.config`方法指定需要异步加载的模块的位置：
```
require.config({
  paths: {
    "jquery": "./lib/jquery.js",
    "bootstrap": "https://cdn/bootstrap.min.js"
  }
})
```

### 对于规范模块

针对有依赖的AMD规范模块：
```
define(['lib'], function(lib) {
  function foo() {}
  return {
    foo: foo
  }
})
```

## CMD

CMD主要的和AMD的区别在于：

1. CMD推崇懒加载，所有的模块都是延迟执行的

2. CMD推崇依赖就近加载，AMD推崇依赖进行前置

```
// CMD
define(function(require, exports, module) {
  var a = require('./a')
  a.doSomething()
  // some code
  var b = require('./b')
  b.doSomething()
  // some code
})
```

## ES6和CommonJS

由于babel、webpack等工具的出现以及Node的普及，现在基本上requirejs和seajs已经使用的很少了，客户端模块使用webpack将所有分离的模块打包成一个或者几个文件。而服务器端有支持CommonJS的Node的模块加载方式，JavaScript的模块加载方法也发生了很大的变化。

### import和require的区别

实际上来说，这两者的区别应该就是ES6 Module和 CommonJS的区别。

其中最主要的区别在于两点：

1. ES6模块特有的`export default`关键字，这种默认的模块导出方法，可以直接使用`import a from 'a'`来进行加载，而CommonJS必须要导出成一个对象模块。

2. ES6模块导入的模块是强绑定的，导入之后不会因为原本的模块被修改而修改，而CommonJS是普通的值传递或者引用传递，当原本的模块被修改了，那么引入的模块也会被相应地修改。