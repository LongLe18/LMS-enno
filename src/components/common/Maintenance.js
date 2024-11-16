// import external libs
import React from 'react';
import { connect } from 'react-redux';
import { Layout, Result, Row, Col } from 'antd';

const { Content } = Layout;

function Maintainance() {
  return (
    <Layout className="app-auth">
        <Content>
            <Row>
                <Col xs={{ span: 22, offset: 1 }} lg={{ span: 6, offset: 9 }}>
                <Result 
                    status="warning"
                    title="HỆ THỐNG ĐANG BẢO TRÌ"
                    subTitle={
                      <div>
                        <span style={{fontWeight: 700, fontSize: 18}}>Hệ thống chúng tôi đang bảo trì. Bạn hãy quay lại sau ít phút.</span>
                        <br/>
                        <span style={{fontWeight: 700, fontSize: 18}}>— Công ty CPĐT Giáo dục và Chuyển giao công nghệ Tri Thức Việt</span>
                        <br/>
                        <span style={{fontWeight: 700, fontSize: 18}}>— Hotline: 0968.95.86.80</span>
                      </div>
                    }
                />
                </Col>
            </Row>
        </Content>
    </Layout>

  );
}

const mapStateToProps = (state) => {
  return {
    config: state.config,
  };
};

export default connect(mapStateToProps)(Maintainance);
