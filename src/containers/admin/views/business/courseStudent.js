import React, { useEffect, useState, useMemo } from "react";

// helper
import axios from "axios";
import config from '../../../../configs/index';

// component
import { Tabs, Row, Col, Table, Space, Button, notification, Pagination, Modal } from 'antd';
import { ExclamationCircleOutlined, } from '@ant-design/icons';
import AppFilter from "components/common/AppFilter";
import ReactExport from "react-export-excel";
// redux
import * as courseActions from '../../../../redux/actions/course';
import { useSelector, useDispatch } from "react-redux";

// hooks
import useDebounce from "hooks/useDebounce";

const { TabPane } = Tabs;
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const CourseStudentPage = (props) => {
    const dispatch = useDispatch();

    const data = [];
    const dataDetail = [];
    const remainData = [];

    const [pageIndex, setPageIndex] = useState(1);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const [filter, setFilter] = useState({
        search: '',
        tinh: '',
    });
    const searchValue = useDebounce(filter.search, 250);
    
    const [province, setProvinces] = useState([]);
    const [state, setState] = useState({
        idCourse: '',
        activeTab: "1",
    });

    const courseStudent = useSelector(state => state.course.list.result);
    const studentofCourse = useSelector(state => state.course.listDetail.result);
    const remainStudentofCourse = useSelector(state => state.course.remain.result);

    if (courseStudent.status === 'success') {
        courseStudent.data.map((student) => { data.push({ ...student, 'key': student.khoa_hoc_id }); return null; })
    }

    if (studentofCourse.status === 'success') {
        studentofCourse.data.map((student) => { dataDetail.push({ ...student, 'key': student.hoc_vien_id }); return null; })
    }

    if (remainStudentofCourse.status === 'success') {
        remainStudentofCourse.data.map((student) => { remainData.push({ ...student, 'key': student.hoc_vien_id }); return null; })
    }

    const columns = [
        {
            title: 'STT',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Tên khóa học',
            dataIndex: 'ten_khoa_hoc',
            key: 'ten_khoa_hoc',
            responsive: ['md'],
        },
        {
            title: 'Số lượng học viên',
            dataIndex: 'so_luong_hoc_vien',
            key: 'so_luong_hoc_vien',
            responsive: ['md'],
        },
        {
            title: 'Tùy chọn',
            key: 'khoa_hoc_id',
            dataIndex: 'khoa_hoc_id',
            // Redirect view for edit
            render: (khoa_hoc_id) => (
                <Space size="middle">
                    <Button style={{borderRadius: 6}} type="button" onClick={() => StudentOfCourse(khoa_hoc_id)} className="ant-btn ant-btn-round ant-btn-primary">Xem chi tiết</Button>
                    <Button shape="round" type="danger" onClick={() => RemainStudentOfCourse(khoa_hoc_id)}>Thêm học viên</Button>
                </Space>
            ),
        },
    ]

    const columns2 = [
        {
            title: 'STT',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Tên học viên',
            dataIndex: 'ho_ten',
            key: 'ho_ten',
            responsive: ['md'],
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            responsive: ['md'],
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'sdt',
            key: 'sdt',
            responsive: ['md'],
        },
        {
            title: 'Trường học',
            dataIndex: 'truong_hoc',
            key: 'truong_hoc',
            responsive: ['md'],
        },
        {
            title: 'Tỉnh / Thành phố',
            dataIndex: 'tinh',
            key: 'tinh',
            responsive: ['md'],
            render: (hoc_vien, record) => record?.tinh_thanhpho?.ten
        },
        {
            title: 'Tùy chọn',
            key: 'khhv_id',
            dataIndex: 'khhv_id',
            // Redirect view for edit
            render: (khhv_id) => (
                <Space size="middle">
                    <Button shape="round" type="danger" onClick={() => deleteStudentCourse(khhv_id)} >Xóa học viên</Button>
                </Space>
            ),
        },
    ]

    const columns3 = [
        {
            title: 'STT',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Tên học viên',
            dataIndex: 'ho_ten',
            key: 'ho_ten',
            responsive: ['md'],
        },
        {
            title: 'Giới tính',
            dataIndex: 'gioi_tinh',
            key: 'gioi_tinh',
            responsive: ['md'],
        },
        {
            title: 'email',
            dataIndex: 'email',
            key: 'email',
            responsive: ['md'],
        },
        {
            title: 'Tỉnh / Thành phố',
            dataIndex: 'tinh',
            key: 'tinh',
            responsive: ['md'],
            render: (hoc_vien, record) => record?.tinh_thanhpho?.ten
        },
        {
            title: 'Tùy chọn',
            key: 'hoc_vien_id',
            dataIndex: 'hoc_vien_id',
            // Redirect view for edit
            render: (hoc_vien_id) => (
                <Space size="middle">
                    <Button shape="round" type="primary"  onClick={() => onSubmitAddStudentToCourse(hoc_vien_id)}>Thêm học viên</Button>
                </Space>
            ),
        },
    ]

    useEffect(() => {
        if (state.activeTab === '2')
            dispatch(courseActions.getStudentOfCourse({ idCourse: state.idCourse, province: filter.tinh, search: filter.search, pageIndex: pageIndex, pageSize: pageSize }));
        if (state.activeTab === '3')
            dispatch(courseActions.getRemainStudentOfCourse({ idCourse: state.idCourse, province: filter.tinh, search: filter.search, pageIndex: pageIndex, pageSize: pageSize }));
    }, [filter.tinh]); // eslint-disable-line react-hooks/exhaustive-deps
    
    useMemo(() => {
        if (state.activeTab === '1')
            dispatch(courseActions.getCourseStudent({ search: filter.search, pageIndex: pageIndex, pageSize: pageSize }));
        if (state.activeTab === '2')
            dispatch(courseActions.getStudentOfCourse({ idCourse: state.idCourse, province: filter.tinh, search: filter.search, pageIndex: pageIndex, pageSize: pageSize }));
        if (state.activeTab === '3')
            dispatch(courseActions.getRemainStudentOfCourse({ idCourse: state.idCourse, province: filter.tinh, search: filter.search, pageIndex: pageIndex, pageSize: pageSize }));
    }, [searchValue]); // eslint-disable-line react-hooks/exhaustive-deps

    const getProvince = () => {
        axios.get(config.API_URL + '/province', )
            .then(
                res => {
  
                    if (res.status === 200 && res.statusText === 'OK') {
                        res.data.data.push({ten: 'Tất cả', ttp_id: ''});
                        setProvinces(res.data.data);
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
        getProvince();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const onFilterChange = (field, value) => {
        if (field === 'ngay') {
            setFilter((state) => ({ ...state, start: value[0] }));  
            setFilter((state) => ({ ...state, end: value[1] }));  
        }
        else {
            setFilter((state) => ({ ...state, [field]: value }));  
        }
    };

    const onChangeTab = (value) => {
        setPageIndex(1);
        setState({...state, activeTab: value});
        setFilter({ ...filter,
            search: '',
            tinh: '',
        })
    };

    const StudentOfCourse = (id) => {
        setFilter({ ...filter, search: ''});
        setState({...state, activeTab: "2", idCourse: id });
        dispatch(courseActions.getStudentOfCourse({ idCourse: id, province: filter.tinh, search: filter.search, pageIndex: pageIndex, pageSize: pageSize }));
    };

    useEffect(() => {
        if (state.activeTab === '1') dispatch(courseActions.getCourseStudent({ search: filter.search, pageIndex: pageIndex, pageSize: pageSize }));
        else if (state.activeTab === '2') dispatch(courseActions.getStudentOfCourse({ idCourse: state.idCourse, province: filter.tinh, search: filter.search, pageIndex: pageIndex, pageSize: pageSize }));
        else if (state.activeTab === '3') dispatch(courseActions.getRemainStudentOfCourse({ idCourse: state.idCourse, province: filter.tinh, search: filter.search, pageIndex: pageIndex, pageSize: pageSize }));
    }, [pageIndex, pageSize]); // eslint-disable-line react-hooks/exhaustive-deps

    const RemainStudentOfCourse = (id) => {
        setFilter({ ...filter, search: ''});
        setState({...state, activeTab: "3", idCourse: id });
        dispatch(courseActions.getRemainStudentOfCourse({ idCourse: id, province: filter.tinh, search: filter.search, pageIndex: pageIndex, pageSize: pageSize }));
    };

    const deleteStudentCourse = (id) => {
        Modal.confirm({
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn có chắc chăn muốn học viên này?',
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            onOk() {
                const callback = (res) => {
                    if (res.statusText === 'OK' && res.status === 200) {
                        dispatch(courseActions.getStudentOfCourse({ idCourse: state.idCourse, province: filter.tinh, search: filter.search, pageIndex: pageIndex, pageSize: pageSize }));
                        notification.success({
                            message: 'Thành công',
                            description: 'Xóa học viên thành công',
                        });
                        dispatch(courseActions.getCourseStudent({ search: filter.search, pageIndex: pageIndex, pageSize: pageSize }));
                    } else {
                        notification.error({
                            message: 'Thông báo',
                            description: 'Xóa học viên thất bại',
                        })
                    };
                }
                dispatch(courseActions.deleteCourseStudent({ idCourseStudent: id }, callback));
            },
        });
    }

    const onChange = (page) => {
        setPageIndex(page);
    };

    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
      };

    const onShowSizeChange = (current, pageSize) => {
        setPageSize(pageSize);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const onSubmitAddStudentToCourse = (id_hoc_vien) => {
        const callback = (res) => {
            if (res.status === 200 && res.statusText === 'OK' && res.data.status === 'success') {
                    notification.success({
                        message: 'Thành công',
                        description: 'Thêm học viên vào khóa học thành công', 
                    });
                    dispatch(courseActions.getCourseStudent({ search: filter.search, pageIndex: pageIndex, pageSize: pageSize }));
                if (state.activeTab === '3')
                    dispatch(courseActions.getRemainStudentOfCourse({ idCourse: state.idCourse, province: filter.tinh, search: filter.search, pageIndex: pageIndex, pageSize: pageSize }));
            } else {
                    notification.error({
                    message: 'Thông báo',
                    description: 'Thêm học viên vào khóa học thất bại', 
                });
            }
        };
        const listStudent = {
            hoc_vien_id: id_hoc_vien.toString()
        };
        dispatch(courseActions.addStudentToCourse({ data: listStudent, idCourse: state.idCourse }, callback));
    };

    const onSubmitAddListStudentToCourse = () => {
        const callback = (res) => {
            if (res.status === 200 && res.statusText === 'OK' && res.data.status === 'success') {
                    notification.success({
                    message: 'Thành công',
                    description: 'Thêm học viên vào khóa học thành công', 
                });
                setSelectedRowKeys([]);
                if (state.activeTab === '3')
                    dispatch(courseActions.getRemainStudentOfCourse({ idCourse: state.idCourse, province: filter.tinh, search: filter.search, pageIndex: pageIndex, pageSize: pageSize }));
            } else {
                    notification.error({
                    message: 'Thông báo',
                    description: 'Thêm học viên vào khóa học thất bại', 
                });
            }
        };
        
        if (selectedRowKeys.length === 0) {
            notification.warning({
                message: 'Thông báo',
                description: 'Bạn chưa chọn học viên nào', 
            });
            return;
        }
        const listStudent = {
            hoc_vien_id: selectedRowKeys.join(',')
        };
        dispatch(courseActions.addStudentToCourse({ data: listStudent, idCourse: state.idCourse }, callback));
    };

    return (
        <div className='content'>
            <Col xl={24} className="body-content">
                <Row className="app-main">
                    <Col xl={24} sm={24} xs={24}>
                        <AppFilter
                            title="Quản lý khóa học - học viên"
                            isShowSearchBox={true}
                            isSearchProvinces={state.activeTab === '2' ||  state.activeTab === '3' ? true : false}
                            provinces={province.length > 0 ? province: []}
                            onFilterChange={(field, value) => onFilterChange(field, value)}
                        />
                    </Col>
                </Row>
                {(state.activeTab === '2' && dataDetail.length > 0) && 
                    <ExcelFile element={<Button type='primary'>Trích xuất file</Button>} filename={'Danh sách học viên'}>
                        <ExcelSheet data={dataDetail} name={'Danh sách học viên'}>
                            <ExcelColumn label="Họ tên" value="ho_ten"/>
                            <ExcelColumn label="Email" value="email"/>
                            <ExcelColumn label="Số điện thoại" value="sdt"/>
                            <ExcelColumn label="Trường học" value="truong_hoc"/>
                            <ExcelColumn label="Tỉnh/Thành phố" value="tinh"/>
                        </ExcelSheet>
                    </ExcelFile>
                }
                {state.activeTab === '3' &&
                    <Button onClick={() => onSubmitAddListStudentToCourse()} type="primary">Thêm học viên</Button>
                }
            </Col>
            <Tabs defaultActiveKey={state.activeTab} activeKey={state.activeTab} onChange={onChangeTab}>
                <TabPane tab="Quản lý khóa học - học viên" key="1">
                    <Table className="table-striped-rows" columns={columns} dataSource={data} pagination={false}/>
                    <br/>
                    <Pagination current={pageIndex} onChange={onChange} total={courseStudent.totalCount} onShowSizeChange={onShowSizeChange} defaultPageSize={pageSize}/>
                </TabPane>
                <TabPane tab="Chi tiết khóa học" disabled key="2">
                    <Table className="table-striped-rows" columns={columns2} dataSource={dataDetail} pagination={false} />
                    <br/>
                    <Pagination current={pageIndex} onChange={onChange} total={studentofCourse.totalCount} onShowSizeChange={onShowSizeChange} defaultPageSize={pageSize}/>
                </TabPane>
                <TabPane tab="Thêm học viên" disabled key="3">
                    <Table className="table-striped-rows" columns={columns3} dataSource={remainData} pagination={false} rowSelection={rowSelection}/>
                    <br/>
                    <Pagination current={pageIndex} onChange={onChange} total={remainStudentofCourse.totalCount} onShowSizeChange={onShowSizeChange} defaultPageSize={pageSize}/>
                </TabPane>
            </Tabs>  
        </div>
    )
};

export default CourseStudentPage;