function factorialZero(n) {
    var zero = 0
    var five = n
    do {
        five = Math.floor(five / 5)
        zero += five
    } while (five != 0)
    return zero
}

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var input = ""

rl.on('line', function (input) {
    var num = parseInt(input)
    console.log(factorialZero(num))
})