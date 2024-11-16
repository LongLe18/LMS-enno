import * as exceprtActions from '../actions/exceprt';

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

export default function exceprtReducer(state = initState, action) {
    switch(action.type) {
        // get a course
        case exceprtActions.GET_EXCEPRT:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case exceprtActions.GET_EXCEPRT_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case exceprtActions.GET_EXCEPRT_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        // get a list of courses
        case exceprtActions.GET_EXCEPRTS:
            return {
                ...state,
                list: { ...state.list, loading: true },
            };
        case exceprtActions.GET_EXCEPRTS_SUCCESS:
            return {
                ...state,
                list: { ...state.list, loading: false, result: action.result },
            };
        case exceprtActions.GET_EXCEPRTS_FAILED:
            return {
                ...state,
                list: { ...state.list, loading: false, error: action.error },
            };
        // delete a course
        case exceprtActions.DELETE_EXCEPRT:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case exceprtActions.DELETE_EXCEPRT_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case exceprtActions.DELETE_EXCEPRT_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        // edit a course
        case exceprtActions.EDIT_EXCEPRT:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case exceprtActions.EDIT_EXCEPRT_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case exceprtActions.EDIT_EXCEPRT_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error }
            }
        // create a course
        case exceprtActions.CREATE_EXCEPRT:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case exceprtActions.CREATE_EXCEPRT_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case exceprtActions.CREATE_EXCEPRT_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        /// filter courses
        case exceprtActions.FILTER_EXCEPRTS:
            return {
                ...state,
                list: { ...state.list, loading: true },
            };
        case exceprtActions.FILTER_EXCEPRTS_SUCCESS:
            return {
                ...state,
                list: { ...state.list, loading: false, result: action.result },
            };
        case exceprtActions.FILTER_EXCEPRTS_FAILED:
            return {
                ...state,
                list: { ...state.list, loading: false, error: action.error },
            };       
        default:
            return state;
    }
}