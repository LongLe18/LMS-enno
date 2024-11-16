import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

// helper
import moment from "moment";
import config from '../../../../configs/index';

// component
import { Table, Tag, Space, Button, notification, Col, Row, Modal} from 'antd';
import { SwapOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import AppFilter from "components/common/AppFilter";
import * as CurrencyFormat from 'react-currency-format';

// redux
import * as receiptAction from '../../../../redux/actions/receipt';
import { useSelector, useDispatch } from "react-redux";

const ReceiptPage = (props) => {
    const data = [];
    const history = useHistory();
    const dispatch = useDispatch();
    const PropStatusFilter = [
        {
          title: 'Tất cả trạng thái',
          value: '',
        },
        {
          title: 'Đã xử lý',
          value: 1,
        },
        {
          title: 'Chưa xử lý',
          value: 0,
        },
    ];
    const currentDate = new Date();

    const [filter, setFilter] = useState({
        trang_thai: '',
        search: '',
        start: '',
        end: '',
        khoa_hoc_id: '',
    });

    const receipts = useSelector(state => state.receipt.list.result);
    const receiptsDetail = useSelector(state => state.receipt.listDetail.result);

    useEffect(() => {
        dispatch(receiptAction.getRECEIPTs({ status: filter.trang_thai, search: filter.search, start: filter.start, end: filter.end }));
        dispatch(receiptAction.getRECEIPTsDetail({ idType: '' }));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (receipts.status === 'success' && receiptsDetail.status === 'success') {
        receipts.data.map((receipt, index) => {
            receiptsDetail.data.map((item, index2) => {
                if (item.hoa_don_id === receipt.hoa_don_id) {
                    receipt.tong_tien = item.tong_tien;
                    receipt.ten_san_pham = item.ten_san_pham;
                    receipt.loai_san_pham = item.loai_san_pham;
                    receipt.key = index;
                }
                return null;
            });
            data.push({...receipt});
            return null;
        });
    };
    
    const columns = [
        {
            title: 'Mã hóa đơn',
            dataIndex: 'hoa_don_ma',
            key: 'hoa_don_ma',
            responsive: ['md'],
        },
        {
            title: 'Tên học viên',
            dataIndex: 'ten_hoc_vien',
            key: 'ten_hoc_vien',
            responsive: ['md'],
        },
        {
            title: 'Email/SĐT',
            dataIndex: 'ten_hoc_vien',
            key: 'ten_hoc_vien',
            responsive: ['md'],
            render: (ten_hoc_vien, hoa_don) => (
                <div>
                    <span>{hoa_don.email}</span>
                    <br/>
                    <span>{hoa_don.so_dien_thoai}</span>
                </div>
            )
        },
        {
          title: 'Tên nhân viên',
          dataIndex: 'ten_nhan_vien',
          key: 'ten_nhan_vien',
          responsive: ['md'],
        },
        {
            title: 'Trạng thái',
            dataIndex: 'trang_thai',
            key: 'trang_thai',
            responsive: ['md'],
            render: (trang_thai) => (
                <Tag color={trang_thai === 1 ? 'green' : trang_thai === 2 ? 'orange' : 'red'} key={trang_thai}>
                    {trang_thai === 1 ? "Đã xử lý" : trang_thai === 2 ? 'Đang xử lý' : "Chưa xử lý"}
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
            title: 'Ngày hết hạn',
            dataIndex: 'ngay_tao',
            key: 'ngay_tao',
            responsive: ['md'],
            render: (date) => (
                <span style={{ color: currentDate.getTime() > new Date(new Date(date).getTime() + 1000 * 60 * 60 * 24 * 2).getTime() ? 'red' : '' }}>
                    {moment(new Date(new Date(date).getTime() + 1000 * 60 * 60 * 24 * 2).toISOString()).utc(7).format(config.DATE_FORMAT_SHORT)}
                </span>
            )
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'tong_tien',
            key: 'tong_tien',
            responsive: ['md'],
            render: (tong_tien) => (
                <CurrencyFormat 
                    value={tong_tien !== null ? tong_tien : 0}
                    displayType={'text'} thousandSeparator={true}
                />
            )
        },
        {
          title: 'Tùy chọn',
          key: 'hoa_don_id',
          dataIndex: 'hoa_don_id',
          responsive: ['md'],
          // Redirect view for edit
          render: (hoa_don_id, hoa_don) => (
            <Space size="middle">
                <Button title="Xem chi tiết hóa đơn" type="button" onClick={() => history.push(`/admin/business/detailreceipt/${hoa_don_id}`)} className="ant-btn ant-btn-round ant-btn-primary">Chi tiết</Button>
                <Button title="Cập nhật trạng thái hóa đơn" type="button" onClick={() => handleEdit(hoa_don_id, hoa_don)} className="ant-btn ant-btn-round ant-btn-primary" icon={<SwapOutlined />}></Button>
                <Button title="Xóa hóa đơn" type="button" onClick={() => handleDelete(hoa_don_id)} danger className="ant-btn ant-btn-round ant-btn-primary">Xóa</Button>
            </Space>
          ),
        },
    ];

    const handleDelete = (hoa_don_id) => {
        Modal.confirm({
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn có chắc chắn muốn xóa tiêu chí này?',
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            onOk() {
                const callback = (res) => {
                    if (res.statusText === 'OK' && res.status === 200) {
                        dispatch(receiptAction.getRECEIPTs({ status: filter.trang_thai, search: filter.search, start: filter.start, end: filter.end }));
                        notification.success({
                            message: 'Thành công',
                            description: 'Xóa hóa đơn thành công',
                        })
                    } else {
                        notification.error({
                            message: 'Thông báo',
                            description: 'Xóa hóa đơn thất bại',
                        })
                    };
                }
                dispatch(receiptAction.DeleteRECEIPT({ id: hoa_don_id }, callback))
            },
        });
    };
  
    const handleEdit = (hoa_don_id, hoa_don) => {
        const callback = (res) => {
            if (res.status === 200 && res.statusText === 'OK') {
                dispatch(receiptAction.getRECEIPTs({ status: filter.trang_thai, search: filter.search, start: filter.start, end: filter.end }));
                notification.success({
                    message: 'Thành công',
                    description: 'Xử lý hóa đơn thành công',
                })
            } else {
                notification.error({
                    message: 'Thất bại',
                    description: 'Xử lý hóa đơn thất bại',
                })
            }
        }
        const data = {
            "trang_thai": !hoa_don.trang_thai
        }
        dispatch(receiptAction.changeStaRECEIPT({ id: hoa_don_id, formData: data }, callback))
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

    useEffect(() => {
        dispatch(receiptAction.getRECEIPTs({ status: filter.trang_thai, search: filter.search, start: filter.start, end: filter.end }));
    }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="content">
            <Col xl={24} className="body-content">
                <Row className="app-main">
                    <Col xl={24} sm={24} xs={24}>
                        <AppFilter
                            title="Quản lý hóa đơn"
                            status={PropStatusFilter}
                            dataExportReceipt={data.length > 0 ? data : []}
                            isShowStatus={true}
                            isShowCourse={false}
                            isShowSearchBox={true}
                            isShowDatePicker={true}
                            isRangeDatePicker={true}
                            onFilterChange={(field, value) => onFilterChange(field, value)}
                        />
                    </Col>
                </Row>
            </Col>
            <br/>
            <Table className="table-striped-rows" columns={columns} dataSource={data} />
        </div>
    )
}

export default ReceiptPage;