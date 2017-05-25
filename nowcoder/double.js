function double (arr) {
    if (arr.length === 1 || arr.length === 0 || !arr) {
        return 'NO'
    }
    var max = getMax(arr)
    var maxStr = max.toString(2)
    var maxLength = maxStr.length
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] !== max) {
            var arrStr = arr[i].toString(2)
            var arrLength = arrStr.length
            // var zeroArr = new Array(maxStr.length - arrStr.length)
            // zeroArr.fill(0)

            for (var j = 0; j < maxLength - arrLength; j++) {
                arrStr += '0'
            }
            // arrStr += zeroArr.join('')
            if (arrStr !== maxStr) {
                return 'NO'
            }
        }
    }
    return 'YES'
}

function getMax (arr) {
    var max = 0
    for (var i = 0; i < arr.length; i++) {
        arr[i] > max && ( max = arr[i] )
    }
    return max
}

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var input = ""
var inputArray = []
var line = 0

rl.on('line', function (input) {
    line++
    if (line === 2) {
        var arr = input.split(' ')
        for (var i = 0; i < arr.length; i++) {
            arr[i] = parseInt(arr[i])
        }
        console.log(double(arr))
        line = 0
    }
});