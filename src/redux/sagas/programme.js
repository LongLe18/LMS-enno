import { notification } from 'antd';
import { call, put, takeEvery } from 'redux-saga/effects';
import config from '../../configs/index';
import { getApi, postApiAuth, putApiAuth, getApiAuth, deleteApiAuth } from '../services/api';
import * as actions from '../actions';
import { get } from 'lodash';

function* fetchProgrammes(payload) {
    try {
        let endpoint = `${config.API_URL}/program?trang_thai=${payload.params.status}`;
        const response = yield call(getApi, endpoint);
        const result = yield response.data;
        yield put({ type: actions.programme.GET_PROGRAMMES_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.programme.GET_PROGRAMMES_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu Khung chương trình thất bại ' + messageError),
        });
    }
}

function* fetchProgramme(payload) {
    try {
        let endpoint = `${config.API_URL}/program/${payload.params.id}`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.programme.GET_PROGRAMME_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.programme.GET_PROGRAMME_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu Khung chương trình thất bại ' + messageError),
        });
    }
}

function* createProgramme(payload) {
    try {
        let endpoint = config.API_URL + '/program/create';
        const response = yield call(postApiAuth, endpoint, payload.params); 
        const result = yield response;
        yield put({ type: actions.programme.CREATE_PROGRAMME_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.programme.CREATE_PROGRAMME_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Thêm khung chương trình mới thất bại ' + messageError),
        });
    }
}

function* editProgramme(payload) {
    try {
        let endpoint = config.API_URL + `/program/${payload.params.id}`;
        const response = yield call(putApiAuth, endpoint, payload.params.formData); 
        const result = yield response;
        yield put({ type: actions.programme.EDIT_PROGRAMME_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.programme.EDIT_PROGRAMME_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Cập nhật thông tin khung chương trình thất bại ' + messageError),
        });
    }
}

function* deleteProgramme(payload) {
    try {
        let endpoint = config.API_URL + `/program/${payload.params.id}`;
        const response = yield call(deleteApiAuth, endpoint); 
        const result = yield response;
        yield put({ type: actions.programme.DELETE_PROGRAMME_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.programme.DELETE_PROGRAMME_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Xóa khung chương trình thất bại ' + messageError),
        });
    }
}

// lấy tất nhóm khoa học theo khung chương trình
function* fetchProgrammeCourses(payload) {
    try {
        let endpoint = `${config.API_URL}/course/by-program`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.programme.GET_PROGRAMME_COURSES_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.programme.GET_PROGRAMME_COURSES_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu menu thất bại ' + messageError),
        });
    }
}

export function* loadProgrammes() {
    yield takeEvery(actions.programme.GET_PROGRAMMES, fetchProgrammes);
}

export function* loadProgramme() {
    yield takeEvery(actions.programme.GET_PROGRAMME, fetchProgramme);
}

export function* loadAddProgramme() {
    yield takeEvery(actions.programme.CREATE_PROGRAMME, createProgramme);
}

export function* loadEditProgramme() {
    yield takeEvery(actions.programme.EDIT_PROGRAMME, editProgramme);
}

export function* loadDeleteProgramme() {
    yield takeEvery(actions.programme.DELETE_PROGRAMME, deleteProgramme);
}

export function* loadProgrammeCourses() {
    yield takeEvery(actions.programme.GET_PROGRAMME_COURSES, fetchProgrammeCourses);
}