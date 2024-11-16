import React, { useState, useEffect } from "react";

// helper
import config from '../../../../configs/index';
import axios from 'axios';
import defaultImage from 'assets/img/default.jpg';

// component
import { Tabs, Row, Col, Table, Space, Button, notification, Tag, Avatar } from 'antd';
import AppFilter from "components/common/AppFilter";

// hooks
import useFetch from "hooks/useFetch";

// redux
import * as courseActions from '../../../../redux/actions/course';
import { useSelector, useDispatch } from "react-redux";

const { TabPane } = Tabs;

const StatisticStudent = (props) => {
    const dispatch = useDispatch();
    const [detail, setDetail] = useState([]);
    const PropStatusFilter = [
        {
            title: 'Tất cả trạng thái',
            value: '',
        },
        {
          title: 'Chưa mua',
          value: 0,
        },
        {
          title: 'Đã mua',
          value: 1,
        },
    ];
    const courses = useSelector(state => state.course.list.result);

    const [state, setState] = useState({
        isEdit: false,
        idStudent: '',
        activeTab: "1",
        student: {},
    });

    const [filter, setFilter] = useState({
        trang_thai: '',
        khoa_hoc_id: '',
        search: '',
    });

    const columns = [
        {
            title: 'STT',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Họ tên',
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
            title: 'Khóa học',
            dataIndex: 'ten_khoa_hoc',
            key: 'ten_khoa_hoc',
            responsive: ['md'],
        },
        {
            title: 'Tùy chọn',
            key: 'hoc_vien_id',
            dataIndex: 'hoc_vien_id',
            // Redirect view for edit
            render: (hoc_vien_id, item) => (
                <Space size="middle">
                    <Button type="button" onClick={() => detailStatistic(hoc_vien_id, item)} className="ant-btn ant-btn-round ant-btn-primary">Chi tiết</Button>
                </Space>
            ),
        },
    ];

    const columns2 = [
        {
            title: 'STT',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Ảnh đại diện',
            dataIndex: 'anh_dai_dien',
            key: 'anh_dai_dien',
            responsive: ['lg'],
            render: (src) => (
              <Avatar src={src !== null ? config.API_URL + src : defaultImage} size={50} shape='circle' />
            )
        },
        {
            title: 'Tên khóa học',
            dataIndex: 'ten_khoa_hoc',
            key: 'ten_khoa_hoc',
            responsive: ['md'],
        },
        {
            title: 'Trạng thái',
            dataIndex: 'trang_thai',
            key: 'trang_thai',
            responsive: ['md'],
            render: (trang_thai) => (
                <Tag color={(trang_thai === 1 || trang_thai === 0) ? 'green' : 'red'} key={trang_thai}>
                    {(trang_thai === 1 || trang_thai === 0) ? "Đã mua" : "Chưa mua"}
                </Tag>
            ),
        },
    ];

    const [data] = useFetch(`/student/statistical?trang_thai=&khoa_hoc_id=${filter.khoa_hoc_id}&search=${filter.search}`);

    const getStatisTicDetail = (id, object) => {
        const token = localStorage.getItem('userToken');
        axios.get(config.API_URL + `/course/by_user/v2/${id}?trang_thai=${filter.trang_thai}`, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'}})
            .then(
                res => {
                    if (res.status === 200 && res.statusText === 'OK') {
                        setDetail(res.data.data.map((item, index) => ({...item, key: index, ho_ten: object.ho_ten})));
                    } else {
                        notification.error({
                            message: 'Lỗi',
                            description: 'Có lỗi xảy ra khi lấy dữ liệu',
                        })
                    }
                }
            )
            .catch(error => notification.error({ message: error.message }));
    };

    const getStatisTicDetail2 = (id, object) => {
        const token = localStorage.getItem('userToken');
        axios.get(config.API_URL + `/course/by_user/v2/${id}?trang_thai=`, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'}})
            .then(
                res => {
                    if (res.status === 200 && res.statusText === 'OK') {
                        setDetail(res.data.data.map((item, index) => ({...item, key: index, ho_ten: object.ho_ten})));
                    } else {
                        notification.error({
                            message: 'Lỗi',
                            description: 'Có lỗi xảy ra khi lấy dữ liệu',
                        })
                    }
                }
            )
            .catch(error => notification.error({ message: error.message }));
    };

    const getStatisTicDetailFilter = (id, object) => {
        const token = localStorage.getItem('userToken');
        axios.get(config.API_URL + `/course/by_user/v2/${id}?trang_thai=`, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'}})
            .then(
                res => {
                    if (res.status === 200 && res.statusText === 'OK') {
                        let temp = res.data.data.filter(item => item.trang_thai === null);
                        setDetail(temp.map((item, index) => ({...item, key: index, ho_ten: object.ho_ten})));
                    } else {
                        notification.error({
                            message: 'Lỗi',
                            description: 'Có lỗi xảy ra khi lấy dữ liệu',
                        })
                    }
                }
            )
            .catch(error => notification.error({ message: error.message }));
    };

    useEffect(() => {
        // call get statistic course
        dispatch(courseActions.getCourses({ idkct: '', status: '', search: '' }));
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

    useEffect(() => {
        // call get statistic course
        if (filter.trang_thai === 1)
            getStatisTicDetail(state.idStudent, state.student);
        else if (filter.trang_thai === '') 
            getStatisTicDetail2(state.idStudent, state.student)
        else if (filter.trang_thai === 0)
            getStatisTicDetailFilter(state.idStudent, state.student)
    }, [filter.trang_thai]); // eslint-disable-line react-hooks/exhaustive-deps

    const onChangeTab = (value) => {
        setState({...state, activeTab: value});
    };

    const detailStatistic  = (id, item) => {
        setState({...state, activeTab: "2", idStudent: id, student: item });
        // call api get detail statistic course
        getStatisTicDetail(id, item);
    };

    return (
        <>
            <div className="content">
                <Col xl={24} className="body-content">
                    <Row className="app-main">
                        <Col xl={24} sm={24} xs={24}>
                                <>
                                    <AppFilter
                                        title="Thống kê học viên"
                                        totalStudent={data.length}
                                        isShowStatus={state.activeTab === '2' ? true : false}
                                        status={PropStatusFilter}
                                        isShowCourse={state.activeTab === '2' ? false : true}
                                        courses={courses.data}
                                        isShowSearchBox={state.activeTab === '2' ? false : true}
                                        isShowDatePicker={false}
                                        isRangeDatePicker={false}
                                        dataExportStatisticStudent={state.activeTab === '2' && detail}
                                        onFilterChange={(field, value) => onFilterChange(field, value)}
                                    />
                                </>
                        </Col>
                    </Row>
                </Col>
                <Tabs defaultActiveKey={state.activeTab} activeKey={state.activeTab} onChange={onChangeTab}>
                    <TabPane tab="Thống kê khóa học" key="1">
                        <Table className="table-striped-rows" columns={columns} dataSource={data} />
                    </TabPane>
                    <TabPane tab="Chi tiết Thống kê khóa học" disabled key="2">
                        <Table className="table-striped-rows" columns={columns2} dataSource={detail} />
                    </TabPane>
                </Tabs>      
            </div>
        </>
    )
};

export default StatisticStudent;