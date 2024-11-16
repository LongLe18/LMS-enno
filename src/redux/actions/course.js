export const GET_COURSE = "GET_COURSE";
export const GET_COURSE_SUCCESS = "GET_COURSE_SUCCESS";
export const GET_COURSE_FAILED = "GET_COURSE_FAILED";

export const GET_COURSES = "GET_COURSES";
export const GET_COURSES_SUCCESS = "GET_COURSES_SUCCESS";
export const GET_COURSES_FAILED = "GET_COURSES_FAILED";

export const FILTER_COURSES = "FILTER_COURSES";
export const FILTER_COURSES_SUCCESS = "FILTER_COURSES_SUCCESS";
export const FILTER_COURSES_FAILED = "FILTER_COURSES_FAILED";


export const DELETE_COURSE = "DELETE_COURSE";
export const DELETE_COURSE_SUCCESS = "DELETE_COURSE_SUCCESS";
export const DELETE_COURSE_FAILED = "DELETE_COURSE_FAILED";

export const EDIT_COURSE = "EDIT_COURSE";
export const EDIT_COURSE_SUCCESS = "EDIT_COURSE_SUCCESS";
export const EDIT_COURSE_FAILED = "EDIT_COURSE_FAILED";

export const CREATE_COURSE = "CREATE_COURSE";
export const CREATE_COURSE_SUCCESS = "CREATE_COURSE_SUCCESS";
export const CREATE_COURSE_FAILED = "CREATE_COURSE_FAILED";


export const ADD_STUDENT_COURSE = "ADD_STUDENT_COURSE";
export const ADD_STUDENT_COURSE_SUCCESS = "ADD_STUDENT_COURSE_SUCCESS";
export const ADD_STUDENT_COURSE_FAILED = "ADD_STUDENT_COURSE_FAILED";

export const GET_COURSES_STUDENT = "GET_COURSES_STUDENT";
export const GET_COURSES_STUDENT_SUCCESS = "GET_COURSES_STUDENT_SUCCESS";
export const GET_COURSES_STUDENT_FAILED = "GET_COURSES_STUDENT_FAILED";

export const GET_REMAIN_STUDENT_COURSE = "GET_REMAIN_STUDENT_COURSE";
export const GET_REMAIN_STUDENT_COURSE_SUCCESS = "GET_REMAIN_STUDENT_COURSE_SUCCESS";
export const GET_REMAIN_STUDENT_COURSE_FAILED = "GET_REMAIN_STUDENT_COURSE_FAILED";

export const GET_COURSES_STUDENT_DETAIL = "GET_COURSES_STUDENT_DETAIL";
export const GET_COURSES_STUDENT_DETAIL_SUCCESS = "GET_COURSES_STUDENT_DETAIL_SUCCESS";
export const GET_COURSES_STUDENT_DETAIL_FAILED = "GET_COURSES_STUDENT_DETAIL_FAILED";

export const DELETE_COURSES_STUDENT = "DELETE_COURSES_STUDENT";
export const DELETE_COURSES_STUDENT_SUCCESS = "DELETE_COURSES_STUDENT_SUCCESS";
export const DELETE_COURSES_STUDENT_FAILED = "DELETE_COURSES_STUDENT_FAILED";

export function getRemainStudentOfCourse(params, callback) {
    return {
        type: GET_REMAIN_STUDENT_COURSE,
        params,
        callback,
    };
}

export function deleteCourseStudent(params, callback) {
    return {
        type: DELETE_COURSES_STUDENT,
        params,
        callback,
    };
}

export function getCourseStudent(params, callback) {
    return {
        type: GET_COURSES_STUDENT,
        params,
        callback,
    };
}

export function getStudentOfCourse(params, callback) {
    return {
        type: GET_COURSES_STUDENT_DETAIL,
        params,
        callback,
    };
}

export function addStudentToCourse(params, callback) {
    return {
        type: ADD_STUDENT_COURSE,
        params,
        callback,
    };
}

export function getCourse(params, callback) {
    return {
        type: GET_COURSE,
        params,
        callback,
    };
}

export function getCourses(params, callback) {
    return {
        type: GET_COURSES,
        params,
        callback,
    };
}

export function filterCourses(params, callback) {
    return {
        type: FILTER_COURSES,
        params,
        callback,
    };
}

export function DeleteCourse(params, callback) {
    return {
        type: DELETE_COURSE,
        params,
        callback,
    };
}

export function EditCourse(params, callback) {
    return {
        type: EDIT_COURSE,
        params,
        callback,
    };
}

export function CreateCourse(params, callback) {
    return {
        type: CREATE_COURSE,
        params,
        callback,
    };
}