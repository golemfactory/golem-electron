const axios = require('axios');

const getNetworkType = async function(gethURL, net){

    let genesis;

    try{
        const gethResult = await axios.post(gethURL, 
                {
                    "jsonrpc":"2.0","method":"eth_getBlockByNumber","params":["earliest", false],"id":1
                },
                {
                    timeout: 1000,
                    headers: {'Content-Type': 'application/json'}
                })

        genesis = gethResult.data.result.hash;

    } catch (error){
        reject(error)
    }

    return new Promise((resolve, reject) => {
        net.getId()
            .then((_id) => {
                let network = 'private'

                if(_id == 1 && genesis === '0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3')
                    network = 'main'
                if(_id == 2 && genesis === '0cd786a2425d16f152c658316c423e6ce1181e15c3295826d7c9904cba9ce303')
                    network = 'morden'
                if(_id == 3 && genesis === '0x41941023680923e0fe4d74a34bdac8141f2540e3ae90623718e47d66d1ca4a2d')
                    network = 'ropsten'
                if(_id == 4 && genesis === '0x6341fd3daf94b748c72ced5a5b26028f2474f5f00d824504e4fa37a75767e177')
                    network = 'rinkeby'
                if(_id == 5 && genesis === '0xa3c565fc15c7478862d50ccd6561e3c06b24cc509bf388941c25ea985ce32cb9')
                    network = 'kovan'

                resolve(network)
            })
            .catch((err) => reject(err));
    })
}

module.exports = getNetworkType;
