import { notification } from 'antd';
import { call, put, takeEvery } from 'redux-saga/effects';
import config from '../../configs/index';
import { getApi, postApiAuth, putApiAuth, deleteApiAuth, getApiAuth } from '../services/api';
import * as actions from '../actions';
import { get } from 'lodash';

function* fetchCriteriasCourse(payload) {
    try {
        let khoa_hoc_id = '';
        if (payload.params?.khoa_hoc_id !== undefined) {
            khoa_hoc_id = payload.params?.khoa_hoc_id;
        }
        let endpoint = `${config.API_URL}/synthetic_criteria/all_admin?khoa_hoc_id=${khoa_hoc_id}&pageIndex=${payload.params?.pageIndex}&pageSize=${payload.params?.pageSize}`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.criteria.GET_CRITERIAS_COURSE_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.criteria.GET_CRITERIAS_COURSE_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu tiêu chí đã thất bại ' + messageError),
        });
    }
}

function* fetchCriteriaCourse(payload) {
    try {
        let endpoint = `${config.API_URL}/synthetic_criteria/${payload.params.id}`;
        const response = yield call(getApi, endpoint);
        const result = yield response.data;
        yield put({ type: actions.criteria.GET_CRITERIA_COURSE_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.criteria.GET_CRITERIA_COURSE_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu tiêu chí đã thất bại ' + messageError),
        });
    }
}

function* createCriteriaCourse(payload) {
    try {
        let endpoint = config.API_URL + '/synthetic_criteria/create';
        const response = yield call(postApiAuth, endpoint, payload.params); 
        const result = yield response;
        yield put({ type: actions.criteria.CREATE_CRITERIA_COURSE_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.criteria.CREATE_CRITERIA_COURSE_FAILED, error: error });
        if (payload.callback) {
            payload.callback(error);
        }
    }
}

function* editCriteriaCourse(payload) {
    try {
        let endpoint = config.API_URL + `/synthetic_criteria/${payload.params.id}`;
        const response = yield call(putApiAuth, endpoint, payload.params.formData); 
        const result = yield response;
        yield put({ type: actions.criteria.EDIT_CRITERIA_COURSE_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.criteria.EDIT_CRITERIA_COURSE_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Cập nhật thông tin tiêu chí thất bại ' + messageError),
        });
    }
}

function* deleteCriteaCourse(payload) {
    try {
        let endpoint = config.API_URL + `/synthetic_criteria/${payload.params.id}/force`;
        const response = yield call(deleteApiAuth, endpoint); 
        const result = yield response;
        yield put({ type: actions.criteria.DELETE_CRITERIA_COURSE_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.criteria.DELETE_CRITERIA_COURSE_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Xóa tiêu chí thất bại ' + messageError),
        });
    }
}

/////////////////////////////////////////////////////////////////////////////
function* fetchCriteriasModule(payload) {
    try {
        let khoa_hoc_id = '';
        if (payload.params?.khoa_hoc_id !== undefined) {
            khoa_hoc_id = payload.params?.khoa_hoc_id;
        }
        let endpoint = `${config.API_URL}/modun_criteria/all_admin?khoa_hoc_id=${khoa_hoc_id}&pageIndex=${payload.params?.pageIndex}&pageSize=${payload.params?.pageSize}`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.criteria.GET_CRITERIAS_MODULE_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.criteria.GET_CRITERIAS_MODULE_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu tiêu chí đã thất bại ' + messageError),
        });
    }
}

function* fetchCriteriaModule(payload) {
    try {
        let endpoint = `${config.API_URL}/modun_criteria/${payload.params.id}`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.criteria.GET_CRITERIA_MODULE_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.criteria.GET_CRITERIA_MODULE_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu tiêu chí đã thất bại ' + messageError),
        });
    }
}

function* fetchCriteriaByModule(payload) {
    try {
        let endpoint = `${config.API_URL}/modun_criteria/by_modun/${payload.params.id}`;
        const response = yield call(getApi, endpoint);
        const result = yield response.data;
        yield put({ type: actions.criteria.GET_CRITERIA_MODULE_ID_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.criteria.GET_CRITERIA_MODULE_ID_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu tiêu chí đã thất bại ' + messageError),
        });
    }
}

function* createCriteriaModule(payload) {
    try {
        let endpoint = config.API_URL + '/modun_criteria/create';
        const response = yield call(postApiAuth, endpoint, payload.params); 
        const result = yield response;
        yield put({ type: actions.criteria.CREATE_CRITERIA_MODULE_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.criteria.CREATE_CRITERIA_MODULE_FAILED, error: error });
        if (payload.callback) {
            payload.callback(error);
        }
    }
}

