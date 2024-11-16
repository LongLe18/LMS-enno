import React, { useEffect, useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useParams, useHistory } from 'react-router-dom';

import './css/intro.css';
// helper
import axios from 'axios';
import defaultImage from 'assets/img/reference/stem.jpg';
import config from '../../../../configs/index';
// import * as CurrencyFormat from 'react-currency-format';
import Hashids from 'hashids';
// import moment from 'moment';
import jwt_decode from 'jwt-decode';

// component
import { Layout, Row, Col, Button, Modal, notification, Form, Input } from 'antd';
import { FacebookOutlined, TwitterOutlined, MailOutlined, LinkedinOutlined, CrownFilled, BookOutlined, StarFilled,
    UsergroupAddOutlined, MenuOutlined, BankFilled, EyeInvisibleOutlined, EyeTwoTone,
    UserOutlined, LockOutlined } from '@ant-design/icons';
import AppBreadCrumb from 'components/parts/breadcrumb/AppBreadCrumb';
import SideBarComponent from '../mainpractice/sidebar/SideBar';
import NoRecord from 'components/common/NoRecord';
import FooterBusiness from 'components/parts/Footers/FooterBusiness';
import SocialLogin from 'components/common/SocialLogin';
import LoadingCustom from 'components/parts/loading/Loading';
import ReCAPTCHA from "react-google-recaptcha";

// redux
import { useDispatch, useSelector } from 'react-redux';
import * as descriptionCourseAction from '../../../../redux/actions/descriptionCourse';
import * as courseAction from '../../../../redux/actions/course';
import * as discountAction from '../../../../redux/actions/discount';
import * as userActions from '../../../../redux/actions/user';

const { Content } = Layout;
// const { TextArea } = Input;

