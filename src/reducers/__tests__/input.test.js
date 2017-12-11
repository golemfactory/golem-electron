import input from '../input'

describe('input reducer', () => {
    it('should return initial state', () => {
        expect(input(undefined, {
            preview: false
        })).toEqual(
        {
            "autoLaunch": false, 
            "developerMode": false, 
            "expandedPreview": false, 
            "preview": false, 
            "zoomRatio": null
        })
    })

    it('should handle SET_PREVIEW_RADIO', () => {
        expect(input({
            preview: false
        }, {
            type: 'SET_PREVIEW_RADIO',
            payload: true
        })
        ).toEqual({"expandedPreview": false, "preview": true})
    })

    it('should handle SET_PREVIEW_EXPANDED', () => {
        expect(input({
            expandedPreview: false
        }, {
            type: 'SET_PREVIEW_EXPANDED',
            payload: {
                isScreenOpen: true
            }
        })
        ).toEqual({"expandedPreview": true})
    })

    it('should handle SET_AUTOLAUNCH', () => {
        expect(input({
            autoLaunch: false
        }, {
            type: 'SET_AUTOLAUNCH',
            payload: true
        })
        ).toEqual({"autoLaunch": true})
    })

    it('should handle SET_ZOOM_RATIO', () => {
        expect(input({
            zoomRatio: null
        }, {
            type: 'SET_ZOOM_RATIO',
            payload: 0.5
        })
        ).toEqual({"zoomRatio": 0.5})
    })

    it('should handle TOGGLE_DEVELOPER_MODE', () => {
        expect(input({
            developerMode: false
        }, {
            type: 'TOGGLE_DEVELOPER_MODE',
            payload: true
        })
        ).toEqual({"developerMode": true})
    })
})