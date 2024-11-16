import * as receiptActions from '../actions/receipt';

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
    itemDetail: {
        loading: false,
        result: {},
        error: null,
    },
    listDetail: {
        loading: false,
        result: {},
        error: null,
    },
    listUser: {
        loading: false,
        result: {},
        error: null,
    }
}

export default function receiptReducer(state = initState, action) {
    switch(action.type) {
        // get a course
        case receiptActions.GET_RECEIPT:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case receiptActions.GET_RECEIPT_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case receiptActions.GET_RECEIPT_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        // get a list of courses
        case receiptActions.GET_RECEIPTS:
            return {
                ...state,
                list: { ...state.list, loading: true },
            };
        case receiptActions.GET_RECEIPTS_SUCCESS:
            return {
                ...state,
                list: { ...state.list, loading: false, result: action.result },
            };
        case receiptActions.GET_RECEIPTS_FAILED:
            return {
                ...state,
                list: { ...state.list, loading: false, error: action.error },
            };
        // delete a course
        case receiptActions.DELETE_RECEIPT:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case receiptActions.DELETE_RECEIPT_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case receiptActions.DELETE_RECEIPT_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        // edit a course
        case receiptActions.EDIT_RECEIPT:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case receiptActions.EDIT_RECEIPT_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case receiptActions.EDIT_RECEIPT_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error }
            }
        // create a course
        case receiptActions.CREATE_RECEIPT:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case receiptActions.CREATE_RECEIPT_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case receiptActions.CREATE_RECEIPT_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        case receiptActions.CHANGE_RECEIPT:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case receiptActions.CHANGE_RECEIPT_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case receiptActions.CHANGE_RECEIPT_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        ///////////////////////////////////////////
        case receiptActions.GET_RECEIPT_DETAIL:
            return {
                ...state,
                itemDetail: { ...state.itemDetail, loading: true },
            };
        case receiptActions.GET_RECEIPT_DETAIL_SUCCESS:
            return {
                ...state,
                itemDetail: { ...state.itemDetail, loading: false, result: action.result },
            };
        case receiptActions.GET_RECEIPT_DETAIL_FAILED:
            return {
                ...state,
                itemDetail: { ...state.itemDetail, loading: false, error: action.error },
            };
        // get a list of courses
        case receiptActions.GET_RECEIPTS_DETAIL:
            return {
                ...state,
                listDetail: { ...state.listDetail, loading: true },
            };
        case receiptActions.GET_RECEIPTS_DETAIL_SUCCESS:
            return {
                ...state,
                listDetail: { ...state.listDetail, loading: false, result: action.result },
            };
        case receiptActions.GET_RECEIPTS_DETAIL_FAILED:
            return {
                ...state,
                listDetail: { ...state.listDetail, loading: false, error: action.error },
            };
        // delete a course
        case receiptActions.DELETE_RECEIPT_DETAIL:
            return {
                ...state,
                itemDetail: { ...state.itemDetail, loading: true },
            };
        case receiptActions.DELETE_RECEIPT_DETAIL_SUCCESS:
            return {
                ...state,
                itemDetail: { ...state.itemDetail, loading: false, result: action.result },
            };
        case receiptActions.DELETE_RECEIPT_DETAIL_FAILED:
            return {
                ...state,
                itemDetail: { ...state.itemDetail, loading: false, error: action.error },
            };
        // edit a course
        case receiptActions.EDIT_RECEIPT_DETAIL:
            return {
                ...state,
                itemDetail: { ...state.itemDetail, loading: true },
            };
        case receiptActions.EDIT_RECEIPT_DETAIL_SUCCESS:
            return {
                ...state,
                itemDetail: { ...state.itemDetail, loading: false, result: action.result },
            };
        case receiptActions.EDIT_RECEIPT_DETAIL_FAILED:
            return {
                ...state,
                itemDetail: { ...state.itemDetail, loading: false, error: action.error }
            }
        // create a course
        case receiptActions.CREATE_RECEIPT_DETAIL:
            return {
                ...state,
                itemDetail: { ...state.itemDetail, loading: true },
            };
        case receiptActions.CREATE_RECEIPT_DETAIL_SUCCESS:
            return {
                ...state,
                itemDetail: { ...state.itemDetail, loading: false, result: action.result },
            };
        case receiptActions.CREATE_RECEIPT_DETAIL_FAILED:
            return {
                ...state,
                itemDetail: { ...state.itemDetail, loading: false, error: action.error },
            };
        case receiptActions.GET_RECEIPTS_USER:
            return {
                ...state,
                listUser: { ...state.listUser, loading: true },
            };
        case receiptActions.GET_RECEIPTS_USER_SUCCESS:
            return {
                ...state,
                listUser: { ...state.listUser, loading: false, result: action.result },
            };
        case receiptActions.GET_RECEIPTS_USER_FAILED:
            return {
                ...state,
                listUser: { ...state.listUser, loading: false, error: action.error },
            };
        case receiptActions.GET_RECEIPT_DETAIL_USER:
            return {
                ...state,
                itemDetail: { ...state.itemDetail, loading: true },
            };
        case receiptActions.GET_RECEIPT_DETAIL_USER_SUCCESS:
            return {
                ...state,
                itemDetail: { ...state.itemDetail, loading: false, result: action.result },
            };
        case receiptActions.GET_RECEIPT_DETAIL_USER_FAILED:
            return {
                ...state,
                itemDetail: { ...state.itemDetail, loading: false, error: action.error },
            };
        default:
            return state;
    }
}