import { notification } from 'antd';
import { call, put, takeEvery } from 'redux-saga/effects';
import config from '../../configs/index';
import { getApi, deleteApiAuth, putApiAuth, postApiAuth, getApiAuth } from '../services/api';
import * as actions from '../actions';
import { get } from 'lodash';

// QUảng cáo tài liệu
function* fetchAdsDocs(payload) {
    try {
        let endpoint = `${config.API_URL}/document_ad?trang_thai=${payload.params.status}`;
        const response = yield call(getApi, endpoint);
        const result = yield response.data;
        yield put({ type: actions.advertise.GET_ADSDOCS_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.advertise.GET_ADSDOCS_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu quảng cáo tài liệu đã thất bại ' + messageError),
        });
    }
}

function* fetchAdsDoc(payload) {
    try {
        let endpoint = `${config.API_URL}/document_ad/${payload.params.id}`;
        const response = yield call(getApi, endpoint);
        const result = yield response.data;
        yield put({ type: actions.advertise.GET_ADSDOC_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.advertise.GET_ADSDOC_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu quảng cáo tài liệu đã thất bại ' + messageError),
        });
    }
}

function* changeStatusAdsDoc(payload) {
    try {
        let endpoint = `${config.API_URL}/document_ad/change-state/${payload.params.id}`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.advertise.CHANGE_ADSDOC_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.advertise.CHANGE_ADSDOC_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu quảng cáo tài liệu thất bại ' + messageError),
        });
    }
}

function* createAdsDoc(payload) {
    try {
        let endpoint = config.API_URL + '/document_ad/create';
        const response = yield call(postApiAuth, endpoint, payload.params); 
        const result = yield response;
        yield put({ type: actions.advertise.CREATE_ADSDOC_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.advertise.CREATE_ADSDOC_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Thêm quảng cáo tài liệu mới thất bại ' + messageError),
        });
    }
}

function* editAdsDoc(payload) {
    try {
        let endpoint = config.API_URL + `/document_ad/${payload.params.id}`;
        const response = yield call(putApiAuth, endpoint, payload.params.formData); 
        const result = yield response;
        yield put({ type: actions.advertise.EDIT_ADSDOC_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.advertise.EDIT_ADSDOC_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Cập nhật thông tin quảng cáo tài liệu thất bại ' + messageError),
        });
    }
}

function* deleteAdsDoc(payload) {
    try {
        let endpoint = config.API_URL + `/document_ad/${payload.params.id}`;
        const response = yield call(deleteApiAuth, endpoint); 
        const result = yield response;
        yield put({ type: actions.advertise.DELETE_ADSDOC_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.advertise.DELETE_ADSDOC_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Xóa quảng cáo tài liệu thất bại ' + messageError),
        });
    }
}

////////////////////////////////////////////////////////////
////////// Quảng cáo khoá học
function* fetchAdsCourses(payload) {
    try {
        let endpoint = `${config.API_URL}/course_ad?trang_thai=${payload.params.status}`;
        const response = yield call(getApi, endpoint);
        const result = yield response.data;
        yield put({ type: actions.advertise.GET_ADSCOURSES_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.advertise.GET_ADSCOURSES_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu quảng cáo khóa học đã thất bại ' + messageError),
        });
    }
}

function* fetchAdsCourse(payload) {
    try {
        let endpoint = `${config.API_URL}/course_ad/${payload.params.id}`;
        const response = yield call(getApi, endpoint);
        const result = yield response.data;
        yield put({ type: actions.advertise.GET_ADSCOURSE_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.advertise.GET_ADSCOURSE_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu quảng cáo khóa học đã thất bại ' + messageError),
        });
    }
}

function* changeStatusAdsCourse(payload) {
    try {
        let endpoint = `${config.API_URL}/course_ad/change-state/${payload.params.id}`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.advertise.CHANGE_ADSCOURSE_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.advertise.CHANGE_ADSCOURSE_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu quảng cáo khóa học thất bại ' + messageError),
        });
    }
}

function* createAdsCourse(payload) {
    try {
        let endpoint = config.API_URL + '/course_ad/create';
        const response = yield call(postApiAuth, endpoint, payload.params); 
        const result = yield response;
        yield put({ type: actions.advertise.CREATE_ADSCOURSE_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.advertise.CREATE_ADSCOURSE_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Thêm quảng cáo khóa học mới thất bại ' + messageError),
        });
    }
}

function* editAdsCourse(payload) {
    try {
        let endpoint = config.API_URL + `/course_ad/${payload.params.id}`;
        const response = yield call(putApiAuth, endpoint, payload.params.formData); 
        const result = yield response;
        yield put({ type: actions.advertise.EDIT_ADSCOURSE_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.advertise.EDIT_ADSCOURSE_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Cập nhật thông tin quảng cáo khóa học thất bại ' + messageError),
        });
    }
}

function* deleteAdsCourse(payload) {
    try {
        let endpoint = config.API_URL + `/course_ad/${payload.params.id}`;
        const response = yield call(deleteApiAuth, endpoint); 
        const result = yield response;
        yield put({ type: actions.advertise.DELETE_ADSCOURSE_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.advertise.DELETE_ADSCOURSE_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Xóa quảng cáo khóa học thất bại ' + messageError),
        });
    }
}

