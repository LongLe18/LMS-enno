import * as notificationActions from '../actions/notification';

const initState = {
    item: {
        loading: false,
        result: {},
        error: null,
    },
    list: {
        loading: false,
        result: {},
        error: null,
    },
    listUser: {
        loading: false,
        result: {},
        error: null,
    }
}

export default function notificationReducer(state = initState, action) {
    switch(action.type) {
        // get a NOTIFICATION
        case notificationActions.GET_NOTIFICATION:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case notificationActions.GET_NOTIFICATION_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case notificationActions.GET_NOTIFICATION_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        // get a list of NOTIFICATIONs
        case notificationActions.GET_NOTIFICATIONS:
            return {
                ...state,
                list: { ...state.list, loading: true },
            };
        case notificationActions.GET_NOTIFICATIONS_SUCCESS:
            return {
                ...state,
                list: { ...state.list, loading: false, result: action.result },
            };
        case notificationActions.GET_NOTIFICATIONS_FAILED:
            return {
                ...state,
                list: { ...state.list, loading: false, error: action.error },
            };
        // delete a NOTIFICATION
        case notificationActions.DELETE_NOTIFICATION:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case notificationActions.DELETE_NOTIFICATION_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case notificationActions.DELETE_NOTIFICATION_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        // edit a NOTIFICATION
        case notificationActions.EDIT_NOTIFICATION:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case notificationActions.EDIT_NOTIFICATION_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case notificationActions.EDIT_NOTIFICATION_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error }
            }
        // create a NOTIFICATION
        case notificationActions.CREATE_NOTIFICATION:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case notificationActions.CREATE_NOTIFICATION_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case notificationActions.CREATE_NOTIFICATION_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        /// filter NOTIFICATIONs
        case notificationActions.FILTER_NOTIFICATIONS:
            return {
                ...state,
                list: { ...state.list, loading: true },
            };
        case notificationActions.FILTER_NOTIFICATIONS_SUCCESS:
            return {
                ...state,
                list: { ...state.list, loading: false, result: action.result },
            };
        case notificationActions.FILTER_NOTIFICATIONS_FAILED:
            return {
                ...state,
                list: { ...state.list, loading: false, error: action.error },
            };
        ///////////////////////////////////////////
        case notificationActions.CHANGE_NOTIFICATION:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case notificationActions.CHANGE_NOTIFICATION_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case notificationActions.CHANGE_NOTIFICATION_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        //////////////////////////////////
        case notificationActions.GET_NOTIFICATIONS_USER:
            return {
                ...state,
                listUser: { ...state.listUser, loading: true },
            };
        case notificationActions.GET_NOTIFICATIONS_USER_SUCCESS:
            return {
                ...state,
                listUser: { ...state.listUser, loading: false, result: action.result },
            };
        case notificationActions.GET_NOTIFICATIONS_USER_FAILED:
            return {
                ...state,
                listUser: { ...state.listUser, loading: false, error: action.error },
            };
        default:
            return state;
    }
}