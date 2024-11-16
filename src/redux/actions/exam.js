export const GET_EXAM = "GET_EXAM";
export const GET_EXAM_SUCCESS = "GET_EXAM_SUCCESS";
export const GET_EXAM_FAILED = "GET_EXAM_FAILED";

export const GET_EXAMS = "GET_EXAMS";
export const GET_EXAMS_SUCCESS = "GET_EXAMS_SUCCESS";
export const GET_EXAMS_FAILED = "GET_EXAMS_FAILED";

export const FILTER_EXAMS = "FILTER_EXAMS"
export const FILTER_EXAMS_SUCCESS = "FILTER_EXAMS_SUCCESS";
export const FILTER_EXAMS_FAILED = "FILTER_EXAMS_FAILED";

export const FILTER_EXAMS_DGNL = "FILTER_EXAMS_DGNL"
export const FILTER_EXAMS_DGNL_SUCCESS = "FILTER_EXAMS_DGNL_SUCCESS";
export const FILTER_EXAMS_DGNL_FAILED = "FILTER_EXAMS_DGNL_FAILED";

export const DELETE_EXAM = "DELETE_EXAM";
export const DELETE_EXAM_SUCCESS = "DELETE_EXAM_SUCCESS";
export const DELETE_EXAM_FAILED = "DELETE_EXAM_FAILED";

export const EDIT_EXAM = "EDIT_EXAM";
export const EDIT_EXAM_SUCCESS = "EDIT_EXAM_SUCCESS";
export const EDIT_EXAM_FAILED = "EDIT_EXAM_FAILED";

export const CREATE_EXAM = "CREATE_EXAM";
export const CREATE_EXAM_SUCCESS = "CREATE_EXAM_SUCCESS";
export const CREATE_EXAM_FAILED = "CREATE_EXAM_FAILED";

export const REUSE_EXAM = "REUSE_EXAM";
export const REUSE_EXAM_SUCCESS = "REUSE_EXAM_SUCCESS";
export const REUSE_EXAM_FAILED = "REUSE_EXAM_FAILED";

export const GET_SYNTHETIC_CRITERIA =  "GET_SYNTHETIC_CRITERIA";
export const GET_SYNTHETIC_CRITERIA_SUCCESS =  "GET_SYNTHETIC_CRITERIA_SUCCESS";
export const GET_SYNTHETIC_CRITERIA_FAILED =  "GET_SYNTHETIC_CRITERIA_FAILED";

export const GET_MODULE_CRITERIA = "GET_MODULE_CRITERIA";
export const GET_MODULE_CRITERIA_SUCCESS = "GET_MODULE_CRITERIA_SUCCESS";
export const GET_MODULE_CRITERIA_FAILED = "GET_MODULE_CRITERIA_FAILED";

export const GET_THEMATIC_CRITERIA = "GET_THEMATIC_CRITERIA";
export const GET_THEMATIC_CRITERIA_SUCCESS = "GET_THEMATIC_CRITERIA_SUCCESS";
export const GET_THEMATIC_CRITERIA_FAILED = "GET_THEMATIC_CRITERIA_FAILED";

export const GET_PUBLISH = "GET_PUBLISH";
export const GET_PUBLISH_SUCCESS = "GET_PUBLISH_SUCCESS";
export const GET_PUBLISH_FAILED = "GET_PUBLISH_FAILED";

export const GET_USING = "GET_USING";
export const GET_USING_SUCCESS = "GET_USING_SUCCESS";
export const GET_USING_FAILED = "GET_USING_FAILED";
 
export const GET_EXAM_THEMATIC_USER = "GET_EXAM_THEMATIC_USER";
export const GET_EXAM_THEMATIC_USER_SUCCESS = "GET_EXAM_THEMATIC_USER_SUCCESS";
export const GET_EXAM_THEMATIC_USER_FAILED = "GET_EXAM_THEMATIC_USER_FAILED";
 
export const GET_EXAM_MODULE_USER = "GET_EXAM_MODULE_USER";
export const GET_EXAM_MODULE_USER_SUCCESS = "GET_EXAM_MODULE_USER_SUCCESS";
export const GET_EXAM_MODULE_USER_FAILED = "GET_EXAM_MODULE_USER_FAILED";

export const GET_EXAM_COURSE_USER = "GET_EXAM_COURSE_USER";
export const GET_EXAM_COURSE_USER_SUCCESS = "GET_EXAM_COURSE_USER_SUCCESS";
export const GET_EXAM_COURSE_USER_FAILED = "GET_EXAM_COURSE_USER_FAILED";

export const GET_EXAM_COURSE_ONLINE_USER = "GET_EXAM_COURSE_ONLINE_USER";
export const GET_EXAM_COURSE_ONLINE_USER_SUCCESS = "GET_EXAM_COURSE_ONLINE_USER_SUCCESS";
export const GET_EXAM_COURSE_ONLINE_USER_FAILED = "GET_EXAM_COURSE_ONLINE_USER_FAILED";

// cho table de_thi_hoc_vien
export const GET_EXAM_USER = "GET_EXAM_USER";
export const GET_EXAM_USER_SUCCESS = "GET_EXAM_USER_SUCCESS";
export const GET_EXAM_USER_FAILED = "GET_EXAM_USER_FAILED";

