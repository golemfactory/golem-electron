import input from '../input'

describe('input reducer', () => {
    it('should return initial state', () => {
        expect(input(undefined, {
            preview: false
        })).toEqual({
            preview: false
        })
    })

    it('should handle SET_PREVIEW', () => {
        expect(input({}, {
            type: 'SET_PREVIEW',
            payload: true
        })
        ).toEqual({
            preview: true
        })
    })
})