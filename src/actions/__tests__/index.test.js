import * as actions from '../'

describe('actions', () => {
    it('should create an action to start loading', () => {
        const id = "MAIN_LOADER"
        const text = "I am loading!"
        const expectedAction = {
            type: "START_LOADING",
            id,
            text
        }
        expect(actions.startLoading(id, text)).toEqual(expectedAction)
    })

    it('should create an action to end loading', () => {
        const id = "MAIN_LOADER"
        const expectedAction = {
            type: "END_LOADING",
            id
        }
        expect(actions.endLoading(id)).toEqual(expectedAction)
    })

    it('should create an action to login', () => {
        const payload = "Muhammed"
        const expectedAction = {
            type: "LOGIN",
            payload
        }
        expect(actions.login(payload)).toEqual(expectedAction)
    })

    it('should create an action to logout', () => {
        const expectedAction = {
            type: "LOGOUT"
        }
        expect(actions.logout()).toEqual(expectedAction)
    })

    it('should create an action to get message', () => {
        const expectedAction = {
            type: "GET_MESSAGE"
        }
        expect(actions.getMessage()).toEqual(expectedAction)
    })

    it('should create an action to set message', () => {
        const message = "Muhammed"
        const expectedAction = {
            type: "SET_MESSAGE",
            message
        }
        expect(actions.setMessage(message)).toEqual(expectedAction)
    })

    it('should create an action to get blender', () => {
        const expectedAction = {
            type: "GET_BLENDER"
        }
        expect(actions.getBlender()).toEqual(expectedAction)
    })

    it('should create an action to set blender', () => {
        const blender = "Muhammed"
        const expectedAction = {
            type: "SET_BLENDER",
            blender
        }
        expect(actions.setBlender(blender)).toEqual(expectedAction)
    })

    it('should create an action to set blender', () => {
        const payload = true
        const expectedAction = {
            type: "SET_PREVIEW",
            payload
        }
        expect(actions.setPreview(payload)).toEqual(expectedAction)
    })
})