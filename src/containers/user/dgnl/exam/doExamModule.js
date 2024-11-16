import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useParams, Link, useHistory } from 'react-router-dom';
import moment from 'moment';
import { Helmet } from 'react-helmet';
import './css/ExamDetail2.scss'
import config from '../../../../configs/index';
import { secondsToMinutes } from 'helpers/common.helper';
import Hashids from 'hashids';
import { diff } from 'helpers/common.helper';
import defaultImage from 'assets/img/default.jpg';
import { createRoot } from 'react-dom/client';

// hook
import useDebounce from 'hooks/useDebounce';

// component
import AuthModal from 'components/common/auth/AuthModal';
import AppBreadCrumb from "components/parts/breadcrumb/AppBreadCrumb";
import NoRecord from 'components/common/NoRecord';
import { Layout, Row, Col, Modal, Button, notification, Input, Alert, Upload, 
    Image, Space, List, Comment, message } from 'antd';
import { InfoCircleOutlined, CommentOutlined, UploadOutlined } from '@ant-design/icons';
import LoadingCustom from 'components/parts/loading/Loading';
import TextEditorWidget2 from 'components/common/TextEditor/TextEditor2';
import MathJax from 'react-mathjax';

// icon
import Icon from '@ant-design/icons';
// import docIcon from 'assets/img/exam/doc-icon.png';
import adope from 'assets/img/exam/adope.gif';

// redux
import { useSelector, useDispatch } from 'react-redux';
import * as examActions from '../../../../redux/actions/exam';
import * as answerActions from '../../../../redux/actions/answer';
import * as commentAction from '../../../../redux/actions/comment';
import * as notificationAction from '../../../../redux/actions/notification';

const { Content } = Layout;
// const { TextArea } = Input;
const { Dragger } = Upload;

