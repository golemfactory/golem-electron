import {BigNumber} from 'bignumber.js';
import account from '../account'

describe('account reducer', () => {
    it('should  return initial state', () => {
        expect(account(undefined, {
        publicKey: "",
        withdrawModal: {
            status: false,
            currency: ''
        },
        gasCost: new BigNumber(0)
    })).toEqual({
            publicKey: "",
            withdrawModal: {
                status: false,
                currency: ''
            },
            gasCost: new BigNumber(0)
        })
    })

    it('should handle SET_PUBLIC_KEY', () => {
        expect(account({}, {
            type: 'SET_PUBLIC_KEY',
            payload: 'this is a public key'
        })
        ).toEqual({
                publicKey: 'this is a public key'
        })
    })

    it('should handle CALL_WITHDRAW_MODAL', () => {
        expect(account({}, {
            type: 'CALL_WITHDRAW_MODAL',
            payload: {status: true, currency: 'ETH'}
        })
        ).toEqual({"withdrawModal": {"currency": "ETH", "status": true}})
    })
})