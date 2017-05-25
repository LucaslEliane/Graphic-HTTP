function hasChange (pre, cur, next) {
    if ( pre > cur && next > cur ||
         pre < cur && next < cur ) {
        return true
    }
    return false
}
function sortSubSeq (arr) {
    var count = 1
    var previous = 0

    // for (var i = 0; i < arr.length - 1; i++) {
    //     if (!seq) {
    //         arr[i] >= arr[i + 1] ? ( seq = 'dec' ) : ( seq = 'inc' )
    //         console.log(arr[i])
    //         continue
    //     }
    //     if ((seq === 'dec' && arr[i + 1] > arr[i]) ||
    //         (seq === 'inc' && arr[i + 1] < arr[i])) {
    //             count ++
    //             seq = null
    //     }
    // }

    for (var i = 1; i < arr.length - 1; i++) {
        if (arr[i] === arr[i+1]) {
            continue
        }
        if (hasChange(arr[previous], arr[i], arr[i+1])) {
            count++
            previous = ++i
        } else {
            previous = i - 1
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
var line = 0

rl.on('line', function (input) {
    line++
    if (line === 2) {
        var arr = input.split(' ')
        for (var i = 0; i < arr.length; i++) {
            arr[i] = parseInt(arr[i])
        }
        console.log(sortSubSeq(arr))
        line = 0
    }
});