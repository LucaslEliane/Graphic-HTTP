function repeatNum(arr) {
    if (arr.length === 0 || arr.length === 1) {
        return -1
    }
    var middle = 0,
        length = arr.length,
        end = length - 1,
        start = 1
    while(end >= start) {
        middle = Math.ceil((end + start) / 2)
        var count = countRange(arr, start, middle, length)
        if (end === start ) {
            if (count > 1) {
                return start
            } else {
                return -1
            }
        }
        if (count > middle - start + 1) {
            end = middle
        } else {
            start = middle + 1
        }
    }

    return -1
}

function countRange(arr, start, end, length) {
    var count = 0
    for (var i = 0; i < length; i++) {
        if (arr[i] >= start && arr[i] <= end) {
            count++
        }
    }
    return count
}