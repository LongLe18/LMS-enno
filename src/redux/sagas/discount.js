import { notification } from 'antd';
import { call, put, takeEvery } from 'redux-saga/effects';
import config from '../../configs/index';
import { getApi, getApiAuth, postApiAuth, putApiAuth, deleteApiAuth } from '../services/api';
import * as actions from '../actions';
import { get } from 'lodash';

function* fetchDiscounts(payload) {
    try {
        let endpoint = `${config.API_URL}/discount_code?trang_thai=${payload.params.status}&khoa_hoc_id=${payload.params.idCourse}`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.discount.GET_DISCOUNTS_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.discount.GET_DISCOUNTS_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu khuyến mãi đã thất bại ' + messageError),
        });
    }
}

function* fetchDiscount(payload) {
    try {
        let endpoint = `${config.API_URL}/discount_code/${payload.params.id}`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.discount.GET_DISCOUNT_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.discount.GET_DISCOUNT_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu khuyến mãi đã thất bại ' + messageError),
        });
    }
}

function* fetchDiscountByCourse(payload) {
    try {
        let endpoint = `${config.API_URL}/discount_code/by_course/${payload.params.idCourse}`;
        const response = yield call(getApi, endpoint);
        const result = yield response.data;
        yield put({ type: actions.discount.GET_DISCOUNTS_BYCOURSE_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.discount.GET_DISCOUNTS_BYCOURSE_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu khuyến mãi thất bại ' + messageError),
        });
    }
}


function* createDiscount(payload) {
    try {
        let endpoint = config.API_URL + '/discount_code/create';
        const response = yield call(postApiAuth, endpoint, payload.params); 
        const result = yield response;
        yield put({ type: actions.discount.CREATE_DISCOUNT_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.discount.CREATE_DISCOUNT_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Thêm khuyến mãi mới thất bại ' + messageError),
        });
    }
}

function* editDiscount(payload) {
    try {
        let endpoint = config.API_URL + `/discount_code/${payload.params.id}`;
        const response = yield call(putApiAuth, endpoint, payload.params.formData); 
        const result = yield response;
        yield put({ type: actions.discount.EDIT_DISCOUNT_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.discount.EDIT_DISCOUNT_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Cập nhật thông tin khuyến mãi thất bại ' + messageError),
        });
    }
}

function* deleteDiscount(payload) {
    try {
        let endpoint = config.API_URL + `/discount_code/${payload.params.id}`;
        const response = yield call(deleteApiAuth, endpoint); 
        const result = yield response;
        yield put({ type: actions.discount.DELETE_DISCOUNT_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.discount.DELETE_DISCOUNT_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Xóa khuyến mãi thất bại ' + messageError),
        });
    }
}

function* changeStatusDiscount(payload) {
    try {
        let endpoint = config.API_URL + `/discount_code/state_change/${payload.params.id}`;
        const response = yield call(getApiAuth, endpoint); 
        const result = yield response;
        yield put({ type: actions.discount.CHANGE_DISCOUNT_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.discount.CHANGE_DISCOUNT_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Xóa khuyến mãi thất bại ' + messageError),
        });
    }
}

export function* loadDiscounts() {
    yield takeEvery(actions.discount.GET_DISCOUNTS, fetchDiscounts);
}

export function* loadDiscount() {
    yield takeEvery(actions.discount.GET_DISCOUNT, fetchDiscount);
}

export function* loadAddDiscount() {
    yield takeEvery(actions.discount.CREATE_DISCOUNT, createDiscount);
}

export function* loadEditDiscount() {
    yield takeEvery(actions.discount.EDIT_DISCOUNT, editDiscount);
}

export function* loadDeleteDiscount() {
    yield takeEvery(actions.discount.DELETE_DISCOUNT, deleteDiscount);
}

export function* loadDiscountByCourse() {
    yield takeEvery(actions.discount.GET_DISCOUNTS_BYCOURSE, fetchDiscountByCourse);
}

export function* loadChangeStatusDiscount() {
    yield takeEvery(actions.discount.CHANGE_DISCOUNT, changeStatusDiscount);
}