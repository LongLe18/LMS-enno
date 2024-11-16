import * as advertiseActions from '../actions/advertisement';

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
    itemTeacher: {
        loading: false,
        result: {},
        error: null,
    },
    listTeacher: {
        loading: false,
        result: {},
        error: null,
    },
    itemCourse: {
        loading: false,
        result: {},
        error: null,
    },
    listCourse: {
        loading: false,
        result: {},
        error: null,
    },
}

export default function advertiseReducer(state = initState, action) {
    switch(action.type) {
        // get a document
        case advertiseActions.GET_ADSDOC:
            return {
                ...state,
                itemDoc: { ...state.itemDoc, loading: true },
            };
        case advertiseActions.GET_ADSDOC_SUCCESS:
            return {
                ...state,
                itemDoc: { ...state.itemDoc, loading: false, result: action.result },
            };
        case advertiseActions.GET_ADSDOC_FAILED:
            return {
                ...state,
                itemDoc: { ...state.itemDoc, loading: false, error: action.error },
            };
        // get a list of documents
        case advertiseActions.GET_ADSDOCS:
            return {
                ...state,
                listDoc: { ...state.listDoc, loading: true },
            };
        case advertiseActions.GET_ADSDOCS_SUCCESS:
            return {
                ...state,
                listDoc: { ...state.listDoc, loading: false, result: action.result },
            };
        case advertiseActions.GET_ADSDOCS_FAILED:
            return {
                ...state,
                listDoc: { ...state.listDoc, loading: false, error: action.error },
            };
        // delete a document
        case advertiseActions.DELETE_ADSDOC:
            return {
                ...state,
                itemDoc: { ...state.itemDoc, loading: true },
            };
        case advertiseActions.DELETE_ADSDOC_SUCCESS:
            return {
                ...state,
                itemDoc: { ...state.itemDoc, loading: false, result: action.result },
            };
        case advertiseActions.DELETE_ADSDOC_FAILED:
            return {
                ...state,
                itemDoc: { ...state.itemDoc, loading: false, error: action.error },
            };
        // edit a document
        case advertiseActions.EDIT_ADSDOC:
            return {
                ...state,
                itemDoc: { ...state.itemDoc, loading: true },
            };
        case advertiseActions.EDIT_ADSDOC_SUCCESS:
            return {
                ...state,
                itemDoc: { ...state.itemDoc, loading: false, result: action.result },
            };
        case advertiseActions.EDIT_ADSDOC_FAILED:
            return {
                ...state,
                itemDoc: { ...state.itemDoc, loading: false, error: action.error }
            }
        // create a document
        case advertiseActions.CREATE_ADSDOC:
            return {
                ...state,
                itemDoc: { ...state.itemDoc, loading: true },
            };
        case advertiseActions.CREATE_ADSDOC_SUCCESS:
            return {
                ...state,
                itemDoc: { ...state.itemDoc, loading: false, result: action.result },
            };
        case advertiseActions.CREATE_ADSDOC_FAILED:
            return {
                ...state,
                itemDoc: { ...state.itemDoc, loading: false, error: action.error },
            };
        /// change status document
        case advertiseActions.CHANGE_ADSDOC:
            return {
                ...state,
                itemDoc: { ...state.itemDoc, loading: true },
            };
        case advertiseActions.CHANGE_ADSDOC_SUCCESS:
            return {
                ...state,
                itemDoc: { ...state.itemDoc, loading: false, result: action.result },
            };
        case advertiseActions.CHANGE_ADSDOC_FAILED:
            return {
                ...state,
                itemDoc: { ...state.itemDoc, loading: false, error: action.error },
            };
        //////////////////////////////////////////////////
        // /////////////////////////////////////////////
        case advertiseActions.GET_ADSTEACHER:
            return {
                ...state,
                itemTeacher: { ...state.itemTeacher, loading: true },
            };
        case advertiseActions.GET_ADSTEACHER_SUCCESS:
            return {
                ...state,
                itemTeacher: { ...state.itemTeacher, loading: false, result: action.result },
            };
        case advertiseActions.GET_ADSTEACHER_FAILED:
            return {
                ...state,
                itemTeacher: { ...state.itemTeacher, loading: false, error: action.error },
            };
        // get a list of teachers
        case advertiseActions.GET_ADSTEACHERS:
            return {
                ...state,
                listTeacher: { ...state.listTeacher, loading: true },
            };
        case advertiseActions.GET_ADSTEACHERS_SUCCESS:
            return {
                ...state,
                listTeacher: { ...state.listTeacher, loading: false, result: action.result },
            };
        case advertiseActions.GET_ADSTEACHERS_FAILED:
            return {
                ...state,
                listTeacher: { ...state.listTeacher, loading: false, error: action.error },
            };
        // delete a teacher
        case advertiseActions.DELETE_ADSTEACHER:
            return {
                ...state,
                itemTeacher: { ...state.itemTeacher, loading: true },
            };
        case advertiseActions.DELETE_ADSTEACHER_SUCCESS:
            return {
                ...state,
                itemTeacher: { ...state.itemTeacher, loading: false, result: action.result },
            };
        case advertiseActions.DELETE_ADSTEACHER_FAILED:
            return {
                ...state,
                itemTeacher: { ...state.itemTeacher, loading: false, error: action.error },
            };
        // edit a teacher
        case advertiseActions.EDIT_ADSTEACHER:
            return {
                ...state,
                itemTeacher: { ...state.itemTeacher, loading: true },
            };
        case advertiseActions.EDIT_ADSTEACHER_SUCCESS:
            return {
                ...state,
                itemTeacher: { ...state.itemTeacher, loading: false, result: action.result },
            };
        case advertiseActions.EDIT_ADSTEACHER_FAILED:
            return {
                ...state,
                itemTeacher: { ...state.itemTeacher, loading: false, error: action.error }
            }
        // create a teacher
        case advertiseActions.CREATE_ADSTEACHER:
            return {
                ...state,
                itemTeacher: { ...state.itemTeacher, loading: true },
            };
        case advertiseActions.CREATE_ADSTEACHER_SUCCESS:
            return {
                ...state,
                itemTeacher: { ...state.itemTeacher, loading: false, result: action.result },
            };
        case advertiseActions.CREATE_ADSTEACHER_FAILED:
            return {
                ...state,
                itemTeacher: { ...state.itemTeacher, loading: false, error: action.error },
            };
        /// change status teacher
        case advertiseActions.CHANGE_ADSTEACHER:
            return {
                ...state,
                itemTeacher: { ...state.itemTeacher, loading: true },
            };
        case advertiseActions.CHANGE_ADSTEACHER_SUCCESS:
            return {
                ...state,
                itemTeacher: { ...state.itemTeacher, loading: false, result: action.result },
            };
        case advertiseActions.CHANGE_ADSTEACHER_FAILED:
            return {
                ...state,
                itemTeacher: { ...state.itemTeacher, loading: false, error: action.error },
            };
        //////////////////////////////////////////////////
        // /////////////////////////////////////////////
        case advertiseActions.GET_ADSCOURSE:
            return {
                ...state,
                itemCourse: { ...state.itemCourse, loading: true },
            };
        case advertiseActions.GET_ADSCOURSE_SUCCESS:
            return {
                ...state,
                itemCourse: { ...state.itemCourse, loading: false, result: action.result },
            };
        case advertiseActions.GET_ADSCOURSE_FAILED:
            return {
                ...state,
                itemCourse: { ...state.itemCourse, loading: false, error: action.error },
            };
        // get a list of courses
        case advertiseActions.GET_ADSCOURSES:
            return {
                ...state,
                listCourse: { ...state.listCourse, loading: true },
            };
        case advertiseActions.GET_ADSCOURSES_SUCCESS:
            return {
                ...state,
                listCourse: { ...state.listCourse, loading: false, result: action.result },
            };
        case advertiseActions.GET_ADSCOURSES_FAILED:
            return {
                ...state,
                listCourse: { ...state.listCourse, loading: false, error: action.error },
            };
        // delete a course
        case advertiseActions.DELETE_ADSCOURSE:
            return {
                ...state,
                itemCourse: { ...state.itemCourse, loading: true },
            };
        case advertiseActions.DELETE_ADSCOURSE_SUCCESS:
            return {
                ...state,
                itemCourse: { ...state.itemCourse, loading: false, result: action.result },
            };
        case advertiseActions.DELETE_ADSCOURSE_FAILED:
            return {
                ...state,
                itemCourse: { ...state.itemCourse, loading: false, error: action.error },
            };
        // edit a course
        case advertiseActions.EDIT_ADSCOURSE:
            return {
                ...state,
                itemCourse: { ...state.itemCourse, loading: true },
            };
        case advertiseActions.EDIT_ADSCOURSE_SUCCESS:
            return {
                ...state,
                itemCourse: { ...state.itemCourse, loading: false, result: action.result },
            };
        case advertiseActions.EDIT_ADSCOURSE_FAILED:
            return {
                ...state,
                itemCourse: { ...state.itemCourse, loading: false, error: action.error }
            }
        // create a course
        case advertiseActions.CREATE_ADSCOURSE:
            return {
                ...state,
                itemCourse: { ...state.itemCourse, loading: true },
            };
        case advertiseActions.CREATE_ADSCOURSE_SUCCESS:
            return {
                ...state,
                itemCourse: { ...state.itemCourse, loading: false, result: action.result },
            };
        case advertiseActions.CREATE_ADSCOURSE_FAILED:
            return {
                ...state,
                itemCourse: { ...state.itemCourse, loading: false, error: action.error },
            };
        /// change status course
        case advertiseActions.CHANGE_ADSCOURSE:
            return {
                ...state,
                itemCourse: { ...state.itemCourse, loading: true },
            };
        case advertiseActions.CHANGE_ADSCOURSE_SUCCESS:
            return {
                ...state,
                itemCourse: { ...state.itemCourse, loading: false, result: action.result },
            };
        case advertiseActions.CHANGE_ADSCOURSE_FAILED:
            return {
                ...state,
                itemCourse: { ...state.itemCourse, loading: false, error: action.error },
            };
        default:
            return state;
    }
}