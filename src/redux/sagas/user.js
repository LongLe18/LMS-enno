import { notification } from 'antd';
import { call, put, takeEvery } from 'redux-saga/effects';
import config from '../../configs/index';
import { getApi, postApi, deleteApi, putApi, postApiAuth, getApiAuth, putApiAuth, deleteApiAuth } from '../services/api';
import * as actions from '../actions';
import { get } from 'lodash';

function* fetchUserStaff(payload) {
    try {
      let endpoint = `${config.API_URL}/staff/${payload.params.nhan_vien_id}`;
      const response = yield call(getApiAuth, endpoint);
      const result = yield response.data;
      yield put({ type: actions.user.GET_USER_STAFF_SUCCESS, result });
      if (payload.params.isUpdateStorage) {
        result.data.ngay_sinh = new Date(new Date(result.data[0].ngay_sinh).getTime() + 1000 * 60 * 60 * 24).toISOString();
        localStorage.setItem('userInfo', JSON.stringify(result.data));
      }
      if (payload.callback) {
        payload.callback(result);
      }
    } catch (error) {
      yield put({ type: actions.user.GET_USER_STAFF_FAILED, error });
      // notification.error({
      //   message: get(error, 'response.data.error', 'Tải dữ liệu thành viên thất bại ' + messageError),
      // });
    }
}

function* fetchUserTeacher(payload) {
  try {
    let endpoint = `${config.API_URL}/teacher/${payload.params.giao_vien_id}`;
    const response = yield call(getApiAuth, endpoint);
    const result = yield response.data;
    yield put({ type: actions.user.GET_USER_TEACHER_SUCCESS, result });
    if (payload.params.isUpdateStorage) {
      result.data.ngay_sinh = new Date(new Date(result.data.ngay_sinh).getTime() + 1000 * 60 * 60 * 24).toISOString();
      localStorage.setItem('userInfo', JSON.stringify(result.data));
    }
    if (payload.callback) {
      payload.callback(result);
    }
  } catch (error) {
    yield put({ type: actions.user.GET_USER_TEACHER_FAILED, error });
    notification.error({
      message: get(error, 'response.data.error', 'Tải dữ liệu tài khoản thất bại '),
    });
  }
}

function* fetchUserStudent(payload) {
  try {
    let endpoint = `${config.API_URL}/student/${payload.params.hoc_vien_id}`;
    const response = yield call(getApiAuth, endpoint);
    const result = yield response.data;
    yield put({ type: actions.user.GET_USER_STUDENT_SUCCESS, result });
    if (payload.params.isUpdateStorage) {
      result.data.ngay_sinh = new Date(new Date(result.data.ngay_sinh).getTime() + 1000 * 60 * 60 * 24).toISOString();
      localStorage.setItem('userInfo', JSON.stringify(result.data));
    }
    if (payload.callback) {
      payload.callback(result);
    }
  } catch (error) {
    yield put({ type: actions.user.GET_USER_STUDENT_FAILED, error });
    // notification.error({
    //   message: get(error, 'response.data.error', 'Tải dữ liệu thành viên thất bại ' + messageError),
    // });
  }
}

function* fetchUsers(payload) {
    try {
      const endpoint = `${config.API_URL}/api/users`;
      const response = yield call(getApiAuth, endpoint);
      const data = yield response.data;
      yield put({ type: actions.user.GET_USERS_SUCCESS, result: data });
      if (payload.callback) {
        payload.callback(data);
      }
    } catch (error) {
      yield put({ type: actions.user.GET_USERS_FAILED, error });
      let messageError = error.response.status === 403 ? error.response.data : '';
      notification.error({
        message: get(error, error.response.data.error, 'Tải danh sách thành viên thất bại ' + messageError),
      });
    }
}

function* fetchStudents(payload) {
  try {
    const endpoint = `${config.API_URL}/student?ngay_bat_dau=${payload.params.startDay}&trang_thai=${payload.params.status}&search=${payload.params.search}&ngay_ket_thuc=${payload.params.endDay}&pageSize=${payload.params.pageSize}&pageIndex=${payload.params.pageIndex}&ttp_id=${payload.params.province}`;
    const response = yield call(getApiAuth, endpoint);
    const data = yield response.data;
    yield put({ type: actions.user.GET_STUDENTS_SUCCESS, result: data });
    if (payload.callback) {
      payload.callback(data);
    }
  } catch (error) {
    yield put({ type: actions.user.GET_STUDENTS_FAILED, error });
    let messageError = error.response.status === 403 ? error.response.data : ''
    notification.error({
      message: get(error, error.response.data.error, 'Tải danh sách học viên thất bại ' + messageError),
    });
  }
}

