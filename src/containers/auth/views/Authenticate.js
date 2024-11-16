import { Layout, Row, Col } from 'antd';

const { Content } = Layout;
const background = '/assets/img/auth_bg.jpg';

const Auth = (props) => {
    return (
        <Layout className="app-auth"
            style={{
                background: background
            }}
        >
            <Content>
                <Row>
                    <Col xs={{ span: 22, offset: 1 }} lg={{ span: 6, offset: 9 }}>
                        {props.children}
                    </Col>
                </Row>
            </Content>
        </Layout>
    )
}

export default Auth;