////////////////////////////////////////////////////////////
////////// Quảng cáo giáo viên
function* fetchAdsTeachers(payload) {
    try {
        let endpoint = `${config.API_URL}/teachercourse_ad`;
        const response = yield call(getApi, endpoint);
        const result = yield response.data;
        yield put({ type: actions.advertise.GET_ADSTEACHERS_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.advertise.GET_ADSTEACHERS_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu quảng cáo giáo viên đã thất bại ' + messageError),
        });
    }
}

function* fetchAdsTeacher(payload) {
    try {
        let endpoint = `${config.API_URL}/teachercourse_ad/${payload.params.id}`;
        const response = yield call(getApi, endpoint);
        const result = yield response.data;
        yield put({ type: actions.advertise.GET_ADSTEACHER_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.advertise.GET_ADSTEACHER_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu quảng cáo giáo viên đã thất bại ' + messageError),
        });
    }
}

function* changeStatusAdsTeacher(payload) {
    try {
        let endpoint = `${config.API_URL}/teachercourse_ad/change-state/${payload.params.id}`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.advertise.CHANGE_ADSTEACHER_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.advertise.CHANGE_ADSTEACHER_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu quảng cáo giáo viên thất bại ' + messageError),
        });
    }
}

function* createAdsTeacher(payload) {
    try {
        let endpoint = config.API_URL + '/teachercourse_ad/create';
        const response = yield call(postApiAuth, endpoint, payload.params); 
        const result = yield response;
        yield put({ type: actions.advertise.CREATE_ADSTEACHER_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.advertise.CREATE_ADSTEACHER_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Thêm quảng cáo giáo viên mới thất bại ' + messageError),
        });
    }
}

function* editAdsTeacher(payload) {
    try {
        let endpoint = config.API_URL + `/teachercourse_ad/${payload.params.id}`;
        const response = yield call(putApiAuth, endpoint, payload.params.formData); 
        const result = yield response;
        yield put({ type: actions.advertise.EDIT_ADSTEACHER_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.advertise.EDIT_ADSTEACHER_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Cập nhật thông tin quảng cáo giáo viên thất bại ' + messageError),
        });
    }
}

function* deleteAdsTeacher(payload) {
    try {
        let endpoint = config.API_URL + `/teachercourse_ad/${payload.params.id}`;
        const response = yield call(deleteApiAuth, endpoint); 
        const result = yield response;
        yield put({ type: actions.advertise.DELETE_ADSTEACHER_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.advertise.DELETE_ADSTEACHER_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Xóa quảng cáo giáo viên thất bại ' + messageError),
        });
    }
}

/////////////////////////////////////////////////
//////////////////////////////////////////////
export function* loadAdsDocs() {
    yield takeEvery(actions.advertise.GET_ADSDOCS, fetchAdsDocs);
}

export function* loadAdsDoc() {
    yield takeEvery(actions.advertise.GET_ADSDOC, fetchAdsDoc);
}

export function* loadAddAdsDoc() {
    yield takeEvery(actions.advertise.CREATE_ADSDOC, createAdsDoc);
}

export function* loadEditAdsDoc() {
    yield takeEvery(actions.advertise.EDIT_ADSDOC, editAdsDoc);
}

export function* loadDeleteAdsDoc() {
    yield takeEvery(actions.advertise.DELETE_ADSDOC, deleteAdsDoc);
}

export function* loadChangeStatusAdsDoc() {
    yield takeEvery(actions.advertise.CHANGE_ADSDOC, changeStatusAdsDoc);
}

/////////////////////////////////////////////////////
export function* loadAdsCourses() {
    yield takeEvery(actions.advertise.GET_ADSCOURSES, fetchAdsCourses);
}

export function* loadAdsCourse() {
    yield takeEvery(actions.advertise.GET_ADSCOURSE, fetchAdsCourse);
}

export function* loadAddAdsCourse() {
    yield takeEvery(actions.advertise.CREATE_ADSCOURSE, createAdsCourse);
}

export function* loadEditAdsCourse() {
    yield takeEvery(actions.advertise.EDIT_ADSCOURSE, editAdsCourse);
}

export function* loadDeleteAdsCourse() {
    yield takeEvery(actions.advertise.DELETE_ADSCOURSE, deleteAdsCourse);
}

export function* loadChangeStatusAdsCourse() {
    yield takeEvery(actions.advertise.CHANGE_ADSCOURSE, changeStatusAdsCourse);
}

/////////////////////////////////////////////////////
export function* loadAdsTeachers() {
    yield takeEvery(actions.advertise.GET_ADSTEACHERS, fetchAdsTeachers);
}

export function* loadAdsTeacher() {
    yield takeEvery(actions.advertise.GET_ADSTEACHER, fetchAdsTeacher);
}

export function* loadAddAdsTeacher() {
    yield takeEvery(actions.advertise.CREATE_ADSTEACHER, createAdsTeacher);
}

export function* loadEditAdsTeacher() {
    yield takeEvery(actions.advertise.EDIT_ADSTEACHER, editAdsTeacher);
}

export function* loadDeleteAdsTeacher() {
    yield takeEvery(actions.advertise.DELETE_ADSTEACHER, deleteAdsTeacher);
}

export function* loadChangeStatusAdsTeacher() {
    yield takeEvery(actions.advertise.CHANGE_ADSTEACHER, changeStatusAdsTeacher);
}