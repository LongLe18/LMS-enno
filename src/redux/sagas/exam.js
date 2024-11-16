import { notification } from 'antd';
import { call, put, takeEvery } from 'redux-saga/effects';
import config from '../../configs/index';
import { getApi, getApiAuth, postApiAuth, putApiAuth, deleteApiAuth } from '../services/api';
import * as actions from '../actions';
import { get } from 'lodash';

function* fetchExams(payload) {
    try {
        let endpoint = `${config.API_URL}/exam?mo_dun_id=${payload.params.idModule}&chuyen_de_id=${payload.params.idThematic}&khoa_hoc_id=${payload.params.idCourse}&trang_thai=${payload.params.status}`;
        const response = yield call(getApi, endpoint);
        const result = yield response.data;
        yield put({ type: actions.exam.GET_EXAMS_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.exam.GET_EXAMS_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu đề thi đã thất bại ' + messageError),
        });
    }
}

function* fetchExam(payload) {
    try {
        let endpoint = `${config.API_URL}/exam/${payload.params.id}`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.exam.GET_EXAM_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.exam.GET_EXAM_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu đề thi đã thất bại ' + messageError),
        });
    }
}

function* fectchFilter(payload) {
    try {
        let endpoint = `${config.API_URL}/exam/all_admin?offset=${payload.params.offset}&limit=${payload.params.limit}&trang_thai=${payload.params.status}&khoa_hoc_id=${payload.params.idCourse}&mo_dun_id=${payload.params.idModule}&chuyen_de_id=${payload.params.idThematic}&loai_de_thi_id=${payload.params.idType}&ngay_bat_dau=${payload.params.start}&ngay_ket_thuc=${payload.params.end}&search=${payload.params.search}&xuat_ban=${payload.params.publish}`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.exam.FILTER_EXAMS_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.exam.FILTER_EXAMS_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu đề thi thất bại ' + messageError),
        });
    }
}

function* fectchFilterDGNL(payload) {
    try {
        let endpoint = `${config.API_URL}/exam/dgnl?pageIndex=${payload.params.pageIndex}&pageSize=${payload.params.pageSize}&kct_id=${payload.params.kct_id}&sortBy=ngay_tao,ASC&trang_thai=${payload.params.status}&xuat_ban=${payload.params.publish}&khoa_hoc_id=${payload.params.idCourse}`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.exam.FILTER_EXAMS_DGNL_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.exam.FILTER_EXAMS_DGNL_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu đề thi thất bại ' + messageError),
        });
    }
}

function* createExam(payload) {
    try {
        let endpoint = config.API_URL + '/exam/create';
        const response = yield call(postApiAuth, endpoint, payload.params); 
        const result = yield response;
        yield put({ type: actions.exam.CREATE_EXAM_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.exam.CREATE_EXAM_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : error.response.data.message;
        notification.error({
            message: get(error, 'response.data.error', 'Thêm đề thi mới thất bại: ' + messageError),
        });
    }
}

function* reuseExam(payload) {
    try {
        let endpoint = config.API_URL + `/exam/reuse/${payload.params.idExam}`;
        const response = yield call(getApiAuth, endpoint); 
        const result = yield response;
        yield put({ type: actions.exam.REUSE_EXAM_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.exam.REUSE_EXAM_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Sử dụng lại đề thi thất bại ' + messageError),
        });
    }
}

function* editExam(payload) {
    try {
        let endpoint = config.API_URL + `/exam/${payload.params.idExam}`;
        const response = yield call(putApiAuth, endpoint, payload.params.formData); 
        const result = yield response;
        yield put({ type: actions.exam.EDIT_EXAM_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.exam.EDIT_EXAM_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Cập nhật thông tin đề thi thất bại ' + messageError),
        });
    }
}

function* deleteExam(payload) {
    try {
        let endpoint = config.API_URL + `/exam/${payload.params.idExam}/force`;
        const response = yield call(deleteApiAuth, endpoint); 
        const result = yield response;
        yield put({ type: actions.exam.DELETE_EXAM_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.exam.DELETE_EXAM_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Xóa đề thi thất bại ' + messageError),
        });
    }
}

function* fetchSyntheticCriteria(payload) {
    try {
        let endpoint = `${config.API_URL}/synthetic_criteria/by_course/${payload.params.idCourse}`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.exam.GET_SYNTHETIC_CRITERIA_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.exam.GET_SYNTHETIC_CRITERIA_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu tiêu chí đề tổng hợp đã thất bại ' + messageError),
        });
    }
};

