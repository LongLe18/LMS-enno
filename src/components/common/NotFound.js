// import external libs
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Result, Layout, Row, Col, Button } from 'antd';

const { Content } = Layout;

function NotFound() {
  return (
    <Layout className="app-auth">
            <Content>
                <Row>
                    <Col xs={{ span: 22, offset: 1 }} lg={{ span: 6, offset: 9 }}>
                    <Result
                      status="404"
                      title="404"
                      subTitle="Bạn không có quyền truy cập vào trang này hoặc Chúng tôi không tìm thấy trang bạn cần!"
                      extra={
                        <Link to="/auth/hocvien">
                          <Button type="primary">Đăng nhập</Button>
                        </Link>
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

export default connect(mapStateToProps)(NotFound);
