function pow(base, component) {
    if (base === 0) {
        return 0
    }
    if (component >= 0) {
        return powCore(base, component)
    } else {
        return 1 / powCore(base, -component)
    }
}
function powCore(base, exponent) {
    if (exponent === 0) {
        return 1
    }
    if (exponent === 1) {
        return base
    }
    var result = powCore(base, Math.floor(exponent / 2))
    result *= result
    if (exponent % 2 !== 0) {
        result *= base
    }
    return result
}
console.log(pow(2, 3))
console.log(pow(2, -3))
console.log(pow(-2, 3))
console.log(pow(-2, -3))
console.log(pow(3, 0))
console.log(pow(0, 10))