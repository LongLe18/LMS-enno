// Quảng cáo tài liệu
export const GET_ADSDOC = "GET_ADSDOC";
export const GET_ADSDOC_SUCCESS = "GET_ADSDOC_SUCCESS";
export const GET_ADSDOC_FAILED = "GET_ADSDOC_FAILED";

export const GET_ADSDOCS = "GET_ADSDOCS";
export const GET_ADSDOCS_SUCCESS = "GET_ADSDOCS_SUCCESS";
export const GET_ADSDOCS_FAILED = "GET_ADSDOCS_FAILED";

export const CHANGE_ADSDOC = "CHANGE_ADSDOC";
export const CHANGE_ADSDOC_SUCCESS = "CHANGE_ADSDOC_SUCCESS";
export const CHANGE_ADSDOC_FAILED = "CHANGE_ADSDOC_FAILED";

export const DELETE_ADSDOC = "DELETE_ADSDOC";
export const DELETE_ADSDOC_SUCCESS = "DELETE_ADSDOC_SUCCESS";
export const DELETE_ADSDOC_FAILED = "DELETE_ADSDOC_FAILED";

export const EDIT_ADSDOC = "EDIT_ADSDOC";
export const EDIT_ADSDOC_SUCCESS = "EDIT_ADSDOC_SUCCESS";
export const EDIT_ADSDOC_FAILED = "EDIT_ADSDOC_FAILED";

export const CREATE_ADSDOC = "CREATE_ADSDOC";
export const CREATE_ADSDOC_SUCCESS = "CREATE_ADSDOC_SUCCESS";
export const CREATE_ADSDOC_FAILED = "CREATE_ADSDOC_FAILED";

export function getAdsDoc(params, callback) {
    return {
        type: GET_ADSDOC,
        params,
        callback,
    };
}

export function getAdsDocs(params, callback) {
    return {
        type: GET_ADSDOCS,
        params,
        callback,
    };
}

export function ChangeAdsDoc(params, callback) {
    return {
        type: CHANGE_ADSDOC,
        params,
        callback,
    };
}

export function DeleteAdsDoc(params, callback) {
    return {
        type: DELETE_ADSDOC,
        params,
        callback,
    };
}

export function EditAdsDoc(params, callback) {
    return {
        type: EDIT_ADSDOC,
        params,
        callback,
    };
}

export function CreateAdsDoc(params, callback) {
    return {
        type: CREATE_ADSDOC,
        params,
        callback,
    };
}

// QUảng cáo khóa học
export const GET_ADSCOURSE = "GET_ADSCOURSE";
export const GET_ADSCOURSE_SUCCESS = "GET_ADSCOURSE_SUCCESS";
export const GET_ADSCOURSE_FAILED = "GET_ADSCOURSE_FAILED";

export const GET_ADSCOURSES = "GET_ADSCOURSES";
export const GET_ADSCOURSES_SUCCESS = "GET_ADSCOURSES_SUCCESS";
export const GET_ADSCOURSES_FAILED = "GET_ADSCOURSES_FAILED";

export const CHANGE_ADSCOURSE = "CHANGE_ADSCOURSE";
export const CHANGE_ADSCOURSE_SUCCESS = "CHANGE_ADSCOURSE_SUCCESS";
export const CHANGE_ADSCOURSE_FAILED = "CHANGE_ADSCOURSE_FAILED";

export const DELETE_ADSCOURSE = "DELETE_ADSCOURSE";
export const DELETE_ADSCOURSE_SUCCESS = "DELETE_ADSCOURSE_SUCCESS";
export const DELETE_ADSCOURSE_FAILED = "DELETE_ADSCOURSE_FAILED";

export const EDIT_ADSCOURSE = "EDIT_ADSCOURSE";
export const EDIT_ADSCOURSE_SUCCESS = "EDIT_ADSCOURSE_SUCCESS";
export const EDIT_ADSCOURSE_FAILED = "EDIT_ADSCOURSE_FAILED";

export const CREATE_ADSCOURSE = "CREATE_ADSCOURSE";
export const CREATE_ADSCOURSE_SUCCESS = "CREATE_ADSCOURSE_SUCCESS";
export const CREATE_ADSCOURSE_FAILED = "CREATE_ADSCOURSE_FAILED";

export function getAdsCourse(params, callback) {
    return {
        type: GET_ADSCOURSE,
        params,
        callback,
    };
}

export function getAdsCourses(params, callback) {
    return {
        type: GET_ADSCOURSES,
        params,
        callback,
    };
}

export function ChangeAdsCourse(params, callback) {
    return {
        type: CHANGE_ADSCOURSE,
        params,
        callback,
    };
}

export function DeleteAdsCourse(params, callback) {
    return {
        type: DELETE_ADSCOURSE,
        params,
        callback,
    };
}

export function EditAdsCourse(params, callback) {
    return {
        type: EDIT_ADSCOURSE,
        params,
        callback,
    };
}

export function CreateAdsCourse(params, callback) {
    return {
        type: CREATE_ADSCOURSE,
        params,
        callback,
    };
}

// QUảng cáo giáo viên
export const GET_ADSTEACHER = "GET_ADSTEACHER";
export const GET_ADSTEACHER_SUCCESS = "GET_ADSTEACHER_SUCCESS";
export const GET_ADSTEACHER_FAILED = "GET_ADSTEACHER_FAILED";

export const GET_ADSTEACHERS = "GET_ADSTEACHERS";
export const GET_ADSTEACHERS_SUCCESS = "GET_ADSTEACHERS_SUCCESS";
export const GET_ADSTEACHERS_FAILED = "GET_ADSTEACHERS_FAILED";

export const CHANGE_ADSTEACHER = "CHANGE_ADSTEACHER";
export const CHANGE_ADSTEACHER_SUCCESS = "CHANGE_ADSTEACHER_SUCCESS";
export const CHANGE_ADSTEACHER_FAILED = "CHANGE_ADSTEACHER_FAILED";

export const DELETE_ADSTEACHER = "DELETE_ADSTEACHER";
export const DELETE_ADSTEACHER_SUCCESS = "DELETE_ADSTEACHER_SUCCESS";
export const DELETE_ADSTEACHER_FAILED = "DELETE_ADSTEACHER_FAILED";

export const EDIT_ADSTEACHER = "EDIT_ADSTEACHER";
export const EDIT_ADSTEACHER_SUCCESS = "EDIT_ADSTEACHER_SUCCESS";
export const EDIT_ADSTEACHER_FAILED = "EDIT_ADSTEACHER_FAILED";

export const CREATE_ADSTEACHER = "CREATE_ADSTEACHER";
export const CREATE_ADSTEACHER_SUCCESS = "CREATE_ADSTEACHER_SUCCESS";
export const CREATE_ADSTEACHER_FAILED = "CREATE_ADSTEACHER_FAILED";

export function getAdsTeacher(params, callback) {
    return {
        type: GET_ADSTEACHER,
        params,
        callback,
    };
}

export function getAdsTeachers(params, callback) {
    return {
        type: GET_ADSTEACHERS,
        params,
        callback,
    };
}

export function ChangeAdsTeacher(params, callback) {
    return {
        type: CHANGE_ADSTEACHER,
        params,
        callback,
    };
}

export function DeleteAdsTeacher(params, callback) {
    return {
        type: DELETE_ADSTEACHER,
        params,
        callback,
    };
}

export function EditAdsTeacher(params, callback) {
    return {
        type: EDIT_ADSTEACHER,
        params,
        callback,
    };
}

export function CreateAdsTeacher(params, callback) {
    return {
        type: CREATE_ADSTEACHER,
        params,
        callback,
    };
}