import React, { useEffect, useState } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import Hashids from 'hashids';

// component
import { Row, Col, Button } from 'antd';

// helper
import defaultImage from 'assets/img/default.jpg';
import config from '../../../configs/index';
import moment from 'moment';

// redux
import { useDispatch } from 'react-redux';
import * as courseAction from '../../../redux/actions/course';

const FooterBusiness = (props) => {
    const [dataInit, setdataInit] = useState([]);
    let history = useHistory();
    const idTypeCourse = useParams().idKCT;
    const hashids = new Hashids();
    
    const dispatch = useDispatch();
    
    useEffect(() => {
        const callback = (response) => {
            if (response.status === 'success') {
                response.data.sort((objA, objB) => Number(new Date(objB.ngay_bat_dau)) - Number(new Date(objA.ngay_bat_dau)));
                setdataInit(response.data);
            }
        };

        if (props.course) dispatch(courseAction.getCourses({ idkct: '', status: 1, search: '' }, callback));
        else {
            if (idTypeCourse !== undefined) dispatch(courseAction.getCourses({ idkct: idTypeCourse, status: 1, search: '' }, callback));
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    
    return (
        <footer className="footer list-course-cate">
            <div className="wraper wraper-list-course-cate-index" style={{borderRadius: 6}}>
                {props.course ? 
                <>  
                    <h3 className="section-title section-title-center" style={{marginTop: 24}}>
                        <b></b>
                        <span style={{justifyContent: 'center', textTransform: 'uppercase', 
                            color: 'rgb(21, 87, 21)', fontWeight: 700, margin: '0 15px'}}
                        >
                            Các khoá học khác
                        </span>
                        <b></b>
                    </h3>
                    {dataInit.length > 0 && (
                        // <div >
                            // <h3 className="section-title section-title-center" style={{marginTop: 24}}>
                            //     <b></b>
                            //     <span style={{justifyContent: 'center', textTransform: 'uppercase', 
                            //         color: 'rgb(21, 87, 21)', fontWeight: 700, margin: '0 15px'}}
                            //     >
                            //         Các khoá học khác
                            //     </span>
                            //     <b></b>
                            // </h3>
                        //     <div className="main-section">
                        //         <div className="header-section">
                        //             <h3 className="section-title section-title-center" style={{marginBottom: 0, marginTop: 0}}>
                        //                 <span className="section-title-main">Các khoá học khác</span>
                        //             </h3>
                        //             <Link style={{borderRadius: 8, margin: '12px 15px', display: 'flex', alignItems: 'center', padding: '0px 16px'}} 
                        //                 className="ant-btn ant-btn-default ant-btn-lg"
                        //                 to={`/luyen-tap/trang-chu`}
                        //             >
                        //                 Xem tất cả <RightOutlined style={{marginLeft: 8}}/>
                        //             </Link>
                        //         </div>
                        //         {dataInit.length > 0 && 
                        //             <CardSlider
                        //                 courses={dataInit.slice(4)} 
                        //                 link={`/luyen-tap/gioi-thieu-khoa-hoc/`}
                        //             />
                        //         }
                        //     </div>
                        // </div>
                        <Row gutter={[16, 16]} className="list-cate-items">
                            {dataInit.map((cate, index) => {
                                if (index >= 4) 
                                {
                                    return (
                                        <Col xl={6} sm={12} xs={12} className="course-cate-row" key={cate.khoa_hoc_id}>
                                            <div className="course-cate-box">
                                                <div className="image-box">
                                                    <a href={`/luyen-tap/gioi-thieu-khoa-hoc/${hashids.encode(cate.khoa_hoc_id)}`}>
                                                        <img src={ cate.anh_dai_dien ? config.API_URL + `${cate.anh_dai_dien}` : defaultImage} alt={cate.ten_khoa_hoc} />
                                                    </a>
                                                </div>
                                                <div className="box-text" style={{paddingBottom: 8}}>
                                                    <h3 className="course-cate-title">
                                                        <a href={`/luyen-tap/gioi-thieu-khoa-hoc/${hashids.encode(cate.khoa_hoc_id)}`}>{cate.ten_khoa_hoc}</a>
                                                    </h3>
                                                    <p className="course-cate-description">
                                                        {/* Ngày bắt đầu: {moment(cate.ngay_bat_dau).format(config.DATE_FORMAT_SHORT)} */}
                                                        <a href={`/luyen-tap/gioi-thieu-khoa-hoc/${hashids.encode(cate.khoa_hoc_id)}`}>
                                                            <Button style={{borderRadius: 6}} type="primary" onClick={() => history.push(`/luyen-tap/gioi-thieu-khoa-hoc/${hashids.encode(cate.khoa_hoc_id)}`)}>
                                                                Xem chi tiết
                                                            </Button>
                                                        </a>
                                                    </p>
                                                </div>
                                            </div>
                                        </Col>
                                    )
                                } else return null;
                            })}
                        </Row>
                    )}
                </>
                :
                <>
                    <h2 className="section-title section-title-center">
                        <b></b>
                        <span className="section-title-main" style={{color: 'green'}}>Các Khóa học liên quan</span>
                        <b></b>
                    </h2>
                    {dataInit.length > 0 && (
                        <Row gutter={[16, 16]} className="list-cate-items">
                            {dataInit.map((cate, index) => {
                                if (index >= 4) 
                                {
                                    return (
                                        <Col xl={6} sm={12} xs={12} className="course-cate-row" key={cate.khoa_hoc_id}>
                                            <div className="course-cate-box">
                                                <div className="image-box">
                                                    <Link to={`/luyen-tap/gioi-thieu-khoa-hoc/${cate.khoa_hoc_id}`}>
                                                        <img src={ cate.anh_dai_dien ? config.API_URL + `${cate.anh_dai_dien}` : defaultImage} alt={cate.ten_khoa_hoc} />
                                                    </Link>
                                                </div>
                                                <div className="box-text">
                                                    <h3 className="course-cate-title">
                                                        <Link to={`/luyen-tap/gioi-thieu-khoa-hoc/${cate.khoa_hoc_id}`}>{cate.ten_khoa_hoc}</Link>
                                                    </h3>
                                                    <p className="course-cate-description">
                                                        Ngày bắt đầu: {moment(cate.ngay_bat_dau).format(config.DATE_FORMAT_SHORT)}
                                                        <Link to={`/luyen-tap/gioi-thieu-khoa-hoc/${cate.khoa_hoc_id}`}>
                                                            <Button style={{borderRadius: 6}} type="primary" onClick={() => history.push(`/luyen-tap/gioi-thieu-khoa-hoc/${cate.khoa_hoc_id}`)}>
                                                                Xem chi tiết
                                                            </Button>
                                                        </Link>
                                                    </p>
                                                </div>
                                            </div>
                                        </Col>
                                    )
                                } else return null;
                            })}
                        </Row>
                    )}
                </>
                }
            </div>
        </footer>
    )
}

export default FooterBusiness; 