import React, { useEffect, useState } from 'react';
import LoadingCustom from 'components/parts/loading/Loading';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import axios from 'axios';
import config from '../../../../configs/index';

import { Row, Col, Table, Pagination, Space, Button, notification, 
    Form, Modal, Select, InputNumber, Input, Tabs } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

// redux
import * as evaluationAction from '../../../../redux/actions/evaluate';
import * as examActions from '../../../../redux/actions/exam';
import * as courseActions from '../../../../redux/actions/course';
import { useSelector, useDispatch } from "react-redux"; 

const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

const EvaluationPage = () => {
    const dataEvaluations = [];
    const dataEvaluationsDGNL = [];
    const [formEvaluation] = Form.useForm();

    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [idExam, setIdExam] = useState('');
    const [idEvaluation, setIdEvaluation] = useState('');
    const [numberSection, setNumberSection] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [state, setState] = useState({
        activeTab: '0',
        idCourse: '',
    });
    const dispatch = useDispatch();

    const evaluations = useSelector(state => state.evaluate.list.result);
    const evaluationsDGNL = useSelector(state => state.evaluate.listDGNL.result);
    const exams = useSelector(state => state.exam.list.result);
    const courses = useSelector(state => state.course.list.result);
    const loadingExams = useSelector(state => state.exam.list.loading);
    const loading = useSelector(state => state.evaluate.list.loading);

    // request API khi khởi tạo trang
    useEffect(() => {
        // request Danh sách đề thi 
        dispatch(examActions.filterExam({ idCourse: '', idModule: '', idThematic: '', status: '', search: '', 
            start: '', end: '', idType: 4, publish: 1, offset: '', limit: 1000000 }));
        // request danh sách khóa học
        dispatch(courseActions.getCourses({ idkct: '', status: '', search: '' }));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        switch (state.activeTab) {
            case '0': /// Tabs đánh giá
                dispatch(evaluationAction.getEVALUATEs({ id: idExam, pageIndex: pageIndex, pageSize: pageSize}));
                break;
            case '1': // Tabs Đánh giá ĐGNL
                dispatch(evaluationAction.getEVALUATEsDGNL({ idCourse: state.idCourse, pageIndex: pageIndex, pageSize: pageSize}));
                break;
            default:
                break;
        }
    }, [pageIndex, pageSize, idExam, state.activeTab, state.idCourse]); // eslint-disable-line react-hooks/exhaustive-deps

    if (evaluations.status === 'success' ) {    
        evaluations.data.map((item, index) => dataEvaluations.push({...item, 'key': index}));
    };
    
    if (evaluationsDGNL.status === 'success' ) {    
        evaluationsDGNL.data.map((item, index) => dataEvaluationsDGNL.push({...item, 'key': index}));
    };

    // event show modal
    const showModal = () => {
        setIsModalVisible(true);
    };

    // event destroy modal
    const handleCancel = () => {
        setIdEvaluation('');
        setIsModalVisible(false);
    };
    
    // event submit form add / edit
    const submitForm = (values) => {
        const callback = (res) => {
            if (res.status === 200 && res.statusText === 'OK') {
                formEvaluation.resetFields();
                if (state.activeTab === '0') dispatch(evaluationAction.getEVALUATEs({ id: idExam, pageIndex: pageIndex, pageSize: pageSize}));
                else if (state.activeTab === '1') dispatch(evaluationAction.getEVALUATEsDGNL({ idCourse: state.idCourse, pageIndex: pageIndex, pageSize: pageSize}));
                if (idEvaluation === '') {
                    notification.success({
                        message: 'Thành công',
                        description: 'Thêm đánh giá mới thành công',
                    })
                } else {
                    notification.success({
                        message: 'Thành công',
                        description: 'Sửa thông tin đánh giá thành công',
                    })
                }
                setIsModalVisible(false);
                setIdEvaluation('');
            } else {
                if (idEvaluation === '') {
                    notification.error({
                        message: 'Thông báo',
                        description: 'Thêm mới đánh giá thất bại' + res.response.data.message,
                    })
                } else {
                    notification.error({
                        message: 'Thông báo',
                        description: 'Sửa thông tin đánh giá thất bại',
                    })
                }
            }
        };

        if (idEvaluation === '') {
            if (state.activeTab === '0') dispatch(evaluationAction.CreateEVALUATE(values, callback));
            else dispatch(evaluationAction.CreateEvaluationDGNL(values, callback));
        } else {
            if (state.activeTab === '0') dispatch(evaluationAction.EditEVALUATE({ id: idEvaluation, formData: values}, callback));
            else dispatch(evaluationAction.EditEvaluationDGNL({ id: idEvaluation, formData: values}, callback));
        }   
    }
    
    // lấy số phần thi theo đề thi
    const getNumberSectionsExam = (idExam) => {
        axios.get(config.API_URL + `/exam/${idExam}/criteria`, {headers: {Authorization: `Bearer ${localStorage.getItem('userToken')}`}})
        .then(
            res => {
                if (res.status === 200 && res.statusText === 'OK') {
                    setNumberSection(res.data?.data?.so_phan)
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

    const renderExams = (onChange = false) => {
        let options = [];
        if (exams.status === 'success') {
            options = exams.data.map((exam) => (
                <Option key={exam.de_thi_id} value={exam.de_thi_id} >{exam.ten_de_thi}</Option>
            ))
        }
        return (
            <Select style={{width: '100%'}}
                showSearch
                allowClear
                filterOption={(input, option) =>
                    (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                }
                loading={loadingExams}
                onChange={(value) => {
                    if (onChange) {
                        if (value === undefined || value === null) value = '';
                        setIdExam(value)
                    }
                    getNumberSectionsExam(value);
                }}
                placeholder="Chọn đề thi"
            >
                {options}
            </Select>
        );
    };

    // render dữ liệu khóa học
    const renderCourses = () => {
        let options = [];
        if (courses.status === 'success') {
            options = courses.data.filter((item) => item.loai_kct === 0).map((course) => (
                <Option key={course.khoa_hoc_id} value={course.khoa_hoc_id} >{course.ten_khoa_hoc}</Option>
            ))
        }
        return (
            <Select style={{width: '100%'}}
                showSearch
                allowClear
                filterOption={(input, option) =>
                    (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                }
                value={state.courseId}
                onChange={(khoa_hoc_id) => {
                    // request api theo khoa_hoc_id
                    if (khoa_hoc_id === undefined) setState({ ...state, idCourse: '' })
                    else setState({ ...state, idCourse: khoa_hoc_id })
                }}
                placeholder="Chọn khóa học"
            >
                {options}
            </Select>
        );
    };

    // Phần đánh giá cho ĐGNL
    const renderSectionEvaluation = () => {
        const sections = [{
            value: 1,
            label: 'Phần 1',
        }, {
            value: 2,
            label: 'Phần 2',
        }, {
            value: 31,
            label: 'Phần Tiếng Anh (Phần 3)',
        }, {
            value: 32,
            label: 'Phần Khoa học (Phần 3)',
        }]
        let options = sections.map((section) => (
            <Option key={section.value} value={section.value} >{section.label}</Option>
        ))
        return (
            <Select style={{width: '100%'}}
                placeholder="Chọn phần đánh giá"
            >
                {options}
            </Select>
        );
    };

    // modal content
    const renderModal = () => {
        if (state.activeTab === '0') {
            return (
                <Row>
                    <Col xl={24} sm={24} xs={24} className="cate-form-block">
                        {(idEvaluation === '') ? <h5>Thêm mới đánh giá</h5> : <h5>Sửa thông tin đánh giá</h5>}
                        <Form layout="vertical" className="category-form" form={formEvaluation} autoComplete="off" onFinish={submitForm}>
                            <Row gutter={25}>
                                <Col xl={24} sm={24} xs={24} style={{marginBottom: 12}}>
                                    Số phần thi: {numberSection}
                                </Col>
                                <Col xl={24} sm={24} xs={24}>
                                    <Form.Item
                                        className="input-col"
                                        label="Tên đề thi"
                                        name="de_thi_id"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Tên đề thi là trường bắt buộc.',
                                            },
                                        ]}
                                    >
                                        {renderExams()}
                                    </Form.Item>
                                </Col>
                                <Col xl={24} sm={24} xs={24} className="left-content">
                                    <Form.Item
                                        className="input-col"
                                        label="Phần thi"
                                        name="phan_thi"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Phần thi là trường bắt buộc.',
                                            },
                                        ]}
                                    >
                                        <InputNumber placeholder="Nhập phần thi" style={{width: "100%"}}/>
                                    </Form.Item>
                                    <Form.Item
                                        className="input-col"
                                        label="Câu bắt đầu"
                                        name="cau_bat_dau"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Câu bắt đầu là trường bắt buộc.',
                                            },
                                        ]}
                                    >
                                        <InputNumber placeholder="Nhập số câu bắt đầu" style={{width: "100%"}}/>
                                    </Form.Item>
                                </Col>
                                <Col xl={24} sm={24} xs={24} className="right-content">
                                    <Form.Item
                                        className="input-col"
                                        label="Câu kết thúc"
                                        name="cau_ket_thuc"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Câu kết thúc là trường bắt buộc.',
                                            },
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    if (!value || getFieldValue('cau_bat_dau') <= value) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject(new Error('Câu kết thúc phải lớn hơn hoặc bằng câu bắt đầu!'));
                                                },
                                            }),
                                        ]}
                                    >
                                        <InputNumber placeholder="Nhập số câu kết thúc" style={{width: "100%"}}/>
                                    </Form.Item>
                                    <Form.Item
                                        className="input-col"
                                        label="Đánh giá"
                                        name="danh_gia"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Đánh giá là trường bắt buộc.',
                                            },
                                        ]}
                                    >
                                        <TextArea rows={4} placeholder="Nhập nội dung đánh giá" style={{width: "100%"}}/>
                                    </Form.Item>
                                    
                                </Col>
                                <Form.Item className="button-col" style={{textAlign: 'right'}}>
                                    {idEvaluation === '' ? <Button shape="round" type="primary" htmlType="submit" >Thêm mới</Button> : <Button shape="round" type="primary" htmlType="submit" >Cập nhật</Button>}                             
                                </Form.Item>
                            </Row>                                     
                        </Form>
                    </Col>
                </Row>
            )
        } else if (state.activeTab === '1') {
            return (
                <Row>
                    <Col xl={24} sm={24} xs={24} className="cate-form-block">
                        {(idEvaluation === '') ? <h5>Thêm mới đánh giá</h5> : <h5>Sửa thông tin đánh giá</h5>}
                        <Form layout="vertical" className="category-form" form={formEvaluation} autoComplete="off" onFinish={submitForm}>
                            <Row gutter={25}>
                                <Col xl={24} sm={24} xs={24}>
                                    <Form.Item
                                        className="input-col"
                                        label="Khóa học"
                                        name="khoa_hoc_id"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Khóa học là trường bắt buộc.',
                                            },
                                        ]}
                                    >
                                        {renderCourses()}
                                    </Form.Item>
                                </Col>
                                <Col xl={24} sm={24} xs={24} className="left-content">
                                    <Form.Item
                                        className="input-col"
                                        label="Phần đánh giá"
                                        name="phan_thi"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Phần thi là trường bắt buộc.',
                                            },
                                        ]}
                                    >
                                        {renderSectionEvaluation()}
                                    </Form.Item>
                                    <Form.Item
                                        className="input-col"
                                        label="Điểm bắt đầu"
                                        name="cau_bat_dau"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Điểm bắt đầu là trường bắt buộc.',
                                            },
                                        ]}
                                    >
                                        <InputNumber placeholder="Nhập số điểm bắt đầu" style={{width: "100%"}}/>
                                    </Form.Item>
                                </Col>
                                <Col xl={24} sm={24} xs={24} className="right-content">
                                    <Form.Item
                                        className="input-col"
                                        label="Điểm kết thúc"
                                        name="cau_ket_thuc"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Điểm kết thúc là trường bắt buộc.',
                                            },
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    if (!value || getFieldValue('cau_bat_dau') <= value) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject(new Error('Điểm kết thúc phải lớn hơn hoặc bằng điểm bắt đầu!'));
                                                },
                                            }),
                                        ]}
                                    >
                                        <InputNumber placeholder="Nhập điểm câu kết thúc" style={{width: "100%"}}/>
                                    </Form.Item>
                                    <Form.Item
                                        className="input-col"
                                        label="Đánh giá"
                                        name="danh_gia"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Đánh giá là trường bắt buộc.',
                                            },
                                        ]}
                                    >
                                        <TextArea rows={4} placeholder="Nhập nội dung đánh giá" style={{width: "100%"}}/>
                                    </Form.Item>
                                    
                                </Col>
                                <Form.Item className="button-col" style={{textAlign: 'right'}}>
                                    {idEvaluation === '' ? <Button shape="round" type="primary" htmlType="submit" >Thêm mới</Button> : <Button shape="round" type="primary" htmlType="submit" >Cập nhật</Button>}                             
                                </Form.Item>
                            </Row>                                     
                        </Form>
                    </Col>
                </Row>
            )
        }
    }

    const EditEvaluation = (danh_gia_id) => {
        const callback = (res) => {
            if (res.status === 'success') {
                setIsModalVisible(true);
                formEvaluation.setFieldsValue(res.data);
            }
        }
        setIdEvaluation(danh_gia_id);
        if (state.activeTab === '0') {
            dispatch(evaluationAction.getEVALUATE({ id: danh_gia_id }, callback));
        } else {
            dispatch(evaluationAction.getEvaluationDGNL({ id: danh_gia_id }, callback));
        }
    }
    
    const DeleteEvaluation = (danh_gia_id) => {
        Modal.confirm({
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn có chắc chắn muốn xóa đánh giá này?',
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            onOk() {
                const callback = (res) => {
                    if (res.statusText === 'OK' && res.status === 200) {
                        if (state.activeTab === '0') dispatch(evaluationAction.getEVALUATEs({ id: idExam, pageIndex: pageIndex, pageSize: pageSize}));         
                        else if (state.activeTab === '1') dispatch(evaluationAction.getEVALUATEsDGNL({ idCourse: state.idCourse, pageIndex: pageIndex, pageSize: pageSize}));
                        notification.success({
                            message: 'Thành công',
                            description: 'Xóa đánh giá thành công',
                        })
                    } else {
                        notification.error({
                            message: 'Thông báo',
                            description: 'Xóa đánh giá mới thất bại',
                        })
                    };
                }
                if (state.activeTab === '0') dispatch(evaluationAction.DeleteEVALUATE({ id: danh_gia_id }, callback))
                else if (state.activeTab === '1') dispatch(evaluationAction.DeleteEvaluationDGNL({ id: danh_gia_id }, callback))
            },
        });
    }

    // event đổi pageSize
    const onShowSizeChange = (current, pageSize) => {
        setPageSize(pageSize)
    };

    // event đổi pageIndex
    const onChange = page => {
        setPageIndex(page);
    };

    const columns = [
        {
          title: 'Tên đề thi',
          dataIndex: 'ten_de_thi',
          key: 'ten_de_thi',
          responsive: ['md'],
          sorter: (a, b) => a.ten_de_thi.localeCompare(b.ten_de_thi),
          render: (ten_de_thi, de_thi) => (
            de_thi?.de_thi?.ten_de_thi
          ),
        },
        {
            title: 'Phần thi',
            dataIndex: 'phan_thi',
            key: 'phan_thi',
            responsive: ['md'],
        },
        {
            title: 'Số câu bắt đầu',
            dataIndex: 'cau_bat_dau',
            key: 'cau_bat_dau',
            responsive: ['md'],
        },
        {
          title: 'Số câu kết thúc',
          dataIndex: 'cau_ket_thuc',
          key: 'cau_ket_thuc',
          responsive: ['md'],
        },
        {
          title: 'Nội dung đánh giá',
          dataIndex: 'danh_gia',
          key: 'danh_gia',
          responsive: ['md'],
        },
        {
          title: 'Thời gian cập nhật',
          dataIndex: 'ngay_sua',
          key: 'ngay_sua',
          responsive: ['md'],
          render: (date) => (
            moment(date).utc(7).format(config.DATE_FORMAT)
          ),
          sorter: (a, b) => moment(a.ngay_sua).unix() - moment(b.ngay_sua).unix()
        },     
        {
            title: 'Tùy chọn',
            key: 'danh_gia_id',
            dataIndex: 'danh_gia_id',
            // Redirect view for edit
            render: (danh_gia_id) => (
                <Space size="middle">
                    <Button  type="button" onClick={() => EditEvaluation(danh_gia_id)} className="ant-btn ant-btn-round ant-btn-primary">Sửa</Button>
                    <Button shape="round" type="danger" onClick={() => DeleteEvaluation(danh_gia_id)} >Xóa</Button> 
                </Space>
            ),
        },
    ];

    const columnsDGNL = [
        {
            title: 'Khóa học',
            dataIndex: 'ten_khoa_hoc',
            key: 'ten_khoa_hoc',
            responsive: ['md'],
            render: (ten_khoa_hoc, danh_gia) => (
                danh_gia?.khoa_hoc?.ten_khoa_hoc
            ),
        },
        {
            title: 'Phần đánh giá',
            dataIndex: 'phan_thi',
            key: 'phan_thi',
            responsive: ['md'],
            render: (phan_thi) => (
                phan_thi === 1 ? 'Phần 1' : phan_thi === 2 ? 'Phần 2' : phan_thi === 32 ? 'Phần 3: Khoa học' : phan_thi === 31 && 'Phần 3: Tiếng Anh'
            ),
        },
        {
            title: 'Điểm bắt đầu',
            dataIndex: 'cau_bat_dau',
            key: 'cau_bat_dau',
            responsive: ['md'],
        },
        {
            title: 'Điểm kết thúc',
            dataIndex: 'cau_ket_thuc',
            key: 'cau_ket_thuc',
            responsive: ['md'],
        },
        {
            title: 'Nội dung đánh giá',
            dataIndex: 'danh_gia',
            key: 'danh_gia',
            responsive: ['md'],
        },
        {
            title: 'Thời gian cập nhật',
            dataIndex: 'ngay_sua',
            key: 'ngay_sua',
            responsive: ['md'],
            render: (date) => (
                moment(date).utc(7).format(config.DATE_FORMAT)
            ),
            sorter: (a, b) => moment(a.ngay_sua).unix() - moment(b.ngay_sua).unix()
        },     
        {
            title: 'Tùy chọn',
            key: 'danh_gia_dgnl_id',
            dataIndex: 'danh_gia_dgnl_id',
            // Redirect view for edit
            render: (danh_gia_dgnl_id) => (
                <Space size="middle">
                    <Button  type="button" onClick={() => EditEvaluation(danh_gia_dgnl_id)} className="ant-btn ant-btn-round ant-btn-primary">Sửa</Button>
                    <Button shape="round" type="danger" onClick={() => DeleteEvaluation(danh_gia_dgnl_id)} >Xóa</Button> 
                </Space>
            ),
        },
    ];
    
    // event đổi tab
    const onChangeTab = (value) => {
        setPageIndex(1);
        setState({...state, activeTab: value});
    };

    return (
        <>
            {loading && <LoadingCustom />}
            <div className='content'>
                <Helmet>
                    <title>Quản lý đánh giá đề thi</title>
                </Helmet>
                <Row className="app-main"><h5>Quản lý đánh giá đề thi</h5></Row>

                <Tabs defaultActiveKey={state.activeTab} activeKey={state.activeTab} onChange={onChangeTab}>
                    <TabPane tab="Đánh giá đề thi" key="0">
                        <Row cclassName="select-action-group" gutter={[8, 8]}>
                            <Col xl={12} sm={12} xs={24}>
                                {renderExams(true)}
                            </Col>
                            <Col xl={12} sm={12} xs={24} className="right-actions">
                                <Button shape="round" type="primary" icon={<PlusOutlined />} className=" btn-action" onClick={() => {
                                    showModal();
                                    formEvaluation.resetFields();
                                }}>
                                    Thêm mới đánh giá
                                </Button>
                            </Col>
                        </Row>

                        {(evaluations.status === 'success') &&
                            <>
                                <Table className="table-striped-rows" columns={columns} dataSource={dataEvaluations} pagination={false}/>
                                <Pagination style={{marginTop: 12}}
                                    showSizeChanger
                                    onShowSizeChange={onShowSizeChange}
                                    onChange={onChange}
                                    defaultCurrent={pageIndex}
                                    total={evaluations?.totalCount}
                                />
                            </>
                        }
                    </TabPane>
                    <TabPane tab="Đánh giá đề thi ĐGNL" key="1">
                        <Row cclassName="select-action-group" gutter={[8, 8]}>
                            <Col xl={12} sm={12} xs={24}>
                                {renderCourses()}
                            </Col>
                            <Col xl={12} sm={12} xs={24} className="right-actions">
                                <Button shape="round" type="primary" icon={<PlusOutlined />} className=" btn-action" onClick={() => {
                                    showModal();
                                    formEvaluation.resetFields();
                                }}>
                                    Thêm mới đánh giá
                                </Button>
                            </Col>
                        </Row>
                        {(evaluationsDGNL.status === 'success') &&
                            <>
                                <Table className="table-striped-rows" columns={columnsDGNL} dataSource={dataEvaluationsDGNL} pagination={false}/>
                                <Pagination style={{marginTop: 12}}
                                    showSizeChanger
                                    onShowSizeChange={onShowSizeChange}
                                    onChange={onChange}
                                    defaultCurrent={pageIndex}
                                    total={evaluationsDGNL?.totalCount}
                                />
                            </>
                        }
                    </TabPane>
                </Tabs>

                
            </div>

            <Modal visible={isModalVisible}  mask={true} centered={true} className="cra-exam-modal" wrapClassName="cra-exam-modal-container"
                onCancel={handleCancel}
                maskStyle={{ background: 'rgba(0, 0, 0, 0.8)' }}
                maskClosable={false}
                width={600}
                footer={null}
            >
                {renderModal()}
            </Modal>
        </>
    )
}

export default EvaluationPage;