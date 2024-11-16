import * as menuActions from '../actions/menu';

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
    listType: {
        loading: false,
        result: {},
        error: null,
    }
}

export default function menuReducer(state = initState, action) {
    switch(action.type) {
        // get a MENU
        case menuActions.GET_MENU:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case menuActions.GET_MENU_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case menuActions.GET_MENU_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        // get a list of MENUs
        case menuActions.GET_MENUS:
            return {
                ...state,
                list: { ...state.list, loading: true },
            };
        case menuActions.GET_MENUS_SUCCESS:
            return {
                ...state,
                list: { ...state.list, loading: false, result: action.result },
            };
        case menuActions.GET_MENUS_FAILED:
            return {
                ...state,
                list: { ...state.list, loading: false, error: action.error },
            };
        // delete a MENU
        case menuActions.DELETE_MENU:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case menuActions.DELETE_MENU_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case menuActions.DELETE_MENU_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        // edit a MENU
        case menuActions.EDIT_MENU:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case menuActions.EDIT_MENU_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case menuActions.EDIT_MENU_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error }
            }
        // create a MENU
        case menuActions.CREATE_MENU:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case menuActions.CREATE_MENU_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case menuActions.CREATE_MENU_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        /// filter MENUs
        case menuActions.GET_TYPES_MENU:
            return {
                ...state,
                listType: { ...state.listType, loading: true },
            };
        case menuActions.GET_TYPES_MENU_SUCCESS:
            return {
                ...state,
                listType: { ...state.listType, loading: false, result: action.result },
            };
        case menuActions.GET_TYPES_MENU_FAILED:
            return {
                ...state,
                listType: { ...state.listType, loading: false, error: action.error },
            };
        default:
            return state;
    }
}