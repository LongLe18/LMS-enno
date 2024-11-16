export const GET_MENU = "GET_MENU";
export const GET_MENU_SUCCESS = "GET_MENU_SUCCESS";
export const GET_MENU_FAILED = "GET_MENU_FAILED";

export const GET_MENUS = "GET_MENUS";
export const GET_MENUS_SUCCESS = "GET_MENUS_SUCCESS";
export const GET_MENUS_FAILED = "GET_MENUS_FAILED";

export const GET_TYPES_MENU = "GET_TYPES_MENU";
export const GET_TYPES_MENU_SUCCESS = "GET_TYPES_MENU_SUCCESS";
export const GET_TYPES_MENU_FAILED = "GET_TYPES_MENU_FAILED";


export const DELETE_MENU = "DELETE_MENU";
export const DELETE_MENU_SUCCESS = "DELETE_MENU_SUCCESS";
export const DELETE_MENU_FAILED = "DELETE_MENU_FAILED";

export const EDIT_MENU = "EDIT_MENU";
export const EDIT_MENU_SUCCESS = "EDIT_MENU_SUCCESS";
export const EDIT_MENU_FAILED = "EDIT_MENU_FAILED";

export const CREATE_MENU = "CREATE_MENU";
export const CREATE_MENU_SUCCESS = "CREATE_MENU_SUCCESS";
export const CREATE_MENU_FAILED = "CREATE_MENU_FAILED";

export function getMenu(params, callback) {
    return {
        type: GET_MENU,
        params,
        callback,
    };
}

export function getMenus(params, callback) {
    return {
        type: GET_MENUS,
        params,
        callback,
    };
}

export function getTypesMenus(params, callback) {
    return {
        type: GET_TYPES_MENU,
        params,
        callback,
    };
}

export function DeleteMenu(params, callback) {
    return {
        type: DELETE_MENU,
        params,
        callback,
    };
}

export function EditMenu(params, callback) {
    return {
        type: EDIT_MENU,
        params,
        callback,
    };
}

export function CreateMenu(params, callback) {
    return {
        type: CREATE_MENU,
        params,
        callback,
    };
}