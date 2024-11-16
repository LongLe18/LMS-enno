import 'assets/demo/auth.css';
import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';

// redux
import { useDispatch, useSelector } from "react-redux";
import * as userActions from '../../../../redux/actions/user';

// antd
import { Form, Input, Button, Avatar, notification, Col, Row } from 'antd';
import { LockOutlined, UserOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

// other
import jwt_decode from 'jwt-decode';

const LoginAdminPage = (props) => {
    const roleCheck = 2;
    const [form] = Form.useForm();
    const dispatch = useDispatch();

    const user = useSelector(state => state.user.staff.result);
    // const [login, setLogin] = useState(false);

    const onSubmit = (values) => {
        const callback = () => {
            notification.success({
                message: 'Đăng nhập thành công',
            });
            const json_token = jwt_decode(localStorage.getItem('userToken'));
            if (json_token.role === 2 && json_token.role === roleCheck) {
                setTimeout(() => {
                    dispatch(userActions.logoutUser());
                }, 18000000);
                dispatch(userActions.getUserStaff({ nhan_vien_id: json_token.userId, isUpdateStorage: true }));
            } 
            else {
                notification.error({
                    message: 'Tài khoản của bạn không có quyền đăng nhập vào ',
                });
                localStorage.clear();
                return;
            }
            // setLogin(true);
        };
        dispatch(userActions.loginUser( { type: 3, login: values } , callback));
    };

    useEffect(() => {
        if (user.status === 'success') {
            if (user.data[0].trang_thai === 1) {       // tài khoản đã kích hoạt
                if (localStorage.getItem('userToken') !== null)  {
                    const json_token = jwt_decode(localStorage.getItem('userToken'));
                    if (json_token.role === 0) {
                        props.history.push('/luyen-tap/trang-chu');
                    }
                    else props.history.push('/admin/dashboard');
                }        
            } else {
                notification.warning({
                    message: 'Tài khoản của bạn chưa được kích hoạt',
                });
                localStorage.removeItem('userToken');
                localStorage.removeItem('userInfo');
                return;
            }
        }
    }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

    
    return(
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
                    <div className='login-form'>
                        <Form  form={form} onFinish={onSubmit}>
                            <Form.Item name="email" rules={[{ required: true, message: 'Bạn chưa nhập email', type: "email" }]}>
                                <Input size="normal" prefix={<UserOutlined />} placeholder="Email" />
                            </Form.Item>
                            <Form.Item name="mat_khau" rules={[{ required: true, message: 'Mật khẩu là trường bắt buộc' }]}>
                                <Input.Password size="normal" prefix={<LockOutlined />} placeholder='Mật khẩu' iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
                            </Form.Item>
                            <Form.Item className='center-buttons'>
                                <Button type="primary" htmlType="submit" size="normal" style={{borderRadius: 8, backgroundColor: 'rgba(0, 115, 8, 0.92)', borderColor: 'rgba(0, 115, 8, 0.92)'}}>
                                    Đăng nhập
                                </Button>
                            </Form.Item>
                        </Form>
                        <div className="other-links" style={{marginBottom: "15px",textAlign: 'center'}}>
                            <NavLink className="login-form-forgot font-weight-5" to="/auth/register">
                                Đăng ký
                            </NavLink>{' '}
                            |{' '}
                            <NavLink className="login-form-forgot font-weight-5" to="/auth/forgot-password">
                                Quên mật khẩu
                            </NavLink>{' '}
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
            
    )
}

export default LoginAdminPage;