function maxSubArray(arr) {
    var maxSum = parseInt(arr[0])
    var maxNow = maxSum
    for (var i = 1; i < arr.length; i++) {
        if (maxNow <= 0) {
            maxNow = 0
        }
        if (maxNow + parseInt(arr[i]) < maxSum) {
            maxNow = maxNow + parseInt(arr[i])
        } else {
            maxSum = maxNow = maxNow + parseInt(arr[i])
        }
    }
    return maxSum
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
    inputArray.push(input);
    if (line % 2 === 1) {
        var length = inputArray[0]
        var numberArray = inputArray[1].split(" ")
        console.log(maxSubArray(numberArray))
        inputArray = []
    }
	line ++;
});