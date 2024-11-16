import { notification } from 'antd';
import { call, put, takeEvery } from 'redux-saga/effects';
import config from '../../configs/index';
import { getApiAuth, postApiAuth, putApiAuth, deleteApiAuth } from '../services/api';
import * as actions from '../actions';
import { get } from 'lodash';

function* fetchEvaluations(payload) {
    try {
        let endpoint = `${config.API_URL}/evaluate?de_thi_id=${payload.params.id}&pageIndex=${payload.params.pageIndex}&pageSize=${payload.params.pageSize}`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.evaluate.GET_EVALUATES_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.evaluate.GET_EVALUATES_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu đánh giá đã thất bại ' + messageError),
        });
    }
}

function* fetchEvaluationsDGNL(payload) {
    try {
        let endpoint = `${config.API_URL}/evaluate-dgnl?khoa_hoc_id=${payload.params.idCourse}&pageIndex=${payload.params.pageIndex}&pageSize=${payload.params.pageSize}`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.evaluate.GET_EVALUATES_DGNL_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.evaluate.GET_EVALUATES_DGNL_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu đánh giá đã thất bại ' + messageError),
        });
    }
}


function* fetchEvaluation(payload) {
    try {
        let endpoint = `${config.API_URL}/evaluate/${payload.params.id}`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.evaluate.GET_EVALUATE_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.evaluate.GET_EVALUATE_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu đánh giá đã thất bại ' + messageError),
        });
    }
}

function* fetchEvaluationDGNL(payload) {
    try {
        let endpoint = `${config.API_URL}/evaluate-dgnl/${payload.params.id}`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.evaluate.GET_EVALUATE_DGNL_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.evaluate.GET_EVALUATE_DGNL_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu đánh giá đã thất bại ' + messageError),
        });
    }
}

function* createEvaluation(payload) {
    try {
        let endpoint = config.API_URL + '/evaluate/create';
        const response = yield call(postApiAuth, endpoint, payload.params); 
        const result = yield response;
        yield put({ type: actions.evaluate.CREATE_EVALUATE_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.evaluate.CREATE_EVALUATE_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : error.response.data.message;
        notification.error({
            message: get(error, 'response.data.error', 'Thêm đánh giá mới thất bại: ' + messageError),
        });
    }
}

function* createEvaluationDGNL(payload) {
    try {
        let endpoint = config.API_URL + '/evaluate-dgnl/create';
        const response = yield call(postApiAuth, endpoint, payload.params); 
        const result = yield response;
        yield put({ type: actions.evaluate.CREATE_EVALUATE_DGNL_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.evaluate.CREATE_EVALUATE_DGNL_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : error.response.data.message;
        notification.error({
            message: get(error, 'response.data.error', 'Thêm đánh giá mới thất bại: ' + messageError),
        });
    }
}

function* editEvaluation(payload) {
    try {
        let endpoint = config.API_URL + `/evaluate/${payload.params.id}`;
        const response = yield call(putApiAuth, endpoint, payload.params.formData); 
        const result = yield response;
        yield put({ type: actions.evaluate.EDIT_EVALUATE_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.evaluate.EDIT_EVALUATE_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Cập nhật thông tin đánh giá thất bại ' + messageError),
        });
    }
}

function* editEvaluationDGNL(payload) {
    try {
        let endpoint = config.API_URL + `/evaluate-dgnl/${payload.params.id}`;
        const response = yield call(putApiAuth, endpoint, payload.params.formData); 
        const result = yield response;
        yield put({ type: actions.evaluate.EDIT_EVALUATE_DGNL_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.evaluate.EDIT_EVALUATE_DGNL_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Cập nhật thông tin đánh giá thất bại ' + messageError),
        });
    }
}

function* deleteEvaluation(payload) {
    try {
        let endpoint = config.API_URL + `/evaluate/${payload.params.id}`;
        const response = yield call(deleteApiAuth, endpoint); 
        const result = yield response;
        yield put({ type: actions.evaluate.DELETE_EVALUATE_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.evaluate.DELETE_EVALUATE_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Xóa đánh giá thất bại ' + messageError),
        });
    }
}

function* deleteEvaluationDGNL(payload) {
    try {
        let endpoint = config.API_URL + `/evaluate-dgnl/${payload.params.id}`;
        const response = yield call(deleteApiAuth, endpoint); 
        const result = yield response;
        yield put({ type: actions.evaluate.DELETE_EVALUATE_DGNL_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.evaluate.DELETE_EVALUATE_DGNL_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Xóa đánh giá thất bại ' + messageError),
        });
    }
}

export function* loadEvaluations() {
    yield takeEvery(actions.evaluate.GET_EVALUATES, fetchEvaluations);
}

export function* loadEvaluationsDGNL() {
    yield takeEvery(actions.evaluate.GET_EVALUATES_DGNL, fetchEvaluationsDGNL);
}

export function* loadEvaluation() {
    yield takeEvery(actions.evaluate.GET_EVALUATE, fetchEvaluation);
}

export function* loadEvaluationDGNL() {
    yield takeEvery(actions.evaluate.GET_EVALUATE_DGNL, fetchEvaluationDGNL);
}

export function* loadAddEvaluation() {
    yield takeEvery(actions.evaluate.CREATE_EVALUATE, createEvaluation);
}

export function* loadAddEvaluationDGNL() {
    yield takeEvery(actions.evaluate.CREATE_EVALUATE_DGNL, createEvaluationDGNL);
}

export function* loadEditEvaluation() {
    yield takeEvery(actions.evaluate.EDIT_EVALUATE, editEvaluation);
}

export function* loadEditEvaluationDGNL() {
    yield takeEvery(actions.evaluate.EDIT_EVALUATE_DGNL, editEvaluationDGNL);
}

export function* loadDeleteEvaluation() {
    yield takeEvery(actions.evaluate.DELETE_EVALUATE, deleteEvaluation);
}

export function* loadDeleteEvaluationDGNL() {
    yield takeEvery(actions.evaluate.DELETE_EVALUATE_DGNL, deleteEvaluationDGNL);
}