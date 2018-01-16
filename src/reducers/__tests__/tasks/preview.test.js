import preview from '../../tasks/preview'

describe('preview reducer', () => {
	it('should return initial state', () => {
        expect(preview(undefined, {}))
        .toEqual({
        	preview: null,
		    ps: {
		    	enabled: false,
		    	id: null,
		    	frameCount: null
		    }
        })
    })

    it('should handle SET_PREVIEW', () => {
        expect(preview({
            preview: null
        }, {
            type: 'SET_PREVIEW',
            payload: "http://image"
        })
        ).toEqual({"preview": "http://image"})
    })

    it('should handle UPDATE_PREVIEW_LOCK', () => {
        expect(preview({
            ps: {
		    	enabled: false,
		    	id: null,
		    	frameCount: null
		    }
        }, {
            type: 'UPDATE_PREVIEW_LOCK',
            payload: {
		    	enabled: true,
		    	id: 0,
		    	frameCount: 1
		    }
        })
        ).toEqual({
		    	ps: {
		    		enabled: true,
		    		id: 0,
		    		frameCount: 1
		    	}
		    })
    })
})