import { eventChannel, buffers } from 'redux-saga'
import { take, call, put } from 'redux-saga/effects'
import axios from 'axios'
import { dict } from '../actions'


const {SET_CURRENCY} = dict
let config = {
    CURRENCY_URL: 'https://api.coingecko.com/api/v3/simple/price?ids=TOKEN&vs_currencies=usd',
    TOKENS: {
        ETH: 'ethereum',
        GNT: 'golem'
    }
}


/**
 * { subscribeCurrency function }
 * 
 * @return          {Object}            { Emits of the Interval  }
 */
export function subscribeCurrency() {
    const {CURRENCY_URL, TOKENS} = config
    const dailyInterval = 24 * 60 * 60 * 1000

    return eventChannel(emit => {
        let fetchCurrency = (SYMBOL, TOKEN) => {
            axios.get(`${CURRENCY_URL.replace('TOKEN', TOKEN)}`)
                .then((data) => {
                    //console.log(`FROM SAGA_CURRENCY, ${TOKEN}`, data)
                    emit({
                        type: SET_CURRENCY,
                        payload: {
                            currency: SYMBOL,
                            rate: data.data[TOKEN].usd
                        }
                    })
                })
        }

        let fetchWithInterval = () => {

            Object.entries(TOKENS).map(([SYMBOL, TOKEN]) => {
                fetchCurrency(SYMBOL, TOKEN)
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