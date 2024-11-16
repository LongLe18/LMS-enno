import * as majorActions from '../actions/major';

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

export default function majorReducer(state = initState, action) {
    switch(action.type) {
        // get a MAJOR
        case majorActions.GET_CLASS:
            return {
                ...state,
                list: { ...state.list, loading: true },
            };
        case majorActions.GET_CLASS_SUCCESS:
            return {
                ...state,
                list: { ...state.list, loading: false, result: action.result },
            };
        case majorActions.GET_CLASS_FAILED:
            return {
                ...state,
                list: { ...state.list, loading: false, error: action.error },
            };
        // get a MAJOR
        case majorActions.GET_MAJOR:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case majorActions.GET_MAJOR_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case majorActions.GET_MAJOR_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        // get list of MAJORS
        case majorActions.GET_MAJORS:
            return {
                ...state,
                list: { ...state.list, loading: true },
            };
        case majorActions.GET_MAJORS_SUCCESS:
            return {
                ...state,
                list: { ...state.list, loading: false, result: action.result },
            };
        case majorActions.GET_MAJORS_FAILED:
            return {
                ...state,
                list: { ...state.list, loading: false, error: action.error },
            };
        // create a MAJOR
        case majorActions.CREATE_MAJOR:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case majorActions.CREATE_MAJOR_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case majorActions.CREATE_MAJOR_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        // edit a MAJOR
        case majorActions.EDIT_MAJOR:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case majorActions.EDIT_MAJOR_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case majorActions.EDIT_MAJOR_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        // delete a MAJOR
        case majorActions.DELETE_MAJOR:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case majorActions.DELETE_MAJOR_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case majorActions.DELETE_MAJOR_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        default:
            return state;
    }
}