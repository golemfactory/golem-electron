import MsgpackSerializer from '../MsgpackSerializer'

describe('MsgpackSerializer helper', () => {

	const data = "test";
	const serializer = new MsgpackSerializer()
	const result = serializer.encode(data)

    it('should return execute test function once', () => {
        expect(result).toEqual(expect.anything())
    })

    it('should return execute test function once', () => {
  		const result2 = serializer.decode(result)
        expect(result2).toEqual(data)
    })
})