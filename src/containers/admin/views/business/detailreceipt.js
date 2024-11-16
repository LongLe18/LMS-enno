import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

// helper
import moment from "moment";
import config from '../../../../configs/index';

// component
import { Table, Col, Row } from 'antd';
import * as CurrencyFormat from 'react-currency-format';
import AppFilter from "components/common/AppFilter";

// redux
import * as receiptAction from '../../../../redux/actions/receipt';
import { useSelector, useDispatch } from "react-redux";

const DetailReceiptPage = (props) => {
    const id = useParams().id;
    const data = [];
    const dispatch = useDispatch();

    const receiptDetail = useSelector(state => state.receipt.item.result);

    useEffect(() => {
        dispatch(receiptAction.getRECEIPT({ id: id }));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (receiptDetail.status === 'success') {
        receiptDetail.data.map((item, index) => {
            data.push({ ...item, key: index });
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
            title: 'Tên sản phẩm',
            dataIndex: 'ten_khoa_hoc',
            key: 'ten_khoa_hoc',
            responsive: ['md'],
        },
        {
            title: 'Loại sản phẩm',
            dataIndex: 'loai_san_pham',
            key: 'loai_san_pham',
            responsive: ['md'],
        },
        {
            title: 'Mã chiết khấu',
            dataIndex: 'chiet_khau_ma',
            key: 'chiet_khau_ma',
            responsive: ['md'],
        },
        {
            title: 'Số lượng',
            dataIndex: 'so_luong',
            key: 'so_luong',
            responsive: ['md'],
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
    ];

    return (
        <>
            <div className="content">
                <Col xl={24} className="body-content">
                    <Row className="app-main">
                        <Col xl={24} sm={24} xs={24}>
                            <AppFilter
                                title="Quản lý chi tiết hóa đơn"
                                buttonBack={true} linkBack={'/admin/business/receipt'}
                                isShowStatus={false}
                                isShowSearchBox={false}
                                isShowDatePicker={false}
                                isRangeDatePicker={false}
                            />
                        </Col>
                    </Row>
                </Col>
                {(data.length > 0) && 
                    <Table className="table-striped-rows" columns={columns} dataSource={data} />
                }
            </div>
        </>
    )
}

export default DetailReceiptPage;