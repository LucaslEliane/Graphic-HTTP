var count = 0
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
        if (parseInt(arr[i]) >= flag) {
            rightArr.push(arr[i])
        } else {
            leftArr.push(arr[i])
        }
    }
    leftArr.push(arr[0])
    return quickSort(leftArr).concat(quickSort(rightArr))
}
function arraySum(arr, n) {
    arr = quickSort(arr)
    var center = Math.ceil(n / 2)
    return sum(arr, center, n)
}
function sum(arr, center, n) {
    if (n == 0) {
        count++
        return
    }
    if (n < 0) {
        return
    }
    var theArr = [].concat(arr)
    while(theArr.length != 0) {
        var theNum = theArr.slice(0)[0]
        theArr = theArr.slice(1, theArr.length)
        debugger
        sum(theArr, center, n - theNum)
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
    inputArray.push(input);
    if (line % 2 === 1) {
        var n = parseInt(inputArray[0].split(" ")[1])
        var numberArray = inputArray[1].split(" ")
        for (var i = 0; i < numberArray.length; i++) {
            numberArray[i] = parseInt(numberArray[i])
        }
        arraySum(numberArray, n)
        console.log(count)
        count = 0
        inputArray = []
    }
	line ++;
});