import React, { useState, useEffect } from "react";

// helper
import moment from "moment";
import config from '../../../../configs/index';

// component
import { Tabs, Row, Col, Table, Space, Button, Tag, notification, Modal } from 'antd';
import { ExclamationCircleOutlined, } from '@ant-design/icons';
import AppFilter from "components/common/AppFilter";
import * as CurrencyFormat from 'react-currency-format';

// redux
import * as dealerAction from '../../../../redux/actions/dealer';
import { useSelector, useDispatch } from "react-redux";

const { TabPane } = Tabs;

const DealerTeacherPage = (props) => {

    const data = [];
    const dataDetail = [];
    const PropStatusFilter = [
        {
          title: 'Tất cả trạng thái',
          value: '',
        },
        {
          title: 'Đã quyết toán',
          value: 1,
        },
        {
          title: 'Chưa quyết toán',
          value: 0,
        },
    ];
    const dispatch = useDispatch();
    const dealersTeacher = useSelector(state => state.dealer.list.result);
    const dealersDetailTeacher = useSelector(state => state.dealer.listDetail.result);
    
    const [state, setState] = useState({
        isEdit: false,
        idTeacher: '',
        activeTab: "1",
    });
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [filter, setFilter] = useState({
        trang_thai: '',
        search: '',
        start: '',
        end: '',
    });

    useEffect(() => {
        dispatch(dealerAction.getDealersTeacher());
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (dealersTeacher.status === 'success') {
        dealersTeacher.data.map((item, index) => {
            data.push({...item, key: index});
            return null;
        })
    };

    if (dealersDetailTeacher.status === 'success') {
        dealersDetailTeacher.data.map((item, index) => {
            dataDetail.push({...item, key: item.chiet_khau_chi_tiet_id});
            return null;
        })
    };

    const columns = [
        {
            title: 'STT',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Giáo viên',
            dataIndex: 'ho_ten',
            key: 'ho_ten',
            responsive: ['md'],
        },
        {
            title: 'Số lượng đã bán',
            dataIndex: 'sl_ma_da_ban',
            key: 'sl_ma_da_ban',
            responsive: ['md'],
        },
        {
            title: 'Số lượng chưa bán',
            dataIndex: 'sl_ma_chua_ban',
            key: 'sl_ma_chua_ban',
            responsive: ['md'],
        },
        {
            title: 'Tùy chọn',
            key: 'giao_vien_id',
            dataIndex: 'giao_vien_id',
            // Redirect view for edit
            render: (giao_vien_id) => (
                <Space size="middle">
                    <Button onClick={() => detailDealer(giao_vien_id)} type="button" className="ant-btn ant-btn-round ant-btn-primary">Chi tiết</Button>
                    {/* <Button  type="button" className="ant-btn ant-btn-round ant-btn-primary">Sửa</Button>
                    <Button  type="button" danger className="ant-btn ant-btn-round ant-btn-primary">Xóa</Button> */}
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
            title: 'Giáo viên',
            dataIndex: 'ho_ten',
            key: 'ho_ten',
            responsive: ['md'],
        },
        {
            title: 'Email/SĐT',
            dataIndex: 'email',
            key: 'email',
            responsive: ['md'],
            render: (email, record) => (
                <div>
                    <span>{record.email}</span>
                    <br/>
                    <span>{record.sdt}</span>
                </div>
            )
        },
        {
            title: 'Tên khóa học',
            dataIndex: 'ten_khoa_hoc',
            key: 'ten_khoa_hoc',
            responsive: ['md'],
        },
        {
            title: 'Mã chiết khấu',
            dataIndex: 'chiet_khau_ma',
            key: 'chiet_khau_ma',
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
            title: 'Ngày tạo',
            dataIndex: 'ngay_tao',
            key: 'ngay_tao',
            responsive: ['md'],
            render: (date) => (
                moment(date).utc(7).format(config.DATE_FORMAT_SHORT)
            )
        },
        {
            title: 'Tiền chiết khấu',
            dataIndex: 'tien_chiet_khau',
            key: 'tien_chiet_khau',
            responsive: ['md'],
            render: (tien_chiet_khau) => (
                <CurrencyFormat 
                    value={tien_chiet_khau} 
                    displayType={'text'} thousandSeparator={true} suffix={'VNĐ'}
                />
            )
        },
        {
            title: 'Tùy chọn',
            key: 'chiet_khau_chi_tiet_id',
            dataIndex: 'chiet_khau_chi_tiet_id',
            // Redirect view for edit
            render: (chiet_khau_chi_tiet_id) => (
                <Space size="middle">
                    <Button onClick={() => QuyetToan(chiet_khau_chi_tiet_id)} type="button" className="ant-btn ant-btn-round ant-btn-primary">Quyết toán</Button>
                </Space>
            ),
        },
    ];

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
        if (state.idTeacher !== '')
            dispatch(dealerAction.getDealersDetailTeacher({ id: state.idTeacher, status: filter.trang_thai, start: filter.start, end: filter.end, search: filter.search }));
    }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

    const detailDealer = (id) => {
        setState({...state, activeTab: "2", idTeacher: id });
        dispatch(dealerAction.getDealersDetailTeacher({ id: id, status: filter.trang_thai, start: filter.start, end: filter.end, search: filter.search }));
    };

    const onChangeTab = (value) => {
        setState({...state, activeTab: value});
    };

    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    //// Quyết toán
    const handleSettlement = () => {
        if (selectedRowKeys.length === 0) {
            notification.warning({
                message: 'Thông báo',
                description: 'Bạn chưa chọn chiết khấu nào!',
            })
            return;
        }
        else {
            let bool = false;
            selectedRowKeys.map(item => {
                dealersDetailTeacher.data.map((dealer, index) => {
                    if (item === dealer.chiet_khau_chi_tiet_id) {
                        if (dealer.trang_thai_su_dung === 0) bool = true;
                    }
                    return null;
                });
                return null;
            })
            if (bool === true) {
                notification.warning({
                    message: 'Thông báo',
                    description: 'Danh sách chiết khấu có chiết khấu chưa sử dụng!',
                })
                return;
            }
        }

        Modal.confirm({
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn có chắc chăn muốn quyết toán chiết khấu này?',
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            onOk() {
                const callback = (res) => {
                    if (res.status === 'success') {
                        dispatch(dealerAction.getDealersDetailTeacher({ id: state.idTeacher, status: filter.trang_thai, start: filter.start, end: filter.end, search: filter.search }));
                        notification.success({
                            message: 'Thành công',
                            description: 'Quyết toán thành công',
                        });
                        /// download excel file
                        setSelectedRowKeys([]);
                    } else {
                        notification.error({
                            message: 'Thông báo',
                            description: 'Quyết toán thất bại',
                        })
                    };
                }
                const data = {
                    gia_tri: selectedRowKeys
                }
                dispatch(dealerAction.changeStaDealerDetail(data, callback))
            },
        });
    };

    const QuyetToan = (id) => {
        let bool = false;
        dealersDetailTeacher.data.map((dealer, index) => {
            if (id === dealer.chiet_khau_chi_tiet_id) {
                if (dealer.trang_thai_su_dung === 0) bool = true;
            }
            return null;
        });

        if (bool === true) {
            notification.warning({
                message: 'Thông báo',
                description: 'Chiết khấu chưa được sử dụng không thể quyết toán!',
            })
            return;
        }   

        Modal.confirm({
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn có chắc chăn muốn quyết toán chiết khấu này?',
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            onOk() {
                const callback = (res) => {
                    if (res.status === 'success') {
                        dispatch(dealerAction.getDealersDetailTeacher({ id: state.idTeacher, status: filter.trang_thai, start: filter.start, end: filter.end, search: filter.search }));
                        notification.success({
                            message: 'Thành công',
                            description: 'Quyết toán thành công',
                        });
                    } else {
                        notification.error({
                            message: 'Thông báo',
                            description: 'Quyết toán thất bại',
                        })
                    };
                }
                const data = {
                    gia_tri: id
                }
                dispatch(dealerAction.changeStaDealerDetail(data, callback))
            },
        });
    };

    return (
        <div className="content">
            <Col xl={24} className="body-content">
                <Row className="app-main">
                    <Col xl={24} sm={24} xs={24}>
                        <AppFilter
                            title="Quản lý đại lý"
                            dataExportReceiptTeacher={dataDetail.length > 0 ? dataDetail : []}
                            status={PropStatusFilter}
                            placeholder="Tìm kiếm theo mã chiết khấu"
                            isShowStatus={state.activeTab === "2" ? true : false}
                            isShowSearchBox={state.activeTab === "2" ? true : false}
                            isShowDatePicker={state.activeTab === "2" ? true : false}
                            isRangeDatePicker={state.activeTab === "2" ? true : false}
                            onFilterChange={(field, value) => onFilterChange(field, value)}
                        />
                    </Col>
                </Row>
            </Col>
            
            <Tabs defaultActiveKey={state.activeTab} activeKey={state.activeTab} onChange={onChangeTab}>
                <TabPane tab="Quản lý đại lý" key="1">
                    <Table className="table-striped-rows" columns={columns} dataSource={data} />
                </TabPane>
                <TabPane tab="Chi tiết đại lý" disabled key="2">
                    <>
                        <Table className="table-striped-rows" columns={columns2} dataSource={dataDetail} rowSelection={rowSelection}/>
                        <Row>
                            <Button type="primary" onClick={() => handleSettlement()}>Quyết toán</Button>
                        </Row>
                    </>
                </TabPane>
            </Tabs>
        </div>
    )
}

export default DealerTeacherPage;