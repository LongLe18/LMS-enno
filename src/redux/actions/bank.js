export const GET_BANK = "GET_BANK";
export const GET_BANK_SUCCESS = "GET_BANK_SUCCESS";
export const GET_BANK_FAILED = "GET_BANK_FAILED";

export const GET_BANKS = "GET_BANKS";
export const GET_BANKS_SUCCESS = "GET_BANKS_SUCCESS";
export const GET_BANKS_FAILED = "GET_BANKS_FAILED";

export const FILTER_BANKS = "FILTER_BANKS";
export const FILTER_BANKS_SUCCESS = "FILTER_BANKS_SUCCESS";
export const FILTER_BANKS_FAILED = "FILTER_BANKS_FAILED";


export const DELETE_BANK = "DELETE_BANK";
export const DELETE_BANK_SUCCESS = "DELETE_BANK_SUCCESS";
export const DELETE_BANK_FAILED = "DELETE_BANK_FAILED";

export const EDIT_BANK = "EDIT_BANK";
export const EDIT_BANK_SUCCESS = "EDIT_BANK_SUCCESS";
export const EDIT_BANK_FAILED = "EDIT_BANK_FAILED";

export const CREATE_BANK = "CREATE_BANK";
export const CREATE_BANK_SUCCESS = "CREATE_BANK_SUCCESS";
export const CREATE_BANK_FAILED = "CREATE_BANK_FAILED";

export function getBANK(params, callback) {
    return {
        type: GET_BANK,
        params,
        callback,
    };
}

export function getBANKs(params, callback) {
    return {
        type: GET_BANKS,
        params,
        callback,
    };
}

export function filterBANKs(params, callback) {
    return {
        type: FILTER_BANKS,
        params,
        callback,
    };
}

export function DeleteBANK(params, callback) {
    return {
        type: DELETE_BANK,
        params,
        callback,
    };
}

export function EditBANK(params, callback) {
    return {
        type: EDIT_BANK,
        params,
        callback,
    };
}

export function CreateBANK(params, callback) {
    return {
        type: CREATE_BANK,
        params,
        callback,
    };
}