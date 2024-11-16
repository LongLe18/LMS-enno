export const GET_NOTIFICATION = "GET_NOTIFICATION";
export const GET_NOTIFICATION_SUCCESS = "GET_NOTIFICATION_SUCCESS";
export const GET_NOTIFICATION_FAILED = "GET_NOTIFICATION_FAILED";

export const GET_NOTIFICATIONS = "GET_NOTIFICATIONS";
export const GET_NOTIFICATIONS_SUCCESS = "GET_NOTIFICATIONS_SUCCESS";
export const GET_NOTIFICATIONS_FAILED = "GET_NOTIFICATIONS_FAILED";

export const FILTER_NOTIFICATIONS = "FILTER_NOTIFICATIONS";
export const FILTER_NOTIFICATIONS_SUCCESS = "FILTER_NOTIFICATIONS_SUCCESS";
export const FILTER_NOTIFICATIONS_FAILED = "FILTER_NOTIFICATIONS_FAILED";

export const CHANGE_NOTIFICATION = "CHANGE_NOTIFICATION";
export const CHANGE_NOTIFICATION_SUCCESS = "CHANGE_NOTIFICATION_SUCCESS";
export const CHANGE_NOTIFICATION_FAILED = "CHANGE_NOTIFICATION_FAILED";

export const GET_NOTIFICATIONS_USER = "GET_NOTIFICATIONS_USER";
export const GET_NOTIFICATIONS_USER_SUCCESS = "GET_NOTIFICATIONS_USER_SUCCESS";
export const GET_NOTIFICATIONS_USER_FAILED = "GET_NOTIFICATIONS_USER_FAILED";

export const DELETE_NOTIFICATION = "DELETE_NOTIFICATION";
export const DELETE_NOTIFICATION_SUCCESS = "DELETE_NOTIFICATION_SUCCESS";
export const DELETE_NOTIFICATION_FAILED = "DELETE_NOTIFICATION_FAILED";

export const EDIT_NOTIFICATION = "EDIT_NOTIFICATION";
export const EDIT_NOTIFICATION_SUCCESS = "EDIT_NOTIFICATION_SUCCESS";
export const EDIT_NOTIFICATION_FAILED = "EDIT_NOTIFICATION_FAILED";

export const CREATE_NOTIFICATION = "CREATE_NOTIFICATION";
export const CREATE_NOTIFICATION_SUCCESS = "CREATE_NOTIFICATION_SUCCESS";
export const CREATE_NOTIFICATION_FAILED = "CREATE_NOTIFICATION_FAILED";

export function getNOTIFICATION(params, callback) {
    return {
        type: GET_NOTIFICATION,
        params,
        callback,
    };
}

export function getNOTIFICATIONs(params, callback) {
    return {
        type: GET_NOTIFICATIONS,
        params,
        callback,
    };
}

export function filterNOTIFICATIONs(params, callback) {
    return {
        type: FILTER_NOTIFICATIONS,
        params,
        callback,
    };
}

export function DeleteNOTIFICATION(params, callback) {
    return {
        type: DELETE_NOTIFICATION,
        params,
        callback,
    };
}

export function EditNOTIFICATION(params, callback) {
    return {
        type: EDIT_NOTIFICATION,
        params,
        callback,
    };
}

export function CreateNOTIFICATION(params, callback) {
    return {
        type: CREATE_NOTIFICATION,
        params,
        callback,
    };
}

export function changeStatusNOTIFICATION(params, callback) {
    return {
        type: CHANGE_NOTIFICATION,
        params,
        callback,
    };
}

export function getNOTIFICATIONsByUser(params, callback) {
    return {
        type: GET_NOTIFICATIONS_USER,
        params,
        callback,
    };
}