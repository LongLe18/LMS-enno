export const GET_RECEIPT = "GET_RECEIPT";
export const GET_RECEIPT_SUCCESS = "GET_RECEIPT_SUCCESS";
export const GET_RECEIPT_FAILED = "GET_RECEIPT_FAILED";

export const GET_RECEIPTS = "GET_RECEIPTS";
export const GET_RECEIPTS_SUCCESS = "GET_RECEIPTS_SUCCESS";
export const GET_RECEIPTS_FAILED = "GET_RECEIPTS_FAILED";

export const GET_RECEIPTS_USER = "GET_RECEIPTS_USER";
export const GET_RECEIPTS_USER_SUCCESS = "GET_RECEIPTS_USER_SUCCESS";
export const GET_RECEIPTS_USER_FAILED = "GET_RECEIPTS_USER_FAILED";

export const GET_RECEIPT_DETAIL_USER = "GET_RECEIPT_DETAIL_USER";
export const GET_RECEIPT_DETAIL_USER_SUCCESS = "GET_RECEIPT_DETAIL_USER_SUCCESS";
export const GET_RECEIPT_DETAIL_USER_FAILED = "GET_RECEIPT_DETAIL_USER_FAILED";

export const GET_RECEIPTS_DETAIL = "GET_RECEIPTS_DETAIL";
export const GET_RECEIPTS_DETAIL_SUCCESS = "GET_RECEIPTS_DETAIL_SUCCESS";
export const GET_RECEIPTS_DETAIL_FAILED = "GET_RECEIPTS_DETAIL_FAILED";

export const GET_RECEIPT_DETAIL = "GET_RECEIPT_DETAIL";
export const GET_RECEIPT_DETAIL_SUCCESS = "GET_RECEIPT_DETAIL_SUCCESS";
export const GET_RECEIPT_DETAIL_FAILED = "GET_RECEIPT_DETAIL_FAILED";

export const CHANGE_RECEIPT = "CHANGE_RECEIPT";
export const CHANGE_RECEIPT_SUCCESS = "CHANGE_RECEIPT_SUCCESS";
export const CHANGE_RECEIPT_FAILED = "CHANGE_RECEIPT_FAILED";

export const DELETE_RECEIPT = "DELETE_RECEIPT";
export const DELETE_RECEIPT_SUCCESS = "DELETE_RECEIPT_SUCCESS";
export const DELETE_RECEIPT_FAILED = "DELETE_RECEIPT_FAILED";

export const DELETE_RECEIPT_DETAIL = "DELETE_RECEIPT_DETAIL";
export const DELETE_RECEIPT_DETAIL_SUCCESS = "DELETE_RECEIPT_DETAIL_SUCCESS";
export const DELETE_RECEIPT_DETAIL_FAILED = "DELETE_RECEIPTDELETE_RECEIPT_DETAIL_FAILED_FAILED";

export const EDIT_RECEIPT = "EDIT_RECEIPT";
export const EDIT_RECEIPT_SUCCESS = "EDIT_RECEIPT_SUCCESS";
export const EDIT_RECEIPT_FAILED = "EDIT_RECEIPT_FAILED";

export const EDIT_RECEIPT_DETAIL = "EDIT_RECEIPT_DETAIL";
export const EDIT_RECEIPT_DETAIL_SUCCESS = "EDIT_RECEIPT_DETAIL_SUCCESS";
export const EDIT_RECEIPT_DETAIL_FAILED = "EDIT_RECEIPT_DETAIL_FAILED";

export const CREATE_RECEIPT = "CREATE_RECEIPT";
export const CREATE_RECEIPT_SUCCESS = "CREATE_RECEIPT_SUCCESS";
export const CREATE_RECEIPT_FAILED = "CREATE_RECEIPT_FAILED";

export const CREATE_RECEIPT_DETAIL = "CREATE_RECEIPT_DETAIL";
export const CREATE_RECEIPT_DETAIL_SUCCESS = "CREATE_RECEIPT_DETAIL_SUCCESS";
export const CREATE_RECEIPT_DETAIL_FAILED = "CREATE_RECEIPT_DETAIL_FAILED";

export function getRECEIPT(params, callback) {
    return {
        type: GET_RECEIPT,
        params,
        callback,
    };
}

export function getRECEIPTDetail(params, callback) {
    return {
        type: GET_RECEIPT_DETAIL,
        params,
        callback,
    };
}

export function getRECEIPTDetailUser(params, callback) {
    return {
        type: GET_RECEIPT_DETAIL_USER,
        params,
        callback,
    };
}

export function getRECEIPTs(params, callback) {
    return {
        type: GET_RECEIPTS,
        params,
        callback,
    };
}

export function getRECEIPTsDetail(params, callback) {
    return {
        type: GET_RECEIPTS_DETAIL,
        params,
        callback,
    };
}

export function DeleteRECEIPT(params, callback) {
    return {
        type: DELETE_RECEIPT,
        params,
        callback,
    };
}

export function DeleteRECEIPTDetail(params, callback) {
    return {
        type: DELETE_RECEIPT_DETAIL,
        params,
        callback,
    };
}

export function EditRECEIPT(params, callback) {
    return {
        type: EDIT_RECEIPT,
        params,
        callback,
    };
}

export function EditRECEIPTDetail(params, callback) {
    return {
        type: EDIT_RECEIPT_DETAIL,
        params,
        callback,
    };
}

export function CreateRECEIPT(params, callback) {
    return {
        type: CREATE_RECEIPT,
        params,
        callback,
    };
}

export function CreateRECEIPTDetail(params, callback) {
    return {
        type: CREATE_RECEIPT_DETAIL,
        params,
        callback,
    };
}

export function changeStaRECEIPT(params, callback) {
    return {
        type: CHANGE_RECEIPT,
        params,
        callback,
    };
}

export function getRECEIPTsUser(params, callback) {
    return {
        type: GET_RECEIPTS_USER,
        params,
        callback,
    };
}
