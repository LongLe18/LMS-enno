import { notification } from 'antd';
import { call, put, takeEvery } from 'redux-saga/effects';
import config from '../../configs/index';
import { getApi, getApiAuth, postApiAuth, putApiAuth, deleteApiAuth } from '../services/api';
import * as actions from '../actions';
import { get } from 'lodash';

function* fetchThematics(payload) {
    try {
        let endpoint = `${config.API_URL}/thematic/all`;
        const response = yield call(getApi, endpoint);
        const result = yield response.data;
        yield put({ type: actions.thematic.GET_THEMATICS_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.thematic.GET_THEMATICS_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu chuyên đề đã thất bại ' + messageError),
        });
    }
}

function* fetchThematicsByIdModule(payload) {
    try {
        let endpoint = `${config.API_URL}/thematic?id=${payload.params.idModule}`;
        const response = yield call(getApi, endpoint);
        const result = yield response.data;
        yield put({ type: actions.thematic.GET_THEMATICS_IDMODULE_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.thematic.GET_THEMATICS_IDMODULE_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu chuyên đề đã thất bại ' + messageError),
        });
    }
}

function* filterThematics(payload) {
    try {
        let endpoint = `${config.API_URL}/thematic/filter?khoa_hoc_id=${payload.params.idCourse}&mo_dun_id=${payload.params.idModule}&trang_thai=${payload.params.status}&search=${payload.params.search}&ngay_bat_dau=${payload.params.start}&ngay_ket_thuc=${payload.params.end}`;;
        const response = yield call(getApi, endpoint);
        const result = yield response.data;
        yield put({ type: actions.thematic.FILTER_THEMATICS_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.thematic.FILTER_THEMATICS_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu chuyên đề đã thất bại ' + messageError),
        });
    }
}

function* fetchThematic(payload) {
    try {
        let endpoint = `${config.API_URL}/thematic/${payload.params.id}/edit`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.thematic.GET_THEMATIC_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.thematic.GET_THEMATIC_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu chuyên đề đã thất bại ' + messageError),
        });
    }
}

function* createThematic(payload) {
    try {
        let endpoint = config.API_URL + '/thematic/create';
        const response = yield call(postApiAuth, endpoint, payload.params); 
        const result = yield response;
        yield put({ type: actions.thematic.CREATE_THEMATIC_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.thematic.CREATE_THEMATIC_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Thêm chuyên đề mới thất bại ' + messageError),
        });
    }
}

function* deleteThematic(payload) {
    try {
        let endpoint = config.API_URL + `/thematic/${payload.params.idThematic}/force`;
        const response = yield call(deleteApiAuth, endpoint); 
        const result = yield response;
        yield put({ type: actions.thematic.DELETE_THEMATIC_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.thematic.DELETE_THEMATIC_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Xóa chuyên đề thất bại ' + messageError),
        });
    }
}

function* EditThemactic(payload) {
    try {
        let endpoint = config.API_URL + `/thematic/${payload.params.idThematic}`;
        const response = yield call(putApiAuth, endpoint, payload.params.formData); 
        const result = yield response;
        yield put({ type: actions.thematic.EDIT_THEMATIC_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.thematic.EDIT_THEMATIC_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Cập nhật chuyên đề thất bại ' + messageError),
        });
    }
}

export function* loadThematics() {
    yield takeEvery(actions.thematic.GET_THEMATICS, fetchThematics);
}

export function* loadThematicsByIdModule() {
    yield takeEvery(actions.thematic.GET_THEMATICS_IDMODULE, fetchThematicsByIdModule);
}

export function* loadThematic() {
    yield takeEvery(actions.thematic.GET_THEMATIC, fetchThematic);
}

export function* loadAddThematic() {
    yield takeEvery(actions.thematic.CREATE_THEMATIC, createThematic);
}

export function* loadDeleteThematic() {
    yield takeEvery(actions.thematic.DELETE_THEMATIC, deleteThematic);
}

export function* loadEditThematic() {
    yield takeEvery(actions.thematic.EDIT_THEMATIC, EditThemactic);
}

export function* loadFilterThematic() {
    yield takeEvery(actions.thematic.FILTER_THEMATICS, filterThematics);
}