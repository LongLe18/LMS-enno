export const GET_CONTACT = "GET_CONTACT";
export const GET_CONTACT_SUCCESS = "GET_CONTACT_SUCCESS";
export const GET_CONTACT_FAILED = "GET_CONTACT_FAILED";

export const GET_CONTACTS = "GET_CONTACTS";
export const GET_CONTACTS_SUCCESS = "GET_CONTACTS_SUCCESS";
export const GET_CONTACTS_FAILED = "GET_CONTACTS_FAILED";

export const DELETE_CONTACT = "DELETE_CONTACT";
export const DELETE_CONTACT_SUCCESS = "DELETE_CONTACT_SUCCESS";
export const DELETE_CONTACT_FAILED = "DELETE_CONTACT_FAILED";

export const EDIT_CONTACT = "EDIT_CONTACT";
export const EDIT_CONTACT_SUCCESS = "EDIT_CONTACT_SUCCESS";
export const EDIT_CONTACT_FAILED = "EDIT_CONTACT_FAILED";

export const CREATE_CONTACT = "CREATE_CONTACT";
export const CREATE_CONTACT_SUCCESS = "CREATE_CONTACT_SUCCESS";
export const CREATE_CONTACT_FAILED = "CREATE_CONTACT_FAILED";

export function getCONTACT(params, callback) {
    return {
        type: GET_CONTACT,
        params,
        callback,
    };
}

export function getCONTACTs(params, callback) {
    return {
        type: GET_CONTACTS,
        params,
        callback,
    };
}

export function DeleteCONTACT(params, callback) {
    return {
        type: DELETE_CONTACT,
        params,
        callback,
    };
}

export function EditCONTACT(params, callback) {
    return {
        type: EDIT_CONTACT,
        params,
        callback,
    };
}

export function CreateCONTACT(params, callback) {
    return {
        type: CREATE_CONTACT,
        params,
        callback,
    };
}