import * as userActions from '../actions/user';

const initState = {
    item: {
        loading: false,
        result: {},
        error: null,
    },
    user: {
        loading: false,
        result: {},
        error: null,
    },
    staff: {
        loading: false,
        result: {},
        error: null,
    },
    teacher: {
        loading: false,
        result: {},
        error: null,
    },
    list: {
        loading: false,
        result: {},
        error: null,
    },
    listUser: {
        loading: false,
        result: {},
        error: null,
    },
    listTeacher: {
        loading: false,
        result: {},
        error: null,
    },
    listStaff: {
        loading: false,
        result: {},
        error: null,
    },
    login: {
        loading: false,
        result: {},
    },
    logout: {
        loading: false,
        result: {},
    },
    forgotPassword: {
        loading: false,
        result: {},
        error: null,
    },
    verify: {
        loading: false,
        result: {},
    },
    rankUser: {
        loading: false,
        result: {},
        error: null,
    },
    rankUser2: {
        loading: false,
        result: {},
        error: null,
    },
    register: {
        loading: false,
        result: {},
        error: null,
    },
}

export default function userReducer(state = initState, action) {
    switch(action.type) {
        // get a user
        case userActions.GET_USER_STAFF:
            return {
                ...state,
                staff: { ...state.staff, loading: true },
            };
        case userActions.GET_USER_STAFF_SUCCESS:
            return {
                ...state,
                staff: { ...state.staff, loading: false, result: action.result },
            };
        case userActions.GET_USER_STAFF_FAILED:
            return {
                ...state,
                staff: { ...state.staff, loading: false, error: action.error },
            };
        // get a user
        case userActions.GET_USER_TEACHER:
            return {
                ...state,
                teacher: { ...state.teacher, loading: true },
            };
        case userActions.GET_USER_TEACHER_SUCCESS:
            return {
                ...state,
                teacher: { ...state.teacher, loading: false, result: action.result },
            };
        case userActions.GET_USER_TEACHER_FAILED:
            return {
                ...state,
                teacher: { ...state.teacher, loading: false, error: action.error },
            };
        // get a user
        case userActions.GET_USER_STUDENT:
            return {
                ...state,
                user: { ...state.user, loading: true },
            };
        case userActions.GET_USER_STUDENT_SUCCESS:
            return {
                ...state,
                user: { ...state.user, loading: false, result: action.result },
            };
        case userActions.GET_USER_STUDENT_FAILED:
            return {
                ...state,
                user: { ...state.user, loading: false, error: action.error },
            };
        // get a list of user
        case userActions.GET_USERS:
            return {
                ...state,
                list: { ...state.list, loading: true },
            };
        case userActions.GET_USERS_SUCCESS:
            return {
                ...state,
                list: { ...state.list, loading: false, result: action.result },
            };
        case userActions.GET_USERS_FAILED:
            return {
                ...state,
                list: { ...state.list, loading: false, error: action.error },
            };
        // get a list of teacher
        case userActions.GET_TEACHERS:
            return {
                ...state,
                listTeacher: { ...state.listTeacher, loading: true },
            };
        case userActions.GET_TEACHERS_SUCCESS:
            return {
                ...state,
                listTeacher: { ...state.listTeacher, loading: false, result: action.result },
            };
        case userActions.GET_TEACHERS_FAILED:
            return {
                ...state,
                listTeacher: { ...state.listTeacher, loading: false, error: action.error },
            };
        // get a list of students
        case userActions.GET_STUDENTS:
            return {
                ...state,
                listUser: { ...state.listUser, loading: true },
            };
        case userActions.GET_STUDENTS_SUCCESS:
            return {
                ...state,
                listUser: { ...state.listUser, loading: false, result: action.result },
            };
        case userActions.GET_STUDENTS_FAILED:
            return {
                ...state,
                listUser: { ...state.listUser, loading: false, error: action.error },
            };
        // get a list of staff
        case userActions.GET_STAFFS:
            return {
                ...state,
                listStaff: { ...state.listStaff, loading: true },
            };
        case userActions.GET_STAFFS_SUCCESS:
            return {
                ...state,
                listStaff: { ...state.listStaff, loading: false, result: action.result },
            };
        case userActions.GET_STAFFS_FAILED:
            return {
                ...state,
                listStaff: { ...state.listStaff, loading: false, error: action.error },
            };
        // delte a  user
        case userActions.DELETE_USER:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case userActions.DELETE_USER_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case userActions.DELETE_USER_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        // delete a  student
        case userActions.DELETE_STUDENT:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case userActions.DELETE_STUDENT_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case userActions.DELETE_STUDENT_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        // delete a  student force
        case userActions.DELETE_STUDENT_FORCE:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case userActions.DELETE_STUDENT_FORCE_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case userActions.DELETE_STUDENT_FORCE_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        // delete a  teacher
        case userActions.DELETE_TEACHER:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case userActions.DELETE_TEACHER_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case userActions.DELETE_TEACHER_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        // delete a  staff
        case userActions.DELETE_STAFF:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case userActions.DELETE_STAFF_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case userActions.DELETE_STAFF_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        // delete a  list of users
        case userActions.DELETE_USERS:
            return {
                ...state,
                list: { ...state.list, loading: true },
            };
        case userActions.DELETE_USERS_SUCCESS:
            return {
                ...state,
                list: { ...state.list, loading: false, result: action.result },
            };
        case userActions.DELETE_USERS_FAILED:
            return {
                ...state,
                list: { ...state.list, loading: false, error: action.error },
            };
        // edit a user
        case userActions.EDIT_USER:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case userActions.EDIT_USER_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case userActions.EDIT_USER_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error }
            }
        // edit a student
        case userActions.EDIT_STUDENT:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case userActions.EDIT_STUDENT_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case userActions.EDIT_STUDENT_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error }
            }
        // edit a teacher
        case userActions.EDIT_TEACHER:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case userActions.EDIT_TEACHER_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case userActions.EDIT_TEACHER_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error }
            }
        // edit a staff
        case userActions.EDIT_STAFF:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case userActions.EDIT_STAFF_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case userActions.EDIT_STAFF_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error }
            }
        // create a user
        case userActions.CREATE_USER:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case userActions.CREATE_USER_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case userActions.CREATE_USER_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        // create a Student
        case userActions.CREATE_STUDENT:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case userActions.CREATE_STUDENT_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case userActions.CREATE_STUDENT_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        // create a Staff
        case userActions.CREATE_STAFF:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case userActions.CREATE_STAFF_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case userActions.CREATE_STAFF_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        // create a teacher
        case userActions.CREATE_TEACHER:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case userActions.CREATE_TEACHER_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case userActions.CREATE_TEACHER_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        // login
        case userActions.LOGIN_USER:
            return {
                ...state,
                login: { ...state.login, loading: true },
            };
        case userActions.LOGIN_USER_SUCCESS:
            return {
                ...state,
                login: { ...state.login, loading: false, result: action.result },
            };
        case userActions.LOGIN_USER_FAILED:
            return {
                ...state,
                login: { ...state.login, loading: false, result: action.error },
            };
        // logout
        case userActions.LOGOUT_USER:
            return {
                ...state,
                logout: { ...state.logout, loading: true },
            };
        case userActions.LOGOUT_USER_SUCCESS:
            return {
                ...state,
                logout: { ...state.logout, loading: false, result: action.result },
            };
        case userActions.LOGOUT_USER_FAILED:
            return {
                ...state,
                logout: { ...state.logout, loading: false, result: action.error },
            };
        // verify
        case userActions.VERIFY_USER:
            return {
                ...state,
                verify: { ...state.verify, loading: true },
            };
        case userActions.VERIFY_USER_SUCCESS:
            return {
                ...state,
                verify: { ...state.verify, loading: false, result: action.result },
            };
        case userActions.VERIFY_USER_FAILED:
            return {
                ...state,
                verify: { ...state.verify, loading: false, result: action.error },
            };
        ///////////////////////////////////////////
        case userActions.GET_USER_RANK:
            return {
                ...state,
                rankUser: { ...state.rankUser, loading: true },
            };
        case userActions.GET_USER_RANK_SUCCESS:
            return {
                ...state,
                rankUser: { ...state.rankUser, loading: false, result: action.result },
            };
        case userActions.GET_USER_RANK_FAILED:
            return {
                ...state,
                rankUser: { ...state.rankUser, loading: false, result: action.error },
            };
        ///////////////////////////////////////////////
        case userActions.GET_USER_RANK_2:
            return {
                ...state,
                rankUser2: { ...state.rankUser2, loading: true },
            };
        case userActions.GET_USER_RANK_2_SUCCESS:
            return {
                ...state,
                rankUser2: { ...state.rankUser2, loading: false, result: action.result },
            };
        case userActions.GET_USER_RANK_2_FAILED:
            return {
                ...state,
                rankUser2: { ...state.rankUser2, loading: false, result: action.error },
            };
        case userActions.FORGOT_PASSWORD:
            return {
                ...state,
                forgotPassword: { ...state.forgotPassword, loading: true },
            };
        case userActions.FORGOT_PASSWORD_SUCCESS:
            return { 
                ...state, 
                forgotPassword: { ...state.forgotPassword, loading: false, result: action.result }
            };
        case userActions.FORGOT_PASSWORD_FAILED:
            return { 
                ...state, 
                forgotPassword: { ...state.forgotPassword, loading: false, result: action.error }
            };
        // register
        case userActions.REGISTER_USER:
            return {
                ...state,
                register: { ...state.register, loading: true },
            };
        case userActions.REGISTER_USER_SUCCESS:
            return { 
                ...state, 
                register: { ...state.register, loading: false, result: action.result }
            };
        case userActions.REGISTER_USER_FAILED:
            return { 
                ...state, 
                register: { ...state.register, loading: false, result: action.error }
            };
        // register contest
        case userActions.REGISTER_CONETST:
            return {
                ...state,
                register: { ...state.register, loading: true },
            };
        case userActions.REGISTER_CONETST_SUCCESS:
            return { 
                ...state, 
                register: { ...state.register, loading: false, result: action.result }
            };
        case userActions.REGISTER_CONETST_FAILED:
            return { 
                ...state, 
                register: { ...state.register, loading: false, result: action.error }
            };
        default:
            return state;
    }
}