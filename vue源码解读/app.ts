type Options = {
  data: any
}

type Callback = () => null

var targetStack: Array<Watcher> = []

class Dep {
  subs: Array<Watcher>
  targetStack: Array<Watcher>
  constructor () {
    this.subs = []
  }
  addSub (sub: Watcher) {
    this.subs.push(sub)
  }
  notify () {
    this.subs.forEach(sub => sub.update())
  }
}

function defineReactive (obj: Object, key: string, val: any) {
  var dep = new Dep()
  var childObj = observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: () => {
      if (targetStack.length) {
        targetStack.forEach(
          value => dep.addSub(value)
        )
        targetStack = []
      }
      return val
    },
    set: newVal => {
      childObj = observe(newVal)
      var value = val
      if (newVal === value) {
        return
      }
      val = newVal
      dep.notify()
    }
  })
}

function observe (value: Object) {
  if (!value || typeof value !== 'object') {
    return
  }
  return new Observer (value)
}

class Observer {
  _value: Object
  constructor (value) {
    this._value = value
    this.walk(this._value)
  }
  walk(value: Object) {
    Object.keys(value).forEach(
      key => this.convert(key, value[key])
    )
  }
  convert(key: string, val: any) {
    defineReactive(this._value, key, val)
  }
}

function pushTarget (_target: Watcher) {
  targetStack.push(_target)
}

class Watcher {
  _vm: Vue
  _data: string
  _cb: Callback
  _value: Object
  constructor (vm: Vue, expOrFn: string, cb: Callback) {
    this._vm = vm
    this._data = expOrFn
    this._cb = cb
    this._value = this.get()
  }
  get () {
    pushTarget(this)
    const value = this._vm._data[this._data]
    return value
  }
  update () {
    this.run()
  }
  run () {
    const value = this.get()
    if (value !== this._value) {
      this._value = value
      this._cb.call(this._vm)
    }
  }
  teardown () {

  }
}


class Vue {
  $options: Object
  _data: any
  _ob: Observer
  constructor (options: Options) {
    this.$options = options
    this._data = options.data || {}
    this._ob = observe(this._data)
  }
  $watch (expOrFn: string, cb) {
    const vm = this
    const watcher = new Watcher(vm, expOrFn, cb)
    return function unWatchFn () {
      watcher.teardown()
    }
  }
  _proxy(key) {
    var self = this
    Object.defineProperty(self, key, {
      configurable: true,
      enumerable: true,
      get: function proxyGetter () {
        return self._data[key]
      },
      set: function proxySetter (val) {
        self._data[key] = val
      }
    })
  }
}

const v = new Vue({
  data: {
    a: 1,
    b: 2
  }
})

v.$watch("a", () => console.log("$watch a 成功"))
v.$watch("b", () => console.log("$watch b 成功"))
setTimeout(() => {
  v._data.a = 5
  v._data.b = 6
  console.log(`v.a = ${v._data.a}, v.b = ${v._data.b}`)
}, 2000)
