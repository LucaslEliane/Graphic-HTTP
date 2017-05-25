function match(str, reg) {
    if (str === "" || reg === "") {
        return false
    }
    return matchCore(str, reg, 0, 0)
}

function matchCore(str, reg, strPos, regPos) {
     if (!str.charAt(strPos) && !reg.charAt(regPos)) {
         return true
     }
     if (str.charAt(strPos) && !reg.charAt(regPos)) {
         return false
     }
     if (reg.charAt(regPos+1) === "*") {
         if (reg.charAt(regPos) === str.charAt(strPos) || (reg.charAt(regPos) === "." && str.charAt(strPos))) {
             return matchCore(str, reg, strPos, regPos + 2)
                || matchCore(str, reg, strPos + 1, regPos)
                || matchCore(str, reg, strPos + 1, regPos + 2)
         } else {
             return matchCore(str, reg, strPos, regPos + 2)
         }
     }
     if (reg.charAt(regPos) === str.charAt(strPos) || (reg.charAt(regPos) === "." && str.charAt(strPos))) {
         return matchCore(str, reg, strPos + 1, regPos + 1)
     }
     return false
}

console.log(match("aaa", "a.a"))
console.log(match("aaa", "ab*ac*a"))
console.log(match("aaa", "aa.a"))
console.log(match("aaa", "ab*a"))