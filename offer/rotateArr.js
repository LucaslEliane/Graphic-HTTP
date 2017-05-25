function findRotate(arr) {
    var length = arr.length
    var start = 0
    var end = length - 1
    while (end - start !== 1) {
        if (arr[start] < arr[end]) {
            return arr[start]
        }
        var middle = Math.ceil((start + end) / 2)
        if (arr[start] === arr[end] && arr[start] === arr[middle]) {
            return findInOrder(arr, start, end)
        }
        if (arr[start] === arr[end]) {
            start++
            continue
        }
        arr[start] > arr[middle] ? ( end = middle ) : ( start = middle )
    }
    return arr[start + 1]
}

function findInOrder(arr, start, end) {
    for (var i = start; i < end; i++) {
        if (arr[i] < arr[i - 1]) {
            return arr[i]
        }
    }
    return arr[end]
}

var a = [3, 4, 5, 1, 2]
var b = [3, 4, 5, 1, 2, 2, 2, 3]
var c = [1, 0, 1, 1, 1]
var d = [1, 1, 1, 0, 1]

console.log(findRotate(a))
console.log(findRotate(b))
console.log(findRotate(c))
console.log(findRotate(d))