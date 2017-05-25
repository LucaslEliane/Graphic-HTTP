function adjustPosition(arr, fn) {
    if (!arr || arr.length === 0 || arr.length === 1) {
        return arr
    }
    var first = 0,
        next = 1
    while (next <= arr.length) {
        while (next <= arr.length) {
            if (fn(arr[first], arr[next])) {
                var temp = arr[first]
                arr[first] = arr[next]
                arr[next] = temp
                first ++
                next = first + 1
            } else {
                next ++
            }
        }
        first ++
        next = first + 1
    }
    return arr
}

function evenOdd(a, b) {
    if (a % 2 === 0 && b % 2 === 1) {
        return true
    }
    return false
}

function oddEven(a, b) {
    if (a % 2 === 1 && b % 2 === 0) {
        return true
    }
    return false
}

console.log(adjustPosition([1,2,3,4,5], oddEven))
console.log(adjustPosition([1,2,2,2,3,4,5,6,7,11,13], oddEven))