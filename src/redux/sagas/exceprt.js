import { notification } from 'antd';
import { call, put, takeEvery } from 'redux-saga/effects';
import config from '../../configs/index';
import { getApiAuth, postApiAuth, putApiAuth, deleteApiAuth } from '../services/api';
import * as actions from '../actions';
import { get } from 'lodash';

function* fetchExcerpts(payload) {
    try {
        let endpoint = `${config.API_URL}/exceprt?pageSize=${payload.params.pageSize}&pageIndex=${payload.params.pageIndex}&trich_doan_id=${payload.params.id}`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.exceprt.GET_EXCEPRTS_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.exceprt.GET_EXCEPRTS_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu trích đoạn đã thất bại ' + messageError),
        });
    }
}

function* fetchExceprt(payload) {
    try {
        let endpoint = `${config.API_URL}/exceprt/${payload.params.id}`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.exceprt.GET_EXCEPRT_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.exceprt.GET_EXCEPRT_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu trích đoạn đã thất bại ' + messageError),
        });
    }
}

function* fectchFilter(payload) {
    try {
        let endpoint = `${config.API_URL}/exceprt`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.exceprt.FILTER_EXCEPRTS_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.exceprt.FILTER_EXCEPRTS_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu trích đoạn thất bại ' + messageError),
        });
    }
}

function* createExceprt(payload) {
    try {
        let endpoint = config.API_URL + '/exceprt/create';
        const response = yield call(postApiAuth, endpoint, payload.params); 
        const result = yield response;
        yield put({ type: actions.exceprt.CREATE_EXCEPRT_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.exceprt.CREATE_EXCEPRT_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Thêm trích đoạn mới thất bại ' + messageError),
        });
    }
}

function* editExceprt(payload) {
    try {
        let endpoint = config.API_URL + `/exceprt/${payload.params.id}`;
        const response = yield call(putApiAuth, endpoint, payload.params.formData); 
        const result = yield response;
        yield put({ type: actions.exceprt.EDIT_EXCEPRT_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.exceprt.EDIT_EXCEPRT_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Cập nhật thông tin trích đoạn thất bại ' + messageError),
        });
    }
}

function* deleteExceprt(payload) {
    try {
        let endpoint = config.API_URL + `/exceprt/${payload.params.id}/force`;
        const response = yield call(deleteApiAuth, endpoint); 
        const result = yield response;
        yield put({ type: actions.exceprt.DELETE_EXCEPRT_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.exceprt.DELETE_EXCEPRT_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Xóa trích đoạn thất bại ' + messageError),
        });
    }
}


export function* loadExceprts() {
    yield takeEvery(actions.exceprt.GET_EXCEPRTS, fetchExcerpts);
}

export function* loadExceprt() {
    yield takeEvery(actions.exceprt.GET_EXCEPRT, fetchExceprt);
}

export function* loadAdExceprt() {
    yield takeEvery(actions.exceprt.CREATE_EXCEPRT, createExceprt);
}

export function* loadEditExceprt() {
    yield takeEvery(actions.exceprt.EDIT_EXCEPRT, editExceprt);
}

export function* loadDeleteExceprt() {
    yield takeEvery(actions.exceprt.DELETE_EXCEPRT, deleteExceprt);
}

export function* loadFilterExceprt() {
    yield takeEvery(actions.exceprt.FILTER_EXCEPRTS, fectchFilter);
}
