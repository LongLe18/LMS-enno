import React, { useState } from "react";

// hooks
import useFetch from "hooks/useFetch";

// component
import { Tabs, Row, Col, Table, Space, Button, Tag } from 'antd';
import AppFilter from "components/common/AppFilter";

const { TabPane } = Tabs;

const StatisticTeacher = (props) => {
    const [data] = useFetch('/teacher/statistical');
    
    const [state, setState] = useState({
        isEdit: false,
        idTeacher: '',
        activeTab: "1",
    });

    const [detail] = useFetch(`/modun/statistical/${state.idTeacher}`);

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
            title: 'Số mô-đun',
            dataIndex: 'so_mo_dun',
            key: 'so_mo_dun',
            responsive: ['md'],
        },
        {
            title: 'Số khóa học',
            dataIndex: 'so_khoa_hoc',
            key: 'so_khoa_hoc',
            responsive: ['md'],
        },
        {
            title: 'Tùy chọn',
            key: 'giao_vien_id',
            dataIndex: 'giao_vien_id',
            // Redirect view for edit
            render: (giao_vien_id) => (
                <Space size="middle">
                    <Button type="button" onClick={() => detailStatistic(giao_vien_id)} className="ant-btn ant-btn-round ant-btn-primary">Chi tiết</Button>
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
            title: 'Tên mô-đun',
            dataIndex: 'ten_mo_dun',
            key: 'ten_mo_dun',
            responsive: ['md'],
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
                <Tag color={trang_thai === 1 ? 'green' : 'red'} key={trang_thai}>
                    {trang_thai === 1 ? "Đang hoạt động" : "Đã dừng"}
                </Tag>
            ),
        },
        {
            title: 'Số học viên khoá học',
            dataIndex: 'so_hoc_vien',
            key: 'so_hoc_vien',
            responsive: ['md'],
        },
        // {
        //     title: 'Số học viên đạt yêu cầu',
        //     dataIndex: 'so_luong',
        //     key: 'so_luong',
        //     responsive: ['md'],
        // },
    ];

    const detailStatistic = (id) => {
        setState({...state, activeTab: "2", idTeacher: id });
    };
    
    const onChangeTab = (value) => {
        setState({...state, activeTab: value});
    };
    
    return (
        <>
            <div className='content'>
                <Col xl={24} className="body-content">
                    <Row className="app-main">
                        <Col xl={24} sm={24} xs={24}>
                            <AppFilter
                                title="Thống kê giáo viên"
                                isShowStatus={false}
                                isShowSearchBox={false}
                                isShowDatePicker={false}
                                isRangeDatePicker={false}
                                dataExportStatisticTeacher={data}
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
        </>
    )
};

export default StatisticTeacher;