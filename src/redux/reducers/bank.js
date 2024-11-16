import * as bankActions from '../actions/bank';

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
    }
}

export default function bankReducer(state = initState, action) {
    switch(action.type) {
        // get a BANK
        case bankActions.GET_BANK:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case bankActions.GET_BANK_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case bankActions.GET_BANK_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        // get a list of BANKs
        case bankActions.GET_BANKS:
            return {
                ...state,
                list: { ...state.list, loading: true },
            };
        case bankActions.GET_BANKS_SUCCESS:
            return {
                ...state,
                list: { ...state.list, loading: false, result: action.result },
            };
        case bankActions.GET_BANKS_FAILED:
            return {
                ...state,
                list: { ...state.list, loading: false, error: action.error },
            };
        // delete a BANK
        case bankActions.DELETE_BANK:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case bankActions.DELETE_BANK_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case bankActions.DELETE_BANK_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        // edit a BANK
        case bankActions.EDIT_BANK:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case bankActions.EDIT_BANK_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case bankActions.EDIT_BANK_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error }
            }
        // create a BANK
        case bankActions.CREATE_BANK:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case bankActions.CREATE_BANK_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case bankActions.CREATE_BANK_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        /// filter BANKs
        case bankActions.FILTER_BANKS:
            return {
                ...state,
                list: { ...state.list, loading: true },
            };
        case bankActions.FILTER_BANKS_SUCCESS:
            return {
                ...state,
                list: { ...state.list, loading: false, result: action.result },
            };
        case bankActions.FILTER_BANKS_FAILED:
            return {
                ...state,
                list: { ...state.list, loading: false, error: action.error },
            };
        default:
            return state;
    }
}