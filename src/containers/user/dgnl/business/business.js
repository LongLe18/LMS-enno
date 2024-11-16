import React, { useEffect } from 'react';

import './css/CourseCates.css';
import './css/business.css';
import './css/Testimonials.css';

import { Helmet } from 'react-helmet';
import { Link, useParams } from 'react-router-dom';
// helper
import defaultImage from 'assets/img/default.jpg';
import config from '../../../../configs/index';
// component
import { Layout, Row, Col, Card } from 'antd';
import CarouselCustom from 'components/parts/Carousel/Carousel';
import NoRecord from 'components/common/NoRecord';

// redux
import { useSelector, useDispatch } from 'react-redux';
import * as courseAction from '../../../../redux/actions/course';

const { Content } = Layout;

const BusinessPage = () => {
    const idKCT = useParams().idKCT;
    const data = [];
    const dispatch = useDispatch();
    const courses = useSelector(state => state.course.list.result);

    useEffect(() => {
        dispatch(courseAction.getCourses({ idkct: idKCT, status: 1, search: '' }))
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (courses.status === 'success') {
        courses.data.sort((objA, objB) => Number(new Date(objB.ngay_bat_dau)) - Number(new Date(objA.ngay_bat_dau)));
        courses.data.map((item, index) => {
            if (item.kct_id === Number(idKCT))
                data.push({ ...item, 'key': index });
            return null;
        });
    };

    const renderCoursesCate = () => {
        if (courses.status === 'success' && courses.data.length === 0) return <NoRecord />
        return (
            <div className="list-course-cate">
                <div className="wraper wraper-list-course-cate-index">
                    <CarouselCustom />
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
                                    <Link to={`/luyen-tap/gioi-thieu-khoa-hoc/${cate.khoa_hoc_id}`}>
                                        <Card style={{textAlign: 'center', border: 'none'}}
                                            hoverable
                                            cover={
                                                <img src={ cate.anh_dai_dien ? config.API_URL + `${cate.anh_dai_dien}` : defaultImage} alt={cate.ten_khoa_hoc} />
                                            }
                                        >
                                            <span style={{fontWeight: 'bold'}}>{cate.ten_khoa_hoc}</span>
                                        </Card>
                                    </Link>
                                </Col>
                            )
                        })}
                    </Row>
                    )}
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
        </Layout>
    );
}

export default BusinessPage;