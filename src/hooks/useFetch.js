import { useState, useEffect } from 'react';
import axios from 'axios';

// components
import { notification } from 'antd';

// helper
import config from '../configs/index';

const useFetch = (url) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('userToken');
        if (token) {
            axios.get(config.API_URL + `${url}`, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'}})
                .then(
                    res => {
                        if (res.status === 200 && res.statusText === 'OK') {
                            if (res.data.data.length > 0)
                                setData(res.data.data.map((item, index) => ({...item, key: index})));
                            else 
                                setData(res.data.data);
                        } else {
                            notification.error({
                                message: 'Lỗi',
                                description: 'Có lỗi xảy ra khi lấy dữ liệu',
                            })
                        }
                    }
                )
                .catch(error => 
                {   
                    notification.error({ message: error.response.data })
                });
        }
    }, [url])

    return [data];
}

export default useFetch;