
function minCpu(arr) {
    var maxWeight = 0
    var dp = []
    arr.forEach(function(value, index) { arr[index] = value / 1024 })
    maxWeight = arr.reduce(function(pre, value) { return pre + value}, maxWeight)
    maxWeight = maxWeight / 2
    dp[0] = []
    for (var i = 0; i < maxWeight; i++) {
        dp[0][i] = 0
    }
    for (var i = 1; i < arr.length; i++) {
        dp[i] = []
        for (var j = 0; j <= maxWeight; j++) {
            if (j < arr[i]) {
                dp[i].push(dp[i - 1][j])
            } else {
                dp[i].push(dp[i - 1][j] > ( dp[i - 1][j - arr[i]] + arr[i]) ? dp[i - 1][j] : dp[i - 1][j -arr[i]] + arr[i])
            }        
        }
    }
    var min = dp[arr.length - 1][dp[arr.length - 1].length - 1]
    var max = 0
    maxWeight * 2 - min > min ? (max = maxWeight * 2 - min) : (max = min)
    return max * 1024
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
        console.log(minCpu(numberArray))
        inputArray = []
    }
	line ++;
});