function* editCriteriaModule(payload) {
    try {
        let endpoint = config.API_URL + `/modun_criteria/${payload.params.id}`;
        const response = yield call(putApiAuth, endpoint, payload.params.formData); 
        const result = yield response;
        yield put({ type: actions.criteria.EDIT_CRITERIA_MODULE_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.criteria.EDIT_CRITERIA_MODULE_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Cập nhật thông tin tiêu chí thất bại ' + messageError),
        });
    }
}

function* deleteCriteaModule(payload) {
    try {
        let endpoint = config.API_URL + `/modun_criteria/${payload.params.id}/force`;
        const response = yield call(deleteApiAuth, endpoint); 
        const result = yield response;
        yield put({ type: actions.criteria.DELETE_CRITERIA_MODULE_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.criteria.DELETE_CRITERIA_MODULE_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Xóa tiêu chí thất bại ' + messageError),
        });
    }
}

///////////////////////////////////////////////////////////
function* fetchCriteriasThematic(payload) {
    try {
        let khoa_hoc_id = '';
        if (payload.params?.khoa_hoc_id !== undefined) {
            khoa_hoc_id = payload.params?.khoa_hoc_id;
        }
        let endpoint = `${config.API_URL}/thematic_criteria/all_admin?khoa_hoc_id=${khoa_hoc_id}&pageIndex=${payload.params?.pageIndex}&pageSize=${payload.params?.pageSize}`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.criteria.GET_CRITERIAS_THEMATIC_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.criteria.GET_CRITERIAS_THEMATIC_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu tiêu chí đã thất bại ' + messageError),
        });
    }
}

function* fetchCriteriaThematic(payload) {
    try {
        let endpoint = `${config.API_URL}/thematic_criteria/${payload.params.id}`;
        const response = yield call(getApi, endpoint);
        const result = yield response.data;
        yield put({ type: actions.criteria.GET_CRITERIA_THEMATIC_ID_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.criteria.GET_CRITERIA_THEMATIC_ID_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu tiêu chí đã thất bại ' + messageError),
        });
    }
}

function* fetchCriteriaByThematic(payload) {
    try {
        let endpoint = `${config.API_URL}/thematic_criteria/by_thematic/${payload.params.id}`;
        const response = yield call(getApi, endpoint);
        const result = yield response.data;
        yield put({ type: actions.criteria.GET_CRITERIA_THEMATIC_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.criteria.GET_CRITERIA_THEMATIC_FAILED, error: error });
        if (error.response.data && error.response.data.status === 'warning') {
            if (payload.callback) {
                payload.callback(error);
            }
        } else {
            let messageError = error.response.status === 403 ? error.response.data : '';
            notification.error({
                message: get(error, 'response.data.error', 'Tải dữ liệu tiêu chí đã thất bại ' + messageError),
            });
        }
    }
}

function* createCriteriaThematic(payload) {
    try {
        let endpoint = config.API_URL + '/thematic_criteria/create';
        const response = yield call(postApiAuth, endpoint, payload.params); 
        const result = yield response;
        yield put({ type: actions.criteria.CREATE_CRITERIA_THEMATIC_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.criteria.CREATE_CRITERIA_THEMATIC_FAILED, error: error });
        if (payload.callback) {
            payload.callback(error);
        }
    }
}

function* editCriteriaThematic(payload) {
    try {
        let endpoint = config.API_URL + `/thematic_criteria/${payload.params.id}`;
        const response = yield call(putApiAuth, endpoint, payload.params.formData); 
        const result = yield response;
        yield put({ type: actions.criteria.EDIT_CRITERIA_THEMATIC_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.criteria.EDIT_CRITERIA_THEMATIC_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Cập nhật thông tin tiêu chí thất bại ' + messageError),
        });
    }
}

function* deleteCriteaThematic(payload) {
    try {
        let endpoint = config.API_URL + `/thematic_criteria/${payload.params.id}/force`;
        const response = yield call(deleteApiAuth, endpoint); 
        const result = yield response;
        yield put({ type: actions.criteria.DELETE_CRITERIA_THEMATIC_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.criteria.DELETE_CRITERIA_THEMATIC_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Xóa tiêu chí thất bại ' + messageError),
        });
    }
}

