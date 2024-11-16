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
import { Layout, Row, Col, Image, Card, Progress, notification, Button, Avatar } from 'antd';
import AuthModal from "components/common/auth/AuthModal";
import AppBreadCrumb from "components/parts/breadcrumb/AppBreadCrumb";
import NoRecord from "components/common/NoRecord";

// redux
import { useSelector, useDispatch } from 'react-redux';
import * as courseActions from '../../../../redux/actions/course';
import * as examActions from '../../../../redux/actions/exam';

const { Content } = Layout;

const ExamPage = (props) => {
    const idCourse = useParams().idCourse;
    const history = useHistory();
    const dispatch = useDispatch();
    const userToken = localStorage.getItem('userToken');
    const hashids = new Hashids();

    const course = useSelector(state => state.course.item.result);
    const examCourse = useSelector(state => state.exam.list.result);
    const examCourseOnline = useSelector(state => state.exam.listOnline.result);
    const loading = useSelector(state => state.exam.list.loading);
    const error = useSelector(state => state.exam.list.error);

    const [existCourse, setExistCourse] = useState(false);
    const [isShowRule, setIsShowRule] = useState(false);
    const [idExam, setIdExam] = useState(null);

    // version cũ: Lấy đề thi theo loại đề thi tổng hợp
    const getCourseOfUser = () => {
        axios.get(config.API_URL + `/student/list/course`, { headers: {Authorization: `Bearer ${localStorage.getItem('userToken')}`,} 
        })
            .then(
                res => {
                    if (res.status === 200 && res.statusText === 'OK') {
                        res.data.data.map(course => {
                            if (course.khoa_hoc_id === hashids.decode(idCourse)[0]) {
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
        dispatch(examActions.getExamCourseOnline({ idCourse: hashids.decode(idCourse) }));
        dispatch(examActions.getExamCourse({ idCourse: hashids.decode(idCourse) }));
        if (userToken) {
            getCourseOfUser();
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    
    const breadcrumbs = [{ title: 'Đề thi', link: `/luyen-tap/kiem-tra/${idCourse}` }];
    
    // Hàm xử lý nếu kct_id = 1 => Hiển thị form đồng ý quy định thi 
    const renderConfirmExam = (id) => {
        return (
            <>
                <Row className="logo" align={'middle'}>
                    <Col xs={{ span: 24 }} lg={{ span: 4 }}>
                        <div className="logo">
                            <Avatar shape="square" size={130} src={require('assets/img/logo/vnu-cet-logo.png').default} />
                        </div>
                    </Col>
                    <Col xs={{ span: 22, offset: 1 }} lg={{ span: 10, offset: 4}}>
                        <h4 style={{color: "red", fontWeight: 500, fontSize: 30}}>Bài thi chính thức</h4>
                        <h4 style={{fontWeight: 500}}>Kỳ thi đánh giá năng lực học sinh THPT</h4>
                    </Col>
                </Row>
                <div className="content-page">
                    <span style={{fontWeight: 600, fontSize: 16}}>Hướng dẫn làm bài</span>
                    <div style={{fontSize: 16, textAlign: 'justify'}}>
                        Bài thi ĐGNL học sinh THPT (HSA) gồm 03 phần. Các câu hỏi thi được đánh số lằn lượt từ 1 đến 150 gồm câu hỏi trắc nghiệm khách quan bốn lựa chọn từ các phương án
                        A, B, C hoặc D và câu hỏi điền đáp án. Trường hợp bài thi có thêm câu hỏi thử nghiệm (không tính điểm) thì tỗng số câu hỏi không quá 153 câu. Mỗi câu hỏi trắc nghiệm có một đáp án duy nhất. Thí sinh chọn đáp án bằng cách <span style={{color: 'red'}}>nhấp chuột trái máy tính</span> vào ô đáp án (o), máy tính sẽ tự đông ghi nhận và hiển thị thành ô tròn màu xanh (•). 
                        Trường hợp bạn chọn câu trả lời lằn thứ nhất và muốn chọn lại câu trả lời thì đưa con trỏ chuột máy tính đến đáp án mới và nhấp chuột trái. Ô tròn màu xanh mới (•) sẽ được ghi nhận và ô tròn cũ sẽ trở lại trạng thái ban đầu (o), <span style={{color: 'red'}}>KHÔNG nhấp chuột máy tính quá 2.000 lượt</span> trong suốt quá trình làm bài thi. Thí sinh có thễ bắm chuột vào <span style={{color: 'red'}}>biểu tượng CHK</span> ở góc trên bên phải màn hình đễ kiểm tra ghi nhận của các câu hỏi đã trả lời. Thí sinh được quay lại làm lại câu hỏi trong cùng 1 phần, không thê quay lại
                        làm câu hỏi của phần thi <span style={{color: 'red'}}>đã kết thúc.</span>
                        <br/>
                        Đối với các <span style={{color: 'red'}}>câu hỏi điền đáp án</span>, thí sinh nhập <span style={{color: 'red'}}>đáp án vào ô trống dạng số nguyên dương, nguyên âm</span> (không có dấu cách giữa dấu - và chữ số, ví dụ đúng: -3) <span style={{color: 'red'}}>hoặc phân số tối giản</span> (ví dụ: 3/4), <span style={{color: 'red'}}>không nhập chữ số thập phân, không nhập đơn vị vào ô đáp án</span>. Mỗi câu trả lời đúng được 01 điểm, câu trả lời sai hoặc không trả lời được 0 điểm. <span style={{color: 'red'}}>Hãy thận trọng trước khi lựa chọn đáp án.</span>
                        <br/>
                        <br/>
                        Theo điều 6, khoản 2 của Quy chế thi, bài thi ĐGNL là <span style={{color: 'red'}}>KHÔNG PHÚC KHẢO</span> nên thí sinh bình tĩnh <span style={{color: 'red'}}>đọc kỹ câu hỏi thi, KIẾM TRA cần thận điểm từng phản và ĐIỂM TỔNG bài thi</span> sau khi nộp bài. Nếu có bất kỳ ý kiến thắc mắc về câu hỏi thi, điểm bài thi, công tác tố chức thi... phải thực hiện tại phòng thi bằng cách thông báo cho cán bộ coi thi/Hội đồng thi trước khi ra khỏi phòng thi. Các kiến nghị, thắc mắc của thí sinh sau khi đã <span style={{color: 'red'}}>rời khỏi phòng thi sẽ KHÔNG ĐƯỢC xem xét giải quyết.</span>
                        <br/>
                        <br/>
                        <span style={{fontWeight: 600, fontSize: 18, color: 'green'}}>Cam kết thỏa thuận:</span>
                        <br/>
                        Câu hỏi thi ĐGNL/đề thi là tài sản của Trung tâm Khảo thí ĐHQGHN. Thí sinh tham dự kỳ thi ĐGNL có trách nhiệm bảo quản câu hỏi thi ĐGNL/ đề thi; KHÔNG được phép sao chép một phản hay toàn bộ câu hỏi thi ĐGNL (dạng chữ viết, hình ảnh, âm thanh, video/clip...) 
                        chuyễn cho người khác dưới mọi hình thức trong quá trình làm bài thi và cả khi đã kết thúc ca thi, 
                        KHÔNG được phép mang các tài liệu/tài sản của Trung tâm Khảo thí ra khỏi phòng thi/khu vực thi. 
                        Thí sinh <span style={{color: 'red'}}>KHÔNG được phép tiết lộ, chia sẻ một phản hay toàn bộ dữ kiện của đẻ thi/câu hỏi thi ĐGNL</span> 
                        (dạng hình ảnh,âm thanh, video/clip, chữ viết...) với cá nhân, tỗ chứ khác, trên các phương tiện đại chúng khi chưa có sự đồng ý của Trung tâm Khảo thí ĐHQGHN sau kỳ thi. 
                        Thí sinh vi phạm <span style={{color: 'red'}}>sẽ bị đình chỉ thi, hủy tất cả các kết quả điểm bài thi ĐGNL; dừng và hủy toàn bộ đăng ký (nếu có)</span>. 
                        Trung tâm Khảo thí ĐHQGHN sẽ <span style={{color: 'red'}}>thông báo thí sinh bị đình chỉ thi tới Trường THPT, Sở Giáo dục & Đào tạo, các trường đại học....</span>
                        <br/>
                        <br/>
                        <span style={{fontWeight: 600, fontSize: 18, color: 'green'}}>Trách nhiệm của thí sinh:</span>
                        <br/>
                        Tự chịu trách nhiệm về những vật dụng được phép mang vào phòng thi. Kiểm tra chính xác thông tin cá nhân hiến thị trên màn hình sau đăng nhập.
                        <br/>
                        KHÔNG tự ý đăng nhập, tự ý thoát khỏi chương trình thi, tự ý thoát ra khỏi tài khoản thi trong suốt quá trình làm bài thi, KHÔNG được khởi động lại màn hình, máy tính, đường truyền bằng bắt cứ hình thức nào; 
                        KHÔNG được tắt máy tính khi chưa được CBCT cho phép, 
                        KHÔNG sử dụng bắt cứ một chương trình nào cài đặt trên máy tính trong thời gian thi; 
                        KHÔNG được rời phòng thi trong suốt thời gian làm bài thi.
                        <br/>
                        Nộp lại tất cả các tờ giấy nháp thi (đã sử dụng, chưa sử dụng), nộp lại Phiếu tài khoản cho CBCT và kiểm tra CCCD trước khi rời phòng thi.

                    </div>
                    <p className="block-action text-center mt-4">
                        <Button type="primary" size="large" className="join-exam-button" style={{borderRadius: 8, backgroundColor: 'rgba(0, 115, 8, 0.92)', borderColor: 'rgba(0, 115, 8, 0.92)'}}
                            onClick={() => {
                                if (existCourse) {
                                    history.push(`/luyen-tap/xem/${hashids.encode(idExam)}/${idCourse}`);
                                } else {
                                    notification.error({
                                        message: 'Thông báo',
                                        description: 'Bạn chưa đăng ký khóa học này, vui lòng đăng ký để vào học'
                                    });
                                }
                            }}
                        >
                            Đồng ý
                        </Button>
                    </p>
                </div>
            </>
        )
    }

    const renderExams = () => {
        let listExams = examCourse.data.map((item, index) => {
            if (index <= 0) {
                return (
                    <Col xl={8} sm={8} xs={24} className="list-exam-row" key={index}>
                        <Card bordered hoverable className="list-exam-box" onClick={() => {
                            if (course.data.kct_id === 1) {
                                setIsShowRule(true);
                                setIdExam(item.de_thi_id)
                                return;
                            }
                            if (userToken) history.push(`/luyen-tap/xem/${hashids.encode(item.de_thi_id)}/${idCourse}`);
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
                                if (course.data.kct_id === 1) {
                                    setIsShowRule(true);
                                    setIdExam(item.de_thi_id)
                                    return;
                                }

                                if (existCourse) {
                                    history.push(`/luyen-tap/xem/${hashids.encode(item.de_thi_id)}/${idCourse}`);
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
        
        listExams.push(examCourseOnline.data.map((item, index) => {
            if (index <= 0) {
                return (
                    <Col xl={8} sm={8} xs={24} className="list-exam-row" key={index}>
                        <Card bordered hoverable className="list-exam-box" onClick={() => {
                            if (course.data.kct_id === 1) {
                                setIsShowRule(true);
                                setIdExam(item.de_thi_id)
                                return;
                            }
                            if (userToken) history.push(`/luyen-tap/xem/${hashids.encode(item.de_thi_id)}/${idCourse}`);
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
                                if (course.data.kct_id === 1) {
                                    setIsShowRule(true);
                                    setIdExam(item.de_thi_id)
                                    return;
                                }

                                if (existCourse) {
                                    history.push(`/luyen-tap/xem/${hashids.encode(item.de_thi_id)}/${idCourse}`);
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
        }))

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
            {(course.status === 'success' && examCourse.status === 'success' && examCourseOnline.status === 'success') &&
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
                                    <Col xl={24} sm={24} xs={24} className="news-left">
                                        {!isShowRule &&
                                            <>
                                                <div className="info-course">
                                                    <div className="info">
                                                        <h1 className="archive-title">Danh sách đề thi</h1>
                                                        <p>Giáo viên: Thầy Cô của Trung tâm đào tạo ENNO</p>
                                                        <p>Số lượng đề thi: {examCourse.data.length + examCourseOnline.data.length}</p>
                                                        <p>Kiểm tra thiết bị trước khi làm bài</p>
                                                    </div>
                                                </div>
                                                {renderExams()}
                                            </>
                                        }
                                        {isShowRule && renderConfirmExam()}
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

export default ExamPage;
