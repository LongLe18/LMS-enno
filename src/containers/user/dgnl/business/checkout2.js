import React from "react";
import { Helmet } from 'react-helmet';
import { Link } from "react-router-dom";

// Component
import { Layout, Result, Button } from "antd";
import Statisic from "components/parts/statisic/Statisic";

const { Content } = Layout;

const CheckOutPage2 = (props) => {
    const alertPayment = () => {
        return (
            <div className="wraper paymentUser">
                <Result
                    status={'success'}
                    title={'Xác nhận đơn hàng.'}
                    subTitle={<h5>Đơn hàng thanh toán của bạn đã được ghi nhận. Chúng tôi sẽ xử lý trong thời gian sớm nhất</h5>}
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

export default CheckOutPage2;