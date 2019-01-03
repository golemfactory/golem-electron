const axios = require('axios');

module.exports = async function getEstimatedGasPrice() {
	try {
		const {data} = await axios.get('https://www.etherchain.org/api/gasPriceOracle')
    	return {data, error: false};
	} catch (error) {
		// Error
        if (error.response) {
        	return {
        		data: null, 
        		error: {
        			data: error.response.data,
        			status: error.response.status
	        	}
	        }
        } else if (error.request) {
            return {
        		data: null, 
        		error: {
        			request: error.request
	        	}
	        }
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
            return {
        		data: null, 
        		error: {
        			message: error.message
	        	}
	        }
        }
	}
}
