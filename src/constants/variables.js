const variables = Object.freeze({
    ETH_DENOM: 10**18, //POW shorthand thanks to ES6
    GWEI_DENOM: 10 ** 9,
    mainEtherscanTx: 'https://etherscan.io/tx/',
	testEtherscanTx: 'https://rinkeby.etherscan.io/tx/',
	mainEtherscanAddr: "https://etherscan.io/address"
})

module.exports = variables;
