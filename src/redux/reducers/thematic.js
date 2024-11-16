import * as thematicActions from '../actions/thematic';

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
    listbyId: {
        loading: false,
        result: {},
        error: null,
    }
}

export default function thematicReducer(state = initState, action) {
    switch(action.type) {
        // get a course
        case thematicActions.GET_THEMATIC:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case thematicActions.GET_THEMATIC_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case thematicActions.GET_THEMATIC_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        // get a list of courses by id module
        case thematicActions.GET_THEMATICS_IDMODULE:
            return {
                ...state,
                listbyId: { ...state.listbyId, loading: true },
            };
        case thematicActions.GET_THEMATICS_IDMODULE_SUCCESS:
            return {
                ...state,
                listbyId: { ...state.listbyId, loading: false, result: action.result },
            };
        case thematicActions.GET_THEMATICS_IDMODULE_FAILED:
            return {
                ...state,
                listbyId: { ...state.listbyId, loading: false, error: action.error },
            };
        // get a list of courses
        case thematicActions.GET_THEMATICS:
            return {
                ...state,
                list: { ...state.list, loading: true },
            };
        case thematicActions.GET_THEMATICS_SUCCESS:
            return {
                ...state,
                list: { ...state.list, loading: false, result: action.result },
            };
        case thematicActions.GET_THEMATICS_FAILED:
            return {
                ...state,
                list: { ...state.list, loading: false, error: action.error },
            };
        // delete a course
        case thematicActions.DELETE_THEMATIC:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case thematicActions.DELETE_THEMATIC_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case thematicActions.DELETE_THEMATIC_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        // edit a course
        case thematicActions.EDIT_THEMATIC:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case thematicActions.EDIT_THEMATIC_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case thematicActions.EDIT_THEMATIC_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error }
            }
        // create a course
        case thematicActions.CREATE_THEMATIC:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case thematicActions.CREATE_THEMATIC_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case thematicActions.CREATE_THEMATIC_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        // filter thematics
        case thematicActions.FILTER_THEMATICS:
            return {
                ...state,
                list: { ...state.list, loading: true },
            };
        case thematicActions.FILTER_THEMATICS_SUCCESS:
            return {
                ...state,
                list: { ...state.list, loading: false, result: action.result },
            };
        case thematicActions.FILTER_THEMATICS_FAILED:
            return {
                ...state,
                list: { ...state.list, loading: false, error: action.error },
            };
        default:
            return state;
    }
}