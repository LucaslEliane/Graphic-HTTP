var targetStack = [];
var Dep = (function () {
    function Dep() {
        this.subs = [];
    }
    Dep.prototype.addSub = function (sub) {
        this.subs.push(sub);
    };
    Dep.prototype.notify = function () {
        this.subs.forEach(function (sub) { return sub.update(); });
    };
    return Dep;
}());
function defineReactive(obj, key, val) {
    var dep = new Dep();
    var childObj = observe(val);
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function () {
            if (targetStack.length) {
                targetStack.forEach(function (value) { return dep.addSub(value); });
                targetStack = [];
            }
            return val;
        },
        set: function (newVal) {
            childObj = observe(newVal);
            var value = val;
            if (newVal === value) {
                return;
            }
            val = newVal;
            dep.notify();
        }
    });
}
function observe(value) {
    if (!value || typeof value !== 'object') {
        return;
    }
    return new Observer(value);
}
var Observer = (function () {
    function Observer(value) {
        this._value = value;
        this.walk(this._value);
    }
    Observer.prototype.walk = function (value) {
        var _this = this;
        Object.keys(value).forEach(function (key) { return _this.convert(key, value[key]); });
    };
    Observer.prototype.convert = function (key, val) {
        defineReactive(this._value, key, val);
    };
    return Observer;
}());
function pushTarget(_target) {
    targetStack.push(_target);
}
var Watcher = (function () {
    function Watcher(vm, expOrFn, cb) {
        this._vm = vm;
        this._data = expOrFn;
        this._cb = cb;
        this._value = this.get();
    }
    Watcher.prototype.get = function () {
        pushTarget(this);
        var value = this._vm._data[this._data];
        return value;
    };
    Watcher.prototype.update = function () {
        this.run();
    };
    Watcher.prototype.run = function () {
        var value = this.get();
        if (value !== this._value) {
            this._value = value;
            this._cb.call(this._vm);
        }
    };
    Watcher.prototype.teardown = function () {
    };
    return Watcher;
}());
var Vue = (function () {
    function Vue(options) {
        this.$options = options;
        this._data = options.data || {};
        this._ob = observe(this._data);
    }
    Vue.prototype.$watch = function (expOrFn, cb) {
        var vm = this;
        var watcher = new Watcher(vm, expOrFn, cb);
        return function unWatchFn() {
            watcher.teardown();
        };
    };
    Vue.prototype._proxy = function (key) {
        var self = this;
        Object.defineProperty(self, key, {
            configurable: true,
            enumerable: true,
            get: function proxyGetter() {
                return self._data[key];
            },
            set: function proxySetter(val) {
                self._data[key] = val;
            }
        });
    };
    return Vue;
}());
var v = new Vue({
    data: {
        a: 1,
        b: 2
    }
});
v.$watch("a", function () { return console.log("$watch a 成功"); });
v.$watch("b", function () { return console.log("$watch b 成功"); });
setTimeout(function () {
    v._data.a = 5;
    v._data.b = 6;
    console.log("v.a = " + v._data.a + ", v.b = " + v._data.b);
}, 2000);
