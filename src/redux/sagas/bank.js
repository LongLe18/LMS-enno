import { notification } from 'antd';
import { call, put, takeEvery } from 'redux-saga/effects';
import config from '../../configs/index';
import { getApi, postApiAuth, putApiAuth, deleteApiAuth } from '../services/api';
import * as actions from '../actions';
import { get } from 'lodash';

function* fetchBanks(payload) {
    try {
        let endpoint = `${config.API_URL}/account_bank`;
        const response = yield call(getApi, endpoint);
        const result = yield response.data;
        yield put({ type: actions.bank.GET_BANKS_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.bank.GET_BANKS_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu ngân hàng đã thất bại ' + messageError),
        });
    }
}

function* fetchBank(payload) {
    try {
        let endpoint = `${config.API_URL}/account_bank/${payload.params.id}`;
        const response = yield call(getApi, endpoint);
        const result = yield response.data;
        yield put({ type: actions.bank.GET_BANK_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.bank.GET_BANK_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu ngân hàng đã thất bại ' + messageError),
        });
    }
}

function* fectchFilter(payload) {
    try {
        let endpoint = `${config.API_URL}/account_bank`;
        const response = yield call(getApi, endpoint);
        const result = yield response.data;
        yield put({ type: actions.bank.FILTER_BANKS_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.bank.FILTER_BANKS_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu ngân hàng thất bại ' + messageError),
        });
    }
}


function* createBank(payload) {
    try {
        let endpoint = config.API_URL + '/account_bank/create';
        const response = yield call(postApiAuth, endpoint, payload.params); 
        const result = yield response;
        yield put({ type: actions.bank.CREATE_BANK_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.bank.CREATE_BANK_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Thêm ngân hàng mới thất bại ' + messageError),
        });
    }
}

function* editBank(payload) {
    try {
        let endpoint = config.API_URL + `/account_bank/${payload.params.id}`;
        const response = yield call(putApiAuth, endpoint, payload.params.formData); 
        const result = yield response;
        yield put({ type: actions.bank.EDIT_BANK_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.bank.EDIT_BANK_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Cập nhật thông tin ngân hàng thất bại ' + messageError),
        });
    }
}

function* deleteBank(payload) {
    try {
        let endpoint = config.API_URL + `/account_bank/${payload.params.id}`;
        const response = yield call(deleteApiAuth, endpoint); 
        const result = yield response;
        yield put({ type: actions.bank.DELETE_BANK_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.bank.DELETE_BANK_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Xóa ngân hàng thất bại ' + messageError),
        });
    }
}

export function* loadBanks() {
    yield takeEvery(actions.bank.GET_BANKS, fetchBanks);
}

export function* loadBank() {
    yield takeEvery(actions.bank.GET_BANK, fetchBank);
}

export function* loadAddBank() {
    yield takeEvery(actions.bank.CREATE_BANK, createBank);
}

export function* loadEditBank() {
    yield takeEvery(actions.bank.EDIT_BANK, editBank);
}

export function* loadDeleteBank() {
    yield takeEvery(actions.bank.DELETE_BANK, deleteBank);
}

export function* loadFilterBank() {
    yield takeEvery(actions.bank.FILTER_BANKS, fectchFilter);
}