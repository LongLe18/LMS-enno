import { notification } from 'antd';
import { call, put, takeEvery } from 'redux-saga/effects';
import config from '../../configs/index';
import { getApi, getApiAuth, postApiAuth, putApiAuth, deleteApiAuth } from '../services/api';
import * as actions from '../actions';
import { get } from 'lodash';

function* fetchAnswers(payload) {
    try {
        let endpoint = `${config.API_URL}/answer?cau_hoi_id=${payload.params.id}`;
        const response = yield call(getApi, endpoint);
        const result = yield response.data;
        yield put({ type: actions.answer.GET_ANSWERS_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.answer.GET_ANSWERS_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu đáp án đã thất bại ' + messageError),
        });
    }
}

function* fetchAnswer(payload) {
    try {
        let endpoint = `${config.API_URL}/answer/${payload.params.id}`;
        const response = yield call(getApi, endpoint);
        const result = yield response.data;
        yield put({ type: actions.answer.GET_ANSWER_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.answer.GET_ANSWER_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu đáp án đã thất bại ' + messageError),
        });
    }
}

function* fectchFilter(payload) {
    try {
        let endpoint = `${config.API_URL}/answer?cau_hoi_id=${payload.params.id}`;
        const response = yield call(getApi, endpoint);
        const result = yield response.data;
        yield put({ type: actions.answer.FILTER_ANSWERS_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.answer.FILTER_ANSWERS_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu đáp án thất bại ' + messageError),
        });
    }
}

function* createAnswer(payload) {
    try {
        let endpoint = config.API_URL + '/answer/create';
        const response = yield call(postApiAuth, endpoint, payload.params); 
        const result = yield response;
        yield put({ type: actions.answer.CREATE_ANSWER_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.answer.CREATE_ANSWER_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Thêm đáp án mới thất bại ' + messageError),
        });
    }
}

function* editAnswer(payload) {
    try {
        let endpoint = config.API_URL + `/answer?de_thi_id=${payload.params.de_thi_id}`;
        const response = yield call(putApiAuth, endpoint, payload.params.formData); 
        const result = yield response;
        yield put({ type: actions.answer.EDIT_ANSWER_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.answer.EDIT_ANSWER_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Cập nhật thông tin đáp án thất bại ' + messageError),
        });
    }
}

function* deleteAnswer(payload) {
    try {
        let endpoint = config.API_URL + `/answer/${payload.params.id}/force`;
        const response = yield call(deleteApiAuth, endpoint); 
        const result = yield response;
        yield put({ type: actions.answer.DELETE_ANSWER_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.answer.DELETE_ANSWER_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Xóa đáp án thất bại ' + messageError),
        });
    }
}

function* fetchAnswerUser(payload) {
    try {
        let endpoint = `${config.API_URL}/selected_answer/${payload.params.id}`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.answer.GET_ANSWER_USER_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.answer.GET_ANSWER_USER_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu đáp án đã thất bại ' + messageError),
        });
    }
}

function* fetchAnswersUser(payload) {
    try {
        let endpoint = `${config.API_URL}/selected_answer?dthv_id=${payload.params.idDeThi}&cau_hoi_id=${payload.params.idQuestion}`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.answer.GET_ANSWERS_USER_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.answer.GET_ANSWERS_USER_FAILED, error: error });
        console.log(error);
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu đáp án đã thất bại ' + messageError),
        });
    }
}

function* createAnswerUser(payload) {
    try {
        let endpoint = config.API_URL + '/selected_answer/create';
        const response = yield call(postApiAuth, endpoint, payload.params); 
        const result = yield response;
        yield put({ type: actions.answer.CREATE_ANSWER_USER_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.answer.CREATE_ANSWER_USER_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Thêm đáp án mới thất bại ' + messageError),
        });
    }
}

function* editAnswerUser(payload) {
    try {
        let endpoint = config.API_URL + `/selected_answer/${payload.params.id}`;
        const response = yield call(putApiAuth, endpoint, payload.params.formData); 
        const result = yield response;
        yield put({ type: actions.answer.EDIT_ANSWER_USER_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.answer.EDIT_ANSWER_USER_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Cập nhật thông tin đáp án thất bại ' + messageError),
        });
    }
}

function* deleteAnswerUser(payload) {
    try {
        let endpoint = config.API_URL + `/selected_answer/${payload.params.id}/force`;
        const response = yield call(deleteApiAuth, endpoint); 
        const result = yield response;
        yield put({ type: actions.answer.DELETE_ANSWER_USER_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.answer.DELETE_ANSWER_USER_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Xóa đáp án thất bại ' + messageError),
        });
    }
}

function* deleteAnswerByQuestion(payload) {
    try {
        let endpoint = config.API_URL + `/answer/${payload.params.id}`;
        const response = yield call(deleteApiAuth, endpoint); 
        const result = yield response;
        yield put({ type: actions.answer.DELETE_ANSWER_BY_QUESTION_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.answer.DELETE_ANSWER_BY_QUESTION_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Xóa đáp án thất bại ' + messageError),
        });
    }
}

export function* loadAnswers() {
    yield takeEvery(actions.answer.GET_ANSWERS, fetchAnswers);
}

export function* loadAnswer() {
    yield takeEvery(actions.answer.GET_ANSWER, fetchAnswer);
}

export function* loadAdAnswer() {
    yield takeEvery(actions.answer.CREATE_ANSWER, createAnswer);
}

export function* loadEditAnswer() {
    yield takeEvery(actions.answer.EDIT_ANSWER, editAnswer);
}

export function* loadDeleteAnswer() {
    yield takeEvery(actions.answer.DELETE_ANSWER, deleteAnswer);
}

export function* loadFilterAnswer() {
    yield takeEvery(actions.answer.FILTER_ANSWERS, fectchFilter);
}

export function* loadAnswerUser() {
    yield takeEvery(actions.answer.GET_ANSWER_USER, fetchAnswerUser);
}

export function* loadAnswersUser() {
    yield takeEvery(actions.answer.GET_ANSWERS_USER, fetchAnswersUser);
}

export function* loadCreateAnswerUser() {
    yield takeEvery(actions.answer.CREATE_ANSWER_USER, createAnswerUser);
}

export function* loadEditAnswerUser() {
    yield takeEvery(actions.answer.EDIT_ANSWER_USER, editAnswerUser);
}

export function* loadDeleteAnswerUser() {
    yield takeEvery(actions.answer.DELETE_ANSWER_USER, deleteAnswerUser);
}

export function* loadDeleteAnswerByQuestion() {
    yield takeEvery(actions.answer.DELETE_ANSWER_BY_QUESTION, deleteAnswerByQuestion);
}