const ExamModuleDetail = () => {
    const params = useParams();
    const history = useHistory();
    
    const hashids = new Hashids();
    const userToken = localStorage.getItem('userToken');
    const dispatch = useDispatch();

    const [isDoing, setIsDoing] = useState(true);
    const [count, setCount] = useState(3600);
    const [help, setHelp] = useState([]);
    const [commnetOpen, setCommentOpen] = useState([]);
    const [comment, setComment] = useState('');
    const [startTime, setStartTime] = useState(0);
    const timerId = useRef(null);
    const [state, setState] = useState({
        time: 0,
        fileImg: '',
        isReplied: false,
        isEdit: false,
        idComment: 0,
        idSubcomment: 0,
        showSubcomment: false,
    });
    const [results, setResults] = useState([]);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const exam = useSelector(state => state.exam.item.result);
    const loading = useSelector(state => state.exam.item.loading);
    const error = useSelector(state => state.exam.item.error);
    const examUser = useSelector(state => state.exam.examUser.result);
    const comments = useSelector(state => state.comment.list.result);

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

    let answers = [];
    let breadcrumbs = [];

    const textAnswer = useDebounce(localStorage.getItem('answerText'), 500);

    useEffect(() => {
        const callback = (res) => {
            const subCallBack = (subres) => {
                if (subres.status === 'success') {
                    ///// Xử lý trường hợp Khi đã nộp bài
                    // Nếu có thời gian làm bài => đã nộp bài
                    if (subres.data.thoi_gian_lam_bai !== null) {
                        clearInterval(timerId?.current);
                        setStartTime(0);
                        setIsDoing(false);
                    } else {
                        const remainingTime = (Number(res.data.thoi_gian) * 60) - ((new Date().getTime() - new Date(subres.data.thoi_diem_bat_dau).getTime()) / 1000);
                        if (remainingTime > 0) { // Còn thời gian làm bài
                            setCount(remainingTime);
                            setStartTime(new Date().getTime());
                            // timerId.current = setInterval(() => {
                            //     setCount((preCount) => preCount - 1);
                            // }, 1000);
                        } else { // Hết thời gian làm bài
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
                            dispatch(examActions.editExamUser({ idExam: params.idExamUser, formData: info }))
                            clearInterval(timerId?.current);
                            setStartTime(0);
                            setIsDoing(false);
                        }
                    }
                }
            };

            if (res.status === 'success') {
                setState({...state, time: res.data.thoi_gian});

                dispatch(examActions.getExamUser({ id: params.idExamUser }, subCallBack)) // Gọi API để lấy thông tin (Thời gian bắt đầu, thời gian kết thúc)
            }
        };

        localStorage.removeItem('answerText');
        localStorage.removeItem('question');

        dispatch(examActions.getExam({ id: params.id }, callback));
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
    }, [params.idmodule]); // eslint-disable-line react-hooks/exhaustive-deps
    
    // check full screen
    useEffect(() => {
        const handleFullscreenChange = () => {
            const fullscreenElement = document.fullscreenElement
            setIsFullscreen(!!fullscreenElement)

            if (!fullscreenElement) {
                // Custom action when fullscreen is exited
                clearInterval(timerId?.current); // Dừng đếm thời gian section
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
                setCount((preCount) => preCount - 1);
            }, 1000);
        }
    }

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

    useEffect(() => {
        if (count <= 0) {
            setIsDoing(false);
            clearInterval(timerId?.current);
            Modal.warning({
                title: 'Hết giờ làm bài',
                content: 'Bài thi tự động kết thúc khi hết giờ làm bài.',
            });
            onSaveHistory();
        }      
    }, [count]); // eslint-disable-line react-hooks/exhaustive-deps

    if (exam.status === 'success') {
        breadcrumbs.push({ title: 'Đề thi', link: '#' }, { title: exam.data.ten_de_thi, link: `#` });
    }

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

    const getAnswerCols = (type) => {
        if (type === 1) return 24;
        else if (type === 2) return 12;
        else if (type === 3) return 8;
        else if (type === 4) return 6;
        else return 24;
    };

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
                dispatch(answerActions.editAnswerUser({ id: isAnswered.dadc_id, formData: submit }));
            } else { // Nếu chưa trả lời
                let ket_qua = '0000';
                ket_qua = ket_qua.substring(0, index) + '1' + ket_qua.substring(index + 1); // Thay 1 vào vị trí index của ket_qua
                setResults([...results, { cau_hoi_id: question.cau_hoi_id, dap_an: [answerKey], gia_tri_dap_an: [index], loai_dap_an: true, ket_qua_chon: ket_qua }]);
                
                let trac_nghiem_submit = [];
                trac_nghiem_submit.push({
                    "ket_qua": ket_qua,
                    "cau_hoi_id": question.cau_hoi_id
                });

                const submit = {
                    "ket_qua_chons":trac_nghiem_submit,
                    "noi_dung_tra_lois": '',
                    "dthv_id": params.idExamUser
                }
                dispatch(answerActions.createAnswerUser(submit));
            }
        }
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
                    "noi_dung_tra_loi": value,
                    "dthv_id": params.idExamUser,
                    "cau_hoi_id": question.cau_hoi_id
                }
                dispatch(answerActions.editAnswerUser({ id: isAswered.dadc_id, formData: submit }));
            } else {
                setResults([...results, { cau_hoi_id: question.cau_hoi_id, noi_dung: value, gia_tri_dap_an: value, loai_dap_an: false }]);
                
                const tu_luan = [{
                    "noi_dung": value,
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

    const onSaveHistory = () => {
        const callbackSub = (res) => {
            if (res.status === 200 && res.statusText === 'OK') {
                notification.success({
                    message: 'Thành công',
                    description: 'Nộp bài thành công', 
                });
                clearInterval(timerId?.current);
                setStartTime(0);
            } else {
                clearInterval(timerId?.current);
                setStartTime(0);
            };
            setIsDoing(false);
            window.location.reload();
            dispatch(examActions.getExamUser({ id: params.idExamUser }));
        };

        let timePassedInSecond = (new Date().getTime() - startTime) / 1000;
        timePassedInSecond = Math.round(timePassedInSecond);
        const info = {
            "thoi_gian_lam_bai": count <= 0 ? secondsToMinutes(state.time * 60) : secondsToMinutes(timePassedInSecond),
            "thoi_diem_ket_thuc": moment().toISOString()
        }
        dispatch(examActions.editExamUser({ idExam: params.idExamUser, formData: info }, callbackSub))
        
    };

    const renderHistoryExamSidebar = () => {
        return (
            <Col span={3}>
                {examUser.status === 'success' &&
                    <div className="exam-right-content" style={{ position: 'sticky', top: '0px' }}>
                        <div className="exam-right-info">
                            <p className="mg-0 color-blue text-center title-list-q">
                                <b style={{fontSize: 18}}>Câu hỏi</b>
                            </p>
                            <ul>
                                {exam.status === 'success' && exam.data.cau_hoi_de_this.map((question, index) => {
                                    return (
                                        <li key={index + 1} className={isCorrectAnswer(question.cau_hoi)}>
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
                                            <span>{convertAnswerKey(question.cau_hoi)}</span>
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

    const renderDoingExamSidebar = () => {
        return (
            <Col span={3}>
                <div className="exam-right-content" style={{ position: 'sticky', top: '0px' }}>
                    <div className="exam-right-info">
                        <p className="mg-0 title-list-q" style={{textAlign: 'left !important'}}><b>Trả lời của bạn</b></p>
                        <span style={{fontSize: 18, color: '#ff8100cc', padding: '12px 12px 0px 12px'}}>------</span>
                        <ul>
                            {exam.status === 'success' && exam.data.cau_hoi_de_this.map((question, index) => {
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
                                        <span>{isAnswered ? (isAnswered.loai_dap_an ? isAnswered?.dap_an?.join(', '): isAnswered.noi_dung) : '-'}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </Col>
        );
    };

    const renderAnswerKey = (index) => {
        if (index === 3) return 'D';
        else if (index === 2) return 'C';
        else if (index === 1) return 'B';
        else if (index === 0) return 'A'
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
                                .toLowerCase() === (currentSubmitAnswer.noi_dung_tra_loi).toLowerCase()) {
                                isRight = 'right-answer';
                            } else if (currentSubmitAnswer && question.dap_ans[0].noi_dung_dap_an
                                .replaceAll('<b>', '')
                                .replaceAll('</b>', '')
                                .replaceAll('<em>', '')
                                .replaceAll('</em>', '')
                                .replaceAll('<u>', '')
                                .replaceAll('</u>', '')
                                .trim()
                                .toLowerCase() !== (currentSubmitAnswer.noi_dung_tra_loi).toLowerCase()) {
                                isRight = 'wrong-answer';
                            }
                        }
                    }
                }
            }
        return isRight;
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
                                        <Image src={config.API_URL + `/${item.match(regex)[1]}`} alt={`img_question_${index_cauhoi}`}></Image>
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
            </div>
        );
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

    const renderAnswerResult = (question) => {
        if (!isDoing && exam.status === 'success') {
            return (
                <p className="result-exam-item">
                    {(question.cau_hoi.loai_cau_hoi === 1 || question.cau_hoi.loai_cau_hoi === 2) ?
                        <span className="right-answer">Đáp án đúng {question.cau_hoi.dap_an_dungs.map((item) => renderAnswerKey(item)).join(', ')}</span>
                        : <span className="right-answer" dangerouslySetInnerHTML={{ __html: `Đáp án đúng: ${question.cau_hoi.dap_ans[0].noi_dung_dap_an}` }}></span>
                    }
                </p>
            );
        }
    };

    const submit = () => {
        // if (count > (1/3) * exam.data.thoi_gian * 60) {
        //     notification.warning({
        //         message: 'Thông báo',
        //         description: 'Chỉ có thể nôp bài khi còn 1/3 thời gian phần thi', 
        //     });
        //     return;
        // }
        
        const timeLeftInMinutes = Math.floor(count / 60);
        const timeLeftInSeconds = Math.floor(count - timeLeftInMinutes * 60);
        const questionLeft = exam.data.cau_hoi_de_this.length - results.length;

        Modal.confirm({
            title: 'Xác nhận nộp bài',
            maskStyle: { background: 'rgba(0, 0, 0, 0.8)' },
            wrapClassName: 'cra-confirm-modal-container',
            content: (
                <div className="cra-confirm-body">
                    {questionLeft > 0 && (
                        <div>
                        Bạn còn <b>{questionLeft} câu chưa trả lời</b>.
                        </div>
                    )}
                    {questionLeft === 0 && (
                        <div>
                        <b>Bạn đã hoàn thiện đủ {questionLeft} câu hỏi.</b>
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

    // const doExamAgain = () => {
    //     const callback = (res) => {
    //         if (res.status === 200 && res.statusText === 'OK') {
    //             window.location.href = `/luyen-tap/lam-kiem-tra/${params.idmodule}/${moment().toNow()}/${res.data.data.de_thi_id}/${res.data.data.dthv_id}/${params.idCourse}`;
    //         }
    //     };

    //     const data = {
    //         "thoi_diem_bat_dau": moment().toISOString(),
    //         "de_thi_id": params.id
    //     }
    //     dispatch(examActions.createExamUser(data, callback));
    // };

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
                        "link_lien_ket": `${chuyen_de_id}/${hashids.decode(params.idmodule)}/${hashids.decode(params.idCourse)}/${params.id}/${params.idExamUser}/${res.data.data.binh_luan_id}`
                    };
                    dispatch(notificationAction.CreateNOTIFICATION({ formData: note, idModule: mo_dun_id, type: 1, 
                        idThematic: chuyen_de_id, idExam: params.id, index: cau_hoi_id, Teacher: '',
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
            formData.append('mo_dun_id', hashids.decode(params.idmodule));
            formData.append('loai_hoi_dap', 1)
            formData.append('lien_ket_id', `${params.id}/${cau_hoi_id}/${chuyen_de_id}/${params.idExamUser}/2`);
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

    const renderExam = () => {
        if (!userToken) return <NoRecord subTitle="Bạn cần đăng nhập để làm bài thi." status="403" />;
        if (error) return <NoRecord subTitle="Không tìm thấy đề thi." />;

        return (
            <>
                <Row className="question-content" style={{margin: '0 68px'}}>
                    <Col span={21}>
                    {(!isDoing && examUser.status === 'success') &&(
                        <div className="history-header">
                            <div className="summury-result">
                                <div className="head-result">
                                    <p className="size-18 color-blue">
                                        <b>
                                        Chúc mừng bạn đã hoàn thành <span>{exam.data.ten_de_thi}</span>
                                        </b>
                                    </p>
                                </div>
                                <div className="body-result">
                                    <div className="total_point">
                                        <p>
                                        <label className="point-label"> ĐIỂM SỐ</label>
                                        <b className="point font-weight-5">{examUser.data.ket_qua_diem}/{exam.data.tong_diem}</b>
                                        </p>
                                    </div>
                                    <div className="total_point">
                                        <p className='font-weight-5'>
                                            Thời gian làm:{' '}
                                            <b>
                                                {examUser.data.thoi_gian_lam_bai}
                                            </b>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="block-action">
                                {/* <Button type="default" size="large" className="dowload-exam-button" onClick={() => doExamAgain()}>
                                    <Icon component={() => <img className="dowload-exam-right-icon" src={docIcon} alt="..." />} />
                                    Làm lại bài thi
                                </Button> */}

                                <Link to={`/luyen-tap/mo-dun/xem/${params.idmodule}/${hashids.encode(params.id)}/${params.idCourse}`}>
                                    <Button type="default" size="large" className="dowload-exam-button">
                                        <Icon component={() => <img className="dowload-exam-icon" src={adope} alt="...1" /> } onClick={() => history.push(`/luyen-tap/mo-dun/xem/${params.idmodule}/${hashids.encode(params.id)}/${params.idCourse}`)} />
                                        Lịch sử làm bài
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    )}
                    {exam.status === 'success' && exam.data.cau_hoi_de_this.map((question, ParentIndex) => {
                        
                        let regex = /\\begin{center}\\includegraphics\[scale = 0\.5\]{(.*?)}\\end{center}/;

                        return (
                            <>
                                {((question.cau_hoi.trich_doan && question.cau_hoi.exceprtFrom !== undefined && question.cau_hoi.exceprtTo !== undefined) || (question.cau_hoi?.trich_doan?.loai_trich_doan_id === 0)) &&
                                    <>
                                        {(question.cau_hoi?.trich_doan?.loai_trich_doan_id !== 0) &&
                                            <>
                                                <span className="exceprt-label">
                                                    {`${question.cau_hoi?.trich_doan?.loai_trich_doan?.noi_dung} ${question.cau_hoi.exceprtFrom + 1}`} 
                                                    {question.cau_hoi.chuyen_nganh_id === 5 ? ' to ' : ' đến '}   
                                                    {question.cau_hoi.exceprtTo + 1}
                                                </span>
                                            </>
                                        }

                                        <br/>
                                        <div className="answer-content" style={{paddingLeft: '20px'}}>             
                                            <MathJax.Provider>
                                                {question.cau_hoi?.trich_doan?.noi_dung?.split('\n').map((item, index_cauhoi) => {
                                                    return (
                                                        <div className="title-exam-content" key={index_cauhoi}>
                                                            {
                                                                (item.indexOf('includegraphics') !== -1 && item?.match(regex) !== null) ? (
                                                                    <div style={{display: 'flex', justifyContent: 'center', width: '100%'}}><Image src={config.API_URL + `/${item?.match(regex)[1]}`} alt={`img_cauhoi_${index_cauhoi}`}></Image></div>
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
                                                                <div style={{display: 'flex', justifyContent: 'center', width: '100%'}}><Image src={config.API_URL + `/${item?.match(regex)[1]}`} alt={`img_question2_${index_cauhoi}`}></Image></div>
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
                                                                <li className={`item ${isAnswered && isAnswered.dap_an.includes(renderAnswerKey(index)) ? 'active' : ''}`}>
                                                                    <button  style={{width:"100%"}}
                                                                        className="btn-onclick"
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
                                                                        {renderAnswer(question.cau_hoi, answer, index)}
                                                                    </button>
                                                                </li>
                                                            : (question.cau_hoi.loai_cau_hoi === 0) ?
                                                                <li>
                                                                    <Input placeholder='Nhập đáp án' style={{width:"35%", marginTop: 12}} disabled={!isDoing} defaultValue={isAnswered !== undefined ? isAnswered.noi_dung : null}
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
                                                                    className={`btn-DS ${isAnswered && isAnswered.ket_qua_chon[index] === '1' ? 'active' : '' } 
                                                                        ${!isDoing && isCorrectQuestionDungSai(question.cau_hoi, index, true) !== null && !isCorrectQuestionDungSai(question.cau_hoi, index, true)  ? 'incorrect' : ''}
                                                                        ${!isDoing && isCorrectQuestionDungSai(question.cau_hoi, index, true) !== null && isCorrectQuestionDungSai(question.cau_hoi, index, true) ? 'correct' : ''}`
                                                                    }
                                                                    
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
                                                                    className={`btn-DS ${isAnswered && isAnswered.ket_qua_chon[index] === '0' ? 'active' : '' }
                                                                        ${!isDoing && isCorrectQuestionDungSai(question.cau_hoi, index, false) !== null && !isCorrectQuestionDungSai(question.cau_hoi, index, false) ? `incorrect` : ''}
                                                                        ${!isDoing && isCorrectQuestionDungSai(question.cau_hoi, index, false) !== null && isCorrectQuestionDungSai(question.cau_hoi, index, false) ? 'correct' : ''}`
                                                                    }
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
                                            
                                            {help.includes(question.cau_hoi_id) &&(
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
                                                                                <Image src={config.API_URL + `/${item?.match(regex)[1]}`} alt={`img_question4_${index_cauhoi}`}></Image>
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
                    })  
                    }
                    </Col>
                    {isDoing ? renderDoingExamSidebar() : renderHistoryExamSidebar()}
                </Row>
                {isDoing &&
                    <p className="text-center">
                        <button className="btn-onclick submit-exam" onClick={() => submit()}>
                            <b>Nộp bài</b>
                        </button>
                    </p>
                }
            </>
        )
    };

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
                            <h1>{exam.data.ten_de_thi}</h1>
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
        </>
    )
};

export default ExamModuleDetail;