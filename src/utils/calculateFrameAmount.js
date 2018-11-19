/**
 * [calculateFrameAmount function calculates the frame notation]
 * @see https://github.com/golemfactory/golem/wiki/Blender
 * @example 
 * "55;58-60,2" -> 55,58,60     -> 3 Frames
 * "55;58-60"   -> 55,58,59,60  -> 4 Frames
 */
function calculateFrameAmount(_frame){
    const notationArray = _frame.match(/(\d+)(-)?(\d+)?(\,\d)?/g)
    const calculateNotation = item => {

        if (!isNaN(item))
            return 1
        
        if (item.includes(",")) {
            [item, diff] = item.split(",");
        }
      
        const splitItem = item.split("-")
        return Math.floor((Math.max(...splitItem) - Math.min(...splitItem)) / diff) + 1
    }

    let diff = 1;

    return notationArray
        .map(calculateNotation)
        .reduce((total, amount) => total += amount)
}

export default calculateFrameAmount