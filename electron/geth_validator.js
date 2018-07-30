const Web3 = require('web3');
const axios = require('axios');


module.exports = async function validateGeth(isLocalGeth, gethAddress, gethPort, isMainnet) {
	const gethURL = `${isLocalGeth ? "http://localhost" : gethAddress}${isLocalGeth ? ":" + (gethPort || 8545) : ""}`
	const web3Provider = new Web3.providers.HttpProvider(gethURL)
	const web3 = new Web3(web3Provider);

	try{

		const isValid = await axios.post(gethURL, 
			{"jsonrpc":"2.0","method":"web3_clientVersion","params":[],"id":67},
			{
				timeout: 1000,
				headers: {'Content-Type': 'application/json'}
		});

		const isListening = await web3.eth.net.isListening()
		if(isListening && isValid){
		    const guessedChain = await web3.eth.net.getNetworkType()
	        if((guessedChain === "main" && isMainnet) ||
	            (guessedChain === "rinkeby" && !isMainnet)) {
	        	return { status: true, error: null }
	        } else {
	            console.warn(`Given geth doesn't run on ${isMainnet ? "main" : "rinkeby"} network.`)
	            return { status: false, error: `Given geth doesn't run on ${isMainnet ? "main" : "rinkeby"} network.` }
	        }
		} else {
		    console.error(`Invalid geth address!`)
		    return { status: false, error: `Invalid geth address!` }
		}
	} catch(e){
		console.error(e);
		return { status: false, error: "Please be sure if geth is running properly." }
	}
	
}
