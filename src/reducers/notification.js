import { dict } from './../actions'

const {remote} = window.electron
const {setConfig, getConfig, dictConfig} = remote.getGlobal('configStorage')
const { NOTIFICATION_CENTER } = dictConfig

const {PUSH_NOTIFICATION, REMOVE_NOTIFICATION, SET_SEEN_NOTIFICATION} = dict

let fetchedNotification = NOTIFICATION_CENTER && getConfig(NOTIFICATION_CENTER);
//Hardcodded first notification
if(!fetchedNotification && NOTIFICATION_CENTER){
    setConfig(NOTIFICATION_CENTER, [{id: 0, title: "Concent", content: "", date: Date.now(), seen: false}])
    fetchedNotification = getConfig(NOTIFICATION_CENTER);
}

const initialState = {
    notificationList: fetchedNotification || []
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
            listAdd.push({id, title, content, date, seen: false})
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
    case SET_SEEN_NOTIFICATION: {
        const {notificationList} = state
        const listSeen = notificationList
            .map( item => {
                item.seen = true;
                return item;
            });
        setConfig(NOTIFICATION_CENTER, listSeen)
        return Object.assign({}, state, {
            notificationList: listSeen
        });

        return state;
    }
    default:
        return state;
    }
}

export default notify