function* fetchModuleCriteria(payload) {
    try {
        let endpoint = `${config.API_URL}/modun_criteria/by_modun/${payload.params.idModule}`;
        const response = yield call(getApi, endpoint);
        const result = yield response.data;
        yield put({ type: actions.exam.GET_MODULE_CRITERIA_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.exam.GET_MODULE_CRITERIA_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu tiêu chí đề mô đun đã thất bại ' + messageError),
        });
    }
};

function* publishExam(payload) {
    try {
        let endpoint = `${config.API_URL}/exam/${payload.params.id}/publish`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.exam.GET_PUBLISH_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.exam.GET_PUBLISH_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : error.response.data.message;
        notification.error({
            message: get(error, 'response.data.error', 'Xuất bản đề thi đã thất bại ' + messageError),
        });
    }
};

function* goUsing(payload) {
    try {
        let endpoint = `${config.API_URL}/exam/state_change/${payload.params.id}`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.exam.GET_USING_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.exam.GET_USING_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Đưa ra sử dụng đã thất bại ' + messageError),
        });
    }
};

function* fetchCriteriaByCourse(payload) {
    try {
        let endpoint = `${config.API_URL}/online_criteria/by_course/${payload.params.idCourse}`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.exam.GET_CRITERIA_ONLINE_ID_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.exam.GET_CRITERIA_ONLINE_ID_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu tiêu chí đã thất bại ' + messageError),
        });
    }
}

function* fetchCriteriaDGNLByCourse(payload) {
    try {
        let endpoint = `${config.API_URL}/dgnl-criteria/by_course/${payload.params.idCourse}`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.exam.GET_CRITERIA_DGNL_ID_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.exam.GET_CRITERIA_DGNL_ID_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu tiêu chí đã thất bại ' + messageError),
        });
    }
}

function* fetchThematicCriteria(payload) {
    try {
        let endpoint = `${config.API_URL}/thematic_criteria/by_thematic/${payload.params.idThematic}`;
        const response = yield call(getApi, endpoint);
        const result = yield response.data;
        yield put({ type: actions.exam.GET_THEMATIC_CRITERIA_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.exam.GET_THEMATIC_CRITERIA_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu tiêu chí đề chuyên đề đã thất bại ' + messageError),
        });
    }
};

function* fetchExamThematicAndModule(payload) {
    try {
        let endpoint = `${config.API_URL}/exam/one_exam?mo_dun_id=${payload.params.idModule}&chuyen_de_id=${payload.params.idThematic}&loai_de_thi_id=${payload.params.type}`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.exam.GET_EXAM_THEMATIC_USER_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.exam.GET_EXAM_THEMATIC_USER_FAILED, error: error });
        if (payload.callback) {
            payload.callback(error);
        }
        // notification.error({
        //     message: get(error, 'response.data.error', 'Tải dữ liệu đề thi chuyên đề hoặc mô đun đã thất bại ' + messageError),
        // });
    }
};

function* fetchExamCourse(payload) {
    try {
        let endpoint = `${config.API_URL}/exam/synthetic?khoa_hoc_id=${payload.params.idCourse}`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.exam.GET_EXAM_COURSE_USER_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.exam.GET_EXAM_COURSE_USER_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu đề thi khóa học đã thất bại ' + messageError),
        });
    }
};


function* fetchExamCourseOnline(payload) {
    try {
        let endpoint = `${config.API_URL}/exam/onlineExam?khoa_hoc_id=${payload.params.idCourse}`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.exam.GET_EXAM_COURSE_ONLINE_USER_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.exam.GET_EXAM_COURSE_ONLINE_USER_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu đề thi khóa học đã thất bại ' + messageError),
        });
    }
};

function* fetchExamsUser(payload) {
    try {
        let endpoint = `${config.API_URL}/student_exam?de_thi_id=${payload.params.idExam}&mo_dun_id=${payload.params.idModule}&loai_de_thi_id=${payload.params.type}`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.exam.GET_EXAMS_USER_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.exam.GET_EXAMS_USER_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu đề thi học viên đã thất bại ' + messageError),
        });
    }
};

function* fetchExamUser(payload) {
    try {
        let endpoint = `${config.API_URL}/student_exam/${payload.params.id}`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.exam.GET_EXAM_USER_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.exam.GET_EXAM_USER_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu đề thi học viên đã thất bại ' + messageError),
        });
    }
};

function* createExamUser(payload) {
    try {
        let endpoint = config.API_URL + '/student_exam/create';
        const response = yield call(postApiAuth, endpoint, payload.params); 
        const result = yield response;
        yield put({ type: actions.exam.CREATE_EXAM_USER_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.exam.CREATE_EXAM_USER_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Thêm đề thi học viên mới thất bại ' + messageError),
        });
    }
}