/////////////////////////////////////////////////////////////////////////////
function* fetchCriteriasOnline(payload) {
    try {
        let khoa_hoc_id = '';
        if (payload.params?.khoa_hoc_id !== undefined) {
            khoa_hoc_id = payload.params?.khoa_hoc_id;
        }
        let endpoint = `${config.API_URL}/online_criteria/all_admin?khoa_hoc_id=${khoa_hoc_id}&pageIndex=${payload.params?.pageIndex}&pageSize=${payload.params?.pageSize}`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.criteria.GET_CRITERIAS_ONLINE_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.criteria.GET_CRITERIAS_ONLINE_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu tiêu chí đã thất bại ' + messageError),
        });
    }
}

function* fetchCriteriaOnline(payload) {
    try {
        let endpoint = `${config.API_URL}/online_criteria/${payload.params.id}`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.criteria.GET_CRITERIA_ONLINE_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.criteria.GET_CRITERIA_ONLINE_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu tiêu chí đã thất bại ' + messageError),
        });
    }
}

function* createCriteriaOnline(payload) {
    try {
        let endpoint = config.API_URL + '/online_criteria/create';
        const response = yield call(postApiAuth, endpoint, payload.params); 
        const result = yield response;
        yield put({ type: actions.criteria.CREATE_CRITERIA_ONLINE_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.criteria.CREATE_CRITERIA_ONLINE_FAILED, error: error });
        if (payload.callback) {
            payload.callback(error);
        }
    }
}

function* editCriteriaOnline(payload) {
    try {
        let endpoint = config.API_URL + `/online_criteria/${payload.params.id}`;
        const response = yield call(putApiAuth, endpoint, payload.params.formData); 
        const result = yield response;
        yield put({ type: actions.criteria.EDIT_CRITERIA_ONLINE_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.criteria.EDIT_CRITERIA_ONLINE_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Cập nhật thông tin tiêu chí thất bại ' + messageError),
        });
    }
}

function* deleteCriteaOnline(payload) {
    try {
        let endpoint = config.API_URL + `/online_criteria/${payload.params.id}/force`;
        const response = yield call(deleteApiAuth, endpoint); 
        const result = yield response;
        yield put({ type: actions.criteria.DELETE_CRITERIA_ONLINE_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.criteria.DELETE_CRITERIA_ONLINE_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Xóa tiêu chí thất bại ' + messageError),
        });
    }
}

/////////////////////////////////////////////////////////////////////////////
function* fetchCriteriasDGNL(payload) {
    try {
        let khoa_hoc_id = '';
        if (payload.params?.khoa_hoc_id !== undefined) {
            khoa_hoc_id = payload.params?.khoa_hoc_id;
        }
        let endpoint = `${config.API_URL}/dgnl-criteria/all_admin?khoa_hoc_id=${khoa_hoc_id}&pageIndex=${payload.params?.pageIndex}&pageSize=${payload.params?.pageSize}`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.criteria.GET_CRITERIAS_DGNL_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.criteria.GET_CRITERIAS_DGNL_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu tiêu chí đã thất bại ' + messageError),
        });
    }
}

function* fetchCriteriaDGNL(payload) {
    try {
        let endpoint = `${config.API_URL}/dgnl-criteria/${payload.params.id}`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.criteria.GET_CRITERIA_DGNL_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.criteria.GET_CRITERIA_DGNL_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu tiêu chí đã thất bại ' + messageError),
        });
    }
}

function* createCriteriaDGNL(payload) {
    try {
        let endpoint = config.API_URL + '/dgnl-criteria/create';
        const response = yield call(postApiAuth, endpoint, payload.params); 
        const result = yield response;
        yield put({ type: actions.criteria.CREATE_CRITERIA_DGNL_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.criteria.CREATE_CRITERIA_DGNL_FAILED, error: error });
        if (payload.callback) {
            payload.callback(error);
        }
    }
}

function* editCriteriaDGNL(payload) {
    try {
        let endpoint = config.API_URL + `/dgnl-criteria/${payload.params.id}`;
        const response = yield call(putApiAuth, endpoint, payload.params.formData); 
        const result = yield response;
        yield put({ type: actions.criteria.EDIT_CRITERIA_DGNL_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.criteria.EDIT_CRITERIA_DGNL_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Cập nhật thông tin tiêu chí thất bại ' + messageError),
        });
    }
}

function* deleteCriteaDGNL(payload) {
    try {
        let endpoint = config.API_URL + `/dgnl-criteria/${payload.params.id}/force`;
        const response = yield call(deleteApiAuth, endpoint); 
        const result = yield response;
        yield put({ type: actions.criteria.DELETE_CRITERIA_DGNL_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.criteria.DELETE_CRITERIA_DGNL_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Xóa tiêu chí thất bại ' + messageError),
        });
    }
}

