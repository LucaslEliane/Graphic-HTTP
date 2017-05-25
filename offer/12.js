function matrixPath(matrix, str) {
    if (!matrix) {
        return false
    }
    var n = matrix.length - 1
    var m = matrix[0].length - 1
    var start = str.charAt(0)
    var resultArr = []

    for (var i = 0; i <= n; i++) {
        for (var j = 0; j <= m; j++) {
            if (matrix[i][j] === start) {
                if (matrixPathCore(matrix, n, m, str, i, j, 0, resultArr)) {
                    return true
                }
                resultArr.pop()
            }
        }
    }
    return false
}

function matrixPathCore(matrix, n, m, str, i, j, start, resultArr) {
    var isIn = false
    resultArr.forEach(function(value) {
        if (value[0] === i && value[1] === j) {
            isIn = true
        }
    })
    if (isIn) {
        return false
    }
    if (i < 0 || i > n || j < 0 || j > m) {
        return false
    }
    if (start === str.length) {
        return true
    }
    if (matrix[i][j] === str.charAt(start)) {
        resultArr.push([i, j])
        var result =  (
            matrixPathCore(matrix, n, m, str, i - 1, j, start + 1, resultArr) ||
            matrixPathCore(matrix, n, m, str, i + 1, j, start + 1, resultArr) ||
            matrixPathCore(matrix, n, m, str, i, j - 1, start + 1, resultArr) ||
            matrixPathCore(matrix, n, m, str, i, j + 1, start + 1, resultArr)
        )
        if (result) {
            return true
        } else {
            resultArr.pop()
        }
    }
    return false
}