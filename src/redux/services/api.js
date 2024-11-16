import axios from 'axios';
import { notification } from 'antd';
import config from '../../configs/index';

const getHeader = () => {
    const token = localStorage.getItem('userToken');
    return {
        Authorization: `Bearer ${token}`,
        // 'Content-Type': 'application/json',
    }
}

const getHeaderUpload = () => {
    const token = localStorage.getItem('userToken');
    return {
      Authorization: `Bearer ${token}`,
    };
};

export function getApiAuth(url) {
    return axios({
        method: 'get',
        url,
        timeout: 1000 * 60 * 5,
        headers: getHeader(),
    }).catch(function(error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data);
            console.log(error.response.status);
      
            if (error.response.status === 401) {
                const data = {'userId': JSON.parse(localStorage.getItem('userInfo'))?.hoc_vien_id};
                axios({
                    method: 'post',
                    url: `${config.API_URL}/auth/logout/v2`,
                    timeout: 1000 * 60 * 5,
                    data,
                })
                localStorage.removeItem('userToken');
                localStorage.removeItem('userInfo');
                window.location.reload();
                notification.error({
                    message: 'Phiên đăng nhập của bạn đã hết hạn.',
                });
                return Promise.resolve({});
            }
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
        }
            console.log(error.config);
            return Promise.reject(error);
    });
}

export function getApi(url) {
    return axios({
        method: 'get',
        url,
        timeout: 1000 * 60 * 5,
    }).catch(function(error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
      
            if (error.response.status === 401) {
                localStorage.removeItem('userToken');
                localStorage.removeItem('userInfo');
                window.location.reload();
                notification.error({
                    message: 'Phiên đăng nhập của bạn đã hết hạn.',
                });
                // window.location.replace(`${window.location.origin}/luyen-tap/trang-chu`)
                return Promise.resolve({});
            }
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
        }
        console.log(error.config);
        return Promise.reject(error);
    });
}

export function deleteApiAuth(url) {
    return axios({
        method: 'delete',
        url,
        timeout: 1000 * 60 * 5,
        headers: getHeader(),
    }).catch(function (error) {
        console.log(`API error: ${error}`);
        return Promise.reject(error);
    });
}

export function deleteApi(url) {
    return axios({
        method: 'delete',
        url,
        timeout: 1000 * 60 * 5,
    }).catch(function (error) {
        console.log(`API error: ${error}`);
        return Promise.reject(error);
    });
}

export function postApi(url, data) {
    return axios({
        method: 'post',
        url,
        timeout: 1000 * 60 * 5,
        data,
    }).catch(function (error) {
        console.log(`API error: ${error}`);
        return Promise.reject(error);
    });
}

export function postApiAuth(url, data) {
    return axios({
        method: 'post',
        url,
        timeout: 1000 * 60 * 5,
        data,
        headers: getHeader(),
    }).catch(function (error) {
        console.log(`API error: ${error}`);
        return Promise.reject(error);
    });
}

export function putApi(url, data) {
    return axios({
        method: 'put',
        url,
        timeout: 1000 * 60 * 5,
        data,
    }).catch(function (error) {
        console.log(`API error: ${error}`);
        return Promise.reject(error);
    });
}

export function putApiAuth(url, data) {
    return axios({
        method: 'put',
        url,
        timeout: 1000 * 60 * 5,
        data,
        headers: getHeader(),
    }).catch(function (error) {
        console.log(`API error: ${error}`);
        return Promise.reject(error);
    });
}

export function uploadApi(url, data) {
    let formData = new FormData();
    formData.append('fileUpload', data.fileUpload);
    formData.append('folder', data.folder);
    formData.append('bucket', data.bucket);
    return axios({
        method: 'post',
        url,
        data: formData,
        headers: getHeaderUpload(),
    }).catch(function (error) {
        console.log(`API error: ${error}`);
        return Promise.reject(error);
    });
}

export function getFileMinio(url) {
    return axios({
        method: 'get',
        url,
        headers: getHeader(),
    }).catch(function (error) {
        console.log(`error: ${error}`);
        return Promise.reject(error);
    });
}