function* fetchTeachers(payload) {
  try {
    const endpoint = `${config.API_URL}/teacher?chuyen_nganh_id=${payload.params.idMajor}&trang_thai=${payload.params.status}&ngay_bat_dau=${payload.params.startDay}&ngay_ket_thuc=${payload.params.endDay}&search=${payload.params.search}`;
    const response = yield call(getApiAuth, endpoint);
    const data = yield response.data;
    yield put({ type: actions.user.GET_TEACHERS_SUCCESS, result: data });
    if (payload.callback) {
      payload.callback(data);
    }
  } catch (error) {
    yield put({ type: actions.user.GET_TEACHERS_FAILED, error });
    let messageError = error.response.status === 403 ? error.response.data : '';
    notification.error({
      message: get(error, error.response.data.error, 'Tải danh sách giáo viên thất bại ' + messageError),
    });
  }
}

function* fetchStaffs(payload) {
  try {
    const endpoint = `${config.API_URL}/staff?trang_thai=${payload.params.status}&ngay_bat_dau=${payload.params.startDay}&ngay_ket_thuc=${payload.params.endDay}&search=${payload.params.search}&limit=${payload.params.pageSize}&offset=${payload.params.pageIndex}`;
    const response = yield call(getApiAuth, endpoint);
    const data = yield response.data;
    yield put({ type: actions.user.GET_STAFFS_SUCCESS, result: data });
    if (payload.callback) {
      payload.callback(data);
    }
  } catch (error) {
    yield put({ type: actions.user.GET_STAFFS_FAILED, error });
    let messageError = error.response.status === 403 ? error.response.data : '';
    notification.error({
      message: get(error, error.response.data.error, 'Tải danh sách nhân viên thất bại ' + messageError),
    });
  }
}

function* deleteUser(payload) {
    try {
      const endpoint = `${config.API_URL}/api/user/${payload.params.id}`;
      const response = yield call(deleteApi, endpoint, payload.params.id);
      const data = yield response.data;
      yield put({ type: actions.user.DELETE_USER_SUCCESS, result: data });
      if (payload.callback) {
        payload.callback(data);
      }
    } catch (error) {
      yield put({ type: actions.user.DELETE_USER_FAILED, error });
      let messageError = error.response.status === 403 ? error.response.data : '';
      notification.error({
        message: get(error, 'response.data.error', 'Xóa thành viên thất bại ' + messageError),
      });
    }
}

function* deleteStudent(payload) {
  try {
    const endpoint = `${config.API_URL}/student/change-state/${payload.params.id}`;
    const response = yield call(getApiAuth, endpoint, payload.params.id);
    const data = yield response.data;
    yield put({ type: actions.user.DELETE_USER_SUCCESS, result: data });
    if (payload.callback) {
      payload.callback(data);
    }
  } catch (error) {
    yield put({ type: actions.user.DELETE_USER_FAILED, error });
    let messageError = error.response.status === 403 ? error.response.data : '';
    notification.error({
      message: get(error, 'response.data.error', 'Chuyển trạng thái học viên thất bại ' + messageError),
    });
  }
}

function* deleteStudent2(payload) {
  try {
    const endpoint = `${config.API_URL}/student/${payload.params.id}/force`;
    const response = yield call(deleteApiAuth, endpoint, payload.params.id);
    const data = yield response.data;
    yield put({ type: actions.user.DELETE_STUDENT_FORCE_SUCCESS, result: data });
    if (payload.callback) {
      payload.callback(data);
    }
  } catch (error) {
    yield put({ type: actions.user.DELETE_STUDENT_FORCE_FAILED, error });
    let messageError = error.response.status === 403 ? error.response.data : '';
    notification.error({
      message: get(error, 'response.data.error', 'Xóa học viên thất bại ' + messageError),
    });
  }
}

