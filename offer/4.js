function DMatrix(arr, x) {
    if (arr.length === 0 || arr[0].length === 0) {
        return false
    }
    var n = 0
    var m = arr[0].length - 1

    while(m >= 0 && n <= arr.length - 1) {
        if (arr[n][m] === x) {
            return true
        } else if (arr[n][m] < x) {
            n = n + 1
        } else if (arr[n][m] > x) {
            m = m - 1
        }
    }
    return false
}
