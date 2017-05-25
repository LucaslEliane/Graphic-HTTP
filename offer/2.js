function repeatNumber(arr) {
    var length = arr.length,
        i = 0,
        repeatArr = []
    if (length === 0 || length ===1) {
        return []
    }

    while(i < length) {
        if (arr[arr[i]] === arr[i]) {
            if (arr[i] !== i) {
                ~repeatArr.indexOf(arr[i]) || repeatArr.push(arr[i])
            }
            i++
        } else {
            var temp = arr[arr[i]]
            arr[arr[i]] = arr[i]
            arr[i] = temp
        }
    }
    return repeatArr
}

var a = [2, 3, 1, 0, 2, 5, 3]

console.log(repeatNumber(a))