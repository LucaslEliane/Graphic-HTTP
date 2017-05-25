// 注释掉的这部分代码可以比较快速的求出3*n的数组，不用排序求出中间n个数的和
// var middleN = function (arr) {
//     var length = arr.length,
//         perLength = length / 3,
//         calOnce = [],
//         calTwice = []
    
//     calOnce = getKArr(arr, perLength)
//     calTwice = getKArr(arr, perLength * 2)

//     return getSum(calOnce) - getSum(calTwice)
// }

// var getSum = function (arr) {
//     var sum = 0
//     for (var i = 0; i < arr.length; i++) {
//         sum += arr[i]
//     }
//     return sum
// }

// var getKArr = function (arr, k) {
//     var leftArr = []
//     var rightArr = []
//     var flag = arr[0]
//     for (var i = 1; i < arr.length; i++) {
//         if (arr[i] >= flag) {
//             rightArr.push(arr[i])
//         } else {
//             leftArr.push(arr[i])
//         }
//     }
//     leftArr.push(flag)
//     if (leftArr.length === k) {
//         return rightArr
//     }
//     if (leftArr.length < k) {
//         return getKArr(rightArr, k - leftArr.length)
//     } else {
//         return rightArr.concat(getKArr(leftArr, k))
//     }
// }



/**
 * 牛牛举办了一次编程比赛,参加比赛的有3*n个选手,每个选手都有一个水平值a_i.现在要将这些选手进行组队,一共组成n个队伍,即每个队伍3人.牛牛发现队伍的水平值等于该队伍队员中第二高水平值。
例如:
一个队伍三个队员的水平值分别是3,3,3.那么队伍的水平值是3
一个队伍三个队员的水平值分别是3,2,3.那么队伍的水平值是3
一个队伍三个队员的水平值分别是1,5,2.那么队伍的水平值是2
为了让比赛更有看点,牛牛想安排队伍使所有队伍的水平值总和最大。
如样例所示:
如果牛牛把6个队员划分到两个队伍
如果方案为:
team1:{1,2,5}, team2:{5,5,8}, 这时候水平值总和为7.
而如果方案为:
team1:{2,5,8}, team2:{1,5,5}, 这时候水平值总和为10.
没有比总和为10更大的方案,所以输出10.
 * 
 * 采用快速排序的思想可以在线性时间内求出当前数组中的第n大的数
 * @param {any} arr 输入一个数组
 * @returns 
 */
function getMaxGroup (arr) {
    var sum = 0
    var length = arr.length
    for (var i = length / 3; i < length; i = i + 2) {
        sum += getK(arr, i + 1)
    }
    return sum
}

var getK = function (arr, k) {
    var leftArr = []
    var rightArr = []
    var flag = arr[0]
    for (var i = 1; i < arr.length; i++) {
        if (arr[i] >= flag) {
            rightArr.push(arr[i])
        } else {
            leftArr.push(arr[i])
        }
    }
    leftArr.push(flag)
    if (leftArr.length === k) {
        return leftArr[k - 1]
    }
    if (leftArr.length < k) {
        return getK(rightArr, k - leftArr.length)
    } else {
        return getK(leftArr, k)
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
        var length = inputArray[0]
        var numberArray = inputArray[1].split(" ")
        for (var i = 0; i < numberArray.length; i++) {
            numberArray[i] = parseInt(numberArray[i])
        }
        console.log(getMaxGroup(numberArray))
        inputArray = []
    }
	line ++;
});