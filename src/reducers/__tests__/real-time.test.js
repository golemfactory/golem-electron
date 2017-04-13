import realTime from '../realTime'

describe('realTime reducer', () => {
    it('should return initial state', () => {
        expect(realTime(undefined, {
            message: '',
            blender: []
        })).toEqual({
            message: '',
            blender: []
        })
    })

    it('should handle SET_MESSAGE', () => {
        expect(realTime({}, {
            type: 'SET_MESSAGE',
            message: 2017
        })
        ).toEqual({
            message: 2017
        })
    })


    it('should handle SET_BLENDER', () => {
        expect(realTime([], {
            type: 'SET_BLENDER',
            blender: [{
                test: 2017
            }]
        })
        ).toEqual({
            blender: [{
                test: 2017
            }]
        })
    })

})