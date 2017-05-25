function Point(a, b) {
    var _a = a || 0
    var _b = b || 0

    if ((+a) + 0 !== (+a) || (+b) + 0 !== (+b)) {
        throw new TypeError('arguments must be a number or string which can convert to number')
    }
    return {
        get value() { return {
            a: _a,
            b: _b
        }},
        add: Point.prototype.add
    }
}

Point.prototype.add = function(point) {
    if (point.constructor != this.constructor) {
        throw new TypeError('method add need a legal arguments point')
    }
    return new Point(point.value.a + this.value.a, point.value.b + this.value.b)
}

var point1 = new Point(1, 2)
var point2 = new Point(2, 3)

// console.log(point1.add.toString())
// console.log(point1.__proto__)
// console.log(point2.a)
var point3 = point1.add(point2)
console.log(point3.value.a)