function* editExamUser(payload) {
    try {
        let endpoint = config.API_URL + `/student_exam/${payload.params.idExam}`;
        const response = yield call(putApiAuth, endpoint, payload.params.formData); 
        const result = yield response;
        yield put({ type: actions.exam.EDIT_EXAM_USER_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.exam.EDIT_EXAM_USER_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Cập nhật thông tin đề thi học viên thất bại ' + messageError),
        });
    }
}

function* editExamDGNLUser(payload) {
    try {
        let endpoint = config.API_URL + `/student_exam/${payload.params.idExam}/dgnl`;
        const response = yield call(putApiAuth, endpoint, payload.params.formData); 
        const result = yield response;
        yield put({ type: actions.exam.EDIT_EXAM_DGNL_USER_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.exam.EDIT_EXAM_DGNL_USER_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Cập nhật thông tin đề thi học viên thất bại ' + messageError),
        });
    }
}

function* deleteExamUser(payload) {
    try {
        let endpoint = config.API_URL + `/student_exam/${payload.params.idExam}/force`;
        const response = yield call(deleteApiAuth, endpoint); 
        const result = yield response;
        yield put({ type: actions.exam.DELETE_EXAM_USER_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.exam.DELETE_EXAM_USER_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Xóa đề thi thất bại ' + messageError),
        });
    }
}

export function* loadExams() {
    yield takeEvery(actions.exam.GET_EXAMS, fetchExams);
}

export function* loadExam() {
    yield takeEvery(actions.exam.GET_EXAM, fetchExam);
}

export function* loadAddExam() {
    yield takeEvery(actions.exam.CREATE_EXAM, createExam);
}

export function* loadReuseExam() {
    yield takeEvery(actions.exam.REUSE_EXAM, reuseExam);
}

export function* loadEditExam() {
    yield takeEvery(actions.exam.EDIT_EXAM, editExam);
}

export function* loadDeleteExam() {
    yield takeEvery(actions.exam.DELETE_EXAM, deleteExam);
}

export function* loadFilterExam() {
    yield takeEvery(actions.exam.FILTER_EXAMS, fectchFilter);
}

export function* loadFilterExamDGNL() {
    yield takeEvery(actions.exam.FILTER_EXAMS_DGNL, fectchFilterDGNL);
}

export function* loadCriteriaDGNLByCourse() {
    yield takeEvery(actions.exam.GET_CRITERIA_DGNL_ID, fetchCriteriaDGNLByCourse);
}

export function* loadCriteriaByCourse() {
    yield takeEvery(actions.exam.GET_CRITERIA_ONLINE_ID, fetchCriteriaByCourse);
}

export function* loadSyntheticCritera() {
    yield takeEvery(actions.exam.GET_SYNTHETIC_CRITERIA, fetchSyntheticCriteria);
}

export function* loadModuleCriteria() {
    yield takeEvery(actions.exam.GET_MODULE_CRITERIA, fetchModuleCriteria);
}

export function* loadThematicCriteria() {
    yield takeEvery(actions.exam.GET_THEMATIC_CRITERIA, fetchThematicCriteria);
}

export function* loadPublishExam() {
    yield takeEvery(actions.exam.GET_PUBLISH, publishExam);
}

export function* loadGoUsing() {
    yield takeEvery(actions.exam.GET_USING, goUsing);
}

export function* loadCombineExam() {
    yield takeEvery(actions.exam.GET_EXAM_THEMATIC_USER, fetchExamThematicAndModule);
}

export function* loadExamCourse() {
    yield takeEvery(actions.exam.GET_EXAM_COURSE_USER, fetchExamCourse);
}

export function* loadExamCourseOnline() {
    yield takeEvery(actions.exam.GET_EXAM_COURSE_ONLINE_USER, fetchExamCourseOnline);
}


export function* loadExamUser() {
    yield takeEvery(actions.exam.GET_EXAM_USER, fetchExamUser);
}

export function* loadExamsUser() {
    yield takeEvery(actions.exam.GET_EXAMS_USER, fetchExamsUser);
}

export function* loadCreateExamUser() {
    yield takeEvery(actions.exam.CREATE_EXAM_USER, createExamUser);
}

export function* loadEditExamUser() {
    yield takeEvery(actions.exam.EDIT_EXAM_USER, editExamUser);
}

export function* loadEditExamDGNLUser() {
    yield takeEvery(actions.exam.EDIT_EXAM_DGNL_USER, editExamDGNLUser);
}

export function* loadDeleteExamUser() {
    yield takeEvery(actions.exam.DELETE_EXAM_USER, deleteExamUser);
}
