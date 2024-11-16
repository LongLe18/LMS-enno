import { notification } from 'antd';
import { call, put, takeEvery } from 'redux-saga/effects';
import config from '../../configs/index';
import { getApiAuth, postApiAuth, putApiAuth, deleteApiAuth } from '../services/api';
import * as actions from '../actions';
import { get } from 'lodash';

function* fetchDealers(payload) {
    try {
        let endpoint = `${config.API_URL}/dealer_discount?ten_giao_vien=${payload.params.name}&khoa_hoc_id=${payload.params.idCourse}`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.dealer.GET_DEALERS_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.dealer.GET_DEALERS_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu chiết khấu đã thất bại ' + messageError),
        });
    }
}

function* fetchDealersTeacher(payload) {
    try {
        let endpoint = `${config.API_URL}/teacher/dealers`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.dealer.GET_DEALERS_TEACHER_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.dealer.GET_DEALERS_TEACHER_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu chiết khấu đã thất bại ' + messageError),
        });
    }
}

function* fetchDealer(payload) {
    try {
        let endpoint = `${config.API_URL}/dealer_discount/${payload.params.id}`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.dealer.GET_DEALER_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.dealer.GET_DEALER_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu chiết khấu đã thất bại ' + messageError),
        });
    }
}

function* fetchDealer2(payload) {
    try {
        let endpoint = `${config.API_URL}/dealer_discount/${payload.params.id}/v2`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.dealer.GET_DEALER2_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.dealer.GET_DEALER2_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu chiết khấu đã thất bại ' + messageError),
        });
    }
}

function* createDealer(payload) {
    try {
        let endpoint = config.API_URL + '/dealer_discount/create';
        const response = yield call(postApiAuth, endpoint, payload.params); 
        const result = yield response;
        yield put({ type: actions.dealer.CREATE_DEALER_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.dealer.CREATE_DEALER_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Thêm chiết khấu mới thất bại ' + messageError),
        });
    }
}

function* editDealer(payload) {
    try {
        let endpoint = config.API_URL + `/dealer_discount/${payload.params.id}`;
        const response = yield call(putApiAuth, endpoint, payload.params.formData); 
        const result = yield response;
        yield put({ type: actions.dealer.EDIT_DEALER_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.dealer.EDIT_DEALER_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Cập nhật thông tin chiết khấu thất bại ' + messageError),
        });
    }
}

function* deleteDealer(payload) {
    try {
        let endpoint = config.API_URL + `/dealer_discount/${payload.params.id}`;
        const response = yield call(deleteApiAuth, endpoint); 
        const result = yield response;
        yield put({ type: actions.dealer.DELETE_DEALER_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.dealer.DELETE_DEALER_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Xóa chiết khấu thất bại ' + messageError),
        });
    }
}

function* changeStatusDealer(payload) {
    try {
        let endpoint = config.API_URL + `/dealer_discount/state_change/${payload.params.id}`;
        const response = yield call(getApiAuth, endpoint); 
        const result = yield response;
        yield put({ type: actions.dealer.CHANGE_DEALER_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.dealer.CHANGE_DEALER_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Xóa chiết khấu thất bại ' + messageError),
        });
    }
}

function* fetchDealersDetail(payload) {
    try {
        let endpoint = `${config.API_URL}/detailed_discount?trang_thai_su_dung=${payload.params.status}`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.dealer.GET_DEALERS_DETAIL_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.dealer.GET_DEALERS_DETAIL_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu chiết khấu đã thất bại ' + messageError),
        });
    }
}

function* fetchDealersDetailTeacher(payload) {
    try {
        let endpoint = `${config.API_URL}/dealer_discount/by_dealer/${payload.params.id}?trang_thai=${payload.params.status}&ngay_bat_dau=${payload.params.start}&ngay_ket_thuc=${payload.params.end}&search=${payload.params.search}`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.dealer.GET_DEALERS_DETAIL_TEACHER_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.dealer.GET_DEALERS_DETAIL_TEACHER_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu chiết khấu đã thất bại ' + messageError),
        });
    }
}

function* fetchDealerDetail(payload) {
    try {
        let endpoint = `${config.API_URL}/detailed_discount/${payload.params.id}`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.dealer.GET_DEALER_DETAIL_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.dealer.GET_DEALER_DETAIL_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu chiết khấu đã thất bại ' + messageError),
        });
    }
}

function* createDealerDetail(payload) {
    try {
        let endpoint = `${config.API_URL}/detailed_discount/create`;
        const response = yield call(postApiAuth, endpoint, payload.params);
        const result = yield response.data;
        yield put({ type: actions.dealer.CREATE_DEALER_DETAIL_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.dealer.CREATE_DEALER_DETAIL_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Thêm chiết khấu mới đã thất bại ' + messageError),
        });
    }
}

