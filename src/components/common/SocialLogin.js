import React from 'react';

import config from '../../configs/index';

import { Row, Col, Button } from 'antd';
import { GooglePlusOutlined } from '@ant-design/icons';

const SocialLogin = () => {

    const loginGoogle = () => {
        window.location.href = config.API_URL + `/auth/google?loai_tai_khoan=1&url=${window.location.pathname}`;
    };

    return (
        <Row className="social-login mt-4" style={{justifyContent: 'center'}}>
            <Col xxl={12} xl={24} lg={24} md={24} sm={24} xs={24} className="box">
                <Button block shape="round" danger onClick={() => loginGoogle()} icon={<GooglePlusOutlined />}>
                    Đăng nhập qua google
                </Button>
            </Col>
        </Row>
    )
};

export default SocialLogin;