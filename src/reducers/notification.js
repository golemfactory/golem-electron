import { dict } from './../actions'

const {remote} = window.electron
const {setConfig, getConfig, dictConfig} = remote.getGlobal('configStorage')
const { NOTIFICATION_CENTER } = dictConfig

const {PUSH_NOTIFICATION, REMOVE_NOTIFICATION} = dict

const initialState = {
    notificationList: getConfig(NOTIFICATION_CENTER) || []
}

function isAlreadyIn(list, id) {
    return list.findIndex( item => item.id === id ) > -1
}

const notify = (state = initialState, action) => {
    switch (action.type) {
    case PUSH_NOTIFICATION: {
        const {id, title, content, date} = action.payload
        const listAdd = state.notificationList

        if(isAlreadyIn(listAdd, id)){
            console.warn(`${id} - ${title} already registered in notification center.`)
        } else {
            listAdd.push({id, title, content, date})
            setConfig(NOTIFICATION_CENTER, listAdd)

            return Object.assign({}, state, {
                notificationList: listAdd
            });
        }

        return state
    }
    case REMOVE_NOTIFICATION: {
        const notificationId = action.payload
        const {notificationList} = state
        
        if(isAlreadyIn(notificationList, notificationId)){
            const listRemove = notificationList.filter( item => item.id === notificationId)

            setConfig(NOTIFICATION_CENTER, listRemove)

            return Object.assign({}, state, {
                notificationList: listRemove
            });
        } else {
            console.warn(`${id} - ${title} not in notification center.`)
        }

        return state;
    }
    default:
        return state;
    }
}

export default notify