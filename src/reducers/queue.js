import { dict } from './../actions'

const {ADD_QUEUE, REMOVE_FROM_QUEUE} = dict

const initialState = {
    next: []
}
const queue = (state = initialState, action) => {
    switch (action.type) {
    case ADD_QUEUE:
        return Object.assign({}, state, {
            next: [
                ...state.next,
                action.payload
            ]
        });
    case REMOVE_FROM_QUEUE:
        const list = [...state.next]
        if(list && list.length)
            list.splice(-1,1)
        return Object.assign({}, state, {
            next: [
                ...list
            ]
        });

    default:
        return state;
    }
}

export default queue