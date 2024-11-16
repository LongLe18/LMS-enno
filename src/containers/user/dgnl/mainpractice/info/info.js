import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

// reactstrap components
import { Row, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";
// antd
import { Modal, Button, notification, Form, Input } from "antd";
import { UserOutlined, EyeTwoTone, EyeInvisibleOutlined, LockOutlined } from "@ant-design/icons";
import SocialLogin from "components/common/SocialLogin";
import ReCAPTCHA from "react-google-recaptcha";

// redux
import * as userAction from '../../../../../redux/actions/user';
import { getUserInfo } from "helpers/common.helper";
import config from '../../../../../configs/index';
import defaultImage from 'assets/img/avatar.png';
import * as userActions from '../../../../../redux/actions/user';

const InfoComponent = (props) => {
    const dispatch = useDispatch();
    const [visiable, setVisible] = useState(false);
    const [form] = Form.useForm();
    const captchaRef = useRef(null);

    const userRank = useSelector(state => state.user.rankUser2.result);
    
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownToggle = (e) => {
        setDropdownOpen(!dropdownOpen);
    };

    const [state, setState] = useState({
        isLogin: false,
        info: {}
    });

    useEffect(() => {
        if (localStorage.getItem('userToken') !== null) {
            setState(state => ({ ...state, isLogin: true, info: JSON.parse(getUserInfo()) }));
            dispatch(userAction.getRankUser2({ diem: '' }));
        }
    }, [state.isLogin]); // eslint-disable-line react-hooks/exhaustive-deps

    const onLogout = () => {
        dispatch(userAction.logoutUser());
        setState(state => ({ ...state, isLogin: false, info: {} }));
    };

    const handleOk = () => {
        setVisible(false);
    };
    
    const handleCancel = () => {
        setVisible(false);
    };
    
    const showModal = () => {
        setVisible(true);
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
                    <ReCAPTCHA sitekey={config.CAPTCHA.siteKey} ref={captchaRef} />
                </Form.Item>
                <Form.Item className="center-buttons">
                    <Button type="primary" shape="round" htmlType="submit" className="btn-login">
                        Đăng nhập
                    </Button>
                </Form.Item>

                <div className="footer-login">
                    {/* Social Links */}
                    <SocialLogin />
                    <div className="forgot-password">
                        Bạn quên mật khẩu?
                        <Button
                        type="link"
                        onClick={() => {
                            window.location.href = config.BASE_URL + '/auth/forgot-password';
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
                            // eslint-disable-next-line no-unused-expressions
                            // if (window.location.href.split('/')[window.location.href.split('/').length - 1] === 'YK') 
                            //     window.location.href = config.BASE_URL + '/auth/dang-ky-bang-A' 
                            // else window.location.href = config.BASE_URL + '/auth/register';
                            window.location.href = config.BASE_URL + '/auth/register'
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

    return(
        <>
            <Row>
                {state.isLogin === true 
                ?   <Col md='12'>
                        <button className="btn btn-custom-1" onClick={() => onLogout()}>Đăng xuất</button>
                    </Col>
                :   <>
                        <Col md='6'>
                            <button className="btn btn-custom-1" onClick={() => showModal()} >Đăng nhập</button>
                        </Col>
                        <Col md='6'>
                            <NavLink className="btn btn-custom-1" to={"/auth/register"}>Đăng ký</NavLink>
                        </Col>
                    </>
                }          
            </Row>
            {(state.isLogin === true && userRank.status === 'success') && 
            <div className="shadow-box mb-4">
                <div className="info">
                    <div className="avatar">
                        <Row style={{alignItems: "center", justifyContent: "space-around"}}>
                            <Dropdown style={{listStyle: 'none'}}
                                nav
                                isOpen={dropdownOpen}
                                toggle={(e) => dropdownToggle(e)}
                            >
                                <DropdownToggle caret nav>
                                    <img alt="..."
                                        className="img-circle img-no-padding img-responsive"
                                        src={state.info.anh_dai_dien !== null ? config.API_URL + state.info.anh_dai_dien : defaultImage}
                                    />
                                </DropdownToggle>
                                <DropdownMenu right>
                                    <DropdownItem tag="a" onClick={() => props.history.push("/luyen-tap/nguoi-dung/profile")}>Tài khoản</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                            
                            <h5 className="bold">{state.info.ho_ten}</h5>
                            {userRank.data.user.full &&
                                <img style={{maxWidth: "40px", maxHeight: "40px"}} alt="..."
                                    className=" img-no-padding img-responsive"
                                    src={
                                        (userRank.data.user.full.index !== null && userRank.data.user.full.index + 1 === 1)  ? require("assets/rank/3.png").default :
                                        (userRank.data.user.full.index !== null && userRank.data.user.full.index + 1 === 2)  ? require("assets/rank/2.png").default :
                                        (userRank.data.user.full.index !== null && userRank.data.user.full.index + 1 >= 3)  && require("assets/rank/1.png").default
                                    }
                                />
                            }
                        </Row>
                    </div>
                </div>
                
                <div className="ml-auto mr-auto col-md-10">
                     
                    <Row>
                        <Col className="text-center account col-md-custom-5 mr-2 ml-2">
                            <h6 className="card-category">Điểm tuần này</h6>
                            {userRank.data.user.week && <span className="title bold" style={{fontSize: "1.5rem"}}>{userRank.data.user.week.diem !== null ? userRank.data.user.week.diem : '0'}</span>}
                        </Col>

                        <Col className="text-center account col-md-custom-5 mr-2 ml-2">
                            <h6 className="card-category">Hạng tuần này</h6>       
                            {userRank.data.user.week && <span className="title bold" style={{fontSize: "1.5rem"}}>{userRank.data.user.week.index !== null ? userRank.data.user.week.index + 1 : '0'}</span>}
                        </Col>
                    </Row>
                    <br/>
                     
                    <Row>
                        <Col className="text-center account col-md-custom-5 mr-2 ml-2">
                            <h6 className="card-category">Tổng điểm</h6>
                            {userRank.data.user.full ?
                                <span className="title bold green-text" style={{fontSize: "1.5rem"}}>
                                    {userRank.data.user.full.diem !== null ? userRank.data.user.full.diem : '0'}
                                </span>
                            : <span className="title bold green-text" style={{fontSize: "1.5rem"}}>0</span>}
                        </Col>
                        <Col className="text-center account col-md-custom-5 mr-2 ml-2">
                            <h6 className="card-category">Xếp hạng</h6>       
                            {userRank.data.user.full ?
                                <span className="title bold blue-text" style={{fontSize: "1.5rem"}}>
                                    {userRank.data.user.full.index !== null ? userRank.data.user.full.index + 1 : '0'}
                                </span>
                            : <span className="title bold blue-text" style={{fontSize: "1.5rem"}}>0</span>}
                        </Col>
                    </Row>
                    <br/>
                </div>
            </div>
            }
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
                {renderLogin()}
            </Modal>
        </>
    )
}

export default InfoComponent;