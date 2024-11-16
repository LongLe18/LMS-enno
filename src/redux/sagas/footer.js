import { notification } from 'antd';
import { call, put, takeEvery } from 'redux-saga/effects';
import config from '../../configs/index';
import { getApi, deleteApiAuth, putApiAuth, postApiAuth } from '../services/api';
import * as actions from '../actions';
import { get } from 'lodash';

function* fetchFooters(payload) {
    try {
        let endpoint = `${config.API_URL}/footer`;
        const response = yield call(getApi, endpoint);
        const result = yield response.data;
        yield put({ type: actions.footer.GET_FOOTERS_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.footer.GET_FOOTERS_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu footer đã thất bại ' + messageError),
        });
    }
}

function* fetchFooter(payload) {
    try {
        let endpoint = `${config.API_URL}/footer/${payload.params.id}`;
        const response = yield call(getApi, endpoint);
        const result = yield response.data;
        yield put({ type: actions.footer.GET_FOOTER_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.footer.GET_FOOTER_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu footer đã thất bại ' + messageError),
        });
    }
}

function* createFooter(payload) {
    try {
        let endpoint = config.API_URL + '/footer/create';
        const response = yield call(postApiAuth, endpoint, payload.params); 
        const result = yield response;
        yield put({ type: actions.footer.CREATE_FOOTER_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.footer.CREATE_FOOTER_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Thêm footer mới thất bại ' + messageError),
        });
    }
}

function* editFooter(payload) {
    try {
        let endpoint = config.API_URL + `/footer/${payload.params.id}`;
        const response = yield call(putApiAuth, endpoint, payload.params.formData); 
        const result = yield response;
        yield put({ type: actions.footer.EDIT_FOOTER_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.footer.EDIT_FOOTER_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Cập nhật thông tin footer thất bại ' + messageError),
        });
    }
}

function* deleteFooter(payload) {
    try {
        let endpoint = config.API_URL + `/footer/${payload.params.id}`;
        const response = yield call(deleteApiAuth, endpoint); 
        const result = yield response;
        yield put({ type: actions.footer.DELETE_FOOTER_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.footer.DELETE_FOOTER_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Xóa footer thất bại ' + messageError),
        });
    }
}

export function* loadFooters() {
    yield takeEvery(actions.footer.GET_FOOTERS, fetchFooters);
}

export function* loadFooter() {
    yield takeEvery(actions.footer.GET_FOOTER, fetchFooter);
}

export function* loadAddFooter() {
    yield takeEvery(actions.footer.CREATE_FOOTER, createFooter);
}

export function* loadEditFooter() {
    yield takeEvery(actions.footer.EDIT_FOOTER, editFooter);
}

export function* loadDeleteFooter() {
    yield takeEvery(actions.footer.DELETE_FOOTER, deleteFooter);
}