import * as dealerActions from '../actions/dealer';

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
    checkCode: {
        loading: false,
        result: {},
        error: null,
    },
    changeDetail: {
        loading: false,
        result: {},
        error: null,
    },
    deleteDetail: {
        loading: false,
        result: {},
        error: null,
    }
}

export default function dealerReducer(state = initState, action) {
    switch(action.type) {
        // get a course
        case dealerActions.GET_DEALER:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case dealerActions.GET_DEALER_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case dealerActions.GET_DEALER_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        /////////////////
        case dealerActions.GET_DEALER2:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case dealerActions.GET_DEALER2_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case dealerActions.GET_DEALER2_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        // get a list of courses
        case dealerActions.GET_DEALERS:
            return {
                ...state,
                list: { ...state.list, loading: true },
            };
        case dealerActions.GET_DEALERS_SUCCESS:
            return {
                ...state,
                list: { ...state.list, loading: false, result: action.result },
            };
        case dealerActions.GET_DEALERS_FAILED:
            return {
                ...state,
                list: { ...state.list, loading: false, error: action.error },
            };
        // get a list of courses
        case dealerActions.GET_DEALERS_TEACHER:
            return {
                ...state,
                list: { ...state.list, loading: true },
            };
        case dealerActions.GET_DEALERS_TEACHER_SUCCESS:
            return {
                ...state,
                list: { ...state.list, loading: false, result: action.result },
            };
        case dealerActions.GET_DEALERS_TEACHER_FAILED:
            return {
                ...state,
                list: { ...state.list, loading: false, error: action.error },
            };
        // delete a course
        case dealerActions.DELETE_DEALER:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case dealerActions.DELETE_DEALER_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case dealerActions.DELETE_DEALER_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        // edit a course
        case dealerActions.EDIT_DEALER:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case dealerActions.EDIT_DEALER_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case dealerActions.EDIT_DEALER_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error }
            }
        // create a course
        case dealerActions.CREATE_DEALER:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case dealerActions.CREATE_DEALER_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case dealerActions.CREATE_DEALER_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        case dealerActions.CHANGE_DEALER:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case dealerActions.CHANGE_DEALER_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case dealerActions.CHANGE_DEALER_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        ///////////////////////////////////////////
        case dealerActions.GET_DEALER_DETAIL:
            return {
                ...state,
                itemDetail: { ...state.itemDetail, loading: true },
            };
        case dealerActions.GET_DEALER_DETAIL_SUCCESS:
            return {
                ...state,
                itemDetail: { ...state.itemDetail, loading: false, result: action.result },
            };
        case dealerActions.GET_DEALER_DETAIL_FAILED:
            return {
                ...state,
                itemDetail: { ...state.itemDetail, loading: false, error: action.error },
            };
        // get a list of courses
        case dealerActions.GET_DEALERS_DETAIL:
            return {
                ...state,
                listDetail: { ...state.listDetail, loading: true },
            };
        case dealerActions.GET_DEALERS_DETAIL_SUCCESS:
            return {
                ...state,
                listDetail: { ...state.listDetail, loading: false, result: action.result },
            };
        case dealerActions.GET_DEALERS_DETAIL_FAILED:
            return {
                ...state,
                listDetail: { ...state.listDetail, loading: false, error: action.error },
            };
        // get a list of courses
        case dealerActions.GET_DEALERS_DETAIL_TEACHER:
            return {
                ...state,
                listDetail: { ...state.listDetail, loading: true },
            };
        case dealerActions.GET_DEALERS_DETAIL_TEACHER_SUCCESS:
            return {
                ...state,
                listDetail: { ...state.listDetail, loading: false, result: action.result },
            };
        case dealerActions.GET_DEALERS_DETAIL_TEACHER_FAILED:
            return {
                ...state,
                listDetail: { ...state.listDetail, loading: false, error: action.error },
            };
        // delete a course
        case dealerActions.DELETE_DEALER_DETAIL:
            return {
                ...state,
                itemDetail: { ...state.itemDetail, loading: true },
            };
        case dealerActions.DELETE_DEALER_DETAIL_SUCCESS:
            return {
                ...state,
                itemDetail: { ...state.itemDetail, loading: false, result: action.result },
            };
        case dealerActions.DELETE_DEALER_DETAIL_FAILED:
            return {
                ...state,
                itemDetail: { ...state.itemDetail, loading: false, error: action.error },
            };
        // edit a course
        case dealerActions.EDIT_DEALER_DETAIL:
            return {
                ...state,
                itemDetail: { ...state.itemDetail, loading: true },
            };
        case dealerActions.EDIT_DEALER_DETAIL_SUCCESS:
            return {
                ...state,
                itemDetail: { ...state.itemDetail, loading: false, result: action.result },
            };
        case dealerActions.EDIT_DEALER_DETAIL_FAILED:
            return {
                ...state,
                itemDetail: { ...state.itemDetail, loading: false, error: action.error }
            }
        // create a course
        case dealerActions.CREATE_DEALER_DETAIL:
            return {
                ...state,
                itemDetail: { ...state.itemDetail, loading: true },
            };
        case dealerActions.CREATE_DEALER_DETAIL_SUCCESS:
            return {
                ...state,
                itemDetail: { ...state.itemDetail, loading: false, result: action.result },
            };
        case dealerActions.CREATE_DEALER_DETAIL_FAILED:
            return {
                ...state,
                itemDetail: { ...state.itemDetail, loading: false, error: action.error },
            };
        case dealerActions.CHECK_CODE:
            return {
                ...state,
                checkCode: { ...state.checkCode, loading: true },
            };
        case dealerActions.CHECK_CODE_SUCCESS:
            return {
                ...state,
                checkCode: { ...state.checkCode, loading: false, result: action.result },
            };
        case dealerActions.CHECK_CODE_FAILED:
            return {
                ...state,
                checkCode: { ...state.checkCode, loading: false, error: action.error },
            };
        ///////////////////////////////////////
        case dealerActions.CHANGE_DEALER_DETAIL:
            return {
                ...state,
                changeDetail: { ...state.changeDetail, loading: true },
            };
        case dealerActions.CHANGE_DEALER_DETAIL_SUCCESS:
            return {
                ...state,
                changeDetail: { ...state.changeDetail, loading: false, result: action.result },
            };
        case dealerActions.CHANGE_DEALER_DETAIL_FAILED:
            return {
                ...state,
                changeDetail: { ...state.changeDetail, loading: false, error: action.error },
            };
        // delete a course
        case dealerActions.DELETE_DEALERS_DETAIL:
            return {
                ...state,
                deleteDetail: { ...state.deleteDetail, loading: true },
            };
        case dealerActions.DELETE_DEALERS_DETAIL_SUCCESS:
            return {
                ...state,
                deleteDetail: { ...state.deleteDetail, loading: false, result: action.result },
            };
        case dealerActions.DELETE_DEALERS_DETAIL_FAILED:
            return {
                ...state,
                deleteDetail: { ...state.deleteDetail, loading: false, error: action.error },
            };
        default:
            return state;
    }
}