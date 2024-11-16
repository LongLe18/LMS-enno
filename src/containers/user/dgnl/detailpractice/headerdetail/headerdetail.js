import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from 'react-router-dom';
import moment from "moment";
import Hashids from 'hashids';

import * as moduleAction from '../../../../../redux/actions/part';
import * as thematicAction from '../../../../../redux/actions/thematic';
import * as courseAction from '../../../../../redux/actions/course';
import config from '../../../../../configs/index';
import LoadingCustom from 'components/parts/loading/Loading';

import '../../../../../../node_modules/video-react/styles/scss/video-react.scss'
import { Row, Col, Card, CardBody,
    CardHeader } from "reactstrap";

import { Player } from "video-react";

const HeaderDetailPage = (props) => {
    const dispatch = useDispatch();
    const params = useParams();
    const hashids = new Hashids();

    const module = useSelector(state => state.part.item.result);
    const course = useSelector(state => state.course.item.result);
    const loading = useSelector(state => state.part.item.loading);
    const error = useSelector(state => state.part.item.error);
    useEffect(() => {
        dispatch(moduleAction.getModule({ id: props.id }))
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const thematic = useSelector(state => state.thematic.listbyId.result);
    const loadingThematic = useSelector(state => state.thematic.listbyId.loading);
    const errorThematic = useSelector(state => state.thematic.listbyId.error);
    useEffect(() => {
        dispatch(thematicAction.getThematicsByIdModule({ idModule: props.id }));
        dispatch(courseAction.getCourse({ 'id': hashids.decode(params.idCourse) }))
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>               
            <br />
            {(loading ||  loadingThematic) && <LoadingCustom/>}
            { (course.status === 'success' && module.status === "success" && thematic.status === "success") && <Row className="header-detail" style={{margin: 0}}>
                <Col md="4" style={{textAlign: "center"}} className="mt-4">
                    <Card className="shadow-box">
                        <img alt="..." style={{maxHeight: "288px"}}
                            className="img-no-padding img-responsive"
                            src={config.API_URL + module.data.anh_dai_dien}
                        />
                        <div className="title ml-2 mr-2 mt-0 mb-0">
                            <h4 className="blue-text bold mt-0">{module.data.ten_mo_dun}</h4>
                        </div>
                    </Card>                           
                </Col>
                <Col md="4" className="mt-4">
                    <Card className="shadow-box">
                        <CardHeader className="header-course-detail ">
                            <h5 className="white-text bold">Thông tin khóa học</h5>
                        </CardHeader>
                        <CardBody className="header-course-body">
                            <Row>
                                <Col md="5" className="font-weight-4 font-size-header-detail">
                                    Giáo viên
                                </Col>
                                <Col md="7" className="bold font-size-header-detail">
                                    {module.data.ten_giao_vien}
                                </Col>
                            </Row>
                            <Row>
                                <Col md="5" className="font-weight-4 font-size-header-detail">
                                    Số buổi học
                                </Col>
                                <Col md="7" className="bold font-size-header-detail">
                                    {thematic.data.so_buoi_hoc}
                                </Col>
                            </Row>
                            <Row>
                                <Col md="5" className="font-weight-4 font-size-header-detail">
                                    Số bài kiểm tra
                                </Col>
                                <Col md="7" className="bold font-size-header-detail">
                                {thematic.data.so_bai_kiem_tra}
                                </Col>
                            </Row>
                            <Row>
                                <Col md="5" className="font-weight-4 font-size-header-detail">
                                    Khai giảng
                                </Col>
                                <Col md="7" className="bold font-size-header-detail">
                                    {moment(course.data.ngay_bat_dau).utc(7).format(config.DATE_FORMAT_SHORT)}
                                </Col>
                            </Row>
                            <Row>
                                <Col md="5" className="font-weight-4 font-size-header-detail">
                                    Kết thúc
                                </Col>
                                <Col md="7" className="bold font-size-header-detail">
                                {moment(course.data.ngay_ket_thuc).utc(7).format(config.DATE_FORMAT_SHORT)}
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
                <Col md="4" className="mt-4">
                    <Card className="shadow-box">
                        <CardHeader className="header-course-detail ">
                            <h5 className="white-text bold">Video giới thiệu</h5>
                        </CardHeader>
                        <CardBody className="header-course-body">
                            <Player
                                playsInline 
                                poster="/assets/rank/1.png"
                                src={config.API_URL + module.data.video_gioi_thieu}
                                fluid={false}
                            />
                        </CardBody>
                    </Card>
                </Col>
            </Row>     
            }
            {error && !loading && <p>{error}</p>}               
            {errorThematic && !loadingThematic && <p>{errorThematic}</p>}               
        </>
    )
}

export default HeaderDetailPage;