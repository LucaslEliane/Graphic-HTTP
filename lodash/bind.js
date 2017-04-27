// lodash 的bind方法

const WRAP_BIND_FLAG = 1
const WRAP_BIND_KEY_FLAG = 2
const WRAP_PARTIAL_FLAG = 32
const objectCreate = Object.create

var baseCreate = (function() {
  function object() {}
  return function(proto) {
    if (!isObject(proto)) {
      return {}
    }
    if (objectCreate) {
      // 也就是Object.create(proto)，用变量对常用的方法进行缓存，防止进行原型链上的查找
      return objectCreate(proto)
    }
    object.prototype = proto
    var result = new object
    object.prototype = undefined
    return result
  }
}())

function createBind(func, bitmask, thisArg) {
  var isBind = bitmask & WRAP_BIND_FLAG,
      Ctor = (function(Ctor) {
        return function(...args) {
          switch (args.length) {
            case 0: return new Ctor;
            case 1: return new Ctor(args[0]);
            case 2: return new Ctor(args[0], args[1]);
            case 3: return new Ctor(args[0], args[1], args[2]);
            case 4: return new Ctor(args[0], args[1], args[2], args[3]);
            case 5: return new Ctor(args[0], args[1], args[2], args[3], args[4]);
            case 6: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
            case 7: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);          
          }
          var thisBinding = baseCreate(Ctor.prototype),
              result = Ctor.apply(thisBinding, args)
            
          return isObject(result) ? result : thisBinding
        }
      })(func)
  function wrapper() {
    var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func
    return fn.apply(isBind ? thisArg : this, arguments)
  }
  return wrapper
}

function createWrap(func, bitmask, thisArg, partials, holders) {
  // 通过位与来获取是否为BindKey操作
  var isBindKey = bitmask & WRAP_BIND_KEY_FLAG
  // 在不是bindKey的条件下，func参数需要是一个函数
  if (!isBindKey && typeof func != 'function') {
    throw new TypeError('Expected a function')
  }
  var length = partials ? partials.length : 0
  // 获取除了holders 之外的length
  length -= holders ? holders.length : 0

  var result = createBind(func, bitmask, thisArg)

  // 在bind中，createPartial 和 createBind类似，多添加了一个绑定参数的行为
  // 最后的return变为 return apply(fn, isBind ? thisArg : this, args)
  // 其中args参数为 partials的内容以及调用时使用的 arguments相关内容
  result = createPartial(func, bitmask, thisArg, partials)
  
  // 再使用createHybrid来将函数封装，并且将placeholder进行替换
}

/**
 * 获取lodash里面的占位符
 * 
 * @param {any} func 
 * @returns 
 */
function getHolder(func) {
  const object = hasOwnProperty.call(lodash, 'placeholder') ? lodash : func
  return object.placeholder
}


/**
 * 将所有的占位符都替换称为一个内部的占位符，并且返回占位符的下标数组
 * 
 * @param {any} array 
 * @param {any} placeholder 
 */
function replaceHolders(array, placeholder) {
  var index = -1,
      length = array.length,
      resIndex = 0,
      result = []
  
  while (++index < length) {
    var value = array[index]
    if (value === placeholder || value === PLACEHOLDER) {
      array[index] = PLACEHOLDER
      result[resIndex++] = index
    }
  }
}

function bindKey(object, key, ...partials) {
  let holders
  let bitmask = WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG
  if (partials.length) {
    holders = replaceHolders(partials, getHolder(bindKey))
    bitmask |= WRAP_PARTIAL_FLAG
  }
  // 这里面的bitmask是用来区分操作的，使用二进制可以进行操作的任意形式的组合
  // 在这里分别是
  // 1  - _.bind
  // 2  - _.bindKey
  // 32 - _.partial
  return createWrap(key, bitmask, object, partials, holders)
}