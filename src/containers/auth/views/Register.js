import React, { useRef } from 'react';
import 'assets/demo/auth.css';
import { NavLink } from 'react-router-dom';
// helper
import './css/register.css'
import config from '../../../configs/index';

import { Form, Input, Button, Avatar, notification, Row, Col } from 'antd';
import { UserOutlined, PhoneOutlined, LockOutlined, MailOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import ReCAPTCHA from 'react-google-recaptcha';

// redux
import { useDispatch } from "react-redux";
import * as userActions from '../../../redux/actions/user';

const RegisterPage = (props) => {
    const [form] = Form.useForm();
    const captchaRef = useRef(null);
    const dispatch = useDispatch();
    // const user = useSelector(state => state.user.item.result);

    const onSubmit = (values) => {
        const callback = () => {
            notification.success({
                message: 'Bạn đã đăng ký thành công. Vui lòng kiểm tra email để kích hoạt tài khoản. Trong trường hợp không tìm thấy email kích hoạt tài khoản, quý khách vui lòng kiểm tra trong thư mục SPAM',
            });
            props.history.push('/auth/hocvien');
        };
        const token = captchaRef.current.getValue();
        values.token = token;
        captchaRef.current.reset();
        dispatch(userActions.registerUser( { type: 1, register: values }, callback));
    };

    const compareToFirstPassword = (rule, value, callback) => {
        if (value) {
            if (value !== form.getFieldValue('mat_khau')) {
                callback('Xác nhận mật khẩu không khớp');
            } else {
                callback();
            }
        }
    };

    return(
        <>
            <div className="div-form">
                <Row className="logo" align={'middle'}>
                    <Col xs={{ span: 24 }} lg={{ span: 4 }}>
                        <NavLink to='/luyen-tap/trang-chu' className="logo">
                            <Avatar shape="square" size={200} src={require('assets/rank/Logo-enno.png').default} />
                        </NavLink>
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
                        <div className="login-form">
                            <Form  onFinish={onSubmit} form={form}>
                                <Form.Item name="ho_ten">
                                    <Input size="normal" prefix={<UserOutlined />} placeholder='Họ và tên' />
                                </Form.Item>
                                <Form.Item name="sdt" rules={[
                                    { required: true, message: 'Số điện thoại là trường bắt buộc.' },
                                ]}>
                                    <Input size="normal" type={"tel"} prefix={<PhoneOutlined />} placeholder='Số điện thoại' />
                                </Form.Item>
                                <Form.Item
                                    name="email"
                                    rules={[
                                        { required: true, message: 'E-mail là trường bắt buộc.' },
                                        { type: 'email', message: 'Không đúng định dạng E-mail.' },
                                    ]}
                                >
                                    <Input size="normal" prefix={<MailOutlined />} placeholder='Email' />
                                </Form.Item>
                                <Form.Item
                                    name="mat_khau"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Mật khẩu là trường bắt buộc.',
                                        },
                                        { pattern: new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/), 
                                            message: 'Mật khẩu chưa đúng dạng gồm: Chữ hoa, chữ thường, ký tự đặc biệt, số, ít nhất 8 kí tự' 
                                        }
                                    ]}
                                >
                                    <Input.Password size="normal" prefix={<LockOutlined />} placeholder='Mật khẩu' iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
                                </Form.Item>
                                <Form.Item
                                    name="xac_nhan_mat_khau"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Xác nhận mật khẩu là trường bắt buộc.',
                                        },
                                        {
                                            validator: compareToFirstPassword,
                                        },
                                    ]}
                                >
                                    <Input.Password
                                        size="normal"
                                        prefix={<LockOutlined />}
                                        placeholder='Xác nhận mật khẩu'
                                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                    />
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
                                

                                <Form.Item style={{textAlign: "center"}}>
                                    <Button type="primary" htmlType="submit" size="normal" style={{borderRadius: 8, backgroundColor: 'rgba(0, 115, 8, 0.92)', borderColor: 'rgba(0, 115, 8, 0.92)'}}>
                                        Đăng ký
                                    </Button>{' '}
                                    hoặc         
                                </Form.Item>
                            </Form>
                            <div className="other-links" style={{marginBottom: "15px",textAlign: 'center'}}>
                                <button onClick={() => props.history.push("/auth/hocvien")} className='login-form-forgot font-weight-5'>Đăng nhập</button> |{' '}
                                <button className="login-form-forgot font-weight-5" onClick={() => props.history.push("/auth/forgot-password")}>
                                    Quên mật khẩu
                                </button>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default RegisterPage;