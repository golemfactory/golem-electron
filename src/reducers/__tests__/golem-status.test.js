import {BigNumber} from 'bignumber.js';
import golemStatus, {getStatusSelector} from '../golemStatus'

describe('golemStatus reducer', () => {
	it('should return initial state', () => {
        expect(golemStatus(undefined, {})).toEqual({
            connectedPeers: null,
            golemStatus: [{'client': ['start', 'pre', null]}],
            passwordModal: {
                error: false,
                register: false, 
                status: false
            },
        })
    })

    it('should handle SET_CONNECTED_PEERS', () => {
        expect(golemStatus({}, {
            type: 'SET_CONNECTED_PEERS',
            payload: []
        })
        ).toEqual({
            peerInfo: [],
            connectedPeers: 0
        })
    })

    it('should handle SET_GOLEM_STATUS', () => {
        expect(golemStatus(
        {
            golemStatus:{
                 status: "",
            }
        }, {
            type: 'SET_GOLEM_STATUS',
            payload: {
                status: "Ready",
                message: "3 Nodes"
            }
        })
        ).toEqual({
            golemStatus: {
                status: "Ready",
                message: "3 Nodes"
            }
        })
    })

    it('should handle exception on SET_GOLEM_STATUS', () => {
        expect(getStatusSelector(
        {
            golemStatus: [{client: ['start', 'exception', null]}],
            connectedPeers: 5
        }, "golemStatus")
        ).toEqual({client: {"message": "Error starting Golem", "status": "Exception"}})
    })
})