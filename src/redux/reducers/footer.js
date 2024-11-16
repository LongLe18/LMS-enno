import * as footerActions from '../actions/footer';

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

export default function footerReducer(state = initState, action) {
    switch(action.type) {
        // get a FOOTER
        case footerActions.GET_FOOTER:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case footerActions.GET_FOOTER_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case footerActions.GET_FOOTER_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        // get a list of FOOTERs
        case footerActions.GET_FOOTERS:
            return {
                ...state,
                list: { ...state.list, loading: true },
            };
        case footerActions.GET_FOOTERS_SUCCESS:
            return {
                ...state,
                list: { ...state.list, loading: false, result: action.result },
            };
        case footerActions.GET_FOOTERS_FAILED:
            return {
                ...state,
                list: { ...state.list, loading: false, error: action.error },
            };
        // delete a FOOTER
        case footerActions.DELETE_FOOTER:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case footerActions.DELETE_FOOTER_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case footerActions.DELETE_FOOTER_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        // edit a FOOTER
        case footerActions.EDIT_FOOTER:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case footerActions.EDIT_FOOTER_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case footerActions.EDIT_FOOTER_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error }
            }
        // create a FOOTER
        case footerActions.CREATE_FOOTER:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case footerActions.CREATE_FOOTER_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case footerActions.CREATE_FOOTER_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        default:
            return state;
    }
}