// comment
export const GET_COMMENT = "GET_COMMENT";
export const GET_COMMENT_SUCCESS = "GET_COMMENT_SUCCESS";
export const GET_COMMENT_FAILED = "GET_COMMENT_FAILED";

export const GET_COMMENTS = "GET_COMMENTS";
export const GET_COMMENTS_SUCCESS = "GET_COMMENTS_SUCCESS";
export const GET_COMMENTS_FAILED = "GET_COMMENTS_FAILED";


export const DELETE_COMMENT = "DELETE_COMMENT";
export const DELETE_COMMENT_SUCCESS = "DELETE_COMMENT_SUCCESS";
export const DELETE_COMMENT_FAILED = "DELETE_COMMENT_FAILED";

export const EDIT_COMMENT = "EDIT_COMMENT";
export const EDIT_COMMENT_SUCCESS = "EDIT_COMMENT_SUCCESS";
export const EDIT_COMMENT_FAILED = "EDIT_COMMENT_FAILED";

export const CREATE_COMMENT = "CREATE_COMMENT";
export const CREATE_COMMENT_SUCCESS = "CREATE_COMMENT_SUCCESS";
export const CREATE_COMMENT_FAILED = "CREATE_COMMENT_FAILED";

// sub comment
export const GET_SUBCOMMENT = "GET_SUBCOMMENT";
export const GET_SUBCOMMENT_SUCCESS = "GET_SUBCOMMENT_SUCCESS";
export const GET_SUBCOMMENT_FAILED = "GET_SUBCOMMENT_FAILED";

export const GET_SUBCOMMENTS = "GET_SUBCOMMENTS";
export const GET_SUBCOMMENTS_SUCCESS = "GET_SUBCOMMENTS_SUCCESS";
export const GET_SUBCOMMENTS_FAILED = "GET_SUBCOMMENTS_FAILED";


export const DELETE_SUBCOMMENT = "DELETE_SUBCOMMENT";
export const DELETE_SUBCOMMENT_SUCCESS = "DELETE_SUBCOMMENT_SUCCESS";
export const DELETE_SUBCOMMENT_FAILED = "DELETE_SUBCOMMENT_FAILED";

export const EDIT_SUBCOMMENT = "EDIT_SUBCOMMENT";
export const EDIT_SUBCOMMENT_SUCCESS = "EDIT_SUBCOMMENT_SUCCESS";
export const EDIT_SUBCOMMENT_FAILED = "EDIT_SUBCOMMENT_FAILED";

export const CREATE_SUBCOMMENT = "CREATE_SUBCOMMENT";
export const CREATE_SUBCOMMENT_SUCCESS = "CREATE_SUBCOMMENT_SUCCESS";
export const CREATE_SUBCOMMENT_FAILED = "CREATE_SUBCOMMENT_FAILED";

/// comment
export function getCOMMENT(params, callback) {
    return {
        type: GET_COMMENT,
        params,
        callback,
    };
}

export function getCOMMENTs(params, callback) {
    return {
        type: GET_COMMENTS,
        params,
        callback,
    };
}

export function DeleteCOMMENT(params, callback) {
    return {
        type: DELETE_COMMENT,
        params,
        callback,
    };
}

export function EditCOMMENT(params, callback) {
    return {
        type: EDIT_COMMENT,
        params,
        callback,
    };
}

export function CreateCOMMENT(params, callback) {
    return {
        type: CREATE_COMMENT,
        params,
        callback,
    };
}

// sub comment
export function getSUBCOMMENT(params, callback) {
    return {
        type: GET_SUBCOMMENT,
        params,
        callback,
    };
}

export function getSUBCCOMMENTs(params, callback) {
    return {
        type: GET_SUBCOMMENTS,
        params,
        callback,
    };
}

export function DeleteSUBCCOMMENT(params, callback) {
    return {
        type: DELETE_SUBCOMMENT,
        params,
        callback,
    };
}

export function EditSUBCCOMMENT(params, callback) {
    return {
        type: EDIT_SUBCOMMENT,
        params,
        callback,
    };
}

export function CreateSUBCCOMMENT(params, callback) {
    return {
        type: CREATE_SUBCOMMENT,
        params,
        callback,
    };
}