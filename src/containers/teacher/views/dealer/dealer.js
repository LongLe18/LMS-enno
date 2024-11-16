import React, { useState } from "react";

// component
import { Tabs, Table, Space, Button, Tag, Col, Row } from 'antd';
import AppFilter from "components/common/AppFilter";
import * as CurrencyFormat from 'react-currency-format';

// hooks
import useFetch from "hooks/useFetch";

const { TabPane } = Tabs;

const DealerTeacherPage = (props) => {
    const PropStatusFilter = [
        {
          title: 'Tất cả trạng thái',
          value: '',
        },
        {
          title: 'Đã sử dụng',
          value: 1,
        },
        {
          title: 'Chưa sử dụng',
          value: 0,
        },
        {
            title: 'Ngưng sử dụng',
            value: 2,
          },
    ];
    const [state, setState] = useState({
        isEdit: false,
        idCourse: '',
        activeTab: "1",
    });

    const [filter, setFilter] = useState({
        trang_thai: '',
        trang_thai_quyet_toan: '',
        khoa_hoc_id: '',
    });
    const [data] = useFetch(`/teacher/dealer/user`);
    const [detail] = useFetch(`/detailed_discount/user?trang_thai_su_dung=${filter.trang_thai}&trang_thai_quyet_toan=${filter.trang_thai_quyet_toan}&khoa_hoc_id=${filter.khoa_hoc_id}`);

    const onChangeTab = (value) => {
        setState({...state, activeTab: value});
    };

    const columns = [
        {
            title: 'STT',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Khóa học',
            dataIndex: 'ten_khoa_hoc',
            key: 'ten_khoa_hoc',
            responsive: ['md'],
        },
        {
            title: 'Chiết khấu (%)',
            dataIndex: 'chiet_khau_gv',
            key: 'chiet_khau_gv',
            responsive: ['md'],
        },
        {
            title: 'Số lượng mã đã sử dụng',
            dataIndex: 'sl_ma_da_ban',
            key: 'sl_ma_da_ban',
            responsive: ['md'],
        },
        {
            title: 'Số lượng mã chưa sử dụng',
            dataIndex: 'sl_ma_chua_ban',
            key: 'sl_ma_chua_ban',
            responsive: ['md'],
        },
        {
            title: 'Tùy chọn',
            key: 'khoa_hoc_id',
            dataIndex: 'khoa_hoc_id',
            // Redirect view for edit
            render: (khoa_hoc_id) => (
                <Space size="middle">
                    <Button type="button" onClick={() => detailDealer(khoa_hoc_id)} className="ant-btn ant-btn-round ant-btn-primary">Chi tiết</Button>
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
            title: 'Mã chiết khấu',
            dataIndex: 'chiet_khau_ma',
            key: 'chiet_khau_ma',
            responsive: ['md'],
        },
        {
            title: 'Khóa học',
            dataIndex: 'ten_khoa_hoc',
            key: 'ten_khoa_hoc',
            responsive: ['md'],
        },
        {
            title: 'Chiết khấu (%)',
            dataIndex: 'chiet_khau_gv',
            key: 'chiet_khau_gv',
            responsive: ['md'],
        },
        {
            title: 'Trạng thái sử dụng',
            dataIndex: 'trang_thai_su_dung',
            key: 'trang_thai_su_dung',
            responsive: ['md'],
            render: (trang_thai) => (
                <Tag color={trang_thai === 0 ? 'green' : trang_thai === 1 ? 'red' : 'orange'} key={trang_thai}>
                    {trang_thai === 0 ? "Chưa sử dụng" : trang_thai === 1 ? 'Đã sử dụng' : "Ngưng sử dụng"}
                </Tag>
            ),
        },
        {
            title: 'Trạng thái quyết toán',
            dataIndex: 'trang_thai_quyet_toan',
            key: 'trang_thai_quyet_toan',
            responsive: ['md'],
            render: (trang_thai) => (
                <Tag color={trang_thai === 1 ? 'red' : 'green'} key={trang_thai}>
                    {trang_thai === 1 ? "Đã quyết toán" : "Chưa quyết toán"}
                </Tag>
            ),
        },
        {
            title: 'Tiền gốc khóa học',
            dataIndex: 'gia_goc',
            key: 'gia_goc',
            responsive: ['md'],
            render: (gia_goc) => (
                <CurrencyFormat 
                    value={gia_goc !== null ? gia_goc : 0} displayType={'text'} thousandSeparator={true} suffix={' VNĐ'}
                />
            )
        },
        {
            title: 'Thực lĩnh',
            dataIndex: 'thuc_linh',
            key: 'thuc_linh',
            responsive: ['md'],
            render: (thuc_linh) => (
                <CurrencyFormat 
                    value={thuc_linh !== null ? thuc_linh : 0} displayType={'text'} thousandSeparator={true} suffix={' VNĐ'}
                />
            )
        },
    ];

    const detailDealer = (khoa_hoc_id) => {
        setState({...state, activeTab: "2", idCourse: khoa_hoc_id });
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

    return (
        <>
            <div className="content">
                <Col xl={24} className="body-content">
                    <Row className="app-main">
                        <Col xl={24} sm={24} xs={24}>
                            <AppFilter
                                title="Đại lý"
                                dataExportDealerTeacher={(detail && state.activeTab === "2") ? detail : []}
                                status={PropStatusFilter}
                                isShowStatus={state.activeTab === "2" ? true : false}
                                isShowSearchBox={false}
                                isShowDatePicker={false}
                                isRangeDatePicker={false}
                                onFilterChange={(field, value) => onFilterChange(field, value)}
                            />
                        </Col>
                    </Row>
                </Col>
                <Tabs defaultActiveKey={state.activeTab} activeKey={state.activeTab} onChange={onChangeTab}>
                    <TabPane tab="Chiết khấu" key="1">
                        <Table className="table-striped-rows" columns={columns} dataSource={data} />
                    </TabPane>
                    <TabPane tab="Chi tiết chiết khấu" disabled key="2">
                        <Table className="table-striped-rows" columns={columns2} dataSource={detail} />
                    </TabPane>
                </Tabs>    
            </div>
        </>
    )
};

export default DealerTeacherPage;