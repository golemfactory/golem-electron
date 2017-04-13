import { dict } from './../actions'

const {START_LOADING, END_LOADING} = dict
const loadingReducer = (state = {}, action) => {
    switch (action.type) {
    case START_LOADING:
        return {
            ...state,
            [action.id]: {
                isLoading: true,
                text: action.text
            }
        };

    case END_LOADING:
        return {
            ...state,
            [action.id]: {
                isLoading: false
            }
        };

    default:
        return state;
    }
}

export default loadingReducer