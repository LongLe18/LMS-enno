export const GET_QUESTION = "GET_QUESTION";
export const GET_QUESTION_SUCCESS = "GET_QUESTION_SUCCESS";
export const GET_QUESTION_FAILED = "GET_QUESTION_FAILED";

export const GET_QUESTIONS = "GET_QUESTIONS";
export const GET_QUESTIONS_SUCCESS = "GET_QUESTIONS_SUCCESS";
export const GET_QUESTIONS_FAILED = "GET_QUESTIONS_FAILED";

export const FILTER_QUESTIONS = "FILTER_QUESTIONS"
export const FILTER_QUESTIONS_SUCCESS = "FILTER_QUESTIONS_SUCCESS";
export const FILTER_QUESTIONS_FAILED = "FILTER_QUESTIONS_FAILED";

export const DELETE_QUESTION = "DELETE_QUESTION";
export const DELETE_QUESTION_SUCCESS = "DELETE_QUESTION_SUCCESS";
export const DELETE_QUESTION_FAILED = "DELETE_QUESTION_FAILED";

export const EDIT_QUESTION = "EDIT_QUESTION";
export const EDIT_QUESTION_SUCCESS = "EDIT_QUESTION_SUCCESS";
export const EDIT_QUESTION_FAILED = "EDIT_QUESTION_FAILED";

export const CREATE_QUESTION = "CREATE_QUESTION";
export const CREATE_QUESTION_SUCCESS = "CREATE_QUESTION_SUCCESS";
export const CREATE_QUESTION_FAILED = "CREATE_QUESTION_FAILED";

////////////// câu hỏi của 1 đề thi
export const GET_QUESTIONS_EXAM = "GET_QUESTIONS_EXAM";
export const GET_QUESTIONS_EXAM_SUCCESS = "GET_QUESTIONS_EXAM_SUCCESS";
export const GET_QUESTIONS_EXAM_FAILED = "GET_QUESTIONS_EXAM_FAILED";

export const GET_QUESTION_EXAM = "GET_QUESTION_EXAM";
export const GET_QUESTION_EXAM_SUCCESS = "GET_QUESTION_EXAM_SUCCESS";
export const GET_QUESTION_EXAM_FAILED = "GET_QUESTION_EXAM_FAILED";

export const CREATE_QUESTION_EXAM = "CREATE_QUESTION_EXAM";
export const CREATE_QUESTION_EXAM_SUCCESS = "CREATE_QUESTION_EXAM_SUCCESS";
export const CREATE_QUESTION_EXAM_FAILED = "CREATE_QUESTION_EXAM_FAILED";

export const EDIT_QUESTION_EXAM = "EDIT_QUESTION_EXAM";
export const EDIT_QUESTION_EXAM_SUCCESS = "EDIT_QUESTION_EXAM_SUCCESS";
export const EDIT_QUESTION_EXAM_FAILED = "EDIT_QUESTION_EXAM_FAILED";

export const DELETE_QUESTION_EXAM = "DELETE_QUESTION_EXAM";
export const DELETE_QUESTION_EXAM_SUCCESS = "DELETE_QUESTION_EXAM_SUCCESS";
export const DELETE_QUESTION_EXAM_FAILED = "DELETE_QUESTION_EXAM_FAILED";

// lấy toàn bộ câu hỏi theo đề thi
export const GET_QUESTIONS_BY_EXAM = "GET_QUESTIONS_BY_EXAM";
export const GET_QUESTIONS_BY_EXAM_SUCCESS = "GET_QUESTIONS_BY_EXAM_SUCCESS";
export const GET_QUESTIONS_BY_EXAM_FAILED = "GET_QUESTIONS_BY_EXAM_FAILED";

export function getQuestion(params, callback) {
    return {
        type: GET_QUESTION,
        params,
        callback,
    };
}

export function getQuestions(params, callback) {
    return {
        type: GET_QUESTIONS,
        params,
        callback,
    };
}

export function getQuestionsByExam(params, callback) {
    return {
        type: GET_QUESTIONS_BY_EXAM,
        params,
        callback,
    };
}

export function filterQuestion(params, callback) {
    return {
        type: FILTER_QUESTIONS,
        params,
        callback,
    };
}

export function createQuestion(params, callback) {
    return {
        type: CREATE_QUESTION,
        params,
        callback,
    };
}

export function editQuestion(params, callback) {
    return {
        type: EDIT_QUESTION,
        params,
        callback,
    };
}

export function deleteQuestion(params, callback) {
    return {
        type: DELETE_QUESTION,
        params,
        callback,
    };
}

export function getQuestionExam(params, callback) {
    return {
        type: GET_QUESTION_EXAM,
        params,
        callback,
    };
}

export function getQuestionsExam(params, callback) {
    return {
        type: GET_QUESTIONS_EXAM,
        params,
        callback,
    };
}

export function createQuestionExam(params, callback) {
    return {
        type: CREATE_QUESTION_EXAM,
        params,
        callback,
    };
}

export function editQuestionExam(params, callback) {
    return {
        type: EDIT_QUESTION_EXAM,
        params,
        callback,
    };
}

export function deleteQuestionExam(params, callback) {
    return {
        type: DELETE_QUESTION_EXAM,
        params,
        callback,
    };
}