import loader from '../loader'

describe('loader reducer', () => {
    it('should  return initial state', () => {
        expect(loader(undefined, {})).toEqual({})
    })

    it('should handle START_LOADING', () => {
        expect(loader({}, {
            type: 'START_LOADING',
            id: 'MAIN_LOADER',
            text: 'Im a loading!'
        })
        ).toEqual({
            'MAIN_LOADER': {
                isLoading: true,
                text: 'Im a loading!'
            }
        })
    })

    it('should handle END_LOADING', () => {
        expect(loader({}, {
            type: 'END_LOADING',
            id: 'MAIN_LOADER'
        })
        ).toEqual({
            'MAIN_LOADER': {
                isLoading: false
            }
        })
    })
})