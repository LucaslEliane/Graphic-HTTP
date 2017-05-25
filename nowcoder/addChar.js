
/**
 * 牛牛手里有一个字符串A，羊羊的手里有一个字符串B，B的长度大于等于A，所以牛牛想把A串变得和B串一样长，这样羊羊就愿意和牛牛一起玩了。
而且A的长度增加到和B串一样长的时候，对应的每一位相等的越多，羊羊就越喜欢。比如"abc"和"abd"对应相等的位数为2，为前两位。
牛牛可以在A的开头或者结尾添加任意字符，使得长度和B一样。现在问牛牛对A串添加完字符之后，不相等的位数最少有多少位？ 
 * 
 * @param {any} str1 字符串A
 * @param {any} str2 字符串B，并且字符串B的长度大于字符串A
 * @returns 输出一个整数表示A串添加完字符之后，不相等的位数最少有多少位？
 */

function addChar (str1, str2) {
    var strArr1 = str1.split('')
    var strArr2 = str2.split('')
    var length1 = strArr1.length
    var length2 = strArr2.length
    var max = 0

    for (var i = 0; i <= length2 - length1; i ++) {
        var count = 0
        for (var j = 0; j < length1; j ++) {
            if (strArr1[j] === strArr2[j + i]) {
                count ++
            }
        }
        count > max && ( max = count )
    }

    return length1 - max
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
    inputArray.push(input)
    if (line === 1) {
        console.log(addChar(inputArray[0], inputArray[1]))
        inputArray = []
        line = 0
    }
    line ++
});