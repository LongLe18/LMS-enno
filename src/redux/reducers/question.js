import * as questionActions from '../actions/question';

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
    questionExamItem: {
        loading: false,
        result: {},
        error: null,
    },
    questionExamList: {
        loading: false,
        result: {},
        error: null,
    },
}

export default function questionReducer(state = initState, action) {
    switch(action.type) {
        // get a course
        case questionActions.GET_QUESTION:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case questionActions.GET_QUESTION_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case questionActions.GET_QUESTION_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        // get a list of courses
        case questionActions.GET_QUESTIONS:
            return {
                ...state,
                list: { ...state.list, loading: true },
            };
        case questionActions.GET_QUESTIONS_SUCCESS:
            return {
                ...state,
                list: { ...state.list, loading: false, result: action.result },
            };
        case questionActions.GET_QUESTIONS_FAILED:
            return {
                ...state,
                list: { ...state.list, loading: false, error: action.error },
            };
        // get a list of Exam
        case questionActions.GET_QUESTIONS_BY_EXAM:
            return {
                ...state,
                list: { ...state.list, loading: true },
            };
        case questionActions.GET_QUESTIONS_BY_EXAM_SUCCESS:
            return {
                ...state,
                list: { ...state.list, loading: false, result: action.result },
            };
        case questionActions.GET_QUESTIONS_BY_EXAM_FAILED:
            return {
                ...state,
                list: { ...state.list, loading: false, error: action.error },
            };
        // delete a course
        case questionActions.DELETE_QUESTION:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case questionActions.DELETE_QUESTION_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case questionActions.DELETE_QUESTION_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        // edit a course
        case questionActions.EDIT_QUESTION:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case questionActions.EDIT_QUESTION_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case questionActions.EDIT_QUESTION_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error }
            }
        // create a course
        case questionActions.CREATE_QUESTION:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case questionActions.CREATE_QUESTION_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case questionActions.CREATE_QUESTION_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        /// filter courses
        case questionActions.FILTER_QUESTIONS:
            return {
                ...state,
                list: { ...state.list, loading: true },
            };
        case questionActions.FILTER_QUESTIONS_SUCCESS:
            return {
                ...state,
                list: { ...state.list, loading: false, result: action.result },
            };
        case questionActions.FILTER_QUESTIONS_FAILED:
            return {
                ...state,
                list: { ...state.list, loading: false, error: action.error },
            };       
        /////////////////////////////////////////////// câu hỏi trong 1 đề thi
        // get question
        case questionActions.GET_QUESTION_EXAM:
            return {
                ...state,
                questionExamItem: { ...state.questionExamItem, loading: true },
            };
        case questionActions.GET_QUESTION_EXAM_SUCCESS:
            return {
                ...state,
                questionExamItem: { ...state.questionExamItem, loading: false, result: action.result },
            };
        case questionActions.GET_QUESTION_EXAM_FAILED:
            return {
                ...state,
                questionExamItem: { ...state.questionExamItem, loading: false, error: action.error },
            };
        // get question of exam
        case questionActions.GET_QUESTIONS_EXAM:
            return {
                ...state,
                questionExamList: { ...state.questionExamList, loading: true },
            };
        case questionActions.GET_QUESTIONS_EXAM_SUCCESS:
            return {
                ...state,
                questionExamList: { ...state.questionExamList, loading: false, result: action.result },
            };
        case questionActions.GET_QUESTIONS_EXAM_FAILED:
            return {
                ...state,
                questionExamList: { ...state.questionExamList, loading: false, error: action.error },
            };
        // edit question of exam
        case questionActions.EDIT_QUESTION_EXAM:
            return {
                ...state,
                questionExamItem: { ...state.questionExamItem, loading: true },
            };
        case questionActions.EDIT_QUESTION_EXAM_SUCCESS:
            return {
                ...state,
                questionExamItem: { ...state.questionExamItem, loading: false, result: action.result },
            };
        case questionActions.EDIT_QUESTION_EXAM_FAILED:
            return {
                ...state,
                questionExamItem: { ...state.questionExamItem, loading: false, error: action.error },
            };
        // create question of exam
        case questionActions.CREATE_QUESTION_EXAM:
            return {
                ...state,
                questionExamItem: { ...state.questionExamItem, loading: true },
            };
        case questionActions.CREATE_QUESTION_EXAM_SUCCESS:
            return {
                ...state,
                questionExamItem: { ...state.questionExamItem, loading: false, result: action.result },
            };
        case questionActions.CREATE_QUESTION_EXAM_FAILED:
            return {
                ...state,
                questionExamItem: { ...state.questionExamItem, loading: false, error: action.error },
            };
        // delete question of exam
        case questionActions.DELETE_QUESTION_EXAM:
            return {
                ...state,
                questionExamItem: { ...state.questionExamItem, loading: true },
            };
        case questionActions.DELETE_QUESTION_EXAM_SUCCESS:
            return {
                ...state,
                questionExamItem: { ...state.questionExamItem, loading: false, result: action.result },
            };
        case questionActions.DELETE_QUESTION_EXAM_FAILED:
            return {
                ...state,
                questionExamItem: { ...state.questionExamItem, loading: false, error: action.error },
            };
        default:
            return state;
    }
}