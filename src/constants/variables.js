const variables = Object.freeze({
    ETH_DENOM: 10**18, //POW shorthand thanks to ES6
    GWEI_DENOM: 10 ** 9,
    mainEtherscanTx: 'https://etherscan.io/tx/0x',
	testEtherscanTx: 'https://rinkeby.etherscan.io/tx/0x',
	mainEtherscanAddr: "https://etherscan.io/address"
})

module.exports = variables;
