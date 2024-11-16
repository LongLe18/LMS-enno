import { notification } from 'antd';
import { call, put, takeEvery } from 'redux-saga/effects';
import config from '../../configs/index';
import { getApiAuth, putApiAuth, postApiAuth, deleteApiAuth } from '../services/api';
import * as actions from '../actions';
import { get } from 'lodash';

//  tài liệu
function* fetchDocs(payload) {
    try {
        let endpoint = `${config.API_URL}/document?trang_thai=${payload.params.status}&loai_tai_lieu_id=${payload.params.typeId}&search=${payload.params.search}&ngay_bat_dau=${payload.params.start}&ngay_ket_thuc=${payload.params.end}`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.document.GET_DOCS_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.document.GET_DOCS_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu tài liệu đã thất bại ' + messageError),
        });
    }
}

function* fetchDoc(payload) {
    try {
        let endpoint = `${config.API_URL}/document/${payload.params.id}`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.document.GET_DOC_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.document.GET_DOC_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu tài liệu đã thất bại ' + messageError),
        });
    }
}

function* changeStatusDoc(payload) {
    try {
        let endpoint = `${config.API_URL}/document/change-state/${payload.params.id}`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.document.CHANGE_DOC_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.document.CHANGE_DOC_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu tài liệu thất bại ' + messageError),
        });
    }
}

function* createDoc(payload) {
    try {
        let endpoint = config.API_URL + '/document/create';
        const response = yield call(postApiAuth, endpoint, payload.params); 
        const result = yield response;
        yield put({ type: actions.document.CREATE_DOC_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.document.CREATE_DOC_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Thêm tài liệu mới thất bại ' + messageError),
        });
    }
}

function* editDoc(payload) {
    try {
        let endpoint = config.API_URL + `/document/${payload.params.id}`;
        const response = yield call(putApiAuth, endpoint, payload.params.formData); 
        const result = yield response;
        yield put({ type: actions.document.EDIT_DOC_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.document.EDIT_DOC_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Cập nhật thông tin  tài liệu thất bại ' + messageError),
        });
    }
}

function* deleteDoc(payload) {
    try {
        let endpoint = config.API_URL + `/document/${payload.params.id}`;
        const response = yield call(deleteApiAuth, endpoint); 
        const result = yield response;
        yield put({ type: actions.document.DELETE_DOC_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.document.DELETE_DOC_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Xóa  tài liệu thất bại ' + messageError),
        });
    }
}

/////////////////////////////////////////////////
//////////////////////////////////////////////
export function* loadDocs() {
    yield takeEvery(actions.document.GET_DOCS, fetchDocs);
}

export function* loadDoc() {
    yield takeEvery(actions.document.GET_DOC, fetchDoc);
}

export function* loadAddDoc() {
    yield takeEvery(actions.document.CREATE_DOC, createDoc);
}

export function* loadEditDoc() {
    yield takeEvery(actions.document.EDIT_DOC, editDoc);
}

export function* loadDeleteDoc() {
    yield takeEvery(actions.document.DELETE_DOC, deleteDoc);
}

export function* loadChangeStatusDoc() {
    yield takeEvery(actions.document.CHANGE_DOC, changeStatusDoc);
}
