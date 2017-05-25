function movingCount(m, n, threshold) {
    if (m <= 0 || n <= 0 || threshold <= 0) {
        return 0
    }
    var visited = []
    var count = 0
    return movingCountCore(m, n, threshold, visited, i, j, count)
}

function movingCountCore(m, n, threshold, visited, i, j, count) {
    
}