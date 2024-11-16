export const GET_DESCRIPTION_COURSE = "GET_DESCRIPTION_COURSE";
export const GET_DESCRIPTION_COURSE_SUCCESS = "GET_DESCRIPTION_COURSE_SUCCESS";
export const GET_DESCRIPTION_COURSE_FAILED = "GET_DESCRIPTIONc_COURSE_FAILED";

export const GET_DESCRIPTION_COURSES = "GET_DESCRIPTION_COURSES";
export const GET_DESCRIPTION_COURSES_SUCCESS = "GET_DESCRIPTION_COURSES_SUCCESS";
export const GET_DESCRIPTION_COURSES_FAILED = "GET_DESCRIPTION_COURSES_FAILED";

export const FILTER_DESCRIPTION_COURSES = "FILTER_DESCRIPTION_COURSES";
export const FILTER_DESCRIPTION_COURSES_SUCCESS = "FILTER_DESCRIPTION_COURSES_SUCCESS";
export const FILTER_DESCRIPTION_COURSES_FAILED = "FILTER_DESCRIPTION_COURSES_FAILED";


export const DELETE_DESCRIPTION_COURSE = "DELETE_DESCRIPTION_COURSE";
export const DELETE_DESCRIPTION_COURSE_SUCCESS = "DELETE_DESCRIPTION_COURSE_SUCCESS";
export const DELETE_DESCRIPTION_COURSE_FAILED = "DELETE_DESCRIPTION_COURSE_FAILED";

export const EDIT_DESCRIPTION_COURSE = "EDIT_DESCRIPTION_COURSE";
export const EDIT_DESCRIPTION_COURSE_SUCCESS = "EDIT_DESCRIPTION_COURSE_SUCCESS";
export const EDIT_DESCRIPTION_COURSE_FAILED = "EDIT_DESCRIPTION_COURSE_FAILED";

export const CREATE_DESCRIPTION_COURSE = "CREATE_DESCRIPTION_COURSE";
export const CREATE_DESCRIPTION_COURSE_SUCCESS = "CREATE_DESCRIPTION_COURSE_SUCCESS";
export const CREATE_DESCRIPTION_COURSE_FAILED = "CREATE_DESCRIPTION_COURSE_FAILED";

export function getDescriptionCourse(params, callback) {
    return {
        type: GET_DESCRIPTION_COURSE,
        params,
        callback,
    };
}

export function getDescriptionCourses(params, callback) {
    return {
        type: GET_DESCRIPTION_COURSES,
        params,
        callback,
    };
}

export function filterDescriptionCourses(params, callback) {
    return {
        type: FILTER_DESCRIPTION_COURSES,
        params,
        callback,
    };
}

export function DeleteDescriptionCourse(params, callback) {
    return {
        type: DELETE_DESCRIPTION_COURSE,
        params,
        callback,
    };
}

export function EditDescriptionCourse(params, callback) {
    return {
        type: EDIT_DESCRIPTION_COURSE,
        params,
        callback,
    };
}

export function CreateDescriptionCourse(params, callback) {
    return {
        type: CREATE_DESCRIPTION_COURSE,
        params,
        callback,
    };
}