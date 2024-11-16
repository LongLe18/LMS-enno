import * as lessonActions from '../actions/lesson';

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

export default function lessonReducer(state = initState, action) {
    switch(action.type) {
        // get a LESSON
        case lessonActions.GET_LESSON:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case lessonActions.GET_LESSON_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case lessonActions.GET_LESSON_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        // get a LESSON by id thematic
        case lessonActions.GET_LESSON_IDTHE:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case lessonActions.GET_LESSON_IDTHE_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case lessonActions.GET_LESSON_IDTHE_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        // get a list of LESSONs
        case lessonActions.GET_LESSONS:
            return {
                ...state,
                list: { ...state.list, loading: true },
            };
        case lessonActions.GET_LESSONS_SUCCESS:
            return {
                ...state,
                list: { ...state.list, loading: false, result: action.result },
            };
        case lessonActions.GET_LESSONS_FAILED:
            return {
                ...state,
                list: { ...state.list, loading: false, error: action.error },
            };
        // delete a LESSON
        case lessonActions.DELETE_LESSON:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case lessonActions.DELETE_LESSON_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case lessonActions.DELETE_LESSON_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        // edit a LESSON
        case lessonActions.EDIT_LESSON:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case lessonActions.EDIT_LESSON_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case lessonActions.EDIT_LESSON_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error }
            }
        // create a LESSON
        case lessonActions.CREATE_LESSON:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case lessonActions.CREATE_LESSON_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case lessonActions.CREATE_LESSON_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        // filter lessons
        case lessonActions.FILTER_LESSONS:
            return {
                ...state,
                list: { ...state.list, loading: true },
            };
        case lessonActions.FILTER_LESSONS_SUCCESS:
            return {
                ...state,
                list: { ...state.list, loading: false, result: action.result },
            };
        case lessonActions.FILTER_LESSONS_FAILED:
            return {
                ...state,
                list: { ...state.list, loading: false, error: action.error },
            };
        default:
            return state;
    }
}