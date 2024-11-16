import React, { useEffect, useState, useRef } from 'react';
import './css/CourseCates.css';
import './css/business.css';
import './css/Testimonials.css';

import Hashids from 'hashids';
import { Helmet } from 'react-helmet';
import { Link, useParams } from 'react-router-dom';
// helper
import defaultImage from 'assets/img/default.jpg';
import config from '../../../../configs/index';
import jwt_decode from 'jwt-decode';

// component
import { Layout, Row, Col, Button, notification, Form, Input, Modal, Menu } from 'antd';
import { BookOutlined, BarsOutlined } from '@ant-design/icons';
import NoRecord from 'components/common/NoRecord';
import { UserOutlined, LockOutlined, EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
import SocialLogin from 'components/common/SocialLogin';
import ReCAPTCHA from "react-google-recaptcha";
import CarouselCustom from 'components/parts/Carousel/Carousel';
import moment from "moment";

// redux
import { useSelector, useDispatch } from 'react-redux';
import * as courseAction from '../../../../redux/actions/course';
import * as programmeAction from '../../../../redux/actions/programme';
import * as userActions from '../../../../redux/actions/user';
import Statisic from 'components/parts/statisic/Statisic';

const { Content } = Layout;

const BusinessProgramePage = (props) => {
    const hashids = new Hashids();
    const [form] = Form.useForm();
    const captchaRef = useRef(null);
    // let history = useHistory();
    const idKCT = useParams().idKCT;
    // const hashids = new Hashids();
    const data = [];

    const [visiable, setVisible] = useState(false);
    const [typeProgramme, setTypeProgramme] = useState(0);

    const dispatch = useDispatch();
    const courses = useSelector(state => state.course.list.result);
    const programmeCourses = useSelector(state => state.programme.courses.result);
    // const userToken = localStorage.getItem('userToken');

    useEffect(() => {
        const callback = (response) => {
            if (response.status === 'success') {
                setTypeProgramme(response.data.loai_kct);
            }
        }

        dispatch(courseAction.getCourses({ idkct: idKCT, status: 1, search: '' }));
        dispatch(programmeAction.getProgramme({ id: idKCT }, callback));
        dispatch(programmeAction.getProgrammeCourses());
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (courses.status === 'success') {
        courses.data.sort((objA, objB) => Number(new Date(objB.ngay_bat_dau)) - Number(new Date(objA.ngay_bat_dau)));
        courses.data.map((item, index) => {
            if (item.kct_id === Number(idKCT))
                data.push({ ...item, 'key': index });
            return null;
        });
    };

    const handleOk = () => {
        setVisible(false);
    };
    
    const handleCancel = () => {
        setVisible(false);
    };
    
    // const showModal = () => {
    //     setVisible(true);
    // };

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

    // const requestExamOnline = (idCourse) => {
    //     if (userToken === undefined || userToken === null) {
    //         showModal();
    //         return;
    //     }
    //     axios.get(config.API_URL + `/student/list/course`, { headers: {Authorization: `Bearer ${localStorage.getItem('userToken')}`,} 
    //     })
    //         .then(
    //             res => {
    //                 if (res.status === 200 && res.statusText === 'OK') {
    //                     let exist = false;
    //                     res.data.data.map(course => {
    //                         if (course.khoa_hoc_id === idCourse) {
    //                             exist = true;
    //                         }
    //                         return null;
    //                     })
    //                     if (exist) {
    //                         axios.get(config.API_URL + `/exam/onlineExam?khoa_hoc_id=${idCourse}`, { headers: {Authorization: `Bearer ${localStorage.getItem('userToken')}`,} })
    //                             .then(
    //                                 res => {
    //                                     if (res.status === 200 && res.statusText === 'OK') {
    //                                         let data = res.data.data;
    //                                         if (data.length > 0) {
    //                                             const randomIndex = Math.floor(Math.random() * data.length);
    //                                             const randomlySelectedElement = data[randomIndex];
    //                                             history.push(`/luyen-tap/xem/${hashids.encode(randomlySelectedElement.de_thi_id)}/${hashids.encode(idCourse)}`)
    //                                         }
    //                                         else {
    //                                             notification.warning({
    //                                                 message: 'Cảnh báo',
    //                                                 description: 'Khóa học này hiện chưa có đề thi. Xin vui lòng thử lại sau',
    //                                             })
    //                                         }
    //                                     } else {
    //                                         notification.error({
    //                                             message: 'Lỗi',
    //                                             description: 'Có lỗi xảy ra khi lấy dữ liệu',
    //                                         })
    //                                     }
    //                                 }
    //                             )
    //                             .catch(error => notification.error({ message: error.message }));
    //                     } else {
    //                         notification.error({
    //                             message: 'Thông báo',
    //                             description: 'Bạn chưa đăng ký khóa học này, vui lòng đăng ký để vào học',
    //                         });
    //                     }
    //                 } else {
    //                     notification.error({
    //                         message: 'Lỗi',
    //                         description: 'Có lỗi xảy ra khi lấy dữ liệu',
    //                     })
    //                 }
    //             }
    //         )
    //         .catch(error => notification.error({ message: error.message }));
    // }

    function getItem(label, icon, key, children, type) {
        return {
          key,
          icon,
          children,
          label,
          type,
        };
    }
    
    // menu khóa học
    const items = [];
    if (programmeCourses.status === 'success') {
        programmeCourses?.data.forEach((item, index) => {
            let children = [];
            if (item.khoa_hocs && item.khoa_hocs.length > 0) {
                item.khoa_hocs.forEach((item2, index2) => {
                    
                    children.push(getItem(item2.ten_khoa_hoc, <BookOutlined />, item2.khoa_hoc_id, null, 'item'));
                });
            }
            items.push(getItem(item.ten_khung_ct, <BookOutlined />, item.kct_id, children, 'item'));
        });
    }

    const renderCoursesCate = () => {
        if (courses.status === 'success' && courses.data.length === 0) return <NoRecord />
        return (
            <div className="list-course-cate">
                <div className="wraper wraper-list-course-cate-index">
                    <Row gutter={16} style={{margin: '18px 0'}}>
                        <Col xl={5} md={4} xs={4} style={{paddingLeft: 0}}>
                            {(programmeCourses.status === 'success' && items.length > 0) &&
                                <Menu style={{borderRadius: 6}}
                                    mode="vertical"
                                    theme="light"
                                    defaultSelectedKeys={['1']}
                                >
                                    <Menu.Item style={{background: '#3da844', marginTop: 0, borderTopRightRadius: 6, borderTopLeftRadius: 6}}
                                        icon={<BarsOutlined style={{color: '#fff'}}/>}
                                    >
                                        <span style={{fontWeight: 600, color: "#fff"}}>Các khóa học</span>
                                    </Menu.Item>
                                    {items.map((item, index) => {
                                        return (
                                            <Menu.SubMenu title={item.label} key={Number(index)} icon={item.icon}>
                                                {item.children?.map((child, index) => {
                                                    return (
                                                        <Menu.Item key={child.key}>
                                                            <Link to={`/luyen-tap/gioi-thieu-khoa-hoc/${hashids.encode(child.key)}`}>{child.label}</Link>
                                                        </Menu.Item>
                                                    )
                                                })}
                                            </Menu.SubMenu>
                                        )
                                    })}
                                </Menu>
                            }
                        </Col> 
                        <Col xl={19} md={20} xs={20}>
                            <CarouselCustom />
                        </Col>
                    </Row>
                    <Statisic />
                    <Row gutter={16}>
                        <Col Col xl={24} md={24} xs={24}>
                            <h2 className="section-title section-title-center">
                            <b></b>
                                {(courses.status === 'success' && data.length > 0) && <span className="section-title-main" style={{color: 'green'}}>{data[0].ten_khung_ct}</span>}
                                <b></b>
                            </h2>
                            {data.length > 0 && (
                            <Row gutter={[16, 16]} className="list-cate-items">
                                {data.map((cate, index) => {
                                    return (
                                        <Col xl={5} sm={12} xs={12} className="course-cate-row" key={cate.key}>
                                            <div className="course-cate-box">
                                                <div className="image-box">
                                                    {/* {typeProgramme === 1 
                                                    ?
                                                        <Button className='btn-enter-online-course' onClick={() => requestExamOnline(cate.khoa_hoc_id)}>
                                                            <img src={ cate.anh_dai_dien ? config.API_URL + `${cate.anh_dai_dien}` : defaultImage} alt={cate.ten_khoa_hoc} />
                                                        </Button>
                                                    :       
                                                        <Link to={`/luyen-tap/luyen-tap/${hashids.encode(cate.khoa_hoc_id)}`}>
                                                            <img src={ cate.anh_dai_dien ? config.API_URL + `${cate.anh_dai_dien}` : defaultImage} alt={cate.ten_khoa_hoc} />
                                                        </Link>
                                                    } */}
                                                    <Link to={`/luyen-tap/gioi-thieu-khoa-hoc/${hashids.encode(cate.khoa_hoc_id)}`}>
                                                        <img src={ cate.anh_dai_dien ? config.API_URL + `${cate.anh_dai_dien}` : defaultImage} alt={cate.ten_khoa_hoc} />
                                                    </Link>
                                                </div>
                                                <div className="box-text pb-1">
                                                    {typeProgramme === 1 
                                                    ?
                                                        <>
                                                            {/* <Button className='btn-enter-online-course' onClick={() => requestExamOnline(cate.khoa_hoc_id)}>
                                                                {cate.ten_khoa_hoc}
                                                            </Button> */}
                                                            <h3 className="course-cate-title">
                                                                <Link to={`/luyen-tap/gioi-thieu-khoa-hoc/${hashids.encode(cate.khoa_hoc_id)}`}>{cate.ten_khoa_hoc}</Link>
                                                            </h3>
                                                            <p className="course-cate-description">
                                                                {/* <span>Ngày bắt đầu: {moment(cate.ngay_bat_dau).format(config.DATE_FORMAT_SHORT)}</span>
                                                                <span>Ngày kết thúc: {moment(cate.ngay_ket_thuc).format(config.DATE_FORMAT_SHORT)}</span> */}
                                                                <Link to={`/luyen-tap/gioi-thieu-khoa-hoc/${hashids.encode(cate.khoa_hoc_id)}`} >
                                                                    <Button type="primary" style={{margin: '12px 0 12px 0', fontSize: 12, borderRadius: 4}}>
                                                                        Chi tiết
                                                                    </Button>
                                                                </Link>
                                                            </p>
                                                        </>
                                                    :
                                                        <>
                                                            <h3 className="course-cate-title">
                                                                <Link to={`/luyen-tap/gioi-thieu-khoa-hoc/${hashids.encode(cate.khoa_hoc_id)}`}>{cate.ten_khoa_hoc}</Link>
                                                            </h3>
                                                            <p className="course-cate-description">
                                                                <span>Ngày bắt đầu: {moment(cate.ngay_bat_dau).format(config.DATE_FORMAT_SHORT)}</span>
                                                                <span>Ngày kết thúc: {moment(cate.ngay_ket_thuc).format(config.DATE_FORMAT_SHORT)}</span>
                                                                <Link to={`/luyen-tap/gioi-thieu-khoa-hoc/${hashids.encode(cate.khoa_hoc_id)}`} >
                                                                    <Button type="primary" style={{margin: '12px 0 12px 0', fontSize: 12, borderRadius: 4}}>
                                                                        Chi tiết
                                                                    </Button>
                                                                </Link>
                                                            </p>
                                                        </>
                                                    }
                                                    
                                                    {/* <p className="course-cate-description">
                                                        {typeProgramme === 1 
                                                        ?
                                                            <div>
                                                                <Button type="primary" onClick={() => requestExamOnline(cate.khoa_hoc_id)} >
                                                                    Xem chi tiết
                                                                </Button>
                                                            </div>
                                                        :
                                                        <Link to={`/luyen-tap/luyen-tap/${hashids.encode(cate.khoa_hoc_id)}`}>
                                                            <Button type="primary">
                                                                Xem chi tiết
                                                            </Button>
                                                        </Link>
                                                        }
                                                    </p> */}
                                                </div>
                                            </div>
                                        </Col>
                                    )
                                })}
                            </Row>
                            )}
                        </Col>
                    </Row>
                </div>
            </div>
        )
    };

    return (
        <Layout className="main-app">
            <Helmet>
                <title>Danh sách khóa học theo khung chương trình</title>
            </Helmet>
            <Content className="app-content ">
                {renderCoursesCate()}
            </Content>
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
        </Layout>
    );
}

export default BusinessProgramePage;