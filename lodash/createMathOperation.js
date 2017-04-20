/**
 * 将函数类型转换为其源代码
 * 
 * @param {any} func 
 * @returns 
 */

const funcToString = Function.prototype.toString

function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func)
    } catch (e) {}

    try {
      return `${ func }`
    } catch (e) {}
  }
  return ''
}



/**
 * 在有问题的环境下修复toStringTag符号，主要针对Symbol、null、undefined进行处理
 * 
 * @param {any} value 
 * @returns 
 */

const objectProto = Object.prototype
const hasOwnProperty = objectProto.hasOwnProperty
const toString = objectProto.toString
// Symbol.toStringTag用于创建对象的默认字符串描述，由Object.prototype.toString()进行内部访问
const symToStringTag = typeof Symbol != 'undefined' ? Symbol.toStringTag : undefined

function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? '[object Undefined]' : '[object Null]'
  }
  // 判断环境中是否存在Symbol类型，如果不存在的话，则直接返回其toString得到的类型
  if (!(symToStringTag && symToStringTag in Object(value))) {
    return toString.call(value)
  }
  // 在存在Symbol的情况下，检测源对象中是否自有Symbol.toStringTag符号
  const isOwn = hasOwnProperty.call(value, symToStringTag)
  // 获得元素的该符号
  const tag = value[symToStringTag]
  let unmasked = false
  try {
    // 尝试将其赋值为undefined，从而判断是否是不可以覆盖的
    value[symToStringTag] = undefined
    unmasked = true
  } catch (e) {}
  const result = toString.call(value)
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag
    } else {
      delete value[symToStringTag]
    }
  }
  return result
}

const dataViewTag = '[object DataView]'
const mapTag = '[object Map]'
const objectTag = '[object Object]'
const promiseTag = '[object Promise]'
const setTag = '[object Set]'
const WeakMapTag = '[object WeakMap]'

const dataViewCtorString = toSource(DataView)
const mapCtorString = toSource(Map)
const promiseCtorString = toSource(Promise)
const setCtorString = toSource(Set)
const weakMapCtorString = toSource(WeakMap)

let getTag = baseGetTag

// 判断环境下是否有其支持的可以直接获取的变量类型，并且进行修复
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (getTag(new Map) != mapTag) ||
    (getTag(Promise.resolve()) != promiseTag) ||
    (getTag(new Set) != setTag) ||
    (getTag(new WeakMap) != WeakMapTag)) {

  getTag = (value) => {
    const result = baseGetTag(value)
    // 如果获取的是默认的Object类型的标志，则
    const Ctor = result == objectTag ? value.constructor : undefined
    const ctorString = Ctor ? toSource(Ctor) : ''
    // 将构造函数获取的源函数和当前元素的构造函数进行比较，相同的话就可以认为是该类型
    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag
        case mapCtorString: return mapTag
        case promiseCtorString: return promiseTag
        case setCtorString: return setTag
        case weakMapCtorString: return WeakMapTag
      }
    }
    return result
  }

}
/**
 * 判断一个值的类型是否为Symbol
 * 
 * @param {any} 需要判断的值 
 * @returns 
 */
function isSymbol(value) {
  const type = typeof value
  return type == 'symbol' || (type == 'object'
    && value != null
    && getTag(value) == '[object Symbol]')
} 




/**
 * 将任意类型内容转换为字符串
 * 
 * @param {any} 需要转换的值 
 * @returns 
 */

const INFINITY = 1 / 0
// 判断是否存在Symbol类型，如果有的话，那么就获取原型上的toString方法，将Symbol转换为字符串
const symbolProto = Symbol ? Symbol.prototype : undefined
const symbolToString = symbolProto ? symbolProto.toString : undefined

function baseToString(value) {
  if (typeof value == 'string') {
    return value
  }
  if (Array.isArray(value)) {
    // Array.prototype.map返回一个新的数组，使用模板字符串可以将数组转化为扁平的字符串
    return `${ value.map(baseToString) }`;
  }
  if (isSymbol(value)) {
    // 将Symbol类型转换为字符串，如果没有Symbol的原型，就返回一个空字符串
    return symbolToString ? symbolToString.call(value) : ''
  }
  // 除了上面三种情况，剩余的可以直接通过模板字符串来转换为一般字符串
  const result = `${ value }`
  // 针对0做出特殊处理，来判断0的正负，将其和自己定义的INFINITY进行比较
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result
}

const NAN = 0 / 0

function baseToNumber(value) {
  if (typeof value == 'number') {
    return value
  }
  if (isSymbol(value)) {
    return NAN
  }
  return +value
}


/**
 * 对于数学运算进行封装，主要进行的是操作数的合法性检测
 * 
 * @param {any} operator 进行的操作方法
 * @param {any} defaultValue 在操作数出现问题的时候的默认值
 * @returns 
 */
function createMathOperation(operator, defaultValue) {
  // 对原来的数学运算函数进行封装
  return (value, other) => {
    let result
    // 当两个操作数都未定义的时候，返回运算的默认值
    if (value === undefined && other === undefined) {
      return defaultValue
    }

    if (value !== undefined) {
      // 左操作数不为undefined，无论如何都会返回result，如果右操作数为undefined，那么就直接返回左操作数
      result = value
    }
    if (other !== undefined) {
      if (result === undefined) {
        // 右操作数不为undefined，左操作数为undefined，operate(undefined, 12)，直接返回右操作数
        return other
      }
      // 在两个值都不是undefined的情况下，如果其中一个是字符串，那么就要将两个都转换为字符串，否则转换为数字
      if (typeof value == 'string' || typeof other == 'string') {
        value = baseToString(value)
        other = baseToString(other)
      } else {
        value = baseToNumber(value)
        other = baseToNumber(other)
      }
      // 如果两者都不是undefined，在格式转换之后可以进行运算并且返回值
      result = operator(value, other)
    }

    return result
  }
}

const add = createMathOperation((augend, addend) => augend + addend, 0)

console.log(add(1, 0))    // 1
console.log(add(1, "This is string")) // 1This is String
console.log(add(8, Symbol("This is Symbol"))) // NAN
console.log(add([1,2,3], ["This", "is", "array"]))  // NAN
console.log(add([1,2,3], 1))  // NAN
console.log(add([1,2,3,[1,2]], "This is String and Array")) // 1,2,3,1,2This is String and Array