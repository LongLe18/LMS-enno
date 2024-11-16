import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import config from '../../../../configs/index';
import { useParams } from 'react-router-dom';
import './css/ExamDetail2.scss'
import MathJax from 'react-mathjax';

// component
import LoadingCustom from 'components/parts/loading/Loading';
import { Layout, Row, Col, Button, notification, Input, Alert, Image } from 'antd';
import NoRecord from 'components/common/NoRecord';
import { InfoCircleOutlined } from '@ant-design/icons';

// redux
import { useSelector, useDispatch } from 'react-redux';
import * as examActions from '../../../../redux/actions/exam';
import * as answerActions from '../../../../redux/actions/answer';

const { Content } = Layout;
const { TextArea } = Input;

const HistoryExam = () => {
    const params = useParams();
    const dispatch = useDispatch();

    const exam = useSelector(state => state.exam.item.result);
    const examUser = useSelector(state => state.exam.examUser.result);
    const loading = useSelector(state => state.exam.item.loading);
    const error = useSelector(state => state.exam.item.error);

    const [results, setResults] = useState([]);
    const [help, setHelp] = useState([]);

    useEffect(() => {
        dispatch(examActions.getExam({ id: params.idExam }));
        dispatch(examActions.getExamUser({ id: params.idDTHV }, 
            (res) => {
                if (res.status === 'success') {
                    if (res.data.dap_an_da_chons.length > 0) {
                        let temp = [];
                        res.data.dap_an_da_chons.map(item => {
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
                        setResults([...results, ...temp]);
                    }
                }
            }
        ));
        dispatch(answerActions.getAnswersUser({ idDeThi: params.idDTHV, idQuestion: '' }, 
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
                        setResults([...results, ...temp]);
                    };
                }
            }
        ));
    }, [params.idExam]); // eslint-disable-line react-hooks/exhaustive-deps
    
    // Hàm xử lý chuyển đổi từ response BE: đáp án đã chọn -> A/B/C/D hiển thị lên giao diện
    const convertAnswerKey = (question) => {
        let key = '';
        if (examUser.status === 'success') {
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

    const renderHistoryExamSidebar = () => {
        return (
            <Col span={3}>
                {exam.status === 'success' &&
                    <div className="exam-right-content" style={{ position: 'sticky', top: '0px' }}>
                        <div className="exam-right-info">
                            <p className="mg-0 color-blue text-center title-list-q">
                                <b>Câu hỏi</b>
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
    
    const convertAnswer = (answersRight) => {
        let A = '0';
        let B = '0'
        let C = '0'
        let D = '0'
        answersRight.map((answer, index) => {
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
            if (examUser.status === 'success') {
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
                            if (currentSubmitAnswer && question.dap_ans[0].noi_dung_dap_an === (currentSubmitAnswer.noi_dung_tra_loi).toLowerCase()) {
                                isRight = 'right-answer';
                            } else if (currentSubmitAnswer && question.dap_ans[0].noi_dung_dap_an !== (currentSubmitAnswer.noi_dung_tra_loi).toLowerCase()) {
                                isRight = 'wrong-answer';
                            }
                        }
                    }
            }
        }
        return isRight;
    };
    
    const renderAnswer = (question, answer, index) => {
        let regex = /\\begin{center}\\includegraphics\[scale = 0\.5\]{(.*?)}\\end{center}/;
        let isWrong = false;
        let currentSubmitAnswer = results.find((item) => item.cau_hoi_id === question.cau_hoi_id);
        if (currentSubmitAnswer?.gia_tri_dap_an && question?.dap_an_dungs) {
            if (convertAnswer(currentSubmitAnswer?.gia_tri_dap_an)[index] !== convertAnswer(question?.dap_an_dungs)[index]) {
                isWrong = true;  
            }
        }

        return (
            <div className={`answer ${answer.dap_an_dung === true ? 'correct' : ''} ${ (answer.dap_an_dung === false && isWrong) ? 'incorrect' : ''}`}>
                <span className="answer-label">{renderAnswerKey(index)}</span>
                <div className="answer-content">             
                    <MathJax.Provider>
                        {answer.noi_dung_dap_an.split('\n').filter((item) => item !== '').map((item, index_cauhoi) => {
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

    const renderAnswerResult = (question) => {
        if (exam.status === 'success') {
            return (
                <p className="result-exam-item">
                    {question.cau_hoi.loai_cau_hoi ?
                        <span className="right-answer">Đáp án đúng {renderAnswerKey(question.cau_hoi.dap_an_dungs[0])}</span>
                        : <span className="right-answer" dangerouslySetInnerHTML={{ __html: `Đáp án đúng: ${question.cau_hoi.dap_ans[0].noi_dung_dap_an}` }}></span>
                    }
                </p>
            );
        }
    };

    const getAnswerCols = (type) => {
        if (type === 1) return 24;
        else if (type === 2) return 12;
        else if (type === 3) return 8;
        else if (type === 4) return 6;
        else return 24;
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
    
    const renderExam = () => {
        if (error) return <NoRecord subTitle="Không tìm thấy đề thi." />;
        return (
            <Row className="question-content" style={{margin: '0 24px'}} gutter={12}>
                <Col span={21}>
                    {(exam.status === 'success') &&(
                        <div className="history-header">
                            <div className="summury-result">
                                <div className="head-result">
                                    <p className="size-18 color-blue">
                                        <b>
                                        Xem lại toàn bộ đề thi <span>{exam.data.ten_de_thi}</span>
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
                        </div>   
                    )}
                    {exam.status === 'success' && exam.data.cau_hoi_de_this.map((question, ParentIndex) => {
                        let regex = /\\begin{center}\\includegraphics\[scale = 0\.5\]{(.*?)}\\end{center}/;

                        return (
                            <>
                                {((question.cau_hoi.trich_doan && question.cau_hoi.exceprtFrom !== undefined && question.cau_hoi.exceprtTo !== undefined)  || (question.cau_hoi?.trich_doan?.loai_trich_doan_id === 0)) &&
                                    <>
                                        {(question.cau_hoi?.trich_doan?.loai_trich_doan_id !== 0) &&
                                            <>
                                                <span className="exceprt-label">
                                                    {`${question.cau_hoi?.trich_doan?.loai_trich_doan?.noi_dung} ${question.cau_hoi.exceprtFrom + 1}`} 
                                                    {question.cau_hoi.chuyen_nganh_id === 5 ? ' to ' : ' đến '}  
                                                    {question.cau_hoi.exceprtTo + 1}
                                                </span>
                                                <br/>
                                            </>
                                        }
                                        <div className="answer-content" style={{paddingLeft: '20px'}}>             
                                            <MathJax.Provider>
                                                {question.cau_hoi?.trich_doan?.noi_dung?.split('\n').filter((item) => item !== '').map((item, index_cauhoi) => {
                                                    return (
                                                        <div className="title-exam-content" key={index_cauhoi}>
                                                            {
                                                                (item.indexOf('includegraphics') !== -1 && item?.match(regex) !== null) ? (
                                                                    <div style={{display: 'flex', justifyContent: 'center', width: '100%'}}><Image src={config.API_URL + `/${item.match(regex)[1]}`} alt="img"></Image></div>
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
                                            <span className="point">[{question.cau_hoi.diem} điểm]</span>
                                        </b>
                                        <ul className="action-links"></ul>
                                    </div>

                                    <div className="title-exam">
                                        <MathJax.Provider>
                                            {question.cau_hoi.noi_dung.split('\n').filter((item) => item !== '').map((item, index_cauhoi) => {
                                                return (
                                                    <div className="title-exam-content" key={index_cauhoi}>
                                                        {
                                                            (item.indexOf('includegraphics') !== -1 && item?.match(regex) !== null) ? (
                                                                <div style={{display: 'flex', justifyContent: 'center', width: '100%'}}><Image src={config.API_URL + `/${item?.match(regex)[1]}`} alt={`img${index_cauhoi}`}></Image></div>
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
                                        <Row gutter={[20, 10]} className="multi-choice">
                                            {question.cau_hoi.dap_ans.map((answer, index) => {
                                                const isAnswered = results.find((it) => it.cau_hoi_id === question.cau_hoi_id);
                                                return (
                                                    <Col xs={24} sm={24} md={getAnswerCols(question.cau_hoi.cot_tren_hang)} key={index}>
                                                        <ul key={index}>
                                                            {(question.cau_hoi.loai_cau_hoi === 1) ?
                                                                <li className={`item ${isAnswered && isAnswered.dap_an.includes(renderAnswerKey(index)) ? 'active' : ''}`}>
                                                                    <button  style={{width:"100%"}}
                                                                        className="btn-onclick"
                                                                    >
                                                                        {renderAnswer(question.cau_hoi, answer, index)}
                                                                    </button>
                                                                </li>
                                                            : (question.cau_hoi.loai_cau_hoi === 0) ?
                                                                <li>
                                                                    <TextArea placeholder='Nhập đáp án' rows={1} style={{width:"35%", marginTop: 12}} defaultValue={isAnswered !== undefined ? isAnswered.noi_dung : null}/>
                                                                </li>
                                                            :
                                                            <div className='wrongrightAnswer'>
                                                                <button id={`button-Right-${index}`}
                                                                    className={`btn-DS ${isAnswered && isAnswered.ket_qua_chon[index] === '1' ? 'active' : '' } 
                                                                        ${isCorrectQuestionDungSai(question.cau_hoi, index, true) !== null && !isCorrectQuestionDungSai(question.cau_hoi, index, true)  ? 'incorrect' : ''}
                                                                        ${isCorrectQuestionDungSai(question.cau_hoi, index, true) !== null && isCorrectQuestionDungSai(question.cau_hoi, index, true) ? 'correct' : ''}`
                                                                    }
                                                                    
                                                                >
                                                                    <span className="answer-label">Đ</span>
                                                                </button>
                                                                <button id={`button-Wrong-${index}`}
                                                                    className={`btn-DS ${isAnswered && isAnswered.ket_qua_chon[index] === '0' ? 'active' : '' }
                                                                        ${isCorrectQuestionDungSai(question.cau_hoi, index, false) !== null && !isCorrectQuestionDungSai(question.cau_hoi, index, false) ? `incorrect` : ''}
                                                                        ${isCorrectQuestionDungSai(question.cau_hoi, index, false) !== null && isCorrectQuestionDungSai(question.cau_hoi, index, false) ? 'correct' : ''}`
                                                                    }
                                                                >
                                                                    <span className="answer-label">S</span>
                                                                </button>
                                                                <div className="option-answer">
                                                                    <MathJax.Provider>
                                                                        {answer.noi_dung_dap_an.split('\n').filter((item) => item !== '').map((item, index_cauhoi) => {
                                                                            return (
                                                                                <div className="option-answer-content" key={index_cauhoi}>
                                                                                    {
                                                                                        (item.indexOf('includegraphics') !== -1 && item?.match(regex) !== null) ? (
                                                                                            <Image src={config.API_URL + `/${item.match(regex)[1]}`} alt={`img_question3_${index_cauhoi}`}></Image>
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
                                        <div className="question-toggle">
                                        
                                        {help.includes(question.cau_hoi_id) &&(
                                            <Alert
                                                message=""
                                                type="warning"
                                                description={
                                                    <div className="help-answer">
                                                        <MathJax.Provider>
                                                            {question.cau_hoi.loi_giai.split('\n').filter((item) => item !== '').map((item, index_cauhoi) => {
                                                                return (
                                                                    <div className="help-answer-content" key={index_cauhoi}> 
                                                                    {
                                                                        (item.indexOf('includegraphics') !== -1 && item?.match(regex) !== null) ? (
                                                                            <Image src={config.API_URL + `/${item.match(regex)[1]}`} alt={`img${index_cauhoi}`}></Image>
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
                                        </div>
                                    </div>
                                </div>
                            </>
                        )
                    })}
                </Col>
                {renderHistoryExamSidebar()}
            </Row>
        )
    };

    return (
        <>
            {loading && <LoadingCustom/>}
            {(exam.status === 'success' && examUser.status === 'success') && 
                <Layout className={`main-app history-exam`}>
                <Helmet>
                    <title>{exam.data.ten_de_thi}</title>
                </Helmet>
                <Content className="app-content">
                    <div className="header-exam">
                        <h1>{exam.data.ten_de_thi}</h1>
                    </div>
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

export default HistoryExam;