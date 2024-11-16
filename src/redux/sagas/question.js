import { notification } from 'antd';
import { call, put, takeEvery } from 'redux-saga/effects';
import config from '../../configs/index';
import { getApiAuth, postApiAuth, putApiAuth, deleteApiAuth } from '../services/api';
import * as actions from '../actions';
import { get } from 'lodash';

function* fetchQuestions(payload) {
    try {
        let endpoint = `${config.API_URL}/question?pageIndex=${payload.params.pageIndex}&pageSize=${payload.params.pageSize}&chuyen_nganh_id=${payload.params.chuyen_nganh_id}&kct_id=${payload.params.kct_id}`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.quesiton.GET_QUESTIONS_SUCCESS, result: result });
        if (payload.callback) { 
            payload.callback(result);
        }
    } catch (error) {
        console.log(error)
        yield put({ type: actions.quesiton.GET_QUESTIONS_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu câu hỏi đã thất bại ' + messageError),
        });
    }
}

function* fetchQuestion(payload) {
    try {
        let endpoint = `${config.API_URL}/question/${payload.params.id}`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.quesiton.GET_QUESTION_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.quesiton.GET_QUESTION_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu câu hỏi đã thất bại ' + messageError),
        });
    }
}

function* fectchFilter(payload) {
    try {
        let endpoint = `${config.API_URL}/question/all_admin?khoa_hoc_id=${payload.params.idCourse}&mo_dun_id=${payload.params.idModule}&chuyen_de_id=${payload.params.idThematic}&loai_cau_hoi=${payload.params.idType}&ngay_bat_dau=${payload.params.start}&ngay_ket_thuc=${payload.params.end}`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.quesiton.FILTER_QUESTIONS_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.quesiton.FILTER_QUESTIONS_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu câu hỏi thất bại ' + messageError),
        });
    }
}

function* createQuestion(payload) {
    try {
        let endpoint = config.API_URL + '/question/create';
        const response = yield call(postApiAuth, endpoint, payload.params); 
        const result = yield response;
        yield put({ type: actions.quesiton.CREATE_QUESTION_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.quesiton.CREATE_QUESTION_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Thêm câu hỏi mới thất bại ' + messageError),
        });
    }
}

function* editQuestion(payload) {
    try {
        let endpoint = config.API_URL + `/question/${payload.params.idQuestion}?de_thi_id=${payload.params.de_thi_id}`;
        const response = yield call(putApiAuth, endpoint, payload.params.formData); 
        const result = yield response;
        yield put({ type: actions.quesiton.EDIT_QUESTION_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.quesiton.EDIT_QUESTION_FAILED, error: error });
        let messageError = (error.response && error.response.status && error.response.status === 403) ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Cập nhật thông tin câu hỏi thất bại ' + messageError),
        });
    }
}

function* deleteQuestion(payload) {
    try {
        let endpoint = config.API_URL + `/question/${payload.params.idQuestion}/force`;
        const response = yield call(deleteApiAuth, endpoint); 
        const result = yield response;
        yield put({ type: actions.quesiton.DELETE_QUESTION_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.quesiton.DELETE_QUESTION_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Xóa câu hỏi thất bại ' + messageError),
        });
    }
}

// câu hỏi trong 1 đề thi
function* fetchQuestionsExam(payload) {
    try {
        let endpoint = `${config.API_URL}/exam_question?cau_hoi_id=${payload.params.idQuestion}&de_thi_id=${payload.params.idExam}`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.quesiton.GET_QUESTIONS_EXAM_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.quesiton.GET_QUESTIONS_EXAM_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu câu hỏi đã thất bại ' + messageError),
        });
    }
}

function* fetchQuestionExam(payload) {
    try {
        let endpoint = `${config.API_URL}/exam_question/${payload.params.idQuestion}`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.quesiton.GET_QUESTION_EXAM_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.quesiton.GET_QUESTION_EXAM_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu câu hỏi đã thất bại ' + messageError),
        });
    }
}

function* fetchQuestionsByExam(payload) {
    try {
        let endpoint = `${config.API_URL}/question/getByExam?de_thi_id=${payload.params.idExam}`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.quesiton.GET_QUESTIONS_BY_EXAM_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.quesiton.GET_QUESTIONS_BY_EXAM_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu câu hỏi đã thất bại ' + messageError),
        });
    }
}

function* createQuestionExam(payload) {
    try {
        let endpoint = config.API_URL + '/exam_question/create';
        const response = yield call(postApiAuth, endpoint, payload.params); 
        const result = yield response;
        yield put({ type: actions.quesiton.CREATE_QUESTION_EXAM_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.quesiton.CREATE_QUESTION_EXAM_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Thêm câu hỏi mới thất bại ' + messageError),
        });
    }
}

function* deleteQuestionExam(payload) {
    try {
        let endpoint = config.API_URL + `/exam_question/${payload.params.idQuestion}/force`;
        const response = yield call(deleteApiAuth, endpoint); 
        const result = yield response;
        yield put({ type: actions.quesiton.DELETE_QUESTION_EXAM_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.quesiton.DELETE_QUESTION_EXAM_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Xóa câu hỏi thất bại ' + messageError),
        });
    }
}

export function* loadQuestions() {
    yield takeEvery(actions.quesiton.GET_QUESTIONS, fetchQuestions);
}

export function* loadQuestion() {
    yield takeEvery(actions.quesiton.GET_QUESTION, fetchQuestion);
}

export function* loadAddQuestion() {
    yield takeEvery(actions.quesiton.CREATE_QUESTION, createQuestion);
}

export function* loadEditQuestion() {
    yield takeEvery(actions.quesiton.EDIT_QUESTION, editQuestion);
}

export function* loadDeleteQuestion() {
    yield takeEvery(actions.quesiton.DELETE_QUESTION, deleteQuestion);
}

export function* loadFilterQuestion() {
    yield takeEvery(actions.quesiton.FILTER_QUESTIONS, fectchFilter);
}

export function* loadGetQuestionsExam() {
    yield takeEvery(actions.quesiton.GET_QUESTIONS_EXAM, fetchQuestionsExam);
}

export function* loadGetQuestionsByExam() {
    yield takeEvery(actions.quesiton.GET_QUESTIONS_BY_EXAM, fetchQuestionsByExam);
}

export function* loadGetQuestionExam() {
    yield takeEvery(actions.quesiton.GET_QUESTION_EXAM, fetchQuestionExam);
}

export function* loadAddQuestionExam() {
    yield takeEvery(actions.quesiton.CREATE_QUESTION_EXAM, createQuestionExam);
}

export function* loadDeleteQuestionExam() {
    yield takeEvery(actions.quesiton.DELETE_QUESTION_EXAM, deleteQuestionExam);
}