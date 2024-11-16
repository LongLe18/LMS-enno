import React, { useEffect, useState } from "react";
import { Helmet } from 'react-helmet';
import { useParams, useHistory, Link } from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';
import Hashids from "hashids";
// import './css/examConfirm.css';
import config from '../../../../configs/index';

// component
import { Layout, Row, Col, Carousel, Table, Steps, Radio, 
    Checkbox, Button, notification, Spin, Menu, Modal } from 'antd';
import Statisic from "components/parts/statisic/Statisic";
import CarouselCustom from 'components/parts/Carousel/Carousel';
import { BookOutlined, BarsOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import SideBarComponent from "../mainpractice/sidebar/SideBar";

// redux
import { useSelector, useDispatch } from 'react-redux';
import * as courseActions from '../../../../redux/actions/course';
import * as majorActions from '../../../../redux/actions/major';
import * as programmeAction from '../../../../redux/actions/programme';

const { Content } = Layout;

const ExamViewDGNL = (props) => {
    const idCourse = useParams().idCourse;
    const dispatch = useDispatch();
    const history = useHistory();
    const hashids = new Hashids();

    const [type, setType] = useState(1);
    const [subjects, setSubjects] = useState([]);
    // const [criteria, setCriteria] = useState();
    const [spinning, setSpinning] = useState(false);
    // isJoinExam: 0 - chưa tham gia, 1 - tham gia thi, 2 - đã chọn môn thi
    const [isJoinExam, setIsJoinExam] = useState(0);
    
    const dataSource = [
        {
          key: '1',
          content: `Phần 1: Toán học và xử lý số liệu (Định lượng)\n- Thời gian: 75 phút - 50 câu\n- Toán học\n- Xử lý số liệu`,
            note: `- 35 câu hỏi trắc nghiệm bốn lựa chọn, 15 câu hỏi điền đáp án\n- Phần thi bắt buộc, thí sinh làm tất cả các câu hỏi trong phần này`,
        },
        {
          key: '2',
          content: `Phần 2: Văn học - Ngôn ngữ (Định tính)\n- Thời gian: 60 phút - 50 câu\n- Văn học\n- Ngôn ngữ`,
            note: `- Gồm 50 câu hỏi trắc nghiệm\n- Phần thi bắt buộc, thí sinh làm tất cả các câu hỏi trong phần này`,
        },
        {
            key: '3',
            content: `Phần 3: Khoa học\n- Thời gian: 60 phút - 50 câu`,
              note: `Phần tự chọn, thí sinh lựa chọn các câu hỏi thuộc 3 trong 5 chủ đề (môn học)`,
        },
    ];

    const dataSourceTableDGTDBK = [
        {
            key: '1',
            content: `Mức độ 1: Tư duy tái hiện`,
            note: `Thể hiện khả năng nhớ lại kiến thức, thực hiện tư duy theo những quy trình đã biết.\n
                Các hành động tư duy cần đánh giá: xác định, tìm kiếm, lựa chọn, nhắc lại, đặt tên, ghép nối ...`,
        },
        {
            key: '2',
            content: `Mức độ 2: Tư duy suy luận`,
            note: `Thể hiện khả năng lập luận có căn cứ, thực hiện tư duy phân tích, tổng hợp dựa theo vận dụng quy trình thích ứng với điều kiện.\n
                Các hành động tư duy cần đánh giá: phân loại, so sánh, chỉ được minh chứng, tổng hợp, vận dụng, đưa ra lí lẽ, suy luận, giải thích, áp dụng, tóm tắt …`,
        },
        {
            key: '3',
            content: `Mức độ 3: Tư duy bậc cao`,
            note: `Thiết lập và thực hiện được các mô hình đánh giá, giải thích dựa trên bằng chứng.\n
                Các hành động tư duy cần đánh giá: phân tích, đánh giá, phân biệt, phán đoán, lập luận (nhiều bước), kiểm tra giả thuyết…`,
        },
    ];

    const columns = [
        {
          title: 'Nội dung',
          dataIndex: 'content',
          key: 'content',
        },
        {
          title: 'Ghi chú',
          dataIndex: 'note',
          key: 'note',
        },
    ];

    const course = useSelector(state => state.course.item.result);
    const majors = useSelector(state => state.major.list.result);
    const programmeCourses = useSelector(state => state.programme.courses.result);

    // sự kiên đổi loại thi phần 3
    const onChangeType = (e) => {
        setType(e.target.value);
    };

    const onChangeSubject = (checkedValues) => {
        /// prevent checked to checkbox
        if (checkedValues.length > 3) {
            checkedValues.shift();
        }
        setSubjects(checkedValues);
    };

    useEffect(() => {
        dispatch(majorActions.getMajors());
        dispatch(courseActions.getCourse({ id: hashids.decode(idCourse) }));
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

    // lấy tiêu chí đề thi ĐGNL
    const getCriteriaDGNL = () => {
        axios({
            method: 'get', 
            url: config.API_URL + `/dgnl-criteria/by_course/${hashids.decode(idCourse)}`, 
            timeout: 1000 * 60 * 5,
            headers: {Authorization: `Bearer ${localStorage.getItem('userToken')}`,}
        })
        .then(
            res => {
                if (res.statusText === 'OK' && res.status === 200) {
                    // setCriteria(res.data.data)
                } else {
                    notification.error({
                        message: 'Thông báo',
                        description: 'Lấy dữ liệu tiêu chí đề thi thất bại',
                    })
                }
            }
        )
        .catch(error => {
            notification.error({ message: error.response.data.message ? 'error.response.data.message' : 'Lấy dữ liệu tiêu chí đề thi thất bại' })
        });
    }

    // kiểm tra xem học viên đang có đề thi chưa hoàn thành hay không
    const isFinisedExam = () => {
        axios({
            method: 'get', 
            url: config.API_URL + `/student_exam/by-exam-dgnl?khoa_hoc_id=${hashids.decode(idCourse)}`, 
            timeout: 1000 * 60 * 5,
            headers: {Authorization: `Bearer ${localStorage.getItem('userToken')}`,}
        })
        .then(
            res => {
                if (res.statusText === 'OK' && res.status === 200) {
                    // Nếu Học viên còn đề thi chưa hoàn thành
                    if (res.data.data) {
                        // Hiển thị modal thông báo
                        Modal.confirm({
                            icon: <ExclamationCircleOutlined />,
                            content: 'Bạn đang có đề thi chưa hoàn thành. Bạn có muốn tiếp tục thi không?',
                            okText: 'Đồng ý',
                            cancelText: 'Hủy',
                            onOk() {
                                history.push(`/luyen-tap/lam-kiem-tra-online/${hashids.encode(res.data?.data?.de_thi_id)}/${moment().toNow()}/${res.data?.data?.dthv_id}/${idCourse}`)
                            },
                        });
                    } else {
                        setIsJoinExam(1);
                        getCriteriaDGNL();
                    }
                } else {
                    notification.error({
                        message: 'Thông báo',
                        description: 'Lấy dữ liệu thất bại',
                    })
                }
            }
        )
        .catch(error => {
            notification.error({
                message: 'Thông báo',
                description: 'Lấy dữ liệu thất bại',
            })
        });
    }

    // Nội dung của ĐGNL HN (loai_kct === 0)
    const contentPageDGNL = () => {
        return (
            <Row id="main-content">
                <Col xl={19} md={24} xs={24} style={{paddingRight: 12}}>
                    <Row style={{margin: '18px 0'}}>
                        <Col xl={24} md={20} xs={20}>
                            <Carousel autoplay style={{marginBottom: 12}}>
                                <img src={require('assets/img/seo-exam-dgnl.png').default} alt='banner1'/>
                            </Carousel>
                        </Col>
                    </Row>
                    {course.status === 'success' &&
                        <>
                            <div className="header-exam">
                                <h1 style={{color: 'rgba(229, 100, 19, 0.92)'}}>GIỚI THIỆU BÀI THI THỬ TRẢI NGHIỆM KỲ THI ĐÁNH GIÁ NĂNG LỰC (HSA)</h1>
                            </div>
                            <div>
                                <h5 className="text-black" style={{fontWeight: 500}}>MỤC ĐÍCH BÀI THI TRẢI NGHIỆM</h5>
                                <span style={{fontSize: 20, fontWeight: 500}}>Giúp thí sinh làm quen với định dạng bài thi Đánh giá năng lực, trải nghiệm ngân hàng câu hỏi phong phú, sẵn sàng kiến thức và tâm lý cho kỳ thi chính thức.</span>
                                <h5 style={{marginTop: 8, fontWeight: 500, color: 'green'}}>CẤU TRÚC BÀI THI</h5>
                                <Table className='table-structure' style={{ whiteSpace: 'break-spaces', textAlign: 'left', fontSize: 20}} dataSource={dataSource} columns={columns} pagination={false}/>
                                <h5 style={{fontWeight: 500, marginTop: 8}}>CHI TIẾT CẤU TRÚC:</h5>
                                <div style={{fontSize: 20}}>
                                    Về hình thức, bài thi ĐGNL năm 2025 điều chỉnh chủ yếu ở phần 3 và cách đặt câu hỏi. Sau khi hoàn thành hai phần thi đầu, phần thi thứ 3 thí sinh sẽ được lựa chọn 3 trong 5 chủ đề thuộc lĩnh vực Lý, Hóa, Sinh, Sử, Địa để hoàn thành bài thi trong thời gian 195 phút (không kể thời gian bù thêm cho câu hỏi thử nghiệm).
                                </div>
                                <div style={{fontSize: 20, marginTop: 6}}>
                                    Riêng phần lựa chọn liên quan đến Ngoại ngữ sẽ được xây dựng thành một hợp phần riêng thay thế phần Khoa học để đánh giá năng lực chuyên biệt.
                                </div>
                                <div style={{fontSize: 20, marginTop: 6}}>
                                    Về câu hỏi, mỗi chủ đề thi sẽ xuất hiện câu hỏi chùm, trong một ngữ cảnh dữ liệu đầu bài sẽ hỏi kèm 1- 3 câu hỏi khác nhau để đánh giá năng lực tổng hợp của thí sinh. Câu hỏi chùm có thể là chủ đề mới với ngữ liệu cho trước đòi hỏi thí sinh phải nhận định, phân tích và đưa ra phương án giải quyết vấn đề đã cho.
                                </div>

                                <div style={{textAlign: 'center'}}>
                                    <img style={{marginTop: 12}} src={require('assets/img/cau-truc-de-thi-dgnl.png').default} alt='banner1'/>
                                </div>

                                <div style={{fontSize: 20}}>
                                    <span style={{fontWeight: 700}}>Phần 1 (bắt buộc):</span> Toán học và Xử lý số liệu được làm bài trong 75 phút gồm 50 câu hỏi (35 câu hỏi trắc nghiệm bốn lựa chọn, 15 câu hỏi điền đáp án) thuộc lĩnh vực đại số và một số yếu tố giải tích, hình học và đo lường, thống kê và xác suất.
                                </div>
                                <div style={{fontSize: 20, marginTop: 6}}>
                                    <span style={{fontWeight: 700}}>Phần 2 (bắt buộc):</span> Ngôn ngữ - Văn học được hoàn thành trong 60 phút gồm 50 câu hỏi trắc nghiệm sử dụng ngữ liệu liên quan đến nhiều lĩnh vực trong đời sống như văn học, ngôn ngữ (từ vựng, ngữ pháp, hoạt động giao tiếp, sự phát triển của ngôn ngữ và các biến thể ngôn ngữ, hành văn), văn hóa, xã hội, lịch sử, địa lý, nghệ thuật, v.v… Ngữ liệu được lựa chọn trong hoặc ngoài chương trình giáo dục phổ thông.
                                </div>
                                <div style={{fontSize: 20, marginTop: 6}}>
                                    <span style={{fontWeight: 700}}>Phần 3 (tự chọn):</span> Khoa học thiết kế thời gian là 60 phút gồm 50 câu hỏi trắc nghiệm và điền đáp án. Thí sinh lựa chọn 3 trong 5 chủ đề thuộc lĩnh vực: Hóa học, Sinh học, Vật lý, Địa lý, Lịch sử
                                </div>
                                
                            </div>
                            <div style={{textAlign: 'center', marginTop: 12, height: 50}}>
                                <Button type="primary" size="large" className="join-exam-button" 
                                    onClick={() => {
                                        // check Học viên có đề thi chưa hoàn thành không
                                        isFinisedExam();
                                    }}
                                    style={{borderRadius: 8, backgroundColor: 'rgb(229 100 19 / 92%)', borderColor: 'rgb(229 100 19 / 92%)', width: '20%'}}
                                >
                                    Tham gia thi
                                </Button>
                            </div>
                        </>
                    }
                </Col>
                <Col xl={5} style={{padding: "0", textAlign: 'center'}}>
                    <Button type="primary" size="large" className="join-exam-button" 
                        onClick={() => {
                            // check Học viên có đề thi chưa hoàn thành không
                            isFinisedExam();
                        }}
                        style={{borderRadius: 8, backgroundColor: 'rgb(229 100 19 / 92%)', borderColor: 'rgb(229 100 19 / 92%)', marginBottom: 12, width: '80%', fontWeight: 700}}
                    >
                        Tham gia thi thử ngay
                    </Button>
                    <SideBarComponent/>
                </Col>
            </Row>
        )
    };
    
    // Nội dung của ĐGTD HN (loai_kct === 3)
    const contentPageDGTDBK = () => {
        return (
            <Row id="main-content">
                <Col xl={19} md={24} xs={24} style={{paddingRight: 12}}>
                    <Row style={{margin: '18px 0'}}>
                        <Col xl={24} md={20} xs={20}>
                            <Carousel autoplay style={{marginBottom: 12}}>
                                <img src={require('assets/img/seo-exam-dgtd-bk.png').default} alt='banner1'/>
                            </Carousel>
                        </Col>
                    </Row>
                    {course.status === 'success' &&
                        <>
                            <div className="header-exam">
                                <h1 style={{color: 'rgba(229, 100, 19, 0.92)'}}>GIỚI THIỆU BÀI THI THỬ TRẢI NGHIỆM KỲ THI ĐÁNH GIÁ NĂNG LỰC (HSA)</h1>
                            </div>
                            <div>
                                <h5 className="text-black" style={{fontWeight: 600}}>MỤC ĐÍCH BÀI THI TRẢI NGHIỆM</h5>
                                <span style={{fontSize: 18, fontWeight: 500}}>Giúp thí sinh làm quen với định dạng bài thi Đánh giá năng lực, trải nghiệm ngân hàng câu hỏi phong phú, sẵn sàng kiến thức và tâm lý cho kỳ thi chính thức.</span>
                                <h5 style={{marginTop: 8, fontWeight: 600}}>CẤU TRÚC BÀI THI</h5>
                                <span  style={{fontSize: 18, fontWeight: 500}}>
                                    Bài thi gồm ba phần thi: tư duy toán học (60 phút), tư duy đọc hiểu (30 phút) và tư duy khoa học/giải quyết vấn đề (60 phút). Đây là ba phần thi độc lập, câu hỏi thi sẽ tập trung vào đánh giá năng lực tư duy của thí sinh trong mỗi phần thi, không đi vào kiểm tra kiến thức của môn học nào.
                                </span>
                                <div style={{textAlign: 'center'}}>
                                    <img style={{marginTop: 12}} src={require('assets/img/cau-truc-bai-thi-dgtd-bach-khoa.jpg').default} alt='banner1'/>
                                </div>
                                <h5 style={{marginTop: 8, fontWeight: 600}}>1. Mức độ đánh giá tư duy</h5>
                                <Table className='table-structure' style={{ whiteSpace: 'break-spaces', textAlign: 'left', fontSize: 20}} dataSource={dataSourceTableDGTDBK} columns={columns} pagination={false}/>
                                <h5 style={{marginTop: 8, fontWeight: 600}}>2. Lĩnh vực đánh giá</h5>
                                <div style={{fontSize: 18 }}>
                                    Với định hướng đánh giá tư duy của học sinh, đem lại sự thành công cho người học ở bậc đại học, trong bài thi đánh giá tư duy ba năng lực tư duy đã được xác định gồm:
                                    <br/>(1) Tư duy Toán học
                                    <br/>(2) Tư duy Đọc hiểu
                                    <br/>(3) Tư duy Khoa học/Giải quyết vấn đề.

                                    <br/><br/>
                                    <span style={{fontStyle: 'italic'}}>Phần đánh giá tư duy toán học:</span> nội dung gồm kiến thức về các lĩnh vực số học, đại số, hàm số, hình học, thống kê và xác xuất. Cấu trúc câu hỏi có ý nghĩa cả về vấn đề và ngữ cảnh, đại diện cho các mối quan hệ toán học; truy cập các kiến thức toán học bằng trí nhớ; kết hợp với thông tin đã cho; mô hình hóa, tính toán và thao tác toán học; diễn giải; áp dụng các kỹ năng lập luận, đưa ra quyết định dựa trên toán học và thuật toán/tựa thuật toán phù hợp. Phần đánh giá tư duy toán học nhấn mạnh tới tư duy định lượng và áp dụng phần tính toán hoặc ghi nhớ các công thức phức tạp. Các câu hỏi hàm chứa các vấn đề từ dễ đến khó với độ tin cậy để đảm bảo mức độ phân hóa thí sinh theo yêu cầu.
                                    <br/><br/>
                                    <span style={{fontStyle: 'italic'}}>Phần đánh giá tư duy đọc hiểu: </span>đánh giá khả năng đọc nhanh và hiểu đúng. Các câu hỏi của phần thi đọc hiểu yêu cầu học sinh chuyển hóa ý nghĩa từ một số văn bản thuộc các thể loại: Văn bản khoa học, Văn bản văn học, Văn bản báo chí, nhằm đo lường khả năng thu thập được thông tin với những gì được tuyên bố rõ ràng và lập luận để xác định ý nghĩa tiềm ẩn. Các câu hỏi yêu cầu học sinh sử dụng các kỹ năng viện dẫn và lập luận để xác định các ý chính, định vị và giải thích các chi tiết quan trọng; hiểu chuỗi các sự kiện, so sánh, hiểu mối quan hệ nhân quả, xác định ý nghĩa của từ, cụm từ và các tuyên bố dựa vào ngữ cảnh; khái quát hóa, phân tích giọng văn và phương pháp của tác giả; phân tích các đòi hỏi và bằng chứng trong các cuộc tranh luận và tích hợp thông tin từ nhiều văn bản liên quan.
                                    
                                    <br/><br/>
                                    <span style={{fontStyle: 'italic'}}>Phần đánh giá tư duy khoa học/giải quyết vấn đề: </span>Phần thi được thiết kế gồm (1) Tập hợp các thông tin khoa học và (2) Các câu hỏi trắc nghiệm, nhằm đo lường khả năng: tính, giải thích được dữ liệu; chỉ ra được phương án phù hợp với thông tin khoa học; thiết lập và thực hiện được các mô hình đánh giá, suy luận và kết quả thử nghiệm.
                                        Thông tin khoa học được truyền tải theo một trong ba định dạng khác nhau: biểu diễn dữ liệu (đồ thị khoa học, bảng biểu và sơ đồ), tóm tắt nghiên cứu (mô tả một hoặc nhiều thí nghiệm liên quan) hoặc quan điểm xung đột (hai hoặc nhiều tóm tắt mô hình lý thuyết, hiện tượng không phù hợp với nhau).
                                </div>
                                <h5 style={{marginTop: 8, fontWeight: 600}}>3. Kiểu câu hỏi đánh giá tư duy</h5>
                                <div style={{fontSize: 18 }}>
                                    Đề thi gồm các câu hỏi trắc nghiệm. Những kiểu câu hỏi trắc nghiệm được sử dụng bao gồm (câu hỏi chỉ được tính điểm nếu thí sinh lựa chọn đầy đủ phương án):
                                    <br/>- Nhiều lựa chọn (chọn nhiều phương án đúng).
                                    <br/>- Lựa chọn: Đúng/Sai
                                    <br/>- Trả lời ngắn (điền câu trả lời).
                                    <br/>- Kéo thả (chọn sẵn trong menu)

                                    <br/>Đề thi đánh giá tư duy có những đặc thù rất riêng do vậy học sinh tham gia bắt buộc nên tham khảo và làm thử đề thi trước khi dự thi.
                                </div>
                                
                            </div>
                            <div style={{textAlign: 'center', marginTop: 12, height: 50}}>
                                <Button type="primary" size="large" className="join-exam-button" 
                                    onClick={() => {
                                        // check Học viên có đề thi chưa hoàn thành không
                                        isFinisedExam();
                                    }}
                                    style={{borderRadius: 8, backgroundColor: 'rgb(229 100 19 / 92%)', borderColor: 'rgb(229 100 19 / 92%)', width: '20%'}}
                                >
                                    Tham gia thi
                                </Button>
                            </div>
                        </>
                    }
                </Col>
                <Col xl={5} style={{padding: "0", textAlign: 'center'}}>
                    <Button type="primary" size="large" className="join-exam-button" 
                        onClick={() => {
                            // check Học viên có đề thi chưa hoàn thành không
                            isFinisedExam();
                        }}
                        style={{borderRadius: 8, backgroundColor: 'rgb(229 100 19 / 92%)', borderColor: 'rgb(229 100 19 / 92%)', marginBottom: 12, width: '80%', fontWeight: 700}}
                    >
                        Tham gia thi thử ngay
                    </Button>
                    <SideBarComponent/>
                </Col>
            </Row>
        )
    }

    // Trang giới thiệu cấu trúc thi
    const renderPages = () => {
        document.getElementById("main-content")?.scrollIntoView({
            behavior: "smooth"
        })
        
        return (
            <div className="list-course-cate">        
                <div className="wraper wraper-list-course-cate-index" >
                    
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

                    {course?.data?.loai_kct === 0 ? contentPageDGNL() : contentPageDGTDBK()}
                </div>
            </div>
        )
    };

    // Trang chọn môn thi
    const formSubject = () => {
        // Form chọn các môn thi 
        return (
            <Spin spinning={spinning}  tip="Đang xử lý tạo đề thi. Quá trình này sẽ mất thời gian, bạn xin vui lòng chờ">
                <div className="form-exam" style={{fontSize: 20, display: 'flex', alignItems: 'center'}}>
                    <div className="title-main" style={{display: 'flex', alignItems: 'center', marginBottom: 12, width: '90%'}}>
                        <img alt="hsa" src={require('assets/img/logo/logo-hsa.png').default} style={{width: '15%'}}/>
                        <span className="textCenter" style={{textTransform: 'uppercase', color: 'rgb(255, 48, 7)', fontSize: 34}}>Chào mừng bạn tham gia kỳ thi thử ĐGNL ĐHQGHN (HSA)</span>
                        <img alt="hsa" src={require('assets/img/logo/logo-hsa.png').default} style={{width: '15%'}}/>
                    </div>

                    <div style={{width: '90%', padding: 12, border: 'rgb(45, 116, 219) solid 2px', borderRadius: 6, boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)'}}>
                        <h6 style={{margin: '24px 0px 12px 0px', color: 'rgb(24, 98, 24)', fontWeight: 700, fontSize: 26}}>Cấu trúc bài thi</h6>
                        <Steps style={{alignItems: 'center'}}
                            progressDot
                            current={2}
                            direction="vertical"
                            items={[
                                {
                                    title: 'Phần 1: Tư duy định lượng (Toán học và xử lý số liệu)',
                                },
                                {
                                    title: 'Phần 2: Tư duy định tính (Văn học - Ngôn ngữ)',
                                },
                                {
                                    title: type === 5 ? 'Phần 3: Tiếng Anh' : 'Phần 3: Khoa học',
                                },
                            ]}
                        />
                        <Radio.Group onChange={onChangeType} value={type}>
                            <Radio value={1}>Khoa học</Radio>
                            <Radio value={5}>Tiếng Anh</Radio>
                        </Radio.Group>
                        {type === 1 && 
                            <>
                                <h6 style={{marginTop: 12, fontSize: 24}}>Bạn hãy chọn 3 môn phía dưới:</h6>
                            
                                <Checkbox.Group style={{ width: '100%', display: 'flex', justifyContent: 'center' }} onChange={onChangeSubject} value={subjects}>
                                    <Row style={{width: '10%', textAlign: 'left'}}>
                                        {majors.status === 'success' && 
                                            majors.data.map((major, index) => {

                                                if (major.chuyen_nganh_id !== 1 && major.chuyen_nganh_id !== 7 && major.chuyen_nganh_id !== 5) {
                                                    return (
                                                        <Col span={24} key={index}>
                                                            <Checkbox value={major.chuyen_nganh_id} checked={true}>{major.ten_chuyen_nganh}</Checkbox>
                                                        </Col>
                                                    )
                                                }
                                                return null;
                                            })
                                        }
                                    </Row>
                                </Checkbox.Group>
                            </>
                        }

                        <p className="block-action text-center mt-4">
                            <Button type="primary" size="large" className="join-exam-button" 
                                style={{borderRadius: 8, backgroundColor: 'rgb(229 100 19 / 92%)', borderColor: 'rgb(229 100 19 / 92%)', width: '10%'}}
                                onClick={() => {
                                    // Nếu không chọn Tiếng Anh thì phải Chọn đủ 3 môn học
                                    if (type !== 5 && subjects.length < 3) {
                                        notification.error({
                                            message: 'Thông báo',
                                            description: 'Vui lòng chọn đủ 3 môn học mà bạn muốn thi'
                                        });
                                        return;
                                    }
                                    setIsJoinExam(2);
                                }}
                            >
                                Bắt đầu
                            </Button>
                        </p>
                    </div>
                </div>
            </Spin>
        )
    }

    const renderConfirmExam = (id) => {
        return (
            <div className="wraper wraper-list-course-cate-index">
                <Row className="logo" align={'middle'} style={{marginTop: 12}}>
                    {/* <Col xs={{ span: 24 }} lg={{ span: 4 }}>
                        <div className="logo">
                            <Avatar shape="square" size={130} src={require('assets/img/logo/vnu-cet-logo.png').default} />
                        </div>
                    </Col> */}
                    <Col xs={{ span: 24 }} lg={{ span: 24, }} style={{textAlign: 'center'}}>
                        <h4 style={{color: "red", fontWeight: 500, fontSize: 30}}>Chào mừng bạn tham gia kỳ thi thử ĐGNL ĐHQGHN (HSA)</h4>
                        <h4 style={{fontWeight: 500}}>Kỳ thi đánh giá năng lực học sinh THPT</h4>
                    </Col>
                </Row>
                <div className="content-page">
                    <span style={{fontWeight: 600, fontSize: 20, color: 'green'}}>Hướng dẫn làm bài</span>
                    <div style={{fontSize: 20, textAlign: 'justify'}}>
                        Bài thi ĐGNL học sinh THPT (HSA) gồm 03 phần. Các câu hỏi thi được đánh số lằn lượt từ 1 đến 150 gồm câu hỏi trắc nghiệm khách quan bốn lựa chọn từ các phương án
                        A, B, C hoặc D và câu hỏi điền đáp án. Trường hợp bài thi có thêm câu hỏi thử nghiệm (không tính điểm) thì tỗng số câu hỏi không quá 153 câu. Mỗi câu hỏi trắc nghiệm có một đáp án duy nhất. Thí sinh chọn đáp án bằng cách <span style={{color: 'red'}}>nhấp chuột trái máy tính</span> vào ô đáp án (o), máy tính sẽ tự đông ghi nhận và hiển thị thành ô tròn màu xanh (•). 
                        Trường hợp bạn chọn câu trả lời lằn thứ nhất và muốn chọn lại câu trả lời thì đưa con trỏ chuột máy tính đến đáp án mới và nhấp chuột trái. Ô tròn màu xanh mới (•) sẽ được ghi nhận và ô tròn cũ sẽ trở lại trạng thái ban đầu (o), <span style={{color: 'red'}}>KHÔNG nhấp chuột máy tính quá 2.000 lượt</span> trong suốt quá trình làm bài thi. Thí sinh có thễ bắm chuột vào <span style={{color: 'red'}}>biểu tượng CHK</span> ở góc trên bên phải màn hình đễ kiểm tra ghi nhận của các câu hỏi đã trả lời. Thí sinh được quay lại làm lại câu hỏi trong cùng 1 phần, không thê quay lại
                        làm câu hỏi của phần thi <span style={{color: 'red'}}>đã kết thúc.</span>
                        <br/>
                        <span style={{background: 'yellow'}}>Đối với các <span style={{color: 'red'}}>câu hỏi điền đáp án</span>, thí sinh nhập <span style={{color: 'red'}}>đáp án vào ô trống dạng số nguyên dương, nguyên âm</span> (không có dấu cách giữa dấu - và chữ số, ví dụ đúng: -3) <span style={{color: 'red'}}>hoặc phân số tối giản</span> (ví dụ: 3/4), <span style={{color: 'red'}}>không nhập chữ số thập phân, không nhập đơn vị vào ô đáp án</span>. Mỗi câu trả lời đúng được 01 điểm, câu trả lời sai hoặc không trả lời được 0 điểm. <span style={{color: 'red'}}>Hãy thận trọng trước khi lựa chọn đáp án.</span></span>
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
                        Thí sinh <span style={{color: 'red'}}>KHÔNG được phép tiết lộ, chia sẻ một phản hay toàn bộ dữ kiện của đẻ thi/câu hỏi thi ĐGNL </span> 
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
                        <Button type="primary" size="large" className="join-exam-button" 
                            style={{borderRadius: 8, backgroundColor: 'rgb(229 100 19 / 92%)', borderColor: 'rgb(229 100 19 / 92%)', width: '10%'}}
                            onClick={() => {
                                const data = {
                                    "khoa_hoc_id": hashids.decode(idCourse)[0],
                                    "chuyen_nganh_ids": type === 5 ? type.toString() : subjects.join(', ')
                                };
                                localStorage.setItem('mon_thi', type === 5 ? type.toString() : subjects.join(', '));
                                // Tạo đề thi
                                setSpinning(true); // chờ
                                axios({
                                    method: 'post', 
                                    url: config.API_URL + `/student_exam/dgnl/create`, 
                                    timeout: 1000 * 60 * 5,
                                    data,
                                    headers: {Authorization: `Bearer ${localStorage.getItem('userToken')}`,}
                                })
                                .then(
                                    res => {
                                        if (res.statusText === 'OK' && res.status === 200) {
                                            setSpinning(false);
                                            // điều hướng vào bài thi
                                            history.push(`/luyen-tap/xem/${hashids.encode(res.data.data.de_thi_id)}/${idCourse}`);
                                        } else {
                                            notification.error({
                                                message: 'Thông báo',
                                                description: 'Tạo đề thi thất bại. Bạn xin vui lòng thử lại sau ít phút...',
                                            })
                                        }
                                    }
                                )
                                .catch(error => {
                                    notification.error({ message: error.response.data.message ? error.response.data.message : 'Tạo đề thi thất bại' })
                                });
                            }}
                        >
                            Đồng ý
                        </Button>
                    </p>
                </div>
            </div>
        )
    }

    return (
        <>
            <Layout className="main-app-dgnl">
                <Helmet>
                    <title>Thi thử đánh giá năng lực</title>
                </Helmet>
                <Content className="app-content ">
                    {isJoinExam === 1 ? formSubject() : isJoinExam === 0 ? renderPages() : renderConfirmExam()}
                </Content>
            </Layout>
        </>
    )
}

export default ExamViewDGNL;