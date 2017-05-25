var trueArray1 = [
    ["a", "b", "t", "g"],
    ["c", "f", "c", "s"],
    ["j", "d", "e", "h"]
]

var trueArray2 = [
    ["c", "d", "h", "a"],
    ["n", "m", "m", "c"],
    ["r", "q", "r", "q"],
    ["e", "a", "f", "c"]
]

var borderArray1 = [
    ["a", "a", "a", "a"]
]

var falseArray1 = null

describe("the string path in matrix", function() {
    it("border condition", function() {
        expect(matrixPath(borderArray1, "abfd")).toBeFalsy()
        expect(matrixPath(falseArray1, "aaaa")).toBeFalsy()
    })
    it("exist a path in matrix", function() {
        expect(matrixPath(trueArray1, "abfd")).toBeTruthy()
        expect(matrixPath(trueArray2, "cdmmc")).toBeTruthy()
    })
    it("do not exist a path in matrix", function() {
        expect(matrixPath(trueArray1, "acjj")).toBeFalsy()
        expect(matrixPath(trueArray2, "cmq")).toBeFalsy()
    })
})