const axios = require('axios');

module.exports = async function getEstimatedGasPrice() {
    try {
        const { data } = await axios.get(
            'https://www.etherchain.org/api/gasPriceOracle',
            {
                timeout: 5000
            }
        );
        return { data, error: false };
    } catch (error) {
        // Error
        throw ({
            data: null,
            error: {
                message: error.message,
                code: error.code
            }
        }); 
    }
};
