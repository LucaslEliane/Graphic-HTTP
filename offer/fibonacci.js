function fibonacci(n) {
    if (n === 0) {
        return 0
    }
    if (n === 1) {
        return 1
    }
    return fibonacci(n - 1) + fibonacci(n - 2)
}

function fibonacciLoop(n) {
    var result
    var nsub1 = 0
    var nsub2 = 0
    for (var i = 0; i <= n; i++) {
        if (i === 0) {
            nsub1 = result = 0
        }
        if (i === 1) {
            nsub2 = result = 1
        }
        result = nsub1 + nsub2
        nsub2 = nsub1
        nsub1 = result
    }
    return result
}

function calculateTime(fn, n) {
    var start = new Date()
    var result = fn(n)
    var end = new Date()
    console.log(`result is ${result}, and time is ${end - start}`)
}

calculateTime(fibonacci, 40)
calculateTime(fibonacciLoop, 40)