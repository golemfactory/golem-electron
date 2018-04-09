import zipObject from '../zipObject'

describe('zipObject helper', () => {
    it('should return proper key val object', () => {
        expect(zipObject(['a', 'b'], [1, 2])).toEqual({ 'a': 1, 'b': 2 })
    })

    it('should return empty object', () => {
        expect(zipObject([], [1, 2])).toEqual({})
    })

    it('should return empty object', () => {
        expect(zipObject(['a', 'b'], [])).toEqual({})
    })
})