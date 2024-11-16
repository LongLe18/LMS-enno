import * as commentActions from '../actions/comment';

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
    itemSub: {
        loading: false,
        result: {},
        error: null,
    },
    listSub: {
        loading: false,
        result: {},
        error: null,
    }
}

export default function commentReducer(state = initState, action) {
    switch(action.type) {
        // get a COMMENT
        case commentActions.GET_COMMENT:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case commentActions.GET_COMMENT_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case commentActions.GET_COMMENT_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        // get a list of COMMENTs
        case commentActions.GET_COMMENTS:
            return {
                ...state,
                list: { ...state.list, loading: true },
            };
        case commentActions.GET_COMMENTS_SUCCESS:
            return {
                ...state,
                list: { ...state.list, loading: false, result: action.result },
            };
        case commentActions.GET_COMMENTS_FAILED:
            return {
                ...state,
                list: { ...state.list, loading: false, error: action.error },
            };
        // delete a COMMENT
        case commentActions.DELETE_COMMENT:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case commentActions.DELETE_COMMENT_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case commentActions.DELETE_COMMENT_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        // edit a COMMENT
        case commentActions.EDIT_COMMENT:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case commentActions.EDIT_COMMENT_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case commentActions.EDIT_COMMENT_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error }
            }
        // create a COMMENT
        case commentActions.CREATE_COMMENT:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case commentActions.CREATE_COMMENT_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case commentActions.CREATE_COMMENT_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        

        /////////////////// sub comment
        case commentActions.GET_SUBCOMMENT:
            return {
                ...state,
                itemSub: { ...state.itemSub, loading: true },
            };
        case commentActions.GET_SUBCOMMENT_SUCCESS:
            return {
                ...state,
                itemSub: { ...state.itemSub, loading: false, result: action.result },
            };
        case commentActions.GET_SUBCOMMENT_FAILED:
            return {
                ...state,
                itemSub: { ...state.itemSub, loading: false, error: action.error },
            };
        // get a list of COMMENTs
        case commentActions.GET_SUBCOMMENTS:
            return {
                ...state,
                listSub: { ...state.listSub, loading: true },
            };
        case commentActions.GET_SUBCOMMENTS_SUCCESS:
            return {
                ...state,
                listSub: { ...state.listSub, loading: false, result: action.result },
            };
        case commentActions.GET_SUBCOMMENTS_FAILED:
            return {
                ...state,
                listSub: { ...state.listSub, loading: false, error: action.error },
            };
        // delete a COMMENT
        case commentActions.DELETE_SUBCOMMENT:
            return {
                ...state,
                itemSub: { ...state.itemSub, loading: true },
            };
        case commentActions.DELETE_SUBCOMMENT_SUCCESS:
            return {
                ...state,
                itemSub: { ...state.itemSub, loading: false, result: action.result },
            };
        case commentActions.DELETE_SUBCOMMENT_FAILED:
            return {
                ...state,
                itemSub: { ...state.itemSub, loading: false, error: action.error },
            };
        // edit a COMMENT
        case commentActions.EDIT_SUBCOMMENT:
            return {
                ...state,
                itemSub: { ...state.itemSub, loading: true },
            };
        case commentActions.EDIT_SUBCOMMENT_SUCCESS:
            return {
                ...state,
                itemSub: { ...state.itemSub, loading: false, result: action.result },
            };
        case commentActions.EDIT_SUBCOMMENT_FAILED:
            return {
                ...state,
                itemSub: { ...state.itemSub, loading: false, error: action.error }
            }
        // create a COMMENT
        case commentActions.CREATE_SUBCOMMENT:
            return {
                ...state,
                itemSub: { ...state.itemSub, loading: true },
            };
        case commentActions.CREATE_SUBCOMMENT_SUCCESS:
            return {
                ...state,
                itemSub: { ...state.itemSub, loading: false, result: action.result },
            };
        case commentActions.CREATE_SUBCOMMENT_FAILED:
            return {
                ...state,
                itemSub: { ...state.itemSub, loading: false, error: action.error },
            };
        default:
            return state;
    }
}