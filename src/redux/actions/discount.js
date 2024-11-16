export const GET_DISCOUNT = "GET_DISCOUNT";
export const GET_DISCOUNT_SUCCESS = "GET_DISCOUNT_SUCCESS";
export const GET_DISCOUNT_FAILED = "GET_DISCOUNT_FAILED";

export const GET_DISCOUNTS = "GET_DISCOUNTS";
export const GET_DISCOUNTS_SUCCESS = "GET_DISCOUNTS_SUCCESS";
export const GET_DISCOUNTS_FAILED = "GET_DISCOUNTS_FAILED";

export const GET_DISCOUNTS_BYCOURSE = "GET_DISCOUNTS_BYCOURSE";
export const GET_DISCOUNTS_BYCOURSE_SUCCESS = "GET_DISCOUNTS_BYCOURSE_SUCCESS";
export const GET_DISCOUNTS_BYCOURSE_FAILED = "GET_DISCOUNTS_BYCOURSE_FAILED";

export const CHANGE_DISCOUNT = "CHANGE_DISCOUNT";
export const CHANGE_DISCOUNT_SUCCESS = "CHANGE_DISCOUNT_SUCCESS";
export const CHANGE_DISCOUNT_FAILED = "CHANGE_DISCOUNT_FAILED";

export const DELETE_DISCOUNT = "DELETE_DISCOUNT";
export const DELETE_DISCOUNT_SUCCESS = "DELETE_DISCOUNT_SUCCESS";
export const DELETE_DISCOUNT_FAILED = "DELETE_DISCOUNT_FAILED";

export const EDIT_DISCOUNT = "EDIT_DISCOUNT";
export const EDIT_DISCOUNT_SUCCESS = "EDIT_DISCOUNT_SUCCESS";
export const EDIT_DISCOUNT_FAILED = "EDIT_DISCOUNT_FAILED";

export const CREATE_DISCOUNT = "CREATE_DISCOUNT";
export const CREATE_DISCOUNT_SUCCESS = "CREATE_DISCOUNT_SUCCESS";
export const CREATE_DISCOUNT_FAILED = "CREATE_DISCOUNT_FAILED";

export function getDiscount(params, callback) {
    return {
        type: GET_DISCOUNT,
        params,
        callback,
    };
}

export function getDiscounts(params, callback) {
    return {
        type: GET_DISCOUNTS,
        params,
        callback,
    };
}

export function getDiscountByCourse(params, callback) {
    return {
        type: GET_DISCOUNTS_BYCOURSE,
        params,
        callback,
    };
}

export function DeleteDiscount(params, callback) {
    return {
        type: DELETE_DISCOUNT,
        params,
        callback,
    };
}

export function EditDiscount(params, callback) {
    return {
        type: EDIT_DISCOUNT,
        params,
        callback,
    };
}

export function CreateDiscount(params, callback) {
    return {
        type: CREATE_DISCOUNT,
        params,
        callback,
    };
}

export function changeStaDiscount(params, callback) {
    return {
        type: CHANGE_DISCOUNT,
        params,
        callback,
    };
}