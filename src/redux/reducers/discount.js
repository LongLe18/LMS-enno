import * as discountActions from '../actions/discount';

const initState = {
    item: {
        loading: false,
        result: {},
        error: null,
    },
    list: {
        loading: false,
        result: {},
        error: null,
    },
    itemByCourse: {
        loading: false,
        result: {},
        error: null,
    }
}

export default function discountReducer(state = initState, action) {
    switch(action.type) {
        // get a course
        case discountActions.GET_DISCOUNT:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case discountActions.GET_DISCOUNT_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case discountActions.GET_DISCOUNT_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        // get a list of courses
        case discountActions.GET_DISCOUNTS:
            return {
                ...state,
                list: { ...state.list, loading: true },
            };
        case discountActions.GET_DISCOUNTS_SUCCESS:
            return {
                ...state,
                list: { ...state.list, loading: false, result: action.result },
            };
        case discountActions.GET_DISCOUNTS_FAILED:
            return {
                ...state,
                list: { ...state.list, loading: false, error: action.error },
            };
        // delete a course
        case discountActions.DELETE_DISCOUNT:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case discountActions.DELETE_DISCOUNT_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case discountActions.DELETE_DISCOUNT_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        // edit a course
        case discountActions.EDIT_DISCOUNT:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case discountActions.EDIT_DISCOUNT_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case discountActions.EDIT_DISCOUNT_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error }
            }
        // create a course
        case discountActions.CREATE_DISCOUNT:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case discountActions.CREATE_DISCOUNT_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case discountActions.CREATE_DISCOUNT_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        /// filter courses
        case discountActions.GET_DISCOUNTS_BYCOURSE:
            return {
                ...state,
                itemByCourse: { ...state.itemByCourse, loading: true },
            };
        case discountActions.GET_DISCOUNTS_BYCOURSE_SUCCESS:
            return {
                ...state,
                itemByCourse: { ...state.itemByCourse, loading: false, result: action.result },
            };
        case discountActions.GET_DISCOUNTS_BYCOURSE_FAILED:
            return {
                ...state,
                itemByCourse: { ...state.itemByCourse, loading: false, error: action.error },
            };
        case discountActions.CHANGE_DISCOUNT:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case discountActions.CHANGE_DISCOUNT_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case discountActions.CHANGE_DISCOUNT_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        default:
            return state;
    }
}