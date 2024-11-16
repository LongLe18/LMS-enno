export const GET_EXCEPRT = "GET_EXCEPRT";
export const GET_EXCEPRT_SUCCESS = "GET_EXCEPRT_SUCCESS";
export const GET_EXCEPRT_FAILED = "GET_EXCEPRT_FAILED";

export const GET_EXCEPRTS = "GET_EXCEPRTS";
export const GET_EXCEPRTS_SUCCESS = "GET_EXCEPRTS_SUCCESS";
export const GET_EXCEPRTS_FAILED = "GET_EXCEPRTS_FAILED";

export const FILTER_EXCEPRTS = "FILTER_EXCEPRTS"
export const FILTER_EXCEPRTS_SUCCESS = "FILTER_EXCEPRTS_SUCCESS";
export const FILTER_EXCEPRTS_FAILED = "FILTER_EXCEPRTS_FAILED";

export const DELETE_EXCEPRT = "DELETE_EXCEPRT";
export const DELETE_EXCEPRT_SUCCESS = "DELETE_EXCEPRT_SUCCESS";
export const DELETE_EXCEPRT_FAILED = "DELETE_EXCEPRT_FAILED";

export const EDIT_EXCEPRT = "EDIT_EXCEPRT";
export const EDIT_EXCEPRT_SUCCESS = "EDIT_EXCEPRT_SUCCESS";
export const EDIT_EXCEPRT_FAILED = "EDIT_EXCEPRT_FAILED";

export const CREATE_EXCEPRT = "CREATE_EXCEPRT";
export const CREATE_EXCEPRT_SUCCESS = "CREATE_EXCEPRT_SUCCESS";
export const CREATE_EXCEPRT_FAILED = "CREATE_EXCEPRT_FAILED";


export function getEXCEPRT(params, callback) {
    return {
        type: GET_EXCEPRT,
        params,
        callback,
    };
}

export function getExceprts(params, callback) {
    return {
        type: GET_EXCEPRTS,
        params,
        callback,
    };
}

export function filterEXCEPRT(params, callback) {
    return {
        type: FILTER_EXCEPRTS,
        params,
        callback,
    };
}

export function createEXCEPRT(params, callback) {
    return {
        type: CREATE_EXCEPRT,
        params,
        callback,
    };
}

export function editEXCEPRT(params, callback) {
    return {
        type: EDIT_EXCEPRT,
        params,
        callback,
    };
}

export function deleteEXCEPRT(params, callback) {
    return {
        type: DELETE_EXCEPRT,
        params,
        callback,
    };
}
