const axios = require('axios');

module.exports = async function getEstimatedGasPrice() {
    const gasStations = [gasStationInfo(), etherChain()];

    try {
        const data = await oneSuccess(gasStations);
        return { data, error: false };
    } catch (error) {
        // Error
        throw {
            data: null,
            error: {
                message: error.message,
                code: error.code
            }
        };
    }
};

function gasStationInfo() {
    return new Promise((resolve, reject) => {
        axios
            .get('https://ethgasstation.info/json/ethgasAPI.json', {
                timeout: 5000
            })
            .then(({ data }) => {
                const { fast, fastest, safeLow, average } = data;
                if (fast * fastest * safeLow * average == 0) {
                    reject({
                        message: 'Incorrect data (0 gas)',
                        code: '501',
                        station: 'ethgasstation'
                    });
                }
                resolve({
                    fast: fast / 10,
                    fastest: fastest / 10,
                    safeLow: safeLow / 10,
                    standard: average / 10
                });
            })
            .catch(error => reject(error));
    });
}

function etherChain() {
    return new Promise((resolve, reject) => {
        axios
            .get('https://www.etherchain.org/api/gasPriceOracle', {
                timeout: 5000
            })
            .then(({ data }) => {
                const { fast, fastest, safeLow, standard } = data;
                if (fast * fastest * safeLow * standard == 0) {
                    reject({
                        message: 'Incorrect data (0 gas)',
                        code: '501',
                        station: 'etherchain'
                    });
                }
                resolve({
                    fast,
                    fastest,
                    safeLow,
                    standard
                });
            })
            .catch(error => reject(error));
    });
}

/**
 * [oneSuccess return first success if any]
 * @param  {[Array]}    promises
 * @return {[Promise]}
 *
 * @ref https://stackoverflow.com/a/37235274/1763249
 */
function oneSuccess(promises) {
    return Promise.all(
        promises.map(p => {
            // If a request fails, count that as a resolution so it will keep
            // waiting for other possible successes. If a request succeeds,
            // treat it as a rejection so Promise.all immediately bails out.
            return p.then(
                val => Promise.reject(val),
                err => Promise.resolve(err)
            );
        })
    ).then(
        // If '.all' resolved, we've just got an array of errors.
        errors => Promise.reject(errors),
        // If '.all' rejected, we've got the result we wanted.
        val => Promise.resolve(val)
    );
}
