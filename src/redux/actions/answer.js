export const GET_ANSWER = "GET_ANSWER";
export const GET_ANSWER_SUCCESS = "GET_ANSWER_SUCCESS";
export const GET_ANSWER_FAILED = "GET_ANSWER_FAILED";

export const GET_ANSWERS = "GET_ANSWERS";
export const GET_ANSWERS_SUCCESS = "GET_ANSWERS_SUCCESS";
export const GET_ANSWERS_FAILED = "GET_ANSWERS_FAILED";

export const FILTER_ANSWERS = "FILTER_ANSWERS"
export const FILTER_ANSWERS_SUCCESS = "FILTER_ANSWERS_SUCCESS";
export const FILTER_ANSWERS_FAILED = "FILTER_ANSWERS_FAILED";

export const DELETE_ANSWER = "DELETE_ANSWER";
export const DELETE_ANSWER_SUCCESS = "DELETE_ANSWER_SUCCESS";
export const DELETE_ANSWER_FAILED = "DELETE_ANSWER_FAILED";

export const EDIT_ANSWER = "EDIT_ANSWER";
export const EDIT_ANSWER_SUCCESS = "EDIT_ANSWER_SUCCESS";
export const EDIT_ANSWER_FAILED = "EDIT_ANSWER_FAILED";

export const CREATE_ANSWER = "CREATE_ANSWER";
export const CREATE_ANSWER_SUCCESS = "CREATE_ANSWER_SUCCESS";
export const CREATE_ANSWER_FAILED = "CREATE_ANSWER_FAILED";

// cho bảng dap_an_da_chon
export const GET_ANSWER_USER = "GET_ANSWER_USER";
export const GET_ANSWER_USER_SUCCESS = "GET_ANSWER_USER_SUCCESS";
export const GET_ANSWER_USER_FAILED = "GET_ANSWER_USER_FAILED";

export const GET_ANSWERS_USER = "GET_ANSWERS_USER";
export const GET_ANSWERS_USER_SUCCESS = "GET_ANSWERS_USER_SUCCESS";
export const GET_ANSWERS_USER_FAILED = "GET_ANSWERS_USER_FAILED";

export const CREATE_ANSWER_USER = "CREATE_ANSWER_USER";
export const CREATE_ANSWER_USER_SUCCESS = "CREATE_ANSWER_USER_SUCCESS";
export const CREATE_ANSWER_USER_FAILED = "CREATE_ANSWER_USER_FAILED";

export const EDIT_ANSWER_USER = "EDIT_ANSWER_USER";
export const EDIT_ANSWER_USER_SUCCESS = "EDIT_ANSWER_USER_SUCCESS";
export const EDIT_ANSWER_USER_FAILED = "EDIT_ANSWER_USER_FAILED";

export const DELETE_ANSWER_USER = "DELETE_ANSWER_USER";
export const DELETE_ANSWER_USER_SUCCESS = "DELETE_ANSWER_USER_SUCCESS";
export const DELETE_ANSWER_USER_FAILED = "DELETE_ANSWER_USER_FAILED";

export const DELETE_ANSWER_BY_QUESTION = "DELETE_ANSWER_BY_QUESTION";
export const DELETE_ANSWER_BY_QUESTION_SUCCESS = "DELETE_ANSWER_BY_QUESTION_SUCCESS";
export const DELETE_ANSWER_BY_QUESTION_FAILED = "DELETE_ANSWER_BY_QUESTION_FAILED";

export function getANSWER(params, callback) {
    return {
        type: GET_ANSWER,
        params,
        callback,
    };
}

export function getQuestios(params, callback) {
    return {
        type: GET_ANSWERS,
        params,
        callback,
    };
}

export function filterANSWER(params, callback) {
    return {
        type: FILTER_ANSWERS,
        params,
        callback,
    };
}

export function createANSWER(params, callback) {
    return {
        type: CREATE_ANSWER,
        params,
        callback,
    };
}

export function editANSWER(params, callback) {
    return {
        type: EDIT_ANSWER,
        params,
        callback,
    };
}

export function deleteANSWER(params, callback) {
    return {
        type: DELETE_ANSWER,
        params,
        callback,
    };
}

// cho bảng dap_an_da_chon
export function getAnswerUser(params, callback) {
    return {
        type: GET_ANSWER_USER,
        params,
        callback,
    };
}

export function getAnswersUser(params, callback) {
    return {
        type: GET_ANSWERS_USER,
        params,
        callback,
    };
}

export function createAnswerUser(params, callback) {
    return {
        type: CREATE_ANSWER_USER,
        params,
        callback,
    };
}

export function editAnswerUser(params, callback) {
    return {
        type: EDIT_ANSWER_USER,
        params,
        callback,
    };
}

export function deleteAnswerUser(params, callback) {
    return {
        type: DELETE_ANSWER_USER,
        params,
        callback,
    };
}

export function deleteAnswerByQuestion(params, callback) {
    return {
        type: DELETE_ANSWER_BY_QUESTION,
        params,
        callback,
    };
}