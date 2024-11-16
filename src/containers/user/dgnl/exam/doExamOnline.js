import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Hashids from 'hashids';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import { secondsToMinutes, diff } from 'helpers/common.helper';
import './css/ExamDetail2.scss'
import config from '../../../../configs/index';
import defaultImage from 'assets/img/default.jpg';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
// hook
import useDebounce from 'hooks/useDebounce';

// component
import AuthModal from 'components/common/auth/AuthModal';
import AppBreadCrumb from "components/parts/breadcrumb/AppBreadCrumb";
import NoRecord from 'components/common/NoRecord';
import LoadingCustom from "components/parts/loading/Loading"
import { Layout, Row, Col, Modal, Button, notification, Input, Alert, Upload, 
    message, List, Comment, Space, Timeline, Image, Spin } from 'antd';
import { InfoCircleOutlined, CommentOutlined, UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import TextEditorWidget2 from 'components/common/TextEditor/TextEditor2';
import MathJax from 'react-mathjax';
import alat from 'assets/alat.pdf'

// redux
import { useSelector, useDispatch } from 'react-redux';
import * as examActions from '../../../../redux/actions/exam';
import * as answerActions from '../../../../redux/actions/answer';
import * as evaluationActions from '../../../../redux/actions/evaluate';
import * as commentAction from '../../../../redux/actions/comment';
import * as notificationAction from '../../../../redux/actions/notification';
import * as courseActions from '../../../../redux/actions/course';

const { Content } = Layout;
// const { TextArea } = Input;
const { Dragger } = Upload;

const ExamOnlineDetailDGTD = () => {
    const params = useParams();
    const hashids = new Hashids();
    const userToken = localStorage.getItem('userToken');
    const dispatch = useDispatch();

    const timerId = useRef(null);
    const timeCount = useRef(null);
    let timeOut = '';
    const [PauseModal, contextHolder] = Modal.useModal();
    const [pause, setPause] = useState(false);
    const [isDoing, setIsDoing] = useState(true);
    const [help, setHelp] = useState([]);
    const [commnetOpen, setCommentOpen] = useState([]);
    const [isDetail, setIsDetail] = useState(false);
    const [comment, setComment] = useState('');
    const [countSection, setCountSection] = useState(3600);
    const [timeToDo, setTimeToDo] = useState(null); // Thời gian làm bài
    const [timeToDoAllSection, setTimeToDoAllSection] = useState(null); // Thời gian làm bài các phần
    const [results, setResults] = useState([]);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [loadingExportFile, setLoadingExportFile] = useState(false);
    // eslint-disable-next-line no-unused-vars
    const [startTime, setStartTime] = useState(0);
    const [state, setState] = useState({
        time: 0,
        fileImg: '',
        isReplied: false,
        isEdit: false,
        idComment: 0,
        idSubcomment: 0,
        showSubcomment: false,
        sectionExam: 1,
    });

    const exam = useSelector(state => state.exam.item.result);
    const loading = useSelector(state => state.exam.item.loading);
    const error = useSelector(state => state.exam.item.error);
    const examUser = useSelector(state => state.exam.examUser.result);
    const comments = useSelector(state => state.comment.list.result);
    const evaluations = useSelector(state => state.evaluate.list.result);
    const course = useSelector(state => state.course.item.result);

    let answers = [];
    let breadcrumbs = [];

    const textAnswer = useDebounce(localStorage.getItem('answerText'), 500);

    // props for upload image
    const propsImage = {
        name: 'file',
        action: '#',
  
        beforeUpload: file => {
            const isPNG = file.type === 'image/png' || file.type === 'image/jpeg';
            if (!isPNG) {
                message.error(`${file.name} có định dạng không phải là png/jpg`);
            }
            return isPNG || Upload.LIST_IGNORE;
        },
  
        onChange(info) {
            setState({ ...state, fileImg: info.fileList });
        },
  
        async customRequest(options) {
            const { onSuccess } = options;
        
            setTimeout(() => {
                onSuccess("ok");
            }, 0);
        },
  
        onRemove(e) {
            console.log(e);
            setState({ ...state, fileImg: '' });
        },
    };

    useEffect(() => {
        const callback = (res) => {
            const subCallBack = (subres) => {
                ///// Xử lý trường hợp Khi đã nộp bài
                // Nếu có thời gian kết thúc => đã nộp bài
                if (subres.data.thoi_diem_ket_thuc !== null) {
                    clearInterval(timerId?.current);
                    setStartTime(0);
                    setIsDoing(false); // kết thúc thi
                } else { // Chưa kết thúc đề thi
                    let phan_dang_lam = subres?.data?.phan_dang_lam;
                    const thoi_gian_lam_bai_phan = subres?.data?.thoi_gian_lam_phan.split(','); // [0, 0, 0]
                    setTimeToDoAllSection(thoi_gian_lam_bai_phan);
                    for (let i = 0; i < res?.data.so_phan; i++) {
                        const remainingTimeExam = ((Number(res.data[`thoi_gian_phan_${phan_dang_lam}`]) - thoi_gian_lam_bai_phan[phan_dang_lam - 1]) * 60);
                        // Nếu phần đang làm chưa tới phần cuối cùng
                        if (subres?.data.phan_dang_lam === res?.data.so_phan && remainingTimeExam <= 0) { // Nếu là phần cuối cùng và hết thời thi => kết thúc thi
                            let info = {};
                            if (subres.data.thoi_diem_ket_thuc === null) {
                                info = {
                                    "thoi_gian_lam_bai": secondsToMinutes(res.data.thoi_gian * 60),
                                    "thoi_diem_ket_thuc": moment().toISOString(),
                                }
                            } else {
                                info = {
                                    "thoi_gian_lam_bai": secondsToMinutes(res.data.thoi_gian * 60),
                                }
                            }
                            if (course?.data.loai_kct === 0) dispatch(examActions.editExamDGNLUser({ idExam: params.idExamUser, formData: info }))
                            else dispatch(examActions.editExamUser({ idExam: params.idExamUser, formData: info }))
                            clearInterval(timerId?.current);
                            setStartTime(0);
                            setIsDoing(false); // kết thúc thi
                            break; // Thoát vòng lặp
                        } else if (phan_dang_lam < res?.data.so_phan && remainingTimeExam <= 0) { // Nếu chưa phải là phần cuối cùng và hết thời thi => sang phần tiếp theo
                            phan_dang_lam = phan_dang_lam + 1;

                            continue; // Tiếp tục vòng lặp
                        } else if (subres?.data.phan_dang_lam <= res?.data.so_phan && remainingTimeExam > 0) { // Nếu còn thời gian làm bài
                            setState({...state, sectionExam: phan_dang_lam }); // hiện tại thuộc phần nào của đề thi
                            setCountSection(Math.abs(remainingTimeExam));  // thời gian còn lại của phần thi là bao nhiêu
                            setStartTime(new Date().getTime());
                            // timerId.current = setInterval(() => {
                            //     setCountSection((preCount) => preCount - 1);
                            // }, 1000);
    
                            // 1 phút cập nhật thời gian làm bài 1 lần
                            if (subres?.data?.thoi_gian_lam_phan) setTimeToDo(Number(thoi_gian_lam_bai_phan[phan_dang_lam - 1])); // là số phút
                            // timeCount.current = setInterval(() => {
                            //     setTimeToDo((preValue) => preValue + 1); // Mỗi lần tăng lên 1 phút
                            // }, 60000);
                            break;
                        }
                    }
                }
            }

            if (res.status === 'success') {
                if (res.data.loai_de_thi_id !== 5) dispatch(evaluationActions.getEVALUATEs({ id: hashids.decode(params.idExam), pageIndex: 1, pageSize: 1000 })); // lấy đánh giá
                else dispatch(evaluationActions.getEVALUATEsDGNL({ idCourse: hashids.decode(params.idCourse), pageIndex: 1, pageSize: 1000 }));
                dispatch(examActions.getExamUser({ id: params.idExamUser }, subCallBack)) // Gọi API để lấy thông tin (Thời gian bắt đầu, thời gian kết thúc)
            }
        }
        // remove value with text question
        localStorage.removeItem('answerText');
        localStorage.removeItem('question');

        dispatch(examActions.getExam({ id: hashids.decode(params.idExam) }, callback));
        dispatch(answerActions.getAnswersUser({ idDeThi: params.idExamUser, idQuestion: '' }, 
            (res) => {
                if (res.status === 'success') {
                    if (res.data.length > 0) {
                        let temp = [];
                        res.data.map(item => {
                            if ((item.ket_qua_chon !== null) && (item.ket_qua_chon !== '')) {// Câu trắc nghiệm
                                temp.push({ cau_hoi_id: item.cau_hoi_id, dap_an: renderAnswerKeyV2(item.ket_qua_chon)[0], 
                                    loai_dap_an: true, gia_tri_dap_an: renderAnswerKeyV2(item.ket_qua_chon)[1],
                                    ket_qua_chon: item.ket_qua_chon });
                            }
                            else {// câu tự luận
                                temp.push({ cau_hoi_id: item.cau_hoi_id, noi_dung: item.noi_dung_tra_loi, 
                                    loai_dap_an: false, gia_tri_dap_an: item.noi_dung_tra_loi,
                                    ket_qua_chon: item.noi_dung_tra_lo });
                            }
                            return null;
                        })
                        setResults([...results, ...temp.filter(item => item.dap_an?.length !== 0)]);
                    };
                    res.data.map(item => answers.push(item));
                }
            }
        ));
        dispatch(commentAction.getCOMMENTs({ idCourse: '', idModule: '', type: 1 }));
        
        dispatch(courseActions.getCourse({ id: hashids.decode(params.idCourse) }));
    }, [params.idExam, params.idExamUser]) // eslint-disable-line react-hooks/exhaustive-deps
    
    // cập nhập đáp án câu hỏi tự luận
    useMemo(() => {
        if (textAnswer !== null && localStorage.getItem('question') !== null) {
            dispatch(answerActions.getAnswersUser({ idDeThi: params.idExamUser, idQuestion: '' }, 
                (res) => {
                    if (res.status === 'success') {
                        // eslint-disable-next-line react-hooks/exhaustive-deps
                        answers = res.data;
                        onChangeAnswerText(textAnswer, JSON.parse(localStorage.getItem('question')))
                    }
                }
            ))
        }
    }, [textAnswer]); // eslint-disable-line react-hooks/exhaustive-deps

    // check full screen
    useEffect(() => {
        const handleFullscreenChange = () => {
            const fullscreenElement = document.fullscreenElement
            setIsFullscreen(!!fullscreenElement)

            if (!fullscreenElement) {
                // Custom action when fullscreen is exited
                clearInterval(timerId?.current); // Dừng đếm thời gian section
                clearInterval(timeCount?.current); // Dừng đếm thời gian làm bài phần cũ
              }
        }
    
        document.addEventListener('fullscreenchange', handleFullscreenChange)
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }, []);

    // event chuyển full screen
    const enterFullscreen = () => {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();

            timerId.current = setInterval(() => {
                setCountSection((preCount) => preCount - 1);
            }, 1000);
            timeCount.current = setInterval(() => {
                setTimeToDo((preValue) => preValue + 1); // Mỗi lần tăng lên 1 phút
            }, 60000)
        }
    }

    // Hàm xử lý đếm ngược thời gian khi click "Phần tiếp theo"
    const countDown = () => {
        let secondsToGo = 30;
    
        const instance = PauseModal.success({
            title: 'Đã hết thời gian cho phần này',
            content: `Phần tiếp theo sẽ bắt đầu ngay sau ${secondsToGo} giây.`,
            okText: 'Làm ngay phần tiếp theo',
            onOk: () => {
                // Bắt đầu làm luôn phần thi mới
                clearTimeout(timeOut); // Huỷ chờ đếm ngược
                clearInterval(timerId?.current); // Dừng đếm thời gian section
                clearInterval(timeCount?.current); // Dừng đếm thời gian làm bài phần cũ

                sessionStorage.setItem('section', state.sectionExam + 1);
                sessionStorage.setItem('timeStartSection', new Date().getTime());
                setCountSection(exam.data[`thoi_gian_phan_${state.sectionExam + 1}`] * 60) // set biến đêm Thời gian = của phần tiếp theo
                setState(prevState => ({
                    ...prevState,
                    sectionExam: prevState.sectionExam + 1
                }));
                timerId.current = setInterval(() => {
                    setCountSection((preCount) => preCount - 1);
                }, 1000);
                setResults([]); 
                window.scrollTo({ top: 0, behavior: "smooth" });
                // thiết lập tiếp bộ đếm thời gian làm bài
                dispatch(examActions.getExamUser({ id: params.idExamUser }, (res) => {
                    if (res.status === 'success') {
                        // 1 phút cập nhật thời gian làm bài 1 lần
                        if (res?.data?.thoi_gian_lam_phan) setTimeToDo(Number(res?.data?.thoi_gian_lam_phan.split(',')[state.sectionExam])); // là số phút
                        timeCount.current = setInterval(() => {
                            setTimeToDo((preValue) => preValue + 1); // Mỗi lần tăng lên 1 phút
                        }, 60000)
                    }
                }));
                instance.destroy();
            }
        });
    
        const timer = setInterval(() => {
            secondsToGo -= 1;
            instance.update({
                content: `Phần tiếp theo sẽ bắt đầu ngay sau ${secondsToGo} giây.`,
            });
        }, 1000);
    
        setTimeout(() => {
            clearInterval(timer);
            instance.destroy();
        }, secondsToGo * 1000);
    };

    // 1 phút cập nhật thời gian làm bài 1 lần
    useEffect(() => {
        if (timeToDo) {
            let temp = timeToDoAllSection; 
            temp[state.sectionExam - 1] = timeToDo; // cập nhật thời gian làm bài của phần tương ứng
            const thoi_gian_lam_bai = temp.reduce((partialSum, a) => Number(partialSum) + Number(a), 0) // tổng thời gian làm bài
            setTimeToDoAllSection(temp);
            let info = {
                thoi_gian_lam_bai: secondsToMinutes(timeToDo === 0 ? 60 : thoi_gian_lam_bai * 60),
                phan_dang_lam: Number(state.sectionExam),
                thoi_gian_lam_phan: timeToDoAllSection.join(','),
            }
            if (course?.data.loai_kct === 0) dispatch(examActions.editExamDGNLUser({ idExam: params.idExamUser, formData: info }))
            else dispatch(examActions.editExamUser({ idExam: params.idExamUser, formData: info }))
        }
    }, [timeToDo]);

    useEffect(() => {
        // Khi hết thời gian mà đang ở phần cuối => nộp bài
        if (countSection <= 0 && state.sectionExam === exam.data.so_phan) {
            setIsDoing(false);
            clearInterval(timerId?.current);
            Modal.warning({
                title: 'Hết giờ làm bài',
                content: 'Bài thi tự động kết thúc khi hết giờ làm bài.',
            });
            onSaveHistory();
        } else if (countSection <= 0 && state.sectionExam < exam.data.so_phan) { // Khi hết thời gian mà đang không phải phần cuối => chuyển sang phần tiếp theo
            countDown();
            clearInterval(timerId?.current); // Dừng đếm thời gian section
            clearInterval(timeCount?.current); // Dừng đếm thời gian làm bài phần cũ

            timeOut = setTimeout(() => { // Chờ 30s 
                sessionStorage.setItem('section', state.sectionExam + 1);
                sessionStorage.setItem('timeStartSection', new Date().getTime());
                setCountSection(exam.data[`thoi_gian_phan_${state.sectionExam + 1}`] * 60) // set biến đêm Thời gian = của phần tiếp theo
                setState(prevState => ({
                    ...prevState,
                    sectionExam: prevState.sectionExam + 1
                }));
                timerId.current = setInterval(() => {
                    setCountSection((preCount) => preCount - 1);
                }, 1000);
                setResults([]); 
                window.scrollTo({ top: 0, behavior: "smooth" });
                // thiết lập tiếp bộ đếm thời gian làm bài
                dispatch(examActions.getExamUser({ id: params.idExamUser }, (res) => {
                    if (res.status === 'success') {
                        // 1 phút cập nhật thời gian làm bài 1 lần
                        if (res?.data?.thoi_gian_lam_phan) setTimeToDo(Number(res?.data?.thoi_gian_lam_phan.split(',')[state.sectionExam])); // là số phút
                        timeCount.current = setInterval(() => {
                            setTimeToDo((preValue) => preValue + 1); // Mỗi lần tăng lên 1 phút
                        }, 60000)
                    }
                }));
            }, 30000);
        }     
    }, [countSection]); // eslint-disable-line react-hooks/exhaustive-deps

    if (exam.status === 'success') {
        breadcrumbs.push({ title: 'Đề thi', link: `#` }, { title: exam.data.ten_de_thi, link: `/luyen-tap/xem/${params.idExam}/${params.idCourse}` });
    }

    // Tải báo cáo
    const downloadReport = async () => {
        try {
            setLoadingExportFile(true);
            const response = await axios({
                url: `${config.API_URL}/evaluate/${params.idExamUser}/export-report`, 
                method: 'GET',
                responseType: 'blob', 
                headers: {
                    Authorization: `Bearer ${userToken}`,
                }
            });

            // Create a URL for the file
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const fileName = `DG_${userInfo.hoc_vien_id}_${userInfo.ho_ten}.pdf`
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName); // Replace with your file name and extension
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            setLoadingExportFile(false);
        } catch (error) {
            console.error('Download error:', error);
            setLoadingExportFile(false);
        }
    }

    // bình luận
    const saveComment = (cau_hoi_id, mo_dun_id, chuyen_de_id) => {
        const callback = (res) => {
            if (res.data.status === 'success' && res.statusText === 'OK') {
                notification.success({
                    message: 'Thành công',
                    description: 'Thêm bình luận thành công',
                });
                setComment('');
                setState({ ...state, idComment: 0, isReplied: false, isEdit: false, idSubcomment: 0, fileImg: '' }); // reset lại khi phản hồi
                
                dispatch(commentAction.getCOMMENTs({ idCourse: '', idModule: '', type: 1 })); 
                renderMoreSubComment(state.idComment);

                /// Tạo thông báo cho nhân viên
                if ((!state.isEdit && state.isReplied) || (!state.isEdit && !state.isReplied) ) { // Chỉ tạo thông báo khi thêm hoặc phản hồi
                    const note = {
                        "loai_thong_bao": !state.isReplied ? 0 : 1,
                        "lien_ket_id": !state.isReplied ? res.data.data.binh_luan_id : res.data.data.binh_luan_phu_id,
                        //// bổ sung link_lien_ket
                        "link_lien_ket": `${chuyen_de_id}/0/${hashids.decode(params.idCourse)}/${hashids.decode(params.idExam)}/${params.idExamUser}/${res.data.data.binh_luan_id}`
                    };
                    dispatch(notificationAction.CreateNOTIFICATION({ formData: note, idModule: mo_dun_id, type: 1, 
                        idThematic: chuyen_de_id, idExam: hashids.decode(params.idExam), index: cau_hoi_id, Teacher: '',
                        idCourse:  hashids.decode(params.idCourse)}));
                }
            } else {
                notification.error({
                    message: 'Thông báo',
                    description: 'Thêm bình luận thất bại',
                })
            }
        };

        // phản hồi
        if (!state.isReplied && !state.isEdit) {
            const formData = new FormData();
            formData.append('noi_dung', comment)
            formData.append('khoa_hoc_id', hashids.decode(params.idCourse));
            formData.append('loai_hoi_dap', 1)
            formData.append('lien_ket_id', `${hashids.decode(params.idExam)}/${cau_hoi_id}/${chuyen_de_id}/${params.idExamUser}/3`);
            if (state.fileImg !== '') {
                formData.append('anh_dinh_kem', state.fileImg[0].originFileObj); // array image
            }
            dispatch(commentAction.CreateCOMMENT(formData, callback));
        } else if (state.isReplied && !state.isEdit) {
            const formData = new FormData();
            formData.append('noi_dung', comment)
            if (state.fileImg !== '') {
                formData.append('anh_dinh_kem', state.fileImg[0].originFileObj); // array image
            }
            formData.append('binh_luan_id', state.idComment);
            dispatch(commentAction.CreateSUBCCOMMENT(formData, callback));
        }
        // sửa bình luận / bình luận phụ
        if (state.isEdit && state.idSubcomment !== 0 && !state.isReplied) { // sửa
            const formData = new FormData();
            formData.append('noi_dung', comment)
            if (state.fileImg !== '') {
                formData.append('anh_dinh_kem', state.fileImg[0].originFileObj); // array image
            }
            dispatch(commentAction.EditSUBCCOMMENT({ formData: formData, idSubComment: state.idSubcomment }, callback));
        } else if (state.isEdit && state.idComment !== 0 && !state.isReplied) {
            const formData = new FormData();
            formData.append('noi_dung', comment)
            if (state.fileImg !== '') {
                formData.append('anh_dinh_kem', state.fileImg[0].originFileObj); // array image
            }
            dispatch(commentAction.EditCOMMENT({ formData: formData, idComment: state.idComment }, callback));
        }
    };

    // xóa bình luận
    const deleteComment = (binh_luan_id, binh_luan_phu_id, bool) => {
        // bool: true => xóa bình luận phụ
        // bool: false => xóa bình luận chính
        const callback = (res) => {
            if (res.statusText === 'OK' && res.status === 200) {
                if (bool) renderMoreSubComment(binh_luan_id);
                else dispatch(commentAction.getCOMMENTs({ idCourse: '', idModule: '', type: 1 })); 

                notification.success({
                    message: 'Thành công',
                    description: 'Xóa bình luận thành công',
                })
            } else {
                notification.error({
                    message: 'Thông báo',
                    description: 'Xóa bình luận mới thất bại',
                })
            };
        }

        const result = window.confirm('Bạn có chắc chắn muốn xóa bình luận này?');
        if (bool && result) {
            dispatch(commentAction.DeleteSUBCCOMMENT({ idComment: binh_luan_phu_id }, callback));
        } else if (bool === false && result) {
            dispatch(commentAction.DeleteCOMMENT({ idComment: binh_luan_id }, callback));
        }
    };

    // Phản hồi bình luận
    const replyComment = (binh_luan_id) => {
        setState({ ...state, idComment: binh_luan_id, isReplied: true, isEdit: false });
    };

    const cancelReplyOrEdit = () => {
        setState({ ...state, idComment: 0, idSubcomment: 0, isReplied: false, isEdit: false });
    }; 

    // Sửa bình luận
    const EditComment = (binh_luan_id, binh_luan_phu_id, bool) => {
        // false: Sửa bình luận 
        // true: sửa bình luận phụ
        if (bool) {
            dispatch(commentAction.getSUBCOMMENT({ id: binh_luan_phu_id }, (res) => {
                if (res.status === 'success') {
                    if (res.data) {
                        setComment(res.data.noi_dung);
                        setState({ ...state, idSubcomment: binh_luan_phu_id, idComment: binh_luan_id, isReplied: false, isEdit: true, showSubcomment: true });
                    }
                }
            }))
        } 
        else {
            dispatch(commentAction.getCOMMENT({ id: binh_luan_id }, (res) => {
                if (res.status === 'success') {
                    if (res.data) {
                        setComment(res.data.noi_dung);
                        setState({ ...state, idComment: binh_luan_id, idSubcomment: 0, isReplied: false, isEdit: true });
                    }
                }
            }))
        }
    };

    const getAnswerCols = (type) => {
        if (type === 1) return 24;
        else if (type === 2) return 12;
        else if (type === 3) return 8;
        else if (type === 4) return 6;
        else return 24;
    };

    const renderAnswerKey = (index) => {
        if (index === 3) return 'D';
        else if (index === 2) return 'C';
        else if (index === 1) return 'B';
        else if (index === 0) return 'A'
    };

    const renderAnswer = (question, answer, index) => {
        // Render lựa chọn (A, B, C, D)
        // Khi nộp bài => Check lựa chọn đã nộp là đúng hay sai;
        // - Đáp án đúng của câu hỏi => màu xanh
        // - Lựa chọn đúng với đáp án => màu xanh
        // - Lựa chọn sai với đáp án => màu đỏ
        let regex = /\\begin{center}\\includegraphics\[scale = 0\.5\]{(.*?)}\\end{center}/;
        let isWrong = false;
        let currentSubmitAnswer = results.find((item) => item.cau_hoi_id === question.cau_hoi_id);
        if (currentSubmitAnswer?.gia_tri_dap_an && question?.dap_an_dungs) {
            if (convertAnswer(currentSubmitAnswer?.gia_tri_dap_an)[index] !== convertAnswer(question?.dap_an_dungs)[index]) {
                isWrong = true;  
            }
        }
        return (
            <div className={`answer ${!isDoing && (isWrong && !answer.dap_an_dung) ? 'incorrect' : ''} ${!isDoing && answer.dap_an_dung ? 'correct' : ''}`}>
                <span className="answer-label">{renderAnswerKey(index)}</span>
                <div className="answer-content">             
                    <MathJax.Provider>
                        {answer.noi_dung_dap_an.split('\n').map((item, index_cauhoi) => {
                            return (
                                <div className="help-answer-content" key={index_cauhoi}> 
                                {
                                    (item.indexOf('includegraphics') !== -1 && item?.match(regex) !== null) ? (
                                        <Image src={config.API_URL + `/${item.match(regex)[1]}`} alt={`img_cauhoi_${index_cauhoi}`}></Image>
                                    ) : (
                                        item.split('$').map((item2, index2) => {
                                            return (item.indexOf('$' + item2 + '$') !== -1 && (item2.includes('{') || item2.includes('\\')) && (!item2.includes('\\underline') && !item2.includes('\\bold') && !item2.includes('\\italic'))) ? (
                                                <MathJax.Node key={index2} formula={item2} />
                                            ) : (
                                                <span style={{fontFamily: 'MJXc-TeX-main-R, MJXc-TeX-main-Rw'}}  dangerouslySetInnerHTML={{ __html: item2 }}></span>
                                            )
                                        })
                                    )
                                }
                                </div>
                            )}
                        )}
                    </MathJax.Provider>
                </div>
            </div>
        );
    };

    const renderAnswerKeyV2 = (dap_an) => {
        const answerKey = ['A', 'B', 'C', 'D'];
        let answerLetters = [];
        let answerIndices = [];

        for (let i = 0; i < dap_an.length; i++) {
            if (dap_an[i] === '1') {
                answerLetters.push(answerKey[i]);
                answerIndices.push(i);
            }
        }
        // Output: [['A', 'B'], [0, 1]]
        return [answerLetters, answerIndices];
    };

    const renderAnswerResult = (question) => {
        let regex = /\\begin{center}\\includegraphics\[scale = 0\.5\]{(.*?)}\\end{center}/;

        if (!isDoing && exam.status === 'success') {
            return (
                <p className="result-exam-item">
                    {(question.cau_hoi.loai_cau_hoi === 1 || question.cau_hoi.loai_cau_hoi === 2) ?
                        <span className="right-answer">Đáp án đúng {question?.cau_hoi?.dap_an_dungs?.map((item) => renderAnswerKey(item)).join(', ')}</span>
                        : <span className="right-answer">Đáp án đúng: 
                            <MathJax.Provider>
                                {question.cau_hoi.dap_ans[0].noi_dung_dap_an.split('\n').map((item, index_cauhoi) => {
                                    return (
                                        <div key={index_cauhoi}> 
                                        {
                                            (item.indexOf('includegraphics') !== -1 && item?.match(regex) !== null) ? (
                                                <Image src={config.API_URL + `/${item.match(regex)[1]}`} alt={`img_cauhoi_${index_cauhoi}`}></Image>
                                            ) : (
                                                item.split('$').map((item2, index2) => {
                                                    return (item.indexOf('$' + item2 + '$') !== -1 && (item2.includes('{') || item2.includes('\\')) && (!item2.includes('\\underline') && !item2.includes('\\bold') && !item2.includes('\\italic'))) ? (
                                                        <MathJax.Node key={index2} formula={item2} />
                                                    ) : (
                                                        <span dangerouslySetInnerHTML={{ __html: item2 }}></span>
                                                    )
                                                })
                                            )
                                        }
                                        </div>
                                    )}
                                )}
                            </MathJax.Provider>
                        </span>
                    }
                </p>
            );
        }
    };

    // Hàm xử lý chuyển đổi từ response BE: đáp án đã chọn -> A/B/C/D hiển thị lên giao diện
    const convertAnswerKey = (question) => {
        let key = '';
        if (!isDoing && examUser.status === 'success') {
            if (examUser.data.dap_an_da_chons) {
                let currentSubmitAnswer = examUser.data.dap_an_da_chons.find((item) => (item.cau_hoi_id === question.cau_hoi_id && item.ket_qua_chon !== '0000'));
                if (question.dap_an_dungs && currentSubmitAnswer !== undefined) {
                    if (question.loai_cau_hoi === 1 || question.loai_cau_hoi === 2) { // Câu trắc nghiệm
                        let ket_qua_arr = [];
                        Array.from(currentSubmitAnswer.ket_qua_chon).forEach((ket_qua, index) => {
                            if (index === 0 && ket_qua === '1') ket_qua_arr.push('A');
                            else if (index === 1 && ket_qua === '1') ket_qua_arr.push('B');
                            else if (index === 2 && ket_qua === '1') ket_qua_arr.push('C');
                            else if (index === 3 && ket_qua === '1') ket_qua_arr.push('D');
                            return null;
                        });
                        key = ket_qua_arr.join(', ');
                    } else if (question.loai_cau_hoi === 0) { // Câu tự luận
                        key = currentSubmitAnswer.noi_dung_tra_loi;
                    }
                } else {
                    key = ' - ';
                }
            } 
        }
        return key;
    }

    const renderMoreSubComment = (binh_luan_id) => {
        const callback = (res) => {
            if (res.status === 'success') {
                setState({ ...state, showSubcomment: true });
                const element = res.data.map((item, index) => 
                    (
                        <Comment author={<p style={{fontWeight: 'bold'}}>{item.ho_ten}</p>} 
                            avatar={item.anh_dai_dien !== null ? config.API_URL + item.anh_dai_dien : defaultImage} 
                            content={<div><div dangerouslySetInnerHTML={{ __html: item.noi_dung }}></div>{item.anh_dinh_kem !== null && <Image src={config.API_URL + item.anh_dinh_kem} alt="ảnh bình luận"/>}</div>} 
                            datetime={diff(item.ngay_tao)} 
                            actions={[
                                <Space>
                                    {(item.nguoi_tra_loi_id === JSON.parse(localStorage.getItem('userInfo')).hoc_vien_id && item.loai_quyen === 0) &&
                                    <>
                                        <Button type='link' onClick={() => EditComment(item.binh_luan_id, item.binh_luan_phu_id, true)}>Sửa</Button>
                                        <Button type='link' onClick={() => deleteComment(item.binh_luan_id, item.binh_luan_phu_id, true)}>Xóa</Button>
                                    </>
                                    }
                                    </Space>
                            ]}
                        />
                    )
                )
                createRoot(document.getElementById(binh_luan_id)).render(element)
            }
        };
        if (binh_luan_id !== 0)
            dispatch(commentAction.getSUBCCOMMENTs({ idComment: binh_luan_id }, callback));
    };

    // Xử lý khi chuyển phần thi
    const handleNextSectionExam = () => {
        // Tính bằng giây 
        // if (countSection > (1/3) * exam.data[`thoi_gian_phan_${state.sectionExam}`] * 60) {
        //     notification.warning({
        //         message: 'Thông báo',
        //         description: 'Chỉ có thể chuyển qua phần tiếp theo khi còn 1/3 thời gian phần thi', 
        //     });
        //     return;
        // }

        const timeLeftInMinutes = Math.floor(countSection / 60);
        const timeLeftInSeconds = Math.floor(countSection - timeLeftInMinutes * 60);
        const questionRemain = exam.data[`so_cau_hoi_phan_${state.sectionExam}`] - results.length;

        Modal.confirm({
            title: 'CHÚC MỪNG BẠN ĐÃ HOÀN THÀNH PHẦN THI',
            maskStyle: { background: 'rgba(0, 0, 0, 0.8)' },
            wrapClassName: 'cra-confirm-modal-container',
            content: (
                <div className="cra-confirm-body">
                    {questionRemain > 0 && (
                        <div> Bạn còn <span style={{fontWeight: 700}}>{questionRemain} câu chưa trả lời</span>.</div>
                    )}
                    {questionRemain === 0 && (
                        <div><span style={{fontWeight: 700}}>Bạn đã hoàn thiện {exam.data[`so_cau_hoi_phan_${state.sectionExam}`]} câu hỏi.</span></div>
                    )}
                    <div>
                        Thời gian còn <span style={{fontWeight: 700}}>({timeLeftInMinutes} phút {timeLeftInSeconds} giây)</span>.
                    </div>
                    
                    <div>Đề thi phần tiếp theo sẽ hiện thị sau 30 giây. Bạn hãy sẵn có thể để vào làm bài</div>
                    {localStorage.getItem('mon_thi')?.split(',').includes('9') &&
                        <div style={{width: '100%', textAlign: 'center'}}>
                            <Button type="primary" danger style={{borderRadius: 8}}>
                                <a href={alat} target='_blank' rel='noopener noreferrer'>ALAT Địa lý Việt Nam</a>
                            </Button>
                        </div>
                    }
                    <div style={{color: 'red', fontWeight: 700}}>
                        Lưu ý: Bài làm phần này sẽ tự động nộp và bạn không thể sửa được nữa
                    </div>
                </div>
            ),
            okText: 'Phần tiếp theo',
            cancelText: 'Làm bài tiếp',
            onOk: () => {
                if (state.sectionExam === exam.data.so_phan) return;
                else {
                    countDown();
                    clearInterval(timerId?.current); // Dừng đếm thời gian section
                    clearInterval(timeCount?.current); // Dừng đếm thời gian làm bài

                    // sau 30s chờ => sẽ thực hiện hàm bên trong
                    timeOut = setTimeout(() => { 
                        sessionStorage.setItem('section', state.sectionExam + 1);
                        sessionStorage.setItem('timeStartSection', new Date().getTime());
                        setCountSection(exam.data[`thoi_gian_phan_${state.sectionExam + 1}`] * 60) // set biến đêm Thời gian = của phần tiếp theo
                        setState(prevState => ({
                            ...prevState,
                            sectionExam: prevState.sectionExam + 1
                        }));
                        timerId.current = setInterval(() => {
                            setCountSection((preCount) => preCount - 1);
                        }, 1000);
                        setResults([]); 
                        window.scrollTo({ top: 0, behavior: "smooth" });
                        // thiết lập tiếp bộ đếm thời gian làm bài
                        dispatch(examActions.getExamUser({ id: params.idExamUser }, (res) => {
                            if (res.status === 'success') {
                                // 1 phút cập nhật thời gian làm bài 1 lần
                                if (res?.data?.thoi_gian_lam_phan) setTimeToDo(Number(res?.data?.thoi_gian_lam_phan.split(',')[state.sectionExam])); // là số phút
                                timeCount.current = setInterval(() => {
                                    setTimeToDo((preValue) => preValue + 1); // Mỗi lần tăng lên 1 phút
                                }, 60000)
                            }
                        }));
                    }, 30000);
                }
            },
        });
        
    }

    const handlePrevSectionExam = () => {
        if (state.sectionExam <= 1) return;
        else {
            setState(prevState => ({
                ...prevState,
                sectionExam: prevState.sectionExam - 1
            }));
        }
    }

    const convertAnswer = (dap_an_dungs) => {
        let A = '0';
        let B = '0'
        let C = '0'
        let D = '0'
        dap_an_dungs.map((answer, index) => {
            if (answer === 0) A = '1';
            else if (answer === 1) B = '1';
            else if (answer === 2) C = '1';
            else if (answer === 3) D = '1';
            return null;
        })
        return A + B + C + D;
    };

    const isCorrectAnswer = (question) => {
        let isRight = '';
        if (!isDoing && examUser.status === 'success') {
            if (examUser.data.dap_an_da_chons) {
                let currentSubmitAnswer = examUser.data.dap_an_da_chons.find((item) => (item.cau_hoi_id === question.cau_hoi_id && item.ket_qua_chon !== '0000'));
                if (question.dap_an_dungs && currentSubmitAnswer !== undefined) {
                    if (question.loai_cau_hoi === 1 || question.loai_cau_hoi === 2) { // Câu trắc nghiệm
                        let answerRight = convertAnswer(question.dap_an_dungs);
                        if (currentSubmitAnswer && answerRight === currentSubmitAnswer.ket_qua_chon) {
                            isRight = 'right-answer';
                        } else if (currentSubmitAnswer && answerRight !== currentSubmitAnswer.ket_qua_chon) {
                            isRight = 'wrong-answer';
                        }
                    } else if (question.loai_cau_hoi === 0) { // Câu tự luận
                        if (currentSubmitAnswer && question.dap_ans[0].noi_dung_dap_an
                            .replaceAll('<b>', '')
                            .replaceAll('</b>', '')
                            .replaceAll('<em>', '')
                            .replaceAll('</em>', '')
                            .replaceAll('<u>', '')
                            .replaceAll('</u>', '')
                            .trim()
                            .toLowerCase() === (currentSubmitAnswer.noi_dung_tra_loi).toLowerCase()) 
                        {
                            isRight = 'right-answer';
                        } else if (currentSubmitAnswer && question.dap_ans[0].noi_dung_dap_an
                            .replaceAll('<b>', '')
                            .replaceAll('</b>', '')
                            .replaceAll('<em>', '')
                            .replaceAll('</em>', '')
                            .replaceAll('<u>', '')
                            .replaceAll('</u>', '')
                            .trim()
                            .toLowerCase() !== (currentSubmitAnswer.noi_dung_tra_loi).toLowerCase()) 
                        {
                            isRight = 'wrong-answer';
                        }
                    }
                }
            }
        }
        return isRight;
    };

    const isCorrectQuestionDungSai = (question, index, boolCheck) => {
        // return true / false
        // boolCheck: true => Lựa chọn option đúng
        // boolCheck: false => Lựa chọn option sai

        let currentSubmitAnswer = results.find((item) => item.cau_hoi_id === question.cau_hoi_id);
        if (currentSubmitAnswer?.gia_tri_dap_an && question?.dap_an_dungs) {
            if (boolCheck) {
                if (convertAnswer(question?.dap_an_dungs)[index] === '1') return true;
                if (!currentSubmitAnswer?.gia_tri_dap_an?.includes(index)) return null;
                return false;
            } else {
                if (document.getElementById(`button-Right-${index}`)?.classList.contains('correct') && currentSubmitAnswer?.gia_tri_dap_an?.includes(index)) return null;
                return convertAnswer(question?.dap_an_dungs)[index] === '0';
            }
        }
    }

    // hàm xử lý chọn đáp án
    const onChooseAnswer = (question, answerKey, index, answered) => {
        if (isDoing) { // Nếu đang làm bài
            let isAnswered = answered.find((item) => item.cau_hoi_id === question.cau_hoi_id);
            if (isAnswered) { // Nếu đã trả lời
                // Cập nhật lại đáp án đã chọn
                const choosed = results.find((it) => it.cau_hoi_id === question.cau_hoi_id)?.dap_an.includes(renderAnswerKey(index));
                if (question.cau_hoi.loai_cau_hoi === 1) {
                    isAnswered.ket_qua_chon = '0000';
                }
                isAnswered.ket_qua_chon = isAnswered.ket_qua_chon.substring(0, index) + (choosed ? '0' : '1') + isAnswered.ket_qua_chon.substring(index + 1); // Thay 1 vào vị trí index của ket_qua

                let newAnsers2;
                if (renderAnswerKeyV2(isAnswered.ket_qua_chon)[0].length === 0 && question.cau_hoi.loai_cau_hoi === 1) {
                    // Xóa phần tử có id tương ứng trong results
                    newAnsers2 = results.filter(item => item.cau_hoi_id !== question.cau_hoi_id);
                } else {
                    const dap_an_ton_tai = results.find((item) => item.cau_hoi_id === question.cau_hoi_id)
                    newAnsers2 = dap_an_ton_tai ? results.map((item) => 
                        (
                            item.cau_hoi_id === question.cau_hoi_id ? { ...item, 
                            dap_an: renderAnswerKeyV2(isAnswered.ket_qua_chon)[0], 
                            gia_tri_dap_an: renderAnswerKeyV2(isAnswered.ket_qua_chon)[1], 
                            loai_dap_an: true,
                            ket_qua_chon: isAnswered.ket_qua_chon } : item
                        )
                    )
                    : [
                        ...results, {
                            cau_hoi_id: question.cau_hoi.cau_hoi_id,
                            dap_an: renderAnswerKeyV2(isAnswered.ket_qua_chon)[0], 
                            gia_tri_dap_an: renderAnswerKeyV2(isAnswered.ket_qua_chon)[1], 
                            loai_dap_an: true,
                            ket_qua_chon: isAnswered.ket_qua_chon
                        }
                    ]
                }
                setResults(newAnsers2);
                
                const submit = {
                    "ket_qua_chon": isAnswered.ket_qua_chon,
                    "noi_dung_tra_loi": "",
                    "dthv_id": params.idExamUser,
                    "cau_hoi_id": question.cau_hoi_id
                }
                dispatch(answerActions.editAnswerUser({ id: isAnswered.dadc_id, formData: submit }, (res) => {
                    if (res.status === 200 && res.statusText === 'OK') setPause(false);
                }));
            } else {
                let ket_qua = '0000';
                ket_qua = ket_qua.substring(0, index) + '1' + ket_qua.substring(index + 1); // Thay 1 vào vị trí index của ket_qua
                setResults([...results, { cau_hoi_id: question.cau_hoi_id, dap_an: [answerKey], gia_tri_dap_an: [index], loai_dap_an: true, ket_qua_chon: ket_qua }]);
                
                let trac_nghiem_submit = [];
                trac_nghiem_submit.push({
                    "ket_qua":ket_qua,
                    "cau_hoi_id": question.cau_hoi_id
                });

                const submit = {
                    "ket_qua_chons":trac_nghiem_submit,
                    "noi_dung_tra_lois": '',
                    "dthv_id": params.idExamUser
                }
                dispatch(answerActions.createAnswerUser(submit, (res) => {
                    if (res.status === 200 && res.statusText === 'OK') setPause(false);
                }));
            }
        }
    };

    const onSaveHistory = () => {
        const callbackSub = (res) => {
            if (res.status === 200 && res.statusText === 'OK') {
                setIsDoing(false); 
                notification.success({
                    message: 'Thành công',
                    description: 'Nộp bài thành công', 
                });
                clearInterval(timerId?.current);
                sessionStorage.removeItem('section');
                sessionStorage.removeItem('timeStartSection');
                setStartTime(0);
                dispatch(answerActions.getAnswersUser({ idDeThi: params.idExamUser, idQuestion: '' }, 
                    (res) => {
                        if (res.status === 'success') {
                            if (res.data.length > 0) {
                                let temp = [];
                                res.data.map(item => {
                                    if ((item.ket_qua_chon !== null) && (item.ket_qua_chon !== '')) {// Câu trắc nghiệm
                                        temp.push({ cau_hoi_id: item.cau_hoi_id, dap_an: renderAnswerKeyV2(item.ket_qua_chon)[0], 
                                            loai_dap_an: true, gia_tri_dap_an: renderAnswerKeyV2(item.ket_qua_chon)[1] });
                                    }
                                    else {// câu tự luận
                                        temp.push({ cau_hoi_id: item.cau_hoi_id, noi_dung: item.noi_dung_tra_loi, 
                                            loai_dap_an: false, gia_tri_dap_an: item.noi_dung_tra_loi });
                                    }
                                    return null;
                                })
                                setResults([...temp]);
                            };
                            res.data.map(item => answers.push(item));
                        }
                    }
                ));
                
            } else {
                clearInterval(timerId?.current);
                setStartTime(0);
            };
            dispatch(examActions.getExamUser({ id: params.idExamUser }, (response) => {
                if (response.status === 'success') {
                    const points = Array.from({ length: exam.data.so_phan }).map((_, index) => {
                        const startIndex = index === 0 ? 0 : Array.from({ length: index }).reduce((sum, _, i) => sum + exam.data[`so_cau_hoi_phan_${i + 1}`], 0);
                        const endIndex = startIndex + exam.data[`so_cau_hoi_phan_${index + 1}`];
                        const partQuestions = exam.data.cau_hoi_de_this.slice(startIndex, endIndex);
                        const number = partQuestions.map((question, index) => {
                            let number = 0;
                            if (response.data.dap_an_da_chons) {
                                let currentSubmitAnswer = response.data.dap_an_da_chons.find((item) => item.cau_hoi_id === question.cau_hoi.cau_hoi_id);
                                if (question.cau_hoi.dap_an_dungs && currentSubmitAnswer !== undefined) {
                                    if (question.cau_hoi.loai_cau_hoi === 1 || question.cau_hoi.loai_cau_hoi === 2) { // Câu trắc nghiệm
                                        let answerRight = convertAnswer(question.cau_hoi.dap_an_dungs);
                                        if (currentSubmitAnswer && answerRight === currentSubmitAnswer.ket_qua_chon) {
                                            number = number + 1;
                                        } 
                                    } else if (question.cau_hoi.loai_cau_hoi === 0) { // Câu tự luận
                                        if (currentSubmitAnswer && question.cau_hoi.dap_ans[0].noi_dung_dap_an
                                            .replaceAll('<b>', '')
                                            .replaceAll('</b>', '')
                                            .replaceAll('<em>', '')
                                            .replaceAll('</em>', '')
                                            .replaceAll('<u>', '')
                                            .replaceAll('</u>', '')
                                            .trim()
                                            .toLowerCase() === (currentSubmitAnswer.noi_dung_tra_loi).toLowerCase()) 
                                        {
                                            number = number + 1;
                                        } 
                                    }
                                }
                            }
                            return number;
                        })
                        return number.reduce((partialSum, a) => partialSum + a, 0)
                    })
                    const info = {
                        "diem_cac_phan": points.join(',')
                    }
                    if (course?.data.loai_kct === 0) {
                        dispatch(examActions.editExamDGNLUser({ idExam: params.idExamUser, formData: info }, (a) => {
                            if (a.status === 200 && a.statusText === 'OK') {
                                window.location.reload();
                            }
                        }))
                    } else {
                        dispatch(examActions.editExamUser({ idExam: params.idExamUser, formData: info }, (a) => {
                            if (a.status === 200 && a.statusText === 'OK') {
                                window.location.reload();
                            }
                        }))
                    }
                }
            }))
        };

        const thoi_gian_lam_bai = timeToDoAllSection.reduce((partialSum, a) => Number(partialSum) + Number(a), 0) // tổng thời gian làm bài

        const info = {
            "thoi_gian_lam_bai": secondsToMinutes(timeToDo === 0 ? 60 : thoi_gian_lam_bai * 60),
            "thoi_diem_ket_thuc": moment().toISOString()
        }
        if (course?.data.loai_kct === 0) dispatch(examActions.editExamDGNLUser({ idExam: params.idExamUser, formData: info }, callbackSub))
        else dispatch(examActions.editExamUser({ idExam: params.idExamUser, formData: info }, callbackSub))
    };

    const onChangeAnswerText = (value, question) => {
        if (isDoing && localStorage.getItem('question') !== null) {
            const isAswered = answers.find((item) => item.cau_hoi_id === question.cau_hoi_id);
            if (isAswered) {
                // Biến này để lưu vào state results
                const newAnsers2 = results.map((item) => (item.cau_hoi_id === question.cau_hoi_id ? { ...item, noi_dung: value, gia_tri_dap_an: value, loai_dap_an: false, ket_qua_chon: value } : item));
                setResults(newAnsers2);

                const submit = {
                    "ket_qua_chon": "",
                    "noi_dung_tra_loi": value?.trim().toLowerCase(),
                    "dthv_id": params.idExamUser,
                    "cau_hoi_id": question.cau_hoi_id
                }
                dispatch(answerActions.editAnswerUser({ id: isAswered.dadc_id, formData: submit }));
            } else {
                setResults([...results, { cau_hoi_id: question.cau_hoi_id, noi_dung: value, gia_tri_dap_an: value, loai_dap_an: false }]);
                
                const tu_luan = [{
                    "noi_dung": value?.trim().toLowerCase(),
                    "cau_hoi_id": question.cau_hoi_id
                }]
                const submit = {
                    "ket_qua_chons": [],
                    "noi_dung_tra_lois": tu_luan,
                    "dthv_id": params.idExamUser
                }
                dispatch(answerActions.createAnswerUser(submit));
            }
        }
    };

    const submit = () => {
        // Tính bằng giây 
        // if (countSection > (1/3) * exam.data[`thoi_gian_phan_${state.sectionExam}`] * 60) {
        //     notification.warning({
        //         message: 'Thông báo',
        //         description: 'Chỉ có thể nộp bài khi còn 1/3 thời gian phần thi', 
        //     });
        //     return;
        // }

        const timeLeftInMinutes = Math.floor(countSection / 60);
        const timeLeftInSeconds = Math.floor(countSection - timeLeftInMinutes * 60);
        const questionRemain = exam.data[`so_cau_hoi_phan_${state.sectionExam}`] - results.length;

        Modal.confirm({
            title: 'Xác nhận nộp bài',
            maskStyle: { background: 'rgba(0, 0, 0, 0.8)' },
            wrapClassName: 'cra-confirm-modal-container',
            content: (
                <div className="cra-confirm-body">
                    {questionRemain > 0 && (
                        <div>
                        Bạn còn <b>{questionRemain} câu chưa trả lời</b>.
                        </div>
                    )}
                    {questionRemain === 0 && (
                        <div>
                        <b>Bạn đã hoàn thiện {exam.data[`so_cau_hoi_phan_${state.sectionExam}`]} câu hỏi.</b>
                        </div>
                    )}

                    <div>
                        Thời gian còn
                        <b>
                        ({timeLeftInMinutes} phút {timeLeftInSeconds} giây)
                        </b>
                        .
                    </div>
                    <div>Bạn đồng ý nộp bài?</div>
                </div>
            ),
            okText: 'Nộp bài',
            cancelText: 'Làm bài tiếp',
            onOk: () => onSaveHistory(),
        });
    };

    const renderHistoryExamSidebar = () => {
        return (
            <Col span={3}>
                {examUser.status === 'success' &&
                    <div className="exam-right-content" style={{ position: 'sticky', top: '100px' }}>
                        <div className="exam-right-info">
                            <p className="mg-0 color-blue text-center title-list-q">
                                <b style={{fontSize: 18}}>Câu hỏi</b>
                            </p>
                            <ul>
                                {exam.status === 'success' && exam.data.cau_hoi_de_this.map((question, index) => {
                                    return (
                                        <li key={index + 1} className={"normal " + isCorrectAnswer(question.cau_hoi)}>
                                            <a href={`#${index}`}>{index + 1}</a> . <span>{convertAnswerKey(question.cau_hoi)}</span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                }
            </Col>
        );
    };

    const renderHistoryExamSidebarOld = () => {
        return (
            <Col span={6}>
                {examUser.status === 'success' &&

                    <div className="exam-right-content" style={{ position: 'sticky', top: '0px' }}>
                        <div className="topbar-exam">
                            <p className="mg-0">
                            <b style={{fontSize: 18}}>Số câu đã làm</b>
                            <span className="white-spread-under"></span>
                                <b style={{ color: '#fff', fontSize: 24 }}>
                                <span style={{ color: '#373636' }}>{results.length} / {exam.data.cau_hoi_de_this.length}</span>
                                </b>
                            </p>
                        </div>
                        <div className="result-question body-result-right">
                            <p className="sum-result">
                                <span className="aw_correct"></span>
                                {`Đúng: `}
                                <b>{examUser.data.so_cau_tra_loi_dung !== null ? examUser.data.so_cau_tra_loi_dung : '0'}</b>
                                <span className="aw_not_correct"></span>
                                {`Sai: `}
                                <b>{examUser.data.so_cau_tra_loi_dung !== null ? results.length - examUser.data.so_cau_tra_loi_dung : '0' }</b>
                                <span></span>
                                {`Chưa chọn: `}
                                <b>{exam.data.cau_hoi_de_this.length - results.length}</b>
                            </p>
                        </div>
                        <div className="exam-right-info">
                            <p className="mg-0 color-blue text-center title-list-q">
                                <b style={{fontSize: 18}}>Câu hỏi</b>
                            </p>
                            <ul style={{ display: 'block' }}>
                                {exam.status === 'success' && exam.data.cau_hoi_de_this.map((question, index) => {
                                    return (
                                        <li key={index + 1} className={isCorrectAnswer(question.cau_hoi)}>
                                            {/* <a href={`#${index + 1}`}>{index + 1}</a> */}
                                            <button className='a-tag' style={{borderRadius: 8}}
                                                onClick={() => {
                                                    const element = document?.getElementById(index + 1);
                                                    const offset = 120; // height of your fixed header
                                                    const y = element.getBoundingClientRect().top + window.pageYOffset - offset;

                                                    window.scrollTo({ top: y, behavior: "smooth" });
                                                }}
                                            >
                                                {index + 1}
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                }
            </Col>
        );
    };

    const getCurrentDate = () => {
        const date = new Date();
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = date.getFullYear();
    
        return `${day}-${month}-${year}`;
    };

    // tải nhận xét cho phần thi ĐGNL
    const exportEvaluationDGNL = async () => {
        try {
            setLoadingExportFile(true);
            const response = await axios({
                url: `${config.API_URL}/evaluate-dgnl/${params.idExamUser}/export-report`, 
                method: 'GET',
                responseType: 'blob', 
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('userToken')}`,
                }
            });

            // Create a URL for the file
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const fileName = `DG_${userInfo.hoc_vien_id}_${userInfo.ho_ten}.pdf`
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName); // Replace with your file name and extension
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            setLoadingExportFile(false);
        } catch (error) {
            console.error('Download error:', error);
            setLoadingExportFile(false);
        }
    };

    const renderExam = () => {
        if (!userToken) return <NoRecord subTitle="Bạn cần đăng nhập để làm bài thi." status="403" />;
        if (error) return <NoRecord subTitle="Không tìm thấy đề thi." />;

        return (
            <Spin spinning={loadingExportFile}>  
                <div className='section-question'>
                    <Row>
                        <Col span={3} style={{display: course?.data.loai_kct !== 0 ? 'none' : 'block'}}>
                            <img src={require('assets/img/logo/logo-vnu.png').default} width={82}  style={{marginLeft: 12}} alt="logo-vnu"/>
                            <img src={require('assets/img/logo/Logo-DGNT.png').default} width={82}  style={{marginLeft: 12}} alt="logo-DGNT"/>
                        </Col>
                        <Col span={course?.data.loai_kct !== 0 ? 24 : 21}>
                            <Row justify={'space-between'} style={{marginBottom: 12}}>
                                <Col style={{fontSize: 24, color: 'rgb(255, 48, 7)'}}>{getCurrentDate()}</Col>
                                {course?.data.loai_kct !== 0 ? 
                                    <Col style={{display: isDoing ? 'flex' : 'none', padding: 4, background: '#1890ff', fontSize: 16, borderRadius: 4}}>
                                        {`PHẦN ${state.sectionExam}`}
                                    </Col>
                                : 
                                    <Col style={{display: isDoing ? 'flex' : 'none', padding: 4, background: '#1890ff', fontSize: 16, borderRadius: 4}}>
                                        {(isDoing && state.sectionExam === 1) ? 
                                        'PHẦN 1: TƯ DUY ĐỊNH LƯỢNG' : (isDoing && state.sectionExam === 2) ? 
                                        'PHẦN 2: TƯ DUY ĐỊNH TÍNH' : (isDoing && state.sectionExam === 3) && 
                                        `PHẦN 3: ${localStorage.getItem('mon_thi')?.split(',').length === 1 ? 'NGOẠI NGỮ' : 'KHOA HỌC'}`}
                                    </Col>
                                }
                                <Col><span style={{ fontSize: 24, color: 'rgb(255, 48, 7)' }}>{secondsToMinutes(countSection)}</span></Col>
                            </Row>
                            <Row className='list-questions' justify={'center'}>
                                {isDoing && Array.from({ length: exam.data.so_phan }).map((_, index) => {
                                    if (index + 1 === state.sectionExam) {
                                        const startIndex = index === 0 ? 0 : Array.from({ length: index }).reduce((sum, _, i) => sum + exam.data[`so_cau_hoi_phan_${i + 1}`], 0);
                                        const endIndex = startIndex + exam.data[`so_cau_hoi_phan_${state.sectionExam}`];
                                        const partQuestions = exam.data.cau_hoi_de_this.slice(startIndex, endIndex);
                                        return (
                                            <>
                                                {partQuestions.map((question, index) => {
                                                    const isAnswered = results.find((it) => it.cau_hoi_id === question.cau_hoi_id);
                                                    if (!isAnswered || (isAnswered && !isAnswered.loai_dap_an && isAnswered.noi_dung === '')) {
                                                        return (
                                                            <div key={index + 1} className={`item`}>
                                                                {/* <a href={`#${index + 1}`}>{index + 1}</a> */}
                                                                <button
                                                                    onClick={() => {
                                                                        const element = document?.getElementById(index + 1);
                                                                        const offset = 120; // height of your fixed header
                                                                        const y = element.getBoundingClientRect().top + window.pageYOffset - offset;

                                                                        window.scrollTo({ top: y, behavior: "smooth" });
                                                                    }}
                                                                >
                                                                    {index + 1}
                                                                </button>
                                                            </div>
                                                        );
                                                    }
                                                    return null;
                                                })}
                                            </>
                                        )
                                    } else return null;
                                })}
                            </Row>
                        </Col>
                    </Row>
                </div>
                <Row className="question-content" gutter={[16]} style={{margin: '0 68px'}}>
                    <Col span={course?.data.loai_kct !== 0 ? 18 : 21}>
                        {(!isDoing && examUser.status === 'success') &&(
                            <div className="history-header">
                                <div className="summury-result">
                                    <div className="head-result">
                                        <p className="size-18 color-blue">
                                            <b>
                                            Chúc mừng bạn đã hoàn thành <span>{exam.data.ten_de_thi}</span>
                                            </b>
                                        </p>
                                        {course?.data.loai_kct === 0 &&
                                            <p className="size-18">
                                                Thí sinh kiểm tra lại toàn bộ đề thi đã trả lời, ghi nhớ 
                                                <span style={{color: 'red', margin: '0 4px'}}>
                                                    ĐIỂM BÀI THI
                                                </span>
                                                trước khi rời phòng thi
                                            </p>
                                        }
                                    </div>
                                    {course?.data.loai_kct === 0 ?
                                        <>
                                            <Row className='title-section' justify={'center'}>
                                                <Col xs={{ span: 22, offset: 1 }} lg={{ span: 16 }}>
                                                    {Array.from({ length: exam.data.so_phan }).map((_, index) => {
                                                        return (
                                                            // 
                                                            <div className={`section-${index} detail-title-section`} style={{margin: '12px 0px'}}>Phần {index + 1}: {index === 0 ? `Tư duy định lượng (${exam.data[`so_cau_hoi_phan_${index + 1}`]} câu, ${exam.data[`thoi_gian_phan_${index + 1}`]} phút)` 
                                                                : index === 1 ? `Tư duy định tính (${exam.data[`so_cau_hoi_phan_${index + 1}`]} câu, ${exam.data[`thoi_gian_phan_${index + 1}`]} phút)`
                                                                : `${localStorage.getItem('mon_thi')?.split(',').length === 1 ? 'Ngoại ngữ ' : 'Khoa học '} (${exam.data[`so_cau_hoi_phan_${index + 1}`]} câu, ${exam.data[`thoi_gian_phan_${index + 1}`]} phút)`}</div>
                                                        )
                                                    })}
                                                    <div className={"section-sum detail-title-section"} style={{margin: '12px 0px'}}>Tổng điểm</div>
                                                </Col>
                                                <Col xs={{ span: 22, offset: 1 }} lg={{ span: 3, }}>
                                                    {Array.from({ length: exam.data.so_phan }).map((_, index) => {
                                                        const startIndex = index === 0 ? 0 : Array.from({ length: index }).reduce((sum, _, i) => sum + exam.data[`so_cau_hoi_phan_${i + 1}`], 0);
                                                        const endIndex = startIndex + exam.data[`so_cau_hoi_phan_${index + 1}`];
                                                        const partQuestions = exam.data.cau_hoi_de_this.slice(startIndex, endIndex);
                                                        const number = partQuestions.map((question, index) => {
                                                            let number = 0;
                                                            if (!isDoing && examUser.status === 'success') {
                                                                if (examUser.data.dap_an_da_chons) {
                                                                    let currentSubmitAnswer = examUser.data.dap_an_da_chons.find((item) => item.cau_hoi_id === question.cau_hoi.cau_hoi_id);
                                                                    if (question.cau_hoi.dap_an_dungs && currentSubmitAnswer !== undefined) {
                                                                        if (question.cau_hoi.loai_cau_hoi === 1 || question.cau_hoi.loai_cau_hoi === 2) { // Câu trắc nghiệm
                                                                            let answerRight = convertAnswer(question.cau_hoi.dap_an_dungs);
                                                                            if (currentSubmitAnswer && answerRight === currentSubmitAnswer.ket_qua_chon) {
                                                                                number = number + 1;
                                                                            } 
                                                                        } else { // Câu tự luận
                                                                            if (currentSubmitAnswer && question.cau_hoi.dap_ans[0].noi_dung_dap_an
                                                                                .replaceAll('<b>', '')
                                                                                .replaceAll('</b>', '')
                                                                                .replaceAll('<em>', '')
                                                                                .replaceAll('</em>', '')
                                                                                .replaceAll('<u>', '')
                                                                                .replaceAll('</u>', '')
                                                                                .trim()
                                                                                .toLowerCase() === (currentSubmitAnswer?.noi_dung_tra_loi)?.toLowerCase()) {
                                                                                number = number + 1;
                                                                            } 
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                            return number;
                                                        })
                                                        return (
                                                            <div className={`section-${index} detail-title-section`} style={{margin: '12px 0px'}}>{number.reduce((partialSum, a) => partialSum + a, 0)}</div>
                                                        )
                                                    })}
                                                    <div className={`section-sum detail-title-section`} style={{margin: '12px 0px'}}>{examUser.data.ket_qua_diem}</div>
                                                </Col>
                                            </Row>
                                            <div style={{fontSize: 22, textAlign: 'center', marginBottom: 12}}>Click vào đây để 
                                                <Button type="text" onClick={() => setIsDetail(true)}
                                                    style={{fontSize: 22, color: 'red'}}
                                                >
                                                    XEM CHI TIẾT
                                                </Button> 
                                                đáp án và lời giải
                                            </div>
                                            {course?.data.loai_kct === 0 && 
                                                <div style={{fontSize: 22, textAlign: 'center', marginBottom: 12}}>Click
                                                    <Button type="text" onClick={() => exportEvaluationDGNL()}
                                                        style={{fontSize: 22, color: 'red'}}
                                                    >
                                                        VÀO ĐÂY
                                                    </Button> 
                                                    để xem thông tin nhận xét, đánh giá chung
                                                </div>
                                            }
                                        </>
                                    :
                                        <>
                                            <div className="body-result">
                                                <div className="total_point mb-4">
                                                    <p>
                                                    <label className="point-label"> ĐIỂM BÀI LÀM CỦA BẠN</label>
                                                    <b className="point font-weight-5">{examUser.data.ket_qua_diem}/{exam.data.tong_diem}</b>
                                                    </p>
                                                </div>
                                                <div className="total_point mb-4">
                                                    <p className='font-weight-5'>
                                                        Thời gian làm:{' '}
                                                        <b>
                                                            {examUser.data.thoi_gian_lam_bai}
                                                        </b>
                                                    </p>
                                                </div>
                                                <Timeline>
                                                    {Array.from({ length: exam.data.so_phan }).map((_, index) => {
                                                        const startIndex = index === 0 ? 0 : Array.from({ length: index }).reduce((sum, _, i) => sum + exam.data[`so_cau_hoi_phan_${i + 1}`], 0);
                                                        const endIndex = startIndex + exam.data[`so_cau_hoi_phan_${index + 1}`];
                                                        const partQuestions = exam.data.cau_hoi_de_this.slice(startIndex, endIndex);
                                                        const number = partQuestions.map((question, index) => {
                                                            let number = 0;
                                                            if (!isDoing && examUser.status === 'success') {
                                                                if (examUser.data.dap_an_da_chons) {
                                                                    let currentSubmitAnswer = examUser.data.dap_an_da_chons.find((item) => item.cau_hoi_id === question.cau_hoi.cau_hoi_id);
                                                                    if (question.cau_hoi.dap_an_dungs && currentSubmitAnswer !== undefined) {
                                                                        if (question.cau_hoi.loai_cau_hoi === 1 || question.cau_hoi.loai_cau_hoi === 2) { // Câu trắc nghiệm
                                                                            let answerRight = convertAnswer(question.cau_hoi.dap_an_dungs);
                                                                            if (currentSubmitAnswer && answerRight === currentSubmitAnswer.ket_qua_chon) {
                                                                                number = number + 1;
                                                                            } 
                                                                        } else { // Câu tự luận
                                                                            if (currentSubmitAnswer && question.cau_hoi.dap_ans[0].noi_dung_dap_an
                                                                                .replaceAll('<b>', '')
                                                                                .replaceAll('</b>', '')
                                                                                .replaceAll('<em>', '')
                                                                                .replaceAll('</em>', '')
                                                                                .replaceAll('<u>', '')
                                                                                .replaceAll('</u>', '')
                                                                                .trim()
                                                                                .toLowerCase() === (currentSubmitAnswer?.noi_dung_tra_loi)?.toLowerCase()) {
                                                                                number = number + 1;
                                                                            } 
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                            return number;
                                                        })
                                                        return (
                                                            <>
                                                            {course?.data.loai_kct === 0 ? 
                                                                <div className='title-section' >
                                                                        <div className={`section-${index}`} style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                                                                            <div style={{padding: 0}}>
                                                                                Phần {index + 1}: {index === 0 ? `Tư duy định lượng: ` 
                                                                                : index === 1 ? `Tư duy định tính: `
                                                                                : `${localStorage.getItem('mon_thi')?.split(',').length === 1 ? 'Ngoại ngữ' : 'Khoa học'}:`}
                                                                            </div>
                                                                            <div style={{padding: 0}}>
                                                                                {number.reduce((partialSum, a) => partialSum + a, 0)}
                                                                            </div>
                                                                        </div>
                                                                </div>
                                                                :
                                                                <Timeline.Item key={index + 1} style={{paddingBottom: index + 1 === exam.data.so_phan ? 0 : 20, fontWeight: 600}}>
                                                                    Điểm thi phần {index + 1}: {number.reduce((partialSum, a) => partialSum + a, 0)} / {exam.data[`so_cau_hoi_phan_${index + 1}`]} = {(number.reduce((partialSum, a) => partialSum + a, 0) / exam.data[`so_cau_hoi_phan_${index + 1}`] * 100).toFixed(0)} %
                                                                </Timeline.Item>
                                                            }
                                                            </>
                                                        )
                                                    })}
                                                </Timeline>
                                            </div>
                                            <div className="body-evaluation">
                                                <h5 style={{fontWeight: 700, textAlign: 'center'}}>Kết quả đánh giá</h5>
                                                <Timeline>
                                                    {Array.from({ length: exam.data.so_phan }).map((_, index) => {
                                                        const startIndex = index === 0 ? 0 : Array.from({ length: index }).reduce((sum, _, i) => sum + exam.data[`so_cau_hoi_phan_${i + 1}`], 0);
                                                        const endIndex = startIndex + exam.data[`so_cau_hoi_phan_${index + 1}`];
                                                        const partQuestions = exam.data.cau_hoi_de_this.slice(startIndex, endIndex);
                                                        // số câu đúng của từng phần
                                                        const number = partQuestions.map((question, index) => {
                                                            let number = 0;
                                                            if (!isDoing && examUser.status === 'success') {
                                                                if (examUser.data.dap_an_da_chons) {
                                                                    let currentSubmitAnswer = examUser.data.dap_an_da_chons.find((item) => item.cau_hoi_id === question.cau_hoi.cau_hoi_id);
                                                                    if (question.cau_hoi.dap_an_dungs && currentSubmitAnswer !== undefined) {
                                                                        if (question.cau_hoi.loai_cau_hoi === 1 || question.cau_hoi.loai_cau_hoi === 2) { // Câu trắc nghiệm
                                                                            let answerRight = convertAnswer(question.cau_hoi.dap_an_dungs);
                                                                            if (currentSubmitAnswer && answerRight === currentSubmitAnswer.ket_qua_chon) {
                                                                                number = number + 1;
                                                                            } 
                                                                        } else { // Câu tự luận
                                                                            if (currentSubmitAnswer && question.cau_hoi.dap_ans[0].noi_dung_dap_an
                                                                                .replaceAll('<b>', '')
                                                                                .replaceAll('</b>', '')
                                                                                .replaceAll('<em>', '')
                                                                                .replaceAll('</em>', '')
                                                                                .replaceAll('<u>', '')
                                                                                .replaceAll('</u>', '')
                                                                                .trim()
                                                                                .toLowerCase() === (currentSubmitAnswer?.noi_dung_tra_loi)?.toLowerCase()) {
                                                                                number = number + 1;
                                                                            } 
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                            return number;
                                                        });
                                                        // Đánh giá của phần tương ứng
                                                        const evaluationsTemp = evaluations?.data?.filter((item) => item.phan_thi === index + 1);
                                                        // Kiểm tra số câu đúng của từng phần và lấy ra đánh giá tương ứng
                                                        const evaluation = evaluationsTemp?.map((item) => {
                                                            let evaluation = '';
                                                            if (number.reduce((partialSum, a) => partialSum + a, 0) === 0) {
                                                                if (item.cau_bat_dau <= number.reduce((partialSum, a) => partialSum + a, 0) && number.reduce((partialSum, a) => partialSum + a, 0) <= item.cau_ket_thuc) {
                                                                    evaluation = item?.danh_gia;
                                                                }
                                                            } else {
                                                                if (item.cau_bat_dau <= number.reduce((partialSum, a) => partialSum + a, 0) && number.reduce((partialSum, a) => partialSum + a, 0) <= item.cau_ket_thuc) {
                                                                    evaluation = item?.danh_gia;
                                                                }
                                                            }
                                                            return evaluation;
                                                        });
                                                        return (
                                                            <Timeline.Item key={index + 1} style={{paddingBottom: index + 1 === exam.data.so_phan ? 0 : 20, fontWeight: 600}}>
                                                                <div style={{whiteSpace: 'pre-line'}}>Nhận xét đánh phần {index + 1}: <br/>{evaluation?.filter((item) => item !== '')[0]?.split('-').filter((item) => item !== '').join('\n')}</div>
                                                            </Timeline.Item>
                                                        )
                                                    })}
                                                </Timeline>
                                            </div>
                                        </>
                                    }                               
                                </div>
                                {course?.data.loai_kct !== 0 &&
                                    <div className="block-action">
                                        <Button type="primary" size="large" className="dowload-exam-button" onClick={() => downloadReport()}>
                                            <DownloadOutlined />
                                            Tải kết quả đánh giá
                                        </Button>
                                    </div>
                                }
                            </div>
                        )}
                        {(exam.status === 'success' && isDoing) && Array.from({ length: exam.data.so_phan }).map((_, index) => {
                            if (index + 1 === state.sectionExam) {
                                const startIndex = index === 0 ? 0 : Array.from({ length: index }).reduce((sum, _, i) => sum + exam.data[`so_cau_hoi_phan_${i + 1}`], 0);
                                const endIndex = startIndex + exam.data[`so_cau_hoi_phan_${index + 1}`];
                                const partQuestions = exam.data.cau_hoi_de_this.slice(startIndex, endIndex);
                                return (
                                    <>
                                        {partQuestions.map((question, ParentIndex) => {
                                            if (ParentIndex < exam.data[`so_cau_hoi_phan_${state.sectionExam}`]) {

                                                let regex = /\\begin{center}\\includegraphics\[scale = 0\.5\]{(.*?)}\\end{center}/;
                                                
                                                return (
                                                    <>
                                                        {((question.cau_hoi.trich_doan && question.cau_hoi.exceprtFrom !== undefined && question.cau_hoi.exceprtTo !== undefined)  || (question.cau_hoi?.trich_doan?.loai_trich_doan_id === 0)) &&
                                                            <>
                                                                {(question.cau_hoi?.trich_doan?.loai_trich_doan_id !== 0) &&
                                                                    <>
                                                                        <span className="exceprt-label">
                                                                            {`${question.cau_hoi?.trich_doan?.loai_trich_doan?.noi_dung} ${ParentIndex + 1}`} 
                                                                            {question.cau_hoi.chuyen_nganh_id === 5 ? ' to ' : ' đến '}    
                                                                            {question.cau_hoi.exceprtTo - (partQuestions.length * (state.sectionExam - 1)) + 1}
                                                                        </span>
                                                                        <br/>
                                                                    </>
                                                                }
                                                                <div className="answer-content" style={{paddingLeft: '0px', fontSize: 18}}> 
                                                                    <MathJax.Provider>
                                                                        {question.cau_hoi?.trich_doan?.noi_dung?.split('\n').filter((item) => item !== '').map((item, index_cauhoi) => {
                                                                            return (
                                                                                <div className="title-exam-content" key={index_cauhoi}>
                                                                                    {
                                                                                        (item.indexOf('includegraphics') !== -1 && item?.match(regex) !== null) ? (
                                                                                            <div style={{display: 'flex', justifyContent: 'center', width: '100%'}}><Image src={config.API_URL + `/${item.match(regex)[1]}`} alt={`img_question_${index_cauhoi}`}></Image></div>
                                                                                        ) : 
                                                                                        (
                                                                                            <div style={{textAlign: 'justify'}}>{item.split('$').map((item2, index2) => {
                                                                                                return (item.indexOf('$' + item2 + '$') !== -1 && (item2.includes('{') || item2.includes('\\')) && (!item2.includes('\\underline') && !item2.includes('\\bold') && !item2.includes('\\italic'))) ? (
                                                                                                    <MathJax.Node key={index2} formula={item2} />
                                                                                                ) : (
                                                                                                    <span dangerouslySetInnerHTML={{ __html: item2 }}></span>
                                                                                                )
                                                                                            })}</div>
                                                                                        )
                                                                                    }
                                                                                </div>
                                                                            )}
                                                                        )}
                                                                    </MathJax.Provider>
                                                                </div>
                                                            </>
                                                        }
                                                        <div className="question-list" key={ParentIndex}>
                                                            <div className="question-info" id={`${ParentIndex + 1}`}>
                                                                <b style={{fontSize: "22px", color: "#fff", backgroundColor: 'green'}}>Câu {ParentIndex + 1}. 
                                                                    {/* <span className="point">[{question.cau_hoi.diem} điểm]</span> */}
                                                                    <span style={{display: question.cau_hoi.loai_cau_hoi === 2 ? 'block' : 'none'}} className="point">[Câu trắc nghiệm đúng sai]</span>
                                                                </b>
                                                                <ul className="action-links"></ul>
                                                            </div>

                                                            <div className="title-exam">
                                                                <MathJax.Provider>
                                                                    {question.cau_hoi.noi_dung.split('\n').map((item, index_cauhoi) => {
                                                                        return (
                                                                            <div className="title-exam-content" key={index_cauhoi}>
                                                                                {
                                                                                    (item.indexOf('includegraphics') !== -1 && item?.match(regex) !== null) ? (
                                                                                        <div style={{display: 'flex', justifyContent: 'center', width: '100%'}}><Image src={config.API_URL + `/${item.match(regex)[1]}`} alt={`img_question2_${index_cauhoi}`}></Image></div>
                                                                                    ) : 
                                                                                    (
                                                                                        <div style={{textAlign: 'justify'}}>{item.split('$').map((item2, index2) => {
                                                                                            return (item.indexOf('$' + item2 + '$') !== -1 && (item2.includes('{') || item2.includes('\\')) && (!item2.includes('\\underline') && !item2.includes('\\bold') && !item2.includes('\\italic'))) ? (
                                                                                                <MathJax.Node key={index2} formula={item2} />
                                                                                            ) : (
                                                                                                <span dangerouslySetInnerHTML={{ __html: item2 }}></span>
                                                                                            )
                                                                                        })}</div>
                                                                                    )
                                                                                }
                                                                            </div>
                                                                        )}
                                                                    )}
                                                                </MathJax.Provider>
                                                            </div>

                                                            <div className="content-answer-question">
                                                                <Row gutter={[20, 10]} className="multi-choice" style={{rowGap: 0}}>
                                                                    {question.cau_hoi.dap_ans.map((answer, index) => {
                                                                        const isAnswered = results.find((it) => it.cau_hoi_id === question.cau_hoi_id);
                                                                        return (
                                                                            <Col xs={24} sm={24} md={getAnswerCols(question.cau_hoi.cot_tren_hang)} key={index}>
                                                                                <ul key={index}>
                                                                                    {(question.cau_hoi.loai_cau_hoi === 1) ? // Trắc nghiệm
                                                                                        <li className={`item ${isAnswered && isAnswered.dap_an.includes(renderAnswerKey(index)) ? 'active' : ''}`}>
                                                                                            <button style={{width:"100%"}} disabled={pause}
                                                                                                className="btn-onclick"
                                                                                                onClick={() => {   
                                                                                                    setPause(true); // Tạm dừng để ngăn chặn việc thay đổi đáp án quá nhanh
                                                                                                    dispatch(answerActions.getAnswersUser({ idDeThi: params.idExamUser, idQuestion: '' }, 
                                                                                                        (res) => {
                                                                                                            if (res.status === 'success') {
                                                                                                                answers = res.data;
                                                                                                                onChooseAnswer(question, renderAnswerKey(index), index, res.data)   
                                                                                                            }
                                                                                                        }
                                                                                                    ))
                                                                                                }}
                                                                                            >
                                                                                                {renderAnswer(question.cau_hoi, answer, index)}
                                                                                            </button>
                                                                                        </li>
                                                                                    : (question.cau_hoi.loai_cau_hoi === 0) ? // Tự luận
                                                                                        <li>
                                                                                            <Input placeholder='Nhập đáp án' rows={1} style={{width:"35%", marginTop: 12}} disabled={!isDoing} defaultValue={isAnswered !== undefined ? isAnswered.noi_dung : null}
                                                                                                onChange={(e) => {
                                                                                                    localStorage.setItem('answerText', null);
                                                                                                    localStorage.setItem('question', null);
                                                                                                    localStorage.setItem('answerText', e.target.value);
                                                                                                    localStorage.setItem('question', JSON.stringify(question));                            
                                                                                                }
                                                                                            }/>
                                                                                        </li>
                                                                                    :
                                                                                        <div className='wrongrightAnswer'>
                                                                                            <button id={`button-Right-${index}`}
                                                                                                className={`btn-DS ${isAnswered && isAnswered.ket_qua_chon[index] === '1' ? 'active' : '' }`}
                                                                                                
                                                                                                onClick={() => {
                                                                                                    dispatch(answerActions.getAnswersUser({ idDeThi: params.idExamUser, idQuestion: '' }, 
                                                                                                        (res) => {
                                                                                                            if (res.status === 'success') {
                                                                                                                answers = res.data;
                                                                                                                onChooseAnswer(question, renderAnswerKey(index), index, res.data)   
                                                                                                            }
                                                                                                        }
                                                                                                    ))
                                                                                                }}
                                                                                            >
                                                                                                <span className="answer-label">Đ</span>
                                                                                            </button>
                                                                                            <button id={`button-Wrong-${index}`}
                                                                                                className={`btn-DS ${isAnswered && isAnswered.ket_qua_chon[index] === '0' ? 'active' : '' }`}
                                                                                                onClick={() => {
                                                                                                    dispatch(answerActions.getAnswersUser({ idDeThi: params.idExamUser, idQuestion: '' }, 
                                                                                                        (res) => {
                                                                                                            if (res.status === 'success') {
                                                                                                                answers = res.data;
                                                                                                                onChooseAnswer(question, renderAnswerKey(index), index, res.data);
                                                                                                            }
                                                                                                        }
                                                                                                    ))
                                                                                                }}
                                                                                            >
                                                                                                <span className="answer-label">S</span>
                                                                                            </button>
                                                                                            <div className="option-answer">
                                                                                                <MathJax.Provider>
                                                                                                    {answer.noi_dung_dap_an.split('\n').map((item, index_cauhoi) => {
                                                                                                        return (
                                                                                                            <div className="option-answer-content" key={index_cauhoi}>
                                                                                                                {
                                                                                                                    (item.indexOf('includegraphics') !== -1 && item?.match(regex) !== null) ? (
                                                                                                                        <Image src={config.API_URL + `/${item?.match(regex)[1]}`} alt={`img_question3_${index_cauhoi}`}></Image>
                                                                                                                    ) : 
                                                                                                                    (
                                                                                                                        <div style={{textAlign: 'justify'}}>{item.split('$').map((item2, index2) => {
                                                                                                                            return (item.indexOf('$' + item2 + '$') !== -1 && (item2.includes('{') || item2.includes('\\')) && (!item2.includes('\\underline') && !item2.includes('\\bold') && !item2.includes('\\italic'))) ? (
                                                                                                                                <MathJax.Node key={index2} formula={item2} />
                                                                                                                            ) : (
                                                                                                                                <span dangerouslySetInnerHTML={{ __html: item2 }}></span>
                                                                                                                            )
                                                                                                                        })}</div>
                                                                                                                    )
                                                                                                                }
                                                                                                            </div>
                                                                                                        )}
                                                                                                    )}
                                                                                                </MathJax.Provider>
                                                                                            </div>
                                                                                        </div>
                                                                                    }
                                                                                </ul>
                                                                            </Col>
                                                                        )
                                                                    })}
                                                                </Row>
                                                            </div>
                                                        </div>
                                                    </>
                                                )
                                            } else return null;
                                        })}
                                        {(localStorage.getItem('mon_thi')?.split(',').includes('9') && index === 2) &&
                                            <div style={{width: '100%', textAlign: 'center', marginBottom: 12}}>
                                                <Button type="primary" danger style={{borderRadius: 8}}>
                                                    <a href={alat} target='_blank' rel='noopener noreferrer'>ALAT Địa lý Việt Nam</a>
                                                </Button>
                                            </div>
                                        }
                                    </>
                                )
                            } else return null;
                        })}
                        {(exam.status === 'success' && !isDoing && ((course?.data.loai_kct === 0 && isDetail) || course?.data.loai_kct !== 0)) && exam.data.cau_hoi_de_this.map((question, ParentIndex) => {
                            let regex = /\\begin{center}\\includegraphics\[scale = 0\.5\]{(.*?)}\\end{center}/;
                            return (
                                <>
                                    {((question.cau_hoi.trich_doan && question.cau_hoi.exceprtFrom !== undefined && question.cau_hoi.exceprtTo !== undefined)  || (question.cau_hoi?.trich_doan?.loai_trich_doan_id === 0)) &&
                                        <>
                                            {(question.cau_hoi?.trich_doan?.loai_trich_doan_id !== 0) &&
                                                <>
                                                    <span className="exceprt-label">
                                                        {`${question.cau_hoi?.trich_doan?.loai_trich_doan?.noi_dung} ${question?.cau_hoi.exceprtFrom + 1}`} 
                                                        {question.cau_hoi.chuyen_nganh_id === 5 ? ' to ' : ' đến '}    
                                                        {question?.cau_hoi.exceprtTo + 1}
                                                    </span>
                                                    <br/>
                                                </>
                                            }
                                            <div className="answer-content" style={{paddingLeft: '0px'}}>             
                                                <MathJax.Provider>
                                                    {question.cau_hoi?.trich_doan?.noi_dung?.split('\n').filter((item) => item !== '').map((item, index_cauhoi) => {
                                                        return (
                                                            <div className="title-exam-content" key={`question_${index_cauhoi}`}>
                                                                {
                                                                    (item.indexOf('includegraphics') !== -1 && item?.match(regex) !== null) ? (
                                                                        <div style={{display: 'flex', justifyContent: 'center', width: '100%'}}><Image src={config.API_URL + `/${item?.match(regex)[1]}`} alt={`img_cauhoi_${index_cauhoi}`}></Image></div>
                                                                    ) : 
                                                                    (
                                                                        <div style={{textAlign: 'justify'}}>{item.split('$').map((item2, index2) => {
                                                                            return (item.indexOf('$' + item2 + '$') !== -1 && (item2.includes('{') || item2.includes('\\')) && (!item2.includes('\\underline') && !item2.includes('\\bold') && !item2.includes('\\italic'))) ? (
                                                                                <MathJax.Node key={`questionI_${index2}`} formula={item2} />
                                                                            ) : (
                                                                                <span dangerouslySetInnerHTML={{ __html: item2 }}></span>
                                                                            )
                                                                        })}</div>
                                                                    )
                                                                }
                                                            </div>
                                                        )}
                                                    )}
                                                </MathJax.Provider>
                                            </div>
                                        </>
                                    }
                                    <div className="question-list" key={ParentIndex}>
                                        
                                        <div className="question-info" id={`${ParentIndex + 1}`}>
                                            <b style={{fontSize: "22px", color: "#fff", backgroundColor: 'green'}}>Câu {ParentIndex + 1}. 
                                                {/* <span className="point">[{question.cau_hoi.diem} điểm]</span> */}
                                                {/* <span className="point">[Mức độ: {renderLevelQuestion(question.cau_hoi.mdch_id)}]</span> */}
                                            </b>
                                            <ul className="action-links"></ul>
                                        </div>

                                        <div className="title-exam">
                                            <MathJax.Provider>
                                                {question.cau_hoi.noi_dung.split('\n').map((item, index_cauhoi) => {
                                                    return (
                                                        <div className="title-exam-content" key={index_cauhoi}>
                                                            {
                                                                (item.indexOf('includegraphics') !== -1 && item?.match(regex) !== null) ? (
                                                                    <div style={{display: 'flex', justifyContent: 'center', width: '100%'}}><Image src={config.API_URL + `/${item?.match(regex)[1]}`} alt={`img_question4_${index_cauhoi}`}></Image></div>
                                                                ) : 
                                                                (
                                                                    <div style={{textAlign: 'justify'}}>{item.split('$').map((item2, index2) => {
                                                                        return (item.indexOf('$' + item2 + '$') !== -1 && (item2.includes('{') || item2.includes('\\')) && (!item2.includes('\\underline') && !item2.includes('\\bold') && !item2.includes('\\italic'))) ? (
                                                                            <MathJax.Node key={index2} formula={item2} />
                                                                        ) : (
                                                                            <span dangerouslySetInnerHTML={{ __html: item2 }}></span>
                                                                        )
                                                                    })}</div>
                                                                )
                                                            }
                                                        </div>
                                                    )}
                                                )}
                                            </MathJax.Provider>
                                        </div>

                                        <div className="content-answer-question">
                                            <Row gutter={[20, 10]} className="multi-choice" style={{rowGap: 0}}>
                                                {question.cau_hoi.dap_ans.map((answer, index) => {
                                                    const isAnswered = results.find((it) => it.cau_hoi_id === question.cau_hoi_id);
                                                    return (
                                                        <Col xs={24} sm={24} md={getAnswerCols(question.cau_hoi.cot_tren_hang)} key={index}>
                                                            <ul key={index}>
                                                                {(question.cau_hoi.loai_cau_hoi === 1) ?
                                                                    <li className={`item ${isAnswered && isAnswered.dap_an === renderAnswerKey(index) ? 'active' : ''}`}>
                                                                        <button style={{width:"100%"}}
                                                                            className="btn-onclick"
                                                                        >
                                                                            {renderAnswer(question.cau_hoi, answer, index)}
                                                                        </button>
                                                                    </li>
                                                                : (question.cau_hoi.loai_cau_hoi === 0) ?
                                                                    <li>
                                                                        <Input style={{width:"100%"}} disabled={!isDoing} 
                                                                            defaultValue={isAnswered !== undefined ? isAnswered.noi_dung : null} />
                                                                    </li>
                                                                :
                                                                <div className='wrongrightAnswer'>
                                                                    <button id={`button-Right-${index}`}
                                                                        className={`btn-DS 
                                                                            ${isCorrectQuestionDungSai(question.cau_hoi, index, true) !== null && !isCorrectQuestionDungSai(question.cau_hoi, index, true)  ? 'incorrect' : ''}
                                                                            ${isCorrectQuestionDungSai(question.cau_hoi, index, true) !== null && isCorrectQuestionDungSai(question.cau_hoi, index, true) ? 'correct' : ''}`
                                                                        }
                                                                    >
                                                                        <span className="answer-label">Đ</span>
                                                                    </button>
                                                                    <button id={`button-Wrong-${index}`}
                                                                        className={`btn-DS 
                                                                            ${isCorrectQuestionDungSai(question.cau_hoi, index, false) !== null && !isCorrectQuestionDungSai(question.cau_hoi, index, false) ? `incorrect` : ''}
                                                                            ${isCorrectQuestionDungSai(question.cau_hoi, index, false) !== null && isCorrectQuestionDungSai(question.cau_hoi, index, false) ? 'correct' : ''}`
                                                                        }
                                                                    >
                                                                        <span className="answer-label">S</span>
                                                                    </button>
                                                                    <div className="option-answer">
                                                                        <MathJax.Provider>
                                                                            {answer.noi_dung_dap_an.split('\n').map((item, index_cauhoi) => {
                                                                                return (
                                                                                    <div className="option-answer-content" key={index_cauhoi}>
                                                                                        {
                                                                                            (item.indexOf('includegraphics') !== -1 && item?.match(regex) !== null) ? (
                                                                                                <Image src={config.API_URL + `/${item.match(regex)[1]}`} alt={`img_question5_${index_cauhoi}`}></Image>
                                                                                            ) : 
                                                                                            (
                                                                                                <div style={{textAlign: 'justify'}}>{item.split('$').map((item2, index2) => {
                                                                                                    return (item.indexOf('$' + item2 + '$') !== -1 && (item2.includes('{') || item2.includes('\\')) && (!item2.includes('\\underline') && !item2.includes('\\bold') && !item2.includes('\\italic'))) ? (
                                                                                                        <MathJax.Node key={index2} formula={item2} />
                                                                                                    ) : (
                                                                                                        <span dangerouslySetInnerHTML={{ __html: item2 }}></span>
                                                                                                    )
                                                                                                })}</div>
                                                                                            )
                                                                                        }
                                                                                    </div>
                                                                                )}
                                                                            )}
                                                                        </MathJax.Provider>
                                                                    </div>
                                                                </div>
                                                                }
                                                            </ul>
                                                        </Col>
                                                    )
                                                })}
                                            </Row>
                                            {renderAnswerResult(question)}
                                        </div>

                                        {!isDoing && 
                                            <div className="question-actions">
                                                <Button
                                                    type="default"
                                                    shape="round"
                                                    icon={<InfoCircleOutlined />}
                                                    onClick={() => {
                                                        if (!help.includes(question.cau_hoi_id)) {
                                                            setHelp([...help, question.cau_hoi_id]);
                                                        } else {
                                                            setHelp(help.filter((cau_hoi_id) => cau_hoi_id !== question.cau_hoi_id));
                                                        }
                                                    }}
                                                >
                                                    Xem lời giải
                                                </Button>
                                                <Button
                                                    type="default"
                                                    shape="round"
                                                    icon={<CommentOutlined />}
                                                    onClick={() => {
                                                        if (!commnetOpen.includes(question.cau_hoi_id)) {
                                                            setCommentOpen([...commnetOpen, question.cau_hoi_id]);
                                                        } else {
                                                            setCommentOpen(commnetOpen.filter((cau_hoi_id) => cau_hoi_id !== question.cau_hoi_id));
                                                        }
                                                    }}
                                                >
                                                    Hỏi đáp / Thảo Luận
                                                </Button>
                                                <div className="question-toggle">
                                                
                                                {help.includes(question.cau_hoi_id) && (
                                                    <Alert
                                                        message=""
                                                        type="warning"
                                                        description={
                                                            <div className="help-answer">
                                                                <MathJax.Provider>
                                                                    {question.cau_hoi.loi_giai.split('\n').map((item, index_cauhoi) => {
                                                                        return (
                                                                            <div className="help-answer-content" key={index_cauhoi}> 
                                                                            {
                                                                                (item.indexOf('includegraphics') !== -1 && item?.match(regex) !== null) ? (
                                                                                    <Image src={config.API_URL + `/${item.match(regex)[1]}`} alt={`img_question6_${index_cauhoi}`}></Image>
                                                                                ) : (
                                                                                    item.split('$').map((item2, index2) => {
                                                                                        return (item.indexOf('$' + item2 + '$') !== -1 && (item2.includes('{') || item2.includes('\\')) && (!item2.includes('\\underline') && !item2.includes('\\bold') && !item2.includes('\\italic'))) ? (
                                                                                            <MathJax.Node key={index2} formula={item2} />
                                                                                        ) : (
                                                                                            <span dangerouslySetInnerHTML={{ __html: item2 }}></span>
                                                                                        )
                                                                                    })
                                                                                )
                                                                            }
                                                                            </div>
                                                                        )}
                                                                    )}
                                                                </MathJax.Provider>
                                                            </div>
                                                        }
                                                        closable
                                                        onClose={() => setHelp(help.filter((cau_hoi_id) => cau_hoi_id !== question.cau_hoi_id))}
                                                    />
                                                )}

                                                {commnetOpen.includes(question.cau_hoi_id) && (
                                                    <Alert
                                                        message=""
                                                        type="warning"
                                                        description={
                                                        <div className="comments">
                                                            {comments.data.filter(item => Number(item.lien_ket_id.split('/')[1]) === question.cau_hoi_id).length > 0 && (
                                                            <List
                                                                className="comment-list"
                                                                itemLayout="horizontal"
                                                                dataSource={comments.data.filter(item => Number(item.lien_ket_id.split('/')[1]) === question.cau_hoi_id)}
                                                                renderItem={(item, index) => (
                                                                <li key={index}>
                                                                    <Comment author={<p style={{fontWeight: 'bold'}}>{item.ten_hoc_vien}</p>} 
                                                                        avatar={item.anh_dai_dien !== null ? config.API_URL + item.anh_dai_dien : defaultImage} 
                                                                        content={<div><div dangerouslySetInnerHTML={{ __html: item.noi_dung }}></div>{item.anh_dinh_kem !== null && <Image src={config.API_URL + item.anh_dinh_kem} alt="ảnh bình luận"/>}</div>} 
                                                                        datetime={diff(item.ngay_tao)} 
                                                                        actions={[
                                                                            <Space>
                                                                                <Button type='link' onClick={() => replyComment(item.binh_luan_id)}>Phản hồi</Button>
                                                                                {item.hoc_vien_id === JSON.parse(localStorage.getItem('userInfo')).hoc_vien_id && 
                                                                                <>
                                                                                    <Button type='link' onClick={() => EditComment(item.binh_luan_id, item.binh_luan_phu_id, false)}>Sửa</Button>
                                                                                    <Button type='link' onClick={() => deleteComment(item.binh_luan_id, item.binh_luan_phu_id, false)}>Xóa</Button>
                                                                                </>
                                                                                }
                                                                                {(item.so_binh_luan_phu > 0 && !state.showSubcomment) &&            
                                                                                    <Button onClick={() => renderMoreSubComment(item.binh_luan_id)} type="link">{item.so_binh_luan_phu} phản hồi</Button> 
                                                                                }
                                                                            </Space>
                                                                        ]}
                                                                    >
                                                                        <div id={item.binh_luan_id}></div>
                                                                    </Comment>
                                                                </li>
                                                                )}
                                                            />
                                                            )}

                                                            <TextEditorWidget2
                                                                placeholder="Nhập nội dung bình luận..."
                                                                showToolbar={true}
                                                                isMinHeight200={true}
                                                                isSimple={false}
                                                                value={comment}
                                                                onChange={(val) => setComment(val)}
                                                            />
                                                            <Dragger {...propsImage} maxCount={1}
                                                                listType="picture"
                                                                className="upload-list-inline"
                                                            >
                                                                <p className="ant-upload-drag-icon"><UploadOutlined /></p>
                                                                <p className="ant-upload-text bold">Click hoặc kéo thả ảnh vào đây</p>
                                                            </Dragger>
                                                            <Space>
                                                                <Button className='mt-2'
                                                                    type="primary"
                                                                    shape="round"
                                                                    onClick={() => {
                                                                        saveComment(question.cau_hoi_id, question.cau_hoi.mo_dun_id, question.cau_hoi.chuyen_de_id);
                                                                    }}
                                                                >
                                                                Gửi bình luận
                                                                </Button>
                                                                {(state.isReplied || state.isEdit) && <Button type="primary" danger className='mt-2' onClick={() => cancelReplyOrEdit()} shape="round">HỦY</Button>  }
                                                            </Space>
                                                        </div>
                                                        }
                                                        closable
                                                        onClose={() => setCommentOpen(commnetOpen.filter((cau_hoi_id) => cau_hoi_id !== question.cau_hoi_id))}
                                                    />
                                                )}
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </>
                            )
                        })}
                    </Col>
                    
                    {/* Đánh giá năng lực */}
                    {(isDoing && course?.data.loai_kct === 0) && Array.from({ length: exam.data.so_phan }).map((_, index) => {
                        if (index + 1 === state.sectionExam) {
                            const startIndex = index === 0 ? 0 : Array.from({ length: index }).reduce((sum, _, i) => sum + exam.data[`so_cau_hoi_phan_${i + 1}`], 0);
                            const endIndex = startIndex + exam.data[`so_cau_hoi_phan_${state.sectionExam}`];
                            const partQuestions = exam.data.cau_hoi_de_this.slice(startIndex, endIndex);
                            return (
                                <Col span={3} style={{padding: 0}}>
                                    <div className="exam-right-content" >
                                        <div className="exam-right-info">
                                            <p className="mg-0 title-list-q" style={{textAlign: 'left !important'}}><b>Trả lời của bạn</b></p>
                                            <span style={{fontSize: 20, color: 'rgb(255, 48, 7)', padding: '12px 12px 0px 12px'}}>-------------</span>
                                            <ul>
                                                {partQuestions.map((question, index) => {
                                                    const isAnswered = results.find((it) => it.cau_hoi_id === question.cau_hoi_id);
                                                    return (
                                                        <li key={index + 1} className={`item ${((isAnswered && isAnswered.dap_an?.length !== 0) || (isAnswered && question?.cau_hoi?.loai_cau_hoi === 2)) ? 'active' : ''}`}>
                                                            <button style={{borderRadius: 8}}
                                                                onClick={() => {
                                                                    const element = document?.getElementById(index + 1);
                                                                    const offset = 120; // height of your fixed header
                                                                    const y = element.getBoundingClientRect().top + window.pageYOffset - offset;

                                                                    window.scrollTo({ top: y, behavior: "smooth" });
                                                                }}
                                                            >
                                                                {index + 1}. 
                                                            </button>
                                                            <span>{isAnswered ? (isAnswered.loai_dap_an ? isAnswered?.dap_an?.join(', ') : isAnswered.noi_dung ? isAnswered.noi_dung : '-' ) : '-'}</span>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                    </div>
                                </Col>
                            )
                        } else return null;
                    })}
                    {/* Các khóa học thuộc khung chương trình khác */}
                    {(isDoing && course?.data.loai_kct !== 0) && Array.from({ length: exam.data.so_phan }).map((_, index) => {
                        if (index + 1 === state.sectionExam) {
                            const startIndex = index === 0 ? 0 : Array.from({ length: index }).reduce((sum, _, i) => sum + exam.data[`so_cau_hoi_phan_${i + 1}`], 0);
                            const endIndex = startIndex + exam.data[`so_cau_hoi_phan_${state.sectionExam}`];
                            const partQuestions = exam.data.cau_hoi_de_this.slice(startIndex, endIndex);
                            return (
                                <Col span={6}>
                                    <div className="exam-right-content" style={{ position: 'sticky', top: '0px', marginTop: 0 }}>
                                        <div className="topbar-exam">
                                            <p className="mg-0">
                                            <b style={{fontSize: 16}}>Thời gian </b>
                                            <span className="white-spread-upper"></span>
                                            <b style={{ color: '#fff', fontSize: 20 }}>{secondsToMinutes(countSection)}</b>
                                            </p>
                                
                                            <p className="mg-0">
                                            <b style={{fontSize: 16}}>Số câu đã làm</b>
                                            <span className="white-spread-under"></span>
                                            <b style={{ color: '#fff', fontSize: 24 }}>
                                                <span style={{ color: '#373636' }}>{`${results.length}/${partQuestions.length}`}</span>
                                            </b>
                                            </p>
                                        </div>
                                        <div className="exam-right-info hide-scrollbar">
                                            <p className="mg-0 color-blue text-center title-list-q"><b>Câu hỏi</b></p>
                                            <ul style={{ display: 'block' }}>
                                                {partQuestions.map((question, index) => {
                                                    const isAnswered = results.find((it) => it.cau_hoi_id === question.cau_hoi_id);
                                                    return (
                                                        <li key={index + 1} className={`item ${((isAnswered && isAnswered.dap_an?.length !== 0) || (isAnswered && question?.cau_hoi?.loai_cau_hoi === 2)) ? 'active' : ''}`}>
                                                            <button className='a-tag' style={{borderRadius: 8}}
                                                                onClick={() => {
                                                                    const element = document?.getElementById(index + 1);
                                                                    const offset = 120; // height of your fixed header
                                                                    const y = element.getBoundingClientRect().top + window.pageYOffset - offset;

                                                                    window.scrollTo({ top: y, behavior: "smooth" });
                                                                }}
                                                            >
                                                                {index + 1}
                                                            </button>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                        <p className="text-center">
                                            {(state.sectionExam === exam.data.so_phan) ?
                                                <button className="btn-onclick submit-exam" onClick={() => submit()}>
                                                    <b>Nộp bài thi</b>
                                                </button>
                                            :
                                                <button className="btn-onclick submit-exam" onClick={() => handleNextSectionExam()}>
                                                    <b>Phần tiếp theo</b>
                                                </button>
                                            }
                                            {(state.sectionExam > 1 && !isDoing) &&
                                                <button className="btn-onclick submit-exam" onClick={() => handlePrevSectionExam()}>
                                                    <b>Phần thi trước</b>
                                                </button>
                                            }
                                        </p> 
                                    </div>
                                </Col>
                            )
                        } else return null;
                    })}
                    {(!isDoing && course?.data.loai_kct === 0 && isDetail) && renderHistoryExamSidebar()}
                    {(!isDoing && course?.data.loai_kct !== 0 && renderHistoryExamSidebarOld())}
                </Row>
                {isDoing && 
                    <p className="text-center">
                        {(state.sectionExam === exam.data.so_phan) ?
                            <button className="btn-onclick submit-exam" onClick={() => submit()}>
                                <b>Nộp bài thi</b>
                            </button>
                        :
                            <button className="btn-onclick submit-exam" onClick={() => handleNextSectionExam()}>
                                <b>Phần tiếp theo</b>
                            </button>
                        }
                        {(state.sectionExam > 1 && !isDoing) &&
                            <button className="btn-onclick submit-exam" onClick={() => handlePrevSectionExam()}>
                                <b>Phần thi trước</b>
                            </button>
                        }
                    </p> 
                }
            </Spin>
        )
    }

    if (!isFullscreen) {
        return (
            <div className='full-screen'>
                <div>Bạn phải vào chế độ toàn màn hình (fullscreen) mới làm được bài thi.</div>
                <Button onClick={enterFullscreen} type='primary'>
                    Vào chế độ Full screen
                </Button>
            </div>
        )
    }

    return (
        <>
            {loading && <LoadingCustom />}
            {exam.status === 'success' && 
                <Layout className={`main-app ${isDoing ? 'doing-exam' : 'history-exam'}`}>
                    <Helmet>
                        <title>{exam.data.ten_de_thi}</title>
                    </Helmet>
                    <Content className="app-content" style={{background: '#fff'}}>
                        <div className="header-exam">
                            {/* <h1>{exam.data.ten_de_thi} - Phần {state.sectionExam}</h1> */}
                            <h1 style={{color: 'rgb(255, 48, 7)'}}>
                                {exam.data.loai_de_thi_id === 5 ? `Bài thi thử ĐGNL ĐHQGHN (HSA) 2024 ${(isDoing && state.sectionExam === 1) ? '- PHẦN 1' : (isDoing && state.sectionExam === 2) ? '- PHẦN 2' : (isDoing && state.sectionExam === 3) ? '- PHẦN 3' : (!isDoing) && ''}` : exam.data.ten_de_thi}
                            </h1>
                            <h4>Mã đề: {exam.data.de_thi_id}</h4>
                            <AuthModal />
                        </div>
                        <AppBreadCrumb list={breadcrumbs} hidden={false} />
                        <div class="wraper-exam"  style={{ padding: '0' }}>{renderExam()}</div>
                    </Content>
                </Layout>
            }
            {error && notification.error({
                message: 'Thông báo',
                description: 'Lấy dữ liệu đề thi thất bại',
            })}
            {contextHolder}
        </>
    )
}

export default ExamOnlineDetailDGTD