import React, { useEffect } from "react";
import { NavLink } from 'react-router-dom';
import './css/sidebar.css';

import config from '../../../../../configs/index';
import defaultImage from 'assets/img/default.jpg';
import Hashids from 'hashids';

import { useSelector, useDispatch } from "react-redux";
import * as advertiseAction from '../../../../../redux/actions/advertisement';
// reactstrap components
import {
    Card,
    Carousel,
    CarouselItem,
    CarouselIndicators,
    CarouselCaption,
  } from "reactstrap";


function SideBarComponent() {
    const hashids = new Hashids();
    const dispatch = useDispatch();

    const [activeIndex, setActiveIndex] = React.useState(0);
    const [animating, setAnimating] = React.useState(false);
    const [animating2, setAnimating2] = React.useState(false);

    const [activeIndex2, setActiveIndex2] = React.useState(0);
    
    const coursesAdsFilter = [];
    const courseAds = useSelector(state => state.advertise.listCourse.result);
    const errorcourseAds = useSelector(state => state.advertise.listCourse.error);
    
    const TeachersAdsFilter = [];
    const teacherAds = useSelector(state => state.advertise.listTeacher.result);

    const DocsAdsFilter = [];
    const DocAds = useSelector(state => state.advertise.listDoc.result);

    useEffect(() => {
        dispatch(advertiseAction.getAdsCourses({ status: '' }));
        dispatch(advertiseAction.getAdsTeachers());
        dispatch(advertiseAction.getAdsDocs({ status: '' }));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps


    if (courseAds.status === 'success') {
        courseAds.data.map((item, index) => {
            if (item.trang_thai === 1) {
                coursesAdsFilter.push({ ...item, 'key': index });
            }
            return null;
        })
    };

    if (teacherAds.status === 'success') {
        teacherAds.data.map((item, index) => {
            if (item.trang_thai === 1) {
                TeachersAdsFilter.push({ ...item, 'key': index });
            }
            return null;
        })
    };

    if (DocAds.status === 'success') {
        DocAds.data.map((item, index) => {
            if (item.trang_thai === 1) {
                DocsAdsFilter.push({ ...item, 'key': index });
            }
            return null;
        })
    };
    
    const onExiting = () => {
        setAnimating(true);
    };

    const onExiting2 = () => {
        setAnimating2(true);
    };

    const onExited = () => {
        setAnimating(false);
    };

    const onExited2 = () => {
        setAnimating2(false);
    };

    const next = () => {
        if (TeachersAdsFilter) {
            if (animating) return;
            const nextIndex = activeIndex === TeachersAdsFilter.length - 1 ? 0 : activeIndex + 1;
            setActiveIndex(nextIndex);
        }
    };

    const next2 = () => {
        if (DocsAdsFilter) {
            if (animating) return;
            const nextIndex2 = activeIndex2 === DocsAdsFilter.length - 1 ? 0 : activeIndex2 + 1;
            setActiveIndex2(nextIndex2);
        }
    };

    const previous = () => {
        if (TeachersAdsFilter) {
            if (animating) return;
            const nextIndex = activeIndex === 0 ? TeachersAdsFilter.length - 1 : activeIndex - 1;
            setActiveIndex(nextIndex);
        }
    };

    const previous2 = () => {
        if (DocsAdsFilter) {
            if (animating) return;
            const nextIndex2 = activeIndex2 === 0 ? DocsAdsFilter.length - 1 : activeIndex2 - 1;
            setActiveIndex2(nextIndex2);
        }
    };

    const goToIndex = (newIndex) => {
        if (animating) return;
        setActiveIndex(newIndex);
    };
    
    const goToIndex2 = (newIndex) => {
        if (animating2) return;
        setActiveIndex2(newIndex);
    };

    return (
        <>
            <div className="navbar-collapse widget">
                <span className="widget-title "><span>KHÓA HỌC TRỰC TUYẾN</span></span>
                <ul className="product-categories">
                    {(courseAds.status === 'success' && coursesAdsFilter) && coursesAdsFilter.map(({ khoa_hoc_id, ten_khoa_hoc }) => (
                        <li key={khoa_hoc_id} className="cat-item cat-item-187"><NavLink to={"/luyen-tap/luyen-tap/" + hashids.encode(khoa_hoc_id)} >{ten_khoa_hoc}</NavLink></li>
                    ))
                    }
                    {errorcourseAds && <p>{errorcourseAds}</p>}
                </ul>
                
                <div className="section slider pt-o" id="carousel">
                    <div className="mt-4" style={{textAlign: "center"}}>
                        <h5 className="blue-text">THÔNG TIN GIÁO VIÊN VÀ KHÓA HỌC ONLINE</h5>
                    </div>
                    {TeachersAdsFilter.length > 0 && 
                    <Card className="page-carousel">
                        <Carousel
                        activeIndex={activeIndex}
                        next={next}
                        previous={previous}
                        >
                        <CarouselIndicators
                            items={TeachersAdsFilter}
                            activeIndex={activeIndex}
                            onClickHandler={goToIndex}
                        />
                        {TeachersAdsFilter && TeachersAdsFilter.map((item) => {
                            return (
                            <CarouselItem
                                onExiting={onExiting}
                                onExited={onExited}
                                key={item.anh_dai_dien}
                            >
                                <img src={item.anh_dai_dien !== null ? config.API_URL + item.anh_dai_dien : defaultImage} alt={item.ten_giao_vien} className="img-no-padding img-responsive img-widget" />
                                <CarouselCaption
                                captionText={item.ten_giao_vien}
                                captionHeader={item.ten_khoa_hoc}
                                />
                            </CarouselItem>
                            );
                        })}
                        <a
                            className="left carousel-control carousel-control-prev"
                            data-slide="prev"
                            href="#pablo"
                            onClick={(e) => {
                            e.preventDefault();
                            previous();
                            }}
                            role="button"
                        >
                            <span className="fa fa-angle-left" />
                            <span className="sr-only">Previous</span>
                        </a>
                        <a
                            className="right carousel-control carousel-control-next"
                            data-slide="next"
                            href="#pablo"
                            onClick={(e) => { 
                            e.preventDefault();
                            next();
                            }}
                            role="button"
                        >
                            <span className="fa fa-angle-right" />
                            <span className="sr-only">Next</span>
                        </a>
                        </Carousel>
                    </Card>  
                    }                                
                </div>{" "}

                <div className="section slider pt-o" id="carousel">
                    <div className="mt-4" style={{textAlign: "center"}}>
                        <h5 className="blue-text">DANH MỤC TÀI LIỆU THAM KHẢO</h5>
                    </div>
                    {DocsAdsFilter.length > 0 &&
                    <Card className="page-carousel" style={{margin: 0}}>
                        <Carousel
                        activeIndex={activeIndex2}
                        next={next2}
                        previous={previous2}
                        >
                        <CarouselIndicators
                            items={DocsAdsFilter}
                            activeIndex={activeIndex2}
                            onClickHandler={goToIndex2}
                        />
                        {DocsAdsFilter.map((item) => {
                            return (
                            <CarouselItem
                                onExiting={onExiting2}
                                onExited={onExited2}
                                key={item.anh_dai_dien}
                            >
                                <img src={item.anh_dai_dien !== null ? config.API_URL + item.anh_dai_dien : defaultImage} alt={item.ten_tai_lieu} className="img-no-padding img-responsive img-widget"/>
                                <CarouselCaption
                                captionText={item.ten_tai_lieu}
                                />
                            </CarouselItem>
                            );
                        })}
                        <a
                            className="left carousel-control carousel-control-prev"
                            data-slide="prev"
                            href="#pablo"
                            onClick={(e) => {
                            e.preventDefault();
                            previous2();
                            }}
                            role="button"
                        >
                            <span className="fa fa-angle-left" />
                            <span className="sr-only">Previous</span>
                        </a>
                        <a
                            className="right carousel-control carousel-control-next"
                            data-slide="next"
                            href="#pablo"
                            onClick={(e) => { 
                            e.preventDefault();
                            next2();
                            }}
                            role="button"
                        >
                            <span className="fa fa-angle-right" />
                            <span className="sr-only">Next</span>
                        </a>
                        </Carousel>
                    </Card>                     
                    }             
                </div>{" "}

            </div>
        </>
    )
}

export default SideBarComponent;