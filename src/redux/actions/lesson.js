export const GET_LESSON = "GET_LESSON";
export const GET_LESSON_SUCCESS = "GET_LESSON_SUCCESS";
export const GET_LESSON_FAILED = "GET_LESSON_FAILED";

export const GET_LESSON_IDTHE = "GET_LESSON_IDTHE";
export const GET_LESSON_IDTHE_SUCCESS = "GET_LESSONID_IDTHE_SUCCESS";
export const GET_LESSON_IDTHE_FAILED = "GET_LESSONID_IDTHE_FAILED";

export const GET_LESSONS = "GET_LESSONS";
export const GET_LESSONS_SUCCESS = "GET_LESSONS_SUCCESS";
export const GET_LESSONS_FAILED = "GET_LESSONS_FAILED";

export const FILTER_LESSONS = "FILTER_LESSONS";
export const FILTER_LESSONS_SUCCESS = "FILTER_LESSONS_SUCCESS";
export const FILTER_LESSONS_FAILED = "FILTER_LESSONS_FAILED";

export const DELETE_LESSON = "DELETE_LESSON";
export const DELETE_LESSON_SUCCESS = "DELETE_LESSON_SUCCESS";
export const DELETE_LESSON_FAILED = "DELETE_LESSON_FAILED";

export const EDIT_LESSON = "EDIT_LESSON";
export const EDIT_LESSON_SUCCESS = "EDIT_LESSON_SUCCESS";
export const EDIT_LESSON_FAILED = "EDIT_LESSON_FAILED";

export const CREATE_LESSON = "CREATE_LESSON";
export const CREATE_LESSON_SUCCESS = "CREATE_LESSON_SUCCESS";
export const CREATE_LESSON_FAILED = "CREATE_LESSON_FAILED";

export function getLesson(params, callback) {
    return {
        type: GET_LESSON,
        params,
        callback,
    };
}

export function getLessonByIdThe(params, callback) {
    return {
        type: GET_LESSON_IDTHE,
        params,
        callback,
    };
}

export function getLessons(params, callback) {
    return {
        type: GET_LESSONS,
        params,
        callback,
    };
}

export function filterLessons(params, callback) {
    return {
        type: FILTER_LESSONS,
        params,
        callback,
    };
}

export function DeleteLesson(params, callback) {
    return {
        type: DELETE_LESSON,
        params,
        callback,
    };
}

export function EditLesson(params, callback) {
    return {
        type: EDIT_LESSON,
        params,
        callback,
    };
}

export function CreateLesson(params, callback) {
    return {
        type: CREATE_LESSON,
        params,
        callback,
    };
}