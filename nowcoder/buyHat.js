/**
 * 度度熊想去商场买一顶帽子，商场里有N顶帽子，
 * 有些帽子的价格可能相同。度度熊想买一顶价格第三便宜的帽子，
 * 问第三便宜的帽子价格是多少？ 
 */

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var input = ""
var inputArray = []

var buyHat = function(length, priceArray) {
    if (length != priceArray.length || priceArray.length < 3) {
        return -1
    }
    var minArray = [Infinity, Infinity, Infinity]
    priceArray.forEach(function(value) {
        if (value > minArray[2]) return;
        if (value < minArray[0]) {
            minArray[2] = minArray[1]
            minArray[1] = minArray[0]
            minArray[0] = value
            return;
        }
        if (value < minArray[1]) {
            minArray[2] = minArray[1]
            minArray[1] = value
            return;
        }
        if (value < minArray[2]) {
            minArray[2] = value
            return;
        }
    })
    return minArray[2]
}

var line = 0

rl.on('line', function (input) {
    inputArray.push(input);
    if (line % 2 === 1) {
        var length = inputArray[0]
        var priceArray = inputArray[1].split(" ")
        console.log(buyHat(length, priceArray))
        inputArray = []
    }
	line ++;
});