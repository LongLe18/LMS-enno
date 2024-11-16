import React, { useEffect, useState } from 'react';
import config from '../../../../configs/index';
import moment from 'moment';
import { useParams, useHistory } from 'react-router-dom';
import "./css/examview.css";
import { Helmet } from 'react-helmet';
import Hashids from 'hashids';

// hooks
import useScrollToTop from 'hooks/useScrollToTop';

// antd
import { Modal, Timeline, Layout, Button, Row, Col, notification, Table } from 'antd';

// component
import AuthModal from 'components/common/auth/AuthModal';
import AppBreadCrumb from "components/parts/breadcrumb/AppBreadCrumb";
import LoadingCustom from 'components/parts/loading/Loading';

// redux
import { useSelector, useDispatch } from 'react-redux';
import * as thematicActions from '../../../../redux/actions/thematic';
import * as moduleActions from '../../../../redux/actions/part';
import * as examActions from '../../../../redux/actions/exam';
import * as criteriaActions from '../../../../redux/actions/criteria';

const { Content } = Layout;

const ExamThematicViewPage = (props) => {
    const data = [];
    const params = useParams();
    const history = useHistory();
    const dispatch = useDispatch();
    const hashids = new Hashids();

    const thematic = useSelector(state => state.thematic.item.result);
    const module = useSelector(state => state.part.item.result);
    const loading = useSelector(state => state.part.item.loading);
    const error = useSelector(state => state.part.item.error);

    const exam = useSelector(state => state.exam.listExamsUser.result);
    const criteria = useSelector(state => state.criteria.itemThematic.result);

    let breadcrumbs = [];
    let breadcrumbsHistory = [];
    const [viewHistory, setViewHistory] = useState(false);

    const [idModule, setIdModule] = useState();
    useScrollToTop()

    const columns = [
        {
            title: 'Làm lại',
            key: 'index',
            responsive: ['lg'],
            render: (value, item, index) => (1 - 1) * 10 + index + 1
        },
        {
            title: 'Thời gian bắt đầu',
            key: 'thoi_diem_bat_dau',
            dataIndex: 'thoi_diem_bat_dau',
            responsive: ['lg'],
            render: (thoi_diem_bat_dau) => moment(thoi_diem_bat_dau).format(config.DATE_FORMAT)
        },
        {
            title: 'Trạng thái',
            dataIndex: 'thoi_diem_ket_thuc',
            key: 'thoi_diem_ket_thuc',
            responsive: ['lg'],
            render: (thoi_diem_ket_thuc) => (
                <>
                    <span>Đã xong</span>
                    <br/>
                    {thoi_diem_ket_thuc !== null ? <span>Đã nộp {moment(thoi_diem_ket_thuc).format(config.DATE_FORMAT)}</span> : <span>Đã nộp</span>}
                </>
            )
        },
        {
            title: 'Điểm',
            dataIndex: 'ket_qua_diem',
            key: 'ket_qua_diem',
            responsive: ['lg'],
            render: (ket_qua_diem, de_thi) => (
                <span>{ket_qua_diem}/{de_thi.tong_diem}</span>
            )
        },
        {
            title: 'Xem lại',
            dataIndex: 'de_thi_id',
            key: 'de_thi_id',
            responsive: ['lg'],
            render: (de_thi_id, de_thi) => (
                  <Button  type="button" onClick={() => history.push(`/luyen-tap/lich-su/${de_thi_id}/${de_thi.dthv_id}`)} className="ant-btn ant-btn-round ant-btn-primary">Xem lại</Button>
              ),
        },
    ];

    useEffect(() => {
        const callback = (res) => {
            setIdModule(res.data.mo_dun_id);
            dispatch(moduleActions.getModule({ id: res.data.mo_dun_id }))
            dispatch(criteriaActions.getCriteriaThematic({ id: hashids.decode(params.id) }));
            dispatch(examActions.getExamsUser({ idExam: '', idModule: res.data.mo_dun_id, type: 1 }))
        }
        dispatch(thematicActions.getThematic({ id: hashids.decode(params.id) }, callback));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (module.status === 'success' && thematic.status === 'success') {
        breadcrumbs.push({ title: 'Đề thi', link: '#' }, { title: module.data.ten_mo_dun, link: '/luyen-tap/chi-tiet-luyen-tap/' + params.id + '/' + params.idCourse}, { title: thematic.data.ten_chuyen_de});
         breadcrumbsHistory.push({ title: 'Đề thi', link: '#' }, { title: module.data.ten_mo_dun, link: '/luyen-tap/chi-tiet-luyen-tap/' + params.id + '/' + params.idCourse }, 
            { title: thematic.data.ten_chuyen_de}, { title: 'Lịch sử làm bài'});
    }

    const userToken = localStorage.getItem('userToken');

    if (exam.status === 'success') exam.data.studentExams.map((item, index) => {
        if (item.thoi_diem_ket_thuc !== null)   
            data.push({...item, 'key': index});
        return null;
    });

    const goExam = () => {
        const subcallback = (res) => {
            const callback = (subres) => {
                if (subres.status === 200 && subres.statusText === 'OK')
                    history.push(`/luyen-tap/lam-kiem-tra/${idModule}/${moment().toNow()}/${params.id}/${subres.data.data.de_thi_id}/${subres.data.data.dthv_id}/${params.idCourse}`);
            };

            if (res.response) {
                if (res.response.data.status === 'error') {
                    notification.warning({
                        message: 'Thông báo',
                        description: 'Số lượng đề không đủ ', 
                    });
                    return;
                } else if (res.response.data.status === 'fail') {
                    notification.warning({
                        message: 'Thông báo',
                        description: 'Bạn không còn đủ lượt thi ', 
                    });
                }
            } else if (res.status === 'success') {
                const data = {
                    "thoi_diem_bat_dau": moment().toISOString(),
                    "de_thi_id": res.data.de_thi_id
                }
                dispatch(examActions.createExamUser(data, callback))
            }
        };

        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            notification.warning({
                message: 'Thông báo',
                description: 'Để đảm bảo chất lượng làm bài thi, Học sinh nên làm bài trên máy tính', 
            });
            return;
        } else {
            if (!userToken) {
                Modal.warning({
                    title: 'Thông báo',
                    content: 'Bạn cần đăng nhập để làm bài thi.',
                });
            } else {
                dispatch(examActions.getExamThematic({ idModule: idModule, idThematic: hashids.decode(params.id), type: 1 }, subcallback));
            }
        }
    };

    const onViewHistory = () => {
        setViewHistory(true);
    };

    const renderDetail = () => {
        return (
            <>         
                {viewHistory ?       
                 <>
                        <div className="intro-exam">
                            <h4>Tổng quan các lần làm bài trước của bạn</h4>
                            {data && <Table className="table-striped-rows" columns={columns} dataSource={data}></Table>}
                        </div>
                        <br/>
                        <p className="block-action text-center" style={{marginTop: 0}}>
                            <Button type="primary" size="large" shape="round" className="join-exam-button" onClick={() => setViewHistory(false)}>
                                Trở về thi thử
                            </Button>
                        </p>
                    </>
                :   
                    <>
                    <p className="size-18 summury-info text-center">
                        Thời gian thi online:<span className="orange-color">{criteria.data.thoi_gian} phút</span>- Số câu hỏi:
                        <span className="orange-color">
                            {criteria.data.so_cau_hoi}/{criteria.data.so_cau_hoi}
                        </span>
                    </p>
                    <div className="intro-exam">
                        <Timeline>
                            <Timeline.Item style={{fontSize: '18px'}}>Tất cả các đề thi Online đều có phương pháp làm bài, đáp án và lời giải chi tiết.</Timeline.Item>
                            <Timeline.Item style={{fontSize: '18px'}}>Đáp án và lời giải chi tiết sẽ được công bố ngay sau khi thành viên nộp bài thi.</Timeline.Item>
                            <Timeline.Item style={{fontSize: '16px'}}>Lưu ý các câu hỏi điền đáp án đúng chỉ điền số nguyên và phân số tối giản</Timeline.Item>
                            <Timeline.Item style={{fontSize: '18px'}}><span style={{color: 'red'}}>Số lượt thi còn lại của bạn: {exam.data.so_lan_thi_con_lai}</span></Timeline.Item>
                        </Timeline>
                    </div>
                    <p className="block-action text-center" style={{marginTop: 0}}>
                        <Button type="primary" size="large" shape="round" className="join-exam-button" onClick={() => goExam()}>
                            Thi ngay
                        </Button>
                        <Button type="default" size="large" shape="round" className="dowload-exam-button" onClick={() => onViewHistory()}>
                            Lịch sử làm bài
                        </Button>
                    </p>
                    </>
                }
                
            </>
        )
    }


    return (
        <Layout className="main-app">
            <Helmet>
                <title>Đề thi đánh giá năng lực</title>
            </Helmet>
            {loading && <LoadingCustom/>}
            {(module.status === 'success' && thematic.status === 'success' && criteria.status === 'success' && exam.status === 'success') &&
                <Content className="app-content">                
                    <div className="header-exam">
                        <h1>ĐỀ THI ĐÁNH GIÁ NĂNG LỰC ĐẠI HỌC QUỐC GIA HÀ NỘI</h1>
                        <h3 className='m-0'>Mô-đun: {module.data.ten_mo_dun}</h3>
                        <h3 className='m-0'>Chuyên đề: {thematic.data.ten_chuyen_de}</h3>
                        <AuthModal />
                    </div>     
                    {viewHistory ? <AppBreadCrumb list={breadcrumbsHistory} hidden={false} />
                    : <AppBreadCrumb list={breadcrumbs} hidden={false} />}  
                    

                    <div className="list-news-box-single post-module">
                        <div className="wraper list-news-bg">
                            <Row gutter={[20]}>
                            <Col xl={24} sm={24} xs={24} className="news-left">
                                {renderDetail()}
                            </Col>
                            </Row>
                        </div>
                    </div>
                </Content>
            }
            {error && notification.error({
                message: 'Thông báo',
                description: 'Lấy dữ liệu bài giảng thất bại',
            })}
        </Layout>
    )
}

export default ExamThematicViewPage;