function* deleteStaff(payload) {
  try {
    const endpoint = `${config.API_URL}/staff/change-state/${payload.params.id}`;
    const response = yield call(getApiAuth, endpoint, payload.params.id);
    const data = yield response.data;
    yield put({ type: actions.user.DELETE_USER_SUCCESS, result: data });
    if (payload.callback) {
      payload.callback(data);
    }
  } catch (error) {
    yield put({ type: actions.user.DELETE_USER_FAILED, error });
    let messageError = error.response.status === 403 ? error.response.data : '';
    notification.error({
      message: get(error, 'response.data.error', 'Xóa nhân viên thất bại ' + messageError),
    });
  }
}

function* deleteTeacher(payload) {
  try {
    const endpoint = `${config.API_URL}/teacher/change-state/${payload.params.id}`;
    const response = yield call(getApiAuth, endpoint, payload.params.id);
    const data = yield response.data;
    yield put({ type: actions.user.DELETE_USER_SUCCESS, result: data });
    if (payload.callback) {
      payload.callback(data);
    }
  } catch (error) {
    yield put({ type: actions.user.DELETE_USER_FAILED, error });
    let messageError = error.response.status === 403 ? error.response.data : '';
    notification.error({
      message: get(error, 'response.data.error', 'Xóa giáo viên thất bại ' + messageError),
    });
  }
}

function* deleteUsers(payload) {
    try {
      const endpoint = `${config.API_URL}/api/delete-users`;
      const response = yield call(postApi, endpoint, payload.params);
      const data = yield response.data;
      yield put({ type: actions.user.DELETE_USERS_SUCCESS, result: data });
      if (payload.callback) {
        payload.callback(data);
      }
    } catch (error) {
      yield put({ type: actions.user.DELETE_USERS_FAILED, error });
      let messageError = error.response.status === 403 ? error.response.data : '';
      notification.error({
        message: get(error, 'response.data.error', 'Xóa nhiều thành viên thất bại ' + messageError),
      });
    }
}

function* editUser(payload) {
    try {
      const endpoint = `${config.API_URL}/api/user/${payload.params.nhan_vien_id}`;
      const response = yield call(putApi, endpoint, payload.params);
      const result = yield response.data;
      yield put({ type: actions.user.EDIT_USER_SUCCESS, result });
      if (payload.callback) {
        payload.callback(result);
      }
    } catch (error) {
      yield put({ type: actions.user.EDIT_USER_FAILED, error });
      let messageError = error.response.status === 403 ? error.response.data : '';
      notification.error({
        message: get(error, 'response.data.error', 'Cập nhật thành viên thất bại ' + messageError),
      });
    }
}

function* editStaff(payload) {
  try {
    const endpoint = `${config.API_URL}/staff/${payload.params.nhan_vien_id}`;
    const response = yield call(putApiAuth, endpoint, payload.params.formData);
    const result = yield response.data;
    yield put({ type: actions.user.EDIT_STAFF_SUCCESS, result });
    if (payload.callback) {
      payload.callback(result);
    }
  } catch (error) {
    yield put({ type: actions.user.EDIT_STAFF_FAILED, error });
    let messageError = error.response.status === 403 ? error.response.data : '';
    notification.error({
      message: get(error, 'response.data.error', 'Cập nhật thành viên thất bại ' + messageError),
    });
  }
}

function* editStudent(payload) {
  try {
    const endpoint = `${config.API_URL}/student/${payload.params.hoc_vien_id}`;
    const response = yield call(putApiAuth, endpoint, payload.params.formData);
    const result = yield response.data;
    yield put({ type: actions.user.EDIT_STUDENT_SUCCESS, result });
    if (payload.callback) {
      payload.callback(result);
    }
  } catch (error) {
    yield put({ type: actions.user.EDIT_STUDENT_FAILED, error });
    let messageError = error.response.status === 403 ? error.response.data : '';
    notification.error({
      message: get(error, 'response.data.error', 'Cập nhật thành viên thất bại ' + messageError),
    });
  }
}

