import React, { useEffect, useState } from 'react';
import config from '../../../../configs/index';
import "./css/examview.css";
import moment from 'moment';
import { Helmet } from 'react-helmet';
import {  useHistory, useParams } from 'react-router-dom';
import { formatedDate } from 'helpers/common.helper';
import Hashids from 'hashids';

// antd
import { Modal, Timeline, Layout, Button, Row, Col, notification, Table } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';

// component
import LoadingCustom from 'components/parts/loading/Loading';
import AuthModal from 'components/common/auth/AuthModal';
import AppBreadCrumb from "components/parts/breadcrumb/AppBreadCrumb";

// redux
import { useSelector, useDispatch } from 'react-redux';
import * as courseActions from '../../../../redux/actions/course';
import * as examActions from '../../../../redux/actions/exam';

const { Content } = Layout;

const ExamViewPage = (props) => {
    const data = [];
    const params = useParams();
    const history = useHistory();
    const dispatch = useDispatch();
    const hashids = new Hashids();

    let breadcrumbs = [];
    let breadcrumbsHistory = [];
    const [viewHistory, setViewHistory] = useState(false);
    const [typeExam, setTypeExam] = useState(0);

    const course = useSelector(state => state.course.item.result);
    const exam = useSelector(state => state.exam.item.result);
    const examUser = useSelector(state => state.exam.listExamsUser.result);
    const loading = useSelector(state => state.exam.list.loading);
    const error = useSelector(state => state.exam.list.error);
    
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
                    <Button  type="button" onClick={
                        () => history.push(`/luyen-tap/lich-su/${de_thi_id}/${de_thi.dthv_id}`)
                    } className="ant-btn ant-btn-round ant-btn-primary">Xem lại</Button>
              ),
        },
    ];

    useEffect(() => {
        dispatch(courseActions.getCourse({ id: hashids.decode(params.idCourse) }));
        dispatch(examActions.getExam({ id: hashids.decode(params.idExam) }, (response) => {
            if (response.status === 'success') {
                setTypeExam(response.data.loai_de_thi_id);
            }
        }));
        
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (exam.status === 'success') {
        breadcrumbs = [{ title: 'Đề thi', link: `/luyen-tap/kiem-tra/${params.idCourse}` }, { title: `${exam.data.ten_de_thi}`, link: `/luyen-tap/xem/${params.idExam}/${params.idCourse}`}];
        breadcrumbsHistory.push({ title: 'Đề thi', link: `/luyen-tap/kiem-tra` }, { title: `${exam.data.ten_de_thi}`, link: `/luyen-tap/xem/${params.idExam}/${params.idCourse}`}, { title: 'Lịch sử làm bài'});
    }

    if (examUser.status === 'success') examUser.data.map((item, index) => {
        if (item.thoi_diem_ket_thuc !== null)   
            data.push({...item, 'key': index});
        return null;
    })

    const userToken = localStorage.getItem('userToken');
    const mon_thi = localStorage.getItem('mon_thi');

    const goExam = () => {
        if (!userToken) {
            Modal.warning({
                title: 'Thông báo',
                content: 'Bạn cần đăng nhập để làm bài thi.',
            });
            return;
        } 
        
        if (course.data?.loai_kct === 0) { // Nếu là loại kct ĐGNL
            const callback = (response) => {
                if (response.status === 'success') {
                    let info = {
                        "thoi_diem_bat_dau": moment().toISOString(),
                    }
                    dispatch(examActions.editExamUser({ idExam: response.data[0].dthv_id, formData: info }, (res) => {
                        if (exam.data.loai_de_thi_id === 4 || exam.data.loai_de_thi_id === 5) {
                            history.push(`/luyen-tap/lam-kiem-tra-online/${params.idExam}/${moment().toNow()}/${response.data[0].dthv_id}/${params.idCourse}`)
                        } else if (exam.data.loai_de_thi_id === 6) { // tư duy BK
                            
                        } else {
                            history.push(`/luyen-tap/lam-kiem-tra/${params.idExam}/${moment().toNow()}/${response.data[0].dthv_id}/${params.idCourse}`);    
                        }
                    }))
                }
            }
            dispatch(examActions.getExamsUser({ idExam: hashids.decode(params.idExam), idModule: '', type: typeExam }, callback));
        } else {
            const callback = (res) => {
                if (res.status === 200 && res.statusText === 'OK') {
                    if (exam.data.loai_de_thi_id === 4 || exam.data.loai_de_thi_id === 5) {
                        history.push(`/luyen-tap/lam-kiem-tra-online/${params.idExam}/${moment().toNow()}/${res.data.data.dthv_id}/${params.idCourse}`)
                    } else if (exam.data.loai_de_thi_id === 6) { // tư duy BK

                    } else {
                        history.push(`/luyen-tap/lam-kiem-tra/${params.idExam}/${moment().toNow()}/${res.data.data.dthv_id}/${params.idCourse}`);    
                    }
                }
            };
            const data = {
                "thoi_diem_bat_dau": moment().toISOString(),
                "de_thi_id": hashids.decode(params.idExam)
            }
            dispatch(examActions.createExamUser(data, callback))
        }
    };

    const onViewHistory = () => {
        const callback = (response) => {
            if (response.status === 'success') {
                setViewHistory(true);
            }
        }
        dispatch(examActions.getExamsUser({ idExam: hashids.decode(params.idExam), idModule: '', type: typeExam }, callback));

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
                    <h1 className="single-title">{exam.data.ten_de_thi}</h1>
                    <div className="list-author-single">
                        <div className="author">
                            Tác giả <span>Ban chuyên môn của Trung tâm Luyện thi Quốc gia ENNO</span>
                        </div>{' '}
                        <div className="date">
                            <CalendarOutlined /> {formatedDate(exam.data.ngay_tao)}
                        </div>
                    </div>
                    <div className="content-page">
                        <div className="exam-info">
                            <p className="size-18 summury-info text-center">
                                Thời gian thi online:<span className="orange-color"> {exam.data.thoi_gian} phút </span>- Số câu hỏi:
                                <span className="orange-color"> {exam.data.so_cau_hoi} </span>
                            </p>
                            <div className="intro-exam">
                                <Timeline>
                                    {exam.data.loai_de_thi_id === 4 ?
                                        <>
                                            <Timeline.Item style={{color: 'red'}}>Đề thi Online gồm {exam.data.so_phan} phần</Timeline.Item>
                                            {Array.from({ length: exam.data.so_phan }).map((_, index) => {
                                                return (
                                                    <Timeline.Item color='gray' key={index}>Phần {index + 1} gồm {exam.data[`so_cau_hoi_phan_${index + 1}`]} câu hỏi - thời gian {exam.data[`thoi_gian_phan_${index + 1}`]} phút</Timeline.Item>
                                                )
                                            })}
                                            <Timeline.Item>Thí sinh làm bài thi trực tiếp trên phần mềm máy tính, câu hỏi dưới dạng trắc nghiệm khách quan và điền đáp án.</Timeline.Item>
                                            <Timeline.Item>Lưu ý các câu hỏi điền đáp án đúng chỉ điền số nguyên và phân số tối giản</Timeline.Item>
                                            <Timeline.Item>Sau khi kết thúc mỗi phần thi, máy tính sẽ tự chuyển sang phần tiếp theo. Nếu đang làm bài ở phần 2, thí sinh không thể quay trở lại làm các câu hỏi ở phần 1.</Timeline.Item>
                                        </>
                                        :
                                        <>
                                            <Timeline.Item>Thí sinh làm bài thi trực tiếp trên phần mềm máy tính, câu hỏi dưới dạng trắc nghiệm khách quan và điền đáp án.</Timeline.Item>
                                            <Timeline.Item>Lưu ý các câu hỏi điền đáp án đúng chỉ điền số nguyên và phân số tối giản</Timeline.Item>
                                            <Timeline.Item>Đáp án và lời giải chi tiết sẽ được công bố ngay sau khi thành viên nộp bài thi.</Timeline.Item>
                                        </>
                                    }
                                </Timeline>
                            </div>
                            <p className="block-action text-center mt-0">
                                <Button type="primary" size="large" shape="round" className="join-exam-button" onClick={() => goExam()}>
                                    Thi ngay
                                </Button>
                                <Button type="default" size="large" shape="round" className="dowload-exam-button" onClick={() => onViewHistory()}>
                                    Lịch sử làm bài
                                </Button>
                            </p>
                        </div>
                    </div>
                </>
                }
            </>
        )
    }

    const renderConfirmExam = () => {
        return (
            <>
                <Row className="logo" align={'middle'}>
                    {/* <Col xs={{ span: 24 }} lg={{ span: 4 }}>
                        <div className="logo">
                            <Avatar shape="square" size={130} src={require('assets/img/logo/vnu-cet-logo.png').default} />
                        </div>
                    </Col> */}
                    <Col xs={{ span: 24 }} lg={{ span: 24}}>
                        <h4 style={{fontWeight: 500, fontSize: 30, textAlign: 'center'}}>Kỳ thi đánh giá năng lực học sinh trung học phổ thông</h4>
                    </Col>
                </Row>
                <Row className='title-section' justify={'center'}>
                    <Col xs={{ span: 22, offset: 1 }} lg={{ span: 11, offset: 1 }} >
                        {Array.from({ length: exam.data.so_phan }).map((_, index) => {
                            return (
                                <div key={index} className={`section-${index} detail-title-section`}>Phần {index + 1}: 
                                    {index === 0 ? ` Tư duy định lượng (${exam.data[`so_cau_hoi_phan_${index + 1}`]} câu, ${exam.data[`thoi_gian_phan_${index + 1}`]} phút)` 
                                    : index === 1 ? ` Tư duy định tính (${exam.data[`so_cau_hoi_phan_${index + 1}`]} câu, ${exam.data[`thoi_gian_phan_${index + 1}`]} phút)`
                                    : `${mon_thi.split(',').length === 1 ? ' Ngoại ngữ' : ' Khoa học'} (${exam.data[`so_cau_hoi_phan_${index + 1}`]} câu, ${exam.data[`thoi_gian_phan_${index + 1}`]} phút)`}
                                </div>
                            )
                        })}
                    </Col>
                </Row>
                <div className="content-page" style={{fontSize: 16}}>
                    <span style={{fontSize: 18, color: 'green', fontWeight: 600}}>Tiến trình làm bài thi trên máy tính</span>
                    <br/>
                    <span>Khi BẮT ĐẦU làm bài, màn hình máy tính sẽ hiển thị phần thi thứ nhất:</span>
                    <br/>

                    <div style={{fontStyle: 'italic'}}><span style={{fontWeight: 700}}>Phần 1</span>: Tư duy định lượng</div>

                    Thí sinh làm lần lượt các câu hỏi. Nếu bạn kết thúc phần 1 trước thời gian quy định. Bạn có thể
                    chuyển sang phần thi thứ hai. Khi hết thời gian phần 1, máy tính sẽ tự động chuyển sang phần thi thứ hai.
                    Nếu phần thi có thêm câu hỏi thử nghiệm, máy tính sẽ cộng thời gian tương ứng đề hoàn thành tất cả các
                    câu hỏi.
                    <br/>

                    <div style={{fontStyle: 'italic'}}><span style={{fontWeight: 700}}>Phần 2</span>: Tư duy định tính</div>       

                    Câu hỏi được đánh thứ tự tiếp nối theo thứ tự câu hỏi của phần thi thứ nhất. Nếu bạn kết thúc phần
                    2 trước thời gian quy định, bạn có thể chuyển sang phần thi thứ ba. Khi hết thời gian quy định, máy tính
                    sẽ tự động chuyển sang phần thi thứ ba.
                    <br/>

                    <div style={{fontStyle: 'italic'}}><span style={{fontWeight: 700}}>Phần 3</span>: Khoa học</div>       


                    Câu hỏi được đánh thứ tự tiếp nối theo thứ tự câu hỏi của phần thi thứ hai cho đến câu hỏi cuối
                    cùng. Nếu bạn kết thúc phần 3 trước thời gian quy định, bạn có thể bấm NỘP BÀI đề hoàn thành bài thi
                    sớm. Khi hết thời gian theo quy định, máy tính sẽ tự động NỘP BÀI.
                    <br/>

                    Khi KẾT THÚC bài thi, màn hình máy tính sẽ hiển thị kết quả thi của bạn.

                </div>
                <p className="block-action text-center mt-0">
                    <Button type="primary" size="large" className="join-exam-button" onClick={() => goExam()} 
                        style={{borderRadius: 8, backgroundColor: 'rgb(229 100 19 / 92%)', borderColor: 'rgb(229 100 19 / 92%)'}}
                    >
                        Làm bài thi
                    </Button>
                </p>
            </>
        )
    }

    return (
        <>
            {loading && <LoadingCustom/>}
            {(course.status === 'success' && exam.status === 'success') &&
                <Layout className="main-app">
                    <Helmet>
                        <title>{exam.data.ten_de_thi}</title>
                    </Helmet>
                    
                    <Content className="app-content">                
                        <div className="header-exam">
                            <h1>{course.data.ten_khoa_hoc}</h1>
                            <br/>
                            <AuthModal />
                        </div>       
                        <AppBreadCrumb list={breadcrumbs} hidden={false} />
                
                        <div className="list-news-box-single post-module">
                            <div className="wraper list-news-bg">
                                <Row gutter={[20]}>
                                    <Col xl={24} sm={24} xs={24} className="news-left">
                                        {course.data.loai_kct !== 0 ? renderDetail() : renderConfirmExam()}
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

export default ExamViewPage;