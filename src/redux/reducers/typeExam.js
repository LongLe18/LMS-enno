import * as typeexamActions from '../actions/typeExam';

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

export default function typeexamReducer(state = initState, action) {
    switch(action.type) {
        // get a course
        case typeexamActions.GET_TYPE:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case typeexamActions.GET_TYPE_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case typeexamActions.GET_TYPE_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        // get a list of courses
        case typeexamActions.GET_TYPES:
            return {
                ...state,
                list: { ...state.list, loading: true },
            };
        case typeexamActions.GET_TYPES_SUCCESS:
            return {
                ...state,
                list: { ...state.list, loading: false, result: action.result },
            };
        case typeexamActions.GET_TYPES_FAILED:
            return {
                ...state,
                list: { ...state.list, loading: false, error: action.error },
            };
        // delete a course
        case typeexamActions.DELETE_TYPE:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case typeexamActions.DELETE_TYPE_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case typeexamActions.DELETE_TYPE_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        // edit a course
        case typeexamActions.EDIT_TYPE:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case typeexamActions.EDIT_TYPE_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case typeexamActions.EDIT_TYPE_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error }
            }
        // create a course
        case typeexamActions.CREATE_TYPE:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case typeexamActions.CREATE_TYPE_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case typeexamActions.CREATE_TYPE_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        default:
            return state;
    }
}