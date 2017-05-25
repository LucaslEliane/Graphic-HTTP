function minOperate(arr) {
    var sortArr = quickSort(arr)
    var count = 0
    var flagNumber = sortArr[count]

    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === flagNumber) {
            count ++
            flagNumber = sortArr[count]
        }
    }

    return arr.length - count
}
function quickSort(arr) {
    if (arr.length === 1) {
        return arr
    }
    if (arr.length === 0) {
        return []
    }
    var flag = arr[0]
    var leftArr = []
    var rightArr = []
    for (var i = 1; i < arr.length; i++) {
        if (parseInt(arr[i]) > flag) {
            rightArr.push(arr[i])
        } else {
            leftArr.push(arr[i])
        }
    }
    leftArr.push(arr[0])
    return quickSort(leftArr).concat(quickSort(rightArr))
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
        console.log(minOperate(numberArray))
        inputArray = []
    }
	line ++;
});