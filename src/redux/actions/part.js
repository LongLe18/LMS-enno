export const GET_MODULE = "GET_MODULE";
export const GET_MODULE_SUCCESS = "GET_MODULE_SUCCESS";
export const GET_MODULE_FAILED = "GET_MODULE_FAILED";

export const GET_MODULES = "GET_MODULES";
export const GET_MODULES_SUCCESS = "GET_MODULES_SUCCESS";
export const GET_MODULES_FAILED = "GET_MODULES_FAILED";

export const GET_MODULES_IDCOURSE = "GET_MODULES_IDCOURSE";
export const GET_MODULES_IDCOURSE_SUCCESS = "GET_MODULES_IDCOURSE_SUCCESS";
export const GET_MODULES_IDCOURSE_FAILED = "GET_MODULES_IDCOURSE_FAILED";

export const GET_MODULES_IDCOURSE_2 = "GET_MODULES_IDCOURSE_2";
export const GET_MODULES_IDCOURSE_2_SUCCESS = "GET_MODULES_IDCOURSE_2_SUCCESS";
export const GET_MODULES_IDCOURSE_2_FAILED = "GET_MODULES_IDCOURSE_2_FAILED";

export const FILTER_MODULES = 'FILTER_MODULES';
export const FILTER_MODULES_SUCCESS = 'FILTER_MODULES_SUCCESS';
export const FILTER_MODULES_FALIED = 'FILTER_MODULES_FALIED';

export const DELETE_MODULE = "DELETE_MODULE";
export const DELETE_MODULE_SUCCESS = "DELETE_MODULE_SUCCESS";
export const DELETE_MODULE_FAILED = "DELETE_MODULE_FAILED";

export const CHANGE_MODULE = "CHANGE_MODULE";
export const CHANGE_MODULE_SUCCESS = "CHANGE_MODULE_SUCCESS";
export const CHANGE_MODULE_FAILED = "CHANGE_MODULE_FAILED";

export const EDIT_MODULE = "EDIT_MODULE";
export const EDIT_MODULE_SUCCESS = "EDIT_MODULE_SUCCESS";
export const EDIT_MODULE_FAILED = "EDIT_MODULE_FAILED";

export const CREATE_MODULE = "CREATE_MODULE";
export const CREATE_MODULE_SUCCESS = "CREATE_MODULE_SUCCESS";
export const CREATE_MODULE_FAILED = "CREATE_MODULE_FAILED";

export function getModule(params, callback) {
    return {
        type: GET_MODULE,
        params,
        callback,
    };
}

export function getModules(params, callback) {
    return {
        type: GET_MODULES,
        params,
        callback,
    };
}

export function getModulesByIdCourse2(params, callback) {
    return {
        type: GET_MODULES_IDCOURSE_2,
        params,
        callback,
    };
}

export function getModulesByIdCourse(params, callback) {
    return {
        type: GET_MODULES_IDCOURSE,
        params,
        callback,
    }
}

export function filterModule(params, callback) {
    return {
        type: FILTER_MODULES,
        params,
        callback,
    }
}

export function DeleteModule(params, callback) {
    return {
        type: DELETE_MODULE,
        params,
        callback,
    };
}

export function EditModule(params, callback) {
    return {
        type: EDIT_MODULE,
        params,
        callback,
    };
}

export function CreateModule(params, callback) {
    return {
        type: CREATE_MODULE,
        params,
        callback,
    };
}

export function ChangeStatusModule(params, callback) {
    return {
        type: CHANGE_MODULE,
        params,
        callback,
    }
}