export const GET_DEALER = "GET_DEALER";
export const GET_DEALER_SUCCESS = "GET_DEALER_SUCCESS";
export const GET_DEALER_FAILED = "GET_DEALER_FAILED";

export const GET_DEALER2 = "GET_DEALER2";
export const GET_DEALER2_SUCCESS = "GET_DEALER2_SUCCESS";
export const GET_DEALER2_FAILED = "GET_DEALER2_FAILED";

export const CHECK_CODE = "CHECK_CODE";
export const CHECK_CODE_SUCCESS = "CHECK_CODE_SUCCESS";
export const CHECK_CODE_FAILED = "CHECK_CODE_FAILED";

export const GET_DEALERS = "GET_DEALERS";
export const GET_DEALERS_SUCCESS = "GET_DEALERS_SUCCESS";
export const GET_DEALERS_FAILED = "GET_DEALERS_FAILED";

export const GET_DEALERS_TEACHER = "GET_DEALERS_TEACHER";
export const GET_DEALERS_TEACHER_SUCCESS = "GET_DEALERS_TEACHER_SUCCESS";
export const GET_DEALERS_TEACHER_FAILED = "GET_DEALERS_TEACHER_FAILED";

export const GET_DEALERS_DETAIL = "GET_DEALERS_DETAIL";
export const GET_DEALERS_DETAIL_SUCCESS = "GET_DEALERS_DETAIL_SUCCESS";
export const GET_DEALERS_DETAIL_FAILED = "GET_DEALERS_DETAIL_FAILED";

export const GET_DEALERS_DETAIL_TEACHER = "GET_DEALERS_DETAIL_TEACHER";
export const GET_DEALERS_DETAIL_TEACHER_SUCCESS = "GET_DEALERS_DETAIL_TEACHER_SUCCESS";
export const GET_DEALERS_DETAIL_TEACHER_FAILED = "GET_DEALERS_DETAIL_TEACHER_FAILED";

export const GET_DEALER_DETAIL = "GET_DEALER_DETAIL";
export const GET_DEALER_DETAIL_SUCCESS = "GET_DEALER_DETAIL_SUCCESS";
export const GET_DEALER_DETAIL_FAILED = "GET_DEALER_DETAIL_FAILED";

export const CHANGE_DEALER = "CHANGE_DEALER";
export const CHANGE_DEALER_SUCCESS = "CHANGE_DEALER_SUCCESS";
export const CHANGE_DEALER_FAILED = "CHANGE_DEALER_FAILED";

export const DELETE_DEALER = "DELETE_DEALER";
export const DELETE_DEALER_SUCCESS = "DELETE_DEALER_SUCCESS";
export const DELETE_DEALER_FAILED = "DELETE_DEALER_FAILED";

export const DELETE_DEALER_DETAIL = "DELETE_DEALER_DETAIL";
export const DELETE_DEALER_DETAIL_SUCCESS = "DELETE_DEALER_DETAIL_SUCCESS";
export const DELETE_DEALER_DETAIL_FAILED = "DELETE_DEALER_DETAIL_FAILED";

export const DELETE_DEALERS_DETAIL = "DELETE_DEALERS_DETAIL";
export const DELETE_DEALERS_DETAIL_SUCCESS = "DELETE_DEALERS_DETAIL_SUCCESS";
export const DELETE_DEALERS_DETAIL_FAILED = "DELETE_DEALERS_DETAIL_FAILED";

export const EDIT_DEALER = "EDIT_DEALER";
export const EDIT_DEALER_SUCCESS = "EDIT_DEALER_SUCCESS";
export const EDIT_DEALER_FAILED = "EDIT_DEALER_FAILED";

export const EDIT_DEALER_DETAIL = "EDIT_DEALER_DETAIL";
export const EDIT_DEALER_DETAIL_SUCCESS = "EDIT_DEALER_DETAIL_SUCCESS";
export const EDIT_DEALER_DETAIL_FAILED = "EDIT_DEALER_DETAIL_FAILED";

export const CREATE_DEALER = "CREATE_DEALER";
export const CREATE_DEALER_SUCCESS = "CREATE_DEALER_SUCCESS";
export const CREATE_DEALER_FAILED = "CREATE_DEALER_FAILED";

export const CREATE_DEALER_DETAIL = "CREATE_DEALER_DETAIL";
export const CREATE_DEALER_DETAIL_SUCCESS = "CREATE_DEALER_DETAIL_SUCCESS";
export const CREATE_DEALER_DETAIL_FAILED = "CREATE_DEALER_DETAIL_FAILED";

export const CHANGE_DEALER_DETAIL = "CHANGE_DETAIL_DEALER";
export const CHANGE_DEALER_DETAIL_SUCCESS = "CHANGE_DEALER_DETAIL_SUCCESS";
export const CHANGE_DEALER_DETAIL_FAILED = "CHANGE_DEALER_DETAIL_FAILED";

export function getDealer(params, callback) {
    return {
        type: GET_DEALER,
        params,
        callback,
    };
}

export function getDealer2(params, callback) {
    return {
        type: GET_DEALER2,
        params,
        callback,
    };
}

export function checkCode(params, callback) {
    return {
        type: CHECK_CODE,
        params,
        callback,
    };
}

export function getDealerDetail(params, callback) {
    return {
        type: GET_DEALER_DETAIL,
        params,
        callback,
    };
}

export function getDealers(params, callback) {
    return {
        type: GET_DEALERS,
        params,
        callback,
    };
}

export function getDealersTeacher(params, callback) {
    return {
        type: GET_DEALERS_TEACHER,
        params,
        callback,
    };
}

export function getDealersDetail(params, callback) {
    return {
        type: GET_DEALERS_DETAIL,
        params,
        callback,
    };
}

export function getDealersDetailTeacher(params, callback) {
    return {
        type: GET_DEALERS_DETAIL_TEACHER,
        params,
        callback,
    };
};

export function DeleteDealer(params, callback) {
    return {
        type: DELETE_DEALER,
        params,
        callback,
    };
}


export function DeleteDealerDetail(params, callback) {
    return {
        type: DELETE_DEALER_DETAIL,
        params,
        callback,
    };
}

export function DeleteDealersDetail(params, callback) {
    return {
        type: DELETE_DEALERS_DETAIL,
        params,
        callback,
    };
}

export function EditDealer(params, callback) {
    return {
        type: EDIT_DEALER,
        params,
        callback,
    };
}

export function EditDealerDetail(params, callback) {
    return {
        type: EDIT_DEALER_DETAIL,
        params,
        callback,
    };
}

export function CreateDealer(params, callback) {
    return {
        type: CREATE_DEALER,
        params,
        callback,
    };
}

export function CreateDealerDetail(params, callback) {
    return {
        type: CREATE_DEALER_DETAIL,
        params,
        callback,
    };
}

export function changeStaDealer(params, callback) {
    return {
        type: CHANGE_DEALER,
        params,
        callback,
    };
}

export function changeStaDealerDetail(params, callback) {
    return {
        type: CHANGE_DEALER_DETAIL,
        params,
        callback,
    };
}
