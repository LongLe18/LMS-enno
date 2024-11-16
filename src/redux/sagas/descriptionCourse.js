import { notification } from 'antd';
import { call, put, takeEvery } from 'redux-saga/effects';
import config from '../../configs/index';
import { getApi, postApiAuth, putApiAuth, deleteApiAuth } from '../services/api';
import * as actions from '../actions';
import { get } from 'lodash';

function* fetchDescriptionCourses(payload) {
    try {
        let endpoint = `${config.API_URL}/course_description?pageSize=${payload.params.pageSize}&pageIndex=${payload.params.pageIndex}&kct_id=${payload.params.kct_id}`;
        const response = yield call(getApi, endpoint);
        const result = yield response.data;
        yield put({ type: actions.description.GET_DESCRIPTION_COURSES_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.description.GET_DESCRIPTION_COURSES_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu khóa học đã thất bại ' + messageError),
        });
    }
}

function* fetchDescriptionCourse(payload) {
    try {
        let endpoint = `${config.API_URL}/course_description/${payload.params.id}`;
        const response = yield call(getApi, endpoint);
        const result = yield response.data;
        yield put({ type: actions.description.GET_DESCRIPTION_COURSE_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.description.GET_DESCRIPTION_COURSE_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu khóa học đã thất bại ' + messageError),
        });
    }
}

function* createDescriptionCourse(payload) {
    try {
        let endpoint = config.API_URL + '/course_description/create';
        const response = yield call(postApiAuth, endpoint, payload.params); 
        const result = yield response;
        yield put({ type: actions.description.CREATE_DESCRIPTION_COURSE_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.description.CREATE_DESCRIPTION_COURSE_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Thêm mô tả khóa học mới thất bại: Mô tả khoá học này đã tồn tại ' + messageError),
        });
    }
}

function* editDescriptionCourse(payload) {
    try {
        let endpoint = config.API_URL + `/course_description/${payload.params.idCourse}`;
        const response = yield call(putApiAuth, endpoint, payload.params.formData); 
        const result = yield response;
        yield put({ type: actions.description.EDIT_DESCRIPTION_COURSE_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.description.EDIT_DESCRIPTION_COURSE_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Cập nhật thông tin khóa học thất bại ' + messageError),
        });
    }
}

function* deleteDescriptionCourse(payload) {
    try {
        let endpoint = config.API_URL + `/course_description/${payload.params.idLesson}`;
        const response = yield call(deleteApiAuth, endpoint); 
        const result = yield response;
        yield put({ type: actions.description.DELETE_DESCRIPTION_COURSE_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.description.DELETE_DESCRIPTION_COURSE_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Xóa khóa học thất bại ' + messageError),
        });
    }
}

export function* loadDescriptionCourses() {
    yield takeEvery(actions.description.GET_DESCRIPTION_COURSES, fetchDescriptionCourses);
}

export function* loadDescriptionCourse() {
    yield takeEvery(actions.description.GET_DESCRIPTION_COURSE, fetchDescriptionCourse);
}

export function* loadAddDescriptionCourse() {
    yield takeEvery(actions.description.CREATE_DESCRIPTION_COURSE, createDescriptionCourse);
}

export function* loadEditDescriptionCourse() {
    yield takeEvery(actions.description.EDIT_DESCRIPTION_COURSE, editDescriptionCourse);
}

export function* loadDeleteDescriptionCourse() {
    yield takeEvery(actions.description.DELETE_DESCRIPTION_COURSE, deleteDescriptionCourse);
}
