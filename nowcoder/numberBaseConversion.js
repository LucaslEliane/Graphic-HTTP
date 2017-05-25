var STATIC = [0,1,2,3,4,5,6,7,8,9,"A","B","C","D","E","F"]
function numberBaseConversion(n, m) {
    var last = 0
    var division = n
    var result = []
    do {
        last = division % m
        result.push(STATIC[last])
        division = Math.floor(division / m)
    } while (division != 0)
    return result.reverse().join("")
}

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


rl.on('line', function (input) {
    var inputArr = input.split(" ")
    var n = parseInt(inputArr[0])
    var m = parseInt(inputArr[1])
    console.log(numberBaseConversion(n, m))
})