export const GET_THEMATIC = "GET_THEMATIC";
export const GET_THEMATIC_SUCCESS = "GET_THEMATIC_SUCCESS";
export const GET_THEMATIC_FAILED = "GET_THEMATIC_FAILED";

export const GET_THEMATICS = "GET_THEMATICS";
export const GET_THEMATICS_SUCCESS = "GET_THEMATICS_SUCCESS";
export const GET_THEMATICS_FAILED = "GET_THEMATICS_FAILED";

export const FILTER_THEMATICS = "FILTER_THEMATICS";
export const FILTER_THEMATICS_SUCCESS = "FILTER_THEMATICS_SUCCESS";
export const FILTER_THEMATICS_FAILED = "FILTER_THEMATICS_FAILED";

export const GET_THEMATICS_IDMODULE = "GET_THEMATICS_IDMODULE";
export const GET_THEMATICS_IDMODULE_SUCCESS = "GET_THEMATICS_IDMODULE_SUCCESS";
export const GET_THEMATICS_IDMODULE_FAILED = "GET_THEMATICS_IDMODULE_FAILED";

export const DELETE_THEMATIC = "DELETE_THEMATIC";
export const DELETE_THEMATIC_SUCCESS = "DELETE_THEMATIC_SUCCESS";
export const DELETE_THEMATIC_FAILED = "DELETE_THEMATIC_FAILED";

export const EDIT_THEMATIC = "EDIT_THEMATIC";
export const EDIT_THEMATIC_SUCCESS = "EDIT_THEMATIC_SUCCESS";
export const EDIT_THEMATIC_FAILED = "EDIT_THEMATIC_FAILED";

export const CREATE_THEMATIC = "CREATE_THEMATIC";
export const CREATE_THEMATIC_SUCCESS = "CREATE_THEMATIC_SUCCESS";
export const CREATE_THEMATIC_FAILED = "CREATE_THEMATIC_FAILED";

export function getThematic(params, callback) {
    return {
        type: GET_THEMATIC,
        params,
        callback,
    };
}

export function getThematicsByIdModule(params, callback) {
    return {
        type: GET_THEMATICS_IDMODULE,
        params,
        callback,
    };
}

export function getThematics(params, callback) {
    return {
        type: GET_THEMATICS,
        params,
        callback,
    };
}

export function filterThematics(params, callback) {
    return {
        type: FILTER_THEMATICS,
        params,
        callback,
    };
}

export function DeleteThematic(params, callback) {
    return {
        type: DELETE_THEMATIC,
        params,
        callback,
    };
}

export function EditThematic(params, callback) {
    return {
        type: EDIT_THEMATIC,
        params,
        callback,
    };
}

export function CreateThematic(params, callback) {
    return {
        type: CREATE_THEMATIC,
        params,
        callback,
    };
}