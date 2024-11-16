import * as moduleAction from '../../../../../redux/actions/part';
import config from '../../../../../configs/index';
import defaultImage from 'assets/img/default.jpg';
// other
import jwt_decode from 'jwt-decode';

import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink } from 'react-router-dom';
import Hashids from 'hashids';

import LoadingCustom from 'components/parts/loading/Loading';
// reactstrap components
import { Row } from "reactstrap";
import ProgressBar from '../processbar/processbar'

import SocialLogin from 'components/common/SocialLogin';
import { Modal, Button, Form, Input, notification } from 'antd';
import { UserOutlined, LockOutlined, EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
import ReCAPTCHA from "react-google-recaptcha";

// redux
import * as userActions from '../../../../../redux/actions/user';

const ContentComponent = (props) => {
    const dispatch = useDispatch();
    const [visiable, setVisible] = useState(false);
    const [form] = Form.useForm();
    const captchaRef = useRef(null);
    const hashids = new Hashids();

    const modulesFilter = [];
    const modules = useSelector(state => state.part.list.result);
    const loading = useSelector(state => state.part.list.loading);
    const error = useSelector(state => state.part.list.error);
    
    const token = localStorage.getItem('userToken');

    useEffect(() => {
        if (token !== null)
            dispatch(moduleAction.getModulesByIdCourse({ 'idCourse': props.id }));
        else 
            dispatch(moduleAction.getModulesByIdCourse2({ 'idCourse': props.id }));
    }, [props.id]); // eslint-disable-line react-hooks/exhaustive-deps

    if (modules.status === 'success') {
        var temp = modules.data.filter(obj => { // Lọc những phần đang hoạt động
            return obj.trang_thai === 1;
        })
        for (let module of temp) modulesFilter.push(module);
    }

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

                <Form.Item name="mat_khau" rules={[
                    { required: true, message: 'Bạn chưa nhập mật khẩu!' },
                    { pattern: new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/), 
                    message: 'Mật khẩu chưa đúng dạng gồm: Chữ hoa, chữ thường, ký tự đặc biệt, số, ít nhất 8 kí tự' 
                }]}>
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
                            window.location.href = config.BASE_URL + '/auth/register';
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
            {/* các phần học */}
            {loading && <LoadingCustom/>}
            {modules.status === "success" && modulesFilter.map(({ mo_dun_id, ten_mo_dun, anh_dai_dien, linh_vuc, loai_tong_hop, percentAchieved }) => (
                
                <div key={mo_dun_id}>
                    <div className="shadow-box">
                        <div className="ml-4 pt-3"> 
                            <h5 className="blue-text" style={{fontSize: "20px", textTransform: 'uppercase'}}>{ten_mo_dun}</h5>
                            <div className="avatar">
                                <Row>
                                    <img alt="..."
                                        className="img-circle img-no-padding img-responsive"
                                        src={anh_dai_dien !== null ? config.API_URL + anh_dai_dien : defaultImage}
                                    />
                                    <ProgressBar bgcolor="#89c304" progress={percentAchieved !== undefined ? percentAchieved : '50'}  height={30}/>
                                    {/* {token !== null 
                                    ?
                                        (props.id === 32 && JSON.parse(localStorage.getItem('userInfo')).university_unit === null && mo_dun_id === 60)
                                        ?
                                            <NavLink className="btn btn-primary" to={"/luyen-tap/kiem-tra-mo-dun/" + hashids.encode(props.id) + "/" + hashids.encode(mo_dun_id)}>{props.id === 32 ? 'Vào thi' : 'Luyện'}</NavLink>
                                        : (props.id === 32 && JSON.parse(localStorage.getItem('userInfo')).university_unit !== null && mo_dun_id === 61)
                                        ?
                                            <NavLink className="btn btn-primary" to={"/luyen-tap/kiem-tra-mo-dun/" + hashids.encode(props.id) + "/" + hashids.encode(mo_dun_id)}>{props.id === 32 ? 'Vào thi' : 'Luyện'}</NavLink>
                                        : props.id !== 32 ?
                                        <> 
                                            {loai_tong_hop === 0 && <NavLink className="btn btn-primary" to={"/luyen-tap/chi-tiet-luyen-tap/" + hashids.encode(mo_dun_id) + "/" + hashids.encode(props.id)}>{props.id === 32 ? 'Vào thi' : 'Luyện'}</NavLink>}
                                            {loai_tong_hop === 2 && <NavLink className="btn btn-primary" to={"/luyen-tap/kiem-tra-mo-dun/" + hashids.encode(props.id) + "/" + hashids.encode(mo_dun_id)}>{props.id === 32 ? 'Vào thi' : 'Luyện'}</NavLink>}
                                            {loai_tong_hop === 1 && <NavLink className="btn btn-primary" to={`/luyen-tap/kiem-tra/${hashids.encode(props.id)}`}>{props.id === 32 ? 'Vào thi' : 'Luyện'}</NavLink> }
                                        </>
                                        : ''
                                    : <Button style={{padding: '4px 15px'}} type='primary' className="btn btn-primary" onClick={() => showModal()}>{props.id === 32 ? 'Vào thi' : 'Luyện'}</Button>
                                    } */}
                                    {token !== null ?
                                        <> 
                                            {/* Bài học */}
                                            {loai_tong_hop === 0 && 
                                                <NavLink className="btn btn-primary" 
                                                    to={"/luyen-tap/chi-tiet-luyen-tap/" + hashids.encode(mo_dun_id) + "/" + hashids.encode(props.id)}
                                                >
                                                    Luyện
                                                </NavLink>
                                            }
                                            {/* Thi mô-đun */}
                                            {loai_tong_hop === 2 && 
                                                <NavLink className="btn btn-primary" 
                                                    to={"/luyen-tap/kiem-tra-mo-dun/" + hashids.encode(props.id) + "/" + hashids.encode(mo_dun_id)}
                                                >
                                                    Luyện
                                                </NavLink>
                                            }
                                            {/* Thi tổng hợp */}
                                            {loai_tong_hop === 1 && <NavLink className="btn btn-primary" to={`/luyen-tap/kiem-tra/${hashids.encode(props.id)}`}>Luyện</NavLink> }
                                        </> :
                                        <>
                                            <Button style={{padding: '4px 15px'}} type='primary' className="btn btn-primary" onClick={() => showModal()}>Luyện</Button>
                                        </>
                                    }
                                </Row>                  
                            </div>
                        </div>
                        <div className="ml-4 pb-3">
                            <h6 className="custom-text">Lĩnh vực: {linh_vuc}</h6>
                        </div>
                    </div>
                    <br/>
                </div>
            ))}
            {error && !loading && <p>{error}</p>}
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
export default ContentComponent;
