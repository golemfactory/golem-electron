import {convertSecsToHMS, isDateToday, timeStampToHR} from '../secsToHMS'

describe('convertSecsToHMS helper', () => {
    it('should return hh:mm:ss format date', () => {
        expect(convertSecsToHMS(3000)).toEqual("00:50:00")
    })

    it('should return hh:mm:ss format date', () => {
        expect(convertSecsToHMS(55000)).toEqual("15:16:40")
    })

    it('should return hh:mm:ss format date', () => {
        expect(convertSecsToHMS(50)).toEqual("00:00:50")
    })
})

describe('isDateToday helper', () => {
    it('should return boolean', () => {
        expect(isDateToday(new Date().toString())).toEqual(true)
    })

    it('should return boolean', () => {
        expect(isDateToday("1523128217")).toEqual(false)
    })
})

describe('timeStampToHR helper', () => {

    it('should return human readable date', () => {
        expect(timeStampToHR("1523128217").includes("-")).toEqual(true)
    })

    it('should return human readable time of today without date', () => {
    	const unixTimestamp = Math.round(+new Date()/1000)
        expect(timeStampToHR(unixTimestamp).includes("-")).toEqual(false)
    })
})