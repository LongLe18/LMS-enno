import React, { useState } from 'react';

// helper
import moment from "moment";
import config from '../../../../configs/index';

// hooks
import useFetch from 'hooks/useFetch';

// component
import { Tabs, Row, Col, Table, Space, Button, Tag } from 'antd';
import AppFilter from "components/common/AppFilter";

const { TabPane } = Tabs;

const StatisticCourse = (props) => {
    
    const [state, setState] = useState({
        isEdit: false,
        idCourse: '',
        activeTab: "1",
    });

    const [filter, setFilter] = useState({
        trang_thai: '',
        search: '',
        kct_id: '',
    });

    const [data] = useFetch(`/course/statistical?trang_thai=${filter.trang_thai}&kct_id=${filter.kct_id}&search=${filter.search}`);
    const [detail] = useFetch(`/student/of_course/${state.idCourse}`);

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
            title: 'Khung chương trình',
            dataIndex: 'ten_khung_ct',
            key: 'ten_khung_ct',
            responsive: ['md'],
        },
        {
            title: 'Ngày bắt đầu',
            dataIndex: 'ngay_bat_dau',
            key: 'ngay_bat_dau',
            responsive: ['md'],
            render: (ngay_bat_dau) => (
                moment(ngay_bat_dau).utc(7).format(config.DATE_FORMAT_SHORT)
            )
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'ngay_ket_thuc',
            key: 'ngay_ket_thuc',
            responsive: ['md'],
            render: (ngay_ket_thuc) => (
                moment(ngay_ket_thuc).utc(7).format(config.DATE_FORMAT_SHORT)
            )
        },
        {
            title: 'Số lượng',
            dataIndex: 'so_luong',
            key: 'so_luong',
            responsive: ['md'],
        },
        {
            title: 'Trạng thái',
            dataIndex: 'trang_thai',
            key: 'trang_thai',
            responsive: ['md'],
            render: (trang_thai) => (
                <Tag color={trang_thai === 1 ? 'green' : 'red'} key={trang_thai}>
                    {trang_thai === 1 ? "Đang hoạt động" : "Đã dừng"}
                </Tag>
            ),
        },
        {
            title: 'Tùy chọn',
            key: 'khoa_hoc_id',
            dataIndex: 'khoa_hoc_id',
            // Redirect view for edit
            render: (khoa_hoc_id) => (
                <Space size="middle">
                    <Button type="button" onClick={() => detailStatistic(khoa_hoc_id)} className="ant-btn ant-btn-round ant-btn-primary">Chi tiết</Button>
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
            title: 'Tên học viên',
            dataIndex: 'ho_ten',
            key: 'ho_ten',
            responsive: ['md'],
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'ngay_sinh',
            key: 'ngay_sinh',
            responsive: ['md'],
            render: (ngay_sinh) => (
                ngay_sinh !== null ? moment(ngay_sinh).utc(7).format(config.DATE_FORMAT_SHORT) : ''
            )
        },
        {
            title: 'Số chuyên đề chưa học',
            dataIndex: 'so_chuyen_de_chua_hoc',
            key: 'so_chuyen_de_chua_hoc',
            responsive: ['md'],
        },
        {
            title: 'Số chuyên đề đã học',
            dataIndex: 'so_chuyen_de_da_hoc',
            key: 'so_chuyen_de_da_hoc',
            responsive: ['md'],
        },
        {
            title: 'Tiến độ',
            dataIndex: 'tien_do',
            key: 'tien_do',
            responsive: ['md'],
        },
    ];

    const detailStatistic = (id) => {
        setState({...state, activeTab: "2", idCourse: id });
        // call api get detail statistic course
    };

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
        setState({...state, activeTab: value});
    };

    return (
        <div className='content'>
            <Col xl={24} className="body-content">
                <Row className="app-main">
                    <Col xl={24} sm={24} xs={24}>
                        <AppFilter
                            title="Thống kê khóa học"
                            placeholder="Tìm kiếm theo tên khóa học"
                            isShowStatus={state.activeTab === "1" ? true : false}
                            isShowSearchBox={state.activeTab === "1" ? true : false}
                            isShowDatePicker={false}
                            isRangeDatePicker={false}
                            onFilterChange={(field, value) => onFilterChange(field, value)}
                        />
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
    )
};

export default StatisticCourse;