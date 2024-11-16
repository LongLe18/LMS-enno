import React, { useState, useEffect } from "react";
import { Helmet } from 'react-helmet';
import { Link } from "react-router-dom";
import './css/checkout.css';
import moment from 'moment';
import config from '../../../../configs/index';

// Component
import { Layout, Result, Button } from "antd";
import Statisic from "components/parts/statisic/Statisic";
import * as CurrencyFormat from 'react-currency-format';

// redux
import { useSelector, useDispatch } from 'react-redux';
import * as receiptAction from '../../../../redux/actions/receipt';

const { Content } = Layout;

const CheckOutPage = (props) => {
    const [state, setState] = useState(false);
    const dispatch = useDispatch();

    const receiptDetailUser = useSelector(state => state.receipt.itemDetail.result);
    useEffect(() => {
        dispatch(receiptAction.getRECEIPTDetailUser({ code: window.location.href.split('=')[1] }))
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    

    const subTitle = () => {
        return (
            <div className="subTitle">
                {receiptDetailUser.status === 'success' && 
                    <>
                        <p>Mã hóa đơn của bạn là <strong>{receiptDetailUser.data.hoa_don_ma}</strong></p>
                        <CurrencyFormat 
                            value={receiptDetailUser.data.tong_tien}  style={{fontSize: '24px'}}
                            displayType={'text'} thousandSeparator={true} suffix={'VNĐ'}
                        />
                        
                        {!state && <p>Bạn có thể xem chi tiết trong <Button onClick={() => setState(!state)} style={{background: 'transparent', border: 'none', padding: 0}}   type="default"><span>hóa đơn của tôi</span></Button></p>}
                        {state && 
                            <>
                                <p style={{borderBottom: 'dashed 1px grey', paddingBottom: '10px'}}>Bạn có thể xem chi tiết trong <Button onClick={() => setState(!state)} style={{background: 'transparent', border: 'none', padding: 0}}   type="default"><span>hóa đơn của tôi</span></Button></p>
                                <div className="receiptDetail">
                                    <h3>Chi tiết hóa đơn</h3>
                                    <div>
                                        <label className="row">
                                            <strong className="left">Mã hóa đơn: </strong>
                                            <span className="className">#{receiptDetailUser.data.hoa_don_ma}</span>
                                        </label>
                                        <label className="row">
                                            <strong className="left">Tên khách hàng: </strong>
                                            <span className="className">{receiptDetailUser.data.ten_nguoi_mua}</span>
                                        </label>
                                        <label className="row">
                                            <strong className="left">Loại sản phẩm: </strong>
                                            <span className="right">{receiptDetailUser.data.loai_san_pham}</span>
                                        </label>
                                        <label className="row">
                                            <strong className="left">Tên sản phẩm: </strong>
                                            <span className="right">{receiptDetailUser.data.ten_san_pham}</span>
                                        </label>
                                        <label className="row">
                                            <strong className="left">Ngày tạo: </strong>
                                            <span className="right">{moment(receiptDetailUser.data.ngay_tao).format(config.DATE_FORMAT)}</span>
                                        </label>
                                        <label className="row">
                                            <strong className="left">Số tiền: </strong>
                                            <CurrencyFormat  // giá gốc
                                                value={receiptDetailUser.data.tong_tien } className="right"
                                                displayType={'text'} thousandSeparator={true} suffix={'VNĐ'}
                                            />
                                        </label>
                                    </div>
                                </div>
                            </>
                        }
                    </>
                }
            </div>
        )
    }
    const alertPayment = () => {
        return (
            <div className="wraper paymentUser">
                <Result
                    status={'success'}
                    title={'Thanh toán thành công.'}
                    subTitle={subTitle()}
                    extra={
                        <Button type="primary">
                            <Link to="/luyen-tap/trang-chu">Tiếp tục mua khóa học</Link>
                        </Button>
                    }
                />
            </div>
        )
    };

    return (
        <>
            <Layout className="main-app">
                <Helmet>
                    <title>Thanh toán</title>
                </Helmet>
                <Content className="app-content ">
                    <Statisic />
                    {alertPayment()}
                </Content>
            </Layout>
        </>
    )
};

export default CheckOutPage;