function* editTeacher(payload) {
  try {
    const endpoint = `${config.API_URL}/teacher/${payload.params.giao_vien_id}`;
    const response = yield call(putApiAuth, endpoint, payload.params.formData);
    const result = yield response.data;
    yield put({ type: actions.user.EDIT_TEACHER_SUCCESS, result });
    if (payload.callback) {
      payload.callback(result);
    }
  } catch (error) {
    yield put({ type: actions.user.EDIT_TEACHER_FAILED, error });
    let messageError = error.response.status === 403 ? error.response.data : '';
    notification.error({
      message: get(error, 'response.data.error', 'Cập nhật thành viên thất bại ' + messageError),
    });
  }
}

function* createUser(payload) {
    try {
      const endpoint = `${config.API_URL}/api/user`;
      const response = yield call(postApi, endpoint, {
        ...payload.params,
        // nguoi_tao: userInfo.nhan_vien_id,
        // ngay_tao: moment().format(),
      });
      const data = yield response.data;
      yield put({ type: actions.user.CREATE_USER_SUCCESS, result: data });
      //yield put({ type: actions.user.GET_USER_SUCCESS, result: data });
      if (payload.callback) {
        payload.callback(data);
      }
    } catch (error) {
      yield put({ type: actions.user.CREATE_USER_FAILED, error });
      let messageError = error.response.status === 403 ? error.response.data : '';
      notification.error({
        message: get(error, 'response.data.error', 'Tạo mới thành viên thất bại ' + messageError),
      });
    }
}

function* createStudent(payload) {
  try {
    const endpoint = `${config.API_URL}/student/adminCreate`;
    const response = yield call(postApiAuth, endpoint, payload.params);
    const data = yield response.data;
    yield put({ type: actions.user.CREATE_STUDENT_SUCCESS, result: data });
    if (payload.callback) {
      payload.callback(data);
    }
  } catch (error) {
    yield put({ type: actions.user.CREATE_STUDENT_FAILED, error });
    let messageError = error.response.status === 403 ? error.response.data : error.response.data.message;
    notification.error({
      message: get(error, 'response.data.error', 'Tạo mới học viên thất bại: ' + messageError),
    });
  }
}

function* createTeacher(payload) {
  try {
    const endpoint = `${config.API_URL}/teacher/create`;
    const response = yield call(postApiAuth, endpoint, payload.params);
    const data = yield response.data;
    yield put({ type: actions.user.CREATE_TEACHER_SUCCESS, result: data });
    if (payload.callback) {
      payload.callback(data);
    }
  } catch (error) {
    yield put({ type: actions.user.CREATE_TEACHER_FAILED, error });
    let messageError = error.response.status === 403 ? error.response.data : error.response.data.message;
    notification.error({
      message: get(error, 'response.data.error', 'Tạo mới giáo viên thất bại ' + messageError),
    });
  }
}

function* createStaff(payload) {
  try {
    const endpoint = `${config.API_URL}/staff/create`;
    const response = yield call(postApiAuth, endpoint, payload.params);
    const data = yield response.data;
    yield put({ type: actions.user.CREATE_STAFF_SUCCESS, result: data });
    if (payload.callback) {
      payload.callback(data);
    }
  } catch (error) {
    yield put({ type: actions.user.CREATE_STAFF_FAILED, error });
    let messageError = error.response.status === 403 ? error.response.data : error.response.data.message;
    notification.error({
      message: get(error, 'response.data.error', 'Tạo mới nhân viên thất bại ' + messageError),
    });
  }
}

function* login(payload) {
    try {
      const endpoint = config.API_URL + `/auth/login?loai_tai_khoan=${payload.params.type}`;
      const response = yield call(postApi, endpoint, payload.params.login);
      const data = yield response;
      if (data.data.status === "fail") {
        yield put({ type: actions.user.LOGIN_USER_FAILED, error: data });
        notification.error({
          message: 'Đăng nhập thất bại \n' + data.data.message,
        });        
      } 
      else {
        yield put({ type: actions.user.LOGIN_USER_SUCCESS, result: data });
        localStorage.setItem('userToken', data.data.access_token);
        if (payload.callback) {
          payload.callback(data);
        }
      }
    } catch (error) {
      yield put({
        type: actions.user.LOGIN_USER_FAILED,
        error: error,
      });
      notification.error({
        message: 'Đăng nhập thất bại',
      });
    }
}

