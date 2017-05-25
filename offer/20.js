function isNumeric(str) {
    if (str === "") {
        return false
    }

    var {
        numeric,
        length
    } = scanInteger(str, 0)

    if (str.charAt(length) === ".") {
        length ++

        var result = scanUnsignedInteger(str, length)

        numeric = result.numeric
        length = result.length 
    }
    if (str.charAt(length) === 'e' || str.charAt(length) === 'E') {
        length++
        result = scanInteger(str, length)
        numeric = numeric && result.numeric
        length  = result.length
    }
    return numeric && str.charAt(length) === ""
}

function scanInteger(str, length) {
    if (str.charAt(length) === "+" || str.charAt(length) === "-") {
        length ++
    }
    return scanUnsignedInteger(str, length)
}

function scanUnsignedInteger(str, length) {
    var before = length
    while(str.charAt(length) !== "" && str.codePointAt(length) >= 48 && str.codePointAt(length) <= 57) {
        length++
    }
    return {
        numeric: (length > before),
        length
    }
}

console.log(isNumeric("+100"))
console.log(isNumeric("5e2"))
console.log(isNumeric("-123"))
console.log(isNumeric("3.141"))
console.log(isNumeric("-1e-1"))
console.log(isNumeric("12e"))
console.log(isNumeric("1a3"))
console.log(isNumeric("+-5"))
console.log(isNumeric("123.aaa"))