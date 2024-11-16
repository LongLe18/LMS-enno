import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';

// component
import { Row, Col, Table, notification, Button, Space, Form, InputNumber, Select, Modal, Tabs, Pagination } from 'antd';
import LoadingCustom from 'components/parts/loading/Loading';
import AppFilter from 'components/common/AppFilter';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
// redux
import * as criteriaAction from '../../../../redux/actions/criteria';
import * as courseAction from '../../../../redux/actions/course';
import * as moduleAction from '../../../../redux/actions/part';
import * as thematicAction from '../../../../redux/actions/thematic';
import { useSelector, useDispatch } from "react-redux"; 
import axios from 'axios';
import config from '../../../../configs/index';

const { Option } = Select;
const { confirm } = Modal;
const { TabPane } = Tabs;

const Criteria = () => {
    const [form] = Form.useForm();
    const [formOnline] = Form.useForm();
    const [formDGNL] = Form.useForm();
    const dataCriteriaCourse = [];
    const dataCriteriaModule = [];
    const dataCriteriaThematic = [];
    const dataCriteriaOnline = [];
    const dataCriteriaDGNL = [];
    const dispatch = useDispatch();

    const [numberExams, setNumberOfItems] = useState(4);
    const [course, setCourse] = useState(false);
    const [module, setModule] = useState(false);
    const [thematic, setThematic] = useState(false);
    const [isPublish, setIsPublish] = useState(false);
    const [require, setRequire] = useState({
        isEdit: false,
        course: false,
        module: false,
        thematic: false,
    });
    const [state, setState] = useState({
        khoa_hoc_id: '',
        mo_dun_id: '',
        idCriteria: '',
        activeTab: '1'
    });
    const [filter, setFilter] = useState({
        khoa_hoc_id: '',
    });
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalVisibleOnline, setIsModalVisibleOnline] = useState(false);
    const [isModalVisibleDGNL, setIsModalVisibleDGNL] = useState(false);
    const [pageSize, setPageSize] = useState(10);
    const [pageIndex, setPageIndex] = useState(1);

    const handleNumberExamChange = (value) => {
        setNumberOfItems(value);
      };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };
    
    const handleCancel = () => {
        setIsModalVisible(false);
        setIsPublish(false);
    };

    const showModalOnline = () => {
        setIsModalVisibleOnline(true);
    };

    const showModalDGNL = () => {
        setIsModalVisibleDGNL(true);
    };

    const handleOkOnline = () => {
        setIsModalVisibleOnline(false);
    };
    
    const handleCancelOnline = () => {
        setIsModalVisibleOnline(false);
        setIsPublish(false);
    };

    const handleOkDGNL = () => {
        setIsModalVisibleDGNL(false);
    };
    
    const handleCancelDGNL = () => {
        setIsModalVisibleDGNL(false);
        setIsPublish(false);
    };

    const criteriaCourse = useSelector(state => state.criteria.listCourse.result);
    const loadingCourse = useSelector(state => state.criteria.listCourse.loading);

    const criteriaModule = useSelector(state => state.criteria.listModule.result);
    const loadingModule = useSelector(state => state.criteria.listModule.loading);

    const criteriaThematic = useSelector(state => state.criteria.listThematic.result);
    const loadingThematic = useSelector(state => state.criteria.listThematic.loading);

    const criteriaOnline = useSelector(state => state.criteria.listOnline.result);
    const loadingOnline = useSelector(state => state.criteria.listOnline.loading);

    const criteriaDGNL = useSelector(state => state.criteria.listDGNL.result);
    const loadingDGNL = useSelector(state => state.criteria.listDGNL.loading);

    const courses = useSelector(state => state.course.list.result);
    const loadingcourses = useSelector(state => state.course.list.loading);
    const modules = useSelector(state => state.part.list.result);
    const loadingmodules = useSelector(state => state.part.list.loading);
    // const thematics = useSelector(state => state.thematic.listbyId.result);
    // const loadingthematics = useSelector(state => state.thematic.listbyId.loading);

    useEffect(() => {
        dispatch(criteriaAction.getCriteriasCourse({ khoa_hoc_id: filter.khoa_hoc_id, pageSize: pageSize, pageIndex: pageIndex }));
        dispatch(courseAction.getCourses({ idkct: '', status: '', search: '' }));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const columns = [
        {
            title: 'Tên khóa học',
            dataIndex: 'ten_khoa_hoc',
            key: 'ten_khoa_hoc',
            responsive: ['md'],
            render: (tcdth_khoa_hoc_id, tieu_chi) => (
                <>{tieu_chi.khoa_hoc?.ten_khoa_hoc}</>
            ),
        },
        {
            title: 'Số câu hỏi',
            dataIndex: 'so_cau_hoi',
            key: 'so_cau_hoi',
            responsive: ['md'],
        },
        {
            title: 'Thời gian thi',
            dataIndex: 'thoi_gian',
            key: 'thoi_gian',
            responsive: ['md'],
        },
        {
            title: 'Yêu cầu',
            dataIndex: 'yeu_cau',
            key: 'yeu_cau',
            responsive: ['md'],
        },
        {
            title: 'Số lần thi',
            dataIndex: 'so_lan_thi',
            key: 'so_lan_thi',
            responsive: ['md'],
        },
        {
            title: 'Tùy chọn',
            key: 'tcdth_khoa_hoc_id',
            dataIndex: 'tcdth_khoa_hoc_id',
            // Redirect view for edit
            render: (tcdth_khoa_hoc_id) => (
                <Space size="middle">
                <Button  type="button" onClick={() => EditCriteriaCourse(tcdth_khoa_hoc_id)} className="ant-btn ant-btn-round ant-btn-primary">Sửa</Button>
                <Button shape="round" type="danger" onClick={() => DeleteCriteriaCourse(tcdth_khoa_hoc_id)} >Xóa</Button> 
                </Space>
            ),
        },
    ];

    const columns2 = [
        {
            title: 'Tên mô đun',
            dataIndex: 'ten_mo_dun',
            key: 'ten_mo_dun',
            responsive: ['md'],
            render: (ten_mo_dun, mo_dun) => (
                mo_dun?.mo_dun?.ten_mo_dun
            )
        },
        {
            title: 'Khóa học',
            dataIndex: 'khoa_hoc',
            key: 'ten_mo_dun',
            responsive: ['md'],
            render: (ten_mo_dun, mo_dun) => (
                mo_dun?.mo_dun?.khoa_hoc?.ten_khoa_hoc
            )
        },
        {
            title: 'Số câu hỏi',
            dataIndex: 'so_cau_hoi',
            key: 'so_cau_hoi',
            responsive: ['md'],
        },
        {
            title: 'Thời gian thi',
            dataIndex: 'thoi_gian',
            key: 'thoi_gian',
            responsive: ['md'],
        },
        {
            title: 'Yêu cầu',
            dataIndex: 'yeu_cau',
            key: 'yeu_cau',
            responsive: ['md'],
        },
        {
            title: 'Số lần thi',
            dataIndex: 'so_lan_thi',
            key: 'so_lan_thi',
            responsive: ['md'],
        },
        {
            title: 'Tùy chọn',
            key: 'tcdmd_khoa_hoc_id',
            dataIndex: 'tcdmd_khoa_hoc_id',
            // Redirect view for edit
            render: (tcdmd_khoa_hoc_id) => (
                <Space size="middle">
                <Button  type="button" onClick={() => EditCriteriaModule(tcdmd_khoa_hoc_id)} className="ant-btn ant-btn-round ant-btn-primary">Sửa</Button>
                <Button shape="round" type="danger" onClick={() => DeleteCriteriaModule(tcdmd_khoa_hoc_id)} >Xóa</Button> 
                </Space>
            ),
        },
    ];

    const columns3 = [
        {
            title: 'Tên mô đun',
            dataIndex: 'ten_mo_dun',
            key: 'ten_mo_dun',
            responsive: ['md'],
            render: (ten_mo_dun, mo_dun) => (
                mo_dun?.mo_dun?.ten_mo_dun
            )
        },
        {
            title: 'Khóa học',
            dataIndex: 'khoa_hoc',
            key: 'ten_mo_dun',
            responsive: ['md'],
            render: (ten_mo_dun, mo_dun) => (
                mo_dun?.mo_dun?.khoa_hoc?.ten_khoa_hoc
            )
        },
        {
            title: 'Số câu hỏi',
            dataIndex: 'so_cau_hoi',
            key: 'so_cau_hoi',
            responsive: ['md'],
        },
        {
            title: 'Thời gian thi',
            dataIndex: 'thoi_gian',
            key: 'thoi_gian',
            responsive: ['md'],
        },
        {
            title: 'Yêu cầu',
            dataIndex: 'yeu_cau',
            key: 'yeu_cau',
            responsive: ['md'],
        },
        {
            title: 'Số lần thi',
            dataIndex: 'so_lan_thi',
            key: 'so_lan_thi',
            responsive: ['md'],
        },
        {
            title: 'Tùy chọn',
            key: 'tcdcd_mo_dun_id',
            dataIndex: 'tcdcd_mo_dun_id',
            // Redirect view for edit
            render: (tcdcd_mo_dun_id) => (
                <Space size="middle">
                <Button  type="button" onClick={() => EditCriteriaThematic(tcdcd_mo_dun_id)} className="ant-btn ant-btn-round ant-btn-primary">Sửa</Button>
                <Button shape="round" type="danger" onClick={() => DeleteCriteriaThematic(tcdcd_mo_dun_id)} >Xóa</Button> 
                </Space>
            ),
        },
    ];

    const columns4 = [
        {
            title: 'Tên khóa học',
            dataIndex: 'ten_khoa_hoc',
            key: 'ten_khoa_hoc',
            width: 350,
            responsive: ['md'],
            render: (tcdth_khoa_hoc_id, tieu_chi) => (
                <>{tieu_chi.khoa_hoc?.ten_khoa_hoc}</>
            ),
            fixed: 'left',
        },
        {
            title: 'Số phần',
            dataIndex: 'so_phan',
            key: 'so_phan',
            width: 150,
            responsive: ['md'],
        },
        {
            title: 'Tổng số câu hỏi',
            dataIndex: 'so_cau_hoi',
            key: 'so_cau_hoi',
            width: 150,
            responsive: ['md'],
        },
        {
            title: 'Tổng thời gian thi',
            dataIndex: 'thoi_gian',
            key: 'thoi_gian',
            width: 180,
            responsive: ['md'],
        },
        {
            title: 'Số câu hỏi phần 1',
            dataIndex: 'so_cau_hoi_phan_1',
            key: 'so_cau_hoi_phan_1',
            width: 180,
            responsive: ['md'],
        },
        {
            title: 'Yêu cầu phần 1',
            dataIndex: 'yeu_cau_phan_1',
            key: 'yeu_cau_phan_1',
            width: 150,
            responsive: ['md'],
        },
        {
            title: 'Thời gian phần 1',
            dataIndex: 'thoi_gian_phan_1',
            key: 'thoi_gian_phan_1',
            width: 150,
            responsive: ['md'],
        },
        {
            title: 'Số câu hỏi phần 2',
            dataIndex: 'so_cau_hoi_phan_2',
            key: 'so_cau_hoi_phan_2',
            width: 180,
            responsive: ['md'],
        },
        {
            title: 'Yêu cầu phần 2',
            dataIndex: 'yeu_cau_phan_2',
            key: 'yeu_cau_phan_2',
            width: 150,
            responsive: ['md'],
        },
        {
            title: 'Thời gian phần 2',
            dataIndex: 'thoi_gian_phan_2',
            key: 'thoi_gian_phan_2',
            width: 150,
            responsive: ['md'],
        },
        {
            title: 'Số câu hỏi phần 3',
            dataIndex: 'so_cau_hoi_phan_3',
            key: 'so_cau_hoi_phan_3',
            width: 180,
            responsive: ['md'],
        },
        {
            title: 'Yêu cầu phần 3',
            dataIndex: 'yeu_cau_phan_3',
            key: 'yeu_cau_phan_3',
            width: 150,
            responsive: ['md'],
        },
        {
            title: 'Thời gian phần 3',
            dataIndex: 'thoi_gian_phan_3',
            key: 'thoi_gian_phan_3',
            width: 150,
            responsive: ['md'],
        },
        {
            title: 'Số câu hỏi phần 4',
            dataIndex: 'so_cau_hoi_phan_4',
            key: 'so_cau_hoi_phan_4',
            width: 180,
            responsive: ['md'],
        },
        {
            title: 'Yêu cầu phần 4',
            dataIndex: 'yeu_cau_phan_4',
            key: 'yeu_cau_phan_4',
            width: 150,
            responsive: ['md'],
        },
        {
            title: 'Thời gian phần 4',
            dataIndex: 'thoi_gian_phan_4',
            key: 'thoi_gian_phan_4',
            width: 150,
            responsive: ['md'],
        },
        {
            title: 'Số câu hỏi phần 5',
            dataIndex: 'so_cau_hoi_phan_5',
            key: 'so_cau_hoi_phan_5',
            width: 180,
            responsive: ['md'],
        },
        {
            title: 'Yêu cầu phần 5',
            dataIndex: 'yeu_cau_phan_5',
            key: 'yeu_cau_phan_5',
            width: 150,
            responsive: ['md'],
        },
        {
            title: 'Thời gian phần 5',
            dataIndex: 'thoi_gian_phan_5',
            key: 'thoi_gian_phan_5',
            width: 150,
            responsive: ['md'],
        },
        {
            title: 'Số câu hỏi phần 6',
            dataIndex: 'so_cau_hoi_phan_6',
            key: 'so_cau_hoi_phan_6',
            width: 180,
            responsive: ['md'],
        },
        {
            title: 'Yêu cầu phần 6',
            dataIndex: 'yeu_cau_phan_6',
            key: 'yeu_cau_phan_6',
            width: 150,
            responsive: ['md'],
        },
        {
            title: 'Thời gian phần 6',
            dataIndex: 'thoi_gian_phan_6',
            key: 'thoi_gian_phan_6',
            width: 150,
            responsive: ['md'],
        },
        {
            title: 'Tùy chọn',
            key: 'idtieu_chi_de_thi_online',
            dataIndex: 'idtieu_chi_de_thi_online',
            width: 150,
            // Redirect view for edit
            render: (idtieu_chi_de_thi_online) => (
                <Space size="small">
                    <Button  type="button" onClick={() => EditCriteriaOnline(idtieu_chi_de_thi_online)} className="ant-btn ant-btn-round ant-btn-primary">Sửa</Button>
                    <Button shape="round" type="danger" onClick={() => DeleteCriteriaOnline(idtieu_chi_de_thi_online)} >Xóa</Button> 
                </Space>
            ),
            fixed: 'right',
        },
    ];

    const columnsDGNL = [
        {
            title: 'Tên khóa học',
            dataIndex: 'ten_khoa_hoc',
            key: 'ten_khoa_hoc',
            width: 350,
            responsive: ['md'],
            render: (tcdth_khoa_hoc_id, tieu_chi) => (
                <>{tieu_chi.khoa_hoc?.ten_khoa_hoc}</>
            ),
            fixed: 'left',
        },
        {
            title: 'Tổng số câu hỏi',
            dataIndex: 'so_cau_hoi',
            key: 'so_cau_hoi',
            width: 150,
            responsive: ['md'],
        },
        {
            title: 'Tổng thời gian thi',
            dataIndex: 'thoi_gian',
            key: 'thoi_gian',
            width: 180,
            responsive: ['md'],
        },
        {
            title: 'Số câu hỏi phần Toán học',
            dataIndex: 'so_cau_hoi_phan_1',
            key: 'so_cau_hoi_phan_1',
            width: 180,
            responsive: ['md'],
        },
        {
            title: 'Thời gian phần Toán học',
            dataIndex: 'thoi_gian_phan_1',
            key: 'thoi_gian_phan_1',
            width: 150,
            responsive: ['md'],
        },
        {
            title: 'Số câu hỏi phần Văn học',
            dataIndex: 'so_cau_hoi_phan_2',
            key: 'so_cau_hoi_phan_2',
            width: 180,
            responsive: ['md'],
        },
        {
            title: 'Thời gian phần Văn học',
            dataIndex: 'thoi_gian_phan_2',
            key: 'thoi_gian_phan_2',
            width: 150,
            responsive: ['md'],
        },
        {
            title: 'Số câu hỏi phần Khoa học',
            dataIndex: 'so_cau_hoi_phan_3',
            key: 'so_cau_hoi_phan_3',
            width: 180,
            responsive: ['md'],
        },
        {
            title: 'Thời gian phần Khoa học',
            dataIndex: 'thoi_gian_phan_3',
            key: 'thoi_gian_phan_3',
            width: 150,
            responsive: ['md'],
        },
        {
            title: 'Số câu hỏi phần Ngoại ngữ',
            dataIndex: 'so_cau_hoi_phan_4',
            key: 'so_cau_hoi_phan_4',
            width: 180,
            responsive: ['md'],
        },
        {
            title: 'Thời gian phần Ngoại ngữ',
            dataIndex: 'thoi_gian_phan_4',
            key: 'thoi_gian_phan_4',
            width: 150,
            responsive: ['md'],
        },
        {
            title: 'Tùy chọn',
            key: 'idtieu_chi_de_thi_dgnl',
            dataIndex: 'idtieu_chi_de_thi_dgnl',
            width: 150,
            // Redirect view for edit
            render: (idtieu_chi_de_thi_dgnl) => (
                <Space size="middle">
                    <Button  type="button" onClick={() => EditCriteriaDGNL(idtieu_chi_de_thi_dgnl)} className="ant-btn ant-btn-round ant-btn-primary">Sửa</Button>
                    <Button shape="round" type="danger" onClick={() => DeleteCriteriaDGNL(idtieu_chi_de_thi_dgnl)} >Xóa</Button> 
                </Space>
            ),
            fixed: 'right',
        },
    ];

    if (criteriaCourse.status === 'success' ) {
        criteriaCourse.data.map((item, index) => dataCriteriaCourse.push({...item, 'key': index}));
    };

    if (criteriaOnline.status === 'success') {
        criteriaOnline.data.map((item, index) => dataCriteriaOnline.push({...item, 'key': index}));
    };
    
    if (criteriaModule.status === 'success') {
        criteriaModule.data.map((item, index) => dataCriteriaModule.push({...item, 'key': index}));
    };

    if (criteriaThematic.status === 'success') {
        criteriaThematic.data.map((item, index) => dataCriteriaThematic.push({...item, 'key': index}));
    };

    if (criteriaDGNL.status === 'success') {
        criteriaDGNL.data.map((item, index) => dataCriteriaDGNL.push({...item, 'key': index}));
    };

    useEffect(() => {
        setPageIndex(1);
        setFilter({...filter, khoa_hoc_id: '' });
        switch(state.activeTab) {
            case '1': // tiêu chí đề tổng hợp
                dispatch(criteriaAction.getCriteriasCourse({ khoa_hoc_id: filter.khoa_hoc_id, pageSize: pageSize, pageIndex: pageIndex }));
                break;
            case '2': // tiêu chí đề mô đun
                dispatch(criteriaAction.getCriteriasModule({ khoa_hoc_id: filter.khoa_hoc_id, pageSize: pageSize, pageIndex: pageIndex }));
                break;
            case '3': // tiêu chí đề chuyên đề
                dispatch(criteriaAction.getCriteriasThematic({ khoa_hoc_id: filter.khoa_hoc_id, pageSize: pageSize, pageIndex: pageIndex }));
                break;
            case '4': // tiêu chí đề online
                dispatch(criteriaAction.getCriteriasOnline({ khoa_hoc_id: filter.khoa_hoc_id, pageSize: pageSize, pageIndex: pageIndex }));
                break;
            case '5': // tiêu chí ĐGNL
                dispatch(criteriaAction.getCriteriasDGNL({ khoa_hoc_id: filter.khoa_hoc_id, pageSize: pageSize, pageIndex: pageIndex }));
                break;
            default:
                break;
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.activeTab]);
    
    useEffect(() => {
        switch(state.activeTab) {
            case '1': // tiêu chí đề tổng hợp
                dispatch(criteriaAction.getCriteriasCourse({ khoa_hoc_id: filter.khoa_hoc_id, pageSize: pageSize, pageIndex: pageIndex }));
                break;
            case '2': // tiêu chí đề mô đun
                dispatch(criteriaAction.getCriteriasModule({ khoa_hoc_id: filter.khoa_hoc_id, pageSize: pageSize, pageIndex: pageIndex }));
                break;
            case '3': // tiêu chí đề chuyên đề
                dispatch(criteriaAction.getCriteriasThematic({ khoa_hoc_id: filter.khoa_hoc_id, pageSize: pageSize, pageIndex: pageIndex }));
                break;
            case '4': // tiêu chí đề online
                dispatch(criteriaAction.getCriteriasOnline({ khoa_hoc_id: filter.khoa_hoc_id, pageSize: pageSize, pageIndex: pageIndex }));
                break;
            case '5': // tiêu chí ĐGNL
                dispatch(criteriaAction.getCriteriasDGNL({ khoa_hoc_id: filter.khoa_hoc_id, pageSize: pageSize, pageIndex: pageIndex }));
                break;
            default:
                break;
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter.khoa_hoc_id]);

    const onFilterChange = (field, value) => {
        setFilter((state) => ({ ...state, [field]: value }));  
    };
    
    // event đổi tab
    const onChangeTab = (value) => {
        setPageIndex(1);
        setState({...state, activeTab: value});
    };

    // hàm gọi API kiểm tra tiêu chí đã có đề xuất bản hay chưa
    const checkCriteria = (type, id) => {
        let url = ''
        switch (type) {
            case '1': // tiêu chí đề tổng hợp
                url = `${config.API_URL}/synthetic_criteria/${id}/quantity-exam-publish`;
                break;
            case '2': // tiêu chí đề mô đun
                url = `${config.API_URL}/modun_criteria/${id}/quantity-exam-publish`
                break;
            case '3': // tiêu chí đề chuyên đề
                url = `${config.API_URL}/thematic_criteria/${id}/quantity-exam-publish`
                break;
            case '4': // tiêu chí đề online
                url = `${config.API_URL}/online_criteria/${id}/quantity-exam-publish`
                break;
            case '5': // tiêu chí đề ĐGNL
                url = `${config.API_URL}/dgnl-criteria/${id}/quantity-exam-publish`
                break;
            default:
                break;
        }
        axios({
            method: 'get',
            url,
            timeout: 1000 * 60 * 5,
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`,
            },
        }).then(res => {
            if (res.status === 200 && res.statusText === 'OK') {
                if (res.data.data > 0) setIsPublish(true);
            } else {
                notification.error({
                    message: 'Lỗi',
                    description: 'Có lỗi xảy ra khi lấy dữ liệu',
                })
            }
        }).catch(error => notification.error({ message: error.message }));
    }

    const EditCriteriaCourse = (id) => {
        const callback = (res) => {
            if (res.status === 'success') {
                checkCriteria('1', id);  // check tiêu chí đã có đề xuất bản hay chưa
                form.setFieldsValue(res.data);
                showModal();
                setCourse(true);
                setModule(false);
                setThematic(false);
                setRequire({...state, course: true, module: false, thematic: false, isEdit: true});
            }
        };
        setState({...state, idCriteria: id});
        dispatch(criteriaAction.getCriteriaCourse({ id: id }, callback))
    };

    const EditCriteriaModule = (id) => {
        const callback = (res) => {
            if (res.status === 'success') {
                checkCriteria('2', id);  // check tiêu chí đã có đề xuất bản hay chưa
                form.setFieldValue('khoa_hoc_id', res.data.mo_dun?.khoa_hoc_id);
                dispatch(moduleAction.getModulesByIdCourse({ idCourse: res.data.mo_dun?.khoa_hoc_id }))
                form.setFieldsValue(res.data);
                showModal();
                setCourse(false);
                setModule(true);
                setThematic(false);
                setRequire({...state, course: true, module: true, thematic: false, isEdit: true});
            }
        };
        setState({...state, idCriteria: id});
        dispatch(criteriaAction.getCriteriaModule({ id: id }, callback))
    };

    const EditCriteriaThematic = (id) => {
        const callback = (res) => {
            if (res.status === 'success') {
                checkCriteria('3', id);  // check tiêu chí đã có đề xuất bản hay chưa
                form.setFieldValue('khoa_hoc_id', res.data.mo_dun?.khoa_hoc_id);
                dispatch(moduleAction.getModulesByIdCourse({ idCourse: res.data.mo_dun?.khoa_hoc_id }))
                form.setFieldsValue(res.data);
                showModal();
                setCourse(false);
                setModule(false);
                setThematic(true);
                setRequire({...state, course: true, module: true, thematic: true, isEdit: true});
            }
        };
        setState({...state, idCriteria: id});
        dispatch(criteriaAction.getCriteriaThematicById({ id: id }, callback))
    };

    const EditCriteriaOnline = (id) => {
        const callback = (res) => {
            if (res.status === 'success') {
                checkCriteria('4', id);  // check tiêu chí đã có đề xuất bản hay chưa
                setNumberOfItems(res.data.so_phan);
                formOnline.setFieldsValue(res.data);
                showModalOnline();
                setRequire({...state, isEdit: true});
            }
        };
        setState({...state, idCriteria: id});
        dispatch(criteriaAction.getCriteriaOnline({ id: id }, callback))
    };

    const EditCriteriaDGNL = (id) => {
        const callback = (res) => {
            if (res.status === 'success') {
                checkCriteria('5', id);  // check tiêu chí đã có đề xuất bản hay chưa
                setNumberOfItems(res.data.so_phan);
                formDGNL.setFieldsValue(res.data);
                showModalDGNL();
                setRequire({...state, isEdit: true});
            }
        };
        setState({...state, idCriteria: id});
        dispatch(criteriaAction.getCriteriaDGNL({ id: id }, callback))
    };

    const DeleteCriteriaCourse = (id) => {
        confirm({
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn có chắc chắn muốn xóa tiêu chí này?',
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            onOk() {
                const callback = (res) => {
                    if (res.statusText === 'OK' && res.status === 200) {
                        dispatch(criteriaAction.getCriteriasCourse({ khoa_hoc_id: filter.khoa_hoc_id, pageSize: pageSize, pageIndex: pageIndex }));
                        notification.success({
                            message: 'Thành công',
                            description: 'Xóa tiêu chí thành công',
                        })
                    } else {
                        notification.error({
                            message: 'Thông báo',
                            description: 'Xóa tiêu chí mới thất bại',
                        })
                    };
                }
                dispatch(criteriaAction.deleteCriteriaCourse({ id: id }, callback))
            },
        });
    };

    const DeleteCriteriaModule = (id) => {
        confirm({
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn có chắc chắn muốn xóa tiêu chí này?',
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            onOk() {
                const callback = (res) => {
                    if (res.statusText === 'OK' && res.status === 200) {
                        dispatch(criteriaAction.getCriteriasModule({ khoa_hoc_id: filter.khoa_hoc_id, pageSize: pageSize, pageIndex: pageIndex })); 
                        notification.success({
                            message: 'Thành công',
                            description: 'Xóa tiêu chí thành công',
                        })
                    } else {
                        notification.error({
                            message: 'Thông báo',
                            description: 'Xóa tiêu chí mới thất bại',
                        })
                    };
                }
                dispatch(criteriaAction.deleteCriteriaModule({ id: id }, callback))
            },
        });
    };

    const DeleteCriteriaThematic = (id) => {
        confirm({
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn có chắc chắn muốn xóa tiêu chí này?',
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            onOk() {
                const callback = (res) => {
                    if (res.statusText === 'OK' && res.status === 200) {
                        dispatch(criteriaAction.getCriteriasThematic({ khoa_hoc_id: filter.khoa_hoc_id, pageSize: pageSize, pageIndex: pageIndex }));
                        notification.success({
                            message: 'Thành công',
                            description: 'Xóa tiêu chí thành công',
                        })
                    } else {
                        notification.error({
                            message: 'Thông báo',
                            description: 'Xóa tiêu chí mới thất bại',
                        })
                    };
                }
                dispatch(criteriaAction.deleteCriteriaThematic({ id: id }, callback))
            },
        });
    };

    // xoá tiêu chí online
    const DeleteCriteriaOnline = (id) => {
        confirm({
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn có chắc chắn muốn xóa tiêu chí này?',
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            onOk() {
                const callback = (res) => {
                    if (res.statusText === 'OK' && res.status === 200) {
                        dispatch(criteriaAction.getCriteriasOnline({ khoa_hoc_id: filter.khoa_hoc_id, pageSize: pageSize, pageIndex: pageIndex }));
                        notification.success({
                            message: 'Thành công',
                            description: 'Xóa tiêu chí thành công',
                        })
                    } else {
                        notification.error({
                            message: 'Thông báo',
                            description: 'Xóa tiêu chí thất bại',
                        })
                    };
                }
                dispatch(criteriaAction.deleteCriteriaOnline({ id: id }, callback))
            },
        });
    };

    const DeleteCriteriaDGNL = (id) => {
        confirm({
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn có chắc chắn muốn xóa tiêu chí này?',
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            onOk() {
                const callback = (res) => {
                    if (res.statusText === 'OK' && res.status === 200) {
                        dispatch(criteriaAction.getCriteriasDGNL({ khoa_hoc_id: filter.khoa_hoc_id, pageSize: pageSize, pageIndex: pageIndex }));
                        notification.success({
                            message: 'Thành công',
                            description: 'Xóa tiêu chí thành công',
                        })
                    } else {
                        notification.error({
                            message: 'Thông báo',
                            description: 'Xóa tiêu chí mới thất bại',
                        })
                    };
                }
                dispatch(criteriaAction.deleteCriteriaDGNL({ id: id }, callback))
            },
        });
    };

    const createCriteria = (values) => {
        const callback = (res) => {
            if (res.status === 200 && res.statusText === 'OK') {
                form.resetFields();
                if (course) dispatch(criteriaAction.getCriteriasCourse({ khoa_hoc_id: filter.khoa_hoc_id, pageSize: pageSize, pageIndex: pageIndex }));
                else if (module) dispatch(criteriaAction.getCriteriasModule({ khoa_hoc_id: filter.khoa_hoc_id, pageSize: pageSize, pageIndex: pageIndex }));
                else if (thematic) dispatch(criteriaAction.getCriteriasThematic({ khoa_hoc_id: filter.khoa_hoc_id, pageSize: pageSize, pageIndex: pageIndex }));
                if (!require.isEdit) {
                    notification.success({
                        message: 'Thành công',
                        description: 'Thêm tiêu chí mới thành công',
                    })
                } else {
                    notification.success({
                        message: 'Thành công',
                        description: 'Sửa thông tin tiêu chí thành công',
                    })
                }
                setIsModalVisible(false);
            } else {
                if (!require.isEdit) {
                    if (res.response.data.message === 'already exist') {
                        notification.error({
                            message: 'Thông báo',
                            description: 'Đã tồn tại tiếu chí',
                        })
                    } else {
                        notification.error({
                            message: 'Thông báo',
                            description: 'Thêm mới tiêu chí thất bại' + res.response.data.message,
                        })
                    }
                } else {
                    notification.error({
                        message: 'Thông báo',
                        description: 'Sửa tiếu chí thất bại',
                    })
                }
            }
        };

        let dataSubmit = {
            "so_cau_hoi": values.so_cau_hoi,
            "thoi_gian": values.thoi_gian,
            "yeu_cau": values.yeu_cau,
            "so_lan_thi": values.so_lan_thi,
        };

        if (!require.isEdit) {
            if (course) {
                dataSubmit.khoa_hoc_id = values.khoa_hoc_id;
                dispatch(criteriaAction.createCriteriaCourse(dataSubmit, callback));
            } else if (module) {
                dataSubmit.mo_dun_id = values.mo_dun_id;
                dispatch(criteriaAction.createCriteriaModule(dataSubmit, callback));
            } else if (thematic) {
                dataSubmit.mo_dun_id = values.mo_dun_id;
                dispatch(criteriaAction.createCriteriaThematic(dataSubmit, callback));
            }
        } else {
            if (course) {
                dataSubmit.khoa_hoc_id = values.khoa_hoc_id;
                dispatch(criteriaAction.editCriteriaCourse({ id: state.idCriteria, formData: dataSubmit}, callback));
            } else if (module) {
                dataSubmit.mo_dun_id = values.mo_dun_id;
                dispatch(criteriaAction.editCriteriaModule({ id: state.idCriteria, formData: dataSubmit}, callback));
            } else if (thematic) {
                dataSubmit.mo_dun_id = values.mo_dun_id;
                dispatch(criteriaAction.editCriteriaThematic({ id: state.idCriteria, formData: dataSubmit}, callback));
            }
        }   
    };

    // function tạo/cập nhật tiêu chí online
    const createOrupdateCriteriaOnline = (values) => {
        const callback = (res) => {
            if (res.status === 200 && res.statusText === 'OK') {
                formOnline.resetFields();
                dispatch(criteriaAction.getCriteriasOnline({ khoa_hoc_id: filter.khoa_hoc_id, pageSize: pageSize, pageIndex: pageIndex }));
                if (!require.isEdit) {
                    notification.success({
                        message: 'Thành công',
                        description: 'Thêm tiêu chí mới thành công',
                    })
                } else {
                    notification.success({
                        message: 'Thành công',
                        description: 'Sửa thông tin tiêu chí thành công',
                    })
                }
                setIsModalVisibleOnline(false);
            } else {
                if (!require.isEdit) {
                    if (res.response.data.message === 'already exist') {
                        notification.error({
                            message: 'Thông báo',
                            description: 'Đã tồn tại tiếu chí',
                        })
                    } else {
                        notification.error({
                            message: 'Thông báo',
                            description: 'Thêm mới tiêu chí thất bại' + res.response.data.message,
                        })
                    }
                } else {
                    notification.error({
                        message: 'Thông báo',
                        description: 'Sửa tiếu chí thất bại',
                    })
                }
            }
        };

        let dataSubmit = {
            "so_phan": values.so_phan,
            "khoa_hoc_id": values.khoa_hoc_id,
            "so_cau_hoi": 0,
            "thoi_gian": 0,
        };

        Array.from({ length: numberExams }).map((_, index) => {
            dataSubmit[`so_cau_hoi_phan_${index + 1}`] = values[`so_cau_hoi_phan_${index + 1}`];
            dataSubmit[`thoi_gian_phan_${index + 1}`] = values[`thoi_gian_phan_${index + 1}`];
            dataSubmit[`yeu_cau_phan_${index + 1}`] = values[`yeu_cau_phan_${index + 1}`];
            dataSubmit.so_cau_hoi = dataSubmit.so_cau_hoi + values[`so_cau_hoi_phan_${index + 1}`];
            dataSubmit.thoi_gian = dataSubmit.thoi_gian + values[`thoi_gian_phan_${index + 1}`];
            return null;
        })
        

        if (!require.isEdit) {
            dispatch(criteriaAction.createCriteriaOnline(dataSubmit, callback));
        } else {
            dispatch(criteriaAction.editCriteriaOnline({ id: state.idCriteria, formData: dataSubmit}, callback));
        }   
    };

    // function tạo/cập nhật tiêu chí ĐGNL
    const createOrupdateCriteriaDGNL = (values) => {
        const callback = (res) => {
            if (res.status === 200 && res.statusText === 'OK') {
                formDGNL.resetFields();
                dispatch(criteriaAction.getCriteriasDGNL({ khoa_hoc_id: filter.khoa_hoc_id, pageSize: pageSize, pageIndex: pageIndex }));
                if (!require.isEdit) {
                    notification.success({
                        message: 'Thành công',
                        description: 'Thêm tiêu chí mới thành công',
                    })
                } else {
                    notification.success({
                        message: 'Thành công',
                        description: 'Sửa thông tin tiêu chí thành công',
                    })
                }
                setIsModalVisibleDGNL(false);
            } else {
                if (!require.isEdit) {
                    if (res.response.data.message === 'already exist') {
                        notification.error({
                            message: 'Thông báo',
                            description: 'Đã tồn tại tiếu chí',
                        })
                    } else {
                        notification.error({
                            message: 'Thông báo',
                            description: 'Thêm mới tiêu chí thất bại' + res.response.data.message,
                        })
                    }
                } else {
                    notification.error({
                        message: 'Thông báo',
                        description: 'Sửa tiếu chí thất bại',
                    })
                }
            }
        };

        let dataSubmit = {
            "so_phan": values.so_phan,
            "khoa_hoc_id": values.khoa_hoc_id,
            "so_cau_hoi": 0,
            "thoi_gian": 0,
        };

        Array.from({ length: numberExams }).map((_, index) => {
            dataSubmit[`so_cau_hoi_phan_${index + 1}`] = values[`so_cau_hoi_phan_${index + 1}`];
            dataSubmit[`thoi_gian_phan_${index + 1}`] = values[`thoi_gian_phan_${index + 1}`];
            dataSubmit.so_cau_hoi = dataSubmit.so_cau_hoi + values[`so_cau_hoi_phan_${index + 1}`];
            dataSubmit.thoi_gian = dataSubmit.thoi_gian + values[`thoi_gian_phan_${index + 1}`];
            return null;
        })
        
        if (!require.isEdit) {
            dispatch(criteriaAction.createCriteriaDGNL(dataSubmit, callback));
        } else {
            dispatch(criteriaAction.editCriteriaDGNL({ id: state.idCriteria, formData: dataSubmit}, callback));
        }   
    };

    const renderCourses = () => {
        let options = [];
        if (courses.status === 'success') {
            if (state.activeTab === '4') {
                options = courses.data.filter((item) => item.loai_kct === 1).map((course) => (
                    <Option key={course.khoa_hoc_id} value={course.khoa_hoc_id} >{course.ten_khoa_hoc}</Option>
                ))
            } else if (state.activeTab === '5') { // ĐGNL 
                let temp = courses.data.filter((item) => item.loai_kct === 0 || item.loai_kct === 3);
                if (!require.isEdit) temp = temp.filter(item => !dataCriteriaDGNL.some(comp => comp.khoa_hoc_id === item.khoa_hoc_id));

                options = temp.map((course) => (
                    <Option key={course.khoa_hoc_id} value={course.khoa_hoc_id} >{course.ten_khoa_hoc}</Option>
                ))
            } else {
                options = courses.data.filter((item) => item.loai_kct === 2).map((course) => (
                    <Option key={course.khoa_hoc_id} value={course.khoa_hoc_id} >{course.ten_khoa_hoc}</Option>
                ))
            }
        }

        return (
            <Select
                showSearch={false} value={state.courseId}
                loading={loadingcourses}
                onChange={(khoa_hoc_id) => {
                    setState({khoa_hoc_id, ...state, isChanged: true })
                    dispatch(moduleAction.getModulesByIdCourse({ idCourse: khoa_hoc_id }))
                }}
                placeholder="Chọn khóa học"
            >
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
            <Select
                showSearch={false}
                loading={loadingmodules}
                onChange={(mo_dun_id) => {
                    setState({...state, isChanged: true, mo_dun_id: mo_dun_id });
                    dispatch(thematicAction.getThematicsByIdModule({ idModule: mo_dun_id }))
                }}
                placeholder="Chọn mô đun"
            >
                {options}
            </Select>
        );
    };
    
    const renderModal = () => {
        return(
            <Row>
                <Col xl={24} sm={24} xs={24} className="cate-form-block">
                    {(course && !require.isEdit) ? <h5>Thêm mới tiêu chí đề thi tổng hợp</h5> : (module && !require.isEdit) ? <h5>Thêm mới tiêu chí đề thi mô đun</h5> : (thematic && !require.isEdit) ?<h5>Thêm mới tiêu chí đề thi chuyên đề</h5> : ''}
                    {(course && require.isEdit) ? <h5>Sửa thông tin tiêu chí đề thi tổng hợp</h5> : (module && require.isEdit) ? <h5>Sửa thông tin tiêu chí đề thi mô đun</h5> : (thematic && require.isEdit) ? <h5>Sửa thông tin tiêu chí đề thi chuyên đề</h5> : ''}
                    <Form layout="vertical" className="category-form" form={form} autoComplete="off" onFinish={createCriteria}>
                        <Row gutter={25}>
                            <Col xl={24} sm={24} xs={24}>
                                <Form.Item
                                    className="input-col"
                                    label="Khóa học"
                                    name="khoa_hoc_id"
                                    rules={[
                                        {
                                            required: require.course,
                                            message: 'Khóa học là trường bắt buộc.',
                                        },
                                    ]}
                                >
                                    {renderCourses()}
                                </Form.Item>
                            </Col>
                            <Col xl={24} sm={24} xs={24}>
                                <Form.Item style={{display: require.module ? '' : 'none'}}
                                    className="input-col"
                                    label="Mô đun"
                                    name="mo_dun_id"
                                    rules={[
                                        {
                                            required: require.module,
                                            message: 'Mô đun là trường bắt buộc.',
                                        },
                                    ]}
                                >
                                    {renderModules()}
                                </Form.Item>
                            </Col>
                            
                            <Col xl={12} sm={24} xs={24} className="left-content">
                                <Form.Item
                                    className="input-col"
                                    label="Số câu hỏi"
                                    name="so_cau_hoi"
                                    rules={[
                                        {
                                        required: true,
                                        message: 'Số câu hỏi là trường bắt buộc.',
                                        },
                                    ]}
                                >
                                    <InputNumber disabled={isPublish} placeholder="Nhập số câu hỏi" style={{width: "100%"}}/>
                                </Form.Item>
                                <Form.Item
                                    className="input-col"
                                    label="Thời gian"
                                    name="thoi_gian"
                                    rules={[
                                        {
                                        required: true,
                                        message: 'Thời gian là trường bắt buộc.',
                                        },
                                    ]}
                                >
                                    <InputNumber placeholder="Nhập thời gian" style={{width: "100%"}}/>
                                </Form.Item>
                                
                            </Col>
                            <Col xl={12} sm={24} xs={24} className="right-content">
                                <Form.Item
                                    className="input-col"
                                    label="Số lần thi"
                                    name="so_lan_thi"
                                    rules={[
                                        {
                                        required: true,
                                        message: 'Số lần thi là trường bắt buộc.',
                                        },
                                    ]}
                                >
                                    <InputNumber placeholder="Nhập số lần thi tối đa được phép thi" style={{width: "100%"}}/>
                                </Form.Item>
                                <Form.Item
                                    className="input-col"
                                    label="Yêu cầu"
                                    name="yeu_cau"
                                    rules={[
                                        {
                                        required: true,
                                        message: 'Yêu cầu là trường bắt buộc.',
                                        },
                                    ]}
                                >
                                    <InputNumber placeholder="Nhập yêu cầu đạt đề thi" style={{width: "100%"}}/>
                                </Form.Item>
                                {/* <Form.Item style={{display: require.thematic ? '' : 'none'}}
                                    className="input-col"
                                    label="Chuyên đề"
                                    name="chuyen_de_id"
                                    rules={[
                                        {
                                            required: require.thematic,
                                            message: 'Chuyên đề là trường bắt buộc.',
                                        },
                                    ]}
                                >
                                    {renderThematics()}
                                </Form.Item> */}
                                
                            </Col>
                            
                            <Form.Item className="button-col" style={{textAlign: 'right'}}>
                                {!require.isEdit ? <Button shape="round" type="primary" htmlType="submit" >Thêm mới</Button> : <Button shape="round" type="primary" htmlType="submit" >Cập nhật</Button>}                             
                            </Form.Item>
                            <span style={{color: 'red', display: require.thematic ? '' : 'none'}}>* Các chuyên đề cùng mô-đun có tiêu chí giống nhau</span>
                        </Row>                                     
                    </Form>
                </Col>
            </Row>
        )
    }

    const renderModalOnline = () => {
        return (
            <Row>
                <Col xl={24} sm={24} xs={24} className="cate-form-block">
                    {require.isEdit ? <h5>Sửa thông tin tiêu chí đề thi online</h5> : <h5>Thêm mới tiêu chí đề thi online</h5>}
                    <Form layout="vertical" className="category-form" form={formOnline} autoComplete="off" onFinish={createOrupdateCriteriaOnline}>
                        <Row gutter={25}>
                            <Col xl={24} sm={24} xs={24}>
                                <Form.Item
                                    className="input-col"
                                    label="Khóa học"
                                    name="khoa_hoc_id"
                                    rules={[
                                        {
                                            required: require.course,
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
                                    label="Số phần thi"
                                    name="so_phan"
                                    rules={[
                                        {
                                        required: true,
                                        message: 'Số phần thi là trường bắt buộc.',
                                        },
                                    ]}
                                >
                                    <InputNumber disabled={isPublish} placeholder="Nhập số phần thi" style={{width: "100%"}} max={6} min={1} onChange={handleNumberExamChange}/>
                                </Form.Item>
                            </Col>
                            
                            {Array.from({ length: numberExams }).map((_, index) => (
                                <>
                                <Col xl={8} sm={24} xs={24} >
                                    <Form.Item
                                        className="input-col"
                                        label={`Số câu hỏi phần ${index + 1}`}
                                        name={`so_cau_hoi_phan_${index + 1}`}
                                        rules={[
                                            {
                                            required: true,
                                            message: 'Số câu hỏi là trường bắt buộc.',
                                            },
                                        ]}
                                    >
                                        <InputNumber disabled={isPublish} placeholder="Nhập số câu hỏi đề thi" style={{width: "100%"}}/>
                                    </Form.Item>
                                </Col>
                                <Col xl={8} sm={24} xs={24} >
                                    <Form.Item
                                        className="input-col"
                                        label={`Thời gian phần ${index + 1}`}
                                        name={`thoi_gian_phan_${index + 1}`}
                                        rules={[
                                            {
                                            required: true,
                                            message: 'Thời gian là trường bắt buộc.',
                                            },
                                        ]}
                                    >
                                        <InputNumber placeholder="Nhập thời gian thi" style={{width: "100%"}}/>
                                    </Form.Item>   
                                </Col>
                                <Col xl={8} sm={24} xs={24} >
                                    <Form.Item
                                        className="input-col"
                                        label={`Yêu cầu phần ${index + 1}`}
                                        name={`yeu_cau_phan_${index + 1}`}
                                        rules={[
                                            {
                                            required: true,
                                            message: 'Yêu cầu là trường bắt buộc.',
                                            },
                                        ]}
                                    >
                                        <InputNumber placeholder="Nhập yêu cầu đạt" style={{width: "100%"}}/>
                                    </Form.Item>
                                </Col>
                                </>
                            ))}
                            
                            <Form.Item className="button-col" style={{textAlign: 'right'}}>
                                {!require.isEdit ? <Button shape="round" type="primary" htmlType="submit" >Thêm mới</Button> : <Button shape="round" type="primary" htmlType="submit" >Cập nhật</Button>}                             
                            </Form.Item>
                        </Row>                                     
                    </Form>
                </Col>
            </Row>
        )
    }

    const renderModalDGNL = () => {
        return (
            <Row>
                <Col xl={24} sm={24} xs={24} className="cate-form-block">
                    {require.isEdit ? <h5>Sửa thông tin tiêu chí đề thi ĐGNL</h5> : <h5>Thêm mới tiêu chí đề thi ĐGNL</h5>}
                    <Form layout="vertical" className="category-form" form={formDGNL} autoComplete="off" onFinish={createOrupdateCriteriaDGNL}>
                        <Row gutter={25}>
                            <Col xl={24} sm={24} xs={24}>
                                <Form.Item
                                    className="input-col"
                                    label="Khóa học"
                                    name="khoa_hoc_id"
                                    rules={[
                                        {
                                            required: require.course,
                                            message: 'Khóa học là trường bắt buộc.',
                                        },
                                    ]}
                                >
                                    {renderCourses()}
                                </Form.Item>
                            </Col>
                            <Col xl={24} sm={24} xs={24} className="left-content">
                                <Form.Item initialValue={numberExams}
                                    className="input-col"
                                    label="Số phần thi"
                                    name="so_phan"
                                    rules={[
                                        {
                                        required: true,
                                        message: 'Số phần thi là trường bắt buộc.',
                                        },
                                    ]}
                                >
                                    <InputNumber disabled={true} placeholder="Nhập số phần thi" style={{width: "100%"}} defaultValue={numberExams} onChange={handleNumberExamChange}/>
                                </Form.Item>
                            </Col>
                            
                            {Array.from({ length: numberExams }).map((_, index) => (
                                <>
                                    <Col xl={12} sm={24} xs={24} >
                                        <Form.Item
                                            className="input-col"
                                            label={`Số câu hỏi phần ${index === 0 ? ' Toán học' : index === 1 ? ' Văn học' : index === 2 ? ' Khoa học' : 'Ngoại ngữ'}`}
                                            name={`so_cau_hoi_phan_${index + 1}`}
                                            rules={[
                                                {
                                                required: true,
                                                message: 'Số câu hỏi là trường bắt buộc.',
                                                },
                                            ]}
                                        >
                                            <InputNumber disabled={isPublish} placeholder="Nhập số câu hỏi đề thi" style={{width: "100%"}}/>
                                        </Form.Item>
                                    </Col>
                                    <Col xl={12} sm={24} xs={24} >
                                        <Form.Item
                                            className="input-col"
                                            label={`Thời gian phần ${index + 1}`}
                                            name={`thoi_gian_phan_${index + 1}`}
                                            rules={[
                                                {
                                                required: true,
                                                message: 'Thời gian là trường bắt buộc.',
                                                },
                                            ]}
                                        >
                                            <InputNumber placeholder="Nhập thời gian thi" style={{width: "100%"}}/>
                                        </Form.Item>   
                                    </Col>
                                </>
                            ))}
                            
                            <Col xl={24} sm={24} xs={24}>
                                <Form.Item className="button-col" style={{textAlign: 'right'}}>
                                    {!require.isEdit ? <Button shape="round" type="primary" htmlType="submit" >Thêm mới</Button> : <Button shape="round" type="primary" htmlType="submit" >Cập nhật</Button>}                             
                                </Form.Item>
                            </Col>
                        </Row>                                     
                    </Form>
                </Col>
            </Row>
        )
    }

    // event đổi page Index
    const onChangePage = (page) => {
        setPageIndex(page);
        switch(state.activeTab) {
            case '1': // tiêu chí đề tổng hợp
                dispatch(criteriaAction.getCriteriasCourse({ khoa_hoc_id: filter.khoa_hoc_id, pageSize: pageSize, pageIndex: page }));
                break;
            case '2': // tiêu chí đề mô đun
                dispatch(criteriaAction.getCriteriasModule({ khoa_hoc_id: filter.khoa_hoc_id, pageSize: pageSize, pageIndex: page }));
                break;
            case '3': // tiêu chí đề chuyên đề
                dispatch(criteriaAction.getCriteriasThematic({ khoa_hoc_id: filter.khoa_hoc_id, pageSize: pageSize, pageIndex: page }));
                break;
            case '4': // tiêu chí đề online
                dispatch(criteriaAction.getCriteriasOnline({ khoa_hoc_id: filter.khoa_hoc_id, pageSize: pageSize, pageIndex: page }));
                break;
            case '5': // tiêu chí ĐGNL
                dispatch(criteriaAction.getCriteriasDGNL({ khoa_hoc_id: filter.khoa_hoc_id, pageSize: pageSize, pageIndex: page }));
                break;
            default:
                break;
        }
    };

    // event đổi page Size
    const onChangePageSize = (current, pageSize) => {
        setPageSize(pageSize);
        switch(state.activeTab) {
            case '1': // tiêu chí đề tổng hợp
                dispatch(criteriaAction.getCriteriasCourse({ khoa_hoc_id: filter.khoa_hoc_id, pageSize: pageSize, pageIndex: pageIndex }));
                break;
            case '2': // tiêu chí đề mô đun
                dispatch(criteriaAction.getCriteriasModule({ khoa_hoc_id: filter.khoa_hoc_id, pageSize: pageSize, pageIndex: pageIndex }));
                break;
            case '3': // tiêu chí đề chuyên đề
                dispatch(criteriaAction.getCriteriasThematic({ khoa_hoc_id: filter.khoa_hoc_id, pageSize: pageSize, pageIndex: pageIndex }));
                break;
            case '4': // tiêu chí đề online
                dispatch(criteriaAction.getCriteriasOnline({ khoa_hoc_id: filter.khoa_hoc_id, pageSize: pageSize, pageIndex: pageIndex }));
                break;
            case '5': // tiêu chí ĐGNL
                dispatch(criteriaAction.getCriteriasDGNL({ khoa_hoc_id: filter.khoa_hoc_id, pageSize: pageSize, pageIndex: pageIndex }));
                break;
            default:
                break;
        }
    };

    return (
        <>
        {(loadingCourse && loadingModule && loadingThematic && loadingOnline && loadingDGNL) && <LoadingCustom />}
            <div className='content'>
                <Helmet>
                    <title>Quản lý tiêu chí đề thi</title>
                </Helmet>

                <Tabs defaultActiveKey={state.activeTab} activeKey={state.activeTab} onChange={onChangeTab}>
                    <TabPane tab="Tiêu chí đề thi tổng hợp" key="1">
                        <Row className="app-main">
                            <Col xl={24} className="body-content">
                                <AppFilter
                                    title={"Tiêu chí đề thi tổng hợp"}
                                    isShowCourse={true}
                                    courses={courses.data?.filter((course) => course.loai_kct === 2)}
                                    onFilterChange={(field, value) => onFilterChange(field, value)}
                                />
                            </Col>
                        </Row>
                        <Row className="select-action-group" gutter={[8, 8]}>
                            <Col xl={12} sm={12} xs={24}></Col>
                            <Col xl={12} sm={12} xs={24} className="right-actions">
                                <Button shape="round" type="primary" icon={<PlusOutlined />} className=" btn-action" onClick={() => {
                                        form.resetFields();
                                        showModal();
                                        setCourse(true);
                                        setModule(false);
                                        setThematic(false);
                                        setRequire({...state, course: true, module: false, thematic: false, isEdit: false});
                                }}>
                                    Thêm mới tiêu chí
                                </Button>
                            </Col>
                        </Row>
                        <Table className="table-striped-rows" columns={columns} dataSource={dataCriteriaCourse} pagination={false}></Table>
                        <br/>
                        <Pagination current={pageIndex} onChange={onChangePage} 
                            total={criteriaCourse?.totalCount} onShowSizeChange={onChangePageSize} 
                            showSizeChanger defaultPageSize={pageSize}
                        />
                    </TabPane>
                    <TabPane tab="Tiêu chí đề thi mô đun" key="2">
                        <Row className="app-main">
                            <Col xl={24} className="body-content">
                                <AppFilter
                                    title={"Tiêu chí đề thi mô đun"}
                                    isShowCourse={true}
                                    courses={courses.data?.filter((course) => course.loai_kct === 2)}
                                    onFilterChange={(field, value) => onFilterChange(field, value)}
                                />
                            </Col>
                        </Row>
                        <Row className="select-action-group" gutter={[8, 8]}>
                            <Col xl={12} sm={12} xs={24}></Col>
                            <Col xl={12} sm={12} xs={24} className="right-actions">
                                <Button shape="round" type="primary" icon={<PlusOutlined />} className=" btn-action" onClick={() => {
                                    showModal();
                                    form.resetFields();
                                    setCourse(false);
                                    setModule(true);
                                    setThematic(false);
                                    setRequire({...state, course: true, module: true, thematic: false, isEdit: false});

                                }}>
                                    Thêm mới tiêu chí
                                </Button>
                            </Col>
                        </Row>
                        <Table className="table-striped-rows" columns={columns2} dataSource={dataCriteriaModule} pagination={false}></Table>
                        <br/>
                        <Pagination current={pageIndex} onChange={onChangePage} 
                            total={criteriaModule?.data?.totalCount} onShowSizeChange={onChangePageSize} 
                            showSizeChanger defaultPageSize={pageSize}
                        />
                    </TabPane>
                    <TabPane tab="Tiêu chí đề thi chuyên đề" key="3">
                        <Row className="app-main">
                            <Col xl={24} className="body-content">
                                <AppFilter
                                    title={"Tiêu chí đề thi chuyên đề"}
                                    isShowCourse={true}
                                    courses={courses.data?.filter((course) => course.loai_kct === 2)}
                                    onFilterChange={(field, value) => onFilterChange(field, value)}
                                />
                            </Col>
                        </Row>
                        <Row className="select-action-group" gutter={[8, 8]}>
                            <Col xl={12} sm={12} xs={24}></Col>
                            <Col xl={12} sm={12} xs={24} className="right-actions">
                                <Button shape="round" type="primary" icon={<PlusOutlined />} className=" btn-action" onClick={() => {
                                    showModal();
                                    form.resetFields();
                                    setCourse(false);
                                    setModule(false);
                                    setThematic(true);
                                    setRequire({...state, course: true, module: true, thematic: true, isEdit: false});
                                }}>
                                    Thêm mới tiêu chí
                                </Button>
                            </Col>
                        </Row>
                        <Table className="table-striped-rows" columns={columns3} dataSource={dataCriteriaThematic} pagination={false}></Table>
                        <br/>
                        <Pagination current={pageIndex} onChange={onChangePage} 
                            total={criteriaThematic?.data?.totalCount} onShowSizeChange={onChangePageSize} 
                            showSizeChanger defaultPageSize={pageSize}
                        />
                    </TabPane>
                    <TabPane tab="Tiêu chí đề thi theo phần" key="4">
                        <Row className="app-main">
                            <Col xl={24} className="body-content">
                                <Row>
                                    <Col xl={24} sm={24} xs={24}>
                                        <AppFilter
                                            title={"Tiêu chí đề thi online"}
                                            isShowCourse={true}
                                            courses={courses.data?.filter((course) => course.loai_kct === 1)}
                                            onFilterChange={(field, value) => onFilterChange(field, value)}
                                        />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row className="select-action-group" gutter={[8, 8]}>
                            <Col xl={12} sm={12} xs={24}></Col>
                            <Col xl={12} sm={12} xs={24} className="right-actions">
                                <Button shape="round" type="primary" icon={<PlusOutlined />} className=" btn-action" onClick={() => {
                                    showModalOnline();
                                    formOnline.resetFields();
                                    setRequire({...state, isEdit: false});
                                }}>
                                    Thêm mới tiêu chí
                                </Button>
                            </Col>
                        </Row>
                        <Table className="table-striped-rows table-section" columns={columns4} dataSource={dataCriteriaOnline} pagination={false} scroll={{ x: 1500, y: 500 }} style={{scrollbarWidth: 500}}></Table>
                        <br/>
                        <Pagination current={pageIndex} onChange={onChangePage} 
                            total={criteriaOnline?.totalCount} onShowSizeChange={onChangePageSize} 
                            showSizeChanger defaultPageSize={pageSize}
                        />
                    </TabPane>
                    <TabPane tab="Tiêu chí đề thi ĐGNL" key="5">
                        <Row className="app-main">
                            <Col xl={24} className="body-content">
                                <Row>
                                    <Col xl={24} sm={24} xs={24}>
                                        <AppFilter
                                            title={"Tiêu chí đề thi ĐGNL"}
                                            isShowCourse={true}
                                            courses={courses.data?.filter((course) => course.loai_kct === 0)}
                                            onFilterChange={(field, value) => onFilterChange(field, value)}
                                        />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row className="select-action-group" gutter={[8, 8]}>
                            <Col xl={12} sm={12} xs={24}></Col>
                            <Col xl={12} sm={12} xs={24} className="right-actions">
                                <Button shape="round" type="primary" icon={<PlusOutlined />} className=" btn-action" onClick={() => {
                                    showModalDGNL();
                                    formDGNL.resetFields();
                                    setRequire({...state, isEdit: false});
                                }}>
                                    Thêm mới tiêu chí
                                </Button>
                            </Col>
                        </Row>
                        <Table className="table-striped-rows" columns={columnsDGNL} dataSource={dataCriteriaDGNL} pagination={false}></Table>
                        <br/>
                        <Pagination current={pageIndex} onChange={onChangePage} 
                            total={criteriaDGNL?.totalCount} onShowSizeChange={onChangePageSize} 
                            showSizeChanger defaultPageSize={pageSize}
                        />
                        
                    </TabPane>
                </Tabs>

                <Modal visible={isModalVisible}  mask={true} centered={true} className="cra-exam-modal" wrapClassName="cra-exam-modal-container"
                    onOk={handleOk} 
                    onCancel={handleCancel}
                    maskStyle={{ background: 'rgba(0, 0, 0, 0.8)' }}
                    maskClosable={false}
                    footer={null}
                >
                    {renderModal()}
                </Modal>

                <Modal visible={isModalVisibleOnline}  mask={true} centered={true} className="cra-exam-modal" wrapClassName="cra-exam-modal-container"
                    onOk={handleOkOnline} 
                    onCancel={handleCancelOnline}
                    maskStyle={{ background: 'rgba(0, 0, 0, 0.8)' }}
                    maskClosable={false}
                    width={600}
                    footer={null}
                >
                    {renderModalOnline()}
                </Modal>
                
                <Modal visible={isModalVisibleDGNL}  mask={true} centered={true} className="cra-exam-modal" wrapClassName="cra-exam-modal-container"
                    onOk={handleOkDGNL} 
                    onCancel={handleCancelDGNL}
                    maskStyle={{ background: 'rgba(0, 0, 0, 0.8)' }}
                    maskClosable={false}
                    width={600}
                    footer={null}
                >
                    {renderModalDGNL()}
                </Modal>

            </div>
        </>
    )
}

export default Criteria;