function* logout(payload) {
    try {
      const endpoint = config.API_URL + '/auth/logout';
      const response = yield call(postApiAuth, endpoint);
      localStorage.removeItem('userToken');
      localStorage.removeItem('userInfo');
      localStorage.removeItem('_grecaptcha');
      const data = yield response;
      yield put({ type: actions.user.LOGOUT_USER_SUCCESS, result: data });
      if (payload.callback) {
        payload.callback(data);
      }
    } catch (error) {
      yield put({ type: actions.user.LOGOUT_USER_FAILED, error });
    }
}

function* verify(payload) {
  try {
    const endpoint = config.API_URL + '/auth/confirm/' + payload.params.token;
    const response = yield call(getApi, endpoint);
    const data = yield response.data;
    yield put({ type: actions.user.VERIFY_USER_SUCCESS, result: data });
    if (payload.callback) {
      payload.callback(data);
    }
  } catch (error) {
    yield put({ type: actions.user.VERIFY_USER_FAILED, error });
    notification.error({
      message: get(error, 'response.data.error', 'Xác minh tài khoản thất bại'),
    });
  }
}

function* forgotPassword(payload) {
  try {
    const endpoint = config.API_URL + `/auth/forget-password?loai_tai_khoan=${payload.params.typeUser}`;
    const response = yield call(postApi, endpoint, payload.params.email);
    const data = yield response.data;
    yield put({ type: actions.user.FORGOT_PASSWORD_SUCCESS, result: data });
    if (payload.callback) {
      payload.callback(data);
    }
  } catch (error) {
    yield put({ type: actions.user.FORGOT_PASSWORD_FAILED, error });
    notification.error({
      message: get(error, 'response.data.error', 'Email không tồn tại'),
    });
  }
}

function* registerUser(payload) {
  try {
    const endpoint = `${config.API_URL}/auth/register?loai_tai_khoan=${payload.params.type}`;
    const response = yield call(postApi, endpoint, payload.params.register);
    const data = yield response.data;
    yield put({ type: actions.user.REGISTER_USER_SUCCESS, result: data });
    if (payload.callback) {
      payload.callback(data);
    }
  } catch (error) {
    yield put({
      type: actions.user.REGISTER_USER_FAILED,
      error: error.response.data.message,
    });
    notification.error({
      message: error.response.data.message ? 'Email này đã tồn tại' : 'Đăng ký tài khoản thất bại ',
    });
  }
}

function* changePasswordUser(payload) {
  try {
    const endpoint = `${config.API_URL}/auth/change-pass`;
    const response = yield call(postApiAuth, endpoint, payload.params);
    const data = yield response.data;
    yield put({ type: actions.user.CHANGE_PASSWORD_SUCCESS, result: data });
    if (payload.callback) {
      payload.callback(data);
    }
  } catch (error) {
    yield put({
      type: actions.user.CHANGE_PASSWORD_FAILED,
      error: error.response.data.error ? error.response.data.error : 'Đổi mật khẩu thất bại',
    });
    notification.error({
      message: error.response.data.error ? error.response.data.error : 'Đổi mật khẩu thất bại: Mật khẩu cũ không đúng',
    });
  }
}

function* fetchRankUser(payload) {
  try {
    const endpoint = config.API_URL + `/student/v2?diem_tuan=${payload.params.diem}`;
    const response = yield call(getApi, endpoint);
    const data = yield response.data;
    yield put({ type: actions.user.GET_USER_RANK_SUCCESS, result: data });
    if (payload.callback) {
      payload.callback(data);
    }
  } catch (error) {
    yield put({ type: actions.user.GET_USER_RANK_FAILED, error });
    notification.error({
      message: get(error, 'response.data.error', 'Lấy dữ liệu xếp hạng thất bại'),
    });
  }
}

function* fetchRankUser2(payload) {
  try {
    const endpoint = config.API_URL + `/student/v3?${payload.params.diem}`;
    const response = yield call(getApiAuth, endpoint);
    const data = yield response.data;
    yield put({ type: actions.user.GET_USER_RANK_2_SUCCESS, result: data });
    if (payload.callback) {
      payload.callback(data);
    }
  } catch (error) {
    yield put({ type: actions.user.GET_USER_RANK_2_FAILED, error });
    notification.error({
      message: get(error, 'response.data.error', 'Lấy dữ liệu xếp hạng thất bại'),
    });
  }
}

