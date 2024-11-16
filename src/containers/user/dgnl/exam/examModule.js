import React, { useEffect, useState } from "react";
import { Helmet } from 'react-helmet';
import { useHistory, useParams } from 'react-router-dom';
import config from "../../../../configs/index";
import Hashids from "hashids";
import axios from "axios";

// css
import './css/examConfirm.css';
import { formatedDate } from "helpers/common.helper";
import { CalendarOutlined, UserOutlined } from '@ant-design/icons';

// component
import LoadingCustom from "components/parts/loading/Loading";
import { Layout, Row, Col, Image, Card, Progress, notification } from 'antd';
import AuthModal from "components/common/auth/AuthModal";
import AppBreadCrumb from "components/parts/breadcrumb/AppBreadCrumb";
import NoRecord from "components/common/NoRecord";

// redux
import { useSelector, useDispatch } from 'react-redux';
import * as courseActions from '../../../../redux/actions/course';
import * as examActions from '../../../../redux/actions/exam';

const { Content } = Layout;

const ExamModulePage = (props) => {
    const idCourse = useParams().idCourse;
    const idModule = useParams().idModule;
    const history = useHistory();
    const dispatch = useDispatch();
    const userToken = localStorage.getItem('userToken');
    const hashids = new Hashids();

    const course = useSelector(state => state.course.item.result);
    const examCourse = useSelector(state => state.exam.list.result);
    const loading = useSelector(state => state.exam.list.loading);
    const error = useSelector(state => state.exam.list.error);

    const [existCourse, setExistCourse] = useState(false);

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

    useEffect(() => {
        dispatch(courseActions.getCourse({ id: hashids.decode(idCourse) }));
        dispatch(examActions.filterExam({ idCourse: hashids.decode(idCourse), idModule: hashids.decode(idModule), idThematic: '', status: 1, search: '', 
            start: '', end: '', idType: 2, publish: '', offset: '', limit: 1000000 })); // get exam module
        if (userToken) {
            getCourseOfUser();
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const breadcrumbs = [{ title: 'Đề thi', link: `/luyen-tap/kiem-tra/${idCourse}` }];

    const renderExams = () => {
        const listExams = examCourse.data.map((item, index) => {
            if (index < 0) {
                return (
                    <Col xl={8} sm={8} xs={24} className="list-exam-row" key={index}>
                        <Card bordered hoverable className="list-exam-box" onClick={() => {
                            if (userToken) history.push(`/luyen-tap/mo-dun/xem/${idModule}/${hashids.encode(item.de_thi_id)}/${idCourse}`);
                            else {document.getElementsByClassName('singin')[0].click()}
                        }}>
                            <div className="box-image">
                                <Image preview={false} src={item.anh_dai_dien ? config.API_URL + item.anh_dai_dien : require('assets/img/exam/exam-orange.png').default} />
                            </div>
                            <div className="box-text">
                                <h5 className="list-exam-title-archive">{item.ten_de_thi}</h5>
                                <Progress percent={100} showInfo={false} strokeColor={"#faad14"} />
                                <div className="list-author-archive">
                                    <div className="author">
                                        <UserOutlined /> <span> Trung tâm đào tạo ENNO</span>
                                    </div>
                                    <div className="date">
                                        <CalendarOutlined /> {formatedDate(item.ngay_tao)}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Col>
                )
            } else {
                return (
                    <Col xl={8} sm={8} xs={24} className="list-exam-row" key={index}>
                        <Card bordered hoverable className="list-exam-box" 
                            onClick={() => {
                                if (existCourse) {
                                    history.push(`/luyen-tap/mo-dun/xem/${idModule}/${hashids.encode(item.de_thi_id)}/${idCourse}`);
                                } else {
                                    notification.error({
                                        message: 'Thông báo',
                                        description: 'Bạn chưa đăng ký khóa học này, vui lòng đăng ký để vào học'
                                    });
                                }
                            }}>
                            <div className="box-image">
                                <Image preview={false} src={item.anh_dai_dien ? config.API_URL + item.anh_dai_dien : require('assets/img/exam/exam-orange.png').default} />
                            </div>
                            <div className="box-text">
                                <h5 className="list-exam-title-archive">{item.ten_de_thi}</h5>
                                <Progress percent={100} showInfo={false} strokeColor={"#faad14"} />
                                <div className="list-author-archive">
                                    <div className="author">
                                        <UserOutlined /> <span> Trung tâm đào tạo ENNO</span>
                                    </div>
                                    <div className="date">
                                        <CalendarOutlined /> {formatedDate(item.ngay_tao)}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Col>
                )
            }
        });
        
        if (listExams.length === 0) return <NoRecord />;

        return (
            <div className="list-news">
              <Row gutter={[20, 20]}>{listExams}</Row>
            </div>
        );
    };

    return (
        <>
            {loading && <LoadingCustom/>}
            {(course.status === 'success' && examCourse.status === 'success') &&
                <Layout className="main-app">
                    <Helmet>
                        <title>Danh sách đề thi</title>
                    </Helmet>
                    <Content className="app-content">
                        <div className="header-exam">
                            <h1>{course.data.ten_khoa_hoc}</h1>
                            <br/>
                            <AuthModal />
                        </div>
                        <AppBreadCrumb list={breadcrumbs} hidden={false} />
                        <div className="list-exam-box-archive post-module">
                            <div className="wraper list-news-bg">
                                <Row gutter={[20]}>
                                <Col xl={34} sm={24} xs={24} className="news-left">
                                    <div className="info-course">
                                        <div className="info">
                                            <h1 className="archive-title">Danh sách đề thi</h1>
                                            <>
                                                <p>Giáo viên: Thầy Cô của Trung tâm đào tạo ENNO</p>
                                                <p>Số lượng đề thi: {examCourse.data.length}</p>
                                                <p>Kiểm tra thiết bị trước khi làm bài</p>
                                            </>
                                        </div>
                                    </div>
                                    {renderExams()}
                                </Col>
                                </Row>
                            </div>
                        </div>
                    </Content>
                </Layout>
            }
            {error && notification.error({
                message: 'Thông báo',
                description: 'Lấy dữ liệu đề thi thất bại',
            })}
        </>
    )
}

export default ExamModulePage;
