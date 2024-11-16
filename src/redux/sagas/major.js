import { notification } from 'antd';
import { call, put, takeEvery } from 'redux-saga/effects';
import config from '../../configs/index';
import { getApi, postApiAuth, putApiAuth, deleteApiAuth, getApiAuth } from '../services/api';
import * as actions from '../actions';
import { get } from 'lodash';

function* fetchClasses(payload) {
    try {
        let endpoint = `${config.API_URL}/grade`;
        const response = yield call(getApi, endpoint);
        const result = yield response.data;
        yield put({ type: actions.major.GET_CLASS_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.major.GET_CLASS_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu lớp thất bại ' + messageError),
        });
    }
}

function* fetchMajors(payload) {
    try {
        let endpoint = `${config.API_URL}/major`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.major.GET_MAJORS_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.major.GET_MAJORS_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu chuyên ngành thất bại ' + messageError),
        });
    }
}

function* fetchMajor(payload) {
    try {
        let endpoint = `${config.API_URL}/major/${payload.params.id}`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.major.GET_MAJOR_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.major.GET_MAJOR_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu chuyên ngành thất bại ' + messageError),
        });
    }
}

function* createMajor(payload) {
    try {
        let endpoint = `${config.API_URL}/major/create`;
        const response = yield call(postApiAuth, endpoint, payload.params);
        const result = yield response.data;
        yield put({ type: actions.major.CREATE_MAJOR_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.major.CREATE_MAJOR_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Thêm dữ liệu chuyên ngành thất bại ' + messageError),
        });
    }
}

function* editMajor(payload) {
    try {
        let endpoint = config.API_URL + `/major/${payload.params.id}`;
        const response = yield call(putApiAuth, endpoint, payload.params.formData); 
        const result = yield response;
        yield put({ type: actions.major.EDIT_MAJOR_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.major.EDIT_MAJOR_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Cập nhật thông tin chuyên ngành thất bại ' + messageError),
        });
    }
}


function* deleteMajor(payload) {
    try {
        let endpoint = config.API_URL + `/major/${payload.params.id}/force`;
        const response = yield call(deleteApiAuth, endpoint); 
        const result = yield response;
        yield put({ type: actions.major.DELETE_MAJOR_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.major.DELETE_MAJOR_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Xóa chuyên ngành thất bại ' + messageError),
        });
    }
}

export function* loadClasses() {
    yield takeEvery(actions.major.GET_CLASS, fetchClasses);
}

export function* loadMajors() {
    yield takeEvery(actions.major.GET_MAJORS, fetchMajors);
}

export function* loadMajor() {
    yield takeEvery(actions.major.GET_MAJOR, fetchMajor);
}

export function* loadCreateMajor() {
    yield takeEvery(actions.major.CREATE_MAJOR, createMajor);
}

export function* loadEditMajor() {
    yield takeEvery(actions.major.EDIT_MAJOR, editMajor);
}

export function* loadDeleteMajor() {
    yield takeEvery(actions.major.DELETE_MAJOR, deleteMajor);
}