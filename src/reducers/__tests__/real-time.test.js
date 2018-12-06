import {BigNumber} from 'bignumber.js';
import realTime, {getStatusSelector} from '../realTime'

describe('realTime reducer', () => {
    it('should return initial state', () => {
        expect(realTime(undefined, {})).toEqual({
            taskList: [],
            balance: [
                new BigNumber(0), 
                new BigNumber(0),
                null,
                null,
                new BigNumber(0).toString(), 
                new BigNumber(0).toString(),
                new BigNumber(0).toString()
            ],
            connectedPeers: null,
            peerInfo: [],
            golemStatus: [{client: ['start', 'pre', null]}],
            passwordModal: {
                error: false,
                register: false, 
                status: false
            },
            footerInfo: null
        })
    })

    it('should handle SET_CONNECTED_PEERS', () => {
        expect(realTime({}, {
            type: 'SET_CONNECTED_PEERS',
            payload: []
        })
        ).toEqual({
            peerInfo: [],
            connectedPeers: 0
        })
    })


    it('should handle SET_GOLEM_STATUS', () => {
        expect(realTime(
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