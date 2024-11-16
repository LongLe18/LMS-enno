import * as contactActions from '../actions/contact';

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

export default function contactReducer(state = initState, action) {
    switch(action.type) {
        // get a CONTACT
        case contactActions.GET_CONTACT:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case contactActions.GET_CONTACT_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case contactActions.GET_CONTACT_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        // get a list of CONTACTs
        case contactActions.GET_CONTACTS:
            return {
                ...state,
                list: { ...state.list, loading: true },
            };
        case contactActions.GET_CONTACTS_SUCCESS:
            return {
                ...state,
                list: { ...state.list, loading: false, result: action.result },
            };
        case contactActions.GET_CONTACTS_FAILED:
            return {
                ...state,
                list: { ...state.list, loading: false, error: action.error },
            };
        // delete a CONTACT
        case contactActions.DELETE_CONTACT:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case contactActions.DELETE_CONTACT_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case contactActions.DELETE_CONTACT_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        // edit a CONTACT
        case contactActions.EDIT_CONTACT:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case contactActions.EDIT_CONTACT_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case contactActions.EDIT_CONTACT_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error }
            }
        // create a CONTACT
        case contactActions.CREATE_CONTACT:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case contactActions.CREATE_CONTACT_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case contactActions.CREATE_CONTACT_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        default:
            return state;
    }
}