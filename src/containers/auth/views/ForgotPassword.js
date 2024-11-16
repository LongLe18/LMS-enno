import React, { useState, useRef } from 'react';
import 'assets/demo/auth.css';
import config from '../../../configs/index';
import { Link, NavLink } from 'react-router-dom';

import { Form, Input, Button, Avatar, notification, Col, Row } from 'antd';
import Icon from '@ant-design/icons';
import ReCAPTCHA from 'react-google-recaptcha';
// redux
import { useDispatch } from "react-redux";
import * as userActions from '../../../redux/actions/user';

const ForgotPasswordPage = (props) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const captchaRef = useRef(null);
    const [state, setState] = useState(false);

    const onSubmit = (values) => {
        const callback = (result) => {
            if (result.status === 'success') {
                setState(true);
            } else {
                notification.error({
                    message: 'Email không tồn tại',
                });
            }
        };
        const token = captchaRef.current.getValue();
        captchaRef.current.reset();
        const data = {
            email:  values.email,
            token: token,
        }
        dispatch(userActions.forgotPassword({ typeUser: 1, email: data }, callback));
    };

    return (
        <>
            

            <div className="div-form">
                <Row className="logo" align={'middle'}>
                    <Col xs={{ span: 24 }} lg={{ span: 4 }}>
                        <Link to='/luyen-tap/trang-chu' className="logo">
                            <Avatar shape="square" size={200} src={require('assets/rank/Logo-enno.png').default} />
                        </Link>
                    </Col>
                    <Col xs={{ span: 22, offset: 1 }} lg={{ span: 9, offset: 4}} style={{marginRight: '10%'}}>
                        <h4>Kỳ thi đánh giá năng lực học sinh trung học phổ thông</h4>
                    </Col>
                    <Col xs={{ span: 24 }} lg={{ span: 4 }}>
                        <NavLink to='/luyen-tap/trang-chu' className="logo">
                            <img src={require('assets/rank/logo-hsa.png').default} style={{width: 250}} alt='logo'/>
                        </NavLink>
                    </Col>
                </Row>
                <Row>
                    <Col xs={{ span: 22, offset: 1 }} lg={{ span: 7, offset: 9 }}>
                            {!state ? 
                            <>
                                <Form className="login-form" form={form} onFinish={onSubmit}>
                                    <p className="alert font-weight-5" style={{color: 'black'}}>Bạn vui lòng nhập e-mail, chúng tôi sẽ gửi link cập nhật mật khẩu qua e-mail.</p>
                                    <Form.Item
                                        name="email"
                                        rules={[
                                            { required: true, message: 'E-mail là trường bắt buộc' },
                                            { type: 'email', message: 'Không đúng định dạng E-mail' },
                                        ]}
                                    >
                                        <Input size="normal" prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder='Email' />
                                    </Form.Item>
                                    <Form.Item name="captcha"
                                        rules={[
                                            {
                                            required: true,
                                            },
                                        ]}
                                    >   
                                        <ReCAPTCHA sitekey={config.CAPTCHA.siteKey} ref={captchaRef}/>
                                    </Form.Item>
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit" className="login-form-button" size="normal" style={{borderRadius: 8, backgroundColor: 'rgba(0, 115, 8, 0.92)', borderColor: 'rgba(0, 115, 8, 0.92)'}}>
                                            Khôi phục mật khẩu
                                        </Button>
                                        <br />
                                        <div className="other-links">
                                            {' '}
                                            <button className="login-form-forgot font-weight-5" onClick={() => props.history.push("/auth/hocvien")}>
                                                Đăng nhập
                                            </button>{' '}
                                        </div>
                                    </Form.Item>
                                </Form>
                            </>
                        : 
                            <Form className="login-form">
                                <p className="alert font-weight-5" style={{color: 'black'}}>Khôi phục mật khẩu thành công. Bạn vui lòng kiểm tra Email.</p>
                                <Form.Item>
                                    <div className="other-links">
                                        {' '}
                                        <button className="login-form-forgot font-weight-5" onClick={() => props.history.push("/luyen-tap/trang-chu")}>
                                            Trang chủ
                                        </button>{' '}
                                    </div>
                                </Form.Item>
                            </Form>
                        }
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default ForgotPasswordPage;