import React, { useState, useEffect }  from "react";
import { useParams } from "react-router-dom";

// helper
import moment from "moment";
import config from '../../../../configs/index';

// component
import { Row, Col, Table, Form, notification, Tag, Space, 
    Button, Select, Input, Modal } from 'antd';
import { ExclamationCircleOutlined, } from '@ant-design/icons';
import AppFilter from "components/common/AppFilter";

// redux
import * as dealerAction from '../../../../redux/actions/dealer';
import { useSelector, useDispatch } from "react-redux";

const { Option } = Select;

const DetailDealerPage = (props) => {
    const idDealer = useParams().id;
    const data = [];
    const [form] = Form.useForm();
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
            title: 'Tạm Ngưng sử dụng',
            value: 2,
          },
    ];
    const dispatch = useDispatch();

    const dealersDetail = useSelector(state => state.dealer.listDetail.result);
    const dealerDetail = useSelector(state => state.dealer.itemDetail.result);
    const dealer = useSelector(state => state.dealer.item.result);

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [state, setState] = useState({
        isEdit: false,
        idDealerDetail: 0,
    });

    const [filter, setFilter] = useState({
        trang_thai: '',
        search: '',
        start: '',
        end: '',
    });
  

    useEffect(() => {
        dispatch(dealerAction.getDealersDetail({ status: filter.trang_thai }));
        dispatch(dealerAction.getDealer({ id: idDealer }));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (dealersDetail.status === 'success' && dealer.status === 'success') {
        console.log(dealersDetail.data);
        dealersDetail.data.map((item, index) => {
            if (item.chiet_khau_id === Number(idDealer)) {
                data.push({...item, key: item.chiet_khau_chi_tiet_id});
            }
            return null;
        });
    };

    

    const columns = [
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
            title: 'Trạng thái sử dụng',
            dataIndex: 'trang_thai_su_dung',
            key: 'trang_thai_su_dung',
            responsive: ['md'],
            render: (trang_thai) => (
                <Tag color={trang_thai === 0 ? 'green' : trang_thai === 1 ? 'red' : 'orange'} key={trang_thai}>
                    {trang_thai === 0 ? "Chưa sử dụng" : trang_thai === 1 ? 'Đã sử dụng' : "Tạm Ngưng sử dụng"}
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
            title: 'Tùy chọn',
            key: 'chiet_khau_chi_tiet_id',
            dataIndex: 'chiet_khau_chi_tiet_id',
            // Redirect view for edit
            render: (chiet_khau_chi_tiet_id) => (
                <Space size="middle">
                <Button  type="button" onClick={() => EditDealerDetail(chiet_khau_chi_tiet_id)} className="ant-btn ant-btn-round ant-btn-primary">Sửa</Button>
                <Button  type="button" onClick={() => DeleteDealerDetail(chiet_khau_chi_tiet_id)} danger className="ant-btn ant-btn-round ant-btn-primary">Xóa</Button>
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
        dispatch(dealerAction.getDealersDetail({ status: filter.trang_thai }));
    }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

    const renderStatus = () => {
        return (
            <Select
                placeholder="Chọn trạng thái"
            >
                <Option value={0} >Chưa sử dụng</Option>
                <Option value={1} >Đã sử dụng</Option>
                <Option value={2} >Ngưng sử dụng</Option>
            </Select>
        );
    };

    const renderStatus2 = () => {
        return (
            <Select
                placeholder="Chọn trạng thái quyết toán"
            >
                <Option value={1} >Đã quyết toán</Option>
                <Option value={0} >Chưa quyết toán</Option>
            </Select>
        );
    };

    const EditDealerDetail = (id) => {
        const callback = (res) => { 
            if (res.status === 'success') {
                form.setFieldsValue(res.data[0]);
                setState({ ...state, isEdit: true, idDealerDetail: id });
                document.getElementsByClassName('cate-form-block')[0].scrollIntoView();
            }
        };
        dispatch(dealerAction.getDealerDetail({ id: id }, callback));
    };

    const cancelEdit = () => {
        setState({ ...state, isEdit: false, idDealerDetail: 0 })
        form.resetFields();
    };

    const DeleteDealerDetail = (id) => {
        Modal.confirm({
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn có chắc chăn muốn xóa chiết khấu này?',
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            onOk() {
                const callback = (res) => {
                    if (res.statusText === 'OK' && res.status === 200) {
                        dispatch(dealerAction.getDealersDetail({ status: filter.trang_thai }));
                        notification.success({
                            message: 'Thành công',
                            description: 'Xóa chiết khấu khóa học thành công',
                        })
                    } else {
                        notification.error({
                            message: 'Thông báo',
                            description: 'Xóa chiết khấu khóa học thất bại',
                        })
                    };
                }
                dispatch(dealerAction.DeleteDealerDetail({ id: id }, callback))
            },
        });
    };

    const submitForm = (values) => {
        const data = {
            "trang_thai_su_dung": values.trang_thai_su_dung,
            "trang_thai_quyet_toan": values.trang_thai_quyet_toan,
            "chiet_khau_ma": values.chiet_khau_ma
        }
        dispatch(dealerAction.EditDealerDetail({ id: state.idDealerDetail, formData: data }, (res) => {
            if (res.status === 200 && res.statusText === 'OK') {
                dispatch(dealerAction.getDealersDetail({ status: filter.trang_thai }));
                notification.success({
                    message: 'Thành công',
                    description: 'Sửa chi tiết chiết khấu khóa học thành công',
                })
            } else {
                notification.error({
                    message: 'Thông báo',
                    description: 'Sửa chi tiết chiết khấu khóa học thất bại',
                })
            }
        }))
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
                dealersDetail.data.map((dealer, index) => {
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
                        dispatch(dealerAction.getDealersDetail({ status: filter.trang_thai }));
                        notification.success({
                            message: 'Thành công',
                            description: 'Quyết toán thành công',
                        });
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

    // Xóa danh sách
    const handleDeleteList = () => {
        if (selectedRowKeys.length === 0) {
            notification.warning({
                message: 'Thông báo',
                description: 'Bạn chưa chọn chiết khấu nào!',
            })
            return;
        }
        Modal.confirm({
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn có chắc chăn muốn Xóa chiết khấu đã chọn?',
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            onOk() {
                const callback = (res) => {
                    console.log(res);
                    if (res.status === 200 && res.statusText === 'OK') {
                        dispatch(dealerAction.getDealersDetail({ status: filter.trang_thai }));
                        notification.success({
                            message: 'Thành công',
                            description: 'Xóa danh sách chiết khấu thành công',
                        });
                        setSelectedRowKeys([]);
                    } else {
                        notification.error({
                            message: 'Thông báo',
                            description: 'Xóa danh sách chiết khấu thất bại',
                        })
                    };
                }
                const data = {
                    gia_tri: selectedRowKeys.join(',')
                }
                dispatch(dealerAction.DeleteDealersDetail(data, callback))
            },
        });
    }
    return (
        <>
            <div className="content">
                <Col xl={24} className="body-content">
                    <Row className="app-main">
                        <Col xl={24} sm={24} xs={24}>
                            <AppFilter
                                title={dealer.status === 'success' ? `Quản lý chiết khấu /${dealer.data[0].ten_khoa_hoc}/ ${dealer.data[0].ho_ten}` : `Quản lý chiết khấu`}
                                dataExportDealer={data ? data : []}
                                buttonBack={true} linkBack={'/admin/business/dealer'}
                                status={PropStatusFilter}
                                isShowStatus={true}
                                isShowSearchBox={false}
                                isShowDatePicker={false}
                                isRangeDatePicker={false}
                                onFilterChange={(field, value) => onFilterChange(field, value)}
                            />
                        </Col>
                    </Row>
                </Col>
                {(data.length > 0) &&
                    <>
                        <Table className="table-striped-rows" columns={columns} dataSource={data} rowSelection={rowSelection}/>
                        <Row>
                            <Space>
                                <Button type="primary" onClick={() => handleSettlement()}>Quyết toán</Button>
                                <Button type="primary" onClick={() => handleDeleteList()} danger>Xóa danh sách chiết khấu</Button>
                            </Space>
                        </Row>
                    </>
                }
                <br/>
                <Row>
                    <Col xl={24} sm={24} xs={24} className="cate-form-block">
                    {(state.isEdit && dealerDetail.status === 'success' && dealerDetail) && 
                        <>
                            <h5>Sửa thông tin chi tiết chiết khấu khóa học</h5> 
                            <Form layout="vertical" className="category-form" form={form} autoComplete="off" onFinish={submitForm}>
                                <Form.Item
                                    className="input-col"
                                    label="Trạng thái sử dụng"
                                    name="trang_thai_su_dung"
                                    rules={[
                                        {
                                            required: state.isEdit,
                                            message: 'Trạng thái sử dụng là trường bắt buộc.',
                                        },
                                    ]}
                                >
                                    {renderStatus()}
                                </Form.Item>
                                <Form.Item
                                    className="input-col"
                                    label="Trạng thái quyết toán"
                                    name="trang_thai_quyet_toan"
                                    rules={[
                                        {
                                            required: state.isEdit,
                                            message: 'Trạng thái quyết toán là trường bắt buộc.',
                                        },
                                    ]}
                                >
                                    {renderStatus2()}
                                </Form.Item>
                                <Form.Item
                                className="input-col"
                                label="Mã Chiết khấu"
                                name="chiet_khau_ma"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Mã Chiết khấu là trường bắt buộc.',
                                    },
                                ]}
                                >
                                    <Input placeholder="Nhập mã chiết khấu"/>
                                </Form.Item>
                                <Form.Item className="button-col">
                                    <Space>
                                        <Button shape="round" type="primary" htmlType="submit" >
                                            Cập nhật
                                        </Button>
                                        <Button shape="round" type="danger" onClick={() => cancelEdit()} > 
                                                Hủy bỏ
                                        </Button>
                                    </Space>    
                            </Form.Item>
                            </Form>
                        </>
                    }                          
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default DetailDealerPage;