function* registerContest(payload) {
  try {
    const endpoint = `${config.API_URL}/auth/register/v3`;
    const response = yield call(postApi, endpoint, payload.params.register);
    const data = yield response.data;
    yield put({ type: actions.user.REGISTER_CONETST_SUCCESS, result: data });
    if (payload.callback) {
      payload.callback(data);
    }
  } catch (error) {
    yield put({ type: actions.user.REGISTER_CONETST_FAILED, error });
    let messageError = error.response.status === 409 ? error.response.data.message : '';
    console.log(error.response);
    notification.error({
      message: get(error, 'response.data.error', 'Đăng ký thông tin thất bại ' + messageError),
    });
  }
}

export function* loadRegisterContest() {
  yield takeEvery(actions.user.REGISTER_CONETST, registerContest);
}

export function* loadChagePassword() {
  yield takeEvery(actions.user.CHANGE_PASSWORD, changePasswordUser);
}

export function* loadUserStaff() {
    yield takeEvery(actions.user.GET_USER_STAFF, fetchUserStaff);
}

export function* loadUserStudent() {
  yield takeEvery(actions.user.GET_USER_STUDENT, fetchUserStudent);
}

export function* loadUserTeacher() {
  yield takeEvery(actions.user.GET_USER_TEACHER, fetchUserTeacher);
}

export function* loadUsers() {
    yield takeEvery(actions.user.GET_USERS, fetchUsers);
}

export function* loadStudents() {
  yield takeEvery(actions.user.GET_STUDENTS, fetchStudents);
}

export function* loadTeachers() {
  yield takeEvery(actions.user.GET_TEACHERS, fetchTeachers);
}

export function* loadStaffs() {
  yield takeEvery(actions.user.GET_STAFFS, fetchStaffs);
}

export function* loadDeleteUser() {
    yield takeEvery(actions.user.DELETE_USER, deleteUser);
}

export function* loadDeleteStudent() {
  yield takeEvery(actions.user.DELETE_STUDENT, deleteStudent);
}

export function* loadDeleteStudent2() {
  yield takeEvery(actions.user.DELETE_STUDENT_FORCE, deleteStudent2);
}

export function* loadDeleteTeacher() {
  yield takeEvery(actions.user.DELETE_TEACHER, deleteTeacher);
}

export function* loadDeleteStaff() {
  yield takeEvery(actions.user.DELETE_STAFF, deleteStaff);
}

export function* loadDeleteUsers() {
    yield takeEvery(actions.user.DELETE_USERS, deleteUsers);
}

export function* loadEditUser() {
    yield takeEvery(actions.user.EDIT_USER, editUser);
}

export function* loadEditStudent() {
  yield takeEvery(actions.user.EDIT_STUDENT, editStudent);
}

export function* loadEditTeacher() {
  yield takeEvery(actions.user.EDIT_TEACHER, editTeacher);
}

export function* loadEditStaff() {
  yield takeEvery(actions.user.EDIT_STAFF, editStaff);
}

export function* loadCreateUser() {
    yield takeEvery(actions.user.CREATE_USER, createUser);
}

export function* loadCreateStudent() {
  yield takeEvery(actions.user.CREATE_STUDENT, createStudent);
}

export function* loadCreateTeacher() {
  yield takeEvery(actions.user.CREATE_TEACHER, createTeacher);
}

export function* loadCreateStaff() {
  yield takeEvery(actions.user.CREATE_STAFF, createStaff);
}

export function* loadLogin() {
    yield takeEvery(actions.user.LOGIN_USER, login);
}
  
export function* loadLogout() {
    yield takeEvery(actions.user.LOGOUT_USER, logout);
}
  
export function* loadVerify() {
    yield takeEvery(actions.user.VERIFY_USER, verify);
}

export function* loadRegister() {
    yield takeEvery(actions.user.REGISTER_USER, registerUser);
}

export function* loadRankUser() {
  yield takeEvery(actions.user.GET_USER_RANK, fetchRankUser);
}

export function* loadRankUser2() {
  yield takeEvery(actions.user.GET_USER_RANK_2, fetchRankUser2);
}

export function* loadForgotPassword() {
  yield takeEvery(actions.user.FORGOT_PASSWORD, forgotPassword);
}