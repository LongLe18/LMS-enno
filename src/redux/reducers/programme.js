import * as programmeActions from '../actions/programme';

const initState = {
    item: {
        loading: false,
        result: {},
        erorr: null,
    },
    list: {
        loading: false,
        result: {},
        error: null,
    },
    courses: {
        loading: false,
        result: {},
        error: null,
    }
}

export default function programmeReducer(state = initState, action) {
    switch(action.type) {
        // get a programme
        case programmeActions.GET_PROGRAMME:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case programmeActions.GET_PROGRAMME_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case programmeActions.GET_PROGRAMME_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        // get a list of programmes
        case programmeActions.GET_PROGRAMMES:
            return {
                ...state,
                list: { ...state.list, loading: true },
            };
        case programmeActions.GET_PROGRAMMES_SUCCESS:
            return {
                ...state,
                list: { ...state.list, loading: false, result: action.result },
            };
        case programmeActions.GET_PROGRAMMES_FAILED:
            return {
                ...state,
                list: { ...state.list, loading: false, error: action.error },
            };
        // delete a programme
        case programmeActions.DELETE_PROGRAMME:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case programmeActions.DELETE_PROGRAMME_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case programmeActions.DELETE_PROGRAMME_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        // delete a list of programmes
        case programmeActions.DELETE_PROGRAMMES:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case programmeActions.DELETE_PROGRAMMES_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case programmeActions.DELETE_PROGRAMMES_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        // edit programme
        case programmeActions.EDIT_PROGRAMME:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case programmeActions.EDIT_PROGRAMME_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case programmeActions.EDIT_PROGRAMME_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error }
            }
        // create programme
        case programmeActions.CREATE_PROGRAMME:
            return {
                ...state,
                item: { ...state.item, loading: true },
            };
        case programmeActions.CREATE_PROGRAMME_SUCCESS:
            return {
                ...state,
                item: { ...state.item, loading: false, result: action.result },
            };
        case programmeActions.CREATE_PROGRAMME_FAILED:
            return {
                ...state,
                item: { ...state.item, loading: false, error: action.error },
            };
        // lấy tất nhóm khoa học theo khung chương trình
        case programmeActions.GET_PROGRAMME_COURSES:
            return {
                ...state,
                courses: { ...state.courses, loading: true },
            };
        case programmeActions.GET_PROGRAMME_COURSES_SUCCESS:
            return {
                ...state,
                courses: { ...state.courses, loading: false, result: action.result },
            };
        case programmeActions.GET_PROGRAMME_COURSES_FAILED:
            return {
                ...state,
                courses: { ...state.courses, loading: false, error: action.error },
            };
        default:
            return state;
    }
}