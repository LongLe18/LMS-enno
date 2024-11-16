import * as courseActions from '../actions/course';

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
    listDetail: {
        loading: false,
        result: {},
        error: null,
    },
    add: {
        loading: false,
        result: {},
        error: null,
    },
    remain: {
        loading: false,
        result: {},
        error: null,
    },
}

export default function courseReducer(state = initState, action) {
    switch(action.type) {
        // get a course
        case courseActions.GET_COURSE:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case courseActions.GET_COURSE_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case courseActions.GET_COURSE_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        // get a list of courses
        case courseActions.GET_COURSES:
            return {
                ...state,
                list: { ...state.list, loading: true },
            };
        case courseActions.GET_COURSES_SUCCESS:
            return {
                ...state,
                list: { ...state.list, loading: false, result: action.result },
            };
        case courseActions.GET_COURSES_FAILED:
            return {
                ...state,
                list: { ...state.list, loading: false, error: action.error },
            };
        // delete a course
        case courseActions.DELETE_COURSE:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case courseActions.DELETE_COURSE_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case courseActions.DELETE_COURSE_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        // edit a course
        case courseActions.EDIT_COURSE:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case courseActions.EDIT_COURSE_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case courseActions.EDIT_COURSE_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error }
            }
        // create a course
        case courseActions.CREATE_COURSE:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case courseActions.CREATE_COURSE_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case courseActions.CREATE_COURSE_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        /// filter courses
        case courseActions.FILTER_COURSES:
            return {
                ...state,
                list: { ...state.list, loading: true },
            };
        case courseActions.FILTER_COURSES_SUCCESS:
            return {
                ...state,
                list: { ...state.list, loading: false, result: action.result },
            };
        case courseActions.FILTER_COURSES_FAILED:
            return {
                ...state,
                list: { ...state.list, loading: false, error: action.error },
            };
        // add student to course
        case courseActions.ADD_STUDENT_COURSE:
            return {
                ...state,
                add: { ...state.add, loading: true },
            };
        case courseActions.ADD_STUDENT_COURSE_SUCCESS:
            return {
                ...state,
                add: { ...state.add, loading: false, result: action.result },
            };
        case courseActions.ADD_STUDENT_COURSE_FAILED:
            return {
                ...state,
                add: { ...state.add, loading: false, error: action.error },
            };
        // Course Student
        case courseActions.GET_COURSES_STUDENT:
            return {
                ...state,
                list: { ...state.list, loading: true },
            };
        case courseActions.GET_COURSES_STUDENT_SUCCESS:
            return {
                ...state,
                list: { ...state.list, loading: false, result: action.result },
            };
        case courseActions.GET_COURSES_STUDENT_FAILED:
            return {
                ...state,
                list: { ...state.list, loading: false, error: action.error },
            };
        // students of course
        case courseActions.GET_COURSES_STUDENT_DETAIL:
            return {
                ...state,
                listDetail: { ...state.listDetail, loading: true },
            };
        case courseActions.GET_COURSES_STUDENT_DETAIL_SUCCESS:
            return {
                ...state,
                listDetail: { ...state.listDetail, loading: false, result: action.result },
            };
        case courseActions.GET_COURSES_STUDENT_DETAIL_FAILED:
            return {
                ...state,
                listDetail: { ...state.listDetail, loading: false, error: action.error },
            };
        // delete student of course
        case courseActions.DELETE_COURSES_STUDENT:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case courseActions.DELETE_COURSES_STUDENT_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case courseActions.DELETE_COURSES_STUDENT_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        // remained student of course
        case courseActions.GET_REMAIN_STUDENT_COURSE:
            return {
                ...state,
                remain: { ...state.remain, loading: true },
            };
        case courseActions.GET_REMAIN_STUDENT_COURSE_SUCCESS:
            return {
                ...state,
                remain: { ...state.remain, loading: false, result: action.result },
            };
        case courseActions.GET_REMAIN_STUDENT_COURSE_FAILED:
            return {
                ...state,
                remain: { ...state.remain, loading: false, error: action.error },
            };
        default:
            return state;
    }
}