// Quản lý tài liệu
export const GET_DOC = "GET_DOC";
export const GET_DOC_SUCCESS = "GET_DOC_SUCCESS";
export const GET_DOC_FAILED = "GET_DOC_FAILED";

export const GET_DOCS = "GET_DOCS";
export const GET_DOCS_SUCCESS = "GET_DOCS_SUCCESS";
export const GET_DOCS_FAILED = "GET_DOCS_FAILED";

export const CHANGE_DOC = "CHANGE_DOC";
export const CHANGE_DOC_SUCCESS = "CHANGE_DOC_SUCCESS";
export const CHANGE_DOC_FAILED = "CHANGE_DOC_FAILED";

export const DELETE_DOC = "DELETE_DOC";
export const DELETE_DOC_SUCCESS = "DELETE_DOC_SUCCESS";
export const DELETE_DOC_FAILED = "DELETE_DOC_FAILED";

export const EDIT_DOC = "EDIT_DOC";
export const EDIT_DOC_SUCCESS = "EDIT_DOC_SUCCESS";
export const EDIT_DOC_FAILED = "EDIT_DOC_FAILED";

export const CREATE_DOC = "CREATE_DOC";
export const CREATE_DOC_SUCCESS = "CREATE_DOC_SUCCESS";
export const CREATE_DOC_FAILED = "CREATE_DOC_FAILED";

export function getDoc(params, callback) {
    return {
        type: GET_DOC,
        params,
        callback,
    };
}

export function getDocs(params, callback) {
    return {
        type: GET_DOCS,
        params,
        callback,
    };
}

export function ChangeDoc(params, callback) {
    return {
        type: CHANGE_DOC,
        params,
        callback,
    };
}

export function DeleteDoc(params, callback) {
    return {
        type: DELETE_DOC,
        params,
        callback,
    };
}

export function EditDoc(params, callback) {
    return {
        type: EDIT_DOC,
        params,
        callback,
    };
}

export function CreateDoc(params, callback) {
    return {
        type: CREATE_DOC,
        params,
        callback,
    };
}