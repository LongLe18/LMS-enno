import React, { useEffect } from "react";

// helper
import moment from "moment";
import config from '../../../../configs/index';

// component
import { Table, Tag, Space, Button, notification, Modal } from 'antd';
import { SwapOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import * as CurrencyFormat from 'react-currency-format';

// redux
import * as receiptAction from '../../../../redux/actions/receipt';
import { useSelector, useDispatch } from "react-redux";


const ReceiptPage = (props) => {
    const dispatch = useDispatch();

    const receipts = useSelector(state => state.receipt.list.result);
    const receiptsDetail = useSelector(state => state.receipt.listDetail.result);

    useEffect(() => {
        dispatch(receiptAction.getRECEIPTs());
        dispatch(receiptAction.getRECEIPTsDetail({ idType: '' }));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (receipts.status === 'success' && receiptsDetail.status === 'success') {
        receiptsDetail.data.map((item, index) => {
          receipts.data.map((receipt, index2) => {
              if (item.hoa_don_id === receipt.hoa_don_id) {
                  item.ten_nhan_vien = receipt.ten_nhan_vien;
                  item.hoa_don_ma = receipt.hoa_don_ma;
                  item.ten_hoc_vien = receipt.ten_hoc_vien;
                  item.trang_thai = receipt.trang_thai;
                  item.ngay_lap = receipt.ngay_lap;
                  item.key = index;
              }
              return null;
          })
          return null;
      });
    }
    
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
          title: 'Tên nhân viên',
          dataIndex: 'ten_nhan_vien',
          key: 'ten_nhan_vien',
          responsive: ['md'],
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'ten_san_pham',
            key: 'ten_san_pham',
            responsive: ['md'],
        },
        {
            title: 'Trạng thái',
            dataIndex: 'trang_thai',
            key: 'trang_thai',
            responsive: ['md'],
            render: (trang_thai) => (
                <Tag color={trang_thai === 1 ? 'green' : 'red'} key={trang_thai}>
                    {trang_thai === 1 ? "Đã xử lý" : "Chưa xử lý"}
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
              <Button  type="button" onClick={() => handleEdit(hoa_don_id, hoa_don)} className="ant-btn ant-btn-round ant-btn-primary" icon={<SwapOutlined />}></Button>
              <Button  type="button" onClick={() => handleDelete(hoa_don_id)} danger className="ant-btn ant-btn-round ant-btn-primary">Xóa</Button>
            </Space>
          ),
        },
    ];

    const handleDelete = (hoa_don_id) => {
      Modal.confirm({
        icon: <ExclamationCircleOutlined />,
        content: 'Bạn có chắc chăn muốn xóa hóa đơn này?',
        okText: 'Đồng ý',
        cancelText: 'Hủy',
        onOk() {
          const callback = (res) => {
            if (res.statusText === 'OK' && res.status === 200) {
                dispatch(receiptAction.getRECEIPTs());
                dispatch(receiptAction.getRECEIPTsDetail({ idType: '' }));
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
          dispatch(receiptAction.DeleteRECEIPTDetail({ id: hoa_don_id }, callback))
        },
      });
    };

    const handleEdit = (hoa_don_id, hoa_don) => {
      const callback = (res) => {
        if (res.status === 200 && res.statusText === 'OK') {
          dispatch(receiptAction.getRECEIPTs());
          dispatch(receiptAction.getRECEIPTsDetail({ idType: '' }));
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

    return (
        <>
            <div className="content">
                {(receipts.status === 'success' && receiptsDetail.status === 'success') && 
                    <Table className="table-striped-rows" columns={columns} dataSource={receiptsDetail.data} />
                }
            </div>
        </>
    )
}

export default ReceiptPage;