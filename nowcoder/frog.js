function frog(misArr, p) {
    var n = misArr.length
    var m = misArr[0].length
    var position = [0, 0]

    var path = wrapFrog(misArr, p, position, m, n)
    if (path) {
        var str = "[0,0]"
        path.forEach(function (value) {
            if (Object.prototype.toString.call(value) == '[object Array]') {
                str += ",[" + value[0] + "," + value[1] + "]"
            }
        })
        return str
    }
    return "Can not escape!"
    // var min = 0
    // var minIndex = 0
    // path.forEach(function (value, index) {
    //     if (value[value.length - 1] > min) {
    //         minIndex = index
    //     }
    // })
    // return path[minIndex]
}

function wrapFrog(misArr, p, position, m, n) {
    var positionArray = []
    if (p <= 0) {
        return false
    }
    if (position[0] == 0 && position[1] == m-1) {
        return []
    }
    if (position[0] + 1 < n && misArr[position[0]+1][position[1]] != 0) {
        var down = wrapFrog(misArr, p, [position[0] + 1, position[1]], m, n)
        if (down) {
            return positionArray.concat([[position[0] + 1, position[1]]], down)
        }
    }
    if (position[0] - 1 >= 0 && misArr[position[0] - 1][position[1]] != 0) {
        var up = wrapFrog(misArr, p - 3, [position[0] - 1, position[1]], m, n)
        if (up) {
            return positionArray.concat([[position[0] - 1, position[1]]], up)
        }
    }
    if (position[1] + 1 < m && misArr[position[0]][position[1] + 1] != 0) {
        var right = wrapFrog(misArr, p - 1, [position[0], position[1] + 1], m, n)
        if (right) {
            return positionArray.concat([[position[0], position[1] + 1]], right)
        }
    }
    if (position[1] - 1 >= 0 && misArr[position[0]][position[1] - 1] != 0) {
        var left = wrapFrog(misArr, p - 1, [position[0], position[1] - 1], m, n)
        if (left) {
            return positionArray.concat([[position[0], position[1] - 1]], left)
        }
    }
    return false
}

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var inputArray = []
var misLine = 0
var misArr = []
var p = 0

var line = 0

rl.on('line', function (input) {
    if (line == 0) {
        misLine = parseInt(input.split(" ")[0])
        p = parseInt(input.split(" ")[2])
    }
    if (line <= misLine && line >= 1) {
        inputArray = input.split(" ")
        misArr[line-1] = []
        for (var i = 0; i < inputArray.length; i++) {
            misArr[line-1].push(parseInt(inputArray[i]))
        }
    }
    line ++;
    if (line == misLine + 1) {
        console.log(frog(misArr, p))
        line = 0
    }
});