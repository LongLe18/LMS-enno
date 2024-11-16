import { notification } from 'antd';
import { call, put, takeEvery } from 'redux-saga/effects';
import config from '../../configs/index';
import { getApi, getApiAuth, postApiAuth, putApiAuth, deleteApiAuth } from '../services/api';
import * as actions from '../actions';
import { get } from 'lodash';

function* fetchMenus(payload) {
    try {
        let endpoint = `${config.API_URL}/menu`;
        const response = yield call(getApi, endpoint);
        const result = yield response.data;
        yield put({ type: actions.menu.GET_MENUS_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.menu.GET_MENUS_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu menu đã thất bại ' + messageError),
        });
    }
}

function* fetchMenu(payload) {
    try {
        let endpoint = `${config.API_URL}/menu/${payload.params.id}`;
        const response = yield call(getApi, endpoint);
        const result = yield response.data;
        yield put({ type: actions.menu.GET_MENU_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.menu.GET_MENU_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu menu đã thất bại ' + messageError),
        });
    }
}

function* fectchTypeMenu(payload) {
    try {
        let endpoint = `${config.API_URL}/menu_type`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.menu.GET_TYPES_MENU_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.menu.GET_TYPES_MENU_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu menu thất bại ' + messageError),
        });
    }
}


function* createMenu(payload) {
    try {
        let endpoint = config.API_URL + '/menu/create';
        const response = yield call(postApiAuth, endpoint, payload.params); 
        const result = yield response;
        yield put({ type: actions.menu.CREATE_MENU_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.menu.CREATE_MENU_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Thêm menu mới thất bại ' + messageError),
        });
    }
}

function* editMenu(payload) {
    try {
        let endpoint = config.API_URL + `/menu/${payload.params.id}`;
        const response = yield call(putApiAuth, endpoint, payload.params.formData); 
        const result = yield response;
        yield put({ type: actions.menu.EDIT_MENU_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.menu.EDIT_MENU_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Cập nhật menu thất bại ' + messageError),
        });
    }
}

function* deleteMenu(payload) {
    try {
        let endpoint = config.API_URL + `/menu/${payload.params.id}`;
        const response = yield call(deleteApiAuth, endpoint); 
        const result = yield response;
        yield put({ type: actions.menu.DELETE_MENU_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.menu.DELETE_MENU_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Xóa menu thất bại ' + messageError),
        });
    }
}

export function* loadMenus() {
    yield takeEvery(actions.menu.GET_MENUS, fetchMenus);
}

export function* loadMenu() {
    yield takeEvery(actions.menu.GET_MENU, fetchMenu);
}

export function* loadAddMenu() {
    yield takeEvery(actions.menu.CREATE_MENU, createMenu);
}

export function* loadEditMenu() {
    yield takeEvery(actions.menu.EDIT_MENU, editMenu);
}

export function* loadDeleteMenu() {
    yield takeEvery(actions.menu.DELETE_MENU, deleteMenu);
}

export function* loadFilterMenu() {
    yield takeEvery(actions.menu.GET_TYPES_MENU, fectchTypeMenu);
}