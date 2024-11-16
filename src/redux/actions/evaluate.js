export const GET_EVALUATE = "GET_EVALUATE";
export const GET_EVALUATE_SUCCESS = "GET_EVALUATE_SUCCESS";
export const GET_EVALUATE_FAILED = "GET_EVALUATE_FAILED";

export const GET_EVALUATE_DGNL = "GET_EVALUATE_DGNL";
export const GET_EVALUATE_DGNL_SUCCESS = "GET_EVALUATE_DGNL_SUCCESS";
export const GET_EVALUATE_DGNL_FAILED = "GET_EVALUATE_DGNL_FAILED";

export const GET_EVALUATES = "GET_EVALUATES";
export const GET_EVALUATES_SUCCESS = "GET_EVALUATES_SUCCESS";
export const GET_EVALUATES_FAILED = "GET_EVALUATES_FAILED";

export const GET_EVALUATES_DGNL = "GET_EVALUATES_DGNL";
export const GET_EVALUATES_DGNL_SUCCESS = "GET_EVALUATES_DGNL_SUCCESS";
export const GET_EVALUATES_DGNL_FAILED = "GET_EVALUATES_DGNL_FAILED";

export const DELETE_EVALUATE = "DELETE_EVALUATE";
export const DELETE_EVALUATE_SUCCESS = "DELETE_EVALUATE_SUCCESS";
export const DELETE_EVALUATE_FAILED = "DELETE_EVALUATE_FAILED";

export const DELETE_EVALUATE_DGNL = "DELETE_EVALUATE_DGNL";
export const DELETE_EVALUATE_DGNL_SUCCESS = "DELETE_EVALUATE_DGNL_SUCCESS";
export const DELETE_EVALUATE_DGNL_FAILED = "DELETE_EVALUATE_DGNL_FAILED";

export const EDIT_EVALUATE = "EDIT_EVALUATE";
export const EDIT_EVALUATE_SUCCESS = "EDIT_EVALUATE_SUCCESS";
export const EDIT_EVALUATE_FAILED = "EDIT_EVALUATE_FAILED";

export const EDIT_EVALUATE_DGNL = "EDIT_EVALUATE_DGNL";
export const EDIT_EVALUATE_DGNL_SUCCESS = "EDIT_EVALUATE_DGNL_SUCCESS";
export const EDIT_EVALUATE_DGNL_FAILED = "EDIT_EVALUATE_DGNL_FAILED";

export const CREATE_EVALUATE = "CREATE_EVALUATE";
export const CREATE_EVALUATE_SUCCESS = "CREATE_EVALUATE_SUCCESS";
export const CREATE_EVALUATE_FAILED = "CREATE_EVALUATE_FAILED";

export const CREATE_EVALUATE_DGNL = "CREATE_EVALUATE_DGNL";
export const CREATE_EVALUATE_DGNL_SUCCESS = "CREATE_EVALUATE_DGNL_SUCCESS";
export const CREATE_EVALUATE_DGNL_FAILED = "CREATE_EVALUATE_DGNL_FAILED";

export function getEVALUATE(params, callback) {
    return {
        type: GET_EVALUATE,
        params,
        callback,
    };
}

export function getEvaluationDGNL(params, callback) {
    return {
        type: GET_EVALUATE_DGNL,
        params,
        callback,
    };
}

export function getEVALUATEs(params, callback) {
    return {
        type: GET_EVALUATES,
        params,
        callback,
    };
}

export function getEVALUATEsDGNL(params, callback) {
    return {
        type: GET_EVALUATES_DGNL,
        params,
        callback,
    };
}

export function DeleteEVALUATE(params, callback) {
    return {
        type: DELETE_EVALUATE,
        params,
        callback,
    };
}

export function DeleteEvaluationDGNL(params, callback) {
    return {
        type: DELETE_EVALUATE_DGNL,
        params,
        callback,
    };
}

export function EditEVALUATE(params, callback) {
    return {
        type: EDIT_EVALUATE,
        params,
        callback,
    };
}

export function EditEvaluationDGNL(params, callback) {
    return {
        type: EDIT_EVALUATE_DGNL,
        params,
        callback,
    };
}

export function CreateEVALUATE(params, callback) {
    return {
        type: CREATE_EVALUATE,
        params,
        callback,
    };
}

export function CreateEvaluationDGNL(params, callback) {
    return {
        type: CREATE_EVALUATE_DGNL,
        params,
        callback,
    };
}
