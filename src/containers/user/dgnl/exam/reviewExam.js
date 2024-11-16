import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import config from '../../../../configs/index';
import Hashids from 'hashids';
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

const { Content } = Layout;
const { TextArea } = Input;

const ReviewExamPage = () => {
    const idExam = useParams().id;
    const dispatch = useDispatch();
    const hashids = new Hashids();

    const exam = useSelector(state => state.exam.item.result);
    const loading = useSelector(state => state.exam.item.loading);
    const error = useSelector(state => state.exam.item.error);

    const [results, setResults] = useState([]);
    const [help, setHelp] = useState([]);
    const [isFullscreen, setIsFullscreen] = useState(false)

    useEffect(() => {
        dispatch(examActions.getExam({ id: hashids.decode(idExam) }))
    }, [idExam]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement)
        }
    
        document.addEventListener('fullscreenchange', handleFullscreenChange)
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }, []);
    
    const enterFullscreen = () => {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen()
        }
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
                                        <li key={index + 1} className='right-answer'>
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
        else if (index === 0) return 'A';
        else return '';
    };
    
    const renderAnswer = (question, answer, index) => {
        let regex = /\\begin{center}\\includegraphics\[scale = 0\.5\]{(.*?)}\\end{center}/;
        return (
            <div className={`answer ${answer.dap_an_dung === true ? 'correct' : ''} `}>
                <span className="answer-label">{renderAnswerKey(index)}</span>
                <div className="answer-content">             
                    <MathJax.Provider>
                        {answer.noi_dung_dap_an.split('\n').filter((item) => item !== '').map((item, index_cauhoi) => {
                            return (
                                <div className="help-answer-content" key={index_cauhoi}> 
                                {
                                    (item.indexOf('includegraphics') !== -1 && item?.match(regex) !== null) ? (
                                        <Image src={config.API_URL + `/${item?.match(regex)[1]}`} alt={`img_answer_question_${index_cauhoi}`}></Image>
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
                    {(question.cau_hoi.loai_cau_hoi === 1 || question.cau_hoi.loai_cau_hoi === 2) ?
                        <span className="right-answer">Đáp án đúng {question.cau_hoi.dap_an_dungs?.map((item) => renderAnswerKey(item)).join(', ')}</span>
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
    
    const calSum = () => {
        let sum = 0;
        if (exam.status === 'success') {
            exam.data.cau_hoi_de_this.map((question, index) => {
                sum += parseInt(question.cau_hoi.diem);
                return null;
            });
        }
        return sum;
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

    const isCorrectQuestionDungSai = (question, index, boolCheck) => {
        // return true / false
        // boolCheck: true => Lựa chọn option đúng
        // boolCheck: false => Lựa chọn option sai

        if (question?.dap_an_dungs) {
            if (boolCheck) {
                if (convertAnswer(question?.dap_an_dungs)[index] === '1') return true;
                return false;
            } else {
                return convertAnswer(question?.dap_an_dungs)[index] === '0';
            }
        }
    }

    const renderExam = () => {
        if (error) return <NoRecord subTitle="Không tìm thấy đề thi." />;
        return (
            <Row className="question-content" style={{margin: '0 48px'}}>
                <Col span={21} style={{paddingRight: 12}}>
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
                                        <b className="point font-weight-5">{calSum()}</b>
                                        </p>
                                    </div>
                                    <div className="total_point">
                                        <p className='font-weight-5'>
                                            Thời gian làm:{' '}
                                            <b>
                                                {exam.data.thoi_gian} phút
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
                                {((question.cau_hoi.trich_doan && question.cau_hoi.exceprtFrom !== undefined && question.cau_hoi.exceprtTo !== undefined) || (question.cau_hoi?.trich_doan?.loai_trich_doan_id === 0)) &&
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
                                        <div className="answer-content" style={{paddingLeft: '0px'}}>             
                                            <MathJax.Provider>
                                                {question.cau_hoi?.trich_doan?.noi_dung?.split('\n').filter((item) => item !== '').map((item, index_cauhoi) => {
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
                                            {question.cau_hoi.noi_dung.split('\n').filter((item) => item !== '').map((item, index_cauhoi) => {
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

                                    <div className="content-answer-question">
                                        <Row gutter={[20, 10]} className="multi-choice">
                                            {question.cau_hoi.dap_ans.map((answer, index) => {
                                                const isAnswered = results.find((it) => it.cau_hoi_id === question.cau_hoi_id);
                                                return (
                                                    <Col xs={24} sm={24} md={getAnswerCols(question.cau_hoi.cot_tren_hang)} key={index}>
                                                        <ul key={index}>
                                                            <li className={`item ${isAnswered && isAnswered.dap_an === renderAnswerKey(index) ? 'active' : ''}`}>
                                                                {(question.cau_hoi.loai_cau_hoi === 1) ?
                                                                    <button  style={{width:"100%"}}
                                                                        className="btn-onclick"
                                                                    >
                                                                        {renderAnswer(question.cau_hoi, answer, index)}
                                                                    </button>
                                                                : (question.cau_hoi.loai_cau_hoi === 0) ?
                                                                    <button  style={{width:"100%"}}
                                                                        className="btn-onclick"
                                                                    >
                                                                        <TextArea rows={4} style={{width:"100%"}} onChange={(e) => {
                                                                            const isAswered = results.find((item) => item.cau_hoi_id === question.cau_hoi_id);
                                                                            if (isAswered) {
                                                                                const newAnsers = results.map((item) => (item.cau_hoi_id === question.cau_hoi_id ? { ...item, noi_dung: e.target.value, gia_tri_dap_an: e.target.value, loai_dap_an: false } : item));
                                                                                setResults(newAnsers);
                                                                            } else {
                                                                                setResults([...results, { cau_hoi_id: question.cau_hoi_id, noi_dung: e.target.value, gia_tri_dap_an: e.target.value, loai_dap_an: false }]);
                                                                            }
                                                                        }}/>
                                                                    </button>
                                                                :
                                                                    <div className='wrongrightAnswer'>
                                                                        <button id={`button-Right-${index}`}
                                                                            className={`btn-DS ${isAnswered && isAnswered.ket_qua_chon[index] === '1' ? 'active' : '' } 
                                                                                ${!isCorrectQuestionDungSai(question.cau_hoi, index, true)  ? 'no-thing' : ''}
                                                                                ${isCorrectQuestionDungSai(question.cau_hoi, index, true) ? 'correct' : ''}`
                                                                            }
                                                                        >
                                                                            <span style={{color: 'white'}}>Đ</span>
                                                                        </button>
                                                                        <button id={`button-Wrong-${index}`}
                                                                            className={`btn-DS ${isAnswered && isAnswered.ket_qua_chon[index] === '0' ? 'active' : '' }
                                                                                ${!isCorrectQuestionDungSai(question.cau_hoi, index, false) ? `no-thing` : ''}
                                                                                ${isCorrectQuestionDungSai(question.cau_hoi, index, false) ? 'correct' : ''}`
                                                                            }
                                                                        >
                                                                            <span style={{color: 'white'}}>S</span>
                                                                        </button>
                                                                        <div className="option-answer">
                                                                            <MathJax.Provider>
                                                                                {answer.noi_dung_dap_an.split('\n').filter((item) => item !== '').map((item, index_cauhoi) => {
                                                                                    return (
                                                                                        <div className="option-answer-content" key={index_cauhoi}>
                                                                                            {
                                                                                                (item.indexOf('includegraphics') !== -1 && item?.match(regex) !== null) ? (
                                                                                                    <Image src={config.API_URL + `/${item?.match(regex)[1]}`} alt={`img_cauhoi_${index_cauhoi}`}></Image>
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
                                                            </li>
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
                                                                            <Image src={config.API_URL + `/${item?.match(regex)[1]}`} alt={`img_answer_question_${index_cauhoi}`}></Image>
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
            {loading && <LoadingCustom/>}
            {exam.status === 'success' && 
                <Layout className={`main-app history-exam`} >
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
}

export default ReviewExamPage;