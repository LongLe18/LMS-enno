import * as documentActions from '../actions/document';

const initState = {
    itemDoc: {
        loading: false,
        result: {},
        error: null,
    },
    listDoc: {
        loading: false,
        result: {},
        error: null,
    },
}

export default function documentReducer(state = initState, action) {
    switch(action.type) {
        // get a document
        case documentActions.GET_DOC:
            return {
                ...state,
                itemDoc: { ...state.itemDoc, loading: true },
            };
        case documentActions.GET_DOC_SUCCESS:
            return {
                ...state,
                itemDoc: { ...state.itemDoc, loading: false, result: action.result },
            };
        case documentActions.GET_DOC_FAILED:
            return {
                ...state,
                itemDoc: { ...state.itemDoc, loading: false, error: action.error },
            };
        // get a list of documents
        case documentActions.GET_DOCS:
            return {
                ...state,
                listDoc: { ...state.listDoc, loading: true },
            };
        case documentActions.GET_DOCS_SUCCESS:
            return {
                ...state,
                listDoc: { ...state.listDoc, loading: false, result: action.result },
            };
        case documentActions.GET_DOCS_FAILED:
            return {
                ...state,
                listDoc: { ...state.listDoc, loading: false, error: action.error },
            };
        // delete a document
        case documentActions.DELETE_DOC:
            return {
                ...state,
                itemDoc: { ...state.itemDoc, loading: true },
            };
        case documentActions.DELETE_DOC_SUCCESS:
            return {
                ...state,
                itemDoc: { ...state.itemDoc, loading: false, result: action.result },
            };
        case documentActions.DELETE_DOC_FAILED:
            return {
                ...state,
                itemDoc: { ...state.itemDoc, loading: false, error: action.error },
            };
        // edit a document
        case documentActions.EDIT_DOC:
            return {
                ...state,
                itemDoc: { ...state.itemDoc, loading: true },
            };
        case documentActions.EDIT_DOC_SUCCESS:
            return {
                ...state,
                itemDoc: { ...state.itemDoc, loading: false, result: action.result },
            };
        case documentActions.EDIT_DOC_FAILED:
            return {
                ...state,
                itemDoc: { ...state.itemDoc, loading: false, error: action.error }
            }
        // create a document
        case documentActions.CREATE_DOC:
            return {
                ...state,
                itemDoc: { ...state.itemDoc, loading: true },
            };
        case documentActions.CREATE_DOC_SUCCESS:
            return {
                ...state,
                itemDoc: { ...state.itemDoc, loading: false, result: action.result },
            };
        case documentActions.CREATE_DOC_FAILED:
            return {
                ...state,
                itemDoc: { ...state.itemDoc, loading: false, error: action.error },
            };
        /// change status document
        case documentActions.CHANGE_DOC:
            return {
                ...state,
                itemDoc: { ...state.itemDoc, loading: true },
            };
        case documentActions.CHANGE_DOC_SUCCESS:
            return {
                ...state,
                itemDoc: { ...state.itemDoc, loading: false, result: action.result },
            };
        case documentActions.CHANGE_DOC_FAILED:
            return {
                ...state,
                itemDoc: { ...state.itemDoc, loading: false, error: action.error },
            };
        default:
            return state;
    }
}