import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import './css/payment.css';

// component
import { Row, Col, Button, Tabs, Form, Input, notification } from 'antd';
import Statisic from 'components/parts/statisic/Statisic';
import * as CurrencyFormat from 'react-currency-format';

// redux
import { useDispatch, useSelector } from 'react-redux';
import * as courseAction from '../../../../redux/actions/course';
import * as discountAction from '../../../../redux/actions/discount';
import * as descriptionCourseAction from '../../../../redux/actions/descriptionCourse';
import * as receiptAction from '../../../../redux/actions/receipt';
import * as dealerAction from '../../../../redux/actions/dealer';

const { TabPane } = Tabs;

const CartPage = (props) => {
    const idCourse = useParams().id;
    const history = useHistory();
    const [form] = Form.useForm();

    const dispatch = useDispatch();
    const [state, setState] = useState({
        chiet_khau: 0,
        code: '',
        idDealerDetail: 0
    });
    const course = useSelector(state => state.course.item.result);
    const description = useSelector(state => state.descriptionCourse.item.result);
    const discount = useSelector(state => state.discount.itemByCourse.result);

    useEffect(() => {
        dispatch(courseAction.getCourse({ id: idCourse }));
        dispatch(descriptionCourseAction.getDescriptionCourse({ id: idCourse }));
        dispatch(discountAction.getDiscountByCourse({ idCourse: idCourse }));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const payment = () => {
        const callback = (res) => {
            if (res.status === 200 && res.statusText === 'OK') {
                const callbackSub = (resSub) => {
                    if (resSub.status ==='success') {
                        history.push(`/luyen-tap/thanh-toan/${resSub.data.hoa_don_id}/${resSub.data.hoa_don_chi_tiet_id}`)
                    }
                }

                const data = {
                    "trang_thai_su_dung": 2,
                    "chiet_khau_ma": state.code
                }
                
                dispatch(dealerAction.EditDealerDetail({ id: state.idDealerDetail, formData: data }))

                const receiptDetail = {
                    so_luong: 1,
                    chiet_khau_ma: state.code,
                    "tong_tien": (description.status === 'success' && discount.status === 'success' && description.data && discount.data) ?
                        Math.ceil((description.data.gia_goc - (description.data.gia_goc * discount.data.muc_giam_gia / 100) - (description.data.gia_goc * state.chiet_khau / 100)) / 100) * 100 
                        : Math.ceil((description.data.gia_goc - (description.data.gia_goc * state.chiet_khau / 100)) / 100) * 100 ,
                    "san_pham_id": idCourse,
                    "hoa_don_id": res.data.data.hoa_don_id,
                    "loai_san_pham": 'Khóa học'
                }
                dispatch(receiptAction.CreateRECEIPTDetail(receiptDetail, callbackSub));     
            }
        };

        dispatch(receiptAction.CreateRECEIPT({}, callback));
    }

    const checkCode = (values) => {
        const callback = (res) => {
            if (res.status === 200 && res.statusText === 'OK') {
                setState({...state, chiet_khau: res.data.data.chiet_khau_sv, code: values.chiet_khau_ma, idDealerDetail: res.data.data.chiet_khau_chi_tiet_id });
            } else {
                notification.error({
                    message: 'Thông báo',
                    description: 'Mã không tồn tại hoặc đã được sử dụng', 
                })
            }
        };

        if (values.chiet_khau_ma !== undefined) {
            dispatch(dealerAction.checkCode({ code: values.chiet_khau_ma, idCourse: idCourse }, callback));
            
        }
    };

    return (
        <>
            <Row className="wraper wraper-list-course-cate-index" style={{marginTop: '10px'}}>
                <Statisic />
                <div className="payment">
                    <h1 className="payment-title">Xem &amp; Thanh toán</h1>
                    <Row gutter={24}>
                        <Col span={16} className="payment__mobile">
                            <div className="header-payment">
                                Sản phẩm / Tùy chọn
                            </div>
                            <Row className="body-payment">
                                <Col span={18} className="title-payment__mobile">
                                    {course.status === 'success' && course.data.ten_khoa_hoc}
                                </Col>
                                <Col span={6}>
                                    {description.status === 'success' && 
                                        <CurrencyFormat style={{color: 'red'}}
                                            value={description.data.gia_goc !== null ? description.data.gia_goc : 0} 
                                            displayType={'text'} thousandSeparator={true} suffix={'VNĐ'}
                                        />
                                    }
                                </Col>
                            </Row>
                            <Tabs defaultActiveKey="1">
                                <TabPane tab="Áp dụng mã chiết khấu" key="1">
                                    <Form layout="vertical" className="category-form" form={form} autoComplete="off" onFinish={checkCode}>
                                        <Form.Item 
                                            className="input-col"
                                            name="chiet_khau_ma"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Mã khuyễn mãi là trường bắt buộc.',
                                                },
                                            ]}
                                            >
                                                <Input placeholder="Nhập mã khuyến mãi của bạn nếu có"/>
                                        </Form.Item>
                                        <Form.Item className="button-col">
                                            <Button type="primary" htmlType="submit" size='large' style={{width: '100%'}}>Áp dụng mã</Button>  
                                        </Form.Item>
                                    </Form>
                                </TabPane>
                            </Tabs>
                        </Col>
                        <Col span={8} className="payment__mobile" style={{marginBottom: '100px'}}>
                            <div className="detail-payment">
                                Chi tiết đơn hàng
                            </div>    
                            <Row justify="center" style={{background: '#ece9e9'}}>
                                <Col span={12} className='detail-label'> 
                                    <span>Giá gốc</span>
                                    <span>Chiết khấu</span>
                                    <span style={{borderBottom: 'solid 2px red'}}>Giảm giá</span>
                                    <span>Còn lại</span>
                                </Col>
                                <Col span={12} className='detail-value'>
                                    {description.status === 'success' && 
                                        <>
                                            <CurrencyFormat  // giá gốc
                                                value={description.data.gia_goc !== null ? description.data.gia_goc : 0} 
                                                displayType={'text'} thousandSeparator={true} suffix={'VNĐ'}
                                            />
                                            <CurrencyFormat  // chiết khấu
                                                value={description.data.gia_goc !== null ? (description.data.gia_goc * state.chiet_khau / 100) : state.chiet_khau} 
                                                displayType={'text'} thousandSeparator={true} suffix={'VNĐ'}
                                            />
                                        </>
                                    }
                                    {(description.status === 'success' && discount.status === 'success' && description.data && discount.data) ?
                                        <>
                                            <CurrencyFormat  // Giảm giá
                                                value={(description.data.gia_goc !== null && discount.data.muc_giam_gia !== null ) ? (description.data.gia_goc * discount.data.muc_giam_gia / 100) : 0} 
                                                displayType={'text'} thousandSeparator={true} suffix={'VNĐ'} style={{borderBottom: 'solid 2px red'}}
                                            />
                                            <CurrencyFormat  // Còn lại
                                                value={(description.data.gia_goc !== null && discount.data.muc_giam_gia !== null ) ? Math.ceil((description.data.gia_goc - (description.data.gia_goc * discount.data.muc_giam_gia / 100) - (description.data.gia_goc * state.chiet_khau / 100)) / 100) * 100 : description.data.gia_goc} 
                                                displayType={'text'} thousandSeparator={true} suffix={'VNĐ'}
                                            />
                                        </>
                                    :
                                    (description.status === 'success' && description.data ) ?
                                        <>
                                            <span style={{borderBottom: 'solid 2px red'}}>0VNĐ</span>
                                            <CurrencyFormat  // Còn lại
                                                value={(description.data.gia_goc !== null) && Math.ceil((description.data.gia_goc - (description.data.gia_goc * state.chiet_khau / 100)) / 100) * 100} 
                                                displayType={'text'} thousandSeparator={true} suffix={'VNĐ'}
                                            />
                                        </> 
                                    :
                                        <>
                                            <span style={{borderBottom: 'solid 2px red'}}>0VNĐ</span>
                                            <span>0 VNĐ</span> 
                                        </> 
                                    }
                                    
                                </Col>
                                <div className="detail-footer">
                                    <Button type="primary" danger size='large' onClick={() => payment()}>Thanh toán</Button>
                                    <Link to={'/luyen-tap/trang-chu'}>Tiếp tục mua khóa học</Link>
                                </div>
                            </Row>   
                        </Col>
                    </Row>
                </div>
            </Row>
        </>
    )
}

export default CartPage;