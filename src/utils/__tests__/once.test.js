import { once } from '../once'

describe('once helper', () => {
    it('should return execute test function once', () => {
    	const testFunc = jest.fn();
    	const onceFunct = once(() => testFunc(), this);
    	onceFunct();
    	onceFunct();
    	onceFunct();
        expect(testFunc).toHaveBeenCalledTimes(1)
    })
})