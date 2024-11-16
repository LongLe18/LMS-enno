import * as criteriaActions from '../actions/criteria';

const initState = {
    itemCourse: {
        loading: false,
        result: {},
        error: null,
    },
    listCourse: {
        loading: false,
        result: {},
        error: null,
    },
    itemModule: {
        loading: false,
        result: {},
        error: null,
    },
    itemModulebyId: {
        loading: false,
        result: {},
        error: null,
    },
    listModule: {
        loading: false,
        result: {},
        error: null,
    },
    itemThematic: {
        loading: false,
        result: {},
        error: null,
    },
    itemThematicById: {
        loading: false,
        result: {},
        error: null,
    },
    listThematic: {
        loading: false,
        result: {},
        error: null,
    },
    itemOnline: {
        loading: false,
        result: {},
        error: null,
    },
    itemOnlinebyId: {
        loading: false,
        result: {},
        error: null,
    },
    listOnline: {
        loading: false,
        result: {},
        error: null,
    },
    itemDGNL: {
        loading: false,
        result: {},
        error: null,
    },
    listDGNL: {
        loading: false,
        result: {},
        error: null,
    }
}

export default function criteriaReducer(state = initState, action) {
    switch(action.type) {
        // get a CRITERIA
        case criteriaActions.GET_CRITERIA_COURSE:
            return {
                ...state,
                itemCourse: { ...state.itemCourse, loading: true },
            };
        case criteriaActions.GET_CRITERIA_COURSE_SUCCESS:
            return {
                ...state,
                itemCourse: { ...state.itemCourse, loading: false, result: action.result },
            };
        case criteriaActions.GET_CRITERIA_COURSE_FAILED:
            return {
                ...state,
                itemCourse: { ...state.itemCourse, loading: false, error: action.error },
            };
        // get list of CRITERIAS
        case criteriaActions.GET_CRITERIAS_COURSE:
            return {
                ...state,
                listCourse: { ...state.listCourse, loading: true },
            };
        case criteriaActions.GET_CRITERIAS_COURSE_SUCCESS:
            return {
                ...state,
                listCourse: { ...state.listCourse, loading: false, result: action.result },
            };
        case criteriaActions.GET_CRITERIAS_COURSE_FAILED:
            return {
                ...state,
                listCourse: { ...state.listCourse, loading: false, error: action.error },
            };
        // create a CRITERIA
        case criteriaActions.CREATE_CRITERIA_COURSE:
            return {
                ...state,
                itemCourse: { ...state.itemCourse, loading: true },
            };
        case criteriaActions.CREATE_CRITERIA_COURSE_SUCCESS:
            return {
                ...state,
                itemCourse: { ...state.itemCourse, loading: false, result: action.result },
            };
        case criteriaActions.CREATE_CRITERIA_COURSE_FAILED:
            return {
                ...state,
                itemCourse: { ...state.itemCourse, loading: false, error: action.error },
            };
        // edit a CRITERIA
        case criteriaActions.EDIT_CRITERIA_COURSE:
            return {
                ...state,
                itemCourse: { ...state.itemCourse, loading: true },
            };
        case criteriaActions.EDIT_CRITERIA_COURSE_SUCCESS:
            return {
                ...state,
                itemCourse: { ...state.itemCourse, loading: false, result: action.result },
            };
        case criteriaActions.EDIT_CRITERIA_COURSE_FAILED:
            return {
                ...state,
                itemCourse: { ...state.itemCourse, loading: false, error: action.error },
            };
        // delete a CRITERIA
        case criteriaActions.DELETE_CRITERIA_COURSE:
            return {
                ...state,
                itemCourse: { ...state.itemCourse, loading: true },
            };
        case criteriaActions.DELETE_CRITERIA_COURSE_SUCCESS:
            return {
                ...state,
                itemCourse: { ...state.itemCourse, loading: false, result: action.result },
            };
        case criteriaActions.DELETE_CRITERIA_COURSE_FAILED:
            return {
                ...state,
                itemCourse: { ...state.itemCourse, loading: false, error: action.error },
            };
        
            ////////////////////////////////////////////
        // get a CRITERIA module by id Modun
        case criteriaActions.GET_CRITERIA_MODULE_ID:
            return {
                ...state,
                itemModulebyId: { ...state.itemModulebyId, loading: true },
            };
        case criteriaActions.GET_CRITERIA_MODULE_ID_SUCCESS:
            return {
                ...state,
                itemModulebyId: { ...state.itemModulebyId, loading: false, result: action.result },
            };
        case criteriaActions.GET_CRITERIA_MODULE_ID_FAILED:
            return {
                ...state,
                itemModulebyId: { ...state.itemModulebyId, loading: false, result: action.error },
            };
        // get a CRITERIA
        case criteriaActions.GET_CRITERIA_MODULE:
            return {
                ...state,
                itemModule: { ...state.itemModule, loading: true },
            };
        case criteriaActions.GET_CRITERIA_MODULE_SUCCESS:
            return {
                ...state,
                itemModule: { ...state.itemModule, loading: false, result: action.result },
            };
        case criteriaActions.GET_CRITERIA_MODULE_FAILED:
            return {
                ...state,
                itemModule: { ...state.itemModule, loading: false, error: action.error },
            };
        // get list of CRITERIAS
        case criteriaActions.GET_CRITERIAS_MODULE:
            return {
                ...state,
                listModule: { ...state.listModule, loading: true },
            };
        case criteriaActions.GET_CRITERIAS_MODULE_SUCCESS:
            return {
                ...state,
                listModule: { ...state.listModule, loading: false, result: action.result },
            };
        case criteriaActions.GET_CRITERIAS_MODULE_FAILED:
            return {
                ...state,
                listModule: { ...state.listModule, loading: false, error: action.error },
            };
        // create a CRITERIA
        case criteriaActions.CREATE_CRITERIA_MODULE:
            return {
                ...state,
                itemModule: { ...state.itemModule, loading: true },
            };
        case criteriaActions.CREATE_CRITERIA_MODULE_SUCCESS:
            return {
                ...state,
                itemModule: { ...state.itemModule, loading: false, result: action.result },
            };
        case criteriaActions.CREATE_CRITERIA_MODULE_FAILED:
            return {
                ...state,
                itemModule: { ...state.itemModule, loading: false, error: action.error },
            };
        // edit a CRITERIA
        case criteriaActions.EDIT_CRITERIA_MODULE:
            return {
                ...state,
                itemModule: { ...state.itemModule, loading: true },
            };
        case criteriaActions.EDIT_CRITERIA_MODULE_SUCCESS:
            return {
                ...state,
                itemModule: { ...state.itemModule, loading: false, result: action.result },
            };
        case criteriaActions.EDIT_CRITERIA_MODULE_FAILED:
            return {
                ...state,
                itemModule: { ...state.itemModule, loading: false, error: action.error },
            };
        // delete a CRITERIA
        case criteriaActions.DELETE_CRITERIA_MODULE:
            return {
                ...state,
                itemModule: { ...state.itemModule, loading: true },
            };
        case criteriaActions.DELETE_CRITERIA_MODULE_SUCCESS:
            return {
                ...state,
                itemModule: { ...state.itemModule, loading: false, result: action.result },
            };
        case criteriaActions.DELETE_CRITERIA_MODULE_FAILED:
            return {
                ...state,
                itemModule: { ...state.itemModule, loading: false, error: action.error },
            };

            /////////////////////////////////////////////
        // get a CRITERIA
        case criteriaActions.GET_CRITERIA_THEMATIC:
            return {
                ...state,
                itemThematic: { ...state.itemThematic, loading: true },
            };
        case criteriaActions.GET_CRITERIA_THEMATIC_SUCCESS:
            return {
                ...state,
                itemThematic: { ...state.itemThematic, loading: false, result: action.result },
            };
        case criteriaActions.GET_CRITERIA_THEMATIC_FAILED:
            return {
                ...state,
                itemThematic: { ...state.itemThematic, loading: false, error: action.error },
            };
            // get a CRITERIA
        case criteriaActions.GET_CRITERIA_THEMATIC_ID:
            return {
                ...state,
                itemThematicById: { ...state.itemThematicById, loading: true },
            };
        case criteriaActions.GET_CRITERIA_THEMATIC_ID_SUCCESS:
            return {
                ...state,
                itemThematicById: { ...state.itemThematicById, loading: false, result: action.result },
            };
        case criteriaActions.GET_CRITERIA_THEMATIC_ID_FAILED:
            return {
                ...state,
                itemThematicById: { ...state.itemThematicById, loading: false, error: action.error },
            };
        // get list of CRITERIAS
        case criteriaActions.GET_CRITERIAS_THEMATIC:
            return {
                ...state,
                listThematic: { ...state.listThematic, loading: true },
            };
        case criteriaActions.GET_CRITERIAS_THEMATIC_SUCCESS:
            return {
                ...state,
                listThematic: { ...state.listThematic, loading: false, result: action.result },
            };
        case criteriaActions.GET_CRITERIAS_THEMATIC_FAILED:
            return {
                ...state,
                listThematic: { ...state.listThematic, loading: false, error: action.error },
            };
        // create a CRITERIA
        case criteriaActions.CREATE_CRITERIA_THEMATIC:
            return {
                ...state,
                itemThematic: { ...state.itemThematic, loading: true },
            };
        case criteriaActions.CREATE_CRITERIA_THEMATIC_SUCCESS:
            return {
                ...state,
                itemThematic: { ...state.itemThematic, loading: false, result: action.result },
            };
        case criteriaActions.CREATE_CRITERIA_THEMATIC_FAILED:
            return {
                ...state,
                itemThematic: { ...state.itemThematic, loading: false, error: action.error },
            };
        // edit a CRITERIA
        case criteriaActions.EDIT_CRITERIA_THEMATIC:
            return {
                ...state,
                itemThematic: { ...state.itemThematic, loading: true },
            };
        case criteriaActions.EDIT_CRITERIA_THEMATIC_SUCCESS:
            return {
                ...state,
                itemThematic: { ...state.itemThematic, loading: false, result: action.result },
            };
        case criteriaActions.EDIT_CRITERIA_THEMATIC_FAILED:
            return {
                ...state,
                itemThematic: { ...state.itemThematic, loading: false, error: action.error },
            };
        // delete a CRITERIA
        case criteriaActions.DELETE_CRITERIA_THEMATIC:
            return {
                ...state,
                itemThematic: { ...state.itemThematic, loading: true },
            };
        case criteriaActions.DELETE_CRITERIA_THEMATIC_SUCCESS:
            return {
                ...state,
                itemThematic: { ...state.itemThematic, loading: false, result: action.result },
            };
        case criteriaActions.DELETE_CRITERIA_THEMATIC_FAILED:
            return {
                ...state,
                itemThematic: { ...state.itemThematic, loading: false, error: action.error },
            };
        
        ///////////////////////////////////////////////// Online criteria
        // get a CRITERIA
        case criteriaActions.GET_CRITERIA_ONLINE:
            return {
                ...state,
                itemOnline: { ...state.itemOnline, loading: true },
            };
        case criteriaActions.GET_CRITERIA_ONLINE_SUCCESS:
            return {
                ...state,
                itemOnline: { ...state.itemOnline, loading: false, result: action.result },
            };
        case criteriaActions.GET_CRITERIA_ONLINE_FAILED:
            return {
                ...state,
                itemOnline: { ...state.itemOnline, loading: false, error: action.error },
            };
        // get list of CRITERIAS
        case criteriaActions.GET_CRITERIAS_ONLINE:
            return {
                ...state,
                listOnline: { ...state.listOnline, loading: true },
            };
        case criteriaActions.GET_CRITERIAS_ONLINE_SUCCESS:
            return {
                ...state,
                listOnline: { ...state.listOnline, loading: false, result: action.result },
            };
        case criteriaActions.GET_CRITERIAS_ONLINE_FAILED:
            return {
                ...state,
                listOnline: { ...state.listOnline, loading: false, error: action.error },
            };
        // create a CRITERIA
        case criteriaActions.CREATE_CRITERIA_ONLINE:
            return {
                ...state,
                itemOnline: { ...state.itemOnline, loading: true },
            };
        case criteriaActions.CREATE_CRITERIA_ONLINE_SUCCESS:
            return {
                ...state,
                itemOnline: { ...state.itemOnline, loading: false, result: action.result },
            };
        case criteriaActions.CREATE_CRITERIA_ONLINE_FAILED:
            return {
                ...state,
                itemOnline: { ...state.itemOnline, loading: false, error: action.error },
            };
        // edit a CRITERIA
        case criteriaActions.EDIT_CRITERIA_ONLINE:
            return {
                ...state,
                itemOnline: { ...state.itemOnline, loading: true },
            };
        case criteriaActions.EDIT_CRITERIA_ONLINE_SUCCESS:
            return {
                ...state,
                itemOnline: { ...state.itemOnline, loading: false, result: action.result },
            };
        case criteriaActions.EDIT_CRITERIA_ONLINE_FAILED:
            return {
                ...state,
                itemOnline: { ...state.itemOnline, loading: false, error: action.error },
            };
        // delete a CRITERIA
        case criteriaActions.DELETE_CRITERIA_ONLINE:
            return {
                ...state,
                itemOnline: { ...state.itemOnline, loading: true },
            };
        case criteriaActions.DELETE_CRITERIA_ONLINE_SUCCESS:
            return {
                ...state,
                itemOnline: { ...state.itemOnline, loading: false, result: action.result },
            };
        case criteriaActions.DELETE_CRITERIA_ONLINE_FAILED:
            return {
                ...state,
                itemOnline: { ...state.itemOnline, loading: false, error: action.error },
            };
        ///////////////////////////////////////////////// DGNL criteria
        // get a CRITERIA
        case criteriaActions.GET_CRITERIA_DGNL:
            return {
                ...state,
                itemDGNL: { ...state.itemDGNL, loading: true },
            };
        case criteriaActions.GET_CRITERIA_DGNL_SUCCESS:
            return {
                ...state,
                itemDGNL: { ...state.itemDGNL, loading: false, result: action.result },
            };
        case criteriaActions.GET_CRITERIA_DGNL_FAILED:
            return {
                ...state,
                itemDGNL: { ...state.itemDGNL, loading: false, error: action.error },
            };
        // get list of CRITERIAS
        case criteriaActions.GET_CRITERIAS_DGNL:
            return {
                ...state,
                listDGNL: { ...state.listDGNL, loading: true },
            };
        case criteriaActions.GET_CRITERIAS_DGNL_SUCCESS:
            return {
                ...state,
                listDGNL: { ...state.listDGNL, loading: false, result: action.result },
            };
        case criteriaActions.GET_CRITERIAS_DGNL_FAILED:
            return {
                ...state,
                listDGNL: { ...state.listDGNL, loading: false, error: action.error },
            };
        // create a CRITERIA
        case criteriaActions.CREATE_CRITERIA_DGNL:
            return {
                ...state,
                itemDGNL: { ...state.itemDGNL, loading: true },
            };
        case criteriaActions.CREATE_CRITERIA_DGNL_SUCCESS:
            return {
                ...state,
                itemDGNL: { ...state.itemDGNL, loading: false, result: action.result },
            };
        case criteriaActions.CREATE_CRITERIA_DGNL_FAILED:
            return {
                ...state,
                itemDGNL: { ...state.itemDGNL, loading: false, error: action.error },
            };
        // edit a CRITERIA
        case criteriaActions.EDIT_CRITERIA_DGNL:
            return {
                ...state,
                itemDGNL: { ...state.itemDGNL, loading: true },
            };
        case criteriaActions.EDIT_CRITERIA_DGNL_SUCCESS:
            return {
                ...state,
                itemDGNL: { ...state.itemDGNL, loading: false, result: action.result },
            };
        case criteriaActions.EDIT_CRITERIA_DGNL_FAILED:
            return {
                ...state,
                itemDGNL: { ...state.itemDGNL, loading: false, error: action.error },
            };
        // delete a CRITERIA
        case criteriaActions.DELETE_CRITERIA_DGNL:
            return {
                ...state,
                itemDGNL: { ...state.itemDGNL, loading: true },
            };
        case criteriaActions.DELETE_CRITERIA_DGNL_SUCCESS:
            return {
                ...state,
                itemDGNL: { ...state.itemDGNL, loading: false, result: action.result },
            };
        case criteriaActions.DELETE_CRITERIA_DGNL_FAILED:
            return {
                ...state,
                itemDGNL: { ...state.itemDGNL, loading: false, error: action.error },
            };
        default:
            return state;
    }
}