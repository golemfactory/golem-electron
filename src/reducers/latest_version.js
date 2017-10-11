import { dict } from './../actions'

const {SET_GOLEMVER} = dict

const initialState = {
    GOLEM_VERSION: 0,
}
const setGolemVer = (state = initialState, action) => {
    switch (action.type) {
        case SET_GOLEMVER:
            const {golemVersion} = action.payload
            return Object.assign({}, state, {
                golemVersion
            });

        default:
            return state;
    }
}

export default setGolemVer