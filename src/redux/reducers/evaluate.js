import * as evaluateActions from '../actions/evaluate';

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
    listDGNL: {
        loading: false,
        result: {},
        error: null,
    }
}

export default function evaluateReducer(state = initState, action) {
    switch(action.type) {
        // get a evaluation
        case evaluateActions.GET_EVALUATE:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case evaluateActions.GET_EVALUATE_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case evaluateActions.GET_EVALUATE_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        // get a evaluation DGNL
        case evaluateActions.GET_EVALUATE_DGNL:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case evaluateActions.GET_EVALUATE_DGNL_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case evaluateActions.GET_EVALUATE_DGNL_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        // get a list of evaluatations
        case evaluateActions.GET_EVALUATES:
            return {
                ...state,
                list: { ...state.list, loading: true },
            };
        case evaluateActions.GET_EVALUATES_SUCCESS:
            return {
                ...state,
                list: { ...state.list, loading: false, result: action.result },
            };
        case evaluateActions.GET_EVALUATES_FAILED:
            return {
                ...state,
                list: { ...state.list, loading: false, error: action.error },
            };
        // get a list of evaluatations DGNL
        case evaluateActions.GET_EVALUATES_DGNL:
            return {
                ...state,
                listDGNL: { ...state.listDGNL, loading: true },
            };
        case evaluateActions.GET_EVALUATES_DGNL_SUCCESS:
            return {
                ...state,
                listDGNL: { ...state.listDGNL, loading: false, result: action.result },
            };
        case evaluateActions.GET_EVALUATES_DGNL_FAILED:
            return {
                ...state,
                listDGNL: { ...state.listDGNL, loading: false, error: action.error },
            };
        // delete a evaluation
        case evaluateActions.DELETE_EVALUATE:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case evaluateActions.DELETE_EVALUATE_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case evaluateActions.DELETE_EVALUATE_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        // delete a evaluation DGNL
        case evaluateActions.DELETE_EVALUATE_DGNL:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case evaluateActions.DELETE_EVALUATE_DGNL_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case evaluateActions.DELETE_EVALUATE_DGNL_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        // edit a evaluation
        case evaluateActions.EDIT_EVALUATE:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case evaluateActions.EDIT_EVALUATE_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case evaluateActions.EDIT_EVALUATE_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error }
            }
        // edit a evaluation DGNL
        case evaluateActions.EDIT_EVALUATE_DGNL:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case evaluateActions.EDIT_EVALUATE_DGNL_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case evaluateActions.EDIT_EVALUATE_DGNL_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error }
            }
        // create a evaluation
        case evaluateActions.CREATE_EVALUATE:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case evaluateActions.CREATE_EVALUATE_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case evaluateActions.CREATE_EVALUATE_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        // create a evaluation DGNL
        case evaluateActions.CREATE_EVALUATE_DGNL:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case evaluateActions.CREATE_EVALUATE_DGNL_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case evaluateActions.CREATE_EVALUATE_DGNL_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        default:
            return state;
    }
}