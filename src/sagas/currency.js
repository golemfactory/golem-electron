import { eventChannel, buffers } from 'redux-saga'
import { take, call, put } from 'redux-saga/effects'
import axios from 'axios'
import { dict } from '../actions'


const {SET_CURRENCY} = dict
let config = Object.freeze({
    CURRENCY_URL: 'http://api.coinmarketcap.com/v1/ticker/',
    TOKENS: {
        ETH: 'ethereum',
        GNT: 'golem-network-tokens'
    }
})


/**
 * { subscribeCurrency function }
 * 
 * @return          {Object}            { Emits of the Interval  }
 */
export function subscribeCurrency() {
    const {CURRENCY_URL, TOKENS} = config
    const dailyInterval = 24 * 60 * 60 * 1000

    return eventChannel(emit => {

        let fetchCurrency = TOKEN => {
            axios.get(`${CURRENCY_URL}/${TOKEN}`)
                .then((data) => {
                    //console.log(`FROM SAGA_CURRENCY, ${TOKEN}`, data)
                    emit({
                        type: SET_CURRENCY,
                        payload: {
                            currency: data.data[0].symbol,
                            rate: data.data[0].price_usd
                        }
                    })
                })
        }

        let fetchWithInterval = () => {

            Object.keys(TOKENS).map(TKN => {
                fetchCurrency(TOKENS[TKN])
            })

            return fetchWithInterval
        }

        setInterval(fetchWithInterval(), dailyInterval)


        return () => {
            console.log('negative')
        }
    })
}

/**
 * { Subscribe currency function. It's observing changes from the Currency API via Redux-Saga/EventChannel and http request }
 * 
 * @return  nothing
 *
 * @see https://coinmarketcap.com/api/
 */
export function* currencyFlow() {
    const channel = yield call(subscribeCurrency)

    try {
        while (true) {
            let action = yield take(channel)
            yield put(action)
        }
    } finally {
        console.info('yield cancelled!')
    }
}