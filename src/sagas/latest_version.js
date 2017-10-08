import { eventChannel, buffers } from 'redux-saga'
import { take, call, put } from 'redux-saga/effects'
import axios from 'axios'
import { dict } from '../actions'


const {SET_GOLEMVER} = dict
let config = Object.freeze({
    GOLEM_VERSION_URL: 'https://stats.golem.network/latest_version',
    TOKENS: {
        GOLEM_VERSION: 'latest_version',
    }
})


/**
 * { subscribeGolemVersion function }
 *
 * @return          {Object}            { Emits of the Interval  }
 */
export function subscribeGolemVersion() {
    const {GOLEM_VERSION_URL, TOKENS} = config
    const dailyInterval = 24 * 60 * 60 * 1000

    return eventChannel(emit => {

        let fetchGolemVersion = TOKEN => {
            axios.get(`${GOLEM_VERSION_URL}/${TOKEN}`)
                .then((data) => {
                    console.log(`FROM SAGA_CURRENCY, ${TOKEN}`, data)
                    emit({
                        type: SET_GOLEMVER,
                        payload: {
                            golemVersion: data.data[0].symbol,
                        }
                    })
                })
        }

        let fetchWithInterval = () => {

            Object.keys(TOKENS).map(TKN => {
                fetchGolemVersion(TOKENS[TKN])
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
 * { Subscribe golem version function. It's observing changes from the Currency API via Redux-Saga/EventChannel and http request }
 *
 * @return  nothing
 *
 * @see https://stats.golem.network/latest_version
 */
export function* latestVersionFlow() {
    const channel = yield call(subscribeGolemVersion)

    try {
        while (true) {
            let action = yield take(channel)
            yield put(action)
        }
    } finally {
        console.info('yield cancelled!')
    }
}