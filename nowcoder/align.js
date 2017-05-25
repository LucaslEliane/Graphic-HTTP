function fullAlign(arr, n, nowArr, i, k, count) {
    var tempArray = nowArr.concat()
    if (+n === 1) {
        arr[0] > tempArray[tempArray.length - 1] ? --k : --i
        if (i < 0 || k < 0) {
            return;
        }
        count.push(1)
        return;
    }
    for (var j = 0; j < n; j++) {
        var temp = arr.concat()
        var num = temp[j]
        temp[j] = temp[n-1]
        temp[n-1] = num
        temp.splice(-1)
        tempArray.push(arr[j])
        if (tempArray.length > 1) {
            if (tempArray[tempArray.length - 2] > tempArray[tempArray.length - 1]) {
                fullAlign(temp, n - 1, tempArray, i - 1, k, count)
            } else {
                fullAlign(temp, n - 1, tempArray, i, k - 1, count)
            }
        } else {
            fullAlign(temp, n - 1, tempArray, i, k, count)
        }
        tempArray = nowArr.concat()
    }
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
    inputArray = input.split(" ");
    var i = inputArray[0]
    var k = inputArray[1]
    var count = []
    var arr = []
    for (var a = 0; a < i; a++) {
        arr.push(a+1)
    }
    fullAlign(arr, i, [], i-k-1, k, count)
    console.log(count.length % 2017)
	line ++;
});