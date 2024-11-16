import { notification } from 'antd';
import { call, put, takeEvery } from 'redux-saga/effects';
import config from '../../configs/index';
import { putApiAuth, postApiAuth, getApiAuth, deleteApiAuth } from '../services/api';
import * as actions from '../actions';
import { get } from 'lodash';

function* fetchReceipts(payload) {
    try {
        let endpoint = `${config.API_URL}/invoice?trang_thai=${payload.params.status}&ngay_bat_dau=${payload.params.start}&ngay_ket_thuc=${payload.params.end}&search=${payload.params.search}`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.receipt.GET_RECEIPTS_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.receipt.GET_RECEIPTS_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu hóa đơn đã thất bại ' + messageError),
        });
    }
}

function* fetchReceipt(payload) {
    try {
        let endpoint = `${config.API_URL}/invoice/${payload.params.id}`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.receipt.GET_RECEIPT_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.receipt.GET_RECEIPT_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu hóa đơn đã thất bại ' + messageError),
        });
    }
}

function* createReceipt(payload) {
    try {
        let endpoint = config.API_URL + '/invoice/create';
        const response = yield call(postApiAuth, endpoint, payload.params); 
        const result = yield response;
        yield put({ type: actions.receipt.CREATE_RECEIPT_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.receipt.CREATE_RECEIPT_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Thêm hóa đơn mới thất bại ' + messageError),
        });
    }
}

function* editReceipt(payload) {
    try {
        let endpoint = config.API_URL + `/invoice/${payload.params.id}`;
        const response = yield call(putApiAuth, endpoint, payload.params.formData); 
        const result = yield response;
        yield put({ type: actions.receipt.EDIT_RECEIPT_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.receipt.EDIT_RECEIPT_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Cập nhật thông tin hóa đơn thất bại ' + messageError),
        });
    }
}

function* deleteReceipt(payload) {
    try {
        let endpoint = config.API_URL + `/invoice/${payload.params.id}`;
        const response = yield call(deleteApiAuth, endpoint); 
        const result = yield response;
        yield put({ type: actions.receipt.DELETE_RECEIPT_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.receipt.DELETE_RECEIPT_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Xóa hóa đơn thất bại ' + messageError),
        });
    }
}

function* changeStatusReceipt(payload) {
    try {
        let endpoint = config.API_URL + `/invoice/state-change/${payload.params.id}`;
        const response = yield call(putApiAuth, endpoint, payload.params.formData); 
        const result = yield response;
        yield put({ type: actions.receipt.CHANGE_RECEIPT_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.receipt.CHANGE_RECEIPT_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Xử lý hóa đơn thất bại ' + messageError),
        });
    }
}

function* fetchReceiptsDetail(payload) {
    try {
        let endpoint = `${config.API_URL}/detailed_invoice/?loai_san_pham=${payload.params.idType}`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.receipt.GET_RECEIPTS_DETAIL_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.receipt.GET_RECEIPTS_DETAIL_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu hóa đơn đã thất bại ' + messageError),
        });
    }
}

function* fetchReceiptDetail(payload) {
    try {
        let endpoint = `${config.API_URL}/detailed_invoice/${payload.params.id}`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.receipt.GET_RECEIPT_DETAIL_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.receipt.GET_RECEIPT_DETAIL_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu hóa đơn đã thất bại ' + messageError),
        });
    }
}

function* createReceiptDetail(payload) {
    try {
        let endpoint = `${config.API_URL}/detailed_invoice/create`;
        const response = yield call(postApiAuth, endpoint, payload.params);
        const result = yield response.data;
        yield put({ type: actions.receipt.CREATE_RECEIPT_DETAIL_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.receipt.CREATE_RECEIPT_DETAIL_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Thêm hóa đơn mới đã thất bại ' + messageError),
        });
    }
}

function* editReceiptDetail(payload) {
    try {
        let endpoint = config.API_URL + `/detailed_invoice/${payload.params.id}`;
        const response = yield call(putApiAuth, endpoint, payload.params.formData); 
        const result = yield response;
        yield put({ type: actions.receipt.EDIT_RECEIPT_DETAIL_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.receipt.EDIT_RECEIPT_DETAIL_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Cập nhật thông tin hóa đơn thất bại ' + messageError),
        });
    }
}

function* fetchReceiptsUser(payload) {
    try {
        let endpoint = `${config.API_URL}/detailed_invoice/by_user?trang_thai=${payload.params.status}`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.receipt.GET_RECEIPTS_USER_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.receipt.GET_RECEIPTS_USER_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu hóa đơn đã thất bại ' + messageError),
        });
    }
}

function* deleteReceiptDetail(payload) {
    try {
        let endpoint = config.API_URL + `/detailed_invoice/${payload.params.id}`;
        const response = yield call(deleteApiAuth, endpoint); 
        const result = yield response;
        yield put({ type: actions.receipt.DELETE_RECEIPT_DETAIL_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.receipt.DELETE_RECEIPT_DETAIL_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Xóa hóa đơn thất bại ' + messageError),
        });
    }
}

function* fetchDetailReceiptsUser(payload) {
    try {
        let endpoint = `${config.API_URL}/detailed_invoice/by_TxnRef/${payload.params.code}`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.receipt.GET_RECEIPT_DETAIL_USER_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.receipt.GET_RECEIPT_DETAIL_USER_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu hóa đơn đã thất bại ' + messageError),
        });
    }
}

export function* loadReceipts() {
    yield takeEvery(actions.receipt.GET_RECEIPTS, fetchReceipts);
}

export function* loadReceipt() {
    yield takeEvery(actions.receipt.GET_RECEIPT, fetchReceipt);
}

export function* loadAddReceipt() {
    yield takeEvery(actions.receipt.CREATE_RECEIPT, createReceipt);
}

export function* loadEditReceipt() {
    yield takeEvery(actions.receipt.EDIT_RECEIPT, editReceipt);
}

export function* loadDeleteReceipt() {
    yield takeEvery(actions.receipt.DELETE_RECEIPT, deleteReceipt);
}

export function* loadChangeStatusReceipt() {
    yield takeEvery(actions.receipt.CHANGE_RECEIPT, changeStatusReceipt);
}

////////////////
export function* loadReceiptsuser() {
    yield takeEvery(actions.receipt.GET_RECEIPTS_USER, fetchReceiptsUser);
}

export function* loadReceiptsDetail() {
    yield takeEvery(actions.receipt.GET_RECEIPTS_DETAIL, fetchReceiptsDetail);
}

export function* loadReceiptDetailUser() {
    yield takeEvery(actions.receipt.GET_RECEIPT_DETAIL_USER, fetchDetailReceiptsUser);
}

export function* loadReceiptDetail() {
    yield takeEvery(actions.receipt.GET_RECEIPT_DETAIL, fetchReceiptDetail);
}

export function* loadAddReceiptDetail() {
    yield takeEvery(actions.receipt.CREATE_RECEIPT_DETAIL, createReceiptDetail);
}

export function* loadEditReceiptDetail() {
    yield takeEvery(actions.receipt.EDIT_RECEIPT_DETAIL, editReceiptDetail);
}

export function* loadDeleteReceiptDetail() {
    yield takeEvery(actions.receipt.DELETE_RECEIPT_DETAIL, deleteReceiptDetail);
}