const IntroCoursePage = () => {
    const idCourse = useParams().idCourse;
    const history = useHistory();
    const hashids = new Hashids();
    const dispatch = useDispatch();
    const captchaRef = useRef(null);
    const [visiable, setVisible] = useState(false);

    const description = useSelector(state => state.descriptionCourse.item.result);
    const LoadingDescription = useSelector(state => state.descriptionCourse.item.loading);
    const course = useSelector(state => state.course.item.result);
    const LoadingCourse = useSelector(state => state.course.item.result);

    const [form] = Form.useForm();
    const [remainedMoney, setRemainedMoney] = useState({
        muc_giam_gia: 0,
        ngay_bat_dau: '',
        ngay_ket_thuc: '',
    });
    const [existCourse, setExistCourse] = useState(false);

    const userToken = localStorage.getItem('userToken');
    let breadcrumbs = [{ title: 'Trang chủ', link: `/luyen-tap/trang-chu` }, { title: 'Khóa học', link: '/luyen-tap/trang-chu' }];
    
    const getCourseOfUser = () => {
        axios.get(config.API_URL + `/student/list/course`, { headers: {Authorization: `Bearer ${localStorage.getItem('userToken')}`,} 
        })
            .then(
                res => {
                    if (res.status === 200 && res.statusText === 'OK') {
                        res.data.data.map(course => {
                            if (course.khoa_hoc_id === Number(hashids.decode(idCourse))) {
                                setExistCourse(true);
                            }
                            return null;
                        })
                    } else {
                        notification.error({
                            message: 'Lỗi',
                            description: 'Có lỗi xảy ra khi lấy dữ liệu',
                        })
                    }
                }
            )
            .catch(error => notification.error({ message: error.message }));
    }

    const requestExamOnline = (idCourse) => {
        if (!userToken) {
            notification.warning({
                message: 'Thông báo',
                description: 'Bạn cần đăng nhập để thi thử khóa học.',
            });
            showModal();
            return;
        }
        axios.get(config.API_URL + `/exam/onlineExam?khoa_hoc_id=${hashids.decode(idCourse)}`, { headers: {Authorization: `Bearer ${localStorage.getItem('userToken')}`,} 
        })
            .then(
                res => {
                    if (res.status === 200 && res.statusText === 'OK') {
                        let data = res.data.data
                        if (data.length > 0) {
                            const randomIndex = Math.floor(Math.random() * data.length);
                            const randomlySelectedElement = data[randomIndex];
                            history.push(`/luyen-tap/xem/${hashids.encode(randomlySelectedElement.de_thi_id)}/${idCourse}`)
                        }
                        else {
                            notification.warning({
                                message: 'Cảnh báo',
                                description: 'Khóa học này hiện chưa có đề thi. Xin vui lòng thử lại sau',
                            })
                        }
                    } else {
                        notification.error({
                            message: 'Lỗi',
                            description: 'Có lỗi xảy ra khi lấy dữ liệu',
                        })
                    }
                }
            )
            .catch(error => notification.error({ message: error.message }));
    }

    useEffect(() => {
        const callback = (res) => {
            if (res.status === 'success') {
                if (res.data !== null) {
                    var current = new Date();
                    var start = new Date(res.data.ngay_bat_dau);
                    var end = new Date(res.data.ngay_ket_thuc);
                    if (res.data.trang_thai === true && current >= start && current <= end) {
                        setRemainedMoney({ ...remainedMoney, muc_giam_gia: res.data.muc_giam_gia, ngay_bat_dau: res.data.ngay_bat_dau, ngay_ket_thuc: res.data.ngay_ket_thuc });
                    }
                }                  
            }
        };
        
        dispatch(descriptionCourseAction.getDescriptionCourse({ id: hashids.decode(idCourse) }));
        dispatch(courseAction.getCourse({ id: hashids.decode(idCourse) }));
        dispatch(discountAction.getDiscountByCourse({ idCourse: hashids.decode(idCourse) }, callback));
        if (userToken) {
            getCourseOfUser();
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

    // const goToPayment = () => {
    //     if (!userToken) {
    //         notification.warning({
    //             message: 'Thông báo',
    //             description: 'Bạn cần đăng nhập để mua khóa học.',
    //         });
    //         showModal();
    //     } else {
    //         history.push(`/luyen-tap/gio-hang/${idCourse}`);
    //     }
    // };

    const renderIntro = () => {
        return (
            <Row className='wraper wraper-list-course-cate-index' style={{marginTop: '30px'}}>
                <Col span={18} className="list-course-content">
                    <div className='product-main'>
                        <Row className='product__mobile'>
                            <Col span={12} className="product-img">
                                <img style={{borderRadius: 12}}
                                    src={course.data.anh_dai_dien !== null ? config.API_URL + course.data.anh_dai_dien : defaultImage} alt="Ảnh đại diện" 
                                />
                            </Col>
                            <Col span={12} className='product-info summary entry-summary col col-fit product-summary'>
                                <h1 className='product-title product_title entry-title'>
            	                    {course.data.ten_khoa_hoc}
                                </h1>
                                <div className="product-short-description">
                                    {description.data.mo_ta_chung !== null ?
                                        <p dangerouslySetInnerHTML={{ __html: description.data.mo_ta_chung }}></p> 
                                    : ''}
                                </div>
                                {/* Giá góc */}
                                {/* <div className='product-price'>
                                    <div className='product-total-price'>
                                        <h5 style={{fontWeight: 'bolder', fontSize: '16px'}}>Tổng tiền:</h5>
                                        <h4 style={{marginLeft: '10px', fontSize: '16px'}}>
                                            <strong>
                                                <CurrencyFormat 
                                                    value={description.data.gia_goc !== null ? description.data.gia_goc : 0} 
                                                    displayType={'text'} thousandSeparator={true} suffix={'VNĐ'}
                                                    style={{textDecoration: remainedMoney.muc_giam_gia !== 0 ? 'line-through' : 'none'}}
                                                    />
                                            </strong>
                                        </h4>
                                        {remainedMoney.muc_giam_gia !== 0 && <h5 style={{color: 'red', marginLeft: '10px', fontSize: '16px'}}>-{remainedMoney.muc_giam_gia}%</h5>}
                                    </div>
                                </div> */}
                                {/* Ưu đãi */}
                                {/* {(remainedMoney.ngay_bat_dau !== '' && remainedMoney.ngay_ket_thuc !== '') &&
                                    <div className='product-price'>
                                        <div className='product-total-price'>
                                            <h5 style={{fontWeight: 'bolder', fontSize: '16px'}}>Ưu đãi:</h5>
                                            <h4 style={{marginLeft: '10px', fontSize: '16px'}}>
                                                <strong>
                                                    {moment(remainedMoney.ngay_bat_dau).format(config.DATE_FORMAT_SHORT)}
                                                </strong>- 
                                                <strong>
                                                    {moment(remainedMoney.ngay_ket_thuc).format(config.DATE_FORMAT_SHORT)}
                                                </strong>
                                            </h4>
                                        </div>
                                    </div>
                                } */}
                                {/* Còn lại */}
                                {/* {(remainedMoney.muc_giam_gia !== 0 && description.data.gia_goc !== 0) && 
                                    <div className='product-price'>
                                        <div className='product-total-price'>
                                            <h5 style={{fontWeight: 'bolder', fontSize: '16px'}}>Còn lại: </h5>
                                            <h4 style={{marginLeft: '10px', color: 'red', fontSize: '16px'}}>
                                                <strong>
                                                    
                                                    <CurrencyFormat 
                                                        value={ Math.ceil((description.data.gia_goc - (description.data.gia_goc * remainedMoney.muc_giam_gia / 100)) / 100) * 100 } 
                                                        displayType={'text'} thousandSeparator={true} suffix={'VNĐ'}
                                                        />
                                                </strong>
                                            </h4>
                                        </div>
                                    </div>
                                } */}
                                { !existCourse ?
                                    <>
                                        {/* <Link to='#' className='devvn_buy_now' onClick={() => goToPayment()}>
                                            <strong>Đăng ký học ngay</strong>
                                            <span>Gọi điện xác nhận đăng ký học</span>
                                        </Link> */}
                                        <Link to='#' className='devvn_buy_now' onClick={() => {window.location.href = '/luyen-tap/trang-chu'}}>
                                            <strong>LIÊN HỆ ĐỂ NHẬN THÔNG TIN CHI TIẾT</strong>
                                            <span>Liên hệ qua zalo, số điện thoại để được tư vấn</span>
                                        </Link>
                                        {course.data.loai_kct === 1 ?   
                                            <Button onClick={() => requestExamOnline(idCourse)} className='devvn_buy_now'>
                                                <strong style={{fontWeight: 400}}>Thi thử</strong>
                                                <span>Bạn có muốn thi thử khóa học?</span>
                                            </Button>
                                        :
                                            // <Link to={`/luyen-tap/luyen-tap/${hashids.encode(idCourse)}`} className='devvn_buy_now'>
                                            //     <strong>Thi thử</strong>
                                            //     <span>Bạn có muốn thi thử khóa học?</span>
                                            // </Link>
                                            <Button onClick={() => {
                                                if (localStorage.getItem('userToken')) {
                                                    history.push(`/luyen-tap/nguoi-dung/khoa-hoc`);
                                                } else {
                                                    notification.error({
                                                        message: 'Thông báo',
                                                        description: 'Bạn chưa đăng ký tài khoản, vui lòng đăng ký để vào học',
                                                    });
                                                }
                                            }} className='devvn_buy_now'>
                                                <strong style={{fontWeight: 400}}>Thi thử / Học thử</strong>
                                                <span>Bạn có muốn thi thử / học thử ?</span>
                                            </Button>
                                        }
                                    </>
                                :   <Link to="#" className='devvn_exist_now' onClick={(event) => event.preventDefault()}>
                                        <strong>Bạn đã mua khóa học này</strong>
                                    </Link>
                                }                             
                                <div className='product_meta'>
                                    <span className="posted_in">Danh mục: 
                                        <Link to={'/luyen-tap/trang-chu'} rel="tag">Khóa học</Link>
                                        , 
                                        <Link to={"https://luyenthidgnl.vn/danh-muc-khoa-hoc/hoc-truc-tuyen/"} rel="tag">Học trực tuyến</Link>
                                    </span>
                                </div>
                                <div className='social-icons share-icons share-row relative'>
                                    <Button block shape="round" icon={<FacebookOutlined />} 
                                        className='icon button circle is-outline tooltip whatsapp show-for-medium tooltipstered'>
                                    </Button>
                                    <Button block shape="round" icon={<TwitterOutlined />} 
                                        className='icon button circle is-outline tooltip whatsapp show-for-medium tooltipstered'>
                                    </Button>
                                    <Button block shape="round" icon={<MailOutlined />} 
                                        className='icon button circle is-outline tooltip whatsapp show-for-medium tooltipstered'>
                                    </Button>
                                    <Button block shape="round" icon={<LinkedinOutlined />} 
                                        className='icon button circle is-outline tooltip whatsapp show-for-medium tooltipstered'>
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <div className='product-info-detail'>
                        <div className='content-detail'>
                            <h4 className='title-content-detail uppercase'>
                                <CrownFilled style={{marginRight: '10px'}} /> Giới thiệu chung
                            </h4>
                            <div className='info-item'>
                                <ul>
                                    {description.data.gioi_thieu !== null ?
                                        <div dangerouslySetInnerHTML={{ __html: description.data.gioi_thieu }}></div> :
                                        <u><strong>Tên khóa học:</strong></u>
                                    }
                                    {/* {description.data.mo_ta_chung !== null ?
                                        <div dangerouslySetInnerHTML={{ __html: description.data.mo_ta_chung }}></div> 
                                    : ''} */}
                                </ul>
                            </div>
                        </div>
                        <div className='content-detail'>
                            <h4 className='title-content-detail uppercase'>
                                <BookOutlined style={{marginRight: '10px'}} /> Hình thức đào tạo
                            </h4>
                            <div className="info-item">
                                <ul>
                                    {description.data.hinh_thuc_dao_tao !== null ?
                                        <div dangerouslySetInnerHTML={{ __html: description.data.hinh_thuc_dao_tao }}></div>
                                    : ''}
                                </ul>
                            </div>
                        </div>
                        <div className="content-detail">
                                <h4 className="title-content-detail uppercase">
                                    <StarFilled style={{marginRight: '10px'}}/> Mục tiêu và cam kết
                                </h4>
                                <div className="info-item">
                                    <ul>
                                        {description.data.muc_tieu_cam_ket !== null ?
                                            <div dangerouslySetInnerHTML={{ __html: description.data.muc_tieu_cam_ket }}></div>
                                        : ''}
                                    </ul>
                                </div>
                        </div>
                        <div className="content-detail">
                            <h4 className="title-content-detail uppercase">
                                <UsergroupAddOutlined style={{marginRight: '10px'}}/> Đối tượng đào tạo
                            </h4>
                            {description.data.doi_tuong !== null ?
                                <div className="info-item" dangerouslySetInnerHTML={{ __html: description.data.doi_tuong }}></div>
                            : ''}
                        </div>
                        <div className="content-detail content-detail-nd">
                            <h4 className="title-content-detail uppercase">
                                <MenuOutlined style={{marginRight: '10px'}}/> Nội dung chi tiết khóa học
                            </h4>
                            {description.data.noi_dung_chi_tiet !== null ? 
                                <div className="info-item" dangerouslySetInnerHTML={{ __html: description.data.noi_dung_chi_tiet }}></div>
                            : ''}
                        </div>
                        <div className="content-detail">
                            <h4 className="title-content-detail uppercase">
                                <BankFilled style={{marginRight: '10px'}}/> Xếp lớp và thời gian đào tạo
                            </h4>
                            {description.data.xep_lop_thoi_gian !== null ?
                                <div className="info-item" dangerouslySetInnerHTML={{ __html: description.data.xep_lop_thoi_gian }}></div>
                            : ''}
                        </div>    
                        {/* <div className="content-detail content-detail-nd">
                            <h4 className="title-content-detail uppercase">
                                <DollarOutlined style={{marginRight: '10px'}}/> Học phí
                            </h4>
                            <div className="info-item">
                                Để có thông tin và tư vấn chi tiết về học phí đối với mỗi khóa học các bậc phụ huynh và các em học sinh hãy gọi theo số Hotline: 
                                <a href="tel:1900633234">1900.633.234</a> hoặc <Link to="#">Click vào đây để nhận được tư vấn trực tiếp</Link>
                            </div>
                        </div>    */}
                    </div>
                </Col>
                <Col span={6} className="list-course-advertisement">
                    <SideBarComponent />
                </Col>
            </Row>
        )
    };

    return (
        <Layout className='main-app'>
            <Helmet>
                <title>Học trực tuyến</title>
            </Helmet>
            <Content className="app-content">
                <AppBreadCrumb list={breadcrumbs} hidden={false} />
                {(LoadingCourse && LoadingDescription) && <LoadingCustom />}
                {(course.status === 'success' && course.data && description.status === 'success' && description.data) ? renderIntro(): <NoRecord />}
                <FooterBusiness course={true} />
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
            </Content>
        </Layout>
    )
};

export default IntroCoursePage;