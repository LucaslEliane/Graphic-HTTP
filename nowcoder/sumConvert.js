/**
 * 牛牛想对一个数做若干次变换，直到这个数只剩下一位数字。
变换的规则是：将这个数变成 所有位数上的数字的乘积。比如285经过一次变换后转化成2*8*5=80.
问题是，要做多少次变换，使得这个数变成个位数。
 * 
 * @param {any} num 输入一个待计算的整数
 * @returns 输出一个整数，表示变换次数。
 */
function sumConvert (num) {
    if (!num && num !== 0) {
        return -1
    }
    var numArr = (num + '').split('')
    var count = 0
    while(numArr.length !== 1) {
        var result = 1
        result = numArr.reduce(function(pre, cur) {
            return pre * cur
        }, result)
        numArr = ( result + '' ).split('')
        count ++
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
    console.log(sumConvert(parseInt(input)))
});