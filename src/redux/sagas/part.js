import { notification } from 'antd';
import { call, put, takeEvery } from 'redux-saga/effects';
import config from '../../configs/index';
import { getApi, getApiAuth, postApiAuth, putApiAuth, deleteApiAuth } from '../services/api';
import * as actions from '../actions';
import { get } from 'lodash';

function* fetchModules(payload) {
    try {
        let endpoint = `${config.API_URL}/modun?khoa_hoc_id=&trang_thai=`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.part.GET_MODULES_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.part.GET_MODULES_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu phần học đã thất bại ' + messageError),
        });
    }
}

function* fetchModulesByIdCourse(payload) {
    try {
        let endpoint = `${config.API_URL}/modun?khoa_hoc_id=${payload.params.idCourse}`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.part.GET_MODULES_IDCOURSE_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.part.GET_MODULES_IDCOURSE_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu phần học đã thất bại ' + messageError),
        });
    }
}

function* fetchModulesByIdCourse2(payload) {
    try {
        let endpoint = `${config.API_URL}/modun/v2?khoa_hoc_id=${payload.params.idCourse}`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.part.GET_MODULES_IDCOURSE_2_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.part.GET_MODULES_IDCOURSE_2_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu phần học đã thất bại ' + messageError),
        });
    }
}

function* fetchModule(payload) {
    try {
        let endpoint = `${config.API_URL}/modun/${payload.params.id}`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.part.GET_MODULE_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.part.GET_MODULE_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu phần học đã thất bại ' + messageError),
        });
    }
}

function* fetchFilter(payload) {
    try {
        let endpoint = `${config.API_URL}/modun/filter?khoa_hoc_id=${payload.params.idCourse}&trang_thai=${payload.params.status}&search=${payload.params.search}&ngay_bat_dau=${payload.params.start}&ngay_ket_thuc=${payload.params.end}`;
        const response = yield call(getApi, endpoint);
        const result = yield response.data;
        yield put({ type: actions.part.FILTER_MODULES_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.part.FILTER_MODULES_FALIED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu phần học thất bại ' + messageError),
        });
    }
}

function* createModule(payload) {
    try {
        let endpoint = config.API_URL + '/modun/create';
        const response = yield call(postApiAuth, endpoint, payload.params); 
        const result = yield response;
        yield put({ type: actions.part.CREATE_MODULE_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.part.CREATE_MODULE_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Thêm phần học đã thất bại ' + messageError),
        });
    }
}

function* deleteModule(payload) {
    try {
        let endpoint = config.API_URL + `/modun/${payload.params.idModule}/force`;
        const response = yield call(deleteApiAuth, endpoint); 
        const result = yield response;
        yield put({ type: actions.part.DELETE_MODULE_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.part.DELETE_MODULE_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Xóa phần học thất bại ' + messageError),
        });
    }
}

function* ChangeStatusModule(payload) {
    try {
        let endpoint = config.API_URL + `/modun/${payload.params.idModule}`;
        const response = yield call(deleteApiAuth, endpoint); 
        const result = yield response;
        yield put({ type: actions.part.CHANGE_MODULE_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.part.CHANGE_MODULE_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Chuyển trạng thái phần học thất bại ' + messageError),
        });
    }
}

function* editModule(payload) {
    try {
        let endpoint = config.API_URL + `/modun/${payload.params.idModule}`;
        const response = yield call(putApiAuth, endpoint, payload.params.formData); 
        const result = yield response;
        yield put({ type: actions.part.EDIT_MODULE_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.part.EDIT_MODULE_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Cập nhật thông tin phần học thất bại ' + messageError),
        });
    }
}

export function* loadModules() {
    yield takeEvery(actions.part.GET_MODULES, fetchModules);
}

export function* loadModulesByIdCourse() {
    yield takeEvery(actions.part.GET_MODULES_IDCOURSE, fetchModulesByIdCourse)
}

export function* loadModulesByIdCourse2() {
    yield takeEvery(actions.part.GET_MODULES_IDCOURSE_2, fetchModulesByIdCourse2)
}

export function* loadModule() {
    yield takeEvery(actions.part.GET_MODULE, fetchModule);
}

export function* loadAddModule() {
    yield takeEvery(actions.part.CREATE_MODULE, createModule);
}

export function* loadDeleteModule() {
    yield takeEvery(actions.part.DELETE_MODULE, deleteModule);
}

export function* loadChangeModule() {
    yield takeEvery(actions.part.CHANGE_MODULE, ChangeStatusModule);
}

export function* loadEditModule() {
    yield takeEvery(actions.part.EDIT_MODULE, editModule);
}

export function* loadFilterModule() {
    yield takeEvery(actions.part.FILTER_MODULES, fetchFilter);
}