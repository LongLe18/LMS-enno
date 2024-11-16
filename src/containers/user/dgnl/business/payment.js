import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import config from '../../../../configs/index';
import './css/payment.css';

// image
import vnpayImage from 'assets/img/vnpay.png';
import bankImage from 'assets/img/bank.png';

// component
import { Row, Col, Card, Radio, Button } from "antd";
import Statisic from "components/parts/statisic/Statisic";
import NoRecord from "components/common/NoRecord";
import * as CurrencyFormat from 'react-currency-format';

// redux
import { useDispatch, useSelector } from 'react-redux';
import * as receiptAction from '../../../../redux/actions/receipt';
import * as bankAction from '../../../../redux/actions/bank';
import axios from "axios";

const PaymentPage = (props) => {
    const params = useParams();
    const dispatch = useDispatch();
    const history = useHistory();

    const receipt = useSelector(state => state.receipt.item.result);
    const receiptDetail = useSelector(state => state.receipt.itemDetail.result);
    const banks = useSelector(state => state.bank.list.result);

    const [state, setState] = useState({
        confirm: false,
        value: 1,
        infoBank: [],
    });

    useEffect(() => {
        
        dispatch(receiptAction.getRECEIPT({ id: params.idReceipt }));
        dispatch(receiptAction.getRECEIPTDetail({ id: params.idReceiptDetail }));
        dispatch(bankAction.getBANKs({}, (res) => {
            if (res.status === 'success') {
                setState({...state, infoBank: res.data[0]});
            }
        }));
        // call get ip user
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    
    const onChange = (e) => {
        setState({...state, value: e.target.value});
        if (e.target.value !== 1) {
            setState({...state, confirm: false, value: e.target.value});
        }
    };

    const onConfirmMethod = () => {
        if (state.value === 1) {
            setState({...state, confirm: true});
            history.push(`/luyen-tap/hoa-don/checkout2/${receipt.data[0].hoa_don_ma}`);
        } else { // Các phương pháp khác
            if (state.value === 3) { // vnp 
                let params = {
                    amount: receiptDetail.data.tong_tien,
                    language: 'vn',
                    "orderInfo": "Thanh toán hóa đơn " + receipt.data[0].hoa_don_ma
                }
                axios.post(`${config.API_URL}/payment/vnpay_create`, params)
                    .then(res => {
                        if (res.status === 200 && res.statusText === 'OK')
                            window.location.href = res.data.url;
                    }) 
                    .catch(error => {
                        console.log(error)
                    })
            }
        }
    };

    const changeBank = (e, value) => {
        document.getElementsByClassName('active')[0].classList.remove('active');
        e.currentTarget.classList.add('active');
        dispatch(bankAction.getBANK({ id: value }, (res) => {
            if (res.status === 'success') {
                setState({ ...state, infoBank: res.data })
            }
        }))
    };


    return (
        <>
            {receipt.status === 'success' && receiptDetail.status === 'success'?
                <Row className="wraper wraper-list-course-cate-index" style={{marginTop: '10px'}}>
                    <Statisic />
                    <Col xl={24} xs={24} className="receipt">
                        <Card title="Thanh toán khóa học" bordered={false} className="content-receipt">
                            <div className="receipt-detail">
                                <Card style={{ width: '100%', background: '#f3f3f3', margin: '0 10px 10px', borderRadius: '4px' }}>
                                    <div style={{textAlign: 'left'}}>
                                        <p style={{textTransform: 'uppercase', fontSize: '16px'}}>Đơn hàng: #{receipt.data[0].hoa_don_ma}</p>
                                        <ul style={{fontSize: '16px'}}>
                                            <li>
                                                <strong>Tên học viên: </strong>{receipt.data[0].ten_hoc_vien}
                                            </li>
                                            <li>
                                                <strong>Tên sản phẩm: </strong>{receipt.data[0].ten_khoa_hoc}
                                            </li>
                                            <li>
                                                <strong>Tổng tiền: </strong>
                                                <CurrencyFormat  // giá gốc
                                                    value={receiptDetail.data.tong_tien } style={{color: 'red'}}
                                                    displayType={'text'} thousandSeparator={true} suffix={'VNĐ'}
                                                />
                                            </li>
                                        </ul>
                                    </div>
                                </Card>
                            </div>
                            <div className="receipt-method-payment">
                                <h4 style={{textTransform: "none"}}>Chọn hình thức thanh toán:</h4>
                                {(state.value === 1) &&
                                    <>
                                        <ul style={{textAlign: 'left'}}>
                                            <li>Hình thức thanh toán: <strong>Chuyển khoản ngân hàng</strong></li>
                                        </ul>
                                        {(banks.status === 'success' && banks.data.length > 0) &&
                                            <div className="companypaymentinfo__content">
                                                <div className="company-logo">
                                                <img src={require(`assets/img/bank/${banks.data[0].ten_ngan_hang}.png`).default} alt={banks.data[0].ten_ngan_hang} className="methodLogo active" onClick={(event) => changeBank(event, banks.data[0].tai_khoan_bank_id)}/>
                                                {banks.data.map((bank, index) => {
                                                    if (index > 0)
                                                        return <img key={index} src={require(`assets/img/bank/${bank.ten_ngan_hang}.png`).default} alt={bank.ten_ngan_hang} className="methodLogo" onClick={(event) => changeBank(event, bank.tai_khoan_bank_id)}/>
                                                    else return null;
                                                })}
                                                    
                                                </div>
                                                <div>
                                                    <label className="row">
                                                        <strong className="left">Ngân hàng: </strong>
                                                        <span className="right">{state.infoBank.ten_ngan_hang}</span>
                                                    </label>
                                                    <label className="row">
                                                        <strong className="left">Số tài khoản: </strong>
                                                        <span className="right"> {state.infoBank.so_tai_khoan}</span>
                                                    </label>
                                                    <label className="row">
                                                        <strong className="left">Thụ hưởng: </strong>
                                                        <span className="right">{state.infoBank.ten_dvth}</span>
                                                    </label>
                                                    <label className="row">
                                                        <strong className="left">Chi nhánh: </strong>
                                                        <span className="right">{state.infoBank.chi_nhanh}</span>
                                                    </label>
                                                    <label className="row">
                                                        <strong className="left">Nội dung CK: </strong>
                                                        <span className="right">Thanh toán #{receipt.data[0].hoa_don_ma}</span>
                                                    </label>
                                                    <label className="row">
                                                        <strong className="left">Số tiền: </strong>
                                                        <CurrencyFormat  // giá gốc
                                                            value={receiptDetail.data.tong_tien } className="right"
                                                            displayType={'text'} thousandSeparator={true} suffix={'VNĐ'}
                                                        />
                                                    </label>
                                                </div>
                                            </div>
                                        }
                                        <ul style={{textAlign: 'left'}}>
                                            <li>Hình thức thanh toán khác:</li>
                                        </ul>
                                    </>
                                }
                                <Radio.Group onChange={onChange} value={state.value} className="options-payment">
                                    <Radio className="option-payment" value={1}>
                                        <img src={bankImage} alt='bank'/> Chuyển khoản ngân hàng
                                    </Radio>
                                    <Radio className="option-payment" value={3}>
                                        <img src={vnpayImage} alt='vnpay'/>
                                        Qua VNPAY-QR
                                    </Radio>
                                </Radio.Group>
                            </div>
                            <Button type="primary" className="confirm-option" onClick={() => onConfirmMethod()}>Xác nhận</Button>
                        </Card>
                    </Col>
                </Row>
            : <NoRecord />}
        </>
    )
}

export default PaymentPage;