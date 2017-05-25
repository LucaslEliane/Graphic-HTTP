function cutRopeDy(n) {
    if (n < 2) {
        return 0
    }
    if (n === 2) {
        return 2
    }
    if (n === 3) {
        return 3
    }
    var maxArray = [0, 0, 2, 3]
    for (var i = 4; i <= n; i++) {
        var max = 0
        for (var j = 1; j <= Math.floor(n / 2); j++) {
            var result = maxArray[i - j] * maxArray[j]
            result > max && (max = result)
        }
        maxArray.push(max)
    }
    return maxArray[n]
}

console.log(cutRopeDy(10))