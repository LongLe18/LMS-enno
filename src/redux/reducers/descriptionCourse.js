import * as descriptionCourseActions from '../actions/descriptionCourse';

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

export default function descriptionCourseReducer(state = initState, action) {
    switch(action.type) {
        // get a course
        case descriptionCourseActions.GET_DESCRIPTION_COURSE:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case descriptionCourseActions.GET_DESCRIPTION_COURSE_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case descriptionCourseActions.GET_DESCRIPTION_COURSE_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        // get a list of courses
        case descriptionCourseActions.GET_DESCRIPTION_COURSES:
            return {
                ...state,
                list: { ...state.list, loading: true },
            };
        case descriptionCourseActions.GET_DESCRIPTION_COURSES_SUCCESS:
            return {
                ...state,
                list: { ...state.list, loading: false, result: action.result },
            };
        case descriptionCourseActions.GET_DESCRIPTION_COURSES_FAILED:
            return {
                ...state,
                list: { ...state.list, loading: false, error: action.error },
            };
        // delete a course
        case descriptionCourseActions.DELETE_DESCRIPTION_COURSE:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case descriptionCourseActions.DELETE_DESCRIPTION_COURSE_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case descriptionCourseActions.DELETE_DESCRIPTION_COURSE_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        // edit a course
        case descriptionCourseActions.EDIT_DESCRIPTION_COURSE:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case descriptionCourseActions.EDIT_DESCRIPTION_COURSE_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case descriptionCourseActions.EDIT_DESCRIPTION_COURSE_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error }
            }
        // create a course
        case descriptionCourseActions.CREATE_DESCRIPTION_COURSE:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case descriptionCourseActions.CREATE_DESCRIPTION_COURSE_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case descriptionCourseActions.CREATE_DESCRIPTION_COURSE_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        /// filter courses
        case descriptionCourseActions.FILTER_DESCRIPTION_COURSES:
            return {
                ...state,
                list: { ...state.list, loading: true },
            };
        case descriptionCourseActions.FILTER_DESCRIPTION_COURSES_SUCCESS:
            return {
                ...state,
                list: { ...state.list, loading: false, result: action.result },
            };
        case descriptionCourseActions.FILTER_DESCRIPTION_COURSES_FAILED:
            return {
                ...state,
                list: { ...state.list, loading: false, error: action.error },
            };
        default:
            return state;
    }
}