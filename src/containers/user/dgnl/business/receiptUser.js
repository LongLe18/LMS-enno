import React, { useEffect } from "react";
import './css/CourseCates.css';
import './css/business.css';
import './css/Testimonials.css';

import { Helmet } from 'react-helmet';
import { useHistory } from "react-router-dom";

// helper
import moment from "moment";
import config from '../../../../configs/index';

// component
import { Layout, Button, Tag, Space, Table, notification, Modal, } from 'antd';
import { ExclamationCircleOutlined, } from '@ant-design/icons';
import Statisic from 'components/parts/statisic/Statisic';
import NoRecord from "components/common/NoRecord";
import * as CurrencyFormat from 'react-currency-format';

// redux
import { useSelector, useDispatch } from 'react-redux';
import * as receiptAction from '../../../../redux/actions/receipt';

const { Content } = Layout;

const ReceiptUserPage = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();

    const receipts = useSelector(state => state.receipt.list.result);
    const receiptsDetail = useSelector(state => state.receipt.listUser.result);

    useEffect(() => {
        dispatch(receiptAction.getRECEIPTs({ status: '', start: '', end: '', search: '' }));
        dispatch(receiptAction.getRECEIPTsUser({ status: '' }));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (receipts.status === 'success' && receiptsDetail.status === 'success') {
        receiptsDetail.data.map((item, index) => {
            receipts.data.map((receipt, index2) => {
                if (item.hoa_don_id === receipt.hoa_don_id) {
                    item.hoa_don_ma = receipt.hoa_don_ma;
                    item.trang_thai = receipt.trang_thai;
                    item.ngay_lap = receipt.ngay_lap;
                    item.key = index;
                }
                return null;
            })
            return null;
        });
        receiptsDetail.data.sort((objA, objB) => Number(new Date(objB.ngay_tao)) - Number(new Date(objA.ngay_tao)));
        console.log(receiptsDetail.data);
    }

    const columns = [
        {
            title: 'Mã hóa đơn',
            dataIndex: 'hoa_don_ma',
            key: 'hoa_don_ma',
            responsive: ['md'],
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'ten_khoa_hoc',
            key: 'ten_khoa_hoc',
            // responsive: ['md'],
        },
        {
            title: 'Trạng thái thanh toán',
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
            title: 'Tổng tiền',
            dataIndex: 'tong_tien',
            key: 'tong_tien',
            responsive: ['md'],
            render: (tong_tien) => (
                <CurrencyFormat 
                    value={tong_tien !== null ? tong_tien : 0} displayType={'text'} thousandSeparator={true}
                />
            )
        },
        {
            title: 'Tùy chọn',
            key: 'hoa_don_id',
            dataIndex: 'hoa_don_id',
            // Redirect view for edit
            render: (hoa_don_id, hoa_don) => (
                <Space size="middle">
                <Button  type="button" style={{display: hoa_don.trang_thai === 0 ? '' : 'none'}} onClick={() => handlePayment(hoa_don_id, hoa_don)} className="ant-btn ant-btn-round ant-btn-primary" >Thanh toán</Button>
                <Button  type="button" style={{display: hoa_don.trang_thai === 1 ? 'none' : ''}} onClick={() => handleDelete(hoa_don_id)} danger className="ant-btn ant-btn-round ant-btn-primary">Hủy đơn</Button>
                </Space>
            ),
        },
    ];

    const renderReceipts = () => {
        return (
            <div className="list-course-cate">
                <div className="wraper wraper-list-course-cate-index">
                    <h2 className="section-title section-title-center">
                        <b></b>
                            <span className="section-title-main">HÓA ĐƠN CỦA BẠN</span>
                        <b></b>
                    </h2>
                    {(receipts.status === 'success' && receiptsDetail.status === 'success') ?
                        <Table className="table-striped-rows" columns={columns} dataSource={receiptsDetail.data} />
                    : <NoRecord title={'Không còn hóa đơn cần thanh toán'} subTitle={''}/>}
                </div>
        </div>
        )
    };

    const handleDelete = (hoa_don_id) => {
        Modal.confirm({
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn có chắc chăn muốn hủy đơn này?',
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            onOk() {
                const callback = (res) => {
                    if (res.statusText === 'OK' && res.status === 200) {
                        dispatch(receiptAction.getRECEIPTs({ status: '', start: '', end: '', search: '' }));
                        dispatch(receiptAction.getRECEIPTsUser({ status: '' }));
                        notification.success({
                            message: 'Thành công',
                            description: 'Hủy hóa đơn thành công',
                        })
                    } else {
                        notification.error({
                            message: 'Thông báo',
                            description: 'Hủy hóa đơn thất bại',
                        })
                    };
                }
                dispatch(receiptAction.DeleteRECEIPT({ id: hoa_don_id }, callback))
            },
        });
    };

    const handlePayment = (hoa_don_id, hoa_don) => {
        console.log(hoa_don_id, hoa_don)
        history.push(`/luyen-tap/thanh-toan/${hoa_don_id}/${hoa_don.hoa_don_chi_tiet_id}`);
    };

    return (
        <>
            <Layout className="main-app">
                <Helmet>
                    <title>Danh sách khóa học của bạn</title>
                </Helmet>
                <Content className="app-content ">
                    <Statisic />
                    {renderReceipts()}
                </Content>
            </Layout>
        </>
    )
}

export default ReceiptUserPage;