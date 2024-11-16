import React, { useState, useEffect, useRef } from 'react';
import '../css/AuthModal.scss';
import jwt_decode from 'jwt-decode';
import config from '../../../configs/index';

import ReCAPTCHA from 'react-google-recaptcha';
import { Modal, Form, Input, Button, notification } from 'antd';
import { useHistory } from 'react-router-dom';
import { UserOutlined, EyeTwoTone, EyeInvisibleOutlined, MailOutlined, PhoneOutlined, CheckCircleOutlined, LockOutlined } from '@ant-design/icons';

// redux
import { useDispatch } from "react-redux";
import * as userActions from '../../../redux/actions/user';

// component
import LoggedIn from './LoggedIn';
import NotLoggedIn from './NotLoggedIn';

function AuthModal() {
    const [form] = Form.useForm();
    const history = useHistory();
    const captchaRef = useRef(null);

    const [type, setType] = useState('login');
    const [visiable, setVisible] = useState(false);
    // const user = useSelector(state => state.user.user.result);

    const [state, setState] = useState({
        userToken: localStorage.getItem('userToken'),
        userInfo: localStorage.getItem('userInfo'),
    });

    const dispatch = useDispatch();

    const compareToFirstPassword = (rule, value, callback) => {
        if (value) {
          if (value !== form.getFieldValue('mat_khau')) {
            callback('Xác nhận mật khẩu không khớp');
          } else {
            callback();
          }
        }
    };

    useEffect(() => {
        if (localStorage.getItem('userToken') !== null) {
            const json_token = jwt_decode(localStorage.getItem('userToken'));
            if (json_token) {
                dispatch(userActions.getUserStudent({ hoc_vien_id: json_token.userId, isUpdateStorage: true }, (res) => {
                    if (res.status === 'success') {
                        setState({ ...state, userInfo: res.data, userToken: localStorage.getItem('userToken') })
                    }
                }));
            }
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const showModal = () => {
        setVisible(true);
    };
    
    const handleOk = () => {
        setVisible(false);
    };
    
    const handleCancel = () => {
        setVisible(false);
    };
    
    const renderLogin = () => {
        return (
            <Form form={form} className="login-form app-form" name="login-form" onFinish={onSubmitLogin}>
                <h2 className="form-title">Đăng nhập</h2>
                <Form.Item name="email" rules={[{ required: true, message: 'Bạn chưa nhập email', type: "email" }]}>
                        <Input size="normal" prefix={<UserOutlined />} placeholder="Email" />
                </Form.Item>

                <Form.Item name="mat_khau" rules={[{ required: true, message: 'Bạn chưa nhập mật khẩu!' }]}>
                    <Input.Password prefix={<LockOutlined />} iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} placeholder="Mật khẩu" />
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

                <Form.Item className="center-buttons">
                    <Button type="primary" shape="round" htmlType="submit" className="btn-login">
                        Đăng nhập
                    </Button>
                </Form.Item>

                <div className="footer-login">
                    <div className="forgot-password">
                        Bạn quên mật khẩu?
                        <Button
                        type="link"
                        onClick={() => {
                            setType('forgot_password');
                        }}
                        >
                        Lấy lại mật khẩu
                        </Button>
                    </div>
                    <div className="forgot-password">
                        Bạn chưa có tài khoản?
                        <Button
                        type="link"
                        onClick={() => {
                            setType('register');
                        }}
                        >
                        Đăng ký ngay
                        </Button>
                    </div>
                </div>
            </Form>
        )
    }

    const onSubmitLogin = (values) => {
        const callback = (res) => {
            if (res.status === 200 && res.statusText === 'OK') {
                setVisible(false);
                notification.success({
                    message: 'Thông báo',
                    description: 'Đăng nhập thành công.',
                });
                const json_token = jwt_decode(localStorage.getItem('userToken'));
                if (json_token.role === 0) {
                    setTimeout(() => {
                        dispatch(userActions.logoutUser());
                    }, 18000000);
                    dispatch(userActions.getUserStudent({ hoc_vien_id: json_token.userId, isUpdateStorage: true }, (res) => {
                        if (res.status === 'success') window.location.reload();
                    }));
                } 
                else {
                    notification.error({
                        message: 'Tài khoản của bạn không có quyền đăng nhập vào ',
                    });
                    localStorage.clear();
                    return;
                }
            } else {
                notification.error({
                    message: 'Đăng nhập thất bại',
                    description: 'Bạn vui lòng kiểm tra lại thông tin đăng nhập',
                });
            }
        };
        const token = captchaRef.current.getValue();
        values.token = token;
        captchaRef.current.reset();
        dispatch(userActions.loginUser({ type: 1, login: values }, callback));
    };

    const onSubmitForgotPassword = (values) => {
        console.log(values);
    }

    const onSubmitRegister = async (values) => {
        const callback = () => {
            notification.success({
              message: 'Đăng ký tài khoản thành công',
            });
            setVisible(false);
            form.resetFields();
            history.push('/luyen-tap/trang-chu');
        };
        const token = captchaRef.current.getValue();
        values.token = token;
        captchaRef.current.reset();
        dispatch(userActions.registerUser( { type: 1, register: values }, callback));
    }

    const onLogout = () => {
        const callback = (res) => {
            setVisible(false);
            history.push('/auth/hocvien');
        };

        dispatch(userActions.logoutUser('', callback));
    };

    const renderRegister = () => {
        return (
        <Form className="register-form app-form" name="login-form" onFinish={onSubmitRegister} form={form}>
            <h2 className="form-title">Đăng ký tài khoản</h2>
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
                    { min: 6, message: 'Mật khẩn cần ít nhất 6 kí tự.' },
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
                <Button type="primary" htmlType="submit" size="normal" shape="round">
                    Đăng ký
                </Button>
            </Form.Item>

            <div className="footer-login">
                <div className="forgot-password">
                    Bạn có tài khoản rồi?{' '}
                    <Button
                        type="link"
                        onClick={() => {
                            setType('login');
                        }}
                    >
                    Đăng nhập
                    </Button>{' '}
                </div>
            </div>
        </Form>
        )
    }

    const renderForgotPassword = () => {
        return (
            <Form form={form} className="login-form app-form" name="forgot-form" onFinish={onSubmitForgotPassword}>
                <h2 className="form-title">Lấy lại mật khẩu</h2>
                <Form.Item name="email" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ E-mail' }]}>
                <Input placeholder="Địa chỉ E-mail" prefix={<MailOutlined />} />
                </Form.Item>
    
                <Form.Item className="center-buttons">
                <Button type="primary" shape='round' htmlType="submit">
                    Lấy lại mật khẩu
                </Button>
                </Form.Item>
                <div className="footer-login">
                    <div className="forgot-password">
                        Bạn có tài khoản rồi?{' '}
                        <Button type="link"
                        onClick={() => {
                            setType('login');
                        }}
                        >
                        Đăng nhập ngay
                        </Button>
                    </div>
                    <div className="forgot-password">
                        Bạn chưa có tài khoản?{' '}
                        <Button type='link'
                        onClick={() => {
                            setType('register');
                        }}
                        >
                        Đăng ký
                        </Button>{' '}
                    </div>
                </div>
          </Form>
        );
    };

    const renderType = (type) => {
        if (type === 'login') {
            return renderLogin();
        } else if (type === 'register') {
            return renderRegister();
        } else if (type === 'forgot_password') {
            return renderForgotPassword();
        } else if (type === 'forgot_password_sucsses') {
            return renderForgotPasswordSucses();
        } else if (type === 'register_sucsses') {
            return renderRegisterSucses();
        }
    };

    const renderForgotPasswordSucses = () => {
        return (
            <div className="form-sucsess">
                <CheckCircleOutlined />
                <h3>Bạn vui lòng kiểm tra email</h3>
                <p>Một thư chứa đường dẫn khôi phục mật khẩu đã được gửi cho địa chỉ email tài khoản của bạn. Đường dẫn sẽ hết hạn sau 3 ngày.</p>
            </div>
        );
      };

    const renderRegisterSucses = () => {
        return (
            <div className="form-sucsess">
                <CheckCircleOutlined />
                <h3>Đăng kí thành công</h3>
                <h3>Bạn vui lòng kiểm tra email</h3>
                <p>Vui lòng kiểm tra email để xác nhận đăng kí tài khoản</p>
            </div>
        );
    };
    return(
        <div className="cra-auth">
            {(state.userToken && state.userInfo ) ? <LoggedIn onLogout={() => onLogout()} /> : <NotLoggedIn setType={(type) => setType(type)} showModal={() => showModal()} />}
            <Modal
                className="cra-auth-modal"
                wrapClassName="cra-auth-modal-container"
                maskStyle={{ background: 'rgba(0, 0, 0, 0.8)' }}
                maskClosable={false}
                footer={null}
                mask={true}
                centered={true}
                visible={visiable}
                onOk={handleOk}
                onCancel={handleCancel}
                width={480}
            >
                {renderType(type)}
            </Modal>
        </div>
    )
}

export default AuthModal;