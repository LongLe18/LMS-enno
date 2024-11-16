import * as partActions from '../actions/part';

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

export default function moduleReducer(state = initState, action) {
    switch(action.type) {
        // get a module
        case partActions.GET_MODULE:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case partActions.GET_MODULE_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case partActions.GET_MODULE_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        // get a list of modules by id course
        case partActions.GET_MODULES_IDCOURSE:
            return {
                ...state,
                list: { ...state.list, loading: true },
            };
        case partActions.GET_MODULES_IDCOURSE_SUCCESS:
            return {
                ...state,
                list: { ...state.list, loading: false, result: action.result },
            }
        case partActions.GET_MODULES_IDCOURSE_FAILED:
            return {
                ...state,
                list: { ...state.list, loading: false, error: action.error },
            };
        // get a list of modules by id course 2
        case partActions.GET_MODULES_IDCOURSE_2:
            return {
                ...state,
                list: { ...state.list, loading: true },
            };
        case partActions.GET_MODULES_IDCOURSE_2_SUCCESS:
            return {
                ...state,
                list: { ...state.list, loading: false, result: action.result },
            }
        case partActions.GET_MODULES_IDCOURSE_2_FAILED:
            return {
                ...state,
                list: { ...state.list, loading: false, error: action.error },
            };
        // get a list of modules
        case partActions.GET_MODULES:
            return {
                ...state,
                list: { ...state.list, loading: true },
            };
        case partActions.GET_MODULES_SUCCESS:
            return {
                ...state,
                list: { ...state.list, loading: false, result: action.result },
            };
        case partActions.GET_MODULES_FAILED:
            return {
                ...state,
                list: { ...state.list, loading: false, error: action.error },
            };
        // delete a module
        case partActions.DELETE_MODULE:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case partActions.DELETE_MODULE_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case partActions.DELETE_MODULE_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        // edit a module
        case partActions.EDIT_MODULE:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case partActions.EDIT_MODULE_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case partActions.EDIT_MODULE_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error }
            }
        // create a module
        case partActions.CREATE_MODULE:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case partActions.CREATE_MODULE_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case partActions.CREATE_MODULE_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        // change status a module
        case partActions.CHANGE_MODULE:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case partActions.CHANGE_MODULE_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case partActions.CHANGE_MODULE_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        /// filter module
        case partActions.FILTER_MODULES:
            return {
                ...state,
                list: { ...state.list, loading: true },
            };
        case partActions.FILTER_MODULES_SUCCESS:
            return {
                ...state,
                list: { ...state.list, loading: false, result: action.result },
            };
        case partActions.FILTER_MODULES_FALIED:
            return {
                ...state,
                list: { ...state.list, loading: false, error: action.error },
            };
        default:
            return state;

    }
}