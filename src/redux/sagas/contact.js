import { notification } from 'antd';
import { call, put, takeEvery } from 'redux-saga/effects';
import config from '../../configs/index';
import { getApi, postApiAuth, putApiAuth, deleteApiAuth } from '../services/api';
import * as actions from '../actions';
import { get } from 'lodash';

function* fetchContacts(payload) {
    try {
        let endpoint = `${config.API_URL}/contact`;
        const response = yield call(getApi, endpoint);
        const result = yield response.data;
        yield put({ type: actions.contact.GET_CONTACTS_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.contact.GET_CONTACTS_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu Liên hệ đã thất bại ' + messageError),
        });
    }
}

function* fetchContact(payload) {
    try {
        let endpoint = `${config.API_URL}/contact/${payload.params.id}`;
        const response = yield call(getApi, endpoint);
        const result = yield response.data;
        yield put({ type: actions.contact.GET_CONTACT_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.contact.GET_CONTACT_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu Liên hệ đã thất bại ' + messageError),
        });
    }
}

function* createContact(payload) {
    try {
        let endpoint = config.API_URL + '/contact/create';
        const response = yield call(postApiAuth, endpoint, payload.params); 
        const result = yield response;
        yield put({ type: actions.contact.CREATE_CONTACT_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.contact.CREATE_CONTACT_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Thêm Liên hệ mới thất bại ' + messageError),
        });
    }
}

function* editContact(payload) {
    try {
        let endpoint = config.API_URL + `/contact/${payload.params.id}`;
        const response = yield call(putApiAuth, endpoint, payload.params.formData); 
        const result = yield response;
        yield put({ type: actions.contact.EDIT_CONTACT_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.contact.EDIT_CONTACT_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Cập nhật thông tin Liên hệ thất bại ' + messageError),
        });
    }
}

function* deleteContact(payload) {
    try {
        let endpoint = config.API_URL + `/contact/${payload.params.id}`;
        const response = yield call(deleteApiAuth, endpoint); 
        const result = yield response;
        yield put({ type: actions.contact.DELETE_CONTACT_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.contact.DELETE_CONTACT_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Xóa Liên hệ thất bại ' + messageError),
        });
    }
}

export function* loadContacts() {
    yield takeEvery(actions.contact.GET_CONTACTS, fetchContacts);
}

export function* loadContact() {
    yield takeEvery(actions.contact.GET_CONTACT, fetchContact);
}

export function* loadAddContact() {
    yield takeEvery(actions.contact.CREATE_CONTACT, createContact);
}

export function* loadEditContact() {
    yield takeEvery(actions.contact.EDIT_CONTACT, editContact);
}

export function* loadDeleteContact() {
    yield takeEvery(actions.contact.DELETE_CONTACT, deleteContact);
}