export function* loadCriteriasCourse() {
    yield takeEvery(actions.criteria.GET_CRITERIAS_COURSE, fetchCriteriasCourse);
}

export function* loadCriteriaCourse() {
    yield takeEvery(actions.criteria.GET_CRITERIA_COURSE, fetchCriteriaCourse);
}

export function* loadAddCriteriaCourse() {
    yield takeEvery(actions.criteria.CREATE_CRITERIA_COURSE, createCriteriaCourse);
}

export function* loadEditCriteriaCourse() {
    yield takeEvery(actions.criteria.EDIT_CRITERIA_COURSE, editCriteriaCourse);
}

export function* loadDeleteCriteriaCourse() {
    yield takeEvery(actions.criteria.DELETE_CRITERIA_COURSE, deleteCriteaCourse);
}

///////////////////////////////////
export function* loadCriteriasModule() {
    yield takeEvery(actions.criteria.GET_CRITERIAS_MODULE, fetchCriteriasModule);
}

export function* loadCriteriaModule() {
    yield takeEvery(actions.criteria.GET_CRITERIA_MODULE, fetchCriteriaModule);
}

export function* loadCriteriaByModule() {
    yield takeEvery(actions.criteria.GET_CRITERIA_MODULE_ID, fetchCriteriaByModule);
}

export function* loadAddCriteriaModule() {
    yield takeEvery(actions.criteria.CREATE_CRITERIA_MODULE, createCriteriaModule);
}

export function* loadEditCriteriaModule() {
    yield takeEvery(actions.criteria.EDIT_CRITERIA_MODULE, editCriteriaModule);
}

export function* loadDeleteCriteriaModule() {
    yield takeEvery(actions.criteria.DELETE_CRITERIA_MODULE, deleteCriteaModule);
}

///////////////////////////////////
export function* loadCriteriasThematic() {
    yield takeEvery(actions.criteria.GET_CRITERIAS_THEMATIC, fetchCriteriasThematic);
}

export function* loadCriteriaThematic() {
    yield takeEvery(actions.criteria.GET_CRITERIA_THEMATIC_ID, fetchCriteriaThematic);
}

export function* loadCriteriaByThematic() {
    yield takeEvery(actions.criteria.GET_CRITERIA_THEMATIC, fetchCriteriaByThematic);
}

export function* loadAddCriteriaThematic() {
    yield takeEvery(actions.criteria.CREATE_CRITERIA_THEMATIC, createCriteriaThematic);
}

export function* loadEditCriteriaThematic() {
    yield takeEvery(actions.criteria.EDIT_CRITERIA_THEMATIC, editCriteriaThematic);
}

export function* loadDeleteCriteriaThematic() {
    yield takeEvery(actions.criteria.DELETE_CRITERIA_THEMATIC, deleteCriteaThematic);
}

///////////////////////////////////
export function* loadCriteriasOnline() {
    yield takeEvery(actions.criteria.GET_CRITERIAS_ONLINE, fetchCriteriasOnline);
}

export function* loadCriteriaOnline() {
    yield takeEvery(actions.criteria.GET_CRITERIA_ONLINE, fetchCriteriaOnline);
}

export function* loadAddCriteriaOnline() {
    yield takeEvery(actions.criteria.CREATE_CRITERIA_ONLINE, createCriteriaOnline);
}

export function* loadEditCriteriaOnline() {
    yield takeEvery(actions.criteria.EDIT_CRITERIA_ONLINE, editCriteriaOnline);
}

export function* loadDeleteCriteriaOnline() {
    yield takeEvery(actions.criteria.DELETE_CRITERIA_ONLINE, deleteCriteaOnline);
}


///////////////////////////////////
export function* loadCriteriasDGNL() {
    yield takeEvery(actions.criteria.GET_CRITERIAS_DGNL, fetchCriteriasDGNL);
}

export function* loadCriteriaDGNL() {
    yield takeEvery(actions.criteria.GET_CRITERIA_DGNL, fetchCriteriaDGNL);
}

export function* loadAddCriteriaDGNL() {
    yield takeEvery(actions.criteria.CREATE_CRITERIA_DGNL, createCriteriaDGNL);
}

export function* loadEditCriteriaDGNL() {
    yield takeEvery(actions.criteria.EDIT_CRITERIA_DGNL, editCriteriaDGNL);
}

export function* loadDeleteCriteriaDGNL() {
    yield takeEvery(actions.criteria.DELETE_CRITERIA_DGNL, deleteCriteaDGNL);
}