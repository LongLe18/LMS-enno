import React, { useEffect } from "react";
import './css/CourseCates.css';
import './css/business.css';
import './css/Testimonials.css';

import { Helmet } from 'react-helmet';
import { Link } from "react-router-dom";
import Hashids from 'hashids';

// component
import { Layout, Row, Col, Menu, Button } from 'antd';
import CarouselCustom from 'components/parts/Carousel/Carousel';
import { BookOutlined, BarsOutlined } from '@ant-design/icons';
// redux
import { useSelector, useDispatch } from 'react-redux';
import * as programmeAction from '../../../../redux/actions/programme';
import Statisic from "components/parts/statisic/Statisic";

const { Content } = Layout;

const MainPageUser = (props) => {
    const hashids = new Hashids();
    const dispatch = useDispatch();

    const programmeCourses = useSelector(state => state.programme.courses.result);

    useEffect(() => {
        dispatch(programmeAction.getProgrammeCourses());
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    

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
    
    const renderCourses = () => {
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
                    <img alt="..."  style={{borderRadius: 6}}
                        className="img-no-padding img-responsive"
                        src={require("assets/img/lich_khoa_hoc.jpg").default}
                    />

                    <br/>

                    <Row gutter={12} style={{marginTop: 12}}>
                        <Col xl={8} md={12} xs={24}>
                            <div className="intro-trang-chu" style={{display: 'flex'}}>
                                <img alt="..."  style={{borderRadius: 6}}
                                    className="img-no-padding img-responsive"
                                    src={require("assets/img/trang-chu-1.png").default}
                                />
                                <div className="descripion-intro">
                                    <h4>Khoá học</h4>
                                    <span className='descripion'>Cung cấp thông tin đầy đủ về các khóa học, bài giảng chất lượng và lộ trình học tập</span>
                                    <Button type="primary" style={{borderRadius: 8}} size={'large'} 
                                        onClick={() => window.location.href = 'https://enno.edu.vn/khoa-hoc/'}>
                                        Tham khảo
                                    </Button>
                                </div>
                            </div>
                        </Col>
                        <Col xl={8} md={12} xs={24}>
                            <div className="intro-trang-chu" style={{display: 'flex'}}>
                                <img alt="..."  style={{borderRadius: 6}}
                                    className="img-no-padding img-responsive"
                                    src={require("assets/img/trang-chu-2.png").default}
                                />
                                <div className="descripion-intro">
                                    <h4>Sách - Tài liệu</h4>
                                    <span className='descripion'>Đầy đủ giáo trình học, sách ôn luyện từ đơn giản tới nâng cao bám sát chương trình</span>
                                    <Button type="primary" style={{borderRadius: 8}} size={'large'} 
                                        onClick={() => window.location.href = 'https://enno.edu.vn/sach/'}>
                                        Tham khảo
                                    </Button>
                                </div>
                            </div>
                        </Col>
                        <Col xl={8} md={12} xs={24}>
                            <div className="intro-trang-chu" style={{display: 'flex'}}>
                                <img alt="..."  style={{borderRadius: 6}}
                                    className="img-no-padding img-responsive"
                                    src={require("assets/img/trang-chu-3.png").default}
                                />
                                <div className="descripion-intro">
                                    <h4>Thi thử</h4>
                                    <span className='descripion'>Tham gia các kỳ thi thử và làm quen với các hình thức thi mới nhất</span>
                                    <Button type="primary" style={{borderRadius: 8}} size={'large'} 
                                        onClick={() => window.location.href = 'https://enno.edu.vn/sach/'}>
                                        Tham khảo
                                    </Button>
                                </div>
                            </div>
                        </Col>
                    </Row>

                    <br/>

                    <div className="try-exam">
                        <div className="try-exam-description">
                            <h3 style={{color: '#fff', fontWeight: 700}}>THI THỬ - trải nghiệm thật</h3>
                            <h5>Học sinh mong muốn trải nghiệm cuộc thi đánh giá năng lực chuẩn 90%, bám sát hệ thống đề các kỳ thi thật</h5>
                            <h5>Học sinh muốn kiểm tra trình độ, năng lực thực tế qua các bài kiểm tra test đầu vào theo kiến thức chuẩn</h5>
                            <h5>Học sinh mong muốn thử sức với các kỳ thi vào trường chuyên</h5>
                            <div style={{width: '100%', textAlign: 'center'}}>
                                <Button type="primary" style={{borderRadius: 8, color: '#000', backgroundColor: '#fff', borderColor: '#fff'}} size={'large'} 
                                    onClick={() => window.location.href = 'https://enno.edu.vn/lien-he/'}>
                                    Đăng ký
                                </Button>
                            </div>
                        </div>
                        <img alt="..."  style={{borderRadius: 10, width: 560}}
                            className="img-no-padding img-responsive"
                            src={require("assets/img/trang-chu-4.png").default}
                        />
                    </div>
                </div>
            </div>
        )
    };

    return (
        <Layout className="trang-chu">
            <Helmet>
                <title>Trang chủ</title>
            </Helmet>
            <Content className="app-content ">
                {renderCourses()}
            </Content>
        </Layout>
    )
}

export default MainPageUser;