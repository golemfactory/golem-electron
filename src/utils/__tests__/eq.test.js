import eq from '../eq'

describe('eq helper', () => {

	const object = { 'a': 1 }
	const other = { 'a': 1 }

    it('should return proper key val object', () => {
		expect(eq(object, other)).toBe(false)
    })

    it('should return proper key val object', () => {
		expect(eq('a', 'a')).toBe(true)
    })

    it('should return proper key val object', () => {
		expect(eq(object, object)).toBe(true)
    })

    it('should return proper key val object', () => {
		expect(eq('a', Object('a'))).toBe(false)
    })

    it('should return proper key val object', () => {
		expect(eq(NaN,NaN)).toBe(true)
    })
})