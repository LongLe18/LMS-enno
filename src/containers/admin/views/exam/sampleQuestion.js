import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import './css/ExamDetail.css'
import LoadingCustom from "components/parts/loading/Loading";
import config from '../../../../configs/index';

import { Button, Modal, Pagination, Row, Col, Select, notification } from 'antd';
import MathJax from 'react-mathjax';
import { ExclamationCircleOutlined, } from '@ant-design/icons';
// redux
import { useSelector, useDispatch } from "react-redux";
import * as questionActions from '../../../../redux/actions/question';
import * as examActions from '../../../../redux/actions/exam';
import * as courseActions from '../../../../redux/actions/course';
import * as moduleActions from '../../../../redux/actions/part';
import * as thematicActions from '../../../../redux/actions/thematic';

const { Option } = Select;

const SampleQuestion = (props) => {
    const idExam = useParams().id;
    const dispatch = useDispatch();

    const questions = useSelector(state => state.question.list.result);
    const loading = useSelector(state => state.question.list.loading);
    const error = useSelector(state => state.question.list.error);

    const courses = useSelector(state => state.course.list.result);
    const exam = useSelector(state => state.exam.item.result);
    const exams = useSelector(state => state.exam.list.result);
    const criteria = useSelector(state => state.exam.criteria.result);

    const modules = useSelector(state => state.part.list.result);
    const loadingModules = useSelector(state => state.part.list.loading);

    const thematics = useSelector(state => state.thematic.listbyId.result);
    const loadingThematics = useSelector(state => state.thematic.listbyId.loading);

    const regex = /\\begin{center}\\includegraphics\[scale = 0\.5\]{(.*?)}\\end{center}/;
    const [filter, setFilter] = useState({
        khoa_hoc_id: '',
        mo_dun_id: '',
        chuyen_de_id: '',
        de_thi_id: ''
    });
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        const callback = (res) => {
            // lấy số lượng câu hỏi của đề theo tiêu chí đề  thi thuộc vào
            if (res.status === 'success') {
                if (res.data.loai_de_thi_id === 1) { // loại chuyên đề
                    dispatch(examActions.getThematicCriteria({  idThematic: res.data.chuyen_de_id }));
                }
                else if (res.data.loai_de_thi_id === 2) {
                    dispatch(examActions.getModuleCriteria({  idModule: res.data.mo_dun_id }));
                }
                else if (res.data.loai_de_thi_id === 3) {
                    dispatch(examActions.getSyntheticCriteria({  idCourse: res.data.khoa_hoc_id }));
                } else if (res.data.loai_de_thi_id === 4) {
                    dispatch(examActions.getCriteriaOnlineById({  idCourse: res.data.khoa_hoc_id }));
                } else {
                    dispatch(examActions.getCriteriaDGNLById({ idCourse: res.data.khoa_hoc_id }))
                }
            };
        };

        dispatch(questionActions.getQuestions({ kct_id: '', chuyen_nganh_id: '', pageSize: pageSize, pageIndex: pageIndex }));
        dispatch(examActions.getExam({ id: idExam }, callback));
        dispatch(courseActions.getCourses({ idkct: '', status: 1, search: '' }));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        dispatch(examActions.filterExam({ idCourse: filter.khoa_hoc_id, idModule: filter.mo_dun_id, 
            idThematic: filter.chuyen_de_id, status: '', search: '', 
            start: '', end: '', idType: '', publish: 1 , offset: '', limit: 1000000
        }));
    }, [filter.khoa_hoc_id, filter.mo_dun_id, filter.chuyen_de_id]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        dispatch(questionActions.getQuestions({ kct_id: '', chuyen_nganh_id: '', pageSize: pageSize, pageIndex: pageIndex }));
    }, [pageSize, pageIndex]); // eslint-disable-line react-hooks/exhaustive-deps

    const onChangePageIndex = (page) => {
        setPageIndex(page);
    };
      
    const onShowSizeChange = (current, pageSize) => {
        setPageSize(pageSize);
    };

    const renderCourses = () => {
        let options = [];
        options = courses.data.map((course) => (
            <Option key={course.khoa_hoc_id} value={course.khoa_hoc_id} >{course.ten_khoa_hoc}</Option>
        ));
        return (
            <Select style={{width:"90%"}}
                maxTagCount="responsive"
                defaultValue={''}
                onChange={(value) => {
                    setFilter({...filter, khoa_hoc_id: value})
                    dispatch(moduleActions.getModulesByIdCourse({ idCourse: value }))
                }}
                placeholder="Danh mục khóa"
            >
                <Option key={''} value={''}>Tất cả khóa học</Option>
                {options}
            </Select>
        );
    };

    const renderModules = () => {
        let options = [];
        if (modules.status === 'success') {
            options = modules.data.map((module) => (
                <Option key={module.mo_dun_id} value={module.mo_dun_id} >{module.ten_mo_dun}</Option>
            ))
        }
        return (
            <Select style={{width:"90%"}}
                showSearch={false}
                loading={loadingModules}
                onChange={(mo_dun_id) => {
                    setFilter({...filter, mo_dun_id: mo_dun_id})
                    dispatch(thematicActions.getThematicsByIdModule({ idModule: mo_dun_id }))
                }}
                placeholder="Chọn mô đun"
            >
                <Option key={''} value={''}>Tất cả mô đun</Option>
                {options}
            </Select>
        );
    };

    const renderThematics = () => {
        let options = [];
        if (thematics.status === 'success') {
            options = thematics.data.thematics.map((thematic) => (
                <Option key={thematic.chuyen_de_id} value={thematic.chuyen_de_id} >{thematic.ten_chuyen_de}</Option>
            ))
        }
        return (
            <Select
                showSearch={false}
                loading={loadingThematics}
                onChange={(chuyen_de_id) => {
                    setFilter({...filter, chuyen_de_id: chuyen_de_id});
                }}
                placeholder="Chọn chuyên đề"
            >
                <Option key={''} value={''}>Tất cả chuyên đề</Option>
                {options}
            </Select>
        );
    };

    const renderExams = () => {
        let options = [];
        if (exams.status === 'success') {
            options = exams.data.map((dethi) => (
                <Option key={dethi.de_thi_id} value={dethi.de_thi_id} >{dethi.ten_de_thi}</Option>
            ))
        }
        return (
            <Select
                showSearch={true}
                onChange={(de_thi_id) => {
                    setFilter({...filter, de_thi_id: de_thi_id});
                    dispatch(questionActions.getQuestionsByExam({ idExam: de_thi_id }))
                }}
                placeholder="Chọn đề thi"
                filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
            >
                <Option key={''} value={''}>Tất cả đề thi</Option>
                {options}
            </Select>
        );
    }

    const chooseQuestion = (id) => {
        console.log(criteria.data)
        if (exam.data.cau_hoi_de_this.length === criteria.data.so_cau_hoi) {
            Modal.warning({
                title: 'Thông báo',
                content: 'Bạn đã nhập đủ số lượng câu hỏi.',
            });
            return;
        };
        
        Modal.confirm({
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn có chắc chắn chọn câu hỏi này?',
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            onOk() {
                const callback = (res) => {
                    if (res.status === 200) {
                        dispatch(examActions.getExam({ id: idExam }));
                        notification.success({
                            message: 'Thành công',
                            description: 'Thêm câu hỏi vào đề thi thành công',
                        })
                    } else {
                        notification.error({
                            message: 'Thông báo',
                            description: 'Thêm câu hỏi vào đề thi thất bại',
                        })
                    };
                }
                const questionExam = { cau_hoi_id: id, de_thi_id: idExam }
                dispatch(questionActions.createQuestionExam(questionExam, callback));
            },
        });
    };

    return (
        <>
        <br/>
            <div className="content">
                <Col xl={24} className="body-content mb-2">
                    <Row>
                        <Col xl={24} sm={24} xs={24}>
                        {courses.status === "success" &&
                            <Row>
                                <Col span={24} className="filter-todo">
                                    <Row>
                                        <Col xl={24} sm={8} xs={8}>
                                        <h5>Câu hỏi đề thi </h5>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xl={6} md={24} xs={24}>
                                            {renderCourses()}
                                        </Col>
                                        <Col xl={4} md={6} xs={12}>
                                            {renderModules()}
                                        </Col>
                                        <Col xl={4} md={6} xs={12}>
                                            {renderThematics()}
                                        </Col>
                                        <Col xl={4} md={6} xs={12}>
                                            {renderExams()}
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        }
                        </Col>
                    </Row>
                </Col>
                {exam.status === 'success' && 
                    <Button type="primary" 
                        onClick={() => exam.data.loai_de_thi_id === 5 ? 
                            props.history.push(`/admin/onlineExam/detail/${idExam}`) : 
                            props.history.push(`/admin/exam/detail/${idExam}`)}
                    >
                        Quay lại đề thi
                    </Button>
                }
                {loading && <LoadingCustom/>}
                {questions.status === 'success' && 
                    <>
                        {questions.data.map((question, index) => (
                            <div className="question-items" key={index}>
                                <div
                                    className='item'
                                    onClick={() => chooseQuestion(question.cau_hoi_id)}
                                >
                                    <div className="header-question">
                                        Câu {index + 1} <span className="point">[{question.diem} điểm]</span>
                                    </div>
                                    <div className="body-question">
                                        <div className="answer-detail">
                                            <MathJax.Provider>
                                                {question.noi_dung.split('\n').filter((item) => item !== '').map((item, index_cauhoi) => {
                                                    return (
                                                        <div className="title-exam-content" key={index_cauhoi}>
                                                            {
                                                                (item.indexOf('includegraphics') !== -1 && item?.match(regex) !== null) ? (
                                                                    <img src={config.API_URL + `/${item?.match(regex)[1]}`} alt={`img_cauhoi_${index_cauhoi}`}></img>
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
                                </div>  
                            </div>
                        ))}
                        <Pagination current={pageIndex}
                            onChange={onChangePageIndex} 
                            total={questions.totalCount} 
                            onShowSizeChange={onShowSizeChange} 
                            defaultPageSize={pageSize}
                        />
                    </>
                }
                {error && notification.error({
                    message: 'Thông báo',
                    description: 'Lấy dữ liệu đề thi thất bại',
                })}
            </div>
        </>
    )
};

export default SampleQuestion;