import * as answerActions from '../actions/answer';

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
    answerUser: {
        loading: false,
        result: {},
        error: null,
    },
    listAnswerUser: {
        loading: false,
        result: {},
        error: null,
    }
}

export default function answerReducer(state = initState, action) {
    switch(action.type) {
        // get a course
        case answerActions.GET_ANSWER:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case answerActions.GET_ANSWER_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case answerActions.GET_ANSWER_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        // get a list of courses
        case answerActions.GET_ANSWERS:
            return {
                ...state,
                list: { ...state.list, loading: true },
            };
        case answerActions.GET_ANSWERS_SUCCESS:
            return {
                ...state,
                list: { ...state.list, loading: false, result: action.result },
            };
        case answerActions.GET_ANSWERS_FAILED:
            return {
                ...state,
                list: { ...state.list, loading: false, error: action.error },
            };
        // delete a course
        case answerActions.DELETE_ANSWER:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case answerActions.DELETE_ANSWER_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case answerActions.DELETE_ANSWER_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        // edit a course
        case answerActions.EDIT_ANSWER:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case answerActions.EDIT_ANSWER_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case answerActions.EDIT_ANSWER_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error }
            }
        // create a course
        case answerActions.CREATE_ANSWER:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case answerActions.CREATE_ANSWER_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case answerActions.CREATE_ANSWER_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        /// filter courses
        case answerActions.FILTER_ANSWERS:
            return {
                ...state,
                list: { ...state.list, loading: true },
            };
        case answerActions.FILTER_ANSWERS_SUCCESS:
            return {
                ...state,
                list: { ...state.list, loading: false, result: action.result },
            };
        case answerActions.FILTER_ANSWERS_FAILED:
            return {
                ...state,
                list: { ...state.list, loading: false, error: action.error },
            };       
        /////////////////// cho bảng dap_an_da_chon
        case answerActions.GET_ANSWER_USER:
            return {
                ...state,
                answerUser: { ...state.answerUser, loading: true },
            };
        case answerActions.GET_ANSWER_USER_SUCCESS:
            return {
                ...state,
                answerUser: { ...state.answerUser, loading: false, result: action.result },
            };
        case answerActions.GET_ANSWER_USER_FAILED:
            return {
                ...state,
                answerUser: { ...state.answerUser, loading: false, error: action.error },
            };
        ////////////////
        case answerActions.GET_ANSWERS_USER:
            return {
                ...state,
                listAnswerUser: { ...state.listAnswerUser, loading: true },
            };
        case answerActions.GET_ANSWERS_USER_SUCCESS:
            return {
                ...state,
                listAnswerUser: { ...state.listAnswerUser, loading: false, result: action.result },
            };
        case answerActions.GET_ANSWERS_USER_FAILED:
            return {
                ...state,
                listAnswerUser: { ...state.listAnswerUser, loading: false, error: action.error },
            };
        ///////////////////////
        case answerActions.CREATE_ANSWER_USER:
            return {
                ...state,
                answerUser: { ...state.answerUser, loading: true },
            };
        case answerActions.CREATE_ANSWER_USER_SUCCESS:
            return {
                ...state,
                answerUser: { ...state.answerUser, loading: false, result: action.result },
            };
        case answerActions.CREATE_ANSWER_USER_FAILED:
            return {
                ...state,
                answerUser: { ...state.answerUser, loading: false, error: action.error },
            };
        //////////////////
        case answerActions.EDIT_ANSWER_USER:
            return {
                ...state,
                answerUser: { ...state.answerUser, loading: true },
            };
        case answerActions.EDIT_ANSWER_USER_SUCCESS:
            return {
                ...state,
                answerUser: { ...state.answerUser, loading: false, result: action.result },
            };
        case answerActions.EDIT_ANSWER_USER_FAILED:
            return {
                ...state,
                answerUser: { ...state.answerUser, loading: false, error: action.error },
            };
        //////////////
        case answerActions.DELETE_ANSWER_USER:
            return {
                ...state,
                answerUser: { ...state.answerUser, loading: true },
            };
        case answerActions.DELETE_ANSWER_USER_SUCCESS:
            return {
                ...state,
                answerUser: { ...state.answerUser, loading: false, result: action.result },
            };
        case answerActions.DELETE_ANSWER_USER_FAILED:
            return {
                ...state,
                answerUser: { ...state.answerUser, loading: false, error: action.error },
            };
        /// delete answer by question
        case answerActions.DELETE_ANSWER_BY_QUESTION:
            return {
                ...state,
                answerUser: { ...state.answerUser, loading: true },
            };
        case answerActions.DELETE_ANSWER_BY_QUESTION_SUCCESS:
            return {
                ...state,
                answerUser: { ...state.answerUser, loading: false, result: action.result },
            };
        case answerActions.DELETE_ANSWER_BY_QUESTION_FAILED:
            return {
                ...state,
                answerUser: { ...state.answerUser, loading: false, error: action.error },
            };
        default:
            return state;
    }
}