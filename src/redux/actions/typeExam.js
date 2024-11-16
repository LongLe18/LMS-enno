export const GET_TYPE = "GET_TYPE";
export const GET_TYPE_SUCCESS = "GET_TYPE_SUCCESS";
export const GET_TYPE_FAILED = "GET_TYPE_FAILED";

export const GET_TYPES = "GET_TYPES";
export const GET_TYPES_SUCCESS = "GET_TYPES_SUCCESS";
export const GET_TYPES_FAILED = "GET_TYPES_FAILED";

export const DELETE_TYPE = "DELETE_TYPE";
export const DELETE_TYPE_SUCCESS = "DELETE_TYPE_SUCCESS";
export const DELETE_TYPE_FAILED = "DELETE_TYPE_FAILED";

export const EDIT_TYPE = "EDIT_TYPE";
export const EDIT_TYPE_SUCCESS = "EDIT_TYPE_SUCCESS";
export const EDIT_TYPE_FAILED = "EDIT_TYPE_FAILED";

export const CREATE_TYPE = "CREATE_TYPE";
export const CREATE_TYPE_SUCCESS = "CREATE_TYPE_SUCCESS";
export const CREATE_TYPE_FAILED = "CREATE_TYPE_FAILED";

export function getType(params, callback) {
    return {
        type: GET_TYPE,
        params,
        callback,
    };
}

export function getTypes(params, callback) {
    return {
        type: GET_TYPES,
        params,
        callback,
    };
}

export function createType(params, callback) {
    return {
        type: CREATE_TYPE,
        params,
        callback,
    };
}

export function editType(params, callback) {
    return {
        type: EDIT_TYPE,
        params,
        callback,
    };
}

export function deleteType(params, callback) {
    return {
        type: DELETE_TYPE,
        params,
        callback,
    };
}