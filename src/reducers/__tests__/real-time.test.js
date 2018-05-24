import {BigNumber} from 'bignumber.js';
import realTime from '../realTime'

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
                new BigNumber(0).toString()
            ],
            connectedPeers: 0,
            peerInfo: [],
            golemStatus: {
                status: 'Not Ready',
                message: 'Not connected'
            },
            passwordModal: {
                register: false, 
                status: false
            },
            lockStatus: false,
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
            connectedPeers: 0,
            golemStatus: {
                status: 'Ready',
                message: 'No Nodes Connected'
            }
        })
    })


    it('should handle SET_GOLEM_STATUS', () => {
        expect(realTime(
        {
            golemStatus:{
                 status: ""
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
        expect(realTime(
        {
            golemStatus:{
                 status: "Exception"
            }
        }, {
            type: 'SET_GOLEM_STATUS',
            payload: {
                status: "Ready",
                message: "3 Nodes"
            }
        })
        ).toEqual({"golemStatus": {"status": "Exception"}})
    })

})