import React, { useEffect } from "react";
import './css/CourseCates.css';
import './css/business.css';
import './css/Testimonials.css';

import { Helmet } from 'react-helmet';
import { Link } from "react-router-dom";

// helper
import defaultImage from 'assets/img/default.jpg';
import config from '../../../../configs/index';
import Hashids from 'hashids';

// hooks
import useFetch from "hooks/useFetch";

// component
import { Layout, Row, Col, Button } from 'antd';
// import CarouselCustom from 'components/parts/Carousel/Carousel';
import NoRecord from "components/common/NoRecord";
import { StarOutlined, RightOutlined, MenuOutlined } from '@ant-design/icons';
import CardSlider from 'components/parts/CardSlider/CardSlier';
import SideBarComponent from "../mainpractice/sidebar/SideBar";

// redux
import { useSelector, useDispatch } from 'react-redux';
import * as receiptAction from '../../../../redux/actions/receipt';
import * as courseAction from '../../../../redux/actions/course';

const { Content } = Layout;


const CoursesUser = (props) => {
    const dataInit = [];
    const dispatch = useDispatch();
    const hashids = new Hashids();
    
    const coursesUser = useSelector(state => state.receipt.listUser.result);
    const courses = useSelector(state => state.course.list.result);
    const [courseOfUser] = useFetch(`/student/list/course`);

    const typeProgrammes = [
        { id: 1, name: 'Kiểm tra trình độ đầu vào', name2: 'Kiểm tra trình độ đầu vào Online', idElement: 'testEntrance', description: 'Bài kiểm tra được xây dựng bởi đội ngũ các Thầy Cô uy tín, nhiều năm kinh \n nghiệm giảng dạy nhằm đánh giá đúng trình độ đầu vào của mỗi HS' },
        { id: 0, name: 'Thi thử ĐGNL - ĐGTD', name2: 'Thi thử ĐGNL - ĐHQGHN (HSA), ĐGTD - ĐHBK (TSA) Online', idElement: 'testCapacity', description: 'Trải nghiệm làm bài thi ĐGNL ĐHQGHN (HSA) và ĐGTD (TSA) trên phần mềm thi thử \n giống như khi làm bài HSA - TSA trên thực tế ở tổ chức tại ĐHQGHN, ĐHBK ...' },
        { id: 2, name: 'Khóa luyện thi hàng đầu', name2: 'Luyện thi ĐGNL (HSA), ĐGTD (TSA)', idElement: 'study', description: 'Được xây dựng và thiết kế bởi đội ngũ giáo viên, chuyên gia uy tín hàng đầu đến từ ĐHQGHN, ĐHSP HN, ĐHBK ...' },
    ];

    useEffect(() => {
        dispatch(receiptAction.getRECEIPTsUser({ status: 1 }));
        dispatch(courseAction.getCourses({ idkct: '', status: '', search: '' }))
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (coursesUser.status === 'success' && courses.status === 'success') {
        coursesUser.data.map((courseUser, index) => {
            courses.data.map((course, index2) => {
                if (course.khoa_hoc_id === courseUser.san_pham_id) {
                    courseUser.anh_dai_dien = course.anh_dai_dien;
                    courseUser.ngay_bat_dau = course.ngay_bat_dau;
                    courseUser.ngay_ket_thuc = course.ngay_ket_thuc;
                    courseUser.key = index2;
                }
                return null;
            })
            return null;
        })
    };

    // Chuyển sang view thi online đối với khung chương trình có loại - thi online
    // const requestExamOnline = (idCourse) => {
    //     axios.get(config.API_URL + `/exam/onlineExam?khoa_hoc_id=${idCourse}`, { headers: {Authorization: `Bearer ${localStorage.getItem('userToken')}`,} })
    //         .then(
    //             res => {
    //                 if (res.status === 200 && res.statusText === 'OK') {
    //                     let data = res.data.data;
    //                     if (data.length > 0) {
    //                         const randomIndex = Math.floor(Math.random() * data.length);
    //                         const randomlySelectedElement = data[randomIndex];
    //                         history.push(`/luyen-tap/xem/${hashids.encode(randomlySelectedElement.de_thi_id)}/${hashids.encode(idCourse)}`)
    //                     }
    //                     else {
    //                         notification.warning({
    //                             message: 'Cảnh báo',
    //                             description: 'Khóa học này hiện chưa có đề thi. Xin vui lòng thử lại sau',
    //                         })
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

    const renderCourses = () => {
        return (
            <Row className='wraper wraper-list-course-cate-index' style={{marginTop: '30px'}}>
                <Col span={20} className="list-course-content">
                    <div className="list-course-cate">
                        <div className="wraper wraper-list-course-cate-index" style={{padding: 12}}>
                            <div className="section-title-main" style={{textAlign: 'center'}}>
                                <h4 style={{color: 'rgb(255, 16, 16)', fontWeight: 600, fontSize: 32}}>CÁC NỘI DUNG BẠN ĐÃ ĐĂNG KÝ HỌC & LUYỆN THI TẠI TRUNG TÂM</h4>
                            </div>
                            
                            {(courseOfUser.length > 0) ? (
                                typeProgrammes.map((item, index) => {
                                    return (
                                        <div key={index} id={item.idElement}>
                                            <h3 className="section-title section-title-center" style={{marginTop: 24, marginBottom: 0}}>
                                                <b></b>
                                                <MenuOutlined style={{color: 'rgb(21, 87, 21)', fontSize: 20, marginLeft: 6}}/>
                                                <span style={{justifyContent: 'center', textTransform: 'uppercase', 
                                                    color: 'rgb(21, 87, 21)', fontWeight: 700, margin: '0 15px'}}
                                                >
                                                    {item.name}
                                                </span>
                                                <b></b>
                                            </h3>
                                            <div className="description-course">
                                                <div>
                                                    <StarOutlined style={{margin: '0 12px 12px 0', color: '#ff6c00', fontSize: 24}}/>
                                                    <StarOutlined style={{margin: '0 12px 12px 0', color: '#ff6c00', fontSize: 24}}/>
                                                    <StarOutlined style={{margin: '0 12px 12px 0', color: '#ff6c00', fontSize: 24}}/>
                                                </div>
                                            </div>
                                            <div key={index} className="main-section" id={item.idElement}>
                                                <div className="header-section">
                                                    <h3 className="section-title section-title-center" style={{marginBottom: 0, marginTop: 0}}>
                                                        <span className="section-title-main">{item.name2}</span>
                                                    </h3>
                                                    <Link style={{borderRadius: 8, margin: '12px 15px', display: 'flex', alignItems: 'center', padding: '0px 16px'}} 
                                                        className="ant-btn ant-btn-default ant-btn-lg"
                                                        to={`/luyen-tap/khoa-hoc-cua-ban/${item.id}`}
                                                    >
                                                        Xem tất cả <RightOutlined style={{marginLeft: 8}}/>
                                                    </Link>
                                                </div>
                                                {item.id === 0 ?
                                                    <CardSlider id={index} 
                                                        courses={courseOfUser.filter((course) => course.loai_kct === 0 || course.loai_kct === 3)} 
                                                        link={`/luyen-tap/danh-gia-nang-luc/`}
                                                    />
                                                    : item.id === 1 ?
                                                    <CardSlider id={index} 
                                                        courses={courseOfUser.filter((course) => course.loai_kct === 1)} 
                                                        link={`/luyen-tap/kiem-tra/`}
                                                    />
                                                    :
                                                    <CardSlider id={index} 
                                                        courses={courseOfUser.filter((course) => course.loai_kct === 2)} 
                                                        link={`/luyen-tap/luyen-tap/`}
                                                    />
                                                }                        
                                            </div>
                                        </div>
                                    )
                                })
                            ): 
                                <NoRecord title={'Bạn chưa mua khóa học nào'} subTitle={''}/>
                            }
                            {/* Tài liệu */}
                            <div >
                                <h3 className="section-title section-title-center" style={{marginTop: 24, marginBottom: 6}}>
                                    <b></b>
                                    <MenuOutlined style={{color: 'rgb(21, 87, 21)', fontSize: 20, marginLeft: 6}}/>
                                    <span style={{justifyContent: 'center', textTransform: 'uppercase', 
                                        color: 'rgb(21, 87, 21)', fontWeight: 700, margin: '0 15px'}}
                                    >
                                        sách - giáo trình - học liệu
                                    </span>
                                    <b></b>
                                </h3>
                                <div className="description-course">
                                    <div>
                                        <StarOutlined style={{margin: '0 12px 12px 0', color: '#ff6c00', fontSize: 24}}/>
                                        <StarOutlined style={{margin: '0 12px 12px 0', color: '#ff6c00', fontSize: 24}}/>
                                        <StarOutlined style={{margin: '0 12px 12px 0', color: '#ff6c00', fontSize: 24}}/>
                                    </div>
                                </div>
                                <div className="main-section">
                                    <div className="header-section">
                                        <h3 className="section-title section-title-center" style={{marginBottom: 0, marginTop: 0}}>
                                            <span className="section-title-main">Sách - Giáo trình - Học liệu</span>
                                        </h3>
                                    </div>
                                    {dataInit.length > 0 ? (
                                        <Row gutter={[16, 16]} className="list-cate-items">
                                            {coursesUser.data.map((cate, index) => {
                                                if (cate.loai_san_pham === 'Tài liệu') {
                                                    return (
                                                        <Col xl={6} sm={12} xs={12} className="course-cate-row" key={cate.san_pham_id}>
                                                            <div className="course-cate-box">
                                                                <div className="image-box">
                                                                    <Link to={`/luyen-tap/luyen-tap/${hashids.encode(cate.san_pham_id)}`}>
                                                                        <img src={ cate.anh_dai_dien ? config.API_URL + `${cate.anh_dai_dien}` : defaultImage} alt={cate.ten_khoa_hoc} />
                                                                    </Link>
                                                                </div>
                                                                <div className="box-text">
                                                                    <h3 className="course-cate-title">
                                                                        <Link to={`/luyen-tap/luyen-tap/${hashids.encode(cate.san_pham_id)}`}>{cate.ten_san_pham}</Link>
                                                                    </h3>
                                                                    <p className="course-cate-description">
                                                                        {/* <span>Ngày bắt đầu: {moment(cate.ngay_bat_dau).format(config.DATE_FORMAT_SHORT)}</span>
                                                                        <span>Ngày kết thúc: {moment(cate.ngay_ket_thuc).format(config.DATE_FORMAT_SHORT)}</span> */}
                                                                        <Link to={`/luyen-tap/luyen-tap/${hashids.encode(cate.san_pham_id)}`}>
                                                                            <Button type="primary">
                                                                                Bắt đầu xem
                                                                            </Button>
                                                                        </Link>
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    )
                                                }
                                                return null; 
                                            })}
                                        </Row>
                                    ): <NoRecord title={'Bạn chưa mua tài liệu nào'} subTitle={''}/>
                                    }
                                </div>
                            </div>

                        </div>
                    </div>
                </Col>
                <Col span={4} className="list-course-advertisement" >
                    <SideBarComponent />
                </Col>
            </Row>
        )
    }
    return (
        <Layout className="main-app">
            <Helmet>
                <title>Danh sách khóa học của bạn</title>
            </Helmet>
            <Content className="app-content ">
                {renderCourses()}
            </Content>
        </Layout>
    )
}

export default CoursesUser;