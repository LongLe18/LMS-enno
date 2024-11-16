import * as examActions from '../actions/exam';

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
    listOnline: {
        loading: false,
        result: {},
        error: null,
    },
    criteria: {
        loading: false,
        result: {},
        error: null,
    },
    publish: {
        loading: false,
        result: {},
        error: null,
    },
    detail: {
        loading: false,
        result: {},
        error: null,
    },
    examUser: {
        loading: false,
        result: {},
        error: null,
    },
    listExamsUser: {
        loading: false,
        result: {},
        error: null,
    },
    reuseExam: {
        loading: false,
        result: {},
        error: null,
    }
}

export default function examReducer(state = initState, action) {
    switch(action.type) {
        // get a course
        case examActions.GET_EXAM:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case examActions.GET_EXAM_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case examActions.GET_EXAM_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        // get a list of courses
        case examActions.GET_EXAMS:
            return {
                ...state,
                list: { ...state.list, loading: true },
            };
        case examActions.GET_EXAMS_SUCCESS:
            return {
                ...state,
                list: { ...state.list, loading: false, result: action.result },
            };
        case examActions.GET_EXAMS_FAILED:
            return {
                ...state,
                list: { ...state.list, loading: false, error: action.error },
            };
        // delete a course
        case examActions.DELETE_EXAM:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case examActions.DELETE_EXAM_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case examActions.DELETE_EXAM_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        // edit a course
        case examActions.EDIT_EXAM:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case examActions.EDIT_EXAM_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case examActions.EDIT_EXAM_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error }
            }
        // create a course
        case examActions.CREATE_EXAM:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case examActions.CREATE_EXAM_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case examActions.CREATE_EXAM_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        // reuse Exam
        case examActions.REUSE_EXAM:
            return {
                ...state,
                reuseExam: { ...state.reuseExam, loading: true },
            };
        case examActions.REUSE_EXAM_SUCCESS:
            return {
                ...state,
                reuseExam: { ...state.reuseExam, loading: false, result: action.result },
            };
        case examActions.REUSE_EXAM_FAILED:
            return {
                ...state,
                reuseExam: { ...state.reuseExam, loading: false, error: action.error },
            };
        /// filter exams
        case examActions.FILTER_EXAMS:
            return {
                ...state,
                list: { ...state.list, loading: true },
            };
        case examActions.FILTER_EXAMS_SUCCESS:
            return {
                ...state,
                list: { ...state.list, loading: false, result: action.result },
            };
        case examActions.FILTER_EXAMS_FAILED:
            return {
                ...state,
                list: { ...state.list, loading: false, error: action.error },
            };
        // filter exam DGNL
        case examActions.FILTER_EXAMS_DGNL:
            return {
                ...state,
                list: { ...state.list, loading: true },
            };
        case examActions.FILTER_EXAMS_DGNL_SUCCESS:
            return {
                ...state,
                list: { ...state.list, loading: false, result: action.result },
            };
        case examActions.FILTER_EXAMS_DGNL_FAILED:
            return {
                ...state,
                list: { ...state.list, loading: false, error: action.error },
            };
        // online criteria
        case examActions.GET_CRITERIA_ONLINE_ID:
            return {
                ...state,
                criteria: { ...state.criteria, loading: true },
            };
        case examActions.GET_CRITERIA_ONLINE_ID_SUCCESS:
            return {
                ...state,
                criteria: { ...state.criteria, loading: false, result: action.result },
            };
        case examActions.GET_CRITERIA_ONLINE_ID_FAILED:
            return {
                ...state,
                criteria: { ...state.criteria, loading: false, error: action.error },
            };
        // DGNL criteria
        case examActions.GET_CRITERIA_DGNL_ID:
            return {
                ...state,
                criteria: { ...state.criteria, loading: true },
            };
        case examActions.GET_CRITERIA_DGNL_ID_SUCCESS:
            return {
                ...state,
                criteria: { ...state.criteria, loading: false, result: action.result },
            };
        case examActions.GET_CRITERIA_DGNL_ID_FAILED:
            return {
                ...state,
                criteria: { ...state.criteria, loading: false, error: action.error },
            };
        // Synthetic criteria
        case examActions.GET_SYNTHETIC_CRITERIA:
            return {
                ...state,
                criteria: { ...state.criteria, loading: true },
            };
        case examActions.GET_SYNTHETIC_CRITERIA_SUCCESS:
            return {
                ...state,
                criteria: { ...state.criteria, loading: false, result: action.result },
            };
        case examActions.GET_SYNTHETIC_CRITERIA_FAILED:
            return {
                ...state,
                criteria: { ...state.criteria, loading: false, error: action.error },
            };
        // module criteria
        case examActions.GET_MODULE_CRITERIA:
            return {
                ...state,
                criteria: { ...state.criteria, loading: true },
            };
        case examActions.GET_MODULE_CRITERIA_SUCCESS:
            return {
                ...state,
                criteria: { ...state.criteria, loading: false, result: action.result },
            };
        case examActions.GET_MODULE_CRITERIA_FAILED:
            return {
                ...state,
                criteria: { ...state.criteria, loading: false, error: action.error },
            };
        // thematic criteria
        case examActions.GET_THEMATIC_CRITERIA:
            return {
                ...state,
                criteria: { ...state.criteria, loading: true },
            };
        case examActions.GET_THEMATIC_CRITERIA_SUCCESS:
            return {
                ...state,
                criteria: { ...state.criteria, loading: false, result: action.result },
            };
        case examActions.GET_THEMATIC_CRITERIA_FAILED:
            return {
                ...state,
                criteria: { ...state.criteria, loading: false, error: action.error },
            };
        // publish exam
        case examActions.GET_PUBLISH:
            return {
                ...state,
                publish: { ...state.publish, loading: true },
            };
        case examActions.GET_PUBLISH_SUCCESS:
            return {
                ...state,
                publish: { ...state.publish, loading: false, result: action.result },
            };
        case examActions.GET_PUBLISH_FAILED:
            return {
                ...state,
                publish: { ...state.publish, loading: false, error: action.error },
            };
        // go using
        case examActions.GET_USING:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case examActions.GET_USING_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case examActions.GET_USING_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        // exam thematic 's user
        case examActions.GET_EXAM_THEMATIC_USER:
            return {
                ...state,
                detail: { ...state.detail, loading: true },
            };
        case examActions.GET_EXAM_THEMATIC_USER_SUCCESS:
            return {
                ...state,
                detail: { ...state.detail, loading: false, result: action.result },
            };
        case examActions.GET_EXAM_THEMATIC_USER_FAILED:
            return {
                ...state,
                detail: { ...state.detail, loading: false, error: action.error },
            };
        // exam module 's user
        case examActions.GET_EXAM_MODULE_USER:
            return {
                ...state,
                detail: { ...state.detail, loading: true },
            };
        case examActions.GET_EXAM_MODULE_USER_SUCCESS:
            return {
                ...state,
                detail: { ...state.detail, loading: false, result: action.result },
            };
        case examActions.GET_EXAM_MODULE_USER_FAILED:
            return {
                ...state,
                detail: { ...state.detail, loading: false, error: action.error },
            };
        // exam course 's user
        case examActions.GET_EXAM_COURSE_USER:
            return {
                ...state,
                list: { ...state.list, loading: true },
            };
        case examActions.GET_EXAM_COURSE_USER_SUCCESS:
            return {
                ...state,
                list: { ...state.list, loading: false, result: action.result },
            };
        case examActions.GET_EXAM_COURSE_USER_FAILED:
            return {
                ...state,
                list: { ...state.list, loading: false, error: action.error },
            };
        // Lấy đề thi online của user
        case examActions.GET_EXAM_COURSE_ONLINE_USER:
            return {
                ...state,
                listOnline: { ...state.list, loading: true },
            };
        case examActions.GET_EXAM_COURSE_ONLINE_USER_SUCCESS:
            return {
                ...state,
                listOnline: { ...state.list, loading: false, result: action.result },
            };
        case examActions.GET_EXAM_COURSE_ONLINE_USER_FAILED:
            return {
                ...state,
                listOnline: { ...state.list, loading: false, error: action.error },
            };
        // cho bảng de_thi_hoc_vien
        case examActions.GET_EXAM_USER:
            return {
                ...state,
                examUser: { ...state.examUser, loading: true },
            };
        case examActions.GET_EXAM_USER_SUCCESS:
            return {
                ...state,
                examUser: { ...state.examUser, loading: false, result: action.result },
            };
        case examActions.GET_EXAM_USER_FAILED:
            return {
                ...state,
                examUser: { ...state.examUser, loading: false, error: action.error },
            };
        ///////////
        case examActions.GET_EXAMS_USER:
            return {
                ...state,
                listExamsUser: { ...state.listExamsUser, loading: true },
            };
        case examActions.GET_EXAMS_USER_SUCCESS:
            return {
                ...state,
                listExamsUser: { ...state.listExamsUser, loading: false, result: action.result },
            };
        case examActions.GET_EXAMS_USER_FAILED:
            return {
                ...state,
                listExamsUser: { ...state.listExamsUser, loading: false, error: action.error },
            };
        //////////////////
        case examActions.EDIT_EXAM_USER:
            return {
                ...state,
                examUser: { ...state.examUser, loading: true },
            };
        case examActions.EDIT_EXAM_USER_SUCCESS:
            return {
                ...state,
                examUser: { ...state.examUser, loading: false, result: action.result },
            };
        case examActions.EDIT_EXAM_USER_FAILED:
            return {
                ...state,
                examUser: { ...state.examUser, loading: false, error: action.error },
            };
        ////////////////////
        case examActions.CREATE_EXAM_USER:
            return {
                ...state,
                examUser: { ...state.examUser, loading: true },
            };
        case examActions.CREATE_EXAM_USER_SUCCESS:
            return {
                ...state,
                examUser: { ...state.examUser, loading: false, result: action.result },
            };
        case examActions.CREATE_EXAM_USER_FAILED:
            return {
                ...state,
                examUser: { ...state.examUser, loading: false, error: action.error },
            };
        /////////////////
        case examActions.DELETE_EXAM_USER:
            return {
                ...state,
                examUser: { ...state.examUser, loading: true },
            };
        case examActions.DELETE_EXAM_USER_SUCCESS:
            return {
                ...state,
                examUser: { ...state.examUser, loading: false, result: action.result },
            };
        case examActions.DELETE_EXAM_USER_FAILED:
            return {
                ...state,
                examUser: { ...state.examUser, loading: false, error: action.error },
            };
        /////////////////
        case examActions.EDIT_EXAM_DGNL_USER:
            return {
                ...state,
                examUser: { ...state.examUser, loading: true },
            };
        case examActions.EDIT_EXAM_DGNL_USER_SUCCESS:
            return {
                ...state,
                examUser: { ...state.examUser, loading: false, result: action.result },
            };
        case examActions.EDIT_EXAM_DGNL_USER_FAILED:
            return {
                ...state,
                examUser: { ...state.examUser, loading: false, error: action.error },
            };
        default:
            return state;
    }
}