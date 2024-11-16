export const GET_CLASS = "GET_CLASS";
export const GET_CLASS_SUCCESS = "GET_CLASS_SUCCESS";
export const GET_CLASS_FAILED = "GET_CLASS_FAILED";

export const GET_MAJOR = "GET_MAJOR";
export const GET_MAJOR_SUCCESS = "GET_MAJOR_SUCCESS";
export const GET_MAJOR_FAILED = "GET_MAJOR_FAILED";

export const GET_MAJORS = "GET_MAJORS";
export const GET_MAJORS_SUCCESS = "GET_MAJORS_SUCCESS";
export const GET_MAJORS_FAILED = "GET_MAJORS_FAILED";

export const CREATE_MAJOR = "CREATE_MAJOR";
export const CREATE_MAJOR_SUCCESS = "CREATE_MAJOR_SUCCESS";
export const CREATE_MAJOR_FAILED = "CREATE_MAJOR_FAILED";

export const EDIT_MAJOR = "EDIT_MAJOR";
export const EDIT_MAJOR_SUCCESS = "EDIT_MAJOR_SUCCESS";
export const EDIT_MAJOR_FAILED = "EDIT_MAJOR_FAILED";

export const DELETE_MAJOR = "DELETE_MAJOR";
export const DELETE_MAJOR_SUCCESS = "DELETE_MAJOR_SUCCESS";
export const DELETE_MAJOR_FAILED = "DELETE_MAJOR_FAILED";

export function getClass(params, callback) {
    return {
        type: GET_CLASS,
        params,
        callback,
    };
}

export function getMajor(params, callback) {
    return {
        type: GET_MAJOR,
        params,
        callback,
    };
}

export function getMajors(params, callback) {
    return {
        type: GET_MAJORS,
        params,
        callback,
    };
}

export function createMajor(params, callback) {
    return {
        type: CREATE_MAJOR,
        params,
        callback,
    };
}

export function editMajor(params, callback) {
    return {
        type: EDIT_MAJOR,
        params,
        callback,
    };
}

export function deleteMajor(params, callback) {
    return {
        type: DELETE_MAJOR,
        params,
        callback,
    };
}