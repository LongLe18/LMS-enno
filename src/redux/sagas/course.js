import { notification } from 'antd';
import { call, put, takeEvery } from 'redux-saga/effects';
import config from '../../configs/index';
import { getApi, getApiAuth, postApiAuth, putApiAuth, deleteApiAuth } from '../services/api';
import * as actions from '../actions';
import { get } from 'lodash';

function* fetchCourses(payload) {
    try {
        let endpoint = `${config.API_URL}/course?kct_id=${payload.params.idkct}&trang_thai=${payload.params.status}&search=${payload.params.search}`;
        const response = yield call(getApi, endpoint);
        const result = yield response.data;
        yield put({ type: actions.course.GET_COURSES_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.course.GET_COURSES_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu khóa học đã thất bại ' + messageError),
        });
    }
}

function* fetchCourse(payload) {
    try {
        let endpoint = `${config.API_URL}/course/${payload.params.id}`;
        const response = yield call(getApi, endpoint);
        const result = yield response.data;
        yield put({ type: actions.course.GET_COURSE_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.course.GET_COURSE_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu khóa học đã thất bại ' + messageError),
        });
    }
}

function* fectchFilter(payload) {
    try {
        let endpoint = `${config.API_URL}/course/filter?trang_thai=${payload.params.status}&search=${payload.params.search}&ngay_bat_dau=${payload.params.start}&ngay_ket_thuc=${payload.params.end}&pageIndex=${payload.params.pageIndex}`;
        if (payload.params.kct_id) endpoint = endpoint + `&kct_id=${payload.params.kct_id}`
        if (payload.params.pageSize) endpoint = endpoint + `&pageSize=${payload.params.pageSize}`
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.course.FILTER_COURSES_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.course.FILTER_COURSES_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu khóa học thất bại ' + messageError),
        });
    }
}


function* createCourse(payload) {
    try {
        let endpoint = config.API_URL + '/course/create';
        const response = yield call(postApiAuth, endpoint, payload.params); 
        const result = yield response;
        yield put({ type: actions.course.CREATE_COURSE_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.course.CREATE_COURSE_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Thêm khóa học mới thất bại ' + messageError),
        });
    }
}

function* editCourse(payload) {
    try {
        let endpoint = config.API_URL + `/course/${payload.params.idCourse}`;
        const response = yield call(putApiAuth, endpoint, payload.params.formData); 
        const result = yield response;
        yield put({ type: actions.course.EDIT_COURSE_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.course.EDIT_COURSE_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Cập nhật thông tin khóa học thất bại ' + messageError),
        });
    }
}

function* deleteCourse(payload) {
    try {
        let endpoint = config.API_URL + `/course/${payload.params.idLesson}/force`;
        const response = yield call(deleteApiAuth, endpoint); 
        const result = yield response;
        yield put({ type: actions.course.DELETE_COURSE_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.course.DELETE_COURSE_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Xóa khóa học thất bại ' + messageError),
        });
    }
}

function* addStudentToCourse(payload) {
    try {
        let endpoint = config.API_URL + `/course/add/student/${payload.params.idCourse}`;
        const response = yield call(postApiAuth, endpoint, payload.params.data); 
        const result = yield response;
        yield put({ type: actions.course.ADD_STUDENT_COURSE_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.course.ADD_STUDENT_COURSE_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Thêm học viên vào khóa học thất bại ' + messageError),
        });
    }
}

function* fectchCourseStudent(payload) {
    try {
        let endpoint = `${config.API_URL}/course_student?search=${payload.params.search}&pageIndex=${payload.params.pageIndex}&pageSize=${payload.params.pageSize}`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.course.GET_COURSES_STUDENT_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.course.GET_COURSES_STUDENT_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu khóa học thất bại ' + messageError),
        });
    }
}

function* fectchStudentOfCourse(payload) {
    try {
        let endpoint = `${config.API_URL}/course/student/list/${payload.params.idCourse}?tinh=${payload.params.province}&ten_hoc_vien=${payload.params.search}&pageIndex=${payload.params.pageIndex}&pageSize=${payload.params.pageSize}`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.course.GET_COURSES_STUDENT_DETAIL_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.course.GET_COURSES_STUDENT_DETAIL_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu khóa học thất bại ' + messageError),
        });
    }
}

function* deleteCourseStudent(payload) {
    try {
        let endpoint = config.API_URL + `/course_student/${payload.params.idCourseStudent}`;
        const response = yield call(deleteApiAuth, endpoint); 
        const result = yield response;
        yield put({ type: actions.course.DELETE_COURSES_STUDENT_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.course.DELETE_COURSES_STUDENT_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Xóa học viên trong khóa học thất bại ' + messageError),
        });
    }
}

function* fectchRemainStudentOfCourse(payload) {
    try {
        let endpoint = `${config.API_URL}/course/add/student/list/${payload.params.idCourse}?tinh=${payload.params.province}&ten_hoc_vien=${payload.params.search}&pageIndex=${payload.params.pageIndex}&pageSize=${payload.params.pageSize}`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.course.GET_REMAIN_STUDENT_COURSE_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.course.GET_REMAIN_STUDENT_COURSE_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu khóa học thất bại ' + messageError),
        });
    }
}


export function* loadCourses() {
    yield takeEvery(actions.course.GET_COURSES, fetchCourses);
}

export function* loadCourse() {
    yield takeEvery(actions.course.GET_COURSE, fetchCourse);
}

export function* loadAddCourse() {
    yield takeEvery(actions.course.CREATE_COURSE, createCourse);
}

export function* loadEditCourse() {
    yield takeEvery(actions.course.EDIT_COURSE, editCourse);
}

export function* loadDeleteCourse() {
    yield takeEvery(actions.course.DELETE_COURSE, deleteCourse);
}

export function* loadFilterCourse() {
    yield takeEvery(actions.course.FILTER_COURSES, fectchFilter);
}

export function* loadAddStudentToCourse() {
    yield takeEvery(actions.course.ADD_STUDENT_COURSE, addStudentToCourse);
}

export function* loadStudentCourse() {
    yield takeEvery(actions.course.GET_COURSES_STUDENT, fectchCourseStudent);
}

export function* loadStudentOfCourse() {
    yield takeEvery(actions.course.GET_COURSES_STUDENT_DETAIL, fectchStudentOfCourse);
}

export function* loadDeleteStudentCourse() {
    yield takeEvery(actions.course.DELETE_COURSES_STUDENT, deleteCourseStudent);
}

export function* loadRemainStudentOfCourse() {
    yield takeEvery(actions.course.GET_REMAIN_STUDENT_COURSE, fectchRemainStudentOfCourse);
}