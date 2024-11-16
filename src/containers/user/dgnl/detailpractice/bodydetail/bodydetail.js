import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { get } from 'lodash';
import { useHistory } from 'react-router-dom';
import './body.css'
// helper
import axios from "axios";
import Hashids from "hashids";
import config from '../../../../../configs/index';

import * as thematicActions from '../../../../../redux/actions/thematic';
import * as lessonActions from '../../../../../redux/actions/lesson';
import * as examActions from '../../../../../redux/actions/exam';
import LoadingCustom from 'components/parts/loading/Loading';

import { Button, Row, } from "reactstrap";

// component
import ContentDetailPage from "../contentdetail/contentdetail";
import { notification, Collapse } from 'antd';

const { Panel } = Collapse;

const BodyDetailPage = (props) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const hashids = new Hashids();

    const [idThematic, setidThematic] = useState(0);
    const [existCourse, setExistCourse] = useState(false);
    const userToken = localStorage.getItem('userToken');

    const thematicsFilter = [];
    const examsFilter = [];
    const thematics = useSelector(state => state.thematic.listbyId.result);
    const lesson = useSelector(state => state.lesson.item.result);
    const loading = useSelector(state => state.thematic.list.loading);
    const exams = useSelector(state => state.exam.list.result);
    const error = useSelector(state => state.thematic.list.error);
    const loadingLesson = useSelector(state => state.lesson.item.loading);
    const errorLesson = useSelector(state => state.lesson.item.error);

    const getCourseOfUser = () => {
        axios.get(config.API_URL + `/student/list/course`, { headers: {Authorization: `Bearer ${localStorage.getItem('userToken')}`,} 
        })
            .then(
                res => {
                    if (res.status === 200 && res.statusText === 'OK') {
                        res.data.data.map(course => {
                            if (course.khoa_hoc_id === props.idCourse[0]) {
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

    useEffect(() => {
        dispatch(thematicActions.getThematicsByIdModule({ 'idModule': props?.id }));  
        dispatch(examActions.filterExam({ idCourse: props?.idCourse, idModule: props?.id, idThematic: '', status: 1, search: '', 
            start: '', end: '', idType: 2, publish: '', offset: '', limit: 1000000 })); // get exam module
        if (userToken) {
            getCourseOfUser();
        }    
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const OnHandleThematic = (id) => {
        setidThematic(id);
        dispatch(lessonActions.getLessonByIdThe({ "idThematic": id, idCourse: props.idCourse[0], idModule: props.id })) // Lấy dữ liệu cho lesson
    }

    if (thematics.status === 'success' && exams.status === 'success') {
        let temp = thematics.data.thematics.filter(obj => { // Lọc những phần đang hoạt động
            return obj.trang_thai === true;
        })
        let temp2 = exams.data.filter(obj => { // Lọc những phần đang hoạt động
            return obj.xuat_ban === 1;
        })
        for (let thematic of temp) thematicsFilter.push(thematic);
        for (let exam of temp2) examsFilter.push(exam);
    }

    return (
        <>
            {loading && <LoadingCustom/>}
            <div className="body-detail" style={{padding: 12}}>   
                <div className="title text-center mb-0">
                    <h3 className="red-text bold">CHƯƠNG TRÌNH HỌC</h3>
                </div>

                <Collapse defaultActiveKey={['0']} accordion>
                    { thematics.status === "success" && thematicsFilter.map(({ chuyen_de_id, ten_chuyen_de, mo_ta, ten_lop }, index) => { 
                        if (index < 0) {
                            return (
                                <Panel header={ten_chuyen_de} key={chuyen_de_id}>
                                    <div className="btn-thematic" onClick={() => { 
                                            OnHandleThematic(chuyen_de_id)
                                        }} 
                                    >
                                        VIDEO BÀI GIẢNG
                                    </div>
                                    <div className="btn-thematic" onClick={() => { 
                                            OnHandleThematic(chuyen_de_id)
                                        }} 
                                    >
                                        BÀI GIẢNG (PDF)
                                    </div>
                                    <div className="btn-thematic" onClick={() => { 
                                            window.location.href = `/luyen-tap/chuyen-de/xem/${hashids.encode(chuyen_de_id)}/${hashids.encode(props.idCourse)}`
                                        }} 
                                    >
                                        BÀI KIỂM TRA
                                    </div>
                                </Panel>
                            )
                        } else {
                            return (
                                <Panel header={ten_chuyen_de} key={chuyen_de_id}>
                                    <div className="btn-thematic" onClick={() => { 
                                            if (existCourse) {
                                                OnHandleThematic(chuyen_de_id)
                                            } else {
                                                notification.error({
                                                    message: 'Thông báo',
                                                    description: 'Bạn chưa đăng ký khóa học này',
                                                });
                                            }
                                        }} 
                                    >
                                        VIDEO BÀI GIẢNG
                                    </div>
                                    <div className="btn-thematic" onClick={() => { 
                                            if (existCourse) {
                                                OnHandleThematic(chuyen_de_id)
                                            } else {
                                                notification.error({
                                                    message: 'Thông báo',
                                                    description: 'Bạn chưa đăng ký khóa học này',
                                                });
                                            }
                                        }} 
                                    >
                                        BÀI GIẢNG (PDF)
                                    </div>
                                    <div className="btn-thematic" onClick={() => { 
                                            if (existCourse) {
                                                window.location.href = `/luyen-tap/chuyen-de/xem/${hashids.encode(chuyen_de_id)}/${hashids.encode(props.idCourse)}`
                                            } else {
                                                notification.error({
                                                    message: 'Thông báo',
                                                    description: 'Bạn chưa đăng ký khóa học này',
                                                });
                                            }
                                        }} 
                                    >
                                        BÀI KIỂM TRA
                                    </div>
                                </Panel>
                            )
                        }                                    
                    })}  
                    
                </Collapse>

                {/* <Row className="body-detail-button mb-4">
                    { thematics.status === "success" && thematicsFilter.map(({ chuyen_de_id, ten_chuyen_de, mo_ta, ten_lop }, index) => { 
                        if (index < 0) {
                            return (
                                <Col md="2" key={chuyen_de_id}>
                                    <Button color="info" className="btn-primary nap-lesson" type="button" title={mo_ta} style={{height: 55, maxHeight: 55}}
                                        onClick={() => { OnHandleThematic(chuyen_de_id) }}>{ten_chuyen_de}
                                    </Button>
                                </Col>     
                            )
                        } else {
                            return (
                                <Col md="2" key={chuyen_de_id}>
                                    <Button color="info" className="btn-primary nap-lesson" type="button" title={mo_ta} 
                                        onClick={() => { 
                                            if (existCourse) {
                                                OnHandleThematic(chuyen_de_id)
                                            } else {
                                                notification.error({
                                                    message: 'Thông báo',
                                                    description: 'Bạn chưa đăng ký khóa học này',
                                                });
                                            }
                                        }}>{ten_chuyen_de}
                                    </Button>
                                </Col> 
                            )
                        }                                    
                    })}      
                </Row> */}

                {examsFilter.length > 0 &&
                    <Row className="body-detail-button mb-4">
                        <Button color="success" className="btn-primary" type="button" 
                            onClick={() => history.push(`/luyen-tap/kiem-tra-mo-dun/${hashids.encode(props.idCourse)}/${hashids.encode(props.id)}`) }>
                                Danh sách đề thi mô đun
                        </Button>
                    </Row>
                }
            </div>
            {error && !loading && <p>{error}</p>}    
            {errorLesson && !loadingLesson && notification.error({
                message: get(errorLesson, 'response.data.error', 'Tải dữ liệu bài giảng thất bại: ' + errorLesson.response.data.message),
            })}    
            <br/>
            {(idThematic !== 0 && lesson.status === 'success' && 
                (lesson.data.video.length > 0 || lesson.data.pdf != null)) && 
                    <ContentDetailPage props={lesson} idThematic={idThematic} idModule={props.id} idCourse={props.idCourse}></ContentDetailPage>
            }
        </>
    )
}

export default BodyDetailPage;