function* editDealerDetail(payload) {
    try {
        let endpoint = config.API_URL + `/detailed_discount/${payload.params.id}`;
        const response = yield call(putApiAuth, endpoint, payload.params.formData); 
        const result = yield response;
        yield put({ type: actions.dealer.EDIT_DEALER_DETAIL_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.dealer.EDIT_DEALER_DETAIL_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Cập nhật thông tin chiết khấu thất bại ' + messageError),
        });
    }
}

function* deleteDealerDetail(payload) {
    try {
        let endpoint = config.API_URL + `/detailed_discount/${payload.params.id}`;
        const response = yield call(deleteApiAuth, endpoint); 
        const result = yield response;
        yield put({ type: actions.dealer.DELETE_DEALER_DETAIL_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.dealer.DELETE_DEALER_DETAIL_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Xóa chiết khấu thất bại ' + messageError),
        });
    }
}

function* deleteDealersDetail(payload) {
    try {
        let endpoint = config.API_URL + `/detailed_discount/delete/list`;
        const response = yield call(postApiAuth, endpoint, payload.params); 
        const result = yield response;
        yield put({ type: actions.dealer.DELETE_DEALERS_DETAIL_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.dealer.DELETE_DEALERS_DETAIL_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Xóa chiết khấu thất bại ' + messageError),
        });
    }
}

function* checkCodeDealer(payload) {
    try {
        let endpoint = config.API_URL + `/detailed_discount/check-code?chiet_khau_ma=${payload.params.code}&khoa_hoc_id=${payload.params.idCourse}`;
        const response = yield call(getApiAuth, endpoint); 
        const result = yield response;
        yield put({ type: actions.dealer.CHECK_CODE_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.dealer.CHECK_CODE_FAILED, error: error });
        notification.error({
            message: get(error, 'response.data.error', 'Mã không tồn tại hoặc đã được sử dụng'),
        });
    }
}

function* changeStatusDealersDetail(payload) {
    try {
        let endpoint = `${config.API_URL}/detailed_discount/change-state`;
        const response = yield call(postApiAuth, endpoint, payload.params);
        const result = yield response.data;
        yield put({ type: actions.dealer.CHANGE_DEALER_DETAIL_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.dealer.CHANGE_DEALER_DETAIL_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Quyết toán thất bại ' + messageError),
        });
    }
}

export function* loadDealers() {
    yield takeEvery(actions.dealer.GET_DEALERS, fetchDealers);
}

export function* loadDealersTeacher() {
    yield takeEvery(actions.dealer.GET_DEALERS_TEACHER, fetchDealersTeacher);
}

export function* loadDealer() {
    yield takeEvery(actions.dealer.GET_DEALER, fetchDealer);
}

export function* loadDealer2() {
    yield takeEvery(actions.dealer.GET_DEALER2, fetchDealer2);
}

export function* loadAddDealer() {
    yield takeEvery(actions.dealer.CREATE_DEALER, createDealer);
}

export function* loadEditDealer() {
    yield takeEvery(actions.dealer.EDIT_DEALER, editDealer);
}

export function* loadDeleteDealer() {
    yield takeEvery(actions.dealer.DELETE_DEALER, deleteDealer);
}

export function* loadChangeStatusDealer() {
    yield takeEvery(actions.dealer.CHANGE_DEALER, changeStatusDealer);
}

////////////////
export function* loadDealersDetail() {
    yield takeEvery(actions.dealer.GET_DEALERS_DETAIL, fetchDealersDetail);
}

export function* loadDealersDetailTeacher() {
    yield takeEvery(actions.dealer.GET_DEALERS_DETAIL_TEACHER, fetchDealersDetailTeacher);
}

export function* loadDealerDetail() {
    yield takeEvery(actions.dealer.GET_DEALER_DETAIL, fetchDealerDetail);
}

export function* loadAddDealerDetail() {
    yield takeEvery(actions.dealer.CREATE_DEALER_DETAIL, createDealerDetail);
}

export function* loadEditDetail() {
    yield takeEvery(actions.dealer.EDIT_DEALER_DETAIL, editDealerDetail);
}

export function* loadDeleteDealerDetail() {
    yield takeEvery(actions.dealer.DELETE_DEALER_DETAIL, deleteDealerDetail);
}

export function* loadDeleteDealersDetail() {
    yield takeEvery(actions.dealer.DELETE_DEALERS_DETAIL, deleteDealersDetail);
}

export function* loadCheckCodeDealer() {
    yield takeEvery(actions.dealer.CHECK_CODE, checkCodeDealer);
}

export function* loadChangeStatusDealersDetail() {
    yield takeEvery(actions.dealer.CHANGE_DEALER_DETAIL, changeStatusDealersDetail);
}