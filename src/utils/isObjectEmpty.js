function isObjectEmpty(obj) {
    if(obj !== null && typeof obj === 'object'){
        for(var prop in obj) {
            if(obj.hasOwnProperty(prop))
                return false;
        }

        return JSON.stringify(obj) === JSON.stringify({});
    }
    return true
}

export default isObjectEmpty