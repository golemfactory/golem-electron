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
            concentBalance: null,
            peerInfo: [],
            footerInfo: null
        })
    })
})