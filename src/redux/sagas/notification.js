import { notification } from 'antd';
import { call, put, takeEvery } from 'redux-saga/effects';
import config from '../../configs/index';
import { getApi, putApiAuth, deleteApiAuth, getApiAuth, postApiAuth } from '../services/api';
import * as actions from '../actions';
import { get } from 'lodash';

function* fetchNotifications(payload) {
    try {
        let endpoint = `${config.API_URL}/notification`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.notification.GET_NOTIFICATIONS_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.notification.GET_NOTIFICATIONS_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu thông báo đã thất bại ' + messageError),
        });
    }
}

function* fetchNotification(payload) {
    try {
        let endpoint = `${config.API_URL}/notification/${payload.params.id}`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.notification.GET_NOTIFICATION_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.notification.GET_NOTIFICATION_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu thông báo đã thất bại ' + messageError),
        });
    }
}

function* fetchNotificationByUser(payload) {
    try {
        let endpoint = `${config.API_URL}/notification/user`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.notification.GET_NOTIFICATIONS_USER_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.notification.GET_NOTIFICATIONS_USER_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu thông báo đã thất bại ' + messageError),
        });
    }
}

function* changeNotification(payload) {
    try {
        let endpoint = `${config.API_URL}/notification/change-state/${payload.params.id}`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.notification.CHANGE_NOTIFICATION_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.notification.CHANGE_NOTIFICATION_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu thông báo đã thất bại ' + messageError),
        });
    }
}

function* fectchFilter(payload) {
    try {
        let endpoint = `${config.API_URL}/notification/filter?trang_thai=${payload.params.status}&search=${payload.params.search}&ngay_bat_dau=${payload.params.start}&ngay_ket_thuc=${payload.params.end}`;
        const response = yield call(getApi, endpoint);
        const result = yield response.data;
        yield put({ type: actions.notification.FILTER_NOTIFICATIONS_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.notification.FILTER_NOTIFICATIONS_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu thông báo thất bại ' + messageError),
        });
    }
}

function* createNotification(payload) {
    try {
        let endpoint = config.API_URL + 
            `/notification/create?mo_dun_id=${payload.params.idModule}&loai_hoi_dap=${payload.params.type}&chuyen_de_id=${payload.params.idThematic}&de_thi_id=${payload.params.idExam}&phu_trach_id=${payload.params.Teacher}&cau_hoi_so=${payload.params.index}&khoa_hoc_id=${payload.params.idCourse}`;
        endpoint += payload.params.chuyen_tiep ? `&chuyen_tiep=${payload.params.chuyen_tiep}` : ``;
        const response = yield call(postApiAuth, endpoint, payload.params.formData); 
        const result = yield response;
        yield put({ type: actions.notification.CREATE_NOTIFICATION_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.notification.CREATE_NOTIFICATION_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Thêm thông báo mới thất bại ' + messageError),
        });
    }
}

function* editNotification(payload) {
    try {
        let endpoint = config.API_URL + `/notification/${payload.params.idNotification}`;
        const response = yield call(putApiAuth, endpoint, payload.params.formData); 
        const result = yield response;
        yield put({ type: actions.notification.EDIT_NOTIFICATION_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.notification.EDIT_NOTIFICATION_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Cập nhật thông tin thông báo thất bại ' + messageError),
        });
    }
}

function* deleteNotification(payload) {
    try {
        let endpoint = config.API_URL + `/notification/${payload.params.idNote}`;
        const response = yield call(deleteApiAuth, endpoint); 
        const result = yield response;
        yield put({ type: actions.notification.DELETE_NOTIFICATION_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.notification.DELETE_NOTIFICATION_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Xóa thông báo thất bại ' + messageError),
        });
    }
}

export function* loadNotifications() {
    yield takeEvery(actions.notification.GET_NOTIFICATIONS, fetchNotifications);
}

export function* loadNotification() {
    yield takeEvery(actions.notification.GET_NOTIFICATION, fetchNotification);
}

export function* loadAddNotification() {
    yield takeEvery(actions.notification.CREATE_NOTIFICATION, createNotification);
}

export function* loadEditNotification() {
    yield takeEvery(actions.notification.EDIT_NOTIFICATION, editNotification);
}

export function* loadDeleteNotification() {
    yield takeEvery(actions.notification.DELETE_NOTIFICATION, deleteNotification);
}

export function* loadFilterNotification() {
    yield takeEvery(actions.notification.FILTER_NOTIFICATIONS, fectchFilter);
}

export function* loadNotificationsUser() {
    yield takeEvery(actions.notification.GET_NOTIFICATIONS_USER, fetchNotificationByUser);
}

export function* loadChangeNotification() {
    yield takeEvery(actions.notification.CHANGE_NOTIFICATION, changeNotification);
}