const web3Utils = require('web3-utils');

module.exports = async function toChecksumAddress(address) {
	return await web3Utils.toChecksumAddress(address)
}
