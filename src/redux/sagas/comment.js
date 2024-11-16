import { notification } from 'antd';
import { call, put, takeEvery } from 'redux-saga/effects';
import config from '../../configs/index';
import { getApi, postApiAuth, deleteApiAuth, putApiAuth, getApiAuth } from '../services/api';
import * as actions from '../actions';
import { get } from 'lodash';

function* fetchComments(payload) {
    try {
        let endpoint = `${config.API_URL}/comment?khoa_hoc_id=${payload.params.idCourse}&mo_dun_id=${payload.params.idModule}&loai_hoi_dap=${payload.params.type}`;
        const response = yield call(getApi, endpoint);
        const result = yield response.data;
        yield put({ type: actions.comment.GET_COMMENTS_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.comment.GET_COMMENTS_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu bình luận đã thất bại ' + messageError),
        });
    }
}

function* fetchComment(payload) {
    try {
        let endpoint = `${config.API_URL}/comment/${payload.params.id}`;
        const response = yield call(getApiAuth, endpoint);
        const result = yield response.data;
        yield put({ type: actions.comment.GET_COMMENT_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.comment.GET_COMMENT_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu bình luận đã thất bại ' + messageError),
        });
    }
}

function* createComment(payload) {
    try {
        let endpoint = config.API_URL + '/comment/create';
        const response = yield call(postApiAuth, endpoint, payload.params); 
        const result = yield response;
        yield put({ type: actions.comment.CREATE_COMMENT_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.comment.CREATE_COMMENT_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Thêm bình luận mới thất bại ' + messageError),
        });
    }
}

function* editComment(payload) {
    try {
        let endpoint = config.API_URL + `/comment/${payload.params.idComment}`;
        const response = yield call(putApiAuth, endpoint, payload.params.formData); 
        const result = yield response;
        yield put({ type: actions.comment.EDIT_COMMENT_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.comment.EDIT_COMMENT_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Cập nhật thông tin bình luận thất bại ' + messageError),
        });
    }
}

function* deleteComment(payload) {
    try {
        let endpoint = config.API_URL + `/comment/${payload.params.idComment}`;
        const response = yield call(deleteApiAuth, endpoint); 
        const result = yield response;
        yield put({ type: actions.comment.DELETE_COMMENT_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.comment.DELETE_COMMENT_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Xóa bình luận thất bại ' + messageError),
        });
    }
}


///////////// sub comment
function* fetchSubComments(payload) {
    try {
        let endpoint = `${config.API_URL}/side_comment?binh_luan_id=${payload.params.idComment}`;
        const response = yield call(getApi, endpoint);
        const result = yield response.data;
        yield put({ type: actions.comment.GET_SUBCOMMENTS_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.comment.GET_SUBCOMMENTS_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu bình luận đã thất bại ' + messageError),
        });
    }
}

function* fetchSubComment(payload) {
    try {
        let endpoint = `${config.API_URL}/side_comment/${payload.params.id}`;
        const response = yield call(getApi, endpoint);
        const result = yield response.data;
        yield put({ type: actions.comment.GET_SUBCOMMENT_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.comment.GET_SUBCOMMENT_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Tải dữ liệu bình luận đã thất bại ' + messageError),
        });
    }
}

function* createSubComment(payload) {
    try {
        let endpoint = config.API_URL + '/side_comment/create';
        const response = yield call(postApiAuth, endpoint, payload.params); 
        const result = yield response;
        yield put({ type: actions.comment.CREATE_SUBCOMMENT_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.comment.CREATE_SUBCOMMENT_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Thêm bình luận mới thất bại ' + messageError),
        });
    }
}

function* editSubComment(payload) {
    try {
        let endpoint = config.API_URL + `/side_comment/${payload.params.idSubComment}`;
        const response = yield call(putApiAuth, endpoint, payload.params.formData); 
        const result = yield response;
        yield put({ type: actions.comment.EDIT_SUBCOMMENT_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.comment.EDIT_SUBCOMMENT_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Cập nhật thông tin bình luận thất bại ' + messageError),
        });
    }
}

function* deleteSubComment(payload) {
    try {
        let endpoint = config.API_URL + `/side_comment/${payload.params.idComment}`;
        const response = yield call(deleteApiAuth, endpoint); 
        const result = yield response;
        yield put({ type: actions.comment.DELETE_SUBCOMMENT_SUCCESS, result: result });
        if (payload.callback) {
            payload.callback(result);
        }
    } catch (error) {
        yield put({ type: actions.comment.DELETE_SUBCOMMENT_FAILED, error: error });
        let messageError = error.response.status === 403 ? error.response.data : '';
        notification.error({
            message: get(error, 'response.data.error', 'Xóa bình luận thất bại ' + messageError),
        });
    }
}




export function* loadComments() {
    yield takeEvery(actions.comment.GET_COMMENTS, fetchComments);
}

export function* loadComment() {
    yield takeEvery(actions.comment.GET_COMMENT, fetchComment);
}

export function* loadAddComment() {
    yield takeEvery(actions.comment.CREATE_COMMENT, createComment);
}

export function* loadEditComment() {
    yield takeEvery(actions.comment.EDIT_COMMENT, editComment);
}

export function* loadDeleteComment() {
    yield takeEvery(actions.comment.DELETE_COMMENT, deleteComment);
}



/////////////// sub comment
export function* loadSubComments() {
    yield takeEvery(actions.comment.GET_SUBCOMMENTS, fetchSubComments);
}

export function* loadSubComment() {
    yield takeEvery(actions.comment.GET_SUBCOMMENT, fetchSubComment);
}

export function* loadAddSubComment() {
    yield takeEvery(actions.comment.CREATE_SUBCOMMENT, createSubComment);
}

export function* loadEditSubComment() {
    yield takeEvery(actions.comment.EDIT_SUBCOMMENT, editSubComment);
}

export function* loadDeleteSubComment() {
    yield takeEvery(actions.comment.DELETE_SUBCOMMENT, deleteSubComment);
}