export const GET_EXAMS_USER = "GET_EXAMS_USER";
export const GET_EXAMS_USER_SUCCESS = "GET_EXAMS_USER_SUCCESS";
export const GET_EXAMS_USER_FAILED = "GET_EXAMS_USER_FAILED";

export const CREATE_EXAM_USER = "CREATE_EXAM_USER";
export const CREATE_EXAM_USER_SUCCESS = "CREATE_EXAM_USER_SUCCESS";
export const CREATE_EXAM_USER_FAILED = "CREATE_EXAM_USER_FAILED";

export const EDIT_EXAM_USER = "EDIT_EXAM_USER";
export const EDIT_EXAM_USER_SUCCESS = "EDIT_EXAM_USER_SUCCESS";
export const EDIT_EXAM_USER_FAILED = "EDIT_EXAM_USER_FAILED";

export const EDIT_EXAM_DGNL_USER = "EDIT_EXAM_DGNL_USER";
export const EDIT_EXAM_DGNL_USER_SUCCESS = "EDIT_EXAM_DGNL_USER_SUCCESS";
export const EDIT_EXAM_DGNL_USER_FAILED = "EDIT_EXAM_DGNL_USER_FAILED";

export const DELETE_EXAM_USER = "DELETE_EXAM_USER";
export const DELETE_EXAM_USER_SUCCESS = "DELETE_EXAM_USER_SUCCESS";
export const DELETE_EXAM_USER_FAILED = "DELETE_EXAM_USER_FAILED";

export const GET_CRITERIA_ONLINE_ID = "GET_CRITERIA_ONLINE_ID";
export const GET_CRITERIA_ONLINE_ID_SUCCESS = "GET_CRITERIA_ONLINE_ID_SUCCESS";
export const GET_CRITERIA_ONLINE_ID_FAILED = "GET_CRITERIA_ONLINE_ID_FAILED";

export const GET_CRITERIA_DGNL_ID = "GET_CRITERIA_DGNL_ID";
export const GET_CRITERIA_DGNL_ID_SUCCESS = "GET_CRITERIA_DGNL_ID_SUCCESS";
export const GET_CRITERIA_DGNL_ID_FAILED = "GET_CRITERIA_DGNL_ID_FAILED";

export function getExam(params, callback) {
    return {
        type: GET_EXAM,
        params,
        callback,
    };  
}

export function getExams(params, callback) {
    return {
        type: GET_EXAMS,
        params,
        callback,
    };
}

export function filterExam(params, callback) {
    return {
        type: FILTER_EXAMS,
        params,
        callback,
    };
}

export function filterExamDGNL(params, callback) {
    return {
        type: FILTER_EXAMS_DGNL,
        params,
        callback,
    };
}

export function createExam(params, callback) {
    return {
        type: CREATE_EXAM,
        params,
        callback,
    };
}

export function reuseExam(params, callback) {
    return {
        type: REUSE_EXAM,
        params,
        callback,
    };
}

export function editExam(params, callback) {
    return {
        type: EDIT_EXAM,
        params,
        callback,
    };
}

export function deleteExam(params, callback) {
    return {
        type: DELETE_EXAM,
        params,
        callback,
    };
}

export function getCriteriaOnlineById(params, callback) {
    return {
        type: GET_CRITERIA_ONLINE_ID,
        params,
        callback,
    };
}

export function getCriteriaDGNLById(params, callback) {
    return {
        type: GET_CRITERIA_DGNL_ID,
        params,
        callback,
    };
}

export function getSyntheticCriteria(params, callback) {
    return {
        type: GET_SYNTHETIC_CRITERIA,
        params,
        callback,
    }
} 

export function getModuleCriteria(params, callback) {
    return {
        type: GET_MODULE_CRITERIA,
        params,
        callback
    }
}

export function getThematicCriteria(params, callback) {
    return {
        type: GET_THEMATIC_CRITERIA,
        params,
        callback
    }
}

export function publishExam(params, callback) {
    return {
        type: GET_PUBLISH,
        params,
        callback
    }
}

export function getUsing(params, callback) {
    return {
        type: GET_USING,
        params,
        callback
    }
}

export function getExamThematic(params, callback) {
    return {
        type: GET_EXAM_THEMATIC_USER,
        params,
        callback
    }
}

export function getExamModule(params, callback) {
    return {
        type: GET_EXAM_MODULE_USER,
        params,
        callback
    }
}

export function getExamCourse(params, callback) {
    return {
        type: GET_EXAM_COURSE_USER,
        params,
        callback
    }
}

export function getExamCourseOnline(params, callback) {
    return {
        type: GET_EXAM_COURSE_ONLINE_USER,
        params,
        callback
    }
}


export function getExamsUser(params, callback) {
    return {
        type: GET_EXAMS_USER,
        params,
        callback
    }
}

export function getExamUser(params, callback) {
    return {
        type: GET_EXAM_USER,
        params,
        callback
    }
}

export function createExamUser(params, callback) {
    return {
        type: CREATE_EXAM_USER,
        params,
        callback
    }
}

export function editExamUser(params, callback) {
    return {
        type: EDIT_EXAM_USER,
        params,
        callback
    }
}

export function editExamDGNLUser(params, callback) {
    return {
        type: EDIT_EXAM_DGNL_USER,
        params,
        callback
    }
}


export function deleteExamUser(params, callback) {
    return {
        type: DELETE_EXAM_USER,
        params,
        callback
    }
}