var customMatchers = {
    toBeIncludeBy: function(util, customEqualityTesters) {
        return {
            compare: function(actual, expected) {
                result = {}
                if (~expected.indexOf(this.actual)) {
                    result.message = `${this.actual} expected in ${expected.toString()}`
                    result.pass = false
                } else {
                    result.pass = true
                }
                return result
            }
        }
    }
}

describe("get repeat number", function() {
    beforeEach(function() {
        jasmine.addMatchers(customMatchers)
    })
    it("border condition", function() {
        expect(repeatNum([])).toEqual(-1)
        expect(repeatNum([1])).toEqual(-1)
    })
    it("do not contain a repeat number", function() {
        expect(repeatNum([1, 2, 3, 4])).toEqual(-1)
        expect(repeatNum([1, 2, 4])).toEqual(-1)
    })
    it("legal arguments array", function() {
        expect(repeatNum([2, 3, 5, 4, 3, 2, 6, 7])).toBeIncludeBy([2,3])
    })
})