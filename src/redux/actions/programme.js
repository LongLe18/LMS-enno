// get a programme
export const GET_PROGRAMME = 'GET_PROGRAMME';
export const GET_PROGRAMME_SUCCESS = 'GET_PROGRAMME_SUCCESS';
export const GET_PROGRAMME_FAILED = 'GET_PROGRAMME_FAIL';

// get a list of programme
export const GET_PROGRAMMES = 'GET_PROGRAMMES';
export const GET_PROGRAMMES_SUCCESS = 'GET_PROGRAMMES_SUCCESS';
export const GET_PROGRAMMES_FAILED = 'GET_PROGRAMMES_FAIL';

// delete a programme
export const DELETE_PROGRAMME = 'DELETE_PROGRAMME';
export const DELETE_PROGRAMME_SUCCESS = 'DELETE_PROGRAMME_SUCCESS';
export const DELETE_PROGRAMME_FAILED = 'DELETE_PROGRAMME_FAIL';

// delete a list of programme
export const DELETE_PROGRAMMES = 'DELETE_PROGRAMMES';
export const DELETE_PROGRAMMES_SUCCESS = 'DELETE_PROGRAMMES_SUCCESS';
export const DELETE_PROGRAMMES_FAILED = 'DELETE_PROGRAMMES_FAIL';

// edit a programme
export const EDIT_PROGRAMME = 'EDIT_PROGRAMME';
export const EDIT_PROGRAMME_SUCCESS = 'EDIT_PROGRAMME_SUCCESS';
export const EDIT_PROGRAMME_FAILED = 'EDIT_PROGRAMME_FAIL';

// create a programme
export const CREATE_PROGRAMME = 'CREATE_PROGRAMME';
export const CREATE_PROGRAMME_SUCCESS = 'CREATE_PROGRAMME_SUCCESS';
export const CREATE_PROGRAMME_FAILED = 'CREATE_PROGRAMME_FAIL';

// lấy tất nhóm khoa học theo khung chương trình
export const GET_PROGRAMME_COURSES = 'GET_PROGRAMME_COURSES';
export const GET_PROGRAMME_COURSES_SUCCESS = 'GET_PROGRAMME_COURSES_SUCCESS';
export const GET_PROGRAMME_COURSES_FAILED = 'GET_PROGRAMME_COURSES_FAIL';

export function getProgrammeCourses(params, callback) {
    return {
        type: GET_PROGRAMME_COURSES,
        params,
        callback,
    };

}


export function getProgramme(params, callback) {
    return {
        type: GET_PROGRAMME,
        params,
        callback,
    };
}

export function getProgrammes(params, callback) {
    return {
        type: GET_PROGRAMMES,
        params,
        callback,
    };
}

export function deleteProgramme(params, callback) {
    return {
        type: DELETE_PROGRAMME,
        params,
        callback,
    };
}

export function deleteProgrammes(params, callback) {
    return {
        type: DELETE_PROGRAMMES,
        params,
        callback,
    };
}

export function editProgramme(params, callback) {
    return {
        type: EDIT_PROGRAMME,
        params,
        callback,
    };
}

export function createProgramme(params, callback) {
    return {
        type: CREATE_PROGRAMME,
        params,
        callback,
    }
}