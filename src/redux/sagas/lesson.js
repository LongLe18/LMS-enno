import { notification } from 'antd';
import { call, put, takeEvery } from 'redux-saga/effects';
import config from '../../configs/index';
import { getApiAuth, postApiAuth, deleteApiAuth, putApiAuth } from '../services/api';
import * as actions from '../actions';
import { get } from 'lodash';

function* fetchLessions(payload) {
    try {
        let endpoint = `${config.API_URL}/lesson/all`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.lesson.GET_LESSONS_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.lesson.GET_LESSONS_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu bài giảng thất bại ' + messageError),
        });
    }
}

function* fetchLessionByIdThematic(payload) {
    try {
        let endpoint = `${config.API_URL}/lesson?id=${payload.params.idThematic}&khoa_hoc_id=${payload.params.idCourse}&mo_dun_id=${payload.params.idModule}`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.lesson.GET_LESSON_IDTHE_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.lesson.GET_LESSON_IDTHE_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : error.response.data.message;
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu bài giảng thất bại: ' + messageError),
        });
    }
}

function* fectchFilter(payload) {
    try {
        let endpoint = `${config.API_URL}/lesson/filter?khoa_hoc_id=${payload.params.idCourse}&mo_dun_id=${payload.params.idModule}&chuyen_de_id=${payload.params.idThematic}&trang_thai=${payload.params.status}&search=${payload.params.search}&ngay_bat_dau=${payload.params.start}&ngay_ket_thuc=${payload.params.end}`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.lesson.FILTER_LESSONS_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.lesson.FILTER_LESSONS_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu bài giảng thất bại ' + messageError),
        });
    }
}

function* fetchLessionById(payload) {
    try {
        let endpoint = `${config.API_URL}/lesson/${payload.params.id}/edit`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.lesson.GET_LESSON_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.lesson.GET_LESSON_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu bài giảng thất bại ' + messageError),
        });
    }
}

function* createLesson(payload) {
    try {
        let endpoint = config.API_URL + '/lesson/create';
        const response = yield call(postApiAuth, endpoint, payload.params); 
        const result = yield response;
        yield put({ type: actions.lesson.CREATE_LESSON_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.lesson.CREATE_LESSON_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Thêm bài giảng mới đã thất bại ' + messageError),
        });
    }
}

function* deleteLesson(payload) {
    try {
        let endpoint = config.API_URL + `/lesson/${payload.params.idLesson}/force`;
        const response = yield call(deleteApiAuth, endpoint); 
        const result = yield response;
        yield put({ type: actions.lesson.DELETE_LESSON_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.lesson.DELETE_LESSON_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Xóa bài giảng thất bại ' + messageError),
        });
    }
}

function* editLesson(payload) {
    try {
        let endpoint = config.API_URL + `/lesson/${payload.params.idLesson}`;
        const response = yield call(putApiAuth, endpoint, payload.params.formData); 
        const result = yield response;
        yield put({ type: actions.lesson.EDIT_LESSON_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.lesson.EDIT_LESSON_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Cập nhật thông tin bài giảng thất bại ' + messageError),
        });
    }
}

export function* loadLessons() {
    yield takeEvery(actions.lesson.GET_LESSONS, fetchLessions);
}

export function* loadLesson() {
    yield takeEvery(actions.lesson.GET_LESSON_IDTHE, fetchLessionByIdThematic);
}

export function* loadLessonById() {
    yield takeEvery(actions.lesson.GET_LESSON, fetchLessionById);
}

export function* loadAddLesson() {
    yield takeEvery(actions.lesson.CREATE_LESSON, createLesson);
}

export function* loadDeleteLesson() {
    yield takeEvery(actions.lesson.DELETE_LESSON, deleteLesson);
}

export function* loadEditLesson() {
    yield takeEvery(actions.lesson.EDIT_LESSON, editLesson);
}

export function* loadFilter() {
    yield takeEvery(actions.lesson.FILTER_LESSONS, fectchFilter);
}