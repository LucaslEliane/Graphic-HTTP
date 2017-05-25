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

function quickSortDinner(arr) {
    if (arr.length === 1) {
        return arr
    }
    if (arr.length === 0) {
        return []
    }
    var flag = arr[0][0]
    var leftArr = []
    var rightArr = []
    for (var i = 1; i < arr.length; i++) {
        if (parseInt(arr[i][0]) >= flag) {
            rightArr.push(arr[i])
        } else {
            leftArr.push(arr[i])
        }
    }
    leftArr.push(arr[0])
    return quickSortDinner(leftArr).concat(quickSortDinner(rightArr))
}

function dinner(tableArr, customerArr) {
    tableArr = quickSort(tableArr)
    customerArr = quickSortDinner(customerArr)
    var maxSum = 0
    for (var i = 0; i < tableArr.length; i++) {
        var maxIndex
        var maxNow = 0
        for (var j = 0; customerArr[j][0] <= tableArr[i]; j++) {
            if (customerArr[j][1] > maxNow) {
                maxNow = customerArr[j][1]
                maxIndex = j
            }
        }
        customerArr[maxIndex][1] = 0
        maxSum += maxNow
        debugger
    }
    return maxSum + 1
}

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var line = 0
var tableLine = 0
var dinnerLine = 0
var tableArr = []
var dinnerArr = []

rl.on('line', function (input) {
    line ++
    if (line == 1) {
        dinnerLine = parseInt(input.split(" ")[1])
        return
    }
    if (line == 2) {
        tableArr = input.split(" ")
        for(var i = 0; i < tableArr.length; i++) {
            tableArr[i] = parseInt(tableArr[i])
        }
        return
    }
    if (line < parseInt(dinnerLine) + 3) {
        dinnerArr.push([parseInt(input.split(" ")[0]), parseInt(input.split(" ")[1])])
    }
    if (line == parseInt(dinnerLine) + 2) {
        console.log(dinner(tableArr, dinnerArr))
        line = 0
        dinnerLine = 0
        tableLine = 0
        tableArr = []
        dinnerArr = []
    }
});