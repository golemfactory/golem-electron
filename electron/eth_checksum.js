const Web3 = require('web3');

module.exports = async function toChecksumAddress(address) {
	const web3 = new Web3();
	return await web3.utils.toChecksumAddress(address)
}
