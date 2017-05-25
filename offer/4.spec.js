
describe("specific number in 2D matrix", function() {
    it("border condition", function() {
        expect(DMatrix(borderArray1), 1).toBeFalsy()
        expect(DMatrix(borderArray2), 2).toBeFalsy()
    })
    it("cannot find that number", function() {
        expect(DMatrix(trueArray1), 3).toBe(false)
        expect(DMatrix(trueArray2), 10).toBe(false)
    })
    it("can find that number in matrix", function() {
        expect(DMatrix(trueArray1), 6).toBeTruthy()
        expect(DMatrix(trueArray2), 11).toBeTruthy()
    })
})