import { notification } from 'antd';
import { call, put, takeEvery } from 'redux-saga/effects';
import config from '../../configs/index';
import { getApiAuth, postApiAuth, putApiAuth, deleteApiAuth } from '../services/api';
import * as actions from '../actions';
import { get } from 'lodash';

function* fetchTypeExams(payload) {
    try {
        let endpoint = `${config.API_URL}/exam_type`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.typeExam.GET_TYPES_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.typeExam.GET_TYPES_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu loại đề thi đã thất bại ' + messageError),
        });
    }
}

function* fetchTypeExam(payload) {
    try {
        let endpoint = `${config.API_URL}/exam_type/${payload.params.id}`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.typeExam.GET_TYPE_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.typeExam.GET_TYPE_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu đề thi đã thất bại ' + messageError),
        });
    }
}

function* createTypeExam(payload) {
    try {
        let endpoint = config.API_URL + '/exam_type';
        const response = yield call(postApiAuth, endpoint, payload.params); 
        const result = yield response;
        yield put({ type: actions.typeExam.CREATE_TYPE_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.typeExam.CREATE_TYPE_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Thêm đề loại thi mới thất bại ' + messageError),
        });
    }
}

function* editTypeExam(payload) {
    try {
        let endpoint = config.API_URL + `/exam_type/${payload.params.idTypeExam}`;
        const response = yield call(putApiAuth, endpoint, payload.params.formData); 
        const result = yield response;
        yield put({ type: actions.typeExam.EDIT_TYPE_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.typeExam.EDIT_TYPE_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Cập nhật thông tin loại đề thi thất bại ' + messageError),
        });
    }
}

function* deleteTypeExam(payload) {
    try {
        let endpoint = config.API_URL + `/exam_type/${payload.params.idTypeExam}/force`;
        const response = yield call(deleteApiAuth, endpoint); 
        const result = yield response;
        yield put({ type: actions.typeExam.DELETE_TYPE_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.typeExam.DELETE_TYPE_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Xóa loại đề thi thất bại ' + messageError),
        });
    }
}

export function* loadTypeExams() {
    yield takeEvery(actions.typeExam.GET_TYPES, fetchTypeExams);
}

export function* loadTypeExam() {
    yield takeEvery(actions.typeExam.GET_TYPE, fetchTypeExam);
}

export function* loadAddTypeExam() {
    yield takeEvery(actions.typeExam.CREATE_TYPE, createTypeExam);
}

export function* loadEditTypeExam() {
    yield takeEvery(actions.typeExam.EDIT_TYPE, editTypeExam);
}

export function* loadDeleteTypeExam() {
    yield takeEvery(actions.typeExam.DELETE_TYPE, deleteTypeExam);
}
