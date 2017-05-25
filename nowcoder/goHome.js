/**
 * 一个数轴上共有N个点，第一个点的坐标是度度熊现在位置，
 * 第N-1个点是度度熊的家。现在他需要依次的从0号坐标走到N-1号坐标。
 * 但是除了0号坐标和N-1号坐标，他可以在其余的N-2个坐标中选出一个点，
 * 并直接将这个点忽略掉，问度度熊回家至少走多少距离？ 
 * @param {*} length 
 * @param {*} distanceArr 
 */
function goHome(length, distanceArr) {
    if (length === 1) {
        return 0
    }
    if (length === 2) {
        return distanceArr[1] - distanceArr[0]
    }
    if (length === 3) {
        return distanceArr[2] - distanceArr[0]
    }
    var distance = 0
    var subMax = 0
    for (var i = 0; i < length - 2; i++) {
        var threeDistance = 
            Math.abs(distanceArr[i+2] - distanceArr[i+1]) +
            Math.abs(distanceArr[i+1] - distanceArr[i])
        var twoDistance = Math.abs(distanceArr[i+2] - distanceArr[i])
        distance += Math.abs(distanceArr[i + 1] - distanceArr[i])
        subMax < threeDistance - twoDistance && (subMax = threeDistance - twoDistance)
    }
    distance =
        distance +
        Math.abs(distanceArr[length - 1] - distanceArr[length - 2]) -
        subMax
    return distance
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
        var distanceArr = inputArray[1].split(" ")
        console.log(goHome(length, distanceArr))
        inputArray = []
    }
	line ++;
});