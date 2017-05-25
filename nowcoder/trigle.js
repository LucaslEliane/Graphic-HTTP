function dist(point1, point2) {
    var a = Math.pow(point1[0] - point2[0], 2)
    var b = Math.pow(point1[1] - point2[1], 2)
    var c = Math.pow(point1[2] - point2[2], 2)
    return Math.sqrt(a + b + c)
}

function calArea(point1, point2, point3) {
    var distanceA = dist(point1, point2)
    var distanceB = dist(point2, point3)
    var distanceC = dist(point1, point3)
    var p = (distanceA + distanceB + distanceC) / 2
    return Math.sqrt(p * (p - distanceA) * (p - distanceB) * (p - distanceC))
}

function triangle(length, pointArr) {
    var redArray = []
    var blueArray = []
    var greenArray = []
    var maxArea = 0
    pointArr.forEach(function(value) {
        var point = value.split(" ")
        switch (point[0]) {
            case "R":
                redArray.push([point[1], point[2], point[3]])
                break;
            case "G":
                greenArray.push([point[1], point[2], point[3]])
                break;
            case "B":
                blueArray.push([point[1], point[2], point[3]])
                break;
        }
    })
    if (redArray.length && greenArray.length && blueArray.length) {
        for (var red = 0; red < redArray.length; red++) {
            for (var blue = 0; blue < blueArray.length; blue++) {
                for (var green = 0; green < greenArray.length; green++) {
                    var area = calArea(redArray[red], blueArray[blue], greenArray[green])
                    area > maxArea && (maxArea = area)
                }
            }
        }
    }
    var redMax = sameColor(redArray)
    var greenMax = sameColor(greenArray)
    var blueMax = sameColor(blueArray)
    redMax > maxArea && (maxArea = redMax)
    greenMax > maxArea && (maxArea = greenMax)
    blueMax > maxArea && (maxArea = blueMax)
    return maxArea
}

function sameColor(colorArray) {
    var maxArea = 0
    if (colorArray.length < 3) {
        return 0;
    }
    for (var i = 0; i < colorArray.length; i++) {
        for (var j = i+1; j < colorArray.length; j++) {
            for (var k = j+1; k < colorArray.length; k++) {
                var area = calArea(colorArray[i], colorArray[j], colorArray[k])
                area > maxArea && (maxArea = area)
            }
        }
    }
    return maxArea
}


const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var input = ""
var inputArray = []

var line = 0
var length = 0

rl.on('line', function (input) {
    if (line === 0) {
        length = input
    } else {
        inputArray.push(input);
    }
    if (line == length) {
        console.log(triangle(length, inputArray).toFixed(5))
        line = 0
        inputArray = []
        length = 0
    }
	line ++;
});