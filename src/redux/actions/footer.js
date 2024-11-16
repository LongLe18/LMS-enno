export const GET_FOOTER = "GET_FOOTER";
export const GET_FOOTER_SUCCESS = "GET_FOOTER_SUCCESS";
export const GET_FOOTER_FAILED = "GET_FOOTER_FAILED";

export const GET_FOOTERS = "GET_FOOTERS";
export const GET_FOOTERS_SUCCESS = "GET_FOOTERS_SUCCESS";
export const GET_FOOTERS_FAILED = "GET_FOOTERS_FAILED";

export const DELETE_FOOTER = "DELETE_FOOTER";
export const DELETE_FOOTER_SUCCESS = "DELETE_FOOTER_SUCCESS";
export const DELETE_FOOTER_FAILED = "DELETE_FOOTER_FAILED";

export const EDIT_FOOTER = "EDIT_FOOTER";
export const EDIT_FOOTER_SUCCESS = "EDIT_FOOTER_SUCCESS";
export const EDIT_FOOTER_FAILED = "EDIT_FOOTER_FAILED";

export const CREATE_FOOTER = "CREATE_FOOTER";
export const CREATE_FOOTER_SUCCESS = "CREATE_FOOTER_SUCCESS";
export const CREATE_FOOTER_FAILED = "CREATE_FOOTER_FAILED";

export function getFOOTER(params, callback) {
    return {
        type: GET_FOOTER,
        params,
        callback,
    };
}

export function getFOOTERs(params, callback) {
    return {
        type: GET_FOOTERS,
        params,
        callback,
    };
}

export function DeleteFOOTER(params, callback) {
    return {
        type: DELETE_FOOTER,
        params,
        callback,
    };
}

export function EditFOOTER(params, callback) {
    return {
        type: EDIT_FOOTER,
        params,
        callback,
    };
}

export function CreateFOOTER(params, callback) {
    return {
        type: CREATE_FOOTER,
        params,
        callback,
    };
}