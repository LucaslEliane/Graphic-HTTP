var isEven = (function isEven () {
    var evenArray = []
    return function (num) {
        if (~evenArray.indexOf(num)) {
            return true
        }
        for (var i = 2; i < 50 && i < num; i ++) {
            if (Math.ceil(num / i) === num / i) {
                return false
            }
        }
        evenArray.push(num)
        return true
    }
})()

function isAwesome (num) {
    var splitArr = ( num + '' ).split('')
    for (var j = 0; j < splitArr.length - 1; j ++) {
        for (var k = j + 1; k < splitArr.length; k ++) {
            if (splitArr[k] != 0 && splitArr[j] != 0 && ( isEven(splitArr[k] + splitArr[j]) || isEven(splitArr[j] + splitArr[k]))) {
                return true
            }
        }
    }
    return false
}



/**
 * 给出一个区间[a, b]，计算区间内“神奇数”的个数。
神奇数的定义：存在不同位置的两个数位，组成一个两位数（且不含前导0），且这个两位数为质数。
比如：153，可以使用数字3和数字1组成13，13是质数，满足神奇数。同样153可以找到31和53也为质数，只要找到一个质数即满足神奇数。 
 * 
 * @param {any} a 整数a，表示区间的开始
 * @param {any} b 整数b，表示区间的结束
 * @returns 输出为一个整数，表示区间内满足条件的整数个数
 */
function awesome (a, b) {
    var count = 0
    for (var i = a; i <= b; i++) {
        if (isAwesome(i)) {
            count ++
        }
    }
    return count
}

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var input = ""
var inputArray = []

rl.on('line', function (input) {
    var a = input.split(' ')[0]
    var b = input.split(' ')[1]
    console.log(awesome(parseInt(a), parseInt(b)))
});